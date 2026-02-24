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
        {/* Preload background images to prevent flash on route transitions */}
        <link rel="preload" as="image" href="/images/WW-Website-BG-Day-V1-4K.png" type="image/png" />
        <link rel="preload" as="image" href="/images/WW-Website-BG-Night-V1-4K.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
