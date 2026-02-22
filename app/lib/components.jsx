/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Shared UI Components
   ─────────────────────────────────────────────────────────
   GlassCard, FormField, TripleToggle, SectionLabel, MiniTrack,
   PageNav, PortalBackground — shared across all services.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
"use client";
import { WF, FC, FONT, MONO, CLICK, GLASS, glassPill, inputBase, WORKFLOW_STEPS, STEP_DESC } from "./tokens";

/* ═══ TOP SHINE — decorative highlight line ═══ */
export function TopShine({ r = 16 }) {
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: 0, height: 1,
      borderRadius: `${r}px ${r}px 0 0`, pointerEvents: "none",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
    }} />
  );
}

/* ═══ GLASS CARD ═══ */
export function GlassCard({ children, style: s = {}, hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ ...GLASS.default, position: "relative", overflow: "hidden", ...s, transition: `all ${CLICK.duration}` }}
      onMouseEnter={hover ? e => {
        e.currentTarget.style.borderColor = CLICK.hover.borderColor;
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = CLICK.hover.boxShadow;
      } : undefined}
      onMouseLeave={hover ? e => {
        e.currentTarget.style.borderColor = FC.border;
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = GLASS.default.boxShadow;
      } : undefined}
    >
      <TopShine />
      <div style={{ position: "relative" }}>{children}</div>
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
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(221,172,239,0.5)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
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
              flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer",
              background: active ? `${c}18` : FC.glass,
              border: `1px solid ${active ? `${c}50` : FC.border}`,
              color: active ? c : FC.textDim,
              fontSize: 12, fontWeight: active ? 600 : 400, fontFamily: FONT,
              transition: `all ${CLICK.duration}`,
              boxShadow: active ? `0 0 20px ${c}15` : "none",
              backdropFilter: "blur(var(--glass-blur,18px))", WebkitBackdropFilter: "blur(var(--glass-blur,18px))",
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
export function PageNav({ onBack, onHome, onNext, backLabel = "Back", nextLabel = "Next" }) {
  const navBtn = {
    background: FC.glass, border: `1px solid ${FC.border}`, borderRadius: 10,
    padding: "10px 22px", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: FONT,
    color: FC.textSecondary, backdropFilter: "blur(var(--glass-blur,18px))", WebkitBackdropFilter: "blur(var(--glass-blur,18px))",
    transition: `all ${CLICK.duration}`, minWidth: 80, textAlign: "center",
  };
  const hoverIn = (e) => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; e.currentTarget.style.color = FC.textPrimary; };
  const hoverOut = (e) => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.color = FC.textSecondary; };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: "24px 24px 32px" }}>
      {onBack ? <button onClick={onBack} style={navBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{backLabel}</button> : <div style={{ minWidth: 80 }} />}
      {onHome ? <button onClick={onHome} style={navBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{"Home"}</button> : <div style={{ minWidth: 80 }} />}
      {onNext ? <button onClick={onNext} style={navBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{nextLabel}</button> : <div style={{ minWidth: 80 }} />}
    </div>
  );
}

/* ═══ PORTAL BACKGROUND ═══ */
export function PortalBackground({ nightMode }) {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('/images/wolf-flow-bg.jpg')",
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        filter: nightMode ? "brightness(0.45) saturate(0.85)" : "brightness(1.1) saturate(1.15)",
        transition: "filter 0.6s ease",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: nightMode
          ? "linear-gradient(180deg, rgba(26,22,40,0.7) 0%, rgba(34,28,53,0.75) 100%)"
          : "linear-gradient(180deg, rgba(26,22,40,0.35) 0%, rgba(34,28,53,0.45) 100%)",
        transition: "background 0.6s ease",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "8%", width: "50%", height: "50%",
        opacity: nightMode ? 0.12 : 0.22,
        background: `radial-gradient(ellipse, ${WF.accent}, transparent 70%)`, filter: "blur(90px)",
      }} />
      <div style={{
        position: "absolute", top: "8%", right: "5%", width: "40%", height: "40%",
        opacity: nightMode ? 0.06 : 0.14,
        background: `radial-gradient(ellipse, ${WF.warm}, transparent 70%)`, filter: "blur(90px)",
      }} />
    </div>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
