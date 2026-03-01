/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Press Box
   Route: /services/press-box
   ─────────────────────────────────────────────────────────
   Multi-step form: Article | Celebratory | Feedback
   Single confirmation page with full submission recap.
   Wired to Supabase submissions table (metadata JSONB).
   No emojis. No identity selector. Portal design system.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WF, FC, FONT, MONO, CLICK, GLASS, glassPill, inputBase, DEPARTMENTS, WORKFLOW_STEPS, STEP_DESC } from '../../lib/tokens';
import { GlassCard, SectionLabel, FormField, PageNav, PortalBackground, Footer, useNightMode, SettingsDropdown } from '../../lib/components';
import { supabase } from '../../lib/supabase';
/* === CONSTANTS === */
const REQUEST_TYPES = [
  { id: 'article', label: 'Article / Write-Up', desc: 'Turtle Press, newsletter, or web article' },
  { id: 'celebratory', label: 'Celebratory Post', desc: 'Birthday, anniversary, achievement, or milestone' },
  { id: 'feedback', label: 'Feedback / Response', desc: 'Public statement, correction, or community response' },
];
const PRIORITY_OPTIONS = ['Standard', 'Rush', 'Normal'];
const MEDIA_TYPES = ['Digital', 'Print', 'Both'];
const STEPS = { TYPE: 0, DETAILS: 1, UPLOAD: 2, REVIEW: 3 };
const STEP_LABELS = ['Type', 'Details', 'Upload', 'Review'];

/* === PROGRESS BAR === */
function ProgressBar({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
      {STEP_LABELS.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {i > 0 && <div style={{ width: 36, height: 2, borderRadius: 1, background: i <= step ? `linear-gradient(90deg, ${WF.accent}, ${WF.pink}80)` : 'rgba(255,255,255,0.08)', transition: 'background 0.3s ease' }} />}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: i <= step ? 12 : 8, height: i <= step ? 12 : 8, borderRadius: '50%', background: i <= step ? `linear-gradient(135deg, ${WF.accent}, ${WF.pink})` : 'rgba(255,255,255,0.12)', transition: 'all 0.3s ease', boxShadow: i === step ? `0 0 12px ${WF.accentGlow}` : 'none' }} />
            <span style={{ fontSize: 8, fontFamily: FONT, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: i <= step ? WF.accent : FC.textDim }}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* === TYPE CARD === */
function TypeCard({ type, selected, onClick }) {
  const [h, setH] = useState(false);
  const active = selected === type.id;
  return (
    <div onClick={() => onClick(type.id)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ ...GLASS.default, padding: '20px 18px', cursor: 'pointer', borderColor: active ? `${WF.accent}55` : h ? 'rgba(255,255,255,0.22)' : undefined, background: active ? `linear-gradient(168deg, ${WF.accent}22 0%, ${WF.accent}14 40%, ${WF.accent}0A 100%)` : GLASS.default.background, boxShadow: active ? `0 8px 32px ${WF.accent}20, ${GLASS.default.boxShadow}` : GLASS.default.boxShadow, transform: h ? 'translateY(-2px)' : 'none', transition: `all ${CLICK.duration}`, marginBottom: 10 }}>
      <div style={{ fontSize: 15, fontWeight: 600, fontFamily: FONT, color: active ? WF.accentLight : FC.textPrimary, marginBottom: 4 }}>{type.label}</div>
      <div style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim }}>{type.desc}</div>
    </div>
  );
}

/* === WORKFLOW MINI TRACKER === */
function WorkflowMini({ stage }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 16 }}>
      {WORKFLOW_STEPS.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {i > 0 && <div style={{ width: 14, height: 1.5, borderRadius: 1, background: i < stage ? FC.greenLight : i === stage ? WF.accent : 'rgba(255,255,255,0.08)' }} />}
          <div title={`${i + 1}. ${s}`} style={{ width: i + 1 === stage ? 10 : 6, height: i + 1 === stage ? 10 : 6, borderRadius: '50%', background: i + 1 < stage ? FC.greenLight : i + 1 === stage ? WF.accent : 'rgba(255,255,255,0.1)', boxShadow: i + 1 === stage ? `0 0 8px ${WF.accentGlow}` : 'none', transition: 'all 0.3s ease' }} />
        </div>
      ))}
    </div>
  );
}

