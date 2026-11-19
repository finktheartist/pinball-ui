// The shared core of Pinball UI: springs, one clock that a film or a frame tool can step, a custom-element base, one hidden
// WebGL context that draws for every control on the page (each control copies its picture onto its own canvas), the chrome
// ball's shader, and the sound. tools/build.mjs stamps this, with the recorded sounds, into every control file, so each one
// works alone; the first copy loaded sets window.PinballKit and the others reuse it.
(() => {
'use strict';
if (window.PinballKit) return;
const HERE = (document.currentScript && document.currentScript.src) || location.href;
const asset = (p) => new URL(p, HERE).href;
// >>> sounds (written by tools/build.mjs from sounds/)
const SOUNDS = {};
// <<< sounds
const bytes = (uri) => { const s = atob(uri.slice(uri.indexOf(',') + 1)), b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b.buffer; };
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

class Spring {
  constructor(x = 0, k = 300, d = 20) { this.x = x; this.v = 0; this.to = x; this.k = k; this.d = d; }
  step(dt) { if (!(dt > 0)) return this.x; for (let n = Math.ceil(dt / 0.008), h = dt / n; n--;) { this.v += (-this.k * (this.x - this.to) - this.d * this.v) * h; this.x += this.v * h; } return this.x; }
  get idle() { return Math.abs(this.x - this.to) < 2e-3 && Math.abs(this.v) < 2e-3; }
  snap(x) { this.x = this.to = x; this.v = 0; return this; }
}

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let calm = reduce.matches; reduce.addEventListener?.('change', (e) => { calm = e.matches; });

// ───────── the clock ─────────
let now = 0, last = 0, running = false;
const frames = new Set(), timers = [];
const later = (ms, f) => { timers.push({ at: now + ms / 1000, f }); start(); };
function advance(dt) {
  now += dt;
  const due = timers.filter((q) => q.at <= now).sort((a, b) => a.at - b.at);
  for (const q of due) timers.splice(timers.indexOf(q), 1);
  for (const q of due) q.f();
  let busy = false;
  for (const f of frames) busy = f(dt) || busy;
  rollSound();
  return busy;
}
function loop(ms) {
  if (!running) return;
  const dt = clamp((ms - last) / 1000, 0, 0.034); last = ms;
  const busy = api.paused ? false : advance(dt * api.rate);
  if (!busy && !timers.length && !api.paused) { running = false; return; }
  requestAnimationFrame(loop);
}
function start() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(loop); }

// ───────── one WebGL context for the page ─────────
let gl, glc;
function getGL() {
  if (gl !== undefined) return gl;
  glc = document.createElement('canvas');
  gl = glc.getContext('webgl', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false, alpha: true }) || null;
  if (gl) {
    const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    glc.addEventListener('webglcontextlost', (e) => { e.preventDefault(); gl = null; });
  }
  return gl;
}
function program(vs, fs) {
  const g = getGL(); if (!g) return null;
  const sh = (type, src) => { const s = g.createShader(type); g.shaderSource(s, src); g.compileShader(s); if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(s)); return s; };
  const p = g.createProgram(); g.attachShader(p, sh(g.VERTEX_SHADER, vs)); g.attachShader(p, sh(g.FRAGMENT_SHADER, fs)); g.bindAttribLocation(p, 0, 'aPos'); g.linkProgram(p);
  if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(p));
  const u = {}; for (let i = g.getProgramParameter(p, g.ACTIVE_UNIFORMS); i--;) { const info = g.getActiveUniform(p, i); u[info.name] = g.getUniformLocation(p, info.name); }
  return { p, u };
}
// a picture as a texture with mipmaps. WebGL 1 only makes mipmaps for power-of-two sizes, and a plate shown at a
// sixteenth of its size shimmers without them, so the picture is first drawn onto a power-of-two canvas.
function texture(src, onload) {
  const g = getGL(); if (!g) return null;
  const t = g.createTexture(); g.bindTexture(g.TEXTURE_2D, t);
  g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, 1, 1, 0, g.RGBA, g.UNSIGNED_BYTE, new Uint8Array(4));
  const im = new Image(); im.decoding = 'async';
  im.onload = () => {
    const pot = (n) => 2 ** Math.ceil(Math.log2(n)), c = document.createElement('canvas'); c.width = pot(im.naturalWidth); c.height = pot(im.naturalHeight);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
    g.bindTexture(g.TEXTURE_2D, t); g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, c); g.generateMipmap(g.TEXTURE_2D);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR_MIPMAP_LINEAR); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
    t.ready = true; onload && onload(); start();
  };
  im.src = src;
  return t;
}
// draw one full-canvas pass at w x h pixels and copy it onto a 2D canvas
function paint(prog, w, h, set, target) {
  const g = getGL(); if (!g || !prog) return false;
  if (glc.width < w || glc.height < h) { glc.width = Math.max(glc.width, w); glc.height = Math.max(glc.height, h); }
  g.viewport(0, 0, w, h); g.enable(g.SCISSOR_TEST); g.scissor(0, 0, w, h); g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
  g.useProgram(prog.p); g.enableVertexAttribArray(0); g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
  set(g, prog.u); g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
  const c2 = target.getContext('2d'); c2.setTransform(1, 0, 0, 1, 0, 0); c2.clearRect(0, 0, target.width, target.height);
  c2.drawImage(glc, 0, glc.height - h, w, h, 0, 0, w, h);
  return true;
}

