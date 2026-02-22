"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { WF, FC, FONT, GLASS, glassPill, CLICK, inputBase, DEPARTMENTS } from "../../lib/tokens";
import { GlassCard, PortalBackground, PageNav, FormField, SectionLabel, Footer } from "../../lib/components";

/* ═══════════════════════════════════════════════════════════
   INSTANT ALERT — Urgent Communications & Emergency Notices
   Restyled from NHBP CommunityOutreach alert path to WF tokens
   ═══════════════════════════════════════════════════════════ */

const URGENCY_LEVELS = [
  { id: "emergency", icon: "🚨", label: "Emergency", desc: "Immediate — safety, closures, critical notices", color: WF.red, glow: WF.redGlow },
  { id: "urgent", icon: "⚡", label: "Urgent", desc: "Same day — time-sensitive announcements", color: FC.gold, glow: "rgba(189,149,238,0.3)" },
  { id: "priority", icon: "📢", label: "Priority", desc: "Within 24 hours — important but not critical", color: WF.accent, glow: WF.accentGlow },
];

const CHANNELS = [
  { id: "email", icon: "📧", label: "Email Blast" },
  { id: "website", icon: "🌐", label: "Website Banner" },
  { id: "social", icon: "📱", label: "Social Media" },
  { id: "text", icon: "💬", label: "Text / SMS" },
  { id: "flyer", icon: "📄", label: "Printed Flyer" },
  { id: "all", icon: "🔊", label: "All Channels" },
];

const IA_DEPTS = DEPARTMENTS;

