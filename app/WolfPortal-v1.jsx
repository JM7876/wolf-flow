/* ═══════════════════════════════════════════════════════════
   WOLF FLOW COMMUNICATIONS PORTAL — v2 (Route-Ready)
   ─────────────────────────────────────────────────────────
   The Front Door — Welcome, Service Grid (9 NHBP services),
   Generic Form, Confirmation, Check Your Stats.

   Custom services (Visual Design, Form Builder, etc.) route
   to dedicated pages via next/navigation.

   All tokens + shared components imported from app/lib/.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { WF, FC, FONT, MONO, CLICK, GLASS, glassPill, inputBase, WORKFLOW_STEPS, STEP_DESC, STEP_ICONS, WOLF_LOGO, DEPARTMENTS } from "./lib/tokens";
import { GlassCard, SectionLabel, FormField, TripleToggle, MiniTrack, PageNav, PortalBackground } from "./lib/components";
import { SERVICES, FIELD_LABELS, MOCK_REQUESTS } from "./lib/services";


/* ═══════════════════════════════════════════════════════════
   PAGE: WELCOME
   ═══════════════════════════════════════════════════════════ */
function WelcomePage({ onEnter }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 520, padding: "0 24px" }}>
          <div style={{ width: 150, height: 150, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", filter: `drop-shadow(0 4px 20px ${WF.accentGlow})` }}>
            <img src={WOLF_LOGO} alt="Wolf Flow" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <h1 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 36, color: FC.textPrimary, marginBottom: 4, letterSpacing: "-0.01em" }}>
            <span style={{ color: WF.accent }}>{"Communications"}</span>{" Portal"}
          </h1>
          <div style={{ fontSize: 9, color: FC.textDim, letterSpacing: "0.3em", fontWeight: 600, fontFamily: FONT, marginBottom: 8, textTransform: "uppercase" }}>
            {"Wolf Flow Solutions"}
          </div>
          <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: FC.textSecondary, lineHeight: 1.6, marginBottom: 36 }}>
            {"Request services from the Communications Department. Design, photography, writing, web updates, and more \u2014 all in one place."}
          </p>
          <button onClick={onEnter} style={{ ...glassPill, padding: "16px 52px", fontSize: 15, border: "1px solid rgba(149,131,233,0.3)", color: "rgba(189,149,238,0.9)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(149,131,233,0.3)"; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
          >
            {"Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PAGE: SERVICE GRID — 3x3 responsive grid + Check Your Stats
   ═══════════════════════════════════════════════════════════ */
function ServiceGrid({ onSelect, onTracker }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
      <style>{`
        .wf-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (max-width: 600px) { .wf-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 380px) { .wf-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 600, width: "100%", padding: "20px 24px 20px" }}>
          {/* Header with logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 68, height: 68, margin: "0 auto 8px", filter: `drop-shadow(0 2px 12px ${WF.accentGlow})` }}>
              <img src={WOLF_LOGO} alt="Wolf Flow" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <h2 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 26, color: FC.textPrimary, marginBottom: 4 }}>
              {"What can we "}<span style={{ color: WF.accent }}>{"help you"}</span>{" create?"}
            </h2>
            <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: FC.textDim }}>{"Pick the service that best fits your need"}</p>
          </div>

          {/* Service tiles -- 3x3 responsive grid */}
          <div className="wf-grid" style={{ marginBottom: 16 }}>
            {SERVICES.map(svc => {
              const isSoon = svc.status === "soon";
              return (
                <GlassCard
                  key={svc.id}
                  hover={!isSoon}
                  onClick={isSoon ? undefined : () => onSelect(svc)}
                  style={{
                    cursor: isSoon ? "default" : "pointer",
                    padding: "18px 16px",
                    opacity: isSoon ? 0.6 : 1,
                    aspectRatio: "1 / 1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, opacity: isSoon ? 0.5 : 1 }}>{svc.icon}</span>
                    <span style={{
                      fontSize: 8, fontWeight: 700, fontFamily: FONT, letterSpacing: "0.08em",
                      padding: "2px 8px", borderRadius: 10,
                      background: isSoon ? "rgba(255,255,255,0.06)" : `${FC.turquoise}18`,
                      color: isSoon ? FC.textDim : FC.turquoise,
                      border: `1px solid ${isSoon ? FC.border : `${FC.turquoise}30`}`,
                    }}>
                      {isSoon ? "SOON" : "LIVE"}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, fontFamily: FONT, color: FC.textPrimary, marginBottom: 3 }}>{svc.name}</div>
                    <div style={{ fontSize: 9, fontWeight: 400, fontFamily: FONT, color: FC.textDim, lineHeight: 1.4 }}>{svc.description}</div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: FC.border }} />
            <span style={{ fontSize: 9, fontWeight: 600, fontFamily: FONT, color: FC.textDim, letterSpacing: "0.15em" }}>{"OR"}</span>
            <div style={{ flex: 1, height: 1, background: FC.border }} />
          </div>

          {/* Check Your Stats */}
          <GlassCard hover onClick={onTracker} style={{ cursor: "pointer", padding: "20px 20px", border: `1px solid ${FC.gold}20` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `linear-gradient(135deg, ${FC.gold}20, ${FC.gold}08)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                border: `1px solid ${FC.gold}30`,
              }}>{"📊"}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: FONT, color: FC.gold }}>{"Check Your Stats"}</div>
                <div style={{ fontSize: 11, fontWeight: 400, fontFamily: FONT, color: FC.textSecondary }}>{"Track the progress of an existing request"}</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 16, color: FC.textDim }}>{"\u2192"}</div>
            </div>
          </GlassCard>
        </div>
      </div>
      <PageNav onNext={onTracker} nextLabel="Stats" />
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PAGE: GENERIC SERVICE FORM — for services without custom forms
   ═══════════════════════════════════════════════════════════ */
