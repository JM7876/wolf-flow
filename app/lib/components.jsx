"use client";
/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Shared UI Components
   ─────────────────────────────────────────────────────────
   GlassCard, FormField, TripleToggle, SectionLabel, MiniTrack,
   PageNav, PortalBackground, SettingsDropdown — shared across all services.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef } from "react";
import { WF, FC, FONT, MONO, CLICK, GLASS, glassPill, inputBase, WORKFLOW_STEPS, STEP_DESC } from "./tokens";

/* ═══ LIQUID SHINE — specular highlight + edge glow (iOS 26 inspired) ═══ */
export function TopShine({ r = 18 }) {
  return (
    <>
      {/* Specular highlight — bright curved shine across the top */}
      <div style={{
        position: "absolute", left: "8%", right: "8%", top: 0, height: "40%",
        borderRadius: `${r}px ${r}px 0 0`, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)",
        maskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
      }} />
      {/* Edge rim light — thin bright line along the top */}
      <div style={{
        position: "absolute", left: "5%", right: "5%", top: 0, height: 1,
        borderRadius: `${r}px ${r}px 0 0`, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), rgba(255,255,255,0.25), rgba(255,255,255,0.2), transparent)",
      }} />
    </>
  );
}

/* ═══ LIQUID GLASS CARD (iOS 26 Inspired) ═══ */
export function GlassCard({ children, style: s = {}, hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className="lg-glass-panel"
      style={{ ...GLASS.default, position: "relative", overflow: "hidden", contain: "layout style paint", ...s, transition: `all ${CLICK.duration}` }}
      onMouseEnter={hover ? e => {
        e.currentTarget.style.borderColor = CLICK.hover.borderColor;
        e.currentTarget.style.transform = "translateY(-2px) scale(1.005)";
        e.currentTarget.style.boxShadow = CLICK.hover.boxShadow;
      } : undefined}
      onMouseLeave={hover ? e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = GLASS.default.boxShadow;
      } : undefined}
    >
      <TopShine r={s.borderRadius || 18} />
      {/* Bottom catchlight */}
      <div style={{
        position: "absolute", left: "10%", right: "10%", bottom: 0, height: 1,
        pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
      }} />
      <div style={{ position: "relative", zIndex: 2, padding: s.padding !== undefined ? undefined : "20px 24px" }}>{children}</div>
    </div>
  );
}

/* ═══ SECTION LABEL ═══ */
export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 9, fontWeight: 600, color: FC.textDim,
      letterSpacing: "0.15em", textTransform: "uppercase",
      fontFamily: FONT, marginBottom: 8, marginTop: 14,
    }}>
      {children}
    </div>
  );
}

/* ═══ FORM FIELD — input, select, textarea ═══ */
export function FormField({ label, type = "text", value, onChange, placeholder, required, options, textarea }) {
  const labelStyle = {
    fontSize: 11, fontWeight: 500, fontFamily: FONT, color: FC.textSecondary,
    letterSpacing: "0.04em", display: "block", marginBottom: 6,
  };
  const focusIn = (e) => { e.target.style.borderColor = `${WF.accent}60`; };
  const focusOut = (e) => { e.target.style.borderColor = FC.border; };

  if (options) {
    return (
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>
          {label}{required && <span style={{ color: FC.redLight }}>{" *"}</span>}
        </label>
        <select
          value={value} onChange={e => onChange(e.target.value)}
          style={{
            ...inputBase, appearance: "none", cursor: "pointer",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.6)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
          }}
          onFocus={focusIn} onBlur={focusOut}
        >
          <option value="" style={{ background: FC.dark }}>{placeholder || `Select ${label}`}</option>
          {options.map(o => <option key={o} value={o} style={{ background: FC.dark }}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (textarea) {
    return (
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>
          {label}{required && <span style={{ color: FC.redLight }}>{" *"}</span>}
        </label>
        <textarea
          value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
          style={{ ...inputBase, resize: "vertical", minHeight: 80 }}
          onFocus={focusIn} onBlur={focusOut}
        />
      </div>
    );
  }
  const isDateOrTime = type === "date" || type === "time";
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: FC.redLight }}>{" *"}</span>}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ ...inputBase, ...(isDateOrTime ? { colorScheme: "dark", cursor: "pointer" } : {}) }}
        onFocus={focusIn} onBlur={focusOut}
      />
    </div>
  );
}

