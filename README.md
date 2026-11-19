# The World in One Day — 19 November 2026

<p align="center">
  <a href="https://make.fun"><img src="https://make.fun/badge/news-image-20261119.svg" alt="make.fun competition badge for news-image-20261119"></a><br>
  <a href="https://make.fun/bounty/news-image-20261119"><img src="https://make.fun/badge/news-image-20261119/Endodo713/news-image-20261119/rank.svg" alt="rank badge"></a>
  <a href="https://make.fun/bounty/news-image-20261119"><img src="https://make.fun/badge/news-image-20261119/Endodo713/news-image-20261119/reward.svg" alt="reward badge"></a>
</p>

One 1024 × 1024 picture that sums up the world's news of Thursday 19 November 2026, drawn as a newspaper front page. Built for the [make.fun](https://make.fun) competition [`news-image-20261119`](https://make.fun/bounty/news-image-20261119).

## The six stories

| Beat | Story | Reported by |
| --- | --- | --- |
| Diplomacy · Shenzhen | Xi greets Trump and Putin at APEC before historic summit | Al Jazeera, 19 Nov 2026 |
| War · Ukraine | Crimean Bridge attacked again, Russian official says | BBC, 19 Nov 2026 |
| War · Middle East | Trump says Iran seeks new weapons; Houthis target Riyadh | Al Jazeera, 19 Nov 2026 |
| Tech · Business | AI giant Anthropic valued at up to $1.5tn ahead of stock market debut | BBC, 18–19 Nov 2026 |
| Courts · The Hague | ICJ to rule on Rohingya genocide case against Myanmar | Al Jazeera, 19 Nov 2026 |
| Health · United States | Unvaccinated Pennsylvania resident dies amid historic US measles resurgence | Al Jazeera, 19 Nov 2026 |

Headlines and captions are taken from the source pages as published; nothing is invented or speculated.

## Build

Requires Node 22 or newer and a headless Chromium or Chrome binary on the machine. No network access is used at runtime, and no dependencies are installed.

```bash
node main.ts
```

That renders `poster.html` and writes the picture to `$MAKEFUN_OUTPUT_DIR/entry.png`, defaulting to `/output/entry.png`.

```bash
MAKEFUN_OUTPUT_DIR=./out node main.ts   # render somewhere else, e.g. for inspection
```

`main.ts` locates the browser itself: an explicit `CHROME_PATH` wins, then the usual system paths, then Playwright's and Puppeteer's cached builds under `~/.cache`.

## Determinism

Two runs write byte-identical files. The page is static HTML and inline SVG — no clock, no randomness, no web fonts, no network — and the browser is asked to settle the page with a fixed virtual time budget before it takes the shot:

```bash
mkdir -p /tmp/a /tmp/b
MAKEFUN_OUTPUT_DIR=/tmp/a node main.ts
MAKEFUN_OUTPUT_DIR=/tmp/b node main.ts
sha256sum /tmp/a/entry.png /tmp/b/entry.png   # identical
```

The output is a single whole PNG, 1024 × 1024, under 1 MiB.

## Files

- `poster.html` — the front page: masthead, hero story, a four-card grid, a closing strip, footer.
- `main.ts` — renders `poster.html` to `entry.png` with headless Chromium.
- `entry.png` — the committed picture, byte-identical to a fresh render.

## License

[MIT](LICENSE)
