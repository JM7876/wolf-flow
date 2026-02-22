"use client";
/* ═══════════════════════════════════════════════════════════
   GLASS CONTROL PANEL — Standalone Reusable Component
   ─────────────────────────────────────────────────────────
   Floating panel with sliders for glass engine CSS variables.
   Includes 3 preset material themes.
   Updates document.documentElement.style directly — no re-renders.
   Created by Johnathon Moulds | Wolf Flow Solutions
   ═══════════════════════════════════════════════════════════ */
import React, { useState, useRef, useEffect } from "react";

const FONT = "'Montserrat Alternates', -apple-system, BlinkMacSystemFont, sans-serif";

const PRESETS = {
  frost: {
    label: "Soft Frost",
    values: { displacement: 0, blur: 22, opacity: 0.22, brightness: 1.08, saturation: 1.05, bezel: 20 },
  },
  dream: {
    label: "Dream Glass",
    values: { displacement: 2, blur: 28, opacity: 0.28, brightness: 1.1, saturation: 1.25, bezel: 26 },
  },
  studio: {
    label: "Studio Glass",
    values: { displacement: 0, blur: 14, opacity: 0.14, brightness: 1, saturation: 1, bezel: 12 },
  },
};

const SLIDERS = [
  { key: "displacement", label: "Displacement", cssVar: "--glass-displacement", unit: "px", min: 0, max: 10, step: 0.5, defaultVal: 0 },
  { key: "blur",         label: "Blur",         cssVar: "--glass-blur",         unit: "px", min: 0, max: 50, step: 1,   defaultVal: 18 },
  { key: "opacity",      label: "Opacity",      cssVar: "--glass-opacity",      unit: "",   min: 0, max: 0.5, step: 0.01, defaultVal: 0.18 },
  { key: "brightness",   label: "Brightness",   cssVar: "--glass-brightness",   unit: "",   min: 0.8, max: 1.4, step: 0.01, defaultVal: 1.05 },
  { key: "saturation",   label: "Saturation",   cssVar: "--glass-saturation",   unit: "",   min: 0.5, max: 2,   step: 0.05, defaultVal: 1.1 },
  { key: "bezel",        label: "Bezel Depth",  cssVar: "--glass-bezel-depth",  unit: "px", min: 0, max: 40, step: 1,   defaultVal: 18 },
];

function setGlassVar(cssVar, value, unit) {
  document.documentElement.style.setProperty(cssVar, value + unit);
}

export default function GlassControlPanel({ open, onClose }) {
  const [values, setValues] = useState(() => {
    const init = {};
    SLIDERS.forEach(s => { init[s.key] = s.defaultVal; });
    return init;
  });
  const [activePreset, setActivePreset] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const updateSlider = (key, val) => {
    const slider = SLIDERS.find(s => s.key === key);
    const numVal = parseFloat(val);
    setValues(prev => ({ ...prev, [key]: numVal }));
    setActivePreset(null);
    setGlassVar(slider.cssVar, numVal, slider.unit);
  };

  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    const newVals = {};
    SLIDERS.forEach(s => {
      const v = preset.values[s.key];
      newVals[s.key] = v;
      setGlassVar(s.cssVar, v, s.unit);
    });
    setValues(newVals);
    setActivePreset(presetKey);
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        bottom: 72,
        right: 16,
        zIndex: 9999,
        width: 280,
        borderRadius: 20,
        padding: 20,
        background: "rgba(34,28,53,0.85)",
        backdropFilter: "blur(24px) brightness(1.05) saturate(1.15)",
        WebkitBackdropFilter: "blur(24px) brightness(1.05) saturate(1.15)",
        border: "1px solid rgba(149,131,233,0.2)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(12px)",
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.25s ease, transform 0.25s ease",
        fontFamily: FONT,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,205,243,0.7)" }}>
          Glass Engine
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", color: "rgba(240,205,243,0.4)",
            fontSize: 16, cursor: "pointer", padding: "2px 6px", lineHeight: 1,
          }}
          aria-label="Close glass control panel"
        >
          x
        </button>
      </div>

      {/* Preset buttons */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            style={{
              flex: 1,
              padding: "7px 4px",
              fontSize: 9,
              fontWeight: 600,
              fontFamily: FONT,
              letterSpacing: "0.04em",
              border: `1px solid ${activePreset === key ? "rgba(149,131,233,0.5)" : "rgba(149,131,233,0.15)"}`,
              borderRadius: 10,
              background: activePreset === key ? "rgba(149,131,233,0.15)" : "rgba(255,255,255,0.04)",
              color: activePreset === key ? "#BD95EE" : "rgba(240,205,243,0.5)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {SLIDERS.map(s => (
          <div key={s.key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(240,205,243,0.6)" }}>{s.label}</span>
              <span style={{ fontSize: 10, fontFamily: FONT, color: "rgba(189,149,238,0.7)" }}>
                {s.unit === "px" ? `${values[s.key]}px` : values[s.key].toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={values[s.key]}
              onChange={e => updateSlider(s.key, e.target.value)}
              style={{ width: "100%", cursor: "pointer" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
