// Website version of `window.api`: the shared Supabase api as-is (file picker for photos,
// the browser's print dialog for PDFs, downloads for garage files).
// Bundled by esbuild into dist/api-web.js.
import { cloudApi } from './cloud.js';

window.api = { ...cloudApi };

// ---------- "new version available" ----------
// An installed web app (Android / iPhone home screen, Edge / Chrome app window) is often just
// resumed, not reloaded, so it can keep running an old version for days. The page knows the build
// it was made from (<meta name="tb-build">); version.json on the site always names the latest.
// When they differ, offer a one-tap update.

const RUNNING_BUILD = document.querySelector('meta[name="tb-build"]')?.content;
const CHECK_EVERY_MS = 30 * 60 * 1000;
let lastCheck = 0;
let offered = false;

async function checkForUpdate() {
  if (!RUNNING_BUILD || offered || Date.now() - lastCheck < 60 * 1000) return;
  lastCheck = Date.now();
  try {
    const res = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const { build } = await res.json();
    if (build && build !== RUNNING_BUILD) showUpdateBar(build);
  } catch {
    // offline or the site is mid-deploy — try again next time
  }
}

function showUpdateBar(build) {
  offered = true;
  const bar = document.createElement('div');
  bar.className = 'update-bar';
  bar.setAttribute('role', 'status');
  bar.innerHTML = '<span>A new version of TuningBook is available.</span><button class="btn primary" type="button">Update</button>';
  bar.querySelector('button').addEventListener('click', () => {
    // A new address for the page itself, so no cached copy of the old one can be reused.
    location.replace(`${location.pathname}?v=${build}`);
  });
  document.body.appendChild(bar);
}

// Remove the ?v=… from the address bar after updating.
if (/[?&]v=/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash);

document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkForUpdate(); });
window.addEventListener('focus', checkForUpdate);
setTimeout(checkForUpdate, 10 * 1000);
setInterval(checkForUpdate, CHECK_EVERY_MS);