function AlertGlass({ children, active, onClick, glowColor, style = {} }) {
  const [h, setH] = useState(false);
  const gc = glowColor || WF.accent;
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: active ? `${gc}14` : "rgba(255,255,255,0.025)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${active ? gc + "55" : h && onClick ? gc + "25" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, padding: "16px 18px",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: onClick ? "pointer" : "default",
        boxShadow: active ? `0 0 28px ${gc}25, inset 0 1px 0 rgba(255,255,255,0.08)` : h && onClick ? `0 6px 24px rgba(0,0,0,0.25)` : `inset 0 1px 0 rgba(255,255,255,0.03)`,
        transform: h && onClick ? "translateY(-1px)" : "none",
        position: "relative", overflow: "hidden", ...style,
      }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${active ? gc + "35" : "rgba(255,255,255,0.06)"}, transparent)`, pointerEvents: "none" }} />
      {children}
    </div>
  );
}

export default function InstantAlertPage() {
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
    urgency: null, channels: {},
    subject: "", message: "",
    audience: "", effectiveDate: "", effectiveTime: "",
    approvedBy: "",
  });

  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const toggleChannel = (id) => setForm(p => ({ ...p, channels: { ...p.channels, [id]: !p.channels[id] } }));

  useEffect(() => { if (inputRef.current) setTimeout(() => inputRef.current?.focus(), 400); }, [step]);

  const goTo = (n) => { if (animating) return; setAnimating(true); setTimeout(() => { setStep(n); setAnimating(false); }, 250); };
  const urgencyObj = URGENCY_LEVELS.find(x => x.id === form.urgency);
  const accentColor = urgencyObj?.color || WF.accent;

  const handleSubmit = () => {
    setTicketNumber(`WF-IA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
    setSubmissionDate(new Date().toLocaleString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }));
    setSubmitted(true);
  };

  const navBack = () => { const map = { 1: 0, 2: 1, 3: 2, 4: 3 }; if (map[step] !== undefined) goTo(map[step]); };
  const navNext = () => { if (step === 0) goTo(1); else if (step === 1) goTo(2); else if (step === 2) goTo(3); else if (step === 3) goTo(4); else if (step === 4) handleSubmit(); };

  const canAdvance = () => {
    switch (step) {
      case 0: return !!form.urgency;
      case 1: return !!(form.firstName && form.lastName && form.department);
      case 2: return !!(form.subject && form.message);
      case 3: return Object.values(form.channels).some(v => v);
      case 4: return true;
      default: return true;
    }
  };

  const nextLabel = step === 3 ? "Review" : step === 4 ? "Submit Alert" : undefined;

  const S = {
    stepWrap: { textAlign: "left" },
    stepTitle: { fontSize: 24, fontWeight: 700, color: FC.textPrimary, marginBottom: 6, fontFamily: FONT },
    stepDesc: { fontSize: 14, color: FC.textSecondary, marginBottom: 28, lineHeight: 1.6 },
  };

  const inputStyle = { ...inputBase, width: "100%", boxSizing: "border-box" };
  const textareaStyle = { ...inputStyle, resize: "vertical", lineHeight: 1.6, minHeight: 80 };
  const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };

  if (submitted) {
    const selectedChannels = Object.entries(form.channels).filter(([,v]) => v).map(([k]) => CHANNELS.find(c => c.id === k));
    return (
      <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <PortalBackground />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>{urgencyObj?.icon || "⚡"}</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: FC.textPrimary, marginBottom: 8, fontFamily: FONT }}>{"Alert Submitted"}</h2>
            <p style={{ fontSize: 15, color: FC.textSecondary, marginBottom: 28, lineHeight: 1.7 }}>
              {"Your "}{urgencyObj?.label.toLowerCase()}{" alert has been routed to Communications for immediate action."}
            </p>
            <GlassCard style={{ textAlign: "left", maxWidth: 340, margin: "0 auto 24px", padding: "20px 18px" }}>
              {[
                ["Ticket", ticketNumber, true],
                ["By", `${form.firstName} ${form.lastName}`],
                form.department ? ["Department", form.department] : null,
                ["Urgency", `${urgencyObj?.icon} ${urgencyObj?.label}`],
                ["Subject", form.subject],
                form.message ? ["Message", form.message] : null,
                ["Channels", selectedChannels.map(c => `${c.icon} ${c.label}`).join(", ")],
                form.approvedBy ? ["Approved By", form.approvedBy] : null,
                form.email ? ["Contact", `${form.email}${form.phone ? ` / ${form.phone}` : ""}`] : null,
                ["Submitted", submissionDate],
              ].filter(Boolean).filter(([,v]) => v).map(([k, v, accent], i, arr) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < arr.length - 1 ? 10 : 0 }}>
                  <span style={{ fontSize: 12, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</span>
                  <span style={{ fontSize: 13, color: accent ? accentColor : FC.textPrimary, fontWeight: accent ? 700 : 400, fontFamily: FONT, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ))}
            </GlassCard>
            <button onClick={() => router.push("/")} style={{ ...glassPill, padding: "13px 28px", border: `1px solid ${WF.accent}40`, color: FC.textPrimary, marginTop: 12 }}>
              {"Back to Portal"}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div style={S.stepWrap}>
          <h2 style={S.stepTitle}>{"How urgent is this?"}</h2>
          <p style={S.stepDesc}>{"This determines how fast we act."}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {URGENCY_LEVELS.map(l => (
              <AlertGlass key={l.id} active={form.urgency === l.id} onClick={() => u("urgency", l.id)} glowColor={l.color}
                style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 28, filter: form.urgency === l.id ? `drop-shadow(0 0 8px ${l.glow})` : "none" }}>{l.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: form.urgency === l.id ? l.color : FC.textPrimary }}>{l.label}</div>
                  <div style={{ fontSize: 12, color: FC.textDim }}>{l.desc}</div>
                </div>
              </AlertGlass>
            ))}
          </div>
        </div>
      );
      case 1: return (
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
              {IA_DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Email *"}</label><input type="email" value={form.email} onChange={e => u("email", e.target.value)} placeholder="your@email.gov" style={inputStyle} /></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Phone"}</label><input value={form.phone} onChange={e => u("phone", e.target.value)} placeholder="(555) 555-5555" style={inputStyle} /></div>
          </div>
        </div>
      );
      case 2: return (
        <div style={S.stepWrap}>
          <h2 style={S.stepTitle}>{urgencyObj?.icon || "⚡"}{" Alert Message"}</h2>
          <p style={S.stepDesc}>{"What do people need to know?"}</p>
          <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Subject Line *"}</label><input ref={inputRef} value={form.subject} onChange={e => u("subject", e.target.value)} placeholder="e.g. Building Closure - Jan 15" style={inputStyle} /></div>
          <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Full Message *"}</label><textarea value={form.message} onChange={e => u("message", e.target.value)} placeholder="The details people need to know..." style={textareaStyle} rows={4} /></div>
          <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Who is this for?"}</label><input value={form.audience} onChange={e => u("audience", e.target.value)} placeholder="All employees, specific department, tribal members..." style={inputStyle} /></div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Effective Date"}</label><input type="date" value={form.effectiveDate} onChange={e => u("effectiveDate", e.target.value)} style={inputStyle} /></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Time"}</label><input type="time" value={form.effectiveTime} onChange={e => u("effectiveTime", e.target.value)} style={inputStyle} /></div>
          </div>
          <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Approved By"}</label><input value={form.approvedBy} onChange={e => u("approvedBy", e.target.value)} placeholder="Director, Council, Department Head..." style={inputStyle} /></div>
        </div>
      );
      case 3: return (
        <div style={S.stepWrap}>
          <h2 style={S.stepTitle}>{"Distribution Channels"}</h2>
          <p style={S.stepDesc}>{"How should this alert go out? Select all that apply."}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {CHANNELS.map(c => (
              <AlertGlass key={c.id} active={form.channels[c.id]} onClick={() => toggleChannel(c.id)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: form.channels[c.id] ? FC.textPrimary : FC.textSecondary }}>{c.label}</span>
              </AlertGlass>
            ))}
          </div>
        </div>
      );
      case 4: {
        const selectedChannels = Object.entries(form.channels).filter(([,v]) => v).map(([k]) => CHANNELS.find(c => c.id === k));
        const items = [
          ["Requester", `${form.firstName} ${form.lastName} — ${form.department}`],
          ["Urgency", `${urgencyObj?.icon} ${urgencyObj?.label}`],
          ["Subject", form.subject],
          ["Message", form.message],
          form.audience ? ["Audience", form.audience] : null,
          form.effectiveDate ? ["Effective", `${form.effectiveDate}${form.effectiveTime ? ` at ${form.effectiveTime}` : ""}`] : null,
          ["Channels", selectedChannels.map(c => `${c.icon} ${c.label}`).join(", ")],
          form.approvedBy ? ["Approved By", form.approvedBy] : null,
          ["Contact", `${form.email}${form.phone ? ` / ${form.phone}` : ""}`],
        ].filter(Boolean);
        return (
          <div style={S.stepWrap}>
            <h2 style={S.stepTitle}>{"Review Alert"}</h2>
            <p style={S.stepDesc}>{"Confirm everything before sending."}</p>
            <GlassCard style={{ padding: "20px 18px" }}>
              {items.map(([k, v], i) => (
                <div key={k + i} style={{ paddingBottom: 12, marginBottom: i < items.length - 1 ? 12 : 0, borderBottom: i < items.length - 1 ? `1px solid ${FC.border}` : "none" }}>
                  <div style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, color: k === "Urgency" ? accentColor : FC.textPrimary, lineHeight: 1.5 }}>{v}</div>
                </div>
              ))}
            </GlassCard>
          </div>
        );
      }
      default: return null;
    }
  };

  const progress = ((step + 1) / 5) * 100;
  return (
    <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <PortalBackground />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "16px 24px 12px", zIndex: 10, background: `linear-gradient(180deg, ${FC.dark}ee, transparent)` }}>
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 2, width: `${progress}%`, background: accentColor, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px 100px", zIndex: 1 }}>
        <div style={{ maxWidth: 480, width: "100%", opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "translateY(0)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
          {renderStep()}
        </div>
      </div>
      <Footer />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <PageNav onBack={step > 0 ? navBack : () => router.push("/")} backLabel={step > 0 ? "Back" : "Portal"} onNext={canAdvance() ? navNext : undefined} nextLabel={nextLabel} />
      </div>
    </div>
  );
}
