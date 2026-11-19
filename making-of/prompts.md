# Prompts

Every prompt used to make Pinball UI's photographs and sounds, copied from the agent session transcripts, in order. Paths name files in the working folder the set was made in: `art/` and `art/raw/` hold the plates (the shipped ones are inside each control file, and some raw ones are in [plates/](plates/)), and `concepts/roundN/NAME.png` is shipped here as [concepts/roundN-NAME.jpg](concepts/) where it is shown at all. Prompt text is exact. The one edit: Antigravity names its outputs with a 13-digit timestamp suffix (for example `targets_bank_off_[timestamp].jpg`), and those suffixes are replaced with `[timestamp]`. Job ids, media ids and URLs are left out, and each reference image is described by what it was.

The art came from two agent sessions:

- **Claude Code, 2026-11-18**: concept rounds 1 to 5, the motion mock-ups, and the toggle, ball, slider, plunger, rod and bracket plates. These used the Higgsfield connector (model `gpt_image_2_6` for every still). The sounds came from the ElevenLabs connector.
- **Antigravity (a Gemini coding agent), 2026-11-18 to 2026-11-19**: the stepper, flipper, target-bank, drop-target, drain and bumper plates. The main agent wrote a brief and passed it to an `image-generator` subagent, which rewrote it into the final prompt for its `generate_image` tool. Below is that final prompt, the text the image tool received, not the brief. Raw outputs are JPEGs on white. The transparent `.webp` files in `art/` were cut out locally afterwards with a flood fill of the white background (`art/raw/*.jpg` are byte-identical to the generated files).

No Higgsfield `upscale_image`, `remove_background`, `outpaint_image` or video-upscale call was made for this set.

## The shipped plates

`plunger-off` and `plunger-on`, the first plunger with a tray round it, are left out: that version was dropped.

### toggle-off

- **Files:** `art/toggle-off.webp`, raw `art/raw/toggle-off.png`
- **Tool / model:** Higgsfield `generate_image_batch` (request 1 of 2), model `gpt_image_2_6`
- **Settings:** `aspect_ratio: 21:9`, `quality: high`, `background: transparent`
- **Image reference:** none (text only). Generated in one batch with the ball plate.

Prompt:

```text
A single object on a fully transparent background, photographed from directly above, perfectly front-on and orthographic, no perspective, no tilt, no depth of field, soft even studio light from the top left, tack sharp. The object is the body of a toggle switch built like a part from a vintage 1960s electromechanical pinball machine: one horizontal pill-shaped (stadium-shaped) tray with perfectly semicircular ends, about two and a half times as wide as it is tall, filling most of the frame width and centred. It has a thick raised rim of glossy tomato-red plastic all the way round with a thin cream pinstripe, and inside the rim a recessed flat floor of screen-printed teal painted wood with fine grain and light wear. Set flush into the floor at the far right end, centred in the right semicircle, is one round translucent cream plastic insert lens with fine concentric ridges, unlit and dull. The left end of the floor is plain teal paint with a very shallow round dimple. There is no ball and nothing else in the tray. Real materials, subtle scratches, a soft contact shadow hugging the outside of the rim. No text, no logos.
```

### toggle-on

- **Files:** `art/toggle-on.webp`, raw `art/raw/toggle-on.png`
- **Tool / model:** Higgsfield `generate_image`, model `gpt_image_2_6`
- **Settings:** `aspect_ratio: 21:9`, `quality: high`, `background: transparent`
- **Image reference:** the **toggle-off plate** (the generation above), passed as `image_references`.
- **An edit of toggle-off:** the lit plate was made by editing the unlit one so the two line up.

Prompt:

```text
Edit the reference image. Keep it pixel-for-pixel identical in framing, position, size, shape, the red plastic rim with its cream pinstripe, the teal painted wood floor, every scratch and the transparent background. Change only the lighting from one source: the round ridged plastic insert lens at the right end is now lit from a warm incandescent bulb beneath it and glows bright warm amber, brightest at its centre with the concentric ridges still visible, and its light spills softly onto the teal floor beside it and onto the inside of the red rim around the right end. The left two thirds of the object stay exactly as they are.
```

### ball

- **Files:** `art/ball.webp`, raw `art/raw/ball.png`
- **Tool / model:** Higgsfield `generate_image_batch` (request 2 of 2), model `gpt_image_2_6`
- **Settings:** `aspect_ratio: 1:1`, `quality: high`, `background: transparent`
- **Image reference:** none (text only). Request 2 of the toggle-off batch.

Prompt:

```text
A single mirror-polished chrome steel pinball on a fully transparent background, photographed from directly above, perfectly centred, filling about eighty percent of the frame, tack sharp. It reflects a dim warm studio: one large soft rectangular light reflected in the upper left, a few small warm round lamp reflections, a darker band around the horizon, and fine hairline scratches on the steel. Perfectly circular silhouette. No shadow, no surface underneath, nothing else in the picture. No text, no logos.
```

### slider-off

- **Files:** `art/slider-off.webp`, raw `art/raw/slider-off.png`
- **Tool / model:** Higgsfield `generate_image`, model `gpt_image_2_6`
- **Settings:** `aspect_ratio: 21:9`, `quality: high`, `background: transparent`
- **Image reference:** the **toggle-off plate**, passed as `image_references` ("a longer sibling of the object in the reference image").

Prompt:

```text
Make a longer sibling of the object in the reference image, in exactly the same materials, colours, lighting and camera: photographed from directly above, perfectly front-on and orthographic, no perspective, no depth of field, soft even studio light from the top left, fully transparent background, tack sharp. The new object is one long horizontal pill-shaped (stadium-shaped) tray with perfectly semicircular ends, about six times as wide as it is tall, perfectly horizontal, centred, spanning almost the full width of the frame. Same thick raised rim of glossy tomato-red plastic with a thin cream pinstripe all the way round; same recessed flat floor of screen-printed teal painted wood with fine grain and light wear. Set flush into the floor, in one straight row along the centre line, are exactly ten small identical round translucent cream plastic insert lenses with fine concentric ridges, evenly spaced from one end of the floor to the other, each about half as tall as the floor, with teal wood visible between them and above and below them. All ten lenses are unlit and dull. There is no ball and nothing else in the tray. Real materials, subtle scratches, a soft contact shadow hugging the outside of the rim. No text, no numbers, no logos.
```

### slider-on

- **Files:** `art/slider-on.webp`, raws `art/raw/slider-on.png` (as generated) and `art/raw/slider-on-clean.png`
- **Tool / model:** Higgsfield `generate_image`, model `gpt_image_2_6`
- **Settings:** `aspect_ratio: 21:9`, `quality: high`, `background: transparent`
- **Image reference:** the **slider-off plate**, passed as `image_references`.
- **An edit of slider-off.**
- Post-processing: the lit edit came back with a haze over the transparent background, so it was cut with the unlit plate's alpha and composited over the unlit plate (`slider-on-clean.png`).

Prompt:

```text
Edit the reference image. Keep it pixel-for-pixel identical in framing, position, size and shape: the red plastic rim with its cream pinstripe, the teal painted wood floor, every scratch, the ten round lenses in exactly the same places, and the transparent background. Change only the lighting: all ten round ridged plastic insert lenses are now lit from warm incandescent bulbs beneath them and glow bright warm amber, each brightest at its centre with its concentric ridges still visible, and their light spills softly onto the teal floor between and around them and onto the inside of the red rim. Nothing moves and nothing else changes.
```

### rod

- **Files:** `art/rod.webp`, raw `art/raw/rod.png`
- **Tool / model:** Higgsfield `generate_image_batch` (request 1 of 2), model `gpt_image_2_6`
- **Settings:** `aspect_ratio: 21:9`, `quality: high`, `background: transparent`
- **Image reference:** none (text only). Generated in one batch with the bracket.

Prompt:

