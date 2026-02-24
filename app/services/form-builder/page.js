/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — DIY Form Builder
   ─────────────────────────────────────────────────────────
   Route: /services/form-builder
   Multi-step wizard: Title > Description > Questions >
   Notifications > Review > Published confirmation + QR.
   Fully aligned to the Wolf Flow design system.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { WF, FC, FONT, MONO, CLICK, GLASS, glassPill, inputBase } from "../../lib/tokens";
import { GlassCard, SectionLabel, FormField, PageNav, PortalBackground, Footer } from "../../lib/components";
import { generateQR } from "../../lib/qr-encoder";

/* ═══ CONSTANTS ═══ */
const BUILDER_STEPS = { TITLE: 0, DESCRIPTION: 1, QUESTIONS: 2, NOTIFICATIONS: 3, REVIEW: 4 };

const QUESTION_TYPES = [
  { id: "short_text", label: "Short Text", icon: "Aa", description: "Single-line text input" },
  { id: "long_text", label: "Long Text", icon: "\u00B6", description: "Multi-line text area" },
  { id: "single_choice", label: "Single Choice", icon: "\u25C9", description: "Radio button selection" },
  { id: "multiple_choice", label: "Multiple Choice", icon: "\u2611", description: "Checkbox selection" },
  { id: "dropdown", label: "Dropdown", icon: "\u25BE", description: "Dropdown menu selection" },
  { id: "number", label: "Number", icon: "#", description: "Numeric input field" },
  { id: "date", label: "Date", icon: "\u{1F4C5}", description: "Date picker" },
  { id: "email", label: "Email", icon: "@", description: "Email address field" },
  { id: "file_upload", label: "File Upload", icon: "\u{1F4CE}", description: "File attachment" },
];

/* ═══ LOCAL GLASS ═══ */
const Glass = ({ children, active, onClick, style: s = {} }) => {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: active
          ? `linear-gradient(168deg, ${WF.accent}22 0%, ${WF.accent}14 40%, ${WF.accent}0A 100%)`
          : "linear-gradient(168deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.03) 100%)",
        backdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4)) brightness(var(--glass-brightness,1.12)) contrast(var(--glass-contrast,1.05))",
        WebkitBackdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4)) brightness(var(--glass-brightness,1.12)) contrast(var(--glass-contrast,1.05))",
        border: `1px solid ${active ? WF.accent + "55" : h && onClick ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.14)"}`,
        borderRadius: 16, transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: onClick ? "pointer" : "default",
        boxShadow: active
          ? `0 8px 32px ${WF.accent}20, 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.18)`
          : h && onClick
            ? `0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.16)`
            : `0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.1)`,
        transform: h && onClick ? "translateY(-2px) scale(1.005)" : "none",
        position: "relative", overflow: "hidden", ...s,
      }}>
      <div style={{
        position: "absolute", left: "8%", right: "8%", top: 0, height: "35%", pointerEvents: "none",
        background: `linear-gradient(180deg, ${active ? WF.accent + "20" : "rgba(255,255,255,0.1)"} 0%, transparent 100%)`,
        maskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
      }} />
      <div style={{
        position: "absolute", left: "5%", right: "5%", top: 0, height: 1, pointerEvents: "none",
        background: `linear-gradient(90deg, transparent, ${active ? WF.accent + "45" : "rgba(255,255,255,0.18)"}, transparent)`,
      }} />
      <div style={{
        position: "absolute", left: "10%", right: "10%", bottom: 0, height: 1, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
      }} />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
};

/* ═══ TOGGLE ═══ */
function Toggle({ active, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!active)} style={{
      width: 44, height: 24, borderRadius: 12,
      background: active
        ? `linear-gradient(135deg, ${WF.accent}, ${WF.accentDark})`
        : "rgba(255,255,255,0.1)",
      cursor: "pointer", position: "relative",
      transition: "background 0.2s ease", flexShrink: 0, border: "none",
      boxShadow: active ? `0 2px 10px ${WF.accentGlow}` : "none",
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3,
        left: active ? 23 : 3, transition: "left 0.2s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }} />
    </button>
  );
}

