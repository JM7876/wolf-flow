"use client";
/* =================================================================
   WOLF FLOW SOLUTIONS -- Employee Stationery Kit Service
   -----------------------------------------------------------------
   6-step wizard: Enterprise > Items > Reason > Info > Office > Review
   Restyled from NHBP tokens to Wolf Flow design system.
   Created and Authored by Johnathon Moulds (c) 2026
   ================================================================= */
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { WF, FC, FONT, CLICK, GLASS, inputBase } from "../../lib/tokens";
import { GlassCard, TopShine, PortalBackground, PageNav } from "../../lib/components";

/* --- CONSTANTS (inlined from old portal) --- */
const ENTERPRISES = [
  { id: "nhbp", label: "Nottawaseppi Huron\nBand of the Potawatomi", shortLabel: "NHBP", icon: "\uD83D\uDC22", desc: "Main tribal government" },
  { id: "tribal-court", label: "NHBP Tribal Court", shortLabel: "Tribal Court", icon: "\u2696\uFE0F", desc: "Judicial branch" },
  { id: "tribal-police", label: "NHBP Tribal Police", shortLabel: "Tribal Police", icon: "\uD83D\uDEE1\uFE0F", desc: "Law enforcement" },
];

const OFFICE_LOCATIONS = [
  { id: "main-campus", label: "Main Campus", address: "1485 Mno-Bmadsen", city: "Dowagiac", state: "MI", zip: "49047", enterprise: "nhbp" },
  { id: "health", label: "Health Services", address: "1474 Mno-Bmadsen", city: "Dowagiac", state: "MI", zip: "49047", enterprise: "nhbp" },
  { id: "housing", label: "Housing Department", address: "58620 Sink Rd", city: "Dowagiac", state: "MI", zip: "49047", enterprise: "nhbp" },
  { id: "court", label: "Tribal Court", address: "1485 Mno-Bmadsen", city: "Dowagiac", state: "MI", zip: "49047", enterprise: "tribal-court" },
  { id: "police-hq", label: "Police Headquarters", address: "1485 Mno-Bmadsen", city: "Dowagiac", state: "MI", zip: "49047", enterprise: "tribal-police" },
];

const STATIONERY_ITEMS = [
  { id: "business-cards", label: "Business Cards", icon: "\uD83C\uDFB4", desc: "250 cards per order" },
  { id: "name-plate", label: "Name Plate", icon: "\uD83E\uDEA7", desc: "Desk or door plate" },
  { id: "notepad", label: "Personalized Notepad", icon: "\uD83D\uDDD2\uFE0F", desc: "50-sheet branded notepad" },
];

const ORDER_REASONS = [
  { id: "new-hire", label: "New Hire", desc: "First-time order for a new employee" },
  { id: "promotion", label: "Promotion / Title Change", desc: "Updated title or department" },
  { id: "reorder", label: "Reorder / Running Low", desc: "Same info, just need more" },
  { id: "correction", label: "Correction", desc: "Fix a typo or wrong info" },
  { id: "other", label: "Other", desc: "Something else" },
];

/* --- Styles --- */
const labelStyle = { fontSize: 12, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, display: "block", fontFamily: FONT };
const fieldInputStyle = { ...inputBase, caretColor: WF.accent, direction: "ltr", textAlign: "left", unicodeBidi: "plaintext" };