```text
A single object on a fully transparent background: the shooter rod (ball plunger) from a classic 1960s electromechanical pinball machine, removed from the machine and lying perfectly horizontal, photographed from directly above, orthographic, no perspective, no depth of field, soft even studio light from the top left, tack sharp. From right to left it is: a large glossy black bakelite ball-shaped knob with a soft window highlight, the classic round pinball shooter knob; a short polished chrome collar where the knob meets the rod; then a long, perfectly straight, perfectly horizontal polished chrome steel rod of constant thickness, about one sixth as thick as the knob is tall, running most of the width of the frame; and at the far left end of the rod a small cylindrical dark red rubber tip, about twice as thick as the rod and about as long as it is thick. The knob is at the right edge area and the rubber tip at the left edge area, with the whole part spanning almost the full width of the frame and vertically centred. There are no springs, no washers, no housing, no bracket, no ball and nothing else. No shadow on the background. Real worn materials with fine scratches. No text, no logos.
```

### bracket

- **Files:** `art/bracket.webp`, raw `art/raw/bracket.png`
- **Tool / model:** Higgsfield `generate_image_batch` (request 2 of 2), model `gpt_image_2_6`
- **Settings:** `aspect_ratio: 1:1`, `quality: high`, `background: transparent`
- **Image reference:** none (text only).

Prompt:

```text
A single object on a fully transparent background, photographed from directly above, orthographic, no perspective, no depth of field, soft even studio light from the top left, tack sharp: a small vintage steel mounting bracket from a 1960s pinball machine, a plain rectangular strap of worn brushed nickel-plated steel standing taller than it is wide, about twice as tall as wide, with softly rounded corners, slightly raised and arched across its middle like a saddle clamp that holds a rod, and one slotted screw head near the top end and one near the bottom end. It fills about eighty percent of the frame height, centred. Fine scratches and a little tarnish. No shadow on the background, nothing else in the picture, no rod, no text, no logos.
```

### stepper-housing-off

- **Files:** `art/stepper-housing-off.webp`, raw `art/raw/stepper-housing-off.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 4:3` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** round-3 concept `concepts/round3/04-stepper.png`; the shipped `art/bracket.webp`; the shipped `art/toggle-off.webp`

Prompt:

```text
A straight-down, dead-center 90-degree orthographic top-down studio macro photograph of a standalone vintage 1960s electromechanical pinball score-reel metal bezel housing with an integrated top indicator lamp, isolated on a pure solid white (#FFFFFF) background.

Composition & Layout:
- Flat 90-degree top-down overhead orthographic perspective, completely symmetrical and level, zero tilt or angle, centered with generous solid white margin all around.
- Lower portion: Sturdy rounded-rectangle beveled brushed-steel bezel frame (horizontal rectangle, roughly 1.55:1 aspect ratio), styled with aged tarnished nickel-steel metal, fine micro-scratches, chamfered rim, and authentic 1960s pinball patina as seen in the reference bracket.
- Inside the rectangular bezel: A COMPLETELY EMPTY dark matte-black recessed rectangular aperture / hole. Absolutely NO score reels, NO digits, NO numbers, NO cylinders inside — just an empty dark cutout opening.
- Upper portion: Directly centered above the top edge of the rectangular bezel, joined as one cohesive stamped brushed-steel metal housing plate, is ONE round vintage unlit translucent milky-ivory concentric-ring Fresnel pinball insert lens, set in a thin steel bezel ring, exactly matching the unlit Fresnel lens in the reference image.
- Studio lighting: Soft neutral overhead studio lighting from upper-left with subtle specular highlights along the chamfered metal bevels.
- Clean seamless solid white background outside the metal housing, no drop shadow, no wood, no flippers, no playfield, no text or symbols.
```

### stepper-housing-on

- **Files:** `art/stepper-housing-on.webp`, raw `art/raw/stepper-housing-on.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 4:3` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** the **stepper-housing-off** output (image 1, the one being edited); the shipped `art/toggle-on.webp` (for the lamp glow)
- **An edit of stepper-housing-off.**

Prompt:

```text
Direct photo edit of input image 1 (stepper_housing_off_[timestamp].jpg) to turn on the round Fresnel lamp at the top, referencing the lit incandescent glow in input image 2 (toggle-on.webp). Keep the exact same framing, position, geometry, brushed steel texture, scratches, patina, empty dark rectangular window aperture, and pure solid white (#FFFFFF) background as image 1. The round Fresnel lens at the top is turned ON and illuminated from within by a vintage warm incandescent bulb: a bright hot white-gold glowing core at the center, radiating outward through the concentric Fresnel lens rings with rich warm amber-orange translucent glow. Realistic warm amber specular reflection and light spill illuminate the circular brushed steel collar surrounding the lens and the top curved ridge and upper inner bevel of the steel frame directly below it. The rectangular cutout interior remains dark matte black. Pure clean white background (#FFFFFF).
```

### flipper-minus

- **Files:** `art/flipper-minus.webp`, raw `art/raw/flipper-minus.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 16:9` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** round-3 concept `concepts/round3/04-stepper.png`; the shipped `art/rod.webp`

Prompt:

```text
Direct top-down 90-degree overhead orthographic studio macro photography of a single vintage 1960s/1970s pinball flipper bat, centered and oriented strictly horizontally (0 degrees rotation) on a completely seamless pure solid white (#FFFFFF) background, isolated product shot like the rod reference. Geometry and orientation: Top-down orthographic view, completely flat, zero 3D perspective tilt. The flipper is oriented strictly horizontally: Left end has the wide rounded semicircular pivot hub with a small vintage brushed-steel slotted screw centered in the pivot hub. Right end has the narrower smoothly rounded tapered tip, creating a classic elongated teardrop pinball flipper bat silhouette. Materials and details matching the minus flipper in the stepper reference: aged warm ivory cream molded plastic top face with delicate fine hairline crazing and subtle authentic vintage patina. A bold dark charcoal-black horizontal minus sign ('−') cleanly recessed into the center of the cream plastic face. Thick matte crimson-red rubber bumper ring visible wrapping completely around the flipper bat perimeter. Clean pure solid white background everywhere, no shadows, no playfield, no wood, crisp edges, generous white margins.
```

### flipper-plus

- **Files:** `art/flipper-plus.webp`, raw `art/raw/flipper-plus.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 16:9` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** the **flipper-minus** output
- **Made from flipper-minus:** asked for a mirrored copy with a plus sign. This is the second attempt (`flipper_plus_v2`), and it is the one that shipped.

Prompt:

```text
Horizontally flipped mirror-image of the pinball flipper in the reference image, pointing in the reverse direction.
The flipper points to the LEFT:
- The wide rounded base (pivot hub) is on the RIGHT side of the frame, with the slotted brushed-metal pivot screw centered inside this wide rounded base on the right.
- The flipper tapers from right to left, ending with the narrower rounded flipper tip pointing towards the LEFT side of the frame.
- The minus sign is replaced by a bold, dark recessed matte charcoal-black PLUS sign '+' centered on the ivory plastic bat.
- Exact same vintage yellowed ivory/cream molded plastic material with fine hairline crazing, thick matte crimson-red rubber perimeter bumper ring, flat top-down 90-degree orthographic view, perfectly horizontal, pure clean solid white #FFFFFF background with no shadows.
```

Earlier attempt, **not shipped** (first attempt, `flipper_plus`). `AspectRatio: 16:9`. Image references: the flipper-minus output.

