export interface ChainConfig {
  id: number;
  name: string;
  symbol: string;
  color: string;
  ccipSelector: string;
  iconPath: string;
}

export const CHAINS: Record<number, ChainConfig> = {
  1: {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    color: "#627EEA",
    ccipSelector: "5009297550715157269",
    iconPath: "/icons/chains/ethereum.png",
  },
  43114: {
    id: 43114,
    name: "Avalanche",
    symbol: "AVAX",
    color: "#E84142",
    ccipSelector: "6433500567565415381",
    iconPath: "/icons/chains/avalanche.png",
  },
  137: {
    id: 137,
    name: "Polygon",
    symbol: "POL",
    color: "#8247E5",
    ccipSelector: "4051577828743386545",
    iconPath: "/icons/chains/polygon.png",
  },
};

export function getChain(chainId: number): ChainConfig | undefined {
  return CHAINS[chainId];
}

export const CHAIN_IDS = {
  ETHEREUM:  1,
  AVALANCHE: 43114,
  POLYGON:   137,
} as const;
