'use client';

import { useState } from 'react';
import MyBarterLogo from '@/components/MyBarterLogo';

/* ─── Style tokens ────────────────────────────────────────────────────────── */
const INTER = "'Inter', 'system-ui', ui-sans-serif, sans-serif";

const BTN =
  'bg-[#7DD3FC] hover:bg-[#93DCFD] text-black font-bold text-sm ' +
  'px-7 py-2.5 rounded-xl transition-all ' +
  'shadow-[0_0_15px_rgba(125,211,252,0.4)] hover:shadow-[0_0_22px_rgba(125,211,252,0.55)]';

const BTN_LG =
  'bg-[#7DD3FC] hover:bg-[#93DCFD] text-black font-bold text-base ' +
  'px-12 py-4 rounded-2xl transition-all ' +
  'shadow-[0_0_15px_rgba(125,211,252,0.4)] hover:shadow-[0_0_28px_rgba(125,211,252,0.55)]';

const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1rem',
};

/* ─── Triple Threat data ──────────────────────────────────────────────────── */
const PILLARS = [
  {
    number: '01',
    label: 'ECONOMIC SAFETY',
    headline: "Stop 'Death Candles'",
    body: 'Chainlink oracles lock the USD value at trade time. No slippage, no last-second manipulation — your position settles at the price you agreed.',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.12)',
  },
  {
    number: '02',
    label: 'TRANSACTIONAL SAFETY',
    headline: 'No Standoffs',
    body: 'Both-party signatures required. The Robot Lawyer Escrow holds assets atomically — neither side can exit without the other, eliminating rug risk.',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.12)',
  },
  {
    number: '03',
    label: 'CAPITAL EFFICIENCY',
    headline: 'Unlock Dead Capital',
    body: 'Bundle NFTs + tokens into a single atomic trade. Multi-asset rotations settle in one transaction or revert entirely — no partial fills, no stranded assets.',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.12)',
  },
];

/* ─── Token asset data ────────────────────────────────────────────────────── */
const ASSETS = [
  { chain: 'Avalanche', balance: '5.00',   symbol: 'AVAX', color: '#E84142' },
  { chain: 'Ethereum',  balance: '0.25',   symbol: 'ETH',  color: '#627EEA' },
  { chain: 'Polygon',   balance: '150.00', symbol: 'POL',  color: '#8247E5' },
];

const TRIPLE_ROWS = [
  { label: 'Economic Safety',      tag: 'Slippage-Free',  color: '#22d3ee' },
  { label: 'Transactional Safety', tag: 'Scam-Proof',     color: '#a78bfa' },
  { label: 'Capital Efficiency',   tag: 'Asset Rotation', color: '#34d399' },
];

/* ─── NFT collection data (placeholder / roadmap) ─────────────────────────── */
const COLLECTIONS = [
  {
    name: 'Lil-Burn',
    items: 3,
    floor: '0.12',
    symbol: 'ETH',
    color: '#627EEA',
    tag: 'AVAX Ecosystem',
    placeholder: '🔥',
  },
  {
    name: 'MyBarter v1.2',
    items: 1,
    floor: '—',
    symbol: 'AVAX',
    color: '#E84142',
    tag: 'Platform Asset',
    placeholder: '⚖️',
  },
  {
    name: 'Unnamed Drop',
    items: 0,
    floor: '—',
    symbol: '—',
    color: '#a78bfa',
    tag: 'Coming Q3 2026',
    placeholder: '◇',
  },
];

/* ─── Chain SVG icons (inline, h-4 / 16 px) ──────────────────────────────── */
const IconAVAX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="Avalanche">
    <path
      d="M13.6 4.6a1.8 1.8 0 0 0-3.2 0L2.4 18.2A1.8 1.8 0 0 0 4 20.8h4.4l2.2-4.4a1.6 1.6 0 0 1 2.8 0l2.2 4.4H20a1.8 1.8 0 0 0 1.6-2.6L13.6 4.6Z"
      fill="#E84142"
    />
  </svg>
);