```text
A vintage mechanical arcade pinball machine flipper bat, exact matching counterpart to the reference image flipper_minus, mirrored horizontally. Flat top-down orthographic 90-degree view, perfectly horizontal (0 degrees rotation). The wide rounded pivot hub is on the RIGHT side, featuring a slotted brushed-steel flathead screw centered inside the hub. The flipper tapers to the LEFT into a smooth rounded narrow tip. Thick matte crimson-red rubber perimeter bumper ring tightly wrapping the outer edge. The flipper body is made of vintage yellowed ivory cream molded plastic with subtle fine hairline crazing and vintage wear. Centered on the ivory plastic face is a bold, crisp, dark matte charcoal-black recessed embossed PLUS sign '+' with beveled edges and the same stroke thickness as the minus sign in the reference. Pure solid seamless white background (#FFFFFF), cleanly isolated product shot, completely flat top-down studio lighting, no drop shadow.
```

### targets-bank-off

- **Files:** `art/targets-bank-off.webp`, raw `art/raw/targets-bank-off.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 16:9` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** round-3 concept `concepts/round3/02-checkboxes.png`; the shipped `art/stepper-housing-off.webp`

Prompt:

```text
Studio product photo of a standalone vintage 1960s electromechanical pinball 4-slot drop-target bank metal housing, isolated on a pure solid white #FFFFFF background with no shadows on the background. Symmetrical, straight-on front-elevated perspective (camera centered horizontally, looking down at a 38-degree angle). The assembly consists of: Top section: an arched brushed aged-steel drop-target hood frame with four vintage slotted flathead steel screws evenly spaced across the top ridge, curving down into steel side mounting brackets. Middle section: an open rectangular cavity under the arch that is COMPLETELY EMPTY, with NO drop targets, NO rectangular plastic blocks, NO ivory tags, NO letters or text. Inside this empty dark shadowed cavity, a single horizontal aged steel cylindrical reset axle/rod runs straight across the interior back wall. Bottom front section: an attached brushed-steel horizontal mounting apron plate extending forward, containing exactly four identical, evenly spaced, unlit vintage milky-ivory plastic Fresnel lenses with fine concentric circular rings, each set in a round steel bezel flush on the metal plate, precisely aligned with the four target positions above. Scratched, authentic vintage brushed nickel/steel patina matching reference image stepper-housing-off.webp, soft neutral overhead studio lighting from upper left, crisp isolated cutout silhouette on pure seamless white background #FFFFFF, no playfield wood, no paint, no drop shadow.
```

### targets-bank-on

- **Files:** `art/targets-bank-on.webp`, raw `art/raw/targets-bank-on.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 16:9` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** the **targets-bank-off** output (image 1, the one being edited); the shipped `art/stepper-housing-on.webp`; round-3 concept `concepts/round3/02-checkboxes.png`
- **An edit of targets-bank-off.**

Prompt:

```text
Edit image 1 (targets_bank_off_[timestamp].jpg) to turn on all four indicator lights. Illuminate ALL FOUR round Fresnel lenses along the front apron plate with warm vintage incandescent pinball bulb lighting, matching the exact lighting style in image 2 (stepper-housing-on.webp) and image 3 (02-checkboxes.png). Each of the 4 lenses has a brilliant hot warm-white/gold central filament glow and radiant amber-orange glowing concentric Fresnel rings. Realistic warm amber-orange light reflections cast onto the circular steel bezels and the brushed steel plate around each lamp, with subtle warm specular bounce upward onto the horizontal steel rod and inner underside of the metal arch. CRITICAL REQUIREMENTS: Do NOT add any plastic target blocks, targets, or text into the housing cavity—keep the cavity and horizontal steel bar empty and identical to image 1. Keep the metal housing framing, perspective, camera angle, screws, steel texture, and dimensions strictly identical to image 1. The background outside the metal housing must remain pure solid white #FFFFFF with clean crisp edges and no orange glow bleeding onto the white background.
```

### drop-target

- **Files:** `art/drop-target.webp`, raw `art/raw/drop-target.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 3:4` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** round-3 concept `concepts/round3/02-checkboxes.png`
- This is the second attempt (`drop_target_v2`), and it is the one that shipped.

Prompt:

```text
A perfectly symmetrical straight-on macro studio photograph of a SINGLE standalone blank vintage 1960s yellowed-ivory molded plastic pinball drop-target block, isolated on a pure seamless solid white (#FFFFFF) background with generous margins on all sides.

Camera viewpoint and symmetry:
- Absolute zero horizontal yaw or rotation: dead-center, perfectly symmetrical left-to-right. Neither the left side wall nor the right side wall is turned or favored.
- The camera is elevated at roughly 35-40 degrees looking down at the upright block, so the smooth rounded top surface and top edge thickness are clearly visible directly above the flat front face, while the front face faces squarely forward.

Shape and form (referencing the exact drop-target paddle shape in 02-checkboxes.png):
- A vertical upright rounded rectangle (roughly 4:5 width-to-height ratio).
- Softly rounded corners (smooth radius, NOT diagonal chamfers or cut-off corners).
- Subtly rounded top and side perimeter bevels, exactly like the molded nylon/plastic drop target buttons seen in the reference image (like the PUSH or CALLS targets in 02-checkboxes.png).

Surface texture & Material:
- Blank front face: NO words, NO text, NO numbers, NO printing, NO symbols.
- Warm aged antique cream / yellowed-ivory plastic with authentic fine hairline spiderweb crazing cracks across the surface, subtle yellowing around the edges, faint micro-scuffs from pinball impacts.

Lighting & Presentation:
- Studio photography with clean, soft, diffused neutral studio lighting from upper-left, showing the plastic's subtle gloss, surface crazing, and depth.
- Floating centered in the frame, surrounded by pure solid white #FFFFFF background. No ground shadow, no floor shadow, no playfield, no metal bracket.
```

Earlier attempt, **not shipped** (first attempt, `drop_target`). `AspectRatio: 3:4`. Image references: round-3 concept `concepts/round3/02-checkboxes.png`; the shipped `art/flipper-minus.webp`.

```text
A clean, symmetrical, straight-on front-elevated macro studio photograph of a SINGLE standalone blank vintage 1960s yellowed-ivory molded plastic pinball drop-target paddle, isolated completely on a pure solid white (#FFFFFF) background with generous white margins around it.

The camera angle is elevated approximately 35-38 degrees looking slightly down at the drop target, with zero horizontal yaw/tilt (perfectly centered, perfectly straight-on horizontal symmetry). From this elevated perspective, the slightly beveled/chamfered smooth top thickness and top edge of the paddle are clearly visible above the flat vertical front face.

Proportions: A single upright rectangular block with roughly 4:5 width-to-height ratio, featuring softly rounded upper corners and subtle draft angle typical of 1960s injection-molded nylon/plastic.

Material & Patina: Reference the warm aged yellowed ivory / antique cream molded plastic material from the reference images. The plastic has subtle micro-texture, authentic fine hairline crazing / micro-fracture spiderweb cracks in the aged plastic surface, very subtle micro-scuffs from pinball impacts, and slightly softened, smoothed vintage edges.

CRITICAL: The front face is 100% BLANK. No letters, no text, no numbers, no words, no symbols, no graphics, no bullseye, no icons whatsoever. Just pure smooth aged ivory plastic.

Lighting & Staging: Clean neutral commercial studio lighting softly originating from the upper-left, casting soft subtle highlights along the top chamfer and left edge, showing plastic depth and translucency. Completely isolated on pure flat solid seamless white background (#FFFFFF) with no drop shadow, no cast shadow, no playfield, no metal bracket, no mounting holes, no surrounding machinery.
```

### drain-off

- **Files:** `art/drain-off.webp`, raw `art/raw/drain-off.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 16:9` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** round-3 concept `concepts/round3/11-delete-undo.png` (image 1); the shipped `art/stepper-housing-off.webp` (image 2)

Prompt:

