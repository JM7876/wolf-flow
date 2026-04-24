/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — The Studio Hub
   ─────────────────────────────────────────────────────────
   Sub-service navigation + three single-page forms:
     · Access Digital Archives
     · Photography & Photo Booth Rental
     · Employee Headshots
   Plus: Behind the Camera (Videography — inactive, wired)
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WF, FC, FONT, GLASS, CLICK, glassPill, inputBase } from "../../lib/tokens";
import { GlassCard, FormField, SectionLabel, PageNav, PortalBackground, Footer, useNightMode, SettingsDropdown } from "../../lib/components";
import { DEPARTMENTS } from "../../lib/tokens";
import { supabase } from "../../lib/supabase";

/* ─────────────────────────────────────────────
   SHARED: TICKET GENERATOR
───────────────────────────────────────────── */
const genTicket = (prefix) =>
  `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

/* ─────────────────────────────────────────────
   SHARED: SUPABASE SUBMIT HELPER
   Inserts a row into public.requests using the same shape the rest
   of the portal uses. Returns { ok, ticket, error } where on success
   `ticket` is the server-generated tracking_code (or row uuid as
   fallback) and on failure `ticket` is a client-generated WF code so
   the UI still has something to show, and `error` carries the
   structured Supabase error for the diagnostic banner.
───────────────────────────────────────────── */
async function submitToSupabase({ serviceType, title, description, department, requesterName, requesterEmail, priority, dueDate, metadata, ticketPrefix, userId }) {
  const safeName = requesterName?.trim() || "Anonymous requester";
  const safeEmail = requesterEmail?.trim() || "no-reply@wolfflow.solutions";
  const safeTitle = title?.trim() || `${ticketPrefix} request`;

  const row = {
    service_type: serviceType,
    user_id: userId || null,
    title: safeTitle,
    description: description || null,
    department: department || null,
    requester_name: safeName,
    requester_email: safeEmail,
    priority: priority || "Standard",
    due_date: dueDate || null,
    metadata: metadata || {},
    status: "new",
    workflow_stage: 1,
  };

  const { data, error } = await supabase.from("requests").insert(row).select().single();
  if (error || !data) {
    console.error(`[studio-hub:${ticketPrefix}] submit failed, falling back to local ticket:`, error);
    return {
      ok: false,
      ticket: genTicket(ticketPrefix),
      error: error ? { message: error.message, code: error.code, details: error.details, hint: error.hint } : { message: "Submission failed \u2014 please try again." },
    };
  }
  return {
    ok: true,
    ticket: data.tracking_code || data.id || genTicket(ticketPrefix),
    error: null,
  };
}

async function loadProfileInto(setForm) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from("profiles").select("full_name, email, department").eq("id", user.id).single();
    if (profile) {
      const [first, ...rest] = (profile.full_name || "").split(" ");
      setForm(f => ({
        ...f,
        firstName: f.firstName || first || "",
        lastName: f.lastName || rest.join(" ") || "",
        email: f.email || profile.email || "",
        requesterName: f.requesterName || profile.full_name || "",
        requesterEmail: f.requesterEmail || profile.email || "",
        employeeName: f.employeeName || profile.full_name || "",
        requestedBy: f.requestedBy || profile.full_name || "",
        department: f.department || profile.department || "",
      }));
    }
    return user.id;
  } catch (_e) {
    return null;
  }
}

/* ─────────────────────────────────────────────
   SHARED: TOP SHINE (already in GlassCard but used inline too)
───────────────────────────────────────────── */
function TopShine({ r = 18 }) {
  return (
    <div style={{
      position: "absolute", left: "8%", right: "8%", top: 0, height: "40%",
      borderRadius: `${r}px ${r}px 0 0`, pointerEvents: "none",
      background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)",
    }} />
  );
}

/* ─────────────────────────────────────────────
   SHARED: SECTION WRAPPER
───────────────────────────────────────────── */
function PageWrap({ children }) {
  const { nightMode, toggleNight } = useNightMode();
  return (
    <div style={{ minHeight: "100vh", fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <PortalBackground nightMode={nightMode} />
      <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 600, padding: "40px 24px 100px", flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARED: FIELD INPUT (wraps lib FormField)
───────────────────────────────────────────── */
function Field(props) {
  return <FormField {...props} />;
}

/* ─────────────────────────────────────────────
   SHARED: CONFIRMATION PAGE
───────────────────────────────────────────── */
function ConfirmPage({ icon, title, subtitle, ticket, rows, note, onAnother, onHome, submitError }) {
  const displayTitle = submitError ? "Request saved locally" : title;
  const displaySubtitle = submitError
    ? "We couldn\u2019t reach the server. Your ticket was kept on this device \u2014 please let the Communications team know so they can capture your request manually."
    : subtitle;
  return (
    <PageWrap>
      <div style={{ textAlign: "center", padding: "48px 0 32px" }}>
        <div style={{ fontSize: 28, marginBottom: 20, color: WF.accent }}>{icon}</div>
        <h1 style={{ fontSize: 26, fontWeight: 300, color: FC.textPrimary, marginBottom: 8, fontFamily: FONT }}>{displayTitle}</h1>
        <p style={{ fontSize: 14, color: FC.textSecondary, lineHeight: 1.7, marginBottom: 28 }}>{displaySubtitle}</p>

        {submitError && (
          <div style={{
            display: "inline-block", textAlign: "left", marginBottom: 24,
            padding: "12px 16px", borderRadius: 10,
            background: `${WF.red}10`, border: `1px solid ${WF.red}40`,
            maxWidth: 480,
          }}>
            <div style={{ fontSize: 11, color: WF.red, fontWeight: 600, marginBottom: 6, fontFamily: FONT }}>{"Could not reach the server"}</div>
            {submitError.message && (
              <div style={{ padding: "6px 8px", borderRadius: 6, background: "rgba(0,0,0,0.25)", fontFamily: "monospace", fontSize: 10, color: FC.textSecondary, wordBreak: "break-word" }}>
                {submitError.code ? <div><span style={{ color: FC.textDim }}>{"code: "}</span>{submitError.code}</div> : null}
                <div><span style={{ color: FC.textDim }}>{"message: "}</span>{submitError.message}</div>
                {submitError.details ? <div><span style={{ color: FC.textDim }}>{"details: "}</span>{submitError.details}</div> : null}
                {submitError.hint ? <div><span style={{ color: FC.textDim }}>{"hint: "}</span>{submitError.hint}</div> : null}
              </div>
            )}
          </div>
        )}

        {/* Ticket */}
        <div style={{
          display: "inline-block", background: `linear-gradient(135deg, ${WF.accent}18, ${WF.pink}0D)`,
          border: `1px solid ${WF.accent}40`, borderRadius: 12,
          padding: "10px 24px", marginBottom: 28,
        }}>
          <div style={{ fontSize: 10, color: FC.textDim, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Confirmation #</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: WF.accent, letterSpacing: "0.06em" }}>{ticket}</div>
        </div>

        {/* Summary */}
        <GlassCard style={{ textAlign: "left", marginBottom: 24 }}>
          {rows.map(([k, v], i) => v ? (
            <div key={k + i} style={{ paddingBottom: 12, marginBottom: i < rows.length - 1 ? 12 : 0, borderBottom: i < rows.length - 1 ? `1px solid ${FC.border}` : "none" }}>
              <div style={{ fontSize: 10, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 13, color: FC.textPrimary, lineHeight: 1.5 }}>{v}</div>
            </div>
          ) : null)}
        </GlassCard>

        {note && (
          <p style={{ fontSize: 12, color: FC.textDim, lineHeight: 1.6, marginBottom: 28 }}>{note}</p>
        )}

        {/* Nav */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", paddingBottom: 32 }}>
          <button onClick={onAnother} style={{
            ...glassPill, padding: "12px 28px", fontSize: 13, fontWeight: 500,
            borderColor: `${WF.accent}40`, color: WF.accentLight,
            boxShadow: `0 4px 20px ${WF.accentGlow}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}`; }}
          >Submit Another</button>
          <button onClick={onHome} style={{
            ...glassPill, padding: "12px 28px", fontSize: 13, fontWeight: 600,
            background: `linear-gradient(135deg, ${WF.accent}22, ${WF.pink}12)`,
            borderColor: `${WF.accent}40`, color: WF.accentLight,
            boxShadow: `0 4px 20px ${WF.accentGlow}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}`; }}
          >Back to Studio Hub</button>
        </div>
      </div>
    </PageWrap>
  );
}

/* ═══════════════════════════════════════════
   FORM A1 — ACCESS DIGITAL ARCHIVES
═══════════════════════════════════════════ */
function ArchivesForm({ onHome }) {
  const empty = { employeeName: "", department: "", description: "", dueDate: "", requestedBy: "", email: "", notes: "" };
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [ticket, setTicket] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => { loadProfileInto(setForm).then(id => id && setUserId(id)); }, []);

  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const valid = form.employeeName && form.department && form.description && form.dueDate && form.requestedBy && form.email;

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    const res = await submitToSupabase({
      serviceType: "studio-hub-archives",
      title: `Archives: ${form.description.slice(0, 60) || form.employeeName}`,
      description: form.description,
      department: form.department,
      requesterName: form.requestedBy || form.employeeName,
      requesterEmail: form.email,
      priority: "Standard",
      dueDate: form.dueDate || null,
      ticketPrefix: "ARC",
      userId,
      metadata: {
        wizardVersion: "studio-hub-archives-v1",
        employeeName: form.employeeName,
        department: form.department,
        description: form.description,
        dueDate: form.dueDate,
        requestedBy: form.requestedBy,
        email: form.email,
        notes: form.notes || null,
      },
    });
    setTicket(res.ticket);
    if (!res.ok) setSubmitError(res.error);
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) return (
    <ConfirmPage
      icon={"\u25A1"}
      title="Request Received!"
      subtitle={"Your digital archive request has been logged.\nThe team will locate and prepare your files."}
      ticket={ticket}
      submitError={submitError}
      rows={[
        ["Employee", form.employeeName],
        ["Department", form.department],
        ["Description", form.description],
        ["Due Date", form.dueDate],
        ["Requested By", form.requestedBy],
        ["Email", form.email],
        form.notes ? ["Special Notes", form.notes] : null,
        ["Submitted", new Date().toLocaleString()],
      ].filter(Boolean)}
      note="A team member will follow up with you via email once your files are ready."
      onAnother={() => { setForm(empty); setSubmitted(false); setSubmitError(null); }}
      onHome={onHome}
    />
  );

  return (
    <PageWrap>
      {/* Header */}
      <div style={{ marginBottom: 32, paddingTop: 16, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: FC.textDim, marginBottom: 8, letterSpacing: "0.04em" }}>The Studio Hub / Access Digital Archives</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 22, color: WF.accent }}>{"\u25A1"}</span>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 300, color: FC.textPrimary, fontFamily: FONT }}>Access Digital Archives</h1>
            <p style={{ fontSize: 13, color: FC.textDim }}>Self-service</p>
          </div>
        </div>
        <p style={{ fontSize: 14, color: FC.textSecondary, lineHeight: 1.7 }}>
          Request access to past photos, video files, or archived project assets. Provide as much detail as possible so we can locate your files quickly.
        </p>
      </div>

      {/* Form */}
      <GlassCard style={{ marginBottom: 20 }}>
        <SectionLabel>Employee Information</SectionLabel>
        <Field label="Employee Name" value={form.employeeName} onChange={v => u("employeeName", v)} placeholder="Full name of the employee" required />
        <Field label="Department" value={form.department} onChange={v => u("department", v)} options={DEPARTMENTS} required placeholder="Select department" />
        <Field label="Requested By" value={form.requestedBy} onChange={v => u("requestedBy", v)} placeholder="Your full name (if different)" required />
        <Field label="Employee Email" value={form.email} onChange={v => u("email", v)} type="email" placeholder="your@nhbp-nsn.gov" required />
      </GlassCard>

      <GlassCard style={{ marginBottom: 20 }}>
        <SectionLabel>Request Details</SectionLabel>
        <Field label="Description" value={form.description} onChange={v => u("description", v)} textarea placeholder="Describe the files you need — event name, approximate date, subject matter, file type, etc." required />
        <Field label="Due Date" value={form.dueDate} onChange={v => u("dueDate", v)} type="date" required />
        <Field label="Special Notes" value={form.notes} onChange={v => u("notes", v)} textarea placeholder="Any additional context, file format preferences, or delivery instructions..." />
      </GlassCard>

      {/* Submit */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, padding: "8px 0 12px" }}>
        <button onClick={onHome} style={{
          ...glassPill, padding: "12px 22px", fontSize: 13,
          borderColor: `${WF.accent}40`, color: WF.accentLight,
          boxShadow: `0 4px 20px ${WF.accentGlow}`,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}`; }}
        >Back</button>
        <button onClick={submit} disabled={!valid || submitting} style={{
          ...glassPill, padding: "13px 32px", fontSize: 14, fontWeight: 600,
          background: valid && !submitting ? `linear-gradient(135deg, ${WF.accent}22, ${WF.pink}12)` : "rgba(255,255,255,0.04)",
          borderColor: valid && !submitting ? `${WF.accent}50` : "rgba(255,255,255,0.06)",
          color: valid && !submitting ? WF.accentLight : FC.textDim,
          boxShadow: valid && !submitting ? `0 4px 24px ${WF.accentGlow}` : "none",
          cursor: !valid ? "not-allowed" : submitting ? "wait" : "pointer",
        }}
          onMouseEnter={valid && !submitting ? e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; } : undefined}
          onMouseLeave={valid && !submitting ? e => { e.currentTarget.style.borderColor = `${WF.accent}50`; e.currentTarget.style.boxShadow = `0 4px 24px ${WF.accentGlow}`; } : undefined}
        >
          {submitting ? "Submitting\u2026" : "Submit Request"}
        </button>
      </div>
    </PageWrap>
  );
}

