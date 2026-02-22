"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WF, FC, FONT, GLASS, glassPill, CLICK, inputBase, DEPARTMENTS } from "../../lib/tokens";
import { GlassCard, PortalBackground, PageNav, SectionLabel, Footer } from "../../lib/components";

/* ═══════════════════════════════════════════════════════════
   THE STUDIO HUB — Headshots + Turtle Press
   Landing page with two subsections
   ═══════════════════════════════════════════════════════════ */

const SUBSECTIONS = [
  {
    id: "headshots",
    icon: "📷",
    title: "Headshots",
    desc: "Schedule a professional headshot session for your employee badge, website bio, or team page.",
  },
  {
    id: "turtle-press",
    icon: "🐢",
    title: "The Turtle Press",
    desc: "Article submissions, birthdays & celebrations, photo contributions for the quarterly newsletter.",
  },
];

function StudioGlass({ children, active, onClick, style = {} }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: active ? `${WF.accent}14` : "rgba(255,255,255,0.025)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${active ? WF.accent + "55" : h && onClick ? WF.accent + "25" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, padding: "24px 20px",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: onClick ? "pointer" : "default",
        boxShadow: active ? `0 0 28px ${WF.accentGlow}` : h && onClick ? `0 6px 24px rgba(0,0,0,0.25)` : `inset 0 1px 0 rgba(255,255,255,0.03)`,
        transform: h && onClick ? "translateY(-2px)" : "none",
        position: "relative", overflow: "hidden", ...style,
      }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${active ? WF.accent + "35" : "rgba(255,255,255,0.06)"}, transparent)`, pointerEvents: "none" }} />
      {children}
    </div>
  );
}

/* ── HEADSHOTS FORM ── */
function HeadshotsForm({ onBack }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", department: "", email: "", phone: "", preferredDate: "", location: "", notes: "" });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputStyle = { ...inputBase, width: "100%", boxSizing: "border-box" };
  const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };

  const handleSubmit = () => {
    setTicketNumber(`WF-HS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", maxWidth: 440, margin: "0 auto" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>{"📷"}</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: FC.textPrimary, marginBottom: 8, fontFamily: FONT }}>{"Session Requested"}</h2>
        <p style={{ fontSize: 15, color: FC.textSecondary, marginBottom: 28, lineHeight: 1.7 }}>{"We'll reach out to confirm your headshot session time."}</p>
        <GlassCard style={{ textAlign: "left", maxWidth: 340, margin: "0 auto 24px", padding: "20px 18px" }}>
          {[
            ["Ticket", ticketNumber, true],
            ["Name", `${form.firstName} ${form.lastName}`],
            form.department ? ["Dept", form.department] : null,
            form.preferredDate ? ["Preferred Date", form.preferredDate] : null,
            form.location ? ["Location", form.location] : null,
            form.email ? ["Contact", form.email] : null,
          ].filter(Boolean).map(([k, v, accent], i, arr) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < arr.length - 1 ? 10 : 0 }}>
              <span style={{ fontSize: 12, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</span>
              <span style={{ fontSize: 13, color: accent ? WF.accent : FC.textPrimary, fontWeight: accent ? 700 : 400, textAlign: "right", maxWidth: "60%" }}>{v}</span>
            </div>
          ))}
        </GlassCard>
        <button onClick={() => router.push("/")} style={{ ...glassPill, padding: "13px 28px", border: `1px solid ${WF.accent}40`, color: FC.textPrimary }}>{"Back to Portal"}</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, width: "100%", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{"📷"}</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: FC.textPrimary, fontFamily: FONT, marginBottom: 6 }}>{"Schedule a Headshot"}</h2>
        <p style={{ fontSize: 13, color: FC.textSecondary, lineHeight: 1.6 }}>{"Professional photos for badges, bios, and team pages."}</p>
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
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Email *"}</label><input type="email" value={form.email} onChange={e => u("email", e.target.value)} placeholder="your@email.gov" style={inputStyle} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Preferred Date"}</label><input type="date" value={form.preferredDate} onChange={e => u("preferredDate", e.target.value)} style={inputStyle} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Location Preference"}</label><input value={form.location} onChange={e => u("location", e.target.value)} placeholder="Office, outdoor, studio..." style={inputStyle} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Notes"}</label><textarea value={form.notes} onChange={e => u("notes", e.target.value)} placeholder="Any special requirements..." style={{ ...inputStyle, resize: "vertical", minHeight: 60 }} rows={3} /></div>
        <button onClick={handleSubmit} disabled={!form.firstName || !form.lastName || !form.department || !form.email} style={{
          ...glassPill, width: "100%", padding: "16px", border: `1px solid ${WF.accent}40`, color: FC.textPrimary,
          opacity: (!form.firstName || !form.lastName || !form.department || !form.email) ? 0.5 : 1,
        }}>{"Request Session"}</button>
      </GlassCard>
    </div>
  );
}

