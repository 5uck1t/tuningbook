// The Supabase-backed part of `window.api`, shared by all three versions of TuningBook:
// Postgres tables for the garage, a private bucket for photos, email/password login.
//   web/src/api-web.js            — website: uses it as-is
//   src/desktop/api-desktop.js    — Electron: adds native PDF saving, file dialogs
//   mobile/src/api-capacitor.js   — Android: adds camera, sharing, printing
// Each of those is bundled by esbuild into one file that sets `window.api`.
import { createClient } from '@supabase/supabase-js';
import { buildReportHtml } from '../../src/report.js';
import { SUPABASE_URL, SUPABASE_KEY, PHOTO_BUCKET } from './config.js';
import { compressImage } from './compress.js';
import { showAuth, showFatal } from './auth-ui.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

let recoveryMode = false;
supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') recoveryMode = true;
  if (event === 'SIGNED_OUT') location.reload();
});

const SAFE_NAME = /^[a-f0-9-]{36}(\.p)?\.[a-z0-9]{2,5}$/;
const SIGNED_URL_TTL = 60 * 60 * 24; // seconds
const ORPHAN_GRACE_MS = 24 * 60 * 60 * 1000; // never delete files younger than a day (another device may be mid-edit)
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

let user = null;
let snapshot = null; // last state known to be on the server: { cars, mods, plans, settings } as Maps of JSON
let saveChain = Promise.resolve();
const urls = new Map(); // image name -> displayable URL (object URL or signed URL)
const blobs = new Map(); // image name -> Blob, for images uploaded in this session
let signedAt = 0;

const photos = () => supabase.storage.from(PHOTO_BUCKET);
const pathOf = (name) => {
  if (!SAFE_NAME.test(name)) throw new Error('Invalid image name: ' + name);
  return `${user.id}/${name}`;
};
const say = (msg, ms) => (typeof toast === 'function' ? toast(msg, ms) : undefined); // app.js helper
const rerender = () => { if (typeof render === 'function' && typeof state !== 'undefined' && state.db) render(); };

// ---------- row <-> app model ----------

const nul = (v) => (v === '' || v === undefined ? null : v);

function toRows(db) {
  const cars = new Map();
  const mods = new Map();
  const plans = new Map();
  for (const c of db.cars) {
    cars.set(c.id, JSON.stringify({
      id: c.id, user_id: user.id, name: c.name, make: nul(c.make), model: nul(c.model), year: nul(c.year),
      notes: nul(c.notes), cover: c.cover || null, created_at: c.createdAt || new Date().toISOString(),
    }));
    for (const m of c.mods) {
      mods.set(m.id, JSON.stringify({
        id: m.id, user_id: user.id, car_id: c.id, title: m.title, price: Number(m.price) || 0,
        date: nul(m.date), mileage: m.mileage === null || m.mileage === undefined || m.mileage === '' ? null : Number(m.mileage),
        category: nul(m.category), description: nul(m.description), photos: m.photos || [], receipts: m.receipts || [],
        created_at: m.createdAt || new Date().toISOString(),
      }));
    }
    for (const p of c.plan || []) {
      plans.set(p.id, JSON.stringify({
        id: p.id, user_id: user.id, car_id: c.id, title: p.title, price: Number(p.price) || 0,
        priority: p.priority || 'medium', category: nul(p.category), link: nul(p.link), notes: nul(p.notes),
        created_at: p.createdAt || new Date().toISOString(),
      }));
    }
  }
  const settings = JSON.stringify({ user_id: user.id, currency: db.settings.currency || 'EUR' });
  return { cars, mods, plans, settings };
}

function fromRows(carRows, modRows, planRows, settingsRow) {
  const cars = carRows.map((r) => ({
    id: r.id, name: r.name, make: r.make || '', model: r.model || '', year: r.year || '', notes: r.notes || '',
    cover: r.cover || null, createdAt: r.created_at, mods: [], plan: [],
  }));
  const byId = new Map(cars.map((c) => [c.id, c]));
  for (const r of modRows) {
    byId.get(r.car_id)?.mods.push({
      id: r.id, title: r.title, price: Number(r.price), date: r.date || '', mileage: r.mileage,
      category: r.category || '', description: r.description || '', photos: r.photos || [], receipts: r.receipts || [],
      createdAt: r.created_at,
    });
  }
  for (const r of planRows) {
    byId.get(r.car_id)?.plan.push({
      id: r.id, title: r.title, price: Number(r.price), priority: r.priority, category: r.category || '',
      link: r.link || '', notes: r.notes || '', createdAt: r.created_at,
    });
  }
  return { version: 1, settings: { currency: settingsRow?.currency || 'EUR' }, cars };
}

