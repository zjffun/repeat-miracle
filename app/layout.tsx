import type { Metadata } from "next";
import { Inter } from "next/font/google";

import MwcImport from "./components/mwc-import";

import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Repeat Miracle",
  description: "Our everyday lives may, in fact, be a series of miracles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <MwcImport></MwcImport>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
