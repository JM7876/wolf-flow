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
    name: "Employee Stationeries",
    icon: "◎",
    description: "Business cards, name plates, personalized notepads",
    status: "live",
    formType: "custom",
  },
  {
    id: "studio-hub",
    name: "The Studio Hub",
    icon: "\u25CE",
    description: "Photography, headshots, digital archives, and video services",
    status: "live",
    formType: "custom",
    subsections: ["lens", "camera", "archives", "photography", "headshots"],
  },
  {
    id: "event-coverage",
    name: "Event Coverage",
    icon: "\u25C9",
    description: "Photography & videography for events",
    status: "soon",
    formType: "generic",
    est: "Scheduled per event",
    fields: ["title", "dept", "eventDate", "eventTime", "location", "description", "audience"],
  },
  {
    id: "community-outreach",
    name: "Community Outreach",
    icon: "\u25C7",
    description: "Social media posts, instant alerts, and public communications",
    status: "live",
    formType: "custom",
  },
  {
    id: "form-builder",
    name: "DIY Form Builder",
    icon: "▦",
    description: "Create surveys, feedback forms, sign-up sheets with QR codes",
    status: "live",
    formType: "custom",
  },
     {
    id: "press-box",
    name: "The Press Box",
    icon: "\u25A0",
    description: "Articles, newsletters, celebratory posts, and internal feedback",
    status: "live",
    formType: "custom",
  },
  {
    id: "other",
    name: "Other",
    icon: "\u2726",
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
    service: "Employee Stationeries", priority: "Standard", mediaType: "Print",
    step: 4, assignee: "Tracy", assigneeAvatar: "\u25A1", assigneeRole: "Admin / Coordinator",
    size: "XS", created: "Feb 10, 2026", updated: "Feb 13, 9:15 AM", due: "Feb 14, 2026",
    activity: [
      { time: "Feb 10, 8:47 AM", action: "Request submitted via Portal", icon: "\u25CB", by: "Donna P." },
      { time: "Feb 10, 9:12 AM", action: "Intake verified \u2014 all info complete", icon: "\u2714", by: "Tracy" },
      { time: "Feb 10, 10:30 AM", action: "Creative brief generated", icon: "\u25A0", by: "System" },
      { time: "Feb 10, 11:00 AM", action: "Assigned to Tracy \u2014 Business Cards", icon: "\u25C7", by: "System" },
      { time: "Feb 12, 2:15 PM", action: "Design in progress \u2014 standard template", icon: "\u2726", by: "Tracy" },
    ],
  },
  "WF-2026-0398": {
    title: "Tax Workshop Reminder", dept: "Finance", requester: "Linda R.",
    service: "Visual Designs", priority: "Rush", mediaType: "Digital",
    step: 5, assignee: "Audry", assigneeAvatar: "\u25C7", assigneeRole: "Comm. Specialist",
    size: "S", created: "Feb 8, 2026", updated: "Feb 12, 4:30 PM", due: "Feb 12, 2026",
    activity: [
      { time: "Feb 8, 10:00 AM", action: "Request submitted via Portal (Rush)", icon: "\u25CB", by: "Linda R." },
      { time: "Feb 8, 10:05 AM", action: "Rush flag \u2014 priority escalated", icon: "\u25C9", by: "System" },
      { time: "Feb 8, 10:20 AM", action: "Intake verified", icon: "\u2714", by: "Tracy" },
      { time: "Feb 8, 11:00 AM", action: "Assigned to Audry", icon: "\u25C7", by: "System" },
      { time: "Feb 10, 9:00 AM", action: "Social graphic created", icon: "\u2726", by: "Shawn" },
      { time: "Feb 12, 2:00 PM", action: "In review \u2014 awaiting Director approval", icon: "\u25CE", by: "Narciso" },
    ],
  },
  "WF-2026-1847": {
    title: "Community Health Fair", dept: "Health Services", requester: "Sandra M.",
    service: "Event Coverage", priority: "Standard", mediaType: "Both",
    step: 4, assignee: "Multi-Team", assigneeAvatar: "\u25CE", assigneeRole: "6 team members",
    size: "M", created: "Feb 3, 2026", updated: "Feb 12, 11:45 AM", due: "Mar 14, 2026",
    activity: [
      { time: "Feb 3, 8:47 AM", action: "Request submitted via Portal", icon: "\u25CB", by: "Sandra M." },
      { time: "Feb 3, 9:30 AM", action: "Intake verified \u2014 M-size project", icon: "\u2714", by: "Tracy" },
      { time: "Feb 3, 10:00 AM", action: "Brief \u2014 multi-deliverable event package", icon: "\u25A0", by: "Tracy" },
      { time: "Feb 5, 9:00 AM", action: "Full team assigned (6 members)", icon: "\u25C7", by: "System" },
      { time: "Feb 12, 11:45 AM", action: "Flyer design in progress", icon: "\u2726", by: "Shawn" },
    ],
  },
  "WF-2026-0388": {
    title: "Council Meeting Recap", dept: "Tribal Council", requester: "Chief Harris",
    service: "The Turtle Press", priority: "Urgent", mediaType: "Digital",
    step: 5, assignee: "Cat", assigneeAvatar: "\u25A0", assigneeRole: "Writer",
    size: "M", created: "Jan 30, 2026", updated: "Feb 13, 8:00 AM", due: "Feb 13, 2026",
    activity: [
      { time: "Jan 30, 10:00 AM", action: "Request submitted via Portal (Urgent)", icon: "\u25CB", by: "Chief Harris" },
      { time: "Jan 30, 10:02 AM", action: "Urgent flag \u2014 immediate escalation", icon: "\u25C9", by: "System" },
      { time: "Jan 30, 10:15 AM", action: "Intake verified", icon: "\u2714", by: "Tracy" },
      { time: "Jan 30, 11:00 AM", action: "Assigned to Cat \u2014 Writing", icon: "\u25C7", by: "System" },
      { time: "Feb 10, 4:00 PM", action: "Draft complete \u2014 submitted for review", icon: "\u2726", by: "Cat" },
      { time: "Feb 13, 8:00 AM", action: "In Director review", icon: "\u25CE", by: "Narciso" },
    ],
  },
  "WF-2026-0375": {
    title: "Website Banner \u2014 March", dept: "Communications", requester: "Narciso",
    service: "Visual Designs", priority: "Standard", mediaType: "Digital",
    step: 8, assignee: "Shawn", assigneeAvatar: "\u2726", assigneeRole: "Graphic Designer",
    size: "S", created: "Jan 28, 2026", updated: "Feb 11, 3:00 PM", due: "Complete",
    activity: [
      { time: "Jan 28, 9:00 AM", action: "Request submitted internally", icon: "\u25CB", by: "Narciso" },
      { time: "Jan 28, 9:05 AM", action: "Intake verified", icon: "\u2714", by: "Tracy" },
      { time: "Jan 28, 9:30 AM", action: "Assigned to Shawn", icon: "\u25C7", by: "System" },
      { time: "Feb 5, 2:00 PM", action: "Banner design approved", icon: "\u2714", by: "Narciso" },
      { time: "Feb 11, 3:00 PM", action: "Published to website", icon: "\u25B3", by: "Audry" },
    ],
  },
};

// Created and Authored by Johnathon Moulds © 2026 — Wolf Flow Solutions | All Rights Reserved
