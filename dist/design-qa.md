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

Global theme iteration:

- Source visual truth: the seven Medora palettes defined for this iteration (current iridescent, sage clinic, lavender medical, warm ivory, ice blue, soft pharmacy, and almost-white premium), together with the existing visual references listed above.
- Browser-rendered implementation: `https://roblanc.github.io/medora/index.html` and `https://roblanc.github.io/medora/medora.html` after GitHub Pages deployment `8dab98e777078adc365f32443dd806b95cdc253f`.
- Viewport and normalization: 1363 x 936 CSS px, DPR 1. The landing and dashboard were captured directly in the cloud browser at the same viewport; no density normalization was needed.
- State: `Sage clinic` and `Alb premium` were selected through the visible theme control. The selected value persisted while navigating across `index.html`, `medora.html` and `research.html`.
- Full-view evidence: the shared wash, surface, accent, muted, border, and deep-ink tokens update the landing atmosphere, structured-information section, operations triptych, footer, application surfaces, and research page without changing their layout or copy. The cinematic hero intentionally retains its dark video treatment.
- Focused evidence: the theme picker exposes seven labeled swatches in a compact two-column panel; its selected state is visible, its trigger stays above the mobile bottom navigation, and it uses native pointer behavior. No additional focused crop was needed because the control and the affected hero/application surfaces were legible in the full browser captures.
- Fonts and typography: unchanged from the approved Medora implementation; theme switching only changes color tokens.
- Spacing and layout rhythm: unchanged. No horizontal overflow was detected on any of the four routes at the tested viewport.
- Colors and visual tokens: each option resolves to its documented base, three washes, accent, soft accent, surface, ink, muted, and line colors. The landing headline accent matched the selected `--theme-accent` value.
- Image quality and asset fidelity: existing transparent 3D medical icons and video assets are unchanged; theme gradients sit behind them without altering their crop or resolution.
- Copy and content: all Romanian Medora copy is unchanged. Theme labels are concise and distinguishable.
- Accessibility and interaction: the selector uses a labeled button, `aria-expanded`, a radio group, visible selected states, Escape/outside-click closing, and saved browser preference. Native cursor state was `auto` on `html` and `body`, with `pointer` only on interactive controls.
- Console and behavior: seven options rendered, theme persistence passed across all four pages, no page-origin console errors were recorded, and no horizontal overflow was detected.

Comparison history:

- Theme P1: the first shared selector rules accidentally matched the landing `.hero`, producing a dark block. Fixed by scoping application-only selectors under `body.medora-app`; post-fix landing capture restored the full pastel light field.
- Theme P1: the first scoped application pass forced its glass hero to the deep theme color and reduced text contrast. Fixed by restoring a translucent theme surface with deep ink and a themed eyebrow; post-fix dashboard capture showed normal contrast and hierarchy.
- Theme P2: GitHub Pages briefly served cached `theme.css?v=2`. Fixed by versioning the shared assets as `v=4` and waiting for the final successful Pages deployment before the final comparison.

final result: passed

## Mobile hero order iteration — 2026-09-17

- Source visual: `/tmp/codex-remote-attachments/01a0ac13-f182-7853-b5e7-0c38c374fe6f/3A1E4F23-ECE8-40BB-BD02-C048EB6D4A7F/1-Photo-1.jpg` (588 × 1280 px).
- Implementation: `http://127.0.0.1:4173/index.html`.
- Comparison evidence: a browser-rendered side-by-side QA view showed the supplied mobile screenshot next to the updated Medora page in a 393 × 852 CSS px frame at DPR 1.
- Requested hierarchy: on viewports up to 620 px, the hero now renders title → six quick-access module icons → search field → source note → frequent-search chips.
- Desktop preservation: at 1280 × 720 CSS px, the hero retains its original two-column structure and the module grid remains a direct child of `.hero`.
- Responsive fit: at 393 × 852 CSS px, document client width and scroll width both measured 378 px; no horizontal overflow was detected.
- Visual alignment: existing Medora typography, iridescent background, 3D spot icons, spacing language, control radii, and labels remain unchanged. Only the mobile information hierarchy and supporting spacing were adjusted.
- Accessibility: the mobile DOM order matches the visible order, so keyboard and screen-reader navigation encounter the shortcuts before the search field. The desktop DOM order is restored when crossing the breakpoint.
- Interaction tested: search suggestions were filtered with `amox`, displayed `Amoxi Demo`, and closed cleanly after clearing the input.
- Console: no browser warnings or errors were recorded during the responsive and desktop checks.

Comparison history:

- P1: the supplied mobile composition placed search before the shortcut icons, while the requested iteration required the opposite priority. Fixed by moving the existing module grid ahead of the search area only at the mobile breakpoint.
- P2: CSS visual reordering alone would have left keyboard navigation inconsistent with the screen. Fixed by synchronizing the actual DOM position with `matchMedia` and restoring the original desktop parent when the breakpoint changes.

final result: passed
