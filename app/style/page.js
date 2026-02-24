/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Style Editor
   ─────────────────────────────────────────────────────────
   Route: /style
   Full design control — colors, typography, spacing, glass.
   Writes to CSS custom properties. Changes preview live.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
"use client";
import { useState, useCallback, useEffect } from "react";

/* Lazily inject the optional typeface stylesheet the first time the style editor mounts */
const EXTRA_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Josefin+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap";

const FONT = "'Montserrat Alternates', -apple-system, BlinkMacSystemFont, sans-serif";

const FONT_OPTIONS = [
  { label: "Montserrat Alternates", value: "'Montserrat Alternates', sans-serif" },
  { label: "DM Sans",               value: "'DM Sans', sans-serif" },
  { label: "Josefin Sans",          value: "'Josefin Sans', sans-serif" },
  { label: "Inter",                 value: "'Inter', sans-serif" },
  { label: "Space Grotesk",         value: "'Space Grotesk', sans-serif" },
  { label: "Playfair Display",      value: "'Playfair Display', serif" },
];

const DEFAULTS = {
  /* Colors */
  accent:       "#9583E9",
  accentLight:  "#BD95EE",
  pink:         "#DDACEF",
  warm:         "#ECAAD0",
  bgDark:       "#1A1628",
  bgCard:       "#221C35",
  textPrimary:  "#FFFFFF",
  textSecondary:"rgba(255,255,255,0.82)",
  textDim:      "rgba(255,255,255,0.52)",
  border:       "rgba(149,131,233,0.20)",
  /* Typography */
  fontFamily:   "'Montserrat Alternates', sans-serif",
  fontSize:     14,
  fontWeight:   400,
  letterSpacing:0,
  lineHeight:   1.6,
  headingSize:  36,
  headingWeight:200,
  /* Spacing */
  borderRadius: 18,
  cardPadding:  24,
  buttonRadius: 28,
  buttonPadding:14,
  gap:          16,
  /* Glass */
  glassBlur:    24,
  glassOpacity: 0.18,
  glassBrightness: 1.12,
  glassSaturation: 1.4,
  glassBezel:   24,
};

function set(cssVar, value) {
  document.documentElement.style.setProperty(cssVar, value);
}

function applyAll(vals) {
  set("--wf-accent",           vals.accent);
  set("--wf-accent-light",     vals.accentLight);
  set("--accent-primary",      vals.accent);
  set("--accent-violet",       vals.accentLight);
  set("--wf-accent-glow",      hexToRgba(vals.accent, 0.25));
  set("--wf-pink",             vals.pink);
  set("--wf-warm",             vals.warm);
  set("--bg-primary",          vals.bgDark);
  set("--bg-secondary",        vals.bgCard);
  set("--text-primary",        vals.textPrimary);
  set("--text-secondary",      vals.textSecondary);
  set("--text-dim",            vals.textDim);
  set("--border-soft",         vals.border);
  set("--wf-font",             vals.fontFamily);
  set("--wf-font-size",        vals.fontSize + "px");
  set("--wf-font-weight",      vals.fontWeight);
  set("--wf-letter-spacing",   vals.letterSpacing + "em");
  set("--wf-line-height",      vals.lineHeight);
  set("--wf-heading-size",     vals.headingSize + "px");
  set("--wf-heading-weight",   vals.headingWeight);
  set("--radius",              vals.borderRadius + "px");
  set("--wf-card-padding",     vals.cardPadding + "px");
  set("--wf-btn-radius",       vals.buttonRadius + "px");
  set("--wf-btn-padding",      vals.buttonPadding + "px");
  set("--wf-gap",              vals.gap + "px");
  set("--glass-blur",          vals.glassBlur + "px");
  set("--glass-opacity",       vals.glassOpacity);
  set("--glass-brightness",    vals.glassBrightness);
  set("--glass-saturation",    vals.glassSaturation);
  set("--glass-bezel-depth",   vals.glassBezel + "px");
  // Font override so inline styles also update
  let tag = document.getElementById("wf-style-override");
  if (!tag) { tag = document.createElement("style"); tag.id = "wf-style-override"; document.head.appendChild(tag); }
  tag.textContent = `*, *::before, *::after { font-family: ${vals.fontFamily} !important; font-size: ${vals.fontSize}px; }`;
}

