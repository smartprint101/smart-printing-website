import sharp from "sharp";
import { writeFile } from "node:fs/promises";

// Use the same real brand mark as the website, enlarged within a square white
// canvas so it remains recognizable at favicon sizes and on light backgrounds.
const mark = await sharp("src/assets/logo.png")
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
  .png()
  .toBuffer();

async function renderMark(size) {
  const artwork = await sharp(mark)
    .resize(Math.round(size * 0.82), Math.round(size * 0.82), { fit: "inside" })
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: "#ffffff" },
  })
    .composite([{ input: artwork, gravity: "centre" }])
    .png()
    .toBuffer();
}

await writeFile("public/favicon.png", await renderMark(192));
await writeFile("public/apple-touch-icon.png", await renderMark(180));
await writeFile("public/brand-logo.png", await renderMark(512));

// Conventional /favicon.ico fallback for browsers that request it directly.
// The primary Google Search favicon is the separately declared 192px PNG.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(renderMark));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2); // ICO type
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (const [index, size] of sizes.entries()) {
  const entry = 6 + index * 16;
  header.writeUInt8(size, entry);
  header.writeUInt8(size, entry + 1);
  header.writeUInt16LE(1, entry + 4); // colour planes
  header.writeUInt16LE(32, entry + 6); // bits per pixel
  header.writeUInt32LE(images[index].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += images[index].length;
}
await writeFile("public/favicon.ico", Buffer.concat([header, ...images]));
console.log("Generated favicon, Apple icon and organization logo from src/assets/logo.png.");
