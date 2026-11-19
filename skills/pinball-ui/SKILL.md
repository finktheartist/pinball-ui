---
name: pinball-ui
description: Build, change or wire in a UI control styled as a real pinball part (a photographed body, a chrome ball drawn live in WebGL that mirrors what is under it, recorded solenoid, relay and chime sounds), using the Pinball UI core. Use when asked to add one of the pinball-* controls to an app, to change how one moves or sounds, or to make a new control in the same style. Covers the core, the recipe for the photographed plates, the ball, the sounds, and the rules the set settled on.
---

# Pinball UI

A Pinball UI control is an ordinary control (a switch, a slider, a checkbox group) built from a real pinball part that already does that job: a ball in a lane for a switch, a row of lamps for a slider, a shooter rod for send, drop targets for checkboxes, the outhole and SHOOT AGAIN for delete and undo. The body is a photograph; the ball, the moving parts and the lamps' glow are drawn live; every hit is a recorded sound. A real control lies on top, so it still works with a keyboard, a screen reader and a form.

This skill is the workflow the set was made by. It comes with:

- `core.js`, the shared core, with the recorded sounds inside it.
- `starter.html`, the smallest whole example: a switch with no photographs, the lane worked out in the shader. Copy it to start a new one.
- `look.mjs`, which photographs a page at chosen moments after an action and saves the frames on one sheet.

If the job is only to put an existing control into an app, skip to **Wire it in** and **Check it**.

## 1. Decide three things first

1. **The control.** With the picture taken away it must still be that control: a real `<button>`, `role="switch"`, `role="slider"`, `role="spinbutton"`, `role="checkbox"` inside, with keys and focus.
2. **The pinball part that already does that job.** If you have to explain it, pick again. The part is the hero: when the plunger was first put in a tray, the note was "the plunger should be the main mass of the component". A control does not need a case round it.
3. **What the ball does.** Most controls have one: it is kicked, rolls, hits something, rocks and settles, and something lights when it gets there. Work out where the lamp's switch closes (the moment the ball reaches it) before anything is drawn.

## 2. The core

Load `core.js` and everything is on `window.PinballKit` (`K` below):

