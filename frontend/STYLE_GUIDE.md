# MyBarter Frontend Style Guide

**FROZEN — 2026-03-08. Updated 2026-03-08 (v2). No changes without design review.**

---

## Why fonts kept looking rounded — the full fix

Three layers were required. Miss any one and the browser falls back to SF Pro / Segoe UI (both rounded):

1. **`next/font/google`** in `layout.tsx` — fetches Inter at build time and injects `--font-inter` CSS variable.
2. **`tailwind.config.ts` `theme.extend.fontFamily.sans`** — wires `--font-inter` into Tailwind's `font-sans`. Without this, `@tailwind base` resets body/headings to the default rounded stack.
3. **`globals.css`** — sets `font-family: var(--font-inter), ...` on `html, body, h1-h6` as belt-and-suspenders against UA stylesheets.

---

## Font Loading (`layout.tsx`)

```ts
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});
```

Apply to `<html className={inter.variable}>` and `<body className={inter.className}>`.

---

## Tailwind Font Config (`tailwind.config.ts`)

```ts
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  },
},
```

---

## Global CSS (`globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  background: #0a0a0a;
  color: #ededed;
  font-family: var(--font-inter), 'Inter', 'system-ui', ui-sans-serif, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-inter), 'Inter', 'system-ui', ui-sans-serif, sans-serif;
}
```

---

## In-component Font Constant

```ts
const INTER = "'Inter', 'system-ui', ui-sans-serif, sans-serif";
// Applied via style={{ fontFamily: INTER }} on <main>, h1, h2, h3
```

---

## Typography Scale

**Rule: ALL headers must use `font-black` (font-weight: 900) with `fontFamily: INTER` inline. No rounded fonts are permitted in the MyBarter ecosystem. If it looks rounded, it is wrong.**

| Element | Tailwind classes | Inline style |
|---|---|---|
| Hero eyebrow | `font-black text-2xl uppercase tracking-[0.2em]` | `gradientText` |
| Hero `h1` | `font-black text-5xl md:text-6xl lg:text-7xl text-white` | `fontFamily:INTER, letterSpacing:'-0.05em', lineHeight:0.9, fontWeight:900` |
| Dashboard `h2` | `font-black text-3xl text-white` | `fontFamily:INTER, letterSpacing:'-0.03em', fontWeight:900` |
| Card `h3` | `font-black text-2xl text-white` | `fontFamily:INTER, letterSpacing:'-0.02em', fontWeight:900` |
| Nav brand text | `font-black text-lg tracking-tighter` | `fontFamily: INTER` + `gradientText` |
| Body subtext | `text-zinc-400 text-xl leading-relaxed` | — |
| "Robot Lawyer Escrow" | `font-bold text-white` (inline only) | — |

---

## Colors

| Token | Hex | Usage |
|---|---|---|
| Background | `#0a0a0a` | `bg-[#0a0a0a]` |
| Foreground | `#ededed` | `text-[#ededed]` |
| Light Blue | `#7DD3FC` | All CTA buttons |
| Cyan | `#22d3ee` | Economic Safety · gradient start |
| Violet | `#a78bfa` | Transactional Safety · gradient end |
| Emerald | `#34d399` | Capital Efficiency |
| AVAX | `#E84142` | Avalanche chain identity |
| ETH | `#627EEA` | Ethereum chain identity |
| POL | `#8247E5` | Polygon chain identity |
| BNB | `#F0B90B` | BNB chain identity |

---

## Gradient Text

```ts
const gradientText: React.CSSProperties = {
  background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};
```

Applied to: **"MyBarter"** nav text · **"Browse · Offer · Swap"** eyebrow · **"Chainlink"** · **"Pyth"** footer names.

---

## Buttons

```ts
const BTN =
  'bg-[#7DD3FC] hover:bg-[#93DCFD] text-black font-bold text-sm ' +
  'px-7 py-2.5 rounded-xl transition-all ' +
  'shadow-[0_0_15px_rgba(125,211,252,0.4)] hover:shadow-[0_0_22px_rgba(125,211,252,0.55)]';

const BTN_LG =
  'bg-[#7DD3FC] hover:bg-[#93DCFD] text-black font-bold text-base ' +
  'px-12 py-4 rounded-2xl transition-all ' +
  'shadow-[0_0_15px_rgba(125,211,252,0.4)] hover:shadow-[0_0_28px_rgba(125,211,252,0.55)]';
```

"Connect Wallet" = `BTN`. "Propose a Trade" = `BTN`. **Identical glow. No exceptions.**

---

## Logo Component

```tsx
<MyBarterLogo size={32} />
```

Component contract (non-negotiable):
- Props: `size: number` (default 32), `className?: string`
- Outer div: explicit `width: size; height: size; minWidth: size; minHeight: size` in `style` — **not Tailwind classes**
- SVG: explicit `width: size; height: size` in `style` — **not `w-full h-full`**
- Both: `flexShrink: 0` — parent flex layout cannot stretch or squish
- `viewBox="0 0 100 100"` is square — pixel dimensions guarantee 1:1

---

## Glassmorphic Cards

```ts
const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1rem',
};
```

Token cards override: `border: 1px solid {color}55; boxShadow: 0 0 20px {color}22`
NFT cards override: `border: 1px solid {color}44; boxShadow: 0 0 24px {color}18`

---

## Triple Threat Cards

- Grid: `grid-cols-1 md:grid-cols-3 gap-4`
- **Number + label on same row** (non-negotiable): wrap in `<div className="flex items-center gap-2">`
  - Number: `text-[11px] font-black tracking-[0.3em] text-white/15` — format `'1.'` `'2.'` `'3.'` **NOT** `'01'`
  - Label: `text-[10px] font-black tracking-[0.2em] uppercase text-white/35`
