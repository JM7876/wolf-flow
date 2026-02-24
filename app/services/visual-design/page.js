/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Visual Design Request (9-Step Wizard)
   ─────────────────────────────────────────────────────────
   Route: /services/visual-design
   Restyled from NHBP tokens to Wolf Flow design system.
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { WF, FC, FONT, CLICK, inputBase } from "../../lib/tokens";
import { PortalBackground, Footer, PageNav, useNightMode, SettingsDropdown } from "../../lib/components";

// ═══════════════════════════════════════════════════════════
//  VISUAL DESIGNS FORM — DATA
// ═══════════════════════════════════════════════════════════

const PIECE_TYPES = [
  { id: "digital-flyer", icon: "\u25A0", label: "Digital Media Flyer", desc: "Social media graphics, digital flyers, event promos" },
  { id: "printed-media", icon: "\u25A1", label: "Printed Media Materials", desc: "Flyers, trifolds, postcards, posters, booklets" },
  { id: "banner-sign", icon: "\u25B3", label: "Banner / Sign", desc: "Retractable banners, vinyl, yard signs, window signs" },
  { id: "ad", icon: "\u25C7", label: "QTP Advertisements", desc: "Quarter page, half page, full page ads" },
  { id: "presentation", icon: "\u25CB", label: "Presentation", desc: "PowerPoint, Google Slides, templates" },
  { id: "special-request", icon: "\u2726", label: "General Special Request", desc: "Something unique \u2014 tell us what you need" },
];

const FORMAT_OPTIONS = [
  { id: "digital", icon: "\u25CB", label: "Digital Only", desc: "Screen, email, social media" },
  { id: "print", icon: "\u25A0", label: "Print Only", desc: "Will be physically printed" },
  { id: "both", icon: "\u25CE", label: "Both", desc: "Digital version + print-ready files" },
];

const PRINTED_MEDIA_SIZES = [
  { cat: "Flyers", sizes: [
    { id: "8.5x11", label: '8.5" \u00D7 11"', desc: "Standard letter flyer", w: 85, h: 110 },
    { id: "5.5x8.5", label: '5.5" \u00D7 8.5"', desc: "Half page flyer", w: 77, h: 119 },
    { id: "11x17", label: '11" \u00D7 17"', desc: "Tabloid flyer", w: 88, h: 136 },
  ]},
  { cat: "Trifolds & Brochures", sizes: [
    { id: "trifold-letter", label: '8.5" \u00D7 11" tri-fold', desc: "Standard brochure", w: 85, h: 110 },
    { id: "trifold-legal", label: '8.5" \u00D7 14" tri-fold', desc: "Legal brochure", w: 85, h: 140 },
    { id: "bifold", label: '11" \u00D7 17" bi-fold', desc: "Folded to 8.5 \u00D7 11", w: 88, h: 136 },
  ]},
  { cat: "Postcards", sizes: [
    { id: "4x6", label: '4" \u00D7 6"', desc: "Standard postcard", w: 96, h: 64 },
    { id: "5x7", label: '5" \u00D7 7"', desc: "Large postcard", w: 100, h: 70 },
    { id: "6x9", label: '6" \u00D7 9"', desc: "Jumbo postcard", w: 108, h: 72 },
  ]},
  { cat: "Stationery Cards", sizes: [
    { id: "a2-card", label: '4.25" \u00D7 5.5"', desc: "A2 folded card", w: 77, h: 100 },
    { id: "a7-card", label: '5" \u00D7 7"', desc: "A7 folded card", w: 71, h: 100 },
    { id: "5x7-flat", label: '5" \u00D7 7" flat', desc: "Flat card", w: 71, h: 100 },
    { id: "4x6-flat", label: '4" \u00D7 6" flat', desc: "Flat card", w: 67, h: 100 },
  ]},
  { cat: "Posters", sizes: [
    { id: "11x17-poster", label: '11" \u00D7 17"', desc: "Small poster", w: 88, h: 136 },
    { id: "18x24", label: '18" \u00D7 24"', desc: "Medium poster", w: 75, h: 100 },
    { id: "24x36", label: '24" \u00D7 36"', desc: "Large poster", w: 67, h: 100 },
  ]},
];

const SIZES = {
  "digital-flyer": {
    digital: [
      { id: "1080sq", label: "1080 \u00D7 1080", desc: "Feed post (square)", w: 100, h: 100 },
      { id: "1080x1350", label: "1080 \u00D7 1350", desc: "Feed post (portrait)", w: 80, h: 100 },
      { id: "1080x1920", label: "1080 \u00D7 1920", desc: "Story / Reel", w: 56, h: 100 },
      { id: "1920x1080", label: "1920 \u00D7 1080", desc: "Widescreen / Header", w: 128, h: 72 },
      { id: "1200x630", label: "1200 \u00D7 630", desc: "Facebook link share", w: 120, h: 63 },
      { id: "8.5x11-digital", label: '8.5" \u00D7 11"', desc: "Digital flyer (letter)", w: 85, h: 110 },
      { id: "custom", label: "Custom", desc: "I'll specify", w: 100, h: 100 },
    ],
  },
  "banner-sign": {
    print: [
      { id: "33x81", label: '33" \u00D7 81"', desc: "Retractable banner", w: 40, h: 98 },
      { id: "2x6", label: "2' \u00D7 6'", desc: "Vinyl banner", w: 44, h: 132 },
      { id: "3x5", label: "3' \u00D7 5'", desc: "Outdoor sign", w: 72, h: 120 },
      { id: "4x8", label: "4' \u00D7 8'", desc: "Large format", w: 60, h: 120 },
      { id: "yard-sign", label: '18" \u00D7 24"', desc: "Yard sign", w: 75, h: 100 },
      { id: "window-sign", label: '24" \u00D7 36"', desc: "Window sign", w: 67, h: 100 },
      { id: "custom", label: "Custom", desc: "I'll specify", w: 80, h: 80 },
    ],
  },
  ad: {
    print: [
      { id: "quarter", label: "Quarter page", desc: "~3.5 \u00D7 4.5", w: 70, h: 90 },
      { id: "half", label: "Half page", desc: "~7.5 \u00D7 4.5", w: 120, h: 72 },
      { id: "full", label: "Full page", desc: "~7.5 \u00D7 10", w: 75, h: 100 },
    ],
  },
  presentation: {
    digital: [
      { id: "16x9", label: "16:9 Widescreen", desc: "Standard slides", w: 128, h: 72 },
      { id: "4x3", label: "4:3 Standard", desc: "Classic ratio", w: 100, h: 75 },
      { id: "custom", label: "Custom", desc: "I'll specify", w: 80, h: 80 },
    ],
  },
};

const PURPOSES = [
  { id: "event", icon: "\u25C9", label: "Promote an Event" },
  { id: "announce", icon: "\u25C7", label: "Make an Announcement" },
  { id: "recruit", icon: "\u25CB", label: "Recruit / Hire" },
  { id: "celebrate", icon: "\u2726", label: "Celebrate / Recognize" },
  { id: "inform", icon: "\u25A1", label: "Inform / Educate" },
  { id: "community", icon: "\u25CE", label: "Community Input" },
  { id: "elders", icon: "\u25B3", label: "Elders Gathering" },
  { id: "itk", icon: "\u25A0", label: "In the Know" },
  { id: "other", icon: "\u25C6", label: "Other" },
];

const STYLE_SECTIONS = [
  { id: "cultural", label: "Cultural & Community", icon: "\u25C9" },
  { id: "modern", label: "Modern & Classic", icon: "\u2726" },
  { id: "niche", label: "Niche & Specialty", icon: "\u25C6" },
];

