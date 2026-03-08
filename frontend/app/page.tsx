'use client';

import { useState } from 'react';
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

const BTN_DANGER =
  'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-black text-sm ' +
  'px-8 py-3 rounded-xl transition-all';

const BTN_OUTLINE =
  'bg-transparent hover:bg-white/5 border border-white/15 hover:border-white/30 ' +
  'text-white/50 hover:text-white/80 font-black text-sm px-8 py-3 rounded-xl transition-all';

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
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="7" cy="7" r="6" fill={`${color}20`} stroke={color} strokeWidth="1.2" />
    <path d="M4.5 7L6.2 8.7L9.5 5.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBell = ({ hasNew }: { hasNew: boolean }) => (
  <div className="relative" style={{ width: 18, height: 18 }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {hasNew && (
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
        style={{ background: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.8)' }} />
    )}
  </div>
);

const IconAVAX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M13.6 4.6a1.8 1.8 0 0 0-3.2 0L2.4 18.2A1.8 1.8 0 0 0 4 20.8h4.4l2.2-4.4a1.6 1.6 0 0 1 2.8 0l2.2 4.4H20a1.8 1.8 0 0 0 1.6-2.6L13.6 4.6Z" fill="#E84142" />
  </svg>
);
const IconETH = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polygon points="12,2 20,13 12,16.5 4,13" fill="#627EEA" opacity="0.9" />
    <polygon points="12,22 20,13 12,16.5" fill="#627EEA" opacity="0.6" />
    <polygon points="12,22 4,13 12,16.5" fill="#627EEA" opacity="0.4" />
  </svg>
);
const IconPOL = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M17 6.5L12 3.8 7 6.5v5.4l5 2.8 5-2.8V6.5ZM7 14.1L12 17l5-2.9v-1.4l-5 2.8-5-2.8v1.4ZM7 16.5L12 19.5 17 16.5v-1l-5 2.8-5-2.8v1Z" fill="#8247E5" />
  </svg>
);
const IconBNB = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
interface Asset {
  chain: string; balance: string; symbol: string; color: string; usd: string;
}
const ASSETS: Asset[] = [
  { chain: 'Avalanche', balance: '5.00',    symbol: 'AVAX',  color: '#E84142', usd: '$87.30'  },
  { chain: 'Ethereum',  balance: '0.25',    symbol: 'ETH',   color: '#627EEA', usd: '$631.50' },
  { chain: 'Polygon',   balance: '150.00',  symbol: 'POL',   color: '#8247E5', usd: '$73.50'  },
  { chain: 'BNB',       balance: '0.80',    symbol: 'BNB',   color: '#F0B90B', usd: '$484.00' },
  { chain: 'Avalanche', balance: '12,500',  symbol: 'COQ',   color: '#FF6B35', usd: '$18.75'  },
  { chain: 'Avalanche', balance: '4,200',   symbol: 'BLAZE', color: '#FF4500', usd: '$12.60'  },
  { chain: 'Avalanche', balance: '8,000',   symbol: 'KET',   color: '#9B59B6', usd: '$24.00'  },
  { chain: 'Avalanche', balance: '2,100',   symbol: 'ARENA', color: '#27AE60', usd: '$9.45'   },
  { chain: 'Avalanche', balance: '15,000',  symbol: 'GUN',   color: '#E74C3C', usd: '$45.00'  },
  { chain: 'Avalanche', balance: '3,750',   symbol: 'PHAR',  color: '#F39C12', usd: '$22.50'  },
  { chain: 'Ethereum',  balance: '500.00',  symbol: 'USDC',  color: '#2775CA', usd: '$500.00' },
  { chain: 'Avalanche', balance: '1,200',   symbol: 'JOE',   color: '#FF6B6B', usd: '$14.40'  },
];

