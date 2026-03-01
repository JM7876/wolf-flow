/*
  WOLF FLOW SOLUTIONS - Command Center
  Route: /command-center
  Auth-gated: admin + comms_team only
  Smart Cards dashboard for managing all portal requests.
  Created and Authored by Johnathon Moulds (c) 2026
*/
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WF, FC, FONT, MONO, CLICK, GLASS, glassPill, WORKFLOW_STEPS, STEP_DESC, DEPARTMENTS } from '../../lib/tokens';
import { GlassCard, MiniTrack, PortalBackground, Footer, useNightMode, SettingsDropdown } from '../../lib/components';
import { supabase } from '../../lib/supabase';

/* === STATUS + PRIORITY COLORS === */
const STATUS_COLORS = {
  new: { bg: `${WF.accent}22`, border: `${WF.accent}55`, text: WF.accentLight },
  'in-progress': { bg: `${WF.green}22`, border: `${WF.green}55`, text: WF.greenLight },
  review: { bg: `${WF.pink}22`, border: `${WF.pink}55`, text: WF.pinkLight },
  completed: { bg: `${FC.green}22`, border: `${FC.green}55`, text: FC.greenLight },
  archived: { bg: 'rgba(255,255,255,0.06)', border: FC.border, text: FC.textDim },
};
const PRIORITY_COLORS = {
  Standard: FC.textSecondary,
  Normal: WF.accentLight,
  Rush: FC.redLight,
};
const FILTER_OPTIONS = ['All', 'new', 'in-progress', 'review', 'completed', 'archived'];

/* === METRIC WIDGET === */
function MetricWidget({ label, value, color }) {
  return (
    <GlassCard style={{ padding: '16px 20px', minWidth: 140, flex: 1 }}>
      <div style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, color: FC.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: MONO, color: color || WF.accentLight, lineHeight: 1 }}>{value}</div>
    </GlassCard>
  );
}

