'use strict';

// ======================================================================
//  Constants & helpers
// ======================================================================

const CATEGORIES = [
  'Engine', 'Turbo / Intake', 'Exhaust', 'ECU / Tuning', 'Suspension', 'Wheels & Tires',
  'Brakes', 'Drivetrain', 'Exterior', 'Interior', 'Lighting', 'Audio & Electronics',
  'Maintenance', 'Other',
];
const PALETTE = ['#ff5a36', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#06b6d4', '#f97316',
  '#ec4899', '#84cc16', '#14b8a6', '#f43f5e', '#8b5cf6', '#64748b', '#94a3b8'];
const CURRENCIES = ['EUR', 'USD', 'GBP', 'RSD', 'BAM', 'CHF', 'PLN', 'CZK', 'HUF', 'SEK', 'NOK', 'DKK', 'CAD', 'AUD', 'JPY'];

const ICON = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 18v-6M9.5 15.5 12 18l2.5-2.5"/></svg>',
  edit: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
  car: '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3v-5l2-5h11l4 5h1a1 1 0 0 1 1 1v4h-2"/><circle cx="7.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/><path d="M9.5 17h6M5 12h15"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 .7V2l-1 .7-3-2-3 2-3-2-3 2-3-2z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19a9 9 0 1 1 14.2 0"/><path d="m12 14 4-5"/><circle cx="12" cy="14" r="1.5"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  share: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
  link: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
  image: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
  shield: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.4 3.4 8.3 8 9 4.6-.7 8-4.6 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  oil: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/></svg>',
  move: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M12 2 9 5M12 2l3 3M12 22l-3-3M12 22l3-3M2 12l3-3M2 12l3 3M22 12l-3-3M22 12l-3 3"/></svg>',
};

const IS_ANDROID = window.api.platform === 'android';

const state = {
  db: null,
  imagesUrl: '',
  view: { name: 'garage', carId: null },
  modSearch: '',
  modSort: 'date-desc',
  carTab: 'mods',
  modKind: 'mods', // sub-tab inside Modifications: 'mods' or 'maint'
  modals: [],
  localCars: 0, // cars in a garage saved on this device before the app went online
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const uid = () => crypto.randomUUID();
const todayIso = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function money(value, currency = state.db?.settings?.currency || 'EUR') {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(value) || 0);
  } catch {
    return `${(Number(value) || 0).toFixed(2)} ${currency}`;
  }
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d) ? iso : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const hasKm = (v) => v !== null && v !== undefined && v !== '';
const fmtKm = (v) => `${new Intl.NumberFormat().format(Number(v))} km`;
// Highest mileage logged so far for a car — used as a hint in the form.
const lastMileage = (car) => {
  const vals = car.mods.map((m) => m.mileage).filter(hasKm).map(Number);
  return vals.length ? Math.max(...vals) : null;
};

const imgSrc = (img, full = false) => {
  if (img._src) return img._src; // admin view of another user's garage (see cloud.js adminApi)
  const name = full ? img.file : img.preview || img.file;
  return window.api.imageSrc ? window.api.imageSrc(name) : state.imagesUrl + encodeURIComponent(name);
};

// Which part of a photo stays in view when it's cropped into a cover / thumbnail (set with
// "Adjust preview"). Stored on the image as pos: { x, y, z }:
//   x, y — the point to keep in view, in percent of the photo (50/50 = centre)
//   z    — zoom (1 = the photo just fills the frame; up to 3)
// Images get a data-pos attribute; once an image has loaded, focusCss() works out — from the real
// frame and photo sizes — how to put that point in the middle of the frame (as far as the photo's
// edges allow), zoomed in around it.
const clampPct = (v) => Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
const clampZoom = (v) => Math.min(3, Math.max(1, Math.round((Number(v) || 1) * 100) / 100));
const posAttr = (pos) => `${clampPct(pos.x)},${clampPct(pos.y)},${clampZoom(pos.z)}`;
const imgPos = (img) => (img?.pos ? ` data-pos="${posAttr(img.pos)}"` : '');

// fw/fh: frame size, iw/ih: photo size (any unit). Returns the CSS for an object-fit: cover image.
function focusCss({ x, y, z }, fw, fh, iw, ih) {
  const cover = Math.max(fw / iw, fh / ih);
  // For one axis: f = focus point (0–1), v = visible part of the photo at zoom 1 (0–1].
  // Without zoom the visible window starts at s0; object-position p% places it there.
  // With zoom the window shrinks to v/z and should start at s1; scaling around the frame point o
  // (transform-origin) moves the window start from s0 to s0 + o·v·(1 − 1/z), so o follows from that.
  const axis = (f, v) => {
    const s0 = Math.min(Math.max(f - v / 2, 0), 1 - v);
    const p = v < 0.999 ? (s0 / (1 - v)) * 100 : 50;
    let o = 50;
    if (z > 1) {
      const vz = v / z;
      const s1 = Math.min(Math.max(f - vz / 2, 0), 1 - vz);
      o = Math.min(Math.max((s1 - s0) / (v * (1 - 1 / z)), 0), 1) * 100;
    }
    return { p, o };
  };
  const ax = axis(x / 100, Math.min(1, fw / (iw * cover)));
  const ay = axis(y / 100, Math.min(1, fh / (ih * cover)));
  const r = (n) => Math.round(n * 10) / 10;
  return `object-position:${r(ax.p)}% ${r(ay.p)}%` +
    (z > 1 ? `;transform:scale(${z});transform-origin:${r(ax.o)}% ${r(ay.o)}%` : '');
}

function applyFocus(img) {
  if (!img.naturalWidth || !img.clientWidth || !img.clientHeight) return;
  const [x, y, z] = (img.dataset.pos || '').split(',').map(Number);
  img.style.cssText = focusCss({ x, y, z: clampZoom(z) }, img.clientWidth, img.clientHeight, img.naturalWidth, img.naturalHeight);
}
const applyFocusAll = (root = document) => root.querySelectorAll('img[data-pos]').forEach(applyFocus);
// Images that finish loading later, images added to the page, and frames that change size.
document.addEventListener('load', (e) => { if (e.target.matches?.('img[data-pos]')) applyFocus(e.target); }, true);
new MutationObserver(() => requestAnimationFrame(() => applyFocusAll())).observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('resize', () => applyFocusAll());

const catColor = (cat) => {
  const i = CATEGORIES.indexOf(cat);
  if (i >= 0) return PALETTE[i % PALETTE.length];
  let h = 0;
  for (const ch of String(cat)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

// Entries tagged "Maintenance" are listed in their own sub-tab, apart from the modifications.
const isMaint = (m) => (m.category || '').trim().toLowerCase() === 'maintenance';
const kindOf = (m) => (isMaint(m) ? 'maint' : 'mods');
const sumPrice = (list) => list.reduce((s, m) => s + (Number(m.price) || 0), 0);

const carById = (id) => state.db.cars.find((c) => c.id === id);
const carTotal = (car) => car.mods.reduce((s, m) => s + (Number(m.price) || 0), 0);
const carCover = (car) => {
  if (car.cover) return car.cover;
  const sorted = [...car.mods].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  for (const m of sorted) if (m.photos?.length) return m.photos[0];
  return null;
};
const carSubtitle = (car) => [car.year, car.make, car.model].filter(Boolean).join(' ');
const planTotal = (car) => car.plan.reduce((s, p) => s + (Number(p.price) || 0), 0);
const PRIORITIES = { high: 'High', medium: 'Medium', low: 'Low' };
const PRIORITY_COLOR = { high: '#ef4444', medium: '#eab308', low: '#64748b' };

let toastTimer;
function toast(msg, ms = 2600) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  if (ms) toastTimer = setTimeout(() => (el.hidden = true), ms);
}

async function persist() {
  try {
    await window.api.save(state.db);
  } catch (err) {
    toast('Saving failed: ' + err.message, 6000);
  }
}

// ======================================================================
//  Images
// ======================================================================

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// Large photos get a downscaled JPEG preview so the UI and the PDF stay fast and small.
// Rendering via a Blob URL keeps the canvas untainted and respects EXIF rotation.
async function makePreview(item) {
  const bytes = await window.api.readImage(item.file);
  const url = URL.createObjectURL(new Blob([bytes]));
  try {
    const img = await loadImage(url);
    const MAX = 1600;
    const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
    if (scale === 1) return null;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
    if (!blob) return null;
    return window.api.savePreview(item.file, await blob.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Import images from dropped files (paths on desktop, File objects on the web), or open a picker
 * when `dropped` is null. `kind` is 'photo' or 'receipt' (receipts keep more resolution).
 */
async function importImages(dropped, pickerTitle, kind = 'photo') {
  let items;
  try {
    items = dropped ? await window.api.importImages(dropped, kind) : await window.api.pickImages(pickerTitle, kind);
  } catch (err) {
    toast('Could not add images: ' + err.message, 6000);
    return [];
  }
  if (!items.length) {
    if (dropped && dropped.length) toast('Only image files (JPG, PNG, WEBP…) can be added');
    return [];
  }
  toast(`Processing ${items.length} image${items.length > 1 ? 's' : ''}…`, 0);
  for (const item of items) {
    try {
      // Platforms that already store compact images (the web version) need no separate preview.
      item.preview = window.api.compactImages ? null : await makePreview(item);
    } catch (err) {
      console.warn('Preview failed for', item.file, err);
      item.preview = null;
    }
  }
  $('#toast').hidden = true;
  return items.map((i) => ({ id: uid(), file: i.file, preview: i.preview, name: i.originalName }));
}

// ======================================================================
//  Modals
// ======================================================================

function openModal(html, { className = '', onMount, onClose, dismissable = false } = {}) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `<div class="modal ${className}" role="dialog" aria-modal="true">${html}</div>`;
  $('#modal-root').appendChild(backdrop);

  const modal = {
    el: backdrop.firstElementChild,
    close() {
      backdrop.remove();
      state.modals = state.modals.filter((m) => m !== modal);
      onClose?.();
    },
    dismissable,
  };
  state.modals.push(modal);
  if (dismissable) {
    backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) modal.close(); });
  }
  backdrop.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) modal.close();
  });
  onMount?.(modal.el, modal);
  const first = modal.el.querySelector('[autofocus]');
  if (first) setTimeout(() => first.focus(), 30);
  return modal;
}

const modalHead = (title) =>
  `<div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn" data-close title="Close">${ICON.close}</button></div>`;

function confirmDialog({ title, message, confirmLabel = 'Delete', danger = true }) {
  return new Promise((resolve) => {
    let answered = false;
    const m = openModal(`
      ${modalHead(title)}
      <div class="modal-body"><p style="margin:0;color:#c3c8d2">${message}</p></div>
      <div class="modal-foot">
        <button class="btn" data-close>Cancel</button>
        <button class="btn ${danger ? 'danger' : 'primary'}" data-ok autofocus>${esc(confirmLabel)}</button>
      </div>`, {
      className: 'small',
      dismissable: true,
      onClose: () => { if (!answered) resolve(false); },
    });
    m.el.querySelector('[data-ok]').addEventListener('click', () => {
      answered = true;
      m.close();
      resolve(true);
    });
  });
}

// "Adjust preview": the whole photo is shown; tap / drag on it to mark what should stay in view,
// and zoom to crop in closer. Live previews show the cover, the list thumbnail and the square
// form thumbnail. Resolves with the new pos { x, y, z }, or null if cancelled.
function editImagePosition(img, { frames = [['cover', 'Cover'], ['list', 'List'], ['square', 'Thumbnail']] } = {}) {
  return new Promise((resolve) => {
    let pos = img.pos
      ? { x: clampPct(img.pos.x), y: clampPct(img.pos.y), z: clampZoom(img.pos.z) }
      : { x: 50, y: 50, z: 1 };
    let saved = false;
    const src = imgSrc(img);
    const preview = (cls, label) =>
      `<div><div class="pos-frame ${cls}"><img src="${src}" draggable="false" alt=""></div><span>${label}</span></div>`;
    const m = openModal(`
      ${modalHead('Adjust preview')}
      <div class="modal-body">
        <p class="muted" style="margin:0 0 12px">Tap or drag on the photo to mark what should stay in view. Zoom in to crop closer.</p>
        <div class="pos-pick"><span class="pos-pick-inner"><img src="${src}" draggable="false" alt=""><i class="pos-dot"></i></span></div>
        <label class="pos-zoom">
          <span>Zoom</span>
          <input type="range" min="1" max="3" step="0.05" value="${pos.z}">
          <b></b>
        </label>
        <div class="pos-previews">
          ${frames.map(([cls, label]) => preview(cls, label)).join('')}
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn ghost" data-center>Reset</button>
        <span class="spacer"></span>
        <button class="btn" data-close>Cancel</button>
        <button class="btn primary" data-ok>Save</button>
      </div>`, {
      className: 'small',
      dismissable: true,
      onClose: () => { if (!saved) resolve(null); },
    });

    const pick = $('.pos-pick-inner', m.el);
    const dot = $('.pos-dot', m.el);
    const zoom = $('.pos-zoom input', m.el);
    const zoomLabel = $('.pos-zoom b', m.el);
    const previews = $$('.pos-frame img', m.el);
    const paint = () => {
      dot.style.left = pos.x + '%';
      dot.style.top = pos.y + '%';
      zoom.value = pos.z;
      zoomLabel.textContent = pos.z.toFixed(1) + '×';
      previews.forEach((el) => { el.dataset.pos = posAttr(pos); applyFocus(el); });
    };
    paint();

    const setFrom = (e) => {
      const r = pick.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pos.x = clampPct(((e.clientX - r.left) / r.width) * 100);
      pos.y = clampPct(((e.clientY - r.top) / r.height) * 100);
      paint();
    };
    let dragging = false;
    pick.addEventListener('pointerdown', (e) => { dragging = true; pick.setPointerCapture(e.pointerId); setFrom(e); });
    pick.addEventListener('pointermove', (e) => { if (dragging) setFrom(e); });
    pick.addEventListener('pointerup', () => { dragging = false; });
    pick.addEventListener('pointercancel', () => { dragging = false; });
    zoom.addEventListener('input', () => { pos.z = clampZoom(zoom.value); paint(); });

    $('[data-center]', m.el).addEventListener('click', () => { pos = { x: 50, y: 50, z: 1 }; paint(); });
    $('[data-ok]', m.el).addEventListener('click', () => {
      saved = true;
      m.close();
      resolve({ x: pos.x, y: pos.y, z: pos.z });
    });
  });
}

// Reusable image picker area (thumbnails + add button + drag & drop) used in forms.
function mountImagePicker(container, list, { title, single = false, kind = 'photo' } = {}) {
  const render = () => {
    container.innerHTML = `
      <div class="thumbs">
        ${list.map((img, i) => `
          <div class="thumb" title="${esc(img.name || '')}">
            <img src="${imgSrc(img)}" loading="lazy"${imgPos(img)}>
            <button type="button" class="pos" data-pos="${i}" title="Adjust preview position">${ICON.move}</button>
            <button type="button" class="x" data-remove="${i}" title="Remove">×</button>
          </div>`).join('')}
        ${single && list.length ? '' : `<button type="button" class="add-thumb" data-add><b>+</b>${single ? 'Choose' : 'Add'}</button>`}
      </div>
      ${single || IS_ANDROID || matchMedia('(hover: none)').matches ? '' : '<div class="drop-hint">or drag & drop images here</div>'}`;
  };
  const add = async (dropped) => {
    const items = await importImages(dropped, title, kind);
    if (!items.length) return;
    if (single) list.splice(0, list.length, items[0]);
    else list.push(...items);
    render();
  };
  container.classList.add('dropzone');
  container.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-remove]');
    if (rm) { list.splice(Number(rm.dataset.remove), 1); render(); return; }
    const pb = e.target.closest('[data-pos]');
    if (pb) {
      const i = Number(pb.dataset.pos);
      editImagePosition(list[i]).then((pos) => { if (pos) { list[i] = { ...list[i], pos }; render(); } });
      return;
    }
    if (e.target.closest('[data-add]')) add(null);
  });
  container.addEventListener('dragover', (e) => { e.preventDefault(); container.classList.add('over'); });
  container.addEventListener('dragleave', (e) => { if (!container.contains(e.relatedTarget)) container.classList.remove('over'); });
  container.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    container.classList.remove('over');
    // Desktop works with file paths; the web version takes the File objects directly.
    const files = [...e.dataTransfer.files];
    const dropped = window.api.acceptsFiles ? files : files.map((f) => window.api.pathForFile(f)).filter(Boolean);
    if (dropped.length) add(single ? dropped.slice(0, 1) : dropped);
  });
  render();
}