/* --- Business Card Summary Preview --- */
function BusinessCardSummary({ data, location, enterprise }) {
  const loc = OFFICE_LOCATIONS.find(l => l.id === location);
  const ent = ENTERPRISES.find(e => e.id === enterprise);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        display: "inline-block", width: 380, maxWidth: "100%", borderRadius: 14,
        background: "rgba(255,255,255,0.03)", border: `1px solid ${FC.border}`,
        padding: "20px 24px", textAlign: "left",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>{{ nhbp: "\uD83D\uDC22", "tribal-court": "\u2696\uFE0F", "tribal-police": "\uD83D\uDEE1\uFE0F" }[enterprise]}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: FC.textSecondary, fontFamily: FONT }}>{ent?.shortLabel} Business Card</span>
        </div>
        {[
          ["Name", `${data.firstName} ${data.lastName}`],
          ["Title", data.title],
          data.cellPhone && ["Cell", data.cellPhone],
          data.officePhone && ["Phone", data.officePhone],
          data.fax && ["Fax", data.fax],
          data.email && ["Email", data.email],
          loc && ["Office", loc.label],
          loc && ["Address", `${loc.address} | ${loc.city}, ${loc.state} ${loc.zip}`],
        ].filter(Boolean).map(([label, value], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${FC.border}` }}>
            <span style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: FONT }}>{label}</span>
            <span style={{ fontSize: 13, color: FC.textSecondary, fontWeight: 500, textAlign: "right", maxWidth: "65%", fontFamily: FONT }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Name Plate Summary Preview --- */
function NamePlateSummary({ data }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        display: "inline-block", width: 380, maxWidth: "100%", borderRadius: 14,
        background: "rgba(255,255,255,0.03)", border: `1px solid ${FC.border}`,
        padding: "20px 24px", textAlign: "left",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>{"\uD83E\uDEA7"}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: FC.textSecondary, fontFamily: FONT }}>Name Plate</span>
        </div>
        {[
          ["Name", `${data.firstName} ${data.lastName}`],
          ["Title", data.title],
        ].map(([label, value], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${FC.border}` }}>
            <span style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: FONT }}>{label}</span>
            <span style={{ fontSize: 13, color: FC.textSecondary, fontWeight: 500, fontFamily: FONT }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Validation --- */
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

/* =================================================================
   MAIN FORM COMPONENT
   ================================================================= */
export default function StationeryKitPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [fading, setFading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const inputRef = useRef(null);
  const navLock = useRef(false);

  const [form, setForm] = useState({
    enterprise: null, items: [], reason: null,
    firstName: "", lastName: "", title: "", department: "",
    cellPhone: "", officePhone: "", fax: "", email: "",
    officeLocation: null, quantity: "250", notes: "",
  });

  const totalSteps = 6;

  useEffect(() => { if (inputRef.current) setTimeout(() => inputRef.current?.focus(), 400); }, [step]);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const goNext = () => {
    if (navLock.current) return;
    navLock.current = true;
    setDirection(1);
    setFading(true);
    setTimeout(() => {
      setStep(prev => {
        if (prev >= totalSteps - 1) { handleSubmit(); return prev; }
        return prev + 1;
      });
      setFading(false);
      navLock.current = false;
    }, 280);
  };

  const goBack = () => {
    if (navLock.current || step === 0) return;
    navLock.current = true;
    setDirection(-1);
    setFading(true);
    setTimeout(() => {
      setStep(prev => Math.max(0, prev - 1));
      setFading(false);
      navLock.current = false;
    }, 280);
  };

  const handleSubmit = () => {
    setTicketNumber(`WF-SK-${String(Math.floor(Math.random() * 9000) + 1000)}`);
    setSubmitted(true);
  };

  const canAdvance = () => {
    switch (step) {
      case 0: return form.enterprise !== null;
      case 1: return form.items.length > 0;
      case 2: return form.reason !== null;
      case 3: return form.firstName.trim() && form.lastName.trim() && form.title.trim() && validateEmail(form.email);
      case 4: return form.officeLocation !== null;
      case 5: return true;
      default: return true;
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && canAdvance()) { e.preventDefault(); goNext(); } };
  const filteredLocations = OFFICE_LOCATIONS.filter(l => l.enterprise === form.enterprise);

  const slideStyle = {
    width: "100%", maxWidth: 620,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: fading ? 0 : 1,
    transform: fading ? `translateY(${direction * 24}px)` : "translateY(0)",
  };

  /* ========= CONFIRMATION ========= */
  if (submitted) {
    const loc = OFFICE_LOCATIONS.find(l => l.id === form.officeLocation);
    const ent = ENTERPRISES.find(e => e.id === form.enterprise);
    return (
      <div dir="ltr" style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden" }}>
        <PortalBackground />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 24px", position: "relative", zIndex: 1 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", marginBottom: 28,
            background: `linear-gradient(135deg, ${WF.accent}, ${WF.accentDark})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#fff",
            boxShadow: `0 0 50px ${WF.accentGlow}`,
          }}>{"✓"}</div>
          <h1 style={{ fontSize: 32, fontWeight: 300, margin: "0 0 8px", fontFamily: FONT }}>Stationery Kit Submitted</h1>
          <p style={{ fontSize: 14, color: FC.textDim, margin: "0 0 24px", fontFamily: FONT }}>Your order is ready for printing verification</p>
          <GlassCard style={{ padding: "14px 32px", marginBottom: 24 }}>
            <span style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.15em", display: "block", fontFamily: FONT }}>Request</span>
            <span style={{ fontSize: 24, fontWeight: 600, color: WF.accentLight, fontFamily: FONT }}>{ticketNumber}</span>
          </GlassCard>

          {form.items.includes("business-cards") && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10, textAlign: "center", fontFamily: FONT }}>Business Card Preview</p>
              <BusinessCardSummary data={form} location={form.officeLocation} enterprise={form.enterprise} />
            </div>
          )}
          {form.items.includes("name-plate") && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10, textAlign: "center", fontFamily: FONT }}>Name Plate Preview</p>
              <NamePlateSummary data={form} />
            </div>
          )}

          <GlassCard style={{ padding: "20px 28px", width: "100%", maxWidth: 420, textAlign: "left", marginBottom: 20 }}>
            {[["Employee", `${form.firstName} ${form.lastName}`], ["Title", form.title], ["Enterprise", ent?.shortLabel], ["Office", loc?.label], ["Items", form.items.map(i => STATIONERY_ITEMS.find(s => s.id === i)?.label).join(", ")], ["Reason", ORDER_REASONS.find(r => r.id === form.reason)?.label]].map(([label, value], i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${FC.border}` : "none" }}>
                <span style={{ fontSize: 13, color: FC.textDim, fontFamily: FONT }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: FC.textSecondary, textAlign: "right", maxWidth: "60%", fontFamily: FONT }}>{value}</span>
              </div>
            ))}
          </GlassCard>
          <p style={{ fontSize: 13, color: FC.textDim, textAlign: "center", maxWidth: 380, fontFamily: FONT }}>{"Print-ready PDFs will be attached to your request."}<br />{"The admin team will verify and send to printer."}</p>
          <div style={{ marginTop: 24 }}>
            <button onClick={() => router.push("/")} style={{
              ...inputBase, cursor: "pointer", textAlign: "center", fontWeight: 600,
              background: `${WF.accent}15`, border: `1px solid ${WF.accent}40`, color: WF.accentLight,
            }}>{"Back to Services"}</button>
          </div>
        </div>
      </div>
    );
  }

  /* ========= FORM STEPS ========= */
  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div style={slideStyle}>
          <p style={{ fontSize: 12, color: FC.textDim, letterSpacing: "0.2em", marginBottom: 14, fontFamily: FONT }}>{"01 / 0"}{totalSteps}</p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, lineHeight: 1.25, margin: "0 0 8px", color: FC.textPrimary, fontFamily: FONT }}>Which enterprise are you with?</h2>
          <p style={{ fontSize: 14, color: FC.textDim, margin: "0 0 32px", fontFamily: FONT }}>This determines your card template and logo</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 440 }}>
            {ENTERPRISES.map(e => (
              <GlassCard key={e.id} hover onClick={() => { update("enterprise", e.id); update("officeLocation", null); setTimeout(goNext, 400); }}
                style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", border: form.enterprise === e.id ? `1px solid ${WF.accent}60` : undefined }}>
                <span style={{ fontSize: 32 }}>{e.icon}</span>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: FC.textPrimary, display: "block", whiteSpace: "pre-line", lineHeight: 1.3, fontFamily: FONT }}>{e.label}</span>
                  <span style={{ fontSize: 12, color: FC.textDim, fontFamily: FONT }}>{e.desc}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      );

      case 1: return (
        <div style={slideStyle}>
          <p style={{ fontSize: 12, color: FC.textDim, letterSpacing: "0.2em", marginBottom: 14, fontFamily: FONT }}>{"02 / 0"}{totalSteps}</p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, lineHeight: 1.25, margin: "0 0 8px", color: FC.textPrimary, fontFamily: FONT }}>What do you need?</h2>
          <p style={{ fontSize: 14, color: FC.textDim, margin: "0 0 32px", fontFamily: FONT }}>Select all that apply</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 440 }}>
            {STATIONERY_ITEMS.map(item => {
              const sel = form.items.includes(item.id);
              return (
                <GlassCard key={item.id} hover onClick={() => update("items", sel ? form.items.filter(i => i !== item.id) : [...form.items, item.id])}
                  style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", border: sel ? `1px solid ${WF.accent}60` : undefined }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${sel ? WF.accent : FC.border}`,
                    background: sel ? WF.accent : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: `all ${CLICK.duration}`,
                  }}>
                    {sel && <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{"✓"}</span>}
                  </div>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: FC.textPrimary, display: "block", fontFamily: FONT }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: FC.textDim, fontFamily: FONT }}>{item.desc}</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      );

      case 2: return (
        <div style={slideStyle}>
          <p style={{ fontSize: 12, color: FC.textDim, letterSpacing: "0.2em", marginBottom: 14, fontFamily: FONT }}>{"03 / 0"}{totalSteps}</p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, lineHeight: 1.25, margin: "0 0 8px", color: FC.textPrimary, fontFamily: FONT }}>{"What's the reason?"}</h2>
          <p style={{ fontSize: 14, color: FC.textDim, margin: "0 0 32px", fontFamily: FONT }}>Helps us know if this is a first order or reprint</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 440 }}>
            {ORDER_REASONS.map(r => (
              <GlassCard key={r.id} hover onClick={() => { update("reason", r.id); setTimeout(goNext, 400); }}
                style={{ padding: "20px 22px", cursor: "pointer", border: form.reason === r.id ? `1px solid ${WF.accent}60` : undefined }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: FC.textPrimary, display: "block", fontFamily: FONT }}>{r.label}</span>
                <span style={{ fontSize: 12, color: FC.textDim, fontFamily: FONT }}>{r.desc}</span>
              </GlassCard>
            ))}
          </div>
        </div>
      );

      case 3: return (
        <div style={slideStyle}>
          <p style={{ fontSize: 12, color: FC.textDim, letterSpacing: "0.2em", marginBottom: 14, fontFamily: FONT }}>{"04 / 0"}{totalSteps}</p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, lineHeight: 1.25, margin: "0 0 8px", color: FC.textPrimary, fontFamily: FONT }}>Your information</h2>
          <p style={{ fontSize: 14, color: FC.textDim, margin: "0 0 28px", fontFamily: FONT }}>Exactly as it should appear on your stationery</p>
          <div style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>{"First Name *"}</label><input ref={inputRef} type="text" placeholder="First" value={form.firstName} onChange={e => update("firstName", e.target.value)} onKeyDown={handleKeyDown} style={fieldInputStyle} /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>{"Last Name *"}</label><input type="text" placeholder="Last" value={form.lastName} onChange={e => update("lastName", e.target.value)} onKeyDown={handleKeyDown} style={fieldInputStyle} /></div>
            </div>
            <div><label style={labelStyle}>{"Job Title *"}</label><input type="text" placeholder="Director of Communications" value={form.title} onChange={e => update("title", e.target.value)} onKeyDown={handleKeyDown} style={fieldInputStyle} /></div>
            <div><label style={labelStyle}>Department</label><input type="text" placeholder="Communications" value={form.department} onChange={e => update("department", e.target.value)} onKeyDown={handleKeyDown} style={fieldInputStyle} /></div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Cell Phone</label><input type="tel" placeholder="269.000.0000" value={form.cellPhone} onChange={e => update("cellPhone", e.target.value)} onKeyDown={handleKeyDown} style={fieldInputStyle} /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Office Phone</label><input type="tel" placeholder="269.000.0000" value={form.officePhone} onChange={e => update("officePhone", e.target.value)} onKeyDown={handleKeyDown} style={fieldInputStyle} /></div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>{"Email *"}</label><input type="email" placeholder="First.Last@nhbp-nsn.gov" value={form.email} onChange={e => update("email", e.target.value)} onKeyDown={handleKeyDown} style={fieldInputStyle} /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Fax</label><input type="tel" placeholder="269.000.0000" value={form.fax} onChange={e => update("fax", e.target.value)} onKeyDown={handleKeyDown} style={fieldInputStyle} /></div>
            </div>
          </div>
          {(form.firstName || form.lastName || form.title) && (
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12, fontFamily: FONT }}>Live Preview</p>
              {form.items.includes("business-cards") && <div style={{ marginBottom: 16 }}><BusinessCardSummary data={form} location={form.officeLocation} enterprise={form.enterprise} /></div>}
              {form.items.includes("name-plate") && <NamePlateSummary data={form} />}
            </div>
          )}
        </div>
      );

      case 4: return (
        <div style={slideStyle}>
          <p style={{ fontSize: 12, color: FC.textDim, letterSpacing: "0.2em", marginBottom: 14, fontFamily: FONT }}>{"05 / 0"}{totalSteps}</p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, lineHeight: 1.25, margin: "0 0 8px", color: FC.textPrimary, fontFamily: FONT }}>Select your office location</h2>
          <p style={{ fontSize: 14, color: FC.textDim, margin: "0 0 32px", fontFamily: FONT }}>This address appears on the back of your business card</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 440 }}>
            {filteredLocations.map(loc => (
              <GlassCard key={loc.id} hover onClick={() => { update("officeLocation", loc.id); setTimeout(goNext, 400); }}
                style={{ padding: "18px 22px", cursor: "pointer", border: form.officeLocation === loc.id ? `1px solid ${WF.accent}60` : undefined }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: FC.textPrimary, marginBottom: 4, fontFamily: FONT }}>{loc.label}</div>
                <div style={{ fontSize: 12, color: FC.textDim, fontFamily: FONT }}>{loc.address}{" | "}{loc.city}{", "}{loc.state}{" "}{loc.zip}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      );

      case 5: {
        const loc = OFFICE_LOCATIONS.find(l => l.id === form.officeLocation);
        const ent = ENTERPRISES.find(e => e.id === form.enterprise);
        return (
          <div style={slideStyle}>
            <p style={{ fontSize: 12, color: FC.textDim, letterSpacing: "0.2em", marginBottom: 14, fontFamily: FONT }}>{"06 / 0"}{totalSteps}</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, lineHeight: 1.25, margin: "0 0 8px", color: FC.textPrimary, fontFamily: FONT }}>{"Review & Submit"}</h2>
            <p style={{ fontSize: 14, color: FC.textDim, margin: "0 0 28px", fontFamily: FONT }}>Make sure everything looks right</p>
            {form.items.includes("business-cards") && (
              <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10, fontFamily: FONT }}>Business Card</p>
                <BusinessCardSummary data={form} location={form.officeLocation} enterprise={form.enterprise} />
              </div>
            )}
            {form.items.includes("name-plate") && (
              <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p style={{ fontSize: 11, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10, fontFamily: FONT }}>Name Plate</p>
                <NamePlateSummary data={form} />
              </div>
            )}
            <GlassCard style={{ padding: "20px 24px", maxWidth: 440, width: "100%", margin: "0 auto 20px" }}>
              {[
                ["Employee", `${form.firstName} ${form.lastName}`], ["Title", form.title],
                form.department && ["Department", form.department],
                ["Email", form.email],
                form.cellPhone && ["Cell", form.cellPhone],
                form.officePhone && ["Office", form.officePhone],
                form.fax && ["Fax", form.fax],
                ["Enterprise", ent?.shortLabel], ["Location", loc?.label],
                ["Items", form.items.map(i => STATIONERY_ITEMS.find(s => s.id === i)?.label).join(", ")],
                ["Reason", ORDER_REASONS.find(r => r.id === form.reason)?.label],
              ].filter(Boolean).map(([label, value], i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < arr.length - 1 ? `1px solid ${FC.border}` : "none" }}>
                  <span style={{ fontSize: 12, color: FC.textDim, fontFamily: FONT }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: FC.textSecondary, textAlign: "right", maxWidth: "60%", fontFamily: FONT }}>{value}</span>
                </div>
              ))}
            </GlassCard>
            <div style={{ maxWidth: 440, margin: "0 auto" }}>
              <label style={labelStyle}>Special notes (optional)</label>
              <textarea placeholder="Anything else we should know?" value={form.notes} onChange={e => update("notes", e.target.value)} style={{ ...fieldInputStyle, minHeight: 60, resize: "vertical" }} />
            </div>
          </div>
        );
      }
      default: return null;
    }
  };

  /* ========= MAIN RENDER ========= */
  return (
    <div dir="ltr" style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden" }}>
      <PortalBackground />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: FC.textDim, fontSize: 13, cursor: "pointer", fontFamily: FONT, padding: "6px 0" }}>
            {"\u2190 Back to Services"}
          </button>
        </div>
        <div style={{ padding: "12px 24px 16px", borderBottom: `1px solid ${FC.border}`, margin: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{"◎"}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: FC.textSecondary, fontFamily: FONT }}>Employee Stationery Kit</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 3, padding: "16px 24px 0" }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i < step ? `linear-gradient(90deg, ${WF.accent}, ${WF.pink}80)` : i === step ? WF.accent : FC.glass,
              transition: `all ${CLICK.duration}`,
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 24px 24px" }}>
          {renderStep()}
        </div>

        {/* Bottom nav */}
        <PageNav
          onBack={step > 0 ? goBack : undefined}
          onHome={() => router.push("/")}
          onNext={canAdvance() ? goNext : undefined}
          backLabel={"\u2190 Back"}
          nextLabel={step === totalSteps - 1 ? "Submit Order \u2192" : "Next \u2192"}
        />
      </div>
    </div>
  );
}

// Created and Authored by Johnathon Moulds (c) 2026 -- Wolf Flow Solutions | All Rights Reserved