const STYLES = [
  { id: "woodland", section: "cultural", label: "Woodland", desc: "Forest canopy, birch bark, river stone \u2014 rooted in Michigan's natural landscape", headingFont: "'Cambria', Georgia, serif", headingWeight: 700, bodyFont: "'Verdana', sans-serif", fontLabel: "Cambria Bold / Verdana", sampleHeading: "Woodland Gathering", sampleBody: "Where the forest meets the water.", palette: ["#2d5016", "#5c3d1e", "#8faa7b", "#d4c5a0", "#1a3a2a"], gradient: "linear-gradient(135deg, #1a3a2a 0%, #5c3d1e 35%, #8faa7b 70%, #d4c5a0 100%)", cardBg: "rgba(45,80,22,0.08)" },
  { id: "floral-applique", section: "cultural", label: "Floral Appliqu\u00E9", desc: "Beadwork-inspired florals, ribbon borders, rich textiles on dark or natural ground", headingFont: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", headingWeight: 700, bodyFont: "'Georgia', serif", fontLabel: "Palatino Bold / Georgia", sampleHeading: "Spring Celebration", sampleBody: "Beauty woven into every detail.", palette: ["#1a1a2e", "#c43a5c", "#e8b84b", "#3a7d5c", "#f0e4d4"], gradient: "linear-gradient(135deg, #1a1a2e 0%, #c43a5c 30%, #e8b84b 60%, #3a7d5c 100%)", cardBg: "rgba(196,58,92,0.07)" },
  { id: "nhbp-brand", section: "cultural", label: "NHBP Brand Standard", desc: "Official Nottawaseppi Huron Band colors, fonts, and identity guidelines", headingFont: "Tahoma, 'Segoe UI', sans-serif", headingWeight: 700, bodyFont: "Tahoma, 'Segoe UI', sans-serif", fontLabel: "Tahoma Bold / Tahoma", sampleHeading: "Mshik\u00E9 Communications", sampleBody: "Official brand. Consistent identity.", palette: ["#14A9A2", "#5F0C0E", "#094425", "#FAC6C7", "#BA0C2F"], gradient: "linear-gradient(135deg, #094425 0%, #14A9A2 35%, #5F0C0E 70%, #BA0C2F 100%)", cardBg: "rgba(20,169,162,0.07)" },
  { id: "cultural-heritage", section: "cultural", label: "Cultural & Heritage", desc: "Honoring tradition, natural textures, warm earth tones", headingFont: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", headingWeight: 700, bodyFont: "'Georgia', serif", fontLabel: "Palatino / Georgia", sampleHeading: "Honoring Our Roots", sampleBody: "Strength through heritage and community.", palette: ["#5F0C0E", "#094425", "#c8956b", "#f5e6d0", "#8B4513"], gradient: "linear-gradient(135deg, #f5e6d0 0%, #c8956b 40%, #094425 90%)", cardBg: "rgba(200,149,107,0.06)" },
  { id: "clean-pro", section: "modern", label: "Clean & Professional", desc: "Structured, trustworthy, corporate confidence", headingFont: "'Segoe UI', system-ui, sans-serif", headingWeight: 700, bodyFont: "'Segoe UI', system-ui, sans-serif", fontLabel: "Segoe UI / Segoe UI Light", sampleHeading: "Community Update", sampleBody: "Clear communication builds trust.", palette: ["#14A9A2", "#1a2332", "#ffffff", "#e8edf2", "#5f6b7a"], gradient: "linear-gradient(135deg, #f8fffe 0%, #e0f5f3 40%, #ffffff 100%)", cardBg: "rgba(240,252,251,0.06)" },
  { id: "bold-vibrant", section: "modern", label: "Bold & Vibrant", desc: "High energy, eye-catching, impossible to ignore", headingFont: "'Impact', 'Arial Black', sans-serif", headingWeight: 900, bodyFont: "'Trebuchet MS', sans-serif", fontLabel: "Impact / Trebuchet MS", sampleHeading: "DON'T MISS OUT", sampleBody: "Big moments deserve big presence.", palette: ["#BA0C2F", "#f7c948", "#14A9A2", "#1a1a2e", "#ff6b35"], gradient: "linear-gradient(135deg, #BA0C2F 0%, #f7c948 50%, #ff6b35 100%)", cardBg: "rgba(186,12,47,0.08)" },
  { id: "modern-minimal", section: "modern", label: "Modern Minimal", desc: "Sleek, spacious, every element intentional", headingFont: "'Helvetica Neue', Helvetica, Arial, sans-serif", headingWeight: 300, bodyFont: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontLabel: "Helvetica Neue Light / Helvetica Neue", sampleHeading: "Less is more", sampleBody: "Clarity through simplicity.", palette: ["#1a1a2e", "#14A9A2", "#ffffff", "#f0f0f0", "#6b7280"], gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 50%, #14A9A2 100%)", cardBg: "rgba(26,26,46,0.12)" },
  { id: "elegant-formal", section: "modern", label: "Elegant & Formal", desc: "Refined, serif-driven, understated luxury", headingFont: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", headingWeight: 400, bodyFont: "'Garamond', 'Times New Roman', serif", fontLabel: "Palatino / Garamond", sampleHeading: "Cordially Invited", sampleBody: "Distinction in every detail.", palette: ["#1a1a2e", "#5F0C0E", "#c9a96e", "#f5f1eb", "#4a4a5a"], gradient: "linear-gradient(135deg, #f5f1eb 0%, #e8ddd0 40%, #1a1a2e 100%)", cardBg: "rgba(95,12,14,0.06)" },
  { id: "art-deco", section: "niche", label: "Art Deco", desc: "Glamorous, geometric, golden-age sophistication", headingFont: "'Copperplate', 'Copperplate Gothic', 'Times New Roman', serif", headingWeight: 700, bodyFont: "'Garamond', 'Times New Roman', serif", fontLabel: "Copperplate / Garamond", sampleHeading: "ANNUAL GALA", sampleBody: "An evening of elegance and tradition.", palette: ["#1a1a2e", "#c9a96e", "#2d4a3e", "#f5f1eb", "#8b6f47"], gradient: "linear-gradient(135deg, #1a1a2e 0%, #c9a96e 45%, #2d4a3e 100%)", cardBg: "rgba(201,169,110,0.07)" },
  { id: "retro-vintage", section: "niche", label: "Retro / Vintage", desc: "Nostalgic, warm, timeless throwback charm", headingFont: "'Rockwell', 'Courier New', serif", headingWeight: 700, bodyFont: "'Georgia', serif", fontLabel: "Rockwell / Georgia", sampleHeading: "Throwback Fair", sampleBody: "Good times never go out of style.", palette: ["#d4572a", "#f4d35e", "#2a4858", "#faf3e3", "#8b5e3c"], gradient: "linear-gradient(135deg, #faf3e3 0%, #f4d35e 40%, #d4572a 100%)", cardBg: "rgba(212,87,42,0.06)" },
  { id: "hand-drawn", section: "niche", label: "Hand-Drawn / Organic", desc: "Whimsical, artistic, personal warmth", headingFont: "'Comic Sans MS', 'Segoe Script', cursive", headingWeight: 700, bodyFont: "'Trebuchet MS', sans-serif", fontLabel: "Segoe Script / Trebuchet MS", sampleHeading: "Youth Camp 2026", sampleBody: "Where creativity comes alive!", palette: ["#e76f51", "#2a9d8f", "#e9c46a", "#264653", "#f4a261"], gradient: "linear-gradient(135deg, #e9c46a 0%, #2a9d8f 45%, #e76f51 100%)", cardBg: "rgba(233,196,106,0.06)" },
  { id: "flat-contemporary", section: "niche", label: "Flat & Contemporary", desc: "Crisp edges, solid colors, digital-first clarity", headingFont: "'Segoe UI', system-ui, sans-serif", headingWeight: 600, bodyFont: "'Segoe UI', system-ui, sans-serif", fontLabel: "Segoe UI Semibold / Segoe UI", sampleHeading: "New Program Launch", sampleBody: "Simple. Direct. Effective.", palette: ["#3b82f6", "#ef4444", "#10b981", "#f8fafc", "#1e293b"], gradient: "linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #f8fafc 100%)", cardBg: "rgba(59,130,246,0.06)" },
];

const PALETTE_MODIFIERS = [
  { id: "default", label: "Style Default", desc: "Use this style's natural colors", colors: null, icon: "\u25C6" },
  { id: "nhbp-brand", label: "NHBP Brand Standard", desc: "Official tribal branding", colors: ["#14A9A2", "#5F0C0E", "#094425", "#FAC6C7", "#BA0C2F"], icon: "\u25C9" },
  { id: "spring", label: "Spring Fresh", desc: "Light greens, soft pastels, renewal", colors: ["#7ec8a0", "#f0c6d4", "#a8d8ea", "#fff9c4", "#c5e1a5"], icon: "\u25CB" },
  { id: "summer", label: "Summer Bold", desc: "Warm brights, sunny energy, golden", colors: ["#ff6b35", "#f7c948", "#00b4d8", "#ff8fab", "#ffd60a"], icon: "\u25A0" },
  { id: "autumn", label: "Autumn Warm", desc: "Rich oranges, deep reds, harvest gold", colors: ["#bc4b21", "#e89b3f", "#5c3d2e", "#d4a574", "#8b2500"], icon: "\u25B3" },
  { id: "winter", label: "Winter Cool", desc: "Icy blues, deep navy, silver accents", colors: ["#1a3a5c", "#87aec5", "#c0d6e4", "#f0f4f8", "#4a6fa5"], icon: "\u25C7" },
  { id: "trending-2026", label: "Trending 2026", desc: "Current design trend colors", colors: ["#6c5ce7", "#00cec9", "#fd79a8", "#ffeaa7", "#2d3436"], icon: "\u2726" },
  { id: "custom", label: "Custom Colors", desc: "Describe what you need", colors: null, icon: "\u25CE" },
];

const VERBIAGE_KEYWORDS = {
  "Health & Wellness": ["Healthy Start","Playgroup","Immunizations","Mental Health","Wellness Check","Nutrition","Diabetes Prevention","Substance Abuse","Recovery","Prenatal Care","Maternal Health","Fitness Program","Health Fair","Screening Event","CPR Training","Food Sovereignty","Dental Health","Vision Screening","Fishing","Walk-In Clinic"],
  "Community & Events": ["Community Gathering","Powwow","Feast","Open House","Family Night","Youth Activity","Elder Event","Holiday Celebration","Fundraiser","Volunteer","Back to School","Summer Camp","Workshop","Training Session","Town Hall","Family Retreat","Men's Retreat","Women's Retreat","Movie Night","Field Trip"],
  "Government & Services": ["Enrollment","Benefits","Housing","Employment","Job Fair","Legal Aid","Tax Assistance","Social Services","Emergency Assistance","Census","Tribal Council","Public Comment","Election","Meeting Notice","Per Capita","Background Check","ID Services","Court Notice","Budget Hearing","Food Distribution"],
  "Culture & Education": ["Language Class","Cultural Workshop","Storytelling","Beadwork","Regalia","Scholarship","Tutoring","GED Program","College Prep","Graduation","Library Event","STEM Program","Art Class","History","Heritage Month","Drum Circle","Lacrosse","Traditional Medicine","Land Acknowledgment","Museum Exhibit"],
  "General": ["Announcement","Reminder","Deadline","Registration","RSVP Required","Free Event","Refreshments Provided","Childcare Available","Transportation Provided","Limited Spots","All Ages","Members Only","New Program","Updated Hours","Closure Notice","Save the Date","Now Hiring","Survey","Thank You","Congratulations"],
};

const ALL_KEYWORDS = Object.values(VERBIAGE_KEYWORDS).flat();

const VD_PRIORITIES = [
  { id: "standard", label: "Standard", desc: "2\u20133 weeks", color: WF.accent },
  { id: "priority", label: "Priority", desc: "1\u20132 weeks", color: "#e0a630" },
  { id: "urgent", label: "Urgent", desc: "Within 5 business days", color: WF.red },
];

// ═══════════════════════════════════════════════════════════
//  LOCAL GLASS CARD (with hoverGlow support for style cards)
// ═══════════════════════════════════════════════════════════
const Glass = ({ children, active, onClick, style: s = {}, hoverGlow }) => {
  const [h, setH] = useState(false);
  const gc = hoverGlow || WF.accent;
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: active
          ? `linear-gradient(168deg, ${gc}22 0%, ${gc}14 40%, ${gc}0A 100%)`
          : "linear-gradient(168deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.03) 100%)",
        backdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4)) brightness(var(--glass-brightness,1.12)) contrast(var(--glass-contrast,1.05))",
        WebkitBackdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4)) brightness(var(--glass-brightness,1.12)) contrast(var(--glass-contrast,1.05))",
        border: `1px solid ${active ? gc + "55" : h && onClick ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.14)"}`,
        borderRadius: 16, transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: onClick ? "pointer" : "default",
        boxShadow: active
          ? `0 8px 32px ${gc}20, 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04)`
          : h && onClick
            ? `0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.16)`
            : `0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(255,255,255,0.03)`,
        transform: h && onClick ? "translateY(-2px) scale(1.005)" : "none",
        position: "relative", overflow: "hidden", ...s,
      }}>
      {/* Specular highlight */}
      <div style={{ position: "absolute", left: "8%", right: "8%", top: 0, height: "35%", pointerEvents: "none",
        background: `linear-gradient(180deg, ${active ? gc + "20" : "rgba(255,255,255,0.1)"} 0%, transparent 100%)`,
        maskImage: "linear-gradient(180deg, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
      }} />
      {/* Edge rim */}
      <div style={{ position: "absolute", left: "5%", right: "5%", top: 0, height: 1, pointerEvents: "none",
        background: `linear-gradient(90deg, transparent, ${active ? gc + "45" : "rgba(255,255,255,0.18)"}, transparent)`,
      }} />
      {/* Bottom catchlight */}
      <div style={{ position: "absolute", left: "10%", right: "10%", bottom: 0, height: 1, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
      }} />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
};