```text
A dead-center, strictly flat 90-degree orthographic top-down macro studio photograph of a single standalone vintage 1960s electromechanical pinball hardware plate, completely isolated on a pure solid white (#FFFFFF) background with generous white margins on all sides. Flat overhead orthographic view with zero perspective tilt. The hardware plate is a cohesive rounded-corner rectangular base plate made of aged brushed nickel-steel with fine surface scratches and authentic vintage patina, matching the lighting, metal finish, and clean isolation of Image 2. On the LEFT HALF: a vertical recessed ball drain chute flanked by two raised chamfered steel guide rails, each with a vintage slotted flathead steel screw near the bottom. The recessed metal chute is completely EMPTY with NO steel ball. At the top of the chute floor is a subtle circular dimple, and at the bottom is a deep, clean, pitch-black circular recessed drain hole with a chamfered metallic rim, matching the drain chute in Image 1. On the RIGHT HALF: centered beside the chute, a large round vintage unlit milky-ivory crazed-plastic pinball insert cap set inside a round brushed-steel bezel ring, matching the insert in Image 1. In the center of the insert cap, cleanly printed in bold condensed charcoal-black uppercase letters on two lines is the text: 'SHOOT' on the top line and 'AGAIN' on the bottom line. Pure white background (#FFFFFF) around the plate, no wood playfield, no red or blue stripes, no ball.
```

### drain-on

- **Files:** `art/drain-on.webp`, raw `art/raw/drain-on.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 16:9` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** the **drain-off** output (the one being edited); round-3 concept `concepts/round3/11-delete-undo.png`
- **An edit of drain-off.** (The brief also named `art/stepper-housing-on.webp`, but the subagent did not pass it.)

Prompt:

```text
In the first image (drain_off_[timestamp].jpg), turn ON the internal incandescent light behind the round 'SHOOT AGAIN' crazed plastic cap, matching the illuminated style in the reference image. The steel chassis geometry, slotted screws, drainage chute, black drain hole, top dimple, scratches, framing, and pure solid white (#FFFFFF) background outside the steel plate must remain 100% identical and pixel-aligned to the first image. Do NOT add a ball. The round crazed plastic insert cap glows intensely from within in rich warm incandescent amber-orange and gold, with the hairline crazing cracks backlit warmly. The words 'SHOOT AGAIN' are crisp, bold, dark, and perfectly centered on two lines. Warm golden-orange specular reflections and light spill illuminate the raised steel bezel around the button and subtly wash onto the adjacent brushed steel surface.
```

### bumper-off

- **Files:** `art/bumper-off.webp`, raw `art/raw/bumper-off.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 1:1` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** the shipped `art/toggle-off.webp`; the shipped `art/stepper-housing-off.webp`

Prompt:

```text
A dead-center, strictly flat 90-degree orthographic top-down macro studio photograph of a SINGLE standalone classic vintage 1960s/1970s pinball pop bumper (jet bumper), perfectly isolated on a solid pure seamless white #FFFFFF background with generous white margins around it. Zero perspective tilt, perfectly circular, symmetrical, centered in the frame. Matching the vintage materials, aged chrome, crimson molded plastic, and lighting style of the reference images. Concentric circular construction from edge to center: 1) Outermost ring: a polished flared vintage chrome and brushed nickel-steel kick skirt ring with subtle aged micro-scratches and metallic sheen. 2) Middle ring: a glossy vintage crimson-red molded plastic skirt collar with subtle curved bevel specular highlights and authentic vintage micro-wear, separated by a crisp thin cream/gold circular pinstripe. 3) Center: an unlit smooth domed translucent milky-ivory aged cream plastic cap with delicate vintage hairline crazing and a subtle vintage red geometric starburst/scalloped border trim along its outermost rim only. The center circular area of the milky ivory cap is completely blank, clean, smooth, unlit, with NO text, NO numbers, NO letters, NO symbols, and NO words. Soft neutral upper-left studio lighting, seamless clean pure solid white background with no playfield wood, no drop shadow, completely cut out.
```

### bumper-on

- **Files:** `art/bumper-on.webp`, raw `art/raw/bumper-on.jpg`
- **Tool / model:** Antigravity agent, built-in `generate_image` tool, called by an `image-generator` subagent running `gemini-3.8-flash-medium`. The transcript does not name the underlying image model.
- **Settings:** `AspectRatio: 1:1` (the tool takes no other settings; output is a JPEG on the white background the prompt asks for)
- **Image references (`ImagePaths`, in order):** the **bumper-off** output (the one being edited); the shipped `art/drain-on.webp`; the shipped `art/stepper-housing-on.webp`
- **An edit of bumper-off.**

Prompt:

```text
Edit the first image (bumper_off) to show the pop bumper illuminated/lit ('on' state). Reference the warm incandescent amber-gold internal bulb glow and specular light spill from the second and third reference images. The circular pop bumper geometry, exact framing, position, outer chrome rim, crimson collar, cream pinstripe, and blank ivory cap center must remain exactly aligned and identical in shape and position. The pure solid white (#FFFFFF) background around the outer metal skirt must remain 100% pure solid clean white (#FFFFFF) with zero color bleeding onto the background. The incandescent bulb inside is now brightly lit: the translucent ivory center cap shines brightly from within with a warm golden incandescent amber-yellow-orange glow and a hot golden-white radiant center, illuminating the red scalloped starburst pattern around its perimeter. The glossy crimson red collar glows with internal fiery ruby-amber translucency and rich warm specular reflections. The inner bevel of the brushed chrome-steel bezel reflects the warm incandescent amber glow. No text, no numbers, keep exact same perspective, centered top-down circular framing.
```

## Concept rounds

All five rounds: Higgsfield, model `gpt_image_2_6`, with no quality or background setting (defaults). Files are matched to prompts using the download commands in the transcript.

### Round 1: three eras and a settings screen

Folder `concepts/round1/`. One batch of four, text only.

**1. `1-electromechanical.png`** (1960s-70s electromechanical sheet). `aspect_ratio: 3:2`. Image reference: none.

```text
UI component concept sheet for a set of web interface controls themed on 1960s-1970s electromechanical pinball. Pale warm off-white page, generous margins, small plain grey sans-serif labels, thin grey hairlines, no decorative chrome. Six controls arranged in a tidy 2 by 3 grid; each control is a small horizontal strip of pinball playfield seen from directly above under a sheet of glass: painted plywood with flat retro screen-printed geometric artwork in cream, tomato red, mustard and teal, warm incandescent bulbs glowing under coloured plastic inserts, a single polished steel ball with a soft reflection, a faint glass highlight. The six controls, each with its label beneath: BUTTON, a spring plunger in a shooter lane with the ball resting on its tip; TOGGLE, a round saucer hole holding the ball beside a lit amber arrow insert reading ON; CHECKBOXES, a bank of five small drop targets, three knocked down and two standing; SLIDER, a chrome wire ramp rail with the ball part way along and a row of lit inserts behind it up to the ball; LOADER, a metal spinner gate caught mid spin with motion blur; COUNTER, four white electromechanical score reels showing 0420 in black numerals. Original artwork only: no brand names, no logos, no characters, no real table art. Crisp product-design presentation, soft even studio light, reads clearly at thumbnail size.
```

**2. `2-dot-matrix.png`** (early-1990s dot-matrix sheet). `aspect_ratio: 3:2`. Image reference: none.

```text
UI component concept sheet for a set of web interface controls themed on early-1990s dot-matrix era pinball. Dark charcoal page, generous margins, small plain light-grey sans-serif labels, thin grey hairlines, no decorative chrome. Six controls arranged in a tidy 2 by 3 grid; each control is a small horizontal strip of pinball playfield seen from directly above under glass: glossy clear-coated playfield with deep blue and purple airbrushed artwork, bright saturated lit inserts in red, yellow, green and blue, chrome wire guides, translucent coloured plastic ramps, one polished steel ball with sharp reflections. The six controls, each with its label beneath: BUTTON, a spring plunger in a shooter lane with the ball on its tip and a lit red launch insert; TOGGLE, a scoop hole holding the ball with a lit green arrow insert; CHECKBOXES, a bank of five drop targets, three down and two standing, each with a small lit insert in front; SLIDER, a translucent blue plastic ramp with the ball part way along; LOADER, a spinner gate mid spin with motion blur and light streaks; TOAST, an orange monochrome dot-matrix display panel made of round glowing dots spelling BALL SAVED. Original artwork only: no brand names, no logos, no characters, no real table art. Crisp product-design presentation, reads clearly at thumbnail size.
```