// ======================================================================
//  Car form
// ======================================================================

function openCarForm(car) {
  const editing = !!car;
  const draft = car
    ? { ...car, coverList: car.cover ? [car.cover] : [] }
    : { name: '', make: '', model: '', year: '', notes: '', coverList: [] };

  const m = openModal(`
    ${modalHead(editing ? 'Edit car' : 'Add a car')}
    <form class="modal-body" id="car-form" autocomplete="off">
      <div class="field">
        <label for="c-name">Name *</label>
        <input type="text" id="c-name" value="${esc(draft.name)}" placeholder="e.g. Project E46, Daily Golf…" autofocus required maxlength="80">
      </div>
      <div class="row c3">
        <div class="field"><label for="c-make">Make</label><input type="text" id="c-make" value="${esc(draft.make)}" placeholder="BMW" maxlength="60"></div>
        <div class="field"><label for="c-model">Model</label><input type="text" id="c-model" value="${esc(draft.model)}" placeholder="330ci" maxlength="60"></div>
        <div class="field"><label for="c-year">Year</label><input type="number" id="c-year" value="${esc(draft.year)}" placeholder="2003" min="1900" max="2100"></div>
      </div>
      <div class="field">
        <label for="c-notes">Notes</label>
        <textarea id="c-notes" placeholder="Engine code, VIN, goals for the build…" maxlength="2000">${esc(draft.notes)}</textarea>
      </div>
      <div class="field">
        <label>Cover photo <span class="hint">— optional, otherwise the latest build photo is used</span></label>
        <div id="c-cover" style="max-width:260px"></div>
      </div>
    </form>
    <div class="modal-foot">
      <button class="btn" data-close>Cancel</button>
      <button class="btn primary" type="submit" form="car-form">${editing ? 'Save changes' : 'Add car'}</button>
    </div>`, {
    onMount: (el) => mountImagePicker($('#c-cover', el), draft.coverList, { title: 'Choose a cover photo', single: true }),
  });

  $('#car-form', m.el).addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#c-name', m.el).value.trim();
    if (!name) { $('#c-name', m.el).focus(); return; }
    const data = {
      name,
      make: $('#c-make', m.el).value.trim(),
      model: $('#c-model', m.el).value.trim(),
      year: $('#c-year', m.el).value.trim(),
      notes: $('#c-notes', m.el).value.trim(),
      cover: draft.coverList[0] || null,
    };
    if (editing) {
      Object.assign(car, data);
    } else {
      const newCar = { id: uid(), createdAt: new Date().toISOString(), mods: [], plan: [], ...data };
      state.db.cars.push(newCar);
      state.view = { name: 'car', carId: newCar.id };
    }
    await persist();
    m.close();
    render();
    toast(editing ? 'Car updated' : 'Car added');
  });
}

// ======================================================================
//  Modification form
// ======================================================================

function openModForm(car, mod, { prefill, onSaved, heading } = {}) {
  const editing = !!mod;
  const src = mod || prefill || {};
  const draft = {
    title: src.title || '',
    price: src.price ?? '',
    date: src.date || todayIso(),
    category: src.category || '',
    description: src.description || '',
    mileage: src.mileage ?? '',
    photos: [...(src.photos || [])],
    receipts: [...(src.receipts || [])],
  };
  const currency = state.db.settings.currency;

  const m = openModal(`
    ${modalHead(heading || (editing ? 'Edit modification' : 'New modification'))}
    <form class="modal-body" id="mod-form" autocomplete="off">
      <div class="field">
        <label for="m-title">Title *</label>
        <input type="text" id="m-title" value="${esc(draft.title)}" placeholder="e.g. Coilovers install, Stage 1 remap…" autofocus required maxlength="120">
      </div>
      <div class="row c4">
        <div class="field">
          <label for="m-cat">Category</label>
          <input type="text" id="m-cat" list="cat-list" value="${esc(draft.category)}" placeholder="Pick or type…" maxlength="40">
          <datalist id="cat-list">${CATEGORIES.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
        </div>
        <div class="field">
          <label for="m-price">Price</label>
          <div class="price-input"><input type="number" id="m-price" value="${esc(draft.price)}" min="0" step="0.01" placeholder="0.00"><span>${esc(currency)}</span></div>
        </div>
        <div class="field"><label for="m-date">Date</label><input type="date" id="m-date" value="${esc(draft.date)}"></div>
        <div class="field">
          <label for="m-km">Mileage</label>
          <div class="price-input"><input type="number" id="m-km" value="${esc(draft.mileage)}" min="0" step="1" placeholder="${lastMileage(car) ?? 'e.g. 185000'}"><span>km</span></div>
        </div>
      </div>
      <div class="field">
        <label for="m-desc">Description</label>
        <textarea id="m-desc" placeholder="Parts used, shop, part numbers, mileage, notes…" maxlength="5000">${esc(draft.description)}</textarea>
      </div>
      <div class="row c2">
        <div class="field"><label>Build photos</label><div id="m-photos"></div></div>
        <div class="field"><label>Receipts</label><div id="m-receipts"></div></div>
      </div>
    </form>
    <div class="modal-foot">
      <button class="btn" data-close>Cancel</button>
      <button class="btn primary" type="submit" form="mod-form">${editing ? 'Save changes' : 'Add modification'}</button>
    </div>`, {
    className: 'wide',
    onMount: (el) => {
      mountImagePicker($('#m-photos', el), draft.photos, { title: 'Add build photos' });
      mountImagePicker($('#m-receipts', el), draft.receipts, { title: 'Add receipt photos', kind: 'receipt' });
    },
  });

  $('#mod-form', m.el).addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = $('#m-title', m.el).value.trim();
    if (!title) { $('#m-title', m.el).focus(); return; }
    const priceRaw = $('#m-price', m.el).value;
    const data = {
      title,
      price: priceRaw === '' ? 0 : Math.round(parseFloat(priceRaw) * 100) / 100,
      date: $('#m-date', m.el).value || todayIso(),
      mileage: $('#m-km', m.el).value === '' ? null : Math.max(0, Math.round(Number($('#m-km', m.el).value))),
      category: $('#m-cat', m.el).value.trim(),
      description: $('#m-desc', m.el).value.trim(),
      photos: draft.photos,
      receipts: draft.receipts,
    };
    if (editing) Object.assign(mod, data);
    else car.mods.push({ id: uid(), createdAt: new Date().toISOString(), ...data });
    const movedTab = kindOf(data) !== state.modKind;
    state.modKind = kindOf(data);
    onSaved?.();
    await persist();
    m.close();
    render();
    // Refresh an open detail view of this mod, if any.
    if (editing && state.modals.length) {
      state.modals.forEach((x) => x.close());
      openModDetail(car, mod);
    }
    if (isMaint(data)) toast(editing ? (movedTab ? 'Moved to Maintenance' : 'Maintenance updated') : 'Added to Maintenance');
    else toast(editing ? (movedTab ? 'Moved to Modifications' : 'Modification updated') : 'Modification added');
  });
}

// ======================================================================
//  Modification detail & lightbox
// ======================================================================

function openModDetail(car, mod, tab = 'photos', { readOnly = false, publicView = false } = {}) {
  const m = openModal(`
    ${modalHead('')}
    <div class="modal-body" style="padding-top:0">
      <div class="detail-head">
        <div>
          <div class="eyebrow">${[mod.category, fmtDate(mod.date), hasKm(mod.mileage) ? fmtKm(mod.mileage) : ''].filter(Boolean).map(esc).join(' · ')}</div>
          <h2>${esc(mod.title)}</h2>
        </div>
        <div class="detail-price">${mod.price === null || mod.price === undefined ? '' : money(mod.price, state.publicBuild?.currency)}</div>
      </div>
      ${mod.description ? `<p class="detail-desc">${esc(mod.description)}</p>` : ''}
      <div class="tabs">
        <button data-tab="photos">Build photos (${mod.photos.length})</button>
        ${publicView ? '' : `<button data-tab="receipts">Receipts (${mod.receipts.length})</button>`}
      </div>
      <div id="tab-body"></div>
    </div>
    <div class="modal-foot">
      ${readOnly ? '' : `<button class="btn danger" data-del>${ICON.trash} Delete</button>`}
      <span class="spacer"></span>
      <button class="btn" data-close>Close</button>
      ${readOnly ? '' : `<button class="btn primary" data-edit>${ICON.edit} Edit</button>`}
    </div>`, { className: 'wide', dismissable: true });

  const showTab = (name) => {
    const list = name === 'photos' ? mod.photos : mod.receipts;
    $$('.tabs button', m.el).forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
    $('#tab-body', m.el).innerHTML = list.length
      ? `<div class="gallery">${list.map((img, i) => `<button data-open="${i}"><img src="${imgSrc(img)}" loading="lazy"${imgPos(img)}></button>`).join('')}</div>`
      : `<div class="gallery-empty">No ${name === 'photos' ? 'build photos' : 'receipts'} yet.</div>`;
    $('#tab-body', m.el).onclick = (e) => {
      const b = e.target.closest('[data-open]');
      if (b) openLightbox(list, Number(b.dataset.open));
    };
  };
  $('.tabs', m.el).addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (b) showTab(b.dataset.tab);
  });
  $('[data-edit]', m.el)?.addEventListener('click', () => openModForm(car, mod));
  $('[data-del]', m.el)?.addEventListener('click', async () => {
    if (await deleteMod(car, mod)) m.close();
  });
  showTab(tab === 'receipts' && !mod.photos.length ? 'receipts' : mod.photos.length ? 'photos' : mod.receipts.length ? 'receipts' : 'photos');
}

function openLightbox(list, index) {
  let i = index;
  const el = document.createElement('div');
  el.className = 'lightbox';
  const draw = () => {
    el.innerHTML = `
      <img src="${imgSrc(list[i], true)}">
      ${list.length > 1 ? '<button class="nav prev" data-prev>‹</button><button class="nav next" data-next>›</button>' : ''}
      <button class="icon-btn close" data-x title="Close (Esc)">${ICON.close}</button>
      <div class="counter">${i + 1} / ${list.length}</div>`;
  };
  const step = (d) => { i = (i + d + list.length) % list.length; draw(); };
  const onKey = (e) => {
    if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); }
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  };
  const close = () => { el.remove(); document.removeEventListener('keydown', onKey, true); };
  el.addEventListener('click', (e) => {
    if (e.target.closest('[data-prev]')) step(-1);
    else if (e.target.closest('[data-next]')) step(1);
    else if (e.target.closest('[data-x]') || e.target === el) close();
  });
  document.addEventListener('keydown', onKey, true);
  draw();
  document.body.appendChild(el);
}

// ======================================================================
//  Plan (wishlist of future mods — never included in PDF exports)
// ======================================================================

