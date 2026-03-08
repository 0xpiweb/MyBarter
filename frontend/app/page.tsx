'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* ─── Style tokens ────────────────────────────────────────────────────────── */
const INTER = "'Inter', 'system-ui', ui-sans-serif, sans-serif";

const BTN =
  'bg-[#7DD3FC] hover:bg-[#93DCFD] text-black font-black text-sm ' +
  'px-7 py-2.5 rounded-xl transition-all ' +
  'shadow-[0_0_15px_rgba(125,211,252,0.4)] hover:shadow-[0_0_22px_rgba(125,211,252,0.55)]';

const BTN_LG =
  'bg-[#7DD3FC] hover:bg-[#93DCFD] text-black font-black text-base ' +
  'px-12 py-4 rounded-2xl transition-all ' +
  'shadow-[0_0_15px_rgba(125,211,252,0.4)] hover:shadow-[0_0_28px_rgba(125,211,252,0.55)]';

const BTN_INACTIVE =
  'bg-white/5 border border-white/10 text-white/25 font-black text-sm ' +
  'px-7 py-2.5 rounded-xl transition-all cursor-not-allowed';

const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '1rem',
};

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

/* ─── Icons ───────────────────────────────────────────────────────────────── */
const IconVerified = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }} aria-label="Verified">
    <circle cx="7" cy="7" r="6" fill={`${color}20`} stroke={color} strokeWidth="1.2" />
    <path d="M4.5 7L6.2 8.7L9.5 5.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconAVAX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="Avalanche">
    <path d="M13.6 4.6a1.8 1.8 0 0 0-3.2 0L2.4 18.2A1.8 1.8 0 0 0 4 20.8h4.4l2.2-4.4a1.6 1.6 0 0 1 2.8 0l2.2 4.4H20a1.8 1.8 0 0 0 1.6-2.6L13.6 4.6Z" fill="#E84142" />
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
    <path d="M17 6.5L12 3.8 7 6.5v5.4l5 2.8 5-2.8V6.5ZM7 14.1L12 17l5-2.9v-1.4l-5 2.8-5-2.8v1.4ZM7 16.5L12 19.5 17 16.5v-1l-5 2.8-5-2.8v1Z" fill="#8247E5" />
  </svg>
);
const IconBNB = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="BNB">
    <path d="M12 2l2.8 2.8L17.6 2 20.4 4.8 17.6 7.6 20.4 10.4 17.6 13.2 14.8 10.4 12 13.2 9.2 10.4 6.4 13.2 3.6 10.4 6.4 7.6 3.6 4.8 6.4 2 9.2 4.8ZM12 15l2.8 2.8L12 20.6 9.2 17.8Z" fill="#F0B90B" />
  </svg>
);

/* ─── Triple Threat ───────────────────────────────────────────────────────── */
const PILLARS = [
  {
    number: '1.', label: 'ECONOMIC SAFETY', headline: "Stop 'Death Candles'",
    body: 'Chainlink oracles lock the USD value at trade time. No slippage, no last-second manipulation — your position settles at the price you agreed.',
    color: '#22d3ee', glow: 'rgba(34,211,238,0.12)',
  },
  {
    number: '2.', label: 'TRANSACTIONAL SAFETY', headline: 'No Standoffs',
    body: 'Both-party signatures required. The Robot Lawyer Escrow holds assets atomically — neither side can exit without the other, eliminating rug risk.',
    color: '#a78bfa', glow: 'rgba(167,139,250,0.12)',
  },
  {
    number: '3.', label: 'CAPITAL EFFICIENCY', headline: 'Unlock Dead Capital',
    body: 'Bundle NFTs + tokens into a single atomic trade. Multi-asset rotations settle in one transaction or revert entirely — no partial fills, no stranded assets.',
    color: '#34d399', glow: 'rgba(52,211,153,0.12)',
  },
];

/* ─── Token assets ────────────────────────────────────────────────────────── */
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

/* ─── NFT collections (with per-item drill-down data) ─────────────────────── */
interface NFTItem { id: string; image: string | null; }
interface Collection {
  name: string; chain: string; floor: string; symbol: string;
  color: string; banner: string | null; nfts: NFTItem[];
}