/* ═══ THREE-BUTTON SELECTOR (Priority / Media Type) ═══ */
export function TripleToggle({ label, options, value, onChange, colors }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontSize: 11, fontWeight: 500, fontFamily: FONT, color: FC.textSecondary,
        letterSpacing: "0.04em", display: "block", marginBottom: 8,
      }}>{label}</label>
      <div style={{ display: "flex", gap: 6 }}>
        {options.map((opt, i) => {
          const active = value === opt.value;
          const c = colors?.[i] || WF.accent;
          return (
            <button key={opt.value} onClick={() => onChange(opt.value)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 14, cursor: "pointer",
              background: active ? `linear-gradient(168deg, ${c}1A 0%, ${c}0D 100%)` : "linear-gradient(168deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: `1px solid ${active ? `${c}50` : "rgba(255,255,255,0.1)"}`,
              color: active ? c : FC.textDim,
              fontSize: 12, fontWeight: active ? 600 : 400, fontFamily: FONT,
              transition: `all ${CLICK.duration}`,
              boxShadow: active ? `0 4px 16px ${c}18, inset 0 1px 0 rgba(255,255,255,0.12)` : "inset 0 1px 0 rgba(255,255,255,0.06)",
              backdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4))", WebkitBackdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4))",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}
              onMouseEnter={!active ? e => { e.currentTarget.style.borderColor = `${c}35`; e.currentTarget.style.color = FC.textSecondary; e.currentTarget.style.boxShadow = `0 0 10px ${c}10`; } : undefined}
              onMouseLeave={!active ? e => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.color = FC.textDim; e.currentTarget.style.boxShadow = "none"; } : undefined}
            >
              <span style={{ fontSize: 16 }}>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ WORKFLOW MINI TRACK ═══ */
export function MiniTrack({ step, showLabels = false }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 2 }}>
        {WORKFLOW_STEPS.map((s, i) => (
          <div key={i} title={`${s}: ${STEP_DESC[i]}`} style={{
            flex: 1, height: showLabels ? 6 : 3, borderRadius: 3,
            background: i < step
              ? `linear-gradient(90deg, ${FC.green}, ${WF.pink}80)`
              : i === step ? WF.accent : "rgba(255,255,255,0.06)",
            boxShadow: i === step ? `0 0 8px ${FC.turquoiseGlow}` : "none",
            transition: `all ${CLICK.duration}`, cursor: "default",
          }} />
        ))}
      </div>
      {showLabels && (
        <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
          {WORKFLOW_STEPS.map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: "center", fontSize: 7, fontFamily: FONT, fontWeight: 600,
              letterSpacing: "0.04em",
              color: i < step ? FC.greenLight : i === step ? WF.accent : FC.textDim,
            }}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ PAGE NAV — Back | Home | Next ═══ */
export function PageNav({ onBack, onHome, onNext, backLabel = "Back", nextLabel = "Next", showDisabledNext = false }) {
  const navBtn = {
    background: "linear-gradient(168deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)",
    border: "1px solid rgba(255,255,255,0.16)", borderRadius: 14,
    padding: "10px 22px", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: FONT,
    color: FC.textSecondary,
    backdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4))",
    WebkitBackdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4))",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.03)",
    transition: `all ${CLICK.duration}`, minWidth: 80, textAlign: "center",
  };
  const nextBtn = {
    ...navBtn,
    background: `linear-gradient(135deg, ${WF.accent}55, ${WF.accent}38)`,
    border: `1px solid ${WF.accent}60`,
    color: "#fff",
    fontWeight: 600,
    boxShadow: `0 4px 20px ${WF.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
  };
  const disabledBtn = {
    ...nextBtn,
    opacity: 0.35,
    cursor: "not-allowed",
  };
  const hoverIn = (e) => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; e.currentTarget.style.color = FC.textPrimary; e.currentTarget.style.transform = "translateY(-1px)"; };
  const hoverOut = (e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.boxShadow = navBtn.boxShadow; e.currentTarget.style.color = FC.textSecondary; e.currentTarget.style.transform = "none"; };
  const nextHoverIn = (e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${WF.accent}70, ${WF.accent}50)`; e.currentTarget.style.boxShadow = `0 6px 28px ${WF.accent}40`; e.currentTarget.style.transform = "translateY(-1px)"; };
  const nextHoverOut = (e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${WF.accent}55, ${WF.accent}38)`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.18)`; e.currentTarget.style.transform = "none"; };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: "24px 24px 32px" }}>
      {onBack ? <button onClick={onBack} style={navBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{backLabel}</button> : <div style={{ minWidth: 80 }} />}
      {onHome ? <button onClick={onHome} style={navBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{"Home"}</button> : <div style={{ minWidth: 80 }} />}
      {onNext ? (
        <button onClick={onNext} style={nextBtn} onMouseEnter={nextHoverIn} onMouseLeave={nextHoverOut}>{nextLabel}</button>
      ) : showDisabledNext ? (
        <button disabled style={disabledBtn}>{nextLabel}</button>
      ) : (
        <div style={{ minWidth: 80 }} />
      )}
    </div>
  );
}

