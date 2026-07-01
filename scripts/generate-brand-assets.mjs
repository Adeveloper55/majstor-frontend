import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const iconSvg = fs.readFileSync(path.join(publicDir, "icons", "icon-512.svg"));
const ogSvg = fs.readFileSync(path.join(publicDir, "og-image.svg"));
const faviconSvg = fs.readFileSync(path.join(publicDir, "favicon.svg"));

const outputs = [
  { input: iconSvg, out: "icons/icon-192.png", size: 192 },
  { input: iconSvg, out: "icons/icon-512.png", size: 512 },
  { input: iconSvg, out: "apple-touch-icon.png", size: 180 },
  { input: faviconSvg, out: "favicon-32.png", size: 32 },
  { input: faviconSvg, out: "favicon-16.png", size: 16 },
  { input: ogSvg, out: "og-image.png", width: 1200, height: 630 },
  { input: ogSvg, out: "twitter-image.png", width: 1200, height: 630 },
];

for (const item of outputs) {
  const target = path.join(publicDir, item.out);
  let pipeline = sharp(item.input);
  if (item.size) {
    pipeline = pipeline.resize(item.size, item.size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });
  } else {
    pipeline = pipeline.resize(item.width, item.height, { fit: "cover" });
  }
  await pipeline.png().toFile(target);
  console.log("Wrote", item.out);
}

const favicon32 = await sharp(path.join(publicDir, "favicon-32.png")).toBuffer();
await sharp(favicon32).toFile(path.join(publicDir, "favicon.ico"));
console.log("Wrote favicon.ico");
