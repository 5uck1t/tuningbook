// Assembles src/www (what the Electron window loads) from the shared UI in src/renderer plus the
// desktop `window.api` (src/desktop/api-desktop.js, bundled with the shared Supabase code).
// Needs `npm install` in web/ too, for @supabase/supabase-js.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const renderer = path.join(root, 'src', 'renderer');
const www = path.join(root, 'src', 'www');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'vendor'), { recursive: true });

for (const f of ['styles.css', 'app.js', 'vendor/jszip.min.js']) {
  fs.copyFileSync(path.join(renderer, f), path.join(www, f));
}

let html = fs.readFileSync(path.join(renderer, 'index.html'), 'utf8');
// Content-Security-Policy: our own files, plus Supabase for data (connect) and photos (img).
const SUPABASE = 'https://*.supabase.co';
const csp = [
  "default-src 'self'",
  `img-src 'self' blob: data: ${SUPABASE}`,
  `connect-src 'self' blob: ${SUPABASE} wss://*.supabase.co`,
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
].join('; ');
html = html.replace(/(<meta http-equiv="Content-Security-Policy"\s+content=")[^"]*(")/, `$1${csp}$2`);
if (!html.includes(SUPABASE)) throw new Error('Could not update the Content-Security-Policy in index.html');
// window.api must exist before app.js boots.
html = html.replace('<script src="vendor/jszip.min.js"></script>', '<script src="api-desktop.js"></script>\n  <script src="vendor/jszip.min.js"></script>');
if (!html.includes('api-desktop.js')) throw new Error('Could not inject api-desktop.js into index.html');
fs.writeFileSync(path.join(www, 'index.html'), html);

await build({
  entryPoints: [path.join(root, 'src', 'desktop', 'api-desktop.js')],
  outfile: path.join(www, 'api-desktop.js'),
  bundle: true,
  format: 'iife',
  target: 'chrome120',
  logLevel: 'warning',
});
console.log('src/www built');