// ───────── shader parts shared by every control with a ball ─────────
// head: the uniforms, noise and shapes. ball: the room it mirrors, its shadow, and the ball itself, which calls scene().
const VS = 'attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = vec2(aPos.x*.5+.5, .5-aPos.y*.5); gl_Position = vec4(aPos,0.,1.); }';
const glsl = { vs: VS, head: `
precision highp float;
varying vec2 vUv;
uniform vec4 uView;      // the part of the plate this canvas shows: x, y, w, h
uniform vec3 uBall;      // x, y, radius
uniform float uRoll, uPx;
uniform vec3 uPage;
vec4 scene(vec2 p);      // each control says what its body looks like at a point of its plate
float hash(vec3 p){ p = fract(p*.3183099 + vec3(.71,.113,.419)); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vnoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
  return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z); }
float pill(vec2 p, vec2 c, vec2 h){ vec2 q = abs(p - c) - vec2(h.x - h.y, 0.); return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - h.y; }
// a lamp's glow on the page fades out before the canvas ends, so its edge never shows as a faint rectangle
float edgeFade(){ vec2 e = min(vUv, 1. - vUv); return smoothstep(0., .14, e.x) * smoothstep(0., .14, e.y); }
vec3 lampCol(float l){ return mix(vec3(1.,.30,.05), vec3(1.,.72,.32), l); }   // a bulb is redder while it warms up

`, ball: `
// what the ball sees when it looks up: a dim room with a pale ceiling, one big soft window of light, a few warm lamps.
// r is a direction in the room: x to the right, y away from the viewer, z up.
vec3 room(vec3 r){
  float up = clamp(r.z, 0., 1.);
  vec3 c = mix(vec3(.36, .34, .32), vec3(.80, .78, .74), smoothstep(.1, .95, up));
  c *= mix(.24, 1., smoothstep(0., .16, up));                    // the dark line every chrome ball has at its horizon
  vec3 w0 = normalize(vec3(-.46, -.30, .84)), w1 = normalize(cross(w0, vec3(0., 0., 1.))), w2 = cross(w1, w0);
  float f = max(dot(r, w0), .001); vec2 q = abs(vec2(dot(r, w1), dot(r, w2)) / f) - vec2(.62, .40);
  c += vec3(1., .97, .91) * 1.0 * step(.05, dot(r, w0)) * (1. - smoothstep(0., .30, length(max(q, 0.)) + min(max(q.x, q.y), 0.)));
  c += vec3(1., .70, .36) * 2.0 * smoothstep(.992, .998, dot(r, normalize(vec3(.62, -.45, .55))));
  c += vec3(1., .74, .42) * 1.6 * smoothstep(.994, .999, dot(r, normalize(vec3(.30, .78, .40))));
  c += vec3(1., .72, .40) * 1.3 * smoothstep(.995, .999, dot(r, normalize(vec3(-.80, .42, .32))));
  return c;
}

// the ball's shadow on whatever is under it
vec4 shadow(vec4 f, vec2 p){
  float rad = uBall.z;
  float thrown = (1. - smoothstep(.55 * rad, 1.55 * rad, length(p - uBall.xy - vec2(.24, .32) * rad))) * .42;
  float seat = (1. - smoothstep(.80 * rad, 1.45 * rad, length(p - uBall.xy))) * .30;
  f.rgb *= 1. - max(thrown, seat);
  return f;
}

// the steel ball, drawn as a mirror: each point reflects either the room above or the lane beside it
vec4 ball(vec2 p, vec4 under){
  vec2 d = p - uBall.xy; float rad = uBall.z, rr = length(d) / rad, aa = uPx / rad * 1.2;
  if (rr > 1. + aa) return under;
  vec2 nxy = d / rad; float nz = sqrt(max(1. - dot(nxy, nxy), 0.));
  // The body is seen from straight above, but a mirror ball seen from straight above is a ring round a dark dot: it reads
  // as an eye. So the ball alone is looked at from in front and a little above, the way every picture of a chrome ball is
  // taken: the room in its upper part, a dark horizon, and the lane in front of it mirrored in its lower part.
  vec3 n = vec3(nxy, nz), nc = vec3(nxy.x, -nxy.y, nz), rc = vec3(2. * nz * nc.xy, 2. * nz * nz - 1.), c;
  const float ca = .80, sa = .60;                    // that viewpoint is 37 degrees above the floor
  vec3 nw = vec3(nc.x, nc.y * sa - nc.z * ca, nc.y * ca + nc.z * sa), rw = vec3(rc.x, rc.y * sa - rc.z * ca, rc.y * ca + rc.z * sa);
  if (rw.z < 0.) {                                   // looking down: follow the ray to the floor and see what is there
    float t = rad * (1. + nw.z) / max(-rw.z, .02);
    vec2 hw = rad * nw.xy + rw.xy * t, hit = uBall.xy + vec2(hw.x, -hw.y);
    vec4 f = scene(hit); vec3 fc = f.rgb + uPage * (1. - f.a);
    fc *= mix(.36, 1., smoothstep(.85 * rad, 2.0 * rad, length(hit - uBall.xy)));   // its own shadow, seen from underneath
    c = mix(fc, room(vec3(normalize(rw.xy + 1e-4), 0.)), smoothstep(3. * rad, 10. * rad, t));
  } else c = room(rw);
  // scratches and smudges, fixed to the steel, so they turn as it rolls
  float cs = cos(uRoll), sn = sin(uRoll);
  vec3 o = vec3(cs * n.x - sn * n.z, n.y, sn * n.x + cs * n.z);
  float fine = clamp(1.7 - uPx * .32, 0., 1.);
  float scr = smoothstep(.60, .95, vnoise(vec3(dot(o, vec3(.36, .93, .05)) * 64., dot(o, vec3(.93, -.36, .1)) * 3., dot(o, vec3(0., .1, 1.)) * 3.)))
            + smoothstep(.64, .95, vnoise(vec3(dot(o, vec3(-.6, .2, .77)) * 78., dot(o, vec3(.2, .97, -.1)) * 2.6, dot(o, vec3(.77, -.1, .6)) * 2.6) + 11.))
            + smoothstep(.68, .96, vnoise(vec3(dot(o, vec3(.1, -.5, .86)) * 56., dot(o, vec3(.99, .1, -.06)) * 2.2, dot(o, vec3(0., .86, .5)) * 2.2) + 23.));
  float smudge = vnoise(o * 2.4 + 4.) - .5;
  c *= 1. - fine * .11 * scr - .16 * smudge;
  c += fine * scr * .035;
  c *= (.72 + .28 * pow(1. - nz, 5.)) * vec3(.98, .955, .92);
  c = c / (1. + max(c - .82, 0.) * .9);                          // bright reflections roll off the way they do on film    // steel gives back less head-on than at a glancing angle
  float a = smoothstep(1. + aa, 1. - aa, rr);
  return under * (1. - a) + vec4(c * a, a);
}

` };

