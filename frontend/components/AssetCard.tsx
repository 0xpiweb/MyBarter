"use client";

import { ChainIcon } from "@/components/ChainIcon";

interface AssetCardProps {
  assetName: string;
  balance: string;
  tokenSymbol: string;
  chainId: number;
  isLocked?: boolean;
}

// ── Triple Threat SVG icons ───────────────────────────────────────────────────

function IconShield() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconSync() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

// ── Safety badges ─────────────────────────────────────────────────────────────

function EconomicSafetyBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                 text-emerald-300 border border-emerald-500/30 bg-emerald-500/10"
      style={{ boxShadow: "0 0 8px 1px rgba(52,211,153,0.2)" }}
    >
      {/* Radial green dot */}
      <span
        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
        style={{ boxShadow: "0 0 4px 2px rgba(52,211,153,0.5)" }}
      />
      Slippage-Free
    </span>
  );
}

function TransactionalSafetyBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                 text-sky-300 border border-sky-500/30 bg-sky-500/10"
    >
      <IconShield />
      Scam-Proof
    </span>
  );
}

function CapitalEfficiencyBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                 text-violet-300 border border-violet-500/30 bg-violet-500/10"
    >
      <IconSync />
      Asset Rotation
    </span>
  );
}

// ── AssetCard ─────────────────────────────────────────────────────────────────

export function AssetCard({
  assetName,
  balance,
  tokenSymbol,
  chainId,
  isLocked = false,
}: AssetCardProps) {
  return (
    <div
      className={`
        relative rounded-2xl p-4
        bg-white/5 backdrop-blur-xl
        border border-white/10
        transition-opacity duration-300
        ${isLocked ? "opacity-60 pointer-events-none" : "opacity-100"}
      `}
    >
      {/* Locked overlay label */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-10">
          <span className="text-xs font-medium text-white/50 tracking-widest uppercase">
            Locked
          </span>
        </div>
      )}

      {/* Header: chain icon + asset name */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ChainIcon chainId={chainId} size={28} />
          <span className="text-sm font-medium text-white/90">{assetName}</span>
        </div>
        <span className="text-xs text-white/40 font-mono">{tokenSymbol}</span>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <p className="text-2xl font-semibold text-white tracking-tight">
          {balance}
          <span className="ml-1.5 text-sm font-normal text-white/50">{tokenSymbol}</span>
        </p>
      </div>

      {/* Triple Threat Safety Stack */}
      <div className="flex flex-wrap gap-1.5">
        <EconomicSafetyBadge />
        <TransactionalSafetyBadge />
        <CapitalEfficiencyBadge />
      </div>
    </div>
  );
}
