// Assembles web/dist (a static site for GitHub Pages) from the shared UI in ../src/renderer
// plus the Supabase-backed `window.api` from web/src.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const renderer = path.join(root, '..', 'src', 'renderer');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'vendor'), { recursive: true });

for (const f of ['styles.css', 'app.js', 'vendor/jszip.min.js']) {
  fs.copyFileSync(path.join(renderer, f), path.join(dist, f));
}
fs.copyFileSync(path.join(root, '..', 'build', 'icon.png'), path.join(dist, 'icon.png'));

let html = fs.readFileSync(path.join(renderer, 'index.html'), 'utf8');
// The desktop CSP is for local files; the site loads from its own origin and Supabase.
html = html.replace(/\s*<meta http-equiv="Content-Security-Policy"[\s\S]*?>/, '');
html = html.replace('</title>', `</title>
  <meta name="description" content="Track your car modifications, costs, build photos and receipts.">
  <meta name="theme-color" content="#0f1115">
  <link rel="icon" href="icon.png">
  <link rel="apple-touch-icon" href="icon.png">
  <link rel="manifest" href="manifest.webmanifest">`);
// window.api must exist before app.js boots.
html = html.replace('<script src="vendor/jszip.min.js"></script>', '<script src="api-web.js"></script>\n  <script src="vendor/jszip.min.js"></script>');
if (!html.includes('api-web.js')) throw new Error('Could not inject api-web.js into index.html');
fs.writeFileSync(path.join(dist, 'index.html'), html);

fs.writeFileSync(path.join(dist, 'manifest.webmanifest'), JSON.stringify({
  name: 'TuningBook',
  short_name: 'TuningBook',
  description: 'Track your car modifications, costs, build photos and receipts.',
  start_url: './',
  scope: './',
  display: 'standalone',
  background_color: '#0f1115',
  theme_color: '#0f1115',
  icons: [{ src: 'icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' }],
}, null, 2));

// GitHub Pages: serve files as-is (no Jekyll processing).
fs.writeFileSync(path.join(dist, '.nojekyll'), '');

await build({
  entryPoints: [path.join(root, 'src', 'api-web.js')],
  outfile: path.join(dist, 'api-web.js'),
  bundle: true,
  format: 'iife',
  target: 'es2020',
  minify: true,
  sourcemap: false,
  logLevel: 'warning',
});

// Cache busting: GitHub Pages lets browsers reuse files for 10 minutes. Adding a hash of each
// file's content (app.js?v=1a2b3c4d) makes a new deploy load its own files right away and never
// mixes an old app.js with a new api-web.js.
const hashOf = (f) => crypto.createHash('sha256').update(fs.readFileSync(path.join(dist, f))).digest('hex').slice(0, 10);
let page = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
for (const f of ['styles.css', 'app.js', 'api-web.js', 'vendor/jszip.min.js']) {
  const before = page;
  page = page.replace(new RegExp(`((?:src|href)=")${f.replace(/[.]/g, '\\.')}(")`), `$1${f}?v=${hashOf(f)}$2`);
  if (page === before) throw new Error('Could not add a version to ' + f);
}

// Build id: changes whenever any of the app's files change. The page carries the id it was built
// with; version.json always holds the latest one, so a running app (e.g. the installed web app on a
// phone, which can stay open for days) can tell that a newer version is online — see api-web.js.
const buildId = crypto.createHash('sha256')
  .update(['styles.css', 'app.js', 'api-web.js'].map(hashOf).join(''))
  .digest('hex').slice(0, 12);
page = page.replace('</title>', `</title>\n  <meta name="tb-build" content="${buildId}">`);
fs.writeFileSync(path.join(dist, 'version.json'), JSON.stringify({ build: buildId, builtAt: new Date().toISOString() }) + '\n');
fs.writeFileSync(path.join(dist, 'index.html'), page);
console.log('dist built · build', buildId);
