// Mock data for publishing system

export interface Screen {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  groupId?: string;
}

export interface ScreenGroup {
  id: string;
  name: string;
  screenCount: number;
  screenIds: string[];
}

export interface Composition {
  id: string;
  name: string;
  type: "playlist" | "layout" | "single";
  thumbnail: string;
  duration: number;
  lastModified: string;
}

export interface Campaign {
  id: string;
  name: string;
  compositions: string[];
  rotationType: "sequential" | "random" | "weighted";
  weights?: Record<string, number>;
}

export interface DirectPublish {
  id: string;
  name: string;
  contentId: string;
  contentName: string;
  contentType: "media" | "composition" | "campaign";
  targetScreens: string[];
  screenNames: string;
  status: "active" | "paused" | "completed";
  startTime: string;
  duration: number; // minutes
  remainingTime?: number; // minutes
  override: boolean;
  isDefault: boolean;
  publishedBy: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  contentType: "media" | "composition";
  contentId: string;
  contentName: string;
  // Legacy fields for backward compatibility
  compositionId?: string;
  compositionName?: string;
}

export interface DaySequence {
  id: string;
  name: string;
  slots: TimeSlot[];
}

export interface PlannedSchedule {
  id: string;
  name: string;
  type: "simple" | "daySequence" | "campaign";
  targetScreens: string[];
  screenNames: string;
  status: "active" | "scheduled" | "paused" | "completed" | "pending_approval";
  startDate: string;
  endDate: string;
  recurrence: "once" | "daily" | "weekly" | "monthly";
  priority: "high" | "medium" | "low";
  contentId: string; // composition/campaign/daySequence ID
  contentName: string;
  daySequence?: DaySequence;
  campaign?: Campaign;
  createdBy: string;
  createdAt: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewComment?: string;
}

export interface UserRole {
  id: string;
  name: string;
  email: string;
  role: "admin" | "publisher" | "reviewer";
  region?: string;
}

export interface ApprovalRequest {
  id: string;
  scheduleId: string;
  scheduleName: string;
  requestedBy: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: string;
}

// Mock Screens
export const mockScreens: Screen[] = [
  { id: "screen-1", name: "Lobby Display", location: "Main Lobby", status: "online", groupId: "group-1" },
  { id: "screen-2", name: "Reception Area", location: "Front Desk", status: "online", groupId: "group-1" },
  { id: "screen-3", name: "Conference Room A", location: "2nd Floor", status: "online", groupId: "group-2" },
  { id: "screen-4", name: "Cafeteria Screen", location: "Cafeteria", status: "online", groupId: "group-3" },
  { id: "screen-5", name: "Training Room", location: "3rd Floor", status: "online", groupId: "group-2" },
  { id: "screen-6", name: "Executive Floor", location: "5th Floor", status: "offline", groupId: "group-4" },
  { id: "screen-7", name: "Retail Store - Front", location: "Store Front", status: "online" },
  { id: "screen-8", name: "Retail Store - Back", location: "Store Back", status: "online" },
];

// Mock Screen Groups
export const mockScreenGroups: ScreenGroup[] = [
  { id: "group-1", name: "Entrance & Reception", screenCount: 2, screenIds: ["screen-1", "screen-2"] },
  { id: "group-2", name: "Meeting Rooms", screenCount: 2, screenIds: ["screen-3", "screen-5"] },
  { id: "group-3", name: "Common Areas", screenCount: 1, screenIds: ["screen-4"] },
  { id: "group-4", name: "Executive Suite", screenCount: 1, screenIds: ["screen-6"] },
  { id: "group-all", name: "All Screens", screenCount: 8, screenIds: ["screen-1", "screen-2", "screen-3", "screen-4", "screen-5", "screen-6", "screen-7", "screen-8"] },
];

