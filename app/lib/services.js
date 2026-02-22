/* ═══════════════════════════════════════════════════════════
   WOLF FLOW SOLUTIONS — Portal Service Registry
   ─────────────────────────────────────────────────────────
   Master list of all portal services. Each entry defines:
   · id / slug (used in URLs: /services/visual-design)
   · display info (name, icon, description)
   · status: "live" | "soon"
   · formType: "custom" (dedicated route) | "generic" (shared form)
   Created and Authored by Johnathon Moulds © 2026
   ═══════════════════════════════════════════════════════════ */

export const SERVICES = [
  {
    id: "visual-design",
    name: "Visual Designs",
    icon: "✦",
    description: "Digital flyers, printed materials, banners, ads, presentations",
    status: "live",
    formType: "custom",
  },
  {
    id: "stationery-kit",
    name: "Employee Stationery Kit",
    icon: "◎",
    description: "Business cards, name plates, personalized notepads",
    status: "live",
    formType: "custom",
  },
  {
    id: "studio-hub",
    name: "The Studio Hub",
    icon: "📷",
    description: "Headshots, photo booth, event photography",
    status: "live",
    formType: "custom",
    subsections: ["headshots", "turtle-press"],
  },
  {
    id: "event-coverage",
    name: "Event Coverage",
    icon: "◉",
    description: "Photography & videography for events",
    status: "soon",
    formType: "generic",
    est: "Scheduled per event",
    fields: ["title", "dept", "eventDate", "eventTime", "location", "description", "audience"],
  },
  {
    id: "instant-alert",
    name: "Instant Alert",
    icon: "⚡",
    description: "Urgent communications & emergency notices",
    status: "live",
    formType: "custom",
  },
  {
    id: "community-outreach",
    name: "Community Outreach",
    icon: "📣",
    description: "Social media posts, website content, public communications",
    status: "live",
    formType: "custom",
  },
  {
    id: "form-builder",
    name: "DIY Post Builder",
    icon: "\u270F\uFE0F",
    description: "Draft your own social post \u2014 caption, platform, hashtags",
    status: "live",
    formType: "custom",
  },
  {
    id: "other",
    name: "Other",
    icon: "💡",
    description: "General requests that don't fit other categories",
    status: "live",
    formType: "custom",
  },
];

/* ═══ FIELD LABELS ═══ */
export const FIELD_LABELS = {
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
export const MOCK_REQUESTS = {
  "WF-2026-0412": {
    title: "New Hire — Maria Gonzalez", dept: "Human Resources", requester: "Donna P.",
    service: "Employee Stationery Kit", priority: "Standard", mediaType: "Print",
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
  "WF-2026-0398": {
    title: "Tax Workshop Reminder", dept: "Finance", requester: "Linda R.",
    service: "Visual Designs", priority: "Rush", mediaType: "Digital",
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
  "WF-2026-1847": {
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
  "WF-2026-0388": {
    title: "Council Meeting Recap", dept: "Tribal Council", requester: "Chief Harris",
    service: "The Turtle Press", priority: "Urgent", mediaType: "Digital",
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
  "WF-2026-0375": {
    title: "Website Banner — March", dept: "Communications", requester: "Narciso",
    service: "Visual Designs", priority: "Standard", mediaType: "Digital",
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

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
