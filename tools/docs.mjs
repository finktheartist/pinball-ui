// Write every folder's README.md and index.html, the gallery, registry.json and llms.txt from tools/spec.mjs.
//   node tools/docs.mjs          (run it after editing tools/spec.mjs, and after tools/build.mjs, since file sizes are quoted)
//   node tools/docs.mjs --check  (exits 1 if anything is out of date, and changes nothing)
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SPEC, REPO, SITE, AUTHOR, COMMON_LIMITS } from './spec.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'), check = process.argv.includes('--check');
let stale = 0;
const put = (rel, next) => {
  let was = ''; try { was = readFileSync(join(root, rel), 'utf8'); } catch {}
  if (next !== was) { stale++; if (!check) writeFileSync(join(root, rel), next); console.log(`${check ? 'stale' : 'wrote'} ${rel}`); }
};
const bytes = (id) => statSync(join(root, id, id + '.js')).size;
const size = (id) => `${Math.round(bytes(id) / 1024)} KB`;
const table = (head, rows) => `| ${head.join(' | ')} |\n|${head.map(() => '---').join('|')}|\n` + rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
const COUNT = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'][SPEC.length];
const Count = COUNT[0].toUpperCase() + COUNT.slice(1);
const tags = (c) => (c.extra ? `<pinball-bumper> and <${c.tag}>` : `<${c.tag}>`);
// the page the set was photographed for: warm cream, dark ink, the lamps' amber and the bumpers' red
const PAGE = `:root { --bg: #f3efe5; --ink: #2b2620; --dim: #7a7064; --line: #d9d1c1; --amber: #c9700f; --red: #b3322b; }
  * { box-sizing: border-box; }
  html { overflow-x: clip; background: var(--bg); }
  body { margin: 0; color: var(--ink); font: 15px/1.5 Georgia, "Iowan Old Style", "Times New Roman", serif; overflow-x: clip; }
  a { color: var(--red); } :focus-visible { outline: 2.5px solid var(--amber); outline-offset: 3px; }
  .label { font: 600 11px/1.3 "Futura", "Century Gothic", "Avenir Next", "Trebuchet MS", sans-serif; letter-spacing: .16em; text-transform: uppercase; }
  .pill { min-height: 34px; padding: 5px 14px; border: 1.5px solid var(--ink); border-radius: 999px; background: transparent; color: var(--ink); font: 600 11.5px/1.2 "Futura", "Century Gothic", "Avenir Next", "Trebuchet MS", sans-serif; letter-spacing: .12em; text-transform: uppercase; text-decoration: none; cursor: pointer; display: inline-flex; align-items: center; }
  .pill:hover { background: var(--ink); color: var(--bg); } .pill:active { translate: 0 1px; } .pill[aria-pressed="false"] { opacity: .55; }`;
const SOUND_PILL = '<button class="pill" type="button" id="sound" aria-pressed="true">Sound on</button>';
const SOUND_JS = "const snd = document.getElementById('sound'); snd.onclick = () => { PinballKit.sound = !PinballKit.sound; snd.setAttribute('aria-pressed', String(PinballKit.sound)); snd.textContent = PinballKit.sound ? 'Sound on' : 'Sound off'; };";

