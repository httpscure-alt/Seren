/**
 * Rasterize vector brand assets for app stores / favicons (min 200×200).
 * Run from web/: node scripts/render-brand-png.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandDir = join(__dirname, "../public/brand");
const iconSvg = readFileSync(join(brandDir, "seren-app-icon.svg"));

const iconSizes = [
  { name: "seren-app-icon-200.png", px: 200 },
  { name: "seren-app-icon-512.png", px: 512 },
  { name: "seren-app-icon-1024.png", px: 1024 },
];

for (const { name, px } of iconSizes) {
  await sharp(iconSvg, { density: 300 })
    .resize(px, px, { fit: "fill" })
    .png()
    .toFile(join(brandDir, name));
  console.log("wrote", name);
}
