/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Visual Design Service
   ─────────────────────────────────────────────────────────
   Route: /services/visual-design
   Full-page experience for the 9-step Visual Design wizard.
   Inherits WF root layout (background, fonts, dark theme).
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
"use client";

import { useRouter } from "next/navigation";
import { WF, FC, FONT, CLICK, GLASS, glassPill } from "../../lib/tokens";
import { GlassCard, PortalBackground, PageNav } from "../../lib/components";

export default function VisualDesignPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", fontFamily: FONT, color: FC.textPrimary, position: "relative", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,500&display=swap" rel="stylesheet" />

      <PortalBackground nightMode={false} />

      {/* Back to Portal button */}
      <button
        onClick={() => router.push("/")}
        style={{
          position: "fixed", top: 18, left: 18, zIndex: 300,
          background: FC.glass,
          border: `1px solid ${FC.border}`, borderRadius: 12,
          padding: "8px 16px", cursor: "pointer", fontSize: 12, fontFamily: FONT,
          fontWeight: 500, color: FC.textSecondary,
          backdropFilter: "blur(var(--glass-blur,18px))", WebkitBackdropFilter: "blur(var(--glass-blur,18px))",
          transition: `all ${CLICK.duration}`,
          display: "flex", alignItems: "center", gap: 6,
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; e.currentTarget.style.color = FC.textPrimary; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.color = FC.textSecondary; }}
        aria-label="Back to portal"
      >
        {"\u2190 Back to Services"}
      </button>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", maxWidth: 560, padding: "0 24px" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20, margin: "0 auto 20px",
              background: `linear-gradient(135deg, ${WF.accent}25, ${WF.accent}08)`,
              border: `1px solid ${WF.accent}35`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
              boxShadow: `0 4px 24px ${WF.accentGlow}`,
            }}>{"✦"}</div>

            <h1 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 32, color: FC.textPrimary, marginBottom: 8 }}>
              <span style={{ color: WF.accent }}>{"Visual Design"}</span>{" Request"}
            </h1>
            <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: FC.textSecondary, lineHeight: 1.6, marginBottom: 32 }}>
              {"The full 9-step visual design wizard will be integrated here. This route is wired and ready \u2014 the form's NHBP logic will be restyled to Wolf Flow tokens and placed in this page."}
            </p>

            <GlassCard style={{ padding: "24px 20px", maxWidth: 440, margin: "0 auto" }}>
              <div style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT, color: FC.textDim, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                {"Integration Status"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Route wired", status: true },
                  { label: "Shared tokens imported", status: true },
                  { label: "Portal navigation connected", status: true },
                  { label: "VD form restyled & integrated", status: false },
                  { label: "File upload (Vercel Blob)", status: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: FC.glass }}>
                    <span style={{ fontSize: 14 }}>{item.status ? "✅" : "⏳"}</span>
                    <span style={{ fontSize: 12, fontFamily: FONT, color: item.status ? FC.textSecondary : FC.textDim }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div style={{ marginTop: 24 }}>
              <button
                onClick={() => router.push("/")}
                style={{
                  ...glassPill, padding: "14px 36px", fontSize: 13,
                  border: "1px solid rgba(149,131,233,0.3)", color: "rgba(189,149,238,0.9)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(149,131,233,0.3)"; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
              >
                {"\u2190 Return to Portal"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
