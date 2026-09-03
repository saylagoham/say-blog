import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Say no more",
  description: "Say no more — 세이의 삶, 런던, 돈, 영어, 여행을 기록하는 공간.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
