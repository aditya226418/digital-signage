# Full-Screen Modal Layout Updates

## Overview
Both `PublishDirectModal.tsx` and `CreateScheduleWizard.tsx` have been updated to open in full-screen mode with optimized layouts that utilize the extra space efficiently.

## Changes Made

### 1. **PublishDirectModal.tsx**

#### Previous Layout
- Constrained width: `sm:max-w-[600px]`
- Single-column layout
- Limited space utilization

#### New Layout
- **Full-screen mode**: `max-w-full h-screen max-h-screen flex flex-col`
- **Two-column design**:
  - **Left Sidebar (264px)**: 
    - Progress navigation with step indicators
    - Visual step completion (✓, current number, or greyed out)
    - Live summary card showing selected screens and content
    - Clickable steps to navigate backwards
  
  - **Main Content Area (flexible)**: 
    - Larger step content area with breathing room
    - Step 1: Full-width screen selector
    - Step 2: Full-width content picker
    - Step 3: **Two-column grid** for settings
      - Left column: Playback settings (play indefinitely, duration)
      - Right column: Behavior options (override, make default)
      - Bottom: Publish summary card

#### Key Improvements
✅ Progress sidebar provides persistent visual feedback  
✅ Summary card on sidebar keeps key info visible  
✅ Step 3 options spread into two columns for better organization  
✅ Larger content area reduces crowding  
✅ Better visual hierarchy with improved spacing  

---

### 2. **CreateScheduleWizard.tsx**

#### Previous Layout
- Constrained width: `sm:max-w-[1000px]` with max-height
- Single-column for Step 1
- Limited horizontal space

#### New Layout
- **Full-screen mode**: `max-w-full h-screen max-h-screen flex flex-col`
- **Two-column design**:
  - **Left Sidebar (264px)**: 
    - Progress navigation with step indicators
    - Shows schedule name, number of screens, and recurrence
    - Clickable for navigation between completed steps
  
  - **Main Content Area (flexible)**:
    - Step 1: **Three-column grid** for form fields
      - Column 1: Schedule name, recurrence, priority (3 fields)
      - Column 2: Start date & end date (2 fields)
      - Column 3: Target screens picker in bordered container
    
    - Step 2: Content selection (single composition or playlist)
      - Full-width tabs for single/playlist mode
      - Large scrollable composition list
      - Playlist order preview
      - Helpful info box about scheduling behavior
    
    - Step 3: Schedule preview (full content area)

#### Key Improvements
✅ Three-column layout in Step 1 distributes form fields efficiently  
✅ Progress sidebar stays visible while filling out form  
✅ Summary information always accessible from sidebar  
✅ Better separation of concerns (info/dates/screens)  
✅ Content selection has more breathing room  

---

## Layout Benefits

### Visual Hierarchy
- Sidebar keeps user oriented on progress
- Main content area focuses on current task
- Clean separation between navigation and content

### Space Utilization
- Horizontal space used for content distribution
- Reduces vertical scrolling needs
- Forms and pickers can display more items
- Better use of widescreen displays

### User Experience
- Progress always visible
- Can navigate backwards by clicking sidebar steps
- Summary information prevents need to reference previous steps
- Smoother transitions between steps

---

## Technical Details

### Dialog Configuration
Both dialogs now use:
```tsx
<DialogContent className="max-w-full h-screen max-h-screen flex flex-col">
```

This ensures:
- Full viewport width and height
- Flexbox column layout for header + content + footer
- Proper overflow handling

### Sidebar Implementation
Common sidebar pattern:
```tsx
<div className="flex flex-1 gap-6 overflow-hidden">
  {/* Left Sidebar */}
  <div className="w-64 border-r flex flex-col gap-6 py-6 px-6 overflow-y-auto">
    {/* Progress steps with visual indicators */}
    {/* Summary card */}
  </div>

  {/* Main Content */}
  <div className="flex-1 py-6 px-6 overflow-y-auto">
    {/* Step content */}
  </div>
</div>
```

### Grid Layouts
- **PublishDirectModal Step 3**: `grid-cols-2` for settings
- **CreateScheduleWizard Step 1**: `grid-cols-3` for form distribution

---

## Responsive Notes
Currently optimized for desktop/large screens. Both layouts maintain full-screen behavior and may benefit from responsive breakpoints for smaller devices if needed.

---

## Files Modified
1. `/client/src/components/PublishDirectModal.tsx`
2. `/client/src/components/CreateScheduleWizard.tsx`

No linting errors introduced.

