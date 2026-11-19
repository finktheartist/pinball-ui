#!/usr/bin/env node
// look.mjs: see a reaction the way a reviewer should, as stills you can read one at a time.
//
//   node look.mjs "http://localhost:8000/toggle/" --act "document.getElementById('el').toggle()" --times 0,60,140,260,420,700
//
// Opens the page in headless Chrome, runs --act, then photographs the page at each time (milliseconds after the act) and saves
// one sheet with every frame side by side. The clock is real, so times are approximate to a frame. Then open the sheet and look:
// at where the ball is, whether the lamp lights when the ball reaches it, and whether the ball still reads as chrome.
// Node 22 or later and Chrome. No installs. Options:
//   --times 0,100,300    moments to capture, in milliseconds after the act
//   --act "js"           what to do (default: nothing)
//   --wait 1500          milliseconds to let the page settle before acting
//   --width 700 --height 560 --cols 3 --out sheet.png. Set CHROME if Chrome is somewhere unusual.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2), url = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const opt = (name, fallback) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : fallback; };
if (!url) { console.error('usage: node look.mjs URL --act "js" --times 0,100,300 [--out sheet.png]'); process.exit(2); }
const times = opt('times', '0,100,200,400,800').split(',').map(Number), act = opt('act', ''), wait = +opt('wait', 1500);
const width = +opt('width', 700), height = +opt('height', 560), cols = +opt('cols', Math.min(3, times.length)), out = opt('out', 'sheet.png');
const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(existsSync);
if (!CHROME) { console.error('Chrome not found. Set CHROME to its path.'); process.exit(2); }

const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'look-'))}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets; for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (Array.isArray(targets) && targets.some((t) => t.type === 'page')) break; } catch {} await sleep(200); }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') console.error('page error:', m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); });
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (m) => (m.error ? rej(new Error(m.error.message)) : res(m.result))); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url }); await sleep(wait);

// capture each frame as a PNG, then lay them out on one canvas inside the page itself, so nothing else needs installing
const shots = [], t0 = Date.now();
if (act) await send('Runtime.evaluate', { expression: act });
for (const t of times) { const d = t0 + t - Date.now(); if (d > 0) await sleep(d); shots.push((await send('Page.captureScreenshot', { format: 'png' })).data); }
const rows = Math.ceil(shots.length / cols);
const sheet = await send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async () => {
  const shots = ${JSON.stringify(shots)}, times = ${JSON.stringify(times)}, W = ${width}, H = ${height}, C = ${cols};
  const c = document.createElement('canvas'); c.width = W * C; c.height = (H + 22) * ${rows}; const g = c.getContext('2d'); g.fillStyle = '#2b2620'; g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < shots.length; i++) { const im = new Image(); im.src = 'data:image/png;base64,' + shots[i]; await im.decode(); const x = (i % C) * W, y = Math.floor(i / C) * (H + 22);
    g.drawImage(im, x, y + 22); g.fillStyle = '#f3efe5'; g.font = '14px monospace'; g.fillText('+' + times[i] + ' ms', x + 8, y + 16); }
  return c.toDataURL('image/png').split(',')[1]; })()` });
writeFileSync(out, Buffer.from(sheet.result.value, 'base64')); console.log(out);
ws.close(); chrome.kill();
