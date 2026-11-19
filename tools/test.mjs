// node tools/test.mjs [URL]   uses every control in the gallery with real touch and key events at phone width, checks the
// events they fire, their form values and sideways scroll, and exits 1 on a failure. Needs Chrome or Chromium (CHROME=... if it is
// somewhere unusual) and the repo being served: python3 -m http.server 8000, then the default URL works.
import { spawn } from 'node:child_process';
import { rmSync, mkdtempSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL_ = process.argv[2] || 'http://localhost:8000/gallery/';
const PORT = await new Promise((res) => { const s = createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
const PROFILE = mkdtempSync(join(tmpdir(), 'pb-'));
const chrome = spawn(process.env.CHROME || 'chromium', ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); if (Array.isArray(targets) && targets.some((t) => t.type === 'page')) break; } catch {} await sleep(200); }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(); const logs = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text)); });
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result))); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true }); if (r.exceptionDetails) logs.push('EVAL ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text) + ' in ' + expr.slice(0, 80)); return r.result.value; };
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true });
await send('Page.enable'); await send('Page.navigate', { url: URL_ }); await sleep(4000);
// E(tag) is the element; S(tag, sel) is something inside its shadow root
const E = (tag) => `document.querySelector('pinball-${tag}')`, S = (tag, sel) => `${E(tag)}.shadowRoot.querySelector(${JSON.stringify(sel)})`;
const at = async (expr, fx = 0.5, fy = 0.5) => JSON.parse(await ev(`(() => { const e = ${expr}; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return JSON.stringify([b.left + b.width * ${fx}, b.top + b.height * ${fy}]); })()`));
const touch = (type, x, y) => send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
const tap = async (tag, sel, fx, fy) => { const [x, y] = await at(S(tag, sel), fx, fy); await sleep(200); await touch('touchStart', x, y); await sleep(40); await touch('touchEnd', x, y); await sleep(150); };
const drag = async (x0, y0, x1, y1, n = 12, hold = 0) => { await touch('touchStart', x0, y0); for (let i = 1; i <= n; i++) { await touch('touchMove', x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n); await sleep(25); } await sleep(hold); await touch('touchEnd'); };
const key = async (k, code, up = true) => { const text = k === 'Enter' ? { text: '\r' } : k === ' ' ? { text: ' ' } : {}; await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code: k === ' ' ? 'Space' : k, windowsVirtualKeyCode: code, ...text }); if (up) await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: k === ' ' ? 'Space' : k, windowsVirtualKeyCode: code }); await sleep(60); };
const keyUp = (k, code) => send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: k === ' ' ? 'Space' : k, windowsVirtualKeyCode: code });
const focus = (tag, sel) => ev(`${S(tag, sel)}.focus()`);
const prop = (tag, p) => ev(`${E(tag)}.${p}`);
// count the events each element fires, so a check can ask whether change really reached the page
await ev(`window.__n = {}; for (const t of ['input', 'change', 'send', 'bonus', 'delete', 'undo', 'commit', 'reset', 'hit']) document.addEventListener(t, (e) => { if (!e.target.localName.startsWith('pinball-')) return; const k = e.target.localName.slice(8) + ' ' + t; __n[k] = (__n[k] || 0) + 1; })`);
const fired = (k) => ev(`__n[${JSON.stringify(k)}] || 0`);
// put the gallery's grid inside a form, once, to read what a form would send (the controls are form-associated)
await ev(`(() => { const f = document.createElement('form'); f.id = 'f'; const g = document.getElementById('grid'); g.before(f); f.appendChild(g); for (const t of ['toggle', 'slider', 'stepper', 'targets']) document.querySelector('pinball-' + t).setAttribute('name', t); })()`); await sleep(600);
const formValue = (n) => ev(`new FormData(document.getElementById('f')).get(${JSON.stringify(n)})`);
let fails = 0;
const check = (name, ok, got) => { if (!ok) fails++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${got !== undefined ? `  ->  ${got}` : ''}`); };

check('all seven files built their elements', (await ev(`['toggle', 'slider', 'plunger', 'stepper', 'targets', 'drain', 'bumpers', 'bumper'].every((t) => { const e = document.querySelector('pinball-' + t); return e && e.shadowRoot && e.shadowRoot.querySelector('canvas'); })`)) === true);
check('WebGL is drawing (the toggle canvas has pixels)', (await ev(`(() => { const c = ${S('toggle', 'canvas')}; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) n += d[i] > 0; return n; })()`)) > 1000);

// toggle: a tap, then Space
await tap('toggle', 'button');
check('toggle: a tap turns it on, with change', (await prop('toggle', 'checked')) === true && (await fired('toggle change')) === 1, await prop('toggle', 'checked'));
check('toggle: its form value is on', (await formValue('toggle')) === 'on', await formValue('toggle'));
await focus('toggle', 'button'); await key(' ', 32); await sleep(200);
check('toggle: Space turns it off and it leaves the form', (await prop('toggle', 'checked')) === false && (await formValue('toggle')) === null, `${await prop('toggle', 'checked')} / form ${await formValue('toggle')}`);
{ const [x, y] = await at(S('toggle', 'button'), 0.2, 0.5); const [x1] = await at(S('toggle', 'button'), 0.9, 0.5); await drag(x, y, x1, y, 10); await sleep(600);
  check('toggle: dragging the ball across turns it on', (await prop('toggle', 'checked')) === true, await prop('toggle', 'checked')); }

// slider: drag, then keys
{ const [x0, y] = await at(S('slider', '.track'), 0.42, 0.5); const [x1] = await at(S('slider', '.track'), 0.8, 0.5); await drag(x0, y, x1, y, 12); await sleep(300);
  check('slider: a drag moves it up, with input and change', (await prop('slider', 'value')) > 60 && (await fired('slider input')) > 2 && (await fired('slider change')) === 1, `${await prop('slider', 'value')} / ${await fired('slider input')} input`); }
await focus('slider', '.track'); await key('Home', 36); await key('ArrowRight', 39); await sleep(100);
check('slider: Home then arrow right reads 1', (await prop('slider', 'value')) === 1 && (await formValue('slider')) === '1', `${await prop('slider', 'value')} / form ${await formValue('slider')}`);
await key('End', 35); check('slider: End goes to 100', (await prop('slider', 'value')) === 100, await prop('slider', 'value'));

// stepper
await tap('stepper', '.plus'); await sleep(150);
check('stepper: plus adds one', (await prop('stepper', 'value')) === 5 && (await fired('stepper change')) >= 1 && (await formValue('stepper')) === '5', `${await prop('stepper', 'value')} / form ${await formValue('stepper')}`);
await tap('stepper', '.minus'); await tap('stepper', '.minus'); await sleep(150);
check('stepper: minus twice takes two', (await prop('stepper', 'value')) === 3, await prop('stepper', 'value'));
await focus('stepper', '.ctrl'); await key('End', 35); await sleep(150); check('stepper: End goes to 99', (await prop('stepper', 'value')) === 99, await prop('stepper', 'value'));
await key('PageDown', 34); await sleep(150); check('stepper: Page Down takes ten', (await prop('stepper', 'value')) === 89, await prop('stepper', 'value'));

// drop targets (the gallery starts with 0 and 2 ticked)
await tap('targets', '.slot[data-i="1"]'); await sleep(700);
check('targets: a tap ticks PUSH', JSON.stringify(await prop('targets', 'selected')) === '["EMAIL","PUSH","TEXT"]' && (await fired('targets change')) === 1 && (await formValue('targets')) === 'EMAIL,PUSH,TEXT', `${await prop('targets', 'selected')} / form ${await formValue('targets')}`);
await focus('targets', '.slot[data-i="3"]'); await key(' ', 32); await sleep(1200);
check('targets: Space on the last one ticks it and fires bonus', (await prop('targets', 'selected')).length === 4 && (await fired('targets bonus')) === 1, `${await prop('targets', 'selected')} / ${await fired('targets bonus')} bonus`);
await tap('targets', '.slot[data-i="0"]'); await sleep(300);
check('targets: a tap unticks EMAIL', (await prop('targets', 'checked'))[0] === false, JSON.stringify(await prop('targets', 'checked')));

// drain: delete, undo, then delete and let it run out
await tap('drain', '.chute'); await sleep(900);
check('drain: a tap on the ball deletes, with delete', (await prop('drain', 'state')) === 'undoable' && (await fired('drain delete')) === 1, await prop('drain', 'state'));
await tap('drain', '.shoot'); await sleep(900);
check('drain: SHOOT AGAIN undoes it, with undo', (await prop('drain', 'state')) === 'ready' && (await fired('drain undo')) === 1, await prop('drain', 'state'));
await ev(`${E('drain')}.setAttribute('window', '500')`);
await focus('drain', '.chute'); await key('Delete', 46); await sleep(2000);
check('drain: Delete key, then the window runs out, with commit', (await fired('drain commit')) === 1, `${await prop('drain', 'state')} / ${await fired('drain commit')} commit`);
await sleep(1500); check('drain: the gallery serves a new ball after commit', (await prop('drain', 'state')) === 'ready', await prop('drain', 'state'));

// bumpers
await tap('bumper', 'button'); await tap('bumper', 'button'); await sleep(100);
check('bumper: two taps, two hits, a combo', (await fired('bumper hit')) === 2 && (await prop('bumper', 'combo')) === 2 && (await prop('bumper', 'score')) === 2, `${await fired('bumper hit')} hits, combo ${await prop('bumper', 'combo')}`);
await tap('bumpers', '.cluster'); await sleep(3500);
check('bumpers: a tap drops a ball that scores several hits', (await fired('bumpers hit')) >= 3 && (await prop('bumpers', 'score')) > 300, `${await fired('bumpers hit')} hits, score ${await prop('bumpers', 'score')}`);

// plunger: a short pull sends nothing; a full pull, wait for the ball, let go
{ const [x, y] = await at(S('plunger', 'button'), 0.75, 0.5);
  await drag(x, y, x + 15, y, 4); await sleep(500);
  check('plunger: a short pull sends nothing', (await fired('plunger send')) === 0);
  await drag(x, y, x + 260, y, 14, 900); await sleep(800);
  check('plunger: a full pull and release sends once', (await fired('plunger send')) === 1, await fired('plunger send')); }
await focus('plunger', 'button'); await key(' ', 32, false); await sleep(1300); await keyUp(' ', 32); await sleep(800);
check('plunger: holding Space and letting go sends', (await fired('plunger send')) === 2, await fired('plunger send'));

// disabled
await ev(`${E('toggle')}.setAttribute('disabled', '')`); await sleep(50);
check('disabled: the toggle is inert', (await ev(`${E('toggle')}.inert`)) === true);
await ev(`${E('toggle')}.removeAttribute('disabled')`);

await sleep(1500);
check('no sideways scroll at 390', (await ev('document.documentElement.scrollWidth')) <= 390, await ev('document.documentElement.scrollWidth'));
if (logs.length) { console.log(logs.join('\n')); fails++; }
ws.close(); chrome.kill(); await sleep(300); try { rmSync(PROFILE, { recursive: true, force: true }); } catch {}
console.log(fails ? `${fails} failed` : 'all passed'); process.exit(fails ? 1 : 0);
