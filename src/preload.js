// Runs before the page loads, with access to Electron's IPC. Exposes a small, fixed set of
// main-process functions to the page as `window.native`; src/desktop/api-desktop.js builds
// `window.api` on top of them.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('native', {
  saveBackup: (fileName, bytes) => ipcRenderer.invoke('backup:save', fileName, bytes),
  savePdf: (html, name) => ipcRenderer.invoke('pdf:save', html, name),
  openLink: (url) => ipcRenderer.invoke('app:openLink', url),
  readLocalGarage: () => ipcRenderer.invoke('local:read'),
  readLocalImage: (file) => ipcRenderer.invoke('local:image', file),
  removeLocalGarage: () => ipcRenderer.invoke('local:remove'),
});
