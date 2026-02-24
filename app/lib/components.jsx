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
      style={{ ...GLASS.default, position: "relative", overflow: "hidden", ...s, transition: `all ${CLICK.duration}` }}
      onMouseEnter={hover ? e => {
        e.currentTarget.style.borderColor = CLICK.hover.borderColor;
        e.currentTarget.style.transform = "translateY(-2px) scale(1.005)";
        e.currentTarget.style.boxShadow = CLICK.hover.boxShadow;
      } : undefined}
      onMouseLeave={hover ? e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
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
  const [hovered, setHovered] = useState(null);
  const activeIdx = options.findIndex(o => o.value === value);

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontSize: 11, fontWeight: 500, fontFamily: FONT, color: FC.textSecondary,
        letterSpacing: "0.04em", display: "block", marginBottom: 8,
      }}>{label}</label>
      <div style={{
        display: "flex", gap: 0, position: "relative",
        background: "linear-gradient(168deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 16, padding: 3,
        backdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4))",
        WebkitBackdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4))",
      }}>
        {/* Sliding indicator */}
        {activeIdx >= 0 && (
          <div style={{
            position: "absolute", top: 3, bottom: 3,
            left: `calc(${(activeIdx / options.length) * 100}% + 3px)`,
            width: `calc(${100 / options.length}% - ${6 / options.length}px)`,
            borderRadius: 13,
            background: `linear-gradient(168deg, ${(colors?.[activeIdx] || WF.accent)}22 0%, ${(colors?.[activeIdx] || WF.accent)}12 100%)`,
            border: `1px solid ${(colors?.[activeIdx] || WF.accent)}45`,
            boxShadow: `0 4px 16px ${(colors?.[activeIdx] || WF.accent)}18, inset 0 1px 0 rgba(255,255,255,0.10)`,
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none", zIndex: 0,
          }} />
        )}
        {options.map((opt, i) => {
          const active = value === opt.value;
          const isHovered = hovered === i;
          const c = colors?.[i] || WF.accent;
          return (
            <button key={opt.value}
              onClick={() => onChange(opt.value)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 13, cursor: "pointer",
                background: "transparent",
                border: "1px solid transparent",
                color: active ? c : isHovered ? FC.textSecondary : FC.textDim,
                fontSize: 12, fontWeight: active ? 600 : 400, fontFamily: FONT,
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "none",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                position: "relative", zIndex: 1,
                transform: active ? "scale(1.02)" : isHovered ? "scale(1.01)" : "scale(1)",
                WebkitAppearance: "none",
              }}
            >
              <span style={{
                fontSize: 16,
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: active ? `drop-shadow(0 0 6px ${c}60)` : "none",
                transform: active ? "scale(1.1)" : "scale(1)",
              }}>{opt.icon}</span>
              <span style={{ transition: "color 0.35s ease" }}>{opt.label}</span>
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
export function PageNav({ onBack, onHome, onNext, backLabel = "Back", nextLabel = "Next", showDisabledNext = false, currentStep, totalSteps }) {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const baseBtn = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    borderRadius: 14, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: FONT,
    backdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4))",
    WebkitBackdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4))",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    minWidth: 0, textAlign: "center", WebkitAppearance: "none", border: "none",
  };

  const backBtnStyle = {
    ...baseBtn,
    background: hoveredBtn === "back"
      ? "linear-gradient(168deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 100%)"
      : "linear-gradient(168deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
    border: `1px solid ${hoveredBtn === "back" ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.14)"}`,
    padding: "11px 20px",
    color: hoveredBtn === "back" ? FC.textPrimary : FC.textSecondary,
    boxShadow: hoveredBtn === "back"
      ? "0 6px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.16)"
      : "0 2px 10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.10)",
    transform: hoveredBtn === "back" ? "translateY(-1px)" : "translateY(0)",
  };

  const homeBtnStyle = {
    ...baseBtn,
    background: hoveredBtn === "home"
      ? "linear-gradient(168deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 100%)"
      : "linear-gradient(168deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
    border: `1px solid ${hoveredBtn === "home" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.10)"}`,
    padding: "11px 16px",
    color: hoveredBtn === "home" ? FC.textSecondary : FC.textDim,
    boxShadow: hoveredBtn === "home"
      ? "0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.12)"
      : "0 1px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
    transform: hoveredBtn === "home" ? "translateY(-1px)" : "translateY(0)",
  };

  const nextBtnStyle = {
    ...baseBtn,
    background: hoveredBtn === "next"
      ? `linear-gradient(135deg, ${WF.accent}80, ${WF.accent}58)`
      : `linear-gradient(135deg, ${WF.accent}60, ${WF.accent}40)`,
    border: `1px solid ${hoveredBtn === "next" ? WF.accent + "80" : WF.accent + "55"}`,
    padding: "11px 24px",
    color: "#fff", fontWeight: 600,
    boxShadow: hoveredBtn === "next"
      ? `0 6px 28px ${WF.accent}40, inset 0 1px 0 rgba(255,255,255,0.20)`
      : `0 4px 20px ${WF.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
    transform: hoveredBtn === "next" ? "translateY(-1px)" : "translateY(0)",
  };

  const disabledStyle = {
    ...nextBtnStyle,
    opacity: 0.3, cursor: "not-allowed",
    transform: "none",
  };

  return (
    <div style={{
      padding: "16px 24px 24px",
      position: "relative", zIndex: 10,
    }}>
      {/* Step progress dots */}
      {typeof currentStep === "number" && typeof totalSteps === "number" && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} style={{
              width: i === currentStep ? 22 : 6, height: 6, borderRadius: 3,
              background: i < currentStep
                ? `linear-gradient(90deg, ${WF.pink}, ${WF.accent})`
                : i === currentStep
                  ? WF.accent
                  : "rgba(255,255,255,0.10)",
              boxShadow: i === currentStep ? `0 0 10px ${WF.accentGlow}` : "none",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }} />
          ))}
        </div>
      )}
      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
        {onBack ? (
          <button onClick={onBack} style={backBtnStyle}
            onMouseEnter={() => setHoveredBtn("back")} onMouseLeave={() => setHoveredBtn(null)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            {backLabel}
          </button>
        ) : <div style={{ minWidth: 72 }} />}

        {onHome && (
          <button onClick={onHome} style={homeBtnStyle}
            onMouseEnter={() => setHoveredBtn("home")} onMouseLeave={() => setHoveredBtn(null)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {"Home"}
          </button>
        )}

        {onNext ? (
          <button onClick={onNext} style={nextBtnStyle}
            onMouseEnter={() => setHoveredBtn("next")} onMouseLeave={() => setHoveredBtn(null)}>
            {nextLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        ) : showDisabledNext ? (
          <button disabled style={disabledStyle}>
            {nextLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        ) : (
          <div style={{ minWidth: 72 }} />
        )}
      </div>
    </div>
  );
}

/* ═══ NIGHT MODE HOOK — persists across page navigations via localStorage ═══ */
const NIGHT_KEY = "wf-night-mode";

function readNightPref() {
  if (typeof window === "undefined") return false;
  try { return localStorage.getItem(NIGHT_KEY) === "true"; } catch { return false; }
}

export function useNightMode() {
  const [nightMode, setNightMode] = useState(readNightPref);
  const toggle = () => {
    setNightMode(prev => {
      const next = !prev;
      try { localStorage.setItem(NIGHT_KEY, String(next)); } catch {}
      return next;
    });
  };
  return { nightMode, toggleNight: toggle };
}

/* ═══ GLASS PRESETS & SLIDERS — used by SettingsDropdown ═══ */
const GLASS_PRESETS = {
  frost:  { label: "Soft Frost",   values: { displacement: 0, blur: 22, opacity: 0.22, brightness: 1.08, saturation: 1.05, contrast: 1.02, bezel: 20 } },
  dream:  { label: "Dream Glass",  values: { displacement: 2, blur: 28, opacity: 0.28, brightness: 1.1, saturation: 1.25, contrast: 1.05, bezel: 26 } },
  studio: { label: "Studio Glass", values: { displacement: 0, blur: 14, opacity: 0.14, brightness: 1, saturation: 1, contrast: 1, bezel: 12 } },
};
const GLASS_SLIDERS = [
  { key: "displacement", label: "Displacement", cssVar: "--glass-displacement", unit: "px", min: 0, max: 10, step: 0.5, def: 0 },
  { key: "blur",         label: "Blur",         cssVar: "--glass-blur",         unit: "px", min: 0, max: 50, step: 1,   def: 18 },
  { key: "opacity",      label: "Opacity",      cssVar: "--glass-opacity",      unit: "",   min: 0, max: 0.5, step: 0.01, def: 0.18 },
  { key: "brightness",   label: "Brightness",   cssVar: "--glass-brightness",   unit: "",   min: 0.8, max: 1.4, step: 0.01, def: 1.05 },
  { key: "saturation",   label: "Saturation",   cssVar: "--glass-saturation",   unit: "",   min: 0.5, max: 2,   step: 0.05, def: 1.1 },
  { key: "contrast",     label: "Contrast",     cssVar: "--glass-contrast",     unit: "",   min: 0.8, max: 1.3, step: 0.01, def: 1.05 },
  { key: "bezel",        label: "Bezel Depth",  cssVar: "--glass-bezel-depth",  unit: "px", min: 0, max: 40, step: 1,   def: 18 },
];
const setGlassVar = (cssVar, v, unit) => document.documentElement.style.setProperty(cssVar, v + unit);

/* ═══ FONT + COLOR TOKENS for Style Panel ═══ */
const FONT_OPTIONS = [
  { label: "Montserrat Alt", value: "'Montserrat Alternates', sans-serif" },
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
  const gearRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && ref.current.contains(e.target)) return;
      if (gearRef.current && gearRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const resetToDefaults = () => {
    const nv = {};
    GLASS_SLIDERS.forEach(s => { nv[s.key] = s.def; setGlassVar(s.cssVar, s.def, s.unit); });
    setGlassVals(nv);
    setActivePreset(null);
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
    <div style={{ position: "relative", zIndex: 300 }}>
      {/* Gear button */}
      <button ref={gearRef} onClick={() => setOpen(o => !o)} style={{
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
      >{"⚙️"}</button>

      {/* Dropdown panel */}
      <div ref={ref} style={{
        position: "fixed", top: 58, right: 16, zIndex: 300, width: 290, borderRadius: 20,
        padding: open ? 20 : 0, maxHeight: open ? "min(580px, calc(100vh - 80px))" : 0, overflowY: open ? "auto" : "hidden", overflowX: "hidden",
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
        {/* Slider custom styles */}
        <style>{`
          .wf-glass-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: linear-gradient(90deg, rgba(149,131,233,0.5), rgba(189,149,238,0.35));
            outline: none;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .wf-glass-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid rgba(149,131,233,0.4);
            box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 12px rgba(149,131,233,0.2);
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .wf-glass-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 2px 12px rgba(0,0,0,0.3), 0 0 18px rgba(149,131,233,0.35);
          }
          .wf-glass-slider::-webkit-slider-thumb:active {
            transform: scale(1.05);
          }
          .wf-glass-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid rgba(149,131,233,0.4);
            box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 12px rgba(149,131,233,0.2);
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .wf-glass-slider::-moz-range-track {
            height: 6px;
            border-radius: 3px;
            background: linear-gradient(90deg, rgba(149,131,233,0.5), rgba(189,149,238,0.35));
          }
        `}</style>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {GLASS_SLIDERS.map(s => {
            const pct = ((glassVals[s.key] - s.min) / (s.max - s.min)) * 100;
            return (
              <div key={s.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{s.label}</span>
                  <span style={{ fontSize: 10, fontFamily: FONT, color: "rgba(189,149,238,0.7)" }}>
                    {s.unit === "px" ? `${glassVals[s.key]}px` : glassVals[s.key].toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  className="wf-glass-slider"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={glassVals[s.key]}
                  onChange={e => updateSlider(s.key, e.target.value)}
                  onInput={e => updateSlider(s.key, e.target.value)}
                  style={{
                    background: `linear-gradient(90deg, rgba(149,131,233,0.6) 0%, rgba(189,149,238,0.5) ${pct}%, rgba(255,255,255,0.08) ${pct}%, rgba(255,255,255,0.05) 100%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
        {/* Reset button */}
        <button onClick={resetToDefaults} style={{
          marginTop: 14, width: "100%", padding: "8px 12px", fontSize: 9, fontWeight: 600, fontFamily: FONT,
          letterSpacing: "0.06em", textTransform: "uppercase",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
          background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)",
          cursor: "pointer", transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(149,131,233,0.3)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.background = "rgba(149,131,233,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        >{"Reset to Defaults"}</button>
      </div>
    </div>
  );
}

/* ═══ PORTAL BACKGROUND — day/night image swap ═══ */
export function PortalBackground({ nightMode }) {
  const dayImg = "/images/WW-Website-BG-Day-V1-4K.png";
  const nightImg = "/images/WW-Website-BG-Night-V1-4K.png";
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      /* Pre-promote to own GPU layer to avoid recomposite flash */
      willChange: "transform",
      contain: "layout paint",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    }}>
      {/* Preload both images to prevent flash on first swap */}
      <link rel="preload" as="image" href={dayImg} />
      <link rel="preload" as="image" href={nightImg} />
      {/* Night layer */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${nightImg}')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        opacity: nightMode ? 1 : 0,
        transition: "opacity 0.8s ease",
        willChange: "opacity",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }} />
      {/* Day layer */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${dayImg}')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        opacity: nightMode ? 0 : 1,
        transition: "opacity 0.8s ease",
        willChange: "opacity",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
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
