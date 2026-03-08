import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyBarter — Cross-Chain P2P Settlement",
  description: "The Robot Lawyer. Trade NFTs and tokens across chains without slippage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
