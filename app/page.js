/* ═══════════════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Communications Portal
   Created and Authored by Johnathon Moulds © 2026
═══════════════════════════════════════════════════════════════════ */
"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
const WolfFlowPortal = dynamic(() => import("./WolfPortal-v1"), { ssr: false });
export default function Home() {
  return (
    <Suspense fallback={null}>
      <WolfFlowPortal />
    </Suspense>
  );
}
// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
