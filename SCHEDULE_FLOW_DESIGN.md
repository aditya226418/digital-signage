# Schedule Flow Design

## Overview
This document outlines the flow for scheduling content in the SignageDashboard application, supporting both one-time and recurring content playback.

## Publishing Modes

### 1. Direct (Now/Quickplay)
- Immediate playback
- No scheduling
- Push content instantly to screens

### 2. Schedule (Simple Recurring)
- Single or multiple compositions
- Can play once or recur (daily/weekly/monthly)
- Starts at specific date/time
- Ends at specific date/time

### 3. Day Sequence (Advanced Time-based)
- Different content at different times throughout the day
- 24-hour timeline scheduling
- Multiple time slots with different compositions

---

## Schedule Mode - Detailed Flow

### Step 1: Basic Information
Configure when and where the schedule runs:

**Fields:**
- **Schedule Name**: Descriptive name (e.g., "Summer Promotion Campaign")
- **Target Screens**: Select which screens will show this content
- **Start Date & Time**: When the schedule should begin
- **End Date & Time**: When the schedule should end
- **Recurrence**: How often content plays
  - `once`: Plays one time at start date/time
  - `daily`: Plays every day at the start time
  - `weekly`: Plays every week at the start time
  - `monthly`: Plays every month at the start time
- **Priority**: High/Medium/Low (for conflict resolution)

**Time Behavior:**
- **Recurrence "once"**: Content plays from start date/time until end date/time (or until content finishes)
- **Recurrence "daily"**: Content plays every day between start time and end time, from start date to end date
- **Recurrence "weekly"**: Content plays every week on the same day, at start time
- **Recurrence "monthly"**: Content plays every month on the same date, at start time

### Step 2: Content Selection
Choose what content to play:

**Options:**
1. **Single Composition**
   - Select one composition
   - It loops during the scheduled time window
   
2. **Playlist (Multiple Compositions)**
   - Select multiple compositions
   - They play in sequence
   - After the last one finishes, the playlist loops
   - Each composition plays for its configured duration

**UI Design:**
- Multi-select composition picker
- Drag to reorder compositions
- Preview button for each composition
- Duration display per composition

### Step 3: Review & Publish
Preview and confirm the schedule:

**Display:**
- Schedule name and type
- Target screens (with count)
- Date range and recurrence
- Content list (with order if playlist)
- Estimated playback behavior
- Priority level

**Actions:**
- Submit for approval (if required)
- Publish immediately (if no approval required)
- Go back to edit
- Cancel

---

## Use Case Examples

### Example 1: One-time Emergency Message
**Scenario**: Show an urgent weather alert immediately for the next 2 hours

**Settings:**
- Start: Today, 2:00 PM
- End: Today, 4:00 PM
- Recurrence: Once
- Content: Single composition (Weather Alert)

**Result**: Content plays from 2:00 PM to 4:00 PM today, then stops.

---

### Example 2: Daily Breakfast Promotion
**Scenario**: Show breakfast menu every morning for 3 months

**Settings:**
- Start: Dec 1, 2024, 7:00 AM
- End: Feb 28, 2025, 10:00 AM
- Recurrence: Daily
- Content: Single composition (Breakfast Menu)

**Result**: Every day from Dec 1 to Feb 28, content plays from 7:00 AM to 10:00 AM.

---

### Example 3: Weekly Playlist Campaign
**Scenario**: Show 3 different promotions every Monday for 2 months

**Settings:**
- Start: Dec 1, 2024, 9:00 AM
- End: Jan 31, 2025, 5:00 PM
- Recurrence: Weekly
- Content: Playlist (3 compositions: Promo A, Promo B, Promo C)

**Result**: Every Monday from Dec 1 to Jan 31, the 3-composition playlist plays from 9:00 AM to 5:00 PM.

---

### Example 4: Monthly Product Showcase
**Scenario**: First of every month, show product catalog for 2 hours

**Settings:**
- Start: Jan 1, 2025, 12:00 PM
- End: Dec 31, 2025, 2:00 PM
- Recurrence: Monthly
- Content: Playlist (5 product compositions)

**Result**: On the 1st of each month throughout 2025, playlist plays from 12:00 PM to 2:00 PM.

---

## Day Sequence Mode - For Comparison

Day Sequence is different and more advanced:

**Use Case**: Restaurant with different content throughout the day
- 7:00 AM - 10:00 AM: Breakfast menu
- 10:00 AM - 11:00 AM: Morning specials
- 11:00 AM - 3:00 PM: Lunch menu
- 3:00 PM - 5:00 PM: Afternoon specials
- 5:00 PM - 10:00 PM: Dinner menu

**Key Difference**: Each time slot has its own content, creating a 24-hour timeline that repeats daily.

---

## Implementation Notes

### Content Duration
- Each composition has an inherent duration (sum of all media items)
- In a playlist, compositions play sequentially
- When the scheduled time window is longer than content duration, content loops
- When scheduled time window ends, playback stops (even mid-content)

### Conflict Resolution
- Multiple schedules targeting the same screen use priority levels
- Higher priority interrupts lower priority
- "Direct/Quickplay" always has highest priority

### Approval Workflow
- If `requiresApproval()` returns true, schedule goes to "pending_approval" status
- Approvers see schedule details and can approve/reject
- After approval, status changes to "scheduled"

---

## UI Enhancements Needed

### Step 2: Content Selection
Current implementation only allows single composition selection. Need to:

1. **Add playlist mode toggle or auto-detect**
   - If 1 composition selected: "Single composition mode"
   - If 2+ compositions selected: "Playlist mode"

2. **Multi-select composition picker**
   - Checkboxes or multi-select dropdown
   - Show selected compositions in order
   - Drag handles to reorder

3. **Composition details in selection**
   - Thumbnail preview
   - Duration display
   - Layout info

### Step 3: Preview Enhancements
- Show playlist order and total duration
- Explain playback behavior based on recurrence
- Visual timeline representation

---

## Technical Implementation

### Data Structure
```typescript
interface PlannedSchedule {
  id: string;
  name: string;
  type: "simple" | "daySequence";
  targetScreens: string[];
  screenNames: string;
  status: "scheduled" | "active" | "completed" | "pending_approval" | "rejected";
  startDate: string;
  endDate: string;
  recurrence: "once" | "daily" | "weekly" | "monthly";
  priority: "high" | "medium" | "low";
  
  // For simple schedules (single or playlist)
  contentId: string; // Single composition ID
  contentIds?: string[]; // Multiple composition IDs (playlist)
  contentName: string;
  
  // For day sequence
  daySequence?: {
    id: string;
    name: string;
    slots: TimeSlot[];
  };
  
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}
```

### Key Changes
1. Add `contentIds` array for playlist support
2. Keep backward compatibility with `contentId` for single composition
3. UI detects single vs playlist based on array length