/* ═══════════════════════════════════════════
   FORM A2 — PHOTOGRAPHY & PHOTO BOOTH RENTAL
═══════════════════════════════════════════ */
function PhotographyForm({ onHome }) {
  const empty = { title: "", department: "", eventDate: "", eventTime: "", location: "", description: "", priority: "", requesterName: "", requesterEmail: "" };
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [ticket, setTicket] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => { loadProfileInto(setForm).then(id => id && setUserId(id)); }, []);

  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const valid = form.title && form.department && form.eventDate && form.eventTime && form.location && form.description && form.priority && form.requesterName && form.requesterEmail;

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    const res = await submitToSupabase({
      serviceType: "studio-hub-photography",
      title: `Photography: ${form.title}`,
      description: form.description,
      department: form.department,
      requesterName: form.requesterName,
      requesterEmail: form.requesterEmail,
      priority: form.priority || "Standard",
      dueDate: form.eventDate || null,
      ticketPrefix: "PHO",
      userId,
      metadata: {
        wizardVersion: "studio-hub-photography-v1",
        eventTitle: form.title,
        department: form.department,
        eventDate: form.eventDate,
        eventTime: form.eventTime,
        location: form.location,
        description: form.description,
        priority: form.priority,
        requesterName: form.requesterName,
        requesterEmail: form.requesterEmail,
      },
    });
    setTicket(res.ticket);
    if (!res.ok) setSubmitError(res.error);
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) return (
    <ConfirmPage
      icon={"\u25CE"}
      title="Photography Request Submitted!"
      subtitle={"Your request has been received.\nWe'll confirm availability and follow up shortly."}
      ticket={ticket}
      submitError={submitError}
      rows={[
        ["Event / Session", form.title],
        ["Department", form.department],
        ["Event Date", form.eventDate],
        ["Event Time", form.eventTime],
        ["Location", form.location],
        ["Description", form.description],
        ["Priority", form.priority],
        ["Requested By", form.requesterName],
        ["Contact Email", form.requesterEmail],
        ["Submitted", new Date().toLocaleString()],
      ]}
      note="Rush requests are reviewed within 24 hours. Standard requests within 3 business days."
      onAnother={() => { setForm(empty); setSubmitted(false); setSubmitError(null); }}
      onHome={onHome}
    />
  );

  return (
    <PageWrap>
      {/* Header */}
      <div style={{ marginBottom: 32, paddingTop: 16, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: FC.textDim, marginBottom: 8, letterSpacing: "0.04em" }}>{"The Studio Hub / Photography & Photo Booth"}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 22, color: WF.accent }}>{"\u25CE"}</span>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 300, color: FC.textPrimary, fontFamily: FONT }}>{"Photography & Photo Booth Rental"}</h1>
            <p style={{ fontSize: 13, color: FC.textDim }}>Photo Booth Rental, Event, and Stock</p>
          </div>
        </div>
        <p style={{ fontSize: 14, color: FC.textSecondary, lineHeight: 1.7 }}>
          Request event photography, photo booth rentals, or stock photography sessions. Please provide all event details so we can prepare accordingly.
        </p>
      </div>

      {/* Form */}
      <GlassCard style={{ marginBottom: 20 }}>
        <SectionLabel>{"Event / Session Details"}</SectionLabel>
        <Field label="Event / Session Title" value={form.title} onChange={v => u("title", v)} placeholder='e.g. "Spring Health Fair" or "Housing Dept Team Photos"' required />
        <Field label="Department" value={form.department} onChange={v => u("department", v)} options={DEPARTMENTS} required placeholder="Select department" />
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><Field label="Event Date" value={form.eventDate} onChange={v => u("eventDate", v)} type="date" required /></div>
          <div style={{ flex: 1 }}><Field label="Event Time" value={form.eventTime} onChange={v => u("eventTime", v)} type="time" required /></div>
        </div>
        <Field label="Location" value={form.location} onChange={v => u("location", v)} placeholder="Building name, room, or address" required />
        <Field label="Description" value={form.description} onChange={v => u("description", v)} textarea placeholder="Purpose of the session, expected attendance, specific shots needed, any special instructions..." required />
        <Field
          label="Priority"
          value={form.priority}
          onChange={v => u("priority", v)}
          options={["Rush", "Standard", "Low"]}
          required
          placeholder="Select priority"
        />
      </GlassCard>

      <GlassCard style={{ marginBottom: 20 }}>
        <SectionLabel>Requester Information</SectionLabel>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><Field label="Requester Name" value={form.requesterName} onChange={v => u("requesterName", v)} placeholder="Your full name" required /></div>
          <div style={{ flex: 1 }}><Field label="Requester Email" value={form.requesterEmail} onChange={v => u("requesterEmail", v)} type="email" placeholder="your@nhbp-nsn.gov" required /></div>
        </div>
      </GlassCard>

      {/* Priority note */}
      <GlassCard style={{ marginBottom: 24, padding: "14px 18px" }}>
        <div style={{ fontSize: 12, color: FC.textDim, lineHeight: 1.7 }}>
          <strong style={{ color: FC.textSecondary }}>Priority Guide:</strong>{" Rush = within 3 days · Standard = 1\u20132 weeks · Low = schedule permitting"}
        </div>
      </GlassCard>

      {/* Submit */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, padding: "8px 0 12px" }}>
        <button onClick={onHome} style={{
          ...glassPill, padding: "12px 22px", fontSize: 13,
          borderColor: `${WF.accent}40`, color: WF.accentLight,
          boxShadow: `0 4px 20px ${WF.accentGlow}`,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}`; }}
        >Back</button>
        <button onClick={submit} disabled={!valid || submitting} style={{
          ...glassPill, padding: "13px 32px", fontSize: 14, fontWeight: 600,
          background: valid && !submitting ? `linear-gradient(135deg, ${WF.accent}22, ${WF.pink}12)` : "rgba(255,255,255,0.04)",
          borderColor: valid && !submitting ? `${WF.accent}50` : "rgba(255,255,255,0.06)",
          color: valid && !submitting ? WF.accentLight : FC.textDim,
          boxShadow: valid && !submitting ? `0 4px 24px ${WF.accentGlow}` : "none",
          cursor: !valid ? "not-allowed" : submitting ? "wait" : "pointer",
        }}
          onMouseEnter={valid && !submitting ? e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; } : undefined}
          onMouseLeave={valid && !submitting ? e => { e.currentTarget.style.borderColor = `${WF.accent}50`; e.currentTarget.style.boxShadow = `0 4px 24px ${WF.accentGlow}`; } : undefined}
        >
          {submitting ? "Submitting\u2026" : "Submit Request"}
        </button>
      </div>
    </PageWrap>
  );
}

/* ═══════════════════════════════════════════
   FORM A3 — EMPLOYEE HEADSHOTS
   Bookings: https://outlook.office.com/book/Headshots@nhbp-nsn.gov
   Sessions: Mon/Wed, 9 AM – 1 PM, 30 min
═══════════════════════════════════════════ */
const BOOKINGS_URL = "https://outlook.office.com/book/Headshots@nhbp-nsn.gov";

function HeadshotsForm({ onHome }) {
  const empty = {
    sessionType: "", firstName: "", lastName: "",
    title: "", department: "", email: "", notes: "",
  };
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [ticket, setTicket] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => { loadProfileInto(setForm).then(id => id && setUserId(id)); }, []);

  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const valid = form.sessionType && form.firstName && form.lastName && form.department && form.email;

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const res = await submitToSupabase({
      serviceType: "studio-hub-headshots",
      title: `Headshots: ${fullName} (${form.sessionType})`,
      description: form.notes || `${form.sessionType} headshot session for ${fullName}`,
      department: form.department,
      requesterName: fullName,
      requesterEmail: form.email,
      priority: "Standard",
      ticketPrefix: "HS",
      userId,
      metadata: {
        wizardVersion: "studio-hub-headshots-v1",
        sessionType: form.sessionType,
        firstName: form.firstName,
        lastName: form.lastName,
        title: form.title || null,
        department: form.department,
        email: form.email,
        notes: form.notes || null,
      },
    });
    setTicket(res.ticket);
    if (!res.ok) setSubmitError(res.error);
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) return (
    <ConfirmPage
      icon={"\u25C9"}
      title={"You're Booked!"}
      subtitle={"Your session is confirmed and your info has been submitted.\nCheck your email for your calendar invite."}
      ticket={ticket}
      submitError={submitError}
      rows={[
        ["Session Type", form.sessionType],
        ["Employee", `${form.firstName} ${form.lastName}`],
        form.title ? ["Title", form.title] : null,
        ["Department", form.department],
        ["Contact Email", form.email],
        form.notes ? ["Notes", form.notes] : null,
        ["Submitted", new Date().toLocaleString()],
      ].filter(Boolean)}
      note="A confirmation email has been sent from Microsoft Bookings with your session details."
      onAnother={() => { setForm(empty); setSubmitted(false); setSubmitError(null); }}
      onHome={onHome}
    />
  );

  return (
    <PageWrap>
      {/* Header */}
      <div style={{ paddingTop: 16, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: FC.textDim, marginBottom: 14, letterSpacing: "0.04em" }}>
          {"The Studio Hub / Employee Headshots"}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 22, color: WF.accent }}>{"\u25C9"}</span>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 300, color: FC.textPrimary, fontFamily: FONT }}>Employee Headshots</h1>
            <p style={{ fontSize: 12, color: FC.textDim }}>By appointment</p>
          </div>
        </div>
        <p style={{ fontSize: 14, color: FC.textSecondary, lineHeight: 1.7, marginBottom: 12 }}>
          Get a professional headshot for your employee profile, business card, and tribal communications.
        </p>
        <GlassCard style={{ padding: "10px 16px", marginBottom: 0, textAlign: "left" }}>
          <div style={{ fontSize: 12, color: FC.textDim, lineHeight: 1.6 }}>
            {"Sessions: Mon & Wed · 9 AM – 1 PM · 30 min each"}
          </div>
        </GlassCard>
      </div>

      {/* Employee Info */}
      <GlassCard style={{ marginBottom: 16 }}>
        <SectionLabel>Employee Information</SectionLabel>
        <Field
          label="Session Type"
          value={form.sessionType}
          onChange={v => u("sessionType", v)}
          options={["New Headshot", "Group / Team Shot", "Update / Retake"]}
          required
          placeholder="Select session type"
        />
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><Field label="First Name" value={form.firstName} onChange={v => u("firstName", v)} placeholder="First" required /></div>
          <div style={{ flex: 1 }}><Field label="Last Name" value={form.lastName} onChange={v => u("lastName", v)} placeholder="Last" required /></div>
        </div>
        <Field label="Employee Title / Position" value={form.title} onChange={v => u("title", v)} placeholder="Your job title (optional)" />
        <Field label="Department" value={form.department} onChange={v => u("department", v)} options={DEPARTMENTS} required placeholder="Select department" />
        <Field label="Email" value={form.email} onChange={v => u("email", v)} type="email" placeholder="your@nhbp-nsn.gov" required />
        <Field label="Special Notes" value={form.notes} onChange={v => u("notes", v)} textarea
          placeholder="Wardrobe questions, backdrop preference, group members, glasses/glare concerns, etc." />
      </GlassCard>

      {/* Embedded Bookings Calendar */}
      <GlassCard style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${FC.border}` }}>
          <SectionLabel style={{ marginBottom: 4 }}>Book Your Session</SectionLabel>
          <p style={{ fontSize: 12, color: FC.textDim, lineHeight: 1.6 }}>
            Select an available slot from the live calendar. Your appointment is confirmed the moment you book.
          </p>
        </div>
        <iframe
          src={BOOKINGS_URL}
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="yes"
          style={{ display: "block", border: "none" }}
          title="Book a Headshot Session"
        />
      </GlassCard>

      {/* Submit */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, padding: "8px 0 12px" }}>
        <button onClick={onHome} style={{
          ...glassPill, padding: "12px 22px", fontSize: 13,
          borderColor: `${WF.accent}40`, color: WF.accentLight,
          boxShadow: `0 4px 20px ${WF.accentGlow}`,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}`; }}
        >Back</button>
        <button onClick={submit} disabled={!valid || submitting} style={{
          ...glassPill, padding: "13px 32px", fontSize: 14, fontWeight: 600,
          background: valid && !submitting ? `linear-gradient(135deg, ${WF.accent}22, ${WF.pink}12)` : "rgba(255,255,255,0.04)",
          borderColor: valid && !submitting ? `${WF.accent}50` : "rgba(255,255,255,0.06)",
          color: valid && !submitting ? WF.accentLight : FC.textDim,
          boxShadow: valid && !submitting ? `0 4px 24px ${WF.accentGlow}` : "none",
          cursor: !valid ? "not-allowed" : submitting ? "wait" : "pointer",
        }}
          onMouseEnter={valid && !submitting ? e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; } : undefined}
          onMouseLeave={valid && !submitting ? e => { e.currentTarget.style.borderColor = `${WF.accent}50`; e.currentTarget.style.boxShadow = `0 4px 24px ${WF.accentGlow}`; } : undefined}
        >
          {submitting ? "Submitting\u2026" : "Submit Request"}
        </button>
      </div>
    </PageWrap>
  );
}

/* ═══════════════════════════════════════════
   BEHIND THE LENS — SERVICE PICKER (3 buttons)
═══════════════════════════════════════════ */
function BehindTheLens({ onBack, onSelect }) {
  const services = [
    {
      id: "archives",
      icon: "\u25A1",
      label: "Access Digital Archives",
      subtitle: "Self-service",
      desc: "Request access to past photos, video files, or archived project assets.",
    },
    {
      id: "photography",
      icon: "\u25CE",
      label: "Photography & Photo Booth",
      subtitle: "Photo Booth Rental, Event, and Stock",
      desc: "Book event photography, photo booth rentals, or professional photo sessions.",
    },
    {
      id: "headshots",
      icon: "\u25C9",
      label: "Employee Headshots",
      subtitle: "By appointment · Mon & Wed 9 AM – 1 PM",
      desc: "Get a professional headshot for your employee profile and communications.",
    },
  ];

  return (
    <PageWrap>
      <div style={{ paddingTop: 32, paddingBottom: 40, textAlign: "center" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: FC.textDim, marginBottom: 24, letterSpacing: "0.04em" }}>
          {"The Studio Hub / Behind the Lens"}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 26, fontWeight: 300, color: FC.textPrimary, marginBottom: 6, fontFamily: FONT }}>
          Behind the Lens
        </h1>
        <p style={{ fontSize: 14, color: FC.textSecondary, marginBottom: 36, lineHeight: 1.7 }}>
          {"Photography services \u2014 select what you need below."}
        </p>

        {/* Service Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36, textAlign: "left" }}>
          {services.map(s => (
            <GlassCard key={s.id} hover onClick={() => onSelect(s.id)} style={{ cursor: "pointer", padding: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 24px" }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2, color: WF.accent }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: FC.textPrimary, marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: WF.accent, marginBottom: 6, fontWeight: 500 }}>{s.subtitle}</div>
                  <div style={{ fontSize: 13, color: FC.textSecondary, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
                <span style={{ fontSize: 18, color: FC.textDim, flexShrink: 0, marginTop: 4 }}>{"\u203A"}</span>
              </div>
            </GlassCard>
          ))}
        </div>

        <button onClick={onBack} style={{
          ...glassPill, padding: "12px 24px", fontSize: 13,
          borderColor: `${WF.accent}40`, color: WF.accentLight,
          boxShadow: `0 4px 20px ${WF.accentGlow}`,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}`; }}
        >Back to Studio Hub</button>
      </div>
    </PageWrap>
  );
}