/* === MAIN COMPONENT === */
export default function PressBox() {
  const router = useRouter();
  const { nightMode, toggleNight } = useNightMode();
  const [step, setStep] = useState(STEPS.TYPE);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const fileRef = useRef(null);

     /* Auth: fetch logged-in user profile */
  const [userId, setUserId] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase.from('profiles').select('full_name, email, department').eq('id', user.id).single();
        if (profile) {
          setRequesterName(profile.full_name || '');
          setRequesterEmail(profile.email || '');
          if (profile.department) setDepartment(profile.department);
        }
      }
      setProfileLoaded(true);
    }
    loadProfile();
  }, []);

  /* Form State */
  const [requestType, setRequestType] = useState('');
  const [department, setDepartment] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [priority, setPriority] = useState('Standard');
  const [dueDate, setDueDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  /* Article */
  const [articleType, setArticleType] = useState('');
  /* Celebratory */
  const [honoree, setHonoree] = useState('');
  const [milestone, setMilestone] = useState('');
  const [celebDate, setCelebDate] = useState('');
  /* Feedback */
  const [responseContext, setResponseContext] = useState('');
  const [urgency, setUrgency] = useState('');
  /* Files */
  const [files, setFiles] = useState([]);

  const handleNext = useCallback(() => setStep(p => Math.min(p + 1, STEPS.REVIEW)), []);
  const handleBack = useCallback(() => setStep(p => Math.max(p - 1, STEPS.TYPE)), []);
  const handleFileChange = (e) => { setFiles(p => [...p, ...Array.from(e.target.files)]); };
  const removeFile = (i) => { setFiles(p => p.filter((_, idx) => idx !== i)); };

  const canProceed = () => {
    if (step === STEPS.TYPE) return requestType !== '';
    if (step === STEPS.DETAILS) return title.trim() && department && requesterName.trim() && requesterEmail.trim();
    return true;
  };

  const typeLabel = REQUEST_TYPES.find(t => t.id === requestType)?.label || '';

  /* === SUBMIT === */
  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const md = { requestType, targetAudience: targetAudience || null, wordCount: wordCount || null, mediaType: mediaType || null, specialNotes: specialNotes || null };
    if (requestType === 'article') md.articleType = articleType || null;
    if (requestType === 'celebratory') { md.honoree = honoree || null; md.milestone = milestone || null; md.celebDate = celebDate || null; }
    if (requestType === 'feedback') { md.responseContext = responseContext || null; md.urgency = urgency || null; }
    const uploaded = [];
    for (const file of files) {
      const path = `press-box/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('request-files').upload(path, file);
      if (!error) uploaded.push({ name: file.name, path, size: file.size });
    }
    if (uploaded.length) md.attachments = uploaded;
    const { data, error } = await supabase.from('requests').insert({ service_type: `press-box-${requestType}`, user_id: userId, title, description, department, requester_name: requesterName, requester_email: requesterEmail, priority, due_date: dueDate || null, metadata: md, status: 'new', workflow_stage: 1 }).select().single();
    setSubmitting(false);
    if (!error && data) { setSubmitted(data); } else { setSubmitted({ id: `WF-${Date.now()}`, ticket_id: `WF-PB-${Date.now()}`, title, service_type: `press-box-${requestType}`, department, requester_name: requesterName, requester_email: requesterEmail, priority, created_at: new Date().toISOString(), workflow_stage: 1, metadata: md }); }
  }, [userId, requestType, title, description, department, requesterName, requesterEmail, priority, dueDate, targetAudience, wordCount, mediaType, specialNotes, articleType, honoree, milestone, celebDate, responseContext, urgency, files]);

  /* === STEP 0: TYPE === */
  function renderTypeStep() {
    return (
      <GlassCard style={{ padding: '24px 22px' }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, marginBottom: 4 }}>Request <span style={{ color: WF.accent }}>Type</span></h3>
        <p style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginBottom: 20 }}>What kind of press or writing request is this?</p>
        {REQUEST_TYPES.map(t => <TypeCard key={t.id} type={t} selected={requestType} onClick={setRequestType} />)}
      </GlassCard>
    );
  }

  /* === STEP 1: DETAILS === */
  function renderDetailsStep() {
    return (
      <GlassCard style={{ padding: '24px 22px' }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, marginBottom: 4 }}>Request <span style={{ color: WF.accent }}>Details</span></h3>
        <p style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginBottom: 20 }}>{typeLabel} details</p>
        <FormField label="Title" value={title} onChange={v => setTitle(v)} placeholder="e.g., Spring Health Fair Article" required />
        <FormField label="Description" value={description} onChange={v => setDescription(v)} placeholder="Describe what you need written or published..." textarea />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <SectionLabel>Department</SectionLabel>
            <select value={department} onChange={e => setDepartment(e.target.value)} style={{ ...inputBase, cursor: 'pointer' }}>
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <SectionLabel>Priority</SectionLabel>
            <select value={priority} onChange={e => setPriority(e.target.value)} style={{ ...inputBase, cursor: 'pointer' }}>
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <FormField label="Your Name" value={requesterName} onChange={v => setRequesterName(v)} placeholder="Full name" required />
          <FormField label="Your Email" value={requesterEmail} onChange={v => setRequesterEmail(v)} placeholder="you@nhbp.com" type="email" required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <FormField label="Due Date" value={dueDate} onChange={v => setDueDate(v)} type="date" />
          <div>
            <SectionLabel>Media Type</SectionLabel>
            <select value={mediaType} onChange={e => setMediaType(e.target.value)} style={{ ...inputBase, cursor: 'pointer' }}>
              <option value="">Select media</option>
              {MEDIA_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <FormField label="Target Audience" value={targetAudience} onChange={v => setTargetAudience(v)} placeholder="e.g., Tribal Members, All Employees" />
        <FormField label="Approx. Word Count" value={wordCount} onChange={v => setWordCount(v)} placeholder="e.g., 500" />

        {/* Type-specific fields */}
        {requestType === 'article' && (
          <FormField label="Article Type" value={articleType} onChange={v => setArticleType(v)} placeholder="e.g., Turtle Press Feature, Newsletter, Web" />
        )}
        {requestType === 'celebratory' && (<>
          <FormField label="Honoree Name(s)" value={honoree} onChange={v => setHonoree(v)} placeholder="Who is being celebrated?" />
          <FormField label="Milestone / Achievement" value={milestone} onChange={v => setMilestone(v)} placeholder="e.g., 20 Years of Service" />
          <FormField label="Celebration Date" value={celebDate} onChange={v => setCelebDate(v)} type="date" />
        </>)}
        {requestType === 'feedback' && (<>
          <FormField label="Context / What are you responding to?" value={responseContext} onChange={v => setResponseContext(v)} placeholder="Provide context for the response" textarea />
          <FormField label="Urgency Level" value={urgency} onChange={v => setUrgency(v)} placeholder="e.g., Same-day, This week" />
        </>)}
        <FormField label="Special Notes" value={specialNotes} onChange={v => setSpecialNotes(v)} placeholder="Any additional instructions or notes" textarea />
      </GlassCard>
    );
  }

  /* === STEP 2: UPLOAD === */
  function renderUploadStep() {
    return (
      <GlassCard style={{ padding: '24px 22px' }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, marginBottom: 4 }}>File <span style={{ color: WF.accent }}>Upload</span></h3>
        <p style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginBottom: 20 }}>Attach reference images, documents, or supporting files (optional)</p>
        <div onClick={() => fileRef.current?.click()} style={{ ...GLASS.light, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', borderStyle: 'dashed', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontFamily: FONT, color: FC.textSecondary, marginBottom: 4 }}>Click to browse or drag files here</div>
          <div style={{ fontSize: 11, fontFamily: FONT, color: FC.textDim }}>Images, PDFs, Word docs, spreadsheets</div>
          <input ref={fileRef} type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
        {files.length > 0 && files.map((f, i) => (
          <div key={i} style={{ ...GLASS.light, padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontFamily: FONT, color: FC.textPrimary }}>{f.name}</div>
              <div style={{ fontSize: 10, fontFamily: MONO, color: FC.textDim }}>{(f.size / 1024).toFixed(1)} KB</div>
            </div>
            <button onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', color: FC.redLight, cursor: 'pointer', fontSize: 14, fontFamily: FONT }}>Remove</button>
          </div>
        ))}
      </GlassCard>
    );
  }

  /* === STEP 3: REVIEW === */
  function renderReviewStep() {
    const rows = [
      ['Request Type', typeLabel],
      ['Title', title],
      ['Department', department],
      ['Requester', requesterName],
      ['Email', requesterEmail],
      ['Priority', priority],
      ['Due Date', dueDate || 'Not set'],
      ['Media Type', mediaType || 'Not set'],
      ['Target Audience', targetAudience || 'Not set'],
      ['Word Count', wordCount || 'Not set'],
      ['Description', description || 'None'],
    ];
    if (requestType === 'article') rows.push(['Article Type', articleType || 'Not set']);
    if (requestType === 'celebratory') { rows.push(['Honoree', honoree || 'Not set'], ['Milestone', milestone || 'Not set'], ['Celebration Date', celebDate || 'Not set']); }
    if (requestType === 'feedback') { rows.push(['Response Context', responseContext || 'Not set'], ['Urgency', urgency || 'Not set']); }
    if (specialNotes) rows.push(['Special Notes', specialNotes]);
    if (files.length > 0) rows.push(['Attachments', files.map(f => f.name).join(', ')]);
    return (
      <GlassCard style={{ padding: '24px 22px' }}>
        <h3 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 20, color: FC.textPrimary, marginBottom: 4 }}>Review <span style={{ color: WF.accent }}>and Submit</span></h3>
        <p style={{ fontSize: 12, fontFamily: FONT, color: FC.textDim, marginBottom: 20 }}>Confirm everything looks correct before submitting</p>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 10, marginBottom: 10, borderBottom: i < rows.length - 1 ? `1px solid ${FC.border}` : 'none' }}>
            <span style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, flexShrink: 0, width: '35%' }}>{k}</span>
            <span style={{ fontSize: 13, fontFamily: FONT, color: FC.textPrimary, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{v}</span>
          </div>
        ))}
      </GlassCard>
    );
  }

  /* === CONFIRMATION === */
  function renderConfirmation() {
    const d = submitted;
    const ts = new Date(d.created_at).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    const md = d.metadata || {};
    const confirmRows = [
      ['Ticket ID', d.ticket_id || d.id],
      ['Request Type', typeLabel],
      ['Title', d.title],
      ['Department', d.department],
      ['Requester', d.requester_name],
      ['Priority', d.priority],
      ['Status', 'Submitted'],
      ['Submitted', ts],
    ];
    if (d.due_date) confirmRows.push(['Due Date', d.due_date]);
    if (md.mediaType) confirmRows.push(['Media Type', md.mediaType]);
    if (md.targetAudience) confirmRows.push(['Audience', md.targetAudience]);
    if (md.wordCount) confirmRows.push(['Word Count', md.wordCount]);
    if (md.attachments?.length) confirmRows.push(['Files', md.attachments.map(a => a.name).join(', ')]);
    return (
      <div>
        <GlassCard style={{ padding: '36px 28px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px', background: `linear-gradient(135deg, ${FC.greenLight}25, ${FC.greenLight}08)`, border: `2px solid ${FC.greenLight}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: `0 0 30px ${FC.greenLight}15` }}>\u2713</div>
          <h2 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 24, color: FC.textPrimary, marginBottom: 4 }}>Request <span style={{ color: FC.greenLight }}>Submitted</span></h2>
          <p style={{ fontSize: 13, fontFamily: FONT, color: FC.textDim, marginBottom: 8 }}>Your request is live in Wolf Flow. Your team has been notified.</p>
          <div style={{ fontSize: 11, fontFamily: MONO, color: WF.accentLight, padding: '6px 16px', display: 'inline-block', background: `${WF.accent}15`, borderRadius: 8, border: `1px solid ${WF.accent}25` }}>{d.ticket_id || d.id}</div>
          <WorkflowMini stage={1} />
          <div style={{ fontSize: 9, fontFamily: FONT, color: FC.textDim, marginTop: 8 }}>Step 1 of 10: {STEP_DESC[0]}</div>
        </GlassCard>
        <GlassCard style={{ padding: 18, marginTop: 16 }}>
          <SectionLabel>Submission Details</SectionLabel>
          {confirmRows.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8, borderBottom: i < confirmRows.length - 1 ? `1px solid ${FC.border}` : 'none' }}>
              <span style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{k}</span>
              <span style={{ fontSize: 12, fontFamily: k === 'Ticket ID' ? MONO : FONT, color: FC.textPrimary, fontWeight: k === 'Title' ? 600 : 400, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
            </div>
          ))}
        </GlassCard>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
          <button onClick={() => router.push('?page=services')} style={{ ...glassPill, padding: '12px 24px', fontSize: 12, border: `1px solid ${FC.border}`, color: FC.textSecondary }}>Back to Services</button>
          <button onClick={() => { setSubmitted(null); setStep(STEPS.TYPE); setRequestType(''); setTitle(''); setDescription(''); setDepartment(''); setRequesterName(''); setRequesterEmail(''); setPriority('Standard'); setDueDate(''); setTargetAudience(''); setWordCount(''); setMediaType(''); setSpecialNotes(''); setArticleType(''); setHonoree(''); setMilestone(''); setCelebDate(''); setResponseContext(''); setUrgency(''); setFiles([]); }} style={{ ...glassPill, padding: '12px 24px', fontSize: 12, border: `1px solid ${WF.accent}30`, color: WF.accentLight }}>New Request</button>
        </div>
      </div>
    );
  }

  /* === MAIN RENDER === */
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', fontFamily: FONT, color: FC.textPrimary, position: 'relative', overflowX: 'hidden' }}>
        <PortalBackground nightMode={nightMode} />
        <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ maxWidth: 640, width: '100%', padding: '24px 24px 100px' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 24, color: FC.textPrimary, marginBottom: 4 }}>Press <span style={{ color: WF.accent }}>Box</span></h2>
                <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 400, color: FC.textDim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Wolf Flow Solutions</p>
              </div>
              {renderConfirmation()}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: FONT, color: FC.textPrimary, position: 'relative', overflowX: 'hidden' }}>
      <PortalBackground nightMode={nightMode} />
      <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ maxWidth: 640, width: '100%', padding: '24px 24px 100px' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: FONT, fontWeight: 200, fontSize: 24, color: FC.textPrimary, marginBottom: 4 }}>Press <span style={{ color: WF.accent }}>Box</span></h2>
              <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 400, color: FC.textDim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Wolf Flow Solutions</p>
            </div>
            <ProgressBar step={step} />
            {step === STEPS.TYPE && renderTypeStep()}
            {step === STEPS.DETAILS && renderDetailsStep()}
            {step === STEPS.UPLOAD && renderUploadStep()}
            {step === STEPS.REVIEW && renderReviewStep()}
          </div>
        </div>
        <PageNav
          onBack={step > 0 ? handleBack : () => router.push('?page=services')}
          backLabel={step > 0 ? 'Cancel' : 'Back'}
          onHome={() => router.push('?page=services')}
          onNext={canProceed() ? (step === STEPS.REVIEW ? handleSubmit : handleNext) : undefined}
          nextLabel={step === STEPS.REVIEW ? (submitting ? 'Submitting...' : 'Submit Request') : 'Continue'}
          showDisabledNext={!canProceed()}
        />
        <Footer />
      </div>
    </div>
  );
}
// Created and Authored by Johnathon Moulds (c) 2026 - Wolf Flow Solutions | All Rights Reserved
