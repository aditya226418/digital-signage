import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { 
  Search, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Eye,
  Image as ImageIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  ZoomIn,
  ZoomOut,
  Monitor,
  Users,
  Star,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  Copy,
  Trash2,
  Layers,
  Save,
  Calendar,
  Download,
  Share2,
  Square,
  Circle,
  Triangle,
  Tag,
  Palette,
  Package,
  Grid3x3,
  Menu,
  ChevronRight as ChevronRightIcon,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Video,
  QrCode,
  Minus,
  Quote,
  Hexagon,
  MoveRight,
  FileText,
  Megaphone,
  Coffee,
  Building2,
  Cloud,
  Newspaper,
  Timer,
  Settings,
  Droplet,
  Zap,
  Play,
  Waves,
  Award,
  GripVertical,
  Undo,
  Redo,
  AlignHorizontalDistributeCenter,
  Group,
  Ungroup,
  Globe,
  Sheet,
  Instagram,
  Youtube,
  Rss,
  CalendarDays,
  MessageSquarePlus,
  Tv,
  BarChart3,
  MapPin,
  Dumbbell,
  Hotel,
  GraduationCap,
  Wand2,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SlideElement {
  id: string;
  type: "text" | "image" | "shape" | "video" | "widget" | "template";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: {
    // Text styles
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: "left" | "center" | "right" | "justify";
    lineHeight?: number;
    letterSpacing?: number;
    backgroundColor?: string;
    // Shape styles
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    cornerRadius?: number;
    opacity?: number;
    // Image styles
    filter?: string;
    brightness?: number;
    contrast?: number;
    borderRadius?: number;
  };
  // Widget-specific data
  widgetType?: "clock" | "weather" | "news" | "countdown" | "google-sheets" | "website" | "instagram" | "youtube" | "rss" | "calendar" | "qrcode" | "analytics" | "camera" | "maps";
  widgetConfig?: {
    theme?: "light" | "dark";
    format?: string;
    dataSource?: string;
  };
  // Lock/layer
  locked?: boolean;
  zIndex?: number;
}

interface Slide {
  id: string;
  thumbnail: string;
  elements: SlideElement[];
  duration: number;
  transition: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  industry: string;
  thumbnail: string;
  slideCount: number;
  features: string[];
  previewImages: string[];
  slides: Slide[];
}

interface TemplateSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ElementCategory = "templates" | "texts" | "labels" | "media" | "shapes" | "widgets";
type FilterType = "all" | "text" | "images" | "videos" | "widgets" | "shapes" | "templates";

interface ElementType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: ElementCategory;
  defaultProps: Partial<SlideElement>;
  description?: string;
  thumbnail?: string;
}

interface StockAsset {
  id: string;
  name: string;
  thumbnail: string;
  category: "stock-image" | "pickcel-stock" | "pickcel-app";
}