/* ═══ COPY BUTTON ═══ */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} style={{
      ...GLASS.default, padding: "6px 14px", cursor: "pointer", borderRadius: 10,
      color: copied ? FC.greenLight : FC.textSecondary, fontSize: 11, fontFamily: FONT, fontWeight: 500,
      border: `1px solid ${copied ? `${FC.greenLight}40` : FC.border}`,
      transition: `all ${CLICK.duration}`,
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = copied ? `${FC.greenLight}40` : FC.border; }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ═══ QR CODE DISPLAY — Canvas + Wolf Overlay ═══ */
function QRCodeDisplay({ url, size = 240, externalCanvasRef }) {
  const internalRef = useRef(null);
  const canvasRef = externalCanvasRef || internalRef;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!url || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 2; // retina
    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx.scale(scale, scale);

    // Generate QR matrix
    let qr;
    try { qr = generateQR(url); } catch {
      ctx.fillStyle = FC.dark;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = WF.accent;
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("QR Error", size / 2, size / 2);
      setReady(true);
      return;
    }

    const { modules, size: qrSize } = qr;
    const quiet = 2; // quiet zone modules
    const totalModules = qrSize + quiet * 2;
    const modSize = size / totalModules;

    // Background
    ctx.fillStyle = FC.dark;
    ctx.fillRect(0, 0, size, size);

    // Center exclusion zone for wolf overlay (circular)
    const centerX = size / 2;
    const centerY = size / 2;
    const overlayRadius = size * 0.28; // wolf circle takes ~28% radius

    // Draw QR modules with Wolf Flow accent gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, WF.accentLight);
    grad.addColorStop(0.5, WF.accent);
    grad.addColorStop(1, WF.pink);

    for (let r = 0; r < qrSize; r++) {
      for (let c = 0; c < qrSize; c++) {
        if (!modules[r][c]) continue;
        const x = (c + quiet) * modSize;
        const y = (r + quiet) * modSize;
        const mx = x + modSize / 2;
        const my = y + modSize / 2;
        const dist = Math.sqrt((mx - centerX) ** 2 + (my - centerY) ** 2);

        // Skip modules inside wolf overlay zone
        if (dist < overlayRadius - modSize * 0.5) continue;

        ctx.fillStyle = grad;
        // Rounded modules for modern look
        const pad = modSize * 0.1;
        const rad = modSize * 0.25;
        const rx = x + pad;
        const ry = y + pad;
        const rw = modSize - pad * 2;
        const rh = modSize - pad * 2;
        ctx.beginPath();
        ctx.moveTo(rx + rad, ry);
        ctx.lineTo(rx + rw - rad, ry);
        ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
        ctx.lineTo(rx + rw, ry + rh - rad);
        ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
        ctx.lineTo(rx + rad, ry + rh);
        ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
        ctx.lineTo(rx, ry + rad);
        ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Load and draw wolf SVG overlay in center
    const wolfImg = new Image();
    wolfImg.crossOrigin = "anonymous";
    wolfImg.onload = () => {
      const wolfSize = overlayRadius * 2;
      const dx = centerX - wolfSize / 2;
      const dy = centerY - wolfSize / 2;

      // Dark background circle behind wolf
      ctx.beginPath();
      ctx.arc(centerX, centerY, overlayRadius + modSize * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = FC.dark;
      ctx.fill();

      // Draw the wolf SVG
      ctx.drawImage(wolfImg, dx, dy, wolfSize, wolfSize);
      setReady(true);
    };
    wolfImg.onerror = () => {
      // Fallback: draw a simple branded circle if SVG fails
      ctx.beginPath();
      ctx.arc(centerX, centerY, overlayRadius, 0, Math.PI * 2);
      ctx.fillStyle = FC.dark;
      ctx.fill();
      ctx.strokeStyle = WF.accent;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = WF.accent;
      ctx.font = `bold ${size * 0.06}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("WF", centerX, centerY);
      setReady(true);
    };
    wolfImg.src = "/images/qr-wolf-overlay.svg";
  }, [url, size]);

  return (
    <div style={{
      width: size, height: size, borderRadius: 16, overflow: "hidden",
      border: `1px solid ${FC.border}`, background: FC.dark,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      <canvas ref={canvasRef} style={{ width: size, height: size, display: ready ? "block" : "none" }}
        aria-label={`QR Code for ${url}`} role="img" />
      {!ready && (
        <div style={{ color: FC.textDim, fontSize: 12, fontFamily: FONT }}>{"Generating QR..."}</div>
      )}
    </div>
  );
}

/* ═══ PUBLISHED QR SECTION (with download) ═══ */
function PublishedQRSection({ url, title }) {
  const pubCanvasRef = useRef(null);
  const handleDownloadPub = () => {
    if (pubCanvasRef.current) {
      const link = document.createElement("a");
      link.download = `${(title || "form").replace(/\s+/g, "-").toLowerCase()}-qr-wolf-flow.png`;
      link.href = pubCanvasRef.current.toDataURL("image/png");
      link.click();
    }
  };
  return (
    <GlassCard style={{ padding: 20, marginBottom: 24 }}>
      <SectionLabel>{"Scan to open form"}</SectionLabel>
      <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
        <QRCodeDisplay url={url} size={220} externalCanvasRef={pubCanvasRef} />
      </div>
      <button style={{
        ...glassPill, padding: "8px 20px", fontSize: 11,
        border: `1px solid ${FC.border}`, color: FC.textSecondary,
      }} onClick={handleDownloadPub}
        onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.color = FC.textPrimary; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.color = FC.textSecondary; }}
      >
        {"Download QR Code"}
      </button>
    </GlassCard>
  );
}

/* ═══ QR CODE BUILDER MODAL ═══ */
function QRCodeBuilder({ onClose }) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => { if (url.trim()) setGenerated(true); };
  const handleReset = () => { setUrl(""); setLabel(""); setGenerated(false); };
  const downloadRef = useRef(null);
  const handleDownload = () => {
    // Render a high-res QR for download
    if (downloadRef.current) {
      const link = document.createElement("a");
      link.download = `${(label || "qr-code").replace(/\s+/g, "-").toLowerCase()}-wolf-flow.png`;
      link.href = downloadRef.current.toDataURL("image/png");
      link.click();
    }
  };

  const focusIn = (e) => { e.target.style.borderColor = `${WF.accent}60`; };
  const focusOut = (e) => { e.target.style.borderColor = FC.border; };

  return (
    <GlassCard style={{ padding: "28px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, margin: 0 }}>
          {"QR Code "}<span style={{ color: WF.accent }}>{"Generator"}</span>
        </h3>
        <button onClick={onClose} style={{
          ...GLASS.default, width: 32, height: 32, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 16, color: FC.textDim,
          border: `1px solid ${FC.border}`,
        }}>
          {"\u00D7"}
        </button>
      </div>

      {!generated ? (
        <div>
          <p style={{ fontSize: 13, fontFamily: FONT, color: FC.textDim, marginBottom: 20 }}>
            {"Generate a QR code that links to any form, page, or URL."}
          </p>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 500, fontFamily: FONT, color: FC.textSecondary, letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
              {"Label (optional)"}
            </label>
            <input type="text" style={inputBase} value={label} onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Housing Request Form" onFocus={focusIn} onBlur={focusOut} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 500, fontFamily: FONT, color: FC.textSecondary, letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
              {"URL"}<span style={{ color: FC.redLight }}>{" *"}</span>
            </label>
            <input type="url" style={inputBase} value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/forms/your-form" onFocus={focusIn} onBlur={focusOut} />
          </div>
          <button style={{
            ...glassPill, width: "100%", padding: "14px",
            border: `1px solid ${WF.accent}30`, color: url.trim() ? `${WF.accentLight}` : FC.textDim,
            opacity: url.trim() ? 1 : 0.5, pointerEvents: url.trim() ? "auto" : "none",
          }} onClick={handleGenerate}
            onMouseEnter={url.trim() ? e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; } : undefined}
            onMouseLeave={url.trim() ? e => { e.currentTarget.style.borderColor = `${WF.accent}30`; e.currentTarget.style.boxShadow = glassPill.boxShadow; } : undefined}
          >
            {"Generate QR Code"}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          {label && <div style={{ fontSize: 15, fontWeight: 500, fontFamily: FONT, color: FC.textPrimary, marginBottom: 16 }}>{label}</div>}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <QRCodeDisplay url={url} size={240} externalCanvasRef={downloadRef} />
          </div>
          <GlassCard style={{ padding: "12px 14px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
              <CopyButton text={url} />
            </div>
          </GlassCard>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button style={{
              ...glassPill, padding: "12px 24px", fontSize: 12,
              border: `1px solid ${FC.border}`, color: FC.textSecondary,
            }} onClick={handleReset}
              onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.color = FC.textPrimary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.color = FC.textSecondary; }}
            >{"New QR Code"}</button>
            <button style={{
              ...glassPill, padding: "12px 24px", fontSize: 12,
              border: `1px solid ${WF.accent}30`, color: WF.accentLight,
            }} onClick={handleDownload}
              onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}30`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
            >{"Download PNG"}</button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

/* ═══ PROGRESS BAR ═══ */
function ProgressBar({ currentStep }) {
  const labels = ["Title", "Description", "Questions", "Notifications", "Review"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28 }}>
      {labels.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {i > 0 && (
            <div style={{
              width: 36, height: 2, borderRadius: 1,
              background: i <= currentStep
                ? `linear-gradient(90deg, ${WF.accent}, ${WF.pink}80)`
                : "rgba(255,255,255,0.08)",
              transition: "background 0.3s ease",
            }} />
          )}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: i === currentStep ? 12 : 8,
              height: i === currentStep ? 12 : 8,
              borderRadius: "50%",
              background: i < currentStep
                ? `linear-gradient(135deg, ${WF.accent}, ${WF.pink})`
                : i === currentStep
                  ? WF.accentLight
                  : "rgba(255,255,255,0.12)",
              transition: "all 0.3s ease",
              boxShadow: i === currentStep ? `0 0 12px ${WF.accentGlow}` : "none",
            }} />
            <span style={{
              fontSize: 8, fontFamily: FONT, fontWeight: 600,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: i <= currentStep ? WF.accent : FC.textDim,
              transition: "color 0.3s ease",
            }}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ QUESTION CARD ═══ */
function QuestionCard({ question, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(question.label);
  const [editingOptions, setEditingOptions] = useState(false);
  const [optionsValue, setOptionsValue] = useState((question.options || []).join("\n"));
  const hasOptions = ["single_choice", "multiple_choice", "dropdown"].includes(question.type);
  const typeInfo = QUESTION_TYPES.find((t) => t.id === question.type);

  const iconBtn = {
    ...GLASS.default, width: 30, height: 30, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", fontSize: 13, fontFamily: FONT, border: `1px solid ${FC.border}`,
    color: FC.textDim, transition: `all ${CLICK.duration}`,
  };

  return (
    <Glass style={{ marginBottom: 12, padding: "18px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: `linear-gradient(135deg, ${WF.accent}, ${WF.accentDark})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, fontFamily: FONT, color: "#fff", flexShrink: 0,
            boxShadow: `0 2px 10px ${WF.accentGlow}`,
          }}>{index + 1}</div>
          <div style={{ flex: 1 }}>
            {editingLabel ? (
              <input type="text" style={{ ...inputBase, padding: "8px 12px", fontSize: 13 }} value={labelValue}
                onChange={(e) => setLabelValue(e.target.value)}
                onBlur={() => { setEditingLabel(false); onUpdate({ ...question, label: labelValue }); }}
                onKeyDown={(e) => { if (e.key === "Enter") { setEditingLabel(false); onUpdate({ ...question, label: labelValue }); } }}
                autoFocus />
            ) : (
              <div style={{ fontSize: 14, fontWeight: 500, fontFamily: FONT, color: FC.textPrimary, cursor: "pointer" }}
                onClick={() => setEditingLabel(true)}>
                {question.label || "Untitled Question"}
                <span style={{ fontSize: 10, color: FC.textDim, marginLeft: 8 }}>{"click to edit"}</span>
              </div>
            )}
            <div style={{ fontSize: 11, fontFamily: FONT, color: WF.accentLight, marginTop: 3 }}>
              {typeInfo?.icon}{" "}{typeInfo?.label}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button style={{ ...iconBtn, opacity: index === 0 ? 0.3 : 1, pointerEvents: index === 0 ? "none" : "auto" }}
            onClick={() => onMoveUp(index)}>{"\u2191"}</button>
          <button style={{ ...iconBtn, opacity: index === total - 1 ? 0.3 : 1, pointerEvents: index === total - 1 ? "none" : "auto" }}
            onClick={() => onMoveDown(index)}>{"\u2193"}</button>
          <button style={{ ...iconBtn, color: FC.redLight }} onClick={() => onDelete(index)}>{"\u00D7"}</button>
        </div>
      </div>

      {hasOptions && (
        <div style={{ marginTop: 10 }}>
          {editingOptions ? (
            <div>
              <label style={{ fontSize: 10, fontWeight: 500, fontFamily: FONT, color: FC.textDim, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                {"Options (one per line)"}
              </label>
              <textarea style={{ ...inputBase, minHeight: 70, fontSize: 12, resize: "vertical" }} value={optionsValue}
                onChange={(e) => setOptionsValue(e.target.value)}
                onBlur={() => { setEditingOptions(false); onUpdate({ ...question, options: optionsValue.split("\n").map((o) => o.trim()).filter(Boolean) }); }}
                autoFocus />
            </div>
          ) : (
            <div style={{ cursor: "pointer" }} onClick={() => setEditingOptions(true)}>
              {(question.options || []).length === 0 ? (
                <span style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim }}>{"Click to add options..."}</span>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {question.options.map((opt, i) => (
                    <span key={i} style={{
                      display: "inline-block", padding: "3px 10px",
                      background: `${WF.accent}15`, color: WF.accentLight,
                      borderRadius: 8, fontSize: 11, fontWeight: 500, fontFamily: FONT,
                      border: `1px solid ${WF.accent}25`,
                    }}>{opt}</span>
                  ))}
                  <span style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim, alignSelf: "center" }}>{"click to edit"}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 10, borderTop: `1px solid ${FC.border}` }}>
        <span style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim }}>{"Required"}</span>
        <Toggle active={question.required} onChange={(val) => onUpdate({ ...question, required: val })} />
      </div>
    </Glass>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function DIYFormBuilder() {
  const router = useRouter();
  const [view, setView] = useState("welcome");
  const [step, setStep] = useState(BUILDER_STEPS.TITLE);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [notifications, setNotifications] = useState({ emailOnSubmit: true, emailTo: "", sendConfirmation: false, confirmationMessage: "" });
  const [savedForms, setSavedForms] = useState([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [publishedForm, setPublishedForm] = useState(null);

  const focusIn = (e) => { e.target.style.borderColor = `${WF.accent}60`; };
  const focusOut = (e) => { e.target.style.borderColor = FC.border; };

  /* ── Handlers ── */
  const handleNext = useCallback(() => setStep((prev) => Math.min(prev + 1, BUILDER_STEPS.REVIEW)), []);
  const handleBack = useCallback(() => setStep((prev) => Math.max(prev - 1, BUILDER_STEPS.TITLE)), []);

  const handleAddQuestion = useCallback((typeId) => {
    setQuestions((prev) => [...prev, { id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, type: typeId, label: "", required: false, options: [] }]);
    setShowTypeSelector(false);
  }, []);

  const handleUpdateQuestion = useCallback((index, updated) => { setQuestions((prev) => { const next = [...prev]; next[index] = updated; return next; }); }, []);
  const handleDeleteQuestion = useCallback((index) => { setQuestions((prev) => prev.filter((_, i) => i !== index)); }, []);
  const handleMoveUp = useCallback((index) => { if (index === 0) return; setQuestions((prev) => { const next = [...prev]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return next; }); }, []);
  const handleMoveDown = useCallback((index) => { setQuestions((prev) => { if (index >= prev.length - 1) return prev; const next = [...prev]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; return next; }); }, []);

  const generateFormSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handlePublish = useCallback(() => {
    const formId = `WF-FORM-${Date.now()}`;
    const slug = generateFormSlug(formTitle);
    const formUrl = `https://wolfflow.solutions/forms/${slug}`;
    const form = { id: formId, title: formTitle, description: formDescription, questions, notifications, createdAt: new Date().toISOString(), submissions: 0, slug, url: formUrl };
    setSavedForms((prev) => [form, ...prev]);
    setPublishedForm(form);
    setView("published");
  }, [formTitle, formDescription, questions, notifications]);

  const handleNewForm = useCallback(() => {
    setFormTitle(""); setFormDescription(""); setQuestions([]);
    setNotifications({ emailOnSubmit: true, emailTo: "", sendConfirmation: false, confirmationMessage: "" });
    setStep(BUILDER_STEPS.TITLE); setView("builder");
  }, []);

  /* ═══ PUBLISHED CONFIRMATION ═══ */
  function renderPublishedConfirmation() {
    if (!publishedForm) return null;
    const f = publishedForm;
    const publishDate = new Date(f.createdAt).toLocaleString("en-US", {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });

    return (
      <div>
        <GlassCard style={{ padding: "36px 28px", textAlign: "center" }}>
          {/* Success indicator */}
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: "0 auto 16px",
            background: `linear-gradient(135deg, ${FC.greenLight}25, ${FC.greenLight}08)`,
            border: `2px solid ${FC.greenLight}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, boxShadow: `0 0 30px ${FC.greenLight}15`,
          }}>{"\u2713"}</div>

          <h2 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 24, color: FC.textPrimary, marginBottom: 4 }}>
            {"Form "}<span style={{ color: FC.greenLight }}>{"Published"}</span>
          </h2>
          <p style={{ fontSize: 13, fontFamily: FONT, color: FC.textDim, marginBottom: 28 }}>
            {"Your form is live and ready to accept submissions."}
          </p>

          {/* Form details */}
          <GlassCard style={{ padding: 18, marginBottom: 16, textAlign: "left" }}>
            {[
              ["Form Title", f.title],
              ["Questions", `${f.questions.length} question${f.questions.length !== 1 ? "s" : ""}`],
              ["Notifications", f.notifications.emailOnSubmit ? `Email \u2192 ${f.notifications.emailTo || "(not set)"}` : "Disabled"],
              ["Published", publishDate],
              ["Form ID", f.id],
            ].map(([k, v], i) => (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                paddingBottom: i < 4 ? 10 : 0, marginBottom: i < 4 ? 10 : 0,
                borderBottom: i < 4 ? `1px solid ${FC.border}` : "none",
              }}>
                <span style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{k}</span>
                <span style={{ fontSize: 13, fontFamily: k === "Form ID" ? MONO : FONT, color: FC.textPrimary, fontWeight: k === "Form Title" ? 600 : 400, textAlign: "right", maxWidth: "60%" }}>{v}</span>
              </div>
            ))}
          </GlassCard>

          {/* Form URL */}
          <GlassCard style={{ padding: "12px 14px", marginBottom: 16 }}>
            <SectionLabel>{"Form URL"}</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 12, fontFamily: FONT, color: WF.accentLight, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.url}</span>
              <CopyButton text={f.url} />
            </div>
          </GlassCard>

          {/* QR Code */}
          <PublishedQRSection url={f.url} title={f.title} />

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{
              ...glassPill, padding: "12px 24px", fontSize: 12,
              border: `1px solid ${FC.border}`, color: FC.textSecondary,
            }} onClick={() => setView("my-forms")}
              onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.color = FC.textPrimary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.color = FC.textSecondary; }}
            >{"View All Forms"}</button>
            <button style={{
              ...glassPill, padding: "12px 24px", fontSize: 12,
              border: `1px solid ${WF.accent}30`, color: WF.accentLight,
            }} onClick={handleNewForm}
              onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}30`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
            >{"Create Another Form"}</button>
          </div>
        </GlassCard>
      </div>
    );
  }

  /* ═══ WELCOME ═══ */
  function renderWelcome() {
    return (
      <GlassCard style={{ padding: "44px 28px", textAlign: "center" }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16, margin: "0 auto 14px",
          background: `linear-gradient(135deg, ${WF.accent}25, ${WF.accent}08)`,
          border: `1px solid ${WF.accent}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, boxShadow: `0 4px 24px ${WF.accentGlow}`,
        }}>{"\u25A6"}</div>
        <h2 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 26, color: FC.textPrimary, marginBottom: 6, lineHeight: 1.3 }}>
          {"DIY Form "}<span style={{ color: WF.accent }}>{"Builder"}</span>
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 300, color: FC.textDim, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
          {"Build custom forms for tribal services, surveys, and applications. Add questions, set notifications, and share with your team."}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            ...glassPill, padding: "14px 40px", fontSize: 14,
            border: `1px solid ${WF.accent}40`, color: WF.accentLight,
          }} onClick={handleNewForm}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
          >{"Create New Form"}</button>
          <button style={{
            ...glassPill, padding: "14px 28px", fontSize: 14,
            border: `1px solid ${WF.accent}40`, color: WF.accentLight,
          }} onClick={() => setView("my-forms")}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
          >{"My Forms"}</button>
          <button style={{
            ...glassPill, padding: "14px 28px", fontSize: 14,
            border: `1px solid ${WF.accent}40`, color: WF.accentLight,
          }} onClick={() => setView("qr-builder")}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
          >{"QR Code Generator"}</button>
        </div>
      </GlassCard>
    );
  }

  /* ═══ MY FORMS ═══ */
  function renderMyForms() {
    return (
      <div>
        <GlassCard style={{ padding: "24px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, margin: 0 }}>
              {"My "}<span style={{ color: WF.accent }}>{"Forms"}</span>
            </h3>
            <button style={{
              ...glassPill, padding: "10px 20px", fontSize: 12,
              border: `1px solid ${WF.accent}30`, color: WF.accentLight,
            }} onClick={handleNewForm}
              onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}30`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
            >{"+ New Form"}</button>
          </div>
          {savedForms.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.25 }}>{"\u{1F4DD}"}</div>
              <p style={{ fontSize: 14, fontFamily: FONT, color: FC.textDim, marginBottom: 20 }}>{"No forms yet. Create your first form to get started."}</p>
              <button style={{
                ...glassPill, padding: "12px 28px", fontSize: 13,
                border: `1px solid ${WF.accent}30`, color: WF.accentLight,
              }} onClick={handleNewForm}
                onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}30`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
              >{"Create New Form"}</button>
            </div>
          ) : (
            <div>
              {savedForms.map((form) => (
                <Glass key={form.id} style={{ marginBottom: 10, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, fontFamily: FONT, color: FC.textPrimary }}>{form.title}</div>
                      <div style={{ fontSize: 11, fontFamily: FONT, color: FC.textDim, marginTop: 3 }}>
                        {form.questions.length}{" question"}{form.questions.length !== 1 ? "s" : ""}{" \u00B7 "}{new Date(form.createdAt).toLocaleDateString()}
                      </div>
                      {form.url && <div style={{ fontSize: 10, fontFamily: FONT, color: WF.accentLight, marginTop: 3, opacity: 0.7 }}>{form.url}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 600, fontFamily: FONT, padding: "3px 10px", borderRadius: 8,
                        background: `${WF.accent}15`, color: WF.accentLight, border: `1px solid ${WF.accent}25`,
                      }}>{form.submissions}{" submissions"}</span>
                      <CopyButton text={form.url} />
                    </div>
                  </div>
                </Glass>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    );
  }

  /* ═══ BUILDER STEPS ═══ */
  function renderTitleStep() {
    return (
      <GlassCard style={{ padding: "24px 22px" }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, marginBottom: 4 }}>
          {"Form "}<span style={{ color: WF.accent }}>{"Title"}</span>
        </h3>
        <p style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginBottom: 20 }}>{"Give your form a clear, descriptive title"}</p>
        <FormField label="Title" value={formTitle} onChange={(v) => setFormTitle(v)} placeholder="e.g., Housing Maintenance Request Form" required />
      </GlassCard>
    );
  }

  function renderDescriptionStep() {
    return (
      <GlassCard style={{ padding: "24px 22px" }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, marginBottom: 4 }}>
          {"Form "}<span style={{ color: WF.accent }}>{"Description"}</span>
        </h3>
        <p style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginBottom: 20 }}>{"Add a brief description that explains the purpose of this form"}</p>
        <FormField label="Description" value={formDescription} onChange={(v) => setFormDescription(v)} placeholder="Describe what this form is for..." textarea />
      </GlassCard>
    );
  }

  function renderQuestionsStep() {
    return (
      <GlassCard style={{ padding: "24px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, margin: 0 }}>
              {"Build "}<span style={{ color: WF.accent }}>{"Questions"}</span>
            </h3>
            <p style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginTop: 3 }}>
              {questions.length}{" question"}{questions.length !== 1 ? "s" : ""}{" added"}
            </p>
          </div>
          <button style={{
            ...glassPill, padding: "10px 18px", fontSize: 12,
            border: `1px solid ${WF.accent}30`, color: WF.accentLight,
          }} onClick={() => setShowTypeSelector(!showTypeSelector)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}30`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
          >{"+ Add Question"}</button>
        </div>

        {showTypeSelector && (
          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <SectionLabel>{"Choose Question Type"}</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
              {QUESTION_TYPES.map((qt) => (
                <Glass key={qt.id} onClick={() => handleAddQuestion(qt.id)} style={{ padding: 12, textAlign: "center" }}>
                  <span style={{ fontSize: 22, marginBottom: 4, display: "block", color: WF.accentLight }}>{qt.icon}</span>
                  <div style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT, color: FC.textPrimary }}>{qt.label}</div>
                  <div style={{ fontSize: 9, fontFamily: FONT, color: FC.textDim, marginTop: 2 }}>{qt.description}</div>
                </Glass>
              ))}
            </div>
          </GlassCard>
        )}

        {questions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.2 }}>{"\u{1F4DD}"}</div>
            <p style={{ fontSize: 14, fontFamily: FONT, color: FC.textDim }}>{"No questions yet. Click \"Add Question\" to start building."}</p>
          </div>
        ) : (
          questions.map((q, i) => (
            <QuestionCard key={q.id} question={q} index={i} total={questions.length}
              onUpdate={(updated) => handleUpdateQuestion(i, updated)}
              onDelete={handleDeleteQuestion} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />
          ))
        )}
      </GlassCard>
    );
  }

  function renderNotificationsStep() {
    return (
      <GlassCard style={{ padding: "24px 22px" }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, marginBottom: 4 }}>
          {"Email "}<span style={{ color: WF.accent }}>{"Notifications"}</span>
        </h3>
        <p style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginBottom: 20 }}>{"Configure how you want to be notified about form submissions"}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${FC.border}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, fontFamily: FONT, color: FC.textPrimary }}>{"Email on submission"}</div>
            <div style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginTop: 2 }}>{"Receive an email each time someone submits this form"}</div>
          </div>
          <Toggle active={notifications.emailOnSubmit} onChange={(val) => setNotifications((prev) => ({ ...prev, emailOnSubmit: val }))} />
        </div>
        {notifications.emailOnSubmit && (
          <div style={{ marginTop: 14 }}>
            <FormField label="Notification Email" type="email" value={notifications.emailTo}
              onChange={(v) => setNotifications((prev) => ({ ...prev, emailTo: v }))}
              placeholder="admin@wolfflow.solutions" />
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${FC.border}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, fontFamily: FONT, color: FC.textPrimary }}>{"Send confirmation to submitter"}</div>
            <div style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginTop: 2 }}>{"Send a confirmation email to the person who fills out the form"}</div>
          </div>
          <Toggle active={notifications.sendConfirmation} onChange={(val) => setNotifications((prev) => ({ ...prev, sendConfirmation: val }))} />
        </div>
        {notifications.sendConfirmation && (
          <div style={{ marginTop: 14 }}>
            <FormField label="Confirmation Message" value={notifications.confirmationMessage}
              onChange={(v) => setNotifications((prev) => ({ ...prev, confirmationMessage: v }))}
              placeholder="Thank you for your submission. We will review it and get back to you..." textarea />
          </div>
        )}
      </GlassCard>
    );
  }

  function renderReviewStep() {
    return (
      <GlassCard style={{ padding: "24px 22px" }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, marginBottom: 4 }}>
          {"Review & "}<span style={{ color: WF.accent }}>{"Publish"}</span>
        </h3>
        <p style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginBottom: 20 }}>{"Review your form before publishing"}</p>

        <Glass style={{ padding: 16, marginBottom: 12 }}>
          <SectionLabel>{"Form Title"}</SectionLabel>
          <div style={{ fontSize: 17, fontWeight: 600, fontFamily: FONT, color: FC.textPrimary, marginTop: 4 }}>{formTitle || "(Untitled Form)"}</div>
        </Glass>

        {formDescription && (
          <Glass style={{ padding: 16, marginBottom: 12 }}>
            <SectionLabel>{"Description"}</SectionLabel>
            <div style={{ fontSize: 13, fontFamily: FONT, color: FC.textSecondary, lineHeight: 1.6, marginTop: 4 }}>{formDescription}</div>
          </Glass>
        )}

        <Glass style={{ padding: 16, marginBottom: 12 }}>
          <SectionLabel>{`Questions (${questions.length})`}</SectionLabel>
          {questions.map((q, i) => {
            const typeInfo = QUESTION_TYPES.find((t) => t.id === q.type);
            return (
              <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: i < questions.length - 1 ? `1px solid ${FC.border}` : "none" }}>
                <span style={{ fontSize: 11, fontFamily: FONT, color: WF.accent, fontWeight: 600, width: 22 }}>{i + 1}{"."}</span>
                <span style={{ fontSize: 13, fontFamily: FONT, color: FC.textPrimary, flex: 1 }}>{q.label || "Untitled Question"}</span>
                <span style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim }}>{typeInfo?.label}</span>
                {q.required && <span style={{ fontSize: 9, fontWeight: 700, fontFamily: FONT, color: FC.redLight }}>{"REQ"}</span>}
              </div>
            );
          })}
        </Glass>

        <Glass style={{ padding: 16, marginBottom: 12 }}>
          <SectionLabel>{"Notifications"}</SectionLabel>
          <div style={{ fontSize: 13, fontFamily: FONT, color: FC.textSecondary, marginTop: 4 }}>
            {notifications.emailOnSubmit ? `Email notifications to ${notifications.emailTo || "(not set)"}` : "Email notifications disabled"}
          </div>
          {notifications.sendConfirmation && <div style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginTop: 4 }}>{"Confirmation emails enabled"}</div>}
        </Glass>

        <Glass style={{ padding: "12px 14px" }}>
          <SectionLabel>{"Form URL (preview)"}</SectionLabel>
          <div style={{ fontSize: 12, fontFamily: FONT, color: WF.accentLight, marginTop: 4 }}>
            {"wolfflow.solutions/forms/"}{generateFormSlug(formTitle) || "..."}
          </div>
        </Glass>
      </GlassCard>
    );
  }

  function getBuilderCanProceed() {
    return step === BUILDER_STEPS.TITLE ? formTitle.trim().length > 0 : step === BUILDER_STEPS.QUESTIONS ? questions.length > 0 : true;
  }

  function renderBuilder() {
    return (
      <div>
        <ProgressBar currentStep={step} />
        {step === BUILDER_STEPS.TITLE && renderTitleStep()}
        {step === BUILDER_STEPS.DESCRIPTION && renderDescriptionStep()}
        {step === BUILDER_STEPS.QUESTIONS && renderQuestionsStep()}
        {step === BUILDER_STEPS.NOTIFICATIONS && renderNotificationsStep()}
        {step === BUILDER_STEPS.REVIEW && renderReviewStep()}
      </div>
    );
  }

  /* ═══ MAIN RENDER ═══ */
  return (
    <div style={{ minHeight: "100vh", fontFamily: FONT, color: FC.textPrimary, position: "relative", overflowX: "hidden" }}>
      <PortalBackground nightMode={false} />

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
          <div style={{ maxWidth: 640, width: "100%", padding: "24px 24px 20px" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16, margin: "0 auto 10px",
                background: `linear-gradient(135deg, ${WF.accent}25, ${WF.accent}08)`,
                border: `1px solid ${WF.accent}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, boxShadow: `0 4px 24px ${WF.accentGlow}`,
              }}>{"\u25A6"}</div>
              <h2 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 24, color: FC.textPrimary, marginBottom: 4 }}>
                {"DIY Form "}<span style={{ color: WF.accent }}>{"Builder"}</span>
              </h2>
              <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 400, color: FC.textDim, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {"Wolf Flow Solutions"}
              </p>
            </div>

            {view === "welcome" && renderWelcome()}
            {view === "my-forms" && renderMyForms()}
            {view === "builder" && renderBuilder()}
            {view === "published" && renderPublishedConfirmation()}
            {view === "qr-builder" && <QRCodeBuilder onClose={() => setView("welcome")} />}
          </div>
        </div>
        <PageNav
          onBack={view === "builder" && step > 0
            ? handleBack
            : view === "builder" && step === 0
              ? () => setView("welcome")
              : view === "my-forms" || view === "published" || view === "qr-builder"
                ? () => setView("welcome")
                : () => router.push("/?page=services")}
          backLabel={view === "builder" && step === 0 ? "Cancel" : "Back"}
          onHome={() => router.push("/?page=services")}
          onNext={view === "builder" && getBuilderCanProceed()
            ? (step === BUILDER_STEPS.REVIEW ? handlePublish : handleNext)
            : undefined}
          nextLabel={view === "builder" ? (step === BUILDER_STEPS.REVIEW ? "Publish Form" : "Continue") : undefined}
          showDisabledNext={view === "builder" && !getBuilderCanProceed()}
        />
        <Footer />
      </div>
    </div>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
