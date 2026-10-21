import { execFileSync } from 'node:child_process';
import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const cargoInRustup = join(
  homedir(),
  '.cargo',
  'bin',
  process.platform === 'win32' ? 'cargo.exe' : 'cargo',
);
const cargo = process.env.CARGO || (existsSync(cargoInRustup) ? cargoInRustup : 'cargo');

execFileSync(
  cargo,
  [
    'build',
    '--manifest-path',
    'rust/freddy-behavior/Cargo.toml',
    '--target',
    'wasm32-unknown-unknown',
    '--release',
  ],
  { cwd: projectRoot, stdio: 'inherit' },
);

const wasmDirectory = new URL('../public/wasm/', import.meta.url);
const wasmSource = new URL(
  '../rust/freddy-behavior/target/wasm32-unknown-unknown/release/freddy_behavior.wasm',
  import.meta.url,
);
const wasmDestination = new URL('../public/wasm/freddy-behavior.wasm', import.meta.url);

await mkdir(wasmDirectory, { recursive: true });
await copyFile(wasmSource, wasmDestination);
