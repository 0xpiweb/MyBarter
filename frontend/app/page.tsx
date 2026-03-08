'use client';

import { useState } from 'react';
import MyBarterLogo from '@/components/MyBarterLogo';
import { AssetCard } from '@/components/AssetCard';

export default function MyBarterApp() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#ededed] selection:bg-cyan-500/30">

      {/* ── Nav ── */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <MyBarterLogo className="w-9 h-9" />
          <span className="text-xl font-bold tracking-tight">MyBarter</span>
        </div>

        <button
          onClick={() => setIsConnected(!isConnected)}
          className={
            isConnected
              ? 'flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl text-white/80 px-5 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-all'
              : 'bg-cyan-400 text-black px-7 py-2 rounded-full font-bold hover:bg-cyan-300 transition-all text-sm'
          }
        >
          {isConnected && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]" />
          )}
          {isConnected ? '0x...f331' : 'Connect Wallet'}
        </button>
      </nav>

      {!isConnected ? (
        /* ── Hero (disconnected) ── */
        <section className="max-w-5xl mx-auto text-center pt-28 pb-20 px-6">
          <p className="text-cyan-400 uppercase tracking-[0.35em] text-xs font-bold mb-8">
            Browse. Offer. Swap.
          </p>

          <h1 className="text-7xl md:text-8xl font-black leading-[1.05] mb-8 tracking-tight">
            The Slippage-Free<br />
            <span className="text-white/70">Settlement Layer</span><br />
            for Asset Rotation
          </h1>

          <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-14 leading-relaxed">
            Move high-value NFT and Token positions off-market via the{' '}
            <span className="text-white font-semibold">Robot Lawyer Escrow</span>.
            Secure, atomic, and zero price impact across chains.
          </p>

          <button
            onClick={() => setIsConnected(true)}
            className="bg-cyan-400 text-black px-10 py-4 rounded-full font-bold text-lg
                       hover:bg-cyan-300 transition-all shadow-[0_0_40px_rgba(34,211,238,0.2)]"
          >
            Connect Wallet
          </button>

          <p className="mt-20 text-xs uppercase tracking-[0.3em] text-white/20">
            Connect your wallet to view your assets
          </p>
        </section>
      ) : (
        /* ── Dashboard (connected) ── */
        <div className="max-w-7xl mx-auto px-8 pt-14 pb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Your Assets</h2>
              <p className="text-sm text-white/30 tracking-wide">
                Testnet balances — Fuji · Sepolia · Amoy
              </p>
            </div>
            <button
              className="bg-cyan-400 text-black px-8 py-3 rounded-full font-bold text-sm
                         hover:bg-cyan-300 transition-all shadow-[0_0_30px_rgba(34,211,238,0.15)]"
            >
              Propose a Trade
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AssetCard
              assetName="Avalanche"
              balance="5.00"
              tokenSymbol="AVAX"
              chainId={43114}
              isLocked={false}
            />
            <AssetCard
              assetName="Ethereum"
              balance="0.25"
              tokenSymbol="ETH"
              chainId={1}
              isLocked={false}
            />
            <AssetCard
              assetName="Polygon"
              balance="150.00"
              tokenSymbol="POL"
              chainId={137}
              isLocked={false}
            />
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-14 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-7">
          Live Across Major Chains
        </p>
        <div className="flex justify-center gap-10 text-xs font-bold tracking-widest">
          <span className="text-orange-400">AVALANCHE</span>
          <span className="text-blue-400">ETHEREUM</span>
          <span className="text-purple-400">POLYGON</span>
          <span className="text-yellow-400">BNB CHAIN</span>
        </div>
      </footer>

    </main>
  );
}
