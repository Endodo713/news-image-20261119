// Entry point for the news-image-20261119 round-2 entry.
//
// Copies the picture this repository already holds (entry.png) into
// $MAKEFUN_OUTPUT_DIR/entry.png. Nothing else: no network, no clock, no
// randomness, no subprocess and no renderer of any kind. The image is
// produced offline by the build script, so the same bytes are written on
// every run and the program is deterministic by construction.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WIDTH = 1024;
const HEIGHT = 1024;
const MAX_BYTES = 1048576; // 1 MiB
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

interface Picture {
  path: string;
  bytes: Buffer;
}

// The repository directory this file sits in is authoritative. The working
// directory is only consulted as a fallback for people who run the script
// from a checkout root, never as the primary lookup. The two candidates are
// reported verbatim in the error even when they name the same file, so the
// failure always says where both lookups pointed.
function sourcePaths(): { programDir: string; cwd: string } {
  return {
    programDir: join(fileURLToPath(new URL('.', import.meta.url)), 'entry.png'),
    cwd: join(process.cwd(), 'entry.png'),
  };
}

function findSource(): Picture {
  const { programDir, cwd } = sourcePaths();
  for (const path of Array.from(new Set([programDir, cwd]))) {
    if (!existsSync(path)) continue;
    const stat = statSync(path);
    if (!stat.isFile()) continue;
    return { path, bytes: readFileSync(path) };
  }
  throw new Error(
    'entry.png was not found in either location. Tried next to main.ts: ' +
    programDir + '; and in the working directory: ' + cwd + '.',
  );
}

function assertPicture(name: string, bytes: Buffer): void {
  if (bytes.length < 33) throw new Error(`${name} is too small to be a whole PNG`);
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(`${name} does not start with the PNG signature`);
  }
  if (bytes.toString('latin1', 12, 16) !== 'IHDR') {
    throw new Error(`${name} is missing the IHDR chunk`);
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== WIDTH || height !== HEIGHT) {
    throw new Error(`${name} is ${width}x${height}, expected ${WIDTH}x${HEIGHT}`);
  }
  if (bytes.length > MAX_BYTES) {
    throw new Error(`${name} is ${bytes.length} bytes, limit is ${MAX_BYTES}`);
  }
}

function outDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR;
  return configured && configured.length > 0 ? configured : '/output';
}

const source = findSource();
assertPicture(source.path, source.bytes);

const destinationDir = outDir();
mkdirSync(destinationDir, { recursive: true });
const destinationPath = join(destinationDir, 'entry.png');
writeFileSync(destinationPath, source.bytes);

assertPicture(destinationPath, readFileSync(destinationPath));
console.log(
  `wrote ${destinationPath} (${source.bytes.length} bytes, source ${source.path})`,
);