/* ─── NFT collections ─────────────────────────────────────────────────────── */
interface NFTItem {
  id: string;
  image: string | null;
  traits?: { key: string; value: string; rarity?: string }[];
}
interface Collection {
  name: string; chain: string; floor: string; symbol: string;
  color: string; banner: string | null; nfts: NFTItem[];
}
const COLLECTIONS: Collection[] = [
  {
    name: 'Lil-Burn', chain: 'Avalanche', floor: '0.12', symbol: 'AVAX',
    color: '#E84142', banner: null,
    nfts: [
      { id: '#977', image: null, traits: [
        { key: 'Background', value: 'Void',    rarity: '2%'  },
        { key: 'Body',       value: 'Ember',   rarity: '8%'  },
        { key: 'Eyes',       value: 'Laser',   rarity: '3%'  },
        { key: 'Mouth',      value: 'Fangs',   rarity: '5%'  },
      ]},
      { id: '#858', image: null, traits: [
        { key: 'Background', value: 'Abyss',   rarity: '4%'  },
        { key: 'Body',       value: 'Ice',     rarity: '12%' },
        { key: 'Eyes',       value: 'Diamond', rarity: '1%'  },
        { key: 'Mouth',      value: 'Grin',    rarity: '9%'  },
      ]},
      { id: '#223', image: null, traits: [
        { key: 'Background', value: 'Crimson', rarity: '6%'  },
        { key: 'Body',       value: 'Flame',   rarity: '7%'  },
        { key: 'Eyes',       value: 'Calm',    rarity: '15%' },
        { key: 'Mouth',      value: 'Neutral', rarity: '20%' },
      ]},
    ],
  },
  {
    name: 'MyBarter v1.2', chain: 'Avalanche', floor: '—', symbol: 'AVAX',
    color: '#E84142', banner: null,
    nfts: [
      { id: '#001', image: null, traits: [
        { key: 'Type', value: 'Genesis', rarity: '1%' },
        { key: 'Role', value: 'Arbiter', rarity: '5%' },
      ]},
    ],
  },
  {
    name: 'Unnamed Drop', chain: 'Polygon', floor: '—', symbol: '—',
    color: '#8247E5', banner: null,
    nfts: [],
  },
];

/* ─── Pending trades (mock) ───────────────────────────────────────────────── */
interface TradeAsset {
  type: 'nft' | 'token';
  collection?: string; id?: string;
  symbol?: string; amount?: string; usd?: string;
  color: string;
}
interface PendingTrade {
  id: string; from: string; avatar: string; timestamp: string;
  youGive: TradeAsset[]; youReceive: TradeAsset[];
}
const PENDING_TRADES: PendingTrade[] = [
  {
    id: 'trade-001', from: '0xA1b2...F331', avatar: 'A1', timestamp: '2h ago',
    youGive:    [{ type: 'nft',   collection: 'Lil-Burn',     id: '#977',  color: '#E84142' }],
    youReceive: [
      { type: 'token', symbol: 'AVAX', amount: '50.00', usd: '$435.00', color: '#E84142' },
      { type: 'nft',   collection: 'MyBarter v1.2', id: '#001',         color: '#E84142' },
    ],
  },
  {
    id: 'trade-002', from: '0x9C3d...B8E2', avatar: '9C', timestamp: '5h ago',
    youGive:    [{ type: 'token', symbol: 'POL',  amount: '150.00', usd: '$73.50', color: '#8247E5' }],
    youReceive: [{ type: 'token', symbol: 'USDC', amount: '80.00',  usd: '$80.00', color: '#2775CA' }],
  },
  {
    id: 'trade-003', from: '0xD7f4...2A11', avatar: 'D7', timestamp: '1d ago',
    youGive: [
      { type: 'nft', collection: 'Lil-Burn', id: '#858', color: '#E84142' },
      { type: 'nft', collection: 'Lil-Burn', id: '#223', color: '#E84142' },
    ],
    youReceive: [
      { type: 'token', symbol: 'AVAX', amount: '15.00', usd: '$130.50', color: '#E84142' },
      { type: 'token', symbol: 'GUN',  amount: '5,000', usd: '$15.00',  color: '#E74C3C' },
    ],
  },
];

/* ─── Chain filters ───────────────────────────────────────────────────────── */
const CHAIN_FILTERS = [
  { label: 'Avalanche', color: '#E84142' },
  { label: 'Ethereum',  color: '#627EEA' },
  { label: 'BNB',       color: '#F0B90B' },
  { label: 'Polygon',   color: '#8247E5' },
];