function openPlanForm(car, item) {
  const editing = !!item;
  const d = item || { title: '', price: '', priority: 'medium', category: '', link: '', notes: '' };
  const currency = state.db.settings.currency;

  const m = openModal(`
    ${modalHead(editing ? 'Edit planned mod' : 'Add to plan')}
    <form class="modal-body" id="plan-form" autocomplete="off">
      <div class="field">
        <label for="p-title">What do you want to do? *</label>
        <input type="text" id="p-title" value="${esc(d.title)}" placeholder="e.g. Big brake kit, Catback exhaust…" autofocus required maxlength="120">
      </div>
      <div class="row c3">
        <div class="field">
          <label for="p-cat">Category</label>
          <input type="text" id="p-cat" list="p-cat-list" value="${esc(d.category)}" placeholder="Pick or type…" maxlength="40">
          <datalist id="p-cat-list">${CATEGORIES.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
        </div>
        <div class="field">
          <label for="p-price">Estimated price</label>
          <div class="price-input"><input type="number" id="p-price" value="${esc(d.price)}" min="0" step="0.01" placeholder="0.00"><span>${esc(currency)}</span></div>
        </div>
        <div class="field">
          <label for="p-prio">Priority</label>
          <select id="p-prio">${Object.entries(PRIORITIES).map(([v, l]) => `<option value="${v}" ${d.priority === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
        </div>
      </div>
      <div class="field">
        <label for="p-link">Link <span class="hint">— shop page, forum thread…</span></label>
        <input type="text" id="p-link" value="${esc(d.link)}" placeholder="https://…" maxlength="500">
      </div>
      <div class="field">
        <label for="p-notes">Notes</label>
        <textarea id="p-notes" placeholder="Part numbers, alternatives, what's needed before…" maxlength="3000">${esc(d.notes)}</textarea>
      </div>
    </form>
    <div class="modal-foot">
      <button class="btn" data-close>Cancel</button>
      <button class="btn primary" type="submit" form="plan-form">${editing ? 'Save changes' : 'Add to plan'}</button>
    </div>`);

  $('#plan-form', m.el).addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = $('#p-title', m.el).value.trim();
    if (!title) { $('#p-title', m.el).focus(); return; }
    const priceRaw = $('#p-price', m.el).value;
    const data = {
      title,
      price: priceRaw === '' ? 0 : Math.round(parseFloat(priceRaw) * 100) / 100,
      priority: $('#p-prio', m.el).value,
      category: $('#p-cat', m.el).value.trim(),
      link: $('#p-link', m.el).value.trim(),
      notes: $('#p-notes', m.el).value.trim(),
    };
    if (editing) Object.assign(item, data);
    else car.plan.push({ id: uid(), createdAt: new Date().toISOString(), ...data });
    await persist();
    m.close();
    render();
    toast(editing ? 'Plan updated' : 'Added to plan');
  });
}

async function deletePlanItem(car, item) {
  const ok = await confirmDialog({ title: 'Remove from plan?', message: `<b>${esc(item.title)}</b> will be removed from your plan.`, confirmLabel: 'Remove' });
  if (!ok) return;
  car.plan = car.plan.filter((p) => p.id !== item.id);
  await persist();
  render();
}

// Turns a planned item into a real modification (price/photos/receipts can be adjusted first).
function completePlanItem(car, item) {
  openModForm(car, null, {
    heading: 'Mark as done',
    prefill: { title: item.title, price: item.price || '', category: item.category, description: item.notes },
    onSaved: () => { car.plan = car.plan.filter((p) => p.id !== item.id); },
  });
}

// ======================================================================
//  Delete / export / settings
// ======================================================================

async function deleteMod(car, mod) {
  const ok = await confirmDialog({
    title: 'Delete modification?',
    message: `<b>${esc(mod.title)}</b> and its ${mod.photos.length + mod.receipts.length} photo(s) will be permanently removed.`,
  });
  if (!ok) return false;
  car.mods = car.mods.filter((x) => x.id !== mod.id);
  await persist();
  render();
  toast('Modification deleted');
  return true;
}

async function deleteCar(car) {
  const ok = await confirmDialog({
    title: 'Delete car?',
    message: `<b>${esc(car.name)}</b> and all of its ${car.mods.length} modification(s), photos and receipts will be permanently removed.`,
  });
  if (!ok) return;
  state.db.cars = state.db.cars.filter((c) => c.id !== car.id);
  await persist();
  state.view = { name: 'garage' };
  render();
  toast('Car deleted');
}

function openExport(carIds) {
  const cars = carIds.map(carById).filter(Boolean);
  const label = cars.length === 1 ? esc(cars[0].name) : `all ${cars.length} cars`;
  const m = openModal(`
    ${modalHead('Export PDF')}
    <div class="modal-body">
      <p style="margin-top:0" class="muted">Create a PDF build sheet for <b style="color:var(--text)">${label}</b> with a cost summary and every modification.</p>
      <label class="check"><input type="checkbox" id="x-photos" checked> Include build photos</label>
      <label class="check"><input type="checkbox" id="x-receipts" checked> Include receipts</label>
    </div>
    <div class="modal-foot">
      <button class="btn" data-close>Cancel</button>
      <button class="btn primary" data-go autofocus>${ICON.pdf} Export</button>
    </div>`, { className: 'small', dismissable: true });

  $('[data-go]', m.el).addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = 'Exporting…';
    try {
      const res = await window.api.exportPdf({
        carIds,
        includePhotos: $('#x-photos', m.el).checked,
        includeReceipts: $('#x-receipts', m.el).checked,
      });
      m.close();
      if (res.ok) toast(res.message || 'PDF saved: ' + res.filePath, 4000);
    } catch (err) {
      m.close();
      toast('Export failed: ' + err.message, 6000);
    }
  });
}

// ---------- backup (.zip with tuningbook.json + images/) ----------

const BACKUP_IMAGE_NAME = /^[a-f0-9-]{36}(\.p)?\.[a-z0-9]{2,5}$/;

function referencedImageNames(db) {
  const set = new Set();
  const add = (img) => { if (img?.file) set.add(img.file); if (img?.preview) set.add(img.preview); };
  for (const car of db.cars) {
    add(car.cover);
    for (const m of car.mods) { m.photos.forEach(add); m.receipts.forEach(add); }
  }
  return [...set];
}

async function exportBackup() {
  try {
    const names = referencedImageNames(state.db);
    const zip = new JSZip();
    zip.file('tuningbook.json', JSON.stringify({ format: 'tuningbook-backup', version: 1, exportedAt: new Date().toISOString(), db: state.db }, null, 2));
    let done = 0;
    for (const name of names) {
      toast(`Exporting garage… ${++done}/${names.length} images`, 0);
      try {
        zip.file('images/' + name, await window.api.readImage(name));
      } catch (err) {
        console.warn('Missing image in backup', name, err);
      }
    }
    toast('Packing garage file…', 0);
    // Photos are already compressed, so storing them as-is is much faster than deflating.
    const bytes = await zip.generateAsync({ type: 'uint8array', compression: 'STORE' });
    const fileName = `TuningBook garage ${todayIso()}.zip`;
    const res = await window.api.saveBackup(fileName, bytes);
    $('#toast').hidden = true;
    if (res?.ok) toast(res.message || 'Garage exported', 4000);
  } catch (err) {
    toast('Export failed: ' + err.message, 6000);
  }
}

function chooseFile(accept) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.addEventListener('change', () => resolve(input.files[0] || null), { once: true });
    input.addEventListener('cancel', () => resolve(null), { once: true });
    input.click();
  });
}

async function importBackup() {
  const file = await chooseFile('.zip,application/zip');
  if (!file) return;
  let backup, zip;
  try {
    toast('Reading garage file…', 0);
    zip = await JSZip.loadAsync(await file.arrayBuffer());
    const json = await zip.file('tuningbook.json')?.async('string');
    backup = json && JSON.parse(json);
    if (backup?.format !== 'tuningbook-backup' || !Array.isArray(backup.db?.cars)) throw new Error('This is not a TuningBook garage file.');
    $('#toast').hidden = true;
  } catch (err) {
    toast('Load failed: ' + err.message, 6000);
    return;
  }

  await mergeGarage(backup.db.cars, async (name) => zip.file('images/' + name)?.async('uint8array'), {
    title: 'Load garage?',
    intro: `This garage file from ${esc(fmtDate((backup.exportedAt || '').slice(0, 10)))} contains:`,
    from: 'the file',
    confirmLabel: 'Load',
  });
}

// Adds cars (with their images) to the garage: cars with the same id are replaced, others added.
// `getImage(name)` returns the image's bytes, or nothing if it's missing. Resolves true when done.
async function mergeGarage(incoming, getImage, { title, intro, from, confirmLabel, useOriginals = false }) {
  const here = window.api.account ? 'in your online garage' : 'on this device';
  const existingIds = new Set(state.db.cars.map((c) => c.id));
  const updated = incoming.filter((c) => existingIds.has(c.id));
  const list = incoming.map((c) => `<li><b>${esc(c.name)}</b> — ${(c.mods || []).length} mods${existingIds.has(c.id) ? ` <span class="muted">(replaces the one ${here})</span>` : ' <span class="muted">(new)</span>'}</li>`).join('');
  const ok = await confirmDialog({
    title,
    message: `${intro}<ul style="padding-left:18px">${list}</ul>
      ${updated.length ? `Cars marked “replaces” will be overwritten with the version from ${from}. ` : ''}Other cars ${here} stay as they are.`,
    confirmLabel,
    danger: updated.length > 0,
  });
  if (!ok) return false;

  try {
    for (const car of incoming) {
      car.mods ||= [];
      car.plan ||= [];
      for (const m of car.mods) { m.photos ||= []; m.receipts ||= []; }
    }
    // Which images are receipts (kept at a higher resolution when compressing).
    const receiptNames = new Set();
    for (const car of incoming) for (const m of car.mods) for (const r of m.receipts) { receiptNames.add(r.file); if (r.preview) receiptNames.add(r.preview); }

    // Platforms that store only compact images (the online garage) keep just one file per photo:
    // the existing preview when there is one, otherwise the original (compressed on upload).
    // With `useOriginals` (the originals are right here on disk) the better-quality original is used.
    if (window.api.compactImages) {
      const compact = (img) => {
        if (!img) return img;
        if (img.preview && !useOriginals && !receiptNames.has(img.file)) return { ...img, file: img.preview, preview: null };
        return { ...img, preview: null };
      };
      for (const car of incoming) {
        car.cover = compact(car.cover);
        for (const m of car.mods) { m.photos = m.photos.map(compact); m.receipts = m.receipts.map(compact); }
      }
      for (const car of incoming) for (const m of car.mods) for (const r of m.receipts) receiptNames.add(r.file);
    }

    const names = referencedImageNames({ cars: incoming });
    let done = 0;
    for (const name of names) {
      if (!BACKUP_IMAGE_NAME.test(name)) continue;
      toast(`Importing images… ${++done}/${names.length}`, 0);
      const bytes = await getImage(name);
      if (!bytes) continue;
      await window.api.writeImage(name, bytes, receiptNames.has(name) ? 'receipt' : 'photo');
    }
    for (const car of incoming) {
      const i = state.db.cars.findIndex((c) => c.id === car.id);
      if (i >= 0) state.db.cars[i] = car; else state.db.cars.push(car);
    }
    await persist();
    state.view = { name: 'garage' };
    render();
    toast(`Loaded ${incoming.length} car${incoming.length === 1 ? '' : 's'}`, 4000);
    return true;
  } catch (err) {
    toast('Load failed: ' + err.message, 6000);
    return false;
  }
}

// ---------- garage saved on this device before the app went online ----------

// Desktop and Android used to keep the garage on the device. After signing in, that copy is
// offered for upload once (and stays available in Settings until it's uploaded or deleted).
const LOCAL_OFFER_KEY = 'tb-local-garage-offered';

async function checkLocalGarage() {
  if (!window.api.localGarage) return;
  try {
    const local = await window.api.localGarage.read();
    state.localCars = local?.cars?.length || 0;
  } catch {
    state.localCars = 0;
  }
  if (!state.localCars) return;
  let offered = false;
  try { offered = localStorage.getItem(LOCAL_OFFER_KEY) === '1'; } catch { /* storage unavailable */ }
  if (offered) return;
  try { localStorage.setItem(LOCAL_OFFER_KEY, '1'); } catch { /* storage unavailable */ }
  uploadLocalGarage();
}

async function uploadLocalGarage() {
  let local;
  try {
    local = await window.api.localGarage.read();
  } catch (err) {
    toast('Could not read the garage on this device: ' + err.message, 6000);
    return;
  }
  if (!local?.cars?.length) { state.localCars = 0; toast('No garage saved on this device'); return; }
  const done = await mergeGarage(structuredClone(local.cars), (name) => window.api.localGarage.readImage(name), {
    title: 'Upload the garage from this device?',
    intro: 'TuningBook now keeps your garage online. This device still has the garage it saved before you signed in:',
    from: 'this device',
    confirmLabel: 'Upload',
    useOriginals: true,
  });
  if (!done || !window.api.localGarage.remove) return;
  const del = await confirmDialog({
    title: 'Delete the copy on this device?',
    message: 'Your garage is uploaded. The old copy saved on this device (with all its photos) is no longer used — delete it to free up space? This can’t be undone.',
    confirmLabel: 'Delete local copy',
  });
  if (!del) return;
  try {
    await window.api.localGarage.remove();
    state.localCars = 0;
    toast('Local copy deleted');
  } catch (err) {
    toast('Could not delete the local copy: ' + err.message, 6000);
  }
}

function openSettings() {
  const cur = state.db.settings.currency;
  const m = openModal(`
    ${modalHead('Settings')}
    <div class="modal-body">
      <div class="field">
        <label for="s-cur">Currency</label>
        <select id="s-cur">${CURRENCIES.map((c) => `<option ${c === cur ? 'selected' : ''}>${c}</option>`).join('')}</select>
      </div>
      <div class="field">
        <label>Garage file</label>
        <div class="muted" style="margin-bottom:8px">Export garage saves one .zip file with all cars, modifications, plans, photos and receipts.
          Load it on another device (or here) to move your data or restore a safe copy.</div>
        <div class="actions">
          <button class="btn" data-backup-export>${ICON.upload} Export garage</button>
          <button class="btn" data-backup-import>${ICON.download} Load garage</button>
          ${window.api.openDataFolder ? '<button class="btn ghost" data-folder>Open data folder</button>' : ''}
        </div>
      </div>
      ${state.localCars ? `
      <div class="field">
        <label>Garage saved on this device</label>
        <div class="muted" style="margin-bottom:8px">This device still has the garage it saved before you signed in
          (${state.localCars} car${state.localCars === 1 ? '' : 's'}). Upload it to add it to your online garage.</div>
        <div><button class="btn" data-local-upload>${ICON.upload} Upload to online garage</button></div>
      </div>` : ''}
      ${window.api.account ? `
      <div class="field">
        <label>Account</label>
        <div class="muted" style="margin-bottom:8px">Signed in as <b style="color:var(--text)">${esc(window.api.account.email)}</b>. Your garage is saved online and available on every device you sign in on.</div>
        <div><button class="btn danger" data-signout>Sign out</button></div>
      </div>` : ''}
    </div>
    <div class="modal-foot">
      <button class="btn" data-close>Cancel</button>
      <button class="btn primary" data-save>Save</button>
    </div>`, { className: 'small', dismissable: true });

  $('[data-folder]', m.el)?.addEventListener('click', () => window.api.openDataFolder());
  $('[data-local-upload]', m.el)?.addEventListener('click', () => { m.close(); uploadLocalGarage(); });
  $('[data-signout]', m.el)?.addEventListener('click', () => window.api.account.signOut());
  $('[data-backup-export]', m.el).addEventListener('click', () => exportBackup());
  $('[data-backup-import]', m.el).addEventListener('click', () => { m.close(); importBackup(); });
  $('[data-save]', m.el).addEventListener('click', async () => {
    state.db.settings.currency = $('#s-cur', m.el).value;
    await persist();
    m.close();
    render();
  });
}

// ======================================================================
//  Views
// ======================================================================

function renderCrumbs() {
  const crumbs = $('#crumbs');
  if (state.view.name === 'public') {
    crumbs.innerHTML = '';
  } else if (state.view.name === 'car') {
    const car = carById(state.view.carId);
    crumbs.innerHTML = `<button data-action="go-garage">Garage</button><span>›</span><span class="current">${esc(car?.name)}</span>`;
  } else if (state.view.name.startsWith('admin')) {
    const v = state.view;
    const parts = [['go-garage', '', 'Garage'], ['admin', '', 'Admin']];
    if (v.userId) parts.push(['admin-user', v.userId, adminUser(v.userId)?.email || 'User']);
    if (v.carId) parts.push(['', '', adminGarage(v.userId)?.cars?.find((c) => c.id === v.carId)?.name || 'Car']);
    crumbs.innerHTML = parts.map(([action, id, label], i) => (i === parts.length - 1
      ? `<span class="current">${esc(label)}</span>`
      : `<button data-action="${action}"${id ? ` data-id="${esc(id)}"` : ''}>${esc(label)}</button><span>›</span>`)).join('');
  } else {
    crumbs.innerHTML = '<span class="current">Garage</span>';
  }
}

function renderGarage() {
  const cars = state.db.cars;
  const totalMods = cars.reduce((s, c) => s + c.mods.length, 0);
  const total = cars.reduce((s, c) => s + carTotal(c), 0);

  if (!cars.length) {
    return `
      <div class="view-inner">
        <div class="empty">
          <div style="color:var(--accent)">${ICON.car}</div>
          <h2>Your garage is empty</h2>
          <div>Add your first car to start logging modifications, photos and receipts.</div>
          <div class="empty-actions">
            <button class="btn primary" data-action="add-car">${ICON.plus} Add a car</button>
            <button class="btn" data-action="load-garage">${ICON.download} Load garage</button>
          </div>
          <div class="muted" style="font-size:12px;margin-top:10px">Have a garage file from the ${IS_ANDROID ? 'PC' : 'phone'}? Load it here.</div>
        </div>
      </div>`;
  }

  return `
    <div class="view-inner">
      <div class="page-head">
        <div><h1>Garage</h1><div class="sub">All your builds in one place</div></div>
        <div class="actions">
          <button class="btn" data-action="load-garage" title="Load cars from a garage file">${ICON.download} Load garage</button>
          <button class="btn" data-action="export-garage" title="Save all cars, photos and receipts to one file">${ICON.upload} Export garage</button>
          <button class="btn" data-action="export-all" title="PDF build sheet of all cars">${ICON.pdf} Export PDF</button>
          <button class="btn primary" data-action="add-car">${ICON.plus} Add car</button>
        </div>
      </div>
      <div class="garage-stats">
        <div class="stat"><b>${cars.length}</b><span>Cars</span></div>
        <div class="stat"><b>${totalMods}</b><span>Modifications</span></div>
        <div class="stat"><b>${money(total)}</b><span>Total invested</span></div>
      </div>
      <div class="car-grid">
        ${cars.map((car) => {
          const cover = carCover(car);
          return `
          <div class="car-card" role="button" tabindex="0" data-action="open-car" data-id="${car.id}">
            <div class="cover">
              ${cover ? `<img src="${imgSrc(cover)}" loading="lazy"${imgPos(cover)}>` : `<div class="ph">${ICON.car}</div>`}
              <div class="overlay">
                <h3>${esc(car.name)}</h3>
                <div class="meta">${esc(carSubtitle(car)) || '&nbsp;'}</div>
              </div>
            </div>
            <div class="card-menu">
              <button class="icon-btn" data-action="edit-car" data-id="${car.id}" title="Edit">${ICON.edit}</button>
              <button class="icon-btn danger" data-action="delete-car" data-id="${car.id}" title="Delete">${ICON.trash}</button>
            </div>
            <div class="foot">
              <span>${car.mods.length} mod${car.mods.length === 1 ? '' : 's'}</span>
              <b>${money(carTotal(car))}</b>
            </div>
          </div>`;
        }).join('')}
        <button class="add-card" data-action="add-car"><div><div class="plus">+</div>Add car</div></button>
      </div>
    </div>`;
}

function renderCar(car) {
  const cover = carCover(car);
  const total = carTotal(car);
  const photos = car.mods.reduce((s, m) => s + m.photos.length, 0);
  const receipts = car.mods.reduce((s, m) => s + m.receipts.length, 0);

  const byCat = {};
  for (const m of car.mods) {
    const k = m.category || 'Other';
    byCat[k] = (byCat[k] || 0) + (Number(m.price) || 0);
  }
  const cats = Object.entries(byCat).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);

  return `
    <div class="view-inner">
      <section class="car-hero">
        <div class="cover">${cover ? `<img src="${imgSrc(cover)}"${imgPos(cover)}>
          <button class="cover-adjust" data-action="adjust-cover" data-id="${car.id}" title="Adjust preview position">${ICON.move}<span>Adjust</span></button>` : ICON.car}</div>
        <div class="hero-body">
          <div class="eyebrow">Build</div>
          <h1>${esc(car.name)}</h1>
          ${carSubtitle(car) ? `<div class="sub">${esc(carSubtitle(car))}</div>` : ''}
          ${car.notes ? `<p class="notes">${esc(car.notes)}</p>` : ''}
          <div class="hero-stats">
            <div><b>${money(total)}</b><span>Invested</span></div>
            <div><b>${car.mods.length}</b><span>Mods</span></div>
            <div><b>${photos}</b><span>Photos</span></div>
            <div><b>${receipts}</b><span>Receipts</span></div>
            ${car.plan.length ? `<div class="planned-stat"><b>${money(planTotal(car))}</b><span>Planned · ${car.plan.length}</span></div>` : ''}
          </div>
          ${cats.length && total > 0 ? `
            <div class="breakdown">${cats.map(([k, v]) => `<i style="width:${(v / total) * 100}%;background:${catColor(k)}" title="${esc(k)}: ${esc(money(v))}"></i>`).join('')}</div>
            <div class="legend">${cats.map(([k, v]) => `<span><i style="background:${catColor(k)}"></i>${esc(k)} · ${money(v)}</span>`).join('')}</div>` : ''}
          <div class="actions" style="padding-top:16px">
            <button class="btn primary" data-action="add-mod">${ICON.plus} ${state.modKind === 'maint' ? 'Add maintenance' : 'Add modification'}</button>
            <button class="btn" data-action="share-car" data-id="${car.id}">${ICON.share} Share</button>
            <button class="btn" data-action="export-car">${ICON.pdf} Export PDF</button>
            <button class="btn ghost" data-action="edit-car" data-id="${car.id}">${ICON.edit} Edit car</button>
            <button class="btn ghost danger" data-action="delete-car" data-id="${car.id}">${ICON.trash} Delete</button>
          </div>
        </div>
      </section>

      <div class="toolbar">
        <div class="seg">
          <button data-action="car-tab" data-id="mods" class="${state.carTab === 'mods' ? 'active' : ''}">Modifications <span>${car.mods.length}</span></button>
          <button data-action="car-tab" data-id="plan" class="${state.carTab === 'plan' ? 'active' : ''}">Plan <span>${car.plan.length}</span></button>
          <button data-action="car-tab" data-id="timeline" class="${state.carTab === 'timeline' ? 'active' : ''}">Timeline</button>
        </div>
        <div class="spacer"></div>
        ${state.carTab === 'timeline' ? '' : state.carTab === 'plan' ? `
        <span class="muted plan-note">Private — not included in PDF exports</span>
        <button class="btn" data-action="add-plan">${ICON.plus} Add to plan</button>` : `
        <div class="search">${ICON.search}<input type="search" id="mod-search" placeholder="Search…" value="${esc(state.modSearch)}"></div>
        <select id="mod-sort" style="width:auto">
          ${[['date-desc', 'Newest first'], ['date-asc', 'Oldest first'], ['price-desc', 'Price: high → low'], ['price-asc', 'Price: low → high'], ['title', 'Title A–Z']]
            .map(([v, l]) => `<option value="${v}" ${state.modSort === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>`}
      </div>
      ${state.carTab === 'mods' ? (() => {
        const maint = car.mods.filter(isMaint);
        const mods = car.mods.filter((m) => !isMaint(m));
        return `
      <div class="subtabs">
        <button data-action="mod-kind" data-id="mods" class="${state.modKind === 'mods' ? 'active' : ''}">${ICON.wrench}Modifications <span>${mods.length} · ${money(sumPrice(mods))}</span></button>
        <button data-action="mod-kind" data-id="maint" class="${state.modKind === 'maint' ? 'active' : ''}">${ICON.oil}Maintenance <span>${maint.length} · ${money(sumPrice(maint))}</span></button>
      </div>`;
      })() : ''}
      <div id="mod-list"></div>
    </div>`;
}

function renderModList(car) {
  const list = $('#mod-list');
  if (!list) return;
  const maintTab = state.modKind === 'maint';
  const inTab = car.mods.filter((m) => kindOf(m) === state.modKind);
  if (!inTab.length) {
    list.innerHTML = maintTab ? `
      <div class="empty">
        <div style="color:var(--accent)">${ICON.oil}</div>
        <h2>No maintenance yet</h2>
        <div>Oil changes, brakes, tyres, servicing — anything with the category <b>Maintenance</b> is listed here.</div>
        <button class="btn primary" data-action="add-mod">${ICON.plus} Add maintenance</button>
      </div>` : `
      <div class="empty">
        <div style="color:var(--accent)">${ICON.wrench}</div>
        <h2>No modifications yet</h2>
        <div>Log your first upgrade with its price, build photos and receipt.</div>
        <button class="btn primary" data-action="add-mod">${ICON.plus} Add modification</button>
      </div>`;
    return;
  }
  const q = state.modSearch.trim().toLowerCase();
  let mods = inTab.filter((m) =>
    !q || [m.title, m.category, m.description].some((v) => (v || '').toLowerCase().includes(q)));
  const sorters = {
    'date-desc': (a, b) => (b.date || '').localeCompare(a.date || ''),
    'date-asc': (a, b) => (a.date || '').localeCompare(b.date || ''),
    'price-desc': (a, b) => (b.price || 0) - (a.price || 0),
    'price-asc': (a, b) => (a.price || 0) - (b.price || 0),
    title: (a, b) => a.title.localeCompare(b.title),
  };
  mods = mods.sort(sorters[state.modSort] || sorters['date-desc']);

  list.innerHTML = mods.length
    ? `<div class="mod-list">${mods.map((m) => {
        const thumb = m.photos[0] || m.receipts[0];
        return `
        <div class="mod-row" role="button" tabindex="0" data-action="open-mod" data-id="${m.id}">
          <div class="mod-thumb">${thumb ? `<img src="${imgSrc(thumb)}" loading="lazy"${imgPos(thumb)}>` : ICON.wrench}</div>
          <div style="min-width:0">
            <h3>${esc(m.title)}</h3>
            <div class="meta">
              ${m.category ? `<span class="chip" style="background:${catColor(m.category)}22;color:${catColor(m.category)}">${esc(m.category)}</span>` : ''}
              ${m.date ? `<span>${ICON.calendar}${fmtDate(m.date)}</span>` : ''}
              ${hasKm(m.mileage) ? `<span title="Mileage">${ICON.gauge}${fmtKm(m.mileage)}</span>` : ''}
              <span title="Build photos">${ICON.camera}${m.photos.length}</span>
              <span title="Receipts">${ICON.receipt}${m.receipts.length}</span>
            </div>
          </div>
          <div class="right">
            <div class="row-actions">
              <button class="icon-btn" data-action="edit-mod" data-id="${m.id}" title="Edit">${ICON.edit}</button>
              <button class="icon-btn danger" data-action="delete-mod" data-id="${m.id}" title="Delete">${ICON.trash}</button>
            </div>
            <div class="price">${money(m.price)}</div>
          </div>
        </div>`;
      }).join('')}</div>`
    : `<div class="gallery-empty">No ${maintTab ? 'maintenance entries' : 'modifications'} match your search.</div>`;
}

function renderPlanList(car) {
  const list = $('#mod-list');
  if (!list) return;
  if (!car.plan.length) {
    list.innerHTML = `
      <div class="empty">
        <div style="color:var(--accent)">${ICON.wrench}</div>
        <h2>Nothing planned yet</h2>
        <div>Keep a wishlist of upgrades with estimated prices. It stays private and never goes into the PDF.</div>
        <button class="btn primary" data-action="add-plan">${ICON.plus} Add to plan</button>
      </div>`;
    return;
  }
  const order = { high: 0, medium: 1, low: 2 };
  const items = [...car.plan].sort((a, b) =>
    (order[a.priority] ?? 1) - (order[b.priority] ?? 1) || (a.createdAt || '').localeCompare(b.createdAt || ''));
  list.innerHTML = `
    <div class="mod-list">
      ${items.map((p) => `
        <div class="mod-row plan-row" role="button" tabindex="0" data-action="edit-plan" data-id="${p.id}">
          <div class="prio-bar" style="background:${PRIORITY_COLOR[p.priority] || PRIORITY_COLOR.medium}"></div>
          <div style="min-width:0">
            <h3>${esc(p.title)}</h3>
            <div class="meta">
              <span class="chip" style="background:${PRIORITY_COLOR[p.priority]}22;color:${PRIORITY_COLOR[p.priority]}">${PRIORITIES[p.priority] || 'Medium'}</span>
              ${p.category ? `<span>${esc(p.category)}</span>` : ''}
              ${/^https?:\/\//i.test(p.link || '') ? `<button class="link-btn" data-action="open-link" data-id="${p.id}" title="${esc(p.link)}">Open link ↗</button>` : ''}
            </div>
            ${p.notes ? `<div class="plan-notes">${esc(p.notes)}</div>` : ''}
          </div>
          <div class="right">
            <div class="row-actions">
              <button class="icon-btn danger" data-action="delete-plan" data-id="${p.id}" title="Remove">${ICON.trash}</button>
            </div>
            <div class="price">${p.price ? '~' + money(p.price) : '<span class="muted">—</span>'}</div>
            <button class="btn done-btn" data-action="done-plan" data-id="${p.id}" title="Move to modifications">✓ Done</button>
          </div>
        </div>`).join('')}
    </div>
    <div class="plan-total"><span>Estimated total</span><b>${money(planTotal(car))}</b></div>`;
}

function render() {
  renderCrumbs();
  const view = $('#view');
  if (state.view.name === 'car') {
    const car = carById(state.view.carId);
    if (!car) { state.view = { name: 'garage' }; return render(); }
    view.innerHTML = renderCar(car);
    if (state.carTab === 'plan') { renderPlanList(car); return; }
    if (state.carTab === 'timeline') { renderTimeline(car); return; }
    renderModList(car);
    $('#mod-search').addEventListener('input', (e) => { state.modSearch = e.target.value; renderModList(car); });
    $('#mod-sort').addEventListener('change', (e) => { state.modSort = e.target.value; renderModList(car); });
  } else if (state.view.name === 'public') {
    view.innerHTML = renderPublic();
  } else if (state.view.name === 'admin') {
    view.innerHTML = renderAdmin();
  } else if (state.view.name === 'admin-user') {
    view.innerHTML = renderAdminUser(state.view.userId);
  } else if (state.view.name === 'admin-car') {
    view.innerHTML = renderAdminCar(state.view.userId, state.view.carId);
  } else {
    view.innerHTML = renderGarage();
  }
}

// ======================================================================
//  Timeline tab: mileage and spending over time
//  Two charts on one shared time axis (different units never share a y-axis), hover tooltips,
//  and a month-by-month list underneath that doubles as the readable table version.
// ======================================================================

const TL_SPEND = '#f5532f'; // both checked against the dark chart surface (contrast + colour-blind safe)
const TL_KM = '#4f8ff7';
const isoDay = /^\d{4}-\d{2}-\d{2}$/;
const toTime = (iso) => new Date(iso + 'T12:00:00').getTime();
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function timelineData(car) {
  const dated = car.mods.filter((m) => isoDay.test(m.date || ''))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || '').localeCompare(b.createdAt || ''));
  let running = 0;
  const spend = [];
  for (const m of dated) {
    const price = Number(m.price) || 0;
    if (!price) continue;
    running += price;
    spend.push({ t: toTime(m.date), v: running, mod: m, delta: price });
  }
  const km = dated.filter((m) => hasKm(m.mileage)).map((m) => ({ t: toTime(m.date), v: Number(m.mileage), mod: m }));
  return { dated, spend, km, undated: car.mods.filter((m) => !isoDay.test(m.date || '')) };
}

// "Nice" round tick values covering lo..hi.
function niceTicks(lo, hi, count = 4) {
  const span = hi - lo || Math.abs(hi) || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((f) => f * mag).find((st) => st >= raw) || 10 * mag;
  const ticks = [];
  for (let v = Math.floor(lo / step) * step; v < hi + step * 0.999; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return ticks;
}

// Month ticks across the range, thinned to fit the width.
function monthTicks(t0, t1, maxTicks) {
  const start = new Date(t0); start.setDate(1); start.setHours(12, 0, 0, 0);
  const months = (new Date(t1).getFullYear() - start.getFullYear()) * 12 + new Date(t1).getMonth() - start.getMonth() + 1;
  const every = [1, 2, 3, 6, 12, 24].find((k) => months / k <= maxTicks) || 24;
  const out = [];
  const d = new Date(start);
  if (every >= 12) d.setMonth(0);
  else d.setMonth(Math.ceil(d.getMonth() / every) * every);
  for (; d.getTime() <= t1; d.setMonth(d.getMonth() + every)) {
    if (d.getTime() < t0) continue;
    const first = !out.length;
    out.push({ t: d.getTime(), label: every >= 12 ? String(d.getFullYear()) : `${MONTHS[d.getMonth()]}${d.getMonth() === 0 || first ? ' ' + String(d.getFullYear()).slice(2).padStart(3, "'") : ''}` });
  }
  return out;
}

const compactMoney = (v) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: state.db.settings.currency || 'EUR', notation: 'compact', maximumFractionDigits: 1 }).format(v);
  } catch { return String(Math.round(v)); }
};
const compactKm = (v) => new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(v);

