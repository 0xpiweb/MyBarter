# MyBarter Frontend Style Guide

**LOCKED — 2026-03-08. Do not modify without a design review.**

---

## Font Loading (Critical)

Inter **must** be loaded via `next/font/google` in `app/layout.tsx`.
Without this, the browser falls back to macOS SF Pro (rounded) or Segoe UI.

```ts
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});
```

Apply to `<html>` via `className={inter.variable}` and `<body>` via `className={inter.className}`.

---

## Font Stack (in-component)

```ts
const INTER = "'Inter', 'system-ui', ui-sans-serif, sans-serif";
```

Set as `style={{ fontFamily: INTER }}` on `<main>` **and** explicitly on every `h1 / h2 / h3`.
Tailwind's `font-sans` alone is insufficient — always use the inline override.

---

## Typography Scale

| Element | Classes | Letter-spacing |
|---|---|---|
| Hero `h1` | `font-black text-6xl md:text-7xl lg:text-8xl` | `-0.04em` |
| Dashboard `h2` | `font-black text-3xl` | `-0.03em` |
| Card `h3` | `font-black text-2xl` | `-0.02em` |
| Nav brand text | `font-bold text-lg tracking-tight` | — |
| Eyebrow labels | `font-bold text-[10px] uppercase tracking-[0.45em]` | — |
| Body subtext | `text-zinc-400 text-xl leading-relaxed` | — |

**"Robot Lawyer Escrow"** is the sole phrase in hero subtext that gets `font-bold text-white`.

---

## Colors

| Token | Hex | Usage |
|---|---|---|
| Background | `#0a0a0a` | `bg-[#0a0a0a]` on `<main>` |
| Foreground | `#ededed` | `text-[#ededed]` on `<main>` |
| Light Blue | `#7DD3FC` | **All** CTA buttons — no exceptions |
| Cyan | `#22d3ee` | Economic Safety · gradient start |
| Violet | `#a78bfa` | Transactional Safety · gradient end |
| Emerald | `#34d399` | Capital Efficiency |
| AVAX | `#E84142` | Avalanche chain identity |
| ETH | `#627EEA` | Ethereum chain identity |
| POL | `#8247E5` | Polygon chain identity |

---

## Gradient Text

Applied to exactly three brand elements — never plain white or flat color:

1. **"MyBarter"** logo text (nav)
2. **"Browse · Offer · Swap"** eyebrow tagline
3. **"Chainlink"** and **"Pyth"** names in footer

```ts
const gradientText: React.CSSProperties = {
  background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};
```

---

## Buttons

**Every button uses the same spec. No dark blue. No flat. No exceptions.**

```ts
// Small — nav, inline actions
const BTN =
  'bg-[#7DD3FC] hover:bg-[#93DCFD] text-black font-bold text-sm ' +
  'px-7 py-2.5 rounded-xl transition-all ' +
  'shadow-[0_0_15px_rgba(125,211,252,0.4)] ' +
  'hover:shadow-[0_0_22px_rgba(125,211,252,0.55)]';

// Large — hero CTA only
const BTN_LG =
  'bg-[#7DD3FC] hover:bg-[#93DCFD] text-black font-bold text-base ' +
  'px-12 py-4 rounded-2xl transition-all ' +
  'shadow-[0_0_15px_rgba(125,211,252,0.4)] ' +
  'hover:shadow-[0_0_28px_rgba(125,211,252,0.55)]';
```

"Connect Wallet" and "Propose a Trade" both use `BTN` — identical glow.

---

## Glassmorphic Cards (base)

```ts
const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1rem',
};
```

**Token asset cards** — override border + shadow with chain color:
```css
border: 1px solid {chainColor}55;
box-shadow: 0 0 20px {chainColor}22;
```

**NFT collection cards:**
```css
border: 1px solid {chainColor}44;
box-shadow: 0 0 24px {chainColor}18;
```

---

## Triple Threat Cards

- Grid: `grid-cols-1 md:grid-cols-3 gap-4` (not `gap-5`)
- Number element: `text-[11px] font-black tracking-[0.3em] text-white/15` — decorative only
- Category label: `text-[10px] font-bold tracking-[0.2em] uppercase text-white/35`
- Headline: `font-black` + `letterSpacing: '-0.02em'` + `fontFamily: INTER`
- Footer tag: `text-[10px] font-bold uppercase tracking-[0.2em]` in `p.color`

---

## Logo

```jsx
<MyBarterLogo className="h-8 w-8" />
```

Component contract:
- Outer `div`: `h-8 w-8 flex-shrink-0`, `display:flex; align-items:center; justify-content:center`
- SVG: `width:100%; height:100%; objectFit:contain; display:block`
- SVG `viewBox="0 0 100 100"` is square — **never** pass asymmetric dimensions

---

## Dashboard Sections (connected state)

**Your Assets** — 3 token cards: AVAX 5.00 · ETH 0.25 · POL 150.00
Each card: chain-color `55` border + `22` glow + Triple Threat row labels.

**Your Collections** — 3 NFT cards:
- Lil-Burn (ETH `#627EEA`, 3 items, floor 0.12 ETH, AVAX Ecosystem)
- MyBarter v1.2 (AVAX `#E84142`, 1 item, Platform Asset)
- Unnamed Drop (Violet `#a78bfa`, 0 items, Coming Q3 2026)

---

## Chain Icons (Footer)

Inline SVG components — `width="16" height="16"` (h-4), no external deps.
Each icon uses its official brand color as a `fill` attribute (not `currentColor`).

| Component | Color | Notes |
|---|---|---|
| `<IconAVAX />` | `#E84142` | Stylized A with inner notch |
| `<IconETH />` | `#627EEA` | Diamond prism, 3 opacity layers |
| `<IconPOL />` | `#8247E5` | Stacked hexagon paths |
| `<IconBNB />` | `#F0B90B` | Rotated diamond grid |

Usage: `<span className="flex items-center gap-1.5">` wraps icon + label text.

---

## Footer

- Chain row: `flex justify-center gap-8 text-[11px] font-bold tracking-[0.2em]`
  Each chain: `flex items-center gap-1.5` with `<IconXXX />` + label text
  AVALANCHE `#E84142` · ETHEREUM `#627EEA` · POLYGON `#8247E5` · BNB `#F0B90B`
  `·` separators at `text-white/10`
- Bottom row: both sides `text-[10px] font-medium tracking-[0.35em] text-white/20`
- "Chainlink" + "Pyth": `gradientText` only — surrounding text stays muted

---

## Tailwind + PostCSS (must-haves)

`tailwind.config.ts` content:
```
"./app/**/*.{js,ts,jsx,tsx}"
"./components/**/*.{js,ts,jsx,tsx}"
"./lib/**/*.{js,ts,jsx,tsx}"
```

`postcss.config.js` **must exist**:
```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

Missing `postcss.config.js` = zero CSS output. This caused every unstyled regression.
