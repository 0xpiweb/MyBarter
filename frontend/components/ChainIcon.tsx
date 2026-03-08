"use client";

import { useState } from "react";
import Image from "next/image";
import { getChain } from "@/lib/chains";

interface ChainIconProps {
  chainId: number;
  size?: number;
  className?: string;
}

export function ChainIcon({ chainId, size = 32, className = "" }: ChainIconProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const chain = getChain(chainId);

  if (!chain) return null;

  const { color, name, symbol, iconPath } = chain;
  const aura = `${color}33`; // 20% alpha = hex "33"
  const initials = symbol.slice(0, 3).toUpperCase();

  const sharedStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: `1px solid ${color}`,
    boxShadow: `0 0 ${Math.round(size * 0.5)}px ${Math.round(size * 0.15)}px ${aura}`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  };

  if (imgFailed) {
    return (
      <span
        style={{
          ...sharedStyle,
          backgroundColor: `${color}1A`,
          color,
          fontSize: Math.round(size * 0.34),
          fontWeight: 500,
          textTransform: "capitalize",
          letterSpacing: "0.01em",
          userSelect: "none",
        }}
        className={className}
        title={name}
      >
        {initials}
      </span>
    );
  }

  return (
    <span style={sharedStyle} className={className} title={name}>
      <Image
        src={iconPath}
        alt={name}
        width={size}
        height={size}
        style={{ objectFit: "cover" }}
        onError={() => setImgFailed(true)}
      />
    </span>
  );
}
