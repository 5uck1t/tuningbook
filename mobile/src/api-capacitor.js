// Android version of `window.api`: the shared Supabase api (web/src/cloud.js), plus the phone's
// own features through Capacitor plugins — camera / gallery, the share sheet for garage files,
// Android printing for PDFs, the back button — and reading the garage this phone stored
// locally before the app went online. Bundled by esbuild into www/api-capacitor.js.
import { registerPlugin } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { cloudApi, reportHtml } from '../../web/src/cloud.js';

const PdfPrinter = registerPlugin('PdfPrinter');

// Where older versions kept the garage on the phone.
const DIR = Directory.Data;
const LIB = 'library';
const IMAGES = `${LIB}/images`;
const DATA = `${LIB}/data.json`;
const SAFE_NAME = /^[a-f0-9-]{36}(\.p)?\.[a-z0-9]{2,5}$/;

// ---------- helpers ----------

function bytesToBase64(bytes) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let out = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < u8.length; i += CHUNK) out += String.fromCharCode.apply(null, u8.subarray(i, i + CHUNK));
  return btoa(out);
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Large files go over the native bridge in pieces to keep memory use reasonable.
async function writeBytes(path, bytes, directory) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const CHUNK = 3 * 1024 * 1024; // multiple of 3 so each chunk is valid base64 on its own
  await Filesystem.writeFile({ path, directory, data: bytesToBase64(u8.subarray(0, CHUNK)), recursive: true });
  for (let i = CHUNK; i < u8.length; i += CHUNK) {
    await Filesystem.appendFile({ path, directory, data: bytesToBase64(u8.subarray(i, i + CHUNK)) });
  }
}

// A photo from the camera / gallery (a webPath the WebView can fetch) as a File for the uploader.
async function toFile(webPath, format) {
  const blob = await (await fetch(webPath)).blob();
  const ext = (format || 'jpg').toLowerCase().replace('jpeg', 'jpg');
  return new File([blob], `photo.${/^[a-z0-9]{2,5}$/.test(ext) ? ext : 'jpg'}`, { type: blob.type || 'image/jpeg' });
}

// Small bottom sheet: "Take photo" / "Choose from gallery".
function chooseSource(title) {
  return new Promise((resolve) => {
    const el = document.createElement('div');
    el.className = 'sheet-backdrop';
    el.innerHTML = `
      <div class="sheet">
        <h3></h3>
        <button data-src="camera"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>Take photo</button>
        <button data-src="gallery"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>Choose from gallery</button>
      </div>`;
    el.querySelector('h3').textContent = title || 'Add photos';
    const done = (v) => { el.remove(); window.__tbCloseSheet = null; resolve(v); };
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-src]');
      if (b) done(b.dataset.src);
      else if (e.target === el) done(null);
    });
    window.__tbCloseSheet = () => done(null);
    document.body.appendChild(el);
  });
}

// ---------- window.api ----------

window.api = {
  ...cloudApi,
  platform: 'android',

  // Camera or gallery → compressed and uploaded by the shared code.
  async pickImages(title, kind = 'photo') {
    const source = await chooseSource(title);
    if (!source) return [];
    let files;
    try {
      if (source === 'camera') {
        const photo = await Camera.getPhoto({
          source: CameraSource.Camera, resultType: CameraResultType.Uri,
          quality: 90, correctOrientation: true, saveToGallery: false,
        });
        files = [await toFile(photo.webPath, photo.format)];
      } else {
        const { photos } = await Camera.pickImages({ quality: 90, correctOrientation: true, limit: 0 });
        files = [];
        for (const p of photos) files.push(await toFile(p.webPath, p.format));
      }
    } catch (err) {
      if (/cancel/i.test(String(err?.message || err))) return [];
      throw err;
    }
    return cloudApi.importImages(files, kind);
  },

  importImages: async () => [], // no drag & drop on a phone

  async saveBackup(fileName, bytes) {
    const path = fileName.replace(/[^\w .-]+/g, '');
    await writeBytes(path, bytes, Directory.Cache);
    const { uri } = await Filesystem.getUri({ path, directory: Directory.Cache });
    try {
      await Share.share({ title: 'TuningBook garage', files: [uri], dialogTitle: 'Save or send garage file' });
    } catch (err) {
      if (/cancel/i.test(String(err?.message || err))) return { ok: false };
      throw err;
    }
    return { ok: true, message: 'Garage file ready' };
  },

  async exportPdf(opts) {
    const report = await reportHtml(opts);
    if (!report) return { ok: false };
    await PdfPrinter.print({ html: report.html, name: report.name });
    return { ok: true, message: 'Choose “Save as PDF” to save it' };
  },

  openLink: (url) => (/^https?:\/\//i.test(url) ? Browser.open({ url }) : undefined),

  localGarage: {
    async read() {
      try {
        const { data } = await Filesystem.readFile({ path: DATA, directory: DIR, encoding: 'utf8' });
        const parsed = JSON.parse(data);
        return Array.isArray(parsed.cars) && parsed.cars.length ? parsed : null;
      } catch {
        return null;
      }
    },
    async readImage(name) {
      if (!SAFE_NAME.test(name)) return null;
      try {
        const { data } = await Filesystem.readFile({ path: `${IMAGES}/${name}`, directory: DIR });
        return base64ToBytes(data);
      } catch {
        return null;
      }
    },
    // Frees the space once uploaded (the small daily JSON backups stay).
    async remove() {
      await Filesystem.rmdir({ path: IMAGES, directory: DIR, recursive: true }).catch(() => {});
      await Filesystem.deleteFile({ path: DATA, directory: DIR }).catch(() => {});
    },
  },
};

// Android back button: close the top-most overlay, then go back to the garage, then leave the app.
App.addListener('backButton', () => {
  if (window.__tbCloseSheet) { window.__tbCloseSheet(); return; }
  const hasOverlay = document.querySelector('.lightbox') || (typeof state !== 'undefined' && state.modals.length);
  if (hasOverlay) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  } else if (typeof state !== 'undefined' && state.view?.name === 'car') {
    actions['go-garage']();
  } else {
    App.minimizeApp();
  }
});
