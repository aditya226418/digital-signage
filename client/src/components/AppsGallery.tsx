import { useState } from "react";
import {
  Search,
  Clock,
  Calendar,
  QrCode,
  MapPin,
  Building2,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import AppDetailsModal from "@/components/AppDetailsModal";
import FeatureRequestModal from "@/components/FeatureRequestModal";
import { cn } from "@/lib/utils";

export interface App {
  id: string;
  name: string;
  icon: string | React.ComponentType<{ className?: string }>;
  description: string;
  fullDescription: string;
  category: string;
  features: string[];
  previewImages: string[];
  pricing: string;
  setupTime: string;
}

// Mock Apps Data
const APPS: App[] = [
  // News & Information
  {
    id: "bbc-news",
    name: "BBC News",
    icon: "https://www.bbc.com/favicon.ico",
    description: "Display live BBC news headlines and breaking stories",
    fullDescription: "Stay informed with the latest BBC news headlines, breaking stories, and live updates displayed directly on your screens. Customizable news categories and automatic refresh intervals ensure your audience always sees the most current information.",
    category: "News & Information",
    features: ["Live news updates", "Multiple categories", "Breaking news alerts", "Customizable refresh rate", "Multi-language support"],
    previewImages: ["/app-previews/bbc-1.jpg", "/app-previews/bbc-2.jpg", "/app-previews/bbc-3.jpg"],
    pricing: "Free",
    setupTime: "5 minutes",
  },
  {
    id: "cnn-live",
    name: "CNN Live",
    icon: "https://www.cnn.com/favicon.ico",
    description: "Real-time CNN news feed with video highlights",
    fullDescription: "Bring CNN's award-winning journalism to your displays with live headlines, breaking news, and video highlights. Features automatic content rotation and customizable display layouts for different screen sizes.",
    category: "News & Information",
    features: ["Live video clips", "Breaking news banner", "Customizable layout", "Category filtering", "Auto-refresh"],
    previewImages: ["/app-previews/cnn-1.jpg", "/app-previews/cnn-2.jpg", "/app-previews/cnn-3.jpg"],
    pricing: "Free",
    setupTime: "5 minutes",
  },
  {
    id: "reuters",
    name: "Reuters",
    icon: "https://www.reuters.com/favicon.ico",
    description: "Global news and financial market updates from Reuters",
    fullDescription: "Access Reuters' comprehensive global news coverage and real-time financial market data. Perfect for corporate lobbies and trading floors. Includes business news, market analysis, and breaking headlines.",
    category: "News & Information",
    features: ["Global news coverage", "Market data", "Business insights", "Real-time updates", "Archive access"],
    previewImages: ["/app-previews/reuters-1.jpg", "/app-previews/reuters-2.jpg", "/app-previews/reuters-3.jpg"],
    pricing: "Free",
    setupTime: "3 minutes",
  },
  {
    id: "weather-channel",
    name: "Weather Channel",
    icon: "https://weather.com/favicon.ico",
    description: "Live weather forecasts and severe weather alerts",
    fullDescription: "Display accurate weather forecasts, current conditions, and severe weather alerts for any location. Features radar maps, 7-day forecasts, and customizable display options perfect for any venue.",
    category: "News & Information",
    features: ["7-day forecast", "Radar maps", "Severe weather alerts", "Multiple locations", "Hourly updates"],
    previewImages: ["/app-previews/weather-1.jpg", "/app-previews/weather-2.jpg", "/app-previews/weather-3.jpg"],
    pricing: "Free",
    setupTime: "2 minutes",
  },
  {
    id: "local-news",
    name: "Local News Feed",
    icon: MapPin,
    description: "Customizable local news from your region",
    fullDescription: "Aggregate local news from multiple sources in your area. Perfect for community centers, local businesses, and municipal buildings. Automatically filters news by location and relevance.",
    category: "News & Information",
    features: ["Location-based filtering", "Multiple sources", "Auto-curation", "Community events", "Traffic updates"],
    previewImages: ["/app-previews/local-1.jpg", "/app-previews/local-2.jpg", "/app-previews/local-3.jpg"],
    pricing: "Free",
    setupTime: "5 minutes",
  },

  // Productivity
  {
    id: "excel-viewer",
    name: "Excel Viewer",
    icon: "https://www.microsoft.com/favicon.ico",
    description: "Display Excel spreadsheets and live data dashboards",
    fullDescription: "Showcase Excel spreadsheets, charts, and data dashboards on your digital signage. Features automatic refresh from cloud storage, support for formulas and formatting, and interactive chart displays.",
    category: "Productivity",
    features: ["Live Excel data", "Cloud sync", "Chart display", "Auto-refresh", "Password protection"],
    previewImages: ["/app-previews/excel-1.jpg", "/app-previews/excel-2.jpg", "/app-previews/excel-3.jpg", "/app-previews/excel-4.jpg"],
    pricing: "Premium",
    setupTime: "10 minutes",
  },
  {
    id: "powerpoint-live",
    name: "PowerPoint Live",
    icon: "https://www.microsoft.com/favicon.ico",
    description: "Stream PowerPoint presentations in real-time",
    fullDescription: "Display PowerPoint presentations with automatic slide advancement, transitions, and animations. Perfect for corporate communications, training materials, and event schedules. Supports OneDrive and SharePoint integration.",
    category: "Productivity",
    features: ["Auto-advance slides", "Cloud integration", "Animations support", "Schedule rotation", "Remote control"],
    previewImages: ["/app-previews/ppt-1.jpg", "/app-previews/ppt-2.jpg", "/app-previews/ppt-3.jpg"],
    pricing: "Premium",
    setupTime: "8 minutes",
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    icon: "https://www.google.com/favicon.ico",
    description: "Real-time Google Sheets data visualization",
    fullDescription: "Connect your Google Sheets directly to your displays for real-time data visualization. Ideal for KPI dashboards, sales tracking, and team metrics. Automatic updates ensure data is always current.",
    category: "Productivity",
    features: ["Real-time sync", "Multiple sheets", "Chart visualization", "Collaborative editing", "Access controls"],
    previewImages: ["/app-previews/gsheets-1.jpg", "/app-previews/gsheets-2.jpg", "/app-previews/gsheets-3.jpg"],
    pricing: "Premium",
    setupTime: "7 minutes",
  },
  {
    id: "trello-board",
    name: "Trello Board",
    icon: "https://trello.com/favicon.ico",
    description: "Display your Trello boards and task progress",
    fullDescription: "Visualize team progress with live Trello board displays. Show cards, lists, and workflow status to keep everyone informed. Perfect for agile teams and project management offices.",
    category: "Productivity",
    features: ["Live board sync", "Multiple boards", "Card details", "Progress tracking", "Team collaboration"],
    previewImages: ["/app-previews/trello-1.jpg", "/app-previews/trello-2.jpg", "/app-previews/trello-3.jpg"],
    pricing: "Free",
    setupTime: "5 minutes",
  },
  {
    id: "asana-tasks",
    name: "Asana Tasks",
    icon: "https://asana.com/favicon.ico",
    description: "Show Asana project timelines and task lists",
    fullDescription: "Keep your team aligned with live Asana project displays. Show upcoming deadlines, task assignments, and project progress. Customizable views for different team needs.",
    category: "Productivity",
    features: ["Project timelines", "Task assignments", "Due date tracking", "Team workload", "Custom filters"],
    previewImages: ["/app-previews/asana-1.jpg", "/app-previews/asana-2.jpg", "/app-previews/asana-3.jpg"],
    pricing: "Premium",
    setupTime: "6 minutes",
  },

  // Social Media
  {
    id: "instagram-feed",
    name: "Instagram Feed",
    icon: "https://www.instagram.com/static/images/ico/favicon.ico",
    description: "Display your Instagram posts and stories",
    fullDescription: "Showcase your Instagram content on digital displays. Features automatic feed updates, story highlights, and hashtag filtering. Perfect for retail, events, and brand awareness campaigns.",
    category: "Social Media",
    features: ["Auto-refresh feed", "Story highlights", "Hashtag filtering", "Multiple accounts", "Engagement metrics"],
    previewImages: ["/app-previews/instagram-1.jpg", "/app-previews/instagram-2.jpg", "/app-previews/instagram-3.jpg", "/app-previews/instagram-4.jpg"],
    pricing: "Free",
    setupTime: "4 minutes",
  },
  {
    id: "twitter-wall",
    name: "Twitter Wall",
    icon: "https://twitter.com/favicon.ico",
    description: "Live Twitter feed with hashtag monitoring",
    fullDescription: "Create engaging social media walls with live Twitter feeds. Monitor hashtags, display mentions, and showcase user-generated content at events and in public spaces.",
    category: "Social Media",
    features: ["Live tweet feed", "Hashtag monitoring", "Moderation tools", "Custom styling", "Media display"],
    previewImages: ["/app-previews/twitter-1.jpg", "/app-previews/twitter-2.jpg", "/app-previews/twitter-3.jpg"],
    pricing: "Free",
    setupTime: "3 minutes",
  },
  {
    id: "facebook-posts",
    name: "Facebook Posts",
    icon: "https://www.facebook.com/favicon.ico",
    description: "Show your Facebook page posts and updates",
    fullDescription: "Display your Facebook business page content including posts, photos, and videos. Great for building social proof and community engagement in retail and hospitality environments.",
    category: "Social Media",
    features: ["Page posts", "Photo albums", "Video content", "Comment display", "Auto-refresh"],
    previewImages: ["/app-previews/facebook-1.jpg", "/app-previews/facebook-2.jpg", "/app-previews/facebook-3.jpg"],
    pricing: "Free",
    setupTime: "4 minutes",
  },
  {
    id: "linkedin-updates",
    name: "LinkedIn Updates",
    icon: "https://www.linkedin.com/favicon.ico",
    description: "Corporate LinkedIn feed and company updates",
    fullDescription: "Share your company's LinkedIn presence on office displays. Show company updates, employee highlights, and industry news. Perfect for corporate lobbies and recruitment events.",
    category: "Social Media",
    features: ["Company feed", "Employee posts", "Job listings", "Industry news", "Analytics"],
    previewImages: ["/app-previews/linkedin-1.jpg", "/app-previews/linkedin-2.jpg", "/app-previews/linkedin-3.jpg"],
    pricing: "Premium",
    setupTime: "5 minutes",
  },

  // Finance
  {
    id: "stock-ticker",
    name: "Stock Ticker",
    icon: "https://www.bloomberg.com/favicon.ico",
    description: "Real-time stock market prices and indices",
    fullDescription: "Display live stock prices, market indices, and trading volumes. Customizable watchlists and automatic refresh intervals. Essential for financial institutions and trading floors.",
    category: "Finance",
    features: ["Real-time prices", "Custom watchlists", "Market indices", "Volume data", "Change indicators"],
    previewImages: ["/app-previews/stocks-1.jpg", "/app-previews/stocks-2.jpg", "/app-previews/stocks-3.jpg"],
    pricing: "Premium",
    setupTime: "5 minutes",
  },
  {
    id: "crypto-prices",
    name: "Crypto Prices",
    icon: "https://coinmarketcap.com/favicon.ico",
    description: "Live cryptocurrency prices and market data",
    fullDescription: "Track cryptocurrency prices in real-time with market cap, volume, and 24h change data. Supports major cryptocurrencies and custom portfolios. Perfect for fintech offices and trading spaces.",
    category: "Finance",
    features: ["Live crypto prices", "Market trends", "Portfolio tracking", "Price alerts", "Historical charts"],
    previewImages: ["/app-previews/crypto-1.jpg", "/app-previews/crypto-2.jpg", "/app-previews/crypto-3.jpg", "/app-previews/crypto-4.jpg"],
    pricing: "Free",
    setupTime: "3 minutes",
  },
  {
    id: "exchange-rates",
    name: "Exchange Rates",
    icon: "https://www.xe.com/favicon.ico",
    description: "Currency exchange rates for international business",
    fullDescription: "Display current exchange rates for multiple currencies. Essential for international businesses, travel agencies, and currency exchange locations. Updates every minute.",
    category: "Finance",
    features: ["Multi-currency", "Live rates", "Historical data", "Conversion calculator", "Rate alerts"],
    previewImages: ["/app-previews/exchange-1.jpg", "/app-previews/exchange-2.jpg", "/app-previews/exchange-3.jpg"],
    pricing: "Free",
    setupTime: "2 minutes",
  },
  {
    id: "market-news",
    name: "Market News",
    icon: "https://www.bloomberg.com/favicon.ico",
    description: "Financial news and market analysis",
    fullDescription: "Stay updated with breaking financial news, market analysis, and economic indicators. Aggregates content from major financial news sources. Ideal for corporate environments.",
    category: "Finance",
    features: ["Breaking news", "Market analysis", "Economic calendar", "Sector performance", "Analyst ratings"],
    previewImages: ["/app-previews/market-news-1.jpg", "/app-previews/market-news-2.jpg", "/app-previews/market-news-3.jpg"],
    pricing: "Premium",
    setupTime: "4 minutes",
  },

  // Entertainment
  {
    id: "spotify-now-playing",
    name: "Spotify Now Playing",
    icon: "https://www.spotify.com/favicon.ico",
    description: "Show what's currently playing on Spotify",
    fullDescription: "Display the currently playing track, artist, and album art from your Spotify account. Perfect for cafes, retail stores, and entertainment venues. Creates an engaging atmosphere.",
    category: "Entertainment",
    features: ["Current track display", "Album artwork", "Playlist info", "Queue preview", "Playback controls"],
    previewImages: ["/app-previews/spotify-1.jpg", "/app-previews/spotify-2.jpg", "/app-previews/spotify-3.jpg"],
    pricing: "Free",
    setupTime: "3 minutes",
  },
  {
    id: "youtube-playlist",
    name: "YouTube Playlist",
    icon: "https://www.youtube.com/favicon.ico",
    description: "Stream YouTube playlists and videos",
    fullDescription: "Display YouTube videos and playlists on your screens. Automatically plays through your selected content with seamless transitions. Great for waiting areas and public spaces.",
    category: "Entertainment",
    features: ["Playlist playback", "Auto-advance", "HD quality", "Schedule playlists", "Content filtering"],
    previewImages: ["/app-previews/youtube-1.jpg", "/app-previews/youtube-2.jpg", "/app-previews/youtube-3.jpg"],
    pricing: "Free",
    setupTime: "4 minutes",
  },
  {
    id: "twitch-stream",
    name: "Twitch Stream",
    icon: "https://www.twitch.tv/favicon.ico",
    description: "Display live Twitch streams",
    fullDescription: "Show live Twitch streams on your displays. Perfect for gaming lounges, esports venues, and entertainment spaces. Includes chat display and stream information.",
    category: "Entertainment",
    features: ["Live streaming", "Chat overlay", "Multiple channels", "Stream alerts", "Follower count"],
    previewImages: ["/app-previews/twitch-1.jpg", "/app-previews/twitch-2.jpg", "/app-previews/twitch-3.jpg"],
    pricing: "Free",
    setupTime: "5 minutes",
  },

  // Utilities
  {
    id: "world-clock",
    name: "World Clock",
    icon: Clock,
    description: "Display time zones from around the world",
    fullDescription: "Show multiple time zones simultaneously with customizable cities and regions. Perfect for global offices, airports, and international businesses. Includes date and timezone information.",
    category: "Utilities",
    features: ["Multiple timezones", "Custom cities", "Date display", "Analog/Digital", "DST handling"],
    previewImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    ],
    pricing: "Free",
    setupTime: "2 minutes",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: Calendar,
    description: "Event calendar and meeting room schedules",
    fullDescription: "Display upcoming events, meetings, and important dates. Integrates with Google Calendar, Outlook, and other calendar services. Perfect for office lobbies and conference rooms.",
    category: "Utilities",
    features: ["Event listings", "Meeting rooms", "Sync with calendars", "Recurring events", "Color coding"],
    previewImages: ["/app-previews/calendar-1.jpg", "/app-previews/calendar-2.jpg", "/app-previews/calendar-3.jpg", "/app-previews/calendar-4.jpg"],
    pricing: "Free",
    setupTime: "6 minutes",
  },
  {
    id: "room-booking",
    name: "Room Booking",
    icon: Building2,
    description: "Meeting room availability and booking system",
    fullDescription: "Real-time meeting room availability display with booking capabilities. Shows current status, upcoming meetings, and allows quick bookings. Integrates with major calendar systems.",
    category: "Utilities",
    features: ["Real-time availability", "Quick booking", "Calendar sync", "Room details", "Check-in system"],
    previewImages: ["/app-previews/room-1.jpg", "/app-previews/room-2.jpg", "/app-previews/room-3.jpg"],
    pricing: "Premium",
    setupTime: "10 minutes",
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    icon: QrCode,
    description: "Dynamic QR codes for any content",
    fullDescription: "Generate and display QR codes for websites, WiFi access, contact info, and more. Customizable design and automatic rotation for multiple codes. Perfect for customer engagement.",
    category: "Utilities",
    features: ["Dynamic QR codes", "Multiple types", "Custom styling", "Analytics tracking", "Code rotation"],
    previewImages: ["/app-previews/qr-1.jpg", "/app-previews/qr-2.jpg", "/app-previews/qr-3.jpg"],
    pricing: "Free",
    setupTime: "3 minutes",
  },

  // Analytics
  {
    id: "google-analytics",
    name: "Google Analytics Dashboard",
    icon: "https://analytics.google.com/favicon.ico",
    description: "Real-time website analytics and metrics",
    fullDescription: "Display your Google Analytics data in beautiful, easy-to-read dashboards. Show real-time visitors, traffic sources, and conversion metrics. Motivate teams with live performance data.",
    category: "Analytics",
    features: ["Real-time metrics", "Custom dashboards", "Traffic sources", "Conversion tracking", "Historical data"],
    previewImages: ["/app-previews/ga-1.jpg", "/app-previews/ga-2.jpg", "/app-previews/ga-3.jpg", "/app-previews/ga-4.jpg"],
    pricing: "Premium",
    setupTime: "8 minutes",
  },
  {
    id: "sales-dashboard",
    name: "Sales Dashboard",
    icon: "https://www.salesforce.com/favicon.ico",
    description: "Live sales metrics and team performance",
    fullDescription: "Visualize sales data with real-time dashboards showing revenue, targets, and team performance. Connects to major CRM systems. Perfect for motivating sales teams and tracking goals.",
    category: "Analytics",
    features: ["Real-time sales data", "Team leaderboards", "Target tracking", "Revenue forecasts", "CRM integration"],
    previewImages: ["/app-previews/sales-1.jpg", "/app-previews/sales-2.jpg", "/app-previews/sales-3.jpg"],
    pricing: "Premium",
    setupTime: "12 minutes",
  },
];

