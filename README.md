# TuningBook

Track car modifications: costs, mileage, build photos and receipts — with PDF export.
One shared UI (`src/renderer/`) runs in three places:

| Version | Where data lives | Folder |
|---|---|---|
| **Website** (GitHub Pages) | Online in Supabase — same garage on every device you sign in on | `web/` |
| **Windows desktop app** (Electron) | Locally in `%APPDATA%\TuningBook\library` | `src/` |
| **Android app** (Capacitor) | Locally on the phone | `mobile/` |

Move a garage between versions with **Export garage** / **Load garage** (one `.zip` file).

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
npm start          # run
npm run dist       # build dist\TuningBook Setup 1.0.0.exe
```

Data: `%APPDATA%\TuningBook\library` — `data.json`, `images\` (originals + `*.p.jpg` previews) and
`backups\` (automatic daily copy, last 30 days). Only one window can run at a time.

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
