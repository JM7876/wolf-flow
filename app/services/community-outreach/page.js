"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WF, FC, FONT, CLICK, GLASS, glassPill, inputBase, DEPARTMENTS } from "../../lib/tokens";
import { GlassCard, TopShine, SectionLabel, PageNav, PortalBackground, Footer } from "../../lib/components";

/* ═══════════════════════════════════════════════════════════
   COMMUNITY OUTREACH — Social Media & Instant Alerts (Merged)
   ─────────────────────────────────────────────────────────
   Unified service: Submit a Post Request OR send an Instant Alert.
   WF-branded with liquid glass, Wolf Flow tokens, PageNav.
   Created and Authored by Johnathon Moulds - 2026
   ═══════════════════════════════════════════════════════════ */

/* ─── Constants ──────────────────────────────────────────── */

const CO_DEPTS = DEPARTMENTS;

const PLATFORMS = [
  { id: "website",   icon: "\uD83C\uDF10", label: "Website" },
  { id: "facebook",  icon: "\uD83D\uDCD8", label: "Facebook" },
  { id: "instagram", icon: "\uD83D\uDCF8", label: "Instagram" },
];

const SCHEDULE_OPTIONS = [
  { id: "ready",     icon: "\u2705", label: "Ready to Post",       desc: "Post as soon as Communications reviews and approves" },
  { id: "date",      icon: "\uD83D\uDCC5", label: "Specific Date",      desc: "You have a date in mind for this post" },
  { id: "recurring", icon: "\uD83D\uDD04", label: "Recurring / Ongoing", desc: "Regular series or campaign content" },
];

const FREQUENCY_OPTIONS = [
  { value: "every-monday",    label: "Every Monday" },
  { value: "every-tuesday",   label: "Every Tuesday" },
  { value: "every-wednesday", label: "Every Wednesday" },
  { value: "every-thursday",  label: "Every Thursday" },
  { value: "every-friday",    label: "Every Friday" },
  { value: "every-week",      label: "Once a Week (flexible day)" },
  { value: "every-2-weeks",   label: "Every 2 Weeks" },
  { value: "monthly",         label: "Monthly" },
  { value: "campaign",        label: "Campaign Schedule" },
];

const NEEDS_END_DATE = ["every-2-weeks", "every-week", "monthly", "campaign"];

const URGENCY_LEVELS = [
  { id: "emergency", icon: "\uD83D\uDEA8", label: "Emergency", desc: "Immediate \u2014 safety, closures, critical public notices",  color: WF.red,       glow: WF.redGlow },
  { id: "urgent",    icon: "\u26A1",        label: "Urgent",    desc: "Same day \u2014 time-sensitive announcements",               color: FC.gold,      glow: "rgba(189,149,238,0.3)" },
  { id: "priority",  icon: "\uD83D\uDCE2",  label: "Priority",  desc: "Within 24 hours \u2014 important but not a crisis",          color: WF.accent,    glow: WF.accentGlow },
];

const CHANNELS = [
  { id: "email",   icon: "\uD83D\uDCE7", label: "Email Blast" },
  { id: "website", icon: "\uD83C\uDF10", label: "Website Banner" },
  { id: "social",  icon: "\uD83D\uDCF1", label: "Social Media" },
  { id: "text",    icon: "\uD83D\uDCAC", label: "Text / SMS" },
  { id: "flyer",   icon: "\uD83D\uDCC4", label: "Printed Flyer" },
  { id: "all",     icon: "\uD83D\uDD0A", label: "All Channels" },
];

/* ─── Interactive Glass Card ─────────────────────────────── */

function OutreachGlass({ children, active, onClick, glowColor, style: s = {} }) {
  const [h, setH] = useState(false);
  const gc = glowColor || WF.accent;
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: active ? `${gc}14` : "rgba(255,255,255,0.025)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${active ? gc + "55" : h && onClick ? gc + "25" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, padding: "16px 18px",
        transition: `all ${CLICK.duration}`,
        cursor: onClick ? "pointer" : "default",
        boxShadow: active
          ? `0 0 28px ${gc}25, inset 0 1px 0 rgba(255,255,255,0.08)`
          : h && onClick ? `0 6px 24px rgba(0,0,0,0.25)` : `inset 0 1px 0 rgba(255,255,255,0.03)`,
        transform: h && onClick ? "translateY(-1px)" : "none",
        position: "relative", overflow: "hidden", ...s,
      }}>
      <TopShine r={14} />
      {children}
    </div>
  );
}

/* ─── Styled Input ───────────────────────────────────────── */