/* ═══ NIGHT MODE HOOK — persists across page navigations via localStorage ═══ */
const NIGHT_KEY = "wf-night-mode";
export function useNightMode() {
  const [nightMode, setNightMode] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setNightMode(localStorage.getItem(NIGHT_KEY) === "true"); } catch {}
    setReady(true);
  }, []);
  const toggle = () => {
    setNightMode(prev => {
      const next = !prev;
      try { localStorage.setItem(NIGHT_KEY, String(next)); } catch {}
      return next;
    });
  };
  return { nightMode, toggleNight: toggle, ready };
}

/* ═══ GLASS PRESETS & SLIDERS — used by SettingsDropdown ═══ */
const GLASS_PRESETS = {
  frost:  { label: "Soft Frost",   values: { displacement: 0, blur: 22, opacity: 0.22, brightness: 1.08, saturation: 1.05, bezel: 20 } },
  dream:  { label: "Dream Glass",  values: { displacement: 2, blur: 28, opacity: 0.28, brightness: 1.1, saturation: 1.25, bezel: 26 } },
  studio: { label: "Studio Glass", values: { displacement: 0, blur: 14, opacity: 0.14, brightness: 1, saturation: 1, bezel: 12 } },
};
const GLASS_SLIDERS = [
  { key: "displacement", label: "Displacement", cssVar: "--glass-displacement", unit: "px", min: 0, max: 10, step: 0.5, def: 0 },
  { key: "blur",         label: "Blur",         cssVar: "--glass-blur",         unit: "px", min: 0, max: 50, step: 1,   def: 18 },
  { key: "opacity",      label: "Opacity",      cssVar: "--glass-opacity",      unit: "",   min: 0, max: 0.5, step: 0.01, def: 0.18 },
  { key: "brightness",   label: "Brightness",   cssVar: "--glass-brightness",   unit: "",   min: 0.8, max: 1.4, step: 0.01, def: 1.05 },
  { key: "saturation",   label: "Saturation",   cssVar: "--glass-saturation",   unit: "",   min: 0.5, max: 2,   step: 0.05, def: 1.1 },
  { key: "bezel",        label: "Bezel Depth",  cssVar: "--glass-bezel-depth",  unit: "px", min: 0, max: 40, step: 1,   def: 18 },
];
const setGlassVar = (cssVar, v, unit) => document.documentElement.style.setProperty(cssVar, v + unit);

/* ═══ FONT + COLOR TOKENS for Style Panel ═══ */
const FONT_OPTIONS = [
  { label: "Montserrat Alt", value: "'Montserrat Alternates', sans-serif" },
  { label: "Clean",          value: "'Clean', sans-serif" },
  { label: "DM Sans",        value: "'DM Sans', sans-serif" },
  { label: "Josefin Sans",   value: "'Josefin Sans', sans-serif" },
  { label: "Inter",          value: "'Inter', sans-serif" },
  { label: "Space Grotesk",  value: "'Space Grotesk', sans-serif" },
  { label: "Playfair",       value: "'Playfair Display', serif" },
];

