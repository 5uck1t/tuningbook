const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('api', {
  platform: 'desktop',
  writeImage: (file, bytes) => ipcRenderer.invoke('images:write', file, bytes),
  saveBackup: (fileName, bytes) => ipcRenderer.invoke('backup:save', fileName, bytes),
  load: () => ipcRenderer.invoke('db:load'),
  save: (db) => ipcRenderer.invoke('db:save', db),
  pickImages: (title) => ipcRenderer.invoke('images:pick', title),
  importImages: (paths) => ipcRenderer.invoke('images:import', paths),
  readImage: (file) => ipcRenderer.invoke('images:read', file),
  savePreview: (file, buffer) => ipcRenderer.invoke('images:savePreview', file, buffer),
  exportPdf: (opts) => ipcRenderer.invoke('pdf:export', opts),
  openLink: (url) => ipcRenderer.invoke('app:openLink', url),
  openDataFolder: () => ipcRenderer.invoke('app:openDataFolder'),
  pathForFile: (file) => webUtils.getPathForFile(file),
});
