import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "逆張りシミュレーター | US株ディップ",
  description: "落ちたけど壊れていない銘柄を探す JP向け紙トレアプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="max-w-6xl mx-auto p-4">{children}</body>
    </html>
  );
}
