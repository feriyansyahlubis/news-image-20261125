// World News in One Image — 25 November 2026
// make.fun competition: news-image-20261125
//
// The entry is a program that writes one image to /output/entry.png.
// This program copies the pre-rendered front page (entry.png, generated
// by render.py in the entry folder) to /output/entry.png.
//
// REVISION NOTE (fixer, 25 Nov 2026): the first version of this file
// copied entry.png blindly. That is fragile: if entry.png were ever
// truncated, corrupted, or replaced by a non-PNG file, the program
// would silently publish a broken image and the entry would fail
// grading (or worse, be scored as a corrupt submission). This revision
// validates the PNG before copying it — it reads the PNG signature and
// the IHDR chunk, walks the chunk chain to IEND to prove the file is
// complete, and checks the competition limits (width and height at most
// 1024 px, file size at most 1 MiB). Any failure aborts with a clear
// error message and a non-zero exit code instead of writing bad output.
// No network access, no randomness: every run writes the same bytes.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = "/output";
const dest = join(outDir, "entry.png");

// Competition limits for news-image-20261125.
const MAX_DIMENSION_PX = 1024;
const MAX_FILE_BYTES = 1024 * 1024; // 1 MiB

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Validate a PNG buffer: signature, IHDR chunk, dimensions within the
// competition limits, file size within the limit, and a complete chunk
// chain ending in IEND (a truncated file fails here).
function validatePng(data, label) {
  if (data.length < 8 || !data.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail(`${label}: not a PNG file (bad or missing PNG signature)`);
  }
  if (data.length > MAX_FILE_BYTES) {
    fail(
      `${label}: file is ${data.length} bytes, over the 1 MiB limit ` +
        `(${MAX_FILE_BYTES} bytes)`,
    );
  }

  // First chunk must be IHDR: 4-byte length (13), 4-byte type "IHDR",
  // then width (4 bytes BE), height (4 bytes BE), bit depth, colour type,
  // compression, filter, interlace, and a 4-byte CRC.
  const IHDR_MIN_END = 8 + 4 + 4 + 13 + 4;
  if (data.length < IHDR_MIN_END) {
    fail(`${label}: file is truncated before the end of the IHDR chunk`);
  }
  const ihdrLength = data.readUInt32BE(8);
  const ihdrType = data.toString("latin1", 12, 16);
  if (ihdrLength !== 13 || ihdrType !== "IHDR") {
    fail(`${label}: first chunk is not IHDR (got ${ihdrType}, length ${ihdrLength})`);
  }
  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
    fail(
      `${label}: image is ${width}x${height} px, over the ` +
        `${MAX_DIMENSION_PX}x${MAX_DIMENSION_PX} px limit`,
    );
  }

  // Walk the chunk chain to prove the file is complete: each chunk is
  // length (4 bytes BE) + type (4 bytes) + data + CRC (4 bytes). The
  // chain must end with an IEND chunk exactly at the end of the file.
  let offset = 8;
  let sawIend = false;
  while (offset + 8 <= data.length) {
    const length = data.readUInt32BE(offset);
    const type = data.toString("latin1", offset + 4, offset + 8);
    const chunkEnd = offset + 8 + length + 4;
    if (chunkEnd > data.length) {
      fail(`${label}: truncated ${type} chunk (declares ${length} bytes)`);
    }
    offset = chunkEnd;
    if (type === "IEND") {
      sawIend = true;
      break;
    }
  }
  if (!sawIend) {
    fail(`${label}: no IEND chunk — file is truncated or incomplete`);
  }
  if (offset !== data.length) {
    fail(`${label}: ${data.length - offset} trailing byte(s) after IEND`);
  }

  return { width, height };
}

const data = readFileSync(source);
const { width, height } = validatePng(data, source);

mkdirSync(outDir, { recursive: true });
copyFileSync(source, dest);

// Verify what was actually written: re-read the destination, confirm
// it is byte-identical to the validated source, and re-run the PNG
// validation on the written file so a failed or partial write can never
// pass as a successful run.
const written = readFileSync(dest);
if (!written.equals(data)) {
  fail(
    `${dest}: written file differs from ${source} ` +
      `(${written.length} bytes vs ${data.length} bytes)`,
  );
}
validatePng(written, dest);
console.log(`wrote ${dest} (${width}x${height}, ${data.length} bytes)`);
