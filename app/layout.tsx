import "./globals.css";
import { DM_Sans, Syne } from "next/font/google";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "VertiCall",
  description: "Plateforme d'appels d'offres espaces verts"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