/* === SMART CARD === */
function SmartCard({ request, onClick }) {
  const [h, setH] = useState(false);
  const sc = STATUS_COLORS[request.status] || STATUS_COLORS.new;
  const pc = PRIORITY_COLORS[request.priority] || FC.textSecondary;
  const stage = request.workflow_stage || 1;
  const ts = new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const initials = (request.assignee_name || 'UN').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div
      onClick={() => onClick(request)}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        ...GLASS.default,
        padding: '18px 20px',
        cursor: 'pointer',
        borderColor: h ? `${WF.accent}55` : GLASS.default.border ? undefined : 'rgba(255,255,255,0.14)',
        transform: h ? 'translateY(-2px)' : 'none',
        boxShadow: h ? CLICK.hover.boxShadow : GLASS.default.boxShadow,
        transition: `all ${CLICK.duration}`,
        marginBottom: 12,
      }}
    >
      {/* Top row: title + priority badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: FONT, color: FC.textPrimary, flex: 1, marginRight: 12, lineHeight: 1.3 }}>{request.title || 'Untitled Request'}</div>
        <span style={{ fontSize: 9, fontWeight: 600, fontFamily: FONT, color: pc, padding: '3px 10px', borderRadius: 20, background: `${pc}15`, border: `1px solid ${pc}30`, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{request.priority}</span>
      </div>
      {/* Service type + department */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontFamily: FONT, color: WF.accentLight, background: `${WF.accent}18`, padding: '2px 8px', borderRadius: 8, fontWeight: 500 }}>{(request.service_type || '').replace('press-box-', 'Press: ')}</span>
        <span style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim }}>{request.department}</span>
      </div>
      {/* Workflow mini track */}
      <div style={{ marginBottom: 10 }}>
        <MiniTrack step={stage} />
        <div style={{ fontSize: 9, fontFamily: FONT, color: FC.textDim, marginTop: 4 }}>{WORKFLOW_STEPS[stage - 1] || 'REQUEST'}: {STEP_DESC[stage - 1] || ''}</div>
      </div>
      {/* Bottom row: assignee + date + status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${WF.accent}40, ${WF.pink}40)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, fontFamily: FONT, color: FC.textPrimary, border: `1px solid ${WF.accent}30` }}>{initials}</div>
          <span style={{ fontSize: 10, fontFamily: FONT, color: FC.textSecondary }}>{request.assignee_name || 'Unassigned'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontFamily: FONT, color: FC.textDim }}>{ts}</span>
          <span style={{ fontSize: 9, fontWeight: 600, fontFamily: FONT, color: sc.text, padding: '2px 8px', borderRadius: 12, background: sc.bg, border: `1px solid ${sc.border}`, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{request.status}</span>
        </div>
      </div>
    </div>
  );
}

/* === REQUEST DETAIL PANEL === */
function DetailPanel({ request, onClose, onUpdate }) {
  const [stage, setStage] = useState(request.workflow_stage || 1);
  const [assignee, setAssignee] = useState(request.assignee_name || '');
  const [status, setStatus] = useState(request.status || 'new');
  const [saving, setSaving] = useState(false);
  const md = request.metadata || {};

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('requests').update({
      workflow_stage: stage,
      workflow_stage_label: WORKFLOW_STEPS[stage - 1],
      assignee_name: assignee || null,
      status,
      updated_at: new Date().toISOString(),
    }).eq('id', request.id);
    setSaving(false);
    if (!error) onUpdate();
  };

  const rows = [
    ['Ticket', request.ticket_id || request.id],
    ['Type', request.service_type],
    ['Title', request.title],
    ['Department', request.department],
    ['Requester', request.requester_name],
    ['Email', request.requester_email],
    ['Priority', request.priority],
    ['Due Date', request.due_date || 'Not set'],
    ['Submitted', new Date(request.created_at).toLocaleString()],
  ];
  if (md.mediaType) rows.push(['Media Type', md.mediaType]);
  if (md.targetAudience) rows.push(['Audience', md.targetAudience]);
  if (md.wordCount) rows.push(['Word Count', md.wordCount]);
  if (md.articleType) rows.push(['Article Type', md.articleType]);
  if (md.honoree) rows.push(['Honoree', md.honoree]);
  if (md.milestone) rows.push(['Milestone', md.milestone]);
  if (md.responseContext) rows.push(['Context', md.responseContext]);
  if (md.specialNotes) rows.push(['Notes', md.specialNotes]);
  if (md.attachments?.length) rows.push(['Files', md.attachments.map(a => a.name).join(', ')]);
  if (request.description) rows.push(['Description', request.description]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: '100%', overflowY: 'auto', background: 'rgba(34,28,53,0.95)', backdropFilter: 'blur(32px)', borderLeft: `1px solid ${FC.border}`, padding: '28px 24px', zIndex: 201 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT, color: FC.textPrimary }}>Request Details</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: FC.textDim, cursor: 'pointer', fontSize: 18, fontFamily: FONT }}>X</button>
        </div>
        <MiniTrack step={stage} showLabels />
        <div style={{ marginTop: 20 }}>
          {rows.map(([k, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${FC.border}` }}>
              <span style={{ fontSize: 11, fontFamily: FONT, color: FC.textDim, fontWeight: 500 }}>{k}</span>
              <span style={{ fontSize: 11, fontFamily: FONT, color: FC.textPrimary, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{v}</span>
            </div>
          ))}
        </div>
        {/* Editable fields */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, color: FC.textDim, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Manage</div>
          <label style={{ fontSize: 11, fontFamily: FONT, color: FC.textSecondary, display: 'block', marginBottom: 4 }}>Workflow Stage</label>
          <select value={stage} onChange={e => setStage(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', borderRadius: 10, background: FC.glass, border: `1px solid ${FC.border}`, color: FC.textPrimary, fontSize: 12, fontFamily: FONT, marginBottom: 12, cursor: 'pointer' }}>
            {WORKFLOW_STEPS.map((s, i) => <option key={i} value={i + 1} style={{ background: FC.dark }}>{i + 1}. {s}</option>)}
          </select>
          <label style={{ fontSize: 11, fontFamily: FONT, color: FC.textSecondary, display: 'block', marginBottom: 4 }}>Assignee</label>
          <input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Assign team member" style={{ width: '100%', padding: '8px 12px', borderRadius: 10, background: FC.glass, border: `1px solid ${FC.border}`, color: FC.textPrimary, fontSize: 12, fontFamily: FONT, marginBottom: 12, boxSizing: 'border-box' }} />
          <label style={{ fontSize: 11, fontFamily: FONT, color: FC.textSecondary, display: 'block', marginBottom: 4 }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 10, background: FC.glass, border: `1px solid ${FC.border}`, color: FC.textPrimary, fontSize: 12, fontFamily: FONT, marginBottom: 16, cursor: 'pointer' }}>
            {FILTER_OPTIONS.filter(f => f !== 'All').map(s => <option key={s} value={s} style={{ background: FC.dark }}>{s}</option>)}
          </select>
          <button onClick={handleSave} disabled={saving} style={{ ...glassPill, width: '100%', textAlign: 'center', padding: '12px 20px', background: `linear-gradient(135deg, ${WF.accent}55, ${WF.accent}38)`, border: `1px solid ${WF.accent}60`, color: '#fff', fontWeight: 600, fontSize: 12 }}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}

                                                                                                                      /* === MAIN COMPONENT === */
export default function CommandCenter() {
  const router = useRouter();
  const { nightMode, toggleNight } = useNightMode();
  const [authState, setAuthState] = useState('loading');
  const [userRole, setUserRole] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Auth gate: check role */
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAuthState('denied'); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile && (profile.role === 'admin' || profile.role === 'comms_team')) {
        setUserRole(profile.role);
        setAuthState('authorized');
      } else {
        setAuthState('denied');
      }
    }
    checkAuth();
  }, []);

  /* Fetch all requests */
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authState === 'authorized') fetchRequests();
  }, [authState, fetchRequests]);

  /* Realtime subscription */
  useEffect(() => {
    if (authState !== 'authorized') return;
    const channel = supabase.channel('requests-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => fetchRequests()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [authState, fetchRequests]);

  /* Filtered + searched requests */
  const filtered = requests.filter(r => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (r.title || '').toLowerCase().includes(q) || (r.requester_name || '').toLowerCase().includes(q) || (r.department || '').toLowerCase().includes(q) || (r.service_type || '').toLowerCase().includes(q);
    }
    return true;
  });

  /* Metrics */
  const totalReqs = requests.length;
  const activeReqs = requests.filter(r => r.status === 'new' || r.status === 'in-progress' || r.status === 'review').length;
  const completedReqs = requests.filter(r => r.status === 'completed').length;
  const rushReqs = requests.filter(r => r.priority === 'Rush').length;

  /* Auth denied screen */
  if (authState === 'denied') {
    return (
            <>
      <PortalBackground nightMode={nightMode} />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
        <GlassCard style={{ padding: '40px', textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: FC.textPrimary, marginBottom: 12 }}>Access Restricted</div>
          <div style={{ fontSize: 13, color: FC.textSecondary, marginBottom: 20 }}>Command Center is for authorized team members only. Sign in with an admin or comms team account.</div>
          <button onClick={() => router.push('/')} style={{ ...glassPill, padding: '12px 28px', border: `1px solid ${WF.accent}40`, color: WF.accentLight, fontSize: 12 }}>Back to Portal</button>
        </GlassCard>
      </div>
      </>    
);
  }

  /* Loading screen */
  if (authState === 'loading') {
    return (
            <>
      <PortalBackground nightMode={nightMode} />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
        <div style={{ fontSize: 14, color: FC.textDim }}>Authenticating...</div>
      </div>
      </>    
);
  }

  return (
    <>
      <PortalBackground nightMode={nightMode} />
      <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', fontFamily: FONT, padding: '24px 20px 80px', maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: FC.textDim, marginBottom: 6 }}>Wolf Flow Solutions</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: FC.textPrimary, marginBottom: 4 }}>Command Center</div>
          <div style={{ fontSize: 12, color: FC.textSecondary }}>{userRole === 'admin' ? 'Administrator' : 'Communications Team'} Dashboard</div>
        </div>

        {/* Metrics row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <MetricWidget label="Total" value={totalReqs} color={WF.accentLight} />
          <MetricWidget label="Active" value={activeReqs} color={WF.greenLight} />
          <MetricWidget label="Completed" value={completedReqs} color={FC.greenLight} />
          <MetricWidget label="Rush" value={rushReqs} color={FC.redLight} />
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests..." style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 12, background: FC.glass, border: `1px solid ${FC.border}`, color: FC.textPrimary, fontSize: 12, fontFamily: FONT, outline: 'none', caretColor: WF.accent }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {FILTER_OPTIONS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 14px', borderRadius: 12, fontSize: 10, fontWeight: filter === f ? 600 : 400, fontFamily: FONT, cursor: 'pointer', background: filter === f ? `${WF.accent}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${filter === f ? `${WF.accent}50` : FC.border}`, color: filter === f ? WF.accentLight : FC.textDim, transition: `all ${CLICK.duration}`, textTransform: 'capitalize' }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Smart Cards grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: FC.textDim, fontSize: 13 }}>Loading requests...</div>
        ) : filtered.length === 0 ? (
          <GlassCard style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: FC.textSecondary, marginBottom: 8 }}>No requests found</div>
            <div style={{ fontSize: 11, color: FC.textDim }}>{filter !== 'All' ? `No ${filter} requests` : search ? 'Try a different search term' : 'Requests submitted through the portal will appear here'}</div>
          </GlassCard>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,  1fr))', gap: 0 }}>
            {filtered.map(r => <SmartCard key={r.id} request={r} onClick={setSelected} />)}
          </div>
        )}

        <Footer />
      </div>

      {/* Detail slide-out panel */}
      {selected && <DetailPanel request={selected} onClose={() => setSelected(null)} onUpdate={() => { fetchRequests(); setSelected(null); }} />}
    </>
  );
}
// Created and Authored by Johnathon Moulds (c) 2026 - Wolf Flow Solutions | All Rights Reserved
