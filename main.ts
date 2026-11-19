// Entry point for the news-image-20261119 competition entry.
//
// Copies the picture the repository already holds (entry.png) to
// $MAKEFUN_OUTPUT_DIR/entry.png, defaulting to /output/entry.png.
//
// Node 22, standard library only. No network, no clock, no randomness, no
// subprocess: the same bytes are written on every run, so the program is
// deterministic by construction.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WIDTH = 1024;
const HEIGHT = 1024;
const MAX_BYTES = 1048576;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

interface Picture {
  path: string;
  bytes: Buffer;
}

function sourceCandidates(): string[] {
  const here = fileURLToPath(new URL('.', import.meta.url));
  return Array.from(new Set([
    join(here, 'entry.png'),
    join(process.cwd(), 'entry.png'),
  ]));
}

function findSource(): Picture {
  for (const path of sourceCandidates()) {
    if (!existsSync(path)) continue;
    const stat = statSync(path);
    if (!stat.isFile()) continue;
    return { path, bytes: readFileSync(path) };
  }
  throw new Error(
    'entry.png was not found next to main.ts or in the working directory. ' +
    'Expected at: ' + sourceCandidates().join(' or '),
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
console.log(`wrote ${destinationPath} (${source.bytes.length} bytes, source ${source.path})`);