function hexToRgba(hex, alpha) {
  try {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  } catch { return `rgba(149,131,233,${alpha})`; }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function generateTokensExport(vals) {
  return `/* Wolf Flow Tokens — exported from Style Editor */
export const WF = {
  accent: "${vals.accent}",
  accentLight: "${vals.accentLight}",
  pink: "${vals.pink}",
  warm: "${vals.warm}",
};
export const FC = {
  dark: "${vals.bgDark}",
  darkCard: "${vals.bgCard}",
  textPrimary: "${vals.textPrimary}",
  textSecondary: "${vals.textSecondary}",
  textDim: "${vals.textDim}",
  border: "${vals.border}",
};
export const FONT = "${vals.fontFamily}";
`;
}

/* ═══ UI COMPONENTS ═══ */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(189,149,238,0.7)", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid rgba(149,131,233,0.15)", fontFamily: FONT }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <label style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: FONT, flexShrink: 0, width: 140 }}>{label}</label>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>{children}</div>
    </div>
  );
}

function ColorInput({ value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input type="color" value={value.startsWith("#") ? value : "#9583E9"} onChange={e => onChange(e.target.value)}
        style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", padding: 2, background: "transparent" }}/>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: 100, padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(149,131,233,0.25)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 12, fontFamily: FONT, outline: "none" }}/>
    </div>
  );
}

function SliderInput({ value, onChange, min, max, step, unit }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <input type="range" min={min} max={max} step={step || 1} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: 140, cursor: "pointer" }}/>
      <input type="number" value={value} min={min} max={max} step={step || 1} onChange={e => onChange(Number(e.target.value))}
        style={{ width: 60, padding: "5px 8px", borderRadius: 8, border: "1px solid rgba(149,131,233,0.25)", background: "rgba(255,255,255,0.05)", color: "rgba(189,149,238,0.9)", fontSize: 12, fontFamily: FONT, outline: "none", textAlign: "right" }}/>
      {unit && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: FONT, width: 20 }}>{unit}</span>}
    </div>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(149,131,233,0.25)", background: "rgba(34,28,53,0.9)", color: "#fff", fontSize: 12, fontFamily: FONT, outline: "none", cursor: "pointer", maxWidth: 220 }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

