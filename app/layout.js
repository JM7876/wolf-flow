/* ═══════════════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Root Layout
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════════════ */

import "./globals.css";

export const metadata = {
  title: "Wolf Flow Communications Portal",
  description: "Request services from Wolf Flow Solutions — design, photography, writing, web updates, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/* Preload the default (day) BG as WebP; night variant loaded lazily on toggle */}
        <link rel="preload" as="image" href="/images/WW-Website-BG-Day-V1.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
