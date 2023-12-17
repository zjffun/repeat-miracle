import type { Metadata } from "next";

import MwcImport from "./components/mwc-import";

import "./globals.scss";

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
        <meta name="application-name" content="Repeat Miracle" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Repeat Miracle" />
        <meta name="description" content="Set and check routines." />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* https://nextjs.org/docs/messages/react-hydration-error#common-ios-issues */}
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />

        <link rel="apple-touch-icon" href="/favicon_io/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon_io/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon_io/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon_io/favicon.ico" />

        <link rel="manifest" href="/manifest.json" />

        <link
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <MwcImport></MwcImport>
      <body>{children}</body>
    </html>
  );
}