const check = ({ data, error }) => {
  if (error) throw new Error(error.message);
  return data;
};

// ---------- images ----------

function referenced(db) {
  const set = new Set();
  const add = (img) => { if (img?.file) set.add(img.file); if (img?.preview) set.add(img.preview); };
  for (const c of db.cars) { add(c.cover); for (const m of c.mods) { m.photos.forEach(add); m.receipts.forEach(add); } }
  return set;
}

async function signUrls(names) {
  const list = [...names].filter((n) => SAFE_NAME.test(n) && !blobs.has(n));
  for (let i = 0; i < list.length; i += 100) {
    const chunk = list.slice(i, i + 100);
    const data = check(await photos().createSignedUrls(chunk.map(pathOf), SIGNED_URL_TTL));
    data.forEach((d, j) => { if (d.signedUrl) urls.set(chunk[j], d.signedUrl); });
  }
  signedAt = Date.now();
}

let pendingSign = null;
function signLater(name) {
  if (!SAFE_NAME.test(name)) return;
  pendingSign ||= new Set();
  pendingSign.add(name);
  queueMicrotask(async () => {
    const names = pendingSign;
    pendingSign = null;
    if (!names) return;
    try { await signUrls(names); rerender(); } catch (err) { console.warn('Signing image URLs failed', err); }
  });
}

async function upload(name, blob) {
  check(await photos().upload(pathOf(name), blob, { contentType: 'image/jpeg', upsert: true, cacheControl: '31536000' }));
  blobs.set(name, blob);
  urls.set(name, URL.createObjectURL(blob));
}

async function processFiles(files, kind) {
  const images = [...files].filter((f) => f.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|avif|heic)$/i.test(f.name));
  const out = [];
  let i = 0;
  for (const file of images) {
    say(`Compressing & uploading ${++i}/${images.length}…`, 0);
    const { blob } = await compressImage(file, kind);
    const name = `${crypto.randomUUID()}.jpg`;
    await upload(name, blob);
    out.push({ file: name, preview: null, originalName: file.name });
  }
  return out;
}

function chooseFiles({ multiple }) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = multiple;
    input.addEventListener('change', () => resolve([...input.files]), { once: true });
    input.addEventListener('cancel', () => resolve([]), { once: true });
    input.click();
  });
}

// Deletes stored photos that nothing references anymore (older than a day, to be safe).
async function cleanupOrphans(db) {
  const used = referenced(db);
  const stale = [];
  for (let offset = 0; ; offset += 1000) {
    const page = check(await photos().list(user.id, { limit: 1000, offset }));
    for (const f of page) {
      const age = Date.now() - new Date(f.created_at || 0).getTime();
      if (SAFE_NAME.test(f.name) && !used.has(f.name) && age > ORPHAN_GRACE_MS) stale.push(`${user.id}/${f.name}`);
    }
    if (page.length < 1000) break;
  }
  for (let i = 0; i < stale.length; i += 100) check(await photos().remove(stale.slice(i, i + 100)));
}

