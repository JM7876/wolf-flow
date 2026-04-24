/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — DIY Form Builder (Placeholder)
   ─────────────────────────────────────────────────────────
   Route: /services/form-builder
   Status: NOT YET BUILT.

   The previous implementation generated client-only "WF-FORM-xxx"
   tracking codes and showed users a fake "wolfflow.solutions/forms/{slug}"
   URL — but the forms were never persisted, no public render route
   existed, and no submission handler was wired up. Users who built
   a form and shared the URL would have hit a 404, and any responses
   would have gone nowhere.

   Replaced with a clear Coming Soon panel so users are not misled.
   When this feature is built for real it needs:
     * `forms` table in Supabase (questions as JSONB)
     * `form_submissions` table (responses keyed by form id)
     * `app/forms/[slug]/page.js` public render route
     * Submission handler that writes to form_submissions
     * Notion sync of submissions (or a dedicated database in Notion)

   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
"use client";

import { useRouter } from "next/navigation";
import { WF, FC, FONT, CLICK, glassPill } from "../../lib/tokens";
import { GlassCard, PortalBackground, Footer, useNightMode, SettingsDropdown } from "../../lib/components";

export default function FormBuilderPage() {
  const router = useRouter();
  const { nightMode, toggleNight } = useNightMode();

  return (
    <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <PortalBackground nightMode={nightMode} />
      <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px 100px", textAlign: "center", zIndex: 5, position: "relative", maxWidth: 720, margin: "0 auto", width: "100%" }}>

        <div style={{ fontSize: 11, color: FC.textDim, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
          {"Wolf Flow / Form Builder"}
        </div>

        <h1 style={{ fontSize: 38, fontWeight: 200, margin: "0 0 14px", fontFamily: FONT, letterSpacing: "-0.01em" }}>
          {"Form Builder is coming soon"}
        </h1>

        <p style={{ fontSize: 15, color: FC.textSecondary, lineHeight: 1.7, maxWidth: 520, margin: "0 0 32px" }}>
          {"This will let you build custom intake forms — questionnaires, surveys, registration sheets, RSVPs — and share a public link for responses. We're still building it. Today it's a placeholder so we don't promise something the platform can't deliver yet."}
        </p>

        <GlassCard style={{ padding: "20px 24px", maxWidth: 520, marginBottom: 28, textAlign: "left" }}>
          <div style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontWeight: 600 }}>
            {"What's planned"}
          </div>
          <ul style={{ margin: 0, padding: "0 0 0 18px", color: FC.textSecondary, fontSize: 13, lineHeight: 1.85 }}>
            <li>{"Drag-and-drop question builder (text, choice, file upload, dates, signatures)"}</li>
            <li>{"A public URL you can share by link or QR code"}</li>
            <li>{"Submissions land in your Notion admin database alongside other Wolf Flow requests"}</li>
            <li>{"Response export to spreadsheet"}</li>
          </ul>
        </GlassCard>

        <p style={{ fontSize: 12, color: FC.textDim, lineHeight: 1.7, maxWidth: 460, marginBottom: 28 }}>
          {"In the meantime, if you need to collect responses for an event or program, submit a "}
          <a href="/services/community-outreach" style={{ color: WF.accentLight, textDecoration: "underline" }}>{"Community Outreach"}</a>
          {" or "}
          <a href="/services/visual-design" style={{ color: WF.accentLight, textDecoration: "underline" }}>{"Visual Design"}</a>
          {" request and the Communications team can help you design what you need."}
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => router.push("/?page=services")} style={{
            ...glassPill, padding: "12px 26px", fontSize: 13, fontWeight: 600,
            background: `linear-gradient(135deg, ${WF.accent}22, ${WF.accent}10)`,
            borderColor: `${WF.accent}50`, color: WF.accentLight,
            boxShadow: `0 4px 20px ${WF.accentGlow}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}50`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}`; }}
          >
            {"Back to Services"}
          </button>
          <button onClick={() => router.push("/")} style={{
            ...glassPill, padding: "12px 26px", fontSize: 13,
            borderColor: "rgba(255,255,255,0.10)", color: FC.textSecondary,
          }}>
            {"Home"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
