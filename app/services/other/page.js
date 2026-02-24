"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WF, FC, FONT, GLASS, glassPill, CLICK, inputBase, DEPARTMENTS } from "../../lib/tokens";
import { GlassCard, PortalBackground, PageNav, SectionLabel, Footer, useNightMode, SettingsDropdown } from "../../lib/components";

/* ═══════════════════════════════════════════════════════════
   OTHER / GENERAL REQUEST — Catch-all for miscellaneous needs
   ═══════════════════════════════════════════════════════════ */

const PRIORITY_OPTS = [
  { id: "standard", label: "Standard", desc: "2-3 weeks", icon: "\u25CB" },
  { id: "priority", label: "Priority", desc: "1-2 weeks", icon: "\u25CE" },
  { id: "urgent", label: "Urgent", desc: "Within 5 days", icon: "\u25C9" },
];

export default function OtherPage() {
  const router = useRouter();
  const { nightMode, toggleNight } = useNightMode();
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    department: "", title: "", description: "", priority: "standard",
  });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputStyle = { ...inputBase, width: "100%", boxSizing: "border-box" };
  const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };
  const textareaStyle = { ...inputStyle, resize: "vertical", lineHeight: 1.6, minHeight: 100 };

  const handleSubmit = () => {
    setTicketNumber(`WF-GR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
    setSubmitted(true);
  };

  const canSubmit = form.firstName && form.lastName && form.email && form.department && form.description;

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <PortalBackground nightMode={nightMode} />
        <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 24px 20px", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: 480, width: "100%", paddingTop: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 24, color: WF.accent }}>{"\u2726"}</div>
            <h2 style={{ fontSize: 26, fontWeight: 300, color: FC.textPrimary, fontFamily: FONT, marginBottom: 8 }}>{"Request Submitted"}</h2>
            <p style={{ fontSize: 13, color: FC.textSecondary, marginBottom: 28, lineHeight: 1.7 }}>{"We\u2019ve received your request and will follow up shortly."}</p>
            <GlassCard style={{ textAlign: "left", maxWidth: 340, margin: "0 auto 24px", padding: "20px 18px" }}>
              {[
                ["Ticket", ticketNumber, true],
                ["By", `${form.firstName} ${form.lastName}`],
                form.department ? ["Dept", form.department] : null,
                form.title ? ["Subject", form.title] : null,
                ["Priority", PRIORITY_OPTS.find(p => p.id === form.priority)?.label || "Standard"],
                form.email ? ["Contact", form.email] : null,
              ].filter(Boolean).map(([k, v, accent], i, arr) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < arr.length - 1 ? 10 : 0 }}>
                  <span style={{ fontSize: 12, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</span>
                  <span style={{ fontSize: 13, color: accent ? WF.accent : FC.textPrimary, fontWeight: accent ? 700 : 400, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ))}
            </GlassCard>
            <button onClick={() => router.push("/?page=services")} style={{
              ...glassPill, padding: "13px 28px",
              background: `linear-gradient(135deg, ${WF.accent}22, ${WF.accent}12)`,
              border: `1px solid ${WF.accent}50`, color: WF.accentLight,
              boxShadow: `0 4px 20px ${WF.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.14)`,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}50`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.14)`; }}
            >{"Back to Services"}</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <PortalBackground nightMode={nightMode} />
      <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 24px 20px", zIndex: 1 }}>
        <div style={{ maxWidth: 480, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 24, marginBottom: 12, color: WF.accent }}>{"\u2726"}</div>
            <h2 style={{ fontSize: 24, fontWeight: 300, color: FC.textPrimary, fontFamily: FONT, marginBottom: 6 }}>{"General Request"}</h2>
            <p style={{ fontSize: 13, color: FC.textSecondary, lineHeight: 1.6 }}>{"Something that doesn't fit another category? Tell us what you need."}</p>
          </div>
          <GlassCard style={{ padding: "22px 18px" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"First Name *"}</label><input value={form.firstName} onChange={e => u("firstName", e.target.value)} placeholder="First" style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Last Name *"}</label><input value={form.lastName} onChange={e => u("lastName", e.target.value)} placeholder="Last" style={inputStyle} /></div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Department *"}</label>
              <select value={form.department} onChange={e => u("department", e.target.value)} style={selectStyle}>
                <option value="">{"Select department..."}</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Email *"}</label><input type="email" value={form.email} onChange={e => u("email", e.target.value)} placeholder="your@email.gov" style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Phone"}</label><input value={form.phone} onChange={e => u("phone", e.target.value)} placeholder="(555) 555-5555" style={inputStyle} /></div>
            </div>
            <div style={{ height: 1, background: FC.border, margin: "4px 0 18px" }} />
            <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Subject"}</label><input value={form.title} onChange={e => u("title", e.target.value)} placeholder="Brief title for your request" style={inputStyle} /></div>
            <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Describe what you need *"}</label><textarea value={form.description} onChange={e => u("description", e.target.value)} placeholder="Give us the full picture..." style={textareaStyle} rows={5} /></div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Priority"}</label>
              <div style={{ display: "flex", gap: 8 }}>
                {PRIORITY_OPTS.map(p => (
                  <button key={p.id} onClick={() => u("priority", p.id)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 10, fontSize: 12, fontFamily: FONT, fontWeight: form.priority === p.id ? 600 : 400,
                    background: form.priority === p.id ? `${WF.accent}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${form.priority === p.id ? WF.accent + "50" : FC.border}`,
                    color: form.priority === p.id ? WF.accent : FC.textSecondary, cursor: "pointer",
                    transition: "all 0.25s ease", textAlign: "center",
                  }}>
                    <div>{p.icon}{" "}{p.label}</div>
                    <div style={{ fontSize: 10, color: FC.textDim, marginTop: 2 }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSubmit} disabled={!canSubmit} style={{
              ...glassPill, width: "100%", padding: "16px",
              background: canSubmit ? `linear-gradient(135deg, ${WF.accent}28, ${WF.accent}14)` : "rgba(255,255,255,0.04)",
              border: `1px solid ${canSubmit ? WF.accent + "50" : "rgba(255,255,255,0.06)"}`,
              color: canSubmit ? WF.accentLight : FC.textDim,
              opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? "pointer" : "not-allowed",
              boxShadow: canSubmit ? `0 4px 16px ${WF.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.12)` : "none",
            }}
              onMouseEnter={canSubmit ? e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; } : undefined}
              onMouseLeave={canSubmit ? e => { e.currentTarget.style.borderColor = `${WF.accent}50`; e.currentTarget.style.boxShadow = `0 4px 16px ${WF.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.12)`; } : undefined}
            >{"Submit Request"}</button>
          </GlassCard>
        </div>
      </div>
      <PageNav onBack={() => router.push("/?page=services")} backLabel="Back" onHome={() => router.push("/?page=services")} />
      <Footer />
    </div>
  );
}
