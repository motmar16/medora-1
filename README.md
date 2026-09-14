# Medora — research + interactive mock

12 septembrie 2026 · Research public + prototip interactiv for Romanian clinicians.
New version from `Medora-local.zip` (13 septembrie 2026): refreshed landing + dashboard, pastel-glow hero art, spot icons.

Live demo (GitHub Pages): https://roblanc.github.io/medora/

## Open

- `index.html` — public landing page, search with suggestions
- `medora.html` — interactive mock, desktop + mobile
- `research.html` — report with sources + 105-tool appendix
- `research.md` — editable report
- `instrumente-mediately.csv` — inventory with short names + official links
- `medora-pastel-glow.png` + `spot-icons/` — hero art + section icons
- `design-qa.md` + `qa/` — design QA notes + screenshots
- `server.mjs` (`npm run dev`) — local preview server
- `landing-cinematic.html` — alternate cinematic landing (full-screen looping hero video, liquid-glass UI), direct URL only: https://roblanc.github.io/medora/landing-cinematic.html — not linked from the main landing
- `landing-ambient.html` — supplied still photograph with subtle CSS/JS 2.5D depth, moving sunlight and reduced-motion support

No install or API keys. Fonts, styles and mock JS are inlined in HTML.
External documentation links need internet.

## What it is

Catalog + personalized radar for discontinuations, withdrawals and changes (ANMDMR/EMA candidate sources). Watchlist in localStorage, catalog compare, BMI calculator, saved alert preferences. All products/events fictitious. No clinical use.

## Limits

No ANMDMR sync, no live stock, no email/push, no accounts, no interaction engine. Preferences are local in browser. `Medora` is a working name, no trademark/domain check.

Source: built 2026-09-12, published from `Documents/Codex/2026-09-12/vreau-sa-fac-un-serviciu-similar/work/medora-site/dist/`.
