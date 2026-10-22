import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Farming Assistant",
  description: "A multilingual assistant for farming questions",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