**3. `3-stripped-modern.png`** (minimal modern sheet). `aspect_ratio: 3:2`. Image reference: none.

```text
UI component concept sheet for a minimalist modern set of web interface controls themed on pinball, stripped to its essentials. Clean white page, generous margins, small plain grey sans-serif labels, thin grey hairlines. Six controls arranged in a tidy 2 by 3 grid; each control is a small horizontal strip of matte white playfield seen from directly above with soft shadows, like a precision product render: no painted artwork at all, only white surface, slim brushed-steel wire guides, one mirror-polished chrome ball, and a few softly glowing coloured inserts in coral, amber and mint set flush in the surface. The six controls, each with its label beneath: BUTTON, a slim steel plunger in a shooter lane with the ball on its tip; TOGGLE, a shallow round saucer holding the ball beside a glowing mint dot; CHECKBOXES, a bank of five white drop targets, three down and two standing; SLIDER, a thin steel wire rail with the ball part way along and a row of small inserts lit up to the ball; LOADER, a thin steel spinner gate mid spin with subtle motion blur; COUNTER, four small white number drums showing 0420. Original design only: no brand names, no logos, no characters. Soft even studio light, calm, premium, reads clearly at thumbnail size.
```

**4. `4-settings-screen.png`** (electromechanical settings screen). `aspect_ratio: 2:3`. Image reference: none.

```text
Mock-up of a mobile settings screen in a web app whose controls are themed on 1960s-1970s electromechanical pinball. Flat front-on screenshot, pale warm off-white background, plain dark-grey sans-serif row labels on the left, thin grey hairlines between rows, lots of white space, no cards and no themed frames. Screen title at top in plain type: Notifications. Each row has an ordinary label and, on the right, a compact control that is a small strip of pinball playfield seen from above under glass: painted plywood with flat retro screen-printed geometric artwork in cream, tomato red, mustard and teal, warm incandescent bulbs under coloured plastic inserts, a polished steel ball. Rows from top to bottom: Push alerts, a toggle that is a saucer hole holding the steel ball with a lit amber insert; Volume, a slider that is a chrome wire rail with the ball two thirds along and lit inserts behind it; Channels, a bank of four drop targets with two knocked down; Unread, four small white score reels showing 0012; Syncing, a metal spinner gate mid spin; and at the bottom a wide button labelled Save that is a spring plunger in a shooter lane with the ball on its tip. The contrast is the point: quiet minimalist interface, rich physical little playfield controls. Original artwork only: no brand names, no logos, no characters, no real table art. Crisp, reads clearly at thumbnail size.
```

### Round 2: lit macro photography

Folder `concepts/round2/`. One batch of four, text only. These prompts describe the look of the reference board's first row (lit macro close-ups) in words; no reference image was passed to the generator, here or anywhere in the set.

**1. `1-control-sheet.png`** (six-control sheet). `aspect_ratio: 3:2`. Image reference: none.

```text
UI component concept sheet for web interface controls themed on vintage 1960s electromechanical pinball, shown as macro photography. Near-black charcoal page, generous margins, small plain light-grey sans-serif labels under each image, thin grey hairlines, no decorative chrome. Six controls in a tidy 2 by 3 grid; each control is a wide letterbox strip that is a real macro photograph taken from a low oblique angle just above a pinball playfield: very shallow depth of field with creamy bokeh, one warm incandescent bulb glowing through thick coloured plastic, worn screen-printed paint in cream, red, mustard and teal, tiny scratches and dust under glass, a mirror-polished steel ball reflecting the lights, dark surroundings falling to black. The six controls with labels: TOGGLE, a round translucent insert printed with the words WHEN LIT glowing warm amber with the steel ball resting beside it; BUTTON, a chrome plunger knob and spring in sharp focus with the shooter lane blurring away; CHECKBOXES, a row of four small cream drop targets printed 5X 4X 3X 2X, two knocked flat and two standing, in shallow focus; SLIDER, the steel ball on a chrome wire rail with a row of round lit amber inserts receding into bokeh behind it and unlit ones ahead; COUNTER, a cream pop bumper cap with a red starburst printed 100, lit from beneath; LOADER, a small metal spinner gate caught mid spin with motion blur and a streak of light. Original design only: no brand names, no logos, no characters. Cinematic, warm, tactile, reads clearly at thumbnail size.
```

**2. `2-toggle-off-on.png`** (toggle off/on pair; the reference for round 3 and the motion stills). `aspect_ratio: 3:2`. Image reference: none.

```text
Concept image showing one web interface toggle switch in its two states, off above and on below, themed on vintage 1960s electromechanical pinball and shot as macro photography. Near-black charcoal page, small plain light-grey sans-serif labels OFF and ON at the left, thin grey hairline between. Each state is a wide letterbox strip, the identical low oblique macro photograph of the same patch of pinball playfield: a shallow round saucer hole on the left, a round translucent cream plastic insert on the right printed with a small red starburst and the words WHEN LIT, worn screen-printed paint in cream, red, mustard and teal, tiny scratches under glass, very shallow depth of field. OFF strip: the scene is dim and cool, the insert is unlit and dull, the mirror-polished steel ball rests on the playfield to the left of the saucer. ON strip: the steel ball now sits locked in the saucer, the insert glows warm amber from a bulb beneath, light spills across the paint and reflects in the ball, soft warm bokeh in the background. The only differences between the two are the ball position and the light. Original design only: no brand names, no logos, no characters. Cinematic, tactile, clear at thumbnail size.
```

**3. `3-settings-screen.png`** (dark settings screen). `aspect_ratio: 2:3`. Image reference: none.

```text
Mock-up of a dark-mode mobile settings screen in a web app whose controls are macro photographs of vintage 1960s electromechanical pinball parts. Flat front-on screenshot, near-black charcoal background, plain light-grey sans-serif row labels on the left, thin dark-grey hairlines between rows, lots of empty space, no cards. Screen title at top in plain type: Notifications. Each row has an ordinary text label and, on the right, a compact wide letterbox control with softly rounded corners that is a low-angle macro photo of a pinball playfield with very shallow depth of field, warm incandescent glow through coloured plastic, worn cream, red, mustard and teal paint, a mirror-polished steel ball, darkness around the edges. Rows from top to bottom: Push alerts, a toggle that is a glowing amber insert printed WHEN LIT with the ball locked in a saucer beside it; Sound, the same toggle unlit and dim with the ball out of the saucer; Volume, a slider that is the ball on a chrome wire rail with lit amber inserts behind it and unlit ones ahead; Channels, four small cream drop targets, two flat and two standing; Unread, a lit cream bumper cap printed 12; and at the bottom a wide button labelled Save that is a chrome plunger knob and spring in sharp focus. The contrast is the point: quiet minimal dark interface, small glowing cinematic photographs as the controls. Original design only: no brand names, no logos, no characters. Crisp, reads clearly at thumbnail size.
```

**4. `4-slider-hero.png`** (slider hero; later reused as the motion start still `motion/frames/slider-a.png`). `aspect_ratio: 21:9`. Image reference: none.

```text
Single hero image of a web interface slider control themed on vintage 1960s electromechanical pinball, as a cinematic macro photograph in a very wide letterbox frame. Low oblique camera just above a pinball playfield under glass. A mirror-polished steel ball sits on a pair of thin chrome wire rails running left to right across the frame, about two thirds of the way along, in razor-sharp focus, reflecting the lights around it. Set into the playfield beneath the rail is a long row of small round translucent plastic inserts: the ones to the left of the ball glow warm amber from bulbs beneath, the ones to the right are unlit and dull. Worn screen-printed paint in cream, tomato red, mustard and teal, tiny scratches and dust, a faint reflection in the glass. Very shallow depth of field, creamy warm bokeh from distant lamps, the edges of the frame falling into darkness. Small plain light-grey sans-serif text in the lower left corner reads Volume 64. Original design only: no brand names, no logos, no characters. Warm, tactile, quiet, impossible to look away from.
```