/* ═══════════════════════════════════════════
   BEHIND THE CAMERA — VIDEOGRAPHY (inactive)
═══════════════════════════════════════════ */
function BehindTheCamera({ onBack }) {
  return (
    <PageWrap>
      <div style={{ paddingTop: 32, paddingBottom: 40, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: FC.textDim, marginBottom: 24, letterSpacing: "0.04em" }}>
          {"The Studio Hub / Behind the Camera"}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 300, color: FC.textPrimary, marginBottom: 6, fontFamily: FONT }}>
          Behind the Camera
        </h1>
        <p style={{ fontSize: 14, color: FC.textSecondary, marginBottom: 36, lineHeight: 1.7 }}>
          {"Video & AV services \u2014 coming soon."}
        </p>

        {/* Videography — Inactive */}
        <div style={{
          ...GLASS.default,
          padding: "20px 24px",
          opacity: 0.45,
          cursor: "not-allowed",
          position: "relative",
          overflow: "hidden",
          marginBottom: 14,
          textAlign: "left",
        }}>
          <TopShine />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2, color: FC.textDim }}>{"\u25B7"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: FC.textPrimary }}>Videography</div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "2px 8px", color: FC.textDim }}>Coming Soon</span>
              </div>
              <div style={{ fontSize: 12, color: FC.textDim, marginBottom: 4 }}>Event video, highlight reels, AV support</div>
              <div style={{ fontSize: 13, color: FC.textDim, lineHeight: 1.6 }}>
                Video and AV services are being built out. Check back soon.
              </div>
            </div>
          </div>
        </div>

        <button onClick={onBack} style={{
          ...glassPill, padding: "12px 24px", fontSize: 13, marginTop: 12,
          borderColor: `${WF.accent}40`, color: WF.accentLight,
          boxShadow: `0 4px 20px ${WF.accentGlow}`,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = CLICK.hover.borderColor; e.currentTarget.style.boxShadow = CLICK.hover.boxShadow; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${WF.accent}40`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}`; }}
        >Back to Studio Hub</button>
      </div>
    </PageWrap>
  );
}