interface RecentlyUsedApp extends App {
  lastUsed: Date;
  usageCount: number;
}

// Mock Recently Used Apps Data
const RECENTLY_USED_APPS: RecentlyUsedApp[] = [
  {
    id: "bbc-news",
    name: "BBC News",
    icon: "https://www.bbc.com/favicon.ico",
    description: "Display live BBC news headlines and breaking stories",
    fullDescription: "Stay informed with the latest BBC news headlines, breaking stories, and live updates displayed directly on your screens. Customizable news categories and automatic refresh intervals ensure your audience always sees the most current information.",
    category: "News & Information",
    features: ["Live news updates", "Multiple categories", "Breaking news alerts", "Customizable refresh rate", "Multi-language support"],
    previewImages: ["/app-previews/bbc-1.jpg", "/app-previews/bbc-2.jpg", "/app-previews/bbc-3.jpg"],
    pricing: "Free",
    setupTime: "5 minutes",
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    usageCount: 45,
  },
  {
    id: "excel-viewer",
    name: "Excel Viewer",
    icon: "https://www.microsoft.com/favicon.ico",
    description: "Display Excel spreadsheets and live data dashboards",
    fullDescription: "Showcase Excel spreadsheets, charts, and data dashboards on your digital signage. Features automatic refresh from cloud storage, support for formulas and formatting, and interactive chart displays.",
    category: "Productivity",
    features: ["Live Excel data", "Cloud sync", "Chart display", "Auto-refresh", "Password protection"],
    previewImages: ["/app-previews/excel-1.jpg", "/app-previews/excel-2.jpg", "/app-previews/excel-3.jpg", "/app-previews/excel-4.jpg"],
    pricing: "Premium",
    setupTime: "10 minutes",
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    usageCount: 32,
  },
  {
    id: "instagram-feed",
    name: "Instagram Feed",
    icon: "https://www.instagram.com/favicon.ico",
    description: "Display your Instagram posts and stories",
    fullDescription: "Showcase your Instagram content on digital displays. Features automatic feed updates, story highlights, and hashtag filtering. Perfect for retail, events, and brand awareness campaigns.",
    category: "Social Media",
    features: ["Auto-refresh feed", "Story highlights", "Hashtag filtering", "Multiple accounts", "Engagement metrics"],
    previewImages: ["/app-previews/instagram-1.jpg", "/app-previews/instagram-2.jpg", "/app-previews/instagram-3.jpg", "/app-previews/instagram-4.jpg"],
    pricing: "Free",
    setupTime: "4 minutes",
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    usageCount: 28,
  },
  {
    id: "spotify-now-playing",
    name: "Spotify Now Playing",
    icon: "https://www.spotify.com/favicon.ico",
    description: "Show what's currently playing on Spotify",
    fullDescription: "Display the currently playing track, artist, and album art from your Spotify account. Perfect for cafes, retail stores, and entertainment venues. Creates an engaging atmosphere.",
    category: "Entertainment",
    features: ["Current track display", "Album artwork", "Playlist info", "Queue preview", "Playback controls"],
    previewImages: ["/app-previews/spotify-1.jpg", "/app-previews/spotify-2.jpg", "/app-previews/spotify-3.jpg"],
    pricing: "Free",
    setupTime: "3 minutes",
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    usageCount: 21,
  },
  {
    id: "google-analytics",
    name: "Google Analytics Dashboard",
    icon: "https://analytics.google.com/favicon.ico",
    description: "Real-time website analytics and metrics",
    fullDescription: "Display your Google Analytics data in beautiful, easy-to-read dashboards. Show real-time visitors, traffic sources, and conversion metrics. Motivate teams with live performance data.",
    category: "Analytics",
    features: ["Real-time metrics", "Custom dashboards", "Traffic sources", "Conversion tracking", "Historical data"],
    previewImages: ["/app-previews/ga-1.jpg", "/app-previews/ga-2.jpg", "/app-previews/ga-3.jpg", "/app-previews/ga-4.jpg"],
    pricing: "Premium",
    setupTime: "8 minutes",
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    usageCount: 38,
  },
  {
    id: "stock-ticker",
    name: "Stock Ticker",
    icon: "https://www.bloomberg.com/favicon.ico",
    description: "Real-time stock market prices and indices",
    fullDescription: "Display live stock prices, market indices, and trading volumes. Customizable watchlists and automatic refresh intervals. Essential for financial institutions and trading floors.",
    category: "Finance",
    features: ["Real-time prices", "Custom watchlists", "Market indices", "Volume data", "Change indicators"],
    previewImages: ["/app-previews/stocks-1.jpg", "/app-previews/stocks-2.jpg", "/app-previews/stocks-3.jpg"],
    pricing: "Premium",
    setupTime: "5 minutes",
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    usageCount: 15,
  },
  {
    id: "youtube-playlist",
    name: "YouTube Playlist",
    icon: "https://www.youtube.com/favicon.ico",
    description: "Stream YouTube playlists and videos",
    fullDescription: "Stream YouTube playlists, channels, or individual videos on your displays. Features autoplay, loop settings, and full-screen video display. Perfect for entertainment and educational content.",
    category: "Entertainment",
    features: ["Playlist streaming", "Autoplay", "Full-screen display", "Loop settings", "Audio control"],
    previewImages: ["/app-previews/youtube-1.jpg", "/app-previews/youtube-2.jpg", "/app-previews/youtube-3.jpg"],
    pricing: "Free",
    setupTime: "3 minutes",
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    usageCount: 52,
  },
];