for (const c of SPEC) {
  // ---- the folder's README
  put(`${c.id}/README.md`, `# ${c.name}

${c.intro.join('\n\n')}

One of ${COUNT} files in this repo. Same idea in each (an ordinary control as a real pinball part: a photographed body, a live chrome ball, recorded sounds), different control.

## Run it

\`\`\`sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/${c.id}/
\`\`\`

\`?embed=1\` hides the heading and the hint.

## Use it

\`${c.id}.js\` is the whole control: one file of about ${size(c.id)} with its photographs and sounds inside it, and no dependencies.

\`\`\`html
${c.use}
\`\`\`

\`\`\`js
${c.js}
\`\`\`

${table(['attribute', 'what it sets', 'default'], c.attrs)}

${c.notes.map((n) => `- ${n}`).join('\n')}
- **Attributes set where it starts.** After that, use the properties and methods above.
- **Sound is on.** It plays after the first press on the page, as browsers require. Add \`silent\` to the element to mute it, or set \`PinballKit.sound = false\` to mute every pinball control on the page.

## What happens

${table(['you', 'it'], c.happens)}

${c.id === 'plunger' ? 'It does not change with \`prefers-reduced-motion\` yet: the pull and the shot still play.' : 'With \`prefers-reduced-motion\` the ball and the moving parts go straight to where they end up, and the lamps still light.'}

## Limits

${[...c.limits, ...COMMON_LIMITS].map((l) => `- ${l}`).join('\n')}
`);

  // ---- the folder's demo page
  put(`${c.id}/index.html`, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pinball UI / ${c.name}</title>
<style>
  ${PAGE}
  body { min-height: 100vh; display: grid; place-items: center; }
  main { width: min(720px, 100vw - 32px); padding: 26px 0 46px; }
  .cap { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin: 0 2px 12px; color: var(--dim); }
  .cap h1 { margin: 0; color: var(--ink); font-size: 13px; white-space: nowrap; } .cap span { text-align: right; }
  .stage { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 28px; padding: 12% 0 10%; --pb-size: ${c.size.page}; }
  .said { margin: 6px 0 0; min-height: 24px; color: var(--amber); text-align: center; }
  .hint { margin: 10px 0 0; color: var(--dim); font-size: 14px; text-align: center; }
  .tools { display: flex; justify-content: center; gap: 8px; margin-top: 14px; }
  .embed body { place-items: start center; min-height: 0; } .embed .cap, .embed .hint, .embed .tools { display: none; } .embed main { padding: 0 0 8px; } .embed .stage { padding: 7% 0 5%; }
</style>
</head>
<body>
<main>
  <div class="cap label"><h1>${c.name}</h1><span>${c.kind} / &lt;${c.tag}&gt;</span></div>
  <div class="stage">
    ${c.demo.html}${c.extra ? '\n    ' + c.extra.page : ''}
  </div>
  <p class="said label" aria-hidden="true"></p>
  <p class="hint">${c.demo.hint}</p>
  <p class="tools">${SOUND_PILL}</p>
  <p class="hint back"><a href="../gallery/">All ${COUNT}</a> · <a href="https://github.com/${REPO}/blob/main/${c.id}/README.md">Docs</a></p>
</main>
<script src="${c.id}.js"></script>
<script>
// This page's own wiring. The control is all in ${c.id}.js.
// ?embed=1 hides the heading and the hints.
const Q = new URLSearchParams(location.search), el = document.getElementById('el'), said = document.querySelector('.said');
if (Q.get('embed') === '1') { document.documentElement.classList.add('embed'); document.querySelector('.back').hidden = true; }
const say = (t) => { said.textContent = t; };
${c.wire}${c.extra ? "\ndocument.getElementById('one').addEventListener('hit', (e) => say('Clap ' + e.detail.count));" : ''}
${SOUND_JS}
</script>
</body>
</html>
`);
}

// ---- the gallery: every control live, with its install line and a prompt for a coding agent
const items = SPEC.map((c) => ({ id: c.id, name: c.name, tag: c.tag, tags: tags(c), kind: c.kind, size: c.size.gallery, html: c.demo.html.replace(' id="el"', '') + (c.extra ? c.extra.gallery : ''), wire: c.wire, docs: c.docs, desc: c.desc }));
put('gallery/index.html', `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Pinball UI</title>
<meta name="description" content="${Count} ordinary UI controls as real pinball parts: photographed bodies, a live chrome ball, recorded sounds. Each is a single file with no dependencies.">
<meta property="og:title" content="Pinball UI">
<meta property="og:description" content="${Count} ordinary UI controls as real pinball parts.">
<meta property="og:image" content="title.jpg">
<style>
  ${PAGE}
  .wrap { max-width: 1400px; margin: 0 auto; padding: 26px 16px 70px; }
  header { max-width: 800px; margin: 0 auto; text-align: center; }
  header img { display: block; width: 100%; height: auto; aspect-ratio: 1600 / 700; }
  h1 { margin: 10px 0 0; font-size: 17px; letter-spacing: .28em; }
  .lede { margin: 10px auto 0; max-width: 600px; color: var(--dim); font-size: 16px; }
  .links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 18px 0 0; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 1fr)); gap: 30px 26px; margin-top: 46px; align-items: stretch; }
  .item { min-width: 0; display: flex; flex-direction: column; border-top: 1.5px solid var(--ink); padding-top: 12px; }
  .cap { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin: 0 2px; color: var(--dim); }
  .cap h2 { margin: 0; color: var(--ink); font-size: 12.5px; white-space: nowrap; } .cap span { text-align: right; }
  .stage { flex: 1; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 22px; min-height: 260px; padding: 34px 0 26px; }
  .said { margin: 0; min-height: 20px; color: var(--amber); text-align: center; }
  .acts { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 10px; }
  .note { margin: 56px auto 0; max-width: 640px; text-align: center; color: var(--dim); font-size: 14px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <img src="title.jpg" width="1600" height="700" alt="Pinball UI: the controls laid out on cream, a chrome-ball toggle and slider, a shooter rod, flipper stepper, drop-target bank, drain and pop bumpers.">
    <h1 class="label">Pinball UI</h1>
    <p class="lede">${Count} ordinary controls as real pinball parts. The bodies are photographs, the ball is chrome drawn live, and every flip, lamp and chime is a recorded sound. Each is a single file with no dependencies.</p>
    <p class="links">
      <a class="pill" href="https://github.com/${REPO}" target="_blank" rel="noopener">The repo on GitHub</a>
      <a class="pill" href="https://x.com/crtvTeknologist" target="_blank" rel="noopener">@crtvTeknologist on X</a>
      ${SOUND_PILL}
    </p>
  </header>
  <main class="grid" id="grid"></main>
  <p class="note">Everything here is live: use the controls. Sound starts with your first press. With <code>prefers-reduced-motion</code> the parts go straight to where they end up.</p>
  <p class="sr" aria-live="polite" id="copied"></p>
</div>
${SPEC.map((c) => `<script src="../${c.id}/${c.id}.js"></script>`).join('\n')}
<script>
// The gallery: every control live on one page, with its install line and a prompt that hands a coding agent the real file.
const REPO = '${REPO}', SITE = '${SITE}';
const ITEMS = ${JSON.stringify(items.map(({ wire, ...rest }) => rest), null, 2)};
const WIRE = {
${items.map((c) => `  ${c.id}: (el, say) => { ${c.wire} },`).join('\n')}
};
const grid = document.getElementById('grid'), copied = document.getElementById('copied');
const copy = async (btn, text) => { try { await navigator.clipboard.writeText(text); } catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); } const was = btn.textContent; btn.textContent = 'Copied'; copied.textContent = 'Copied to the clipboard'; setTimeout(() => { btn.textContent = was; copied.textContent = ''; }, 1400); };
for (const c of ITEMS) {
  const s = document.createElement('section'); s.className = 'item'; s.id = c.id;
  s.innerHTML = '<div class="cap label"><h2></h2><span></span></div><div class="stage">' + c.html + '</div><p class="said label" aria-hidden="true"></p><div class="acts"><button class="pill" type="button" data-a="install">Copy install</button><button class="pill" type="button" data-a="prompt">Copy a prompt</button><a class="pill" href="../' + c.id + '/">Open</a></div>';
  s.querySelector('h2').textContent = c.name; s.querySelector('.cap span').textContent = c.kind;
  s.querySelector('.stage').style.setProperty('--pb-size', c.size);
  grid.appendChild(s);
  const el = s.querySelector(c.tag), said = s.querySelector('.said');
  WIRE[c.id](el, (t) => { said.textContent = t; });
  const install = 'npx shadcn add ' + REPO + '/' + c.id;
  const prompt = 'Add the Pinball UI "' + c.name + '" control to this project. It is one plain script with no dependencies that registers ' + c.tags + ': ' + c.desc + '\\n\\n1. Download ' + SITE + '/' + c.id + '/' + c.id + '.js into the folder this project serves static files from (for example public/pinball-ui/' + c.id + '.js), or run: ' + install + '\\n2. Load it with a plain script tag, not as a module, and do not edit, split or re-bundle the file: its photographs and sounds are inside it as data.\\n3. In the page, ' + c.docs + '\\n4. Size it with the CSS variable --pb-size (its height), and set --pb-page to the page background colour as a hex value so the chrome ball reflects it. It plays sound after the first press; add the silent attribute to mute it.\\n\\nFull notes: https://github.com/' + REPO + '/blob/main/' + c.id + '/README.md';
  s.querySelector('[data-a=install]').addEventListener('click', (e) => copy(e.currentTarget, install));
  s.querySelector('[data-a=prompt]').addEventListener('click', (e) => copy(e.currentTarget, prompt));
}
${SOUND_JS}
</script>
</body>
</html>
`);

// ---- registry.json, for `npx shadcn add finktheartist/pinball-ui/NAME`
put('registry.json', JSON.stringify({
  $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'pinball-ui', homepage: SITE,
  items: SPEC.map((c) => ({
    name: c.id, type: 'registry:file', title: `Pinball UI ${c.name}`,
    description: `${c.desc} One file of about ${size(c.id)} with its photographs and sounds inside it, no dependencies, defines ${tags(c)}.`,
    author: AUTHOR, categories: c.categories,
    files: [{ path: `${c.id}/${c.id}.js`, type: 'registry:file', target: `~/public/pinball-ui/${c.id}.js` }],
    docs: `Pinball UI ${c.name} is a plain script that registers a custom element. Load /pinball-ui/${c.id}.js with a script tag (not a module), ${c.docs} Size it with --pb-size. More: ${SITE}`,
  })),
}, null, 2) + '\n');

// ---- llms.txt
put('llms.txt', `# Pinball UI

