'use client';

import { useState } from 'react';
import MyBarterLogo from '@/components/MyBarterLogo';

/* ─── Triple Threat card data ─────────────────────────────────────────────── */
const PILLARS = [
  {
    number: '01',
    label: 'ECONOMIC SAFETY',
    headline: "Stop 'Death Candles'",
    body: "Chainlink oracles lock the USD value at trade time. No slippage, no last-second manipulation — your position settles at the price you agreed.",
    color: '#22d3ee',      // cyan
    glow: 'rgba(34,211,238,0.15)',
  },
  {
    number: '02',
    label: 'TRANSACTIONAL SAFETY',
    headline: 'No Standoffs',
    body: "Both-party signatures required. The Robot Lawyer Escrow holds assets atomically — neither side can exit without the other, eliminating rug risk.",
    color: '#a78bfa',      // violet
    glow: 'rgba(167,139,250,0.15)',
  },
  {
    number: '03',
    label: 'CAPITAL EFFICIENCY',
    headline: 'Unlock Dead Capital',
    body: 'Bundle NFTs + tokens into a single atomic trade. Multi-asset rotations settle in one transaction or revert entirely — no partial fills, no stranded assets.',
    color: '#34d399',      // emerald
    glow: 'rgba(52,211,153,0.15)',
  },
];

/* ─── Asset card (connected state) ───────────────────────────────────────── */
const ASSETS = [
  { chain: 'Avalanche', balance: '5.00',   symbol: 'AVAX', color: '#E84142' },
  { chain: 'Ethereum',  balance: '0.25',   symbol: 'ETH',  color: '#627EEA' },
  { chain: 'Polygon',   balance: '150.00', symbol: 'POL',  color: '#8247E5' },
];

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function MyBarterApp() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#ededed]" style={{ WebkitFontSmoothing: 'antialiased' }}>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <MyBarterLogo className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-white">MyBarter</span>
        </div>

        <button
          onClick={() => setIsConnected(!isConnected)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
          style={{ boxShadow: '0 0 20px rgba(37,99,235,0.4)' }}
        >
          {isConnected ? '0x...f331' : 'Connect Wallet'}
        </button>
      </nav>

      {!isConnected ? (
        /* ── Home state ──────────────────────────────────────────────────── */
        <>
          {/* Hero */}
          <section className="max-w-5xl mx-auto text-center px-6 pt-20 pb-10">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.4em] mb-8">
              Browse · Offer · Swap
            </p>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.04] tracking-tight mb-8 text-white">
              The Slippage-Free<br />
              Settlement Layer<br />
              <span className="text-white/60">for Asset Rotation</span>
            </h1>

            <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Move high-value NFTs and tokens off-market through the{' '}
              <span className="text-white font-bold">Robot Lawyer Escrow</span>
              {' '}— atomic, scam-proof, and zero price impact across chains.
            </p>

            <button
              onClick={() => setIsConnected(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-12 py-4 rounded-2xl text-lg transition-all"
              style={{ boxShadow: '0 0 40px rgba(37,99,235,0.35)' }}
            >
              Connect Wallet
            </button>
          </section>

          {/* Triple Threat cards */}
          <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PILLARS.map((p) => (
                <div
                  key={p.number}
                  className="rounded-2xl p-7 flex flex-col gap-4"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: `0 0 40px ${p.glow}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-[0.2em]" style={{ color: p.color }}>
                      {p.number}
                    </span>
                    <span className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">
                      {p.label}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white leading-snug">
                    {p.headline}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {p.body}
                  </p>

                  <div
                    className="mt-auto pt-4 border-t text-xs font-bold uppercase tracking-widest"
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
        <div className="max-w-7xl mx-auto px-8 pt-12 pb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Your Assets</h2>
              <p className="text-sm text-white/30">Testnet balances — Fuji · Sepolia · Amoy</p>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all"
              style={{ boxShadow: '0 0 24px rgba(37,99,235,0.3)' }}
            >
              Propose a Trade
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ASSETS.map((a) => (
              <div
                key={a.symbol}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: `1px solid ${a.color}33`,
                  boxShadow: `0 0 30px ${a.color}18`,
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white/80">{a.chain}</span>
                  <span className="text-xs font-mono text-white/30">{a.symbol}</span>
                </div>

                <p className="text-3xl font-black text-white tracking-tight">
                  {a.balance}
                  <span className="text-base font-semibold ml-2" style={{ color: a.color }}>{a.symbol}</span>
                </p>

                <div className="flex flex-col gap-1.5 text-xs border-t border-white/5 pt-4">
                  {[
                    { label: 'Economic Safety',    tag: 'Slippage-Free',  color: '#22d3ee' },
                    { label: 'Transactional Safety', tag: 'Scam-Proof',   color: '#a78bfa' },
                    { label: 'Capital Efficiency', tag: 'Asset Rotation', color: '#34d399' },
                  ].map((row) => (
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
      )}

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-8 max-w-7xl mx-auto">
        {/* Live chains — centered */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/20">
            Live Across Major Chains
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold tracking-widest">
            <span className="text-orange-400">AVALANCHE (HUB)</span>
            <span className="text-blue-400">ETHEREUM</span>
            <span className="text-purple-400">POLYGON</span>
            <span className="text-yellow-400">BNB CHAIN</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/25">
            Secured by{' '}
            <span className="text-white font-bold">Chainlink</span>
            {' '}&amp;{' '}
            <span className="text-white font-bold">Pyth</span>
          </p>
        </div>
      </footer>

    </main>
  );
}
