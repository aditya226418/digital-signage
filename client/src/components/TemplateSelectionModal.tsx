import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Share2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
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
  type: "text" | "image" | "shape";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: "left" | "center" | "right" | "justify";
  };
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

  const toggleFavorite = (templateId: string) => {
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
                          toggleFavorite(template.id);
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


  // NEW: PowerPoint-style Edit Step
  const renderEditStep = () => {
    const currentSlide = slides[currentSlideIndex];
  
    return (
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
  
          {/* Text Editing Toolbar */}
            <motion.div
            className="mt-3 flex items-center gap-2 flex-wrap justify-center"
              initial={{ opacity: 0 }}
            animate={{ opacity: selectedElementId ? 1 : 0.5 }}
          >
            <Select defaultValue="inter">
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
                <SelectItem value="georgia">Georgia</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="24">
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="24">24px</SelectItem>
                <SelectItem value="32">32px</SelectItem>
                <SelectItem value="48">48px</SelectItem>
                <SelectItem value="64">64px</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bold className="h-4 w-4" />
                    </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Underline className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <AlignJustify className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="sm" className="h-8 px-3 gap-2">
              <Type className="h-4 w-4" />
              Add Text
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3 gap-2">
              <ImageIcon className="h-4 w-4" />
              Add Image
            </Button>
            </motion.div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 bg-muted/20 overflow-auto">
            <div className="flex items-center justify-center min-h-full p-6">
            <motion.div
                className="bg-white shadow-2xl rounded-lg overflow-hidden"
                style={{
                  width: `${960 * (zoomLevel / 100)}px`,
                  aspectRatio: "16/9",
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
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
            </motion.div>
                  ))}
                </div>
          </motion.div>
            </div>
              </div>
  
          {/* Right Sidebar - Slides */}
          <div className="w-64 border-l bg-card flex flex-col overflow-hidden">
            <div className="p-3 border-b flex-shrink-0">
              <h4 className="font-semibold text-sm">Slides</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {slides.length} total
              </p>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
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

            <div className="p-3 border-t space-y-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Slide
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
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