> ${Count} ordinary UI controls as real pinball parts: photographed bodies (a lane, a shooter rod, flippers and a score reel, a drop-target bank, an outhole, pop bumpers), a chrome ball drawn live in WebGL that mirrors what is under it, and recorded sounds (solenoids, relays, chimes, a rolling ball). Each is one plain script that registers a custom element, with its photographs and sounds inside it: no dependencies, no build step, no other files to fetch. MIT licensed. No real machine's names, art or logos are used.

Live gallery: ${SITE}
Source: https://github.com/${REPO}

## Drop-in controls

Each is one plain script that registers a custom element. Load it with a script tag, not as a module. Do not rewrite or split the file: the photographs and sounds are inside it as data. Each file carries a copy of the shared core; the first one loaded sets window.PinballKit and the rest reuse it, so any mix shares one clock and one WebGL context.

${SPEC.map((c) => `- [${c.name}](${SITE}/${c.id}/${c.id}.js) (${c.kind}, about ${size(c.id)}): ${c.desc} \`${tags(c)}\`: ${c.docs.replace(/^then use /, 'Use ')} [Docs](https://github.com/${REPO}/blob/main/${c.id}/README.md)`).join('\n')}

Install any one with the shadcn CLI: \`npx shadcn add ${REPO}/NAME\`, where NAME is ${SPEC.map((c) => c.id).join(', ')}. The file lands in \`public/pinball-ui/\`.

Size each with the CSS variable --pb-size (its height). Set --pb-page to the page background as a hex colour so the ball's reflections match (default cream, #f3efe5). Attributes set the starting state; use properties and methods after that. Value controls (toggle, slider, stepper, targets) work in a form with a name. Sound plays after the first press on the page; the silent attribute mutes one control and PinballKit.sound = false mutes all. With prefers-reduced-motion the parts go straight to where they end up.

## The skill

- [pinball-ui skill](${SITE}/skills/pinball-ui/SKILL.md): the workflow and rules these were made by. Install with \`npx skills add ${REPO}\`.
- [core.js](${SITE}/skills/pinball-ui/core.js): the shared core (the clock, the custom-element base, one WebGL context, the chrome ball's shader, the sounds).
- [starter.html](${SITE}/skills/pinball-ui/starter.html): the smallest whole example, a ball in a lane drawn without photographs.
- [look.mjs](${SITE}/skills/pinball-ui/look.mjs): photographs a page at chosen moments after an action and saves the frames side by side.

## How it was made

- [making-of/README.md](${SITE}/making-of/README.md): the directions that were dropped, how the plates were made and lined up, how the ball is drawn, and where the sounds came from.
- [making-of/prompts.md](${SITE}/making-of/prompts.md): every image and sound prompt and setting.
`);
if (check && stale) process.exit(1);
