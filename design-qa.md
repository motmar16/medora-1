# Medora design QA

Source visual truth:

- `qa/medora-icon-framing-source.jpg` (icon framing issue supplied on 2026-09-13)
- `/workspace/scratch/5f2a17321df2/upload/IMG_3270.jpeg`
- Supporting interface and icon references: `IMG_3266.jpeg`, `IMG_3267.jpeg`, `IMG_3268.jpeg`
- Spot-icon references: `/workspace/scratch/5f2a17321df2/upload/IMG_3268(1).jpeg` and `/workspace/scratch/5f2a17321df2/upload/IMG_3269.jpeg`
- Motion reference: `https://x.com/nizamdesign/status/2098709936977178945?s=46`

Implementation evidence:

- `qa/medora-icon-framing-implementation.jpg`
- Focused before/after comparison: `qa/medora-icon-framing-comparison.jpg`
- `qa/medora-ethereal-landing.jpg`
- `qa/medora-ethereal-dashboard.jpg`
- Combined full-view comparison: `qa/medora-style-comparison.jpg`
- Browser-rendered spot-icon comparison: `/tmp/medora-icon-style-qa.png`
- Generated icon-set contact sheet: `qa/medora-spot-icons.jpg`

Viewport and normalization:

- Primary source: 1199 x 899 px.
- Browser implementation: 1348 x 926 px at a 1363 x 936 CSS viewport and device scale factor 1.
- Combined comparison: both source and implementation center-cropped to 1200 x 900 px, displayed side by side at 2400 x 900 px.
- State: first-load landing page and default dashboard overview, Romanian copy, demo data.
- Spot-icon source dimensions: 900 x 900 px and 680 x 397 px. Desktop implementation was checked at 1363 x 936 CSS px, DPR 1. Responsive views were rendered inside 370 x 824 CSS px browser frames, with 339–355 px content viewports.
- Icon-framing source: 1206 x 781 px. Updated browser implementation: 1363 x 936 px at a 1363 x 936 CSS viewport and DPR 1. The focused comparison normalizes both captures into adjacent 600 x 450 px panels without altering their aspect ratios.

Full-view comparison evidence:

- The implementation matches the source direction through a near-white canvas, high-key pastel light field, editorial serif headline, large rounded white input, black pill action, generous negative space, and soft elevation.
- The Medora landing page preserves its working search and seven destinations while adopting the same visual hierarchy rather than copying unrelated source content.
- The dashboard applies the supporting references and motion reference through translucent white cards, thin line icons, compact status colors, rounded surfaces, and restrained transitions.

Focused comparison evidence:

- Typography: Georgia provides the editorial serif contrast visible in the source, while body copy and controls remain neutral system sans-serif. Headline scale, optical weight, italic accent, and wrapping are consistent with the reference.
- Spacing and layout rhythm: the hero remains centered with wide margins; the search and shortcut row align to one visual axis; card radii and gaps are consistent.
- Colors and visual tokens: warm white, blush, lavender, powder blue, mint, and near-black are mapped consistently across landing and dashboard states.
- Image quality: `dist/medora-pastel-glow.png` is a dedicated 4:3 raster background generated for the interface, with no text or UI baked into it. It remains sharp and free of visible banding at the tested viewport.
- Icons: landing shortcuts and high-value dashboard cards use eight dedicated transparent PNG spot-icons at 280 x 280 px. Their isometric camera, matte materials, restrained sage/blush/ivory palette, soft shadows, and object scale match the supplied references. Navigation, buttons, and compact controls retain Phosphor regular line icons for clarity.
- Icon framing: all seven landing frames now measure 92 x 92 CSS px on desktop and share one label baseline. Per-asset optical scaling and vertical offsets compensate for the different subject bounds inside the 280 x 280 PNG canvases. The stray right-edge fragment in `sources.png` is masked within its frame.
- Copy: all Medora-specific Romanian labels and medical-demo disclaimers remain unchanged and readable.

Comparison history:

