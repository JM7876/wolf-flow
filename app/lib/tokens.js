/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Universal Design Tokens
   ─────────────────────────────────────────────────────────
   Single source of truth for colors, fonts, glass, and
   interaction styles across all portal services.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */

/* ═══ UNIVERSAL PALETTE TOKENS ═══ */
export const WF = {
  accent: "#9583E9", accentLight: "#BD95EE", accentDark: "#7a6bc7",
  accentGlow: "rgba(149,131,233,0.25)", pink: "#DDACEF", pinkLight: "#F0CDF3",
  warm: "#ECAAD0", warmLight: "#FDD2D7", coral: "#FDC3BE",
  green: "#40916c", greenLight: "#52b788",
  red: "#e63946", redGlow: "rgba(230,57,70,0.15)",
};

export const FC = {
  dark: "#1A1628", darkCard: "#221C35",
  turquoise: "#9583E9", turquoiseLight: "#BD95EE", turquoiseGlow: "rgba(149,131,233,0.3)",
  maroon: "#ECAAD0", maroonLight: "#FDD2D7",
  gold: "#BD95EE", goldLight: "#DDACEF",
  green: "#40916c", greenLight: "#52b788",
  red: "#e63946", redLight: "#ff6b6b",
  textPrimary: "#FFFFFF", textSecondary: "rgba(255,255,255,0.82)",
  textDim: "rgba(255,255,255,0.52)", border: "rgba(149,131,233,0.15)",
  glass: "rgba(255,255,255,0.06)",
};

export const FONT = "'Montserrat Alternates', -apple-system, BlinkMacSystemFont, sans-serif";
export const MONO = "'Montserrat Alternates', monospace";
export const WOLF_LOGO = "/images/wolf-logo.png";

export const CLICK = {
  hover: {
    borderColor: "rgba(255,255,255,0.22)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 30px rgba(149,131,233,0.15)",
  },
  duration: "0.3s ease",
};

export const GLASS = {
  default: {
    background: "linear-gradient(168deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.04) 100%)",
    backdropFilter: "blur(var(--glass-blur,24px)) brightness(var(--glass-brightness,1.12)) saturate(var(--glass-saturation,1.4)) contrast(var(--glass-contrast,1.05))",
    WebkitBackdropFilter: "blur(var(--glass-blur,24px)) brightness(var(--glass-brightness,1.12)) saturate(var(--glass-saturation,1.4)) contrast(var(--glass-contrast,1.05))",
    transform: "translateY(var(--glass-displacement,0px))",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), 0 0 var(--glass-bezel-depth,24px) rgba(149,131,233,0.06), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04)",
  },
};

export const glassPill = {
  padding: "14px 40px", borderRadius: 28, position: "relative", overflow: "hidden",
  backdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4)) brightness(var(--glass-brightness,1.12)) contrast(var(--glass-contrast,1.05))",
  WebkitBackdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4)) brightness(var(--glass-brightness,1.12)) contrast(var(--glass-contrast,1.05))",
  background: "linear-gradient(168deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.04) 100%)",
  fontSize: 14, fontWeight: 500, letterSpacing: "0.06em",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.04)",
  cursor: "pointer", fontFamily: FONT,
  transition: `border-color ${CLICK.duration}, box-shadow ${CLICK.duration}, transform ${CLICK.duration}`,
};

export const inputBase = {
  background: "linear-gradient(168deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
  border: "1px solid rgba(255,255,255,0.13)", borderRadius: 12,
  padding: "12px 14px", fontSize: 14, fontFamily: FONT, color: FC.textPrimary,
  outline: "none", caretColor: WF.accent, width: "100%", boxSizing: "border-box",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 6px rgba(0,0,0,0.06)",
  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
  transition: `border-color ${CLICK.duration}, box-shadow ${CLICK.duration}`,
};

/* ═══ WORKFLOW STEPS (mirrors CommandCenter-v3) ═══ */
export const WORKFLOW_STEPS = ["REQUEST", "TRIAGE", "BRIEF", "ASSIGN", "CREATE", "REVIEW", "REVISE", "APPROVE", "DELIVER", "ARCHIVE"];
export const STEP_DESC = [
  "Your request has been received",
  "Reviewing your submission for completeness",
  "Creative brief is being prepared",
  "Assigned to a team member",
  "Your deliverable is being created",
  "Project is under team review",
  "Revisions being applied",
  "Final approval from Director",
  "Deliverable is being distributed",
  "Project complete and archived",
];
export const STEP_ICONS = ["📥", "🔍", "📝", "👤", "🎨", "👁️", "🔄", "✅", "📤", "📦"];

/* ═══ DEPARTMENTS ═══ */
export const DEPARTMENTS = [
  "Administration", "Chairman's Office", "Communications", "Cultural", "Education",
  "Enrollment", "Executive Office", "Facilities", "Finance", "Health Services",
  "Housing", "Human Resources", "IT", "Language Dept", "Legal",
  "Natural Resources", "Recreation", "Social Services", "Tribal Council", "Wellness",
];

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
