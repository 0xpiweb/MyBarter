# MyBarter Frontend Style Guide

Canonical design tokens. Any PR that diverges from these must include a design review.

---

## Colors

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#0a0a0a` | Page background |
| `--fg` | `#ededed` | Body text |
| Light Blue | `#7DD3FC` | All CTA buttons (Figma spec) |
| Cyan | `#22d3ee` | Economic Safety, oracle glow |
| Violet | `#a78bfa` | Transactional Safety |
| Emerald | `#34d399` | Capital Efficiency |

### Chain Brand Colors
| Chain | Hex |
|---|---|
| Avalanche | `#E84142` |
| Ethereum | `#627EEA` |
| Polygon | `#8247E5` |

---

## Buttons

**All buttons use the Light Blue Figma spec — no dark blue, no flat styling.**

```
bg-[#7DD3FC] hover:bg-[#93DCFD] text-black font-bold rounded-xl
shadow-[0_0_15px_rgba(125,211,252,0.4)]
hover:shadow-[0_0_22px_rgba(125,211,252,0.55)]
```

- Small (nav): `px-7 py-2.5 text-sm rounded-xl`
- Large (hero CTA): `px-12 py-4 text-base rounded-2xl`

---

## Typography

- **Font stack**: `'Inter', 'system-ui', sans-serif`
- **Headline**: `font-black`, `letter-spacing: -0.04em` — institutional, not friendly
- **Card headlines**: `font-black`, `letter-spacing: -0.02em`
- **Robot Lawyer Escrow**: the only phrase in hero subtext with `font-bold text-white`
- **Eyebrow labels**: `text-[10px] font-bold uppercase tracking-[0.4em]`
- `-webkit-font-smoothing: antialiased` must be set on `<main>`

---

## Glassmorphic Cards

```css
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.10);  /* border-white/10 */
border-radius: 1rem;  /* rounded-2xl */
```

**Asset cards**: replace `border-white/10` with `1px solid {chainColor}55` and
`box-shadow: 0 0 20px {chainColor}22` to express chain identity.

---

## Triple Threat Cards

Number (`01` / `02` / `03`) is a **design element only**:
- `text-[11px] font-black tracking-[0.3em] text-white/15`
- Positioned at the top of the card, visually separate from the label below it

Label (`ECONOMIC SAFETY` etc.):
- `text-[10px] font-bold tracking-[0.2em] uppercase text-white/35`

---

## Logo

```jsx
<MyBarterLogo className="h-8" />
```
- SVG renders directly (no wrapper div). `width: auto`, `objectFit: contain`.
- **Never** set both `w-*` and `h-*` to different aspect ratios.

---

## Footer

- **Chain list**: centered, `gap-10`, `text-[11px] font-bold tracking-[0.25em]`
  with `·` separators at `text-white/10`
- **"SECURED BY CHAINLINK & PYTH"** and **"NON-CUSTODIAL"**: identical weight —
  `text-[10px] font-medium tracking-[0.35em] text-white/20`
- **Chainlink** and **Pyth** names only get a `linear-gradient(90deg, #22d3ee, #a78bfa)`
  text gradient. The surrounding words stay `text-white/20`.

---

## Tailwind Config

`tailwind.config.ts` content must scan:
```
./app/**/*.{js,ts,jsx,tsx}
./components/**/*.{js,ts,jsx,tsx}
./lib/**/*.{js,ts,jsx,tsx}
```

`postcss.config.js` **must exist** with `tailwindcss` + `autoprefixer`.
Without it, Tailwind emits zero CSS.
