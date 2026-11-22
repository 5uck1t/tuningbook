# TuningBook

Track car modifications: costs, mileage, build photos and receipts — with PDF export.
One shared UI (`src/renderer/`) runs in three places:

| Version | Folder |
|---|---|
| **Website** (GitHub Pages) | `web/` |
| **Windows desktop app** (Electron) | `src/` |
| **Android app** (Capacitor) | `mobile/` |

All three sign in to the same Supabase account and show the same garage — the data lives online.
The Supabase code is shared: [`web/src/cloud.js`](web/src/cloud.js). Each version adds only its own
extras on top (`web/src/api-web.js`, `src/desktop/api-desktop.js`, `mobile/src/api-capacitor.js`).

Older desktop/Android versions kept the garage on the device. After signing in, the apps offer to
upload that local garage once (also available in Settings while it exists).
**Export garage** / **Load garage** still make / restore a single `.zip` backup.

## Features

- **Garage** (home screen): all your cars with cover photo, mod count and total invested.
- **Car page**: modifications with search, sorting and a spend-by-category breakdown.
- **Modification**: title, price, date, mileage (km), category, description, build photos and receipts.
  Click any photo for a full-size viewer.
- **Plan**: a private wishlist per car (estimated price, priority, link, notes). **✓ Done** turns an item
  into a modification. Never included in PDF exports.
- **PDF export**: one car or all cars — cost table, category breakdown, every modification with photos.
- **Export / Load garage**: everything in one `.zip` file, for backups or moving between devices.

## Website (`web/`)

Static site on GitHub Pages; Supabase provides login, the database and photo storage.

- Photos are compressed **in the browser before upload** (photos ≤ 1600 px, receipts ≤ 2400 px, JPEG),
  so originals never leave the device and a typical photo takes ~300 KB.
- Each account only sees its own rows and photos (row-level security in `web/supabase/schema.sql`).
- Deploys automatically on every push to `main` (`.github/workflows/pages.yml`).

```powershell
cd web
npm install
npm run serve      # build and open http://127.0.0.1:5173
```

Supabase setup: run `web/supabase/schema.sql` (then `002-photo-limits.sql`) in the SQL Editor.
The project URL and publishable key are in `web/src/config.js` (both public by design).

## Desktop app

```powershell
npm install
cd web; npm install; cd ..   # the desktop build bundles the shared Supabase code from web/
npm start          # build src\www and run
npm run dist       # build dist\TuningBook Setup <version>.exe
```

`scripts/build-desktop.mjs` assembles `src/www` (the shared UI + `api-desktop.js`, with a
Content-Security-Policy that allows Supabase). `src/main.js` only does native things: save dialogs,
PDF files, opening links, and reading the old local garage in `%APPDATA%\TuningBook\library`.

## Android app

```powershell
cd mobile
npm install
npm run apk        # build dist\TuningBook.apk (needs Android Studio's SDK + JDK)
```

## Project layout

- `src/renderer/` — the shared UI (`index.html`, `styles.css`, `app.js`)
- `src/report.js` — HTML template for the PDF
- `src/main.js`, `src/preload.js` — Electron (desktop) storage, image import, PDF export
- `mobile/src/api-capacitor.js` — Android storage, camera, sharing, printing
- `web/src/api-web.js` — Supabase storage and login; `web/src/compress.js` — photo compression
