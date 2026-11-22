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

function money(value) {
  const currency = state.db.settings.currency || 'EUR';
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
  const name = full ? img.file : img.preview || img.file;
  return window.api.imageSrc ? window.api.imageSrc(name) : state.imagesUrl + encodeURIComponent(name);
};

// Which part of a photo stays visible when it's cropped into a cover/thumbnail (set with
// "Adjust preview"). Stored on the image as { x, y } in percent; 50/50 = centered.
const clampPct = (v) => Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
const imgPos = (img) => (img?.pos ? ` style="object-position:${clampPct(img.pos.x)}% ${clampPct(img.pos.y)}%"` : '');

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

// Lets the user drag a photo inside a cover-shaped frame to choose which part shows in previews.
// Resolves with the new { x, y } (percent), or null if cancelled.
function editImagePosition(img) {
  return new Promise((resolve) => {
    let pos = { x: img.pos ? clampPct(img.pos.x) : 50, y: img.pos ? clampPct(img.pos.y) : 50 };
    let saved = false;
    const src = imgSrc(img);
    const m = openModal(`
      ${modalHead('Adjust preview')}
      <div class="modal-body">
        <p class="muted" style="margin:0 0 12px">Drag the photo to choose which part shows on cards and thumbnails.</p>
        <div class="pos-frame wide"><img src="${src}" draggable="false" alt=""></div>
        <div class="pos-previews">
          <div><div class="pos-frame square"><img src="${src}" draggable="false" alt=""></div><span>Thumbnail</span></div>
          <div><div class="pos-frame photo"><img src="${src}" draggable="false" alt=""></div><span>Gallery</span></div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn ghost" data-center>Center</button>
        <span class="spacer"></span>
        <button class="btn" data-close>Cancel</button>
        <button class="btn primary" data-ok>Save</button>
      </div>`, {
      className: 'small',
      dismissable: true,
      onClose: () => { if (!saved) resolve(null); },
    });
    const imgs = $$('.pos-frame img', m.el);
    const paint = () => imgs.forEach((el) => { el.style.objectPosition = `${pos.x}% ${pos.y}%`; });
    paint();

    // Dragging right moves the photo right, i.e. shows more of its left side (x goes down).
    // 100% of x = the full amount the scaled photo overflows the frame, so the photo follows the finger.
    $$('.pos-frame', m.el).forEach((frame) => {
      const el = frame.querySelector('img');
      let start = null;
      frame.addEventListener('pointerdown', (e) => {
        if (!el.naturalWidth) return;
        const fw = frame.clientWidth, fh = frame.clientHeight;
        const scale = Math.max(fw / el.naturalWidth, fh / el.naturalHeight);
        start = {
          px: e.clientX, py: e.clientY, x: pos.x, y: pos.y,
          ox: el.naturalWidth * scale - fw, oy: el.naturalHeight * scale - fh,
        };
        frame.setPointerCapture(e.pointerId);
        frame.classList.add('dragging');
      });
      frame.addEventListener('pointermove', (e) => {
        if (!start) return;
        if (start.ox > 1) pos.x = clampPct(start.x - ((e.clientX - start.px) / start.ox) * 100);
        if (start.oy > 1) pos.y = clampPct(start.y - ((e.clientY - start.py) / start.oy) * 100);
        paint();
      });
      const end = () => { start = null; frame.classList.remove('dragging'); };
      frame.addEventListener('pointerup', end);
      frame.addEventListener('pointercancel', end);
    });
    $('[data-center]', m.el).addEventListener('click', () => { pos = { x: 50, y: 50 }; paint(); });
    $('[data-ok]', m.el).addEventListener('click', () => { saved = true; m.close(); resolve(pos); });
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

function openModDetail(car, mod, tab = 'photos') {
  const m = openModal(`
    ${modalHead('')}
    <div class="modal-body" style="padding-top:0">
      <div class="detail-head">
        <div>
          <div class="eyebrow">${[mod.category, fmtDate(mod.date), hasKm(mod.mileage) ? fmtKm(mod.mileage) : ''].filter(Boolean).map(esc).join(' · ')}</div>
          <h2>${esc(mod.title)}</h2>
        </div>
        <div class="detail-price">${money(mod.price)}</div>
      </div>
      ${mod.description ? `<p class="detail-desc">${esc(mod.description)}</p>` : ''}
      <div class="tabs">
        <button data-tab="photos">Build photos (${mod.photos.length})</button>
        <button data-tab="receipts">Receipts (${mod.receipts.length})</button>
      </div>
      <div id="tab-body"></div>
    </div>
    <div class="modal-foot">
      <button class="btn danger" data-del>${ICON.trash} Delete</button>
      <span class="spacer"></span>
      <button class="btn" data-close>Close</button>
      <button class="btn primary" data-edit>${ICON.edit} Edit</button>
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
  $('[data-edit]', m.el).addEventListener('click', () => openModForm(car, mod));
  $('[data-del]', m.el).addEventListener('click', async () => {
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
  if (state.view.name === 'car') {
    const car = carById(state.view.carId);
    crumbs.innerHTML = `<button data-action="go-garage">Garage</button><span>›</span><span class="current">${esc(car?.name)}</span>`;
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
        </div>
        <div class="spacer"></div>
        ${state.carTab === 'plan' ? `
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
    renderModList(car);
    $('#mod-search').addEventListener('input', (e) => { state.modSearch = e.target.value; renderModList(car); });
    $('#mod-sort').addEventListener('change', (e) => { state.modSort = e.target.value; renderModList(car); });
  } else {
    view.innerHTML = renderGarage();
  }
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
  'go-garage': () => { state.view = { name: 'garage' }; state.modSearch = ''; render(); $('#view').scrollTop = 0; },
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
  render();
  checkLocalGarage();
})();
