import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   NHBP COMMUNICATIONS PORTAL — v1 (Fresh Build)
   ─────────────────────────────────────────────────────────
   Stage 1 — The Front Door
   20 departments submit requests through service-specific forms.
   
   INCLUDES:
   · Welcome Page
   · Service Grid (8 services + Check Your Stats)
   · Compact single-page forms w/ Priority + Media Type routing
   · Submission Confirmation Page (post-submit)
   · Check Your Stats — request ID tracker w/ status card
   
   Design System v3 · Glass Morphism · Turquoise→Pink
   Josefin Sans · Modern Traditional Minimal
   ═══════════════════════════════════════════════════════════ */

/* ═══ DS v3 TOKENS ═══ */
const NHBP = {
  turquoise: "#14A9A2", turquoiseLight: "#1bc4bc", turquoiseDark: "#0e8a84",
  turquoiseGlow: "rgba(20,169,162,0.25)", maroon: "#5F0C0E", maroonLight: "#8a1518",
  green: "#094425", greenLight: "#0d6b3a", pink: "#FAC6C7",
  red: "#BA0C2F", redGlow: "rgba(186,12,47,0.15)",
};
const FC = {
  dark: "#0a0e14", darkCard: "#111820",
  turquoise: "#40b5ad", turquoiseLight: "#5fcec6", turquoiseGlow: "rgba(64,181,173,0.3)",
  maroon: "#6b2737", maroonLight: "#8a3a4d",
  gold: "#c9a84c", goldLight: "#e0c76e",
  green: "#2d6a4f", greenLight: "#40916c",
  red: "#ba0c2f", redLight: "#e02040",
  textPrimary: "rgba(255,255,255,0.92)", textSecondary: "rgba(255,255,255,0.55)",
  textDim: "rgba(255,255,255,0.3)", border: "rgba(255,255,255,0.08)",
  glass: "rgba(255,255,255,0.03)",
};
const FONT = "'Montserrat Alternates', 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "'JetBrains Mono', monospace";
const CLICK = {
  hover: { borderColor: "rgba(200,80,130,0.4)", boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 25px rgba(200,80,130,0.18)" },
  duration: "0.3s ease",
};
const GLASS = {
  default: {
    background: FC.glass, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${FC.border}`, borderRadius: 16,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  },
};
const glassPill = {
  padding: "14px 40px", borderRadius: 28,
  backdropFilter: "blur(20px) saturate(1.4) brightness(1.1)",
  WebkitBackdropFilter: "blur(20px) saturate(1.4) brightness(1.1)",
  background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
  fontSize: 14, fontWeight: 500, letterSpacing: "0.06em",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
  cursor: "pointer", fontFamily: FONT,
  transition: `border-color ${CLICK.duration}, box-shadow ${CLICK.duration}`,
};
const inputBase = {
  background: FC.glass, border: `1px solid ${FC.border}`, borderRadius: 10,
  padding: "12px 14px", fontSize: 14, fontFamily: FONT, color: FC.textPrimary,
  outline: "none", caretColor: NHBP.turquoise, width: "100%", boxSizing: "border-box",
  transition: `border-color ${CLICK.duration}`,
};

/* ═══ WORKFLOW STEPS (mirrors CommandCenter-v3) ═══ */
const WORKFLOW_STEPS = ["REQUEST", "TRIAGE", "BRIEF", "ASSIGN", "CREATE", "REVIEW", "REVISE", "APPROVE", "DELIVER", "ARCHIVE"];
const STEP_DESC = [
  "Your request has been received",
  "Reviewing your submission for completeness",
  "Creative brief is being prepared",
  "Assigned to a team member",
  "Your deliverable is being created",
  "Project is under team review",
  "Revisions being applied",
  "Final approval from Director",
  "Deliverable is being distributed",
  "Project complete and archived",
];
const STEP_ICONS = ["📥", "🔍", "📝", "👤", "🎨", "👁️", "🔄", "✅", "📤", "📦"];

/* ═══ PORTAL SERVICES ═══ */
const SERVICES = [
  { id: "flyer", name: "Digital Flyer", icon: "📄", est: "3–5 business days", fields: ["title", "dept", "description", "audience", "dimensions"] },
  { id: "cards", name: "Business Cards", icon: "💼", est: "5–7 business days", fields: ["employeeName", "employeeTitle", "phone", "email", "dept", "qty"] },
  { id: "social", name: "Social Media Post", icon: "📱", est: "1–3 business days", fields: ["title", "dept", "platform", "postDate", "description", "audience"] },
  { id: "photo", name: "Photography", icon: "📷", est: "Scheduled per event", fields: ["title", "dept", "eventDate", "eventTime", "location", "description"] },
  { id: "event", name: "Event Coverage", icon: "🎪", est: "Scheduled per event", fields: ["title", "dept", "eventDate", "eventTime", "location", "description", "audience"] },
  { id: "writing", name: "Writing / Article", icon: "✍️", est: "5–10 business days", fields: ["title", "dept", "description", "audience", "wordCount", "deadline"] },
  { id: "headshot", name: "Headshot Session", icon: "🤳", est: "By availability", fields: ["employeeName", "dept", "preferredDate", "location"] },
  { id: "website", name: "Website Update", icon: "🌐", est: "3–7 business days", fields: ["title", "dept", "pageUrl", "description", "deadline"] },
];

/* ═══ DEPARTMENTS ═══ */
const DEPARTMENTS = [
  "Administration", "Chairman's Office", "Communications", "Cultural", "Education",
  "Enrollment", "Executive Office", "Facilities", "Finance", "Health Services",
  "Housing", "Human Resources", "IT", "Language Dept", "Legal",
  "Natural Resources", "Recreation", "Social Services", "Tribal Council", "Wellness",
];

/* ═══ FIELD LABELS ═══ */
const FIELD_LABELS = {
  title: "Project Title", dept: "Department", description: "Description / Details",
  audience: "Target Audience", dimensions: "Dimensions (e.g. 8.5×11, 11×17)",
  employeeName: "Employee Full Name", employeeTitle: "Job Title",
  phone: "Phone Number", email: "Email Address", qty: "Quantity",
  platform: "Platform (Facebook, Website, Both)", postDate: "Preferred Post Date",
  eventDate: "Event Date", eventTime: "Event Time", location: "Location",
  wordCount: "Approximate Word Count", deadline: "Deadline",
  preferredDate: "Preferred Date", pageUrl: "Page URL to Update",
};

/* ═══ MOCK TRACKING DATA ═══ */
const MOCK_REQUESTS = {
  "NHBP-2026-0412": {
    title: "New Hire — Maria Gonzalez", dept: "Human Resources", requester: "Donna P.",
    service: "Business Cards", priority: "Standard", mediaType: "Print",
    step: 4, assignee: "Tracy", assigneeAvatar: "📋", assigneeRole: "Admin / Coordinator",
    size: "XS", created: "Feb 10, 2026", updated: "Feb 13, 9:15 AM", due: "Feb 14, 2026",
    activity: [
      { time: "Feb 10, 8:47 AM", action: "Request submitted via Portal", icon: "📥", by: "Donna P." },
      { time: "Feb 10, 9:12 AM", action: "Intake verified — all info complete", icon: "✅", by: "Tracy" },
      { time: "Feb 10, 10:30 AM", action: "Creative brief generated", icon: "📝", by: "System" },
      { time: "Feb 10, 11:00 AM", action: "Assigned to Tracy — Business Cards", icon: "👤", by: "System" },
      { time: "Feb 12, 2:15 PM", action: "Design in progress — standard template", icon: "🎨", by: "Tracy" },
    ],
  },
  "NHBP-2026-0398": {
    title: "Tax Workshop Reminder", dept: "Finance", requester: "Linda R.",
    service: "Social Media Post", priority: "Rush", mediaType: "Digital",
    step: 5, assignee: "Audry", assigneeAvatar: "📣", assigneeRole: "Comm. Specialist",
    size: "S", created: "Feb 8, 2026", updated: "Feb 12, 4:30 PM", due: "Feb 12, 2026",
    activity: [
      { time: "Feb 8, 10:00 AM", action: "Request submitted via Portal (Rush)", icon: "📥", by: "Linda R." },
      { time: "Feb 8, 10:05 AM", action: "Rush flag — priority escalated", icon: "🚨", by: "System" },
      { time: "Feb 8, 10:20 AM", action: "Intake verified", icon: "✅", by: "Tracy" },
      { time: "Feb 8, 11:00 AM", action: "Assigned to Audry", icon: "👤", by: "System" },
      { time: "Feb 10, 9:00 AM", action: "Social graphic created", icon: "🎨", by: "Shawn" },
      { time: "Feb 12, 2:00 PM", action: "In review — awaiting Director approval", icon: "👁️", by: "Narciso" },
    ],
  },
  "NHBP-2026-1847": {
    title: "Community Health Fair", dept: "Health Services", requester: "Sandra M.",
    service: "Event Coverage", priority: "Standard", mediaType: "Both",
    step: 4, assignee: "Multi-Team", assigneeAvatar: "👥", assigneeRole: "6 team members",
    size: "M", created: "Feb 3, 2026", updated: "Feb 12, 11:45 AM", due: "Mar 14, 2026",
    activity: [
      { time: "Feb 3, 8:47 AM", action: "Request submitted via Portal", icon: "📥", by: "Sandra M." },
      { time: "Feb 3, 9:30 AM", action: "Intake verified — M-size project", icon: "✅", by: "Tracy" },
      { time: "Feb 3, 10:00 AM", action: "Brief — multi-deliverable event package", icon: "📝", by: "Tracy" },
      { time: "Feb 5, 9:00 AM", action: "Full team assigned (6 members)", icon: "👤", by: "System" },
      { time: "Feb 12, 11:45 AM", action: "Flyer design in progress", icon: "🎨", by: "Shawn" },
    ],
  },
  "NHBP-2026-0388": {
    title: "Council Meeting Recap", dept: "Tribal Council", requester: "Chief Harris",
    service: "Writing / Article", priority: "Urgent", mediaType: "Digital",
    step: 5, assignee: "Cat", assigneeAvatar: "✍️", assigneeRole: "Writer",
    size: "M", created: "Jan 30, 2026", updated: "Feb 13, 8:00 AM", due: "Feb 13, 2026",
    activity: [
      { time: "Jan 30, 10:00 AM", action: "Request submitted via Portal (Urgent)", icon: "📥", by: "Chief Harris" },
      { time: "Jan 30, 10:02 AM", action: "Urgent flag — immediate escalation", icon: "🔥", by: "System" },
      { time: "Jan 30, 10:15 AM", action: "Intake verified", icon: "✅", by: "Tracy" },
      { time: "Jan 30, 11:00 AM", action: "Assigned to Cat — Writing", icon: "👤", by: "System" },
      { time: "Feb 10, 4:00 PM", action: "Draft complete — submitted for review", icon: "🎨", by: "Cat" },
      { time: "Feb 13, 8:00 AM", action: "In Director review", icon: "👁️", by: "Narciso" },
    ],
  },
  "NHBP-2026-0375": {
    title: "Website Banner — March", dept: "Communications", requester: "Narciso",
    service: "Website Update", priority: "Standard", mediaType: "Digital",
    step: 8, assignee: "Shawn", assigneeAvatar: "🎨", assigneeRole: "Graphic Designer",
    size: "S", created: "Jan 28, 2026", updated: "Feb 11, 3:00 PM", due: "Complete",
    activity: [
      { time: "Jan 28, 9:00 AM", action: "Request submitted internally", icon: "📥", by: "Narciso" },
      { time: "Jan 28, 9:05 AM", action: "Intake verified", icon: "✅", by: "Tracy" },
      { time: "Jan 28, 9:30 AM", action: "Assigned to Shawn", icon: "👤", by: "System" },
      { time: "Feb 5, 2:00 PM", action: "Banner design approved", icon: "✅", by: "Narciso" },
      { time: "Feb 11, 3:00 PM", action: "Published to website", icon: "📤", by: "Audry" },
    ],
  },
};


/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function TopShine({ r = 16 }) {
  return <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, borderRadius: `${r}px ${r}px 0 0`, pointerEvents: "none", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />;
}

function GlassCard({ children, style: s = {}, hover = false, onClick }) {
  return (
    <div onClick={onClick} style={{ ...GLASS.default, position: "relative", overflow: "hidden", ...s, transition: `all ${CLICK.duration}` }}
      onMouseEnter={hover ? e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; } : undefined}
      onMouseLeave={hover ? e => { e.currentTarget.style.borderColor = FC.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = GLASS.default.boxShadow; } : undefined}
    ><TopShine /><div style={{ position: "relative" }}>{children}</div></div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 9, fontWeight: 600, color: FC.textDim, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: FONT, marginBottom: 8, marginTop: 14 }}>{children}</div>;
}

function FormField({ label, type = "text", value, onChange, placeholder, required, options, textarea }) {
  if (options) {
    return (
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, fontWeight: 500, fontFamily: FONT, color: FC.textSecondary, letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
          {label}{required && <span style={{ color: FC.redLight }}> *</span>}
        </label>
        <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputBase, appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
          onFocus={e => e.target.style.borderColor = `${NHBP.turquoise}60`}
          onBlur={e => e.target.style.borderColor = FC.border}
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
        <label style={{ fontSize: 11, fontWeight: 500, fontFamily: FONT, color: FC.textSecondary, letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
          {label}{required && <span style={{ color: FC.redLight }}> *</span>}
        </label>
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
          style={{ ...inputBase, resize: "vertical", minHeight: 80 }}
          onFocus={e => e.target.style.borderColor = `${NHBP.turquoise}60`}
          onBlur={e => e.target.style.borderColor = FC.border}
        />
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 500, fontFamily: FONT, color: FC.textSecondary, letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
        {label}{required && <span style={{ color: FC.redLight }}> *</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={inputBase}
        onFocus={e => e.target.style.borderColor = `${NHBP.turquoise}60`}
        onBlur={e => e.target.style.borderColor = FC.border}
      />
    </div>
  );
}

/* ═══ THREE-BUTTON SELECTOR (Priority / Media Type) ═══ */
function TripleToggle({ label, options, value, onChange, colors }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 500, fontFamily: FONT, color: FC.textSecondary, letterSpacing: "0.04em", display: "block", marginBottom: 8 }}>{label}</label>
      <div style={{ display: "flex", gap: 6 }}>
        {options.map((opt, i) => {
          const active = value === opt.value;
          const c = colors?.[i] || NHBP.turquoise;
          return (
            <button key={opt.value} onClick={() => onChange(opt.value)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer",
              background: active ? `${c}18` : FC.glass,
              border: `1px solid ${active ? `${c}50` : FC.border}`,
              color: active ? c : FC.textDim,
              fontSize: 12, fontWeight: active ? 600 : 400, fontFamily: FONT,
              transition: `all ${CLICK.duration}`,
              boxShadow: active ? `0 0 20px ${c}15` : "none",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
              <span style={{ fontSize: 16 }}>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ WORKFLOW MINI TRACK — mirrors CommandCenter-v3 ═══ */
function MiniTrack({ step, showLabels = false }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 2 }}>
        {WORKFLOW_STEPS.map((s, i) => (
          <div key={i} title={`${s}: ${STEP_DESC[i]}`} style={{
            flex: 1, height: showLabels ? 6 : 3, borderRadius: 3,
            background: i < step
              ? `linear-gradient(90deg, ${FC.green}, ${NHBP.pink}80)`
              : i === step
                ? NHBP.turquoise
                : "rgba(255,255,255,0.06)",
            boxShadow: i === step ? `0 0 8px ${NHBP.turquoiseGlow}` : "none",
            transition: `all ${CLICK.duration}`,
            cursor: "default",
          }} />
        ))}
      </div>
      {showLabels && (
        <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
          {WORKFLOW_STEPS.map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: "center", fontSize: 7, fontFamily: FONT, fontWeight: 600,
              letterSpacing: "0.04em",
              color: i < step ? FC.greenLight : i === step ? NHBP.turquoise : FC.textDim,
            }}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ BOTTOM NAV ═══ */
function BottomNav({ onBack, onHome, backLabel = "← Back" }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 24px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "linear-gradient(to top, rgba(10,14,20,0.95), transparent)",
      zIndex: 100,
    }}>
      {onBack ? (
        <button onClick={onBack} style={{ background: "none", border: "none", color: FC.textDim, fontSize: 12, fontFamily: FONT, cursor: "pointer", padding: "8px 12px" }}>{backLabel}</button>
      ) : <div />}
      <button onClick={onHome} style={{
        background: "none", border: "none", fontSize: 24, cursor: "pointer", padding: "4px 8px",
        filter: "drop-shadow(0 0 8px rgba(20,169,162,0.3))", transition: `filter ${CLICK.duration}`,
      }}
        onMouseEnter={e => e.currentTarget.style.filter = "drop-shadow(0 0 16px rgba(200,80,130,0.4))"}
        onMouseLeave={e => e.currentTarget.style.filter = "drop-shadow(0 0 8px rgba(20,169,162,0.3))"}
        title="Back to Services"
      >🐢</button>
      <div style={{ width: 48 }} />
    </div>
  );
}

/* ═══ PORTAL BACKGROUND — Mshiké ═══ */
function PortalBackground({ nightMode }) {
  const o = nightMode ? 0.55 : 0.8; // master opacity
  const cx = 500, cy = 500; // SVG center
  // Medicine wheel ring radii
  const rings = [120, 200, 300, 420];
  // 13 sacred directions (turtle shell sections)
  const directions = Array.from({ length: 13 }, (_, i) => (360 / 13) * i);
  // 8 compass lines (cardinal + intercardinal)
  const compassAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  // Accent dot positions on rings
  const dots = [
    // Outer ring cardinal — turquoise
    { angle: 0, ring: 3, color: NHBP.turquoise, r: 6 },
    { angle: 90, ring: 3, color: NHBP.turquoise, r: 6 },
    { angle: 180, ring: 3, color: NHBP.turquoise, r: 6 },
    { angle: 270, ring: 3, color: NHBP.turquoise, r: 6 },
    // Mid ring intercardinal — dark filled
    { angle: 45, ring: 2, color: "#0d1520", r: 8, stroke: `${NHBP.turquoise}40` },
    { angle: 135, ring: 2, color: "#0d1520", r: 8, stroke: `${NHBP.turquoise}40` },
    { angle: 225, ring: 2, color: "#0d1520", r: 8, stroke: `${NHBP.turquoise}40` },
    { angle: 315, ring: 2, color: "#0d1520", r: 8, stroke: `${NHBP.turquoise}40` },
    // Inner ring — pink accents
    { angle: 135, ring: 1, color: NHBP.pink, r: 5 },
    { angle: 315, ring: 1, color: NHBP.pink, r: 5 },
    // Outer far — pink
    { angle: 225, ring: 3, color: NHBP.pink, r: 5, offset: 60 },
    { angle: 45, ring: 3, color: NHBP.pink, r: 5, offset: 60 },
  ];
  const ptOnCircle = (angle, radius, off = 0) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + (radius + off) * Math.cos(rad), y: cy + (radius + off) * Math.sin(rad) };
  };
  // Chevron arrow at cardinal direction
  const chevron = (angle) => {
    const dist = rings[3] + 50;
    const tip = ptOnCircle(angle, dist + 30);
    const arm1 = ptOnCircle(angle - 12, dist);
    const arm2 = ptOnCircle(angle + 12, dist);
    return `M${arm1.x},${arm1.y} L${tip.x},${tip.y} L${arm2.x},${arm2.y}`;
  };

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {/* Base gradient */}
      <div style={{ position: "absolute", inset: 0, background: nightMode
        ? `linear-gradient(135deg, #050810 0%, #080c14 40%, #060a10 100%)`
        : `linear-gradient(135deg, ${FC.dark} 0%, ${FC.darkCard} 40%, ${FC.dark} 100%)`
      }} />
      {/* Turquoise ambient glow — bottom left */}
      <div style={{ position: "absolute", bottom: "5%", left: "8%", width: "50%", height: "50%", opacity: nightMode ? 0.06 : 0.12, background: `radial-gradient(ellipse, ${NHBP.turquoise}, transparent 70%)`, filter: "blur(90px)" }} />
      {/* Maroon ambient — top right */}
      <div style={{ position: "absolute", top: "8%", right: "5%", width: "40%", height: "40%", opacity: nightMode ? 0.03 : 0.06, background: `radial-gradient(ellipse, ${FC.maroon}, transparent 70%)`, filter: "blur(90px)" }} />

      {/* ═══ COMPASS ROSE / MEDICINE WHEEL — SVG ═══ */}
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet" style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "min(100vw, 100vh)", height: "min(100vw, 100vh)",
        opacity: o, overflow: "visible",
      }}>
        <defs>
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor={NHBP.turquoise} stopOpacity="0.08" />
            <stop offset="100%" stopColor={NHBP.turquoise} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center glow */}
        <circle cx={cx} cy={cy} r={180} fill="url(#centerGlow)" />

        {/* Concentric medicine wheel rings */}
        {rings.map((r, i) => (
          <circle key={`ring-${i}`} cx={cx} cy={cy} r={r} fill="none"
            stroke={NHBP.turquoise} strokeOpacity={i === 0 ? 0.12 : i === 1 ? 0.09 : i === 2 ? 0.07 : 0.05}
            strokeWidth={i === 0 ? 1.5 : 1}
          />
        ))}

        {/* 13 sacred radiating lines — turtle shell */}
        {directions.map((deg, i) => {
          const inner = ptOnCircle(deg, 30);
          const outer = ptOnCircle(deg, rings[3] + 80);
          return <line key={`dir-${i}`} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            stroke={NHBP.turquoise} strokeOpacity={0.06} strokeWidth={0.8} />;
        })}

        {/* 8 compass lines — brighter */}
        {compassAngles.map((deg, i) => {
          const inner = ptOnCircle(deg, 20);
          const outer = ptOnCircle(deg, rings[3] + 120);
          return <line key={`comp-${i}`} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            stroke={NHBP.turquoise} strokeOpacity={i % 2 === 0 ? 0.12 : 0.08} strokeWidth={i % 2 === 0 ? 1.2 : 0.8} />;
        })}

        {/* Horizontal full-width line */}
        <line x1={-200} y1={cy} x2={1200} y2={cy} stroke={NHBP.turquoise} strokeOpacity={0.06} strokeWidth={0.8} />
        {/* Vertical full-height line */}
        <line x1={cx} y1={-200} x2={cx} y2={1200} stroke={NHBP.turquoise} strokeOpacity={0.06} strokeWidth={0.8} />

        {/* Cardinal direction chevrons (N, E, S, W) */}
        {[0, 90, 180, 270].map((angle, i) => (
          <path key={`chev-${i}`} d={chevron(angle)} fill="none"
            stroke={NHBP.turquoise} strokeOpacity={0.18} strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round"
          />
        ))}

        {/* Accent dots on rings */}
        {dots.map((d, i) => {
          const p = ptOnCircle(d.angle, rings[d.ring] + (d.offset || 0));
          return (
            <g key={`dot-${i}`}>
              {d.color === NHBP.pink && (
                <circle cx={p.x} cy={p.y} r={d.r + 4} fill={d.color} fillOpacity={0.08} />
              )}
              <circle cx={p.x} cy={p.y} r={d.r} fill={d.color} fillOpacity={d.stroke ? 1 : 0.7}
                stroke={d.stroke || "none"} strokeWidth={d.stroke ? 1 : 0}
              />
              {d.color === NHBP.turquoise && (
                <circle cx={p.x} cy={p.y} r={d.r + 3} fill="none" stroke={d.color} strokeOpacity={0.2} strokeWidth={0.5} />
              )}
            </g>
          );
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={4} fill={NHBP.turquoise} fillOpacity={0.5} />
        <circle cx={cx} cy={cy} r={8} fill="none" stroke={NHBP.turquoise} strokeOpacity={0.15} strokeWidth={1} />
      </svg>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PAGE: WELCOME
   ═══════════════════════════════════════════════════════════ */
function WelcomePage({ onEnter }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", maxWidth: 520, padding: "0 24px" }}>
        {/* Turtle icon */}
        <div style={{
          width: 80, height: 80, borderRadius: 20, margin: "0 auto 24px",
          background: `linear-gradient(135deg, ${NHBP.turquoise}, ${NHBP.turquoiseDark})`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
          boxShadow: `0 8px 40px ${NHBP.turquoiseGlow}`,
        }}>🐢</div>

        <h1 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 36, color: FC.textPrimary, marginBottom: 4, letterSpacing: "-0.01em" }}>
          <span style={{ color: NHBP.turquoise }}>Communications</span> Portal
        </h1>
        <div style={{ fontSize: 9, color: FC.textDim, letterSpacing: "0.3em", fontWeight: 600, fontFamily: FONT, marginBottom: 8, textTransform: "uppercase" }}>
          Nottawaseppi Huron Band of the Potawatomi
        </div>
        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: FC.textSecondary, lineHeight: 1.6, marginBottom: 36 }}>
          Request services from the Communications Department. Design, photography, writing, web updates, and more — all in one place.
        </p>

        <button onClick={onEnter} style={{
          ...glassPill, padding: "16px 52px", fontSize: 15,
          border: `1px solid rgba(20,169,162,0.2)`, color: `rgba(20,169,162,0.8)`,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(20,169,162,0.2)"; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PAGE: SERVICE GRID — 8 services + Check Your Stats
   ═══════════════════════════════════════════════════════════ */
function ServiceGrid({ onSelect, onTracker }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 560, width: "100%", padding: "40px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🐢</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 26, color: FC.textPrimary, marginBottom: 4 }}>
            What can we <span style={{ color: NHBP.turquoise }}>help you</span> create?
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: FC.textDim }}>Select a service to get started</p>
        </div>

        {/* Service buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {SERVICES.map(svc => (
            <GlassCard key={svc.id} hover onClick={() => onSelect(svc.id)} style={{ cursor: "pointer", padding: "18px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{svc.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: FONT, color: FC.textPrimary }}>{svc.name}</div>
                  <div style={{ fontSize: 10, fontWeight: 400, fontFamily: FONT, color: FC.textDim }}>{svc.est}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: FC.border }} />
          <span style={{ fontSize: 9, fontWeight: 600, fontFamily: FONT, color: FC.textDim, letterSpacing: "0.15em" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: FC.border }} />
        </div>

        {/* Check Your Stats */}
        <GlassCard hover onClick={onTracker} style={{
          cursor: "pointer", padding: "20px 20px",
          border: `1px solid ${FC.gold}20`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(135deg, ${FC.gold}20, ${FC.gold}08)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              border: `1px solid ${FC.gold}30`,
            }}>📊</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: FONT, color: FC.gold }}>Check Your Stats</div>
              <div style={{ fontSize: 11, fontWeight: 400, fontFamily: FONT, color: FC.textSecondary }}>Track the progress of an existing request</div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 16, color: FC.textDim }}>→</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PAGE: SERVICE FORM — Compact single-page per service
   ═══════════════════════════════════════════════════════════ */
