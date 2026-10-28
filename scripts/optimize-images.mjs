import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

async function originals(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await originals(path));
    else if (/\.(png|jpe?g)$/i.test(path)) files.push(path);
  }
  return files;
}
let before = 0;
let after = 0;
for (const source of await originals('src/assets')) {
  const output = source.replace(/\.(png|jpe?g)$/i, '.webp');
  await sharp(source).rotate().resize({ width: source.endsWith('logo.png') ? 560 : 1000, withoutEnlargement: true }).webp({ quality: 82 }).toFile(output);
  before += (await stat(source)).size;
  after += (await stat(output)).size;
}
// The social card is a real, shareable raster image, not an external placeholder.
const overlay = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0b193b" fill-opacity="0.88"/>
  <rect x="70" y="100" width="90" height="6" rx="3" fill="#c9a24b"/>
  <g font-family="sans-serif" fill="white">
    <text x="70" y="174" font-size="28" fill="#e0c25f">SMART PRINTING PACKAGING</text>
    <text x="70" y="280" font-size="66" font-weight="bold">Printing &amp; Packaging</text>
    <text x="70" y="360" font-size="48">Made for your brand.</text>
    <text x="70" y="464" font-size="28">Dhaka, Bangladesh</text>
    <text x="70" y="544" font-size="26" fill="#e0c25f">smartpackagingbd.com</text>
  </g>
</svg>`);
await sharp('src/assets/materials-flatlay.jpg').resize(1200, 630, { fit: 'cover' }).composite([{ input: overlay }]).jpeg({ quality: 85 }).toFile('public/social-preview.jpg');
console.log(`Image variants: ${(before / 1e6).toFixed(2)} MB → ${(after / 1e6).toFixed(2)} MB (${Math.round((1 - after / before) * 100)}% smaller). Originals retained.`);