const ACCENT_SWATCHES = [
  { label: "Wolf Violet",  hex: "#9583E9", light: "#BD95EE", glow: "rgba(149,131,233,0.25)" },
  { label: "Wolf Pink",    hex: "#DDACEF", light: "#F0CDF3", glow: "rgba(221,172,239,0.25)" },
  { label: "Turquoise",    hex: "#14A9A2", light: "#1bc4bc", glow: "rgba(20,169,162,0.25)" },
  { label: "Gold",         hex: "#C9A84C", light: "#e0bc5e", glow: "rgba(201,168,76,0.25)" },
  { label: "Rose",         hex: "#e63946", light: "#ff6b6b", glow: "rgba(230,57,70,0.25)" },
  { label: "Forest",       hex: "#40916c", light: "#52b788", glow: "rgba(64,145,108,0.25)" },
  { label: "Coral",        hex: "#FDC3BE", light: "#fdd2d7", glow: "rgba(253,195,190,0.25)" },
  { label: "Steel",        hex: "#6b8cba", light: "#89a8d0", glow: "rgba(107,140,186,0.25)" },
];

function applyAccent(swatch) {
  const r = document.documentElement;
  r.style.setProperty("--wf-accent", swatch.hex);
  r.style.setProperty("--wf-accent-light", swatch.light);
  r.style.setProperty("--wf-accent-glow", swatch.glow);
  r.style.setProperty("--accent-primary", swatch.hex);
  r.style.setProperty("--accent-violet", swatch.light);
}

function applyFont(fontValue) {
  document.documentElement.style.setProperty("--wf-font", fontValue);
  // Inject override style so inline fontFamily references also update
  let tag = document.getElementById("wf-font-override");
  if (!tag) { tag = document.createElement("style"); tag.id = "wf-font-override"; document.head.appendChild(tag); }
  tag.textContent = `*, *::before, *::after { font-family: ${fontValue} !important; }`;
}