// Builds the PDF report HTML for the chosen cars, with signed URLs for their photos.
// Returns null when none of the cars exist anymore.
export async function reportHtml({ carIds, includePhotos, includeReceipts }) {
  const db = state.db;
  const cars = db.cars.filter((c) => carIds.includes(c.id));
  if (!cars.length) return null;
  const names = referenced({ cars });
  await signUrls([...names].filter((n) => !urls.has(n)));
  const html = buildReportHtml({
    cars, currency: db.settings.currency, includePhotos, includeReceipts,
    imgUrl: (name) => urls.get(name) || BLANK,
  });
  const name = cars.length === 1 ? `${cars[0].name} - TuningBook` : 'TuningBook - All cars';
  return { html, name: name.replace(/[\\/:*?"<>|]+/g, '').trim() || 'TuningBook' };
}

// ---------- the shared api ----------

export const cloudApi = {
  platform: 'web',
  compactImages: true, // only compressed images are stored; no separate previews
  acceptsFiles: true, // drag & drop passes File objects

  async load() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      user = session?.user && !recoveryMode ? session.user : await showAuth(supabase, recoveryMode ? 'recovery' : 'signin');
      window.api.account = { email: user.email, signOut: () => supabase.auth.signOut() };

      const [carRows, modRows, planRows, settingsRow] = await Promise.all([
        supabase.from('cars').select('*').order('created_at').then(check),
        supabase.from('mods').select('*').order('created_at').then(check),
        supabase.from('plan_items').select('*').order('created_at').then(check),
        supabase.from('settings').select('*').maybeSingle().then(check),
      ]);
      const db = fromRows(carRows, modRows, planRows, settingsRow);
      snapshot = toRows(db);
      await signUrls(referenced(db));
      cleanupOrphans(db).catch((err) => console.warn('Photo cleanup skipped', err));

      // Signed links expire after a day; refresh them when the tab comes back after a long time.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && Date.now() - signedAt > (SIGNED_URL_TTL * 1000) / 2 && typeof state !== 'undefined') {
          signUrls(referenced(state.db)).then(rerender).catch(() => {});
        }
      });
      return { db, imagesUrl: '' };
    } catch (err) {
      showFatal(String(err?.message || err));
      throw err;
    }
  },

  // Saves only what changed since the last successful save.
  save(next) {
    const rows = toRows(next); // capture now — the app keeps mutating the same object
    const run = async () => {
      const prev = snapshot;
      const changed = (a, b) => [...a].filter(([id, json]) => b.get(id) !== json).map(([, json]) => JSON.parse(json));
      const removed = (a, b) => [...b.keys()].filter((id) => !a.has(id));

      const carUp = changed(rows.cars, prev.cars);
      const modUp = changed(rows.mods, prev.mods);
      const planUp = changed(rows.plans, prev.plans);
      if (carUp.length) check(await supabase.from('cars').upsert(carUp));
      if (modUp.length) check(await supabase.from('mods').upsert(modUp));
      if (planUp.length) check(await supabase.from('plan_items').upsert(planUp));

      const modDel = removed(rows.mods, prev.mods);
      const planDel = removed(rows.plans, prev.plans);
      const carDel = removed(rows.cars, prev.cars);
      if (modDel.length) check(await supabase.from('mods').delete().in('id', modDel));
      if (planDel.length) check(await supabase.from('plan_items').delete().in('id', planDel));
      if (carDel.length) check(await supabase.from('cars').delete().in('id', carDel));

      if (rows.settings !== prev.settings) check(await supabase.from('settings').upsert(JSON.parse(rows.settings)));
      snapshot = rows;
    };
    // Run saves one after another; a failed save doesn't block later ones (they retry the diff).
    const p = saveChain.catch(() => {}).then(run);
    saveChain = p;
    return p;
  },

  imageSrc(name) {
    const url = urls.get(name);
    if (url) return url;
    signLater(name);
    return BLANK;
  },

  async pickImages(_title, kind = 'photo') {
    const files = await chooseFiles({ multiple: true });
    return files.length ? processFiles(files, kind) : [];
  },

  importImages: (files, kind = 'photo') => processFiles(files, kind),

  async readImage(name) {
    if (blobs.has(name)) return blobs.get(name).arrayBuffer();
    const blob = check(await photos().download(pathOf(name)));
    return blob.arrayBuffer();
  },

  // Used by "Load garage": everything is compressed before it is stored online.
  async writeImage(name, bytes, kind = 'photo') {
    const { blob } = await compressImage(new Blob([bytes], { type: /\.jpe?g$/i.test(name) ? 'image/jpeg' : '' }), kind);
    await upload(name, blob);
  },

  savePreview: async () => null,

  async saveBackup(fileName, bytes) {
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/zip' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: fileName });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return { ok: true, message: 'Garage file downloaded' };
  },

  async exportPdf(opts) {
    const report = await reportHtml(opts);
    if (!report) return { ok: false };
    const { html } = report;
    // Print from a hidden frame; the browser's print dialog offers "Save as PDF".
    const frame = Object.assign(document.createElement('iframe'), { srcdoc: html });
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(frame);
    await new Promise((r) => frame.addEventListener('load', r, { once: true }));
    const doc = frame.contentDocument;
    await Promise.all([...doc.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
    frame.contentWindow.focus();
    frame.contentWindow.print();
    setTimeout(() => frame.remove(), 60_000);
    return { ok: true, message: 'Choose “Save as PDF” in the print window' };
  },

  openLink: (url) => { if (/^https?:\/\//i.test(url)) window.open(url, '_blank', 'noopener'); },
  pathForFile: () => '',
};