### Round 3: one image per control

Folder `concepts/round3/`. One batch of twelve. `overview-1.jpg` and `overview-2.jpg` are local montages of these, not generations.

**1. `01-button.png`** (button). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif state labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball playfield under glass, low oblique camera, very shallow depth of field, worn screen-printed paint in cream, tomato red, mustard and teal, warm incandescent glow, mirror-polished steel ball, soft warm bokeh. New subject: a BUTTON control shown in three stacked strips labelled REST, PRESSED and RELEASED. The part is a chrome spring plunger at the right end of a shooter lane with the steel ball resting against its tip. REST: plunger at rest, ball on the tip, a small round insert printed LAUNCH unlit. PRESSED: the plunger is pulled back with its spring compressed, the ball has rolled back with it, the LAUNCH insert glows faintly. RELEASED: the plunger has snapped forward, the ball is a streak of motion blur leaving along the lane to the left, the LAUNCH insert glows bright amber. The same shot three times; only the plunger, ball and light change. Original design only: no brand names, no logos, no characters.
```

**2. `02-checkboxes.png`** (checkboxes). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif state labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball playfield under glass, low oblique camera, very shallow depth of field, worn screen-printed paint in cream, tomato red, mustard and teal, warm incandescent glow, soft warm bokeh. New subject: a CHECKBOX GROUP shown in two stacked strips labelled NONE and TWO CHECKED. The part is a bank of four small cream plastic drop targets standing in a row in a metal frame, each printed with a small black word: EMAIL, PUSH, TEXT, CALLS, and in front of each target a small round plastic insert set in the playfield. NONE: all four targets stand upright, all four inserts unlit. TWO CHECKED: the EMAIL and TEXT targets have dropped flat into the playfield, and the two inserts in front of them glow warm amber, while PUSH and CALLS still stand with their inserts unlit. The same shot twice; only the dropped targets and the lights change. Original design only: no brand names, no logos, no characters.
```

**3. `03-radio.png`** (radio). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif state labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball playfield under glass, low oblique camera, very shallow depth of field, worn screen-printed paint in cream, tomato red, mustard and teal, warm incandescent glow, mirror-polished steel ball, soft warm bokeh. New subject: a RADIO GROUP, choose one of four, shown in two stacked strips labelled SMALL SELECTED and LARGE SELECTED. The part is the row of four rollover lanes at the top of a pinball playfield: four short parallel lanes separated by small metal lane guides, each lane with a thin wire rollover switch and a round plastic insert printed with one letter: S, M, L, XL. SMALL SELECTED: the steel ball sits in the first lane and only the S insert glows warm amber. LARGE SELECTED: the steel ball sits in the third lane and only the L insert glows warm amber. The same shot twice; only the ball position and which single insert is lit change. Original design only: no brand names, no logos, no characters.
```

**4. `04-stepper.png`** (stepper). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif state labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball playfield under glass, low oblique camera, very shallow depth of field, worn screen-printed paint in cream, tomato red, mustard and teal, warm incandescent glow, soft warm bokeh. New subject: a NUMBER STEPPER with minus and plus, shown in two stacked strips labelled REST and PLUS PRESSED. The part is a pair of cream pinball flippers with red rubber rings, the left flipper printed with a small minus sign and the right flipper printed with a small plus sign, and between them a small window showing two cream electromechanical score reels with black numerals. REST: both flippers down, the reels read 04. PLUS PRESSED: the right flipper is swung up with a little motion blur, the reels are caught mid roll turning from 04 to 05, and a small insert above them glows warm amber. The same shot twice; only the flipper, the reels and the light change. Original design only: no brand names, no logos, no characters.
```

**5. `05-tabs.png`** (tabs). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif state labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball playfield under glass, low oblique camera, very shallow depth of field, worn screen-printed paint in cream, tomato red, mustard and teal, warm incandescent glow, soft warm bokeh. New subject: a TABS control with three tabs, shown in two stacked strips labelled INBOX SELECTED and DRAFTS SELECTED. The part is a row of three wide rectangular translucent cream plastic inserts set flush in the playfield side by side, each printed in black capitals with one word: INBOX, SENT, DRAFTS, with a thin metal lane guide between them. INBOX SELECTED: only the INBOX insert glows warm amber from a bulb beneath and spills light on the paint; SENT and DRAFTS are unlit and dull. DRAFTS SELECTED: only the DRAFTS insert glows; the other two are unlit. The same shot twice; only which insert is lit changes. Original design only: no brand names, no logos, no characters.
```

**6. `06-text-input.png`** (text input). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif state labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball machine under glass, low oblique camera, very shallow depth of field, worn paint in cream, tomato red, mustard and teal, warm incandescent glow, soft warm bokeh. New subject: a TEXT INPUT field shown in two stacked strips labelled EMPTY and FOCUSED. The part is a long narrow cream paper instruction card held under a clear plastic cover by two small screws on the metal apron of a pinball machine, with a thin printed red border. EMPTY: the card is blank except for small faint grey typewriter text reading Your name, and the scene is dim. FOCUSED: a small lamp above now lights the card warmly, the card shows black typewriter text reading Justin followed by a thin red text cursor, and the red border looks brighter. The same shot twice; only the text, the cursor and the light change. Original design only: no brand names, no logos, no characters.
```

**7. `07-select.png`** (select). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif state labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball machine under glass, low oblique camera, very shallow depth of field, worn paint in cream, tomato red, mustard and teal, warm incandescent glow, soft warm bokeh. New subject: a SELECT dropdown shown in two stacked strips labelled CLOSED and CHOOSING. The part is a wide cream electromechanical reel drum, like a score reel but printed with words instead of numbers, seen through a rectangular metal window in the playfield. CLOSED: the window shows one word in black capitals, WEEKLY, centred and sharp, softly lit. CHOOSING: the drum is caught mid turn with slight motion blur, WEEKLY sliding upward out of the window and MONTHLY rolling up into view from below, with the edge of DAILY just visible at the top, and the lamp inside the window glowing brighter. The same shot twice; only the drum position and the light change. Original design only: no brand names, no logos, no characters.
```

**8. `08-progress.png`** (progress). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif state labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball playfield under glass, low oblique camera, very shallow depth of field, worn screen-printed paint in cream, tomato red, mustard and teal, warm incandescent glow, soft warm bokeh. New subject: a PROGRESS BAR shown in two stacked strips labelled 30 PERCENT and COMPLETE. The part is a bonus ladder: a straight row of ten small round translucent plastic inserts set in the playfield, printed with the numbers 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, receding slightly into soft focus. 30 PERCENT: the first three inserts glow warm amber, the other seven are unlit and dull. COMPLETE: all ten glow, the last one printed 100 glows brightest with a small halo, and light spills across the paint. The same shot twice; only the number of lit inserts changes. No ball in this picture. Original design only: no brand names, no logos, no characters.
```

