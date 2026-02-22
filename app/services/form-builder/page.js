/* ═══════════════════════════════════════════════════════════
   WOLF FLOW — DIY Post Builder (5-Step Wizard)
   ─────────────────────────────────────────────────────────
   Route: /services/form-builder
   Draft your own social post — caption, platform, hashtags.
   Communications reviews and publishes it for you.
   Liquid Glass design system.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { WF, FC, FONT, CLICK, inputBase, DEPARTMENTS, glassPill } from "../../lib/tokens";
import { GlassCard, PortalBackground, PageNav, Footer } from "../../lib/components";

// ═══ DATA ═══

const DEPTS = [
  { value: "Administration", label: "Administration" },
  { value: "Communications", label: "Communications" },
  { value: "Cultural", label: "Cultural" },
  { value: "Education", label: "Education" },
  { value: "Enrollment", label: "Enrollment" },
  { value: "Environmental", label: "Environmental" },
  { value: "Finance", label: "Finance" },
  { value: "Gaming Commission", label: "Gaming Commission" },
  { value: "Government Records", label: "Government Records" },
  { value: "Health Services", label: "Health & Human Services" },
  { value: "Housing", label: "Housing" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "IT", label: "Information Technology" },
  { value: "Legal", label: "Legal" },
  { value: "Membership Services", label: "Membership Services" },
  { value: "Planning", label: "Planning" },
  { value: "Public Works", label: "Public Works" },
  { value: "Social Services", label: "Social Services" },
  { value: "Tribal Council", label: "Tribal Council" },
  { value: "Tribal Court", label: "Tribal Court" },
  { value: "Tribal Police", label: "Tribal Police" },
  { value: "Other", label: "Other" },
];

const PLATFORMS = [
  { id: "facebook", icon: "\u{1F4D8}", label: "Facebook" },
  { id: "instagram", icon: "\u{1F4F8}", label: "Instagram" },
  { id: "both", icon: "\u{1F4F1}", label: "Both" },
];

// ═══ LIQUID GLASS BUTTON ═══

const DIYGlass = ({ children, active, onClick, style: s = {} }) => {
  const [h, setH] = useState(false);
  const gc = WF.accent;
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: active
          ? `linear-gradient(168deg, ${gc}1A 0%, ${gc}0D 40%, ${gc}08 100%)`
          : "linear-gradient(168deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.015) 100%)",
        backdropFilter: "blur(24px) saturate(1.4) brightness(1.12) contrast(1.05)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4) brightness(1.12) contrast(1.05)",
        border: `1px solid ${active ? gc + "50" : h && onClick ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 16, padding: "16px 18px",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: onClick ? "pointer" : "default",
        boxShadow: active
          ? `0 8px 32px ${gc}20, 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04)`
          : h && onClick
            ? "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.16)"
            : "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(255,255,255,0.03)",
        transform: h && onClick ? "translateY(-2px) scale(1.005)" : "none",
        position: "relative", overflow: "hidden", ...s,
      }}>
      {/* Specular highlight */}
      <div style={{ position: "absolute", left: "8%", right: "8%", top: 0, height: "35%", pointerEvents: "none",
        background: `linear-gradient(180deg, ${active ? gc + "20" : "rgba(255,255,255,0.1)"} 0%, transparent 100%)`,
        maskImage: "linear-gradient(180deg, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
      }} />
      {/* Edge rim */}
      <div style={{ position: "absolute", left: "5%", right: "5%", top: 0, height: 1, pointerEvents: "none",
        background: `linear-gradient(90deg, transparent, ${active ? gc + "45" : "rgba(255,255,255,0.18)"}, transparent)`,
      }} />
      {/* Bottom catchlight */}
      <div style={{ position: "absolute", left: "10%", right: "10%", bottom: 0, height: 1, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
      }} />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
};

// ═══ PAGE ═══