const COLLECTIONS: Collection[] = [
  {
    name: 'Lil-Burn', chain: 'Avalanche', floor: '0.12', symbol: 'AVAX',
    color: '#E84142', banner: null,
    nfts: [
      { id: '#977', image: null },
      { id: '#858', image: null },
      { id: '#223', image: null },
    ],
  },
  {
    name: 'MyBarter v1.2', chain: 'Avalanche', floor: '—', symbol: 'AVAX',
    color: '#E84142', banner: null,
    nfts: [{ id: '#001', image: null }],
  },
  {
    name: 'Unnamed Drop', chain: 'Polygon', floor: '—', symbol: '—',
    color: '#8247E5', banner: null,
    nfts: [],
  },
];

/* ─── Chain filter tabs ───────────────────────────────────────────────────── */
const CHAIN_FILTERS = [
  { label: 'Avalanche', color: '#E84142' },
  { label: 'Ethereum',  color: '#627EEA' },
  { label: 'BNB',       color: '#F0B90B' },
  { label: 'Polygon',   color: '#8247E5' },
];

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function MyBarterApp() {
  const [isConnected, setIsConnected]             = useState(false);
  const [selected, setSelected]                   = useState<Set<string>>(new Set());
  const [activeChain, setActiveChain]             = useState<string | null>(null);
  const [searchQuery, setSearchQuery]             = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Only individual NFT or token selections activate Propose Trade
  const hasSelection = selected.size > 0;

  function toggleKey(key: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const drillCollection = selectedCollection
    ? COLLECTIONS.find(c => c.name === selectedCollection) ?? null
    : null;

  const visibleCollections = COLLECTIONS.filter(c => {
    const chainMatch = !activeChain || c.chain === activeChain;
    const searchMatch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return chainMatch && searchMatch;
  });

  // Chains that actually have at least one collection
  const chainsWithData = new Set(COLLECTIONS.map(c => c.chain));

  // Chain filter button style:
  // — no data on that chain → always grey + disabled
  // — has data, is active  → colored bg + glow
  // — has data, another is active → muted grey
  // — has data, nothing active → brand color (default)
  function filterBtnStyle(f: { label: string; color: string }, hasData: boolean) {
    if (!hasData) return {
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.15)',
    };
    const isActive = activeChain === f.label;
    const someActive = activeChain !== null;
    if (isActive) return {
      background: `${f.color}18`,
      border: `1px solid ${f.color}66`,
      color: f.color,
      boxShadow: `0 0 12px ${f.color}33`,
    };
    if (someActive) return {
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.22)',
    };
    // Default: brand color visible, no glow
    return {
      background: `${f.color}0D`,
      border: `1px solid ${f.color}33`,
      color: f.color,
    };
  }

  return (
    <main
      className="min-h-screen bg-[#0a0a0a] text-[#ededed]"
      style={{ fontFamily: INTER, WebkitFontSmoothing: 'antialiased' } as React.CSSProperties}
    >
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <Image
            src="/mybarter-logo.png"
            alt="MyBarter"
            width={32}
            height={32}
            style={{ objectFit: 'contain', flexShrink: 0 }}
          />
          <span className="text-lg font-black tracking-tighter" style={{ fontFamily: INTER, ...gradientText }}>
            MyBarter
          </span>
        </Link>
        <button onClick={() => setIsConnected(!isConnected)} className={BTN}>
          {isConnected ? '0x...f331' : 'Connect Wallet'}
        </button>
      </nav>

      {!isConnected ? (
        /* ── Home (disconnected) ────────────────────────────────────────── */
        <>
          <section className="max-w-5xl mx-auto text-center px-6 pt-20 pb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.45em] mb-8" style={gradientText}>
              Browse · Offer · Swap
            </p>
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8"
              style={{ fontFamily: INTER, letterSpacing: '-0.04em', lineHeight: 0.95 }}
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

          <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PILLARS.map((p) => (
                <div key={p.number} className="rounded-2xl p-7 flex flex-col gap-3"
                  style={{ ...GLASS, boxShadow: `0 0 40px ${p.glow}` }}>
                  <span className="text-[11px] font-black tracking-[0.3em] text-white/15 self-start">{p.number}</span>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/35">{p.label}</span>
                    <h3 className="text-2xl font-black tracking-tighter text-white leading-snug"
                      style={{ fontFamily: INTER, letterSpacing: '-0.02em' }}>
                      {p.headline}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{p.body}</p>
                  <div className="mt-auto pt-4 border-t text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ borderColor: `${p.color}22`, color: p.color }}>
                    {p.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* ── Dashboard (connected) ──────────────────────────────────────── */
        <div className="max-w-7xl mx-auto px-8 pt-12 pb-24 space-y-14">

          {/* ── Token Assets ── */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
                  style={{ fontFamily: INTER, letterSpacing: '-0.03em' }}>
                  Your Assets
                </h2>
                <p className="text-sm text-white/30">Testnet balances — Fuji · Sepolia · Amoy</p>
              </div>
              <button className={hasSelection ? BTN : BTN_INACTIVE} disabled={!hasSelection}>
                Propose a Trade
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ASSETS.map((a) => {
                const isSelected = selected.has(a.symbol);
                return (
                  <div
                    key={a.symbol}
                    onClick={() => toggleKey(a.symbol)}
                    className="rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all"
                    style={{
                      ...GLASS,
                      border: isSelected ? `2px solid ${a.color}` : `1px solid ${a.color}55`,
                      boxShadow: isSelected ? `0 0 20px ${a.color}55` : `0 0 20px ${a.color}22`,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black tracking-tighter text-white/80">{a.chain}</span>
                      <span className="text-xs font-mono text-white/30">{a.symbol}</span>
                    </div>
                    <p className="text-3xl font-black tracking-tighter text-white"
                      style={{ fontFamily: INTER, letterSpacing: '-0.03em' }}>
                      {a.balance}
                      <span className="text-base font-black ml-2" style={{ color: a.color }}>{a.symbol}</span>
                    </p>
                    <div className="flex flex-col gap-1.5 text-xs border-t border-white/5 pt-4">
                      {TRIPLE_ROWS.map((row) => (
                        <div key={row.label} className="flex justify-between items-center">
                          <span className="text-white/30">{row.label}</span>
                          <span className="font-black" style={{ color: row.color }}>{row.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── NFT Collections / Drill-Down ── */}
          <div>
            {/* Section header */}
            <div className="flex justify-between items-end mb-6">
              <div>
                {drillCollection ? (
                  <>
                    <button
                      onClick={() => setSelectedCollection(null)}
                      className="text-xs font-black tracking-wider text-white/30 hover:text-white/60 transition-colors mb-2 flex items-center gap-1.5"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      All Collections
                    </button>
                    <div className="flex items-center gap-2">
                      <h2 className="text-3xl font-black tracking-tighter text-white"
                        style={{ fontFamily: INTER, letterSpacing: '-0.03em' }}>
                        {drillCollection.name}
                      </h2>
                      <IconVerified color={drillCollection.color} />
                    </div>
                    <p className="text-sm text-white/30 mt-1">
                      {drillCollection.nfts.length} item{drillCollection.nfts.length !== 1 ? 's' : ''} · Floor {drillCollection.floor}{drillCollection.floor !== '—' ? ` ${drillCollection.symbol}` : ''}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
                      style={{ fontFamily: INTER, letterSpacing: '-0.03em' }}>
                      Your Collections
                    </h2>
                    <p className="text-sm text-white/30">NFT assets eligible for barter — Lil-Burn · MyBarter v1.2</p>
                  </>
                )}
              </div>
              <button className={hasSelection ? BTN : BTN_INACTIVE} disabled={!hasSelection}>
                Propose a Trade
              </button>
            </div>

            {drillCollection ? (
              /* ── NFT Item Grid ── */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {drillCollection.nfts.map((nft) => {
                  const key = `${drillCollection.name}:${nft.id}`;
                  const isSelected = selected.has(key);
                  return (
                    <div
                      key={key}
                      onClick={() => toggleKey(key)}
                      className="rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all"
                      style={{
                        ...GLASS,
                        border: isSelected ? `2px solid ${drillCollection.color}` : `1px solid ${drillCollection.color}44`,
                        boxShadow: isSelected ? `0 0 20px ${drillCollection.color}55` : `0 0 20px ${drillCollection.color}18`,
                      }}
                    >
                      {/* NFT image / glassmorphic placeholder */}
                      <div
                        className="w-full aspect-square rounded-xl flex items-center justify-center overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${drillCollection.color}20 0%, rgba(255,255,255,0.02) 100%)`,
                          border: `1px solid ${drillCollection.color}22`,
                        }}
                      >
                        {nft.image ? (
                          <img src={nft.image} alt={`${drillCollection.name} ${nft.id}`} className="w-full h-full object-cover" />
                        ) : (
                          <span
                            className="text-[11px] font-black tracking-[0.25em] uppercase select-none"
                            style={{ color: `${drillCollection.color}50` }}
                          >
                            {drillCollection.name.split('-')[0]}
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-black tracking-tighter text-white"
                          style={{ fontFamily: INTER }}>
                          {drillCollection.name} {nft.id}
                        </p>
                        {isSelected && (
                          <p className="text-[10px] font-black tracking-[0.2em] uppercase mt-0.5"
                            style={{ color: drillCollection.color }}>
                            Selected
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {drillCollection.nfts.length === 0 && (
                  <p className="col-span-4 text-center text-white/20 text-sm py-16">
                    No NFTs in this collection yet.
                  </p>
                )}
              </div>
            ) : (
              /* ── Collection Grid ── */
              <>
                {/* Filter tabs + search — single flex row, search pinned after Polygon */}
                <div className="flex items-center gap-4 flex-wrap mb-6">
                  {/* All */}
                  <button
                    onClick={() => setActiveChain(null)}
                    className="px-4 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all"
                    style={{
                      background: !activeChain ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                      border: !activeChain ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                      color: !activeChain ? '#fff' : 'rgba(255,255,255,0.22)',
                    }}
                  >
                    All
                  </button>

                  {/* Chain filters — colored only if chain has collections, disabled otherwise */}
                  {CHAIN_FILTERS.map((f) => {
                    const hasData = chainsWithData.has(f.label);
                    return (
                      <button
                        key={f.label}
                        onClick={() => hasData && setActiveChain(activeChain === f.label ? null : f.label)}
                        disabled={!hasData}
                        className="px-4 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all disabled:cursor-not-allowed"
                        style={filterBtnStyle(f, hasData)}
                      >
                        {f.label}
                      </button>
                    );
                  })}

                  {/* Search — immediately after Polygon, fixed width */}
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 rounded-xl px-4 py-2 text-sm text-white/70 placeholder-white/20 outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontFamily: INTER,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(125,211,252,0.4)')}
                    onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>

                {/* Collection cards — click to drill down, NOT to select */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleCollections.map((c) => (
                    <div
                      key={c.name}
                      onClick={() => setSelectedCollection(c.name)}
                      className="rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all hover:scale-[1.01]"
                      style={{
                        ...GLASS,
                        border: `1px solid ${c.color}44`,
                        boxShadow: `0 0 24px ${c.color}18`,
                      }}
                    >
                      {/* Collection banner / glassmorphic placeholder */}
                      <div
                        className="w-full h-32 rounded-xl overflow-hidden flex items-center justify-center relative"
                        style={{
                          background: `linear-gradient(135deg, ${c.color}1A 0%, rgba(255,255,255,0.02) 100%)`,
                          border: `1px solid ${c.color}22`,
                        }}
                      >
                        {c.banner ? (
                          <img src={c.banner} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <span
                            className="text-[11px] font-black tracking-[0.3em] uppercase select-none"
                            style={{ color: `${c.color}45` }}
                          >
                            {c.name}
                          </span>
                        )}
                      </div>

                      {/* Name + verified checkmark */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-black tracking-tighter text-white"
                            style={{ fontFamily: INTER, letterSpacing: '-0.01em' }}>
                            {c.name}
                          </p>
                          <IconVerified color={c.color} />
                        </div>
                        <span className="text-[10px] font-black px-2 py-1 rounded-full"
                          style={{ background: `${c.color}18`, border: `1px solid ${c.color}33`, color: c.color }}>
                          {c.nfts.length} item{c.nfts.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs border-t border-white/5 pt-3">
                        <span className="text-white/30">Floor</span>
                        <span className="font-black text-white/70">
                          {c.floor}{c.floor !== '—' ? ` ${c.symbol}` : ''}
                        </span>
                      </div>
                    </div>
                  ))}

                  {visibleCollections.length === 0 && (
                    <p className="col-span-3 text-center text-white/20 text-sm py-10">
                      No collections match your filter.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
            Live Across Major Chains
          </p>
          <div className="flex justify-center items-center gap-8 text-[11px] font-black tracking-[0.2em]">
            <span className="flex items-center gap-1.5" style={{ color: '#E84142' }}><IconAVAX />AVALANCHE (HUB)</span>
            <span className="text-white/10">·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#627EEA' }}><IconETH />ETHEREUM</span>
            <span className="text-white/10">·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#8247E5' }}><IconPOL />POLYGON</span>
            <span className="text-white/10">·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#F0B90B' }}><IconBNB />BNB CHAIN</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/20 font-medium">
            Secured by{' '}
            <span className="font-black" style={gradientText}>Chainlink</span>
            {' '}&amp;{' '}
            <span className="font-black" style={gradientText}>Pyth</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/20 font-medium">Non-Custodial</p>
        </div>
      </footer>
    </main>
  );
}
