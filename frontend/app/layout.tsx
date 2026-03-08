import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Load Inter with all weights needed for font-black (900) and font-bold (700)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyBarter — Cross-Chain P2P Settlement",
  description: "The Robot Lawyer. Trade NFTs and tokens across chains without slippage.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={inter.className}
        style={{ margin: 0, padding: 0, WebkitFontSmoothing: "antialiased" }}
      >
        {children}
      </body>
    </html>
  );
}