/* ═══ SETTINGS DROPDOWN — Night mode toggle + Glass Engine sliders ═══ */
export function SettingsDropdown({ nightMode, onToggleNight }) {
  const [open, setOpen] = useState(false);
  const [glassVals, setGlassVals] = useState(() => {
    const init = {};
    GLASS_SLIDERS.forEach(s => { init[s.key] = s.def; });
    return init;
  });
  const [activePreset, setActivePreset] = useState(null);
  const [activeAccent, setActiveAccent] = useState(0);
  const [activeFont, setActiveFont] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const handleAccent = (idx) => {
    setActiveAccent(idx);
    applyAccent(ACCENT_SWATCHES[idx]);
  };

  const handleFont = (idx) => {
    setActiveFont(idx);
    applyFont(FONT_OPTIONS[idx].value);
  };

  const updateSlider = (key, val) => {
    const s = GLASS_SLIDERS.find(x => x.key === key);
    const num = parseFloat(val);
    setGlassVals(prev => ({ ...prev, [key]: num }));
    setActivePreset(null);
    setGlassVar(s.cssVar, num, s.unit);
  };

  const applyPreset = (pk) => {
    const p = GLASS_PRESETS[pk];
    const nv = {};
    GLASS_SLIDERS.forEach(s => { nv[s.key] = p.values[s.key]; setGlassVar(s.cssVar, p.values[s.key], s.unit); });
    setGlassVals(nv);
    setActivePreset(pk);
  };

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 300 }}>
      {/* Gear button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: "fixed", top: 18, right: 18, zIndex: 300,
        background: open ? "rgba(149,131,233,0.15)" : FC.glass,
        border: `1px solid ${open ? "rgba(149,131,233,0.4)" : FC.border}`, borderRadius: 12,
        padding: "8px 12px", cursor: "pointer", fontSize: 18, lineHeight: 1,
        backdropFilter: "blur(var(--glass-blur,18px))", WebkitBackdropFilter: "blur(var(--glass-blur,18px))",
        transition: `all ${CLICK.duration}`, transform: "scale(1)",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; e.currentTarget.style.transform = "scale(1.05)"; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.boxShadow = "none"; } e.currentTarget.style.transform = "scale(1)"; }}
        title="Settings" aria-label="Open settings"
      >{"\u2699"}</button>

      {/* Dropdown panel */}
      <div style={{
        position: "fixed", top: 58, right: 16, zIndex: 300, width: 290, borderRadius: 20,
        padding: open ? 20 : 0, maxHeight: open ? "min(520px, calc(100vh - 80px))" : 0, overflowY: open ? "auto" : "hidden", overflowX: "hidden",
        background: "rgba(34,28,53,0.92)",
        backdropFilter: "blur(calc(var(--glass-blur,18px) + 6px)) brightness(var(--glass-brightness,1.05)) saturate(var(--glass-saturation,1.1))",
        WebkitBackdropFilter: "blur(calc(var(--glass-blur,18px) + 6px)) brightness(var(--glass-brightness,1.05)) saturate(var(--glass-saturation,1.1))",
        border: open ? "1px solid rgba(149,131,233,0.2)" : "1px solid transparent",
        boxShadow: open ? "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
        opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.25s ease, transform 0.25s ease, max-height 0.3s ease, padding 0.25s ease",
        fontFamily: FONT,
      }}>
        {/* Day / Night */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>{"Appearance"}</div>
          <button onClick={onToggleNight} style={{
            width: "100%", padding: "10px 14px", borderRadius: 10, cursor: "pointer",
            background: FC.glass, border: `1px solid ${FC.border}`,
            color: FC.textSecondary, fontSize: 12, fontWeight: 500, fontFamily: FONT,
            display: "flex", alignItems: "center", gap: 10, transition: `all ${CLICK.duration}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.color = FC.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.color = FC.textSecondary; }}
          >
            <span style={{ fontSize: 16 }}>{nightMode ? "\u2600\uFE0F" : "\uD83C\uDF19"}</span>
            <span>{nightMode ? "Switch to Day Mode" : "Switch to Night Mode"}</span>
          </button>
        </div>

        <div style={{ height: 1, background: FC.border, marginBottom: 18 }} />

        {/* Glass Engine */}
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>{"Glass Engine"}</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {Object.entries(GLASS_PRESETS).map(([key, preset]) => (
            <button key={key} onClick={() => applyPreset(key)} style={{
              flex: 1, padding: "7px 4px", fontSize: 9, fontWeight: 600, fontFamily: FONT,
              letterSpacing: "0.04em",
              border: `1px solid ${activePreset === key ? "rgba(149,131,233,0.5)" : "rgba(149,131,233,0.15)"}`,
              borderRadius: 10,
              background: activePreset === key ? "rgba(149,131,233,0.15)" : "rgba(255,255,255,0.04)",
              color: activePreset === key ? "#BD95EE" : "rgba(255,255,255,0.6)",
              cursor: "pointer", transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(149,131,233,0.4)"; e.currentTarget.style.color = "#BD95EE"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = activePreset === key ? "rgba(149,131,233,0.5)" : "rgba(149,131,233,0.15)"; e.currentTarget.style.color = activePreset === key ? "#BD95EE" : "rgba(255,255,255,0.6)"; }}
            >{preset.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {GLASS_SLIDERS.map(s => (
            <div key={s.key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{s.label}</span>
                <span style={{ fontSize: 10, fontFamily: FONT, color: "rgba(189,149,238,0.7)" }}>
                  {s.unit === "px" ? `${glassVals[s.key]}px` : glassVals[s.key].toFixed(2)}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={glassVals[s.key]}
                onChange={e => updateSlider(s.key, e.target.value)}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: FC.border, margin: "18px 0" }} />

        {/* ═══ ACCENT COLOR ═══ */}
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>{"Accent Color"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 4 }}>
          {ACCENT_SWATCHES.map((sw, i) => (
            <button key={i} onClick={() => handleAccent(i)} title={sw.label} style={{
              height: 28, borderRadius: 8, cursor: "pointer",
              background: sw.hex,
              border: activeAccent === i ? "2px solid #fff" : "2px solid transparent",
              boxShadow: activeAccent === i ? `0 0 12px ${sw.glow}, 0 0 4px ${sw.hex}` : "none",
              transition: "all 0.2s ease",
              position: "relative",
            }}>
              {activeAccent === i && <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{"✓"}</span>}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: FONT, marginBottom: 18, textAlign: "center" }}>
          {ACCENT_SWATCHES[activeAccent].label}
        </div>

        <div style={{ height: 1, background: FC.border, marginBottom: 18 }} />

        {/* ═══ FONT ═══ */}
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>{"Typeface"}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {FONT_OPTIONS.map((fo, i) => (
            <button key={i} onClick={() => handleFont(i)} style={{
              width: "100%", padding: "8px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left",
              background: activeFont === i ? "rgba(149,131,233,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeFont === i ? "rgba(149,131,233,0.45)" : "rgba(255,255,255,0.06)"}`,
              color: activeFont === i ? "#BD95EE" : "rgba(255,255,255,0.55)",
              fontSize: 12, fontFamily: fo.value,
              fontWeight: activeFont === i ? 600 : 400,
              transition: "all 0.18s ease",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}
              onMouseEnter={e => { if (activeFont !== i) { e.currentTarget.style.borderColor = "rgba(149,131,233,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; } }}
              onMouseLeave={e => { if (activeFont !== i) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; } }}
            >
              <span>{fo.label}</span>
              {activeFont === i && <span style={{ fontSize: 10 }}>{"✓"}</span>}
            </button>
          ))}
        </div>

        <div style={{ height: 1, background: FC.border, margin: "18px 0" }} />

        {/* Link to full Style Editor page */}
        <a href="/style" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "10px 14px", borderRadius: 10, cursor: "pointer",
          background: "rgba(149,131,233,0.1)", border: "1px solid rgba(149,131,233,0.25)",
          color: "#BD95EE", fontSize: 11, fontWeight: 600, fontFamily: FONT,
          letterSpacing: "0.04em", textDecoration: "none",
          transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(149,131,233,0.18)"; e.currentTarget.style.borderColor = "rgba(149,131,233,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(149,131,233,0.1)"; e.currentTarget.style.borderColor = "rgba(149,131,233,0.25)"; }}
        >
          <span style={{ fontSize: 14 }}>{"\u2728"}</span>
          <span>{"Open Style Editor"}</span>
        </a>

        <div style={{ height: 1, background: FC.border, margin: "14px 0 4px" }} />
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", fontFamily: FONT, textAlign: "center", paddingBottom: 2 }}>{"Wolf Flow Style Engine \u00A9 2026"}</div>

      </div>
    </div>
  );
}

