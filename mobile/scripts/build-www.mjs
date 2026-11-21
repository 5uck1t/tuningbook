// Assembles mobile/www from the shared desktop UI (../src/renderer) plus the Android `window.api`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const renderer = path.join(root, '..', 'src', 'renderer');
const www = path.join(root, 'www');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'vendor'), { recursive: true });

for (const f of ['styles.css', 'app.js', 'vendor/jszip.min.js']) {
  fs.copyFileSync(path.join(renderer, f), path.join(www, f));
}

let html = fs.readFileSync(path.join(renderer, 'index.html'), 'utf8');
// The desktop CSP allows file: images; Capacitor serves everything from its own origin instead.
html = html.replace(/\s*<meta http-equiv="Content-Security-Policy"[\s\S]*?>/, '');
// window.api must exist before app.js boots.
html = html.replace('<script src="vendor/jszip.min.js"></script>', '<script src="api-capacitor.js"></script>\n  <script src="vendor/jszip.min.js"></script>');
if (!html.includes('api-capacitor.js')) throw new Error('Could not inject api-capacitor.js into index.html');
fs.writeFileSync(path.join(www, 'index.html'), html);

await build({
  entryPoints: [path.join(root, 'src', 'api-capacitor.js')],
  outfile: path.join(www, 'api-capacitor.js'),
  bundle: true,
  format: 'iife',
  target: 'es2020',
  logLevel: 'warning',
});
console.log('www built');
