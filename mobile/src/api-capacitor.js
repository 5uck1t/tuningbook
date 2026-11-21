// Android implementation of `window.api` — the same interface the Electron preload exposes,
// backed by Capacitor plugins. Bundled by esbuild into www/api-capacitor.js.
import { Capacitor, registerPlugin } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { buildReportHtml } from '../../src/report.js';

const PdfPrinter = registerPlugin('PdfPrinter');

const DIR = Directory.Data;
const LIB = 'library';
const IMAGES = `${LIB}/images`;
const DATA = `${LIB}/data.json`;
const SAFE_NAME = /^[a-f0-9-]{36}(\.p)?\.[a-z0-9]{2,5}$/;
const EMPTY_DB = { version: 1, settings: { currency: 'EUR' }, cars: [] };

let db = structuredClone(EMPTY_DB);
let imagesFileRoot = ''; // file:///data/user/0/…/files/library/images (for the PDF WebView)
let saveChain = Promise.resolve();

// ---------- helpers ----------

const checkName = (name) => {
  if (!SAFE_NAME.test(name)) throw new Error('Invalid image name: ' + name);
  return name;
};

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
async function writeBytes(path, bytes, directory = DIR) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const CHUNK = 3 * 1024 * 1024; // multiple of 3 so each chunk is valid base64 on its own
  await Filesystem.writeFile({ path, directory, data: bytesToBase64(u8.subarray(0, CHUNK)), recursive: true });
  for (let i = CHUNK; i < u8.length; i += CHUNK) {
    await Filesystem.appendFile({ path, directory, data: bytesToBase64(u8.subarray(i, i + CHUNK)) });
  }
}

async function exists(path) {
  try { await Filesystem.stat({ path, directory: DIR }); return true; } catch { return false; }
}

function referenced(data) {
  const set = new Set();
  const add = (img) => { if (img?.file) set.add(img.file); if (img?.preview) set.add(img.preview); };
  for (const car of data.cars || []) {
    add(car.cover);
    for (const m of car.mods || []) { (m.photos || []).forEach(add); (m.receipts || []).forEach(add); }
  }
  return set;
}

// Images imported but never saved (cancelled forms, deleted mods/cars) are removed on startup.
async function cleanupOrphans() {
  const used = referenced(db);
  const { files } = await Filesystem.readdir({ path: IMAGES, directory: DIR });
  for (const f of files) {
    if (SAFE_NAME.test(f.name) && !used.has(f.name)) {
      await Filesystem.deleteFile({ path: `${IMAGES}/${f.name}`, directory: DIR }).catch(() => {});
    }
  }
}

