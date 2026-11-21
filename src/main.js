const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const os = require('os');
const crypto = require('crypto');
const { pathToFileURL } = require('url');
const { buildReportHtml } = require('./report');

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif'];
const SAFE_NAME = /^[a-f0-9-]{36}(\.p)?\.[a-z0-9]{2,5}$/;

let mainWindow;
let dataDir, imagesDir, dataFile;
let db = { version: 1, settings: { currency: 'EUR' }, cars: [] };
let saveChain = Promise.resolve();

// ---------- storage ----------

function initStorage() {
  dataDir = process.env.TUNINGBOOK_DATA_DIR || path.join(app.getPath('userData'), 'library');
  imagesDir = path.join(dataDir, 'images');
  dataFile = path.join(dataDir, 'data.json');
  fs.mkdirSync(imagesDir, { recursive: true });

  if (fs.existsSync(dataFile)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      db = {
        ...db,
        ...parsed,
        settings: { ...db.settings, ...(parsed.settings || {}) },
        cars: Array.isArray(parsed.cars) ? parsed.cars : [],
      };
      cleanupOrphanImages();
      dailyBackup();
    } catch (err) {
      // Never silently lose data: keep the unreadable file aside.
      const backup = dataFile + '.corrupt-' + Date.now();
      fs.copyFileSync(dataFile, backup);
      console.error('Could not read data file, backed up to', backup, err);
    }
  }
}

// Keeps one copy of data.json per day (the last 30 days) in library/backups.
function dailyBackup() {
  try {
    const dir = path.join(dataDir, 'backups');
    fs.mkdirSync(dir, { recursive: true });
    const today = new Date().toLocaleDateString('en-CA');
    const target = path.join(dir, `data-${today}.json`);
    if (!fs.existsSync(target)) fs.copyFileSync(dataFile, target);
    const auto = fs.readdirSync(dir).filter((n) => /^data-\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort();
    for (const old of auto.slice(0, Math.max(0, auto.length - 30))) fs.unlinkSync(path.join(dir, old));
  } catch (err) {
    console.error('Backup failed', err);
  }
}

function referencedImages(data) {
  const set = new Set();
  const add = (img) => {
    if (!img) return;
    if (img.file) set.add(img.file);
    if (img.preview) set.add(img.preview);
  };
  for (const car of data.cars || []) {
    add(car.cover);
    for (const mod of car.mods || []) {
      (mod.photos || []).forEach(add);
      (mod.receipts || []).forEach(add);
    }
  }
  return set;
}

// Images imported but never saved (cancelled forms, deleted mods/cars) are removed on startup.
function cleanupOrphanImages() {
  const used = referencedImages(db);
  for (const name of fs.readdirSync(imagesDir)) {
    if (SAFE_NAME.test(name) && !used.has(name)) {
      try { fs.unlinkSync(path.join(imagesDir, name)); } catch { /* ignore */ }
    }
  }
}

function saveDb(next) {
  db = next;
  const json = JSON.stringify(db, null, 2);
  saveChain = saveChain.then(async () => {
    const tmp = dataFile + '.tmp';
    await fsp.writeFile(tmp, json, 'utf8');
    await fsp.rename(tmp, dataFile);
  });
  return saveChain;
}

function imagePath(name) {
  if (!SAFE_NAME.test(name)) throw new Error('Invalid image name: ' + name);
  return path.join(imagesDir, name);
}

async function copyImages(paths) {
  const out = [];
  for (const src of paths) {
    const ext = path.extname(src).slice(1).toLowerCase();
    if (!IMAGE_EXTS.includes(ext)) continue;
    const name = `${crypto.randomUUID()}.${ext === 'jpeg' ? 'jpg' : ext}`;
    await fsp.copyFile(src, path.join(imagesDir, name));
    out.push({ file: name, preview: null, originalName: path.basename(src) });
  }
  return out;
}

// ---------- window ----------

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#0f1115',
    title: 'TuningBook',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

// ---------- IPC ----------

ipcMain.handle('db:load', () => ({
  db,
  imagesUrl: pathToFileURL(imagesDir).href + '/',
}));

ipcMain.handle('db:save', (_e, next) => saveDb(next));

ipcMain.handle('images:pick', async (_e, title) => {
  const res = await dialog.showOpenDialog(mainWindow, {
    title: title || 'Add photos',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: IMAGE_EXTS }],
  });
  if (res.canceled) return [];
  return copyImages(res.filePaths);
});