// Comprehensive Element Catalog organized by 5 categories
const ELEMENT_CATALOG: ElementType[] = [
  // ========== TEMPLATES ==========
  {
    id: "template-restaurant",
    name: "Restaurant Menu",
    icon: Coffee,
    category: "templates",
    description: "Digital menu board with pricing",
    thumbnail: "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "restaurant-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-retail",
    name: "Retail Promo",
    icon: Megaphone,
    category: "templates",
    description: "Sale and promotional display",
    thumbnail: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "retail-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-corporate",
    name: "Corporate Announcement",
    icon: Building2,
    category: "templates",
    description: "Office information display",
    thumbnail: "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "corporate-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-restaurant-2",
    name: "Breakfast Special",
    icon: Coffee,
    category: "templates",
    description: "Morning menu highlights",
    thumbnail: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "restaurant-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-restaurant-3",
    name: "Happy Hour",
    icon: Coffee,
    category: "templates",
    description: "Drinks and appetizers promo",
    thumbnail: "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "restaurant-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-retail-2",
    name: "Flash Sale",
    icon: Megaphone,
    category: "templates",
    description: "Limited time offer",
    thumbnail: "https://images.pexels.com/photos/1040430/pexels-photo-1040430.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "retail-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-retail-3",
    name: "New Arrivals",
    icon: Megaphone,
    category: "templates",
    description: "Latest products showcase",
    thumbnail: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "retail-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-corporate-2",
    name: "Team Meeting",
    icon: Building2,
    category: "templates",
    description: "Conference room display",
    thumbnail: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "corporate-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-corporate-3",
    name: "Employee Spotlight",
    icon: Building2,
    category: "templates",
    description: "Recognition board",
    thumbnail: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "corporate-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-healthcare-1",
    name: "Health Tips",
    icon: Heart,
    category: "templates",
    description: "Wellness information",
    thumbnail: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "healthcare-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-healthcare-2",
    name: "Appointment Reminder",
    icon: Heart,
    category: "templates",
    description: "Patient scheduling",
    thumbnail: "https://images.pexels.com/photos/48603/pexels-photo-48603.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "healthcare-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-healthcare-3",
    name: "Safety Guidelines",
    icon: Heart,
    category: "templates",
    description: "Health protocols",
    thumbnail: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "healthcare-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-fitness-1",
    name: "Class Schedule",
    icon: Dumbbell,
    category: "templates",
    description: "Gym timetable",
    thumbnail: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "fitness-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-fitness-2",
    name: "Workout Tips",
    icon: Dumbbell,
    category: "templates",
    description: "Exercise motivation",
    thumbnail: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "fitness-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-fitness-3",
    name: "Membership Deals",
    icon: Dumbbell,
    category: "templates",
    description: "Gym promotions",
    thumbnail: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "fitness-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-hotel-1",
    name: "Welcome Guest",
    icon: Hotel,
    category: "templates",
    description: "Lobby display",
    thumbnail: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "hotel-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-hotel-2",
    name: "Amenities Guide",
    icon: Hotel,
    category: "templates",
    description: "Hotel services",
    thumbnail: "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "hotel-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-hotel-3",
    name: "Event Calendar",
    icon: Hotel,
    category: "templates",
    description: "Upcoming events",
    thumbnail: "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "hotel-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-education-1",
    name: "Class Announcements",
    icon: GraduationCap,
    category: "templates",
    description: "School notices",
    thumbnail: "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "education-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-education-2",
    name: "Campus Events",
    icon: GraduationCap,
    category: "templates",
    description: "Student activities",
    thumbnail: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "education-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },
  {
    id: "template-education-3",
    name: "Study Tips",
    icon: GraduationCap,
    category: "templates",
    description: "Academic resources",
    thumbnail: "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?w=160&h=100&fit=crop",
    defaultProps: {
      type: "template",
      content: "education-template",
      position: { x: 0, y: 0 },
      size: { width: 960, height: 540 }
    }
  },

  // ========== TEXTS ==========
  {
    id: "headline",
    name: "Headline",
    icon: Type,
    category: "texts",
    description: "Large heading text",
    defaultProps: {
      type: "text",
      content: "Grand Buffet Today",
      position: { x: 100, y: 100 },
      size: { width: 760, height: 80 },
      style: { fontSize: 56, fontFamily: "Inter", color: "#1a1a1a", bold: true, align: "center" }
    }
  },
  {
    id: "subtitle",
    name: "Subtitle",
    icon: Type,
    category: "texts",
    description: "Secondary heading",
    defaultProps: {
      type: "text",
      content: "Breakfast 7-10 AM",
      position: { x: 100, y: 200 },
      size: { width: 760, height: 50 },
      style: { fontSize: 28, fontFamily: "Inter", color: "#666666", align: "center" }
    }
  },
  {
    id: "body-text",
    name: "Body Text",
    icon: FileText,
    category: "texts",
    description: "Paragraph text",
    defaultProps: {
      type: "text",
      content: "Add your body text here with details and information",
      position: { x: 100, y: 280 },
      size: { width: 760, height: 100 },
      style: { fontSize: 18, fontFamily: "Inter", color: "#333333", align: "left", lineHeight: 1.6 }
    }
  },
  {
    id: "quote",
    name: "Quote Block",
    icon: Quote,
    category: "texts",
    description: "Stylized quotation",
    defaultProps: {
      type: "text",
      content: '"Quality is not an act, it is a habit"',
      position: { x: 150, y: 200 },
      size: { width: 660, height: 100 },
      style: { fontSize: 26, fontFamily: "Georgia", color: "#555555", italic: true, align: "center" }
    }
  },
  {
    id: "ticker",
    name: "Scrolling Ticker",
    icon: MoveRight,
    category: "texts",
    description: "Moving text banner",
    defaultProps: {
      type: "text",
      content: "Breaking News • Latest Updates • Special Offers",
      position: { x: 0, y: 490 },
      size: { width: 960, height: 50 },
      style: { fontSize: 20, fontFamily: "Inter", color: "#ffffff", bold: true, align: "center", backgroundColor: "#dc2626" }
    }
  },
  {
    id: "datetime",
    name: "Date & Time",
    icon: Clock,
    category: "texts",
    description: "Current date/time display",
    defaultProps: {
      type: "text",
      content: "Monday, Oct 27 • 12:34 PM",
      position: { x: 700, y: 30 },
      size: { width: 230, height: 40 },
      style: { fontSize: 16, fontFamily: "Inter", color: "#666666", align: "right" }
    }
  },
  {
    id: "menu-block",
    name: "Menu Block",
    icon: FileText,
    category: "texts",
    description: "Item with price layout",
    defaultProps: {
      type: "text",
      content: "Veg Thali ₹199",
      position: { x: 100, y: 200 },
      size: { width: 350, height: 60 },
      style: { fontSize: 24, fontFamily: "Inter", color: "#1a1a1a", bold: true, align: "left" }
    }
  },

  // ========== LABELS ==========
  {
    id: "promo-label",
    name: "Promo Label",
    icon: Tag,
    category: "labels",
    description: "Sale tag badge",
    defaultProps: {
      type: "text",
      content: "50% OFF",
      position: { x: 750, y: 50 },
      size: { width: 150, height: 70 },
      style: { fontSize: 32, fontFamily: "Inter", color: "#ffffff", bold: true, align: "center", backgroundColor: "#dc2626", cornerRadius: 8 }
    }
  },

  // ========== MEDIA ==========
  {
    id: "image-placeholder",
    name: "Image",
    icon: ImageIcon,
    category: "media",
    description: "Sample Image 1",
    defaultProps: {
      type: "image",
      content: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop",
      position: { x: 280, y: 120 },
      size: { width: 400, height: 300 }
    }
  },
  {
    id: "video-placeholder",
    name: "Video",
    icon: Video,
    category: "media",
    description: "Video content",
    defaultProps: {
      type: "video",
      content: "video_placeholder",
      position: { x: 160, y: 90 },
      size: { width: 640, height: 360 }
    }
  },
  {
    id: "logo-placeholder",
    name: "Logo",
    icon: Award,
    category: "media",
    description: "Brand logo",
    defaultProps: {
      type: "image",
      content: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
      position: { x: 50, y: 30 },
      size: { width: 120, height: 120 }
    }
  },
  {
    id: "qrcode",
    name: "QR Code",
    icon: QrCode,
    category: "media",
    description: "Scannable QR code",
    defaultProps: {
      type: "shape",
      content: "qrcode",
      position: { x: 730, y: 320 },
      size: { width: 180, height: 180 },
      style: { color: "#000000" }
    }
  },

  // ========== SHAPES & DESIGN ==========
  {
    id: "rectangle",
    name: "Rectangle",
    icon: Square,
    category: "shapes",
    description: "Basic rectangle",
    defaultProps: {
      type: "shape",
      content: "rectangle",
      position: { x: 200, y: 200 },
      size: { width: 300, height: 200 },
      style: { fillColor: "#3b82f6", opacity: 1 }
    }
  },
  {
    id: "circle",
    name: "Circle",
    icon: Circle,
    category: "shapes",
    description: "Basic circle",
    defaultProps: {
      type: "shape",
      content: "circle",
      position: { x: 250, y: 200 },
      size: { width: 200, height: 200 },
      style: { fillColor: "#10b981", opacity: 1 }
    }
  },
  {
    id: "triangle",
    name: "Triangle",
    icon: Triangle,
    category: "shapes",
    description: "Triangle shape",
    defaultProps: {
      type: "shape",
      content: "triangle",
      position: { x: 250, y: 200 },
      size: { width: 200, height: 200 },
      style: { fillColor: "#f59e0b", opacity: 1 }
    }
  },
  {
    id: "line",
    name: "Line / Divider",
    icon: Minus,
    category: "shapes",
    description: "Horizontal line",
    defaultProps: {
      type: "shape",
      content: "line",
      position: { x: 100, y: 270 },
      size: { width: 760, height: 4 },
      style: { fillColor: "#9ca3af", opacity: 1 }
    }
  },
  {
    id: "star",
    name: "Badge / Star",
    icon: Star,
    category: "shapes",
    description: "Star badge",
    defaultProps: {
      type: "shape",
      content: "star",
      position: { x: 300, y: 200 },
      size: { width: 150, height: 150 },
      style: { fillColor: "#fbbf24", opacity: 1 }
    }
  },
  {
    id: "hexagon",
    name: "Hexagon",
    icon: Hexagon,
    category: "shapes",
    description: "Hexagon shape",
    defaultProps: {
      type: "shape",
      content: "hexagon",
      position: { x: 300, y: 200 },
      size: { width: 180, height: 180 },
      style: { fillColor: "#a855f7", opacity: 1 }
    }
  },
  {
    id: "wave",
    name: "Wave Pattern",
    icon: Waves,
    category: "shapes",
    description: "Decorative wave",
    defaultProps: {
      type: "shape",
      content: "wave",
      position: { x: 0, y: 400 },
      size: { width: 960, height: 140 },
      style: { fillColor: "#06b6d4", opacity: 0.3 }
    }
  },
  {
    id: "gradient",
    name: "Gradient Fill",
    icon: Droplet,
    category: "shapes",
    description: "Gradient background",
    defaultProps: {
      type: "shape",
      content: "gradient",
      position: { x: 50, y: 50 },
      size: { width: 860, height: 440 },
      style: { fillColor: "#667eea", opacity: 0.9 }
    }
  },

  // ========== WIDGETS & APPS ==========
  {
    id: "clock-widget",
    name: "Clock",
    icon: Clock,
    category: "widgets",
    description: "12:34 PM Analog",
    defaultProps: {
      type: "widget",
      content: "clock",
      position: { x: 700, y: 50 },
      size: { width: 200, height: 120 },
      widgetType: "clock",
      widgetConfig: { format: "12h", theme: "light" }
    }
  },
  {
    id: "weather-widget",
    name: "Weather",
    icon: Cloud,
    category: "widgets",
    description: "Bengaluru, 27°C",
    defaultProps: {
      type: "widget",
      content: "weather",
      position: { x: 700, y: 200 },
      size: { width: 200, height: 150 },
      widgetType: "weather",
      widgetConfig: { theme: "light" }
    }
  },
  {
    id: "news-ticker",
    name: "News Ticker",
    icon: Newspaper,
    category: "widgets",
    description: "Live news feed",
    defaultProps: {
      type: "widget",
      content: "news",
      position: { x: 0, y: 480 },
      size: { width: 960, height: 60 },
      widgetType: "news",
      widgetConfig: { theme: "dark" }
    }
  },
  {
    id: "countdown",
    name: "Countdown Timer",
    icon: Timer,
    category: "widgets",
    description: "Event countdown",
    defaultProps: {
      type: "widget",
      content: "countdown",
      position: { x: 300, y: 200 },
      size: { width: 360, height: 140 },
      widgetType: "countdown",
      widgetConfig: { theme: "light" }
    }
  },

  // ========== INTEGRATIONS (Sub-category of Widgets) ==========
  {
    id: "google-sheets",
    name: "Google Sheets",
    icon: Sheet,
    category: "widgets",
    description: "Live spreadsheet data",
    defaultProps: {
      type: "widget",
      content: "google-sheets",
      position: { x: 100, y: 100 },
      size: { width: 560, height: 320 },
      widgetType: "google-sheets",
      widgetConfig: { theme: "light", dataSource: "" }
    }
  },
  {
    id: "website-display",
    name: "Website Display",
    icon: Globe,
    category: "widgets",
    description: "Embed any webpage",
    defaultProps: {
      type: "widget",
      content: "website",
      position: { x: 100, y: 100 },
      size: { width: 760, height: 440 },
      widgetType: "website",
      widgetConfig: { theme: "light", dataSource: "" }
    }
  },
  {
    id: "instagram-feed",
    name: "Instagram Feed",
    icon: Instagram,
    category: "widgets",
    description: "Live Instagram posts",
    defaultProps: {
      type: "widget",
      content: "instagram",
      position: { x: 100, y: 100 },
      size: { width: 400, height: 500 },
      widgetType: "instagram",
      widgetConfig: { theme: "light", dataSource: "" }
    }
  },
  {
    id: "youtube-video",
    name: "YouTube Player",
    icon: Youtube,
    category: "widgets",
    description: "Embed YouTube videos",
    defaultProps: {
      type: "widget",
      content: "youtube",
      position: { x: 160, y: 90 },
      size: { width: 640, height: 360 },
      widgetType: "youtube",
      widgetConfig: { theme: "light", dataSource: "" }
    }
  },
  {
    id: "rss-feed",
    name: "RSS Feed",
    icon: Rss,
    category: "widgets",
    description: "Display RSS content",
    defaultProps: {
      type: "widget",
      content: "rss",
      position: { x: 100, y: 100 },
      size: { width: 760, height: 340 },
      widgetType: "rss",
      widgetConfig: { theme: "light", dataSource: "" }
    }
  },
  {
    id: "calendar-widget",
    name: "Calendar",
    icon: CalendarDays,
    category: "widgets",
    description: "Google/Outlook calendar",
    defaultProps: {
      type: "widget",
      content: "calendar",
      position: { x: 100, y: 100 },
      size: { width: 460, height: 380 },
      widgetType: "calendar",
      widgetConfig: { theme: "light", dataSource: "" }
    }
  },
  {
    id: "qr-code-widget",
    name: "QR Code",
    icon: QrCode,
    category: "widgets",
    description: "Dynamic QR code",
    defaultProps: {
      type: "widget",
      content: "qrcode",
      position: { x: 700, y: 150 },
      size: { width: 200, height: 200 },
      widgetType: "qrcode",
      widgetConfig: { theme: "light", dataSource: "" }
    }
  },
  {
    id: "analytics-dashboard",
    name: "Analytics",
    icon: BarChart3,
    category: "widgets",
    description: "Data visualization",
    defaultProps: {
      type: "widget",
      content: "analytics",
      position: { x: 100, y: 100 },
      size: { width: 760, height: 340 },
      widgetType: "analytics",
      widgetConfig: { theme: "light", dataSource: "" }
    }
  },
  {
    id: "live-camera",
    name: "Live Camera",
    icon: Tv,
    category: "widgets",
    description: "IP camera feed",
    defaultProps: {
      type: "widget",
      content: "camera",
      position: { x: 160, y: 90 },
      size: { width: 640, height: 360 },
      widgetType: "camera",
      widgetConfig: { theme: "light", dataSource: "" }
    }
  },
  {
    id: "google-maps",
    name: "Google Maps",
    icon: MapPin,
    category: "widgets",
    description: "Interactive map",
    defaultProps: {
      type: "widget",
      content: "maps",
      position: { x: 100, y: 100 },
      size: { width: 760, height: 440 },
      widgetType: "maps",
      widgetConfig: { theme: "light", dataSource: "" }
    }
  }
];

// Mock stock assets - Expanded
const STOCK_ASSETS: StockAsset[] = [
  {
    id: "stock-1",
    name: "Modern Office",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-2",
    name: "Technology",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-3",
    name: "Retail Store",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-4",
    name: "Restaurant",
    thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-5",
    name: "Business Meeting",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-6",
    name: "Coffee Shop",
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-7",
    name: "City Skyline",
    thumbnail: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-8",
    name: "Product Display",
    thumbnail: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-9",
    name: "Food & Dining",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-10",
    name: "Workspace",
    thumbnail: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-11",
    name: "Fashion Store",
    thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=150&fit=crop",
    category: "stock-image"
  },
  {
    id: "stock-12",
    name: "Hotel Lobby",
    thumbnail: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=150&fit=crop",
    category: "stock-image"
  }
];

// Helper function to create mock slides with diverse images
const createMockSlides = (count: number, images: string[]): Slide[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `slide-${i + 1}`,
    thumbnail: images[i % images.length],
    duration: 8,
    transition: "fade",
    elements: [
      {
        id: `element-${i}-1`,
        type: "text" as const,
        content: i === 0 ? "Welcome to Our Store" : `Slide ${i + 1} Title`,
        position: { x: 80, y: 60 },
        size: { width: 800, height: 100 },
        style: {
          fontSize: 48,
          fontFamily: "Inter",
          color: "#1a1a1a",
          bold: true,
          align: "center" as const
        }
      },
      {
        id: `element-${i}-2`,
        type: "text" as const,
        content: "Discover amazing products and exclusive deals",
        position: { x: 80, y: 180 },
        size: { width: 800, height: 60 },
        style: {
          fontSize: 24,
          fontFamily: "Inter",
          color: "#666666",
          align: "center" as const
        }
      },
      {
        id: `element-${i}-3`,
        type: "image" as const,
        content: images[i % images.length],
        position: { x: 180, y: 280 },
        size: { width: 600, height: 300 }
      }
    ]
  }));
};