- Initial P1: the first color pass used flat cream and solid pastel icon circles, which did not capture the new references' luminous, near-white atmosphere. Fixed with the dedicated pastel light-field asset, translucent surfaces, and softer elevation.
- Initial P2: the dashboard retained dense sans-serif headings and a dark feature card. Fixed by introducing editorial serif display type, white glass-like cards, and near-black reserved for actions.
- Initial P2: dashboard icons were handcrafted SVG paths and one Radar glyph was missing after the first library migration. Fixed by replacing the icon renderer with Phosphor regular icons and mapping Radar to the supported broadcast glyph.
- Initial P2: navigation and screen changes felt static compared with the motion reference. Fixed with short eased surface entrances, subtle hover elevation, icon movement, and a reduced-motion fallback.
- Spot-icon P2: the earlier shortcut row used generic thin line glyphs in repeated tiles, missing the tactile object-led style of the new references. Fixed with a cohesive generated set for medicine, Radar, comparison, watchlist, tools, ATC, sources, and research.
- Spot-icon P2: using the 3D assets for every small control would reduce legibility and visual hierarchy. Fixed by limiting them to quick access and high-value dashboard cards while preserving line icons for navigation and actions.
- Responsive P2: the first mobile dashboard pass widened the three statistics beyond the content viewport after adding the 3D assets. Fixed with three `minmax(0,1fr)` tracks, vertically stacked stat content, smaller mobile spot-icons, and safe text wrapping. Final mobile client width and scroll width both measured 339 px.
- Icon-framing P2: equal PNG canvas sizes concealed large differences in the subjects' visible bounds. Medicine was optically low and small, Tools/ATC/Sources were high, Radar was oversized, and Sources exposed an unrelated edge fragment. Fixed with square 92/72/56 px frames, measured per-icon scale and translation variables, overflow clipping, and a focused mask for Sources. The revised browser capture shows equal visual weight, centered subjects, aligned labels, and no content outside the frames.
- Post-fix evidence: `qa/medora-style-comparison.jpg`, `qa/medora-ethereal-dashboard.jpg`, and browser-tested interaction states.
- Post-fix spot-icon evidence: the two source references, generated set, 1363 x 936 desktop render, and 370 x 824 responsive renders were displayed together in one browser comparison. No overlap, broken assets, horizontal overflow, or unreadable labels were observed.

Primary interactions tested:

- Landing search focus, filtered suggestion display, and selection of Amoxi Demo.
- Navigation from the landing search to the catalog route.
- Dashboard navigation to Radar.
- Medicine detail modal open and close.
- Icon font loading and visible glyph rendering.
- Loading of all spot-icon PNG assets at their 280 x 280 intrinsic size.
- Responsive landing and dashboard rendering at 370 x 824 CSS px.
- No horizontal overflow in either responsive frame; the final dashboard measured 339 px client width and 339 px scroll width.
- No horizontal overflow at the 1363 x 936 tested viewport.

Console check:

- No warnings or errors originating from `terminal.local`.
- Browser-extension metadata errors were observed only under a `chrome-extension://` origin and are unrelated to the implementation.

Remaining differences:

- P3: the source marketing composition uses uploaded document thumbnails; Medora intentionally substitutes product-specific navigation modules.
- P3: the supplied app references are mobile-oriented while this comparison uses the existing responsive web product at desktop width.

Footer iteration:

- Source visual truth: https://collectui.com/designs/footer-ui-design-inspiration/618ca06d-6fd8-4bd4-965b-890337c28e62
- Implementation: https://roblanc.github.io/medora/index.html
- Browser-rendered viewport: 1363 x 936 CSS px, DPR 1, scrolled to the bottom of the page.
- Full-view evidence: the source footer's four-part composition, quiet cream surface, compact navigation, newsletter control, illustration-led brand area, and separated legal row were preserved while all copy, links, and imagery were adapted to Medora.
- Focused evidence: the footer uses the existing transparent medical spot assets, consistent system/Georgia typography, the site's warm-neutral and pastel palette, and the same compact control radii as the landing page.
- Interaction tested: email validation, local success confirmation, internal Medora links, and external source links. The page uses the browser's native cursor; the earlier global cursor suppression and the decorative workflow cursor were removed.
- Console: no page-origin errors; extension-origin metadata messages are unrelated to the implementation.

final result: passed