ipcMain.handle('images:import', (_e, paths) => copyImages(Array.isArray(paths) ? paths : []));

ipcMain.handle('images:savePreview', async (_e, file, buffer) => {
  imagePath(file); // validate
  const name = file.replace(/\.[a-z0-9]+$/, '') + '.p.jpg';
  await fsp.writeFile(imagePath(name), Buffer.from(buffer));
  return name;
});

ipcMain.handle('images:write', (_e, file, bytes) => fsp.writeFile(imagePath(file), Buffer.from(bytes)));

ipcMain.handle('backup:save', async (_e, fileName, bytes) => {
  const save = await dialog.showSaveDialog(mainWindow, {
    title: 'Export garage',
    defaultPath: path.join(app.getPath('documents'), fileName),
    filters: [{ name: 'TuningBook garage', extensions: ['zip'] }],
  });
  if (save.canceled || !save.filePath) return { ok: false };
  await fsp.writeFile(save.filePath, Buffer.from(bytes));
  return { ok: true, message: 'Garage exported: ' + save.filePath };
});

ipcMain.handle('images:read',(_e, file) => fsp.readFile(imagePath(file)));

ipcMain.handle('app:openLink', (_e, url) => {
  if (/^https?:\/\//i.test(String(url))) return shell.openExternal(url);
});

ipcMain.handle('app:openDataFolder', () => shell.openPath(dataDir));

ipcMain.handle('pdf:export', async (_e, { carIds, includePhotos, includeReceipts }) => {
  const cars = db.cars.filter((c) => carIds.includes(c.id));
  if (!cars.length) return { ok: false, reason: 'No cars selected' };

  const defaultName = cars.length === 1
    ? `${cars[0].name.replace(/[\\/:*?"<>|]+/g, '').trim() || 'car'} - TuningBook.pdf`
    : 'TuningBook - All cars.pdf';

  const save = await dialog.showSaveDialog(mainWindow, {
    title: 'Export PDF',
    defaultPath: path.join(app.getPath('documents'), defaultName),
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (save.canceled || !save.filePath) return { ok: false, reason: 'cancelled' };

  const html = buildReportHtml({
    cars,
    currency: db.settings.currency,
    includePhotos,
    includeReceipts,
    imgUrl: (name) => pathToFileURL(path.join(imagesDir, name)).href,
  });
  const tmpHtml = path.join(os.tmpdir(), `tuningbook-report-${Date.now()}.html`);
  await fsp.writeFile(tmpHtml, html, 'utf8');

  const win = new BrowserWindow({ show: false, webPreferences: { offscreen: false } });
  try {
    await win.loadFile(tmpHtml);
    // Make sure every image is decoded before printing.
    await win.webContents.executeJavaScript(
      'Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })))'
    );
    const pdf = await win.webContents.printToPDF({
      pageSize: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate:
        '<div style="width:100%;font-size:8px;color:#888;padding:0 14mm;display:flex;justify-content:space-between;font-family:Segoe UI,Arial,sans-serif">' +
        '<span>TuningBook</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
    });
    await fsp.writeFile(save.filePath, pdf);
  } finally {
    win.destroy();
    fsp.unlink(tmpHtml).catch(() => {});
  }
  shell.openPath(save.filePath);
  return { ok: true, filePath: save.filePath };
});

// ---------- lifecycle ----------

// Only one TuningBook may run at a time: two windows would each hold their own copy
// of the data, and saving in a stale window would overwrite the other's changes.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    initStorage();
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', async () => {
  await saveChain.catch(() => {});
  if (process.platform !== 'darwin') app.quit();
});