const IconETH = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="Ethereum">
    <polygon points="12,2 20,13 12,16.5 4,13" fill="#627EEA" opacity="0.9" />
    <polygon points="12,22 20,13 12,16.5" fill="#627EEA" opacity="0.6" />
    <polygon points="12,22 4,13 12,16.5" fill="#627EEA" opacity="0.4" />
  </svg>
);

const IconPOL = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="Polygon">
    <path
      d="M17 6.5L12 3.8 7 6.5v5.4l5 2.8 5-2.8V6.5ZM7 14.1L12 17l5-2.9v-1.4l-5 2.8-5-2.8v1.4ZM7 16.5L12 19.5 17 16.5v-1l-5 2.8-5-2.8v1Z"
      fill="#8247E5"
    />
  </svg>
);

const IconBNB = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="BNB">
    <path
      d="M12 2l2.8 2.8L17.6 2 20.4 4.8 17.6 7.6 20.4 10.4 17.6 13.2 14.8 10.4 12 13.2 9.2 10.4 6.4 13.2 3.6 10.4 6.4 7.6 3.6 4.8 6.4 2 9.2 4.8ZM12 15l2.8 2.8L12 20.6 9.2 17.8Z"
      fill="#F0B90B"
    />
  </svg>
);

/* ─── Gradient text helper ────────────────────────────────────────────────── */
const gradientText: React.CSSProperties = {
  background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function MyBarterApp() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <main
      className="min-h-screen bg-[#0a0a0a] text-[#ededed]"
      style={{ fontFamily: INTER, WebkitFontSmoothing: 'antialiased' }}
    >
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <MyBarterLogo className="h-8 w-8" />
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: INTER, ...gradientText }}
          >
            MyBarter
          </span>
        </div>

        <button onClick={() => setIsConnected(!isConnected)} className={BTN}>
          {isConnected ? '0x...f331' : 'Connect Wallet'}
        </button>
      </nav>

      {!isConnected ? (
        /* ── Home (disconnected) ────────────────────────────────────────── */
        <>
          <section className="max-w-5xl mx-auto text-center px-6 pt-20 pb-10">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.45em] mb-8"
              style={gradientText}
            >
              Browse · Offer · Swap
            </p>

            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.03] mb-8 text-white"
              style={{ fontFamily: INTER, letterSpacing: '-0.04em' }}
            >
              The Slippage-Free<br />
              Settlement Layer<br />
              <span className="text-white/55">for Asset Rotation</span>
            </h1>

            <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Move high-value NFTs and tokens off-market through the{' '}
              <span className="text-white font-bold">Robot Lawyer Escrow</span>
              {' '}— atomic, scam-proof, zero price impact across chains.
            </p>

            <button onClick={() => setIsConnected(true)} className={BTN_LG}>
              Connect Wallet
            </button>
          </section>

          {/* Triple Threat cards — gap tightened to gap-4 on lg */}
          <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PILLARS.map((p) => (
                <div
                  key={p.number}
                  className="rounded-2xl p-7 flex flex-col gap-3"
                  style={{ ...GLASS, boxShadow: `0 0 40px ${p.glow}` }}
                >
                  <span className="text-[11px] font-black tracking-[0.3em] text-white/15 self-start">
                    {p.number}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35">
                      {p.label}
                    </span>
                    <h3
                      className="text-2xl font-black text-white leading-snug"
                      style={{ fontFamily: INTER, letterSpacing: '-0.02em' }}
                    >
                      {p.headline}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{p.body}</p>
                  <div
                    className="mt-auto pt-4 border-t text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ borderColor: `${p.color}22`, color: p.color }}
                  >
                    {p.label.split(' ')[0]} GUARANTEED
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* ── Dashboard (connected) ──────────────────────────────────────── */
        <div className="max-w-7xl mx-auto px-8 pt-12 pb-24 space-y-14">

          {/* Token assets */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2
                  className="text-3xl font-black text-white mb-1"
                  style={{ fontFamily: INTER, letterSpacing: '-0.03em' }}
                >
                  Your Assets
                </h2>
                <p className="text-sm text-white/30">Testnet balances — Fuji · Sepolia · Amoy</p>
              </div>
              {/* Same BTN class as Connect Wallet — identical light blue glow */}
              <button className={BTN}>Propose a Trade</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ASSETS.map((a) => (
                <div
                  key={a.symbol}
                  className="rounded-2xl p-6 flex flex-col gap-4"
                  style={{
                    ...GLASS,
                    border: `1px solid ${a.color}55`,
                    boxShadow: `0 0 20px ${a.color}22`,
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-white/80">{a.chain}</span>
                    <span className="text-xs font-mono text-white/30">{a.symbol}</span>
                  </div>
                  <p
                    className="text-3xl font-black text-white"
                    style={{ fontFamily: INTER, letterSpacing: '-0.03em' }}
                  >
                    {a.balance}
                    <span className="text-base font-semibold ml-2" style={{ color: a.color }}>
                      {a.symbol}
                    </span>
                  </p>
                  <div className="flex flex-col gap-1.5 text-xs border-t border-white/5 pt-4">
                    {TRIPLE_ROWS.map((row) => (
                      <div key={row.label} className="flex justify-between items-center">
                        <span className="text-white/30">{row.label}</span>
                        <span className="font-semibold" style={{ color: row.color }}>{row.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NFT Collections */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2
                  className="text-3xl font-black text-white mb-1"
                  style={{ fontFamily: INTER, letterSpacing: '-0.03em' }}
                >
                  Your Collections
                </h2>
                <p className="text-sm text-white/30">NFT assets eligible for barter — Lil-Burn · MyBarter v1.2</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COLLECTIONS.map((c) => (
                <div
                  key={c.name}
                  className="rounded-2xl p-6 flex flex-col gap-4"
                  style={{
                    ...GLASS,
                    border: `1px solid ${c.color}44`,
                    boxShadow: `0 0 24px ${c.color}18`,
                  }}
                >
                  {/* Placeholder thumbnail */}
                  <div
                    className="w-full h-32 rounded-xl flex items-center justify-center text-4xl"
                    style={{
                      background: `linear-gradient(135deg, ${c.color}18, ${c.color}08)`,
                      border: `1px solid ${c.color}22`,
                    }}
                  >
                    {c.placeholder}
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-black text-white" style={{ letterSpacing: '-0.01em' }}>
                        {c.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mt-0.5">
                        {c.tag}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{
                        background: `${c.color}18`,
                        border: `1px solid ${c.color}33`,
                        color: c.color,
                      }}
                    >
                      {c.items} item{c.items !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs border-t border-white/5 pt-3">
                    <span className="text-white/30">Floor</span>
                    <span className="font-semibold text-white/70">
                      {c.floor} {c.floor !== '—' ? c.symbol : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            Live Across Major Chains
          </p>
          <div className="flex justify-center items-center gap-8 text-[11px] font-bold tracking-[0.2em]">
            <span className="flex items-center gap-1.5" style={{ color: '#E84142' }}>
              <IconAVAX />AVALANCHE (HUB)
            </span>
            <span className="text-white/10">·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#627EEA' }}>
              <IconETH />ETHEREUM
            </span>
            <span className="text-white/10">·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#8247E5' }}>
              <IconPOL />POLYGON
            </span>
            <span className="text-white/10">·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#F0B90B' }}>
              <IconBNB />BNB CHAIN
            </span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/20 font-medium">
            Secured by{' '}
            <span className="font-bold" style={gradientText}>Chainlink</span>
            {' '}&amp;{' '}
            <span className="font-bold" style={gradientText}>Pyth</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/20 font-medium">
            Non-Custodial
          </p>
        </div>
      </footer>
    </main>
  );
}
