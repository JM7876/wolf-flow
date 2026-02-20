'use client';

// ─── Wolf Flow Command Center Calendar ──────────────────────────────────────
// Created and Authored by Johnathon Moulds 2026

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  LiquidGlassPanel,
  SimpleGlassPanel,
  LightGlassPanel,
  LiquidGlassSvgDefs,
  LiquidGlassStyles,
  useLiquidGlass,
} from './LiquidGlass';

// ─── Employee Color Registry ─────────────────────────────────────────────────
const TEAM = [
  { id: 'johnathon', name: 'Johnathon', initials: 'JM', color: '#555BD9', role: 'Photographer' },
  { id: 'tracy',     name: 'Tracy',     initials: 'TR', color: '#C41DF2', role: 'Admin / Coordinator' },
  { id: 'shawn',     name: 'Shawn',     initials: 'SH', color: '#FF6B6B', role: 'Graphic Designer' },
  { id: 'cat',       name: 'Cat',       initials: 'CT', color: '#00D4AA', role: 'Writer' },
  { id: 'audry',     name: 'Audry',     initials: 'AU', color: '#FFB347', role: 'Comm. Specialist' },
  { id: 'narciso',   name: 'Narciso',   initials: 'NA', color: '#FF4D8F', role: 'Director' },
];

// ─── Palette Tokens ──────────────────────────────────────────────────────────
const PALETTES = {
  purple: {
    name: 'Electric Purple',
    night: { t1: '#0C0826', t2: '#1E0E40', t3: '#5241BF', t4: '#C41DF2' },
    day:   { t1: '#C41DF2', t2: '#5241BF', t3: '#5A278C', t4: '#1E0E40' },
  },
  blue: {
    name: 'Wolf Flow Blue',
    night: { t1: '#0D1035', t2: '#2540D9', t3: '#555BD9', t4: '#D5D7F2' },
    day:   { t1: '#D5D7F2', t2: '#9C9AD9', t3: '#555BD9', t4: '#2540D9' },
  },
};

// ─── Sample Event Data ────────────────────────────────────────────────────────
function buildSampleEvents(weekStart) {
  const d = (dayOffset, hour, min) => {
    const dt = new Date(weekStart);
    dt.setDate(dt.getDate() + dayOffset);
    dt.setHours(hour, min, 0, 0);
    return dt;
  };

  return [
    { id: 1,  title: 'Brand Strategy Meeting',    start: d(0, 9, 0),  end: d(0, 10, 30), type: 'meeting',  memberId: 'tracy',     attendees: ['tracy', 'johnathon', 'shawn'] },
    { id: 2,  title: 'Logo Design Review',        start: d(0, 13, 0), end: d(0, 14, 0),  type: 'task',     memberId: 'shawn',     attendees: ['shawn', 'tracy'] },
    { id: 3,  title: 'Photography Session',       start: d(1, 10, 0), end: d(1, 12, 0),  type: 'task',     memberId: 'johnathon', attendees: ['johnathon'] },
    { id: 4,  title: 'Content Planning',          start: d(1, 14, 0), end: d(1, 15, 30), type: 'meeting',  memberId: 'cat',       attendees: ['cat', 'audry', 'tracy'] },
    { id: 5,  title: 'Client Onboarding Call',    start: d(2, 9, 0),  end: d(2, 10, 0),  type: 'meeting',  memberId: 'narciso',   attendees: ['narciso', 'tracy'] },
    { id: 6,  title: 'Social Media Batch',        start: d(2, 11, 0), end: d(2, 13, 0),  type: 'task',     memberId: 'audry',     attendees: ['audry'] },
    { id: 7,  title: 'Copy Deadline — Blog Post', start: d(3, 10, 0), end: d(3, 11, 0),  type: 'deadline', memberId: 'cat',       attendees: ['cat'] },
    { id: 8,  title: 'Team Sync',                 start: d(3, 15, 0), end: d(3, 16, 0),  type: 'meeting',  memberId: 'narciso',   attendees: ['narciso', 'johnathon', 'shawn', 'cat', 'audry', 'tracy'] },
    { id: 9,  title: 'Campaign Design Sprint',    start: d(4, 9, 0),  end: d(4, 12, 0),  type: 'task',     memberId: 'shawn',     attendees: ['shawn', 'johnathon'] },
    { id: 10, title: 'Director Review',           start: d(4, 14, 0), end: d(4, 15, 0),  type: 'meeting',  memberId: 'narciso',   attendees: ['narciso', 'tracy'] },
    { id: 11, title: 'Photo Editing',             start: d(5, 10, 0), end: d(5, 13, 0),  type: 'task',     memberId: 'johnathon', attendees: ['johnathon'] },
    { id: 12, title: 'Newsletter Deadline',       start: d(5, 15, 0), end: d(5, 16, 0),  type: 'deadline', memberId: 'cat',       attendees: ['cat', 'audry'] },
    { id: 13, title: 'Press Release Draft',       start: d(6, 11, 0), end: d(6, 12, 30), type: 'task',     memberId: 'audry',     attendees: ['audry', 'narciso'] },
  ];
}

