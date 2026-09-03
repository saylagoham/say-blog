import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Say",
  description: "Say's personal publishing home — life, London, money, English, travel, and everything in between.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
