// Run with Electron: renders TuningBook launcher icons into the Android res folders.
//   ..\node_modules\electron\dist\electron.exe scripts\make-android-icons.js
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

const RES = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

const wheel = (cx, r, sw) => `<g fill="none" stroke="#fff" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" transform="translate(${cx} ${cx})">
  <circle r="${r}"/><circle r="${r * 0.25}"/>
  <path d="M0 ${-r}V${-r * 0.25}M${-r * 0.866} ${r * 0.5}L${-r * 0.2165} ${r * 0.125}M${r * 0.866} ${r * 0.5}L${r * 0.2165} ${r * 0.125}"/></g>`;
const grad = '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5a36"/><stop offset="1" stop-color="#b8321f"/></linearGradient></defs>';

// Legacy square icon (pre-Android 8) and round icon, 48dp.
const legacy = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${grad}<rect x="16" y="16" width="480" height="480" rx="110" fill="url(#g)"/>${wheel(256, 160, 34)}</svg>`;
const round = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${grad}<circle cx="256" cy="256" r="246" fill="url(#g)"/>${wheel(256, 150, 32)}</svg>`;
// Adaptive icon foreground (108dp canvas, art kept inside the 66dp safe zone).
const fg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${wheel(256, 118, 26)}</svg>`;

app.whenReady().then(async () => {
  const w = new BrowserWindow({ show: false });
  await w.loadURL('data:text/html,<canvas id=c></canvas>');
  const render = (svg, size) => w.webContents.executeJavaScript(`new Promise(r => { const i = new Image(); i.onload = () => {
    const c = document.getElementById('c'); c.width = c.height = ${size}; const x = c.getContext('2d');
    x.clearRect(0, 0, ${size}, ${size}); x.drawImage(i, 0, 0, ${size}, ${size}); r(c.toDataURL('image/png')); };
    i.src = 'data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}'; })`);
  const write = async (svg, size, file) => {
    const data = await render(svg, size);
    fs.writeFileSync(file, Buffer.from(data.split(',')[1], 'base64'));
  };
  for (const [d, k] of Object.entries(DENSITIES)) {
    const dir = path.join(RES, `mipmap-${d}`);
    await write(legacy, Math.round(48 * k), path.join(dir, 'ic_launcher.png'));
    await write(round, Math.round(48 * k), path.join(dir, 'ic_launcher_round.png'));
    await write(fg, Math.round(108 * k), path.join(dir, 'ic_launcher_foreground.png'));
  }
  console.log('icons written');
  app.quit();
});
