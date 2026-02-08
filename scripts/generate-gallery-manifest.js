import fs from 'fs';
import path from 'path';

const GALLERY_DIR = path.resolve('public/gallery');
const MANIFEST_PATH = path.join(GALLERY_DIR, 'manifest.json');

const ALLOWED_EXT = new Set([
  'jpg','jpeg','png','heic','gif','bmp','webp','tiff','svg',
  'mp4','mov','webm'
]);

if (!fs.existsSync(GALLERY_DIR)) {
  console.error('❌ public/gallery not found');
  process.exit(1);
}

const files = fs.readdirSync(GALLERY_DIR)
  .filter(name => {
    const ext = name.split('.').pop()?.toLowerCase();
    return ext && ALLOWED_EXT.has(ext);
  })
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

fs.writeFileSync(
  MANIFEST_PATH,
  JSON.stringify(files, null, 2),
  'utf-8'
);

console.log('✅ gallery manifest generated:', files.length, 'files');