/* ═══════════════════════════════════════════
   MAIN — SUB-SERVICE LANDING PAGE
═══════════════════════════════════════════ */
export default function StudioHubPage() {
  const router = useRouter();
  // view: 'landing' | 'lens' | 'camera' | 'archives' | 'photography' | 'headshots'
  const [view, setView] = useState("landing");

  const goHome = () => { setView("landing"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  if (view === "lens")        return <BehindTheLens onBack={goHome} onSelect={setView} />;
  if (view === "camera")      return <BehindTheCamera onBack={goHome} />;
  if (view === "archives")    return <ArchivesForm onHome={() => setView("lens")} />;
  if (view === "photography") return <PhotographyForm onHome={() => setView("lens")} />;
  if (view === "headshots")   return <HeadshotsForm onHome={() => setView("lens")} />;

  /* ── LANDING ── */
  const branches = [
    {
      id: "lens",
      icon: "\u25CE",
      label: "Behind the Lens",
      subtitle: "Photography",
      desc: "Digital archives, photo booth rental, event photography, and employee headshots.",
      active: true,
    },
    {
      id: "camera",
      icon: "\u25B7",
      label: "Behind the Camera",
      subtitle: "Video / AV",
      desc: "Videography, event video coverage, AV support, and highlight reels.",
      active: true,
    },
  ];

  return (
    <PageWrap>
      <div style={{ paddingTop: 40, paddingBottom: 40 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 24, marginBottom: 16, color: WF.accent }}>{"\u25CE"}</div>
          <h1 style={{ fontSize: 26, fontWeight: 300, color: FC.textPrimary, marginBottom: 8, fontFamily: FONT }}>
            The Studio Hub
          </h1>
          <p style={{ fontSize: 15, color: WF.accentLight, fontWeight: 500, marginBottom: 8 }}>
            {"Photography & Video Services"}
          </p>
          <p style={{ fontSize: 14, color: FC.textSecondary, lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
            {"Headshots, photo booth rentals, event photography, digital archives, and video coverage \u2014 all in one place."}
          </p>
        </div>

        {/* Two branch cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {branches.map(b => (
            <GlassCard key={b.id} hover onClick={() => setView(b.id)} style={{ cursor: "pointer", padding: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px 28px" }}>
                <span style={{ fontSize: 22, flexShrink: 0, color: WF.accent }}>{b.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: FC.textPrimary, marginBottom: 4 }}>{b.label}</div>
                  <div style={{ fontSize: 12, color: WF.accent, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 6 }}>{b.subtitle}</div>
                  <div style={{ fontSize: 13, color: FC.textSecondary, lineHeight: 1.6 }}>{b.desc}</div>
                </div>
                <span style={{ fontSize: 22, color: FC.textDim, flexShrink: 0 }}>{"\u203A"}</span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Nav back to services */}
        <PageNav
          onBack={() => router.push("/?page=services")}
          backLabel="Back"
          onHome={() => router.push("/?page=services")}
        />

      </div>
    </PageWrap>
  );
}

// Created and Authored by Johnathon Moulds | Wolf Flow Solutions