function GenericServiceForm({ service, onSubmit, onBack }) {
  const [formData, setFormData] = useState({});
  const [priority, setPriority] = useState("standard");
  const [mediaType, setMediaType] = useState("digital");
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const id = `WF-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      onSubmit({
        id, service: service.name, serviceIcon: service.icon, est: service.est,
        priority, mediaType,
        requester: formData.employeeName || formData.title || "Requester",
        dept: formData.dept || "\u2014",
        title: formData.title || formData.employeeName || service.name,
        ...formData,
      });
    }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, width: "100%", padding: "20px 24px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 36 }}>{service.icon}</span>
            <h2 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 22, color: FC.textPrimary, marginTop: 8, marginBottom: 4 }}>{service.name}</h2>
            <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 400, color: FC.textDim }}>{"Estimated turnaround: "}{service.est}</p>
          </div>

          <GlassCard style={{ padding: "22px 18px" }}>
            <TripleToggle label="Priority" value={priority} onChange={setPriority}
              options={[
                { value: "rush", label: "Rush", icon: "⚡" },
                { value: "standard", label: "Standard", icon: "📋" },
                { value: "low", label: "Low", icon: "📅" },
              ]}
              colors={[FC.gold, WF.accent, FC.turquoiseLight]}
            />
            <TripleToggle label="Media Type" value={mediaType} onChange={setMediaType}
              options={[
                { value: "digital", label: "Digital", icon: "💻" },
                { value: "print", label: "Print", icon: "🖨️" },
                { value: "both", label: "Both", icon: "📦" },
              ]}
              colors={[FC.turquoiseLight, FC.maroonLight, FC.greenLight]}
            />

            <div style={{ height: 1, background: FC.border, margin: "8px 0 18px" }} />

            {(service.fields || []).map(f => {
              if (f === "dept") return <FormField key={f} label={FIELD_LABELS[f]} value={formData[f] || ""} onChange={v => set(f, v)} options={DEPARTMENTS} required />;
              if (f === "description") return <FormField key={f} label={FIELD_LABELS[f]} value={formData[f] || ""} onChange={v => set(f, v)} placeholder="Describe what you need..." textarea required />;
              if (f === "platform") return <FormField key={f} label={FIELD_LABELS[f]} value={formData[f] || ""} onChange={v => set(f, v)} options={["Facebook Public", "Facebook Members", "Both Facebook Pages", "Website", "All Platforms"]} required />;
              if (["eventDate", "postDate", "preferredDate", "deadline"].includes(f)) return <FormField key={f} label={FIELD_LABELS[f]} type="date" value={formData[f] || ""} onChange={v => set(f, v)} required />;
              if (f === "eventTime") return <FormField key={f} label={FIELD_LABELS[f]} type="time" value={formData[f] || ""} onChange={v => set(f, v)} />;
              if (f === "qty") return <FormField key={f} label={FIELD_LABELS[f]} type="number" value={formData[f] || ""} onChange={v => set(f, v)} placeholder="e.g. 250" required />;
              return <FormField key={f} label={FIELD_LABELS[f]} value={formData[f] || ""} onChange={v => set(f, v)} placeholder={FIELD_LABELS[f]} required={f === "title" || f === "employeeName"} />;
            })}

            <div style={{ height: 1, background: FC.border, margin: "8px 0 18px" }} />
            <SectionLabel>{"Your Information"}</SectionLabel>
            <FormField label="Your Name" value={formData.requesterName || ""} onChange={v => set("requesterName", v)} placeholder="Full name" required />
            <FormField label="Your Email" type="email" value={formData.requesterEmail || ""} onChange={v => set("requesterEmail", v)} placeholder="name@nhbp-nsn.gov" required />
            <FormField label="Your Phone" type="tel" value={formData.requesterPhone || ""} onChange={v => set("requesterPhone", v)} placeholder="(269) 555-0000" />

            <button onClick={handleSubmit} disabled={submitting} style={{
              ...glassPill, width: "100%", marginTop: 8, padding: "16px",
              border: "1px solid rgba(149,131,233,0.3)", color: submitting ? FC.textDim : "rgba(189,149,238,0.9)",
              opacity: submitting ? 0.6 : 1,
            }}
              onMouseEnter={!submitting ? e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; } : undefined}
              onMouseLeave={!submitting ? e => { e.currentTarget.style.borderColor = "rgba(149,131,233,0.3)"; e.currentTarget.style.boxShadow = glassPill.boxShadow; } : undefined}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </GlassCard>
        </div>
      </div>
      <PageNav onBack={onBack} backLabel="Back" onHome={onBack} />
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PAGE: SUBMISSION CONFIRMATION
   ═══════════════════════════════════════════════════════════ */
function ConfirmationPage({ submission, onHome, onTracker }) {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard?.writeText(submission.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRush = submission.priority === "rush";
  const isUrgent = submission.priority === "urgent";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 24 }}>
        <div style={{ maxWidth: 480, width: "100%", padding: "20px 24px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 18, margin: "0 auto 16px",
              background: `linear-gradient(135deg, ${FC.greenLight}30, ${FC.greenLight}10)`,
              border: `2px solid ${FC.greenLight}40`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
              boxShadow: `0 0 40px ${FC.greenLight}20`,
            }}>{"✅"}</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 24, color: FC.textPrimary, marginBottom: 4 }}>
              {"Request "}<span style={{ color: FC.greenLight }}>{"Submitted"}</span>
            </h2>
            <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: FC.textSecondary }}>
              {"Your request has been received and is being processed."}
            </p>
          </div>

          <GlassCard style={{ padding: "22px 18px", marginBottom: 12 }}>
            {/* Request ID */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px", borderRadius: 12, marginBottom: 16,
              background: `linear-gradient(135deg, ${WF.accent}12, ${WF.accent}04)`,
              border: `1px solid ${WF.accent}30`,
            }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 600, fontFamily: FONT, color: FC.textDim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{"Request ID"}</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: MONO, color: WF.accent, letterSpacing: "0.04em" }}>{submission.id}</div>
              </div>
              <button onClick={copyId} style={{
                ...GLASS.default, padding: "8px 14px", cursor: "pointer", borderRadius: 10,
                color: copied ? FC.greenLight : FC.textSecondary, fontSize: 11, fontFamily: FONT, fontWeight: 500,
                border: `1px solid ${copied ? `${FC.greenLight}40` : FC.border}`,
                transition: `all ${CLICK.duration}`,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = copied ? `${FC.greenLight}40` : FC.border; e.currentTarget.style.boxShadow = GLASS.default.boxShadow; }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Summary grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { label: "Service", value: `${submission.serviceIcon} ${submission.service}` },
                { label: "Department", value: submission.dept },
                { label: "Priority", value: isRush ? "⚡ Rush" : isUrgent ? "🔥 Urgent" : "📋 Standard", color: isRush ? FC.gold : isUrgent ? FC.redLight : FC.textSecondary },
                { label: "Media Type", value: submission.mediaType === "digital" ? "💻 Digital" : submission.mediaType === "print" ? "🖨️ Print" : "📦 Both" },
                { label: "Submitted", value: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) },
                { label: "Est. Turnaround", value: submission.est },
              ].map((item, i) => (
                <div key={i} style={{ padding: "10px 12px", ...GLASS.default, borderRadius: 10 }}>
                  <div style={{ fontSize: 9, color: FC.textDim, fontWeight: 600, fontFamily: FONT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: item.color || FC.textSecondary, fontWeight: 500, fontFamily: FONT }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Workflow preview */}
            <SectionLabel>{"Current Status"}</SectionLabel>
            <div style={{
              padding: "12px 14px", borderRadius: 10, marginBottom: 12,
              background: `${WF.accent}08`, border: `1px solid ${WF.accent}20`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{"📥"}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: FONT, color: WF.accent }}>{"Request Received"}</div>
                  <div style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim }}>{"Step 1 of 10 \u2014 Your request is in the queue"}</div>
                </div>
              </div>
              <MiniTrack step={0} showLabels />
            </div>

            {/* What happens next */}
            <SectionLabel>{"What Happens Next"}</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { icon: "🔍", text: "Our team will verify your submission", time: isRush ? "Within 1 hour" : "Within 1 business day" },
                { icon: "👤", text: "A team member will be assigned to your project", time: "After verification" },
                { icon: "📧", text: "You\u2019ll receive updates at your provided email", time: "Ongoing" },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px", borderRadius: 8, background: FC.glass }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{step.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontFamily: FONT, fontWeight: 400, color: FC.textSecondary }}>{step.text}</div>
                    <div style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim }}>{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={onTracker} style={{
              ...glassPill, flex: 1, padding: "14px", fontSize: 12, textAlign: "center",
              border: `1px solid ${FC.gold}30`, color: FC.gold,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${FC.gold}30`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
            >
              {"📊 Check Your Stats"}
            </button>
            <button onClick={onHome} style={{
              ...glassPill, flex: 1, padding: "14px", fontSize: 12, textAlign: "center",
              border: "1px solid rgba(149,131,233,0.3)", color: "rgba(189,149,238,0.9)",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(149,131,233,0.3)"; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
            >
              {"Submit Another"}
            </button>
          </div>
        </div>
      </div>
      <PageNav onBack={onHome} backLabel="Back" onHome={onHome} onNext={onTracker} nextLabel="Track" />
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PAGE: CHECK YOUR STATS — Request Tracker
   ═══════════════════════════════════════════════════════════ */
function CheckYourStats({ onBack, prefillId }) {
  const [inputId, setInputId] = useState(prefillId || "");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("status");
  const inputRef = useRef(null);

  useEffect(() => {
    if (prefillId && MOCK_REQUESTS[prefillId]) {
      setResult(MOCK_REQUESTS[prefillId]);
      setInputId(prefillId);
    }
  }, [prefillId]);

  const handleSearch = () => {
    setError("");
    setResult(null);
    const clean = inputId.trim().toUpperCase();
    if (!clean) { setError("Please enter a request ID"); return; }
    setSearching(true);
    setTimeout(() => {
      const found = MOCK_REQUESTS[clean];
      if (found) { setResult(found); setActiveTab("status"); }
      else { setError(`No request found for "${clean}". Check your ID and try again.`); }
      setSearching(false);
    }, 800);
  };

  const isOverdue = result && result.due !== "Complete" && result.step < 8;
  const isComplete = result && result.step >= 8;
  const isRush = result?.priority === "Rush";
  const isUrgent = result?.priority === "Urgent";
  const pct = result ? Math.round((result.step / (WORKFLOW_STEPS.length - 1)) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ maxWidth: 520, width: "100%", padding: "20px 24px 20px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16, margin: "0 auto 14px",
              background: `linear-gradient(135deg, ${FC.gold}25, ${FC.gold}08)`,
              border: `1px solid ${FC.gold}35`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              boxShadow: `0 4px 24px ${FC.gold}15`,
            }}>{"📊"}</div>
            <h2 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 24, color: FC.textPrimary, marginBottom: 4 }}>
              {"Check Your "}<span style={{ color: FC.gold }}>{"Stats"}</span>
            </h2>
            <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: FC.textDim }}>
              {"Enter your Request ID to track progress in real time"}
            </p>
          </div>

          {/* Search bar */}
          <GlassCard style={{ padding: "18px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input ref={inputRef} value={inputId}
                onChange={e => setInputId(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="WF-2026-0000"
                style={{ ...inputBase, flex: 1, fontFamily: MONO, fontSize: 15, letterSpacing: "0.06em", textAlign: "center" }}
                onFocus={e => { e.target.style.borderColor = `${FC.gold}60`; }}
                onBlur={e => { e.target.style.borderColor = FC.border; }}
              />
              <button onClick={handleSearch} disabled={searching} style={{
                ...GLASS.default, padding: "12px 20px", cursor: searching ? "wait" : "pointer",
                color: FC.gold, fontSize: 13, fontFamily: FONT, fontWeight: 600,
                border: `1px solid ${FC.gold}35`, borderRadius: 10, flexShrink: 0,
                opacity: searching ? 0.6 : 1, transition: `all ${CLICK.duration}`,
              }}
                onMouseEnter={!searching ? e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; } : undefined}
                onMouseLeave={!searching ? e => { e.currentTarget.style.borderColor = `${FC.gold}35`; e.currentTarget.style.boxShadow = GLASS.default.boxShadow; } : undefined}
              >
                {searching ? "..." : "🔍 Track"}
              </button>
            </div>
            <div style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim, textAlign: "center", marginTop: 8 }}>
              {"Format: WF-0000-0000 \u00b7 Found on your confirmation email"}
            </div>
            {error && (
              <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 8, background: `${FC.red}10`, border: `1px solid ${FC.red}25`, fontSize: 12, fontFamily: FONT, color: FC.redLight, textAlign: "center" }}>
                {error}
              </div>
            )}
          </GlassCard>

          {/* Demo hint */}
          {!result && !error && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim, marginBottom: 6 }}>{"Try a sample ID:"}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {Object.keys(MOCK_REQUESTS).map(id => (
                  <button key={id} onClick={() => { setInputId(id); setResult(null); setError(""); }}
                    style={{
                      background: FC.glass, border: `1px solid ${FC.border}`, borderRadius: 8,
                      padding: "4px 10px", fontSize: 10, fontFamily: MONO, color: FC.textSecondary,
                      cursor: "pointer", transition: `all ${CLICK.duration}`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${FC.gold}40`; e.currentTarget.style.boxShadow = `0 0 12px ${FC.gold}15`; e.currentTarget.style.color = FC.textPrimary; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.color = FC.textSecondary; }}
                  >{id}</button>
                ))}
              </div>
            </div>
          )}

          {/* Result card */}
          {result && (
            <div>
              <GlassCard style={{
                padding: 0, marginBottom: 12,
                border: `1px solid ${isComplete ? `${WF.pink}40` : isUrgent ? `${FC.red}40` : isRush ? `${FC.gold}35` : FC.border}`,
              }}>
                <div style={{
                  height: 4, borderRadius: "16px 16px 0 0",
                  background: isComplete ? `linear-gradient(90deg, ${FC.greenLight}, ${WF.pink})` : `linear-gradient(90deg, ${WF.accent}, ${WF.pink}80)`,
                }} />
                <div style={{ padding: "18px 18px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, fontFamily: MONO, color: FC.textDim, marginBottom: 4 }}>{inputId}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT, color: FC.textPrimary, lineHeight: 1.3, marginBottom: 4 }}>{result.title}</div>
                      <div style={{ fontSize: 11, fontFamily: FONT, color: FC.textDim }}>
                        {"🏢 "}{result.dept}{" \u00b7 "}{result.requester}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 600, fontFamily: FONT, padding: "3px 10px", borderRadius: 10,
                        background: isRush ? `${FC.gold}15` : isUrgent ? `${FC.red}15` : `${WF.accent}15`,
                        color: isRush ? FC.gold : isUrgent ? FC.redLight : WF.accent,
                        border: `1px solid ${isRush ? `${FC.gold}25` : isUrgent ? `${FC.red}25` : `${WF.accent}25`}`,
                      }}>
                        {isUrgent ? "🔥 URGENT" : isRush ? "⚡ RUSH" : "📋 STANDARD"}
                      </span>
                      <span style={{ fontSize: 8, fontWeight: 700, fontFamily: FONT, color: FC.textDim, background: FC.glass, padding: "2px 8px", borderRadius: 6 }}>{result.size}</span>
                    </div>
                  </div>

                  {/* Progress ring */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                    borderRadius: 12, marginBottom: 14,
                    background: isComplete ? `${FC.greenLight}10` : `${WF.accent}08`,
                    border: `1px solid ${isComplete ? `${FC.greenLight}25` : `${WF.accent}20`}`,
                  }}>
                    <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                      <svg width={48} height={48} viewBox="0 0 48 48">
                        <circle cx={24} cy={24} r={20} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
                        <circle cx={24} cy={24} r={20} fill="none"
                          stroke={isComplete ? FC.greenLight : WF.accent}
                          strokeWidth={3} strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
                          transform="rotate(-90 24 24)"
                          style={{ transition: "stroke-dashoffset 0.8s ease" }}
                        />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: FONT, color: isComplete ? FC.greenLight : WF.accent }}>{pct}{"%"}</div>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 16 }}>{STEP_ICONS[result.step] || "📥"}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, fontFamily: FONT, color: isComplete ? FC.greenLight : WF.accent }}>
                          {WORKFLOW_STEPS[result.step] || "REQUEST"}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, fontFamily: FONT, color: FC.textSecondary }}>{STEP_DESC[result.step]}</div>
                      <div style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim, marginTop: 2 }}>
                        {"Step "}{result.step + 1}{" of "}{WORKFLOW_STEPS.length}
                      </div>
                    </div>
                  </div>
                  <MiniTrack step={result.step} showLabels />
                </div>
              </GlassCard>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {[
                  { id: "status", label: "Status", icon: "📋" },
                  { id: "activity", label: "Activity", icon: "📊", count: result.activity?.length },
                  { id: "details", label: "Details", icon: "🔖" },
                ].map(t => {
                  const isActive = activeTab === t.id;
                  return (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                      background: isActive ? `${FC.gold}18` : FC.glass,
                      border: `1px solid ${isActive ? `${FC.gold}40` : "rgba(255,255,255,0.05)"}`,
                      color: isActive ? FC.gold : FC.textSecondary,
                      borderRadius: 10, padding: "8px 16px", cursor: "pointer",
                      fontSize: 12, fontWeight: 500, fontFamily: FONT,
                      display: "flex", alignItems: "center", gap: 6,
                      backdropFilter: "blur(var(--glass-blur,18px))", WebkitBackdropFilter: "blur(var(--glass-blur,18px))",
                      transition: `all ${CLICK.duration}`,
                      boxShadow: isActive ? `0 0 20px ${FC.gold}15` : "none",
                    }}
                      onMouseEnter={!isActive ? e => { e.currentTarget.style.borderColor = `${FC.gold}30`; e.currentTarget.style.boxShadow = `0 0 12px ${FC.gold}10`; e.currentTarget.style.color = FC.textPrimary; } : undefined}
                      onMouseLeave={!isActive ? e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.color = FC.textSecondary; } : undefined}
                    >
                      <span style={{ fontSize: 11 }}>{t.icon}</span> {t.label}
                      {t.count != null && <span style={{ background: isActive ? `${FC.gold}25` : "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 5, fontSize: 9 }}>{t.count}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <GlassCard style={{ padding: "18px 16px" }}>
                {activeTab === "status" && (
                  <div>
                    <SectionLabel>{"Assigned To"}</SectionLabel>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: FC.glass, border: `1px solid ${FC.border}`, marginBottom: 14 }}>
                      <span style={{ fontSize: 24 }}>{result.assigneeAvatar}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: FONT, color: FC.textPrimary }}>{result.assignee}</div>
                        <div style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim }}>{result.assigneeRole}</div>
                      </div>
                    </div>
                    <SectionLabel>{"Timeline"}</SectionLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {[
                        { label: "Submitted", value: result.created, icon: "📥" },
                        { label: "Last Update", value: result.updated, icon: "🔄" },
                        { label: "Due Date", value: result.due, icon: isComplete ? "✅" : "📅", color: isComplete ? FC.greenLight : FC.textSecondary },
                      ].map((d, i) => (
                        <div key={i} style={{ padding: "10px 10px", ...GLASS.default, borderRadius: 10, textAlign: "center" }}>
                          <div style={{ fontSize: 14, marginBottom: 4 }}>{d.icon}</div>
                          <div style={{ fontSize: 9, color: FC.textDim, fontWeight: 600, fontFamily: FONT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{d.label}</div>
                          <div style={{ fontSize: 11, color: d.color || FC.textSecondary, fontWeight: 500, fontFamily: FONT }}>{d.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "activity" && (
                  <div>
                    <SectionLabel>{"Activity Log"}</SectionLabel>
                    {result.activity.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < result.activity.length - 1 ? `1px solid ${FC.border}` : "none" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: WF.accent, boxShadow: `0 0 8px ${FC.turquoiseGlow}`, flexShrink: 0 }} />
                          {i < result.activity.length - 1 && <div style={{ width: 1, flex: 1, background: FC.border, marginTop: 4 }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                            <span style={{ fontSize: 12 }}>{a.icon}</span>
                            <span style={{ fontSize: 12, fontFamily: FONT, fontWeight: 400, color: FC.textSecondary }}>{a.action}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: FONT, color: FC.textDim }}>
                            <span>{a.time}</span>
                            <span>{a.by}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "details" && (
                  <div>
                    <SectionLabel>{"Request Details"}</SectionLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { label: "Request ID", value: inputId },
                        { label: "Service", value: result.service },
                        { label: "Department", value: result.dept },
                        { label: "Requester", value: result.requester },
                        { label: "Priority", value: result.priority },
                        { label: "Media Type", value: result.mediaType },
                        { label: "Size", value: result.size },
                        { label: "Status", value: WORKFLOW_STEPS[result.step] },
                      ].map((d, i) => (
                        <div key={i} style={{ padding: "10px 12px", ...GLASS.default, borderRadius: 10 }}>
                          <div style={{ fontSize: 9, color: FC.textDim, fontWeight: 600, fontFamily: FONT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{d.label}</div>
                          <div style={{ fontSize: 12, color: FC.textSecondary, fontWeight: 500, fontFamily: FONT }}>{d.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          )}
        </div>
      </div>
      <PageNav onBack={onBack} backLabel="Back" onHome={onBack} />
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   SETTINGS DROPDOWN — Gear icon > Day/Night + Glass sliders
   ═══════════════════════════════════════════════════════════ */
const GLASS_PRESETS = {
  frost: { label: "Soft Frost", values: { displacement: 0, blur: 22, opacity: 0.22, brightness: 1.08, saturation: 1.05, bezel: 20 } },
  dream: { label: "Dream Glass", values: { displacement: 2, blur: 28, opacity: 0.28, brightness: 1.1, saturation: 1.25, bezel: 26 } },
  studio: { label: "Studio Glass", values: { displacement: 0, blur: 14, opacity: 0.14, brightness: 1, saturation: 1, bezel: 12 } },
};
const GLASS_SLIDERS = [
  { key: "displacement", label: "Displacement", cssVar: "--glass-displacement", unit: "px", min: 0, max: 10, step: 0.5, def: 0 },
  { key: "blur", label: "Blur", cssVar: "--glass-blur", unit: "px", min: 0, max: 50, step: 1, def: 18 },
  { key: "opacity", label: "Opacity", cssVar: "--glass-opacity", unit: "", min: 0, max: 0.5, step: 0.01, def: 0.18 },
  { key: "brightness", label: "Brightness", cssVar: "--glass-brightness", unit: "", min: 0.8, max: 1.4, step: 0.01, def: 1.05 },
  { key: "saturation", label: "Saturation", cssVar: "--glass-saturation", unit: "", min: 0.5, max: 2, step: 0.05, def: 1.1 },
  { key: "bezel", label: "Bezel Depth", cssVar: "--glass-bezel-depth", unit: "px", min: 0, max: 40, step: 1, def: 18 },
];

function SettingsDropdown({ nightMode, onToggleNight }) {
  const [open, setOpen] = useState(false);
  const [glassVals, setGlassVals] = useState(() => {
    const init = {};
    GLASS_SLIDERS.forEach(s => { init[s.key] = s.def; });
    return init;
  });
  const [activePreset, setActivePreset] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const setGlassVar = (cssVar, v, unit) => document.documentElement.style.setProperty(cssVar, v + unit);

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
    <div ref={ref}>
      <button onClick={() => setOpen(o => !o)} style={{
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

      <div style={{
        position: "fixed", top: 58, right: 16, zIndex: 300, width: 290, borderRadius: 20,
        padding: open ? 20 : 0, maxHeight: open ? "min(520px, calc(100vh - 80px))" : 0, overflowY: open ? "auto" : "hidden", overflowX: "hidden",
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
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,205,243,0.5)", marginBottom: 10 }}>{"Appearance"}</div>
          <button onClick={onToggleNight} style={{
            width: "100%", padding: "10px 14px", borderRadius: 10, cursor: "pointer",
            background: FC.glass, border: `1px solid ${FC.border}`,
            color: FC.textSecondary, fontSize: 12, fontWeight: 500, fontFamily: FONT,
            display: "flex", alignItems: "center", gap: 10, transition: `all ${CLICK.duration}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.color = FC.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.color = FC.textSecondary; }}
          >
            <span style={{ fontSize: 16 }}>{nightMode ? "☀️" : "🌙"}</span>
            <span>{nightMode ? "Switch to Day Mode" : "Switch to Night Mode"}</span>
          </button>
        </div>

        <div style={{ height: 1, background: FC.border, marginBottom: 18 }} />

        {/* Glass Engine */}
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,205,243,0.5)", marginBottom: 10 }}>{"Glass Engine"}</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {Object.entries(GLASS_PRESETS).map(([key, preset]) => (
            <button key={key} onClick={() => applyPreset(key)} style={{
              flex: 1, padding: "7px 4px", fontSize: 9, fontWeight: 600, fontFamily: FONT,
              letterSpacing: "0.04em",
              border: `1px solid ${activePreset === key ? "rgba(149,131,233,0.5)" : "rgba(149,131,233,0.15)"}`,
              borderRadius: 10,
              background: activePreset === key ? "rgba(149,131,233,0.15)" : "rgba(255,255,255,0.04)",
              color: activePreset === key ? "#BD95EE" : "rgba(240,205,243,0.5)",
              cursor: "pointer", transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(149,131,233,0.4)"; e.currentTarget.style.color = "#BD95EE"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = activePreset === key ? "rgba(149,131,233,0.5)" : "rgba(149,131,233,0.15)"; e.currentTarget.style.color = activePreset === key ? "#BD95EE" : "rgba(240,205,243,0.5)"; }}
            >{preset.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {GLASS_SLIDERS.map(s => (
            <div key={s.key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(240,205,243,0.6)" }}>{s.label}</span>
                <span style={{ fontSize: 10, fontFamily: FONT, color: "rgba(189,149,238,0.7)" }}>
                  {s.unit === "px" ? `${glassVals[s.key]}px` : glassVals[s.key].toFixed(2)}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={glassVals[s.key]}
                onChange={e => updateSlider(s.key, e.target.value)}
                style={{ width: "100%", cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   MAIN PORTAL COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function WolfFlowPortal() {
  const router = useRouter();
  const [page, setPage] = useState("welcome");
  const [selectedService, setSelectedService] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [nightMode, setNightMode] = useState(false);
  const [trackerId, setTrackerId] = useState("");

  const goServices = () => { setPage("services"); setSelectedService(null); };
  const goTracker = (prefill) => { setTrackerId(prefill || ""); setPage("tracker"); };

  const handleServiceSelect = (svc) => {
    // Custom services route to their own pages
    if (svc.formType === "custom") {
      router.push(`/services/${svc.id}`);
      return;
    }
    // Generic services use the in-portal form
    setSelectedService(svc);
    setPage("form");
  };

  const handleSubmit = (data) => {
    setSubmission(data);
    setPage("confirm");
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: FONT, color: FC.textPrimary, position: "relative", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,500&display=swap" rel="stylesheet" />

      <PortalBackground nightMode={nightMode} />
      <SettingsDropdown nightMode={nightMode} onToggleNight={() => setNightMode(n => !n)} />

      {page === "welcome" && <WelcomePage onEnter={goServices} />}
      {page === "services" && <ServiceGrid onSelect={handleServiceSelect} onTracker={() => goTracker()} />}
      {page === "form" && selectedService && <GenericServiceForm service={selectedService} onSubmit={handleSubmit} onBack={goServices} />}
      {page === "confirm" && <ConfirmationPage submission={submission} onHome={goServices} onTracker={() => goTracker(submission?.id)} />}
      {page === "tracker" && <CheckYourStats onBack={goServices} prefillId={trackerId} />}
    </div>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