// Mock Compositions
export const mockCompositions: Composition[] = [
  { id: "comp-1", name: "Welcome Playlist", type: "playlist", thumbnail: "PlaySquare", duration: 300, lastModified: "2024-03-10" },
  { id: "comp-2", name: "Product Showcase", type: "layout", thumbnail: "Layout", duration: 180, lastModified: "2024-03-12" },
  { id: "comp-3", name: "Promotional Content", type: "playlist", thumbnail: "Sparkles", duration: 240, lastModified: "2024-03-08" },
  { id: "comp-4", name: "Training Materials", type: "layout", thumbnail: "BookOpen", duration: 600, lastModified: "2024-03-05" },
  { id: "comp-5", name: "Company News", type: "playlist", thumbnail: "Newspaper", duration: 420, lastModified: "2024-03-01" },
  { id: "comp-6", name: "Menu Board", type: "single", thumbnail: "UtensilsCrossed", duration: 0, lastModified: "2024-03-15" },
  { id: "comp-7", name: "Event Highlights", type: "playlist", thumbnail: "Calendar", duration: 360, lastModified: "2024-03-14" },
  { id: "comp-8", name: "Safety Instructions", type: "layout", thumbnail: "ShieldCheck", duration: 180, lastModified: "2024-03-11" },
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    name: "Morning Campaign",
    compositions: ["comp-1", "comp-5"],
    rotationType: "sequential",
  },
  {
    id: "campaign-2",
    name: "Afternoon Promo",
    compositions: ["comp-2", "comp-3"],
    rotationType: "random",
  },
  {
    id: "campaign-3",
    name: "All Day Content",
    compositions: ["comp-1", "comp-2", "comp-3", "comp-5"],
    rotationType: "weighted",
    weights: { "comp-1": 30, "comp-2": 25, "comp-3": 25, "comp-5": 20 },
  },
];

// Mock Direct Publishes (Active Quickplays)
export const mockDirectPublishes: DirectPublish[] = [
  {
    id: "quick-1",
    name: "Emergency Announcement",
    contentId: "comp-1",
    contentName: "Welcome Playlist",
    contentType: "composition",
    targetScreens: ["screen-1", "screen-2", "screen-3"],
    screenNames: "Lobby Display, Reception Area, Conference Room A",
    status: "active",
    startTime: "2024-03-15 14:30",
    duration: 30,
    remainingTime: 15,
    override: true,
    isDefault: false,
    publishedBy: "John Doe",
  },
  {
    id: "quick-2",
    name: "Lunch Special",
    contentId: "comp-6",
    contentName: "Menu Board",
    contentType: "composition",
    targetScreens: ["screen-4"],
    screenNames: "Cafeteria Screen",
    status: "active",
    startTime: "2024-03-15 11:00",
    duration: 180,
    remainingTime: 45,
    override: false,
    isDefault: true,
    publishedBy: "Sarah Smith",
  },
  {
    id: "quick-3",
    name: "Training Session",
    contentId: "comp-4",
    contentName: "Training Materials",
    contentType: "composition",
    targetScreens: ["screen-5"],
    screenNames: "Training Room",
    status: "paused",
    startTime: "2024-03-15 10:00",
    duration: 120,
    remainingTime: 60,
    override: false,
    isDefault: false,
    publishedBy: "Mike Johnson",
  },
];

