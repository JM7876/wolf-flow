/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Shared UI Components
   ─────────────────────────────────────────────────────────
   GlassCard, FormField, TripleToggle, SectionLabel, MiniTrack,
   PageNav, PortalBackground — shared across all services.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
"use client";
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
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
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
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
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
    background: "linear-gradient(168deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14,
    padding: "10px 22px", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: FONT,
    color: FC.textSecondary,
    backdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4))",
    WebkitBackdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4))",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.03)",
    transition: `all ${CLICK.duration}`, minWidth: 80, textAlign: "center",
  };
  const disabledBtn = {
    ...navBtn,
    opacity: 0.3,
    cursor: "not-allowed",
    color: FC.textDim,
  };
  const hoverIn = (e) => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; e.currentTarget.style.color = FC.textPrimary; e.currentTarget.style.transform = "translateY(-1px)"; };
  const hoverOut = (e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = navBtn.boxShadow; e.currentTarget.style.color = FC.textSecondary; e.currentTarget.style.transform = "none"; };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: "24px 24px 32px" }}>
      {onBack ? <button onClick={onBack} style={navBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{backLabel}</button> : <div style={{ minWidth: 80 }} />}
      {onHome ? <button onClick={onHome} style={navBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{"Home"}</button> : <div style={{ minWidth: 80 }} />}
      {onNext ? (
        <button onClick={onNext} style={navBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{nextLabel}</button>
      ) : showDisabledNext ? (
        <button disabled style={disabledBtn}>{nextLabel}</button>
      ) : (
        <div style={{ minWidth: 80 }} />
      )}
    </div>
  );
}

/* ═══ PORTAL BACKGROUND — day/night image swap ═══ */
export function PortalBackground({ nightMode }) {
  const dayImg = "/images/WW-Website-BG-Day-V1.webp";
  const nightImg = "/images/WW-Website-BG-Night-V1.webp";
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {/* Night layer */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${nightImg}')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        opacity: nightMode ? 1 : 0,
        transition: "opacity 0.8s ease",
      }} />
      {/* Day layer */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${dayImg}')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        opacity: nightMode ? 0 : 1,
        transition: "opacity 0.8s ease",
      }} />
      {/* Subtle scrim for content readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: nightMode
          ? "linear-gradient(180deg, rgba(26,22,40,0.40) 0%, rgba(34,28,53,0.50) 100%)"
          : "linear-gradient(180deg, rgba(26,22,40,0.22) 0%, rgba(34,28,53,0.32) 100%)",
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
