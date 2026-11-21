// Builds the printable HTML that gets turned into the exported PDF.

function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function money(value, currency) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(value) || 0);
  } catch {
    return `${(Number(value) || 0).toFixed(2)} ${currency}`;
  }
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d) ? esc(iso) : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const hasKm = (v) => v !== null && v !== undefined && v !== '';
const fmtKm = (v) => `${new Intl.NumberFormat().format(Number(v))} km`;
const carTotal =(car) => (car.mods || []).reduce((s, m) => s + (Number(m.price) || 0), 0);
const sortMods = (mods) => [...(mods || [])].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
const carSubtitle = (car) => [car.year, car.make, car.model].filter(Boolean).join(' ');

function buildReportHtml({ cars, currency, includePhotos, includeReceipts, imgUrl }) {
  const src = (img) => imgUrl(img.preview || img.file);
  const grand = cars.reduce((s, c) => s + carTotal(c), 0);
  const generated = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const gallery = (label, imgs) =>
    imgs && imgs.length
      ? `<div class="gal-label">${label} <span>(${imgs.length})</span></div>
         <div class="gallery">${imgs.map((i) => `<figure><img src="${esc(src(i))}"></figure>`).join('')}</div>`
      : '';

  const carSection = (car) => {
    const mods = sortMods(car.mods);
    const byCat = {};
    for (const m of mods) {
      const k = m.category || 'Other';
      byCat[k] = (byCat[k] || 0) + (Number(m.price) || 0);
    }
    const cover = car.cover || mods.flatMap((m) => m.photos || [])[0];

    return `
    <section class="car">
      <header class="car-head">
        ${cover ? `<img class="car-cover" src="${esc(src(cover))}">` : ''}
        <div class="car-meta">
          <div class="eyebrow">Build sheet</div>
          <h1>${esc(car.name)}</h1>
          ${carSubtitle(car) ? `<div class="sub">${esc(carSubtitle(car))}</div>` : ''}
          <div class="stats">
            <div><b>${money(carTotal(car), currency)}</b><span>Total invested</span></div>
            <div><b>${mods.length}</b><span>Modifications</span></div>
            <div><b>${mods.reduce((s, m) => s + (m.receipts || []).length, 0)}</b><span>Receipts</span></div>
          </div>
        </div>
      </header>
      ${car.notes ? `<p class="notes">${esc(car.notes)}</p>` : ''}

      <h2>Summary</h2>
      <table class="summary">
        <thead><tr><th>#</th><th>Date</th><th class="r">Mileage</th><th>Modification</th><th>Category</th><th class="r">Price</th></tr></thead>
        <tbody>
          ${mods.map((m, i) => `<tr><td>${i + 1}</td><td class="nw">${fmtDate(m.date)}</td><td class="r">${hasKm(m.mileage) ? fmtKm(m.mileage) : ''}</td><td>${esc(m.title)}</td><td>${esc(m.category || '')}</td><td class="r">${money(m.price, currency)}</td></tr>`).join('')}
          ${mods.length ? '' : '<tr><td colspan="6" class="empty">No modifications yet.</td></tr>'}
        </tbody>
        <tfoot><tr><td colspan="5">Total</td><td class="r">${money(carTotal(car), currency)}</td></tr></tfoot>
      </table>

      ${Object.keys(byCat).length > 1 ? `
      <h2>Spend by category</h2>
      <div class="cats">
        ${Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => `
          <div class="cat"><span class="cat-name">${esc(k)}</span>
            <span class="bar"><i style="width:${carTotal(car) ? Math.max(2, (v / carTotal(car)) * 100) : 0}%"></i></span>
            <span class="cat-val">${money(v, currency)}</span></div>`).join('')}
      </div>` : ''}

      ${mods.map((m, i) => `
        <article class="mod">
          <div class="mod-head">
            <div>
              <div class="eyebrow">#${i + 1}${m.category ? ' · ' + esc(m.category) : ''}${m.date ? ' · ' + fmtDate(m.date) : ''}${hasKm(m.mileage) ? ' · ' + fmtKm(m.mileage) : ''}</div>
              <h3>${esc(m.title)}</h3>
            </div>
            <div class="price">${money(m.price, currency)}</div>
          </div>
          ${m.description ? `<p class="desc">${esc(m.description)}</p>` : ''}
          ${includePhotos ? gallery('Build photos', m.photos) : ''}
          ${includeReceipts ? gallery('Receipts', m.receipts) : ''}
        </article>`).join('')}
    </section>`;
  };

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>TuningBook report</title>
<style>
  @page { size: A4; margin: 14mm 14mm 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: #1b1d22; font-size: 10.5pt; margin: 0; -webkit-print-color-adjust: exact; }
  h1 { font-size: 24pt; margin: 2px 0 2px; letter-spacing: -0.02em; }
  h2 { font-size: 12pt; margin: 22px 0 8px; text-transform: uppercase; letter-spacing: .08em; color: #555; }
  h3 { font-size: 13pt; margin: 2px 0 0; }
  .eyebrow { font-size: 8pt; text-transform: uppercase; letter-spacing: .12em; color: #e4572e; font-weight: 600; }
  .cover { height: 250mm; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
  .cover .brand { font-size: 40pt; font-weight: 800; letter-spacing: -0.03em; }
  .cover .brand span { color: #e4572e; }
  .cover .gen { color: #777; margin-top: 4px; }
  .cover table { margin-top: 30px; }
  .car { page-break-before: always; }
  .car:first-of-type { page-break-before: auto; }
  .car-head { display: flex; gap: 18px; align-items: stretch; }
  .car-cover { width: 85mm; height: 60mm; object-fit: cover; border-radius: 6px; }
  .car-meta { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .sub { color: #666; font-size: 11pt; }
  .stats { display: flex; gap: 20px; margin-top: 14px; }
  .stats div { display: flex; flex-direction: column; }
  .stats b { font-size: 14pt; }
  .stats span { font-size: 8pt; color: #777; text-transform: uppercase; letter-spacing: .06em; }
  .notes { color: #444; white-space: pre-wrap; margin-top: 14px; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 8pt; text-transform: uppercase; letter-spacing: .06em; color: #777; border-bottom: 1.5px solid #1b1d22; padding: 5px 6px; }
  td { padding: 5px 6px; border-bottom: 1px solid #e5e5e5; }
  tfoot td { font-weight: 700; border-bottom: none; border-top: 1.5px solid #1b1d22; }
  .r { text-align: right; white-space: nowrap; }
  .nw { white-space: nowrap; }
  .empty { color: #999; text-align: center; padding: 14px; }
  .cats { display: flex; flex-direction: column; gap: 5px; }
  .cat { display: grid; grid-template-columns: 40mm 1fr 30mm; align-items: center; gap: 10px; }
  .bar { height: 7px; background: #eee; border-radius: 4px; overflow: hidden; }
  .bar i { display: block; height: 100%; background: #e4572e; }
  .cat-val { text-align: right; }
  .mod { margin-top: 20px; padding-top: 14px; border-top: 1px solid #ddd; }
  .mod-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; break-inside: avoid; break-after: avoid; }
  .price { font-size: 13pt; font-weight: 700; white-space: nowrap; }
  .desc { white-space: pre-wrap; color: #333; margin: 8px 0 0; }
  .gal-label { margin: 12px 0 6px; font-size: 8pt; text-transform: uppercase; letter-spacing: .08em; color: #777; font-weight: 600; break-after: avoid; }
  .gal-label span { color: #aaa; }
  .gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .gallery figure { margin: 0; break-inside: avoid; }
  .gallery img { width: 100%; max-height: 110mm; object-fit: contain; background: #f4f4f4; border-radius: 4px; display: block; }
</style></head>
<body>
  ${cars.length > 1 ? `
  <div class="cover">
    <div class="brand">Tuning<span>Book</span></div>
    <div class="gen">Generated ${esc(generated)}</div>
    <table>
      <thead><tr><th>Car</th><th>Modifications</th><th class="r">Invested</th></tr></thead>
      <tbody>${cars.map((c) => `<tr><td><b>${esc(c.name)}</b> <span style="color:#777">${esc(carSubtitle(c))}</span></td><td>${(c.mods || []).length}</td><td class="r">${money(carTotal(c), currency)}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td colspan="2">Grand total</td><td class="r">${money(grand, currency)}</td></tr></tfoot>
    </table>
  </div>` : ''}
  ${cars.map(carSection).join('')}
</body></html>`;
}

module.exports = { buildReportHtml };