// ═══ SECTION CARD — Liquid Glass (content step glow) ═══
const SectionCard = ({ icon, title, subtitle, children, isDone }) => {
  const gc = isDone ? WF.pink : WF.accent;
  const bc = isDone ? WF.pink : WF.accent;
  return (
    <div style={{
      background: isDone
        ? `linear-gradient(168deg, ${WF.pink}22 0%, ${WF.pink}12 40%, ${WF.pink}08 100%)`
        : `linear-gradient(168deg, ${WF.accent}1A 0%, ${WF.accent}0D 40%, ${WF.accent}07 100%)`,
      backdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4)) brightness(var(--glass-brightness,1.12))",
      WebkitBackdropFilter: "blur(var(--glass-blur,24px)) saturate(var(--glass-saturation,1.4)) brightness(var(--glass-brightness,1.12))",
      border: `1px solid ${bc}${isDone ? "40" : "30"}`,
      borderRadius: 18, padding: "20px 20px 22px",
      boxShadow: isDone
        ? `0 8px 32px ${gc}18, 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(255,255,255,0.04)`
        : `0 4px 20px ${gc}0D, 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.03)`,
      transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden",
    }}>
    {/* Specular top shine */}
    <div style={{ position: "absolute", left: "8%", right: "8%", top: 0, height: "30%", pointerEvents: "none",
      background: `linear-gradient(180deg, ${isDone ? WF.pink + "15" : "rgba(255,255,255,0.08)"} 0%, transparent 100%)`,
      maskImage: "linear-gradient(180deg, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 100%)",
    }} />
    {/* Edge rim */}
    <div style={{ position: "absolute", left: "5%", right: "5%", top: 0, height: 1, pointerEvents: "none",
      background: `linear-gradient(90deg, transparent, ${isDone ? WF.pink + "35" : "rgba(255,255,255,0.15)"}, transparent)`,
    }} />
    <div style={{ position: "relative", zIndex: 2 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 20, filter: isDone ? "none" : "grayscale(0.3)" }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: isDone ? WF.pink : "rgba(255,255,255,0.8)", letterSpacing: "0.02em" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>{subtitle}</div>}
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
          background: isDone ? WF.pink : `${WF.accent}20`,
          border: `2px solid ${isDone ? WF.pink : WF.accent + "40"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.4s ease",
          boxShadow: isDone ? `0 0 12px ${WF.pink}40` : `0 0 8px ${WF.accentGlow}`,
        }}>
          {isDone
            ? <span style={{ color: FC.dark, fontSize: 12, fontWeight: 800 }}>{"✓"}</span>
            : <div style={{ width: 6, height: 6, borderRadius: "50%", background: WF.accent, opacity: 0.5, animation: "pulse 2s ease-in-out infinite" }} />
          }
        </div>
      </div>
      <div>{children}</div>
    </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function VisualDesignPage() {
  const router = useRouter();
  const { nightMode, toggleNight } = useNightMode();
  const [step, setStep] = useState(0);
  const [anim, setAnim] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [form, setForm] = useState({
    pieceType: null, format: null, size: null, customSize: "",
    multiPage: false, pageCount: "", multiPageType: null, specialRequest: false, specialRequestNote: "",
    gsrDescription: "", gsrName: "", gsrDepartment: "", gsrEmail: "", gsrDeadline: "",
    purpose: null, styleDir: null, designerChoice: false, paletteModifier: "default", customPalette: "",
    headline: "", bodyText: "", needVerbiage: false, verbiageKeywords: [], keywordSearch: "", customKeyword: "",
    eventDate: "", eventTime: "", eventLocation: "",
    contactTitle: "", contactName: "", contactPhone: "", contactEmail: "",
    inspiration: "", notes: "",
    priority: null, deadline: "", needPrinting: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticket, setTicket] = useState("");
  const [previewGradient, setPreviewGradient] = useState(null);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);
  const inputRef = useRef(null);
  const totalSteps = 9;

  useEffect(() => {
    const h = (e) => setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  useEffect(() => {
    if (inputRef.current) setTimeout(() => inputRef.current?.focus(), 350);
  }, [step]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const goNext = () => {
    if (anim) return;
    setAnim(true);
    setTimeout(() => {
      if (step < totalSteps - 1) setStep(s => s + 1);
      else { setTicket(`WF-${Math.floor(Math.random() * 9000) + 1000}`); setSubmitted(true); }
      setAnim(false);
    }, 280);
  };

  const goBack = () => {
    if (anim || step === 0) return;
    setAnim(true);
    const skipFormat = ["digital-flyer", "printed-media", "presentation", "ad", "banner-sign", "special-request"].includes(form.pieceType);
    const target = (step === 2 && skipFormat) ? 0 : step - 1;
    setTimeout(() => { setStep(target); setAnim(false); }, 280);
  };

  const canAdvance = () => {
    switch (step) {
      case 0: return !!form.pieceType;
      case 1: return !!form.format;
      case 2: return form.pieceType === "printed-media"
        ? (!!form.size || form.multiPage || form.specialRequest)
        : form.pieceType === "special-request"
        ? (form.gsrDescription.trim().length > 0 && form.gsrName.trim().length > 0 && form.gsrEmail.trim().length > 0 && !!form.gsrDeadline)
        : !!form.size;
      case 3: return !!form.purpose;
      case 4: return !!form.styleDir || form.designerChoice;
      case 5: return !!form.headline.trim();
      case 6: return true;
      case 7: return !!form.priority;
      case 8: return true;
      default: return true;
    }
  };

  const getSizes = () => {
    const type = form.pieceType;
    const fmt = form.format === "both" ? "print" : form.format;
    if (!type || !fmt) return [];
    const typeSizes = SIZES[type];
    if (!typeSizes) return SIZES["digital-flyer"].digital;
    return typeSizes[fmt] || typeSizes.digital || typeSizes.print || [];
  };

  const getActivePalette = () => {
    if (form.paletteModifier === "default" || form.paletteModifier === "custom") {
      const style = STYLES.find(s => s.id === form.styleDir);
      return style ? style.palette : ["#666", "#888", "#aaa", "#ccc", "#eee"];
    }
    const mod = PALETTE_MODIFIERS.find(m => m.id === form.paletteModifier);
    return mod?.colors || ["#666", "#888", "#aaa", "#ccc", "#eee"];
  };

  // ═══ PREVIEW GRADIENT BUILDER ═══
  const buildPreviewGradient = (palette) => {
    if (!palette || palette.length === 0) return null;
    const stops = palette.map((c, i) => `${c} ${Math.round((i / (palette.length - 1)) * 100)}%`).join(", ");
    return `linear-gradient(135deg, ${stops})`;
  };

  // Update preview when style or palette modifier changes
  useEffect(() => {
    if (submitted) { setPreviewGradient(null); return; }
    if (step === 4 && (form.styleDir || form.designerChoice)) {
      if (form.designerChoice) { setPreviewGradient(null); return; }
      const style = STYLES.find(s => s.id === form.styleDir);
      if (!style) { setPreviewGradient(null); return; }
      if (form.paletteModifier === "default" || form.paletteModifier === "custom") {
        setPreviewGradient(buildPreviewGradient(style.palette));
      } else {
        const mod = PALETTE_MODIFIERS.find(m => m.id === form.paletteModifier);
        setPreviewGradient(mod?.colors ? buildPreviewGradient(mod.colors) : buildPreviewGradient(style.palette));
      }
    } else if (step >= 5 && step <= 8 && form.styleDir && !form.designerChoice) {
      // Keep the preview alive through all remaining steps until submit
      const activePal = getActivePalette();
      setPreviewGradient(buildPreviewGradient(activePal));
    } else {
      setPreviewGradient(null);
    }
  }, [step, form.styleDir, form.designerChoice, form.paletteModifier, submitted]);

  // Clear gradient on unmount (safety net for browser back, etc.)
  useEffect(() => () => setPreviewGradient(null), []);

  // ═══ WOLF FLOW BACKGROUND ═══
  const BG = () => (
    <>
      <PortalBackground nightMode={nightMode} />
      {/* Full palette background — completely replaces the image when a style is chosen */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background: previewGradient || "transparent",
        opacity: (previewGradient && !isNavigatingAway) ? 1 : 0,
        transition: isNavigatingAway ? "none" : "opacity 0.8s cubic-bezier(0.4,0,0.2,1), background 0.8s cubic-bezier(0.4,0,0.2,1)",
      }} />
      {/* Subtle scrim over the palette for text readability */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.3) 100%)",
        opacity: (previewGradient && !isNavigatingAway) ? 1 : 0,
        transition: isNavigatingAway ? "none" : "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none",
        background: `radial-gradient(ellipse 700px 500px at ${mousePos.x}% ${mousePos.y}%, ${WF.accent}06, transparent)`,
        transition: "background 0.8s ease",
      }} />
      <style>{`
        input:focus, textarea:focus { border-color: ${WF.accent} !important; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18); }
        ::selection { background: ${WF.accent}40; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 50% { transform: translateX(100%); } 100% { transform: translateX(100%); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.3); } }
        .style-grid::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );

  const slideStyle = {
    width: "100%", maxWidth: 720,
    transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
    opacity: anim ? 0 : 1, transform: anim ? "translateY(20px)" : "translateY(0)",
  };

  const StepLabel = ({ n }) => (
    <p style={{ fontSize: 11, color: FC.textDim, letterSpacing: "0.2em", marginBottom: 12, fontFamily: "monospace" }}>
      {String(n).padStart(2, "0")} / {totalSteps}
    </p>
  );

  const Q = ({ children }) => (
    <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, lineHeight: 1.25, margin: "0 0 8px", letterSpacing: "-0.015em", color: FC.textPrimary, fontFamily: FONT }}>{children}</h2>
  );

  const Hint = ({ children }) => (
    <p style={{ fontSize: 13, color: FC.textDim, margin: "0 0 26px", lineHeight: 1.5, fontFamily: FONT }}>{children}</p>
  );

  const localInput = {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: `1px solid rgba(255,255,255,0.16)`, borderRadius: 10,
    color: FC.textPrimary, fontSize: 14, fontFamily: FONT,
    padding: "12px 14px", outline: "none", caretColor: WF.accent,
    boxSizing: "border-box", transition: `border-color ${CLICK.duration}`,
  };

  // ═══ CONFIRMATION SCREEN ═══
  if (submitted) {
    const selectedStyle = STYLES.find(s => s.id === form.styleDir);
    const activePalette = getActivePalette();
    return (
      <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <BG />
        <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center", zIndex: 1 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: `linear-gradient(135deg, ${WF.accent}, ${WF.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: "#fff", marginBottom: 24, boxShadow: `0 0 50px ${WF.accentGlow}` }}>{"✓"}</div>
          <h1 style={{ fontSize: 30, fontWeight: 300, margin: "0 0 16px", fontFamily: FONT }}>{"Request submitted!"}</h1>
          <Glass style={{ padding: "12px 28px", marginBottom: 20 }}>
            <span style={{ fontSize: 10, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.15em", display: "block" }}>{form.pieceType === "special-request" ? "Special Request" : "Visual Design Request"}</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: WF.accentLight, fontFamily: "monospace" }}>{ticket}</span>
          </Glass>
          <Glass style={{ padding: "18px 24px", maxWidth: 440, width: "100%", textAlign: "left" }}>
            {form.pieceType === "special-request" ? (
              <>
                {[
                  ["Type", "\u2B50 General Special Request"],
                  ["Name", form.gsrName],
                  ["Department", form.gsrDepartment || "\u2014"],
                  ["Email", form.gsrEmail],
                  ["Completed By", form.gsrDeadline],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <span style={{ fontSize: 12, color: FC.textDim }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: FC.textSecondary }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 10, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.1em" }}>{"Description"}</span>
                  <p style={{ fontSize: 12, color: FC.textSecondary, lineHeight: 1.6, margin: "6px 0 0" }}>{form.gsrDescription}</p>
                </div>
              </>
            ) : (
              <>
                {[
                  ["Type", PIECE_TYPES.find(p => p.id === form.pieceType)?.label],
                  ["Format", FORMAT_OPTIONS.find(f => f.id === form.format)?.label],
                  ["Size", form.pieceType === "printed-media" ? (
                    form.multiPage ? `Multi-Page (${[{id:"booklet",l:"Booklet"},{id:"pamphlet",l:"Pamphlet"},{id:"book",l:"Book"},{id:"program",l:"Program"},{id:"newsletter",l:"Newsletter"},{id:"catalog",l:"Catalog"},{id:"other-mp",l:"Other"}].find(t=>t.id===form.multiPageType)?.l || "TBD"})`
                    : form.specialRequest ? "Special Request"
                    : form.size === "custom" ? form.customSize || "Custom"
                    : PRINTED_MEDIA_SIZES.flatMap(c => c.sizes).find(s => s.id === form.size)?.label || form.size
                  ) : (form.size === "custom" ? form.customSize || "Custom" : getSizes().find(s => s.id === form.size)?.label)],
                  ["Purpose", PURPOSES.find(p => p.id === form.purpose)?.label],
                  ["Style", form.designerChoice ? "Designer's Choice" : selectedStyle?.label],
                  ["Fonts", form.designerChoice ? "Designer's discretion" : selectedStyle?.fontLabel],
                  ["Colors", form.designerChoice ? "Designer's discretion" : PALETTE_MODIFIERS.find(m => m.id === form.paletteModifier)?.label],
                  ["Priority", VD_PRIORITIES.find(p => p.id === form.priority)?.label],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <span style={{ fontSize: 12, color: FC.textDim }}>{k}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {k === "Colors" && activePalette && (
                        <div style={{ display: "flex", gap: 0, borderRadius: 4, overflow: "hidden" }}>
                          {activePalette.slice(0, 5).map((c, j) => <div key={j} style={{ width: 12, height: 10, background: c }} />)}
                        </div>
                      )}
                      <span style={{ fontSize: 13, fontWeight: 600, color: k === "Priority" ? VD_PRIORITIES.find(p => p.id === form.priority)?.color : FC.textSecondary }}>{v}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Glass>
          <p style={{ fontSize: 13, color: FC.textDim, marginTop: 20, lineHeight: 1.6, maxWidth: 360, fontFamily: FONT }}>
            {"The Communications team will review your request and follow up within 24 hours."}
          </p>
        </div>
        <PageNav
          onBack={undefined}
          onHome={() => { setIsNavigatingAway(true); setPreviewGradient(null); router.push("/?page=services"); }}
        />
        <Footer />
      </div>
    );
  }

  // ══��� STEP RENDERER ═���═
  const renderStep = () => {
    switch (step) {

      // STEP 1: What are we making?
      case 0:
        return (
          <div style={slideStyle}>
            <StepLabel n={1} />
            <Q>{"What are we making?"}</Q>
            <Hint>{"Choose the type of piece you need designed"}</Hint>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
              {PIECE_TYPES.map(p => (
                <Glass key={p.id} active={form.pieceType === p.id}
                  onClick={() => {
                    set("pieceType", p.id); set("size", null);
                    if (p.id === "digital-flyer") { set("format", "digital"); setTimeout(() => { setAnim(true); setTimeout(() => { setStep(2); setAnim(false); }, 280); }, 350); }
                    else if (p.id === "printed-media" || p.id === "ad" || p.id === "banner-sign") { set("format", "print"); setTimeout(() => { setAnim(true); setTimeout(() => { setStep(2); setAnim(false); }, 280); }, 350); }
                    else if (p.id === "presentation") { set("format", "digital"); setTimeout(() => { setAnim(true); setTimeout(() => { setStep(2); setAnim(false); }, 280); }, 350); }
                    else if (p.id === "special-request") { set("format", null); setTimeout(() => { setAnim(true); setTimeout(() => { setStep(2); setAnim(false); }, 280); }, 350); }
                    else { set("format", null); setTimeout(() => goNext(), 350); }
                  }}
                  style={{ padding: "18px 16px" }}>
                  <span style={{ fontSize: 26, display: "block", marginBottom: 6, filter: form.pieceType === p.id ? `drop-shadow(0 0 6px ${WF.accentGlow})` : "none" }}>{p.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: FC.textPrimary, display: "block", fontFamily: FONT }}>{p.label}</span>
                  <span style={{ fontSize: 11, color: FC.textDim, lineHeight: 1.4, fontFamily: FONT }}>{p.desc}</span>
                </Glass>
              ))}
            </div>
          </div>
        );

      // STEP 2: Format
      case 1:
        return (
          <div style={slideStyle}>
            <StepLabel n={2} />
            <Q>{"Digital, print, or both?"}</Q>
            <Hint>{"This determines sizing options and production needs"}</Hint>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 520 }}>
              {FORMAT_OPTIONS.map(f => (
                <Glass key={f.id} active={form.format === f.id}
                  onClick={() => { set("format", f.id); set("size", null); setTimeout(goNext, 350); }}
                  style={{ padding: "22px 16px", textAlign: "center" }}>
                  <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>{f.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: FC.textPrimary, display: "block", fontFamily: FONT }}>{f.label}</span>
                  <span style={{ fontSize: 11, color: FC.textDim, fontFamily: FONT }}>{f.desc}</span>
                </Glass>
              ))}
            </div>
            {(form.format === "print" || form.format === "both") && (
              <div style={{ marginTop: 20, animation: "fadeSlide 0.3s ease" }}>
                <Hint>{"Do you need us to handle printing too?"}</Hint>
                <div style={{ display: "flex", gap: 10 }}>
                  {[{ id: true, label: "Yes, handle printing" }, { id: false, label: "Just design files" }].map(o => (
                    <Glass key={String(o.id)} active={form.needPrinting === o.id} onClick={() => set("needPrinting", o.id)} style={{ padding: "12px 20px" }}>
                      <span style={{ fontSize: 13, color: form.needPrinting === o.id ? WF.accentLight : FC.textSecondary, fontFamily: FONT }}>{o.label}</span>
                    </Glass>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      // STEP 3: Size
      case 2: {
        if (form.pieceType === "printed-media") {
          return (
            <div style={slideStyle}>
              <StepLabel n={3} />
              <Q>{"What are you printing?"}</Q>
              <Hint>{"Select a size, or tell us about a multi-page project"}</Hint>
              <div style={{ maxWidth: 540 }}>
                {PRINTED_MEDIA_SIZES.map(cat => (
                  <div key={cat.cat} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, color: FC.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, fontFamily: FONT }}>{cat.cat}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {cat.sizes.map(s => (
                        <Glass key={s.id} active={form.size === s.id}
                          onClick={() => { set("size", s.id); set("multiPage", false); set("specialRequest", false); }}
                          style={{ padding: "12px 14px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 90 }}>
                          <div style={{ width: Math.min(s.w, 100) * 0.55, height: Math.min(s.h, 100) * 0.55, border: `2px solid ${form.size === s.id ? WF.accent : "rgba(255,255,255,0.1)"}`, borderRadius: 3, marginBottom: 8, background: form.size === s.id ? `${WF.accent}10` : "rgba(255,255,255,0.02)", transition: "all 0.3s ease" }} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: FC.textPrimary, textAlign: "center", fontFamily: FONT }}>{s.label}</span>
                          <span style={{ fontSize: 9, color: FC.textDim, textAlign: "center", fontFamily: FONT }}>{s.desc}</span>
                        </Glass>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ marginBottom: 18 }}>
                  <Glass active={form.size === "custom"} onClick={() => { set("size", "custom"); set("multiPage", false); set("specialRequest", false); }} style={{ padding: "12px 16px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{"\u{1F4D0}"}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: FC.textSecondary, fontFamily: FONT }}>{"Custom Size"}</span>
                  </Glass>
                  {form.size === "custom" && (
                    <div style={{ marginTop: 10, animation: "fadeSlide 0.3s ease" }}>
                      <input ref={inputRef} placeholder='Describe the size (e.g. "24 \u00D7 36 inches")' value={form.customSize} onChange={e => set("customSize", e.target.value)}
                        style={{ width: "100%", maxWidth: 400, background: "transparent", border: "none", borderBottom: `2px solid ${FC.border}`, color: FC.textPrimary, fontSize: 16, fontFamily: FONT, padding: "12px 0", outline: "none", caretColor: WF.accent }} />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                  <span style={{ fontSize: 10, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONT }}>{"additional options"}</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <button type="button" onClick={() => { set("multiPage", !form.multiPage); if (!form.multiPage) { set("size", null); set("specialRequest", false); } }}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "14px 16px", borderRadius: 12, cursor: "pointer", background: form.multiPage ? `${WF.accent}12` : "rgba(255,255,255,0.02)", border: `1px solid ${form.multiPage ? WF.accent + "40" : FC.border}`, transition: "all 0.3s ease", fontFamily: FONT, WebkitAppearance: "none", textAlign: "left" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, border: `2px solid ${form.multiPage ? WF.accent : "rgba(255,255,255,0.15)"}`, background: form.multiPage ? WF.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                      {form.multiPage && <span style={{ color: FC.dark, fontSize: 11, fontWeight: 700 }}>{"✓"}</span>}
                    </div>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: form.multiPage ? WF.accentLight : FC.textSecondary, display: "block" }}>{"\u{1F4DA} Multi-Page Material"}</span>
                      <span style={{ fontSize: 10, color: FC.textDim }}>{"Books, pamphlets, booklets, programs, etc."}</span>
                    </div>
                  </button>
                  {form.multiPage && (
                    <div style={{ marginTop: 12, paddingLeft: 4, animation: "fadeSlide 0.3s ease" }}>
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ fontSize: 10, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"What type?"}</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {[{id:"booklet",label:"Booklet"},{id:"pamphlet",label:"Pamphlet"},{id:"book",label:"Book"},{id:"program",label:"Program"},{id:"newsletter",label:"Newsletter"},{id:"catalog",label:"Catalog"},{id:"other-mp",label:"Other"}].map(t => (
                            <Glass key={t.id} active={form.multiPageType === t.id} onClick={() => set("multiPageType", t.id)} style={{ padding: "8px 14px" }}>
                              <span style={{ fontSize: 12, color: form.multiPageType === t.id ? WF.accentLight : FC.textSecondary, fontFamily: FONT }}>{t.label}</span>
                            </Glass>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <label style={{ fontSize: 10, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"Estimated page count (if known)"}</label>
                        <input placeholder="e.g. 12, 24, 48..." value={form.pageCount} onChange={e => set("pageCount", e.target.value)} style={{ ...localInput, fontSize: 16, maxWidth: 200 }} />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <button type="button" onClick={() => { set("specialRequest", !form.specialRequest); if (!form.specialRequest) { set("size", null); set("multiPage", false); } }}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "14px 16px", borderRadius: 12, cursor: "pointer", background: form.specialRequest ? `${WF.pink}12` : "rgba(255,255,255,0.02)", border: `1px solid ${form.specialRequest ? WF.pink + "40" : FC.border}`, transition: "all 0.3s ease", fontFamily: FONT, WebkitAppearance: "none", textAlign: "left" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, border: `2px solid ${form.specialRequest ? WF.pink : "rgba(255,255,255,0.15)"}`, background: form.specialRequest ? WF.pink : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                      {form.specialRequest && <span style={{ color: FC.dark, fontSize: 11, fontWeight: 700 }}>{"✓"}</span>}
                    </div>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: form.specialRequest ? WF.pink : FC.textSecondary, display: "block" }}>{"\u2B50 Special Request"}</span>
                      <span style={{ fontSize: 10, color: FC.textDim }}>{"Something unique \u2014 we'll follow up to discuss details"}</span>
                    </div>
                  </button>
                  {form.specialRequest && (
                    <div style={{ marginTop: 12, paddingLeft: 4, animation: "fadeSlide 0.3s ease" }}>
                      <textarea placeholder="Brief description of what you need (optional \u2014 we'll reach out either way)" value={form.specialRequestNote} onChange={e => set("specialRequestNote", e.target.value)}
                        style={{ ...localInput, fontSize: 14, minHeight: 80, resize: "vertical", lineHeight: 1.6, borderRadius: 10 }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
        if (form.pieceType === "special-request") {
          return (
            <div style={slideStyle}>
              <StepLabel n={2} />
              <Q>{"Tell us what you need"}</Q>
              <Hint>{"We'll follow up to discuss the details"}</Hint>
              <div style={{ maxWidth: 500 }}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 11, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F4DD} Brief Description"}</label>
                  <textarea placeholder="Describe what you're looking for \u2014 the more detail, the faster we can help." value={form.gsrDescription} onChange={e => set("gsrDescription", e.target.value)} style={{ ...localInput, fontSize: 16, minHeight: 120, resize: "vertical", lineHeight: 1.7, borderRadius: 12 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0 18px" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                  <span style={{ fontSize: 10, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONT }}>{"contact information"}</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F464} Name"}</label>
                  <input placeholder="Your full name" value={form.gsrName} onChange={e => set("gsrName", e.target.value)} style={{ ...localInput, fontSize: 16 }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F3E2} Department"}</label>
                  <input placeholder="Your department" value={form.gsrDepartment} onChange={e => set("gsrDepartment", e.target.value)} style={{ ...localInput, fontSize: 16 }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F4E7} Email"}</label>
                  <input type="email" placeholder="your.email@nhbp-nsn.gov" value={form.gsrEmail} onChange={e => set("gsrEmail", e.target.value)} style={{ ...localInput, fontSize: 16 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0 18px" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                  <span style={{ fontSize: 10, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONT }}>{"timeline"}</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>
                <div style={{ marginBottom: 22 }}>
                  <label style={{ fontSize: 11, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F4C5} Completed By"}</label>
                  <input type="date" value={form.gsrDeadline} onChange={e => set("gsrDeadline", e.target.value)} style={{ ...localInput, colorScheme: "dark", fontSize: 16 }} />
                </div>
                {form.gsrDescription.trim() && form.gsrName.trim() && form.gsrEmail.trim() && form.gsrDeadline && (
                  <button type="button" onClick={() => { setAnim(true); setTimeout(() => { setTicket(`WF-${Math.floor(Math.random() * 9000) + 1000}`); setSubmitted(true); setAnim(false); }, 280); }}
                    style={{ width: "100%", padding: "16px 24px", borderRadius: 14, cursor: "pointer", background: `linear-gradient(135deg, ${WF.accent}, ${WF.accentLight})`, border: "none", fontFamily: FONT, fontSize: 15, fontWeight: 700, color: FC.dark, letterSpacing: "0.03em", boxShadow: `0 4px 20px ${WF.accentGlow}`, animation: "fadeSlide 0.3s ease" }}>
                    {"Submit Special Request \u2B50"}
                  </button>
                )}
              </div>
            </div>
          );
        }
        const sizes = getSizes();
        return (
          <div style={slideStyle}>
            <StepLabel n={3} />
            <Q>{"What size do you need?"}</Q>
            <Hint>{"Select a size \u2014 the shapes show actual proportions"}</Hint>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-end" }}>
              {sizes.map(s => (
                <Glass key={s.id} active={form.size === s.id}
                  onClick={() => { set("size", s.id); if (s.id !== "custom") setTimeout(goNext, 400); }}
                  style={{ padding: "14px 16px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 100 }}>
                  <div style={{ width: Math.min(s.w, 120) * 0.7, height: Math.min(s.h, 120) * 0.7, border: `2px solid ${form.size === s.id ? WF.accent : "rgba(255,255,255,0.1)"}`, borderRadius: 4, marginBottom: 10, background: form.size === s.id ? `${WF.accent}10` : "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}>
                    <div style={{ width: "60%", height: 2, background: "rgba(255,255,255,0.06)", position: "absolute", top: "25%" }} />
                    <div style={{ width: "40%", height: 2, background: "rgba(255,255,255,0.04)", position: "absolute", top: "40%" }} />
                    <div style={{ width: "70%", height: "30%", background: "rgba(255,255,255,0.03)", position: "absolute", bottom: "15%", borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: FC.textPrimary, textAlign: "center", fontFamily: FONT }}>{s.label}</span>
                  <span style={{ fontSize: 10, color: FC.textDim, textAlign: "center", fontFamily: FONT }}>{s.desc}</span>
                </Glass>
              ))}
            </div>
            {form.size === "custom" && (
              <div style={{ marginTop: 18, animation: "fadeSlide 0.3s ease" }}>
                <input ref={inputRef} placeholder='Describe the size (e.g. "24 \u00D7 36 inches")' value={form.customSize} onChange={e => set("customSize", e.target.value)} onKeyDown={e => { if (e.key === "Enter" && form.customSize.trim()) goNext(); }}
                  style={{ width: "100%", maxWidth: 400, background: "transparent", border: "none", borderBottom: `2px solid ${FC.border}`, color: FC.textPrimary, fontSize: 16, fontFamily: FONT, padding: "12px 0", outline: "none", caretColor: WF.accent }} />
              </div>
            )}
          </div>
        );
      }

      // STEP 4: Purpose
      case 3:
        return (
          <div style={slideStyle}>
            <StepLabel n={4} />
            <Q>{"What's the purpose?"}</Q>
            <Hint>{"Helps our designers understand context before they start"}</Hint>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 540 }}>
              {PURPOSES.map(p => (
                <Glass key={p.id} active={form.purpose === p.id} onClick={() => { set("purpose", p.id); setTimeout(goNext, 350); }} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{p.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: FC.textPrimary, fontFamily: FONT }}>{p.label}</span>
                </Glass>
              ))}
            </div>
          </div>
        );

      // STEP 5: Style Direction + Color Palette
      case 4: {
        const selectedStyle = STYLES.find(s => s.id === form.styleDir);
        return (
          <div style={slideStyle}>
            <StepLabel n={5} />
            <Q>{"Pick a style direction"}</Q>
            <Hint>{"Each card shows font pairing, color palette, and overall mood"}</Hint>
            {STYLE_SECTIONS.map(section => {
              const sectionStyles = STYLES.filter(s => s.section === section.id);
              if (sectionStyles.length === 0) return null;
              return (
                <div key={section.id} style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 14 }}>{section.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONT }}>{section.label}</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                    {sectionStyles.map(s => {
                      const isActive = form.styleDir === s.id && !form.designerChoice;
                      return (
                        <Glass key={s.id} active={isActive} onClick={() => { set("styleDir", s.id); set("designerChoice", false); }} hoverGlow={s.palette[0]}
                          style={{ padding: 0, overflow: "hidden", opacity: form.designerChoice ? 0.5 : 1, transition: "all 0.3s ease" }}>
                          <div style={{ height: 88, background: s.gradient, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 18px", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.15)" }} />
                            <div style={{ fontFamily: s.headingFont, fontWeight: s.headingWeight, fontSize: 18, color: "rgba(255,255,255,0.95)", position: "relative", zIndex: 1, textShadow: "0 1px 4px rgba(0,0,0,0.3)", letterSpacing: s.id === "modern-minimal" ? "0.04em" : s.id === "art-deco" ? "0.12em" : "0", textTransform: s.id === "art-deco" || s.id === "bold-vibrant" ? "uppercase" : "none" }}>{s.sampleHeading}</div>
                            <div style={{ fontFamily: s.bodyFont, fontSize: 11, color: "rgba(255,255,255,0.65)", position: "relative", zIndex: 1, marginTop: 3, fontStyle: s.id === "elegant-formal" ? "italic" : "normal" }}>{s.sampleBody}</div>
                          </div>
                          <div style={{ padding: "12px 16px 14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? "#fff" : FC.textPrimary, fontFamily: FONT }}>{s.label}</div>
                                <div style={{ fontSize: 11, color: FC.textDim, lineHeight: 1.3, marginTop: 2, fontFamily: FONT }}>{s.desc}</div>
                              </div>
                              {isActive && <div style={{ width: 20, height: 20, borderRadius: "50%", background: WF.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{"✓"}</div>}
                            </div>
                            <div style={{ fontSize: 10, color: FC.textDim, marginBottom: 8, letterSpacing: "0.04em", fontFamily: FONT }}>{"FONTS: "}{s.fontLabel}</div>
                            <div style={{ display: "flex", gap: 0, borderRadius: 6, overflow: "hidden", border: `1px solid ${isActive ? WF.accent + "30" : "rgba(255,255,255,0.06)"}` }}>
                              {s.palette.map((c, i) => <div key={i} style={{ flex: 1, height: 20, background: c }} />)}
                            </div>
                          </div>
                        </Glass>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 8, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 14 }}>{"\u{1F3A8}"}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONT }}>{"Or..."}</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              </div>
              <Glass active={form.designerChoice} onClick={() => { set("designerChoice", !form.designerChoice); if (!form.designerChoice) set("styleDir", null); }} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, maxWidth: 520 }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, flexShrink: 0, border: `2px solid ${form.designerChoice ? WF.accent : "rgba(255,255,255,0.15)"}`, background: form.designerChoice ? WF.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                  {form.designerChoice && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{"✓"}</span>}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: form.designerChoice ? "#fff" : FC.textPrimary, fontFamily: FONT }}>{"Complete Designer Control"}</div>
                  <div style={{ fontSize: 11, color: FC.textDim, lineHeight: 1.4, marginTop: 2, fontFamily: FONT }}>{"Skip the style selection \u2014 let our designer choose the best direction based on your content and purpose"}</div>
                </div>
              </Glass>
            </div>
            {form.styleDir && !form.designerChoice && (
              <div style={{ animation: "fadeSlide 0.35s ease" }}>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 22, marginTop: 4 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 400, color: FC.textSecondary, margin: "0 0 6px", fontFamily: FONT }}>{"Customize the color palette?"}</h3>
                  <p style={{ fontSize: 12, color: FC.textDim, margin: "0 0 16px", fontFamily: FONT }}>{"Keep the style's default colors, or swap in a different palette"}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                    {PALETTE_MODIFIERS.map(pm => {
                      const pmActive = form.paletteModifier === pm.id;
                      return (
                        <Glass key={pm.id} active={pmActive} onClick={() => set("paletteModifier", pm.id)} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 18, flexShrink: 0 }}>{pm.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: pmActive ? "#fff" : FC.textSecondary, fontFamily: FONT }}>{pm.label}</div>
                            <div style={{ fontSize: 10, color: FC.textDim, lineHeight: 1.3, marginTop: 1, fontFamily: FONT }}>{pm.desc}</div>
                          </div>
                          {pm.colors && (
                            <div style={{ display: "flex", gap: 0, borderRadius: 4, overflow: "hidden", flexShrink: 0, border: `1px solid ${pmActive ? WF.accent + "30" : "rgba(255,255,255,0.06)"}` }}>
                              {pm.colors.map((c, i) => <div key={i} style={{ width: 14, height: 16, background: c }} />)}
                            </div>
                          )}
                        </Glass>
                      );
                    })}
                  </div>
                  {form.paletteModifier === "custom" && (
                    <div style={{ marginTop: 14, animation: "fadeSlide 0.3s ease" }}>
                      <input ref={inputRef} placeholder="Describe the colors you're envisioning..." value={form.customPalette} onChange={e => set("customPalette", e.target.value)}
                        style={{ width: "100%", maxWidth: 440, background: "transparent", border: "none", borderBottom: `2px solid ${FC.border}`, color: FC.textPrimary, fontSize: 14, fontFamily: FONT, padding: "10px 0", outline: "none", caretColor: WF.accent }} />
                    </div>
                  )}
                </div>
              </div>
            )}
            <div style={{ marginTop: 20, padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <p style={{ fontSize: 11, color: FC.textDim, lineHeight: 1.6, margin: 0, textAlign: "center", fontStyle: "italic", fontFamily: FONT }}>
                {"Style selections serve as a starting point for your designer. Final results may vary based on content, format, and brand requirements. Our team will work with you to refine the direction during the design process."}
              </p>
            </div>

            {/* ── Inline Navigation for Style Step ── */}
            <div style={{
              marginTop: 28, padding: "20px 0 4px",
              borderTop: `1px solid rgba(255,255,255,0.06)`,
            }}>
              {/* Step progress dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14 }}>
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} style={{
                    width: i === step ? 22 : 6, height: 6, borderRadius: 3,
                    background: i < step
                      ? `linear-gradient(90deg, ${WF.pink}, ${WF.accent})`
                      : i === step
                        ? WF.accent
                        : "rgba(255,255,255,0.10)",
                    boxShadow: i === step ? `0 0 10px ${WF.accentGlow}` : "none",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <button onClick={goBack} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "11px 20px", borderRadius: 14, cursor: "pointer",
                  background: "linear-gradient(168deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: FC.textSecondary, fontSize: 13, fontWeight: 500, fontFamily: FONT,
                  backdropFilter: "blur(var(--glass-blur,24px))", WebkitBackdropFilter: "blur(var(--glass-blur,24px))",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.10)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", WebkitAppearance: "none",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; e.currentTarget.style.background = "linear-gradient(168deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 100%)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.background = "linear-gradient(168deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)"; e.currentTarget.style.transform = "none"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
                  {"Back"}
                </button>
                <button onClick={() => { setIsNavigatingAway(true); setPreviewGradient(null); router.push("/?page=services"); }} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "11px 16px", borderRadius: 14, cursor: "pointer",
                  background: "linear-gradient(168deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: FC.textDim, fontSize: 13, fontWeight: 500, fontFamily: FONT,
                  backdropFilter: "blur(var(--glass-blur,24px))", WebkitBackdropFilter: "blur(var(--glass-blur,24px))",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", WebkitAppearance: "none",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.color = FC.textSecondary; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = FC.textDim; e.currentTarget.style.transform = "none"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  {"Home"}
                </button>
                <button
                  onClick={canAdvance() ? goNext : undefined}
                  disabled={!canAdvance()}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "11px 24px", borderRadius: 14,
                    cursor: canAdvance() ? "pointer" : "not-allowed",
                    background: canAdvance()
                      ? `linear-gradient(135deg, ${WF.accent}60, ${WF.accent}40)`
                      : `linear-gradient(135deg, ${WF.accent}25, ${WF.accent}15)`,
                    border: `1px solid ${canAdvance() ? WF.accent + "55" : WF.accent + "20"}`,
                    color: canAdvance() ? "#fff" : "rgba(255,255,255,0.3)",
                    fontSize: 13, fontWeight: 600, fontFamily: FONT,
                    backdropFilter: "blur(var(--glass-blur,24px))", WebkitBackdropFilter: "blur(var(--glass-blur,24px))",
                    boxShadow: canAdvance()
                      ? `0 4px 20px ${WF.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`
                      : "none",
                    opacity: canAdvance() ? 1 : 0.5,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", WebkitAppearance: "none",
                  }}
                  onMouseEnter={canAdvance() ? e => { e.currentTarget.style.background = `linear-gradient(135deg, ${WF.accent}80, ${WF.accent}58)`; e.currentTarget.style.boxShadow = `0 6px 28px ${WF.accent}40`; e.currentTarget.style.transform = "translateY(-1px)"; } : undefined}
                  onMouseLeave={canAdvance() ? e => { e.currentTarget.style.background = `linear-gradient(135deg, ${WF.accent}60, ${WF.accent}40)`; e.currentTarget.style.boxShadow = `0 4px 20px ${WF.accentGlow}`; e.currentTarget.style.transform = "none"; } : undefined}
                >
                  {"Continue"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
              {!canAdvance() && (
                <p style={{ fontSize: 11, color: FC.textDim, textAlign: "center", marginTop: 10, fontFamily: FONT, opacity: 0.7 }}>
                  {"Select a style direction or choose Designer Control to continue"}
                </p>
              )}
            </div>
          </div>
        );
      }

      // STEP 6: Content Details
      case 5: {
        const wordCount = form.bodyText.trim() ? form.bodyText.trim().split(/\s+/).length : 0;
        const done = { headline: form.headline.trim().length > 0, body: form.bodyText.trim().length > 0 || form.verbiageKeywords.length > 0, event: !!(form.eventDate || form.eventTime || form.eventLocation), contact: !!(form.contactTitle || form.contactName || form.contactPhone || form.contactEmail) };
        const doneCount = Object.values(done).filter(Boolean).length;
        return (
          <div style={slideStyle}>
            <StepLabel n={6} />
            <Q>{"Build your creative brief"}</Q>
            <Hint>{"Fill in each card \u2014 watch them light up as you go"}</Hint>
            <div style={{ display: "flex", gap: 6, marginBottom: 24, alignItems: "center" }}>
              {["\u270F\uFE0F", "\u{1F4DD}", "\u{1F4C5}", "\u{1F464}"].map((icon, i) => {
                const keys = ["headline", "body", "event", "contact"];
                const isDone = done[keys[i]];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: isDone ? `${WF.pink}20` : "rgba(255,255,255,0.03)", border: `1px solid ${isDone ? WF.pink + "40" : "rgba(255,255,255,0.06)"}`, fontSize: 13, transition: "all 0.4s ease", boxShadow: isDone ? `0 0 10px ${WF.pink}20` : "none" }}>{icon}</div>
                    {i < 3 && <div style={{ width: 20, height: 1, background: isDone && done[keys[i + 1]] ? WF.pink + "40" : "rgba(255,255,255,0.06)", transition: "all 0.4s ease" }} />}
                  </div>
                );
              })}
              <span style={{ fontSize: 11, color: doneCount === 4 ? WF.pink : FC.textDim, marginLeft: 8, fontWeight: 600, transition: "color 0.4s", fontFamily: FONT }}>{doneCount}/4</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
              <SectionCard icon={"\u270F\uFE0F"} title="Headline / Title Text" subtitle="The big text at the top" isDone={done.headline}>
                <input ref={inputRef} placeholder="What's the headline for this piece?" value={form.headline} onChange={e => set("headline", e.target.value)} style={{ ...localInput, fontSize: 18 }} />
              </SectionCard>

              <SectionCard icon={"\u{1F4DD}"} title="Body Copy / Details" subtitle="All the words that tell the story" isDone={done.body}>
                <div style={{ marginBottom: 14 }}>
                  <button type="button" onClick={() => set("needVerbiage", !form.needVerbiage)}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px", borderRadius: 12, cursor: "pointer", background: form.needVerbiage ? `${WF.pink}12` : "rgba(255,255,255,0.02)", border: `1px solid ${form.needVerbiage ? WF.pink + "40" : FC.border}`, transition: "all 0.3s ease", fontFamily: FONT, WebkitAppearance: "none", textAlign: "left" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, border: `2px solid ${form.needVerbiage ? WF.pink : "rgba(255,255,255,0.15)"}`, background: form.needVerbiage ? WF.pink : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                      {form.needVerbiage && <span style={{ color: FC.dark, fontSize: 11, fontWeight: 700 }}>{"✓"}</span>}
                    </div>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: form.needVerbiage ? WF.pink : FC.textSecondary, display: "block" }}>{"Need help with verbiage? Click here!"}</span>
                      <span style={{ fontSize: 10, color: form.needVerbiage ? `${WF.pink}90` : FC.textDim, fontStyle: "italic" }}>{"(Trust us, you'd be happy if you did)"}</span>
                    </div>
                  </button>
                </div>
                {form.needVerbiage && (() => {
                  const search = form.keywordSearch.toLowerCase();
                  const filtered = search ? ALL_KEYWORDS.filter(k => k.toLowerCase().includes(search)) : null;
                  return (
                    <div style={{ marginBottom: 16, padding: "16px", background: `${WF.pink}08`, border: `1px solid ${WF.pink}20`, borderRadius: 12, animation: "fadeSlide 0.3s ease" }}>
                      <p style={{ fontSize: 11, color: FC.textDim, margin: "0 0 10px", lineHeight: 1.5, fontFamily: FONT }}>{"Select keywords that describe your project \u2014 a member of Communications will craft the copy for you."}</p>
                      {form.verbiageKeywords.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                          {form.verbiageKeywords.map(kw => (
                            <button key={kw} type="button" onClick={() => set("verbiageKeywords", form.verbiageKeywords.filter(k => k !== kw))}
                              style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 20, cursor: "pointer", background: `${WF.pink}18`, border: `1px solid ${WF.pink}35`, color: WF.pink, fontSize: 12, fontFamily: FONT, WebkitAppearance: "none", transition: "all 0.2s" }}>
                              {kw} <span style={{ opacity: 0.6 }}>{"\u2715"}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <div style={{ position: "relative", marginBottom: 12 }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.3, pointerEvents: "none" }}>{"\u{1F50D}"}</span>
                        <input placeholder="Search keywords..." value={form.keywordSearch} onChange={e => set("keywordSearch", e.target.value)} style={{ ...localInput, fontSize: 14, paddingLeft: 34 }} />
                      </div>
                      <div style={{ maxHeight: 260, overflowY: "auto", paddingRight: 4 }}>
                        {filtered ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {filtered.length === 0 && <span style={{ fontSize: 12, color: FC.textDim, fontStyle: "italic", fontFamily: FONT }}>{'No keywords match "'}{form.keywordSearch}{'"'}</span>}
                            {filtered.map(kw => {
                              const sel = form.verbiageKeywords.includes(kw);
                              return (
                                <button key={kw} type="button" onClick={() => set("verbiageKeywords", sel ? form.verbiageKeywords.filter(k => k !== kw) : [...form.verbiageKeywords, kw])}
                                  style={{ padding: "6px 12px", borderRadius: 20, cursor: "pointer", background: sel ? `${WF.accent}20` : "rgba(255,255,255,0.03)", border: `1px solid ${sel ? WF.accent + "40" : FC.border}`, color: sel ? WF.accentLight : FC.textSecondary, fontSize: 12, fontFamily: FONT, WebkitAppearance: "none", transition: "all 0.2s" }}>{kw}</button>
                              );
                            })}
                          </div>
                        ) : (
                          Object.entries(VERBIAGE_KEYWORDS).map(([cat, keywords]) => (
                            <div key={cat} style={{ marginBottom: 14 }}>
                              <div style={{ fontSize: 10, color: FC.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontFamily: FONT }}>{cat}</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                {keywords.map(kw => {
                                  const sel = form.verbiageKeywords.includes(kw);
                                  return (
                                    <button key={kw} type="button" onClick={() => set("verbiageKeywords", sel ? form.verbiageKeywords.filter(k => k !== kw) : [...form.verbiageKeywords, kw])}
                                      style={{ padding: "5px 10px", borderRadius: 16, cursor: "pointer", background: sel ? `${WF.accent}20` : "rgba(255,255,255,0.03)", border: `1px solid ${sel ? WF.accent + "40" : "rgba(255,255,255,0.06)"}`, color: sel ? WF.accentLight : FC.textDim, fontSize: 11, fontFamily: FONT, WebkitAppearance: "none", transition: "all 0.2s" }}>{kw}</button>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                        <input placeholder="Add your own keyword..." value={form.customKeyword} onChange={e => set("customKeyword", e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter" && form.customKeyword.trim()) { e.preventDefault(); const kw = form.customKeyword.trim(); if (!form.verbiageKeywords.includes(kw)) set("verbiageKeywords", [...form.verbiageKeywords, kw]); set("customKeyword", ""); } }}
                          style={{ ...localInput, fontSize: 14, flex: 1 }} />
                        <button type="button" onClick={() => { const kw = form.customKeyword.trim(); if (kw && !form.verbiageKeywords.includes(kw)) set("verbiageKeywords", [...form.verbiageKeywords, kw]); set("customKeyword", ""); }}
                          style={{ padding: "10px 16px", borderRadius: 10, cursor: "pointer", background: form.customKeyword.trim() ? `${WF.accent}20` : "rgba(255,255,255,0.03)", border: `1px solid ${form.customKeyword.trim() ? WF.accent + "40" : FC.border}`, color: form.customKeyword.trim() ? WF.accentLight : FC.textDim, fontSize: 12, fontWeight: 600, fontFamily: FONT, WebkitAppearance: "none", transition: "all 0.2s", flexShrink: 0 }}>
                          {"+ Add"}
                        </button>
                      </div>
                      {form.verbiageKeywords.length > 0 && <div style={{ marginTop: 10, fontSize: 11, color: FC.textDim, fontFamily: FONT }}>{form.verbiageKeywords.length}{" keyword"}{form.verbiageKeywords.length !== 1 ? "s" : ""}{" selected"}</div>}
                    </div>
                  );
                })()}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: FC.textDim, fontFamily: FONT }}>{"Write your own body text"}</span>
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: wordCount > 600 ? WF.red : wordCount > 500 ? "#e0a630" : FC.textDim, transition: "color 0.3s" }}>{wordCount}{" / 600 words"}</span>
                </div>
                <textarea placeholder="Enter your body text \u2014 include all the details you want on the piece." value={form.bodyText} onChange={e => { const words = e.target.value.trim().split(/\s+/); if (e.target.value.trim() === "" || words.length <= 650) set("bodyText", e.target.value); }}
                  style={{ ...localInput, minHeight: 140, resize: "vertical", lineHeight: 1.7, borderRadius: 12, fontSize: 18 }} />
                {wordCount > 600 && <p style={{ fontSize: 10, color: WF.red, margin: "6px 0 0", opacity: 0.8, fontFamily: FONT }}>{"Over the 600 word limit \u2014 please trim your copy"}</p>}
                <p style={{ fontSize: 10, color: FC.textDim, margin: "10px 0 0", lineHeight: 1.5, fontStyle: "italic", textAlign: "center", fontFamily: FONT }}>{"Both can be used \u2014 for us in Communications, the more we know the better the quality."}</p>
              </SectionCard>

              <SectionCard icon={"\u{1F4C5}"} title="Date / Time / Location" subtitle="When and where is it happening?" isDone={done.event}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F4C6} Date"}</label>
                  <input type="date" value={form.eventDate} onChange={e => set("eventDate", e.target.value)} style={{ ...localInput, colorScheme: "dark", fontSize: 18 }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F550} Time"}</label>
                  <input type="time" value={form.eventTime} onChange={e => set("eventTime", e.target.value)} style={{ ...localInput, colorScheme: "dark", fontSize: 18 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F4CD} Location"}</label>
                  <input placeholder="Building name, room, address..." value={form.eventLocation} onChange={e => set("eventLocation", e.target.value)} style={{ ...localInput, fontSize: 18 }} />
                </div>
              </SectionCard>

              <SectionCard icon={"\u{1F464}"} title="Contact Information" subtitle="Who should people reach out to?" isDone={done.contact}>
                <p style={{ fontSize: 10, color: FC.textDim, margin: "0 0 12px", lineHeight: 1.5, fontFamily: FONT }}>{"Appears on the final piece as: "}<span style={{ color: WF.accentLight }}>{"Contact NHBP's [Title] [Name] | [Phone] or [Email]"}</span></p>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={{ fontSize: 10, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F4BC} Job Title"}</label>
                    <input placeholder="Job Title" value={form.contactTitle} onChange={e => set("contactTitle", e.target.value)} style={{ ...localInput, fontSize: 18 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={{ fontSize: 10, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F3F7}\uFE0F Name"}</label>
                    <input placeholder="Full Name" value={form.contactName} onChange={e => set("contactName", e.target.value)} style={{ ...localInput, fontSize: 18 }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={{ fontSize: 10, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u{1F4DE} Phone"}</label>
                    <input placeholder="Phone Number" type="tel" value={form.contactPhone} onChange={e => set("contactPhone", e.target.value)} style={{ ...localInput, fontSize: 18 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={{ fontSize: 10, color: FC.textDim, display: "block", marginBottom: 6, fontWeight: 600, fontFamily: FONT }}>{"\u2709\uFE0F Email"}</label>
                    <input placeholder="Email Address" type="email" value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} style={{ ...localInput, fontSize: 18 }} />
                  </div>
                </div>
                {(form.contactTitle || form.contactName) && (
                  <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 10, background: `${WF.pink}08`, border: `1px solid ${WF.pink}20`, animation: "fadeSlide 0.3s ease" }}>
                    <span style={{ fontSize: 9, color: WF.pink, display: "block", marginBottom: 4, fontWeight: 600, letterSpacing: "0.1em", fontFamily: FONT }}>{"LIVE PREVIEW"}</span>
                    <span style={{ fontSize: 12, color: FC.textSecondary, lineHeight: 1.5, fontFamily: FONT }}>
                      {"Contact NHBP's "}{form.contactTitle || "[Job Title]"}{" "}{form.contactName || "[Name]"}
                      {(form.contactPhone || form.contactEmail) && " | "}
                      {form.contactPhone}{form.contactPhone && form.contactEmail && " or "}
                      {form.contactEmail}
                    </span>
                  </div>
                )}
              </SectionCard>

              {doneCount === 4 && (
                <div style={{ textAlign: "center", padding: "14px", animation: "fadeSlide 0.5s ease" }}>
                  <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>{"\u{1F389}"}</span>
                  <span style={{ fontSize: 13, color: WF.pink, fontWeight: 600, fontFamily: FONT }}>{"All sections complete!"}</span>
                  <span style={{ fontSize: 11, color: FC.textDim, display: "block", marginTop: 2, fontFamily: FONT }}>{"Hit Next to continue"}</span>
                </div>
              )}
            </div>
          </div>
        );
      }

      // STEP 7: Inspiration
      case 6:
        return (
          <div style={slideStyle}>
            <StepLabel n={7} />
            <Q>{"Any inspiration or references?"}</Q>
            <Hint>{"Screenshots, links, examples \u2014 anything that helps us understand your vision"}</Hint>
            <Glass style={{ padding: "32px 24px", textAlign: "center", borderStyle: "dashed", maxWidth: 480, marginBottom: 16 }}>
              <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>{"\u{1F4CE}"}</span>
              <span style={{ fontSize: 13, color: FC.textDim, fontFamily: FONT }}>{"Drop images or screenshots here"}</span>
              <br />
              <span style={{ fontSize: 11, color: FC.textDim, fontFamily: FONT }}>{"PNG, JPG, PDF up to 10MB each"}</span>
            </Glass>
            <textarea ref={inputRef} placeholder="Or describe what you're envisioning... paste links, mention designs you've seen, anything."
              value={form.notes} onChange={e => set("notes", e.target.value)}
              style={{ width: "100%", maxWidth: 480, minHeight: 100, resize: "vertical", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)", border: `1px solid ${FC.border}`, borderRadius: 12, color: FC.textPrimary, fontSize: 14, fontFamily: FONT, padding: "16px", outline: "none", lineHeight: 1.6, caretColor: WF.accent, boxSizing: "border-box", transition: `border-color ${CLICK.duration}` }} />
          </div>
        );

      // STEP 8: Priority
      case 7:
        return (
          <div style={slideStyle}>
            <StepLabel n={8} />
            <Q>{"How soon do you need this?"}</Q>
            <Hint>{"Helps us prioritize across all department requests"}</Hint>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 440, marginBottom: 20 }}>
              {VD_PRIORITIES.map(p => (
                <Glass key={p.id} active={form.priority === p.id} onClick={() => set("priority", p.id)} hoverGlow={p.color}
                  style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, borderColor: form.priority === p.id ? p.color + "50" : undefined, boxShadow: form.priority === p.id ? `0 0 20px ${p.color}18` : undefined }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.color, flexShrink: 0, boxShadow: form.priority === p.id ? `0 0 10px ${p.color}50` : "none" }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: FC.textPrimary, fontFamily: FONT }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: FC.textDim, marginTop: 2, fontFamily: FONT }}>{p.desc}</div>
                  </div>
                </Glass>
              ))}
            </div>
            {form.priority === "urgent" && (
              <Glass style={{ padding: "14px 18px", maxWidth: 440, borderColor: WF.red + "25", animation: "fadeSlide 0.3s ease" }}>
                <p style={{ fontSize: 12, color: WF.pink, lineHeight: 1.6, margin: 0, fontFamily: FONT }}>
                  {"Urgent requests may require Director approval and are subject to current workload. We\u2019ll confirm feasibility within 4 hours."}
                </p>
              </Glass>
            )}
            <div style={{ marginTop: 16 }}>
              <Hint>{"Have a specific date in mind? (optional)"}</Hint>
              <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)}
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${FC.border}`, borderRadius: 10, color: FC.textPrimary, fontSize: 14, fontFamily: FONT, padding: "12px 16px", outline: "none", caretColor: WF.accent, colorScheme: "dark" }} />
            </div>
          </div>
        );

      // STEP 9: Review
      case 8: {
        const selectedStyle = STYLES.find(s => s.id === form.styleDir);
        const activePalette = getActivePalette();
        const selectedModifier = PALETTE_MODIFIERS.find(m => m.id === form.paletteModifier);
        return (
          <div style={slideStyle}>
            <StepLabel n={9} />
            <Q>{"Review your request"}</Q>
            <Hint>{"Make sure everything looks right before submitting"}</Hint>
            <Glass style={{ padding: "22px 26px", maxWidth: 520 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div style={{ fontSize: 10, color: FC.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4, fontFamily: FONT }}>{"Creating"}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: FC.textPrimary, fontFamily: FONT }}>{PIECE_TYPES.find(p => p.id === form.pieceType)?.icon}{" "}{PIECE_TYPES.find(p => p.id === form.pieceType)?.label}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: FC.textSecondary, fontFamily: FONT }}>{FORMAT_OPTIONS.find(f => f.id === form.format)?.label}</div>
                  <div style={{ fontSize: 12, color: FC.textDim, fontFamily: FONT }}>
                    {form.pieceType === "printed-media" ? (
                      form.multiPage ? `\u{1F4DA} ${[{id:"booklet",l:"Booklet"},{id:"pamphlet",l:"Pamphlet"},{id:"book",l:"Book"},{id:"program",l:"Program"},{id:"newsletter",l:"Newsletter"},{id:"catalog",l:"Catalog"},{id:"other-mp",l:"Other"}].find(t=>t.id===form.multiPageType)?.l || "Multi-Page"}${form.pageCount ? ` (${form.pageCount} pages)` : ""}`
                      : form.specialRequest ? "\u2B50 Special Request \u2014 follow-up needed"
                      : form.size === "custom" ? form.customSize
                      : PRINTED_MEDIA_SIZES.flatMap(c => c.sizes).find(s => s.id === form.size)?.label || form.size
                    ) : (form.size === "custom" ? form.customSize : getSizes().find(s => s.id === form.size)?.label)}
                  </div>
                </div>
              </div>
              {selectedStyle && !form.designerChoice && (
                <div style={{ display: "flex", gap: 14, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: 56, height: 42, borderRadius: 6, background: selectedStyle.gradient, flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 8, left: 6, width: "50%", height: 3, background: "rgba(255,255,255,0.3)", borderRadius: 2 }} />
                    <div style={{ position: "absolute", top: 14, left: 6, width: "30%", height: 2, background: "rgba(255,255,255,0.15)", borderRadius: 2 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: FC.textPrimary, fontFamily: FONT }}>{selectedStyle.label}</div>
                    <div style={{ fontSize: 10, color: FC.textDim, marginTop: 2, fontFamily: FONT }}>{"Fonts: "}{selectedStyle.fontLabel}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                      <div style={{ display: "flex", gap: 0, borderRadius: 4, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                        {activePalette.map((c, i) => <div key={i} style={{ width: 18, height: 12, background: c }} />)}
                      </div>
                      <span style={{ fontSize: 10, color: FC.textDim, fontFamily: FONT }}>{selectedModifier?.label}</span>
                    </div>
                  </div>
                </div>
              )}
              {form.designerChoice && (
                <div style={{ display: "flex", gap: 14, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
                  <div style={{ width: 56, height: 42, borderRadius: 6, background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.08))", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{"\u{1F3A8}"}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: FC.textPrimary, fontFamily: FONT }}>{"Complete Designer Control"}</div>
                    <div style={{ fontSize: 10, color: FC.textDim, marginTop: 2, fontFamily: FONT }}>{"Style, fonts, and colors at designer's discretion"}</div>
                  </div>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <span style={{ fontSize: 11, color: FC.textDim, fontFamily: FONT }}>{"Purpose: "}</span>
                  <span style={{ fontSize: 13, color: FC.textSecondary, fontFamily: FONT }}>{PURPOSES.find(p => p.id === form.purpose)?.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: VD_PRIORITIES.find(p => p.id === form.priority)?.color, fontFamily: FONT }}>{VD_PRIORITIES.find(p => p.id === form.priority)?.label}</span>
              </div>
              <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: 11, color: FC.textDim, marginBottom: 6, fontFamily: FONT }}>{"Content provided:"}</div>
                {form.headline && <div style={{ fontSize: 12, color: FC.textSecondary, marginBottom: 4, fontFamily: FONT }}><span style={{ color: FC.textDim }}>{"Headline: "}</span>{form.headline}</div>}
                {(form.bodyText || form.needVerbiage) && (
                  <div style={{ fontSize: 12, color: FC.textSecondary, marginBottom: 4, fontFamily: FONT }}>
                    <span style={{ color: FC.textDim }}>{"Body: "}</span>
                    {form.bodyText.trim() ? `${form.bodyText.trim().split(/\s+/).length} words` : ""}
                    {form.bodyText.trim() && form.needVerbiage ? " + " : ""}
                    {form.needVerbiage ? `Verbiage requested (${form.verbiageKeywords.length} keywords)` : ""}
                  </div>
                )}
                {(form.eventDate || form.eventTime || form.eventLocation) && (
                  <div style={{ fontSize: 12, color: FC.textSecondary, marginBottom: 4, fontFamily: FONT }}>
                    <span style={{ color: FC.textDim }}>{"Event: "}</span>
                    {[form.eventDate, form.eventTime, form.eventLocation].filter(Boolean).join(" \u00B7 ")}
                  </div>
                )}
                {(form.contactName || form.contactTitle) && (
                  <div style={{ fontSize: 12, color: FC.textSecondary, fontFamily: FONT }}>
                    <span style={{ color: FC.textDim }}>{"Contact: "}</span>
                    {form.contactTitle}{" "}{form.contactName}{form.contactPhone ? ` | ${form.contactPhone}` : ""}{form.contactEmail ? ` | ${form.contactEmail}` : ""}
                  </div>
                )}
              </div>
            </Glass>
          </div>
        );
      }

      default: return null;
    }
  };

  // ═══ MAIN RENDER ═══
  return (
    <div style={{ minHeight: "100vh", color: FC.textPrimary, fontFamily: FONT, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,500&display=swap" rel="stylesheet" />
      <BG />
      <SettingsDropdown nightMode={nightMode} onToggleNight={toggleNight} />
      
      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 24px 24px", zIndex: 1, position: "relative", overflowY: "auto" }}>
        {renderStep()}
      </div>
      {/* Nav — hidden on step 4 (style direction) which has its own inline nav */}
      {step !== 4 && (
        <PageNav
          onBack={step > 0 ? goBack : undefined}
          onHome={() => { setIsNavigatingAway(true); setPreviewGradient(null); router.push("/?page=services"); }}
          onNext={canAdvance() ? goNext : undefined}
          backLabel="Back"
          nextLabel={step === totalSteps - 1 ? "Submit" : "Next"}
          showDisabledNext={!canAdvance()}
          currentStep={step}
          totalSteps={totalSteps}
        />
      )}
      <Footer />
    </div>
  );
}

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
