"use client";

import { useState } from "react";
import MyBarterLogo from "@/components/MyBarterLogo";
import { AssetCard } from "@/components/AssetCard";

// TODO: replace handleConnect / handleDisconnect with RainbowKit ConnectButton
// once WagmiConfig + RainbowKitProvider are wired in a providers.tsx wrapper.
// Remove the local `connected` state at that point and drive off useAccount().

export default function MyBarterLanding() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");

  function handleConnect() {
    // Placeholder — swap for RainbowKit ConnectButton.Custom trigger
    setConnected(true);
    setAddress("0xpiw...eb42");
  }

  function handleDisconnect() {
    setConnected(false);
    setAddress("");
  }

  return (
    <main className="min-h-screen bg-[#020408] text-white selection:bg-cyan-500/30">

      {/* ── Nav ── */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <MyBarterLogo className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">MyBarter</span>
        </div>

        {connected ? (
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl
                       text-white/80 px-5 py-2 rounded-full text-sm font-medium
                       hover:bg-white/10 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)]" />
            {address}
          </button>
        ) : (
          <button
            onClick={handleConnect}
            className="bg-cyan-400 text-black px-6 py-2 rounded-full font-bold
                       hover:bg-cyan-300 transition-all"
          >
            Connect Wallet
          </button>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto text-center pt-24 pb-16 px-4">
        <h2 className="text-blue-500 uppercase tracking-[0.3em] text-sm font-bold mb-6">
          Browse. Offer. Swap.
        </h2>
        <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-[1.1]">
          The Slippage-Free Settlement Layer <br />
          <span className="text-white/90">for Asset Rotation</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
          Move high-value NFT and Token positions off-market via the{" "}
          <span className="text-white font-medium">Robot Lawyer Escrow</span>.
          Secure, atomic, and zero price impact.
        </p>

        {/* ── Asset Cards — active only when wallet is connected ── */}
        {connected ? (
          <div className="flex flex-wrap justify-center gap-6 mt-16">
            <AssetCard
              assetName="Wrapped AVAX"
              balance="1,800.00"
              tokenSymbol="AVAX"
              chainId={43114}
              isLocked={false}
            />
            <AssetCard
              assetName="Polygon Asset"
              balance="2,500.00"
              tokenSymbol="POL"
              chainId={137}
              isLocked={false}
            />
          </div>
        ) : (
          <p className="mt-16 text-sm text-white/30 tracking-widest uppercase">
            Connect your wallet to view your assets
          </p>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="mt-20 border-t border-white/5 py-12 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">
          Live Across Major Chains
        </p>
        <div className="flex justify-center gap-8 text-xs font-bold">
          <span className="text-orange-500">AVALANCHE (HUB)</span>
          <span className="text-purple-500">POLYGON</span>
          <span className="text-yellow-500">BNB CHAIN</span>
          <span className="text-blue-500">ETHEREUM</span>
        </div>
      </footer>

    </main>
  );
}
