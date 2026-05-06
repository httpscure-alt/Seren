import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import pngToIco from "png-to-ico";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const srcPng = path.join(ROOT, "public", "brand", "seren-app-icon-240.png");

/**
 * Produce a deterministic tab icon from the canonical brand PNG.
 * Keep multiple embedded sizes because some browsers/desktop shells pick oddly.
 */
// Keep this lean: including a very large embedded PNG blows up `.ico` size and slows first paint.
const sizes = [16, 24, 32, 48, 64];

async function main() {
  if (!fs.existsSync(srcPng)) {
    throw new Error(`Missing source PNG at ${srcPng}`);
  }

  /** @type {Buffer[]} */
  const pngBuffers = await Promise.all(
    sizes.map((s) => sharp(srcPng).resize(s, s).png({ compressionLevel: 9 }).toBuffer()),
  );

  /** @type {Buffer} */
  const icoBuf = await pngToIco(pngBuffers);

  const brandPath = path.join(ROOT, "public", "brand", "seren-tab.ico");
  const appPath = path.join(ROOT, "src", "app", "favicon.ico");
  fs.writeFileSync(brandPath, icoBuf);
  fs.writeFileSync(appPath, icoBuf);

  console.log(
    `Wrote ${brandPath} (${icoBuf.byteLength} bytes) from ${path.relative(
      ROOT,
      srcPng,
    )}`,
  );
  console.log(`Wrote ${appPath} (${icoBuf.byteLength} bytes)`);
}

await main();
