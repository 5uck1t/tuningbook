// Shrinks photos in the browser before upload, so only compact JPEGs are ever stored.
//   photo / cover : longest side ≤ 1600 px, JPEG quality 0.80  (~200–400 KB)
//   receipt       : longest side ≤ 2400 px, JPEG quality 0.85  (keeps small print readable)

export const LIMITS = {
  photo: { maxSide: 1600, quality: 0.8, keepIfUnder: 450 * 1024 },
  receipt: { maxSide: 2400, quality: 0.85, keepIfUnder: 900 * 1024 },
};

async function decode(blob) {
  // createImageBitmap applies EXIF rotation, so phone photos stay the right way up.
  try {
    return await createImageBitmap(blob, { imageOrientation: 'from-image' });
  } catch {
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

/**
 * Returns { blob, width, height } — always a JPEG within the size limit for `kind`.
 * Small JPEGs that already fit are returned unchanged (no extra quality loss).
 */
export async function compressImage(input, kind = 'photo') {
  const limit = LIMITS[kind] || LIMITS.photo;
  let source;
  try {
    source = await decode(input);
  } catch {
    throw new Error('This image format can’t be read here — please use JPG or PNG.');
  }
  const w = source.width || source.naturalWidth;
  const h = source.height || source.naturalHeight;
  const scale = Math.min(1, limit.maxSide / Math.max(w, h));

  if (scale === 1 && input.type === 'image/jpeg' && input.size <= limit.keepIfUnder) {
    source.close?.();
    return { blob: input, width: w, height: h };
  }

  const width = Math.max(1, Math.round(w * scale));
  const height = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; // transparent PNGs would otherwise turn black in JPEG
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);
  source.close?.();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', limit.quality));
  if (!blob) throw new Error('Could not compress the image.');
  return { blob, width, height };
}
