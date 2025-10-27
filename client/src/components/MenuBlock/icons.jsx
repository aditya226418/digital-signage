/**
 * MenuBlock Icon Library
 * SVG icons for menu item badges and tags
 */

// Veg Icons
export const LeafIcon = ({ className, color = "#4CAF50" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="6" fill={color} />
  </svg>
);

export const CircleLeafIcon = ({ className, color = "#4CAF50" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z" fill={color} />
  </svg>
);

export const SquareLeafIcon = ({ className, color = "#4CAF50" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="5" fill={color} />
  </svg>
);

// Non-Veg Icons
export const ChiliIcon = ({ className, color = "#D32F2F" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <polygon points="12,6 15,14 9,14" fill={color} />
  </svg>
);

export const CircleChiliIcon = ({ className, color = "#D32F2F" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13h-10v-2h10v2z" fill={color} />
  </svg>
);

export const SquareChiliIcon = ({ className, color = "#D32F2F" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" stroke={color} strokeWidth="2" fill="none" />
    <polygon points="12,8 14,13 10,13" fill={color} />
  </svg>
);

// Spicy Icons
export const FlameIcon = ({ className, color = "#FF5722" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 0.67s0.74 2.65 0.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l0.03-0.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29 0.59 2.65 0.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" fill={color} />
  </svg>
);

export const DoubleFlameIcon = ({ className, color = "#FF5722" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2s0.5 1.8 0.5 3.2c0 1.4-0.9 2.5-2.3 2.5S6 6.6 6 5.2l0.02-0.24C4.8 6.34 4 8.41 4 10.7c0 3 2.4 5.4 5.4 5.4s5.4-2.4 5.4-5.4c0-3.6-1.8-7-4.8-9.7z" fill={color} />
    <path d="M17 8s0.5 1.8 0.5 3.2c0 1.4-0.9 2.5-2.3 2.5s-2.2-1.1-2.2-2.5l0.02-0.24c-1.32 1.34-2.12 3.41-2.12 5.7 0 3 2.4 5.4 5.4 5.4s5.4-2.4 5.4-5.4c0-3.6-1.8-7-4.8-9.7z" fill={color} opacity="0.7" />
  </svg>
);

// Badge Icons
export const StarBadgeIcon = ({ className, color = "#FFC107" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={color} stroke={color} strokeWidth="1" />
  </svg>
);

export const RibbonBadgeIcon = ({ className, color = "#2196F3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C9.24 2 7 4.24 7 7c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill={color} />
    <path d="M8 12l-2 10 6-3 6 3-2-10H8z" fill={color} />
  </svg>
);

export const CrownBadgeIcon = ({ className, color = "#FFD700" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" fill={color} stroke={color} strokeWidth="1" />
  </svg>
);

export const CheckBadgeIcon = ({ className, color = "#4CAF50" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill={color} />
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NewBadgeIcon = ({ className, color = "#FF4081" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="8" width="20" height="8" rx="2" fill={color} />
    <text x="12" y="14" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">NEW</text>
  </svg>
);

export const SpicyBadgeIcon = ({ className, color = "#FF5722" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 2S11 4 11 6c0 1.5-1 2.7-2.5 2.7S6 7.5 6 6l.02-.26C4.8 7.1 4 9 4 11.2c0 2.8 2.2 5 5 5s5-2.2 5-5c0-3.3-1.7-6.5-4.5-9.2z" fill={color} />
  </svg>
);

export const ChefBadgeIcon = ({ className, color = "#795548" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 1.5c-1.5 0-2.7.6-3.6 1.5C7.5 2.3 5.8 2 4.5 3c-1.3 1-1.5 2.7-.9 4.2.5 1.3 1.6 2.3 2.9 2.8v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10c1.3-.5 2.4-1.5 2.9-2.8.6-1.5.4-3.2-.9-4.2-1.3-1-3-.7-4.4.1-.9-.9-2.1-1.6-3.6-1.6z" fill={color} />
  </svg>
);

// Allergen/Warning Icons
export const NutIcon = ({ className, color = "#8D6E63" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="12" rx="8" ry="10" fill={color} />
    <ellipse cx="12" cy="12" rx="5" ry="7" fill="#A1887F" />
  </svg>
);

export const AlertIcon = ({ className, color = "#FF9800" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19h-15L12 5.5zM11 10v5h2v-5h-2zm0 6v2h2v-2h-2z" fill={color} />
  </svg>
);

// Icon Map for easy access
export const ICON_MAP = {
  // Veg
  'leaf': LeafIcon,
  'circle-leaf': CircleLeafIcon,
  'square-leaf': SquareLeafIcon,
  // Non-veg
  'chili': ChiliIcon,
  'circle-chili': CircleChiliIcon,
  'square-chili': SquareChiliIcon,
  // Spicy
  'flame': FlameIcon,
  'double-flame': DoubleFlameIcon,
  // Badges
  'star': StarBadgeIcon,
  'ribbon': RibbonBadgeIcon,
  'crown': CrownBadgeIcon,
  'check': CheckBadgeIcon,
  'new': NewBadgeIcon,
  'spicy-badge': SpicyBadgeIcon,
  'chef': ChefBadgeIcon,
  // Allergen
  'nut': NutIcon,
  'alert': AlertIcon,
};

// Get icon component by name
export const getIcon = (iconName, props) => {
  const IconComponent = ICON_MAP[iconName] || LeafIcon;
  return <IconComponent {...props} />;
};

// Export all icons as an array for selection UI
export const ALL_ICONS = [
  { id: 'leaf', name: 'Leaf (Veg)', component: LeafIcon, category: 'veg' },
  { id: 'circle-leaf', name: 'Circle Leaf', component: CircleLeafIcon, category: 'veg' },
  { id: 'square-leaf', name: 'Square Leaf', component: SquareLeafIcon, category: 'veg' },
  { id: 'chili', name: 'Chili (Non-veg)', component: ChiliIcon, category: 'nonveg' },
  { id: 'circle-chili', name: 'Circle Chili', component: CircleChiliIcon, category: 'nonveg' },
  { id: 'square-chili', name: 'Square Chili', component: SquareChiliIcon, category: 'nonveg' },
  { id: 'flame', name: 'Flame', component: FlameIcon, category: 'spicy' },
  { id: 'double-flame', name: 'Double Flame', component: DoubleFlameIcon, category: 'spicy' },
  { id: 'star', name: 'Star Badge', component: StarBadgeIcon, category: 'badge' },
  { id: 'ribbon', name: 'Ribbon', component: RibbonBadgeIcon, category: 'badge' },
  { id: 'crown', name: 'Crown', component: CrownBadgeIcon, category: 'badge' },
  { id: 'check', name: 'Check', component: CheckBadgeIcon, category: 'badge' },
  { id: 'new', name: 'NEW Badge', component: NewBadgeIcon, category: 'badge' },
  { id: 'spicy-badge', name: 'Spicy', component: SpicyBadgeIcon, category: 'spicy' },
  { id: 'chef', name: "Chef's Choice", component: ChefBadgeIcon, category: 'badge' },
  { id: 'nut', name: 'Contains Nuts', component: NutIcon, category: 'allergen' },
  { id: 'alert', name: 'Alert', component: AlertIcon, category: 'allergen' },
];