const tlCharts = new Map(); // chart id → { points, X, Y, ... } for the hover layer

function tlChart({ id, title, sub, points, color, step, yFmt, tipValue, xMin, xMax, width }) {
  const H = 220, ml = 58, mr = 16, mt = 14, mb = 28;
  const w = Math.max(260, Math.round(width));
  const iw = w - ml - mr, ih = H - mt - mb;
  const vals = points.map((p) => p.v);
  let lo, hi;
  if (step) { lo = 0; hi = Math.max(...vals) * 1.06 || 1; }
  else {
    const pad = Math.max((Math.max(...vals) - Math.min(...vals)) * 0.12, 500);
    lo = Math.max(0, Math.min(...vals) - pad);
    hi = Math.max(...vals) + pad;
  }
  const yTicks = niceTicks(lo, hi, 4);
  lo = yTicks[0]; hi = yTicks[yTicks.length - 1];
  const X = (t) => ml + ((t - xMin) / (xMax - xMin)) * iw;
  const Y = (v) => mt + ih - ((v - lo) / (hi - lo || 1)) * ih;
  const r1 = (n) => Math.round(n * 10) / 10;

  let line;
  if (step) {
    // Cumulative spending: flat between purchases, a jump on each purchase.
    line = `M${r1(X(points[0].t))},${r1(Y(0))}`;
    for (const pt of points) line += ` H${r1(X(pt.t))} V${r1(Y(pt.v))}`;
    line += ` H${r1(X(xMax))}`;
  } else {
    line = points.map((pt, i) => `${i ? 'L' : 'M'}${r1(X(pt.t))},${r1(Y(pt.v))}`).join(' ');
  }
  const area = step ? `${line} V${r1(Y(lo))} H${r1(X(points[0].t))} Z` : '';
  const xt = monthTicks(xMin, xMax, Math.max(3, Math.floor(iw / 56)));

  tlCharts.set(id, { points, X, Y, color, tipValue, ml, mr, mt, ih, w });
  return `
    <figure class="tl-chart" data-chart="${id}">
      <figcaption><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</figcaption>
      <div class="tl-plot">
        <svg width="${w}" height="${H}" viewBox="0 0 ${w} ${H}" role="img" aria-label="${esc(title)}">
          <defs><linearGradient id="${id}-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/>
          </linearGradient></defs>
          <g class="tl-grid">${yTicks.map((v) => `<line x1="${ml}" x2="${w - mr}" y1="${r1(Y(v))}" y2="${r1(Y(v))}"/>`).join('')}</g>
          <g class="tl-axis">
            ${yTicks.map((v) => `<text x="${ml - 8}" y="${r1(Y(v)) + 4}" text-anchor="end">${esc(yFmt(v))}</text>`).join('')}
            ${xt.map((x) => `<text x="${r1(X(x.t))}" y="${H - 8}" text-anchor="middle">${esc(x.label)}</text>`).join('')}
          </g>
          ${area ? `<path d="${area}" fill="url(#${id}-fill)"/>` : ''}
          <path d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
          <g class="tl-dots">${points.map((pt) => `<circle cx="${r1(X(pt.t))}" cy="${r1(Y(pt.v))}" r="4" fill="${color}"/>`).join('')}</g>
          <line class="tl-cross" x1="0" x2="0" y1="${mt}" y2="${mt + ih}" visibility="hidden"/>
          <circle class="tl-focus" r="6" fill="${color}" visibility="hidden"/>
          <rect class="tl-hit" x="${ml}" y="0" width="${iw}" height="${H}" fill="transparent"/>
        </svg>
        <div class="tl-tip" hidden></div>
      </div>
    </figure>`;
}