// ─── Utility Helpers ──────────────────────────────────────────────────────────
function getWeekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatHour(hour) {
  if (hour === 0)  return '12 AM';
  if (hour < 12)  return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

function formatTime(date) {
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatDayHeader(date, isToday) {
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  return { dayName: days[date.getDay()], dayNum: date.getDate() };
}

function memberById(id) {
  return TEAM.find(m => m.id === id) || TEAM[0];
}

const TYPE_ICONS = {
  meeting:  '◎',
  task:     '▣',
  deadline: '◆',
};

// ─── Glass Controller ────────────────────────────────────────────────────────
function GlassController({ nightMode, onToggleNight, palette, onTogglePalette, glassParams, onParamChange }) {
  const [open, setOpen] = useState(false);
  const accentColor = palette === 'purple' ? '#C41DF2' : '#555BD9';

  return (
    <div style={{ position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 1000 }}>
      {open && (
        <div style={{
          position: 'absolute', bottom: '4.5rem', left: 0,
          width: '260px', padding: '1.25rem',
          background: nightMode
            ? 'rgba(12,8,38,0.85)'
            : 'rgba(213,215,242,0.85)',
          backdropFilter: 'blur(24px)',
          borderRadius: '20px',
          border: `1px solid ${accentColor}40`,
          boxShadow: `0 0 32px ${accentColor}30`,
          animation: 'panelFadeIn 0.3s ease',
          color: nightMode ? '#E2E1DD' : '#1E0E40',
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1rem', opacity: 0.6 }}>
            GLASS CONTROLLER
          </div>

          {/* Day / Night Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={onToggleNight}
              style={{
                flex: 1, padding: '0.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: nightMode ? accentColor : 'rgba(255,255,255,0.2)',
                color: nightMode ? '#fff' : '#1E0E40',
                fontSize: '0.72rem', fontWeight: 600,
              }}
            >🌙 Night</button>
            <button
              onClick={onToggleNight}
              style={{
                flex: 1, padding: '0.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: !nightMode ? accentColor : 'rgba(255,255,255,0.2)',
                color: !nightMode ? '#fff' : '#E2E1DD',
                fontSize: '0.72rem', fontWeight: 600,
              }}
            >☀️ Day</button>
          </div>

          {/* Palette Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              onClick={() => onTogglePalette('purple')}
              style={{
                flex: 1, padding: '0.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: palette === 'purple' ? '#C41DF2' : 'rgba(255,255,255,0.15)',
                color: palette === 'purple' ? '#fff' : (nightMode ? '#E2E1DD' : '#1E0E40'),
                fontSize: '0.65rem', fontWeight: 600,
              }}
            >⚡ Electric Purple</button>
            <button
              onClick={() => onTogglePalette('blue')}
              style={{
                flex: 1, padding: '0.4rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: palette === 'blue' ? '#555BD9' : 'rgba(255,255,255,0.15)',
                color: palette === 'blue' ? '#fff' : (nightMode ? '#E2E1DD' : '#1E0E40'),
                fontSize: '0.65rem', fontWeight: 600,
              }}
            >🐺 Wolf Flow Blue</button>
          </div>

          {/* Sliders */}
          {[
            { key: 'displacementScale', label: 'Displacement', min: 0, max: 150 },
            { key: 'blur',              label: 'Blur',          min: 0, max: 48 },
            { key: 'frostOpacity',      label: 'Opacity',       min: 0, max: 0.2, step: 0.005 },
            { key: 'brightness',        label: 'Brightness',    min: 80, max: 160 },
            { key: 'saturation',        label: 'Saturation',    min: 80, max: 250 },
            { key: 'bezelFraction',     label: 'Bezel',         min: 0.05, max: 0.35, step: 0.01 },
          ].map(({ key, label, min, max, step = 1 }) => (
            <div key={key} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '0.25rem', opacity: 0.7 }}>
                <span>{label}</span>
                <span style={{ color: accentColor, fontWeight: 700 }}>
                  {typeof glassParams[key] === 'number' && glassParams[key] < 1
                    ? glassParams[key].toFixed(3)
                    : Math.round(glassParams[key])}
                </span>
              </div>
              <input
                type="range" min={min} max={max} step={step}
                value={glassParams[key]}
                onChange={e => onParamChange(key, parseFloat(e.target.value))}
                style={{ width: '100%', accentColor }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Controller circle */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '52px', height: '52px', borderRadius: '50%', border: `2px solid ${accentColor}`,
          background: nightMode ? 'rgba(12,8,38,0.7)' : 'rgba(213,215,242,0.7)',
          backdropFilter: 'blur(16px)',
          cursor: 'pointer', fontSize: '1.2rem',
          boxShadow: `0 0 20px ${accentColor}50`,
          transition: 'all 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {open ? '✕' : '⚙'}
      </button>
    </div>
  );
}

// ─── Mini Month Calendar (Placeholder) ───────────────────────────────────────
function MiniMonthCalendar({ date, nightMode, accentColor, textColor }) {
  const [viewDate, setViewDate] = useState(new Date(date));
  const today = new Date();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: textColor }}>
          {monthNames[month]} {year}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setViewDate(new Date(year, month - 1))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, fontSize: '0.8rem' }}>‹</button>
          <button onClick={() => setViewDate(new Date(year, month + 1))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, fontSize: '0.8rem' }}>›</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{ fontSize: '0.6rem', opacity: 0.5, padding: '2px', color: textColor }}>{d}</div>
        ))}
        {cells.map((d, i) => (
          <div key={i} style={{
            fontSize: '0.7rem', padding: '4px 2px', borderRadius: '6px', cursor: d ? 'pointer' : 'default',
            background: isToday(d) ? accentColor : 'transparent',
            color: isToday(d) ? '#fff' : (d ? textColor : 'transparent'),
            fontWeight: isToday(d) ? 700 : 400,
            opacity: d ? 1 : 0,
          }}>{d}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Team Summary Ring ────────────────────────────────────────────────────────
function TeamSummaryRing({ events, nightMode, textColor }) {
  const counts = TEAM.map(m => ({
    ...m,
    count: events.filter(e => e.memberId === m.id).length,
  }));
  const total = events.length || 1;

  // Simple SVG donut
  const size = 80;
  const r = 30;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: textColor, marginBottom: '0.5rem' }}>
        Team Summary
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {counts.map((m, i) => {
            const fraction = m.count / total;
            const dashLen = fraction * circumference;
            const el = (
              <circle key={m.id}
                cx={cx} cy={cx} r={r}
                fill="none" stroke={m.color} strokeWidth={8}
                strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                strokeDashoffset={-offset}
                style={{ transition: 'all 0.5s ease' }}
              />
            );
            offset += dashLen;
            return el;
          })}
        </svg>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: textColor }}>{events.length}</div>
          <div style={{ fontSize: '0.65rem', opacity: 0.6, color: textColor }}>Events this week</div>
        </div>
      </div>
      {counts.filter(m => m.count > 0).map(m => (
        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.color, flexShrink: 0 }} />
          <span style={{ fontSize: '0.7rem', color: textColor, opacity: 0.8 }}>{m.name}</span>
          <span style={{ fontSize: '0.7rem', color: m.color, fontWeight: 700, marginLeft: 'auto' }}>{m.count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Event Detail Slide-Out Panel ─────────────────────────────────────────────
function EventDetailPanel({ event, nightMode, accentColor, textColor, onClose, onDelete }) {
  if (!event) return null;
  const member = memberById(event.memberId);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      pointerEvents: 'none',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          pointerEvents: 'all',
          animation: 'fadeSlideIn 0.25s ease',
        }}
      />
      {/* Slide-out from right */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '340px',
        background: nightMode ? 'rgba(12,8,38,0.92)' : 'rgba(213,215,242,0.92)',
        backdropFilter: 'blur(32px)',
        borderLeft: `1px solid ${accentColor}40`,
        boxShadow: `-8px 0 40px ${accentColor}20`,
        pointerEvents: 'all',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column',
        padding: '2rem',
        color: textColor,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{
              display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '6px',
              background: `${member.color}25`, color: member.color,
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
              marginBottom: '0.5rem',
            }}>
              {TYPE_ICONS[event.type]} {event.type.toUpperCase()}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3 }}>{event.title}</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: textColor, fontSize: '1.2rem', opacity: 0.6, padding: '0.25rem',
          }}>✕</button>
        </div>

        {/* Color bar */}
        <div style={{ height: '3px', borderRadius: '2px', background: member.color, marginBottom: '1.5rem', opacity: 0.8 }} />

        {/* Time */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: '0.25rem', letterSpacing: '0.1em' }}>TIME</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {formatTime(event.start)} — {formatTime(event.end)}
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.2rem' }}>
            {event.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Owner */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: '0.25rem', letterSpacing: '0.1em' }}>OWNER</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: '#fff',
            }}>{member.initials}</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{member.name}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{member.role}</div>
            </div>
          </div>
        </div>

        {/* Attendees */}
        {event.attendees.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', opacity: 0.5, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>ATTENDEES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {event.attendees.map(aid => {
                const m = memberById(aid);
                return (
                  <div key={aid} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.55rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>{m.initials}</div>
                    <span style={{ fontSize: '0.78rem' }}>{m.name}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.5, marginLeft: 'auto' }}>{m.role}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{
            flex: 1, padding: '0.65rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: accentColor, color: '#fff', fontWeight: 700, fontSize: '0.8rem',
          }}>Edit Event</button>
          <button onClick={() => { onDelete(event.id); onClose(); }} style={{
            padding: '0.65rem 1rem', borderRadius: '12px', border: `1px solid ${accentColor}50`,
            background: 'transparent', cursor: 'pointer', color: textColor, fontSize: '0.8rem',
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Event Modal ───────────────────────────────────────────────────────
function CreateEventModal({ nightMode, accentColor, textColor, defaultDate, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [memberId, setMemberId] = useState('johnathon');
  const [type, setType] = useState('meeting');
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(10);

  const handleSave = () => {
    if (!title.trim()) return;
    const start = new Date(defaultDate);
    start.setHours(startHour, 0, 0, 0);
    const end = new Date(defaultDate);
    end.setHours(endHour, 0, 0, 0);
    onSave({ id: Date.now(), title, memberId, type, start, end, attendees: [memberId] });
    onClose();
  };

  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '10px', border: `1px solid ${accentColor}40`,
    background: nightMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    color: textColor, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{
        position: 'relative', width: '380px', padding: '2rem',
        background: nightMode ? 'rgba(12,8,38,0.95)' : 'rgba(213,215,242,0.95)',
        backdropFilter: 'blur(32px)',
        borderRadius: '20px',
        border: `1px solid ${accentColor}40`,
        boxShadow: `0 0 60px ${accentColor}30`,
        color: textColor,
        animation: 'panelFadeIn 0.3s ease',
      }}>
        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700 }}>Create New Event</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>TITLE</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title..." style={inputStyle} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>OWNER</label>
          <select value={memberId} onChange={e => setMemberId(e.target.value)} style={inputStyle}>
            {TEAM.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>TYPE</label>
          <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>START</label>
            <select value={startHour} onChange={e => setStartHour(+e.target.value)} style={inputStyle}>
              {Array.from({length: 16}, (_, i) => i + 6).map(h => (
                <option key={h} value={h}>{formatHour(h)}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', marginBottom: '0.3rem', letterSpacing: '0.1em' }}>END</label>
            <select value={endHour} onChange={e => setEndHour(+e.target.value)} style={inputStyle}>
              {Array.from({length: 16}, (_, i) => i + 7).map(h => (
                <option key={h} value={h}>{formatHour(h)}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: '0.7rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: accentColor, color: '#fff', fontWeight: 700, fontSize: '0.85rem',
          }}>Create Event</button>
          <button onClick={onClose} style={{
            padding: '0.7rem 1rem', borderRadius: '12px', border: `1px solid ${accentColor}50`,
            background: 'transparent', cursor: 'pointer', color: textColor, fontSize: '0.85rem',
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event, topPx, heightPx, nightMode, textColor, onClick, onDragStart }) {
  const member = memberById(event.memberId);
  const attendeeMembers = event.attendees.slice(0, 3).map(memberById);
  const extra = event.attendees.length - 3;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: topPx + 2,
        left: 2,
        right: 2,
        height: Math.max(heightPx - 4, 28),
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: 2,
        background: nightMode
          ? `rgba(255,255,255,0.06)`
          : `rgba(255,255,255,0.45)`,
        backdropFilter: 'blur(12px)',
        border: `1px solid rgba(255,255,255,0.15)`,
        borderTop: `3px solid ${member.color}`,
        boxShadow: `0 2px 12px rgba(0,0,0,0.15)`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        padding: '4px 6px',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.boxShadow = `0 4px 20px ${member.color}40`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)'; }}
    >
      {/* Attendee avatars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '2px' }}>
        <span style={{ fontSize: '0.55rem', opacity: 0.7, marginRight: '2px', color: textColor }}>{TYPE_ICONS[event.type]}</span>
        {attendeeMembers.map((m, i) => (
          <div key={i} style={{
            width: '14px', height: '14px', borderRadius: '50%',
            background: m.color, border: '1px solid rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.4rem', color: '#fff', fontWeight: 700, flexShrink: 0,
            marginLeft: i > 0 ? '-4px' : 0,
          }}>{m.initials[0]}</div>
        ))}
        {extra > 0 && (
          <div style={{
            width: '14px', height: '14px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.38rem', color: textColor, fontWeight: 700, marginLeft: '-4px',
          }}>+{extra}</div>
        )}
      </div>

      {heightPx > 40 && (
        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: textColor, lineHeight: 1.2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {event.title}
        </div>
      )}
      {heightPx > 60 && (
        <div style={{ fontSize: '0.58rem', opacity: 0.65, color: textColor, marginTop: '1px' }}>
          {formatTime(event.start)} – {formatTime(event.end)}
        </div>
      )}
    </div>
  );
}

// ─── Week Grid ────────────────────────────────────────────────────────────────
const HOUR_START = 6;
const HOUR_END   = 22;
const HOURS      = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => i + HOUR_START);
const SLOT_H     = 60; // px per hour

function WeekGrid({ weekDays, events, nightMode, textColor, accentColor, onEventClick, onCellClick, onEventDrop }) {
  const today = new Date();
  const dragRef = useRef(null);

  const eventsForDay = (day) =>
    events.filter(e => e.start.toDateString() === day.toDateString());

  const eventStyle = (e) => {
    const startMin = (e.start.getHours() - HOUR_START) * 60 + e.start.getMinutes();
    const endMin   = (e.end.getHours()   - HOUR_START) * 60 + e.end.getMinutes();
    return {
      topPx:    (startMin / 60) * SLOT_H,
      heightPx: Math.max(((endMin - startMin) / 60) * SLOT_H, 28),
    };
  };

  const isToday = (d) => d.toDateString() === today.toDateString();

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Time gutter */}
      <div style={{ width: '56px', flexShrink: 0, paddingTop: '44px' }}>
        {HOURS.map(h => (
          <div key={h} style={{
            height: SLOT_H, display: 'flex', alignItems: 'flex-start',
            justifyContent: 'flex-end', paddingRight: '8px', paddingTop: '4px',
            fontSize: '0.62rem', opacity: 0.45, color: textColor,
          }}>{formatHour(h)}</div>
        ))}
      </div>

      {/* Day columns */}
      {weekDays.map((day, di) => {
        const dayEvents = eventsForDay(day);
        const { dayName, dayNum } = formatDayHeader(day);

        return (
          <div key={di} style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Day header */}
            <div style={{
              height: '44px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', opacity: 0.5, color: textColor }}>{dayName}</div>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: isToday(day) ? accentColor : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: isToday(day) ? 700 : 400,
                color: isToday(day) ? '#fff' : textColor,
              }}>{dayNum}</div>
            </div>

            {/* Cell column */}
            <div
              style={{ flex: 1, position: 'relative', borderLeft: `1px solid ${textColor}10` }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                if (!dragRef.current) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const y = e.clientY - rect.top;
                const hour = Math.floor(y / SLOT_H) + HOUR_START;
                onEventDrop(dragRef.current, day, hour);
                dragRef.current = null;
              }}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const y = e.clientY - rect.top;
                const hour = Math.floor(y / SLOT_H) + HOUR_START;
                onCellClick(day, hour);
              }}
            >
              {/* Hour lines */}
              {HOURS.map(h => (
                <div key={h} style={{
                  position: 'absolute', top: (h - HOUR_START) * SLOT_H,
                  left: 0, right: 0, height: 1,
                  background: `${textColor}08`,
                  pointerEvents: 'none',
                }} />
              ))}

              {/* Events */}
              {dayEvents.map(e => {
                const { topPx, heightPx } = eventStyle(e);
                return (
                  <EventCard
                    key={e.id}
                    event={e}
                    topPx={topPx}
                    heightPx={heightPx}
                    nightMode={nightMode}
                    textColor={textColor}
                    onClick={(ev) => { ev.stopPropagation(); onEventClick(e); }}
                    onDragStart={() => { dragRef.current = e; }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────
export default function WolfCalendar() {
  const [nightMode, setNightMode]   = useState(true);
  const [palette, setPalette]       = useState('purple');
  const [view, setView]             = useState('week'); // week | month | day
  const [weekStart, setWeekStart]   = useState(() => getWeekStart(new Date()));
  const [events, setEvents]         = useState(() => buildSampleEvents(getWeekStart(new Date())));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createDate, setCreateDate] = useState(new Date());
  const [createHour, setCreateHour] = useState(9);

  const [glassParams, setGlassParams] = useState({
    displacementScale: 70,
    aberration: 1.5,
    bezelFraction: 0.16,
    blur: 24,
    brightness: 115,
    saturation: 160,
    frostOpacity: 0.04,
  });

  const { svgDefsRef, registerPanel, rebuild } = useLiquidGlass(glassParams);

  // Rebuild glass when params change
  useEffect(() => { rebuild(); }, [glassParams, rebuild]);

  const colors = PALETTES[palette][nightMode ? 'night' : 'day'];
  const accentColor = palette === 'purple' ? colors.t4 : colors.t3;
  const textColor   = nightMode ? '#E2E1DD' : colors.t4;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const handleParamChange = useCallback((key, val) => {
    setGlassParams(p => ({ ...p, [key]: val }));
  }, []);

  const handleEventDrop = useCallback((event, newDay, newHour) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== event.id) return e;
      const dur = e.end - e.start;
      const newStart = new Date(newDay);
      newStart.setHours(newHour, 0, 0, 0);
      const newEnd = new Date(newStart.getTime() + dur);
      return { ...e, start: newStart, end: newEnd };
    }));
  }, []);

  const handleCreateEvent = useCallback((ev) => {
    setEvents(prev => [...prev, ev]);
  }, []);

  const handleDeleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleCellClick = useCallback((day, hour) => {
    setCreateDate(day);
    setCreateHour(hour);
    setShowCreate(true);
  }, []);

  const navigateWeek = (dir) => {
    setWeekStart(d => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() + dir * 7);
      return nd;
    });
  };

  // Format month/year for header
  const headerDate = weekDays[3];
  const monthLabel = headerDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const bgImage = nightMode ? '/bg-night.png' : '/bg-day.png';

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
    }}>
      <LiquidGlassStyles />
      <LiquidGlassSvgDefs svgDefsRef={svgDefsRef} />

      {/* ── Background wave image ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        transition: 'opacity 0.6s ease',
      }} />

      {/* ── Color tint overlay ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: nightMode
          ? `linear-gradient(135deg, ${colors.t1}CC 0%, ${colors.t2}88 100%)`
          : `linear-gradient(135deg, ${colors.t1}BB 0%, ${colors.t2}66 100%)`,
        transition: 'background 0.6s ease',
      }} />

      {/* ── Main layout ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* ── Left icon sidebar ── */}
        <div style={{
          width: '60px', flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: '1.5rem', gap: '1.25rem',
          borderRight: `1px solid ${accentColor}20`,
          background: nightMode ? 'rgba(12,8,38,0.4)' : 'rgba(213,215,242,0.4)',
          backdropFilter: 'blur(12px)',
        }}>
          {/* Wolf logo */}
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem',
          }}>W</div>

          {/* Nav icons */}
          {['📅','✉️','✅','👥','⚙️'].map((icon, i) => (
            <button key={i} style={{
              width: '40px', height: '40px', borderRadius: '10px', border: 'none',
              background: i === 0 ? `${accentColor}30` : 'transparent',
              cursor: 'pointer', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: i === 0 ? `0 0 12px ${accentColor}40` : 'none',
            }}>{icon}</button>
          ))}
        </div>

        {/* ── Center calendar area ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, padding: '1rem' }}>

          {/* ── Top bar ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            marginBottom: '0.75rem', flexShrink: 0,
          }}>
            {/* View tabs */}
            <div style={{
              display: 'flex', gap: '0.25rem', padding: '0.25rem',
              background: nightMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              borderRadius: '12px',
            }}>
              {['week','month','day'].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: '0.35rem 0.85rem', borderRadius: '9px', border: 'none', cursor: 'pointer',
                  background: view === v ? accentColor : 'transparent',
                  color: view === v ? '#fff' : textColor,
                  fontSize: '0.75rem', fontWeight: view === v ? 700 : 400,
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize',
                }}>{v}</button>
              ))}
            </div>

            {/* Date nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => navigateWeek(-1)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: textColor, fontSize: '0.9rem', opacity: 0.7,
              }}>‹</button>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: textColor, minWidth: '160px', textAlign: 'center' }}>
                {monthLabel}
              </span>
              <button onClick={() => navigateWeek(1)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: textColor, fontSize: '0.9rem', opacity: 0.7,
              }}>›</button>
            </div>

            {/* Today button */}
            <button onClick={() => setWeekStart(getWeekStart(new Date()))} style={{
              padding: '0.35rem 0.75rem', borderRadius: '9px', border: `1px solid ${accentColor}50`,
              background: 'transparent', color: textColor, cursor: 'pointer', fontSize: '0.75rem',
            }}>Today</button>

            <div style={{ flex: 1 }} />

            {/* Team member legend */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {TEAM.map(m => (
                <div key={m.id} title={m.name} style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.55rem', fontWeight: 700, color: '#fff', cursor: 'default',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}>{m.initials}</div>
              ))}
            </div>

            {/* Add event */}
            <button
              onClick={() => { setCreateDate(new Date()); setShowCreate(true); }}
              style={{
                padding: '0.4rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: accentColor, color: '#fff', fontWeight: 700, fontSize: '0.8rem',
                boxShadow: `0 0 16px ${accentColor}50`,
                animation: 'pulse 2.5s ease-in-out infinite',
              }}
            >+ Event</button>
          </div>

          {/* ── Calendar glass panel ── */}
          <LiquidGlassPanel
            registerRef={registerPanel}
            style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
              <WeekGrid
                weekDays={weekDays}
                events={events}
                nightMode={nightMode}
                textColor={textColor}
                accentColor={accentColor}
                onEventClick={setSelectedEvent}
                onCellClick={handleCellClick}
                onEventDrop={handleEventDrop}
              />
            </div>
          </LiquidGlassPanel>
        </div>

        {/* ── Right sidebar ── */}
        <div style={{
          width: '240px', flexShrink: 0, padding: '1rem 0.75rem',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
          borderLeft: `1px solid ${accentColor}20`,
        }}>
          {/* Mini month calendar */}
          <SimpleGlassPanel style={{ borderRadius: '16px' }}>
            <MiniMonthCalendar
              date={headerDate}
              nightMode={nightMode}
              accentColor={accentColor}
              textColor={textColor}
            />
          </SimpleGlassPanel>

          {/* Team summary */}
          <SimpleGlassPanel style={{ borderRadius: '16px', flex: 1 }}>
            <TeamSummaryRing
              events={events.filter(e => {
                const ws = weekStart;
                const we = new Date(ws); we.setDate(we.getDate() + 7);
                return e.start >= ws && e.start < we;
              })}
              nightMode={nightMode}
              textColor={textColor}
            />
          </SimpleGlassPanel>
        </div>
      </div>

      {/* ── Event detail slide-out ── */}
      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          nightMode={nightMode}
          accentColor={accentColor}
          textColor={textColor}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDeleteEvent}
        />
      )}

      {/* ── Create event modal ── */}
      {showCreate && (
        <CreateEventModal
          nightMode={nightMode}
          accentColor={accentColor}
          textColor={textColor}
          defaultDate={createDate}
          defaultHour={createHour}
          onSave={handleCreateEvent}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* ── Glass Controller ── */}
      <GlassController
        nightMode={nightMode}
        onToggleNight={() => setNightMode(n => !n)}
        palette={palette}
        onTogglePalette={setPalette}
        glassParams={glassParams}
        onParamChange={handleParamChange}
      />

      {/* ── Animations ── */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.02); }
        }
        @keyframes panelFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${accentColor}40; border-radius: 4px; }
      `}</style>
    </div>
  );
}

// Created and Authored by Johnathon Moulds 2026
