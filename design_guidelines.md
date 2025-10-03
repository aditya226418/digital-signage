# Design Guidelines: Pickcel Digital Signage Dashboard

## Design Approach

**Selected Approach:** Design System - Material Design inspired with enterprise dashboard patterns
**Justification:** This is a utility-focused SaaS dashboard where efficiency, clarity, and data visualization are paramount. We'll draw from proven enterprise dashboard patterns (Linear, Notion, Stripe Dashboard) with emphasis on clean data presentation and actionable interfaces.

## Core Design Principles

1. **Progressive Disclosure:** Adapt interface complexity based on user state (onboarding vs. engaged)
2. **Action-Oriented:** Prioritize CTAs and quick actions for productivity
3. **Status Clarity:** Use visual indicators (color, icons) for immediate system health understanding
4. **Breathing Room:** Generous whitespace prevents cognitive overload

## Color Palette

**Primary Brand Color:** 
- Light mode: 217 91% 60% (vibrant blue)
- Dark mode: 217 91% 65%

**Status Colors:**
- Success/Online: 142 71% 45% (green)
- Error/Offline: 0 84% 60% (red)
- Warning: 38 92% 50% (amber)
- Info: 199 89% 48% (cyan)

**Neutral Scale:**
- Background (light): 0 0% 100%
- Background (dark): 222 47% 11%
- Card background (light): 0 0% 100%
- Card background (dark): 217 33% 17%
- Border (light): 214 32% 91%
- Border (dark): 217 33% 24%
- Text primary: Inherit from mode
- Text secondary (light): 215 16% 47%
- Text secondary (dark): 217 33% 64%

## Typography

**Font Stack:** System fonts via Tailwind defaults (`font-sans`)

**Type Scale:**
- Headline (Welcome/Card titles): `text-2xl font-semibold`
- Subheadline: `text-lg font-medium`
- Body: `text-base font-normal`
- Caption/Metadata: `text-sm text-gray-600 dark:text-gray-400`
- Button text: `text-sm font-medium`

## Layout System

**Spacing Units:** Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24
- Card padding: `p-6`
- Section gaps: `gap-6`
- Button padding: `px-6 py-3`
- Tight spacing (metrics): `gap-2`
- Medium spacing (card groups): `gap-6`
- Large spacing (between sections): `gap-8`

**Grid System:**
- Desktop engaged state: 3-column grid (`grid-cols-3`)
- Tablet: 2-column (`md:grid-cols-2`)
- Mobile: Single column (default)
- Max container width: `max-w-7xl mx-auto`

## Component Library

### Cards
- Border radius: `rounded-xl`
- Shadow: `shadow-sm hover:shadow-md transition-shadow`
- Border: `border border-gray-200 dark:border-gray-700`
- Background: `bg-white dark:bg-gray-800`

### Buttons
**Primary CTA:**
- Colors: `bg-blue-600 hover:bg-blue-700 text-white`
- Size: `px-6 py-3 rounded-lg`
- Font: `text-sm font-medium`

**Secondary Actions:**
- Colors: `border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700`
- Size: `px-4 py-2 rounded-lg`

### Status Indicators
- Dot size: `h-2 w-2 rounded-full`
- Online: `bg-green-500`
- Offline: `bg-red-500`
- With pulse: `animate-pulse` for live status

### Progress Indicator (Onboarding)
- 3-step horizontal stepper
- Active step: `bg-blue-600 text-white`
- Completed: `bg-green-500 text-white`
- Pending: `bg-gray-200 text-gray-600`
- Size: `h-10 w-10 rounded-full flex items-center justify-center`

## State-Specific Layouts

### State 1: Onboarding (New User)
- Centered layout: `flex items-center justify-center min-h-screen`
- Welcome card: `max-w-2xl w-full p-12`
- Large hero button: `text-lg px-8 py-4`
- Progress indicator at top
- Subtle illustration/icon above welcome text
- Secondary actions in 2-column grid below primary CTA

### State 2: Engaged User
**Quick Actions Panel:** Horizontal row of 3 action buttons
**Screens Overview:** List with status dots, screen names, last seen timestamp
**Content Overview:** Grid of thumbnail previews (4 items max visible)
**Reports Snapshot:** Large metric numbers with labels, small chart indicators

## Icons
Use **Lucide React** icons consistently:
- Plus icon for "Add" actions
- Monitor icon for screens
- Image icon for media
- Play icon for playlists
- Activity icon for reports
- X icon for dismissible elements

## Transitions & Interactions
- All hover states: `transition-all duration-200`
- Card hover: `hover:shadow-md`
- Button hover: Color darkening + scale slightly `hover:scale-[1.02]`
- Smooth state transitions: `transition-opacity duration-300`
- Status changes: Fade between states

## Responsive Breakpoints
- Mobile: `< 768px` - Single column, stacked cards, hide secondary metrics
- Tablet: `768px - 1024px` - 2-column grid, abbreviated labels
- Desktop: `> 1024px` - Full 3-column grid, complete information

## Accessibility
- All interactive elements have focus rings: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
- Status conveyed through icons AND color
- Sufficient contrast ratios (WCAG AA)
- Keyboard navigation support