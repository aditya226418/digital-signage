export interface LayoutZone {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
}

export interface LayoutSlide {
  id: string;
  name: string;
  zones: LayoutZone[];
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  zones: LayoutZone[]; // For backward compatibility - used when slides is undefined
  slides?: LayoutSlide[]; // For multi-slide layouts
  resolution: string;
  type: "single" | "multi-zone" | "grid";
}

export interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "app";
  thumbnail: string; // lucide-react icon name
  thumbnailUrl?: string; // actual image URL
  duration: number; // seconds
  category: string;
}

export const mockLayouts: LayoutTemplate[] = [
  {
    id: "layout-1",
    name: "Full Screen",
    description: "Single full-screen zone for maximum impact",
    resolution: "1920x1080",
    type: "single",
    zones: [
      {
        id: "zone-1",
        name: "Main Display",
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    ],
  },
  {
    id: "layout-2",
    name: "Split Screen (Vertical)",
    description: "Two equal vertical zones side by side",
    resolution: "1920x1080",
    type: "multi-zone",
    zones: [
      {
        id: "zone-1",
        name: "Left Panel",
        x: 0,
        y: 0,
        width: 50,
        height: 100,
      },
      {
        id: "zone-2",
        name: "Right Panel",
        x: 50,
        y: 0,
        width: 50,
        height: 100,
      },
    ],
  },
  {
    id: "layout-3",
    name: "Header + Content",
    description: "Top banner with main content area below",
    resolution: "1920x1080",
    type: "multi-zone",
    zones: [
      {
        id: "zone-1",
        name: "Header Banner",
        x: 0,
        y: 0,
        width: 100,
        height: 25,
      },
      {
        id: "zone-2",
        name: "Main Content",
        x: 0,
        y: 25,
        width: 100,
        height: 75,
      },
    ],
  },
  {
    id: "layout-4",
    name: "Grid 2×2",
    description: "Four equal quadrants in a grid",
    resolution: "1920x1080",
    type: "grid",
    zones: [
      {
        id: "zone-1",
        name: "Top Left",
        x: 0,
        y: 0,
        width: 50,
        height: 50,
      },
      {
        id: "zone-2",
        name: "Top Right",
        x: 50,
        y: 0,
        width: 50,
        height: 50,
      },
      {
        id: "zone-3",
        name: "Bottom Left",
        x: 0,
        y: 50,
        width: 50,
        height: 50,
      },
      {
        id: "zone-4",
        name: "Bottom Right",
        x: 50,
        y: 50,
        width: 50,
        height: 50,
      },
    ],
  },
  {
    id: "layout-5",
    name: "Sidebar + Main",
    description: "Narrow sidebar with wide main content area",
    resolution: "1920x1080",
    type: "multi-zone",
    zones: [
      {
        id: "zone-1",
        name: "Sidebar",
        x: 0,
        y: 0,
        width: 25,
        height: 100,
      },
      {
        id: "zone-2",
        name: "Main Area",
        x: 25,
        y: 0,
        width: 75,
        height: 100,
      },
    ],
  },
  {
    id: "layout-6",
    name: "Portrait Full Screen",
    description: "Single full-screen zone for portrait displays",
    resolution: "1080x1920",
    type: "single",
    zones: [
      {
        id: "zone-1",
        name: "Full Display",
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    ],
  },
  {
    id: "layout-7",
    name: "Triple Stack",
    description: "Three horizontal sections stacked vertically",
    resolution: "1920x1080",
    type: "multi-zone",
    zones: [
      {
        id: "zone-1",
        name: "Top Section",
        x: 0,
        y: 0,
        width: 100,
        height: 33.33,
      },
      {
        id: "zone-2",
        name: "Middle Section",
        x: 0,
        y: 33.33,
        width: 100,
        height: 33.33,
      },
      {
        id: "zone-3",
        name: "Bottom Section",
        x: 0,
        y: 66.66,
        width: 100,
        height: 33.34,
      },
    ],
  },
  {
    id: "layout-8",
    name: "Portrait Header + Content",
    description: "Top banner with main content for portrait displays",
    resolution: "1080x1920",
    type: "multi-zone",
    zones: [
      {
        id: "zone-1",
        name: "Header Banner",
        x: 0,
        y: 0,
        width: 100,
        height: 20,
      },
      {
        id: "zone-2",
        name: "Main Content",
        x: 0,
        y: 20,
        width: 100,
        height: 80,
      },
    ],
  },
  {
    id: "layout-9",
    name: "Portrait Split Screen",
    description: "Two equal zones stacked vertically for portrait displays",
    resolution: "1080x1920",
    type: "multi-zone",
    zones: [
      {
        id: "zone-1",
        name: "Top Section",
        x: 0,
        y: 0,
        width: 100,
        height: 50,
      },
      {
        id: "zone-2",
        name: "Bottom Section",
        x: 0,
        y: 50,
        width: 100,
        height: 50,
      },
    ],
  },
  {
    id: "layout-10",
    name: "Portrait Triple Stack",
    description: "Three zones stacked vertically for portrait displays",
    resolution: "1080x1920",
    type: "multi-zone",
    zones: [
      {
        id: "zone-1",
        name: "Top Section",
        x: 0,
        y: 0,
        width: 100,
        height: 33.33,
      },
      {
        id: "zone-2",
        name: "Middle Section",
        x: 0,
        y: 33.33,
        width: 100,
        height: 33.33,
      },
      {
        id: "zone-3",
        name: "Bottom Section",
        x: 0,
        y: 66.66,
        width: 100,
        height: 33.34,
      },
    ],
  },
  {
    id: "layout-11",
    name: "Grid 3×3",
    description: "Nine equal zones in a 3x3 grid",
    resolution: "1920x1080",
    type: "grid",
    zones: [
      {
        id: "zone-1",
        name: "Top Left",
        x: 0,
        y: 0,
        width: 33.33,
        height: 33.33,
      },
      {
        id: "zone-2",
        name: "Top Center",
        x: 33.33,
        y: 0,
        width: 33.33,
        height: 33.33,
      },
      {
        id: "zone-3",
        name: "Top Right",
        x: 66.66,
        y: 0,
        width: 33.34,
        height: 33.33,
      },
      {
        id: "zone-4",
        name: "Middle Left",
        x: 0,
        y: 33.33,
        width: 33.33,
        height: 33.33,
      },
      {
        id: "zone-5",
        name: "Center",
        x: 33.33,
        y: 33.33,
        width: 33.33,
        height: 33.33,
      },
      {
        id: "zone-6",
        name: "Middle Right",
        x: 66.66,
        y: 33.33,
        width: 33.34,
        height: 33.33,
      },
      {
        id: "zone-7",
        name: "Bottom Left",
        x: 0,
        y: 66.66,
        width: 33.33,
        height: 33.34,
      },
      {
        id: "zone-8",
        name: "Bottom Center",
        x: 33.33,
        y: 66.66,
        width: 33.33,
        height: 33.34,
      },
      {
        id: "zone-9",
        name: "Bottom Right",
        x: 66.66,
        y: 66.66,
        width: 33.34,
        height: 33.34,
      },
    ],
  },
];

export const mockMediaLibrary: MediaItem[] = [
  // Images
  {
    id: "media-1",
    name: "Summer Sale Banner",
    type: "image",
    thumbnail: "ImageIcon",
    thumbnailUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop",
    duration: 10,
    category: "Promotional",
  },
  {
    id: "media-2",
    name: "Product Showcase",
    type: "image",
    thumbnail: "ShoppingBag",
    thumbnailUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    duration: 8,
    category: "Products",
  },
  {
    id: "media-3",
    name: "Company Logo",
    type: "image",
    thumbnail: "Building2",
    thumbnailUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    duration: 5,
    category: "Branding",
  },
  {
    id: "media-4",
    name: "Team Photo",
    type: "image",
    thumbnail: "Users",
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    duration: 12,
    category: "Company",
  },
  {
    id: "media-5",
    name: "Menu Board",
    type: "image",
    thumbnail: "UtensilsCrossed",
    thumbnailUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    duration: 15,
    category: "Menu",
  },
  {
    id: "media-6",
    name: "Welcome Message",
    type: "image",
    thumbnail: "Heart",
    thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop",
    duration: 8,
    category: "Welcome",
  },
  {
    id: "media-7",
    name: "Store Hours",
    type: "image",
    thumbnail: "Clock",
    thumbnailUrl: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&h=300&fit=crop",
    duration: 10,
    category: "Information",
  },
  {
    id: "media-8",
    name: "Social Media",
    type: "image",
    thumbnail: "Share2",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
    duration: 7,
    category: "Social",
  },
  // Videos
  {
    id: "media-9",
    name: "Brand Story Video",
    type: "video",
    thumbnail: "Video",
    thumbnailUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop",
    duration: 30,
    category: "Branding",
  },
  {
    id: "media-10",
    name: "Product Demo",
    type: "video",
    thumbnail: "PlayCircle",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    duration: 45,
    category: "Products",
  },
  {
    id: "media-11",
    name: "Customer Testimonial",
    type: "video",
    thumbnail: "MessageSquare",
    thumbnailUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
    duration: 20,
    category: "Testimonials",
  },
  {
    id: "media-12",
    name: "Event Highlights",
    type: "video",
    thumbnail: "Sparkles",
    thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    duration: 25,
    category: "Events",
  },
  {
    id: "media-13",
    name: "Behind the Scenes",
    type: "video",
    thumbnail: "Film",
    thumbnailUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop",
    duration: 35,
    category: "Company",
  },
  // Apps
  {
    id: "media-14",
    name: "Weather Widget",
    type: "app",
    thumbnail: "CloudSun",
    duration: 0,
    category: "Apps",
  },
  {
    id: "media-15",
    name: "Live News Feed",
    type: "app",
    thumbnail: "Newspaper",
    duration: 0,
    category: "Apps",
  },
  {
    id: "media-16",
    name: "Social Media Feed",
    type: "app",
    thumbnail: "Instagram",
    duration: 0,
    category: "Apps",
  },
  {
    id: "media-17",
    name: "Calendar",
    type: "app",
    thumbnail: "Calendar",
    duration: 0,
    category: "Apps",
  },
  {
    id: "media-18",
    name: "World Clock",
    type: "app",
    thumbnail: "Globe",
    duration: 0,
    category: "Apps",
  },
  {
    id: "media-19",
    name: "Stock Ticker",
    type: "app",
    thumbnail: "TrendingUp",
    duration: 0,
    category: "Apps",
  },
  {
    id: "media-20",
    name: "QR Code Generator",
    type: "app",
    thumbnail: "QrCode",
    duration: 0,
    category: "Apps",
  },
];

export const recentlyUsedMedia = ["media-1", "media-9", "media-14", "media-5"];

