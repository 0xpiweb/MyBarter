# MyBarter Frontend Style Guide

Canonical design tokens. Any PR that diverges from these must include a design review.
Last updated: 2026-03-08 (logic sprint ready).

---

## Colors

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#0a0a0a` | Page background |
| `--fg` | `#ededed` | Body text |
| Light Blue | `#7DD3FC` | **All** CTA buttons (Figma spec) |
| Cyan | `#22d3ee` | Economic Safety, oracle glow, gradient start |
| Violet | `#a78bfa` | Transactional Safety, gradient end |
| Emerald | `#34d399` | Capital Efficiency |

### Chain Brand Colors
| Chain | Hex |
|---|---|
| Avalanche | `#E84142` |
| Ethereum | `#627EEA` |
| Polygon | `#8247E5` |

---

## Buttons

**Every button uses the same Light Blue Figma spec. No exceptions.**

```
bg-[#7DD3FC] hover:bg-[#93DCFD] text-black font-bold rounded-xl transition-all
shadow-[0_0_15px_rgba(125,211,252,0.4)]
hover:shadow-[0_0_22px_rgba(125,211,252,0.55)]
```

- **Small** (nav, inline): `px-7 py-2.5 text-sm rounded-xl`
- **Large** (hero CTA): `px-12 py-4 text-base rounded-2xl`

---

## Typography

- **Font stack**: `'Inter', 'system-ui', ui-sans-serif, sans-serif`
  Set on `<main>` via `style={{ fontFamily }}` and repeat on all `h1/h2/h3`.
- **Hero headline** (`h1`): `font-black`, `letter-spacing: -0.04em` — heavy and sharp
- **Dashboard headings** (`h2`): `font-black`, `letter-spacing: -0.03em`
- **Card headlines** (`h3`): `font-black`, `letter-spacing: -0.02em`
- **Robot Lawyer Escrow**: sole phrase in hero subtext with `font-bold text-white`
- **Eyebrow labels**: `text-[10px] font-bold uppercase tracking-[0.4em+]`
- Set `-webkit-font-smoothing: antialiased` on `<main>`

---

## Glassmorphic Cards (base)

```css
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.10);   /* border-white/10 */
border-radius: 1rem;                             /* rounded-2xl */
```

Export as a shared `GLASS` constant in each file to avoid drift.

### Token Asset Cards
Override the border and shadow with chain color:
```css
border: 1px solid {chainColor}55;
box-shadow: 0 0 20px {chainColor}22;
```

### NFT Collection Cards
```css
border: 1px solid {chainColor}44;
box-shadow: 0 0 24px {chainColor}18;
```
Thumbnail area: `linear-gradient(135deg, {chainColor}18, {chainColor}08)` with
`border: 1px solid {chainColor}22`.

---

## Triple Threat Cards

- Grid gap: `gap-4` (not `gap-5` or `gap-6`) on large screens
- Number (`01/02/03`): `text-[11px] font-black tracking-[0.3em] text-white/15` — design element only, top of card
- Label: `text-[10px] font-bold tracking-[0.2em] uppercase text-white/35`
- Headline: `font-black letter-spacing:-0.02em` via `INTER` font stack
- Footer tag: `text-[10px] font-bold uppercase tracking-[0.2em]` in `p.color`

---

## NFT Collection Cards (Your Collections)

Three placeholder cards in the connected dashboard below token assets:
- Lil-Burn (ETH `#627EEA`, AVAX Ecosystem tag)
- MyBarter v1.2 (AVAX `#E84142`, Platform Asset tag)
- Unnamed Drop (Violet `#a78bfa`, Coming Q3 2026 tag)

Each card: thumbnail placeholder area, collection name (`font-black`), tag label,
item count badge (chain-color pill), floor price row.

---

## Logo

```jsx
<MyBarterLogo className="h-8 w-8" />
```

- Container is `h-8 w-8 flex-shrink-0` (32×32 px square)
- SVG inside: `width: 100%; height: 100%; objectFit: contain; display: block`
- **Never** pass asymmetric `w-*`/`h-*` to the component
- SVG viewBox is `0 0 100 100` (square) — no distortion when container is square

---

## Footer

- **Chain list**: `flex justify-center gap-10`, `text-[11px] font-bold tracking-[0.25em]`
  with `·` dots at `text-white/10` between each name
- **Bottom row**: both sides use identical `text-[10px] font-medium tracking-[0.35em] text-white/20`
- **"Chainlink"** and **"Pyth"** names only: `linear-gradient(90deg, #22d3ee, #a78bfa)` text gradient
  via `-webkit-background-clip: text; -webkit-text-fill-color: transparent`
- Surrounding words ("Secured by", "&") stay `text-white/20` — no bold, no white

---

## Tailwind Config Requirements

`tailwind.config.ts` content array **must** include:
```
"./app/**/*.{js,ts,jsx,tsx}"
"./components/**/*.{js,ts,jsx,tsx}"
"./lib/**/*.{js,ts,jsx,tsx}"
```

`postcss.config.js` **must exist** with:
```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

Without `postcss.config.js`, Tailwind emits zero CSS — this was the root cause
of all unstyled regressions in sprint 1.