/* ═══ PORTAL BACKGROUND — day/night image swap (optimised WebP) ═══ */
export function PortalBackground({ nightMode }) {
  const dayImg = "/images/WW-Website-BG-Day-V1.webp";
  const nightImg = "/images/WW-Website-BG-Night-V1.webp";
  const [altReady, setAltReady] = useState(false);

  /* After initial paint settles, pre-decode the *inactive* variant
     so toggling later feels instant. requestIdleCallback (with a
     fallback setTimeout) keeps this off the critical path. */
  useEffect(() => {
    let cancelled = false;
    const inactiveSrc = nightMode ? dayImg : nightImg;

    const preload = () => {
      if (cancelled) return;
      const img = new window.Image();
      img.src = inactiveSrc;
      const done = () => { if (!cancelled) setAltReady(true); };
      if (img.decode) img.decode().then(done, done);
      else { img.onload = done; img.onerror = done; }
    };

    /* Delay pre-decode until the browser is idle */
    const id = typeof requestIdleCallback === "function"
      ? requestIdleCallback(preload, { timeout: 3000 })
      : setTimeout(preload, 1500);

    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, [nightMode]);

  const layerBase = {
    position: "absolute", inset: 0,
    backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
    transition: "opacity 0.8s ease",
    /* No willChange here — avoid eagerly promoting both layers and
       forcing synchronous 4K decode on the main thread. The browser
       will promote automatically when opacity transitions begin. */
  };

  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      contain: "strict",
    }}>
      {/* Night layer — only set backgroundImage when night is active or alt is pre-decoded */}
      {(nightMode || altReady) && (
        <div style={{
          ...layerBase,
          backgroundImage: `url('${nightImg}')`,
          opacity: nightMode ? 1 : 0,
        }} />
      )}
      {/* Day layer — preloaded in layout.js via <link rel="preload"> */}
      <div style={{
        ...layerBase,
        backgroundImage: `url('${dayImg}')`,
        opacity: nightMode ? 0 : 1,
      }} />
      {/* Subtle scrim for content readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: nightMode
          ? "linear-gradient(180deg, rgba(26,22,40,0.35) 0%, rgba(34,28,53,0.45) 100%)"
          : "linear-gradient(180deg, rgba(26,22,40,0.30) 0%, rgba(34,28,53,0.42) 100%)",
        transition: "background 0.8s ease",
      }} />
    </div>
  );
}

/* ═══ FOOTER ═══ */
export function Footer() {
  return (
    <footer style={{
      width: "100%", textAlign: "center",
      padding: "20px 24px 28px",
      fontFamily: FONT, fontSize: 12, fontWeight: 400,
      color: "rgba(255,255,255,0.28)",
      letterSpacing: "0.02em",
      lineHeight: 1.6,
      flexShrink: 0,
    }}>
      {"Developed and Created by: Johnathon Moulds | Wolf Flow Solutions."}
    </footer>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