- Headline `h3`: `font-black tracking-tighter` + `style={{ fontFamily: INTER, letterSpacing: '-0.02em', fontWeight: 900 }}`
- Footer strip: `text-[10px] font-black uppercase tracking-[0.2em]` in `p.color` — full label text. **Never** `GUARANTEED`.

## Back Navigation ("← All Collections")

Cyan-to-violet gradient on both icon and text — integrated brand treatment, not a system link.

```tsx
<button onClick={() => setSelectedCollection(null)}
  className="text-xs font-black tracking-wider mb-2 flex items-center gap-1.5 transition-opacity hover:opacity-75">
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M7.5 2L3.5 6L7.5 10" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
  <span style={gradientText}>All Collections</span>
</button>
```

The chevron uses `stroke="#22d3ee"` (gradient start colour). The text uses `gradientText` (`#22d3ee → #a78bfa`). **Never** `text-white/30` or `currentColor` on this element.

---

## Chain Icons (Footer)

16×16px inline SVG components. Fill is hardcoded (not `currentColor`).

| Component | Color | Shape |
|---|---|---|
| `<IconAVAX />` | `#E84142` | Stylised A with notch |
| `<IconETH />` | `#627EEA` | Diamond prism, 3-layer opacity |
| `<IconPOL />` | `#8247E5` | Stacked hexagon paths |
| `<IconBNB />` | `#F0B90B` | Rotated diamond grid |

Usage: `<span className="flex items-center gap-1.5">` wrapping icon + label.

---

## Footer

- Chain row: `flex justify-center gap-8 text-[11px] font-bold tracking-[0.2em]`
- `·` separators: `text-white/10`
- Bottom row both sides: `text-[10px] font-medium tracking-[0.35em] text-white/20`
- "Chainlink" and "Pyth": `gradientText` only

---

## Collection Cards (v2 — permanent)

### No tag text inside cards
The `tag` field (e.g. "AVAX Ecosystem", "Platform Asset") is **removed**. Replace with a verified checkmark icon next to the collection name.

```tsx
const IconVerified = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="7" cy="7" r="6" fill={`${color}20`} stroke={color} strokeWidth="1.2" />
    <path d="M4.5 7L6.2 8.7L9.5 5.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Usage — name + icon on same line, no tag below:
<div className="flex items-center gap-1.5">
  <p className="text-sm font-black tracking-tighter text-white">{c.name}</p>
  <IconVerified color={c.color} />
</div>
```

### Banner area
- Height: `h-32`, `rounded-xl`, `overflow-hidden`
- If `c.banner` (URL): render `<img>` with `object-cover`
- If null: glassmorphic gradient placeholder — **no emoji**

```tsx
<div style={{
  background: `linear-gradient(135deg, ${c.color}1A 0%, rgba(255,255,255,0.02) 100%)`,
  border: `1px solid ${c.color}22`,
}}>
  {c.banner
    ? <img src={c.banner} className="w-full h-full object-cover" />
    : <span style={{ color: `${c.color}45` }}>{c.name}</span>}
</div>
```

### Drill-Down Logic (non-negotiable)
Clicking a **collection card** navigates into that collection's NFT grid. It does **NOT** add to the `selected` set and does **NOT** activate the Propose Trade button.

```
Collection Grid  →  [click card]  →  NFT Item Grid
```

- State: `selectedCollection: string | null` — stores the collection name
- Back button: `onClick={() => setSelectedCollection(null)}`
- NFT keys: `"CollectionName:#ID"` stored in the shared `selected: Set<string>`

### Activation logic
| User action | `selected` updated | Propose Trade active |
|---|---|---|
| Click collection card | No | No |
| Click individual NFT in drill-down | Yes | Yes |
| Click token card | Yes | Yes |

---

## Chain Filter Buttons (v3 — permanent)

### Data-driven coloring (non-negotiable)
A chain button is **only colored** if the user actually has at least one collection on that chain.
If no collection exists on a chain → button is grey + `disabled` — never brand-colored.

```tsx
const chainsWithData = new Set(COLLECTIONS.map(c => c.chain));

function filterBtnStyle(f: { label: string; color: string }, hasData: boolean) {
  if (!hasData) return {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.15)',
  };
  const isActive = activeChain === f.label;
  const someActive = activeChain !== null;
  if (isActive) return {
    background: `${f.color}18`, border: `1px solid ${f.color}66`,
    color: f.color, boxShadow: `0 0 12px ${f.color}33`,
  };
  if (someActive) return {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.22)',
  };
  return { background: `${f.color}0D`, border: `1px solid ${f.color}33`, color: f.color };
}
```

Button render must pass `hasData` and set `disabled={!hasData}`:
```tsx
<button disabled={!hasData} onClick={() => hasData && setActiveChain(...)} style={filterBtnStyle(f, hasData)}>
```

### Filter + Search row layout (non-negotiable)
One **flat** `flex gap-4` row — no `justify-between`, no nested divs, search pinned immediately after the last chain button.

```tsx
<div className="flex items-center gap-4 flex-wrap mb-6">
  <button>All</button>
  {/* chain buttons */}
  <input className="w-48 ..." />  {/* search — right after Polygon, NOT floated */}
</div>
```

---

## Tailwind Content Paths

```
"./app/**/*.{js,ts,jsx,tsx}"
"./components/**/*.{js,ts,jsx,tsx}"
"./lib/**/*.{js,ts,jsx,tsx}"
```

`postcss.config.js` must exist: `{ plugins: { tailwindcss: {}, autoprefixer: {} } }`
