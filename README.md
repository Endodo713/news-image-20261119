# The World in One Day — Thursday, 19 November 2026

A 1024×1024 newspaper poster carrying **100 poster-ready stories for one day**:
6 hero stories with full summaries, 94 numbered index one-liners, an 8-item UTC
timeline strip, a drawn world map with 12 pins and a date-check box.

## Files

| File | Purpose |
|---|---|
| `entry.png` | The poster, 1024×1024 RGB PNG, rendered offline and committed to the repo |
| `poster.html` | The same design and the same 100 stories in HTML/CSS/SVG form, for reading |
| `main.ts` | Entrypoint: copies `entry.png` into `$MAKEFUN_OUTPUT_DIR` |
| `LICENSE` | MIT |

## Entrypoint

```sh
MAKEFUN_OUTPUT_DIR=/tmp/out npx tsx main.ts
```

`main.ts` resolves `entry.png` relative to the program file
(`fileURLToPath(new URL('.', import.meta.url))`); the working directory is only a
fallback. It validates the PNG signature, the 1024×1024 dimensions and the 1 MiB
size cap, then writes the bytes. Standard library only — no Chromium, no
`execFileSync`, no `child_process`, no network, no clock, no randomness — so the
output is byte-identical on every run.

## Content

Every line comes from the verified research file for this date (6 heroes +
94 index one-liners, each with a Tier 1/2 source recorded there). Items that
failed the verification bar are deliberately absent.

- **Heroes** — APEC Shenzhen trilateral · Crimean Bridge · Iran/Houthis ·
  Anthropic IPO · ICJ Rohingya ruling · US measles resurgence.
- **Index** — War & security, Politics & diplomacy, Economy & markets,
  Technology & science, Health/climate/energy, Culture/sport/society.
- **Timeline** — 8 UTC timestamps from 00:11 to 19:30.
- **Map** — 12 pins from New York to Wellington.
- **Date check** — day 323 of 365, 42 days left in 2026, plus 3 checkable facts.

## Design

- Palette: paper `#F7F2E7`, ink `#1E1C19`, red accent `#B02020`, blue accent `#184484`.
- Two typefaces only: Gloock (masthead and hero headlines) and Instrument Sans
  (everything else). Both ship under the SIL Open Font License.
- Three levels of hierarchy, one focal point (masthead + hero row), primary-to-body
  ratio well above 3:1.
- Drawn art only: flags, bridge, missile, chart, scales and cross icons, the
  world map and the date-check bar are CSS/SVG/Pillow shapes. No photographs and
  no external images anywhere.

## Reproducing the image

The poster is drawn by `render-1119-v2.py`, which lives outside this repository so
that the repo holds exactly the six files above. It uses the `prompt-to-design`
engine with its bundled OFL fonts, sets `np.random.seed(7)`, and re-renders
byte-identically (verified with `sha256sum`).