function attachTimelineHover(root) {
  $$('.tl-chart', root).forEach((fig) => {
    const c = tlCharts.get(fig.dataset.chart);
    if (!c) return;
    const svg = fig.querySelector('svg');
    const hit = fig.querySelector('.tl-hit');
    const cross = fig.querySelector('.tl-cross');
    const focus = fig.querySelector('.tl-focus');
    const tip = fig.querySelector('.tl-tip');
    const hide = () => { cross.setAttribute('visibility', 'hidden'); focus.setAttribute('visibility', 'hidden'); tip.hidden = true; };
    const show = (e) => {
      const box = svg.getBoundingClientRect();
      const x = (e.clientX - box.left) * (c.w / box.width);
      let best = c.points[0];
      for (const pt of c.points) if (Math.abs(c.X(pt.t) - x) < Math.abs(c.X(best.t) - x)) best = pt;
      const px = c.X(best.t), py = c.Y(best.v);
      cross.setAttribute('x1', px); cross.setAttribute('x2', px); cross.setAttribute('visibility', 'visible');
      focus.setAttribute('cx', px); focus.setAttribute('cy', py); focus.setAttribute('visibility', 'visible');
      tip.innerHTML = c.tipValue(best);
      tip.hidden = false;
      const sx = px * (box.width / c.w);
      const left = Math.min(Math.max(sx - tip.offsetWidth / 2, 0), box.width - tip.offsetWidth);
      tip.style.left = left + 'px';
      tip.style.top = Math.max(py * (box.height / 220) - tip.offsetHeight - 14, 0) + 'px';
    };
    hit.addEventListener('pointermove', show);
    hit.addEventListener('pointerdown', show);
    hit.addEventListener('pointerleave', hide);
  });
}

function renderTimeline(car) {
  const list = $('#mod-list');
  if (!list) return;
  const { dated, spend, km, undated } = timelineData(car);
  if (!dated.length) {
    list.innerHTML = `
      <div class="empty">
        <div style="color:var(--accent)">${ICON.calendar}</div>
        <h2>Nothing on the timeline yet</h2>
        <div>Give your modifications a date (and mileage) to see spending and kilometres over time.</div>
      </div>`;
    return;
  }

  // Headline numbers.
  const total = carTotal(car);
  const first = dated[0].date, last = dated[dated.length - 1].date;
  const months = Math.max(1, (toTime(last) - toTime(first)) / (30.44 * 86400000));
  const kmVals = km.map((p) => p.v);
  const kmSpan = kmVals.length > 1 ? Math.max(...kmVals) - Math.min(...kmVals) : 0;
  const spentInKmWindow = kmSpan
    ? spend.filter((p) => p.t >= km[0].t && p.t <= km[km.length - 1].t).reduce((n, p) => n + p.delta, 0)
    : 0;
  const tiles = [
    [money(total), 'Spent in total'],
    [months >= 1.5 ? money(total / months) : '—', 'Average per month'],
    kmSpan ? [`${kmSpan.toLocaleString()} km`, `Driven · ${compactKm(Math.min(...kmVals))} → ${compactKm(Math.max(...kmVals))}`] : null,
    kmSpan >= 100 ? [money(spentInKmWindow / kmSpan), 'Spent per km driven'] : null,
  ].filter(Boolean);

  // Shared time axis for both charts.
  const ts = [...spend, ...km].map((p) => p.t);
  let xMin = Math.min(...ts), xMax = Math.max(...ts);
  const padT = Math.max((xMax - xMin) * 0.03, 12 * 86400000);
  xMin -= padT; xMax += padT;
  const width = list.clientWidth - 30;
  const when = (pt) => `<span class="tl-tip-date">${fmtDate(pt.mod.date)}</span>`;

  const charts = [];
  if (spend.length) {
    charts.push(tlChart({
      id: 'tl-spend', title: 'Money spent', sub: 'running total', points: spend, color: TL_SPEND, step: true,
      yFmt: compactMoney, xMin, xMax, width,
      tipValue: (pt) => `${when(pt)}<b>${money(pt.v)}</b><span>+ ${money(pt.delta)} · ${esc(pt.mod.title)}</span>`,
    }));
  }
  if (km.length) {
    charts.push(tlChart({
      id: 'tl-km', title: 'Mileage', sub: 'km on the clock', points: km, color: TL_KM, step: false,
      yFmt: compactKm, xMin, xMax, width,
      tipValue: (pt) => `${when(pt)}<b>${pt.v.toLocaleString()} km</b><span>${esc(pt.mod.title)}</span>`,
    }));
  }
  const chartNote = !km.length ? 'Add mileage to your entries to see the mileage chart.'
    : !spend.length ? 'Add prices to your entries to see the spending chart.' : '';

  // Month-by-month list (newest first).
  const groups = new Map();
  for (const m of [...dated].reverse()) {
    const key = m.date.slice(0, 7);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }
  const monthName = (key) => `${new Date(key + '-15T12:00:00').toLocaleString(undefined, { month: 'long' })} ${key.slice(0, 4)}`;
  const item = (m) => `
    <div class="tl-item" role="button" tabindex="0" data-action="open-mod" data-id="${m.id}">
      <i style="background:${catColor(m.category || 'Other')}"></i>
      <div style="min-width:0">
        <b>${esc(m.title)}</b>
        <div class="meta">
          ${m.date ? `<span>${fmtDate(m.date)}</span>` : ''}
          ${hasKm(m.mileage) ? `<span>${fmtKm(m.mileage)}</span>` : ''}
          ${m.category ? `<span>${esc(m.category)}</span>` : ''}
        </div>
      </div>
      <span class="tl-price">${money(m.price)}</span>
    </div>`;

  list.innerHTML = `
    <div class="garage-stats tl-stats">${tiles.map(([v, l]) => `<div class="stat"><b>${v}</b><span>${esc(l)}</span></div>`).join('')}</div>
    <div class="tl-charts">${charts.join('')}</div>
    ${chartNote ? `<div class="muted tl-note">${chartNote}</div>` : ''}
    <div class="tl-list">
      ${[...groups].map(([key, mods]) => `
        <section class="tl-month">
          <h3>${esc(monthName(key))}<span>${mods.length} entr${mods.length === 1 ? 'y' : 'ies'} · ${money(sumPrice(mods))}</span></h3>
          ${mods.map(item).join('')}
        </section>`).join('')}
      ${undated.length ? `
        <section class="tl-month">
          <h3>No date<span>${undated.length} entr${undated.length === 1 ? 'y' : 'ies'} · ${money(sumPrice(undated))}</span></h3>
          ${undated.map(item).join('')}
        </section>` : ''}
    </div>`;
  attachTimelineHover(list);
}

// Charts are drawn to the page width: redraw when it changes.
let tlResize = 0;
window.addEventListener('resize', () => {
  clearTimeout(tlResize);
  tlResize = setTimeout(() => {
    if (state.view?.name === 'car' && state.carTab === 'timeline') renderTimeline(carById(state.view.carId));
  }, 150);
});

// ======================================================================
//  Sharing: public link + build card image
// ======================================================================

const slugify = (text) => String(text || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

// 12 random letters/digits (no look-alikes) — the secret part of a public link.
function newShareId() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  return [...crypto.getRandomValues(new Uint8Array(12))].map((b) => abc[b % abc.length]).join('');
}

// e.g. https://5uck1t.github.io/tuningbook/#/b/fiesta-st150-k3J9x2abQr7p — the readable name is
// decoration, only the id after the last "-" matters.
const shareLink = (car) => `${window.api.siteUrl}#/b/${slugify(car.name) ? slugify(car.name) + '-' : ''}${car.shareId}`;
const shareIdFromHash = () => (location.hash.match(/^#\/b\/(?:[^/]*-)?([A-Za-z0-9]{10,32})$/) || [])[1];

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older WebViews: copy through a temporary text field.
    const t = Object.assign(document.createElement('textarea'), { value: text });
    t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand('copy');
    t.remove();
    return ok;
  }
}

// Draws a photo into a box like object-fit: cover, keeping its "Adjust preview" point in view.
function drawFocused(g, bmp, pos, x, y, w, h) {
  const z = clampZoom(pos?.z);
  const fx = (pos ? clampPct(pos.x) : 50) / 100;
  const fy = (pos ? clampPct(pos.y) : 50) / 100;
  const scale = Math.max(w / bmp.width, h / bmp.height) * z;
  const vw = w / scale, vh = h / scale; // the part of the photo that fits, in photo pixels
  const sx = Math.min(Math.max(fx * bmp.width - vw / 2, 0), bmp.width - vw);
  const sy = Math.min(Math.max(fy * bmp.height - vh / 2, 0), bmp.height - vh);
  g.drawImage(bmp, sx, sy, vw, vh, x, y, w, h);
}

function fitText(g, text, maxWidth) {
  text = String(text || '');
  if (g.measureText(text).width <= maxWidth) return text;
  while (text.length > 1 && g.measureText(text + '…').width > maxWidth) text = text.slice(0, -1);
  return text.trimEnd() + '…';
}

// ---------- build card: a 1080 × 1920 "trading card" (Instagram story size) ----------
// Portrait photo → the photo fills the card and the stats sit on top of it.
// Landscape photo → the photo is a window at the top, name / stats / mods below it.

const CARD_W = 1080, CARD_H = 1920;
const CARD = { x: 60, y: 150, w: 960, h: 1620, r: 48 };                                        // the card on the canvas
const CARD_PHOTO_TALL = { x: CARD.x + 14, y: CARD.y + 14, w: CARD.w - 28, h: CARD.h - 28, r: 36 }; // portrait layout
const CARD_PHOTO_WIDE = { x: CARD.x + 40, y: CARD.y + 130, w: CARD.w - 80, h: 620, r: 28 };        // landscape layout
const isWide = (w, h) => w >= h * 1.05;
const cardTier = (mods) => (mods >= 30 ? 'LEGEND' : mods >= 15 ? 'BUILT' : mods >= 5 ? 'STREET' : 'STOCK+');

// Photos a card can use: the car's cover, then build photos (newest modification first).
function cardPhotos(car) {
  const seen = new Set();
  const out = [];
  const byDate = [...car.mods].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  for (const img of [car.cover, ...byDate.flatMap((m) => m.photos)]) {
    if (img?.file && !seen.has(img.file)) { seen.add(img.file); out.push(img); }
  }
  return out;
}

function defaultCardMods(car, showPrices) {
  const mods = [...car.mods];
  if (showPrices) mods.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  else mods.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return mods.slice(0, 4).map((m) => m.id);
}

// The card choices (photo, its position on the card, which mods, prices) are remembered per car
// on this device.
const cardKey = (car) => `tb-card-${car.id}`;
function loadCardSettings(car) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(cardKey(car)) || '{}') || {}; } catch { /* storage unavailable */ }
  const photo = cardPhotos(car).find((p) => p.file === saved.photo) || carCover(car) || null;
  const showPrices = typeof saved.showPrices === 'boolean' ? saved.showPrices : car.sharePrices !== false;
  const ids = new Set(car.mods.map((m) => m.id));
  const mods = Array.isArray(saved.mods) ? saved.mods.filter((id) => ids.has(id)).slice(0, 4) : defaultCardMods(car, showPrices);
  const pos = photo && saved.photo === photo.file && saved.pos ? saved.pos : photo?.pos || null;
  const style = CARD_STYLES.some((x) => x.id === saved.style) ? saved.style : 'classic';
  const colour = saved.colour in CARD_COLOURS ? saved.colour : 'orange';
  return { photo, pos, mods, showPrices, style, colour };
}
function saveCardSettings(car, c) {
  try {
    localStorage.setItem(cardKey(car), JSON.stringify({
      photo: c.photo?.file || null, pos: c.pos || null, mods: c.mods, showPrices: c.showPrices, style: c.style, colour: c.colour,
    }));
  } catch { /* storage unavailable */ }
}

const cardBitmaps = new Map(); // file → Promise<ImageBitmap>, so redrawing doesn't download again
function cardBitmap(img) {
  if (!cardBitmaps.has(img.file)) {
    const p = (async () => createImageBitmap(new Blob([await window.api.readImage(img.file)]), { imageOrientation: 'from-image' }))();
    p.catch(() => cardBitmaps.delete(img.file));
    cardBitmaps.set(img.file, p);
  }
  return cardBitmaps.get(img.file);
}

const roundRectPath = (g, b) => { g.beginPath(); g.roundRect(b.x, b.y, b.w, b.h, b.r); };

// Largest font size (down to `min`) at which text fits `maxWidth`.
function fitFont(g, text, weight, size, min, maxWidth, family) {
  for (; size > min; size -= 2) {
    g.font = `${weight} ${size}px ${family}`;
    if (g.measureText(text).width <= maxWidth) return size;
  }
  g.font = `${weight} ${min}px ${family}`;
  return min;
}

// ---------- card styles ----------

const CARD_COLOURS = {
  orange: '#ff5a36', red: '#e63946', blue: '#3b82f6', green: '#22c55e',
  purple: '#a855f7', gold: '#e0a526', silver: '#a3a9b6',
};
// `colour: true` → the style uses the chosen colour; Holo and Retro have their own palettes.
const CARD_STYLES = [
  { id: 'classic', name: 'Classic', colour: true },
  { id: 'holo', name: 'Holo', colour: false },
  { id: 'carbon', name: 'Carbon', colour: true },
  { id: 'neon', name: 'Neon', colour: true },
  { id: 'retro', name: 'Retro', colour: false },
  { id: 'minimal', name: 'Minimal', colour: true },
];
const RAINBOW = ['#ff4d6d', '#ffb347', '#fff275', '#5ef38c', '#4dd9ff', '#7b6bff', '#ff6bd6', '#ff4d6d'];

const hexRgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgba = (hex, a) => `rgba(${hexRgb(hex).join(',')},${a})`;
// Blend hex colour `a` toward `b` by t (0–1).
const mixHex = (a, b, t) => '#' + hexRgb(a).map((v, i) => Math.round(v + (hexRgb(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');

// Everything the drawing code needs to know about a style. `frame` / `badge` are painters:
// (g, x, y, w, h) → a fill/stroke style for that box.
function cardTheme(styleId, colourId) {
  const A = CARD_COLOURS[colourId] || CARD_COLOURS.orange;
  const linear = (stops) => (g, x, y, w, h) => {
    const gr = g.createLinearGradient(x, y, x + w, y + h);
    stops.forEach(([o, c]) => gr.addColorStop(o, c));
    return gr;
  };
  const rainbow = (g, x, y, w, h) => {
    const gr = g.createConicGradient(0.9, x + w / 2, y + h / 2);
    RAINBOW.forEach((c, i) => gr.addColorStop(i / (RAINBOW.length - 1), c));
    return gr;
  };
  const solid = (c) => () => c;
  const accentFoil = linear([[0, A], [0.3, mixHex(A, '#ffffff', 0.55)], [0.55, A], [0.8, mixHex(A, '#ffffff', 0.4)], [1, mixHex(A, '#000000', 0.4)]]);
  const base = {
    dark: true, body: '#14171e', shade: '#0a0c10', accent: A, price: A,
    text: '#ffffff', sub: '#b9bfcc', muted: '#9aa1ae', title: '#eceef3',
    statFill: 'rgba(255,255,255,.05)', statFillTall: 'rgba(12,14,19,.62)', statStroke: 'rgba(255,255,255,.09)',
    sep: 'rgba(255,255,255,.07)', frameWidth: 10, frame: accentFoil, badge: accentFoil, badgeText: '#fff',
    glow: A, logoBg: A, italic: false,
  };
  switch (styleId) {
    case 'holo':
      return { ...base, accent: '#7fe3ff', price: '#ffffff', body: '#141826', frame: rainbow, badge: rainbow, badgeText: '#14171e', glow: '#7b6bff', logoBg: '#7b6bff', holo: true, frameWidth: 12 };
    case 'carbon':
      return {
        ...base, carbon: true, frameWidth: 9,
        frame: linear([[0, '#eef0f3'], [0.25, '#8b929c'], [0.5, '#f5f6f8'], [0.75, '#6b7280'], [1, '#d9dde3']]),
        badge: linear([[0, A], [1, mixHex(A, '#000000', 0.35)]]),
        statFill: 'rgba(255,255,255,.06)',
      };
    case 'neon':
      return { ...base, body: '#0b0714', shade: '#07040d', neon: true, frame: solid(A), badge: solid(A), glow: A, frameWidth: 6, sub: '#c9c2dd', muted: '#a39cba' };
    case 'retro': {
      const [R1, R2, R3] = ['#e8743b', '#c8423a', '#7a3e2b'];
      return {
        ...base, dark: false, body: '#f3e8cf', shade: '#efe2c4', accent: R2, price: '#2b2118',
        text: '#2b2118', sub: '#6b5a4a', muted: '#8a7764', title: '#2b2118',
        statFill: 'rgba(43,33,24,.06)', statFillTall: 'rgba(243,232,207,.85)', statStroke: 'rgba(43,33,24,.16)',
        sep: 'rgba(43,33,24,.12)', frame: solid('#3b2a20'), frameWidth: 12, badge: solid(R2),
        glow: R1, logoBg: R2, italic: true, stripes: [R1, R2, R3],
      };
    }
    case 'minimal':
      return {
        ...base, dark: false, body: '#ffffff', shade: '#ffffff', price: '#111318',
        text: '#111318', sub: '#5b6170', muted: '#8a909c', title: '#1b1e25',
        statFill: '#f4f5f7', statFillTall: 'rgba(255,255,255,.86)', statStroke: '#e6e8ec', sep: '#eceef1',
        frame: solid('#dfe2e7'), frameWidth: 4, badge: solid(A),
      };
    default:
      return base;
  }
}

// A small repeating carbon-fibre weave.
function carbonPattern(g) {
  const c = Object.assign(document.createElement('canvas'), { width: 28, height: 28 });
  const x = c.getContext('2d');
  x.fillStyle = '#0d0e10';
  x.fillRect(0, 0, 28, 28);
  const cell = (px, py, across) => {
    const gr = across ? x.createLinearGradient(px, py, px, py + 14) : x.createLinearGradient(px, py, px + 14, py);
    gr.addColorStop(0, '#2c2f35');
    gr.addColorStop(0.5, '#1a1c20');
    gr.addColorStop(1, '#0f1012');
    x.fillStyle = gr;
    x.fillRect(px + 1, py + 1, 12, 12);
  };
  cell(0, 0, true); cell(14, 14, true); cell(14, 0, false); cell(0, 14, false);
  return g.createPattern(c, 'repeat');
}

// Same "random" sparkles every time for the same car.
function seededRandom(seed) {
  let h = 2166136261;
  for (const ch of String(seed)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}
function drawSparkle(g, x, y, r) {
  g.beginPath();
  g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r);
  g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r);
  g.fill();
}

async function makeBuildCard(car, settings) {
  const { photo, pos, showPrices } = settings;
  const T = cardTheme(settings.style, settings.colour);
  const canvas = Object.assign(document.createElement('canvas'), { width: CARD_W, height: CARD_H });
  const g = canvas.getContext('2d');
  const FONT = '"Segoe UI", system-ui, -apple-system, Roboto, sans-serif';
  const M = 44; // inner margin
  const left = CARD.x + M, right = CARD.x + CARD.w - M, innerW = CARD.w - 2 * M;
  const spaced = (px) => { if ('letterSpacing' in g) g.letterSpacing = px; };
  const nameStyle = T.italic ? 'italic 800' : '800';

  let bmp = null;
  if (photo) {
    try { bmp = await cardBitmap(photo); } catch (err) { console.warn('Build card: photo unavailable', err); }
  }
  const wide = !bmp || isWide(bmp.width, bmp.height);

  // Background: the photo, blurred, behind the card + a glow in the style's colour.
  g.fillStyle = '#0b0d11';
  g.fillRect(0, 0, CARD_W, CARD_H);
  if (bmp) {
    g.save();
    g.filter = 'blur(50px) saturate(1.3)';
    g.globalAlpha = 0.5;
    drawFocused(g, bmp, pos, -100, -100, CARD_W + 200, CARD_H + 200);
    g.restore();
  }
  const glow = g.createRadialGradient(CARD_W / 2, 0, 0, CARD_W / 2, 0, 1200);
  glow.addColorStop(0, rgba(T.glow, 0.32));
  glow.addColorStop(1, rgba(T.glow, 0));
  g.fillStyle = glow;
  g.fillRect(0, 0, CARD_W, CARD_H);

  // Card body.
  g.save();
  g.shadowColor = 'rgba(0,0,0,.65)';
  g.shadowBlur = 70;
  g.shadowOffsetY = 24;
  roundRectPath(g, CARD);
  g.fillStyle = T.body;
  g.fill();
  g.restore();
  g.save();
  roundRectPath(g, CARD);
  g.clip();
  if (T.carbon) {
    g.fillStyle = carbonPattern(g);
    g.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  }
  const sheen = g.createLinearGradient(CARD.x, CARD.y, CARD.x + CARD.w, CARD.y + CARD.h);
  sheen.addColorStop(0, T.dark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.5)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0)');
  sheen.addColorStop(1, rgba(T.accent, T.dark ? 0.07 : 0.06));
  g.fillStyle = sheen;
  g.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  g.restore();

  // Photo.
  const box = wide ? CARD_PHOTO_WIDE : CARD_PHOTO_TALL;
  g.save();
  roundRectPath(g, box);
  g.clip();
  if (bmp) {
    drawFocused(g, bmp, pos, box.x, box.y, box.w, box.h);
  } else {
    g.fillStyle = T.dark ? '#1c2029' : rgba(T.text, 0.06);
    g.fillRect(box.x, box.y, box.w, box.h);
    g.fillStyle = T.muted;
    g.font = `600 34px ${FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('No photo yet', box.x + box.w / 2, box.y + box.h / 2);
    g.textAlign = 'left';
  }
  if (!wide) {
    // Fade the photo into the card colour behind the header and the stats.
    let shade = g.createLinearGradient(0, box.y, 0, box.y + 260);
    shade.addColorStop(0, rgba(T.shade, 0.82));
    shade.addColorStop(1, rgba(T.shade, 0));
    g.fillStyle = shade;
    g.fillRect(box.x, box.y, box.w, 260);
    // Light styles need a stronger, earlier fade: dark text on a dark photo would be unreadable.
    shade = g.createLinearGradient(0, box.y + box.h * (T.dark ? 0.36 : 0.3), 0, box.y + box.h);
    shade.addColorStop(0, rgba(T.shade, 0));
    shade.addColorStop(T.dark ? 0.42 : 0.36, rgba(T.shade, T.dark ? 0.86 : 0.94));
    shade.addColorStop(1, rgba(T.shade, T.dark ? 0.97 : 0.99));
    g.fillStyle = shade;
    g.fillRect(box.x, box.y, box.w, box.h);
  }
  g.restore();
  if (wide) {
    roundRectPath(g, box);
    g.strokeStyle = T.dark ? 'rgba(255,255,255,.16)' : rgba(T.text, 0.2);
    g.lineWidth = 3;
    g.stroke();
  }

  // Holo: rainbow foil shimmer and sparkles over the card.
  if (T.holo) {
    g.save();
    roundRectPath(g, CARD);
    g.clip();
    g.globalCompositeOperation = 'soft-light';
    const foil = g.createLinearGradient(CARD.x, CARD.y + CARD.h, CARD.x + CARD.w, CARD.y);
    RAINBOW.forEach((c, i) => foil.addColorStop(i / (RAINBOW.length - 1), c));
    g.globalAlpha = 0.75;
    g.fillStyle = foil;
    g.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
    g.globalCompositeOperation = 'screen';
    g.globalAlpha = 0.16;
    for (let i = 0; i < 6; i++) {
      const band = g.createLinearGradient(CARD.x, CARD.y + i * 300, CARD.x + CARD.w, CARD.y + i * 300 + 400);
      band.addColorStop(0, 'rgba(255,255,255,0)');
      band.addColorStop(0.5, 'rgba(255,255,255,1)');
      band.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = band;
      g.fillRect(CARD.x, CARD.y + i * 300 - 60, CARD.w, 120);
    }
    g.globalCompositeOperation = 'source-over';
    const rnd = seededRandom(car.id);
    for (let i = 0; i < 26; i++) {
      g.globalAlpha = 0.35 + rnd() * 0.55;
      g.fillStyle = '#ffffff';
      drawSparkle(g, CARD.x + 30 + rnd() * (CARD.w - 60), CARD.y + 30 + rnd() * (CARD.h - 60), 6 + rnd() * 14);
    }
    g.restore();
  }

  // Retro: racing stripes down the right side.
  if (T.stripes) {
    g.save();
    roundRectPath(g, CARD);
    g.clip();
    T.stripes.forEach((c, i) => {
      g.fillStyle = c;
      g.fillRect(CARD.x + CARD.w - 34 - i * 22, CARD.y, 14, CARD.h);
    });
    g.restore();
  }

  // Frame.
  g.save();
  if (T.neon) {
    g.shadowColor = T.accent;
    g.shadowBlur = 40;
  }
  roundRectPath(g, CARD);
  g.strokeStyle = T.frame(g, CARD.x, CARD.y, CARD.w, CARD.h);
  g.lineWidth = T.frameWidth;
  g.stroke();
  if (T.neon) {
    g.shadowBlur = 0;
    g.strokeStyle = 'rgba(255,255,255,.7)';
    g.lineWidth = 2;
    g.stroke();
  }
  g.restore();
  if (T.stripes) {
    roundRectPath(g, { x: CARD.x + 18, y: CARD.y + 18, w: CARD.w - 36, h: CARD.h - 36, r: 34 });
    g.strokeStyle = 'rgba(59,42,32,.35)';
    g.lineWidth = 2;
    g.stroke();
  }

  // Header: logo + class badge.
  const hy = CARD.y + 66;
  g.fillStyle = T.logoBg;
  g.beginPath(); g.roundRect(left, hy - 30, 60, 60, 15); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 4.5; g.lineCap = 'round';
  g.beginPath(); g.arc(left + 30, hy, 18, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.arc(left + 30, hy, 4.5, 0, Math.PI * 2); g.stroke();
  g.beginPath();
  g.moveTo(left + 30, hy - 18); g.lineTo(left + 30, hy - 5);
  g.moveTo(left + 14.4, hy + 9); g.lineTo(left + 26, hy + 2.3);
  g.moveTo(left + 45.6, hy + 9); g.lineTo(left + 34, hy + 2.3);
  g.stroke();
  g.textBaseline = 'middle';
  g.font = `${T.italic ? 'italic ' : ''}700 38px ${FONT}`;
  g.fillStyle = T.text;
  g.fillText('Tuning', left + 78, hy + 1);
  g.fillStyle = T.accent;
  g.fillText('Book', left + 78 + g.measureText('Tuning').width, hy + 1);

  const tier = cardTier(car.mods.length);
  g.font = `800 26px ${FONT}`;
  spaced('4px');
  const tw = g.measureText(tier).width + 48;
  const badgeRight = T.stripes ? right - 70 : right;
  g.save();
  if (T.neon) { g.shadowColor = T.accent; g.shadowBlur = 24; }
  g.beginPath(); g.roundRect(badgeRight - tw, hy - 26, tw, 52, 26);
  g.fillStyle = T.badge(g, badgeRight - tw, hy - 26, tw, 52);
  g.fill();
  g.restore();
  g.fillStyle = T.neon ? '#0b0714' : T.badgeText;
  g.textAlign = 'center';
  g.fillText(tier, badgeRight - tw / 2 + 2, hy + 1);
  g.textAlign = 'left';
  spaced('0px');

  // Text block.
  const textRight = T.stripes ? right - 70 : right;
  const textW = textRight - left;
  const picked = settings.mods.map((id) => car.mods.find((m) => m.id === id)).filter(Boolean);
  const subtitle = carSubtitle(car);
  const STATS_H = 150, ROW = 70;
  const blockH = 104 + (subtitle ? 56 : 0) + 30 + STATS_H + (picked.length ? 44 + 46 + picked.length * ROW : 0);
  const footerY = CARD.y + CARD.h - 62;
  let y = wide ? box.y + box.h + 46 : footerY - 64 - blockH;

  g.textBaseline = 'top';
  fitFont(g, car.name, nameStyle, 92, 56, textW, FONT);
  g.save();
  if (T.neon) { g.shadowColor = T.accent; g.shadowBlur = 28; }
  g.fillStyle = T.text;
  g.fillText(fitText(g, car.name, textW), left, y);
  g.restore();
  y += 104;
  if (subtitle) {
    g.font = `500 38px ${FONT}`;
    g.fillStyle = T.sub;
    g.fillText(fitText(g, subtitle, textW), left, y);
    y += 56;
  }
  y += 30;

  // Stat boxes.
  const km = lastMileage(car);
  const photosCount = car.mods.reduce((n, m) => n + m.photos.length, 0);
  const stats = [
    ['MODS', String(car.mods.length)],
    showPrices ? ['INVESTED', money(carTotal(car))] : ['PHOTOS', String(photosCount)],
    km !== null ? ['KM', Number(km).toLocaleString()] : ['YEAR', String(car.year || '—')],
  ];
  const gap = 20, bw = (textW - 2 * gap) / 3;
  stats.forEach(([label, value], i) => {
    const bx = left + i * (bw + gap);
    g.beginPath(); g.roundRect(bx, y, bw, STATS_H, 22);
    g.fillStyle = wide ? T.statFill : T.statFillTall;
    g.fill();
    g.strokeStyle = T.neon ? rgba(T.accent, 0.45) : T.statStroke;
    g.lineWidth = 2;
    g.stroke();
    g.textAlign = 'center';
    fitFont(g, value, 800, 54, 30, bw - 28, FONT);
    g.fillStyle = i === 1 && showPrices ? T.accent : T.text;
    g.fillText(value, bx + bw / 2, y + 30);
    g.font = `700 22px ${FONT}`;
    spaced('3px');
    g.fillStyle = T.muted;
    g.fillText(label, bx + bw / 2, y + 102);
    spaced('0px');
    g.textAlign = 'left';
  });
  y += STATS_H;

  // Top mods.
  if (picked.length) {
    y += 44;
    g.font = `800 24px ${FONT}`;
    spaced('4px');
    g.fillStyle = T.accent;
    g.fillText('TOP MODS', left, y);
    spaced('0px');
    y += 46;
    picked.forEach((m, i) => {
      const cy = y + ROW / 2;
      if (i) {
        g.fillStyle = T.sep;
        g.fillRect(left, y, textW, 2);
      }
      g.beginPath(); g.arc(left + 24, cy, 22, 0, Math.PI * 2);
      g.fillStyle = rgba(T.accent, T.dark ? 0.18 : 0.14); g.fill();
      g.fillStyle = T.accent;
      g.font = `800 24px ${FONT}`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(String(i + 1), left + 24, cy + 1);
      g.textAlign = 'left';
      const price = showPrices ? money(m.price) : (m.category || '');
      g.font = `${showPrices ? 700 : 500} 32px ${FONT}`;
      const pw = price ? g.measureText(price).width + 24 : 0;
      if (price) {
        g.fillStyle = showPrices ? T.price : T.muted;
        g.textAlign = 'right';
        g.fillText(fitText(g, price, 300), textRight, cy + 1);
        g.textAlign = 'left';
      }
      g.font = `600 34px ${FONT}`;
      g.fillStyle = T.title;
      g.fillText(fitText(g, m.title, textW - 64 - Math.min(pw, 324)), left + 64, cy + 1);
      g.textBaseline = 'top';
      y += ROW;
    });
  }

  // Footer.
  const site = window.api.siteUrl ? window.api.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';
  g.fillStyle = T.sep;
  g.fillRect(left, footerY - 40, textW, 2);
  g.textBaseline = 'middle';
  g.font = `500 26px ${FONT}`;
  g.fillStyle = T.muted;
  g.fillText('Track your build with TuningBook', left, footerY);
  if (site) {
    g.textAlign = 'right';
    g.fillStyle = T.sub;
    g.fillText(site, textRight, footerY);
    g.textAlign = 'left';
  }
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
}

// CSS for the little style swatches in the designer.
function styleSwatchCss(styleId, colourId) {
  const A = CARD_COLOURS[colourId] || CARD_COLOURS.orange;
  switch (styleId) {
    case 'holo': return `background:conic-gradient(from 200deg, ${RAINBOW.join(',')})`;
    case 'carbon': return 'background:repeating-linear-gradient(45deg,#2a2c31 0 6px,#121316 6px 12px);border-color:#c9ced6';
    case 'neon': return `background:#0b0714;border-color:${A};box-shadow:0 0 12px ${A}, inset 0 0 8px ${rgba(A, 0.6)}`;
    case 'retro': return 'background:linear-gradient(90deg,#f3e8cf 0 58%,#7a3e2b 58% 68%,#c8423a 68% 78%,#e8743b 78% 88%,#f3e8cf 88%);border-color:#3b2a20';
    case 'minimal': return `background:#fff;border-color:#dfe2e7;box-shadow:inset 0 -10px 0 ${A}`;
    default: return `background:linear-gradient(135deg, ${A}, ${mixHex(A, '#ffffff', 0.5)} 45%, #14171e 46%)`;
  }
}

const cardFileName = (car) => `${slugify(car.name) || 'tuningbook'}-card.jpg`;
async function saveCard(car, blob) {
  const res = await window.api.saveFile(cardFileName(car), new Uint8Array(await blob.arrayBuffer()), 'image/jpeg');
  if (res?.ok && res.message) toast(res.message, 4000);
}
const canShareCard = (car, blob) => !IS_ANDROID && !!navigator.canShare?.({ files: [new File([blob], cardFileName(car), { type: 'image/jpeg' })] });
async function shareCard(car, blob) {
  try {
    await navigator.share({ files: [new File([blob], cardFileName(car), { type: 'image/jpeg' })], title: car.name });
  } catch { /* cancelled */ }
}

// The card designer: choose the photo (and its framing on the card), up to 4 mods, prices.
function openCardDesigner(car, { onClose } = {}) {
  const c = loadCardSettings(car);
  const photos = cardPhotos(car);
  const modsByPrice = [...car.mods].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  let card = null;
  let drawing = 0;
  let timer = 0;
  const m = openModal(`
    ${modalHead('Build card')}
    <div class="modal-body card-designer">
      <div class="cd-preview"><span class="muted">Drawing…</span></div>
      <div class="cd-controls">
        <div class="field">
          <label>Photo</label>
          ${photos.length ? `
          <div class="cd-photos">${photos.map((p, i) => `
            <button type="button" data-photo="${i}" title="${esc(p.name || '')}"><img src="${imgSrc(p)}" loading="lazy"${imgPos(p)} alt=""></button>`).join('')}
          </div>
          <button class="btn" type="button" data-adjust>${ICON.move} Adjust photo on the card</button>` : '<div class="muted">Add build photos to put one on the card.</div>'}
        </div>
        <div class="field">
          <label>Mods on the card <span class="muted cd-count"></span></label>
          ${car.mods.length ? `<div class="cd-mods">${modsByPrice.map((mod) => `
            <label class="check"><input type="checkbox" data-mod="${mod.id}"><span>${esc(mod.title)}</span><b>${money(mod.price)}</b></label>`).join('')}
          </div>` : '<div class="muted">No modifications yet.</div>'}
        </div>
        <div class="field">
          <label>Style</label>
          <div class="cd-styles">${CARD_STYLES.map((st) => `
            <button type="button" data-style="${st.id}"><i></i><span>${st.name}</span></button>`).join('')}
          </div>
        </div>
        <div class="field cd-colour-field">
          <label>Colour</label>
          <div class="cd-colours">${Object.entries(CARD_COLOURS).map(([id, hex]) => `
            <button type="button" data-colour="${id}" title="${id[0].toUpperCase() + id.slice(1)}" style="background:${hex}"></button>`).join('')}
          </div>
        </div>
        <label class="check"><input type="checkbox" data-prices ${c.showPrices ? 'checked' : ''}> Show prices</label>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn ghost" data-reset>Reset</button>
      <span class="spacer"></span>
      <button class="btn" data-close>Close</button>
      <button class="btn" data-share-card hidden>Share…</button>
      <button class="btn primary" data-download disabled>${ICON.download} ${IS_ANDROID ? 'Share / save' : 'Download'}</button>
    </div>`, {
    className: 'wide',
    dismissable: true,
    onClose: () => { clearTimeout(timer); if (card) URL.revokeObjectURL(card.url); onClose?.(); },
  });

  const sync = () => {
    $$('[data-photo]', m.el).forEach((b) => b.classList.toggle('on', photos[Number(b.dataset.photo)]?.file === c.photo?.file));
    $$('[data-mod]', m.el).forEach((box) => {
      box.checked = c.mods.includes(box.dataset.mod);
      box.disabled = !box.checked && c.mods.length >= 4;
      box.closest('label').classList.toggle('disabled', box.disabled);
    });
    const count = $('.cd-count', m.el);
    if (count) count.textContent = `${c.mods.length} / 4`;
    $$('[data-style]', m.el).forEach((b) => {
      b.classList.toggle('on', b.dataset.style === c.style);
      b.querySelector('i').style.cssText = styleSwatchCss(b.dataset.style, c.colour);
    });
    $$('[data-colour]', m.el).forEach((b) => b.classList.toggle('on', b.dataset.colour === c.colour));
    $('.cd-colour-field', m.el).classList.toggle('off', !CARD_STYLES.find((st) => st.id === c.style)?.colour);
    $('[data-adjust]', m.el)?.toggleAttribute('disabled', !c.photo);
  };

  const redraw = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const mine = ++drawing;
      const blob = await makeBuildCard(car, c);
      if (mine !== drawing || !blob || !m.el.isConnected) return;
      if (card) URL.revokeObjectURL(card.url);
      card = { blob, url: URL.createObjectURL(blob) };
      $('.cd-preview', m.el).innerHTML = `<img src="${card.url}" alt="Build card preview">`;
      $('[data-download]', m.el).disabled = false;
      $('[data-share-card]', m.el).hidden = !canShareCard(car, blob);
    }, 120);
  };
  const changed = () => { saveCardSettings(car, c); sync(); redraw(); };

  m.el.addEventListener('change', (e) => {
    if (e.target.matches('[data-mod]')) {
      const id = e.target.dataset.mod;
      c.mods = e.target.checked ? [...c.mods.filter((x) => x !== id), id].slice(0, 4) : c.mods.filter((x) => x !== id);
      changed();
    } else if (e.target.matches('[data-prices]')) {
      c.showPrices = e.target.checked;
      changed();
    }
  });

  m.el.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.style) {
      c.style = b.dataset.style;
      changed();
    } else if (b.dataset.colour) {
      c.colour = b.dataset.colour;
      changed();
    } else if (b.dataset.photo !== undefined) {
      c.photo = photos[Number(b.dataset.photo)];
      c.pos = c.photo.pos || null;
      changed();
    } else if (b.matches('[data-adjust]') && c.photo) {
      let wide = true;
      try { const bmp = await cardBitmap(c.photo); wide = isWide(bmp.width, bmp.height); } catch { /* keep wide */ }
      const pos = await editImagePosition({ ...c.photo, pos: c.pos || undefined }, { frames: [[wide ? 'card-wide' : 'card-tall', 'On the card']] });
      if (pos) { c.pos = pos; changed(); }
    } else if (b.matches('[data-reset]')) {
      try { localStorage.removeItem(cardKey(car)); } catch { /* storage unavailable */ }
      Object.assign(c, loadCardSettings(car));
      $('[data-prices]', m.el).checked = c.showPrices;
      sync();
      redraw();
    } else if (b.matches('[data-download]') && card) {
      saveCard(car, card.blob);
    } else if (b.matches('[data-share-card]') && card) {
      shareCard(car, card.blob);
    }
  });

  sync();
  redraw();
}