function WFInput({ label, value, onChange, placeholder, type = "text", required, multiline, inputRef }) {
  const base = { ...inputBase, width: "100%", boxSizing: "border-box" };
  const focusIn = (e) => { e.target.style.borderColor = `${WF.accent}60`; e.target.style.boxShadow = `0 0 12px ${WF.accentGlow}`; };
  const focusOut = (e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 6px rgba(0,0,0,0.06)"; };
  return (
    <div style={{ marginBottom: 14, flex: 1 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT }}>
          {label}{required && <span style={{ color: WF.red }}>{" *"}</span>}
        </label>
      )}
      {multiline ? (
        <textarea ref={inputRef} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={5}
          style={{ ...base, resize: "vertical", lineHeight: 1.6, minHeight: 80 }} onFocus={focusIn} onBlur={focusOut} />
      ) : (
        <input ref={inputRef} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ ...base, ...(type === "date" || type === "time" ? { colorScheme: "dark", cursor: "pointer" } : {}) }} onFocus={focusIn} onBlur={focusOut} />
      )}
    </div>
  );
}

/* ─── Styled Select ──────────────────────────────────────── */

function WFSelect({ label, value, onChange, options, placeholder, required }) {
  const focusIn = (e) => { e.target.style.borderColor = `${WF.accent}60`; };
  const focusOut = (e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: FC.textDim, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT }}>
          {label}{required && <span style={{ color: WF.red }}>{" *"}</span>}
        </label>
      )}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inputBase, width: "100%", boxSizing: "border-box", appearance: "none", cursor: "pointer" }}
        onFocus={focusIn} onBlur={focusOut}
      >
        <option value="" style={{ background: FC.dark }}>{placeholder || "Select..."}</option>
        {options.map(o => <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value} style={{ background: FC.dark }}>{typeof o === "string" ? o : o.label}</option>)}
      </select>
    </div>
  );
}

/* ─── Badge ──────────────────────────────────────────────── */

