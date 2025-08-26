// lib/nav.config.ts

// Master menu & role maps for BucalTrack sidebars

export type Role = "admin" | "school" | "staff" | "coach";

export type NavItem = {
  key: string; // stable id for tests/analytics
  label: string; // menu text
  href: string;  // route
};

// Central menu items (single source of truth)

export const NAV_ITEMS = {
  // Admin area

  home_admin: { key: "home", label: "Home", href: "/admin" },

  events_admin: {
    key: "evt",
    label: "Event Management",
    href: "/admin/events",
  },

  sports_admin: {
    key: "spt",
    label: "Sports",
    href: "/admin/sports",
  },

  teams_admin: { key: "tm", label: "Team Registration", href: "/admin/teams" },

  analytics_admin: { key: "anl", label: "Analytics", href: "/admin/analytics" },

  seasons_admin: { key: "sea", label: "Past Seasons", href: "/admin/seasons" },

  user_management_admin: {
    key: "usr",
    label: "User Management",
    href: "/admin/user-management",
  },

  player_screening_admin: {
    key: "scr",
    label: "Player Screening",
    href: "/admin/player-screening",
  },

  support_admin: { key: "sup", label: "Support", href: "/admin/support" },

  // School area

  announcements_school: {
    key: "ann",
    label: "Announcements",
    href: "/school",
  },

  events_school: { key: "evt", label: "Events", href: "/school/events" },

  coaches_school: { key: "cch", label: "Coaches", href: "/school/coaches" },

  player_screening_school: {
    key: "scr",
    label: "Player Screening",
    href: "/school/player-screening",
  },

  teams_school: {
    key: "tm",
    label: "Team Registration",
    href: "/school/teams",
  },

  support_school: { key: "sup", label: "Support", href: "/school/support" },

  // Staff area

  announcements_staff: {
    key: "ann",
    label: "Announcements",
    href: "/staff/announcements",
  },

  events_staff: { key: "evt", label: "Events", href: "/staff/events" },

  support_staff: { key: "sup", label: "Support", href: "/staff/support" },

  // Coach area

  announcements_coach: {
    key: "ann",
    label: "Announcements",
    href: "/coach/announcements",
  },

  schedules_coach: { key: "sch", label: "Schedules", href: "/coach/schedules" },

  support_coach: { key: "sup", label: "Support", href: "/coach/support" },
} as const;

// Which items each role sees

export const NAV_BY_ROLE: Record<Role, Array<keyof typeof NAV_ITEMS>> = {
  admin: [
    "home_admin",
    "events_admin",
    "sports_admin",
    "teams_admin",
    "player_screening_admin",
    "analytics_admin",
    "seasons_admin",
    "user_management_admin",
    "support_admin",
  ],

  school: [
    "announcements_school",
    "events_school",
    "coaches_school",
    "player_screening_school",
    "teams_school",
    "support_school",
  ],

  staff: ["announcements_staff", "events_staff", "support_staff"],

  coach: ["announcements_coach", "schedules_coach", "support_coach"],
};