function openShare(car) {
  let card = null; // { blob, url }
  let drawing = 0;
  const m = openModal(`
    ${modalHead('Share build')}
    <div class="modal-body share-body"></div>
    <div class="modal-foot"><button class="btn" data-close>Done</button></div>`, {
    className: 'small',
    dismissable: true,
    onClose: () => { if (card) URL.revokeObjectURL(card.url); },
  });
  const body = $('.share-body', m.el);
  const showPrices = () => car.sharePrices !== false;

  const draw = () => {
    const shared = !!car.shareId;
    body.innerHTML = `
      <section class="share-option">
        <div class="share-ico">${ICON.link}</div>
        <div class="share-main">
          <h3>Public link</h3>
          <p class="muted">Anyone with the link can see this car’s photos and modifications${showPrices() ? ' with prices' : ''}.
            Receipts, the plan and notes stay private.</p>
          <label class="check"><input type="checkbox" data-prices ${showPrices() ? 'checked' : ''}> Show prices on the public page</label>
          ${shared ? `
            <div class="share-link"><input type="text" readonly value="${esc(shareLink(car))}"><button class="btn primary" data-copy>Copy link</button></div>
            <div class="share-row">
              <button class="btn ghost" data-open-link>Open page</button>
              <button class="btn ghost danger" data-stop>Stop sharing</button>
            </div>` : `
            <button class="btn primary" data-create>${ICON.link} Create &amp; copy link</button>`}
        </div>
      </section>
      <section class="share-option">
        <div class="share-ico">${ICON.image}</div>
        <div class="share-main">
          <h3>Build card</h3>
          <p class="muted">A trading-card style image, sized for Instagram stories (1080 × 1920).</p>
          <div class="share-card">
            <div class="card-preview">${card ? `<img src="${card.url}" alt="Build card preview">` : '<span class="muted">Drawing…</span>'}</div>
            <div class="share-card-actions">
              <button class="btn" data-customize>${ICON.edit} Customize card</button>
              <button class="btn primary" data-card ${card ? '' : 'disabled'}>${ICON.download} ${IS_ANDROID ? 'Share / save image' : 'Download image'}</button>
              ${card && canShareCard(car, card.blob) ? '<button class="btn" data-card-share>Share…</button>' : ''}
            </div>
          </div>
        </div>
      </section>`;
  };

  const redrawCard = async () => {
    const mine = ++drawing;
    const blob = await makeBuildCard(car, loadCardSettings(car));
    if (mine !== drawing || !blob) return;
    if (card) URL.revokeObjectURL(card.url);
    card = { blob, url: URL.createObjectURL(blob) };
    if (m.el.isConnected) draw();
  };

  // Saves the car; if sharing isn't set up in the database yet, undoes the change and says so.
  const saveSharing = async (undo) => {
    try {
      await window.api.save(state.db);
      return true;
    } catch (err) {
      undo();
      draw();
      toast(/share_(id|prices)/.test(err.message)
        ? 'Sharing isn’t set up yet — run web/supabase/004-sharing.sql in Supabase first.'
        : 'Saving failed: ' + err.message, 7000);
      return false;
    }
  };

  body.addEventListener('change', async (e) => {
    if (!e.target.matches('[data-prices]')) return;
    const before = showPrices();
    car.sharePrices = e.target.checked;
    draw();
    if (car.shareId) await saveSharing(() => { car.sharePrices = before; });
  });

  body.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.matches('[data-create]')) {
      const had = 'shareId' in car;
      car.shareId = newShareId();
      car.sharePrices = showPrices();
      btn.disabled = true;
      if (!(await saveSharing(() => { if (had) car.shareId = null; else { delete car.shareId; delete car.sharePrices; } }))) return;
      draw();
      toast((await copyText(shareLink(car))) ? 'Link created and copied' : 'Link created');
    } else if (btn.matches('[data-copy]')) {
      toast((await copyText(shareLink(car))) ? 'Link copied' : 'Couldn’t copy — select the link and copy it');
    } else if (btn.matches('[data-open-link]')) {
      window.api.openLink(shareLink(car));
    } else if (btn.matches('[data-stop]')) {
      const ok = await confirmDialog({
        title: 'Stop sharing?',
        message: 'The link stops working right away. If you share again later, you’ll get a new link.',
        confirmLabel: 'Stop sharing',
      });
      if (!ok) return;
      const id = car.shareId;
      car.shareId = null;
      if (await saveSharing(() => { car.shareId = id; })) { draw(); toast('Sharing stopped'); }
    } else if (btn.matches('[data-customize]')) {
      openCardDesigner(car, { onClose: redrawCard });
    } else if (btn.matches('[data-card]') && card) {
      saveCard(car, card.blob);
    } else if (btn.matches('[data-card-share]') && card) {
      shareCard(car, card.blob);
    }
  });

  draw();
  redrawCard();
}

// ---------- the public build page (opened from a shared link, no sign-in) ----------

async function bootPublic(shareId) {
  state.publicMode = true;
  document.body.classList.add('public');
  state.view = { name: 'public' };
  $('#view').innerHTML = loadingBlock('Loading build…');
  try {
    state.publicBuild = await window.api.sharedBuild(shareId);
  } catch (err) {
    state.publicBuild = { error: err.message };
  }
  render();
  document.title = state.publicBuild?.car ? `${state.publicBuild.car.name} · TuningBook` : 'TuningBook';
  window.addEventListener('hashchange', () => location.reload());
}