- `K.Base` is the custom-element base. Give the class `static css`, `render()` (the shadow root's HTML: a canvas and the real control), `setup()`, `frame(dt)` (return true while something is still moving) and `draw()`. `this.$(sel)` finds in the shadow root, `this.emit(type, detail)` fires a bubbling event, `this.fx` is the sound (silent if the element has `silent`). `static formAssociated = true` plus `formValue()` puts it in a form; call `this.syncForm()` when the value changes.
- `K.later(ms, f)`, `K.start()` and one clock for every control on the page. `K.rate` slows everything (0.2 for slow motion), `K.paused` stops it, `K.advance(dt)` steps it by hand for filming.
- `K.Spring(x, k, d)` for flinches and pops. `K.feel` holds the ball's numbers: `kick`, `tilt` (the pull toward the far end), `bounce` off a wall, `rock` (rocks a second in a seat) and `settle`.
- **One WebGL context for the whole page.** `K.program(K.glsl.vs, fragment)` compiles; `K.texture(src, onload)` loads a plate with mipmaps (drawn onto a power-of-two canvas first, or a plate shown small shimmers); `K.paint(prog, w, h, setUniforms, canvas)` draws one pass and copies it onto the control's own 2D canvas.
- `K.glsl.head` and `K.glsl.ball` are the shared shader. Your fragment shader supplies `vec4 scene(vec2 p)`, what the body looks like at a point in plate pixels, and a `main` that returns `ball(p, shadow(scene(p), p))`. Set `uView` (the part of the plate the canvas shows), `uBall` (x, y, radius), `uRoll`, `uPx` (plate pixels per device pixel) and `uPage` (the page colour, from `--pb-page`).
- `K.sfx`: `kick(k)`, `clack(k)` (the ball on a wall, k is how hard), `tock(k)` (knocking in its seat), `relay(on, step)` (a lamp's switch; step raises the pitch along a row), `chime(semitones, vol, ring)`, and `roll(speed)` every frame while the ball moves.
- `K.calm` is `prefers-reduced-motion`: put the ball where it ends up and skip the travel.

## 3. Making the plates

The bodies are generated photographs (GPT Image through Higgsfield for the first ones, a Gemini image tool for the later ones). The recipe:

- **Straight down, orthographic, one object.** "A single object on a fully transparent background, photographed from directly above, perfectly front-on and orthographic, no perspective, no tilt, no depth of field, soft even studio light from the top left, tack sharp." If the tool cannot do transparency, ask for pure white and flood-fill the background from the edge.
- **Ordinary control proportions.** A switch's lane is about two and a half times as wide as it is tall; a slider's is longer. The plate is a part at UI size, not a scene.
- **Empty where the code draws.** No ball in the lane, no numbers in the score-reel window, no labels on the drop targets: "There is no ball and nothing else in the tray." The ball, the drums and the labels are drawn live.
- **The lit plate is an edit of the unlit one.** Pass the unlit plate as the image reference: "Edit the reference image. Keep it pixel-for-pixel identical in framing, position, size ... Change only the lighting: the round ridged plastic insert lens is now lit from a warm incandescent bulb beneath it." Then the two line up and lighting a lamp is a mix between them. The edit can come back with a faint haze over the transparent background: cut it with the unlit plate's alpha and composite it over the unlit plate.
- **A sibling is a reference too.** Pass an existing plate and ask for "a longer sibling of this object" so the set keeps one material, rim and light.
- **Measure, then draw.** Read the seats, the walls, the lamp lenses and the windows off the plate in its own pixels, and write them at the top of the file as constants. Everything in the shader and the physics uses those numbers.

## 4. The ball

- **Drawn, not photographed.** A photographed ball that slides was tried and lost to a live one: a mirror ball has to reflect what it rolls over.
- **Not seen from straight above.** A mirror ball drawn top-down is a bright ring round a dark dot, and it reads as an eye. The core draws the ball alone as if seen from in front and 37 degrees up: the room in its upper half, a dark horizon, and the lane in front of it mirrored in the lower half by following each ray to the floor. That reads as chrome at once.
- **Scratches fixed to the steel,** so they turn as it rolls (`uRoll`).
- **Physics is one line.** The ball moves along its lane: a kick, a pull toward the far end, a wall a little past the seat with a bounce, then a damped rock in the seat. Step it in small fixed steps (2 to 4 ms). Light the lamp when the ball arrives, not when it is pressed.
- **When a part carries the ball,** the ball rides the part and only takes its own speed as the part comes home (the plunger moves far faster than the shot).

## 5. The sounds

Recorded, not synthesised: the synthesised ones were replaced on the first listen. They were generated with ElevenLabs sound effects (four takes a prompt), trimmed, faded and normalised. Each kind has several takes; never play the same take twice running and nudge its speed a few percent each time, so no two flips sound alike. Ask for "one single" event, "recorded very close, dry, no reverb, nothing before or after it". A prompt for a soft tock came back as several faint taps: listen to, or at least look at the waveform of, every take before keeping it.

## 6. The rules

These are the corrections that came up, in the order they did.

- **Controls, not photographs of a machine.** Liking a board of lit macro close-ups meant the subject matter (lit inserts, bumper caps, a chrome ball, warm glow), not photographs as controls. Whole-control photographs and generated video clips "look nothing like UI components" and were dropped. Flat, front-on, real UI sizes.
- **Real materials on a control shape.** Once flat, the next question was how to make them realistic: photographed plates for the body, a live ball, lamps that warm up from red to amber with one stumble like an old bulb.
- **Plates with a live ball** is the method for every control, picked from three versions of the toggle (plates only, plates with a live ball, full 3D).
- **Make it satisfying in the roll.** Most of the tuning went into the ball: the kick, the wall, the knocks fading in its seat.
- **The named part is the hero.** "Classic pinball knob" meant a bare shooter rod with nothing round it.
- **Put the ball where the hand expects it.** The plunger's ball drops right in front of the pulled-back tip, not where the tip rests at home.
- **Springs are round wire,** not a striped flat coil: find the nearest point on the helix and shade it as plated steel.
- **No real machines.** No table names, makers' names or logos, in prompts or on the art. SHOOT AGAIN, WHEN LIT and score numbers are generic pinball words.

## Wire it in

Copy the control's file into the project's static folder (or `npx shadcn add finktheartist/pinball-ui/NAME`) and load it with a plain script tag, not as a module. Do not split or re-bundle it: the plates and sounds are inside it as data.

- Size it with `--pb-size` (the height). Set `--pb-page` to the page background as a hex colour so the ball's reflections match.
- Attributes set where it starts; use the properties and methods after that. Listen for the events in its README.
- Sound starts with the first press on the page. `silent` mutes one control; `PinballKit.sound = false` mutes all.

## Check it

- `node look.mjs URL --act "..." --times 0,60,140,260,420,700` and look at every frame: where the ball is, when the lamp lights, whether the ball still reads as chrome at the size it is shown.
- Use it with a keyboard and at phone width; check nothing scrolls sideways (the canvases reach outside the element for shadows and glow).
- A new canvas is 300 by 150 until it is sized: check both width and height before skipping a resize.
- Where a texture coordinate jumps (a rod with a piece left out of its middle), read both sides and pick one, or a hairline appears.
- GLSL ES 1 reserves some words you might reach for: `cast` is one.
- Headless Chromium's software WebGL can lose its context in long runs. For filming, start it with `--ignore-gpu-blocklist --enable-gpu` and check the context is still alive.