/* ── TURTLE PRESS PLACEHOLDER (will receive full form later) ── */
function TurtlePressForm({ onBack }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", category: "", description: "" });
  const u = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inputStyle = { ...inputBase, width: "100%", boxSizing: "border-box" };
  const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };

  const CATEGORIES = [
    { value: "celebration", label: "Birthdays, Celebrations & Photos" },
    { value: "article", label: "Article / Story Submission" },
    { value: "feedback", label: "Feedback & Corrections" },
  ];

  const handleSubmit = () => {
    setTicketNumber(`WF-QTP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", maxWidth: 440, margin: "0 auto" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>{"🐢"}</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: FC.textPrimary, marginBottom: 8, fontFamily: FONT }}>{"Submission Received"}</h2>
        <p style={{ fontSize: 15, color: FC.textSecondary, marginBottom: 28, lineHeight: 1.7 }}>{"Your Turtle Press submission has been routed to the Communications team."}</p>
        <GlassCard style={{ textAlign: "left", maxWidth: 340, margin: "0 auto 24px", padding: "20px 18px" }}>
          {[
            ["Ticket", ticketNumber, true],
            ["Name", `${form.firstName} ${form.lastName}`],
            form.category ? ["Category", CATEGORIES.find(c => c.value === form.category)?.label] : null,
            form.email ? ["Contact", form.email] : null,
          ].filter(Boolean).map(([k, v, accent], i, arr) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < arr.length - 1 ? 10 : 0 }}>
              <span style={{ fontSize: 12, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</span>
              <span style={{ fontSize: 13, color: accent ? WF.accent : FC.textPrimary, fontWeight: accent ? 700 : 400, textAlign: "right", maxWidth: "60%" }}>{v}</span>
            </div>
          ))}
        </GlassCard>
        <button onClick={() => router.push("/")} style={{ ...glassPill, padding: "13px 28px", border: `1px solid ${WF.accent}40`, color: FC.textPrimary }}>{"Back to Portal"}</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, width: "100%", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{"🐢"}</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: FC.textPrimary, fontFamily: FONT, marginBottom: 6 }}>{"The Turtle Press"}</h2>
        <p style={{ fontSize: 13, color: FC.textSecondary, lineHeight: 1.6 }}>{"Quarterly Newsletter — Submission Portal"}</p>
      </div>
      <GlassCard style={{ padding: "22px 18px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"First Name *"}</label><input value={form.firstName} onChange={e => u("firstName", e.target.value)} placeholder="First" style={inputStyle} /></div>
          <div style={{ flex: 1 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Last Name *"}</label><input value={form.lastName} onChange={e => u("lastName", e.target.value)} placeholder="Last" style={inputStyle} /></div>
        </div>
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Email *"}</label><input type="email" value={form.email} onChange={e => u("email", e.target.value)} placeholder="your@email.gov" style={inputStyle} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Submission Type *"}</label>
          <select value={form.category} onChange={e => u("category", e.target.value)} style={selectStyle}>
            <option value="">{"Choose a submission type..."}</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{"Description *"}</label><textarea value={form.description} onChange={e => u("description", e.target.value)} placeholder="Tell us about your submission..." style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} rows={4} /></div>
        <button onClick={handleSubmit} disabled={!form.firstName || !form.lastName || !form.email || !form.category} style={{
          ...glassPill, width: "100%", padding: "16px", border: `1px solid ${WF.accent}40`, color: FC.textPrimary,
          opacity: (!form.firstName || !form.lastName || !form.email || !form.category) ? 0.5 : 1,
        }}>{"Submit"}</button>
      </GlassCard>
    </div>
  );
}

/* ── MAIN STUDIO HUB PAGE ── */
export default function StudioHubPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <PortalBackground />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", zIndex: 1 }}>
        {!activeSection ? (
          <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>{"📷"}</div>
            <h1 style={{ fontSize: 30, fontWeight: 700, fontFamily: FONT, color: FC.textPrimary, marginBottom: 6 }}>{"The Studio Hub"}</h1>
            <p style={{ fontSize: 14, color: FC.textSecondary, marginBottom: 32, lineHeight: 1.6 }}>{"Photography, headshots, and newsletter submissions — all in one place."}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SUBSECTIONS.map(s => (
                <StudioGlass key={s.id} onClick={() => setActiveSection(s.id)}
                  style={{ display: "flex", alignItems: "center", gap: 16, textAlign: "left" }}>
                  <span style={{ fontSize: 36 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: FC.textPrimary, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: FC.textDim, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </StudioGlass>
              ))}
            </div>
          </div>
        ) : activeSection === "headshots" ? (
          <HeadshotsForm onBack={() => setActiveSection(null)} />
        ) : (
          <TurtlePressForm onBack={() => setActiveSection(null)} />
        )}
      </div>
      <Footer />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <PageNav
          onBack={activeSection ? () => setActiveSection(null) : () => router.push("/")}
          backLabel={activeSection ? "Studio Hub" : "Portal"}
        />
      </div>
    </div>
  );
}
