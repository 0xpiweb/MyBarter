'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

/* ─── Style tokens ────────────────────────────────────────────────────────── */
const INTER = "'Inter', 'system-ui', ui-sans-serif, sans-serif";

// Connect button: solid #22d3ee (left side of MyBarter gradient)
const BTN =
  'bg-[#22d3ee] hover:bg-[#38e6f7] text-black font-black text-sm ' +
  'px-7 py-2.5 rounded-xl transition-all ' +
  'shadow-[0_0_15px_rgba(34,211,238,0.35)] hover:shadow-[0_0_22px_rgba(34,211,238,0.55)]';

const BTN_LG =
  'bg-[#22d3ee] hover:bg-[#38e6f7] text-black font-black text-base ' +
  'px-12 py-4 rounded-2xl transition-all ' +
  'shadow-[0_0_15px_rgba(34,211,238,0.35)] hover:shadow-[0_0_28px_rgba(34,211,238,0.55)]';

const BTN_INACTIVE =
  'bg-white/5 border border-white/10 text-white/25 font-black text-sm ' +
  'px-7 py-2.5 rounded-xl transition-all cursor-not-allowed';

const BTN_DANGER =
  'bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 font-black text-sm ' +
  'px-8 py-3 rounded-xl transition-all';

const BTN_OUTLINE =
  'bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/35 ' +
  'text-white/60 hover:text-white/90 font-black text-sm px-8 py-3 rounded-xl transition-all';

const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '1rem',
};

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

/* ─── Filter button style (module-level — no closure needed) ─────────────── */
function filterBtnStyle(
  f: { label: string; color: string },
  hasData: boolean,
  currentFilter: string | null,
): React.CSSProperties {
  if (!hasData) return { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.18)' };
  const isActive  = currentFilter === f.label;
  const someActive = currentFilter !== null;
  if (isActive)   return { background: `${f.color}18`, border: `1px solid ${f.color}66`, color: f.color, boxShadow: `0 0 12px ${f.color}33` };
  if (someActive) return { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)' };
  return { background: `${f.color}0D`, border: `1px solid ${f.color}33`, color: f.color };
}

/* ─── Chain icons ─────────────────────────────────────────────────────────── */
const IconAVAX = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M13.6 4.6a1.8 1.8 0 0 0-3.2 0L2.4 18.2A1.8 1.8 0 0 0 4 20.8h4.4l2.2-4.4a1.6 1.6 0 0 1 2.8 0l2.2 4.4H20a1.8 1.8 0 0 0 1.6-2.6L13.6 4.6Z" fill="#E84142" />
  </svg>
);
const IconETH = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <polygon points="12,2 20,13 12,16.5 4,13" fill="#627EEA" opacity="0.9" />
    <polygon points="12,22 20,13 12,16.5" fill="#627EEA" opacity="0.6" />
    <polygon points="12,22 4,13 12,16.5" fill="#627EEA" opacity="0.4" />
  </svg>
);
const IconPOL = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M17 6.5L12 3.8 7 6.5v5.4l5 2.8 5-2.8V6.5ZM7 14.1L12 17l5-2.9v-1.4l-5 2.8-5-2.8v1.4ZM7 16.5L12 19.5 17 16.5v-1l-5 2.8-5-2.8v1Z" fill="#8247E5" />
  </svg>
);
const IconBNB = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2l2.8 2.8L17.6 2 20.4 4.8 17.6 7.6 20.4 10.4 17.6 13.2 14.8 10.4 12 13.2 9.2 10.4 6.4 13.2 3.6 10.4 6.4 7.6 3.6 4.8 6.4 2 9.2 4.8ZM12 15l2.8 2.8L12 20.6 9.2 17.8Z" fill="#F0B90B" />
  </svg>
);