const CATEGORIES = [
  "All",
  "Recently Used",
  "News & Information",
  "Productivity",
  "Social Media",
  "Finance",
  "Entertainment",
  "Utilities",
  "Analytics",
];

export default function AppsGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFeatureRequestOpen, setIsFeatureRequestOpen] = useState(false);

  // Filter apps
  const filteredApps = APPS.filter((app) => {
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter recently used apps
  const recentlyUsedFiltered = RECENTLY_USED_APPS.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());

  const displayApps = selectedCategory === "Recently Used" ? recentlyUsedFiltered : filteredApps;

  const handleAppClick = (app: App) => {
    setSelectedApp(app);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
  };

  // Helper function to get days ago
  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "1d ago";
    }
    return `${diffDays}d ago`;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search apps by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {displayApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No apps found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or selecting a different category
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-17rem)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                  {displayApps.map((app) => {
                    const renderIcon = () => {
                      if (typeof app.icon === 'string') {
                        return (
                          <img
                            src={app.icon}
                            alt={`${app.name} icon`}
                            className="h-6 w-6 object-contain"
                            onError={(e) => {
                              // Fallback to a generic icon if the image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = 'h-6 w-6 bg-primary/20 rounded flex items-center justify-center text-primary text-xs font-bold';
                              fallback.textContent = app.name.charAt(0);
                              target.parentNode?.appendChild(fallback);
                            }}
                          />
                        );
                      } else {
                        const IconComponent = app.icon;
                        return <IconComponent className="h-6 w-6" />;
                      }
                    };

                    const isRecentlyUsed = selectedCategory === "Recently Used";
                    const recentlyUsedApp = app as RecentlyUsedApp;

                    return (
                      <Card
                        key={app.id}
                        className={cn(
                          "group relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md border-border/40",
                          "animate-in fade-in slide-in-from-bottom-4 duration-500"
                        )}
                        onClick={() => handleAppClick(app)}
                      >
                        <div className="p-6 space-y-4">
                          {/* Icon and Badge */}
                          <div className="flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                              {renderIcon()}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {app.pricing}
                            </Badge>
                          </div>

                          {/* App Info */}
                          <div className="space-y-2">
                            <h3 className="font-semibold text-base line-clamp-1">{app.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {app.description}
                            </p>
                          </div>

                          {/* Category Badge and Meta */}
                          <div className="flex items-center justify-between pt-2">
                            <Badge variant="outline" className="text-xs">
                              {app.category}
                            </Badge>
                            {isRecentlyUsed ? (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <TrendingUp className="h-3 w-3" />
                                <span>{getDaysAgo(recentlyUsedApp.lastUsed)}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">{app.setupTime}</span>
                            )}
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </Card>
                    );
                  })}

                  {/* Feature Request Card - As an app card in the grid */}
                  <Card
                    className={cn(
                      "group relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md",
                      "animate-in fade-in slide-in-from-bottom-4 duration-500",
                      "border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50/50"
                    )}
                    onClick={() => setIsFeatureRequestOpen(true)}
                  >
                    <div className="p-6 space-y-4">
                      {/* Icon and Badge */}
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                          <Lightbulb className="h-6 w-6" />
                        </div>
                        <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-300">
                          Request
                        </Badge>
                      </div>

                      {/* App Info */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-base line-clamp-1">Missing an App?</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          Can't find what you need? Request a feature
                        </p>
                      </div>

                      {/* Category Badge and Meta */}
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="outline" className="text-xs">
                          Suggestions
                        </Badge>
                        <span className="text-xs text-amber-700 font-medium">Tell us</span>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  </Card>
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        {/* Results count */}
        {displayApps.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {displayApps.length} {displayApps.length === 1 ? "app" : "apps"}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )}

      </div>

      {/* App Details Modal */}
      {selectedApp && (
        <AppDetailsModal
          app={selectedApp}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Feature Request Modal */}
      <FeatureRequestModal
        isOpen={isFeatureRequestOpen}
        onClose={() => setIsFeatureRequestOpen(false)}
      />
    </>
  );
}

