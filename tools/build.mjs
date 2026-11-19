// Stamp core.js, the recorded sounds and each control's photographs into every control file, so each file works on its own.
//   node tools/build.mjs          (run it after editing core.js or a file in art/ or sounds/)
//   node tools/build.mjs --check  (exits 1 if any file is out of date, and changes nothing)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const NAMES = ['toggle', 'slider', 'plunger', 'stepper', 'targets', 'drain', 'bumper'];
const TYPES = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
const check = process.argv.includes('--check');
// every file in a folder, under its own name, as a data URI
const uris = (dir) => '{\n' + readdirSync(join(root, dir)).sort().map((f) => `  '${basename(f, extname(f))}': 'data:${TYPES[extname(f)]};base64,${readFileSync(join(root, dir, f)).toString('base64')}',`).join('\n') + '\n}';
const between = (text, name, body, file) => {
  const re = new RegExp(`(// >>> ${name}[^\\n]*\\n)[\\s\\S]*?(// <<< ${name})`);
  if (!re.test(text)) throw new Error(`${file}: no ${name} markers`);
  return text.replace(re, (_, a, b) => a + body + '\n' + b);
};
// the core as it goes into a file: core.js with the sounds filled in
export const core = between(readFileSync(join(root, 'core.js'), 'utf8'), 'sounds', `const SOUNDS = ${uris('sounds')};`, 'core.js').trim();

let stale = 0;
const put = (file, next) => {
  let was = ''; try { was = readFileSync(file, 'utf8'); } catch {}
  if (next !== was) { stale++; if (!check) writeFileSync(file, next); console.log(`${check ? 'stale' : 'wrote'} ${file.slice(root.length + 1)} (${Math.round(next.length / 1024)} KB)`); }
};
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const n of NAMES) {
    const file = join(root, n, n + '.js'), was = readFileSync(file, 'utf8');
    put(file, between(between(was, 'art', `const ART = ${uris('art/' + n)};`, file), 'pinball core', core, file));
  }
  put(join(root, 'skills/pinball-ui/core.js'), core + '\n');
  if (check && stale) process.exit(1);
}