/* ─── Token icons (all 12 assets, distinct SVG shapes) ───────────────────── */
const TOKEN_SVGS: Record<string, (s: number) => React.ReactNode> = {
  AVAX:  (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M13.6 4.6a1.8 1.8 0 0 0-3.2 0L2.4 18.2A1.8 1.8 0 0 0 4 20.8h4.4l2.2-4.4a1.6 1.6 0 0 1 2.8 0l2.2 4.4H20a1.8 1.8 0 0 0 1.6-2.6L13.6 4.6Z" fill="#E84142" /></svg>,
  ETH:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><polygon points="12,2 20,13 12,16.5 4,13" fill="#627EEA" opacity="0.9" /><polygon points="12,22 20,13 12,16.5" fill="#627EEA" opacity="0.6" /><polygon points="12,22 4,13 12,16.5" fill="#627EEA" opacity="0.4" /></svg>,
  POL:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M17 6.5L12 3.8 7 6.5v5.4l5 2.8 5-2.8V6.5ZM7 14.1L12 17l5-2.9v-1.4l-5 2.8-5-2.8v1.4ZM7 16.5L12 19.5 17 16.5v-1l-5 2.8-5-2.8v1Z" fill="#8247E5" /></svg>,
  BNB:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2l2.8 2.8L17.6 2 20.4 4.8 17.6 7.6 20.4 10.4 17.6 13.2 14.8 10.4 12 13.2 9.2 10.4 6.4 13.2 3.6 10.4 6.4 7.6 3.6 4.8 6.4 2 9.2 4.8ZM12 15l2.8 2.8L12 20.6 9.2 17.8Z" fill="#F0B90B" /></svg>,
  COQ:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M8 9c0-2.5 1.5-4 2.5-4.5s2.5 0 2.5 2.5" fill="none" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round"/><path d="M10.5 9c0-1.5 1-2.5 1.5-3s1.5.5 1.5 2" fill="none" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round"/><ellipse cx="12" cy="15.5" rx="5.5" ry="5" fill="#FF6B35" opacity="0.9"/><path d="M6.5 15l-2 .5 2 .5z" fill="#F0B90B"/><circle cx="9.5" cy="13.5" r="1" fill="white" opacity="0.9"/><circle cx="9.8" cy="13.3" r="0.4" fill="#111"/></svg>,
  BLAZE: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3S7 7.5 7 12.5c0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.5-1.8-4-1.8-4s.3 2.5-1.2 3.5c-.8.5-1.5 0-2-1 0-2 2-4.5 2-4.5S15 8 15 10.5c0 1.7-1.3 3-3 3s-3-1.3-3-3c0-2 1.5-4 3-5z" fill="#FF4500" opacity="0.9"/><path d="M12 10s-.8 1.5-.8 2.5.4 1.5.8 1.5.8-.5.8-1.5-.8-2.5-.8-2.5z" fill="#FFD700" opacity="0.85"/></svg>,
  KET:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L21 7v10l-9 5-9-5V7z" fill="#9B59B6" opacity="0.85" stroke="#9B59B6" strokeWidth="0.5"/><path d="M9 8v8M9 12l5-4M9 12l5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ARENA: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#27AE60" opacity="0.15" stroke="#27AE60" strokeWidth="1"/><path d="M5 5l14 14M19 5L5 19" stroke="#27AE60" strokeWidth="2" strokeLinecap="round"/><path d="M5 5l3.5 0 0 3.5M19 5l-3.5 0 0 3.5M5 19l3.5 0 0-3.5M19 19l-3.5 0 0-3.5" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  GUN:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" stroke="#E74C3C" strokeWidth="1.2"/><circle cx="12" cy="12" r="4" fill="#E74C3C" opacity="0.7"/><circle cx="12" cy="12" r="1.5" fill="#E74C3C"/><path d="M12 2.5V7M12 17v4.5M2.5 12H7M17 12h4.5" stroke="#E74C3C" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  PHAR:  (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M8 20h8v-6l-2-2h-4l-2 2v6z" fill="#F39C12" opacity="0.9"/><path d="M10 14V9c0-1.5.9-3 2-3s2 1.5 2 3v5" fill="#F39C12" opacity="0.75"/><path d="M10 7l-3-2M14 7l3-2M12 4V2" stroke="#F39C12" strokeWidth="1.5" strokeLinecap="round"/><rect x="7.5" y="18.5" width="9" height="2.5" rx="1" fill="#E67E22"/></svg>,
  USDC:  (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#2775CA" opacity="0.9"/><path d="M12 5.5v1.2M12 17.3v1.2M12 6.7c-2.5 0-4.5 1.5-4.5 3.3s2 3.3 4.5 3.3 4.5 1.5 4.5 3.3-2 3.3-4.5 3.3" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  JOE:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M8 4v6c0 2.2 1.8 4 4 4s4-1.8 4-4V4" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 4l4 2.5L16 4" stroke="#FF6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 14v6" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round"/></svg>,
};

function TokenIcon({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const render = TOKEN_SVGS[symbol];
  if (render) return <>{render(size)}</>;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

/* ─── Shield / Verified icon (green always) ──────────────────────────────── */
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M7 1L2 3.2V7c0 2.9 2.2 5.5 5 5.9 2.8-.4 5-3 5-5.9V3.2L7 1z"
      fill="#22c55e20" stroke="#22c55e" strokeWidth="1.2" />
    <path d="M4.5 7L6.2 8.7L9.5 5.3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBell = ({ hasNew }: { hasNew: boolean }) => (
  <div className="relative" style={{ width: 18, height: 18 }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {hasNew && (
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
        style={{ background: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.9)' }} />
    )}
  </div>
);

/* ─── Triple Threat ───────────────────────────────────────────────────────── */
const PILLARS = [
  { number: '1.', label: 'ECONOMIC SAFETY',    headline: "Stop 'Death Candles'",  body: 'Chainlink oracles lock the USD value at trade time. No slippage, no last-second manipulation — your position settles at the price you agreed.', color: '#22d3ee', glow: 'rgba(34,211,238,0.12)' },
  { number: '2.', label: 'TRANSACTIONAL SAFETY', headline: 'No Standoffs',        body: 'Both-party signatures required. The Robot Lawyer Escrow holds assets atomically — neither side can exit without the other, eliminating rug risk.', color: '#a78bfa', glow: 'rgba(167,139,250,0.12)' },
  { number: '3.', label: 'CAPITAL EFFICIENCY', headline: 'Unlock Dead Capital',   body: 'Bundle NFTs + tokens into a single atomic trade. Multi-asset rotations settle in one transaction or revert entirely — no partial fills, no stranded assets.', color: '#34d399', glow: 'rgba(52,211,153,0.12)' },
];

/* ─── Assets ──────────────────────────────────────────────────────────────── */
interface Asset { chain: string; balance: string; symbol: string; color: string; usd: string; }
const ASSETS: Asset[] = [
  { chain: 'Avalanche', balance: '5.00',   symbol: 'AVAX',  color: '#E84142', usd: '$87.30'  },
  { chain: 'Ethereum',  balance: '0.25',   symbol: 'ETH',   color: '#627EEA', usd: '$631.50' },
  { chain: 'Polygon',   balance: '150.00', symbol: 'POL',   color: '#8247E5', usd: '$73.50'  },
  { chain: 'BNB',       balance: '0.80',   symbol: 'BNB',   color: '#F0B90B', usd: '$484.00' },
  { chain: 'Avalanche', balance: '12,500', symbol: 'COQ',   color: '#FF6B35', usd: '$18.75'  },
  { chain: 'Avalanche', balance: '4,200',  symbol: 'BLAZE', color: '#FF4500', usd: '$12.60'  },
  { chain: 'Avalanche', balance: '8,000',  symbol: 'KET',   color: '#9B59B6', usd: '$24.00'  },
  { chain: 'Avalanche', balance: '2,100',  symbol: 'ARENA', color: '#27AE60', usd: '$9.45'   },
  { chain: 'Avalanche', balance: '15,000', symbol: 'GUN',   color: '#E74C3C', usd: '$45.00'  },
  { chain: 'Avalanche', balance: '3,750',  symbol: 'PHAR',  color: '#F39C12', usd: '$22.50'  },
  { chain: 'Ethereum',  balance: '500.00', symbol: 'USDC',  color: '#2775CA', usd: '$500.00' },
  { chain: 'Avalanche', balance: '1,200',  symbol: 'JOE',   color: '#FF6B6B', usd: '$14.40'  },
];

/* ─── Collections ─────────────────────────────────────────────────────────── */
interface NFTItem { id: string; image: string | null; traits?: { key: string; value: string; rarity?: string }[]; }
interface Collection { name: string; chain: string; floor: string; symbol: string; color: string; banner: string | null; nfts: NFTItem[]; }
const COLLECTIONS: Collection[] = [
  {
    name: 'Lil-Burn', chain: 'Avalanche', floor: '0.12', symbol: 'AVAX', color: '#E84142', banner: null,
    nfts: [
      { id: '#977', image: null, traits: [{ key: 'Background', value: 'Void', rarity: '2%' }, { key: 'Body', value: 'Ember', rarity: '8%' }, { key: 'Eyes', value: 'Laser', rarity: '3%' }, { key: 'Mouth', value: 'Fangs', rarity: '5%' }] },
      { id: '#858', image: null, traits: [{ key: 'Background', value: 'Abyss', rarity: '4%' }, { key: 'Body', value: 'Ice', rarity: '12%' }, { key: 'Eyes', value: 'Diamond', rarity: '1%' }, { key: 'Mouth', value: 'Grin', rarity: '9%' }] },
      { id: '#223', image: null, traits: [{ key: 'Background', value: 'Crimson', rarity: '6%' }, { key: 'Body', value: 'Flame', rarity: '7%' }, { key: 'Eyes', value: 'Calm', rarity: '15%' }, { key: 'Mouth', value: 'Neutral', rarity: '20%' }] },
    ],
  },
  { name: 'MyBarter v1.2', chain: 'Avalanche', floor: '—', symbol: 'AVAX', color: '#E84142', banner: null, nfts: [{ id: '#001', image: null, traits: [{ key: 'Type', value: 'Genesis', rarity: '1%' }, { key: 'Role', value: 'Arbiter', rarity: '5%' }] }] },
  { name: 'Unnamed Drop', chain: 'Polygon', floor: '—', symbol: '—', color: '#8247E5', banner: null, nfts: [] },
];

/* ─── Trade types ─────────────────────────────────────────────────────────── */
interface TradeAsset { type: 'nft' | 'token'; collection?: string; id?: string; symbol?: string; amount?: string; usd?: string; color: string; }
interface Sweetener  { symbol: 'USDC' | 'USDT'; amount: string; }
interface PendingTrade { id: string; from: string; fromUser: string; avatar: string; timestamp: string; youGive: TradeAsset[]; youReceive: TradeAsset[]; sweetenerGive?: Sweetener; sweetenerReceive?: Sweetener; }

const PENDING_TRADES: PendingTrade[] = [
  { id: 'trade-001', from: '0xA1b2...F331', fromUser: 'OrcaSwap', avatar: 'OR', timestamp: '2h ago',
    youGive:    [{ type: 'nft', collection: 'Lil-Burn', id: '#977', color: '#E84142' }],
    youReceive: [{ type: 'nft', collection: 'MyBarter v1.2', id: '#001', color: '#E84142' }],
    sweetenerReceive: { symbol: 'USDC', amount: '50.00' } },
  { id: 'trade-002', from: '0x9C3d...B8E2', fromUser: 'WhaleFin', avatar: 'WF', timestamp: '5h ago',
    youGive:    [{ type: 'token', symbol: 'POL',  amount: '150.00', usd: '$73.50', color: '#8247E5' }],
    youReceive: [{ type: 'token', symbol: 'USDC', amount: '80.00',  usd: '$80.00', color: '#2775CA' }] },
  { id: 'trade-003', from: '0xD7f4...2A11', fromUser: 'IcePick', avatar: 'IP', timestamp: '1d ago',
    youGive:    [{ type: 'nft', collection: 'Lil-Burn', id: '#858', color: '#E84142' }, { type: 'nft', collection: 'Lil-Burn', id: '#223', color: '#E84142' }],
    youReceive: [{ type: 'token', symbol: 'AVAX', amount: '15.00', usd: '$130.50', color: '#E84142' }],
    sweetenerGive: { symbol: 'USDT', amount: '25.00' } },
];

/* ─── Global marketplace data ─────────────────────────────────────────────── */
interface GlobalListing { id: string; user: string; avatar: string; chain: string; timestamp: string; offering: TradeAsset[]; seeking: string; }
const GLOBAL_LISTINGS: GlobalListing[] = [
  { id: 'gl-001', user: 'OrcaSwap',   avatar: 'OR', chain: 'Avalanche', timestamp: '4m ago',  offering: [{ type: 'nft',   collection: 'Lil-Burn',    id: '#412', color: '#E84142' }], seeking: '15 AVAX' },
  { id: 'gl-002', user: '0xPharaoh',  avatar: 'PH', chain: 'Ethereum',  timestamp: '12m ago', offering: [{ type: 'token', symbol: 'ETH', amount: '0.5', usd: '$1,263', color: '#627EEA' }], seeking: '$1,200 USDC' },
  { id: 'gl-003', user: 'WhaleFin',   avatar: 'WF', chain: 'Avalanche', timestamp: '31m ago', offering: [{ type: 'token', symbol: 'AVAX', amount: '100', usd: '$873', color: '#E84142' }], seeking: '30,000 GUN' },
  { id: 'gl-004', user: 'NadeTrader', avatar: 'NA', chain: 'BNB',       timestamp: '1h ago',  offering: [{ type: 'token', symbol: 'BNB', amount: '2.0', usd: '$968', color: '#F0B90B' }], seeking: '$900 USDT' },
  { id: 'gl-005', user: 'IcePick',    avatar: 'IP', chain: 'Polygon',   timestamp: '2h ago',  offering: [{ type: 'nft', collection: 'Unnamed Drop', id: '#78', color: '#8247E5' }], seeking: '200 POL' },
  { id: 'gl-006', user: 'BlazeMint',  avatar: 'BL', chain: 'Avalanche', timestamp: '3h ago',  offering: [{ type: 'token', symbol: 'BLAZE', amount: '5,000', usd: '$15', color: '#FF4500' }], seeking: '8,000 COQ' },
];

interface GlobalTrade { id: string; maker: string; taker: string; status: 'LOCKED' | 'PROPOSED'; timestamp: string; chain: string; color: string; }
const GLOBAL_TRADES: GlobalTrade[] = [
  { id: 'gt-001', maker: 'OrcaSwap',  taker: 'WhaleFin',   status: 'LOCKED',    timestamp: '5m ago',  chain: 'Avalanche', color: '#E84142' },
  { id: 'gt-002', maker: 'piweb',     taker: 'NadeTrader', status: 'PROPOSED',  timestamp: '1h ago',  chain: 'BNB',       color: '#F0B90B' },
  { id: 'gt-003', maker: 'IcePick',   taker: '0xPharaoh',  status: 'LOCKED',    timestamp: '2h ago',  chain: 'Polygon',   color: '#8247E5' },
  { id: 'gt-004', maker: 'BlazeMint', taker: 'CryptoKen',  status: 'PROPOSED',  timestamp: '4h ago',  chain: 'Avalanche', color: '#E84142' },
  { id: 'gt-005', maker: 'ZeroFee',   taker: 'AlphaNode',  status: 'LOCKED',    timestamp: '6h ago',  chain: 'Ethereum',  color: '#627EEA' },
];

const CHAIN_FILTERS = [
  { label: 'Avalanche', color: '#E84142' },
  { label: 'Ethereum',  color: '#627EEA' },
  { label: 'BNB',       color: '#F0B90B' },
  { label: 'Polygon',   color: '#8247E5' },
];

/* ─── Trade Asset Card (courtroom) ───────────────────────────────────────── */
function TradeAssetCard({ asset }: { asset: TradeAsset }) {
  if (asset.type === 'nft') {
    return (
      <div className="rounded-xl p-3 flex flex-col gap-2"
        style={{ background: `${asset.color}10`, border: `1px solid ${asset.color}40` }}>
        <div className="w-full aspect-square rounded-lg flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${asset.color}22 0%, rgba(255,255,255,0.02) 100%)` }}>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase"
            style={{ color: `${asset.color}60`, fontFamily: INTER }}>{asset.collection?.split('-')[0]}</span>
        </div>
        <div>
          <p className="text-[12px] font-black text-white" style={{ fontFamily: INTER }}>{asset.collection}</p>
          <p className="text-[11px] font-black" style={{ color: asset.color }}>{asset.id}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3"
      style={{ background: `${asset.color}10`, border: `1px solid ${asset.color}40` }}>
      <div className="shrink-0"><TokenIcon symbol={asset.symbol ?? ''} size={24} /></div>
      <div className="flex-1">
        <p className="text-[13px] font-black text-white" style={{ fontFamily: INTER }}>{asset.symbol}</p>
        <p className="text-[11px] text-white/50">{asset.amount}</p>
      </div>
      <p className="text-[12px] font-black text-white" style={{ fontFamily: INTER }}>{asset.usd}</p>
    </div>
  );
}

function SweetenerCard({ sw }: { sw: Sweetener }) {
  return (
    <div className="mt-2 rounded-lg px-3 py-2 flex items-center gap-2"
      style={{ background: '#2775CA0D', border: '1px dashed #2775CA44' }}>
      <TokenIcon symbol={sw.symbol} size={16} />
      <div className="flex-1">
        <p className="text-[9px] font-black tracking-[0.18em] uppercase text-white/50">Deal Sweetener</p>
        <p className="text-[12px] font-black text-white" style={{ fontFamily: INTER }}>${sw.amount} {sw.symbol}</p>
      </div>
      <p className="text-[9px] font-black tracking-[0.12em] uppercase text-white/30">Stables only · max $100</p>
    </div>
  );
}

/* ─── App view ────────────────────────────────────────────────────────────── */
type AppView = 'home' | 'inventory' | 'profile' | 'reviewTrade' | 'upForTrade' | 'allTrades';

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
  const [showDropdown, setShowDropdown]             = useState(false);
  const [username, setUsername]                     = useState('piweb');
  const [xHandle, setXHandle]                       = useState('@piweb_avax');
  const [email, setEmail]                           = useState('');
  const [nftVisible, setNftVisible]                 = useState(true);
  const [userTradesOpen, setUserTradesOpen]         = useState(true);
  const dropdownRef                                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function connect() { setIsConnected(true); setView('inventory'); }
  function goHome()  { setView('home'); }

  const assetSymbols      = new Set(ASSETS.map(a => a.symbol));
  const hasAssetSelection = Array.from(selected).some(k => assetSymbols.has(k));
  const hasNFTSelection   = Array.from(selected).some(k => !assetSymbols.has(k));

  function toggleKey(key: string) {
    setSelected(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }

  const drillCollection  = selectedCollection ? COLLECTIONS.find(c => c.name === selectedCollection) ?? null : null;
  const chainsWithAssets = new Set(ASSETS.map(a => a.chain));
  const chainsWithData   = new Set(COLLECTIONS.map(c => c.chain));
  const reviewTrade      = reviewTradeId ? PENDING_TRADES.find(t => t.id === reviewTradeId) ?? null : null;
  const visibleAssets    = ASSETS.filter(a => (!assetChainFilter || a.chain === assetChainFilter) && (a.symbol.toLowerCase().includes(assetSearch.toLowerCase()) || a.chain.toLowerCase().includes(assetSearch.toLowerCase())));
  const visibleCols      = COLLECTIONS.filter(c => (!activeChain || c.chain === activeChain) && c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  /* ── Nav link */
  function NavLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button onClick={onClick}
        className="text-[11px] font-black tracking-[0.14em] uppercase transition-all hover:opacity-90"
        style={{ fontFamily: INTER, ...(active ? gradientText : { color: 'rgba(255,255,255,0.80)' }) }}>
        {label}
      </button>
    );
  }

  /* ── Back chevron */
  function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
    return (
      <button onClick={onClick}
        className="flex items-center gap-1.5 mb-6 text-xs font-black tracking-wider transition-opacity hover:opacity-70">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 2L3.5 6L7.5 10" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={gradientText}>{label}</span>
      </button>
    );
  }

  /* ── Filter row */
  function FilterRow({ cf, setCf, cwd, search, setSearch, ph }: {
    cf: string | null; setCf: (v: string | null) => void;
    cwd: Set<string>; search: string; setSearch: (v: string) => void; ph: string;
  }) {
    return (
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <button onClick={() => setCf(null)}
          className="px-3 py-1 rounded-lg text-xs font-black tracking-wider transition-all"
          style={{ background: !cf ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)', border: !cf ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.08)', color: !cf ? '#fff' : 'rgba(255,255,255,0.45)' }}>
          All
        </button>
        {CHAIN_FILTERS.map(f => {
          const has = cwd.has(f.label);
          return (
            <button key={f.label} disabled={!has}
              onClick={() => has && setCf(cf === f.label ? null : f.label)}
              className="px-3 py-1 rounded-lg text-xs font-black tracking-wider transition-all disabled:cursor-not-allowed"
              style={filterBtnStyle(f, has, cf)}>
              {f.label}
            </button>
          );
        })}
        <input type="text" placeholder={ph} value={search} onChange={e => setSearch(e.target.value)}
          className="w-36 rounded-xl px-3 py-1.5 text-xs text-white/80 placeholder-white/25 outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: INTER }}
          onFocus={e => (e.target.style.borderColor = 'rgba(34,211,238,0.5)')}
          onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
      </div>
    );
  }

  const displayName = isConnected ? (username || '0x...f331') : null;

  return (
    <main className="min-h-screen bg-black text-[#ededed]"
      style={{ fontFamily: INTER, WebkitFontSmoothing: 'antialiased' } as React.CSSProperties}>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto border-b border-white/[0.06]">
        {/* Logo — hard <a> link */}
        <a href="/" onClick={e => { e.preventDefault(); goHome(); }}
          className="flex items-center gap-2.5 cursor-pointer" style={{ textDecoration: 'none' }}>
          <Image src="/mybarter-logo.png" alt="MyBarter" width={28} height={28}
            style={{ objectFit: 'contain', flexShrink: 0 }} />
          <span className="text-base font-black tracking-tighter" style={{ fontFamily: INTER, ...gradientText }}>MyBarter</span>
        </a>

        {/* Center nav */}
        <div className="flex items-center gap-7">
          <NavLink label="Up for Trade"   active={view === 'upForTrade'}  onClick={() => setView('upForTrade')} />
          <NavLink label="Pending Trades" active={view === 'allTrades'}   onClick={() => setView('allTrades')} />
          {isConnected && <NavLink label="My Inventory" active={view === 'inventory'} onClick={() => setView('inventory')} />}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isConnected && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-3 transition-opacity hover:opacity-80"
                onClick={() => setShowDropdown(v => !v)}>
                <IconBell hasNew={PENDING_TRADES.length > 0} />
                <span className="text-[11px] font-black tracking-[0.14em] uppercase"
                  style={{ fontFamily: INTER, color: 'rgba(255,255,255,0.75)' }}>
                  {displayName}
                </span>
              </button>

              {/* ── Profile Dropdown ── */}
              {showDropdown && (
                <div className="absolute right-0 top-10 w-72 z-50 rounded-2xl p-5 flex flex-col gap-4"
                  style={{ ...GLASS, border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40">My Profile</p>

                  {/* Avatar placeholder */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black"
                      style={{ background: 'linear-gradient(135deg, #22d3ee33, #a78bfa33)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
                      {username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{username}</p>
                      <p className="text-[11px] text-white/35">Avalanche · Lil-Burn holder</p>
                    </div>
                  </div>

                  {[
                    { label: 'Username',   value: username,  set: setUsername  },
                    { label: 'X Handle',   value: xHandle,   set: setXHandle   },
                    { label: 'Email',      value: email,     set: setEmail, placeholder: 'your@email.com' },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/35 mb-1">{f.label}</p>
                      <input
                        value={f.value}
                        onChange={e => f.set(e.target.value)}
                        placeholder={(f as { placeholder?: string }).placeholder ?? f.label}
                        className="w-full rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/20 outline-none"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: INTER }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(34,211,238,0.45)')}
                        onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
                    </div>
                  ))}

                  {/* NFT Visibility toggle */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-white/75">NFT Inventory Visibility</p>
                    <button onClick={() => setNftVisible(v => !v)}
                      className="w-10 h-5 rounded-full relative transition-all shrink-0"
                      style={{ background: nftVisible ? '#22d3ee' : 'rgba(255,255,255,0.12)' }}>
                      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                        style={{ left: nftVisible ? '22px' : '2px' }} />
                    </button>
                  </div>

                  <button onClick={() => { setIsConnected(false); setView('home'); setShowDropdown(false); }}
                    className="text-[10px] font-black tracking-[0.15em] uppercase text-white/30 hover:text-white/60 transition-colors text-left">
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
          <button onClick={() => isConnected ? setIsConnected(false) : connect()} className={BTN}>
            {isConnected ? displayName : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════
          VIEW: REVIEW TRADE — The Courtroom
      ════════════════════════════════════════════════════════════════ */}
      {view === 'reviewTrade' && reviewTrade ? (
        <div className="max-w-6xl mx-auto px-8 pt-10 pb-24">
          <BackBtn label="My Pending Trades" onClick={() => { setView('profile'); setReviewTradeId(null); }} />

          <div className="mb-8">
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Incoming Offer From</p>
            <h2 className="text-3xl font-black tracking-tighter text-white"
              style={{ fontFamily: INTER, fontWeight: 900 }}>{reviewTrade.fromUser}</h2>
            <p className="text-sm font-black text-white/50 mt-0.5">{reviewTrade.from} · {reviewTrade.timestamp}</p>
          </div>

          {/* 3-column courtroom */}
          <div className="grid gap-8 mb-10" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

            {/* Left: What You Give */}
            <div>
              <p className="text-sm font-black tracking-[0.12em] uppercase mb-4 text-white">What You Give</p>
              <div className="flex flex-col gap-3">
                {reviewTrade.youGive.map((asset, i) => <TradeAssetCard key={i} asset={asset} />)}
              </div>
              {reviewTrade.sweetenerGive && <SweetenerCard sw={reviewTrade.sweetenerGive} />}
            </div>

            {/* Center: arrows only (no logo) */}
            <div className="flex flex-col items-center justify-center gap-3 px-8">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <svg width="48" height="10" viewBox="0 0 48 10" fill="none">
                    <path d="M0 5h44M40 1l4 4-4 4" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: '#22d3ee' }}>Send</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: '#a78bfa' }}>Receive</span>
                  <svg width="48" height="10" viewBox="0 0 48 10" fill="none">
                    <path d="M48 5H4M8 1L4 5l4 4" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <p className="text-[9px] font-black tracking-[0.18em] uppercase text-white/20 text-center mt-1">
                Atomic · Escrow
              </p>
            </div>

            {/* Right: What You Receive */}
            <div>
              <p className="text-sm font-black tracking-[0.12em] uppercase mb-4 text-white">What You Receive</p>
              <div className="flex flex-col gap-3">
                {reviewTrade.youReceive.map((asset, i) => <TradeAssetCard key={i} asset={asset} />)}
              </div>
              {reviewTrade.sweetenerReceive && <SweetenerCard sw={reviewTrade.sweetenerReceive} />}
            </div>
          </div>

          <div className="border-t border-white/[0.08] mb-8" />
          <div className="flex items-center justify-center gap-4">
            <button className={BTN} onClick={() => { setView('profile'); setReviewTradeId(null); }}>Accept</button>
            <button className={BTN_DANGER} onClick={() => { setView('profile'); setReviewTradeId(null); }}>Reject</button>
            <button className={BTN_OUTLINE} onClick={() => { setView('profile'); setReviewTradeId(null); }}>Counter-Offer</button>
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: PROFILE / INBOX
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'profile' && isConnected ? (
        <div className="max-w-4xl mx-auto px-8 pt-10 pb-24">
          <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
            style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>My Pending Trades</h2>
          <p className="text-sm font-black text-white/50 mb-8">
            {PENDING_TRADES.length} incoming offer{PENDING_TRADES.length !== 1 ? 's' : ''} — review before the 72h window closes
          </p>
          <div className="flex flex-col gap-3">
            {PENDING_TRADES.map(trade => (
              <div key={trade.id} className="rounded-2xl px-6 py-5 flex items-center gap-5" style={GLASS}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 text-white"
                  style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.16)' }}>
                  {trade.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{trade.fromUser}</p>
                  <p className="text-xs font-black text-white/50 mt-0.5">
                    {trade.from} · Gives {trade.youGive.length} · Wants {trade.youReceive.length}
                  </p>
                </div>
                <p className="text-xs font-black text-white/40 shrink-0">{trade.timestamp}</p>
                <button onClick={() => { setReviewTradeId(trade.id); setView('reviewTrade'); }}
                  className="shrink-0 px-5 py-2 rounded-xl text-[11px] font-black tracking-[0.14em] uppercase transition-all"
                  style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.28)', color: '#22d3ee' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(34,211,238,0.16)')}
                  onMouseOut={e  => (e.currentTarget.style.background = 'rgba(34,211,238,0.08)')}>
                  Review Trade
                </button>
              </div>
            ))}
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: UP FOR TRADE (global marketplace)
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'upForTrade' ? (
        <div className="max-w-6xl mx-auto px-8 pt-10 pb-24">
          <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
            style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>Up for Trade</h2>
          <p className="text-sm font-black text-white/50 mb-8">
            {GLOBAL_LISTINGS.length} active listings across all chains
          </p>
          <div className="flex flex-col gap-3">
            {GLOBAL_LISTINGS.map(listing => {
              const offer = listing.offering[0];
              return (
                <div key={listing.id} className="rounded-2xl px-6 py-5 flex items-center gap-5" style={GLASS}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 text-white"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    {listing.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{listing.user}</p>
                    <p className="text-xs font-black text-white/45 mt-0.5">
                      {offer.type === 'nft'
                        ? `${offer.collection} ${offer.id}`
                        : `${offer.amount} ${offer.symbol} · ${offer.usd}`}
                      {' '}→ wants{' '}{listing.seeking}
                    </p>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: `${CHAIN_FILTERS.find(c => c.label === listing.chain)?.color ?? '#888'}15`, color: CHAIN_FILTERS.find(c => c.label === listing.chain)?.color ?? '#888', border: `1px solid ${CHAIN_FILTERS.find(c => c.label === listing.chain)?.color ?? '#888'}33` }}>
                    {listing.chain}
                  </span>
                  <p className="text-xs font-black text-white/35 shrink-0">{listing.timestamp}</p>
                  <button className={BTN} style={{ padding: '6px 18px', fontSize: '11px' }}>Propose</button>
                </div>
              );
            })}
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: ALL TRADES (global pending trades feed)
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'allTrades' ? (
        <div className="max-w-5xl mx-auto px-8 pt-10 pb-24">
          <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
            style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>Pending Trades</h2>
          <p className="text-sm font-black text-white/50 mb-8">All live trades across the platform</p>

          {/* My trades — pinned, collapsible */}
          {isConnected && (
            <div className="mb-6">
              <button onClick={() => setUserTradesOpen(v => !v)}
                className="flex items-center gap-2 mb-3 text-xs font-black tracking-[0.14em] uppercase transition-opacity hover:opacity-75">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ transform: userTradesOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M4 2l4 4-4 4" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={gradientText}>My Trades ({PENDING_TRADES.length})</span>
              </button>
              {userTradesOpen && (
                <div className="flex flex-col gap-2 pl-4 border-l-2 border-[#22d3ee30] mb-4">
                  {PENDING_TRADES.map(t => (
                    <div key={t.id} className="rounded-xl px-5 py-3.5 flex items-center gap-4" style={GLASS}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                        style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)' }}>
                        {t.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>
                          {username} ↔ {t.fromUser}
                        </p>
                        <p className="text-xs font-black text-white/45 mt-0.5">{t.timestamp}</p>
                      </div>
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee' }}>
                        INCOMING
                      </span>
                      <button onClick={() => { setReviewTradeId(t.id); setView('reviewTrade'); }}
                        className="text-[10px] font-black tracking-[0.12em] uppercase px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.22)', color: '#22d3ee' }}>
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Global trades */}
          <div className="flex flex-col gap-2">
            {GLOBAL_TRADES.map(t => (
              <div key={t.id} className="rounded-xl px-5 py-3.5 flex items-center gap-4" style={GLASS}>
                <div className="flex-1">
                  <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{t.maker} ↔ {t.taker}</p>
                  <p className="text-xs font-black text-white/40 mt-0.5">{t.chain} · {t.timestamp}</p>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                  style={{ background: t.status === 'LOCKED' ? `${t.color}15` : 'rgba(255,255,255,0.05)', border: `1px solid ${t.status === 'LOCKED' ? `${t.color}40` : 'rgba(255,255,255,0.12)'}`, color: t.status === 'LOCKED' ? t.color : 'rgba(255,255,255,0.45)' }}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: HOMEPAGE
      ════════════════════════════════════════════════════════════════ */
      ) : !isConnected || view === 'home' ? (
        <>
          <section className="max-w-5xl mx-auto text-center px-6 pt-20 pb-10">
            {/* Tagline: text-4xl gradient */}
            <p className="font-black uppercase mb-5"
              style={{ fontFamily: INTER, fontSize: 'clamp(1.8rem, 4vw, 2.25rem)', letterSpacing: '-0.02em', fontWeight: 900, ...gradientText }}>
              Browse · Offer · Swap
            </p>
            {/* Hero: text-6xl — LARGEST text on the page */}
            <h1 className="font-black text-white mb-6"
              style={{ fontFamily: INTER, fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', letterSpacing: '-0.04em', lineHeight: 0.95, fontWeight: 900 }}>
              The Slippage-Free<br />Settlement Layer
            </h1>
            <p className="mb-12 max-w-xl mx-auto"
              style={{ fontFamily: INTER, fontSize: '18px', lineHeight: 1.6, fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>
              Move high-value NFTs and tokens off-market through the{' '}
              <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Robot Lawyer Escrow</span>
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
                    <span className="text-[11px] font-black tracking-[0.3em] text-white/20">{p.number}</span>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/50">{p.label}</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter text-white leading-snug"
                    style={{ fontFamily: INTER, letterSpacing: '-0.02em', fontWeight: 900 }}>{p.headline}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.body}</p>
                  <div className="mt-auto pt-4 border-t text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ borderColor: `${p.color}22`, color: p.color }}>{p.label}</div>
                </div>
              ))}
            </div>
          </section>
        </>

      /* ════════════════════════════════════════════════════════════════
         VIEW: INVENTORY
      ════════════════════════════════════════════════════════════════ */
      ) : (
        <div className="max-w-7xl mx-auto px-8 pt-12 pb-24 space-y-14">

          {/* ── Token grid (4-col) ── */}
          <div>
            <div className="flex justify-between items-end mb-5">
              <div>
                <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
                  style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>Your Assets</h2>
                <p className="text-sm font-black text-white/50">Testnet balances — Fuji · Sepolia · Amoy</p>
              </div>
              <button className={hasAssetSelection ? BTN : BTN_INACTIVE} disabled={!hasAssetSelection}>Initiate Trade</button>
            </div>

            <FilterRow cf={assetChainFilter} setCf={setAssetChainFilter} cwd={chainsWithAssets}
              search={assetSearch} setSearch={setAssetSearch} ph="Search assets..." />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {visibleAssets.map(a => {
                const isSel = selected.has(a.symbol);
                return (
                  <div key={a.symbol} onClick={() => toggleKey(a.symbol)}
                    className="rounded-xl px-3 py-3 flex items-center gap-3 cursor-pointer transition-all"
                    style={{ background: isSel ? `${a.color}15` : 'rgba(255,255,255,0.05)', border: `1px solid ${isSel ? `${a.color}60` : 'rgba(255,255,255,0.12)'}` }}>
                    <div className="shrink-0"><TokenIcon symbol={a.symbol} size={22} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black text-white leading-none mb-0.5" style={{ fontFamily: INTER }}>{a.symbol}</p>
                      <p className="text-[10px] text-white/40 leading-none">{a.chain.slice(0, 4)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[12px] font-black text-white leading-none mb-0.5" style={{ fontFamily: INTER }}>{a.usd}</p>
                      <p className="text-[10px] text-white/40 leading-none">{a.balance}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── NFT Collections ── */}
          {nftVisible && (
            <div>
              <div className="flex justify-between items-end mb-5">
                <div>
                  {drillCollection ? (
                    <>
                      <BackBtn label="All Collections" onClick={() => setSelectedCollection(null)} />
                      <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-black tracking-tighter text-white"
                          style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>{drillCollection.name}</h2>
                        <IconShield />
                      </div>
                      <p className="text-sm font-black text-white/50 mt-0.5">{drillCollection.nfts.length} item{drillCollection.nfts.length !== 1 ? 's' : ''}</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
                        style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>Your Collections</h2>
                      <p className="text-sm font-black text-white/50">NFT assets eligible for barter</p>
                    </>
                  )}
                </div>
                <button className={hasNFTSelection ? BTN : BTN_INACTIVE} disabled={!hasNFTSelection}>Initiate Trade</button>
              </div>

              {drillCollection ? (
                /* 5-col NFT grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {drillCollection.nfts.map(nft => {
                    const key  = `${drillCollection.name}:${nft.id}`;
                    const isSel = selected.has(key);
                    return (
                      <div key={key} onClick={() => toggleKey(key)}
                        className="rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all"
                        style={{ ...GLASS, border: `${isSel ? 2 : 1}px solid ${isSel ? drillCollection.color : `${drillCollection.color}44`}`, boxShadow: isSel ? `0 0 18px ${drillCollection.color}44` : `0 0 12px ${drillCollection.color}12` }}>
                        <div className="w-full aspect-square rounded-lg flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${drillCollection.color}20 0%, rgba(255,255,255,0.02) 100%)`, border: `1px solid ${drillCollection.color}22` }}>
                          {nft.image
                            ? <img src={nft.image} alt={nft.id} className="w-full h-full object-cover rounded-lg" />
                            : <span className="text-[9px] font-black tracking-[0.2em] uppercase"
                                style={{ color: `${drillCollection.color}50`, fontFamily: INTER }}>
                                {drillCollection.name.split('-')[0]}
                              </span>
                          }
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-[11px] font-black text-white" style={{ fontFamily: INTER }}>{nft.id}</p>
                          {isSel && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                            style={{ background: `${drillCollection.color}22`, color: drillCollection.color }}>✓</span>}
                        </div>
                        {nft.traits && nft.traits.length > 0 && (
                          <div className="grid grid-cols-2 gap-1">
                            {nft.traits.slice(0, 2).map(t => (
                              <div key={t.key} className="rounded px-1.5 py-1 text-center"
                                style={{ background: `${drillCollection.color}0D`, border: `1px solid ${drillCollection.color}22` }}>
                                <p className="text-[8px] font-black uppercase tracking-[0.1em] text-white/35">{t.key}</p>
                                <p className="text-[10px] font-black text-white" style={{ fontFamily: INTER }}>{t.value}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {drillCollection.nfts.length === 0 && (
                    <p className="col-span-5 text-center text-white/30 text-sm py-16">No NFTs in this collection yet.</p>
                  )}
                </div>
              ) : (
                <>
                  <FilterRow cf={activeChain} setCf={setActiveChain} cwd={chainsWithData}
                    search={searchQuery} setSearch={setSearchQuery} ph="Search collections..." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleCols.map(c => (
                      <div key={c.name} onClick={() => setSelectedCollection(c.name)}
                        className="rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all hover:scale-[1.01]"
                        style={{ ...GLASS, border: `1px solid ${c.color}55`, boxShadow: `0 0 28px ${c.color}1E` }}>
                        <div className="w-full h-28 rounded-xl overflow-hidden flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${c.color}22 0%, rgba(255,255,255,0.03) 100%)`, border: `1px solid ${c.color}2A` }}>
                          {c.banner
                            ? <img src={c.banner} alt={c.name} className="w-full h-full object-cover" />
                            : <span className="text-[11px] font-black tracking-[0.3em] uppercase select-none"
                                style={{ color: `${c.color}60` }}>{c.name}</span>
                          }
                        </div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{c.name}</p>
                          <IconShield />
                        </div>
                      </div>
                    ))}
                    {visibleCols.length === 0 && (
                      <p className="col-span-3 text-center text-white/30 text-sm py-10">No collections match your filter.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25">Live Across Major Chains</p>
          <div className="flex justify-center items-center gap-8 text-[11px] font-black tracking-[0.2em]">
            <span className="flex items-center gap-1.5" style={{ color: '#E84142' }}><IconAVAX />AVALANCHE (HUB)</span>
            <span className="text-white/15">·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#627EEA' }}><IconETH />ETHEREUM</span>
            <span className="text-white/15">·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#8247E5' }}><IconPOL />POLYGON</span>
            <span className="text-white/15">·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#F0B90B' }}><IconBNB />BNB CHAIN</span>
          </div>
        </div>
        <div className="border-t border-white/[0.06] pt-6 flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 font-medium">
            Secured by{' '}<span className="font-black" style={gradientText}>Chainlink</span>{' '}&amp;{' '}<span className="font-black" style={gradientText}>Pyth</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 font-medium">Non-Custodial</p>
        </div>
      </footer>
    </main>
  );
}
