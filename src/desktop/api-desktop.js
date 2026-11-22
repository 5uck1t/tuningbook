// Desktop (Electron) version of `window.api`: the shared Supabase api, plus the few things a
// web page can't do on its own, which the main process does for it (see preload.js):
// saving a real PDF file, a "Save as" dialog for garage files, opening links in the browser,
// and reading the garage this computer saved before the app went online.
// Bundled by scripts/build-desktop.mjs into src/www/api-desktop.js.
import { cloudApi, reportHtml } from '../../web/src/cloud.js';

const native = window.native;

window.api = {
  ...cloudApi,
  platform: 'desktop',

  saveBackup: (fileName, bytes) => native.saveBackup(fileName, bytes),
  saveFile: (fileName, bytes) => native.saveFile(fileName, bytes),

  async exportPdf(opts) {
    const report = await reportHtml(opts);
    if (!report) return { ok: false };
    return native.savePdf(report.html, report.name);
  },

  openLink: (url) => native.openLink(url),

  localGarage: {
    read: () => native.readLocalGarage(),
    readImage: (name) => native.readLocalImage(name),
    remove: () => native.removeLocalGarage(),
  },
};