// Enhanced template data with diverse signage images from multiple sources
const mockTemplates: Template[] = [
  // Retail Templates
  {
    id: "1",
    name: "Digital Store Menu Board",
    description: "Modern retail display with dynamic pricing, product showcases, and promotional banners perfect for boutique stores",
    industry: "Retail",
    thumbnail: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 8,
    features: ["Dynamic Pricing", "Product Showcase", "Promotional Banners", "Brand Integration"],
    previewImages: [
      "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(8, [
      "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=450&fit=crop&auto=format"
    ])
  },
  {
    id: "2",
    name: "Flash Sale Display",
    description: "Eye-catching template with countdown timers, bold pricing, and urgent call-to-action elements for limited-time promotions",
    industry: "Retail",
    thumbnail: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 6,
    features: ["Countdown Timer", "Bold Pricing", "Urgent CTAs", "Sale Badges"],
    previewImages: [
      "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(6, [
      "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&h=450&fit=crop&auto=format"
    ])
  },
  {
    id: "3",
    name: "Product Showcase Wall",
    description: "Multi-product grid layout perfect for showcasing fashion, electronics, and lifestyle items with specifications",
    industry: "Retail",
    thumbnail: "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 10,
    features: ["Product Grid", "Specifications", "Comparison Charts", "High-Res Images"],
    previewImages: [
      "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(10, [
      "https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=450&fit=crop&auto=format"
    ])
  },

  // Restaurant Templates
  {
    id: "4",
    name: "Restaurant Menu Board",
    description: "Appetizing digital menu with food categories, dynamic pricing, and professional food photography for modern restaurants",
    industry: "Restaurant",
    thumbnail: "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 8,
    features: ["Food Categories", "Pricing Display", "Food Photography", "Allergen Info"],
    previewImages: [
      "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(8, [
      "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=450&fit=crop&auto=format"
    ])
  },
  {
    id: "5",
    name: "Daily Specials Display",
    description: "Highlight chef's recommendations, seasonal items, and rotating special offers with beautiful presentation",
    industry: "Restaurant",
    thumbnail: "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 5,
    features: ["Chef Recommendations", "Seasonal Items", "Special Offers", "Rotating Content"],
    previewImages: [
      "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=800&h=450&fit=crop&auto=compress"
    ],
    slides: createMockSlides(5, [
      "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=800&h=450&fit=crop&auto=compress"
    ])
  },
  {
    id: "6",
    name: "QR Code Ordering Display",
    description: "Modern contactless ordering solution with QR codes, digital menu integration, and mobile payment options",
    industry: "Restaurant",
    thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 6,
    features: ["QR Code Integration", "Contactless Ordering", "Digital Menu", "Payment Options"],
    previewImages: [
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(6, [
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=450&fit=crop&auto=format"
    ])
  },

  // Corporate Templates
  {
    id: "7",
    name: "Office Welcome Display",
    description: "Professional reception display with visitor information, meeting schedules, company directory, and wayfinding",
    industry: "Corporate",
    thumbnail: "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 7,
    features: ["Visitor Info", "Meeting Rooms", "Company Directory", "Building Map"],
    previewImages: [
      "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/159213/desk-laptop-notebook-workspace-159213.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?w=800&h=450&fit=crop&auto=compress"
    ],
    slides: createMockSlides(7, [
      "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/159213/desk-laptop-notebook-workspace-159213.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?w=800&h=450&fit=crop&auto=compress"
    ])
  },
  {
    id: "8",
    name: "Company Metrics Dashboard",
    description: "Dynamic business intelligence display with real-time KPIs, performance metrics, and achievement tracking",
    industry: "Corporate",
    thumbnail: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 12,
    features: ["Real-time KPIs", "Performance Charts", "Business Metrics", "Achievement Highlights"],
    previewImages: [
      "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(12, [
      "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&auto=format"
    ])
  },
  {
    id: "9",
    name: "Employee Recognition Wall",
    description: "Celebrate team success with employee spotlights, achievements, milestones, and company culture highlights",
    industry: "Corporate",
    thumbnail: "https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 9,
    features: ["Employee Photos", "Achievements", "Milestones", "Team Recognition"],
    previewImages: [
      "https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?w=800&h=450&fit=crop&auto=compress"
    ],
    slides: createMockSlides(9, [
      "https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?w=800&h=450&fit=crop&auto=compress"
    ])
  },

  // Healthcare Templates
  {
    id: "10",
    name: "Waiting Room Information",
    description: "Patient-friendly display with wait times, health tips, facility information, and emergency contacts",
    industry: "Healthcare",
    thumbnail: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 10,
    features: ["Wait Times", "Health Tips", "Services Info", "Emergency Contacts"],
    previewImages: [
      "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4047146/pexels-photo-4047146.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4047121/pexels-photo-4047121.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/5863380/pexels-photo-5863380.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(10, [
      "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4047146/pexels-photo-4047146.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4047121/pexels-photo-4047121.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/5863380/pexels-photo-5863380.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=450&fit=crop&auto=format"
    ])
  },
  {
    id: "11",
    name: "Department Directory",
    description: "Interactive wayfinding system with floor maps, department locations, accessibility information, and navigation",
    industry: "Healthcare",
    thumbnail: "https://images.pexels.com/photos/4047121/pexels-photo-4047121.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 8,
    features: ["Floor Maps", "Department Locations", "Navigation", "Accessibility Info"],
    previewImages: [
      "https://images.pexels.com/photos/4047121/pexels-photo-4047121.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4047146/pexels-photo-4047146.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(8, [
      "https://images.pexels.com/photos/4047121/pexels-photo-4047121.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4047146/pexels-photo-4047146.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=450&fit=crop&auto=format"
    ])
  },
  {
    id: "12",
    name: "Health & Wellness Tips",
    description: "Educational content with rotating health information, wellness advice, and preventive care reminders",
    industry: "Healthcare",
    thumbnail: "https://images.pexels.com/photos/4047146/pexels-photo-4047146.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 15,
    features: ["Health Tips", "Wellness Info", "Preventive Care", "Seasonal Health"],
    previewImages: [
      "https://images.pexels.com/photos/4047146/pexels-photo-4047146.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/5863380/pexels-photo-5863380.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4047121/pexels-photo-4047121.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?w=800&h=450&fit=crop&auto=compress"
    ],
    slides: createMockSlides(15, [
      "https://images.pexels.com/photos/4047146/pexels-photo-4047146.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/5863380/pexels-photo-5863380.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4047121/pexels-photo-4047121.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?w=800&h=450&fit=crop&auto=compress"
    ])
  },

  // Education Templates
  {
    id: "13",
    name: "Campus Event Calendar",
    description: "Comprehensive campus communication with academic schedules, events, announcements, and important dates",
    industry: "Education",
    thumbnail: "https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 12,
    features: ["Event Calendar", "Academic Schedules", "Announcements", "Important Dates"],
    previewImages: [
      "https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(12, [
      "https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop&auto=format"
    ])
  },
  {
    id: "14",
    name: "Library Information Display",
    description: "Student resource center with new books, study hours, research resources, and library services",
    industry: "Education",
    thumbnail: "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 8,
    features: ["New Books", "Study Hours", "Research Resources", "Library Services"],
    previewImages: [
      "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(8, [
      "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=450&fit=crop&auto=format"
    ])
  },
  {
    id: "15",
    name: "Cafeteria Menu Board",
    description: "Daily meal planning with nutrition information, dietary options, allergen alerts, and meal schedules",
    industry: "Education",
    thumbnail: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 6,
    features: ["Daily Meals", "Nutrition Info", "Dietary Options", "Meal Schedules"],
    previewImages: [
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/2923034/pexels-photo-2923034.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(6, [
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/2923034/pexels-photo-2923034.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=450&fit=crop&auto=format"
    ])
  },

  // Fitness Templates
  {
    id: "16",
    name: "Class Schedule Display",
    description: "Complete fitness class timetable with instructors, room assignments, class descriptions, and booking availability",
    industry: "Fitness",
    thumbnail: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 8,
    features: ["Class Times", "Instructors", "Room Numbers", "Class Descriptions"],
    previewImages: [
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(8, [
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=450&fit=crop&auto=format"
    ])
  },
  {
    id: "17",
    name: "Workout Motivation Screen",
    description: "Inspire members with motivational content, progress tracking, fitness tips, and community achievements",
    industry: "Fitness",
    thumbnail: "https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 10,
    features: ["Motivational Quotes", "Progress Tracking", "Fitness Tips", "Member Achievements"],
    previewImages: [
      "https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=450&fit=crop&auto=format"
    ],
    slides: createMockSlides(10, [
      "https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=450&fit=crop&auto=format"
    ])
  },
  {
    id: "18",
    name: "Membership Promotions",
    description: "Showcase membership packages, exclusive benefits, limited-time offers, and tier comparison information",
    industry: "Fitness",
    thumbnail: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?w=400&h=225&fit=crop&auto=compress",
    slideCount: 7,
    features: ["Membership Packages", "Benefits", "Special Offers", "Tier Information"],
    previewImages: [
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?w=800&h=450&fit=crop&auto=compress"
    ],
    slides: createMockSlides(7, [
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3076514/pexels-photo-3076514.jpeg?w=800&h=450&fit=crop&auto=compress",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop&auto=format",
      "https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?w=800&h=450&fit=crop&auto=compress"
    ])
  }
];

const industries = ["All Templates", "Retail", "Restaurant", "Healthcare", "Corporate", "Education", "Fitness"];

export default function TemplateSelectionModal({ open, onOpenChange }: TemplateSelectionModalProps) {
  const [currentStep, setCurrentStep] = useState<"browse" | "preview" | "edit" | "complete">("browse");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState("All Templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);
  
  // Edit step states
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [slides, setSlides] = useState<Slide[]>([]);
  
  // Left sidebar states
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [activeSidebarCategory, setActiveSidebarCategory] = useState<ElementCategory | null>(null);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [favoriteElements, setFavoriteElements] = useState<string[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  
  // Effects and AI panel states
  const [effectsPanelOpen, setEffectsPanelOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  
  // Drag and drop states
  const [activeElement, setActiveElement] = useState<ElementType | null>(null);

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const element = event.active.data.current?.element as ElementType;
    setActiveElement(element);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over?.id === 'canvas' && activeElement) {
      // Create a new element instance with unique ID
      const newElement: SlideElement = {
        ...activeElement.defaultProps,
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      } as SlideElement;
      
      // Add element to current slide
      setSlides(prevSlides => {
        const updatedSlides = [...prevSlides];
        if (updatedSlides[currentSlideIndex]) {
          updatedSlides[currentSlideIndex] = {
            ...updatedSlides[currentSlideIndex],
            elements: [...updatedSlides[currentSlideIndex].elements, newElement]
          };
        }
        return updatedSlides;
      });
      
      // Auto-select the new element
      setSelectedElementId(newElement.id);
      
      // Track recently used (keep last 6 unique items)
      setRecentlyUsed(prev => {
        const updated = [activeElement.id, ...prev.filter(id => id !== activeElement.id)];
        return updated.slice(0, 6);
      });
    }
    
    setActiveElement(null);
  };

  // Toggle favorite
  const toggleFavorite = (elementId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavoriteElements(prev => 
      prev.includes(elementId)
        ? prev.filter(id => id !== elementId)
        : [...prev, elementId]
    );
  };

  // Element manipulation handlers
  const duplicateElement = () => {
    if (!selectedElementId) return;
    
    const currentSlide = slides[currentSlideIndex];
    const elementToDuplicate = currentSlide?.elements.find(el => el.id === selectedElementId);
    
    if (elementToDuplicate) {
      const newElement: SlideElement = {
        ...elementToDuplicate,
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: {
          x: elementToDuplicate.position.x + 20,
          y: elementToDuplicate.position.y + 20
        }
      };
      
      setSlides(prevSlides => {
        const updatedSlides = [...prevSlides];
        updatedSlides[currentSlideIndex] = {
          ...updatedSlides[currentSlideIndex],
          elements: [...updatedSlides[currentSlideIndex].elements, newElement]
        };
        return updatedSlides;
      });
      
      setSelectedElementId(newElement.id);
    }
  };

  const deleteElement = () => {
    if (!selectedElementId) return;
    
    setSlides(prevSlides => {
      const updatedSlides = [...prevSlides];
      updatedSlides[currentSlideIndex] = {
        ...updatedSlides[currentSlideIndex],
        elements: updatedSlides[currentSlideIndex].elements.filter(el => el.id !== selectedElementId)
      };
      return updatedSlides;
    });
    
    setSelectedElementId(null);
  };

  // Animation variants - simplified and faster
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesIndustry = selectedIndustry === "All Templates" || template.industry === selectedIndustry;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentImageIndex(0);
    setCurrentStep("preview");
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      setSlides([...selectedTemplate.slides]);
      setCurrentSlideIndex(0);
      setSelectedElementId(null);
      setCurrentStep("edit");
    }
  };

  const handleSaveAndExit = () => {
    setCurrentStep("complete");
  };

  const handleBack = () => {
    if (currentStep === "preview") {
      setCurrentStep("browse");
    } else if (currentStep === "edit") {
      setCurrentStep("preview");
    }
  };

  const handleClose = () => {
    setCurrentStep("browse");
    setSelectedTemplate(null);
    setSearchQuery("");
    setSelectedIndustry("All Templates");
    setCurrentImageIndex(0);
    setCurrentSlideIndex(0);
    setSelectedElementId(null);
    setZoomLevel(100);
    setSlides([]);
    onOpenChange(false);
  };

  const toggleFavoriteTemplate = (templateId: string) => {
    setFavoriteTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const nextImage = () => {
    if (selectedTemplate) {
      setCurrentImageIndex((prev) => 
        prev === selectedTemplate.previewImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedTemplate) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedTemplate.previewImages.length - 1 : prev - 1
      );
    }
  };

  // Enhanced Draggable Element Card Component
  const DraggableElementCard = ({ element, showLarge = false }: { element: ElementType; showLarge?: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: element.id,
      data: { type: 'element', element }
    });

    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const isFavorite = favoriteElements.includes(element.id);
    const isTemplate = element.category === "templates";

    // For templates, show larger cards with thumbnails
    if (isTemplate && showLarge) {
      return (
        <TooltipProvider key={element.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={`relative group cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border-2 hover:border-primary hover:shadow-lg transition-all ${
                  isDragging ? 'opacity-50' : 'border-transparent'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="aspect-video bg-muted relative">
                  {element.thumbnail && (
                    <img src={element.thumbnail} alt={element.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-semibold">{element.name}</p>
                  </div>
                  {/* Favorite Star */}
                  <button
                    onClick={(e) => toggleFavorite(element.id, e)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 rounded-full p-1"
                  >
                    <Star className={`h-3 w-3 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
                  </button>
                  {/* Drag Handle Indicator */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-60 transition-opacity">
                    <GripVertical className="h-4 w-4 text-white" />
                  </div>
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[200px]">
              <p className="font-semibold text-sm">{element.name}</p>
              {element.description && (
                <p className="text-xs text-muted-foreground mt-1">{element.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Drag to canvas to add</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Regular element cards
    return (
      <TooltipProvider key={element.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              ref={setNodeRef}
              style={style}
              {...listeners}
              {...attributes}
              className={`relative group p-4 border rounded-xl cursor-grab active:cursor-grabbing bg-white hover:shadow-lg transition-all ${
                isDragging ? 'opacity-50' : 'shadow-sm'
              }`}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Favorite Star */}
              <button
                onClick={(e) => toggleFavorite(element.id, e)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`} />
              </button>

              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all">
                  <element.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-center w-full">
                  <p className="text-xs font-semibold line-clamp-2 leading-snug">{element.name}</p>
                  {element.category === "widgets" && (
                    <Badge variant="secondary" className="mt-1.5 text-[10px] h-4">
                      <Settings className="h-2.5 w-2.5 mr-1" />
                      Widget
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[200px]">
            <p className="font-semibold text-sm">{element.name}</p>
            {element.description && (
              <p className="text-xs text-muted-foreground mt-1">{element.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Drag to canvas or click to add</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Draggable Stock Asset Card Component
  const DraggableStockAsset = ({ asset }: { asset: StockAsset }) => {
    const elementType: ElementType = {
      id: asset.id,
      name: asset.name,
      icon: ImageIcon,
      category: "media",
      defaultProps: {
        type: "image",
        content: asset.thumbnail,
        position: { x: 200, y: 150 },
        size: { width: 400, height: 300 }
      }
    };

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: asset.id,
      data: { type: 'element', element: elementType }
    });

    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`cursor-grab active:cursor-grabbing rounded-xl overflow-hidden border hover:shadow-lg transition-all ${
          isDragging ? 'opacity-50' : 'shadow-sm'
        }`}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="aspect-square relative bg-muted">
          <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-[10px] font-medium text-white line-clamp-1">{asset.name}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderBrowseStep = () => (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex flex-col gap-3" variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto p-1.5 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 shadow-md">
            {industries.map((industry) => (
              <TabsTrigger 
                key={industry} 
                value={industry} 
                className="text-sm font-semibold py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                {industry}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      <ScrollArea className="h-[550px]">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <Card 
                  className="cursor-pointer transition-all duration-200 hover:shadow-xl border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden group h-full flex flex-col shadow-md"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteTemplate(template.id);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favoriteTemplates.includes(template.id) 
                              ? "fill-red-500 text-red-500" 
                              : "text-muted-foreground"
                          }`} 
                        />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge variant="secondary" className="bg-white/90 text-black">
                        {template.slideCount} slides
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2 flex-shrink-0">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-1 flex-1">{template.name}</CardTitle>
                      <Badge variant="outline" className="text-xs flex-shrink-0">{template.industry}</Badge>
                    </div>
                    <CardDescription className="text-xs line-clamp-2 mt-0.5">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3 flex-1 flex flex-col justify-end">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-0.5 flex-wrap">
                        {template.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.features.length - 2}
                          </Badge>
                        )}
                      </div>
                      <Button size="sm" variant="outline" className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
    </motion.div>
  );

  const renderPreviewStep = () => (
    <motion.div 
      className="space-y-4"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="flex items-center gap-3" variants={itemVariants}>
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h3 className="text-xl font-semibold">{selectedTemplate?.name}</h3>
          <p className="text-muted-foreground">{selectedTemplate?.description}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div className="xl:col-span-2 space-y-4" variants={itemVariants}>
          <div className="relative group">
            <div className="aspect-video overflow-hidden rounded-xl bg-muted">
              <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={selectedTemplate?.previewImages[currentImageIndex]}
                    alt={selectedTemplate?.name}
                    className="w-full h-full object-cover "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
              </AnimatePresence>
            </div>
            
            {/* Navigation arrows */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {selectedTemplate?.previewImages.length}
            </div>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {selectedTemplate?.previewImages.map((image, index) => (
              <motion.div
                key={index}
                className={`aspect-video w-24 overflow-hidden rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                  index === currentImageIndex 
                    ? "border-primary shadow-lg" 
                    : "border-transparent hover:border-muted-foreground/50"
                }`}
                onClick={() => setCurrentImageIndex(index)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.1 }}
              >
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">{selectedTemplate?.industry}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Monitor className="h-4 w-4" />
                {selectedTemplate?.slideCount} slides
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Features
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                {selectedTemplate?.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </motion.div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Recommended duration: 5-10 seconds per slide</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Perfect for {selectedTemplate?.industry.toLowerCase()} environments</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <Button onClick={handleUseTemplate} className="w-full gap-2" size="lg">
              <Sparkles className="h-5 w-5" />
              Use This Template
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );


  // NEW: PowerPoint-style Edit Step with Left Sidebar & DnD
  const renderEditStep = () => {
    const currentSlide = slides[currentSlideIndex];
    const selectedElement = currentSlide?.elements.find(el => el.id === selectedElementId);
    const elementType = selectedElement?.type;
  
    return (
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <motion.div
        className="h-full flex flex-col overflow-hidden"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Top Toolbar */}
        <div className="border-b bg-muted/30 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
              <Separator orientation="vertical" className="h-6" />
              <h3 className="font-semibold text-lg">{selectedTemplate?.name}</h3>
              <Separator orientation="vertical" className="h-6" />
              
              {/* Global Actions */}
              <TooltipProvider>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Undo">
                        <Undo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Redo">
                        <Redo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                  </Tooltip>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2 gap-1" title="Align">
                        <AlignHorizontalDistributeCenter className="h-4 w-4" />
                        <span className="text-xs">Align</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Align & Distribute</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2 gap-1" title="Group">
                        <Group className="h-4 w-4" />
                        <span className="text-xs">Group</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Group (Ctrl+G)</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
          </div>

            <div className="flex items-center gap-2 mr-7">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 border rounded-lg px-2 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[3rem] text-center">{zoomLevel}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />
              
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              
              <Button onClick={handleSaveAndExit} size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save & Exit
              </Button>
                  </div>
                  </div>
                </div>
  
        {/* Main Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Narrow Left Sidebar (Always Visible) */}
          <div className="w-20 border-r bg-card flex flex-col py-4 gap-2 flex-shrink-0">
            <TooltipProvider>
              <div className="flex flex-col gap-1 px-2">
                {[
                  { id: "templates", label: "Templates", icon: FileText },
                  { id: "texts", label: "Texts", icon: Type },
                  { id: "labels", label: "Labels", icon: Tag },
                  { id: "media", label: "Images", icon: ImageIcon },
                  { id: "shapes", label: "Shapes", icon: Circle },
                  { id: "widgets", label: "Widgets", icon: Package },
                ].map((category) => (
                  <Tooltip key={category.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeSidebarCategory === category.id ? "default" : "ghost"}
                        className="w-full h-auto flex flex-col items-center gap-1.5 py-3 px-2"
                        onClick={() => {
                          if (activeSidebarCategory === category.id) {
                            setActiveSidebarCategory(null);
                            setRightPanelOpen(false);
                          } else {
                            setActiveSidebarCategory(category.id as ElementCategory);
                            setRightPanelOpen(true);
                          }
                        }}
                      >
                        <category.icon className="h-5 w-5" />
                        <span className="text-[10px] font-medium leading-tight text-center">
                          {category.label}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{category.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Sliding Right Panel */}
          <AnimatePresence>
            {rightPanelOpen && activeSidebarCategory && (
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-r bg-card flex flex-col overflow-hidden flex-shrink-0"
              >
                {/* Panel Header */}
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <h3 className="font-semibold text-base capitalize">
                    {activeSidebarCategory}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setRightPanelOpen(false);
                      setActiveSidebarCategory(null);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>

                {/* Search Bar */}
                <div className="px-4 py-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-9 h-10"
                      value={sidebarSearchQuery}
                      onChange={(e) => setSidebarSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Content based on active category */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-6">

                    {/* TEMPLATES */}
                    {activeSidebarCategory === "templates" && (
                      <>
                        {/* Restaurant & Food */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Coffee className="h-4 w-4" />
                            Restaurant & Food
                          </h4>
                          <div className="relative group">
                            <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                              {ELEMENT_CATALOG.filter(el => 
                                el.category === "templates" && 
                                el.id.includes("restaurant") &&
                                (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                              ).map(element => (
                                <div key={element.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start', width: '110px' }}>
                                  <div 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleDragEnd({ active: { id: element.id, data: { current: element } }, over: { id: 'canvas' } } as any)}
                                  >
                                    <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video mb-1.5">
                                      {element.thumbnail && (
                                        <img src={element.thumbnail} alt={element.name} className="w-full h-full object-cover" />
                                      )}
                                      {!element.thumbnail && (
                                        <div className="w-full h-full flex items-center justify-center">
                                          {element.icon && <element.icon className="h-6 w-6 text-muted-foreground" />}
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs font-medium line-clamp-1 text-center">{element.name}</p>
                                  </div>
                                </div>
                              ))}
                              {/* Spacer to show partial next item */}
                              <div className="flex-shrink-0 w-4" />
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none" />
                          </div>
                        </div>

                        {/* Retail & Shopping */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Megaphone className="h-4 w-4" />
                            Retail & Shopping
                          </h4>
                          <div className="relative group">
                            <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                              {ELEMENT_CATALOG.filter(el => 
                                el.category === "templates" && 
                                el.id.includes("retail") &&
                                (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                              ).map(element => (
                                <div key={element.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start', width: '110px' }}>
                                  <div 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleDragEnd({ active: { id: element.id, data: { current: element } }, over: { id: 'canvas' } } as any)}
                                  >
                                    <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video mb-1.5">
                                      {element.thumbnail && (
                                        <img src={element.thumbnail} alt={element.name} className="w-full h-full object-cover" />
                                      )}
                                      {!element.thumbnail && (
                                        <div className="w-full h-full flex items-center justify-center">
                                          {element.icon && <element.icon className="h-6 w-6 text-muted-foreground" />}
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs font-medium line-clamp-1 text-center">{element.name}</p>
                                  </div>
                                </div>
                              ))}
                              {/* Spacer to show partial next item */}
                              <div className="flex-shrink-0 w-4" />
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none" />
                          </div>
                        </div>

                        {/* Corporate & Office */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Corporate & Office
                          </h4>
                          <div className="relative group">
                            <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                              {ELEMENT_CATALOG.filter(el => 
                                el.category === "templates" && 
                                el.id.includes("corporate") &&
                                (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                              ).map(element => (
                                <div key={element.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start', width: '110px' }}>
                                  <div 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleDragEnd({ active: { id: element.id, data: { current: element } }, over: { id: 'canvas' } } as any)}
                                  >
                                    <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video mb-1.5">
                                      {element.thumbnail && (
                                        <img src={element.thumbnail} alt={element.name} className="w-full h-full object-cover" />
                                      )}
                                      {!element.thumbnail && (
                                        <div className="w-full h-full flex items-center justify-center">
                                          {element.icon && <element.icon className="h-6 w-6 text-muted-foreground" />}
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs font-medium line-clamp-1 text-center">{element.name}</p>
                                  </div>
                                </div>
                              ))}
                              {/* Spacer to show partial next item */}
                              <div className="flex-shrink-0 w-4" />
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none" />
                          </div>
                        </div>

                        {/* Healthcare & Medical */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Healthcare & Medical
                          </h4>
                          <div className="relative group">
                            <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                              {ELEMENT_CATALOG.filter(el => 
                                el.category === "templates" && 
                                el.id.includes("healthcare") &&
                                (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                              ).map(element => (
                                <div key={element.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start', width: '110px' }}>
                                  <div 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleDragEnd({ active: { id: element.id, data: { current: element } }, over: { id: 'canvas' } } as any)}
                                  >
                                    <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video mb-1.5">
                                      {element.thumbnail && (
                                        <img src={element.thumbnail} alt={element.name} className="w-full h-full object-cover" />
                                      )}
                                      {!element.thumbnail && (
                                        <div className="w-full h-full flex items-center justify-center">
                                          {element.icon && <element.icon className="h-6 w-6 text-muted-foreground" />}
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs font-medium line-clamp-1 text-center">{element.name}</p>
                                  </div>
                                </div>
                              ))}
                              {/* Spacer to show partial next item */}
                              <div className="flex-shrink-0 w-4" />
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none" />
                          </div>
                        </div>

                        {/* Fitness & Gym */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Dumbbell className="h-4 w-4" />
                            Fitness & Gym
                          </h4>
                          <div className="relative group">
                            <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                              {ELEMENT_CATALOG.filter(el => 
                                el.category === "templates" && 
                                el.id.includes("fitness") &&
                                (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                              ).map(element => (
                                <div key={element.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start', width: '110px' }}>
                                  <div 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleDragEnd({ active: { id: element.id, data: { current: element } }, over: { id: 'canvas' } } as any)}
                                  >
                                    <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video mb-1.5">
                                      {element.thumbnail && (
                                        <img src={element.thumbnail} alt={element.name} className="w-full h-full object-cover" />
                                      )}
                                      {!element.thumbnail && (
                                        <div className="w-full h-full flex items-center justify-center">
                                          {element.icon && <element.icon className="h-6 w-6 text-muted-foreground" />}
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs font-medium line-clamp-1 text-center">{element.name}</p>
                                  </div>
                                </div>
                              ))}
                              {/* Spacer to show partial next item */}
                              <div className="flex-shrink-0 w-4" />
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none" />
                          </div>
                        </div>

                        {/* Hospitality & Hotel */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Hotel className="h-4 w-4" />
                            Hospitality & Hotel
                          </h4>
                          <div className="relative group">
                            <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                              {ELEMENT_CATALOG.filter(el => 
                                el.category === "templates" && 
                                el.id.includes("hotel") &&
                                (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                              ).map(element => (
                                <div key={element.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start', width: '110px' }}>
                                  <div 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleDragEnd({ active: { id: element.id, data: { current: element } }, over: { id: 'canvas' } } as any)}
                                  >
                                    <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video mb-1.5">
                                      {element.thumbnail && (
                                        <img src={element.thumbnail} alt={element.name} className="w-full h-full object-cover" />
                                      )}
                                      {!element.thumbnail && (
                                        <div className="w-full h-full flex items-center justify-center">
                                          {element.icon && <element.icon className="h-6 w-6 text-muted-foreground" />}
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs font-medium line-clamp-1 text-center">{element.name}</p>
                                  </div>
                                </div>
                              ))}
                              {/* Spacer to show partial next item */}
                              <div className="flex-shrink-0 w-4" />
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none" />
                          </div>
                        </div>

                        {/* Education & School */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Education & School
                          </h4>
                          <div className="relative group">
                            <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                              {ELEMENT_CATALOG.filter(el => 
                                el.category === "templates" && 
                                el.id.includes("education") &&
                                (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                              ).map(element => (
                                <div key={element.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start', width: '110px' }}>
                                  <div 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleDragEnd({ active: { id: element.id, data: { current: element } }, over: { id: 'canvas' } } as any)}
                                  >
                                    <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video mb-1.5">
                                      {element.thumbnail && (
                                        <img src={element.thumbnail} alt={element.name} className="w-full h-full object-cover" />
                                      )}
                                      {!element.thumbnail && (
                                        <div className="w-full h-full flex items-center justify-center">
                                          {element.icon && <element.icon className="h-6 w-6 text-muted-foreground" />}
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs font-medium line-clamp-1 text-center">{element.name}</p>
                                  </div>
                                </div>
                              ))}
                              {/* Spacer to show partial next item */}
                              <div className="flex-shrink-0 w-4" />
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none" />
                          </div>
                        </div>

                        {/* All Templates (if search is active or showing all) */}
                        {sidebarSearchQuery && (
                          <div>
                            <h4 className="text-sm font-semibold mb-3">All Matching Templates</h4>
                            <div className="space-y-3">
                              {ELEMENT_CATALOG.filter(el => 
                                el.category === "templates" &&
                                el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
                              ).map(element => (
                                <DraggableElementCard key={element.id} element={element} showLarge={true} />
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* TEXTS */}
                    {activeSidebarCategory === "texts" && (
                      <>
                        {/* Text Elements Section */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3">Text Elements</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {ELEMENT_CATALOG.filter(el => 
                              el.category === "texts" &&
                              (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                            ).map(element => (
                              <DraggableElementCard key={element.id} element={element} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* LABELS */}
                    {activeSidebarCategory === "labels" && (
                      <>
                        {/* Label Elements Section */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3">Label Elements</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {ELEMENT_CATALOG.filter(el => 
                              el.category === "labels" &&
                              (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                            ).map(element => (
                              <DraggableElementCard key={element.id} element={element} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* IMAGES/MEDIA */}
                    {activeSidebarCategory === "media" && (
                      <>
                        {/* Uploads Section */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3">Uploads</h4>
                          <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30">
                            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">No uploads yet</p>
                          </div>
                        </div>

                        {/* Media Elements */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3">Media</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {ELEMENT_CATALOG.filter(el => 
                              el.category === "media" &&
                              (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                            ).map(element => (
                              <DraggableElementCard key={element.id} element={element} />
                            ))}
                          </div>
                        </div>

                        {/* Stock Images */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold">Images</h4>
                            <span className="text-xs text-muted-foreground">({STOCK_ASSETS.length})</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {STOCK_ASSETS.map(asset => (
                              <DraggableStockAsset key={asset.id} asset={asset} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* SHAPES */}
                    {activeSidebarCategory === "shapes" && (
                      <>
                        <div>
                          <h4 className="text-sm font-semibold mb-3">Shapes</h4>
                          <div className="grid grid-cols-3 gap-3">
                            {ELEMENT_CATALOG.filter(el => 
                              el.category === "shapes" &&
                              (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                            ).map(element => (
                              <DraggableElementCard key={element.id} element={element} />
                            ))}
                          </div>
                        </div>

                        {/* Color Swatches */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3">Colors</h4>
                          <div className="grid grid-cols-6 gap-2">
                            {["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"].map((color, i) => (
                              <div
                                key={i}
                                className="aspect-square rounded-lg border-2 border-transparent hover:border-primary cursor-pointer transition-all hover:scale-110"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* WIDGETS */}
                    {activeSidebarCategory === "widgets" && (
                      <>
                        {/* Core Widgets */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Core Widgets
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {ELEMENT_CATALOG.filter(el => 
                              el.category === "widgets" &&
                              ["clock-widget", "weather-widget", "news-ticker", "countdown"].includes(el.id) &&
                              (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                            ).map(element => (
                              <DraggableElementCard key={element.id} element={element} />
                            ))}
                          </div>
                        </div>

                        {/* Integrations */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Integrations
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {ELEMENT_CATALOG.filter(el => 
                              el.category === "widgets" &&
                              ["google-sheets", "website-display", "instagram-feed", "youtube-video", "rss-feed", "calendar-widget", "qr-code-widget", "analytics-dashboard", "live-camera", "google-maps"].includes(el.id) &&
                              (sidebarSearchQuery === "" || el.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                            ).map(element => (
                              <DraggableElementCard key={element.id} element={element} />
                            ))}
                          </div>
                        </div>

                        {/* Request an App */}
                        <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors cursor-pointer bg-muted/20">
                          <div className="flex flex-col items-center gap-2 text-center">
                            <MessageSquarePlus className="h-8 w-8 text-primary" />
                            <div>
                              <h5 className="font-semibold text-sm">Request an App</h5>
                              <p className="text-xs text-muted-foreground mt-1">
                                Need a specific integration? Let us know!
                              </p>
                            </div>
                            <Button variant="outline" size="sm" className="mt-2 w-full">
                              Submit Request
                            </Button>
                          </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                          <Settings className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            Widgets update automatically with live data
                          </p>
                        </div>
                      </>
                    )}

                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Effects Panel (appears when Effects button is clicked) */}
          <AnimatePresence>
            {effectsPanelOpen && selectedElementId && selectedElement && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-r bg-card flex flex-col overflow-hidden flex-shrink-0"
              >
                {/* Panel Header */}
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Effects
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setEffectsPanelOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Effects Content */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-6">
                    
                    {/* TEXT EFFECTS */}
                    {elementType === "text" && (
                      <>
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            Text Effects
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Shadow
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Glow
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Outline
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              3D Text
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Gradient
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Neon
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Text Animation</h4>
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Fade In
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Slide In
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Typewriter
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Bounce
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* IMAGE/VIDEO EFFECTS */}
                    {(elementType === "image" || elementType === "video") && (
                      <>
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Filters
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Palette className="h-3 w-3" />
                              Grayscale
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Palette className="h-3 w-3" />
                              Sepia
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Palette className="h-3 w-3" />
                              Vintage
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Palette className="h-3 w-3" />
                              Vivid
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Palette className="h-3 w-3" />
                              Black & White
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Palette className="h-3 w-3" />
                              Warm
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Palette className="h-3 w-3" />
                              Cool
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Palette className="h-3 w-3" />
                              Blur
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Visual Effects</h4>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Drop Shadow
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Rounded Corners
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Border
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Vignette
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Animations</h4>
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Zoom In
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Zoom Out
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Pan Left
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Pan Right
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Fade
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* SHAPE EFFECTS */}
                    {elementType === "shape" && (
                      <>
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Square className="h-4 w-4" />
                            Shape Effects
                          </h4>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Drop Shadow
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Inner Shadow
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Glow
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Gradient Fill
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Pattern Fill
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Animations</h4>
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Pulse
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Rotate
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Scale
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Bounce
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* WIDGET EFFECTS */}
                    {elementType === "widget" && (
                      <>
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Widget Effects
                          </h4>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Drop Shadow
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Border
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Background
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Transition Effects</h4>
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Fade In
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Play className="h-3 w-3" />
                              Slide Up
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Panel (appears when AI button is clicked) */}
          <AnimatePresence>
            {aiPanelOpen && selectedElementId && selectedElement && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-r bg-card flex flex-col overflow-hidden flex-shrink-0"
              >
                {/* Panel Header */}
                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Tools
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setAiPanelOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* AI Content */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-6">
                    
                    {/* TEXT AI TOOLS */}
                    {elementType === "text" && (
                      <>
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Content Generation
                          </h4>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Generate Headline
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Write Description
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Create Call-to-Action
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Improve Copy
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">AI Text Enhancement</h4>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Zap className="h-3 w-3" />
                              Make Shorter
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Zap className="h-3 w-3" />
                              Make Longer
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Zap className="h-3 w-3" />
                              Change Tone
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Zap className="h-3 w-3" />
                              Fix Grammar
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Zap className="h-3 w-3" />
                              Translate
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Smart Suggestions</h4>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-2">
                              AI suggests font pairing for your text
                            </p>
                            <Button variant="secondary" size="sm" className="w-full gap-2">
                              <Sparkles className="h-3 w-3" />
                              Get Font Suggestions
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* IMAGE/VIDEO AI TOOLS */}
                    {(elementType === "image" || elementType === "video") && (
                      <>
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Image Enhancement
                          </h4>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Enhance Quality
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Remove Background
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Upscale Image
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Auto Crop
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Object Removal
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">AI Generation</h4>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <ImageIcon className="h-3 w-3" />
                              Generate Similar Image
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <ImageIcon className="h-3 w-3" />
                              Extend Image
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <ImageIcon className="h-3 w-3" />
                              Style Transfer
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Smart Analysis</h4>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-2">
                              AI analyzes your image and suggests improvements
                            </p>
                            <Button variant="secondary" size="sm" className="w-full gap-2">
                              <Sparkles className="h-3 w-3" />
                              Analyze Image
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* SHAPE AI TOOLS */}
                    {elementType === "shape" && (
                      <>
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Shape Design
                          </h4>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Palette className="h-3 w-3" />
                              Suggest Color Palette
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Palette className="h-3 w-3" />
                              Generate Pattern
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Create Gradient
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Smart Suggestions</h4>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-2">
                              AI suggests complementary shapes
                            </p>
                            <Button variant="secondary" size="sm" className="w-full gap-2">
                              <Sparkles className="h-3 w-3" />
                              Get Suggestions
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* WIDGET AI TOOLS */}
                    {elementType === "widget" && (
                      <>
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Widget Optimization
                          </h4>
                          
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Optimize Layout
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Sparkles className="h-3 w-3" />
                              Generate Content
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                              <Zap className="h-3 w-3" />
                              Auto-configure
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Smart Insights</h4>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-2">
                              Get AI-powered recommendations for your widget
                            </p>
                            <Button variant="secondary" size="sm" className="w-full gap-2">
                              <Sparkles className="h-3 w-3" />
                              Get Recommendations
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canvas Area and Editing Bar Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Horizontal Contextual Editing Bar */}
            <AnimatePresence>
              {selectedElementId && selectedElement && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b bg-card overflow-hidden flex-shrink-0"
                >
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-muted-foreground">
                        {elementType === "text" ? "Text" : elementType === "image" ? "Image" : elementType === "shape" ? "Shape" : elementType === "video" ? "Video" : "Widget"}:
                      </span>

                      {/* TEXT CONTROLS */}
                      {elementType === "text" && (
                        <>
                          <Select defaultValue={selectedElement?.style?.fontFamily || "inter"}>
                            <SelectTrigger className="w-[130px] h-8">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
                <SelectItem value="georgia">Georgia</SelectItem>
                              <SelectItem value="playfair">Playfair</SelectItem>
              </SelectContent>
            </Select>

                          <Select defaultValue={selectedElement?.style?.fontSize?.toString() || "24"}>
                            <SelectTrigger className="w-[75px] h-8">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                              {[12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64].map(size => (
                                <SelectItem key={size} value={size.toString()}>{size}px</SelectItem>
                              ))}
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Bold">
              <Bold className="h-4 w-4" />
                    </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Italic">
              <Italic className="h-4 w-4" />
            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Underline">
              <Underline className="h-4 w-4" />
            </Button>
                          </div>

            <Separator orientation="vertical" className="h-6" />

                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Align Left">
              <AlignLeft className="h-4 w-4" />
            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Align Center">
              <AlignCenter className="h-4 w-4" />
            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Align Right">
              <AlignRight className="h-4 w-4" />
            </Button>
                          </div>

            <Separator orientation="vertical" className="h-6" />

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Color</span>
                            <input type="color" className="w-10 h-8 rounded border cursor-pointer" defaultValue={selectedElement?.style?.color || "#000000"} />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">BG</span>
                            <input type="color" className="w-10 h-8 rounded border cursor-pointer" defaultValue={selectedElement?.style?.backgroundColor || "#ffffff"} />
                          </div>
                        </>
                      )}

                      {/* SHAPE CONTROLS */}
                      {elementType === "shape" && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Fill</span>
                            <input type="color" className="w-10 h-8 rounded border cursor-pointer" defaultValue={selectedElement?.style?.fillColor || "#3b82f6"} />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Stroke</span>
                            <input type="color" className="w-10 h-8 rounded border cursor-pointer" defaultValue={selectedElement?.style?.strokeColor || "#000000"} />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Width</span>
                            <Input type="number" className="w-16 h-8" defaultValue={selectedElement?.style?.strokeWidth || 0} min={0} max={10} />
                          </div>

                          <Separator orientation="vertical" className="h-6" />

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Opacity</span>
                            <Input type="number" className="w-16 h-8" defaultValue={Math.round((selectedElement?.style?.opacity || 1) * 100)} min={0} max={100} />
                          </div>

                          <Separator orientation="vertical" className="h-6" />

                          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1" title="Bring to Front">
                            <ArrowUp className="h-4 w-4" />
                            <span className="text-xs">Front</span>
            </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1" title="Send to Back">
                            <ArrowDown className="h-4 w-4" />
                            <span className="text-xs">Back</span>
                          </Button>
                        </>
                      )}

                      {/* IMAGE/VIDEO CONTROLS */}
                      {(elementType === "image" || elementType === "video") && (
                        <>
            <Button variant="ghost" size="sm" className="h-8 px-3 gap-2">
              <ImageIcon className="h-4 w-4" />
                            Replace
            </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3 gap-2">
                            <Square className="h-4 w-4" />
                            Crop
                          </Button>

                          <Separator orientation="vertical" className="h-6" />

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Brightness</span>
                            <Input type="number" className="w-16 h-8" defaultValue={100} min={0} max={200} />
        </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Contrast</span>
                            <Input type="number" className="w-16 h-8" defaultValue={100} min={0} max={200} />
                          </div>

                          <Select defaultValue="none">
                            <SelectTrigger className="w-[120px] h-8">
                              <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Filter</SelectItem>
                              <SelectItem value="grayscale">Grayscale</SelectItem>
                              <SelectItem value="sepia">Sepia</SelectItem>
                              <SelectItem value="blur">Blur</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      )}

                      {/* WIDGET CONTROLS */}
                      {elementType === "widget" && (
                        <>
                          <Button variant="ghost" size="sm" className="h-8 px-3 gap-2">
                            <Settings className="h-4 w-4" />
                            Configure
                          </Button>

                          <Separator orientation="vertical" className="h-6" />

                          <Select defaultValue={selectedElement?.widgetConfig?.theme || "light"}>
                            <SelectTrigger className="w-[100px] h-8">
                              <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Refresh (sec)</span>
                            <Input type="number" className="w-20 h-8" defaultValue={60} min={10} max={3600} />
                      </div>
                        </>
                      )}

                      {/* COMMON ACTIONS */}
                      <div className="flex-1" />
                      
                      {/* Effects and AI Buttons */}
                      <Button 
                        variant={effectsPanelOpen ? "secondary" : "ghost"} 
                        size="sm" 
                        className="h-8 px-3 gap-2" 
                        onClick={() => {
                          setEffectsPanelOpen(!effectsPanelOpen);
                          setAiPanelOpen(false);
                        }} 
                        title="Effects"
                      >
                        <Wand2 className="h-4 w-4" />
                        Effects
                      </Button>
                      <Button 
                        variant={aiPanelOpen ? "secondary" : "ghost"} 
                        size="sm" 
                        className="h-8 px-3 gap-2" 
                        onClick={() => {
                          setAiPanelOpen(!aiPanelOpen);
                          setEffectsPanelOpen(false);
                        }} 
                        title="AI Tools"
                      >
                        <Sparkles className="h-4 w-4" />
                        AI
                      </Button>
                      
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="sm" className="h-8 px-3 gap-2" onClick={duplicateElement} title="Duplicate">
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-3 gap-2" title="Lock/Unlock">
                        {selectedElement?.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-3 gap-2 text-destructive hover:text-destructive" onClick={deleteElement} title="Delete">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                      </div>
                      </div>
            </motion.div>
              )}
            </AnimatePresence>

            {/* Canvas Area */}
          <CanvasArea 
            currentSlide={currentSlide} 
            zoomLevel={zoomLevel} 
            selectedElementId={selectedElementId} 
            setSelectedElementId={setSelectedElementId}
            currentSlideIndex={currentSlideIndex}
          />
              </div>
  
          {/* Right Sidebar - Slides */}
          <div className="w-48 border-l bg-card flex flex-col overflow-hidden">
            <div className="p-3 border-b flex-shrink-0">
              <h4 className="font-semibold text-sm">Slides</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {slides.length} total
              </p>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {slides.map((slide, index) => (
            <motion.div
                    key={slide.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentSlideIndex
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                    onClick={() => setCurrentSlideIndex(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-video bg-muted relative">
                      <img
                        src={slide.thumbnail}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                        {index + 1}
                </div>
                </div>
                  </motion.div>
                ))}
                </div>
            </ScrollArea>

            <div className="p-2 border-t space-y-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Slide
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Trash2 className="h-4 w-4" />
                </Button>
                </div>
                      </div>
                  </div>
                </div>

        {/* Bottom Properties Panel */}
        <div className="border-t bg-muted/30 px-4 py-2 flex-shrink-0">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <Select defaultValue="8">
                  <SelectTrigger className="w-[100px] h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="8">8 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Transition:</span>
                <Select defaultValue="fade">
                  <SelectTrigger className="w-[120px] h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </div>

            <div className="text-muted-foreground">
              Slide {currentSlideIndex + 1} of {slides.length}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeElement && (
          <div className="bg-card border-2 border-primary rounded-lg p-3 shadow-xl opacity-90">
            <div className="flex items-center gap-2">
              <activeElement.icon className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm">{activeElement.name}</span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
    );
  };

  // Canvas Area Component with Drop Zone
  const CanvasArea = ({ currentSlide, zoomLevel, selectedElementId, setSelectedElementId, currentSlideIndex }: { 
    currentSlide: Slide | undefined, 
    zoomLevel: number, 
    selectedElementId: string | null, 
    setSelectedElementId: (id: string | null) => void,
    currentSlideIndex: number
  }) => {
    const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });

    return (
      <div className="flex-1 bg-muted/20 overflow-auto relative" ref={setNodeRef}>
        {/* Drop zone hint overlay */}
        <AnimatePresence>
          {isOver && activeElement && (
            <motion.div 
              className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-primary/10 border-2 border-dashed border-primary rounded-lg p-6 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 text-primary">
                  <activeElement.icon className="h-12 w-12" />
                  <p className="font-semibold">Drop to add {activeElement.name}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center min-h-full p-6">
          <div
            className={`bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-200 ${
              isOver ? 'ring-4 ring-primary/40 scale-[1.01] shadow-primary/20' : ''
            }`}
            style={{
              width: `${960 * (zoomLevel / 100)}px`,
              aspectRatio: "16/9",
            }}
            // initial={{ scale: 0.9, opacity: 0 }}
            // animate={{ scale: 1, opacity: 1 }}
            // transition={{ duration: 0.3 }}
          >
            {/* Slide Canvas */}
            <div className="relative w-full h-full bg-white">
              <img
                src={currentSlide?.thumbnail}
                alt={`Slide ${currentSlideIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
                  
                  {/* Mock Editable Elements */}
                  {currentSlide?.elements.map((element) => (
                  <motion.div
                      key={element.id}
                      className={`absolute cursor-pointer group ${
                        selectedElementId === element.id ? "ring-2 ring-primary" : ""
                      }`}
                      style={{
                        left: `${(element.position.x / 960) * 100}%`,
                        top: `${(element.position.y / 540) * 100}%`,
                        width: `${(element.size.width / 960) * 100}%`,
                        height: `${(element.size.height / 540) * 100}%`,
                      }}
                      onClick={() => setSelectedElementId(element.id)}
                      whileHover={{ scale: 1.01 }}
                    >
                      {/* Resize Handles (shown when selected) */}
                      {selectedElementId === element.id && (
                        <>
                          {/* Corner handles */}
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
                          {/* Edge handles */}
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
                          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
                          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
                        </>
                      )}
                      {element.type === "text" && (
                        <div
                          className="w-full h-full flex items-center justify-center border-2 border-dashed border-transparent group-hover:border-primary/50 transition-all p-2"
                          style={{
                            fontSize: `${(element.style?.fontSize || 24) * (zoomLevel / 100)}px`,
                            fontFamily: element.style?.fontFamily || "Inter",
                            color: element.style?.color || "#1a1a1a",
                            fontWeight: element.style?.bold ? "bold" : "normal",
                            fontStyle: element.style?.italic ? "italic" : "normal",
                            textAlign: element.style?.align || "center",
                            textDecoration: element.style?.underline ? "underline" : "none",
                          }}
                        >
                          {element.content}
                      </div>
                      )}
                      {element.type === "image" && (
                        <div className="relative w-full h-full border-2 border-dashed border-transparent group-hover:border-primary/50 transition-all">
                          <img
                            src={element.content}
                            alt="Element"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                      )}
                      {element.type === "shape" && (
                        <div
                          className="w-full h-full border-2 border-dashed border-transparent group-hover:border-primary/50 transition-all"
                          style={{
                            backgroundColor: element.style?.fillColor || element.style?.color || "#3b82f6",
                            borderRadius: element.content === "circle" ? "50%" : element.content === "star" ? "10%" : "0",
                            opacity: element.style?.opacity || 1
                          }}
                        />
                      )}
                      {element.type === "video" && (
                        <div className="relative w-full h-full border-2 border-dashed border-transparent group-hover:border-primary/50 transition-all bg-black/90">
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <Play className="h-12 w-12 mb-2 opacity-80" />
                            <span className="text-xs opacity-60">Video Placeholder</span>
                          </div>
                        </div>
                      )}
                      {element.type === "widget" && (
                        <div className="relative w-full h-full border-2 border-dashed border-transparent group-hover:border-primary/50 transition-all bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
                          {element.widgetType === "clock" && (
                            <div className="flex flex-col items-center justify-center h-full text-white">
                              <Clock className="h-8 w-8 mb-1" />
                              <div className="text-2xl font-bold">12:34</div>
                              <div className="text-xs opacity-80">PM</div>
                            </div>
                          )}
                          {element.widgetType === "weather" && (
                            <div className="flex flex-col items-center justify-center h-full text-white">
                              <Cloud className="h-8 w-8 mb-1" />
                              <div className="text-2xl font-bold">27°C</div>
                              <div className="text-xs opacity-80">Sunny</div>
                            </div>
                          )}
                          {element.widgetType === "news" && (
                            <div className="flex items-center justify-center h-full text-white px-2">
                              <Newspaper className="h-6 w-6 mr-2 flex-shrink-0" />
                              <div className="text-xs font-medium truncate">Breaking News Ticker</div>
                            </div>
                          )}
                          {element.widgetType === "countdown" && (
                            <div className="flex flex-col items-center justify-center h-full text-white">
                              <Timer className="h-8 w-8 mb-1" />
                              <div className="text-2xl font-bold">5:30</div>
                              <div className="text-xs opacity-80">Time Left</div>
                            </div>
                          )}
                          {/* Config indicator when selected */}
                          {selectedElementId === element.id && (
                            <div className="absolute top-1 right-1 bg-white/20 backdrop-blur-sm rounded p-1">
                              <Settings className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
    );
  };
  
  const renderCompleteStep = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
    <motion.div 
        className="space-y-4  max-w-4xl mx-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
        {/* Success Icon */}
      <motion.div
          className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
            duration: 0.4,
          ease: "easeOut",
            delay: 0.1 
          }}
        >
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-xl mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
            Template Saved Successfully!
        </h3>
          <p className="text-lg text-muted-foreground">
            Your digital signage template is ready to publish
        </p>
      </motion.div>

        {/* Template Preview Card */}
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Preview Thumbnail */}
              <div className="space-y-3">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted relative shadow-lg">
                  <img
                    src={selectedTemplate?.thumbnail}
                    alt={selectedTemplate?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Saved
        </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {slides.slice(0, 4).map((slide, index) => (
                    <div key={slide.id} className="aspect-video rounded overflow-hidden bg-muted border">
                      <img
                        src={slide.thumbnail}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-semibold mb-1">{selectedTemplate?.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedTemplate?.description}</p>
        </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Industry</span>
                    <Badge variant="outline">{selectedTemplate?.industry}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Slides</span>
                    <Badge variant="secondary">{slides.length} slides</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Edited</span>
                    <span className="font-medium text-xs">{currentDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-green-500">Ready to Publish</Badge>
                  </div>
                </div>

                <Separator />

                {/* Publish Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Publish Options</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
      </motion.div>

        {/* Action Buttons */}
      <motion.div 
        className="flex gap-3 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Button variant="outline" onClick={handleClose} size="lg" className="gap-2">
            Create Another Template
        </Button>
        <Button onClick={handleClose} size="lg" className="gap-2">
            <Monitor className="h-4 w-4" />
            Go to Media Library
        </Button>
      </motion.div>
    </motion.div>
  );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full h-screen max-h-screen overflow-hidden p-0 flex flex-col">
        {/* Only show header for browse, preview, and complete steps */}
        {(currentStep !== "edit" && currentStep !== "preview") && (
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-transparent flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold">
                {currentStep === "browse" && "Choose a Template"}
                {/* {currentStep === "preview" && "Template Preview"} */}
                  {currentStep === "complete" && "Template Saved"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {currentStep === "browse" && "Select a template that fits your needs"}
                {/* {currentStep === "preview" && "Review the template details and features"} */}
                  {currentStep === "complete" && "Your template is ready to publish"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        )}

        <div className={currentStep === "edit" ? "flex-1 overflow-hidden" : "flex-1 overflow-y-auto px-6 py-4"}>
          <AnimatePresence mode="wait">
            {currentStep === "browse" && (
              <motion.div
                key="browse"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderBrowseStep()}
              </motion.div>
            )}
            {currentStep === "preview" && (
              <motion.div
                key="preview"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderPreviewStep()}
              </motion.div>
            )}
            {currentStep === "edit" && (
              <motion.div
                key="edit"
                className="h-full"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderEditStep()}
              </motion.div>
            )}
            {currentStep === "complete" && (
              <motion.div
                key="complete"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderCompleteStep()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