function ServiceForm({ serviceId, onSubmit, onBack }) {
  const svc = SERVICES.find(s => s.id === serviceId);
  const [formData, setFormData] = useState({});
  const [priority, setPriority] = useState("standard");
  const [mediaType, setMediaType] = useState("digital");
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    setSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      const id = `NHBP-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      onSubmit({
        id, service: svc.name, serviceIcon: svc.icon, est: svc.est,
        priority, mediaType,
        requester: formData.employeeName || formData.title || "Requester",
        dept: formData.dept || "—",
        title: formData.title || formData.employeeName || svc.name,
        ...formData,
      });
    }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 480, width: "100%", padding: "40px 24px 100px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 36 }}>{svc.icon}</span>
          <h2 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 22, color: FC.textPrimary, marginTop: 8, marginBottom: 4 }}>{svc.name}</h2>
          <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 400, color: FC.textDim }}>Estimated turnaround: {svc.est}</p>
        </div>

        <GlassCard style={{ padding: "22px 18px" }}>
          {/* Routing Flags */}
          <TripleToggle label="Priority" value={priority} onChange={setPriority}
            options={[
              { value: "rush", label: "Rush", icon: "⚡" },
              { value: "standard", label: "Standard", icon: "📋" },
              { value: "low", label: "Low", icon: "📅" },
            ]}
            colors={[FC.gold, NHBP.turquoise, FC.textDim]}
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

          {/* Dynamic fields */}
          {svc.fields.map(f => {
            if (f === "dept") {
              return <FormField key={f} label={FIELD_LABELS[f]} value={formData[f] || ""} onChange={v => set(f, v)} options={DEPARTMENTS} required />;
            }
            if (f === "description") {
              return <FormField key={f} label={FIELD_LABELS[f]} value={formData[f] || ""} onChange={v => set(f, v)} placeholder="Describe what you need..." textarea required />;
            }
            if (f === "platform") {
              return <FormField key={f} label={FIELD_LABELS[f]} value={formData[f] || ""} onChange={v => set(f, v)} options={["Facebook Public", "Facebook Members", "Both Facebook Pages", "Website", "All Platforms"]} required />;
            }
            if (f === "eventDate" || f === "postDate" || f === "preferredDate" || f === "deadline") {
              return <FormField key={f} label={FIELD_LABELS[f]} type="date" value={formData[f] || ""} onChange={v => set(f, v)} required />;
            }
            if (f === "eventTime") {
              return <FormField key={f} label={FIELD_LABELS[f]} type="time" value={formData[f] || ""} onChange={v => set(f, v)} />;
            }
            if (f === "qty") {
              return <FormField key={f} label={FIELD_LABELS[f]} type="number" value={formData[f] || ""} onChange={v => set(f, v)} placeholder="e.g. 250" required />;
            }
            return <FormField key={f} label={FIELD_LABELS[f]} value={formData[f] || ""} onChange={v => set(f, v)} placeholder={FIELD_LABELS[f]} required={f === "title" || f === "employeeName"} />;
          })}

          {/* Requester info */}
          <div style={{ height: 1, background: FC.border, margin: "8px 0 18px" }} />
          <SectionLabel>Your Information</SectionLabel>
          <FormField label="Your Name" value={formData.requesterName || ""} onChange={v => set("requesterName", v)} placeholder="Full name" required />
          <FormField label="Your Email" type="email" value={formData.requesterEmail || ""} onChange={v => set("requesterEmail", v)} placeholder="name@nhbp-nsn.gov" required />
          <FormField label="Your Phone" type="tel" value={formData.requesterPhone || ""} onChange={v => set("requesterPhone", v)} placeholder="(269) 555-0000" />

          {/* Submit */}
          <button onClick={handleSubmit} disabled={submitting} style={{
            ...glassPill, width: "100%", marginTop: 8, padding: "16px",
            border: `1px solid rgba(138,58,77,0.3)`, color: submitting ? FC.textDim : "rgba(138,58,77,0.9)",
            opacity: submitting ? 0.6 : 1,
          }}
            onMouseEnter={!submitting ? e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; } : undefined}
            onMouseLeave={!submitting ? e => { e.currentTarget.style.borderColor = "rgba(138,58,77,0.3)"; e.currentTarget.style.boxShadow = glassPill.boxShadow; } : undefined}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </GlassCard>
      </div>
      <BottomNav onBack={onBack} onHome={onBack} />
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 480, width: "100%", padding: "40px 24px 80px" }}>
        {/* Success indicator */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18, margin: "0 auto 16px",
            background: `linear-gradient(135deg, ${FC.greenLight}30, ${FC.greenLight}10)`,
            border: `2px solid ${FC.greenLight}40`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
            boxShadow: `0 0 40px ${FC.greenLight}20`,
          }}>✅</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 24, color: FC.textPrimary, marginBottom: 4 }}>
            Request <span style={{ color: FC.greenLight }}>Submitted</span>
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: FC.textSecondary }}>
            Your request has been received and is being processed.
          </p>
        </div>

        {/* Confirmation Card */}
        <GlassCard style={{ padding: "22px 18px", marginBottom: 12 }}>
          {/* Request ID — prominent + copyable */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderRadius: 12, marginBottom: 16,
            background: `linear-gradient(135deg, ${NHBP.turquoise}12, ${NHBP.turquoise}04)`,
            border: `1px solid ${NHBP.turquoise}30`,
          }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 600, fontFamily: FONT, color: FC.textDim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>Request ID</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: MONO, color: NHBP.turquoise, letterSpacing: "0.04em" }}>{submission.id}</div>
            </div>
            <button onClick={copyId} style={{
              ...GLASS.default, padding: "8px 14px", cursor: "pointer", borderRadius: 10,
              color: copied ? FC.greenLight : FC.textSecondary, fontSize: 11, fontFamily: FONT, fontWeight: 500,
              border: `1px solid ${copied ? `${FC.greenLight}40` : FC.border}`,
            }}>
              {copied ? "✓ Copied" : "📋 Copy"}
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
          <SectionLabel>Current Status</SectionLabel>
          <div style={{
            padding: "12px 14px", borderRadius: 10, marginBottom: 12,
            background: `${NHBP.turquoise}08`, border: `1px solid ${NHBP.turquoise}20`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>📥</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: FONT, color: NHBP.turquoise }}>Request Received</div>
                <div style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim }}>Step 1 of 10 — Your request is in the queue</div>
              </div>
            </div>
            <MiniTrack step={0} showLabels />
          </div>

          {/* What happens next */}
          <SectionLabel>What Happens Next</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { icon: "🔍", text: "Our team will verify your submission", time: isRush ? "Within 1 hour" : "Within 1 business day" },
              { icon: "👤", text: "A team member will be assigned to your project", time: "After verification" },
              { icon: "📧", text: "You'll receive updates at your provided email", time: "Ongoing" },
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

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={onTracker} style={{
            ...glassPill, flex: 1, padding: "14px", fontSize: 12, textAlign: "center",
            border: `1px solid ${FC.gold}30`, color: FC.gold,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${FC.gold}30`; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
          >
            📊 Check Your Stats
          </button>
          <button onClick={onHome} style={{
            ...glassPill, flex: 1, padding: "14px", fontSize: 12, textAlign: "center",
            border: `1px solid rgba(20,169,162,0.2)`, color: `rgba(20,169,162,0.8)`,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(20,169,162,0.2)"; e.currentTarget.style.boxShadow = glassPill.boxShadow; }}
          >
            🐢 Submit Another
          </button>
        </div>
      </div>
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
      if (found) {
        setResult(found);
        setActiveTab("status");
      } else {
        setError(`No request found for "${clean}". Check your ID and try again.`);
      }
      setSearching(false);
    }, 800);
  };

  const isOverdue = result && result.due !== "Complete" && result.step < 8;
  const isComplete = result && result.step >= 8;
  const isRush = result?.priority === "Rush";
  const isUrgent = result?.priority === "Urgent";
  const pct = result ? Math.round((result.step / (WORKFLOW_STEPS.length - 1)) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 520, width: "100%", padding: "40px 24px 100px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, margin: "0 auto 14px",
            background: `linear-gradient(135deg, ${FC.gold}25, ${FC.gold}08)`,
            border: `1px solid ${FC.gold}35`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            boxShadow: `0 4px 24px ${FC.gold}15`,
          }}>📊</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 24, color: FC.textPrimary, marginBottom: 4 }}>
            Check Your <span style={{ color: FC.gold }}>Stats</span>
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 400, color: FC.textDim }}>
            Enter your Request ID to track progress in real time
          </p>
        </div>

        {/* Search bar */}
        <GlassCard style={{ padding: "18px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={inputId}
              onChange={e => setInputId(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="NHBP-2026-0000"
              style={{ ...inputBase, flex: 1, fontFamily: MONO, fontSize: 15, letterSpacing: "0.06em", textAlign: "center" }}
              onFocus={e => e.target.style.borderColor = `${FC.gold}60`}
              onBlur={e => e.target.style.borderColor = FC.border}
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
            Format: NHBP-0000-0000 · Found on your confirmation email
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
            <div style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim, marginBottom: 6 }}>Try a sample ID:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {Object.keys(MOCK_REQUESTS).map(id => (
                <button key={id} onClick={() => { setInputId(id); setResult(null); setError(""); }}
                  style={{
                    background: FC.glass, border: `1px solid ${FC.border}`, borderRadius: 8,
                    padding: "4px 10px", fontSize: 10, fontFamily: MONO, color: FC.textSecondary,
                    cursor: "pointer", transition: `all ${CLICK.duration}`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${FC.gold}40`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = FC.border}
                >{id}</button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ RESULT CARD ═══ */}
        {result && (
          <div>
            {/* Status Card Header */}
            <GlassCard style={{
              padding: 0, marginBottom: 12,
              border: `1px solid ${isComplete ? `${NHBP.pink}40` : isUrgent ? `${FC.red}40` : isRush ? `${FC.gold}35` : FC.border}`,
            }}>
              {/* Top accent bar */}
              <div style={{
                height: 4, borderRadius: "16px 16px 0 0",
                background: isComplete
                  ? `linear-gradient(90deg, ${FC.greenLight}, ${NHBP.pink})`
                  : `linear-gradient(90deg, ${NHBP.turquoise}, ${NHBP.pink}80)`,
              }} />

              <div style={{ padding: "18px 18px 14px" }}>
                {/* Card DNA */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, fontFamily: MONO, color: FC.textDim, marginBottom: 4 }}>{inputId}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT, color: FC.textPrimary, lineHeight: 1.3, marginBottom: 4 }}>{result.title}</div>
                    <div style={{ fontSize: 11, fontFamily: FONT, color: FC.textDim }}>
                      🏢 {result.dept} · {result.requester}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 600, fontFamily: FONT, padding: "3px 10px", borderRadius: 10,
                      background: isRush ? `${FC.gold}15` : isUrgent ? `${FC.red}15` : `${NHBP.turquoise}15`,
                      color: isRush ? FC.gold : isUrgent ? FC.redLight : NHBP.turquoise,
                      border: `1px solid ${isRush ? `${FC.gold}25` : isUrgent ? `${FC.red}25` : `${NHBP.turquoise}25`}`,
                    }}>
                      {isUrgent ? "🔥 URGENT" : isRush ? "⚡ RUSH" : "📋 STANDARD"}
                    </span>
                    <span style={{ fontSize: 8, fontWeight: 700, fontFamily: FONT, color: FC.textDim, background: FC.glass, padding: "2px 8px", borderRadius: 6 }}>{result.size}</span>
                  </div>
                </div>

                {/* Progress */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                  borderRadius: 12, marginBottom: 14,
                  background: isComplete ? `${FC.greenLight}10` : `${NHBP.turquoise}08`,
                  border: `1px solid ${isComplete ? `${FC.greenLight}25` : `${NHBP.turquoise}20`}`,
                }}>
                  <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                    <svg width={48} height={48} viewBox="0 0 48 48">
                      <circle cx={24} cy={24} r={20} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
                      <circle cx={24} cy={24} r={20} fill="none"
                        stroke={isComplete ? FC.greenLight : NHBP.turquoise}
                        strokeWidth={3} strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
                        transform="rotate(-90 24 24)"
                        style={{ transition: "stroke-dashoffset 0.8s ease" }}
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: FONT, color: isComplete ? FC.greenLight : NHBP.turquoise }}>{pct}%</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 16 }}>{STEP_ICONS[result.step] || "📥"}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, fontFamily: FONT, color: isComplete ? FC.greenLight : NHBP.turquoise }}>
                        {WORKFLOW_STEPS[result.step] || "REQUEST"}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, fontFamily: FONT, color: FC.textSecondary }}>
                      {STEP_DESC[result.step]}
                    </div>
                    <div style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim, marginTop: 2 }}>
                      Step {result.step + 1} of {WORKFLOW_STEPS.length}
                    </div>
                  </div>
                </div>

                {/* Workflow track */}
                <MiniTrack step={result.step} showLabels />
              </div>
            </GlassCard>

            {/* Tabs: Status / Activity / Details */}
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {[
                { id: "status", label: "Status", icon: "📋" },
                { id: "activity", label: "Activity", icon: "📊", count: result.activity?.length },
                { id: "details", label: "Details", icon: "🔖" },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  background: activeTab === t.id ? `${FC.gold}18` : FC.glass,
                  border: `1px solid ${activeTab === t.id ? `${FC.gold}40` : "rgba(255,255,255,0.05)"}`,
                  color: activeTab === t.id ? FC.gold : FC.textSecondary,
                  borderRadius: 10, padding: "8px 16px", cursor: "pointer",
                  fontSize: 12, fontWeight: 500, fontFamily: FONT,
                  display: "flex", alignItems: "center", gap: 6,
                  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  transition: `all ${CLICK.duration}`,
                  boxShadow: activeTab === t.id ? `0 0 20px ${FC.gold}15` : "none",
                }}>
                  <span style={{ fontSize: 11 }}>{t.icon}</span> {t.label}
                  {t.count != null && <span style={{ background: activeTab === t.id ? `${FC.gold}25` : "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 5, fontSize: 9 }}>{t.count}</span>}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <GlassCard style={{ padding: "18px 16px" }}>
              {activeTab === "status" && (
                <div>
                  {/* Assignee */}
                  <SectionLabel>Assigned To</SectionLabel>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: FC.glass, border: `1px solid ${FC.border}`, marginBottom: 14 }}>
                    <span style={{ fontSize: 24 }}>{result.assigneeAvatar}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, fontFamily: FONT, color: FC.textPrimary }}>{result.assignee}</div>
                      <div style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim }}>{result.assigneeRole}</div>
                    </div>
                  </div>

                  {/* Key dates */}
                  <SectionLabel>Timeline</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Submitted", value: result.created, icon: "📥" },
                      { label: "Last Update", value: result.updated, icon: "🔄" },
                      { label: "Due Date", value: result.due, icon: isComplete ? "✅" : "📅", color: isComplete ? FC.greenLight : result.due === "Feb 13, 2026" ? FC.redLight : FC.textSecondary },
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
                  <SectionLabel>Activity Log</SectionLabel>
                  {result.activity.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < result.activity.length - 1 ? `1px solid ${FC.border}` : "none" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 14 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: NHBP.turquoise, boxShadow: `0 0 8px ${NHBP.turquoiseGlow}`, flexShrink: 0 }} />
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
                  <SectionLabel>Request Details</SectionLabel>
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
      <BottomNav onBack={onBack} onHome={onBack} />
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   MAIN PORTAL COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function NHBPPortal() {
  const [page, setPage] = useState("welcome");       // welcome | services | form | confirm | tracker
  const [selectedService, setSelectedService] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [nightMode, setNightMode] = useState(false);
  const [trackerId, setTrackerId] = useState("");

  const goServices = () => { setPage("services"); setSelectedService(null); };
  const goForm = (id) => { setSelectedService(id); setPage("form"); };
  const goTracker = (prefill) => { setTrackerId(prefill || ""); setPage("tracker"); };

  const handleSubmit = (data) => {
    setSubmission(data);
    setPage("confirm");
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: FONT, color: FC.textPrimary, position: "relative", overflow: "hidden" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Josefin+Sans:wght@100;200;300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <PortalBackground nightMode={nightMode} />

      {/* Day/Night toggle */}
      <button onClick={() => setNightMode(!nightMode)} style={{
        position: "fixed", top: 16, right: 16, zIndex: 200,
        background: FC.glass, border: `1px solid ${FC.border}`, borderRadius: 10,
        padding: "6px 12px", cursor: "pointer", fontSize: 14,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        transition: `all ${CLICK.duration}`,
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = CLICK.hover.borderColor}
        onMouseLeave={e => e.currentTarget.style.borderColor = FC.border}
        title={nightMode ? "Switch to Day" : "Switch to Night"}
      >
        {nightMode ? "☀️" : "🌙"}
      </button>

      {/* Pages */}
      {page === "welcome" && <WelcomePage onEnter={goServices} />}
      {page === "services" && <ServiceGrid onSelect={goForm} onTracker={() => goTracker()} />}
      {page === "form" && <ServiceForm serviceId={selectedService} onSubmit={handleSubmit} onBack={goServices} />}
      {page === "confirm" && <ConfirmationPage submission={submission} onHome={goServices} onTracker={() => goTracker(submission?.id)} />}
      {page === "tracker" && <CheckYourStats onBack={goServices} prefillId={trackerId} />}
    </div>
  );
}