export default function DIYFormBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [submissionDate, setSubmissionDate] = useState(null);
  const inputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    department: "",
    platform: null,
    caption: "",
    altText: "",
    hashtags: "",
    notes: "",
  });

  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));

  useEffect(() => { if (inputRef.current) setTimeout(() => inputRef.current?.focus(), 400); }, [step]);
  const goTo = (n) => { if (animating) return; setAnimating(true); setTimeout(() => { setStep(n); setAnimating(false); }, 250); };

  const handleSubmit = () => {
    setTicketNumber(`WF-DIY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
    setSubmissionDate(new Date().toLocaleString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }));
    setSubmitted(true);
  };

  const navBack = () => { const map = { 1: 0, 2: 1, 3: 2, 4: 3 }; if (map[step] !== undefined) goTo(map[step]); };
  const navNext = () => { if (step === 0) goTo(1); else if (step === 1) goTo(2); else if (step === 2) goTo(3); else if (step === 3) goTo(4); else if (step === 4) handleSubmit(); };

  const canAdvance = () => {
    switch (step) {
      case 0: return !!(form.firstName && form.lastName && form.department);
      case 1: return !!form.platform;
      case 2: return !!form.caption;
      case 3: return true; // review step, always can submit
      default: return true;
    }
  };

  const nextLabel = step === 3 ? "Review" : step === 4 ? "Submit Post" : undefined;

  const inputStyle = { ...inputBase, width: "100%", boxSizing: "border-box" };
  const textareaStyle = { ...inputStyle, resize: "vertical", lineHeight: 1.6, minHeight: 80 };
  const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };

  const S = {
    stepWrap: { textAlign: "left" },
    stepTitle: { fontSize: 24, fontWeight: 700, color: FC.textPrimary, marginBottom: 6, fontFamily: FONT },
    stepDesc: { fontSize: 14, color: FC.textSecondary, marginBottom: 28, lineHeight: 1.6 },
  };

  // ═══ SUBMITTED ═══

  if (submitted) {
    const platObj = PLATFORMS.find(p => p.id === form.platform);
    return (
      <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <PortalBackground />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>{"\u270F\uFE0F"}</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: FC.textPrimary, marginBottom: 8 }}>{"Post Submitted!"}</h2>
            <p style={{ fontSize: 15, color: FC.textSecondary, marginBottom: 28, lineHeight: 1.7 }}>
              {"Your post has been sent to Communications for review and publishing."}
            </p>
            <GlassCard style={{ textAlign: "left", maxWidth: 340, margin: "0 auto 24px", padding: "20px 18px" }}>
              {[
                ["Ticket", ticketNumber, true],
                ["Platform", `${platObj?.icon} ${platObj?.label}`],
                ["Caption", form.caption.length > 40 ? form.caption.slice(0, 40) + "\u2026" : form.caption],
                ["By", `${form.firstName} ${form.lastName}`],
                form.department ? ["Dept", form.department] : null,
                ["Submitted", submissionDate],
              ].filter(Boolean).filter(([, v]) => v).map(([k, v, accent], i, arr) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < arr.length - 1 ? 10 : 0 }}>
                  <span style={{ fontSize: 12, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</span>
                  <span style={{ fontSize: 13, color: accent ? WF.accent : FC.textPrimary, fontWeight: accent ? 700 : 400, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ))}
            </GlassCard>
            <button onClick={() => router.push("/")} style={{ ...glassPill, padding: "13px 28px", border: `1px solid ${WF.accent}40`, color: FC.textPrimary }}>
              {"Back to Portal"}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ═══ STEPS ═══

  const renderStep = () => {
    switch (step) {
      // Welcome
      case 0: return (
        <div style={S.stepWrap}>
          <h2 style={S.stepTitle}>{"Who is requesting?"}</h2>
          <p style={S.stepDesc}>{"We need to know who created this content."}</p>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>{"First Name *"}</label>
              <input ref={inputRef} value={form.firstName} onChange={e => u("firstName", e.target.value)} placeholder="First" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>{"Last Name *"}</label>
              <input value={form.lastName} onChange={e => u("lastName", e.target.value)} placeholder="Last" style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{"Department *"}</label>
            <select value={form.department} onChange={e => u("department", e.target.value)} style={selectStyle}>
              <option value="">{"Select department..."}</option>
              {DEPTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{"Email"}</label>
            <input type="email" value={form.email} onChange={e => u("email", e.target.value)} placeholder="your@nhbp-nsn.gov" style={inputStyle} />
          </div>
        </div>
      );

      // Platform
      case 1: return (
        <div style={S.stepWrap}>
          <h2 style={S.stepTitle}>{"Where should this go?"}</h2>
          <p style={S.stepDesc}>{"Select the platform for your post."}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PLATFORMS.map(p => (
              <DIYGlass key={p.id} active={form.platform === p.id} onClick={() => u("platform", p.id)}
                style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 28, filter: form.platform === p.id ? `drop-shadow(0 0 8px ${WF.accentGlow})` : "none", transition: "filter 0.3s" }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: form.platform === p.id ? WF.accent : FC.textPrimary }}>{p.label}</div>
                  {p.id === "both" && <div style={{ fontSize: 12, color: FC.textDim }}>{"Facebook + Instagram"}</div>}
                </div>
              </DIYGlass>
            ))}
          </div>
        </div>
      );

      // Your Post
      case 2: return (
        <div style={S.stepWrap}>
          <h2 style={S.stepTitle}>{"Build Your Post"}</h2>
          <p style={S.stepDesc}>{"Write it exactly as you'd like it to appear."}</p>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{"Post Caption / Verbiage *"}</label>
            <textarea ref={inputRef} value={form.caption} onChange={e => u("caption", e.target.value)}
              placeholder="Write your post exactly as you'd like it to appear..." style={textareaStyle} rows={5} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>{"Image Upload"}</div>
            <div style={{
              fontSize: 12, color: FC.textDim, lineHeight: 1.6, padding: "12px 16px",
              background: "linear-gradient(168deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
              borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            }}>
              {"\u{1F5BC}\uFE0F Email your image to "}
              <span style={{ color: WF.accentLight }}>{"communications@nhbp-nsn.gov"}</span>
              {" and reference your ticket number after submitting."}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{"Alt Text"}</label>
            <input value={form.altText} onChange={e => u("altText", e.target.value)}
              placeholder="Describe the image for accessibility" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{"Hashtags"}</label>
            <input value={form.hashtags} onChange={e => u("hashtags", e.target.value)}
              placeholder="#NHBP #PotawatomiPride #TribalCommunity" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{"Additional Notes"}</label>
            <textarea value={form.notes} onChange={e => u("notes", e.target.value)}
              placeholder="Any other details we should know..." style={textareaStyle} rows={3} />
          </div>
        </div>
      );

      // Review
      case 3: {
        const platObj = PLATFORMS.find(p => p.id === form.platform);
        const items = [
          ["Requester", `${form.firstName} ${form.lastName}`],
          form.department ? ["Department", form.department] : null,
          ["Platform", `${platObj?.icon} ${platObj?.label}`],
          ["Caption", form.caption],
          form.altText ? ["Alt Text", form.altText] : null,
          form.hashtags ? ["Hashtags", form.hashtags] : null,
          form.notes ? ["Notes", form.notes] : null,
          ["Contact", form.email || "Not provided"],
        ].filter(Boolean);

        return (
          <div style={S.stepWrap}>
            <h2 style={S.stepTitle}>{"Review Your Post"}</h2>
            <p style={S.stepDesc}>{"Make sure everything looks good before we review it."}</p>
            <GlassCard style={{ padding: "20px 18px" }}>
              {items.map(([k, v], i) => (
                <div key={k + i} style={{ paddingBottom: 12, marginBottom: i < items.length - 1 ? 12 : 0, borderBottom: i < items.length - 1 ? `1px solid ${FC.border}` : "none" }}>
                  <div style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, color: FC.textPrimary, lineHeight: 1.5 }}>{v}</div>
                </div>
              ))}
            </GlassCard>
          </div>
        );
      }

      default: return null;
    }
  };

  // ═══ LAYOUT ═══

  const progress = ((step + 1) / 4) * 100;

  return (
    <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <PortalBackground />
      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "16px 24px 12px", zIndex: 10, background: `linear-gradient(180deg, ${FC.dark}ee, transparent)` }}>
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 2, width: `${progress}%`, background: WF.accent, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px 100px", zIndex: 1 }}>
        <div style={{ maxWidth: 480, width: "100%", opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "translateY(0)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
          {renderStep()}
        </div>
      </div>
      <Footer />
      {/* Navigation */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <PageNav
          onBack={step > 0 ? navBack : () => router.push("/")}
          backLabel={step > 0 ? "Back" : "Portal"}
          onNext={canAdvance() ? navNext : undefined}
          nextLabel={nextLabel}
        />
      </div>
    </div>
  );
}
