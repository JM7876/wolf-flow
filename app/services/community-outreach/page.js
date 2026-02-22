"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { WF, FC, FONT, GLASS, glassPill, CLICK, inputBase, DEPARTMENTS } from "../../lib/tokens";
import { GlassCard, PortalBackground, PageNav, SectionLabel } from "../../lib/components";

/* ═══════════════════════════════════════════════════════════
   COMMUNITY OUTREACH — Social Media & Web Content Requests
   Restyled from NHBP CommunityOutreach social path to WF tokens
   ═══════════════════════════════════════════════════════════ */

const PLATFORMS = [
  { id: "website", icon: "🌐", label: "Website" },
  { id: "facebook", icon: "📘", label: "Facebook" },
  { id: "instagram", icon: "📸", label: "Instagram" },
];

const SCHEDULE_OPTIONS = [
  { id: "asap", icon: "⚡", label: "ASAP", desc: "Post as soon as possible" },
  { id: "date", icon: "📅", label: "Specific Date", desc: "Choose a date to publish" },
  { id: "rotating", icon: "🔄", label: "Rotating / Ongoing", desc: "Recurring or series post" },
];

function OutreachGlass({ children, active, onClick, style = {} }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: active ? `${WF.accent}14` : "rgba(255,255,255,0.025)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${active ? WF.accent + "55" : h && onClick ? WF.accent + "25" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, padding: "16px 18px",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: onClick ? "pointer" : "default",
        boxShadow: active ? `0 0 28px ${WF.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.08)` : h && onClick ? `0 6px 24px rgba(0,0,0,0.25)` : `inset 0 1px 0 rgba(255,255,255,0.03)`,
        transform: h && onClick ? "translateY(-1px)" : "none",
        position: "relative", overflow: "hidden", ...style,
      }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${active ? WF.accent + "35" : "rgba(255,255,255,0.06)"}, transparent)`, pointerEvents: "none" }} />
      {children}
    </div>
  );
}

export default function CommunityOutreachPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [submissionDate, setSubmissionDate] = useState(null);
  const inputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    department: "",
    platforms: {}, schedule: null, scheduleDate: "",
    description: "", notes: "",
  });

  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const togglePlatform = (id) => setForm(p => ({ ...p, platforms: { ...p.platforms, [id]: !p.platforms[id] } }));

  useEffect(() => { if (inputRef.current) setTimeout(() => inputRef.current?.focus(), 400); }, [step]);
  const goTo = (n) => { if (animating) return; setAnimating(true); setTimeout(() => { setStep(n); setAnimating(false); }, 250); };

  const handleSubmit = () => {
    setTicketNumber(`WF-SM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
    setSubmissionDate(new Date().toLocaleString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }));
    setSubmitted(true);
  };

  const navBack = () => { const map = { 1: 0, 2: 1, 3: 2 }; if (map[step] !== undefined) goTo(map[step]); };
  const navNext = () => { if (step === 0) goTo(1); else if (step === 1) goTo(2); else if (step === 2) goTo(3); else if (step === 3) handleSubmit(); };

  const canAdvance = () => {
    switch (step) {
      case 0: return !!(form.firstName && form.lastName && form.department);
      case 1: return Object.values(form.platforms).some(v => v) && !!form.schedule;
      case 2: return !!form.description;
      case 3: return true;
      default: return true;
    }
  };

  const nextLabel = step === 2 ? "Review" : step === 3 ? "Submit" : undefined;
  const inputStyle = { ...inputBase, width: "100%", boxSizing: "border-box" };
  const textareaStyle = { ...inputStyle, resize: "vertical", lineHeight: 1.6, minHeight: 80 };
  const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };

  const S = {
    stepWrap: { textAlign: "left" },
    stepTitle: { fontSize: 24, fontWeight: 700, color: FC.textPrimary, marginBottom: 6, fontFamily: FONT },
    stepDesc: { fontSize: 14, color: FC.textSecondary, marginBottom: 28, lineHeight: 1.6 },
  };

  if (submitted) {
    const selectedPlatforms = Object.entries(form.platforms).filter(([,v]) => v).map(([k]) => PLATFORMS.find(p => p.id === k));
    const scheduleObj = SCHEDULE_OPTIONS.find(s => s.id === form.schedule);
    return (
      <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <PortalBackground />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>{"📣"}</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: FC.textPrimary, marginBottom: 8 }}>{"Request Submitted"}</h2>
            <p style={{ fontSize: 15, color: FC.textSecondary, marginBottom: 28, lineHeight: 1.7 }}>{"Your social media request has been routed to Communications for review."}</p>
            <GlassCard style={{ textAlign: "left", maxWidth: 340, margin: "0 auto 24px", padding: "20px 18px" }}>
              {[
                ["Ticket", ticketNumber, true],
                ["By", `${form.firstName} ${form.lastName}`],
                form.department ? ["Dept", form.department] : null,
                ["Platforms", selectedPlatforms.map(p => `${p.icon} ${p.label}`).join(", ")],
                ["Schedule", scheduleObj ? `${scheduleObj.icon} ${scheduleObj.label}${form.scheduleDate ? ` — ${form.scheduleDate}` : ""}` : ""],
                form.description ? ["Content", form.description] : null,
                form.notes ? ["Notes", form.notes] : null,
                ["Submitted", submissionDate],
              ].filter(Boolean).filter(([,v]) => v).map(([k, v, accent], i, arr) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < arr.length - 1 ? 10 : 0 }}>
                  <span style={{ fontSize: 12, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</span>
                  <span style={{ fontSize: 13, color: accent ? WF.accent : FC.textPrimary, fontWeight: accent ? 700 : 400, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ))}
            </GlassCard>
            <button onClick={() => router.push("/")} style={{ ...glassPill, padding: "13px 28px", border: `1px solid ${WF.accent}40`, color: FC.textPrimary }}>{"Back to Portal"}</button>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div style={S.stepWrap}>
          <h2 style={S.stepTitle}>{"Who is requesting?"}</h2>
          <p style={S.stepDesc}>{"We need to know who to follow up with."}</p>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"First Name *"}</label><input ref={inputRef} value={form.firstName} onChange={e => u("firstName", e.target.value)} placeholder="First" style={inputStyle} /></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Last Name *"}</label><input value={form.lastName} onChange={e => u("lastName", e.target.value)} placeholder="Last" style={inputStyle} /></div>
          </div>
          <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Department *"}</label>
            <select value={form.department} onChange={e => u("department", e.target.value)} style={selectStyle}>
              <option value="">{"Select department..."}</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Email"}</label><input type="email" value={form.email} onChange={e => u("email", e.target.value)} placeholder="your@email.gov" style={inputStyle} /></div>
        </div>
      );
      case 1: return (
        <div style={S.stepWrap}>
          <h2 style={S.stepTitle}>{"Platform & Schedule"}</h2>
          <p style={S.stepDesc}>{"Where should this be posted, and when?"}</p>
          <div style={{ fontSize: 12, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{"Platforms"}</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {PLATFORMS.map(p => (
              <OutreachGlass key={p.id} active={form.platforms[p.id]} onClick={() => togglePlatform(p.id)}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 12px", textAlign: "center" }}>
                <span style={{ fontSize: 28, filter: form.platforms[p.id] ? `drop-shadow(0 0 8px ${WF.accentGlow})` : "none", transition: "filter 0.3s" }}>{p.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: form.platforms[p.id] ? WF.accent : FC.textPrimary }}>{p.label}</span>
              </OutreachGlass>
            ))}
          </div>
          <div style={{ fontSize: 12, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{"Schedule"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SCHEDULE_OPTIONS.map(s => (
              <OutreachGlass key={s.id} active={form.schedule === s.id} onClick={() => u("schedule", s.id)}
                style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: form.schedule === s.id ? WF.accent : FC.textPrimary }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: FC.textDim }}>{s.desc}</div>
                </div>
              </OutreachGlass>
            ))}
          </div>
          {form.schedule === "date" && (
            <div style={{ marginTop: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Preferred Date"}</label><input type="date" value={form.scheduleDate} onChange={e => u("scheduleDate", e.target.value)} style={inputStyle} /></div>
          )}
        </div>
      );
      case 2: return (
        <div style={S.stepWrap}>
          <h2 style={S.stepTitle}>{"Content"}</h2>
          <p style={S.stepDesc}>{"Tell us what you'd like posted."}</p>
          <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Description / Copy *"}</label><textarea ref={inputRef} value={form.description} onChange={e => u("description", e.target.value)} placeholder="What should the post say? Include key details, links, dates..." style={textareaStyle} rows={5} /></div>
          <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Additional Notes"}</label><textarea value={form.notes} onChange={e => u("notes", e.target.value)} placeholder="Hashtags, tags, special instructions..." style={textareaStyle} rows={3} /></div>
        </div>
      );
      case 3: {
        const selectedPlatforms = Object.entries(form.platforms).filter(([,v]) => v).map(([k]) => PLATFORMS.find(p => p.id === k));
        const scheduleObj = SCHEDULE_OPTIONS.find(s => s.id === form.schedule);
        const items = [
          ["Requester", `${form.firstName} ${form.lastName} — ${form.department}`],
          ["Platforms", selectedPlatforms.map(p => `${p.icon} ${p.label}`).join(", ")],
          ["Schedule", `${scheduleObj?.icon} ${scheduleObj?.label}${form.schedule === "date" && form.scheduleDate ? ` — ${form.scheduleDate}` : ""}`],
          ["Content", form.description],
          form.notes ? ["Notes", form.notes] : null,
          ["Contact", form.email || "Not provided"],
        ].filter(Boolean);
        return (
          <div style={S.stepWrap}>
            <h2 style={S.stepTitle}>{"Review Request"}</h2>
            <p style={S.stepDesc}>{"Confirm everything before submitting."}</p>
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

  const progress = ((step + 1) / 4) * 100;
  return (
    <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <PortalBackground />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "16px 24px 12px", zIndex: 10, background: `linear-gradient(180deg, ${FC.dark}ee, transparent)` }}>
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 2, width: `${progress}%`, background: WF.accent, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px 100px", zIndex: 1 }}>
        <div style={{ maxWidth: 480, width: "100%", opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "translateY(0)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
          {renderStep()}
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <PageNav onBack={step > 0 ? navBack : () => router.push("/")} backLabel={step > 0 ? "Back" : "Portal"} onNext={canAdvance() ? navNext : undefined} nextLabel={nextLabel} />
      </div>
    </div>
  );
}