function renderPublic() {
  const pb = state.publicBuild;
  const home = location.pathname;
  const cta = `<a class="btn primary" href="${esc(home)}">${ICON.plus} Start your own garage — free</a>`;
  if (!pb || pb.error) {
    return `
      <div class="view-inner"><div class="empty">
        <div style="color:var(--accent)">${ICON.car}</div>
        <h2>${pb?.error ? 'Couldn’t load this build' : 'This build isn’t shared anymore'}</h2>
        <div>${pb?.error ? esc(pb.error) : 'The owner may have stopped sharing it, or the link is incomplete.'}</div>
        <div class="empty-actions">${cta}</div>
      </div></div>`;
  }
  const { car, currency } = pb;
  const prices = car.sharePrices;
  const cover = carCover(car);
  const photos = car.mods.reduce((n, m) => n + m.photos.length, 0);
  return `
    <div class="view-inner">
      <section class="car-hero">
        <div class="cover">${cover ? `<img src="${imgSrc(cover)}"${imgPos(cover)}>` : ICON.car}</div>
        <div class="hero-body">
          <div class="eyebrow">Shared build</div>
          <h1>${esc(car.name)}</h1>
          ${carSubtitle(car) ? `<div class="sub">${esc(carSubtitle(car))}</div>` : ''}
          <div class="hero-stats">
            ${prices ? `<div><b>${money(carTotal(car), currency)}</b><span>Invested</span></div>` : ''}
            <div><b>${car.mods.length}</b><span>Mods</span></div>
            <div><b>${photos}</b><span>Photos</span></div>
          </div>
          <div class="actions" style="padding-top:16px">${cta}</div>
        </div>
      </section>
      <h2 class="admin-h2">Modifications</h2>
      ${car.mods.length ? `<div class="mod-list">${car.mods.map((m) => `
        <div class="mod-row" role="button" tabindex="0" data-action="public-mod" data-id="${m.id}">
          <div class="mod-thumb">${m.photos[0] ? `<img src="${imgSrc(m.photos[0])}" loading="lazy"${imgPos(m.photos[0])}>` : ICON.wrench}</div>
          <div style="min-width:0">
            <h3>${esc(m.title)}</h3>
            <div class="meta">
              ${m.category ? `<span class="chip" style="background:${catColor(m.category)}22;color:${catColor(m.category)}">${esc(m.category)}</span>` : ''}
              ${m.date ? `<span>${ICON.calendar}${fmtDate(m.date)}</span>` : ''}
              ${hasKm(m.mileage) ? `<span title="Mileage">${ICON.gauge}${fmtKm(m.mileage)}</span>` : ''}
              <span title="Build photos">${ICON.camera}${m.photos.length}</span>
            </div>
          </div>
          <div class="right">${prices && m.price !== null ? `<div class="price">${money(m.price, currency)}</div>` : ''}</div>
        </div>`).join('')}</div>` : '<div class="gallery-empty">No modifications yet.</div>'}
      <section class="public-cta">
        <div class="brand-mark big">${$('.brand-mark')?.innerHTML || ''}</div>
        <div>
          <h2>Made with TuningBook</h2>
          <p class="muted">Track your own build — modifications, costs, mileage, build photos and receipts, on every device.</p>
        </div>
        ${cta}
      </section>
    </div>`;
}

// ======================================================================
//  Admin dashboard — read-only. Only shown to accounts listed in the admins table
//  (web/supabase/003-admin.sql); the database itself refuses everyone else.
// ======================================================================

const adminState = { users: null, usersError: '', loadingUsers: false, garages: new Map(), loadingGarage: new Set() };
const adminUser = (id) => adminState.users?.find((u) => u.id === id);
const adminGarage = (id) => adminState.garages.get(id);
const fmtBytes = (n) => {
  n = Number(n) || 0;
  if (n >= 1e9) return (n / 1e9).toFixed(2) + ' GB';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + ' MB';
  if (n >= 1e3) return Math.round(n / 1e3) + ' KB';
  return n + ' B';
};
const fmtWhen = (iso) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'never');
const isAdminView = () => state.view.name.startsWith('admin');
const loadingBlock = (text) => `<div class="view-inner"><div class="gallery-empty">${esc(text)}</div></div>`;

async function adminLoadUsers() {
  if (adminState.loadingUsers) return;
  adminState.loadingUsers = true;
  adminState.usersError = '';
  try {
    adminState.users = await window.api.admin.listUsers();
  } catch (err) {
    adminState.usersError = err.message;
  }
  adminState.loadingUsers = false;
  if (isAdminView()) render();
}

async function adminLoadGarage(userId) {
  if (adminState.loadingGarage.has(userId)) return;
  adminState.loadingGarage.add(userId);
  try {
    adminState.garages.set(userId, await window.api.admin.garage(userId));
  } catch (err) {
    adminState.garages.set(userId, { error: err.message });
  }
  adminState.loadingGarage.delete(userId);
  if (isAdminView()) render();
}

function renderAdmin() {
  if (!adminState.users) {
    if (adminState.usersError) {
      return `<div class="view-inner"><div class="empty"><h2>Couldn’t load users</h2><div>${esc(adminState.usersError)}</div>
        <button class="btn" data-action="admin-refresh">Try again</button></div></div>`;
    }
    adminLoadUsers();
    return loadingBlock('Loading users…');
  }
  const users = adminState.users;
  const sum = (k) => users.reduce((s, u) => s + (Number(u[k]) || 0), 0);
  const me = window.api.account?.email;
  return `
    <div class="view-inner">
      <div class="page-head">
        <div><h1>Admin</h1><div class="sub">Registered users and their garages · read-only</div></div>
        <div class="actions"><button class="btn" data-action="admin-refresh">Refresh</button></div>
      </div>
      <div class="garage-stats">
        <div class="stat"><b>${users.length}</b><span>Users</span></div>
        <div class="stat"><b>${sum('cars')}</b><span>Cars</span></div>
        <div class="stat"><b>${sum('mods')}</b><span>Modifications</span></div>
        <div class="stat"><b>${fmtBytes(sum('photo_bytes'))}</b><span>Photos · ${sum('photo_files')} files</span></div>
      </div>
      <div class="user-list">
        ${users.map((u) => `
        <div class="user-row" role="button" tabindex="0" data-action="admin-user" data-id="${esc(u.id)}">
          <div class="avatar">${esc((u.email || '?')[0].toUpperCase())}</div>
          <div style="min-width:0">
            <h3>${esc(u.email || '(no email)')}${u.is_admin ? ' <span class="chip admin-chip">Admin</span>' : ''}${u.email === me ? ' <span class="muted">(you)</span>' : ''}</h3>
            <div class="meta">Joined ${esc(fmtWhen(u.created_at))} · Last sign-in ${esc(fmtWhen(u.last_sign_in_at))}</div>
          </div>
          <div class="counts">
            <span><b>${u.cars}</b> car${Number(u.cars) === 1 ? '' : 's'}</span>
            <span><b>${u.mods}</b> mods</span>
            <span><b>${fmtBytes(u.photo_bytes)}</b> photos</span>
          </div>
        </div>`).join('')}
      </div>
    </div>`;
}

function renderAdminUser(userId) {
  const user = adminUser(userId);
  if (!user) { state.view = { name: 'admin' }; return renderAdmin(); }
  const db = adminGarage(userId);
  if (!db) { adminLoadGarage(userId); return loadingBlock('Loading garage…'); }
  if (db.error) return loadingBlock('Couldn’t load this garage: ' + db.error);
  const cur = db.settings.currency;
  return `
    <div class="view-inner">
      <div class="page-head">
        <div><h1 style="word-break:break-all">${esc(user.email)}</h1>
          <div class="sub">Joined ${esc(fmtWhen(user.created_at))} · Last sign-in ${esc(fmtWhen(user.last_sign_in_at))} · ${esc(cur)} · ${fmtBytes(user.photo_bytes)} of photos</div></div>
      </div>
      ${db.cars.length ? `
      <div class="car-grid">
        ${db.cars.map((car) => {
          const cover = carCover(car);
          return `
          <div class="car-card" role="button" tabindex="0" data-action="admin-car" data-id="${car.id}">
            <div class="cover">
              ${cover ? `<img src="${imgSrc(cover)}" loading="lazy"${imgPos(cover)}>` : `<div class="ph">${ICON.car}</div>`}
              <div class="overlay"><h3>${esc(car.name)}</h3><div class="meta">${esc(carSubtitle(car)) || '&nbsp;'}</div></div>
            </div>
            <div class="foot"><span>${car.mods.length} mod${car.mods.length === 1 ? '' : 's'}</span><b>${money(carTotal(car), cur)}</b></div>
          </div>`;
        }).join('')}
      </div>` : '<div class="gallery-empty">This user hasn’t added any cars yet.</div>'}
    </div>`;
}

function renderAdminCar(userId, carId) {
  const db = adminGarage(userId);
  const car = db?.cars?.find((c) => c.id === carId);
  if (!car) { state.view = { name: 'admin-user', userId }; return renderAdminUser(userId); }
  const cur = db.settings.currency;
  const cover = carCover(car);
  const mods = [...car.mods].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const photos = car.mods.reduce((s, m) => s + m.photos.length, 0);
  const receipts = car.mods.reduce((s, m) => s + m.receipts.length, 0);
  return `
    <div class="view-inner">
      <section class="car-hero">
        <div class="cover">${cover ? `<img src="${imgSrc(cover)}"${imgPos(cover)}>` : ICON.car}</div>
        <div class="hero-body">
          <div class="eyebrow">${esc(adminUser(userId)?.email || '')}</div>
          <h1>${esc(car.name)}</h1>
          ${carSubtitle(car) ? `<div class="sub">${esc(carSubtitle(car))}</div>` : ''}
          ${car.notes ? `<p class="notes">${esc(car.notes)}</p>` : ''}
          <div class="hero-stats">
            <div><b>${money(carTotal(car), cur)}</b><span>Invested</span></div>
            <div><b>${car.mods.length}</b><span>Mods</span></div>
            <div><b>${photos}</b><span>Photos</span></div>
            <div><b>${receipts}</b><span>Receipts</span></div>
            ${car.plan.length ? `<div class="planned-stat"><b>${money(sumPrice(car.plan), cur)}</b><span>Planned · ${car.plan.length}</span></div>` : ''}
          </div>
        </div>
      </section>
      <h2 class="admin-h2">Modifications &amp; maintenance</h2>
      ${mods.length ? `<div class="mod-list">${mods.map((m) => {
        const thumb = m.photos[0] || m.receipts[0];
        return `
        <div class="mod-row" role="button" tabindex="0" data-action="admin-mod" data-id="${m.id}">
          <div class="mod-thumb">${thumb ? `<img src="${imgSrc(thumb)}" loading="lazy"${imgPos(thumb)}>` : ICON.wrench}</div>
          <div style="min-width:0">
            <h3>${esc(m.title)}</h3>
            <div class="meta">
              ${m.category ? `<span class="chip" style="background:${catColor(m.category)}22;color:${catColor(m.category)}">${esc(m.category)}</span>` : ''}
              ${m.date ? `<span>${ICON.calendar}${fmtDate(m.date)}</span>` : ''}
              ${hasKm(m.mileage) ? `<span title="Mileage">${ICON.gauge}${fmtKm(m.mileage)}</span>` : ''}
              <span title="Build photos">${ICON.camera}${m.photos.length}</span>
              <span title="Receipts">${ICON.receipt}${m.receipts.length}</span>
            </div>
          </div>
          <div class="right"><div class="price">${money(m.price, cur)}</div></div>
        </div>`;
      }).join('')}</div>` : '<div class="gallery-empty">No modifications yet.</div>'}
      ${car.plan.length ? `
      <h2 class="admin-h2">Plan</h2>
      <div class="admin-plan">${car.plan.map((p) => `
        <div><span>${esc(p.title)}${p.category ? ` <span class="muted">· ${esc(p.category)}</span>` : ''}</span>
          <span class="muted">${esc(PRIORITIES[p.priority] || '')}</span><b>${money(p.price, cur)}</b></div>`).join('')}
      </div>` : ''}
    </div>`;
}

// Back one level (Android back button, Escape-free navigation).
function goBack() {
  const v = state.view;
  if (v.name === 'admin-car') actions['admin-user'](v.userId);
  else if (v.name === 'admin-user') actions.admin();
  else actions['go-garage']();
}

// ======================================================================
//  Global events
// ======================================================================

// The car page's "Adjust" button: reposition whichever photo is the car's cover — its own cover
// photo, or (when it has none) the first photo of the latest modification.
async function adjustCarCover(car) {
  const cover = carCover(car);
  if (!cover) return;
  const pos = await editImagePosition(cover);
  if (!pos) return;
  if (car.cover === cover) car.cover = { ...cover, pos };
  else for (const m of car.mods) { const i = m.photos.indexOf(cover); if (i >= 0) { m.photos[i] = { ...cover, pos }; break; } }
  await persist();
  render();
}

const actions = {
  admin: () => { if (!window.api.admin) return; state.view = { name: 'admin' }; render(); $('#view').scrollTop = 0; },
  'admin-refresh': () => { adminState.users = null; adminState.usersError = ''; adminState.garages.clear(); render(); },
  'admin-user': (id) => { state.view = { name: 'admin-user', userId: id }; render(); $('#view').scrollTop = 0; },
  'admin-car': (id) => { state.view = { name: 'admin-car', userId: state.view.userId, carId: id }; render(); $('#view').scrollTop = 0; },
  'admin-mod': (id) => {
    const car = adminGarage(state.view.userId)?.cars.find((c) => c.id === state.view.carId);
    const mod = car?.mods.find((m) => m.id === id);
    if (mod) openModDetail(car, mod, 'photos', { readOnly: true });
  },
  'go-back': () => goBack(),
  'share-car': (id) => openShare(carById(id)),
  'public-mod': (id) => {
    const car = state.publicBuild?.car;
    const mod = car?.mods.find((m) => m.id === id);
    if (mod) openModDetail(car, mod, 'photos', { readOnly: true, publicView: true });
  },
  'go-garage': () => {
    if (state.publicMode) { location.href = location.pathname; return; } // public page → sign-in / own garage
    state.view = { name: 'garage' }; state.modSearch = ''; render(); $('#view').scrollTop = 0;
  },
  'open-car': (id) => { state.view = { name: 'car', carId: id }; state.modSearch = ''; state.carTab = 'mods'; state.modKind = 'mods'; render(); $('#view').scrollTop = 0; },
  'add-car': () => openCarForm(),
  'edit-car': (id) => openCarForm(carById(id)),
  'adjust-cover': (id) => adjustCarCover(carById(id)),
  'delete-car': (id) => deleteCar(carById(id)),
  'export-all': () => openExport(state.db.cars.map((c) => c.id)),
  'export-garage': () => exportBackup(),
  'load-garage': () => importBackup(),
  'export-car': () => openExport([state.view.carId]),
  'add-mod': () => openModForm(carById(state.view.carId), null,
    state.modKind === 'maint' ? { prefill: { category: 'Maintenance' }, heading: 'New maintenance' } : {}),
  'mod-kind': (kind) => { state.modKind = kind; render(); },
  'open-mod': (id) => { const car = carById(state.view.carId); openModDetail(car, car.mods.find((m) => m.id === id)); },
  'edit-mod': (id) => { const car = carById(state.view.carId); openModForm(car, car.mods.find((m) => m.id === id)); },
  'delete-mod': (id) => { const car = carById(state.view.carId); deleteMod(car, car.mods.find((m) => m.id === id)); },
  'car-tab': (tab) => { state.carTab = tab; render(); },
  'add-plan': () => openPlanForm(carById(state.view.carId)),
  'edit-plan': (id) => { const car = carById(state.view.carId); openPlanForm(car, car.plan.find((p) => p.id === id)); },
  'delete-plan': (id) => { const car = carById(state.view.carId); deletePlanItem(car, car.plan.find((p) => p.id === id)); },
  'done-plan': (id) => { const car = carById(state.view.carId); completePlanItem(car, car.plan.find((p) => p.id === id)); },
  'open-link': (id) => { const p = carById(state.view.carId).plan.find((x) => x.id === id); window.api.openLink(p.link); },
  settings: () => openSettings(),
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.closest('.modal-backdrop')) return;
  e.stopPropagation();
  actions[el.dataset.action]?.(el.dataset.id);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.modals.length) {
    state.modals[state.modals.length - 1].close();
    return;
  }
  // Keyboard activation for card-like elements.
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('[role=button][data-action]')) {
    e.preventDefault();
    e.target.click();
  }
});

// Stop Electron from navigating to a file dropped outside a drop zone.
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());

// ======================================================================
//  Boot
// ======================================================================

(async function boot() {
  const shareId = shareIdFromHash();
  if (shareId && window.api.sharedBuild) { await bootPublic(shareId); return; }
  const { db, imagesUrl } = await window.api.load();
  state.imagesUrl = imagesUrl;
  state.db = db;
  for (const car of db.cars) {
    car.mods ||= [];
    car.plan ||= [];
    for (const m of car.mods) {
      m.photos ||= [];
      m.receipts ||= [];
    }
  }
  if (window.api.admin) {
    $('.topbar-actions').insertAdjacentHTML('afterbegin',
      `<button class="btn ghost admin-link" data-action="admin" title="Admin dashboard">${ICON.shield}<span>Admin</span></button>`);
  }
  render();
  checkLocalGarage();
})();
