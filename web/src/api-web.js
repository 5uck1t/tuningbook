// Website version of `window.api`: the shared Supabase api as-is (file picker for photos,
// the browser's print dialog for PDFs, downloads for garage files).
// Bundled by esbuild into dist/api-web.js.
import { cloudApi } from './cloud.js';

window.api = { ...cloudApi };