/* ─── Trade asset card (stateless, used in Review Trade) ─────────────────── */
function TradeAssetCard({ asset }: { asset: TradeAsset }) {
  if (asset.type === 'nft') {
    return (
      <div className="rounded-xl p-3 flex flex-col gap-2"
        style={{ background: `${asset.color}0D`, border: `1px solid ${asset.color}33` }}>
        <div className="w-full aspect-square rounded-lg flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${asset.color}20 0%, rgba(255,255,255,0.02) 100%)` }}>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase"
            style={{ color: `${asset.color}55`, fontFamily: INTER }}>
            {asset.collection?.split('-')[0]}
          </span>
        </div>
        <div>
          <p className="text-[11px] font-black text-white tracking-tighter" style={{ fontFamily: INTER }}>{asset.collection}</p>
          <p className="text-[11px] font-black" style={{ color: asset.color }}>{asset.id}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3"
      style={{ background: `${asset.color}0D`, border: `1px solid ${asset.color}33` }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
        style={{ background: `${asset.color}22`, border: `1px solid ${asset.color}55`, color: asset.color }}>
        {asset.symbol?.slice(0, 2)}
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-black text-white" style={{ fontFamily: INTER }}>{asset.symbol}</p>
        <p className="text-[11px] text-white/35">{asset.amount}</p>
      </div>
      <p className="text-[12px] font-black text-white" style={{ fontFamily: INTER }}>{asset.usd}</p>
    </div>
  );
}

/* ─── App view type ───────────────────────────────────────────────────────── */
type AppView = 'home' | 'inventory' | 'profile' | 'reviewTrade';

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function MyBarterApp() {
  const [isConnected, setIsConnected]               = useState(false);
  const [view, setView]                             = useState<AppView>('home');
  const [selected, setSelected]                     = useState<Set<string>>(new Set());
  const [assetChainFilter, setAssetChainFilter]     = useState<string | null>(null);
  const [assetSearch, setAssetSearch]               = useState('');
  const [activeChain, setActiveChain]               = useState<string | null>(null);
  const [searchQuery, setSearchQuery]               = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [reviewTradeId, setReviewTradeId]           = useState<string | null>(null);

  function connect() { setIsConnected(true); setView('inventory'); }
  function goHome()  { setView('home'); }

  const assetSymbols      = new Set(ASSETS.map(a => a.symbol));
  const hasAssetSelection = Array.from(selected).some(k => assetSymbols.has(k));
  const hasNFTSelection   = Array.from(selected).some(k => !assetSymbols.has(k));

  function toggleKey(key: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const drillCollection  = selectedCollection
    ? COLLECTIONS.find(c => c.name === selectedCollection) ?? null : null;
  const chainsWithAssets = new Set(ASSETS.map(a => a.chain));
  const chainsWithData   = new Set(COLLECTIONS.map(c => c.chain));
  const reviewTrade      = reviewTradeId
    ? PENDING_TRADES.find(t => t.id === reviewTradeId) ?? null : null;

  const visibleAssets = ASSETS.filter(a => {
    const chainMatch  = !assetChainFilter || a.chain === assetChainFilter;
    const searchMatch = a.symbol.toLowerCase().includes(assetSearch.toLowerCase())
                     || a.chain.toLowerCase().includes(assetSearch.toLowerCase());
    return chainMatch && searchMatch;
  });
  const visibleCollections = COLLECTIONS.filter(c => {
    const chainMatch  = !activeChain || c.chain === activeChain;
    const searchMatch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return chainMatch && searchMatch;
  });

  function filterBtnStyle(
    f: { label: string; color: string },
    hasData: boolean,
    currentFilter: string | null,
  ) {
    if (!hasData) return {
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
      color: 'rgba(255,255,255,0.15)',
    };
    const isActive  = currentFilter === f.label;
    const someActive = currentFilter !== null;
    if (isActive)    return { background: `${f.color}18`, border: `1px solid ${f.color}66`, color: f.color, boxShadow: `0 0 12px ${f.color}33` };
    if (someActive)  return { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.22)' };
    return { background: `${f.color}0D`, border: `1px solid ${f.color}33`, color: f.color };
  }

  function navLink(label: string, active: boolean, onClick: () => void) {
    return (
      <button key={label} onClick={onClick}
        className="text-[11px] font-black tracking-[0.14em] uppercase transition-all hover:opacity-80"
        style={{ fontFamily: INTER, color: active ? '#fff' : 'rgba(255,255,255,0.38)' }}>
        {label}
      </button>
    );
  }

  /* ── Back chevron helper */
  function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
    return (
      <button onClick={onClick}
        className="flex items-center gap-1.5 mb-6 text-xs font-black tracking-wider transition-opacity hover:opacity-75">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 2L3.5 6L7.5 10" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={gradientText}>{label}</span>
      </button>
    );
  }

  /* ── Filter pill helper */
  function FilterRow({
    chainFilter, setChainFilter, chainsWithData: cwData,
    search, setSearch, placeholder,
  }: {
    chainFilter: string | null; setChainFilter: (v: string | null) => void;
    chainsWithData: Set<string>; search: string; setSearch: (v: string) => void;
    placeholder: string;
  }) {
    return (
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <button onClick={() => setChainFilter(null)}
          className="px-3 py-1 rounded-lg text-xs font-black tracking-wider transition-all"
          style={{
            background: !chainFilter ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
            border: !chainFilter ? '1px solid rgba(255,255,255,0.20)' : '1px solid rgba(255,255,255,0.06)',
            color: !chainFilter ? '#fff' : 'rgba(255,255,255,0.22)',
          }}>
          All
        </button>
        {CHAIN_FILTERS.map(f => {
          const hasData = cwData.has(f.label);
          return (
            <button key={f.label} disabled={!hasData}
              onClick={() => hasData && setChainFilter(chainFilter === f.label ? null : f.label)}
              className="px-3 py-1 rounded-lg text-xs font-black tracking-wider transition-all disabled:cursor-not-allowed"
              style={filterBtnStyle(f, hasData, chainFilter)}>
              {f.label}
            </button>
          );
        })}
        <input type="text" placeholder={placeholder} value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-36 rounded-xl px-3 py-1.5 text-xs text-white/70 placeholder-white/20 outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: INTER }}
          onFocus={e => (e.target.style.borderColor = 'rgba(125,211,252,0.40)')}
          onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-black text-[#ededed]"
      style={{ fontFamily: INTER, WebkitFontSmoothing: 'antialiased' } as React.CSSProperties}
    >
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto border-b border-white/[0.04]">

        {/* Logo — hard <a> redirect to homepage */}
        <a href="/" onClick={e => { e.preventDefault(); goHome(); }}
          className="flex items-center gap-2.5 cursor-pointer" style={{ textDecoration: 'none' }}>
          <Image src="/mybarter-logo.png" alt="MyBarter" width={28} height={28}
            style={{ objectFit: 'contain', flexShrink: 0 }} />
          <span className="text-base font-black tracking-tighter" style={{ fontFamily: INTER, ...gradientText }}>
            MyBarter
          </span>
        </a>

        {/* Public + private nav links */}
        <div className="flex items-center gap-7">
          {navLink('Up for Trade',    view === 'inventory' && isConnected,
            () => isConnected ? setView('inventory') : connect())}
          {navLink('Pending Trades',  view === 'profile',
            () => isConnected ? setView('profile') : connect())}
          {isConnected && navLink('My Inventory', view === 'inventory',
            () => setView('inventory'))}
        </div>

        {/* Right — bell + profile + connect */}
        <div className="flex items-center gap-4">
          {isConnected && (
            <>
              <button onClick={() => setView('profile')} className="transition-opacity hover:opacity-70">
                <IconBell hasNew={PENDING_TRADES.length > 0} />
              </button>
              <button onClick={() => setView('profile')}
                className="text-[11px] font-black tracking-[0.15em] uppercase transition-opacity hover:opacity-70"
                style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.40)' }}>
                My Profile
              </button>
            </>
          )}
          <button onClick={() => isConnected ? setIsConnected(false) : connect()} className={BTN}>
            {isConnected ? '0x...f331' : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════
          VIEW: REVIEW TRADE (Courtroom)
      ════════════════════════════════════════════════════════════════ */}
      {view === 'reviewTrade' && reviewTrade ? (
        <div className="max-w-6xl mx-auto px-8 pt-10 pb-24">
          <BackBtn label="My Pending Trades" onClick={() => { setView('profile'); setReviewTradeId(null); }} />

          <div className="mb-8">
            <p className="text-[10px] font-black tracking-[0.25em] uppercase text-white/25 mb-1">Incoming Offer from</p>
            <h2 className="text-2xl font-black tracking-tighter text-white"
              style={{ fontFamily: INTER, fontWeight: 900 }}>{reviewTrade.from}</h2>
            <p className="text-sm text-white/25 mt-0.5">{reviewTrade.timestamp}</p>
          </div>

          {/* 3-column courtroom */}
          <div className="grid gap-6 mb-10" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

            {/* Left: What You Give */}
            <div>
              <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-4"
                style={{ color: 'rgba(255,255,255,0.28)' }}>What You Give</p>
              <div className="flex flex-col gap-3">
                {reviewTrade.youGive.map((asset, i) => (
                  <TradeAssetCard key={i} asset={asset} />
                ))}
              </div>
            </div>

            {/* Center: Logo + directional arrows */}
            <div className="flex flex-col items-center justify-center gap-4 px-10">
              <Image src="/mybarter-logo.png" alt="MyBarter" width={44} height={44}
                style={{ objectFit: 'contain', opacity: 0.85 }} />

              <div className="flex flex-col items-center gap-2.5">
                {/* Send → */}
                <div className="flex items-center gap-2">
                  <svg width="40" height="10" viewBox="0 0 40 10" fill="none">
                    <path d="M0 5h36M32 1l4 4-4 4" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[9px] font-black tracking-[0.15em] uppercase"
                    style={{ color: '#22d3ee', opacity: 0.7 }}>Send</span>
                </div>
                {/* ← Receive */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black tracking-[0.15em] uppercase"
                    style={{ color: '#a78bfa', opacity: 0.7 }}>Receive</span>
                  <svg width="40" height="10" viewBox="0 0 40 10" fill="none">
                    <path d="M40 5H4M8 1L4 5l4 4" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/15 text-center leading-relaxed">
                Robot Lawyer<br />Escrow
              </p>
            </div>

            {/* Right: What You Receive */}
            <div>
              <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-4"
                style={{ color: 'rgba(255,255,255,0.28)' }}>What You Receive</p>
              <div className="flex flex-col gap-3">
                {reviewTrade.youReceive.map((asset, i) => (
                  <TradeAssetCard key={i} asset={asset} />
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] mb-8" />

          {/* Footer: Accept / Reject / Counter-Offer */}
          <div className="flex items-center justify-center gap-4">
            <button className={BTN} onClick={() => { setView('profile'); setReviewTradeId(null); }}>
              Accept
            </button>
            <button className={BTN_DANGER} onClick={() => { setView('profile'); setReviewTradeId(null); }}>
              Reject
            </button>
            <button className={BTN_OUTLINE} onClick={() => { setView('profile'); setReviewTradeId(null); }}>
              Counter-Offer
            </button>
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: PROFILE / INBOX
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'profile' && isConnected ? (
        <div className="max-w-4xl mx-auto px-8 pt-10 pb-24">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
              style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>
              My Pending Trades
            </h2>
            <p className="text-sm text-white/30">
              {PENDING_TRADES.length} incoming offer{PENDING_TRADES.length !== 1 ? 's' : ''} — review before the 72h window closes
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {PENDING_TRADES.map(trade => (
              <div key={trade.id} className="rounded-2xl px-6 py-5 flex items-center gap-5" style={GLASS}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.50)' }}>
                  {trade.avatar}
                </div>
                {/* Address + summary */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white tracking-tighter" style={{ fontFamily: INTER }}>{trade.from}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    Gives {trade.youGive.length} asset{trade.youGive.length !== 1 ? 's' : ''} · Wants {trade.youReceive.length} asset{trade.youReceive.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <p className="text-xs text-white/20 font-black tracking-wider shrink-0">{trade.timestamp}</p>
                {/* Review Trade button */}
                <button
                  onClick={() => { setReviewTradeId(trade.id); setView('reviewTrade'); }}
                  className="shrink-0 px-5 py-2 rounded-xl text-[11px] font-black tracking-[0.15em] uppercase transition-all"
                  style={{ background: 'rgba(125,211,252,0.07)', border: '1px solid rgba(125,211,252,0.22)', color: '#7DD3FC' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(125,211,252,0.14)')}
                  onMouseOut={e  => (e.currentTarget.style.background = 'rgba(125,211,252,0.07)')}
                >
                  Review Trade
                </button>
              </div>
            ))}
            {PENDING_TRADES.length === 0 && (
              <p className="text-center text-white/20 text-sm py-16">No pending offers.</p>
            )}
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: HOMEPAGE
      ════════════════════════════════════════════════════════════════ */
      ) : !isConnected || view === 'home' ? (
        <>
          <section className="max-w-5xl mx-auto text-center px-6 pt-20 pb-10">
            {/* Eyebrow */}
            <p className="font-black uppercase mb-5 tracking-[0.18em]"
              style={{ fontFamily: INTER, fontSize: '13px', fontWeight: 900, ...gradientText }}>
              Browse · Offer · Swap
            </p>
            {/* Hero — LARGEST text on the page */}
            <h1 className="font-black text-white mb-6"
              style={{ fontFamily: INTER, fontSize: 'clamp(3rem, 8vw, 5.5rem)', letterSpacing: '-0.04em', lineHeight: 0.92, fontWeight: 900 }}>
              The Slippage-Free<br />Settlement Layer
            </h1>
            {/* Sub */}
            <p className="mb-12 max-w-xl mx-auto"
              style={{ fontFamily: INTER, fontSize: '18px', lineHeight: 1.6, fontWeight: 400, color: 'rgba(255,255,255,0.40)' }}>
              Move high-value NFTs and tokens off-market through the{' '}
              <span style={{ color: 'rgba(255,255,255,0.70)', fontWeight: 600 }}>Robot Lawyer Escrow</span>
              {' '}— atomic, scam-proof, zero price impact across chains.
            </p>
            <button onClick={connect} className={BTN_LG}>Connect Wallet</button>
          </section>

          <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PILLARS.map(p => (
                <div key={p.number} className="rounded-2xl p-7 flex flex-col gap-3"
                  style={{ ...GLASS, boxShadow: `0 0 40px ${p.glow}` }}>
                  <div className="flex flex-row items-center gap-3">
                    <span className="text-[11px] font-black tracking-[0.3em] text-white/15">{p.number}</span>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/35">{p.label}</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter text-white leading-snug"
                    style={{ fontFamily: INTER, letterSpacing: '-0.02em', fontWeight: 900 }}>
                    {p.headline}
                  </h3>
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

      /* ════════════════════════════════════════════════════════════════
         VIEW: INVENTORY (connected)
      ════════════════════════════════════════════════════════════════ */
      ) : (
        <div className="max-w-7xl mx-auto px-8 pt-12 pb-24 space-y-14">

          {/* ── Token Grid (4-col) ── */}
          <div>
            <div className="flex justify-between items-end mb-5">
              <div>
                <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
                  style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>
                  Your Assets
                </h2>
                <p className="text-sm text-white/30">Testnet balances — Fuji · Sepolia · Amoy</p>
              </div>
              <button className={hasAssetSelection ? BTN : BTN_INACTIVE} disabled={!hasAssetSelection}>
                Initiate Trade
              </button>
            </div>

            <FilterRow
              chainFilter={assetChainFilter} setChainFilter={setAssetChainFilter}
              chainsWithData={chainsWithAssets}
              search={assetSearch} setSearch={setAssetSearch}
              placeholder="Search assets..."
            />

            {/* 4-column token grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {visibleAssets.map(a => {
                const isSel = selected.has(a.symbol);
                return (
                  <div key={a.symbol} onClick={() => toggleKey(a.symbol)}
                    className="rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer transition-all"
                    style={{
                      background: isSel ? `${a.color}10` : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${isSel ? `${a.color}55` : 'rgba(255,255,255,0.07)'}`,
                    }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                      style={{ background: `${a.color}22`, border: `1px solid ${a.color}55`, color: a.color }}>
                      {a.symbol.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black text-white leading-none mb-0.5" style={{ fontFamily: INTER }}>{a.symbol}</p>
                      <p className="text-[10px] text-white/25 leading-none">{a.chain.slice(0, 4)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[12px] font-black text-white leading-none mb-0.5" style={{ fontFamily: INTER }}>{a.usd}</p>
                      <p className="text-[10px] text-white/30 leading-none">{a.balance}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── NFT Collections (5-col drill-down) ── */}
          <div>
            <div className="flex justify-between items-end mb-5">
              <div>
                {drillCollection ? (
                  <>
                    <BackBtn label="All Collections" onClick={() => setSelectedCollection(null)} />
                    <div className="flex items-center gap-2">
                      <h2 className="text-3xl font-black tracking-tighter text-white"
                        style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>
                        {drillCollection.name}
                      </h2>
                      <IconVerified color={drillCollection.color} />
                    </div>
                    <p className="text-sm text-white/30 mt-0.5">
                      {drillCollection.nfts.length} item{drillCollection.nfts.length !== 1 ? 's' : ''}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
                      style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>
                      Your Collections
                    </h2>
                    <p className="text-sm text-white/30">NFT assets eligible for barter</p>
                  </>
                )}
              </div>
              <button className={hasNFTSelection ? BTN : BTN_INACTIVE} disabled={!hasNFTSelection}>
                Initiate Trade
              </button>
            </div>

            {drillCollection ? (
              /* 5-column NFT grid — no floor price */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {drillCollection.nfts.map(nft => {
                  const key   = `${drillCollection.name}:${nft.id}`;
                  const isSel = selected.has(key);
                  return (
                    <div key={key} onClick={() => toggleKey(key)}
                      className="rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all"
                      style={{
                        ...GLASS,
                        border: `${isSel ? 2 : 1}px solid ${isSel ? drillCollection.color : `${drillCollection.color}33`}`,
                        boxShadow: isSel ? `0 0 18px ${drillCollection.color}44` : `0 0 12px ${drillCollection.color}12`,
                      }}>
                      {/* Image placeholder */}
                      <div className="w-full aspect-square rounded-lg flex items-center justify-center overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${drillCollection.color}18 0%, rgba(255,255,255,0.02) 100%)`,
                          border: `1px solid ${drillCollection.color}22`,
                        }}>
                        {nft.image
                          ? <img src={nft.image} alt={nft.id} className="w-full h-full object-cover" />
                          : <span className="text-[9px] font-black tracking-[0.2em] uppercase select-none"
                              style={{ color: `${drillCollection.color}45` }}>
                              {drillCollection.name.split('-')[0]}
                            </span>
                        }
                      </div>
                      {/* ID row */}
                      <div className="flex justify-between items-center">
                        <p className="text-[11px] font-black text-white tracking-tighter" style={{ fontFamily: INTER }}>{nft.id}</p>
                        {isSel && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                            style={{ background: `${drillCollection.color}22`, color: drillCollection.color }}>✓</span>
                        )}
                      </div>
                      {/* Top 2 traits */}
                      {nft.traits && nft.traits.length > 0 && (
                        <div className="grid grid-cols-2 gap-1">
                          {nft.traits.slice(0, 2).map(t => (
                            <div key={t.key} className="rounded px-1.5 py-1 text-center"
                              style={{ background: `${drillCollection.color}0A`, border: `1px solid ${drillCollection.color}1A` }}>
                              <p className="text-[8px] font-black uppercase tracking-[0.1em] text-white/25">{t.key}</p>
                              <p className="text-[10px] font-black text-white" style={{ fontFamily: INTER }}>{t.value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {drillCollection.nfts.length === 0 && (
                  <p className="col-span-5 text-center text-white/20 text-sm py-16">No NFTs in this collection yet.</p>
                )}
              </div>
            ) : (
              /* Collection card grid */
              <>
                <FilterRow
                  chainFilter={activeChain} setChainFilter={setActiveChain}
                  chainsWithData={chainsWithData}
                  search={searchQuery} setSearch={setSearchQuery}
                  placeholder="Search collections..."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleCollections.map(c => (
                    <div key={c.name} onClick={() => setSelectedCollection(c.name)}
                      className="rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all hover:scale-[1.01]"
                      style={{ ...GLASS, border: `1px solid ${c.color}44`, boxShadow: `0 0 24px ${c.color}18` }}>
                      <div className="w-full h-28 rounded-xl overflow-hidden flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${c.color}1A 0%, rgba(255,255,255,0.02) 100%)`, border: `1px solid ${c.color}22` }}>
                        {c.banner
                          ? <img src={c.banner} alt={c.name} className="w-full h-full object-cover" />
                          : <span className="text-[11px] font-black tracking-[0.3em] uppercase select-none"
                              style={{ color: `${c.color}45` }}>{c.name}</span>
                        }
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-black tracking-tighter text-white"
                          style={{ fontFamily: INTER, letterSpacing: '-0.01em' }}>{c.name}</p>
                        <IconVerified color={c.color} />
                      </div>
                    </div>
                  ))}
                  {visibleCollections.length === 0 && (
                    <p className="col-span-3 text-center text-white/20 text-sm py-10">No collections match your filter.</p>
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
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Live Across Major Chains</p>
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