**9. `09-loader.png`** (loader). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif state labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball playfield under glass, low oblique camera, very shallow depth of field, worn screen-printed paint in cream, tomato red, mustard and teal, warm incandescent glow, soft warm bokeh. New subject: a LOADING SPINNER shown in three stacked strips labelled FRAME 1, FRAME 2 and FRAME 3. The part is a ring of eight small round translucent plastic inserts set in the playfield around a painted red starburst, a chase light. In each frame one insert glows bright warm amber, the one before it glows half as bright and the one before that glows faintly, the rest unlit, so the light appears to travel round the ring. FRAME 1: the bright light is at the top of the ring. FRAME 2: it has moved a quarter of the way round to the right. FRAME 3: it is at the bottom. The same shot three times; only which inserts are lit changes. No ball in this picture. Original design only: no brand names, no logos, no characters.
```

**10. `10-notifications.png`** (toast / success / TILT). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball machine, low oblique camera, very shallow depth of field, worn paint in cream, tomato red, mustard and teal, warm incandescent glow, soft warm bokeh. New subject: NOTIFICATIONS shown in three stacked strips labelled TOAST, SUCCESS and ERROR. The part is a small rectangular panel of painted backglass in a thin metal frame, lit from behind by bulbs, with words screen-printed in bold condensed capitals that only show when the lamp behind them is on. TOAST: the panel glows warm cream and reads MESSAGE SENT in dark red letters. SUCCESS: the panel glows soft green and reads SAVED. ERROR: the panel glows deep red and reads TILT in cream letters, and everything around it in the frame has gone dark and unlit. Each strip is the same kind of shot. Original design only: no brand names, no logos, no characters.
```

