// Electron main process. The garage itself lives online (Supabase) and is loaded by the page;
// this process only does what a web page can't: native save dialogs, PDF files, opening links,
// and reading the garage this computer stored locally before the app went online.
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const os = require('os');

const SAFE_NAME = /^[a-f0-9-]{36}(\.p)?\.[a-z0-9]{2,5}$/;

let mainWindow;

// ---------- garage saved locally by older versions (read-only) ----------

const dataDir = () => process.env.TUNINGBOOK_DATA_DIR || path.join(app.getPath('userData'), 'library');
const dataFile = () => path.join(dataDir(), 'data.json');
const imagesDir = () => path.join(dataDir(), 'images');

function imagePath(name) {
  if (!SAFE_NAME.test(name)) throw new Error('Invalid image name: ' + name);
  return path.join(imagesDir(), name);
}

ipcMain.handle('local:read', async () => {
  try {
    const parsed = JSON.parse(await fsp.readFile(dataFile(), 'utf8'));
    return Array.isArray(parsed.cars) && parsed.cars.length ? parsed : null;
  } catch {
    return null; // no local garage (or unreadable — then it's left untouched on disk)
  }
});

ipcMain.handle('local:image', async (_e, name) => {
  try { return await fsp.readFile(imagePath(name)); } catch { return null; }
});

// Deletes the local data file and photos once they've been uploaded (the daily JSON backups,
// which are tiny, stay in library/backups).
ipcMain.handle('local:remove', async () => {
  await fsp.rm(imagesDir(), { recursive: true, force: true });
  await fsp.rm(dataFile(), { force: true });
  await fsp.rm(dataFile() + '.tmp', { force: true });
});

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
  // src/www is assembled by scripts/build-desktop.mjs (shared UI + api-desktop.js).
  mainWindow.loadFile(path.join(__dirname, 'www', 'index.html'));
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

// ---------- IPC ----------

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

ipcMain.handle('app:openLink', (_e, url) => {
  if (/^https?:\/\//i.test(String(url))) return shell.openExternal(url);
});

// The page builds the report HTML (with links to its online photos); this renders it in a
// hidden window and saves it as a PDF file.
ipcMain.handle('pdf:save', async (_e, html, name) => {
  const safeName = String(name || 'TuningBook').replace(/[\\/:*?"<>|]+/g, '').trim() || 'TuningBook';
  const save = await dialog.showSaveDialog(mainWindow, {
    title: 'Export PDF',
    defaultPath: path.join(app.getPath('documents'), safeName + '.pdf'),
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (save.canceled || !save.filePath) return { ok: false, reason: 'cancelled' };

  const tmpHtml = path.join(os.tmpdir(), `tuningbook-report-${Date.now()}.html`);
  await fsp.writeFile(tmpHtml, String(html), 'utf8');
  const win = new BrowserWindow({ show: false, webPreferences: { offscreen: false } });
  try {
    await win.loadFile(tmpHtml);
    // Make sure every image has downloaded and decoded before printing.
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

// One window at a time keeps things simple (and avoids two windows saving over each other).
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
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
