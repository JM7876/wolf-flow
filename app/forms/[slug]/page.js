/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Public Form Render Route
   ─────────────────────────────────────────────────────────
   Route: /forms/[slug]
   Fetches a published form from public.diy_forms by public_slug,
   renders each question type, accepts answers, POSTs to
   public.diy_form_responses. File uploads go to the
   form-uploads Storage bucket under <response-id>/<filename>.

   No auth required for respondents — anyone with the slug can
   submit. RLS policy enforces the form must be published.

   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { WF, FC, FONT, MONO, CLICK, glassPill, inputBase } from "../../lib/tokens";
import { GlassCard, PortalBackground, Footer, useNightMode, SettingsDropdown } from "../../lib/components";
import { supabase } from "../../lib/supabase";

const MAX_FILE_MB = 10;

function labelFor(q, i) {
  return (q.label && q.label.trim()) || `Question ${i + 1}`;
}

function isAnswerFilled(q, value) {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

export default function PublicFormPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const { nightMode, toggleNight } = useNightMode();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [pendingFiles, setPendingFiles] = useState({}); // qid -> File[]
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  /* ─── Load form by slug ─── */
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    (async () => {
      try {
        const { data, error } = await supabase
          .from("diy_forms")
          .select("id, title, schema, public_slug, is_published, created_at")
          .eq("public_slug", slug)
          .eq("is_published", true)
          .maybeSingle();
        if (cancelled) return;
        if (error) {
          setLoadError({ kind: "load", message: error.message, code: error.code, details: error.details, hint: error.hint });
          setForm(null);
        } else if (!data) {
          setLoadError({ kind: "not_found" });
          setForm(null);
        } else {
          setForm(data);
          // seed answers with empty shape per question
          const seed = {};
          for (const q of (data.schema?.questions || [])) {
            if (q.type === "multiple_choice") seed[q.id] = [];
            else seed[q.id] = "";
          }
          setAnswers(seed);
        }
      } catch (e) {
        if (!cancelled) setLoadError({ kind: "load", message: String(e?.message || e) });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const questions = form?.schema?.questions || [];
  const description = form?.schema?.description || "";

  const canSubmit = useMemo(() => {
    if (!form) return false;
    if (submitting) return false;
    for (const q of questions) {
      if (q.required) {
        if (q.type === "file_upload") {
          if (!(pendingFiles[q.id] || []).length) return false;
        } else if (!isAnswerFilled(q, answers[q.id])) {
          return false;
        }
      }
    }
    return true;
  }, [form, questions, answers, pendingFiles, submitting]);

  const setAnswer = (qid, v) => setAnswers((a) => ({ ...a, [qid]: v }));

  const toggleMulti = (qid, option) => {
    setAnswers((a) => {
      const current = Array.isArray(a[qid]) ? a[qid] : [];
      return { ...a, [qid]: current.includes(option) ? current.filter((x) => x !== option) : [...current, option] };
    });
  };

  const onFileChange = (qid, fileList) => {
    const incoming = Array.from(fileList || []);
    const accepted = [];
    for (const f of incoming) {
      if (f.size > MAX_FILE_MB * 1024 * 1024) continue;
      accepted.push(f);
    }
    setPendingFiles((p) => ({ ...p, [qid]: accepted }));
  };

  /* ─── Submit ─── */
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);

    // Build answers payload. For file_upload fields we store { files: [{ name, path, size, type }] }
    // and upload after we know the response id.
    const answersOut = {};
    for (const q of questions) {
      if (q.type === "file_upload") continue; // filled in after upload
      const v = answers[q.id];
      answersOut[q.id] = { type: q.type, label: labelFor(q, 0), value: v };
    }

    const row = {
      form_id: form.id,
      answers: answersOut,
    };

    const { data: resp, error } = await supabase
      .from("diy_form_responses")
      .insert(row)
      .select("id, submitted_at")
      .single();

    if (error || !resp) {
      setSubmitting(false);
      setSubmitError({ message: error?.message || "Submission failed", code: error?.code, details: error?.details, hint: error?.hint });
      return;
    }

    // Upload files, if any, then patch the answers JSONB with their paths.
    const uploadedByQ = {};
    let anyUploadErr = null;
    for (const q of questions) {
      if (q.type !== "file_upload") continue;
      const files = pendingFiles[q.id] || [];
      if (!files.length) { uploadedByQ[q.id] = { type: "file_upload", label: labelFor(q, 0), value: [] }; continue; }
      const uploaded = [];
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${resp.id}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("form-uploads").upload(path, file, { contentType: file.type || undefined, upsert: false });
        if (upErr) { anyUploadErr = upErr; continue; }
        uploaded.push({ name: file.name, path, size: file.size, type: file.type || null });
      }
      uploadedByQ[q.id] = { type: "file_upload", label: labelFor(q, 0), value: uploaded };
    }

    if (Object.keys(uploadedByQ).length > 0) {
      const merged = { ...answersOut, ...uploadedByQ };
      await supabase.from("diy_form_responses").update({ answers: merged }).eq("id", resp.id);
    }

    setSubmitting(false);
    setConfirmation({
      id: resp.id,
      submittedAt: resp.submitted_at,
      uploadWarning: anyUploadErr ? String(anyUploadErr.message || anyUploadErr) : null,
    });
    setSubmitted(true);
  };

  /* ─── Render ─── */
  const BG = () => <PortalBackground nightMode={nightMode} />;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden" }}>
        <BG />
        <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", zIndex: 5, position: "relative" }}>
          <span style={{ fontSize: 12, color: FC.textDim, letterSpacing: "0.15em", textTransform: "uppercase" }}>{"Loading form\u2026"}</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <BG />
        <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", zIndex: 5, position: "relative" }}>
          <GlassCard style={{ padding: "32px 28px", maxWidth: 480, textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 300, margin: "0 0 10px", fontFamily: FONT }}>
              {loadError.kind === "not_found" ? "Form not found" : "Could not load form"}
            </h1>
            <p style={{ fontSize: 13, color: FC.textDim, lineHeight: 1.7, margin: "0 0 20px" }}>
              {loadError.kind === "not_found"
                ? "The form you're looking for doesn't exist or isn't published yet. Check the link and try again."
                : "Something went wrong loading this form."}
            </p>
            {loadError.kind !== "not_found" && loadError.message && (
              <div style={{ padding: "6px 8px", borderRadius: 6, background: "rgba(0,0,0,0.25)", fontFamily: MONO, fontSize: 10, color: FC.textSecondary, wordBreak: "break-word", marginBottom: 20, textAlign: "left" }}>
                {loadError.code ? <div><span style={{ color: FC.textDim }}>{"code: "}</span>{loadError.code}</div> : null}
                <div><span style={{ color: FC.textDim }}>{"message: "}</span>{loadError.message}</div>
                {loadError.details ? <div><span style={{ color: FC.textDim }}>{"details: "}</span>{loadError.details}</div> : null}
                {loadError.hint ? <div><span style={{ color: FC.textDim }}>{"hint: "}</span>{loadError.hint}</div> : null}
              </div>
            )}
            <button onClick={() => router.push("/")} style={{ ...glassPill, padding: "10px 24px", fontSize: 12, color: WF.accentLight, borderColor: `${WF.accent}40` }}>{"Go Home"}</button>
          </GlassCard>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <BG />
        <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", zIndex: 5, position: "relative" }}>
          <GlassCard style={{ padding: "36px 28px", maxWidth: 520, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px", background: `linear-gradient(135deg, ${WF.accent}, ${WF.accentDark || WF.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", boxShadow: `0 0 40px ${WF.accentGlow}` }}>{"\u2713"}</div>
            <h1 style={{ fontSize: 24, fontWeight: 300, margin: "0 0 8px", fontFamily: FONT }}>{"Thanks \u2014 your response was submitted"}</h1>
            <p style={{ fontSize: 13, color: FC.textDim, lineHeight: 1.7, margin: "0 0 20px" }}>{"The form owner will review your submission."}</p>
            {confirmation?.uploadWarning && (
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,170,70,0.08)", border: "1px solid rgba(255,170,70,0.30)", marginBottom: 16, textAlign: "left" }}>
                <div style={{ fontSize: 11, color: "#ffb24a", fontWeight: 600, marginBottom: 4 }}>{"Some files didn't upload"}</div>
                <div style={{ fontSize: 11, color: FC.textSecondary, fontFamily: MONO, wordBreak: "break-word" }}>{confirmation.uploadWarning}</div>
              </div>
            )}
            <button onClick={() => { setSubmitted(false); const seed = {}; for (const q of questions) seed[q.id] = q.type === "multiple_choice" ? [] : ""; setAnswers(seed); setPendingFiles({}); window.scrollTo({ top: 0 }); }} style={{ ...glassPill, padding: "10px 24px", fontSize: 12, color: WF.accentLight, borderColor: `${WF.accent}40`, marginRight: 10 }}>{"Submit Another"}</button>
            <button onClick={() => router.push("/")} style={{ ...glassPill, padding: "10px 24px", fontSize: 12, color: FC.textSecondary, borderColor: FC.border }}>{"Home"}</button>
          </GlassCard>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <BG />
      <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
      <div style={{ flex: 1, padding: "40px 20px 80px", zIndex: 5, position: "relative", maxWidth: 720, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: FC.textDim, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>{"Wolf Flow Form"}</div>
          <h1 style={{ fontSize: 30, fontWeight: 300, margin: "0 0 8px", fontFamily: FONT }}>{form.title}</h1>
          {description && (
            <p style={{ fontSize: 14, color: FC.textSecondary, lineHeight: 1.7, margin: 0 }}>{description}</p>
          )}
        </div>

        {submitError && (
          <div style={{ padding: "12px 14px", borderRadius: 10, marginBottom: 16, background: "rgba(255,70,90,0.08)", border: "1px solid rgba(255,70,90,0.30)" }}>
            <div style={{ fontSize: 11, color: "#ff7a8a", fontWeight: 600, marginBottom: 6, fontFamily: FONT }}>{"Could not submit"}</div>
            <div style={{ padding: "6px 8px", borderRadius: 6, background: "rgba(0,0,0,0.25)", fontFamily: MONO, fontSize: 10, color: FC.textSecondary, wordBreak: "break-word" }}>
              {submitError.code ? <div><span style={{ color: FC.textDim }}>{"code: "}</span>{submitError.code}</div> : null}
              <div><span style={{ color: FC.textDim }}>{"message: "}</span>{submitError.message}</div>
              {submitError.details ? <div><span style={{ color: FC.textDim }}>{"details: "}</span>{submitError.details}</div> : null}
              {submitError.hint ? <div><span style={{ color: FC.textDim }}>{"hint: "}</span>{submitError.hint}</div> : null}
            </div>
          </div>
        )}

        {questions.map((q, i) => {
          const lbl = labelFor(q, i);
          return (
            <GlassCard key={q.id} style={{ padding: "18px 20px", marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: FC.textPrimary, marginBottom: 10, fontFamily: FONT }}>
                {lbl}
                {q.required && <span style={{ color: WF.red || "#ff7a8a", marginLeft: 6 }}>{"*"}</span>}
              </label>

              {q.type === "short_text" && (
                <input type="text" value={answers[q.id] ?? ""} onChange={(e) => setAnswer(q.id, e.target.value)}
                  style={{ ...inputBase, width: "100%", boxSizing: "border-box" }} />
              )}

              {q.type === "long_text" && (
                <textarea value={answers[q.id] ?? ""} onChange={(e) => setAnswer(q.id, e.target.value)}
                  rows={4}
                  style={{ ...inputBase, width: "100%", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6, minHeight: 100 }} />
              )}

              {q.type === "email" && (
                <input type="email" value={answers[q.id] ?? ""} onChange={(e) => setAnswer(q.id, e.target.value)}
                  style={{ ...inputBase, width: "100%", boxSizing: "border-box" }} />
              )}

              {q.type === "number" && (
                <input type="number" value={answers[q.id] ?? ""} onChange={(e) => setAnswer(q.id, e.target.value)}
                  style={{ ...inputBase, width: "100%", boxSizing: "border-box" }} />
              )}

              {q.type === "date" && (
                <input type="date" value={answers[q.id] ?? ""} onChange={(e) => setAnswer(q.id, e.target.value)}
                  style={{ ...inputBase, width: "100%", boxSizing: "border-box" }} />
              )}

              {q.type === "dropdown" && (
                <select value={answers[q.id] ?? ""} onChange={(e) => setAnswer(q.id, e.target.value)}
                  style={{ ...inputBase, width: "100%", boxSizing: "border-box", appearance: "none", cursor: "pointer" }}>
                  <option value="">{"Select\u2026"}</option>
                  {(q.options || []).map((opt, j) => <option key={j} value={opt}>{opt}</option>)}
                </select>
              )}

              {q.type === "single_choice" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(q.options || []).map((opt, j) => (
                    <label key={j} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: FC.textSecondary }}>
                      <input type="radio" name={q.id} value={opt} checked={answers[q.id] === opt} onChange={() => setAnswer(q.id, opt)} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "multiple_choice" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(q.options || []).map((opt, j) => {
                    const sel = Array.isArray(answers[q.id]) && answers[q.id].includes(opt);
                    return (
                      <label key={j} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: FC.textSecondary }}>
                        <input type="checkbox" checked={sel} onChange={() => toggleMulti(q.id, opt)} />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {q.type === "file_upload" && (
                <div>
                  <input type="file" multiple onChange={(e) => onFileChange(q.id, e.target.files)}
                    style={{ fontSize: 12, color: FC.textSecondary, fontFamily: FONT }} />
                  <div style={{ fontSize: 11, color: FC.textDim, marginTop: 6 }}>{`Up to ${MAX_FILE_MB}MB per file`}</div>
                  {(pendingFiles[q.id] || []).length > 0 && (
                    <div style={{ marginTop: 8, fontSize: 11, color: FC.textSecondary }}>
                      {(pendingFiles[q.id] || []).map((f, j) => (
                        <div key={j}>{`\u2022 ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          );
        })}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <button onClick={handleSubmit} disabled={!canSubmit} style={{
            ...glassPill, padding: "14px 34px", fontSize: 14, fontWeight: 600,
            background: canSubmit ? `linear-gradient(135deg, ${WF.accent}28, ${WF.accent}14)` : "rgba(255,255,255,0.04)",
            borderColor: canSubmit ? `${WF.accent}50` : "rgba(255,255,255,0.08)",
            color: canSubmit ? WF.accentLight : FC.textDim,
            boxShadow: canSubmit ? `0 4px 24px ${WF.accentGlow}` : "none",
            cursor: !canSubmit ? "not-allowed" : submitting ? "wait" : "pointer",
          }}>
            {submitting ? "Submitting\u2026" : "Submit"}
          </button>
        </div>

      </div>
      <Footer />
    </div>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
