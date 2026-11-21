// Assembles web/dist (a static site for GitHub Pages) from the shared UI in ../src/renderer
// plus the Supabase-backed `window.api` from web/src.
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
console.log('dist built');