async function importPhoto(webPath, format) {
  const blob = await (await fetch(webPath)).blob();
  let ext = (format || blob.type.split('/')[1] || 'jpg').toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (!/^[a-z0-9]{2,5}$/.test(ext)) ext = 'jpg';
  const name = `${crypto.randomUUID()}.${ext}`;
  await writeBytes(`${IMAGES}/${name}`, new Uint8Array(await blob.arrayBuffer()));
  return { file: name, preview: null, originalName: name };
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
  platform: 'android',

  async load() {
    await Filesystem.mkdir({ path: IMAGES, directory: DIR, recursive: true }).catch(() => {});
    // Finish a save that was interrupted between writing the temp file and renaming it.
    if (!(await exists(DATA)) && (await exists(`${DATA}.tmp`))) {
      await Filesystem.rename({ from: `${DATA}.tmp`, to: DATA, directory: DIR }).catch(() => {});
    }
    if (await exists(DATA)) {
      try {
        const { data } = await Filesystem.readFile({ path: DATA, directory: DIR, encoding: 'utf8' });
        const parsed = JSON.parse(data);
        db = { ...EMPTY_DB, ...parsed, settings: { ...EMPTY_DB.settings, ...(parsed.settings || {}) }, cars: Array.isArray(parsed.cars) ? parsed.cars : [] };
        await cleanupOrphans().catch(() => {});
        // One automatic copy per day, last 30 kept.
        const day = new Date().toLocaleDateString('en-CA');
        const backup = `${LIB}/backups/data-${day}.json`;
        if (!(await exists(backup))) {
          await Filesystem.writeFile({ path: backup, directory: DIR, data, encoding: 'utf8', recursive: true });
          const { files } = await Filesystem.readdir({ path: `${LIB}/backups`, directory: DIR });
          const auto = files.map((f) => f.name).filter((n) => /^data-\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort();
          for (const old of auto.slice(0, Math.max(0, auto.length - 30))) {
            await Filesystem.deleteFile({ path: `${LIB}/backups/${old}`, directory: DIR }).catch(() => {});
          }
        }
      } catch (err) {
        // Never silently lose data: keep the unreadable file aside.
        await Filesystem.rename({ from: DATA, to: `${DATA}.corrupt-${Date.now()}`, directory: DIR }).catch(() => {});
        console.error('Could not read data file', err);
      }
    }
    const { uri } = await Filesystem.getUri({ path: IMAGES, directory: DIR });
    imagesFileRoot = uri.replace(/\/?$/, '/');
    return { db, imagesUrl: Capacitor.convertFileSrc(imagesFileRoot) };
  },

  save(next) {
    db = next;
    const json = JSON.stringify(db, null, 2);
    saveChain = saveChain.then(async () => {
      const tmp = `${DATA}.tmp`;
      await Filesystem.writeFile({ path: tmp, directory: DIR, data: json, encoding: 'utf8', recursive: true });
      await Filesystem.deleteFile({ path: DATA, directory: DIR }).catch(() => {});
      await Filesystem.rename({ from: tmp, to: DATA, directory: DIR });
    });
    return saveChain;
  },

  async pickImages(title) {
    const source = await chooseSource(title);
    if (!source) return [];
    try {
      if (source === 'camera') {
        const photo = await Camera.getPhoto({
          source: CameraSource.Camera, resultType: CameraResultType.Uri,
          quality: 90, correctOrientation: true, saveToGallery: false,
        });
        return [await importPhoto(photo.webPath, photo.format)];
      }
      const { photos } = await Camera.pickImages({ quality: 90, correctOrientation: true, limit: 0 });
      const out = [];
      for (const p of photos) out.push(await importPhoto(p.webPath, p.format));
      return out;
    } catch (err) {
      if (/cancel/i.test(String(err?.message || err))) return [];
      throw err;
    }
  },

  importImages: async () => [], // drag & drop is desktop-only

  async readImage(file) {
    const { data } = await Filesystem.readFile({ path: `${IMAGES}/${checkName(file)}`, directory: DIR });
    return base64ToBytes(data).buffer;
  },

  async writeImage(file, bytes) {
    await writeBytes(`${IMAGES}/${checkName(file)}`, bytes);
  },

  async savePreview(file, buffer) {
    const name = checkName(file).replace(/\.[a-z0-9]+$/, '') + '.p.jpg';
    await writeBytes(`${IMAGES}/${name}`, new Uint8Array(buffer));
    return name;
  },

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

  async exportPdf({ carIds, includePhotos, includeReceipts }) {
    const cars = db.cars.filter((c) => carIds.includes(c.id));
    if (!cars.length) return { ok: false };
    const html = buildReportHtml({
      cars, currency: db.settings.currency, includePhotos, includeReceipts,
      imgUrl: (name) => imagesFileRoot + encodeURIComponent(name),
    });
    const name = cars.length === 1 ? `${cars[0].name} - TuningBook` : 'TuningBook - All cars';
    await PdfPrinter.print({ html, name: name.replace(/[\\/:*?"<>|]+/g, '') });
    return { ok: true, message: 'Choose “Save as PDF” to save it' };
  },

  openLink: (url) => (/^https?:\/\//i.test(url) ? Browser.open({ url }) : undefined),
  pathForFile: () => '',
};

// Android back button: close the top-most overlay, then go back to the garage, then leave the app.
App.addListener('backButton', () => {
  if (window.__tbCloseSheet) { window.__tbCloseSheet(); return; }
  const hasOverlay = document.querySelector('.lightbox') || (typeof state !== 'undefined' && state.modals.length);
  if (hasOverlay) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  } else if (typeof state !== 'undefined' && state.view.name === 'car') {
    actions['go-garage']();
  } else {
    App.minimizeApp();
  }
});
