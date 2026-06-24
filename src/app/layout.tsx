import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pubg Accounts MN - PUBG Mobile Аккаунт & Түрээс",
  description: "Баталгаатай, аюулгүй PUBG Mobile аккаунт худалдан авалт болон түрээсийн үйлчилгээ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="mn">
      <body className="bg-[#060B18] text-slate-200 antialiased">{children}</body>
    </html>
  );
}