// ───────── sound ─────────
// Recorded sounds, not synthesised ones (generated with ElevenLabs sound effects, cut short and carried in this file as
// data): a steel ball hitting a plastic wall, a solenoid, a relay, a chime bar, and a loop of a ball rolling on wood. Each
// kind has a few takes; a take is never played twice running and its speed is nudged a little each time, so no two flips
// sound the same. On unless PinballKit.sound is set to false. Browsers only allow sound after the person has pressed
// something, so nothing is decoded until the first press on the page. PinballKit.voice = 'synth' plays the earlier
// noise-made versions instead.
const TAKES = { clack: 4, kick: 2, relay: 4, chime: 2, roll: 1 };
const bufs = {}, lastTake = {};
let ac, bus, noise, rollSrc, rollGain, rollLP, synGain, synFilter, rollLevel = 0;
function audio() {
  if (!api.sound) return null;
  if (!ac) {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ac = new AC();
    bus = ac.createGain(); bus.gain.value = api.level;
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -12; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.002; comp.release.value = 0.12;
    bus.connect(comp); comp.connect(ac.destination);
    noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(); src.buffer = noise; src.loop = true;
    synFilter = ac.createBiquadFilter(); synFilter.type = 'bandpass'; synFilter.frequency.value = 520; synFilter.Q.value = 0.9;
    synGain = ac.createGain(); synGain.gain.value = 0; src.connect(synFilter).connect(synGain).connect(bus); src.start();
    api.loaded = Promise.all(Object.entries(TAKES).flatMap(([name, n]) => Array.from({ length: n }, (_, i) =>
      Promise.resolve().then(() => new Promise((ok, no) => ac.decodeAudioData(bytes(SOUNDS[`${name}-${i}`]), ok, no))).then((b) => { (bufs[name] ||= [])[i] = b; if (name === 'roll') startRoll(b); }).catch(() => {}))));
  }
  if (ac.state === 'suspended') ac.resume()?.catch?.(() => {});
  bus.gain.value = api.level;
  return ac;
}
function startRoll(buffer) {
  rollSrc = ac.createBufferSource(); rollSrc.buffer = buffer; rollSrc.loop = true;
  rollLP = ac.createBiquadFilter(); rollLP.type = 'lowpass'; rollLP.frequency.value = 900;
  rollGain = ac.createGain(); rollGain.gain.value = 0;
  rollSrc.connect(rollLP).connect(rollGain).connect(bus); rollSrc.start();
}
const heard = (name, vol, rate) => { if (api.trace) api.heard.push({ t: +now.toFixed(3), name, vol: +vol.toFixed(2), rate: +rate.toFixed(2) }); };
// play one take. vol 0-1; rate is the speed, and so the pitch; lp dulls it; ring cuts a long tail short
function play(name, { vol = 0.5, rate = 1, jitter = 0.05, lp = 0, ring = 0 } = {}) {
  heard(name, vol, rate);
  const a = audio(); if (!a) return false;
  const list = (bufs[name] || []).filter(Boolean); if (!list.length) return false;
  let i = Math.floor(Math.random() * list.length); if (list.length > 1 && i === lastTake[name]) i = (i + 1) % list.length; lastTake[name] = i;
  const s = a.createBufferSource(), g = a.createGain(), t = a.currentTime;
  s.buffer = list[i]; s.playbackRate.value = rate * (1 + (Math.random() * 2 - 1) * jitter);
  g.gain.setValueAtTime(vol * (0.88 + 0.12 * Math.random()), t); if (ring) g.gain.setTargetAtTime(0, t + ring * 0.35, ring * 0.3);
  let end = s; if (lp) { const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; s.connect(f); end = f; }
  end.connect(g).connect(bus); s.start(t);
  return true;
}
function burst(freq, q, len, vol, type = 'bandpass') {
  const a = audio(); if (!a) return;
  const s = a.createBufferSource(); s.buffer = noise; const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = a.createGain(); g.gain.setValueAtTime(vol, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0005, a.currentTime + len);
  s.connect(f).connect(g).connect(bus); s.start(a.currentTime, Math.random() * 0.5, len + 0.02);
}
function thump(freq, len, vol) {
  const a = audio(); if (!a) return;
  const o = a.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(freq, a.currentTime); o.frequency.exponentialRampToValueAtTime(freq * 0.6, a.currentTime + len);
  const g = a.createGain(); g.gain.setValueAtTime(vol, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0005, a.currentTime + len);
  o.connect(g).connect(bus); o.start(); o.stop(a.currentTime + len + 0.02);
}
// the first press anywhere on the page starts the sound decoding, so the takes are ready by the time the click lands
const warm = () => { if (api.sound) audio(); if (ac) { removeEventListener('pointerdown', warm, true); removeEventListener('keydown', warm, true); } };
addEventListener('pointerdown', warm, true); addEventListener('keydown', warm, true);
const syn = () => api.voice === 'synth';
const sfx = {
  // the solenoid that sends the ball
  kick(k = 1) { if (syn()) { burst(1400, 1.5, 0.03, 0.3 * k); thump(120, 0.06, 0.35 * k); } else play('kick', { vol: clamp(0.4 * k, 0, 0.8), rate: 1.06 }); },
  // the ball on the wall: k is how hard, 0 to 1. A harder hit is louder and a little brighter
  clack(k) { k = clamp(k, 0.05, 1); if (syn()) { burst(2600, 1.2, 0.035, 0.5 * k); burst(900, 2, 0.06, 0.35 * k); thump(170, 0.09, 0.5 * k); } else play('clack', { vol: 0.28 + 0.62 * k, rate: 0.94 + 0.12 * k }); },
  // the ball knocking in its seat as it settles: the same hit, quieter, lower and duller
  tock(k) { k = clamp(k, 0, 1); if (k < 0.04) return; if (syn()) thump(150, 0.05, 0.3 * k); else play('clack', { vol: 0.5 * k, rate: 0.8, lp: 1500 }); },
  // a lamp's relay: closing is brighter than opening, and step raises the pitch a little along a row of lamps
  relay(on = true, step = 0) { if (syn()) burst(3800, 6, 0.018, 0.22, 'highpass'); else play('relay', { vol: on ? 0.34 : 0.24, rate: (on ? 1 : 0.8) * (1 + 0.025 * step) }); },
  // the chime bar. note is in semitones from the bar's own pitch (E5, 658 Hz); ring cuts the tail to that many seconds
  chime(note = 0, vol = 0.3, ring = 0) { if (!api.chimes || syn()) return; play('chime', { vol, rate: 2 ** (note / 12), jitter: 0, ring }); },
  roll(v) { rollLevel = Math.max(rollLevel, v); },   // call every frame with the ball's speed
};
const QUIET = Object.fromEntries(Object.keys(sfx).map((k) => [k, () => {}]));
function rollSound() {
  if (ac) {
    const v = clamp(rollLevel / 3.6), on = api.sound, t = ac.currentTime;
    if (rollGain) { rollGain.gain.setTargetAtTime(on && !syn() ? 0.6 * v ** 0.9 : 0, t, 0.025); rollSrc.playbackRate.setTargetAtTime(0.72 + 0.6 * v, t, 0.04); rollLP.frequency.setTargetAtTime(800 + 3000 * v, t, 0.04); }
    synGain.gain.setTargetAtTime(on && syn() ? 0.11 * v : 0, t, 0.02); synFilter.frequency.setTargetAtTime(380 + 620 * v, t, 0.03);
  }
  rollLevel = 0;
}

