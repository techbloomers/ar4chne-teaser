# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fan-made "ALIEN: GENESIS" teaser site — a CRT-styled Weyland-Yutani terminal experience. Static HTML/CSS/JS with no build step, no bundler, no framework. External dependencies are Google Fonts CDN and GSAP 3.12.5 CDN only. Hosted on GitHub Pages.

## Development

Serve locally with any static HTTP server (files use relative paths, won't work via `file://`):
```bash
npx serve .
# or
python3 -m http.server 8000
```

There are no tests, linters, or build commands.

## Architecture

### JS Module System
All JS uses IIFEs, no ES modules. Inter-module communication is via `window.AlienFX` global object.

**Load order matters** (defined in `index.html`, all `defer`):
1. `js/effects.js` — MUST load first. Exposes `window.AlienFX.scrambleText()` and `window.AlienFX.triggerGlitch()`
2. `js/audio.js`, `js/particles.js`, `js/easter-egg.js` — independent modules, any order
3. `js/main.js` — MUST load last. Orchestrates boot sequence, hero animation, GSAP ScrollTrigger, countdown timer

### CSS Design Tokens
All theming is via CSS custom properties in `:root` (`css/style.css`). Three color themes: amber (colony terminal, `--primary`), blue (station, `--station`), red (alert, `--alert`).

### Key Conventions
- `.gs-h` class = GSAP-controlled hidden state (opacity:0, translateY:30px). Used throughout HTML and removed by JS/GSAP to reveal elements
- `.glitch-target` class = elements eligible for glitch effect
- `.scramble-text` elements use `data-text` attribute for the final resolved text
- CRT overlay layers use z-index 9996-9999; boot screen is 10000; easter egg overlay is 20000

### Countdown Target Date
Set in `js/main.js` as `RELEASE_DATE = new Date('2026-12-25T00:00:00')`.

## Design Principles (from IMPLEMENTATION_GUIDE.md)

1. **Restraint**: All effects at 70% intensity — horror is about what you don't show
2. **Progressive enhancement**: Content readable without effects; heavy effects auto-disabled on mobile; respects `prefers-reduced-motion`
3. **8-second rule**: Boot sequence max 8 seconds with skip button
4. **Color shift**: amber → blue → red across sections to convey location changes

## Constraints

- Do not reorder JS script tags in `index.html`
- Do not change z-index hierarchy of CRT overlays
- Do not change GSAP CDN version (3.12.5 is verified)
- Do not rename the `.gs-h` class (referenced across all JS)
- Keep boot sequence under 8 seconds total
- Asset paths must be relative (for GitHub Pages compatibility)
- Asset file names contain spaces (e.g., `assets/img/xeno side face.jpg`) — handle accordingly

## Full Design Documentation

See `IMPLEMENTATION_GUIDE.md` for detailed asset creation guides, integration instructions, and expansion plans.


## Communication

- 私はプログラミング未経験。Vibe Codingで制作している
- コードの説明は専門用語を避け、何をしているか日本語で簡潔に教えて
- 変更を加える前に、何をするか日本語で説明してから実行すること
- 大きな変更はPlan Modeで計画を見せてから実行

## Security

- 外部リンクには rel="noopener noreferrer" を付与
- ユーザー入力を表示する場合はサニタイズすること
- 将来フォームを追加する場合はバリデーション必須

## Quality

- IMPORTANT: モバイル表示で崩れていないか必ず確認
- OGP設定（og:title, og:description, og:image）を含めること
- 画像は圧縮済みのものを使用し、遅延読み込みを推奨