/* ═══ PREVIEW PANEL ═══ */
function Preview({ vals }) {
  const accent = vals.accent;
  const cardBg = `linear-gradient(168deg, rgba(255,255,255,${vals.glassOpacity * 1.8}) 0%, rgba(255,255,255,${vals.glassOpacity}) 40%, rgba(255,255,255,${vals.glassOpacity * 0.5}) 100%)`;
  return (
    <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(189,149,238,0.7)", marginBottom: 4, fontFamily: FONT }}>Live Preview</div>

      {/* Card preview */}
      <div style={{ borderRadius: vals.borderRadius, padding: vals.cardPadding, background: cardBg, border: `1px solid ${vals.border}`, backdropFilter: `blur(${vals.glassBlur}px) brightness(${vals.glassBrightness}) saturate(${vals.glassSaturation})`, WebkitBackdropFilter: `blur(${vals.glassBlur}px) brightness(${vals.glassBrightness}) saturate(${vals.glassSaturation})`, boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 0 ${vals.glassBezel}px ${hexToRgba(accent, 0.08)}, inset 0 1px 0 rgba(255,255,255,0.22)` }}>
        <div style={{ fontSize: vals.headingSize * 0.5, fontWeight: vals.headingWeight, color: vals.textPrimary, fontFamily: vals.fontFamily, marginBottom: 8, letterSpacing: vals.letterSpacing + "em" }}>Sample Heading</div>
        <div style={{ fontSize: vals.fontSize, fontWeight: vals.fontWeight, color: vals.textSecondary, fontFamily: vals.fontFamily, lineHeight: vals.lineHeight, marginBottom: 16, letterSpacing: vals.letterSpacing + "em" }}>
          This is how your body text will look across the portal. Adjust the controls to see live changes.
        </div>
        <div style={{ fontSize: vals.fontSize - 1, color: vals.textDim, fontFamily: vals.fontFamily, marginBottom: 16 }}>Dimmed label text · Secondary info</div>
        <div style={{ display: "flex", gap: vals.gap * 0.5 }}>
          <button style={{ padding: `${vals.buttonPadding}px ${vals.buttonPadding * 2.5}px`, borderRadius: vals.buttonRadius, border: `1px solid ${hexToRgba(accent, 0.4)}`, background: hexToRgba(accent, 0.15), color: vals.accentLight, fontSize: vals.fontSize - 1, fontFamily: vals.fontFamily, fontWeight: 500, cursor: "pointer" }}>Primary</button>
          <button style={{ padding: `${vals.buttonPadding}px ${vals.buttonPadding * 2.5}px`, borderRadius: vals.buttonRadius, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: vals.textSecondary, fontSize: vals.fontSize - 1, fontFamily: vals.fontFamily, cursor: "pointer" }}>Secondary</button>
        </div>
      </div>

      {/* Color swatches */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[vals.accent, vals.accentLight, vals.pink, vals.warm, vals.bgDark, vals.bgCard].map((c, i) => (
          <div key={i} title={c} style={{ width: 32, height: 32, borderRadius: 8, background: c, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }} onClick={() => copyToClipboard(c)}/>
        ))}
      </div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: FONT }}>Click a swatch to copy hex</div>
    </div>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function StyleEditor() {
  const [vals, setVals] = useState(DEFAULTS);
  const [copied, setCopied] = useState(false);

  const update = useCallback((key, value) => {
    setVals(prev => {
      const next = { ...prev, [key]: value };
      applyAll(next);
      return next;
    });
  }, []);

  const resetAll = () => {
    setVals(DEFAULTS);
    applyAll(DEFAULTS);
  };

  const exportTokens = () => {
    copyToClipboard(generateTokensExport(vals));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* Load extra typefaces only when the style editor is open */
  useEffect(() => {
    if (!document.getElementById("wf-extra-fonts")) {
      const link = document.createElement("link");
      link.id = "wf-extra-fonts";
      link.rel = "stylesheet";
      link.href = EXTRA_FONTS_URL;
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #1A1628 0%, #0f0d1a 100%)", color: "#fff", fontFamily: FONT }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(149,131,233,0.15)", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(26,22,40,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 12, color: "rgba(189,149,238,0.6)", textDecoration: "none", fontFamily: FONT }}>← Portal</a>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }}/>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: FONT }}>Style Editor</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: FONT }}>Changes apply live across the portal</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={resetAll} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: FONT, cursor: "pointer" }}>Reset Defaults</button>
          <button onClick={exportTokens} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(149,131,233,0.4)", background: "rgba(149,131,233,0.15)", color: "#BD95EE", fontSize: 11, fontFamily: FONT, cursor: "pointer", fontWeight: 600 }}>
            {copied ? "Copied!" : "Export tokens.js"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 0, maxWidth: 1400, margin: "0 auto" }}>

        {/* Controls */}
        <div style={{ padding: "32px 40px", borderRight: "1px solid rgba(149,131,233,0.1)", overflowY: "auto" }}>

          <Section title="Colors">
            <Row label="Accent"><ColorInput value={vals.accent} onChange={v => update("accent", v)}/></Row>
            <Row label="Accent Light"><ColorInput value={vals.accentLight} onChange={v => update("accentLight", v)}/></Row>
            <Row label="Pink"><ColorInput value={vals.pink} onChange={v => update("pink", v)}/></Row>
            <Row label="Warm"><ColorInput value={vals.warm} onChange={v => update("warm", v)}/></Row>
            <Row label="Background Dark"><ColorInput value={vals.bgDark} onChange={v => update("bgDark", v)}/></Row>
            <Row label="Card Background"><ColorInput value={vals.bgCard} onChange={v => update("bgCard", v)}/></Row>
            <Row label="Text Primary"><ColorInput value={vals.textPrimary} onChange={v => update("textPrimary", v)}/></Row>
          </Section>

          <Section title="Typography">
            <Row label="Typeface">
              <SelectInput value={vals.fontFamily} onChange={v => update("fontFamily", v)} options={FONT_OPTIONS}/>
            </Row>
            <Row label="Body Size"><SliderInput value={vals.fontSize} onChange={v => update("fontSize", v)} min={10} max={22} unit="px"/></Row>
            <Row label="Body Weight"><SliderInput value={vals.fontWeight} onChange={v => update("fontWeight", v)} min={100} max={900} step={100}/></Row>
            <Row label="Letter Spacing"><SliderInput value={vals.letterSpacing} onChange={v => update("letterSpacing", v)} min={-0.05} max={0.3} step={0.01} unit="em"/></Row>
            <Row label="Line Height"><SliderInput value={vals.lineHeight} onChange={v => update("lineHeight", v)} min={1} max={2.5} step={0.05}/></Row>
            <Row label="Heading Size"><SliderInput value={vals.headingSize} onChange={v => update("headingSize", v)} min={18} max={72} unit="px"/></Row>
            <Row label="Heading Weight"><SliderInput value={vals.headingWeight} onChange={v => update("headingWeight", v)} min={100} max={900} step={100}/></Row>
          </Section>

          <Section title="Spacing & Shape">
            <Row label="Border Radius"><SliderInput value={vals.borderRadius} onChange={v => update("borderRadius", v)} min={0} max={40} unit="px"/></Row>
            <Row label="Card Padding"><SliderInput value={vals.cardPadding} onChange={v => update("cardPadding", v)} min={8} max={48} unit="px"/></Row>
            <Row label="Button Radius"><SliderInput value={vals.buttonRadius} onChange={v => update("buttonRadius", v)} min={0} max={40} unit="px"/></Row>
            <Row label="Button Padding"><SliderInput value={vals.buttonPadding} onChange={v => update("buttonPadding", v)} min={4} max={32} unit="px"/></Row>
            <Row label="Gap"><SliderInput value={vals.gap} onChange={v => update("gap", v)} min={4} max={48} unit="px"/></Row>
          </Section>

          <Section title="Glass Engine">
            <Row label="Blur"><SliderInput value={vals.glassBlur} onChange={v => update("glassBlur", v)} min={0} max={60} unit="px"/></Row>
            <Row label="Opacity"><SliderInput value={vals.glassOpacity} onChange={v => update("glassOpacity", v)} min={0} max={0.5} step={0.01}/></Row>
            <Row label="Brightness"><SliderInput value={vals.glassBrightness} onChange={v => update("glassBrightness", v)} min={0.8} max={1.6} step={0.01}/></Row>
            <Row label="Saturation"><SliderInput value={vals.glassSaturation} onChange={v => update("glassSaturation", v)} min={0.5} max={2.5} step={0.05}/></Row>
            <Row label="Bezel Depth"><SliderInput value={vals.glassBezel} onChange={v => update("glassBezel", v)} min={0} max={60} unit="px"/></Row>
          </Section>

        </div>

        {/* Preview */}
        <div style={{ padding: "32px 28px", background: "rgba(255,255,255,0.02)" }}>
          <Preview vals={vals}/>
        </div>

      </div>

      {/* Footer note */}
      <div style={{ padding: "20px 32px", borderTop: "1px solid rgba(149,131,233,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: FONT }}>Changes are session-only. Use "Export tokens.js" to make them permanent.</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: FONT }}>Wolf Flow Style Engine © 2026 — Johnathon Moulds</div>
      </div>

    </div>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
