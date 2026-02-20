/* ═══════════════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Command Center
   Created and Authored by Johnathon Moulds © 2026
═══════════════════════════════════════════════════════════════════ */
"use client";
import dynamic from "next/dynamic";
const CommandCenter = dynamic(() => import("./CommandCenter"), { ssr: false });
export default function Home() {
  return <CommandCenter />;
}
// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