// ───────── the custom-element base ─────────
// A control with a value sets static formAssociated = true and a formValue() method; it then takes part in a <form> under
// its name attribute, and calls this.syncForm() whenever its value changes.
class Base extends HTMLElement {
  constructor() { super(); this.root = this.attachShadow({ mode: 'open', delegatesFocus: true }); try { this.internals = this.constructor.formAssociated ? this.attachInternals() : null; } catch { this.internals = null; } }
  syncForm() { if (this.internals && this.formValue) this.internals.setFormValue(this.formValue()); }
  get form() { return this.internals ? this.internals.form : null; }
  connectedCallback() {
    if (!this.ready) {
      this.ready = true; this.root.innerHTML = `<style>*{box-sizing:border-box}${this.constructor.css || ''}</style>${this.render()}`; this.setup(); this.syncForm();
      new ResizeObserver(() => { this.dirty = true; start(); }).observe(this);
      // disabled takes it out of the tab order and out of reach of a screen reader's press, not only the pointer's
      const off = () => { this.inert = this.hasAttribute('disabled'); }; off(); new MutationObserver(off).observe(this, { attributes: true, attributeFilter: ['disabled'] });
    }
    this.dirty = true; this.tickFn ||= (dt) => this.frame(dt); frames.add(this.tickFn); start();
  }
  disconnectedCallback() { frames.delete(this.tickFn); }
  $(s) { return this.root.querySelector(s); }
  get fx() { return this.silent || this.hasAttribute('silent') ? QUIET : sfx; }   // a control marked silent makes no sound
  render() { return ''; } setup() {} frame() { return false; }
  emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail })); }
}
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };

const api = window.PinballKit = {
  paused: false, rate: 1, sound: true, voice: 'recorded', chimes: true, level: 0.9, trace: false, heard: [],
  // how the ball moves. kick: the shove that starts it. tilt: the pull toward the far end. bounce: how much speed the wall
  // gives back. rock: how many times a second it rocks in its seat. settle: how fast the rocking dies (0 never, 1 at once).
  feel: { kick: 2.6, tilt: 9, drag: 1, bounce: 0.42, rock: 5, settle: 0.18 },
  get calm() { return calm; }, get now() { return now; },
  TAU, clamp, lerp, Spring, advance, later, start, asset, getGL, program, texture, paint, glsl, sfx, audio, Base, define,
};
})();