function WFBadge({ label, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "5px 14px", borderRadius: 20,
      background: `${color || WF.accent}18`, border: `1px solid ${color || WF.accent}35`,
      fontSize: 12, fontWeight: 600, color: color || WF.accent, fontFamily: FONT,
      margin: "0 4px 6px 0",
    }}>{label}</span>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function CommunityOutreachPage() {
  const router = useRouter();

  /* ─── State ──────────────────────────────────────────────── */
  const [step, setStep]               = useState(0);
  const [path, setPath]               = useState(null);       // "social" | "alert"
  const [animating, setAnimating]     = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [submissionDate, setSubmissionDate] = useState(null);
  const [uploadedFiles, setUploadedFiles]   = useState([]);
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", department: "",
    platforms: {}, contentPlatforms: {},
    schedule: null, scheduleDate: "", frequency: "", campaignEndDate: "",
    description: "", notes: "",
    urgency: null, channels: {},
    subject: "", message: "",
    audience: "", effectiveDate: "", effectiveTime: "",
    approvedBy: "",
  });

  const u = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const togglePlatform = (id) => {
    setForm(prev => {
      const updated = { ...prev.platforms, [id]: !prev.platforms[id] };
      return { ...prev, platforms: updated, contentPlatforms: { ...prev.contentPlatforms, [id]: !prev.platforms[id] } };
    });
  };

  const toggleContentPlatform = (id) => {
    setForm(prev => ({ ...prev, contentPlatforms: { ...prev.contentPlatforms, [id]: !prev.contentPlatforms[id] } }));
  };

  const toggleChannel = (id) => {
    if (id === "all") {
      const newVal = !form.channels["all"];
      const allChannels = {};
      CHANNELS.forEach(c => { allChannels[c.id] = newVal; });
      u("channels", allChannels);
    } else {
      setForm(prev => ({
        ...prev,
        channels: { ...prev.channels, all: false, [id]: !prev.channels[id] },
      }));
    }
  };

  useEffect(() => {
    if (inputRef.current) setTimeout(() => inputRef.current?.focus(), 350);
  }, [step]);

  /* ─── Navigation ─────────────────────────────────────────── */

  const goTo = useCallback((n) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setStep(n); setAnimating(false); }, 240);
  }, [animating]);

  const BACK_MAP = { 1: 0, 2: 1, 3: 2, 4: 3, 6: 1, 7: 6, 8: 7, 9: 8 };
  const navBack = () => { if (BACK_MAP[step] !== undefined) goTo(BACK_MAP[step]); };

  /* ─── Ticket Number ──────────────────────────────────────── */

  const generateTicketNumber = (dept, firstName, lastName) => {
    const deptCode = dept.replace(/[^a-zA-Z]/g, "").toLowerCase().substring(0, 4).padEnd(4, "x");
    const initials = ((firstName[0] || "x") + (lastName[0] || "x")).toLowerCase();
    const year     = new Date().getFullYear().toString().slice(-2);
    const seq      = String(Math.floor(Math.random() * 9000) + 1000);
    return `${deptCode}-${initials}-${year}-${seq}`;
  };

  /* ─── File Handling ──────────────────────────────────────── */

  const handleFileSelect = (e) => { setUploadedFiles(prev => [...prev, ...e.target.files]); };
  const handleDrop = (e) => { e.preventDefault(); setUploadedFiles(prev => [...prev, ...e.dataTransfer.files]); };
  const removeFile = (index) => { setUploadedFiles(prev => prev.filter((_, i) => i !== index)); };
  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return null;
    if (file.name.endsWith(".pdf")) return "\uD83D\uDCC4";
    if (file.name.match(/\.pptx?$/)) return "\uD83D\uDCCA";
    if (file.name.match(/\.docx?$/)) return "\uD83D\uDCDD";
    return "\uD83D\uDCCE";
  };

  /* ─── Submit ─────────────────────────────────────────────── */

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const ticket = generateTicketNumber(form.department, form.firstName, form.lastName);
    const date   = new Date().toLocaleString("en-US", {
      weekday: "short", year: "numeric", month: "short",
      day: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
    });
    setTicketNumber(ticket);
    setSubmissionDate(date);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  /* ─── Validation ─────────────────────────────────────────── */

  const urgencyObj  = URGENCY_LEVELS.find(x => x.id === form.urgency);
  const accentColor = path === "alert" ? (urgencyObj?.color || WF.accent) : WF.accent;

  const step1Valid = !!(form.firstName && form.lastName && form.department && form.email);
  const step2Valid = Object.values(form.platforms).some(Boolean) && !!form.schedule &&
    (form.schedule !== "recurring" || !!form.frequency);
  const step3Valid = !!form.description;
  const step7Valid = !!(form.subject && form.message);
  const step8Valid = Object.values(form.channels).some(Boolean);

  const showCampaignEnd = NEEDS_END_DATE.includes(form.frequency);

  /* ─── Styles ─────────────────────────────────────────────── */

  const S = {
    hero:     { fontSize: 56, marginBottom: 18, display: "block" },
    h1:       { fontSize: 30, fontWeight: 700, color: FC.textPrimary, fontFamily: FONT, marginBottom: 8 },
    h2:       { fontSize: 22, fontWeight: 700, color: FC.textPrimary, fontFamily: FONT, marginBottom: 8 },
    sub:      { fontSize: 14, color: FC.textSecondary, marginBottom: 28, lineHeight: 1.7 },
    label:    { fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10, fontFamily: FONT, textAlign: "left", display: "block" },
    noteBox:  { fontSize: 12, color: FC.textSecondary, lineHeight: 1.6, padding: "12px 16px", background: `${WF.accent}08`, borderRadius: 10, border: `1px solid ${WF.accent}22`, marginBottom: 18, textAlign: "left" },
    warnBox:  { fontSize: 12, color: FC.textSecondary, lineHeight: 1.6, padding: "14px 16px", background: `${FC.gold}08`, borderRadius: 12, border: `1px solid ${FC.gold}28`, marginTop: 16, textAlign: "left" },
    fieldRow: { display: "flex", gap: 12 },
    uploadZone: {
      border: `2px dashed ${FC.border}`,
      borderRadius: 12, padding: "28px 20px", textAlign: "center",
      cursor: "pointer", marginBottom: 12,
      background: "rgba(255,255,255,0.02)",
      transition: `all ${CLICK.duration}`,
    },
    previewGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: 8, marginBottom: 14 },
    summaryRow: { paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${FC.border}`, textAlign: "left" },
    summaryKey: { fontSize: 10, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: FONT },
    summaryVal: { fontSize: 14, color: FC.textPrimary, lineHeight: 1.5 },
    btn: {
      display: "block", width: "100%", marginTop: 24,
      padding: "14px 28px",
      background: `${accentColor}18`,
      border: `1px solid ${accentColor}35`,
      color: accentColor,
      borderRadius: 12, fontSize: 14, fontWeight: 600,
      cursor: "pointer", fontFamily: FONT,
      transition: `all ${CLICK.duration}`,
    },
    btnSubmit: {
      display: "block", width: "100%", marginTop: 24,
      padding: "15px 28px",
      background: accentColor,
      border: "none", color: "#fff",
      borderRadius: 12, fontSize: 14, fontWeight: 700,
      cursor: "pointer", fontFamily: FONT,
      letterSpacing: "0.03em", transition: `all ${CLICK.duration}`,
      boxShadow: `0 4px 24px ${urgencyObj?.glow || WF.accentGlow}`,
      opacity: isSubmitting ? 0.6 : 1,
    },
  };

  /* ─── Submitted screen ───────────────────────────────────── */

  if (submitted) {
    const isSocial = path === "social";
    const selectedPlatforms = Object.entries(form.contentPlatforms).filter(([, v]) => v).map(([k]) => PLATFORMS.find(p => p.id === k));
    const selectedChannels  = Object.entries(form.channels).filter(([, v]) => v).map(([k]) => CHANNELS.find(c => c.id === k));
    const scheduleObj = SCHEDULE_OPTIONS.find(s => s.id === form.schedule);
    const freqLabel   = FREQUENCY_OPTIONS.find(f => f.value === form.frequency)?.label || "";

    return (
      <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <PortalBackground />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", zIndex: 1 }}>
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <div style={{ fontSize: 64, marginBottom: 22 }}>{isSocial ? "\uD83D\uDCE3" : (urgencyObj?.icon || "\u26A1")}</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: FC.textPrimary, marginBottom: 8, fontFamily: FONT }}>
              {isSocial ? "Request Submitted" : "Alert Submitted"}
            </h2>
            <p style={{ fontSize: 14, color: FC.textSecondary, marginBottom: 24, lineHeight: 1.7 }}>
              {isSocial
                ? "Your social media request is now with Communications. You\u2019ll be notified when it\u2019s scheduled."
                : <>{"Your "}<strong>{urgencyObj?.label?.toLowerCase()}</strong>{" alert has been routed to Communications for immediate action."}</>}
            </p>

            {/* Badges */}
            <div style={{ marginBottom: 18 }}>
              {isSocial && selectedPlatforms.map(p => (
                <WFBadge key={p.id} label={`${p.icon} ${p.label}`} color={WF.accent} />
              ))}
              {!isSocial && urgencyObj && (
                <WFBadge label={`${urgencyObj.icon} ${urgencyObj.label}`} color={urgencyObj.color} />
              )}
            </div>

            {/* Summary card */}
            <GlassCard style={{ textAlign: "left", maxWidth: 360, margin: "0 auto 8px", padding: "20px 18px" }}>
              {(isSocial ? [
                ["Ticket No.", ticketNumber, true],
                ["Platforms",  selectedPlatforms.map(p => `${p.icon} ${p.label}`).join(", ")],
                ["Schedule",   scheduleObj ? `${scheduleObj.icon} ${scheduleObj.label}${freqLabel ? ` \u2014 ${freqLabel}` : ""}` : ""],
                ["By",         `${form.firstName} ${form.lastName}`],
                ["Submitted",  submissionDate],
              ] : [
                ["Ticket No.", ticketNumber, true],
                ["Urgency",    `${urgencyObj?.icon} ${urgencyObj?.label}`],
                ["Subject",    form.subject],
                ["Channels",   selectedChannels.map(c => c?.icon).join("  ")],
                ["By",         `${form.firstName} ${form.lastName}`],
                ["Submitted",  submissionDate],
              ]).filter(([, v]) => v).map(([k, v, accent], i, arr) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: i < arr.length - 1 ? 10 : 0 }}>
                  <span style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 13, color: accent ? accentColor : FC.textPrimary, fontWeight: accent ? 700 : 400, fontFamily: FONT, textAlign: "right", maxWidth: "65%", letterSpacing: accent ? "0.04em" : 0 }}>{v}</span>
                </div>
              ))}
            </GlassCard>

            <p style={{ fontSize: 11, color: FC.textDim, marginTop: 8, lineHeight: 1.6 }}>
              {"Save your ticket number \u2014 it\u2019s your reference for all follow-ups."}
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              <button
                onClick={() => { setSubmitted(false); setStep(0); setPath(null); setUploadedFiles([]); }}
                style={{ ...glassPill, padding: "13px 28px", border: `1px solid ${WF.accent}40`, color: WF.accentLight }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
              >{"Submit Another"}</button>
              <button
                onClick={() => router.push("/?page=services")}
                style={{ ...glassPill, padding: "13px 28px", border: `1px solid ${FC.border}`, color: FC.textSecondary }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.color = FC.textPrimary; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.color = FC.textSecondary; }}
              >{"Back to Services"}</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ─── Step Renderer ──────────────────────────────────────── */

  const renderStep = () => {
    switch (step) {

      /* ── Step 0: Path Select ─────────────────────────────── */
      case 0: return (
        <div style={{ textAlign: "center" }}>
          <span style={S.hero}>{"\uD83D\uDCE3"}</span>
          <h1 style={S.h1}>{"Community Outreach"}</h1>
          <p style={{ fontSize: 15, color: WF.accentLight, fontWeight: 500, marginBottom: 6 }}>{"Social Media & Instant Alerts"}</p>
          <p style={{ ...S.sub, maxWidth: 360, margin: "12px auto 28px" }}>
            {"Need something posted on social media? Or send an urgent alert to the community? Choose your path to get started."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <OutreachGlass
              active={path === "social"}
              onClick={() => { setPath("social"); setTimeout(() => goTo(1), 240); }}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <span style={{ fontSize: 28, filter: path === "social" ? `drop-shadow(0 0 8px ${WF.accentGlow})` : "none", transition: `filter ${CLICK.duration}` }}>{"\uD83D\uDCF1"}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: path === "social" ? WF.accentLight : FC.textPrimary }}>{"Submit a Post Request"}</div>
                <div style={{ fontSize: 12, color: FC.textDim }}>{"Social media posts \u2014 Facebook, Instagram, Website"}</div>
              </div>
            </OutreachGlass>
            <OutreachGlass
              active={path === "alert"}
              glowColor={WF.red}
              onClick={() => { setPath("alert"); setTimeout(() => goTo(1), 240); }}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <span style={{ fontSize: 28, filter: path === "alert" ? `drop-shadow(0 0 8px ${WF.redGlow})` : "none", transition: `filter ${CLICK.duration}` }}>{"\u26A1"}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: path === "alert" ? WF.red : FC.textPrimary }}>{"Instant Alert"}</div>
                <div style={{ fontSize: 12, color: FC.textDim }}>{"Urgent communications & emergency notices"}</div>
              </div>
            </OutreachGlass>
          </div>
        </div>
      );

      /* ── Step 1: Requester (shared) ──────────────────────── */
      case 1: return (
        <div style={{ textAlign: "center" }}>
          <span style={S.hero}>{"\uD83D\uDC64"}</span>
          <h2 style={S.h2}>{"Who\u2019s requesting?"}</h2>
          <p style={S.sub}>{"We need to know who to follow up with."}</p>
          <div style={{ textAlign: "left" }}>
            <div style={S.fieldRow}>
              <WFInput label="First Name" value={form.firstName} required onChange={v => u("firstName", v)} placeholder="First" inputRef={inputRef} />
              <WFInput label="Last Name"  value={form.lastName}  required onChange={v => u("lastName", v)}  placeholder="Last" />
            </div>
            <WFSelect label="Department" value={form.department} required onChange={v => u("department", v)} options={CO_DEPTS} placeholder="Select department..." />
            <div style={S.fieldRow}>
              <WFInput label="Email" value={form.email} type="email" required onChange={v => u("email", v)} placeholder="your@email.gov" />
              {path === "alert" && (
                <WFInput label="Phone" value={form.phone} onChange={v => u("phone", v)} placeholder="(555) 555-5555" />
              )}
            </div>
          </div>
          <button style={{ ...S.btn, opacity: step1Valid ? 1 : 0.25, cursor: step1Valid ? "pointer" : "default" }}
            onClick={() => step1Valid && goTo(path === "social" ? 2 : 6)} disabled={!step1Valid}
            onMouseEnter={step1Valid ? e => { e.currentTarget.style.background = `${accentColor}28`; e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}20`; } : undefined}
            onMouseLeave={step1Valid ? e => { e.currentTarget.style.background = `${accentColor}18`; e.currentTarget.style.boxShadow = "none"; } : undefined}
          >{"Continue"}</button>
        </div>
      );

      /* ═══════════ SOCIAL MEDIA PATH ═══════════════════════ */

      /* ── Step 2: Platform & Schedule ─────────────────────── */
      case 2: return (
        <div style={{ textAlign: "center" }}>
          <span style={S.hero}>{"\uD83D\uDCC5"}</span>
          <h2 style={S.h2}>{"Platform & Schedule"}</h2>
          <p style={S.sub}>{"Where should this be posted, and when?"}</p>
          <div style={{ textAlign: "left" }}>
            <span style={S.label}>{"Select Platforms"}</span>
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {PLATFORMS.map(p => (
                <OutreachGlass key={p.id} active={!!form.platforms[p.id]} onClick={() => togglePlatform(p.id)}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "18px 10px", textAlign: "center" }}>
                  <span style={{ fontSize: 28, filter: form.platforms[p.id] ? `drop-shadow(0 0 8px ${WF.accentGlow})` : "none", transition: `filter ${CLICK.duration}` }}>{p.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: form.platforms[p.id] ? WF.accentLight : FC.textPrimary }}>{p.label}</span>
                </OutreachGlass>
              ))}
            </div>

            <span style={S.label}>{"Posting Schedule"}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>
              {SCHEDULE_OPTIONS.map(s => (
                <OutreachGlass key={s.id} active={form.schedule === s.id}
                  onClick={() => { u("schedule", s.id); if (s.id !== "recurring") u("frequency", ""); }}
                  style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: form.schedule === s.id ? WF.accentLight : FC.textPrimary }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: FC.textDim }}>{s.desc}</div>
                  </div>
                </OutreachGlass>
              ))}
            </div>

            {form.schedule === "date" && (
              <div style={{ marginTop: 14 }}>
                <WFInput label="Preferred Date" value={form.scheduleDate} type="date" onChange={v => u("scheduleDate", v)} />
              </div>
            )}

            {form.schedule === "recurring" && (
              <div style={{ marginTop: 14, padding: 16, background: `${WF.accent}06`, border: `1px solid ${WF.accent}18`, borderRadius: 12 }}>
                <WFSelect label="Posting Frequency" value={form.frequency} onChange={v => u("frequency", v)} options={FREQUENCY_OPTIONS} placeholder="Select frequency..." />
                {showCampaignEnd && (
                  <div>
                    <WFInput label="Campaign End Date" value={form.campaignEndDate} type="date" onChange={v => u("campaignEndDate", v)} />
                    <p style={{ fontSize: 11, color: FC.textDim, marginTop: -8, lineHeight: 1.6 }}>{"Posts will run at the selected frequency until this date."}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <button style={{ ...S.btn, opacity: step2Valid ? 1 : 0.25, cursor: step2Valid ? "pointer" : "default" }}
            onClick={() => step2Valid && goTo(3)} disabled={!step2Valid}
            onMouseEnter={step2Valid ? e => { e.currentTarget.style.background = `${WF.accent}28`; } : undefined}
            onMouseLeave={step2Valid ? e => { e.currentTarget.style.background = `${WF.accent}18`; } : undefined}
          >{"Continue"}</button>
        </div>
      );

      /* ── Step 3: Content ─────────────────────────────────── */
      case 3: return (
        <div style={{ textAlign: "center" }}>
          <span style={S.hero}>{"\u270D\uFE0F"}</span>
          <h2 style={S.h2}>{"Content"}</h2>
          <p style={S.sub}>{"Tell us what you\u2019d like posted and attach your files."}</p>
          <div style={{ textAlign: "left" }}>
            {/* Platform checkboxes */}
            <span style={S.label}>{"Post Platforms"}</span>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {PLATFORMS.map(p => {
                const checked = !!form.contentPlatforms[p.id];
                return (
                  <div key={p.id} onClick={() => toggleContentPlatform(p.id)}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                      background: checked ? `${WF.accent}12` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${checked ? `${WF.accent}45` : FC.border}`,
                      transition: `all ${CLICK.duration}`,
                      boxShadow: checked ? `0 0 16px ${WF.accentGlow}` : "none",
                    }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? WF.accent : "rgba(255,255,255,0.2)"}`, background: checked ? WF.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", transition: `all ${CLICK.duration}`, flexShrink: 0 }}>
                      {checked ? "\u2713" : ""}
                    </div>
                    <span style={{ fontSize: 14 }}>{p.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: checked ? WF.accentLight : FC.textSecondary }}>{p.label}</span>
                  </div>
                );
              })}
            </div>

            <WFInput label="Post Copy / Description" value={form.description} required onChange={v => u("description", v)}
              placeholder="What should the post say? Include key details, event dates, links, calls to action..." multiline inputRef={inputRef} />

            {/* File upload */}
            <span style={S.label}>{"Attach Files"}</span>
            <div style={S.uploadZone}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{"\uD83D\uDCCE"}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: FC.textSecondary, marginBottom: 4 }}>{"Drop files here or browse"}</div>
              <div style={{ fontSize: 12, color: FC.textDim, marginBottom: 12 }}>{"Images, PDFs, Word docs \u2014 all formats accepted"}</div>
              <span onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                style={{ display: "inline-block", padding: "8px 18px", background: `${WF.accent}12`, border: `1px solid ${WF.accent}28`, borderRadius: 8, fontSize: 12, fontWeight: 600, color: WF.accentLight, cursor: "pointer" }}>
                {"Browse Files"}
              </span>
              <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.ppt,.pptx" onChange={handleFileSelect} style={{ display: "none" }} />
            </div>

            {uploadedFiles.length > 0 && (
              <div style={S.previewGrid}>
                {uploadedFiles.map((file, i) => {
                  const icon = getFileIcon(file);
                  const isImage = file.type.startsWith("image/");
                  return (
                    <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.04)", border: `1px solid ${FC.border}` }}>
                      {isImage ? (
                        <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: "100%", height: 76, objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: 76, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 22 }}>{icon}</div>
                      )}
                      <div style={{ fontSize: 9, color: FC.textDim, padding: "0 4px 4px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                      <button onClick={() => removeFile(i)} style={{ position: "absolute", top: 3, right: 3, width: 16, height: 16, background: `${WF.red}dd`, border: "none", borderRadius: "50%", color: "#fff", fontSize: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>{"\u2715"}</button>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={S.noteBox}>
              {"Your uploaded files are attached directly to your project card \u2014 Communications has everything in one place, no separate email needed."}
            </div>

            <WFInput label="Additional Notes" value={form.notes} onChange={v => u("notes", v)} placeholder="Hashtags, tone preferences, special instructions, tags..." multiline />
          </div>
          <button style={{ ...S.btn, opacity: step3Valid ? 1 : 0.25, cursor: step3Valid ? "pointer" : "default" }}
            onClick={() => step3Valid && goTo(4)} disabled={!step3Valid}
            onMouseEnter={step3Valid ? e => { e.currentTarget.style.background = `${WF.accent}28`; } : undefined}
            onMouseLeave={step3Valid ? e => { e.currentTarget.style.background = `${WF.accent}18`; } : undefined}
          >{"Review Request"}</button>
        </div>
      );

      /* ── Step 4: Social Review ───────────────────────────── */
      case 4: {
        const selectedPlatforms = Object.entries(form.contentPlatforms).filter(([, v]) => v).map(([k]) => PLATFORMS.find(p => p.id === k));
        const scheduleObj = SCHEDULE_OPTIONS.find(s => s.id === form.schedule);
        const freqLabel   = FREQUENCY_OPTIONS.find(f => f.value === form.frequency)?.label || "";
        let schedDisplay  = scheduleObj ? `${scheduleObj.icon} ${scheduleObj.label}` : "";
        if (form.schedule === "date" && form.scheduleDate) schedDisplay += ` \u2014 ${form.scheduleDate}`;
        if (form.schedule === "recurring" && freqLabel) {
          schedDisplay += ` \u2014 ${freqLabel}`;
          if (form.campaignEndDate) schedDisplay += ` (ends ${form.campaignEndDate})`;
        }
        const fileNames = uploadedFiles.map(f => f.name);

        const items = [
          ["Requester",    `${form.firstName} ${form.lastName} \u2014 ${form.department}`],
          ["Platforms",    selectedPlatforms.map(p => `${p.icon} ${p.label}`).join(", ") || "(not specified)"],
          ["Schedule",     schedDisplay],
          ["Post Content", form.description],
          fileNames.length ? ["Attached Files", fileNames.join(", ")] : null,
          form.notes ? ["Notes", form.notes] : null,
          ["Contact",      form.email],
          ["Submitted",    new Date().toLocaleString()],
        ].filter(Boolean);

        return (
          <div style={{ textAlign: "center" }}>
            <span style={S.hero}>{"\uD83D\uDCCB"}</span>
            <h2 style={S.h2}>{"Review Request"}</h2>
            <p style={S.sub}>{"Confirm everything before submitting."}</p>
            <GlassCard style={{ marginBottom: 16, padding: "20px 18px" }}>
              {items.map(([k, v], i) => (
                <div key={k + i} style={{ ...S.summaryRow, ...(i === items.length - 1 ? { borderBottom: "none", marginBottom: 0, paddingBottom: 0 } : {}) }}>
                  <div style={S.summaryKey}>{k}</div>
                  <div style={S.summaryVal}>{v}</div>
                </div>
              ))}
            </GlassCard>
            <div style={S.warnBox}>
              {"Note: Communications reserves the right to schedule posts in accordance with current content priorities, departmental flow, and community importance. Your preferred date will be honored when possible."}
            </div>
            <button style={S.btnSubmit} onClick={handleSubmit} disabled={isSubmitting}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 32px ${WF.accentGlow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 24px ${WF.accentGlow}`; }}
            >{isSubmitting ? "Submitting..." : "Submit Request"}</button>
          </div>
        );
      }

      /* ═══════════ INSTANT ALERT PATH ═════════════════════ */

      /* ── Step 6: Urgency ─────────────────────────────────── */
      case 6: return (
        <div style={{ textAlign: "center" }}>
          <span style={S.hero}>{"\u26A0\uFE0F"}</span>
          <h2 style={S.h2}>{"How urgent is this?"}</h2>
          <p style={S.sub}>{"This determines how quickly we respond and act."}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {URGENCY_LEVELS.map(l => (
              <OutreachGlass key={l.id} active={form.urgency === l.id} glowColor={l.color}
                onClick={() => { u("urgency", l.id); setTimeout(() => goTo(7), 240); }}
                style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                <span style={{ fontSize: 28, filter: form.urgency === l.id ? `drop-shadow(0 0 10px ${l.glow})` : "none", transition: `filter ${CLICK.duration}` }}>{l.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: form.urgency === l.id ? l.color : FC.textPrimary }}>{l.label}</div>
                  <div style={{ fontSize: 12, color: FC.textDim }}>{l.desc}</div>
                </div>
              </OutreachGlass>
            ))}
          </div>
        </div>
      );

      /* ── Step 7: Alert Message ───────────────────────────── */
      case 7: return (
        <div style={{ textAlign: "center" }}>
          <span style={S.hero}>{urgencyObj?.icon || "\u26A1"}</span>
          <h2 style={S.h2}>{urgencyObj?.label || ""}{" Alert"}</h2>
          <p style={S.sub}>{"What do people need to know?"}</p>
          <div style={{ textAlign: "left" }}>
            <WFInput label="Subject Line" value={form.subject} required onChange={v => u("subject", v)} placeholder="e.g. Tribal Office Closed \u2014 Jan 15" inputRef={inputRef} />
            <WFInput label="Full Message" value={form.message} required onChange={v => u("message", v)} placeholder="All the details people need to know..." multiline />
            <WFInput label="Who is this for?" value={form.audience} onChange={v => u("audience", v)} placeholder="All employees, specific department, tribal members, public..." />
            <div style={S.fieldRow}>
              <WFInput label="Effective Date" value={form.effectiveDate} type="date" onChange={v => u("effectiveDate", v)} />
              <WFInput label="Time" value={form.effectiveTime} type="time" onChange={v => u("effectiveTime", v)} />
            </div>
            <WFInput label="Approved By (if applicable)" value={form.approvedBy} onChange={v => u("approvedBy", v)} placeholder="Director, Council, Department Head..." />
          </div>
          <button style={{ ...S.btn, opacity: step7Valid ? 1 : 0.25, cursor: step7Valid ? "pointer" : "default", borderColor: `${accentColor}35`, color: accentColor, background: `${accentColor}18` }}
            onClick={() => step7Valid && goTo(8)} disabled={!step7Valid}
            onMouseEnter={step7Valid ? e => { e.currentTarget.style.background = `${accentColor}28`; } : undefined}
            onMouseLeave={step7Valid ? e => { e.currentTarget.style.background = `${accentColor}18`; } : undefined}
          >{"Continue"}</button>
        </div>
      );

      /* ── Step 8: Distribution Channels ───────────────────── */
      case 8: return (
        <div style={{ textAlign: "center" }}>
          <span style={S.hero}>{"\uD83D\uDCE1"}</span>
          <h2 style={S.h2}>{"Distribution Channels"}</h2>
          <p style={S.sub}>{"How should this alert go out? Select all that apply."}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {CHANNELS.map(c => (
              <OutreachGlass key={c.id} active={!!form.channels[c.id]} glowColor={accentColor}
                onClick={() => toggleChannel(c.id)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", textAlign: "left" }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: form.channels[c.id] ? FC.textPrimary : FC.textSecondary }}>{c.label}</span>
              </OutreachGlass>
            ))}
          </div>
          <button style={{ ...S.btn, opacity: step8Valid ? 1 : 0.25, cursor: step8Valid ? "pointer" : "default", borderColor: `${accentColor}35`, color: accentColor, background: `${accentColor}18` }}
            onClick={() => step8Valid && goTo(9)} disabled={!step8Valid}
            onMouseEnter={step8Valid ? e => { e.currentTarget.style.background = `${accentColor}28`; } : undefined}
            onMouseLeave={step8Valid ? e => { e.currentTarget.style.background = `${accentColor}18`; } : undefined}
          >{"Review Alert"}</button>
        </div>
      );

      /* ── Step 9: Alert Review ────────────────────────────── */
      case 9: {
        const selectedChannels = Object.entries(form.channels).filter(([, v]) => v).map(([k]) => CHANNELS.find(c => c.id === k));
        const items = [
          ["Requester",   `${form.firstName} ${form.lastName} \u2014 ${form.department}`],
          ["Urgency",     `${urgencyObj?.icon} ${urgencyObj?.label}`],
          ["Subject",     form.subject],
          ["Message",     form.message],
          form.audience     ? ["Audience",    form.audience]                                                                              : null,
          form.effectiveDate ? ["Effective",  `${form.effectiveDate}${form.effectiveTime ? ` at ${form.effectiveTime}` : ""}`]             : null,
          ["Channels",    selectedChannels.map(c => `${c?.icon} ${c?.label}`).join(", ")],
          form.approvedBy ? ["Approved By",  form.approvedBy]                                                                             : null,
          ["Contact",     `${form.email}${form.phone ? ` \u2022 ${form.phone}` : ""}`],
          ["Submitted",   new Date().toLocaleString()],
        ].filter(Boolean);

        return (
          <div style={{ textAlign: "center" }}>
            <span style={S.hero}>{urgencyObj?.icon || "\u26A1"}</span>
            <h2 style={S.h2}>{"Review Alert"}</h2>
            <p style={S.sub}>{"Confirm everything before sending."}</p>
            <GlassCard style={{ marginBottom: 16, padding: "20px 18px" }}>
              {items.map(([k, v], i) => (
                <div key={k + i} style={{ ...S.summaryRow, ...(i === items.length - 1 ? { borderBottom: "none", marginBottom: 0, paddingBottom: 0 } : {}) }}>
                  <div style={S.summaryKey}>{k}</div>
                  <div style={{ ...S.summaryVal, ...(k === "Urgency" ? { color: accentColor, fontWeight: 700 } : {}) }}>{v}</div>
                </div>
              ))}
            </GlassCard>
            <button style={{ ...S.btnSubmit, background: accentColor, boxShadow: `0 4px 24px ${urgencyObj?.glow || WF.accentGlow}` }}
              onClick={handleSubmit} disabled={isSubmitting}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 32px ${urgencyObj?.glow || WF.accentGlow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 24px ${urgencyObj?.glow || WF.accentGlow}`; }}
            >{isSubmitting ? "Submitting..." : "Submit Alert"}</button>
          </div>
        );
      }

      default: return null;
    }
  };

  /* ─── Render ─────────────────────────────────────────────── */

  return (
    <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <PortalBackground />
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 24px 24px", zIndex: 1, position: "relative", overflowY: "auto" }}>
        <div style={{ maxWidth: 460, width: "100%", opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "translateY(0)", transition: "opacity 0.24s ease, transform 0.24s ease" }}>
          {renderStep()}
        </div>
      </div>
      <PageNav
        onBack={step > 0 ? navBack : undefined}
        onHome={() => router.push("/?page=services")}
        onNext={null}
        backLabel="Back"
      />
      <Footer />
    </div>
  );
}
