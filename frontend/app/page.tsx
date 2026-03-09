'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

/* ─── Style tokens ────────────────────────────────────────────────────────── */
const INTER = "'Inter', 'system-ui', ui-sans-serif, sans-serif";

const BTN =
  'bg-[#22d3ee] hover:bg-[#38e6f7] text-black font-black text-sm ' +
  'px-7 py-2.5 rounded-xl transition-all ' +
  'shadow-[0_0_15px_rgba(34,211,238,0.35)] hover:shadow-[0_0_22px_rgba(34,211,238,0.55)]';

const BTN_LG =
  'bg-[#22d3ee] hover:bg-[#38e6f7] text-black font-black text-base ' +
  'px-12 py-4 rounded-2xl transition-all ' +
  'shadow-[0_0_15px_rgba(34,211,238,0.35)] hover:shadow-[0_0_28px_rgba(34,211,238,0.55)]';

const BTN_INACTIVE =
  'bg-white/5 border border-white/10 text-white/30 font-black text-sm ' +
  'px-7 py-2.5 rounded-xl transition-all cursor-not-allowed';

const BTN_DANGER =
  'bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 font-black text-sm ' +
  'px-8 py-3 rounded-xl transition-all';

const BTN_OUTLINE =
  'bg-transparent hover:bg-white/5 border border-white/25 hover:border-white/40 ' +
  'text-white/80 hover:text-white font-black text-sm px-8 py-3 rounded-xl transition-all';

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

