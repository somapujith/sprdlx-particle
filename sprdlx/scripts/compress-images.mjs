/**
 * Compress raster images under ./public (JPEG + PNG).
 * - Never upscales. Long edge capped at MAX_EDGE.
 * - JPEG: quality ~82, mozjpeg, stripped metadata via rotate()+re-encode.
 * - PNG: compressionLevel 9, effort 10 (keeps transparency and paths unchanged).
 */

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.join(process.cwd(), 'public');
const MAX_EDGE = 2200;
const JPEG_QUALITY = 82;
/** Process all rasters; skip only if re-encode would not meaningfully shrink */
const MIN_BYTES = 0;

const EXT_RE = /\.(jpe?g|png)$/i;

function walk(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (EXT_RE.test(name)) out.push(full);
  }
  return out;
}

async function optimize(filePath) {
  const before = fs.statSync(filePath).size;
  if (before < MIN_BYTES) {
    return { before, after: before, skipped: true };
  }

  const ext = path.extname(filePath).toLowerCase();
  const inputBuf = fs.readFileSync(filePath);
  let pipeline = sharp(inputBuf).rotate();
  const meta = await sharp(inputBuf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const longEdge = Math.max(w, h);

  if (longEdge > MAX_EDGE) {
    pipeline = pipeline.resize({
      width: w >= h ? MAX_EDGE : undefined,
      height: h > w ? MAX_EDGE : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  let buf;
  if (ext === '.jpg' || ext === '.jpeg') {
    buf = await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
  } else {
    buf = await pipeline.png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true }).toBuffer();
  }

  const after = buf.length;
  if (after >= before * 0.99 && longEdge <= MAX_EDGE) {
    return { before, after: before, skipped: true };
  }

  fs.writeFileSync(filePath, buf);
  return { before, after, skipped: false };
}

async function main() {
  console.log(`Root: ${ROOT}\n`);
  const files = walk(ROOT).sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);

  let tb = 0;
  let ta = 0;
  let n = 0;

  for (const filePath of files) {
    const rel = path.relative(process.cwd(), filePath);
    try {
      const { before, after, skipped } = await optimize(filePath);
      tb += before;
      ta += skipped ? before : after;
      if (!skipped && after < before) {
        n++;
        console.log(
          `${rel}  ${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB  (−${((1 - after / before) * 100).toFixed(0)}%)`,
        );
      }
    } catch (e) {
      console.warn(`FAIL ${rel}: ${e}`);
      const sz = fs.statSync(filePath).size;
      tb += sz;
      ta += sz;
    }
  }

  console.log(`\nRewrote ${n} files.`);
  console.log(`Aggregate: ${(tb / 1024 / 1024).toFixed(2)} MiB → ${(ta / 1024 / 1024).toFixed(2)} MiB (${((1 - ta / tb) * 100).toFixed(1)}% smaller)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