// Mock Planned Schedules
export const mockPlannedSchedules: PlannedSchedule[] = [
  {
    id: "sched-1",
    name: "Morning Welcome Campaign",
    type: "simple",
    targetScreens: ["screen-1", "screen-2"],
    screenNames: "Lobby Display, Reception Area",
    status: "active",
    startDate: "2024-03-15 08:00",
    endDate: "2024-03-15 12:00",
    recurrence: "daily",
    priority: "high",
    contentId: "comp-1",
    contentName: "Welcome Playlist",
    createdBy: "John Doe",
    createdAt: "2024-03-10 10:30",
  },
  {
    id: "sched-2",
    name: "Product Showcase - Afternoon",
    type: "simple",
    targetScreens: ["screen-3", "screen-4", "screen-5"],
    screenNames: "Conference Room A, Cafeteria Screen, Training Room",
    status: "active",
    startDate: "2024-03-15 12:00",
    endDate: "2024-03-15 18:00",
    recurrence: "daily",
    priority: "medium",
    contentId: "comp-2",
    contentName: "Product Showcase",
    createdBy: "Sarah Smith",
    createdAt: "2024-03-10 11:00",
  },
  {
    id: "sched-3",
    name: "Weekend Special Promo",
    type: "campaign",
    targetScreens: ["screen-1", "screen-2", "screen-3", "screen-4", "screen-5", "screen-6", "screen-7", "screen-8"],
    screenNames: "All Screens",
    status: "scheduled",
    startDate: "2024-03-16 00:00",
    endDate: "2024-03-17 23:59",
    recurrence: "weekly",
    priority: "high",
    contentId: "campaign-3",
    contentName: "All Day Content",
    campaign: mockCampaigns[2],
    createdBy: "Mike Johnson",
    createdAt: "2024-03-08 15:20",
  },
  {
    id: "sched-4",
    name: "Training Day Schedule",
    type: "daySequence",
    targetScreens: ["screen-5"],
    screenNames: "Training Room",
    status: "paused",
    startDate: "2024-03-14 09:00",
    endDate: "2024-03-14 17:00",
    recurrence: "once",
    priority: "low",
    contentId: "dayseq-1",
    contentName: "Training Day Sequence",
    daySequence: {
      id: "dayseq-1",
      name: "Training Day Sequence",
      slots: [
        { id: "slot-1", startTime: "09:00", endTime: "12:00", compositionId: "comp-4", compositionName: "Training Materials" },
        { id: "slot-2", startTime: "12:00", endTime: "13:00", compositionId: "comp-6", compositionName: "Menu Board" },
        { id: "slot-3", startTime: "13:00", endTime: "17:00", compositionId: "comp-4", compositionName: "Training Materials" },
      ],
    },
    createdBy: "John Doe",
    createdAt: "2024-03-12 09:15",
  },
  {
    id: "sched-5",
    name: "Company News - March",
    type: "simple",
    targetScreens: ["screen-1", "screen-2", "screen-3", "screen-4", "screen-5", "screen-6", "screen-7", "screen-8"],
    screenNames: "All Screens",
    status: "active",
    startDate: "2024-03-01 00:00",
    endDate: "2024-03-31 23:59",
    recurrence: "monthly",
    priority: "medium",
    contentId: "comp-5",
    contentName: "Company News",
    createdBy: "Sarah Smith",
    createdAt: "2024-02-28 16:45",
  },
  {
    id: "sched-6",
    name: "Event Promotion Campaign",
    type: "campaign",
    targetScreens: ["screen-1", "screen-2", "screen-7", "screen-8"],
    screenNames: "Lobby Display, Reception Area, Retail Store - Front, Retail Store - Back",
    status: "pending_approval",
    startDate: "2024-03-20 00:00",
    endDate: "2024-03-25 23:59",
    recurrence: "once",
    priority: "high",
    contentId: "campaign-2",
    contentName: "Afternoon Promo",
    campaign: mockCampaigns[1],
    createdBy: "Mike Johnson",
    createdAt: "2024-03-14 14:30",
    approvalStatus: "pending",
  },
];

// Mock User Roles
export const mockUsers: UserRole[] = [
  { id: "user-1", name: "John Doe", email: "john@pickcel.com", role: "admin" },
  { id: "user-2", name: "Sarah Smith", email: "sarah@pickcel.com", role: "publisher", region: "West Zone" },
  { id: "user-3", name: "Mike Johnson", email: "mike@pickcel.com", role: "publisher", region: "East Zone" },
  { id: "user-4", name: "Emma Wilson", email: "emma@pickcel.com", role: "reviewer", region: "West Zone" },
  { id: "user-5", name: "David Brown", email: "david@pickcel.com", role: "reviewer", region: "East Zone" },
];

// Mock Approval Requests
export const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: "approval-1",
    scheduleId: "sched-6",
    scheduleName: "Event Promotion Campaign",
    requestedBy: "Mike Johnson",
    requestedAt: "2024-03-14 14:35",
    status: "pending",
  },
];

// Current user (can be changed for testing different roles)
export const currentUser: UserRole = mockUsers[0]; // Default to admin

// Organization-level controls flag
export let orgLevelControls = false;

export const setOrgLevelControls = (enabled: boolean) => {
  orgLevelControls = enabled;
};