**11. `11-delete-undo.png`** (delete + undo). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Match the reference image exactly in layout, photographic look, palette, lighting and page style: near-black charcoal page, small plain light-grey sans-serif state labels at the left, wide letterbox macro photographs of a vintage 1960s electromechanical pinball playfield under glass, low oblique camera, very shallow depth of field, worn screen-printed paint in cream, tomato red, mustard and teal, warm incandescent glow, mirror-polished steel ball, soft warm bokeh. New subject: DELETE WITH UNDO shown in three stacked strips labelled REST, DELETED and UNDO. The part is the drain at the bottom of a pinball playfield: a dark gap between two metal guides leading down into a hole, with a round translucent plastic insert beside it printed SHOOT AGAIN. REST: the steel ball rests at the top of the lane above the drain, the SHOOT AGAIN insert unlit. DELETED: the ball is rolling down into the dark drain hole with a little motion blur, half swallowed by shadow, and the SHOOT AGAIN insert now glows warm amber. UNDO: the ball has been kicked back up out of the drain and sits at the top of the lane again, with the SHOOT AGAIN insert still glowing and a faint streak showing its path. The same shot three times; only the ball and the light change. Original design only: no brand names, no logos, no characters.
```

**12. `12-sign-up-form.png`** (sign-up form). `aspect_ratio: 3:2`. Image reference: the round-2 toggle pair **`concepts/round2/2-toggle-off-on.png`**, passed as `image_references`.

```text
Use the reference image only for the photographic look of the controls. Mock-up of a dark-mode desktop web page: a sign-up form, flat front-on screenshot, near-black charcoal background, a single centred column about 560 pixels wide, plain light-grey sans-serif text, thin dark-grey hairlines, lots of empty space, no cards. Heading at top in plain type: Create your account. Each form row has a small plain text label above a compact wide letterbox control with softly rounded corners that is a low-angle macro photograph of a vintage 1960s electromechanical pinball playfield: shallow depth of field, warm incandescent glow, worn cream, red, mustard and teal paint, mirror-polished steel ball, darkness at the edges. Rows from top to bottom: Name, a cream paper card under plastic with typewriter text; Plan, three rectangular inserts printed FREE, PRO, TEAM with PRO glowing amber; Seats, a pair of cream flippers printed minus and plus with small score reels reading 04 between them; Notifications, four cream drop targets with two dropped and two lit inserts; Weekly digest, a round insert printed WHEN LIT glowing amber with the steel ball in a saucer beside it; and at the bottom a wide button labelled Create account that is a chrome spring plunger with the ball on its tip. Quiet minimal interface, small glowing cinematic photographs as the controls. Original design only: no brand names, no logos, no characters. Crisp, reads clearly at thumbnail size.
```

### Round 4: flat, front-on UI components

Folder `concepts/round4/`. One batch of four, text only. This round replaced the photographic direction.

**1. `1-plain-controls.png`** (plain controls, themed ball and lamps). `aspect_ratio: 3:2`. Image reference: none.

```text
Design-system specimen sheet of web UI components, flat 2D vector illustration, strictly front-on, no perspective, no 3D render, no photograph, no depth of field. Plain flat warm cream page, generous margins, small plain dark-grey sans-serif captions under each item. Every component is an ordinary, instantly recognisable interface control at realistic UI proportions, drawn with a thick even dark navy ink outline and flat colour fills in a limited vintage pinball palette: cream, tomato red, mustard yellow, teal, dark navy, with a few glowing amber accents. The pinball theme lives in the details only. Components, in a tidy grid with space between: a TOGGLE switch that is a normal pill-shaped track with a round knob drawn as a shiny chrome pinball with two white highlights, shown twice, off (grey-teal track, knob left) and on (track glowing amber, knob right); a SLIDER that is a normal thin horizontal track with a chrome pinball as the thumb, the filled part a row of small lit amber dots, and a small value bubble reading 64; two BUTTONS that are normal rounded rectangles with bold labels, Confirm in tomato red with a small starburst and Cancel in cream; a CHECKBOX group of three normal small rounded squares with text labels, two ticked with a tiny mustard star inside a lit amber square and one empty; a RADIO group of three small circles with labels, one selected glowing amber; TABS as a normal segmented row of three, Inbox, Sent, Drafts, the selected one lit amber; a PROGRESS BAR as a normal rounded bar made of ten small round lamps, six lit; a number STEPPER as a normal minus button, a two-digit counter reading 04 on little cream score reels, and a plus button; a TEXT INPUT as a normal rounded field with placeholder text; a TOAST as a normal small rounded notification reading Message sent with a lit lamp icon. Clean, friendly, crisp, reads clearly at thumbnail size. No brand names, no logos, no characters.
```

**2. `2-playfield-parts.png`** (controls as drawn playfield parts; the reference for round 5). `aspect_ratio: 3:2`. Image reference: none.

```text
Design-system specimen sheet of web UI components, flat 2D illustration in the style of a vintage 1960s pinball playfield screen print, strictly front-on, no perspective, no 3D render, no photograph, no depth of field. Plain flat off-white page, generous margins, small plain dark-grey sans-serif captions under each item. Each component is an ordinary, instantly recognisable interface control at realistic UI proportions, drawn as a flat pinball part with a bold black outline, flat fills in cream, tomato red, mustard yellow and teal, a slightly worn print texture, and warm amber glow where a lamp is lit. Components, in a tidy grid with space between: a TOGGLE switch, a pill-shaped lane with a chrome pinball as the knob, shown off (ball left, a round insert at the right end unlit) and on (ball right, sitting on the insert, which glows amber); a SLIDER, a horizontal wire-rail track with a chrome pinball thumb, small round lamps along the track lit amber up to the ball, and the number 64; two BUTTONS, rounded rectangles shaped like lit plastic inserts with bold condensed capitals, CONFIRM lit amber with a red starburst border and CANCEL unlit cream; a CHECKBOX group of three small square drop-target tiles with text labels beside them, two lit with a red star and one plain; a RADIO group of three round bumper-cap circles with labels, one lit with a red and cream starburst; TABS, a row of three backglass panels reading INBOX, SENT, DRAFTS, the selected one lit; a PROGRESS BAR, a bonus ladder of ten small round numbered lamps, six lit; a number STEPPER, two small cream flipper-shaped buttons marked minus and plus either side of two score reels reading 04; a TEXT INPUT, a cream rule-card field with a thin red border and typewriter placeholder text; a TOAST, a small lit backglass panel reading MESSAGE SENT. Charming, crisp, cohesive, reads clearly at thumbnail size. Original design only: no brand names, no logos, no characters.
```

**3. `3-settings-screen.png`** (settings screen; the reference for round 5). `aspect_ratio: 2:3`. Image reference: none.

```text
Mock-up of a mobile settings screen in a web app, flat front-on screenshot, flat 2D illustration, no perspective, no 3D render, no photograph. Plain flat warm cream background, plain dark-navy sans-serif text, thin hairlines between rows, lots of empty space, no cards. Screen title at top in plain type: Notifications. Each row has an ordinary text label on the left and a compact, ordinary-sized interface control on the right, drawn as a flat vintage 1960s pinball part with a bold dark outline, flat fills in cream, tomato red, mustard yellow and teal, and a warm amber glow where a lamp is lit. Rows from top to bottom: Push alerts, a small pill toggle switch whose knob is a chrome pinball resting on a glowing amber insert at the right end, on; Sound, the same toggle off, ball at the left, insert unlit; Volume, a slider with a wire-rail track, a chrome pinball thumb two thirds along and small lit amber lamps behind it; Channels, three small square drop-target checkboxes labelled Email, Push, Text, two lit with a red star; Digest, a segmented control of three small backglass panels reading DAILY, WEEKLY, MONTHLY with WEEKLY lit; Reminders, a stepper with small flipper-shaped minus and plus buttons either side of score reels reading 04; and at the bottom a full-width primary button, a rounded rectangle shaped like a lit amber plastic insert with a red starburst border and the label SAVE in bold condensed capitals. The controls are the same size as normal mobile controls. Quiet minimal layout, charming illustrated controls. No brand names, no logos, no characters.
```

**4. `4-motion-storyboard.png`** (toggle and button storyboards). `aspect_ratio: 3:2`. Image reference: none.

```text
Animation storyboard sheet for two web UI components, flat 2D illustration in the style of a vintage 1960s pinball playfield screen print, strictly front-on, no perspective, no 3D render, no photograph. Plain flat off-white page, small plain dark-grey sans-serif captions. Bold black outlines, flat fills in cream, tomato red, mustard yellow and teal, warm amber glow where a lamp is lit. Top row, captioned TOGGLE, four frames left to right of the same small pill-shaped toggle switch whose knob is a chrome pinball: frame 1 off, ball at the left, the round insert at the right end unlit; frame 2 the ball rolling across the track, stretched slightly with speed lines behind it; frame 3 the ball landing on the insert with a small squash, a red and yellow starburst impact flash and a tiny score pop reading +100; frame 4 on, ball settled, insert glowing steady amber. Bottom row, captioned BUTTON, four frames left to right of the same rounded-rectangle button labelled CONFIRM shaped like a plastic insert: frame 1 at rest, unlit cream; frame 2 pressed down a few pixels, darker; frame 3 released, the whole button flashing bright amber with a starburst ring, and a small chrome pinball shooting out of the right edge along a short lane with speed lines; frame 4 settled, softly lit, with a small lit lamp beside it. Thin arrows between frames. Crisp, charming, reads clearly at thumbnail size. No brand names, no logos, no characters.
```

### Round 5: realistic materials

Folder `concepts/round5/`. One batch of two. Each one re-renders a round-4 sheet.

**1. `1-realistic-controls.png`** (round-4 sheet 2 rendered with real materials). `aspect_ratio: 3:2`. Image reference: round-4 **`concepts/round4/2-playfield-parts.png`**, passed as `image_references`.

```text
Recreate the reference sheet of web UI components with exactly the same layout, the same components, the same shapes, sizes, labels and captions, still strictly front-on from directly above with no perspective and no depth of field. Change only the rendering: make every component look like a real physical object photographed flat under soft even studio light, like a premium skeuomorphic product render. Real materials: mirror-polished chrome steel pinballs with crisp reflections, thick translucent cream and amber plastic inserts that glow from real warm incandescent bulbs beneath with soft light spilling onto the surface around them, screen-printed painted wood with fine grain and slight wear, brushed metal bezels with tiny slotted screws, red rubber rings, soft contact shadows under each part. Keep the plain flat off-white page background, the generous spacing, and the small plain dark-grey sans-serif captions. Every control must remain an instantly recognisable ordinary interface control at realistic UI proportions. No brand names, no logos, no characters.
```

**2. `2-realistic-settings.png`** (round-4 settings screen rendered with real materials). `aspect_ratio: 2:3`. Image reference: round-4 **`concepts/round4/3-settings-screen.png`**, passed as `image_references`.

```text
Recreate the reference mobile settings screen with exactly the same layout, rows, text labels, control shapes and sizes, still a flat front-on screenshot with no perspective and no depth of field. Change only the rendering of the controls: make each control look like a small real physical object set into the page and photographed from directly above under soft even light, like a premium skeuomorphic interface. Real materials: mirror-polished chrome steel pinballs with crisp reflections as the toggle knobs and slider thumb, thick translucent amber plastic that glows from a real warm bulb beneath and spills soft light onto the page around it, screen-printed painted wood with fine grain and slight wear, brushed metal bezels with tiny screws, cream plastic flipper buttons with red rubber rings, real cream score reels with black numerals, soft contact shadows. Keep the plain flat warm cream page, the plain dark-navy sans-serif text and the thin hairlines exactly as they are. The controls stay the same size as normal mobile controls. No brand names, no logos, no characters.
```

## Sounds

ElevenLabs connector, `creative_generate_in_flow` with `node_type: sfx`, model `eleven_text_to_sound_v3`, `generations_count: 4` (four takes per prompt). No duration, loop or prompt-influence setting was passed, so all are defaults. Takes were saved to `sounds/raw/<name>-<n>.mp3` and cut into the shipped `sounds/*.wav` by `tools/sounds.sh` (trim, fade, normalise, mono). The clack prompt was first sent once with `estimate_only: true`, which generated nothing.

### 1. Clack

- **Files:** `clack-0..3.wav` ← raw `clack-0..3` (all four takes)

```text
One single close-up impact of a heavy steel ball bearing hitting a hard plastic wall: a short, dry, solid clack with a low woody thud underneath. Recorded very close, no reverb, no echo, no ringing, nothing before or after it.
```

### 2. Soft tock / seat

- **Files:** raw `seat-0..3`; **not shipped** (the takes came back as several faint taps)

```text
One single soft tock: a steel ball bearing settling gently into a shallow wooden seat. Quiet, round, low and woody, very short. Recorded very close, no reverb, no echo, nothing before or after it.
```

### 3. Kick (solenoid)

- **Files:** `kick-0.wav`, `kick-1.wav` ← raw `kick-0`, `kick-1`

```text
One single firing of an old electromechanical pinball machine solenoid kicker: a short, punchy, muffled mechanical thunk from under a wooden playfield. Recorded close, dry, no reverb, no bells, no ball sounds, nothing before or after it.
```

### 4. Relay

- **Files:** `relay-0..3.wav` ← raw `relay-0..3`

```text
One single tiny crisp click of a small old electrical relay switching on, like a vintage light switch contact. Very short, clean and dry. Recorded very close, no reverb, no hum, nothing before or after it.
```

### 5. Roll

- **Files:** `roll-0.wav` ← raw `roll-2` (3 s cut cross-faded into a seamless loop)

```text
A heavy steel ball bearing rolling steadily and smoothly across a hard wooden board at a constant speed: a continuous, even, low rolling rumble with a fine metallic grain. Recorded very close, dry. No impacts, no bumps, no stops, no change in speed, no other sounds.
```

### 6. Chime

- **Files:** `chime-0.wav` ← raw `chime-1`, `chime-1.wav` ← raw `chime-2` (one take had no strike)

```text
One single note from the chime unit of a 1960s electromechanical pinball machine: a metal chime bar struck once by a solenoid plunger, a clean bright warm ding that rings and fades in about one second. Only one strike, dry, no other machine noise, no melody.
```

## Reference images

A board of about sixty pins from Pinterest was gathered to choose a look. None of them was ever passed to an image generator, and none is in this repo: every image reference above is an earlier generation from this same set. No real machine's name, maker or art is asked for in any prompt.