/* ─── Filter button style ─────────────────────────────────────────────────── */
function filterBtnStyle(
  f: { label: string; color: string },
  hasData: boolean,
  currentFilter: string | null,
): React.CSSProperties {
  if (!hasData) return { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' };
  const isActive  = currentFilter === f.label;
  const someActive = currentFilter !== null;
  if (isActive)   return { background: `${f.color}18`, border: `1px solid ${f.color}66`, color: f.color, boxShadow: `0 0 12px ${f.color}33` };
  if (someActive) return { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.50)' };
  return { background: `${f.color}0D`, border: `1px solid ${f.color}33`, color: f.color };
}

/* ─── Chain icons ─────────────────────────────────────────────────────────── */
const IconAVAX = ({ s = 16 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M13.6 4.6a1.8 1.8 0 0 0-3.2 0L2.4 18.2A1.8 1.8 0 0 0 4 20.8h4.4l2.2-4.4a1.6 1.6 0 0 1 2.8 0l2.2 4.4H20a1.8 1.8 0 0 0 1.6-2.6L13.6 4.6Z" fill="#E84142" /></svg>;
const IconETH  = ({ s = 16 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><polygon points="12,2 20,13 12,16.5 4,13" fill="#627EEA" opacity="0.9" /><polygon points="12,22 20,13 12,16.5" fill="#627EEA" opacity="0.6" /><polygon points="12,22 4,13 12,16.5" fill="#627EEA" opacity="0.4" /></svg>;
const IconPOL  = ({ s = 16 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M17 6.5L12 3.8 7 6.5v5.4l5 2.8 5-2.8V6.5ZM7 14.1L12 17l5-2.9v-1.4l-5 2.8-5-2.8v1.4ZM7 16.5L12 19.5 17 16.5v-1l-5 2.8-5-2.8v1Z" fill="#8247E5" /></svg>;
const IconBNB  = ({ s = 16 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2l2.8 2.8L17.6 2 20.4 4.8 17.6 7.6 20.4 10.4 17.6 13.2 14.8 10.4 12 13.2 9.2 10.4 6.4 13.2 3.6 10.4 6.4 7.6 3.6 4.8 6.4 2 9.2 4.8ZM12 15l2.8 2.8L12 20.6 9.2 17.8Z" fill="#F0B90B" /></svg>;

/* ─── Token logos (Trust Wallet Asset repo — canonical on-chain addresses) ── */
const TW = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains';
const TOKEN_LOGO: Record<string, string> = {
  // Native chain tokens
  AVAX:  `${TW}/avalanchec/info/logo.png`,
  ETH:   `${TW}/ethereum/info/logo.png`,
  POL:   `${TW}/polygon/info/logo.png`,
  BNB:   `${TW}/smartchain/info/logo.png`,
  // ERC-20 / ARC-20 tokens with verified contract addresses
  USDC:  `${TW}/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png`,
  JOE:   `${TW}/avalanchec/assets/0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd/logo.png`,
  COQ:   `${TW}/avalanchec/assets/0x420FcA0121DC28039145009570975747295f2329/logo.png`,
  ARENA: `${TW}/avalanchec/assets/0x00aAd71eAbF9CB75CE3EF3De2F5f86C3dB70e3B8/logo.png`,
  PHAR:  `${TW}/avalanchec/assets/0xAAAB9D12A30504559b0C5a9A5977fEE4A6081c6b/logo.png`,
};

/* ─── Token SVG fallbacks (for tokens without CDN logos) ─────────────────── */
const TOKEN_SVG: Record<string, (s: number) => React.ReactNode> = {
  AVAX:  (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M13.6 4.6a1.8 1.8 0 0 0-3.2 0L2.4 18.2A1.8 1.8 0 0 0 4 20.8h4.4l2.2-4.4a1.6 1.6 0 0 1 2.8 0l2.2 4.4H20a1.8 1.8 0 0 0 1.6-2.6L13.6 4.6Z" fill="#E84142" /></svg>,
  ETH:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><polygon points="12,2 20,13 12,16.5 4,13" fill="#627EEA" opacity="0.9" /><polygon points="12,22 20,13 12,16.5" fill="#627EEA" opacity="0.6" /><polygon points="12,22 4,13 12,16.5" fill="#627EEA" opacity="0.4" /></svg>,
  POL:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M17 6.5L12 3.8 7 6.5v5.4l5 2.8 5-2.8V6.5ZM7 14.1L12 17l5-2.9v-1.4l-5 2.8-5-2.8v1.4ZM7 16.5L12 19.5 17 16.5v-1l-5 2.8-5-2.8v1Z" fill="#8247E5" /></svg>,
  BNB:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2l2.8 2.8L17.6 2 20.4 4.8 17.6 7.6 20.4 10.4 17.6 13.2 14.8 10.4 12 13.2 9.2 10.4 6.4 13.2 3.6 10.4 6.4 7.6 3.6 4.8 6.4 2 9.2 4.8ZM12 15l2.8 2.8L12 20.6 9.2 17.8Z" fill="#F0B90B" /></svg>,
  COQ:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M8 9c0-2.5 1.5-4 2.5-4.5s2.5 0 2.5 2.5" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round"/><path d="M10.5 9c0-1.5 1-2.5 1.5-3s1.5.5 1.5 2" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round"/><ellipse cx="12" cy="15.5" rx="5.5" ry="5" fill="#FF6B35" opacity="0.9"/><path d="M6.5 15l-2 .5 2 .5z" fill="#F0B90B"/><circle cx="9.5" cy="13.5" r="1" fill="white" opacity="0.9"/><circle cx="9.8" cy="13.3" r="0.4" fill="#111"/></svg>,
  BLAZE: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3S7 7.5 7 12.5c0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.5-1.8-4-1.8-4s.3 2.5-1.2 3.5c-.8.5-1.5 0-2-1 0-2 2-4.5 2-4.5S15 8 15 10.5c0 1.7-1.3 3-3 3s-3-1.3-3-3c0-2 1.5-4 3-5z" fill="#FF4500" opacity="0.9"/><path d="M12 10s-.8 1.5-.8 2.5.4 1.5.8 1.5.8-.5.8-1.5-.8-2.5-.8-2.5z" fill="#FFD700" opacity="0.85"/></svg>,
  KET:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L21 7v10l-9 5-9-5V7z" fill="#9B59B6" opacity="0.85" stroke="#9B59B6" strokeWidth="0.5"/><path d="M9 8v8M9 12l5-4M9 12l5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ARENA: (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#27AE60" opacity="0.15" stroke="#27AE60" strokeWidth="1"/><path d="M5 5l14 14M19 5L5 19" stroke="#27AE60" strokeWidth="2" strokeLinecap="round"/><path d="M5 5l3.5 0 0 3.5M19 5l-3.5 0 0 3.5M5 19l3.5 0 0-3.5M19 19l-3.5 0 0-3.5" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  GUN:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" stroke="#E74C3C" strokeWidth="1.2"/><circle cx="12" cy="12" r="4" fill="#E74C3C" opacity="0.7"/><circle cx="12" cy="12" r="1.5" fill="#E74C3C"/><path d="M12 2.5V7M12 17v4.5M2.5 12H7M17 12h4.5" stroke="#E74C3C" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  PHAR:  (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M8 20h8v-6l-2-2h-4l-2 2v6z" fill="#F39C12" opacity="0.9"/><path d="M10 14V9c0-1.5.9-3 2-3s2 1.5 2 3v5" fill="#F39C12" opacity="0.75"/><path d="M10 7l-3-2M14 7l3-2M12 4V2" stroke="#F39C12" strokeWidth="1.5" strokeLinecap="round"/><rect x="7.5" y="18.5" width="9" height="2.5" rx="1" fill="#E67E22"/></svg>,
  USDC:  (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#2775CA" opacity="0.9"/><path d="M12 5.5v1.2M12 17.3v1.2M12 6.7c-2.5 0-4.5 1.5-4.5 3.3s2 3.3 4.5 3.3 4.5 1.5 4.5 3.3-2 3.3-4.5 3.3" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  JOE:   (s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M8 4v6c0 2.2 1.8 4 4 4s4-1.8 4-4V4" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 4l4 2.5L16 4" stroke="#FF6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 14v6" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round"/></svg>,
};
function TokenIcon({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const [imgErr, setImgErr] = useState(false);
  const url = TOKEN_LOGO[symbol];
  const svgFn = TOKEN_SVG[symbol];
  if (url && !imgErr) {
    return <img src={url} alt={symbol} width={size} height={size}
      style={{ borderRadius: '50%', objectFit: 'contain', display: 'block' }}
      onError={() => setImgErr(true)} />;
  }
  if (svgFn) return <>{svgFn(size)}</>;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.15)" /></svg>;
}

/* ─── NFT image slot — handles broken IPFS/CDN URLs gracefully ───────────── */
function NFTImageSlot({ image, name, color }: { image: string | null; name: string; color: string }) {
  const [err, setErr] = useState(false);
  if (image && !err) {
    return <img src={image} alt={name} className="w-full h-full object-cover rounded-lg" onError={() => setErr(true)} />;
  }
  return (
    <span className="text-[9px] font-black tracking-[0.2em] uppercase"
      style={{ color: `${color}60`, fontFamily: INTER }}>{name.split('-')[0]}</span>
  );
}

/* ─── Banner image slot — handles broken banner URLs gracefully ───────────── */
function BannerSlot({ banner, name, color }: { banner: string | null; name: string; color: string }) {
  const [err, setErr] = useState(false);
  if (banner && !err) {
    return <img src={banner} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />;
  }
  return (
    <span className="text-[11px] font-black tracking-[0.3em] uppercase select-none" style={{ color: `${color}70` }}>{name}</span>
  );
}

/* ─── Shield icon (always green) ─────────────────────────────────────────── */
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M7 1L2 3.2V7c0 2.9 2.2 5.5 5 5.9 2.8-.4 5-3 5-5.9V3.2L7 1z" fill="#22c55e20" stroke="#22c55e" strokeWidth="1.2" />
    <path d="M4.5 7L6.2 8.7L9.5 5.3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBell = ({ hasNew }: { hasNew: boolean }) => (
  <div className="relative" style={{ width: 18, height: 18 }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="rgba(255,255,255,0.70)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="rgba(255,255,255,0.70)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {hasNew && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.9)' }} />}
  </div>
);

/* ─── Stateless sub-components ────────────────────────────────────────────── */
function NavLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="text-[11px] font-black tracking-[0.14em] uppercase transition-all hover:opacity-90"
      style={{ fontFamily: INTER, ...(active ? gradientText : { color: 'rgba(255,255,255,0.85)' }) }}>
      {label}
    </button>
  );
}

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

/* ─── Wallet icon (used inside ConnectWalletBtn) ─────────────────────────── */
function WalletIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 18" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="4" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 8.5h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="13" y="10.5" width="4" height="3" rx="1.2" fill="currentColor" />
      <path d="M6 4V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Standardised Connect Wallet / CTA button ──────────────────────────── */
function ConnectWalletBtn({ onClick, label = 'Connect Wallet', large = false }: {
  onClick: () => void;
  label?: string;
  large?: boolean;
}) {
  return (
    <button onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl transition-all"
      style={{
        padding: large ? '14px 40px' : '9px 22px',
        background: 'rgba(34,211,238,0.08)',
        border: '1px solid rgba(34,211,238,0.40)',
        color: '#22d3ee',
        fontFamily: INTER,
        fontSize: large ? '15px' : '13px',
        fontWeight: 500,
        letterSpacing: '0.01em',
        boxShadow: '0 0 18px rgba(34,211,238,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = 'rgba(34,211,238,0.14)';
        e.currentTarget.style.boxShadow = '0 0 28px rgba(34,211,238,0.32), inset 0 1px 0 rgba(255,255,255,0.08)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = 'rgba(34,211,238,0.08)';
        e.currentTarget.style.boxShadow = '0 0 18px rgba(34,211,238,0.18), inset 0 1px 0 rgba(255,255,255,0.06)';
      }}>
      <WalletIcon size={large ? 17 : 15} />
      {label}
    </button>
  );
}

/* ─── Glass CTA button (no wallet icon — Initiate Trade / Accept / Make Offer) */
function GlassBtn({ onClick, label, large = false, full = false, disabled = false, extraStyle }: {
  onClick?: () => void;
  label: React.ReactNode;
  large?: boolean;
  full?: boolean;
  disabled?: boolean;
  extraStyle?: React.CSSProperties;
}) {
  const active = !disabled;
  return (
    <button
      onClick={active ? onClick : undefined}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-xl transition-all"
      style={{
        padding: large ? '14px 40px' : '9px 22px',
        width: full ? '100%' : undefined,
        ...extraStyle,
        background: active ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.04)',
        border: active ? '1px solid rgba(34,211,238,0.40)' : '1px solid rgba(255,255,255,0.10)',
        color: active ? '#22d3ee' : 'rgba(255,255,255,0.28)',
        fontFamily: INTER,
        fontSize: large ? '15px' : '13px',
        fontWeight: 500,
        letterSpacing: '0.01em',
        boxShadow: active ? '0 0 18px rgba(34,211,238,0.18), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseOver={active ? e => {
        e.currentTarget.style.background = 'rgba(34,211,238,0.14)';
        e.currentTarget.style.boxShadow = '0 0 28px rgba(34,211,238,0.32), inset 0 1px 0 rgba(255,255,255,0.08)';
      } : undefined}
      onMouseOut={active ? e => {
        e.currentTarget.style.background = 'rgba(34,211,238,0.08)';
        e.currentTarget.style.boxShadow = '0 0 18px rgba(34,211,238,0.18), inset 0 1px 0 rgba(255,255,255,0.06)';
      } : undefined}>
      {label}
    </button>
  );
}

const CHAIN_FILTERS = [
  { label: 'Avalanche', color: '#E84142' },
  { label: 'Ethereum',  color: '#627EEA' },
  { label: 'BNB',       color: '#F0B90B' },
  { label: 'Polygon',   color: '#8247E5' },
];

function FilterRow({ cf, setCf, cwd, search, setSearch, ph }: {
  cf: string | null; setCf: (v: string | null) => void;
  cwd: Set<string>; search: string; setSearch: (v: string) => void; ph: string;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap mb-4">
      <button onClick={() => setCf(null)} className="px-3 py-1 rounded-lg text-xs font-black tracking-wider transition-all"
        style={{ background: !cf ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)', border: !cf ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.10)', color: !cf ? '#fff' : 'rgba(255,255,255,0.60)' }}>
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
        className="w-36 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/40 outline-none transition-all"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: INTER }}
        onFocus={e => (e.target.style.borderColor = 'rgba(34,211,238,0.55)')}
        onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')} />
    </div>
  );
}

/* ─── Live presence dots ─────────────────────────────────────────────────── */
function GreyDot() {
  return (
    <span className="relative flex shrink-0" style={{ width: 8, height: 8 }}>
      <span className="relative inline-flex rounded-full" style={{ width: 8, height: 8, background: 'rgba(255,255,255,0.22)' }} />
    </span>
  );
}

function GreenDot() {
  return (
    <span className="relative flex shrink-0" style={{ width: 8, height: 8 }}>
      <span className="animate-ping absolute inline-flex w-full h-full rounded-full" style={{ background: '#22c55e', opacity: 0.6 }} />
      <span className="relative inline-flex rounded-full" style={{ width: 8, height: 8, background: '#22c55e' }} />
    </span>
  );
}

/* ─── Triple Threat ───────────────────────────────────────────────────────── */
const PILLARS = [
  { number: '1.', label: 'ECONOMIC SAFETY',    headline: "Stop 'Death Candles'",  body: 'Chainlink oracles lock the USD value at trade time. No slippage, no last-second manipulation. Your position settles at the price you agreed.', color: '#22d3ee', glow: 'rgba(34,211,238,0.12)' },
  { number: '2.', label: 'TRANSACTIONAL SAFETY', headline: 'No Standoffs',        body: 'Both-party signatures required. The Robot Lawyer Escrow holds assets atomically; neither side can exit without the other, eliminating rug risk.', color: '#a78bfa', glow: 'rgba(167,139,250,0.12)' },
  { number: '3.', label: 'CAPITAL EFFICIENCY', headline: 'Unlock Dead Capital',   body: 'Fasten illiquid NFTs rotation with our "Deal Sweetener" for immediate liquidity.', color: '#06b6d4', glow: 'rgba(6,182,212,0.12)' },
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
  { name: 'Lil-Burn', chain: 'Avalanche', floor: '0.12', symbol: 'AVAX', color: '#E84142', banner: null, nfts: [
    { id: '#977', image: null, traits: [{ key: 'Background', value: 'Void', rarity: '2%' }, { key: 'Body', value: 'Ember', rarity: '8%' }, { key: 'Eyes', value: 'Laser', rarity: '3%' }, { key: 'Mouth', value: 'Fangs', rarity: '5%' }] },
    { id: '#858', image: null, traits: [{ key: 'Background', value: 'Abyss', rarity: '4%' }, { key: 'Body', value: 'Ice', rarity: '12%' }, { key: 'Eyes', value: 'Diamond', rarity: '1%' }, { key: 'Mouth', value: 'Grin', rarity: '9%' }] },
    { id: '#223', image: null, traits: [{ key: 'Background', value: 'Crimson', rarity: '6%' }, { key: 'Body', value: 'Flame', rarity: '7%' }, { key: 'Eyes', value: 'Calm', rarity: '15%' }, { key: 'Mouth', value: 'Neutral', rarity: '20%' }] },
  ]},
  { name: 'MyBarter v1.2', chain: 'Avalanche', floor: '—', symbol: 'AVAX', color: '#E84142', banner: null, nfts: [{ id: '#001', image: null, traits: [{ key: 'Type', value: 'Genesis', rarity: '1%' }, { key: 'Role', value: 'Arbiter', rarity: '5%' }] }] },
  // Pudgy Penguins — Ethereum ERC-721 · 0xBd3531dA5CF5857e7CfAA92426877b022e612cf8
  // banner_image_url + image_url sourced from OpenSea API; images via IPFS gateway
  { name: 'Pudgy Penguins', chain: 'Ethereum', floor: '13.9', symbol: 'ETH', color: '#627EEA',
    banner: 'https://i.seadn.io/gcs/files/10ddf61e0aa03bb28c3c8e09e36a3e5a.png',
    nfts: [
      { id: '#1',    image: 'https://ipfs.io/ipfs/QmNf1UsmdGaMbpatQ6toXSkzDpizaGmC9zfunCyoz1enD5/penguin/1.png',    traits: [{ key: 'Background', value: 'Yellow',  rarity: '14%' }, { key: 'Body',  value: 'Tuxedo',  rarity: '4%'  }, { key: 'Face', value: 'Happy',  rarity: '22%' }, { key: 'Hat', value: 'Captain', rarity: '3%'  }] },
      { id: '#420',  image: 'https://ipfs.io/ipfs/QmNf1UsmdGaMbpatQ6toXSkzDpizaGmC9zfunCyoz1enD5/penguin/420.png',  traits: [{ key: 'Background', value: 'Green',   rarity: '18%' }, { key: 'Body',  value: 'Hoodie',  rarity: '8%'  }, { key: 'Face', value: 'Silly',  rarity: '17%' }, { key: 'Hat', value: 'Beanie',  rarity: '9%'  }] },
      { id: '#4565', image: 'https://ipfs.io/ipfs/QmNf1UsmdGaMbpatQ6toXSkzDpizaGmC9zfunCyoz1enD5/penguin/4565.png', traits: [{ key: 'Background', value: 'Blue',    rarity: '21%' }, { key: 'Body',  value: 'Suit',    rarity: '6%'  }, { key: 'Face', value: 'Cool',   rarity: '12%' }, { key: 'Hat', value: 'Crown',   rarity: '2%'  }] },
    ]},
];

/* ─── Trade types ─────────────────────────────────────────────────────────── */
interface TradeAsset { type: 'nft' | 'token'; collection?: string; id?: string; symbol?: string; amount?: string; usd?: string; color: string; }
interface Sweetener  { symbol: 'USDC' | 'USDT'; amount: string; }
interface PendingTrade { id: string; from: string; fromUser: string; avatar: string; timestamp: string; youGive: TradeAsset[]; youReceive: TradeAsset[]; sweetenerGive?: Sweetener; sweetenerReceive?: Sweetener; direction?: 'incoming' | 'outgoing'; status?: 'PROPOSED' | 'AWAITING' | 'REJECTED'; }
interface GlobalListing { id: string; user: string; avatar: string; chain: string; timestamp: string; offering: TradeAsset[]; seeking: string; online?: boolean; }
interface GlobalTrade   { id: string; maker: string; taker: string; status: 'COMPLETED' | 'PROPOSED'; timestamp: string; chain: string; color: string; offer?: TradeAsset[]; want?: TradeAsset[]; }
interface Alert { id: string; text: string; time: string; unread: boolean; }

const PENDING_TRADES: PendingTrade[] = [
  { id: 'trade-001', from: '0xA1b2...F331', fromUser: 'OrcaSwap', avatar: 'OR', timestamp: '2h ago',
    youGive:    [{ type: 'nft', collection: 'Lil-Burn', id: '#977', color: '#E84142' }],
    youReceive: [{ type: 'nft', collection: 'MyBarter v1.2', id: '#001', color: '#E84142' }],
    sweetenerReceive: { symbol: 'USDC', amount: '50.00' } },
  { id: 'trade-002', from: '0x9C3d...B8E2', fromUser: 'WhaleFin', avatar: 'WF', timestamp: '5h ago',
    youGive:    [{ type: 'token', symbol: 'POL',  amount: '150.00', usd: '$73.50', color: '#8247E5' }],
    youReceive: [{ type: 'token', symbol: 'USDC', amount: '80.00',  usd: '$80.00', color: '#2775CA' }] },
  { id: 'trade-003', from: '0xD7f4...2A11', fromUser: 'IcePick', avatar: 'IP', timestamp: '1d ago',
    youGive:    [{ type: 'nft', collection: 'Lil-Burn', id: '#858', color: '#E84142' }],
    youReceive: [{ type: 'nft', collection: 'Pudgy Penguins', id: '#1', color: '#627EEA' }],
    sweetenerReceive: { symbol: 'USDC', amount: '25.00' } },
];

const GLOBAL_LISTINGS: GlobalListing[] = [
  { id: 'gl-001', user: 'OrcaSwap',   avatar: 'OR', chain: 'Avalanche', timestamp: '4m ago',  offering: [{ type: 'nft',   collection: 'Lil-Burn',      id: '#412', color: '#E84142' }], seeking: '15 AVAX',     online: true  },
  { id: 'gl-002', user: '0xPharaoh',  avatar: 'PH', chain: 'Ethereum',  timestamp: '12m ago', offering: [{ type: 'token', symbol: 'ETH',   amount: '0.5',   usd: '$1,263', color: '#627EEA' }], seeking: '$1,200 USDC', online: false },
  { id: 'gl-003', user: 'WhaleFin',   avatar: 'WF', chain: 'Avalanche', timestamp: '31m ago', offering: [{ type: 'token', symbol: 'AVAX',  amount: '100',   usd: '$873',   color: '#E84142' }], seeking: '30,000 GUN',  online: true  },
  { id: 'gl-004', user: 'NadeTrader', avatar: 'NA', chain: 'BNB',       timestamp: '1h ago',  offering: [{ type: 'token', symbol: 'BNB',   amount: '2.0',   usd: '$968',   color: '#F0B90B' }], seeking: '$900 USDT',   online: false },
  { id: 'gl-005', user: 'IcePick',    avatar: 'IP', chain: 'Polygon',   timestamp: '2h ago',  offering: [{ type: 'nft',   collection: 'Unnamed Drop',  id: '#78',  color: '#8247E5' }], seeking: '200 POL',     online: false },
  { id: 'gl-006', user: 'BlazeMint',  avatar: 'BL', chain: 'Avalanche', timestamp: '3h ago',  offering: [{ type: 'token', symbol: 'BLAZE', amount: '5,000', usd: '$15',    color: '#FF4500' }], seeking: '8,000 COQ',   online: true  },
  { id: 'gl-007', user: 'ETHHolder',  avatar: 'EH', chain: 'Ethereum',  timestamp: '5h ago',  offering: [{ type: 'nft',   collection: 'Pudgy Penguins', id: '#420', color: '#627EEA' }], seeking: '15 ETH',      online: false },
];

const MOCK_ALERTS: Alert[] = [
  { id: 'al-1', text: 'OrcaSwap sent you a trade offer',        time: '2h ago',  unread: true  },
  { id: 'al-2', text: 'WhaleFin viewed your Lil-Burn listing',  time: '4h ago',  unread: true  },
  { id: 'al-3', text: 'Trade with IcePick expires in 48h',      time: '1d ago',  unread: false },
  { id: 'al-4', text: 'BlazeMint accepted your counter-offer',  time: '2d ago',  unread: false },
];

const GLOBAL_TRADES: GlobalTrade[] = [
  { id: 'gt-001', maker: 'OrcaSwap',  taker: 'WhaleFin',   status: 'COMPLETED',   timestamp: '5m ago',  chain: 'Avalanche', color: '#E84142',
    offer: [{ type: 'nft',   collection: 'Lil-Burn',    id: '#412',  color: '#E84142' }],
    want:  [{ type: 'nft',   collection: 'MyBarter v1.2', id: '#001', color: '#E84142' }] },
  { id: 'gt-002', maker: 'piweb',     taker: 'NadeTrader', status: 'PROPOSED', timestamp: '1h ago',  chain: 'BNB',       color: '#F0B90B',
    offer: [{ type: 'token', symbol: 'BNB',  amount: '2.0',   usd: '$968',   color: '#F0B90B' }],
    want:  [{ type: 'token', symbol: 'USDT', amount: '900.00', usd: '$900',   color: '#26A17B' }] },
  { id: 'gt-003', maker: 'IcePick',   taker: '0xPharaoh',  status: 'COMPLETED',   timestamp: '2h ago',  chain: 'Polygon',   color: '#8247E5',
    offer: [{ type: 'nft',   collection: 'Unnamed Drop', id: '#78',   color: '#8247E5' }],
    want:  [{ type: 'nft',   collection: 'Unnamed Drop', id: '#14',   color: '#8247E5' }] },
  { id: 'gt-004', maker: 'BlazeMint', taker: 'CryptoKen',  status: 'PROPOSED', timestamp: '4h ago',  chain: 'Avalanche', color: '#E84142',
    offer: [{ type: 'token', symbol: 'AVAX', amount: '50',    usd: '$435',   color: '#E84142' }],
    want:  [{ type: 'token', symbol: 'JOE',  amount: '3,600', usd: '$430',   color: '#FF6B6B' }] },
  { id: 'gt-005', maker: 'ZeroFee',   taker: 'AlphaNode',  status: 'COMPLETED',   timestamp: '6h ago',  chain: 'Ethereum',  color: '#627EEA',
    offer: [{ type: 'token', symbol: 'ETH',  amount: '0.25',  usd: '$631',   color: '#627EEA' }],
    want:  [{ type: 'token', symbol: 'USDC', amount: '620.00', usd: '$620',  color: '#2775CA' }] },
];

/* ─── TradeAssetCard (courtroom + offer review) ───────────────────────────── */
function TradeAssetCard({ asset }: { asset: TradeAsset }) {
  if (asset.type === 'nft') {
    return (
      <div className="rounded-xl p-3 flex flex-col gap-2"
        style={{ background: `${asset.color}10`, border: `1px solid ${asset.color}44` }}>
        <div className="w-full aspect-square rounded-lg flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${asset.color}22 0%, rgba(255,255,255,0.03) 100%)` }}>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase"
            style={{ color: `${asset.color}70`, fontFamily: INTER }}>{asset.collection?.split('-')[0]}</span>
        </div>
        <p className="text-[12px] font-black text-white" style={{ fontFamily: INTER }}>{asset.collection}</p>
        <p className="text-[11px] font-black" style={{ color: asset.color }}>{asset.id}</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-3"
      style={{ background: `${asset.color}10`, border: `1px solid ${asset.color}44` }}>
      <div className="shrink-0"><TokenIcon symbol={asset.symbol ?? ''} size={28} /></div>
      <div className="flex-1">
        <p className="text-[13px] font-black text-white" style={{ fontFamily: INTER }}>{asset.symbol}</p>
        <p className="text-[11px] font-black text-white/78">{asset.amount}</p>
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
        <p className="text-[9px] font-black tracking-[0.18em] uppercase text-white/78">Deal Sweetener · Stables only · max $100</p>
        <p className="text-[12px] font-black text-white" style={{ fontFamily: INTER }}>${sw.amount} {sw.symbol}</p>
      </div>
    </div>
  );
}

/* ─── Swap arrows (courtroom / offer review) ──────────────────────────────── */
function SwapArrows() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <svg width="48" height="10" viewBox="0 0 48 10" fill="none"><path d="M0 5h44M40 1l4 4-4 4" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: '#22d3ee' }}>Send</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black tracking-[0.18em] uppercase" style={{ color: '#a78bfa' }}>Receive</span>
          <svg width="48" height="10" viewBox="0 0 48 10" fill="none"><path d="M48 5H4M8 1L4 5l4 4" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
      <p className="text-[9px] font-black tracking-[0.18em] uppercase text-white/30 text-center">Atomic · Escrow</p>
    </div>
  );
}

/* ─── Protocol fee row ────────────────────────────────────────────────────── */
function feeForAssets(assets: TradeAsset[]): string {
  return assets.some(a => a.type === 'nft') ? '$2.50 flat' : '0.75% commission';
}
function FeeRow({ assets }: { assets: TradeAsset[] }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-4 rounded-xl mb-6"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}>
      <div className="flex items-center gap-2">
        <IconShield />
        <span className="text-[11px] font-black tracking-[0.18em] uppercase text-white/75">Protocol Fee</span>
      </div>
      <span className="text-[12px] font-black text-white">{feeForAssets(assets)}</span>
    </div>
  );
}

/* ─── App view ────────────────────────────────────────────────────────────── */
type AppView = 'home' | 'inventory' | 'profile' | 'reviewTrade' | 'upForTrade' | 'allTrades' | 'offerReview' | 'about' | 'howTo' | 'faq';

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function MyBarterApp() {
  const [isConnected, setIsConnected]               = useState(false);
  const [view, setView]                             = useState<AppView>('home');
  const [pendingTrades, setPendingTrades]           = useState<PendingTrade[]>(PENDING_TRADES);
  const [globalListings, setGlobalListings]         = useState<GlobalListing[]>(GLOBAL_LISTINGS);
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
  const [upForTradeFilter, setUpForTradeFilter]     = useState<'all' | 'nft' | 'token'>('all');
  // Offer funnel state
  const [viewListing, setViewListing]               = useState<GlobalListing | null>(null);
  const [offeringFor, setOfferingFor]               = useState<GlobalListing | null>(null);
  const [offerReview, setOfferReview]               = useState<{ listing: GlobalListing; userAsset: TradeAsset } | null>(null);
  // Confirm modal
  const [confirmAction, setConfirmAction]           = useState<{ title: string; body: string; onConfirm: () => void } | null>(null);
  const [offerAmount, setOfferAmount]               = useState('');
  const [rejectedOpen, setRejectedOpen]             = useState(false);
  const [globalProposedOpen, setGlobalProposedOpen] = useState(true);
  const [globalCompletedOpen, setGlobalCompletedOpen] = useState(false);
  // Nav dropdowns (separate)
  const [showAlerts, setShowAlerts]                 = useState(false);
  const [alerts, setAlerts]                         = useState<Alert[]>(MOCK_ALERTS);
  const [editingField, setEditingField]             = useState<string | null>(null);
  // Chat modal
  const [showChat, setShowChat]                     = useState(false);
  const [chatInput, setChatInput]                   = useState('');
  const [chatMessages, setChatMessages]             = useState<{ text: string; ts: string; mine: boolean }[]>([
    { text: 'Hey, open to a deal. Let me know if the terms work for you.', ts: '2h ago', mine: false },
    { text: 'Looks good. Can you add a small sweetener?', ts: '1h ago', mine: true },
  ]);
  const chatEndRef                                  = useRef<HTMLDivElement>(null);
  // Initiate Trade (self-listing flow)
  const [initiateAsset, setInitiateAsset]           = useState<TradeAsset | null>(null);
  const [initiateAmount, setInitiateAmount]         = useState('');
  const [initiateSeeking, setInitiateSeeking]       = useState('');
  // Global trade viewer
  const [viewGlobalTrade, setViewGlobalTrade]       = useState<GlobalTrade | null>(null);
  // Deal sweetener in offer flow
  const [sweetenerAmount, setSweetenerAmount]       = useState('');
  const [sweetenerSymbol, setSweetenerSymbol]       = useState<'USDC' | 'USDT'>('USDC');
  const [pfpUrl, setPfpUrl]                         = useState<string | null>(null);
  const pfpInputRef                                 = useRef<HTMLInputElement>(null);
  const dropdownRef                                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowAlerts(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    if (showChat) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, showChat]);

  function connect() { setIsConnected(true); setView('inventory'); }
  function goHome()  { setView('home'); }

  const assetSymbols      = new Set(ASSETS.map(a => a.symbol));
  const hasAssetSelection = Array.from(selected).some(k => assetSymbols.has(k));
  const hasNFTSelection   = Array.from(selected).some(k => !assetSymbols.has(k));
  const hasAnySelection   = hasAssetSelection || hasNFTSelection;

  function toggleKey(key: string) {
    setSelected(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }

  function getSelectedAsset(): TradeAsset | null {
    const key = Array.from(selected)[0];
    if (!key) return null;
    const a = ASSETS.find(x => x.symbol === key);
    if (a) return { type: 'token', symbol: a.symbol, amount: a.balance, usd: a.usd, color: a.color };
    const [cName, nftId] = key.split(':');
    const c = COLLECTIONS.find(x => x.name === cName);
    if (c) return { type: 'nft', collection: c.name, id: nftId, color: c.color };
    return null;
  }

  function handleMakeOffer(listing: GlobalListing) {
    setViewListing(null);
    setOfferingFor(listing);
    if (!isConnected) { connect(); } else { setView('inventory'); }
  }

  function handleOffer() {
    if (!offeringFor) return;
    const asset = getSelectedAsset();
    if (!asset) return;
    const targetType = offeringFor.offering[0]?.type;
    // Hard-block: only NFT↔NFT or Token↔Token
    if (targetType && asset.type !== targetType) return;
    if (asset.type === 'token') setOfferAmount(asset.amount ?? '');
    setSweetenerAmount('');
    setSweetenerSymbol('USDC');
    setOfferReview({ listing: offeringFor, userAsset: asset });
    setView('offerReview');
  }

  function handleConfirmOffer() {
    if (offerReview) {
      const newTrade: PendingTrade = {
        id: `trade-${Date.now()}`,
        from: username,
        fromUser: username,
        avatar: username.slice(0, 2).toUpperCase(),
        timestamp: 'just now',
        youGive:    [{ ...offerReview.userAsset }],
        youReceive: [{ ...offerReview.listing.offering[0] }],
        sweetenerGive: sweetenerAmount && parseFloat(sweetenerAmount) > 0
          ? { symbol: sweetenerSymbol, amount: sweetenerAmount }
          : undefined,
        direction: 'outgoing',
      };
      setPendingTrades(prev => [newTrade, ...prev]);
    }
    setOfferReview(null);
    setOfferingFor(null);
    setOfferAmount('');
    setSweetenerAmount('');
    setSweetenerSymbol('USDC');
    setSelected(new Set());
    setView('allTrades');
  }

  function handleAcceptTrade(id: string) {
    const trade = pendingTrades.find(t => t.id === id);
    if (!trade) return;
    // Enforce NFT↔NFT or Token↔Token — never mixed
    const giveType    = trade.youGive[0]?.type;
    const receiveType = trade.youReceive[0]?.type;
    if (giveType && receiveType && giveType !== receiveType) return;
    setPendingTrades(prev => prev.map(t => t.id === id ? { ...t, status: 'AWAITING' as const } : t));
    setView('profile');
    setReviewTradeId(null);
  }

  function handleRejectTrade(id: string) {
    // Status-based rejection: syncs both My Pending Trades and global view
    setPendingTrades(prev => prev.map(t => t.id === id ? { ...t, status: 'REJECTED' as const } : t));
    setView('profile');
    setReviewTradeId(null);
  }

  const drillCollection  = selectedCollection ? COLLECTIONS.find(c => c.name === selectedCollection) ?? null : null;
  const chainsWithAssets = new Set(ASSETS.map(a => a.chain));
  const chainsWithData   = new Set(COLLECTIONS.map(c => c.chain));
  const reviewTrade      = reviewTradeId ? pendingTrades.find(t => t.id === reviewTradeId) ?? null : null;
  const visibleAssets    = ASSETS.filter(a => (!assetChainFilter || a.chain === assetChainFilter) && (a.symbol.toLowerCase().includes(assetSearch.toLowerCase()) || a.chain.toLowerCase().includes(assetSearch.toLowerCase())));
  const visibleCols      = COLLECTIONS.filter(c => c.nfts.length > 0 && (!activeChain || c.chain === activeChain) && c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Trade filtering by status (status field is source of truth)
  const activeTrades   = pendingTrades.filter(t => t.direction !== 'outgoing' && t.status !== 'REJECTED');
  const outgoingTrades = pendingTrades.filter(t => t.direction === 'outgoing');
  const rejectedTrades = pendingTrades.filter(t => t.status === 'REJECTED');

  // Sweetener validation — hard cap $100
  const sweetenerOver = sweetenerAmount !== '' && !isNaN(parseFloat(sweetenerAmount)) && parseFloat(sweetenerAmount) > 100;

  // reviewTrade hybrid-block (NFT↔Token trades are invalid; can only accept same-type)
  const reviewTradeIsHybrid = (() => {
    if (!reviewTrade) return false;
    const g = reviewTrade.youGive[0]?.type;
    const r = reviewTrade.youReceive[0]?.type;
    return !!(g && r && g !== r);
  })();

  // Up for Trade filtered listings
  const filteredListings = globalListings.filter(l =>
    upForTradeFilter === 'all' || l.offering[0]?.type === upForTradeFilter
  );

  // Inventory button label + handler
  const inOfferMode      = offeringFor !== null;
  const offerTargetType  = offeringFor?.offering[0]?.type ?? null;   // 'token' | 'nft' | null
  const invBtnLabel      = inOfferMode ? 'Offer' : 'Initiate Trade';
  // In offer mode: only the section matching offerTargetType is rendered
  const showAssetsSection = !inOfferMode || offerTargetType === 'token';
  const showNFTsSection   = (!inOfferMode || offerTargetType === 'nft') && nftVisible;

  function SectionHeader({ title, sub, button }: { title: string; sub: string; button: React.ReactNode }) {
    return (
      <div className="flex justify-between items-end mb-5">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
            style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>{title}</h2>
          <p className="text-sm font-black text-white/80">{sub}</p>
        </div>
        {button}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white"
      style={{ fontFamily: INTER, WebkitFontSmoothing: 'antialiased' } as React.CSSProperties}>

      {/* ── Confirm Modal ────────────────────────────────────────────────── */}
      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}>
          <div className="w-full max-w-xs mx-4 rounded-2xl p-6"
            style={{ ...GLASS, border: '1px solid rgba(255,255,255,0.24)', boxShadow: '0 24px 64px rgba(0,0,0,0.9)' }}>
            <p className="text-sm font-black text-white/88 mb-6 leading-relaxed" style={{ fontFamily: INTER }}>{confirmAction.body}</p>
            <div className="flex gap-3">
              <GlassBtn label="Confirm" extraStyle={{ flex: 1 }}
                onClick={() => { confirmAction.onConfirm(); setConfirmAction(null); }} />
              <button className={BTN_OUTLINE} style={{ flex: 1 }}
                onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Chat Modal ───────────────────────────────────────────────────── */}
      {showChat && reviewTrade && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.87)', backdropFilter: 'blur(10px)' }}>
          <div className="w-full max-w-sm mx-4 rounded-2xl flex flex-col overflow-hidden"
            style={{ ...GLASS, border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 24px 64px rgba(0,0,0,0.9)', maxHeight: '80vh' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/60">Private Chat</p>
                <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{reviewTrade.fromUser}</p>
              </div>
              <button onClick={() => setShowChat(false)} className="text-white/50 hover:text-white transition-colors text-lg leading-none">×</button>
            </div>
            {/* Messages */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-3 overflow-y-auto" style={{ minHeight: '200px', maxHeight: '300px' }}>
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[75%] rounded-2xl px-4 py-2.5"
                    style={m.mine
                      ? { background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.28)', borderTopRightRadius: 4 }
                      : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderTopLeftRadius: 4 }}>
                    <p className="text-xs font-black text-white leading-relaxed">{m.text}</p>
                    <p className="text-[9px] text-white/40 mt-1">{m.ts}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <div className="px-5 py-4 border-t border-white/[0.08]">
              <p className="text-[9px] font-black tracking-[0.18em] uppercase text-white/40 mb-2">
                Chat auto-deletes on trade settlement or cancellation
              </p>
              <div className="flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl px-3 py-2 text-sm font-black text-white placeholder-white/30 outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.20)', fontFamily: INTER }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const msg = chatInput.trim();
                      if (!msg) return;
                      setChatMessages(prev => [...prev, { text: msg, ts: 'just now', mine: true }]);
                      setChatInput('');
                    }
                  }} />
                <button onClick={() => {
                  const msg = chatInput.trim();
                  if (!msg) return;
                  setChatMessages(prev => [...prev, { text: msg, ts: 'just now', mine: true }]);
                  setChatInput('');
                }}
                  className="px-4 py-2 rounded-xl text-[11px] font-black transition-all"
                  style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee' }}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Initiate Trade — List an asset modal ─────────────────────────── */}
      {initiateAsset && !inOfferMode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.87)', backdropFilter: 'blur(10px)' }}>
          <div className="w-full max-w-sm mx-4 rounded-2xl p-6"
            style={{ ...GLASS, border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 24px 64px rgba(0,0,0,0.9)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/65">List for Trade</p>
                <p className="text-sm font-black text-white mt-0.5" style={{ fontFamily: INTER }}>
                  {initiateAsset.type === 'token' ? initiateAsset.symbol : `${initiateAsset.collection} ${initiateAsset.id}`}
                </p>
              </div>
              <button onClick={() => { setInitiateAsset(null); setInitiateAmount(''); setInitiateSeeking(''); }}
                className="text-white/50 hover:text-white transition-colors text-lg leading-none">×</button>
            </div>
            {/* Asset preview card */}
            <div className="mb-4">
              <TradeAssetCard asset={{ ...initiateAsset, amount: (initiateAmount || initiateAsset.amount) ?? undefined }} />
            </div>
            {/* Amount input — tokens only */}
            {initiateAsset.type === 'token' && (
              <div className="mb-4">
                <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/72 mb-1.5">Amount to List</p>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.22)' }}>
                  <span className="text-[11px] font-black text-white/60">{initiateAsset.symbol}</span>
                  <input type="text" value={initiateAmount} onChange={e => setInitiateAmount(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-black text-white outline-none"
                    style={{ fontFamily: INTER }}
                    onFocus={e => (e.currentTarget.parentElement!.style.borderColor = 'rgba(34,211,238,0.55)')}
                    onBlur={e  => (e.currentTarget.parentElement!.style.borderColor = 'rgba(255,255,255,0.22)')} />
                </div>
              </div>
            )}
            <GlassBtn full label="Confirm to List"
              onClick={() => {
                const chain = initiateAsset.type === 'token'
                  ? (ASSETS.find(a => a.symbol === initiateAsset.symbol)?.chain ?? 'Avalanche')
                  : (COLLECTIONS.find(c => c.name === initiateAsset.collection)?.chain ?? 'Avalanche');
                const newListing: GlobalListing = {
                  id: `gl-${Date.now()}`,
                  user: username,
                  avatar: username.slice(0, 2).toUpperCase(),
                  chain,
                  timestamp: 'just now',
                  offering: [{ ...initiateAsset, amount: (initiateAmount || initiateAsset.amount) ?? undefined }],
                  seeking: '',
                  online: true,
                };
                setGlobalListings(prev => [newListing, ...prev]);
                setInitiateAsset(null); setInitiateAmount(''); setInitiateSeeking('');
                setSelected(new Set());
                setView('upForTrade');
              }}
            />
          </div>
        </div>
      )}

      {/* ── Global Trade Viewer (read-only) ──────────────────────────────── */}
      {viewGlobalTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.87)', backdropFilter: 'blur(8px)' }}
          onClick={() => setViewGlobalTrade(null)}>
          <div className="w-full max-w-2xl mx-4 rounded-2xl p-6"
            style={{ ...GLASS, border: '1px solid rgba(255,255,255,0.20)', boxShadow: '0 24px 64px rgba(0,0,0,0.9)' }}
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xl font-black text-white" style={{ fontFamily: INTER }}>
                  {viewGlobalTrade.maker} ↔ {viewGlobalTrade.taker}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                  style={{ background: viewGlobalTrade.status === 'COMPLETED' ? '#22c55e' : 'rgba(255,255,255,0.08)', border: `1px solid ${viewGlobalTrade.status === 'COMPLETED' ? '#22c55e' : 'rgba(255,255,255,0.18)'}`, color: viewGlobalTrade.status === 'COMPLETED' ? '#000' : 'rgba(255,255,255,0.80)' }}>
                  {viewGlobalTrade.status}
                </span>
                <button onClick={() => setViewGlobalTrade(null)} className="text-white/50 hover:text-white transition-colors text-lg leading-none">×</button>
              </div>
            </div>
            {/* Assets */}
            {viewGlobalTrade.offer && viewGlobalTrade.want ? (
              <div className="grid gap-6 mb-5" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                <div>
                  <p className="text-[10px] font-black tracking-[0.15em] uppercase text-white/65 mb-3">{viewGlobalTrade.maker} Offers</p>
                  <div className="flex flex-col gap-2">
                    {viewGlobalTrade.offer.map((a, i) => <TradeAssetCard key={i} asset={a} />)}
                  </div>
                </div>
                <SwapArrows />
                <div>
                  <p className="text-[10px] font-black tracking-[0.15em] uppercase text-white/65 mb-3">{viewGlobalTrade.taker} Offers</p>
                  <div className="flex flex-col gap-2">
                    {viewGlobalTrade.want.map((a, i) => <TradeAssetCard key={i} asset={a} />)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm font-black text-white/50">Trade details are private.</p>
              </div>
            )}
            <FeeRow assets={[...(viewGlobalTrade.offer ?? []), ...(viewGlobalTrade.want ?? [])]} />
            <div className="flex justify-center">
              <button className={BTN_OUTLINE} onClick={() => setViewGlobalTrade(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Asset Overlay ────────────────────────────────────────────────── */}
      {viewListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setViewListing(null)}>
          <div className={`w-full mx-4 rounded-2xl p-6 overflow-y-auto ${viewListing.offering[0]?.type === 'nft' ? 'max-w-md' : 'max-w-sm'}`}
            style={{ ...GLASS, border: '1px solid rgba(255,255,255,0.20)', maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}>
            {/* Header — username only */}
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{viewListing.user}</p>
              <button onClick={() => setViewListing(null)} className="text-white/50 hover:text-white transition-colors text-lg leading-none">×</button>
            </div>

            {/* Token asset */}
            {viewListing.offering[0]?.type === 'token' ? (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: `${viewListing.offering[0].color}18`, border: `2px solid ${viewListing.offering[0].color}55` }}>
                  <TokenIcon symbol={viewListing.offering[0].symbol ?? ''} size={44} />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-white mb-1" style={{ fontFamily: INTER }}>{viewListing.offering[0].symbol}</p>
                  <p className="text-sm font-black text-white/70">{viewListing.chain}</p>
                </div>
                <div className="flex items-center gap-6 w-full justify-center">
                  <div className="text-center">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/72">Amount</p>
                    <p className="text-lg font-black text-white" style={{ fontFamily: INTER }}>{viewListing.offering[0].amount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/72">USD Value</p>
                    <p className="text-lg font-black text-white" style={{ fontFamily: INTER }}>{viewListing.offering[0].usd}</p>
                  </div>
                </div>
              </div>
            ) : (() => {
              /* NFT detail — large image + full traits */
              const offer = viewListing.offering[0];
              const coll  = COLLECTIONS.find(c => c.name === offer.collection);
              const nft   = coll?.nfts.find(n => n.id === offer.id);
              return (
                <div className="flex flex-col gap-4">
                  {/* 1:1 large image */}
                  <div className="w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${offer.color}22 0%, rgba(255,255,255,0.03) 100%)`, border: `1px solid ${offer.color}44` }}>
                    {nft?.image
                      ? <img src={nft.image} alt={offer.id ?? ''} className="w-full h-full object-cover" />
                      : <span className="text-[13px] font-black tracking-[0.2em] uppercase"
                          style={{ color: `${offer.color}70`, fontFamily: INTER }}>{offer.collection?.split('-')[0]}</span>}
                  </div>
                  {/* Name / ID */}
                  <div>
                    <p className="text-lg font-black text-white" style={{ fontFamily: INTER }}>{offer.collection}</p>
                    <p className="text-sm font-black mt-0.5" style={{ color: offer.color }}>{offer.id}</p>
                  </div>
                  {/* Traits grid */}
                  {nft?.traits && nft.traits.length > 0 && (
                    <div>
                      <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/55 mb-2">Attributes</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {nft.traits.map(t => (
                          <div key={t.key} className="rounded-xl px-3 py-2 text-center"
                            style={{ background: `${offer.color}0D`, border: `1px solid ${offer.color}25` }}>
                            <p className="text-[9px] font-black uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.55)' }}>{t.key}</p>
                            <p className="text-[13px] font-black text-white mt-0.5" style={{ fontFamily: INTER }}>{t.value}</p>
                            {t.rarity && <p className="text-[9px] font-black mt-0.5" style={{ color: offer.color }}>{t.rarity} rare</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="mt-5">
              <GlassBtn large full label="Make Offer"
                onClick={() => {
                  const listing = viewListing!;
                  setViewListing(null);
                  const offered = listing.offering[0];
                  setConfirmAction({
                    title: '',
                    body: 'Please select an asset from your Inventory to propose a trade.',
                    onConfirm: () => handleMakeOffer(listing),
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto border-b border-white/[0.08]">
        <a href="/" onClick={e => { e.preventDefault(); goHome(); }}
          className="flex items-center gap-2.5 cursor-pointer" style={{ textDecoration: 'none' }}>
          <Image src="/mybarter-logo.png" alt="MyBarter" width={44} height={44} style={{ objectFit: 'contain', flexShrink: 0 }} />
          <span className="text-2xl font-black tracking-tighter" style={{ fontFamily: INTER, ...gradientText }}>MyBarter</span>
        </a>

        <div className="flex items-center gap-7">
          <NavLink label="Up for Trade"   active={view === 'upForTrade'}  onClick={() => setView('upForTrade')} />
          <NavLink label="Pending Trades" active={view === 'allTrades'}   onClick={() => setView('allTrades')} />
          <NavLink label="My Inventory"   active={view === 'inventory'}   onClick={() => { if (!isConnected) connect(); else setView('inventory'); }} />
          <NavLink label="About"   active={view === 'about'}  onClick={() => setView('about')} />
          <NavLink label="How-To"  active={view === 'howTo'}  onClick={() => setView('howTo')} />
          <NavLink label="F.A.Q"   active={view === 'faq'}    onClick={() => setView('faq')} />
        </div>

        <div className="flex items-center gap-3" ref={dropdownRef}>
          {isConnected && (
            <>
              {/* ── Bell → Alerts ── */}
              <div className="relative">
                <button onClick={() => { setShowAlerts(v => !v); setShowDropdown(false); }}
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
                  style={{ background: showAlerts ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <IconBell hasNew={alerts.some(a => a.unread)} />
                </button>
                {showAlerts && (
                  <div className="absolute right-0 top-11 w-80 z-40 rounded-2xl overflow-hidden"
                    style={{ ...GLASS, border: '1px solid rgba(255,255,255,0.20)', boxShadow: '0 20px 60px rgba(0,0,0,0.85)' }}>
                    <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
                      <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/78">Alerts</p>
                      {alerts.some(a => a.unread) && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee' }}>
                          {alerts.filter(a => a.unread).length} new
                        </span>
                      )}
                    </div>
                    {alerts.map(a => (
                      <div key={a.id} className="px-5 py-3.5 flex items-start gap-3 border-b border-white/[0.06] transition-colors hover:bg-white/[0.03]"
                        style={{ background: a.unread ? 'rgba(34,211,238,0.04)' : 'transparent' }}>
                        {a.unread && <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#22d3ee' }} />}
                        {!a.unread && <span className="mt-1.5 w-1.5 h-1.5 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white leading-snug">{a.text}</p>
                          <p className="text-[10px] text-white/55 mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    ))}
                    <div className="px-5 py-3">
                      <button onClick={() => setAlerts(prev => prev.map(a => ({ ...a, unread: false })))}
                        className="text-[10px] font-black tracking-[0.18em] uppercase text-white/40 hover:text-white/70 transition-colors">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Username → Profile ── */}
              <div className="relative">
                <button onClick={() => { setShowDropdown(v => !v); setShowAlerts(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
                  style={{ background: showDropdown ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <span className="text-[11px] font-black tracking-[0.14em] uppercase text-white" style={{ fontFamily: INTER }}>{username}</span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 top-11 w-76 z-40 rounded-2xl p-5 flex flex-col gap-4"
                    style={{ ...GLASS, border: '1px solid rgba(255,255,255,0.20)', boxShadow: '0 20px 60px rgba(0,0,0,0.85)', width: '20rem' }}>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/78">My Profile</p>

                    {/* Avatar with pencil overlay */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 shrink-0 cursor-pointer group"
                        onClick={() => pfpInputRef.current?.click()}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white overflow-hidden"
                          style={{ background: 'linear-gradient(135deg, #22d3ee33, #a78bfa33)', border: '1px solid rgba(255,255,255,0.18)' }}>
                          {pfpUrl
                            ? <img src={pfpUrl} alt="pfp" className="w-full h-full object-cover" />
                            : username.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: '#22d3ee', border: '1.5px solid #000' }}>
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <path d="M5.8 1.2L7.8 3.2L2.5 8.5H0.5V6.5L5.8 1.2Z" fill="#000" />
                          </svg>
                        </div>
                        <input ref={pfpInputRef} type="file" accept="image/*" className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) setPfpUrl(URL.createObjectURL(f)); }} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{username}</p>
                        <p className="text-[11px] text-white/70">Avalanche · Lil-Burn holder</p>
                      </div>
                    </div>

                    {/* Editable fields with Edit links */}
                    {([
                      { key: 'username', label: 'Username',  value: username, set: setUsername },
                      { key: 'xhandle',  label: 'X Handle',  value: xHandle,  set: setXHandle },
                      { key: 'email',    label: 'Email',     value: email,    set: setEmail, ph: 'your@email.com' },
                    ] as { key: string; label: string; value: string; set: (v: string) => void; ph?: string }[]).map(f => (
                      <div key={f.key}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/70">{f.label}</p>
                          <button onClick={() => setEditingField(editingField === f.key ? null : f.key)}
                            className="text-[9px] font-black tracking-[0.12em] uppercase transition-colors"
                            style={{ color: editingField === f.key ? 'rgba(255,255,255,0.50)' : '#22d3ee' }}>
                            {editingField === f.key ? 'Done' : 'Edit'}
                          </button>
                        </div>
                        {editingField === f.key
                          ? <input value={f.value} onChange={e => f.set(e.target.value)}
                              placeholder={f.ph ?? f.label} autoFocus
                              className="w-full rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none"
                              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(34,211,238,0.50)', fontFamily: INTER }} />
                          : <p className="text-sm font-black" style={{ color: f.value ? '#fff' : 'rgba(255,255,255,0.35)', fontFamily: INTER }}>
                              {f.value || (f.ph ?? f.label)}
                            </p>
                        }
                      </div>
                    ))}

                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-white">NFT Visibility</p>
                      <button onClick={() => setNftVisible(v => !v)}
                        className="w-10 h-5 rounded-full relative transition-all shrink-0"
                        style={{ background: nftVisible ? '#22d3ee' : 'rgba(255,255,255,0.15)' }}>
                        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                          style={{ left: nftVisible ? '22px' : '2px' }} />
                      </button>
                    </div>
                    <button onClick={() => { setIsConnected(false); setView('home'); setShowDropdown(false); }}
                      className="text-[10px] font-black tracking-[0.15em] uppercase text-white/45 hover:text-white/80 transition-colors text-left">
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          {!isConnected && <ConnectWalletBtn onClick={connect} />}
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════
          VIEW: OFFER REVIEW
      ════════════════════════════════════════════════════════════════ */}
      {view === 'offerReview' && offerReview ? (
        <div className="max-w-5xl mx-auto px-8 pt-10 pb-24">
          <BackBtn label="My Inventory" onClick={() => { setView('inventory'); setOfferReview(null); }} />
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
              style={{ fontFamily: INTER, fontWeight: 900 }}>Review My Offer</h2>
            <p className="text-sm font-black text-white/78">Confirm before submitting to the escrow</p>
          </div>

          <div className="grid gap-8 mb-6" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
            <div>
              <p className="text-sm font-black text-white tracking-[0.1em] uppercase mb-4">You Want</p>
              <TradeAssetCard asset={offerReview.listing.offering[0]} />
            </div>
            <SwapArrows />
            <div>
              <p className="text-sm font-black text-white tracking-[0.1em] uppercase mb-4">You Offer</p>
              {(() => {
                // Live USD: derive price-per-unit from ASSETS mock prices
                let displayAsset = offerReview.userAsset;
                if (offerReview.userAsset.type === 'token' && offerAmount) {
                  const src = ASSETS.find(x => x.symbol === offerReview.userAsset.symbol);
                  if (src) {
                    const bal = parseFloat(src.balance.replace(/,/g, ''));
                    const usd = parseFloat(src.usd.replace(/[$,]/g, ''));
                    const pricePerUnit = bal > 0 ? usd / bal : 0;
                    const enteredAmt = parseFloat(offerAmount.replace(/,/g, '') || '0');
                    const liveUsd = pricePerUnit > 0 && enteredAmt > 0 ? `$${(pricePerUnit * enteredAmt).toFixed(2)}` : src.usd;
                    displayAsset = { ...offerReview.userAsset, amount: offerAmount, usd: liveUsd };
                  }
                }
                return <TradeAssetCard asset={displayAsset} />;
              })()}
              {offerReview.userAsset.type === 'token' && (
                <div className="mt-3">
                  <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/72 mb-1.5">Offer Amount</p>
                  <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.22)' }}>
                    <span className="text-[11px] font-black text-white/60">{offerReview.userAsset.symbol}</span>
                    <input type="text" value={offerAmount} onChange={e => setOfferAmount(e.target.value)}
                      className="flex-1 bg-transparent text-sm font-black text-white outline-none"
                      style={{ fontFamily: INTER }}
                      onFocus={e => (e.currentTarget.parentElement!.style.borderColor = 'rgba(34,211,238,0.55)')}
                      onBlur={e  => (e.currentTarget.parentElement!.style.borderColor = 'rgba(255,255,255,0.22)')} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Deal Sweetener — only when an NFT is on either side */}
          {(offerReview.userAsset.type === 'nft' || offerReview.listing.offering[0].type === 'nft') && (
            <div className="mb-5 rounded-xl px-4 py-3.5"
              style={{ background: 'rgba(39,117,202,0.07)', border: '1px dashed rgba(39,117,202,0.40)' }}>
              <p className="text-[9px] font-black tracking-[0.2em] uppercase text-white/72 mb-2.5">
                Deal Sweetener: Optional · Stables only · max $100
              </p>
              <div className="flex items-center gap-3">
                <select value={sweetenerSymbol} onChange={e => setSweetenerSymbol(e.target.value as 'USDC' | 'USDT')}
                  className="rounded-lg px-2.5 py-1.5 text-sm font-black text-white outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.22)', fontFamily: INTER }}>
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                </select>
                <input type="text" value={sweetenerAmount} onChange={e => setSweetenerAmount(e.target.value)}
                  placeholder="0.00" maxLength={7}
                  className="flex-1 rounded-lg px-3 py-1.5 text-sm font-black text-white placeholder-white/30 outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: sweetenerOver ? '1px solid rgba(239,68,68,0.65)' : '1px solid rgba(255,255,255,0.22)', fontFamily: INTER }}
                  onFocus={e => { if (!sweetenerOver) e.currentTarget.style.borderColor = 'rgba(39,117,202,0.65)'; }}
                  onBlur={e  => { e.currentTarget.style.borderColor = sweetenerOver ? 'rgba(239,68,68,0.65)' : 'rgba(255,255,255,0.22)'; }} />
                <span className="text-[10px] font-black shrink-0" style={{ color: sweetenerOver ? '#ef4444' : 'rgba(255,255,255,0.50)' }}>max $100</span>
              </div>
              {sweetenerOver && (
                <p className="text-[9px] font-black mt-1.5" style={{ color: '#ef4444', fontFamily: INTER }}>
                  Sweetener cannot exceed $100.
                </p>
              )}
            </div>
          )}
          <FeeRow assets={[offerReview.listing.offering[0], offerReview.userAsset]} />
          <div className="flex items-center justify-center gap-4">
            <GlassBtn label="Confirm Offer" disabled={sweetenerOver} onClick={() => setConfirmAction({
              title: '',
              body: 'By confirming, your offer will be submitted to the counterparty for review.',
              onConfirm: handleConfirmOffer,
            })} />
            <button className={BTN_OUTLINE} onClick={() => { setView('inventory'); setOfferReview(null); }}>Edit</button>
            <button className={BTN_DANGER} onClick={() => { setOfferingFor(null); setOfferReview(null); setOfferAmount(''); setSelected(new Set()); setView('upForTrade'); }}>Cancel</button>
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: REVIEW TRADE — Courtroom
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'reviewTrade' && reviewTrade ? (
        <div className="max-w-6xl mx-auto px-8 pt-10 pb-24">
          <BackBtn label="My Pending Trades" onClick={() => { setView('profile'); setReviewTradeId(null); }} />
          <div className="mb-8">
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-1 text-white/70">Incoming Offer From</p>
            <h2 className="text-3xl font-black tracking-tighter text-white" style={{ fontFamily: INTER, fontWeight: 900 }}>{reviewTrade.fromUser}</h2>
            <p className="text-sm font-black text-white/75 mt-0.5">{reviewTrade.fromUser} · {reviewTrade.timestamp}</p>
          </div>
          <div className="grid gap-8 mb-6" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
            <div>
              <p className="text-sm font-black text-white tracking-[0.1em] uppercase mb-4">What You Give</p>
              <div className="flex flex-col gap-3">
                {reviewTrade.youGive.map((a, i) => <TradeAssetCard key={i} asset={a} />)}
              </div>
              {reviewTrade.sweetenerGive && <SweetenerCard sw={reviewTrade.sweetenerGive} />}
            </div>
            <SwapArrows />
            <div>
              <p className="text-sm font-black text-white tracking-[0.1em] uppercase mb-4">What You Receive</p>
              <div className="flex flex-col gap-3">
                {reviewTrade.youReceive.map((a, i) => <TradeAssetCard key={i} asset={a} />)}
              </div>
              {reviewTrade.sweetenerReceive && <SweetenerCard sw={reviewTrade.sweetenerReceive} />}
            </div>
          </div>
          <FeeRow assets={[...reviewTrade.youGive, ...reviewTrade.youReceive]} />
          {reviewTradeIsHybrid && (
            <p className="text-center text-[11px] font-black mb-4" style={{ color: '#ef4444', fontFamily: INTER }}>
              Mixed-type trade detected. MyBarter only supports NFT for NFT or Token for Token.
            </p>
          )}
          <div className="flex items-center justify-center gap-4">
            <GlassBtn label="Accept" disabled={reviewTradeIsHybrid} onClick={() => setConfirmAction({
              title: '',
              body: 'By confirming, this trade will be executed atomically and is irreversible. Your assets will be swapped instantly with the assets already secured in the Robot Lawyer Vault.',
              onConfirm: () => handleAcceptTrade(reviewTradeId!),
            })} />
            <button className={BTN_DANGER} onClick={() => handleRejectTrade(reviewTradeId!)}>Reject</button>
            <button className={BTN_OUTLINE} onClick={() => setShowChat(true)}>Chat</button>
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: PROFILE / INBOX
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'profile' && isConnected ? (
        <div className="max-w-4xl mx-auto px-8 pt-10 pb-24">
            <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
              style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>My Pending Trades</h2>
            <p className="text-sm font-black text-white/80 mb-8">
              {activeTrades.length} incoming · {outgoingTrades.length} outgoing
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {activeTrades.length === 0 && (
                <p className="text-sm font-black text-white/65 py-8 text-center">No active offers.</p>
              )}
              {activeTrades.map(trade => {
                const isAwaiting = trade.status === 'AWAITING';
                return (
                  <div key={trade.id} className="rounded-2xl px-6 py-5 flex items-center gap-5" style={GLASS}>
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                        style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.18)' }}>{trade.avatar}</div>
                      <span className="absolute -bottom-0.5 -right-0.5"><GreenDot /></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{trade.fromUser}</p>
                      <p className="text-xs font-black text-white/75 mt-0.5">
                        {isAwaiting ? '72h window active, awaiting counterparty deposit' : `${trade.youGive[0]?.type === 'nft' ? `${trade.youGive[0].collection} ${trade.youGive[0].id}` : `${trade.youGive[0]?.amount} ${trade.youGive[0]?.symbol}`}`}
                      </p>
                    </div>
                    <p className="text-xs font-black text-white/70 shrink-0">{trade.timestamp}</p>
                    {/* Status badge */}
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full shrink-0"
                      style={isAwaiting
                        ? { background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.40)', color: '#fbbf24' }
                        : { background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.28)', color: '#22d3ee' }}>
                      {isAwaiting ? 'AWAITING' : 'INCOMING'}
                    </span>
                    {!isAwaiting && (
                      <button onClick={() => { setReviewTradeId(trade.id); setView('reviewTrade'); }}
                        className="shrink-0 px-5 py-2 rounded-xl text-[11px] font-black tracking-[0.14em] uppercase transition-all"
                        style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.30)', color: '#22d3ee' }}
                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(34,211,238,0.16)')}
                        onMouseOut={e  => (e.currentTarget.style.background = 'rgba(34,211,238,0.08)')}>
                        Review Trade
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {outgoingTrades.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/55 mb-3">Outgoing Offers</p>
                <div className="flex flex-col gap-2">
                  {outgoingTrades.map(trade => (
                    <div key={trade.id} className="rounded-2xl px-6 py-4 flex items-center gap-5" style={GLASS}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>
                          {trade.youGive[0]?.type === 'nft' ? `${trade.youGive[0].collection} ${trade.youGive[0].id}` : `${trade.youGive[0]?.amount} ${trade.youGive[0]?.symbol}`}
                          {' → '}
                          {trade.youReceive[0]?.type === 'nft' ? `${trade.youReceive[0].collection} ${trade.youReceive[0].id}` : `${trade.youReceive[0]?.amount} ${trade.youReceive[0]?.symbol}`}
                        </p>
                        <p className="text-xs font-black text-white/60 mt-0.5">{trade.timestamp} · Awaiting counterparty</p>
                      </div>
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full shrink-0"
                        style={{ background: 'rgba(167,139,250,0.10)', border: '1px solid rgba(167,139,250,0.30)', color: '#a78bfa' }}>
                        PENDING
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rejectedTrades.length > 0 && (
              <div>
                <button onClick={() => setRejectedOpen(v => !v)}
                  className="flex items-center gap-2 mb-3 text-xs font-black tracking-[0.14em] uppercase transition-opacity hover:opacity-75">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ transform: rejectedOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                    <path d="M4 2l4 4-4 4" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ color: 'rgba(239,68,68,0.7)' }}>Rejected ({rejectedTrades.length})</span>
                </button>
                {rejectedOpen && (
                  <div className="flex flex-col gap-2 pl-4 border-l-2" style={{ borderColor: 'rgba(239,68,68,0.20)' }}>
                    {rejectedTrades.map(trade => (
                      <div key={trade.id} className="rounded-xl px-5 py-3.5 flex items-center gap-4 opacity-50" style={GLASS}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>{trade.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{trade.fromUser}</p>
                          <p className="text-xs font-black text-white/60 mt-0.5">{trade.timestamp}</p>
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)', color: 'rgba(239,68,68,0.80)' }}>
                          REJECTED
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: UP FOR TRADE
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'upForTrade' ? (
        <div className="max-w-6xl mx-auto px-8 pt-10 pb-24">
          <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
            style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>Up for Trade</h2>
          <p className="text-sm font-black text-white/78 mb-6">{filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} across all chains</p>
          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-6">
            {(['all', 'nft', 'token'] as const).map(f => (
              <button key={f} onClick={() => setUpForTradeFilter(f)}
                className="px-4 py-1.5 rounded-xl text-[11px] font-black tracking-[0.14em] uppercase transition-all"
                style={upForTradeFilter === f
                  ? { background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.40)', color: '#22d3ee', boxShadow: '0 0 10px rgba(34,211,238,0.18)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.50)' }}>
                {f === 'all' ? 'All' : f === 'nft' ? 'NFTs' : 'Tokens'}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {filteredListings.map(listing => {
              const offer = listing.offering[0];
              return (
                <div key={listing.id} className="rounded-2xl px-6 py-5 flex items-center gap-5" style={GLASS}>
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}>{listing.avatar}</div>
                    <span className="absolute -bottom-0.5 -right-0.5">
                      {listing.online !== false ? <GreenDot /> : <GreyDot />}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{listing.user}</p>
                    <p className="text-xs font-black text-white/75 mt-0.5">
                      {offer.type === 'nft' ? `${offer.collection} ${offer.id}` : `${offer.amount} ${offer.symbol} · ${offer.usd}`}
                    </p>
                  </div>
                  <button onClick={() => setViewListing(listing)}
                    className="shrink-0 px-5 py-2 rounded-xl text-[11px] font-black tracking-[0.14em] uppercase transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #22d3ee, #a78bfa)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.border = '1px solid transparent'; }}
                    onMouseOut={e  => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.18)'; }}>
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: ALL TRADES
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'allTrades' ? (
        <div className="max-w-5xl mx-auto px-8 pt-10 pb-24">
          <h2 className="text-3xl font-black tracking-tighter text-white mb-1"
            style={{ fontFamily: INTER, letterSpacing: '-0.03em', fontWeight: 900 }}>Pending Trades</h2>
          <p className="text-sm font-black text-white/78 mb-8">All live trades across the platform</p>
          {isConnected && (
            <div className="mb-6">
              <button onClick={() => setUserTradesOpen(v => !v)}
                className="flex items-center gap-2 mb-3 text-xs font-black tracking-[0.14em] uppercase transition-opacity hover:opacity-75">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ transform: userTradesOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M4 2l4 4-4 4" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={gradientText}>My Trades ({pendingTrades.length})</span>
              </button>
              {userTradesOpen && (
                <div className="flex flex-col gap-2 pl-4 border-l-2 border-[#22d3ee30] mb-4">
                  {pendingTrades.filter(t => t.status !== 'REJECTED').map(t => {
                    const isAwaiting = t.status === 'AWAITING';
                    const badgeStyle = t.direction === 'outgoing'
                      ? { background: 'rgba(167,139,250,0.10)', border: '1px solid rgba(167,139,250,0.35)', color: '#a78bfa' }
                      : isAwaiting
                        ? { background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.40)', color: '#fbbf24' }
                        : { background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.28)', color: '#22d3ee' };
                    const badgeLabel = t.direction === 'outgoing' ? 'OUTGOING' : isAwaiting ? 'AWAITING' : 'INCOMING';
                    return (
                      <div key={t.id} className="rounded-xl px-5 py-3.5 flex items-center gap-4" style={GLASS}>
                        <div className="flex-1 flex items-center gap-2">
                          <GreenDot />
                          <div>
                            <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{username} ↔ {t.fromUser}</p>
                            <p className="text-xs font-black text-white/70 mt-0.5">{t.timestamp}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={badgeStyle}>
                          {badgeLabel}
                        </span>
                        {!isAwaiting && (
                          <button onClick={() => { setReviewTradeId(t.id); setView('reviewTrade'); }}
                            className="text-[10px] font-black tracking-[0.12em] uppercase px-3 py-1.5 rounded-lg transition-all"
                            style={{ background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.25)', color: '#22d3ee' }}>
                            Review
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {/* ── Proposed ── */}
          {(() => {
            const proposed = GLOBAL_TRADES.filter(t => t.status === 'PROPOSED');
            return (
              <div className="mb-4">
                <button onClick={() => setGlobalProposedOpen(v => !v)}
                  className="flex items-center gap-2 mb-3 text-xs font-black tracking-[0.14em] uppercase transition-opacity hover:opacity-75">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ transform: globalProposedOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                    <path d="M4 2l4 4-4 4" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-white/55">Proposed ({proposed.length})</span>
                </button>
                {globalProposedOpen && (
                  <div className="flex flex-col gap-2 pl-4 border-l-2 border-white/[0.08]">
                    {proposed.length === 0
                      ? <p className="text-xs font-black text-white/40 py-3 pl-1">No proposed trades.</p>
                      : proposed.map(t => (
                        <div key={t.id} className="rounded-xl px-5 py-3.5 flex items-center gap-4" style={GLASS}>
                          <div className="flex-1 flex items-center gap-2">
                            <GreenDot />
                            <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{t.maker} ↔ {t.taker}</p>
                          </div>
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.80)' }}>
                            PROPOSED
                          </span>
                          <button onClick={() => setViewGlobalTrade(t)}
                            className="shrink-0 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-[0.12em] uppercase transition-all"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}
                            onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #22d3ee, #a78bfa)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.border = '1px solid transparent'; }}
                            onMouseOut={e  => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.18)'; }}>
                            View
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Completed ── */}
          {(() => {
            const completed = GLOBAL_TRADES.filter(t => t.status === 'COMPLETED');
            return (
              <div>
                <button onClick={() => setGlobalCompletedOpen(v => !v)}
                  className="flex items-center gap-2 mb-3 text-xs font-black tracking-[0.14em] uppercase transition-opacity hover:opacity-75">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ transform: globalCompletedOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                    <path d="M4 2l4 4-4 4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ color: '#22c55e' }}>Completed ({completed.length})</span>
                </button>
                {globalCompletedOpen && (
                  <div className="flex flex-col gap-2 pl-4 border-l-2" style={{ borderColor: 'rgba(34,197,94,0.25)' }}>
                    {completed.map(t => (
                      <div key={t.id} className="rounded-xl px-5 py-3.5 flex items-center gap-4" style={GLASS}>
                        <div className="flex-1">
                          <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{t.maker} ↔ {t.taker}</p>
                          <p className="text-xs font-black text-white/70 mt-0.5">{t.chain} · {t.timestamp}</p>
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                          style={{ background: '#22c55e', border: '1px solid #22c55e', color: '#000' }}>
                          COMPLETED
                        </span>
                        <button onClick={() => setViewGlobalTrade(t)}
                          className="shrink-0 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-[0.12em] uppercase transition-all"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}
                          onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #22d3ee, #a78bfa)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.border = '1px solid transparent'; }}
                          onMouseOut={e  => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.18)'; }}>
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: HOMEPAGE
      ════════════════════════════════════════════════════════════════ */
      ) : !isConnected || view === 'home' ? (
        <>
          <section className="max-w-5xl mx-auto text-center px-6 pt-20 pb-10">
            <p className="font-black uppercase mb-5" style={{ fontFamily: INTER, fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', letterSpacing: '0.18em', fontWeight: 900, ...gradientText }}>
              Browse · Offer · Swap
            </p>
            {/* Headline — forced 2 lines, non-bold geometric per Figma */}
            <h1 className="font-light text-white mb-6"
              style={{ fontFamily: INTER, fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', letterSpacing: '-0.04em', lineHeight: 0.95, fontWeight: 300 }}>
              The Slippage-Free Settlement Layer<br />for Asset Rotation
            </h1>
            {/* Sub-headline — forced 2 lines, bold phrase */}
            <p className="mb-8 mx-auto"
              style={{ fontFamily: INTER, fontSize: '18px', lineHeight: 1.65, fontWeight: 400, color: 'rgba(255,255,255,0.82)', maxWidth: '720px' }}>
              Move high-value NFT and Token positions off-market via the{' '}
              <strong style={{ color: '#fff', fontWeight: 700 }}>Robot Lawyer Escrow</strong>.<br />
              Secure, atomic, and zero price impact.
            </p>
            <div className="flex justify-center">
              {!isConnected
                ? <ConnectWalletBtn onClick={connect} large />
                : <ConnectWalletBtn onClick={() => setView('inventory')} label="Launch App" large />
              }
            </div>
            {/* Metadata strip — leading dot + color-coded dots */}
            <div className="mt-6 flex items-center justify-center gap-5">
              <span style={{ fontSize: '22px', lineHeight: 1, color: '#22d3ee' }}>•</span>
              <span className="text-[11px] font-black tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.78)' }}>Multi-Chain</span>
              <span style={{ fontSize: '22px', lineHeight: 1, color: '#a78bfa' }}>•</span>
              <span className="text-[11px] font-black tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.78)' }}>Secure Escrow</span>
              <span style={{ fontSize: '22px', lineHeight: 1, color: '#06b6d4' }}>•</span>
              <span className="text-[11px] font-black tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.78)' }}>Transparent Fees</span>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PILLARS.map(p => (
                <div key={p.number} className="rounded-2xl p-7 flex flex-col gap-3"
                  style={{ ...GLASS, boxShadow: `0 0 40px ${p.glow}` }}>
                  {/* Number + label — ONCE only, no footer strip */}
                  <div className="flex flex-row items-center gap-3">
                    <span className="text-[11px] font-black tracking-[0.3em]" style={{ color: p.color, opacity: 0.7 }}>{p.number}</span>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: p.color, opacity: 0.85 }}>{p.label}</span>
                  </div>
                  <h3 className="text-2xl font-medium tracking-tighter text-white leading-snug"
                    style={{ fontFamily: INTER, letterSpacing: '-0.02em', fontWeight: 500 }}>{p.headline}</h3>
                  <p className="text-sm leading-snug line-clamp-2" style={{ color: 'rgba(255,255,255,0.88)' }}>{p.body}</p>
                </div>
              ))}
            </div>
          </section>
        </>

      /* ════════════════════════════════════════════════════════════════
         VIEW: ABOUT
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'about' ? (
        <div className="max-w-4xl mx-auto px-8 pt-20 pb-32">
          {/* Eyebrow */}
          <p className="text-[11px] font-black tracking-[0.22em] uppercase mb-6" style={{ ...gradientText, fontFamily: INTER }}>
            P2P Settlement Layer · Powered by Chainlink CCIP
          </p>
          {/* Headline */}
          <h1 className="font-black text-white mb-10"
            style={{ fontFamily: INTER, fontSize: 'clamp(2rem, 4.5vw, 3rem)', letterSpacing: '-0.04em', lineHeight: 1.0, fontWeight: 900 }}>
            The P2P Settlement Layer<br />for the Next Era of Web3.
          </h1>
          {/* Body */}
          <div className="rounded-2xl p-8 mb-10" style={{ ...GLASS, border: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ fontFamily: INTER, fontSize: '17px', lineHeight: 1.75, color: 'rgba(255,255,255,0.80)', fontWeight: 400 }}>
              MyBarter is not a marketplace or an exchange; it is a slippage-free{' '}
              <strong style={{ color: '#fff', fontWeight: 700 }}>Robot Lawyer</strong> for asset rotation.
              By moving high-value NFT and Token positions off-market through non-custodial escrow,
              we eliminate price impact and transactional risk. Whether you&apos;re swapping Pudgy Penguins
              or rotating $AVAX ecosystem tokens, MyBarter ensures every trade is secure, atomic,
              and exactly as negotiated.
            </p>
          </div>
          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { value: '72h',    label: 'Escrow Window',     color: '#22d3ee' },
              { value: '0%',     label: 'Slippage',          color: '#a78bfa' },
              { value: '4',      label: 'Chains at Launch',  color: '#06b6d4' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl px-6 py-5 text-center"
                style={{ ...GLASS, border: `1px solid ${s.color}25`, boxShadow: `0 0 24px ${s.color}0D` }}>
                <p className="text-3xl font-black mb-1" style={{ fontFamily: INTER, color: s.color, letterSpacing: '-0.04em' }}>{s.value}</p>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: HOW-TO
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'howTo' ? (
        <div className="max-w-4xl mx-auto px-8 pt-20 pb-32">
          <p className="text-[11px] font-black tracking-[0.22em] uppercase mb-6" style={{ ...gradientText, fontFamily: INTER }}>
            Step-by-Step Guide
          </p>
          <h1 className="font-black text-white mb-12"
            style={{ fontFamily: INTER, fontSize: 'clamp(2rem, 4.5vw, 3rem)', letterSpacing: '-0.04em', lineHeight: 1.0, fontWeight: 900 }}>
            Mastering the Rotation.
          </h1>
          <div className="flex flex-col gap-4 mb-12">
            {[
              {
                num: '01', color: '#22d3ee',
                title: 'List',
                body: 'Select an NFT or Token from your inventory and tap Initiate Trade. For token rotations, simply enter the amount you wish to offer. Confirm the transaction and your listing is live instantly.',
              },
              {
                num: '02', color: '#a78bfa',
                title: 'Negotiate',
                body: 'Use the private, secure chat to hammer out the details, including the optional $100 Stablecoin Sweetener that keeps NFT trades commission-free and flexible.',
              },
              {
                num: '03', color: '#06b6d4',
                title: 'Escrow',
                body: 'Once an offer is confirmed, the Robot Lawyer Vault locks both assets atomically for 72 hours via Chainlink CCIP. Neither party can unilaterally withdraw.',
              },
              {
                num: '04', color: '#34d399',
                title: 'Settle',
                body: 'The counterparty accepts, and the exchange executes atomically across chains. No slippage. No scams. No partial fills. Exactly as negotiated, or it reverts.',
              },
            ].map(step => (
              <div key={step.num} className="rounded-2xl px-7 py-6 flex items-start gap-6"
                style={{ ...GLASS, border: `1px solid ${step.color}20`, boxShadow: `0 0 28px ${step.color}08` }}>
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${step.color}12`, border: `1px solid ${step.color}35` }}>
                  <span className="text-sm font-black" style={{ color: step.color, fontFamily: INTER }}>{step.num}</span>
                </div>
                <div>
                  <p className="text-base font-black text-white mb-1.5" style={{ fontFamily: INTER }}>{step.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)', fontFamily: INTER }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: FAQ
      ════════════════════════════════════════════════════════════════ */
      ) : view === 'faq' ? (
        <div className="max-w-4xl mx-auto px-8 pt-20 pb-32">
          <p className="text-[11px] font-black tracking-[0.22em] uppercase mb-6" style={{ ...gradientText, fontFamily: INTER }}>
            Answers
          </p>
          <h1 className="font-black text-white mb-12"
            style={{ fontFamily: INTER, fontSize: 'clamp(2rem, 4.5vw, 3rem)', letterSpacing: '-0.04em', lineHeight: 1.0, fontWeight: 900 }}>
            Frequently Asked<br />Questions.
          </h1>
          <div className="flex flex-col gap-3 mb-12">
            {[
              {
                q: 'What is the \'Robot Lawyer\'?',
                a: 'It\'s our non-custodial settlement engine that holds assets in escrow until both parties fulfill the agreement. No admin key can unilaterally release funds; both-party signatures are required for every atomic settlement.',
              },
              {
                q: 'Why the 72-hour limit?',
                a: 'To ensure liquidity isn\'t locked indefinitely. If a trade isn\'t accepted within 72 hours, your assets and any protocol fees are automatically released back to your wallet with no action required on your part.',
              },
              {
                q: 'What are the fees?',
                a: 'NFT-for-NFT swaps carry a flat $2.50 fee, while Token-for-Token rotations include a 0.75% protocol commission. Hybrid trades below the $100 sweetener threshold remain commission-free, ensuring capital efficiency for all trade sizes.',
              },
              {
                q: 'Is my chat private?',
                a: 'Yes. All negotiation logs are end-to-end encrypted and are purged immediately once a trade is settled or canceled. MyBarter never stores message content beyond the active negotiation window.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl px-7 py-6" style={{ ...GLASS, border: '1px solid rgba(255,255,255,0.10)' }}>
                <div className="flex items-start gap-4">
                  <span className="shrink-0 text-[11px] font-black mt-0.5" style={{ color: '#22d3ee', fontFamily: INTER, letterSpacing: '-0.01em' }}>
                    Q{i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-black text-white mb-2.5" style={{ fontFamily: INTER }}>{item.q}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)', fontFamily: INTER }}>{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      /* ════════════════════════════════════════════════════════════════
         VIEW: INVENTORY
      ════════════════════════════════════════════════════════════════ */
      ) : (
        <div className="max-w-7xl mx-auto px-8 pt-12 pb-24 space-y-14">

          {/* Offering-for banner */}
          {offeringFor && (
            <div className="rounded-xl px-5 py-3 flex items-center justify-between"
              style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.30)' }}>
              <div>
                <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>
                  Offering for:{' '}
                  <span style={{ color: '#22d3ee' }}>
                    {offeringFor.offering[0]?.type === 'token'
                      ? `${offeringFor.offering[0].amount} ${offeringFor.offering[0].symbol} from ${offeringFor.user}`
                      : `${offeringFor.offering[0]?.collection} ${offeringFor.offering[0]?.id} from ${offeringFor.user}`}
                  </span>
                  {' '}· Select a matching {offerTargetType === 'nft' ? 'NFT' : 'token'} and click{' '}
                  <span className="text-white font-black">Offer</span>
                </p>
                <p className="text-[10px] font-black text-white/55 mt-0.5">
                  Only {offerTargetType === 'nft' ? 'NFT ↔ NFT' : 'Token ↔ Token'} trades allowed · no mixed types
                </p>
              </div>
              <button onClick={() => { setOfferingFor(null); setSelected(new Set()); }}
                className="text-white/50 hover:text-white transition-colors text-lg leading-none ml-4">×</button>
            </div>
          )}

          {/* Token Grid (4-col) */}
          {showAssetsSection && <div>
            <SectionHeader
              title="My Assets"
              sub="Testnet balances — Fuji · Sepolia · Amoy"
              button={
                <GlassBtn
                  disabled={!hasAssetSelection}
                  label={invBtnLabel}
                  onClick={() => {
                    if (inOfferMode && hasAssetSelection) { handleOffer(); return; }
                    if (!inOfferMode && hasAssetSelection) {
                      const asset = getSelectedAsset();
                      if (asset) { setInitiateAsset(asset); setInitiateAmount(asset.type === 'token' ? (asset.amount ?? '').replace(/,/g, '') : ''); }
                    }
                  }}
                />
              }
            />
            <FilterRow cf={assetChainFilter} setCf={setAssetChainFilter} cwd={chainsWithAssets}
              search={assetSearch} setSearch={setAssetSearch} ph="Search assets..." />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {visibleAssets.map(a => {
                const isSel = selected.has(a.symbol);
                return (
                  <div key={a.symbol} onClick={() => toggleKey(a.symbol)}
                    className="rounded-xl px-3 py-3 flex items-center gap-3 cursor-pointer transition-all"
                    style={{ background: isSel ? `${a.color}15` : 'rgba(255,255,255,0.05)', border: `1px solid ${isSel ? `${a.color}60` : 'rgba(255,255,255,0.14)'}` }}>
                    <div className="shrink-0"><TokenIcon symbol={a.symbol} size={22} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black text-white leading-none mb-0.5" style={{ fontFamily: INTER }}>{a.symbol}</p>
                      <p className="text-[10px] leading-none" style={{ color: 'rgba(255,255,255,0.72)' }}>{a.chain}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[12px] font-black text-white leading-none mb-0.5" style={{ fontFamily: INTER }}>{a.usd}</p>
                      <p className="text-[10px] leading-none" style={{ color: 'rgba(255,255,255,0.72)' }}>{a.balance}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>}

          {/* NFT Collections (5-col) */}
          {showNFTsSection && (
            <div>
              {drillCollection ? (
                <>
                  <BackBtn label="All Collections" onClick={() => setSelectedCollection(null)} />
                  <SectionHeader
                    title={drillCollection.name}
                    sub={`${drillCollection.nfts.length} item${drillCollection.nfts.length !== 1 ? 's' : ''}`}
                    button={
                      <GlassBtn
                        disabled={!hasNFTSelection}
                        label={invBtnLabel}
                        onClick={() => {
                          if (inOfferMode && hasNFTSelection) { handleOffer(); return; }
                          if (!inOfferMode && hasNFTSelection) {
                            const asset = getSelectedAsset();
                            if (asset) { setInitiateAsset(asset); setInitiateAmount(''); }
                          }
                        }}
                      />
                    }
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {drillCollection.nfts.map(nft => {
                      const key   = `${drillCollection.name}:${nft.id}`;
                      const isSel = selected.has(key);
                      return (
                        <div key={key} onClick={() => toggleKey(key)}
                          className="rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all"
                          style={{ ...GLASS, border: `${isSel ? 2 : 1}px solid ${isSel ? drillCollection.color : `${drillCollection.color}44`}`, boxShadow: isSel ? `0 0 18px ${drillCollection.color}44` : `0 0 12px ${drillCollection.color}12` }}>
                          <div className="w-full aspect-square rounded-lg flex items-center justify-center overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${drillCollection.color}20 0%, rgba(255,255,255,0.03) 100%)`, border: `1px solid ${drillCollection.color}25` }}>
                            <NFTImageSlot image={nft.image} name={drillCollection.name} color={drillCollection.color} />
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-[11px] font-black text-white" style={{ fontFamily: INTER }}>{nft.id}</p>
                            {isSel && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: `${drillCollection.color}22`, color: drillCollection.color }}>✓</span>}
                          </div>
                          {nft.traits && nft.traits.length > 0 && (
                            <div className="grid grid-cols-2 gap-1.5">
                              {nft.traits.slice(0, 4).map(t => (
                                <div key={t.key} className="rounded-lg px-2 py-1.5 text-center"
                                  style={{ background: `${drillCollection.color}0D`, border: `1px solid ${drillCollection.color}25` }}>
                                  <p className="text-[8px] font-black uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.55)' }}>{t.key}</p>
                                  <p className="text-[10px] font-black text-white mt-0.5" style={{ fontFamily: INTER }}>{t.value}</p>
                                  {t.rarity && <p className="text-[8px] font-black mt-0.5" style={{ color: drillCollection.color }}>{t.rarity}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <SectionHeader
                    title="My Collections"
                    sub="NFT assets eligible for barter"
                    button={
                      <GlassBtn
                        disabled={!hasNFTSelection}
                        label={invBtnLabel}
                        onClick={() => {
                          if (inOfferMode && hasNFTSelection) { handleOffer(); return; }
                          if (!inOfferMode && hasNFTSelection) {
                            const asset = getSelectedAsset();
                            if (asset) { setInitiateAsset(asset); setInitiateAmount(''); }
                          }
                        }}
                      />
                    }
                  />
                  <FilterRow cf={activeChain} setCf={setActiveChain} cwd={chainsWithData}
                    search={searchQuery} setSearch={setSearchQuery} ph="Search collections..." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleCols.map(c => (
                      <div key={c.name} onClick={() => setSelectedCollection(c.name)}
                        className="rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all hover:scale-[1.01]"
                        style={{ ...GLASS, border: `1px solid ${c.color}55`, boxShadow: `0 0 28px ${c.color}1E` }}>
                        {/* Banner */}
                        <div className="w-full h-28 rounded-xl overflow-hidden flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${c.color}22 0%, rgba(255,255,255,0.03) 100%)`, border: `1px solid ${c.color}2A` }}>
                          <BannerSlot banner={c.banner} name={c.name} color={c.color} />
                        </div>
                        {/* Name + verified + item count */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-black text-white" style={{ fontFamily: INTER }}>{c.name}</p>
                            <IconShield />
                          </div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}35` }}>
                            {c.nfts.length} items
                          </span>
                        </div>
                      </div>
                    ))}
                    {visibleCols.length === 0 && (
                      <p className="col-span-3 text-center text-white/78 text-sm py-10">No collections match your filter.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.08] py-10 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'rgba(255,255,255,0.40)' }}>Live Across Major Chains</p>
          <div className="flex justify-center items-center gap-8 text-[11px] font-black tracking-[0.2em]">
            <span className="flex items-center gap-1.5" style={{ color: '#E84142' }}><IconAVAX />AVALANCHE (HUB)</span>
            <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#627EEA' }}><IconETH />ETHEREUM</span>
            <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#8247E5' }}><IconPOL />POLYGON</span>
            <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
            <span className="flex items-center gap-1.5" style={{ color: '#F0B90B' }}><IconBNB />BNB CHAIN</span>
          </div>
        </div>
        <div className="border-t border-white/[0.08] pt-6 flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-[0.35em] font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Secured by{' '}<span className="font-black" style={gradientText}>Chainlink</span>{' '}&amp;{' '}<span className="font-black" style={gradientText}>Pyth</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.35em] font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>Non-Custodial</p>
        </div>
      </footer>
    </main>
  );
}
