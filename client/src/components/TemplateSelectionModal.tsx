import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Eye,
  Palette,
  FileText,
  Image as ImageIcon,
  Settings,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  ZoomIn,
  Monitor,
  Timer,
  Users,
  Star,
  Upload
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Template {
  id: string;
  name: string;
  description: string;
  industry: string;
  thumbnail: string;
  slideCount: number;
  features: string[];
  previewImages: string[];
}

interface TemplateSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Enhanced template data with signage-specific content
const mockTemplates: Template[] = [
  // Retail Templates
  {
    id: "1",
    name: "Digital Store Menu Board",
    description: "Modern retail display with dynamic pricing, product showcases, and promotional banners",
    industry: "Retail",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop&auto=format",
    slideCount: 8,
    features: ["Dynamic Pricing", "Product Showcase", "Promotional Banners", "Brand Integration"],
    previewImages: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "2",
    name: "Flash Sale Display",
    description: "Eye-catching template with countdown timers, bold pricing, and urgent call-to-action elements",
    industry: "Retail",
    thumbnail: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=225&fit=crop&auto=format",
    slideCount: 6,
    features: ["Countdown Timer", "Bold Pricing", "Urgent CTAs", "Sale Badges"],
    previewImages: [
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "3",
    name: "Product Showcase Wall",
    description: "Multi-product grid layout perfect for showcasing various items with detailed specifications",
    industry: "Retail",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop&auto=format",
    slideCount: 10,
    features: ["Product Grid", "Specifications", "Comparison Charts", "High-Res Images"],
    previewImages: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop&auto=format"
    ]
  },

  // Restaurant Templates
  {
    id: "4",
    name: "Restaurant Menu Board",
    description: "Appetizing template with food categories, pricing, and mouth-watering food photography",
    industry: "Restaurant",
    thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=225&fit=crop&auto=format",
    slideCount: 8,
    features: ["Food Categories", "Pricing Display", "Food Photography", "Allergen Info"],
    previewImages: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "5",
    name: "Daily Specials Display",
    description: "Chef's recommendations and seasonal items with rotating special offers and promotions",
    industry: "Restaurant",
    thumbnail: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=225&fit=crop&auto=format",
    slideCount: 5,
    features: ["Chef Recommendations", "Seasonal Items", "Special Offers", "Rotating Content"],
    previewImages: [
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "6",
    name: "QR Code Ordering Display",
    description: "Interactive template with QR codes, contactless ordering, and digital menu integration",
    industry: "Restaurant",
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=225&fit=crop&auto=format",
    slideCount: 6,
    features: ["QR Code Integration", "Contactless Ordering", "Digital Menu", "Payment Options"],
    previewImages: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format"
    ]
  },

  // Corporate Templates
  {
    id: "7",
    name: "Office Welcome Display",
    description: "Professional visitor information, meeting room schedules, and company directory",
    industry: "Corporate",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=225&fit=crop&auto=format",
    slideCount: 7,
    features: ["Visitor Info", "Meeting Rooms", "Company Directory", "Building Map"],
    previewImages: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "8",
    name: "Company Metrics Dashboard",
    description: "Real-time KPIs, performance charts, and business achievements display",
    industry: "Corporate",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop&auto=format",
    slideCount: 12,
    features: ["Real-time KPIs", "Performance Charts", "Business Metrics", "Achievement Highlights"],
    previewImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "9",
    name: "Employee Recognition Wall",
    description: "Celebrating team achievements, employee of the month, and company milestones",
    industry: "Corporate",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop&auto=format",
    slideCount: 9,
    features: ["Employee Photos", "Achievements", "Milestones", "Team Recognition"],
    previewImages: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&auto=format"
    ]
  },

  // Healthcare Templates
  {
    id: "10",
    name: "Waiting Room Information",
    description: "Patient services, wait times, health tips, and facility information display",
    industry: "Healthcare",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=225&fit=crop&auto=format",
    slideCount: 10,
    features: ["Wait Times", "Health Tips", "Services Info", "Emergency Contacts"],
    previewImages: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "11",
    name: "Department Directory",
    description: "Wayfinding system with floor maps, department locations, and navigation assistance",
    industry: "Healthcare",
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop&auto=format",
    slideCount: 8,
    features: ["Floor Maps", "Department Locations", "Navigation", "Accessibility Info"],
    previewImages: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "12",
    name: "Health & Wellness Tips",
    description: "Rotating health information, wellness tips, and preventive care reminders",
    industry: "Healthcare",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop&auto=format",
    slideCount: 15,
    features: ["Health Tips", "Wellness Info", "Preventive Care", "Seasonal Health"],
    previewImages: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop&auto=format"
    ]
  },

  // Education Templates
  {
    id: "13",
    name: "Campus Event Calendar",
    description: "Academic schedules, campus events, announcements, and important dates",
    industry: "Education",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=225&fit=crop&auto=format",
    slideCount: 12,
    features: ["Event Calendar", "Academic Schedules", "Announcements", "Important Dates"],
    previewImages: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "14",
    name: "Library Information Display",
    description: "New books, study hours, research resources, and library services information",
    industry: "Education",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop&auto=format",
    slideCount: 8,
    features: ["New Books", "Study Hours", "Research Resources", "Library Services"],
    previewImages: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "15",
    name: "Cafeteria Menu Board",
    description: "Daily meals, nutrition information, dietary options, and meal schedules",
    industry: "Education",
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=225&fit=crop&auto=format",
    slideCount: 6,
    features: ["Daily Meals", "Nutrition Info", "Dietary Options", "Meal Schedules"],
    previewImages: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format"
    ]
  },

  // Fitness Templates
  {
    id: "16",
    name: "Class Schedule Display",
    description: "Fitness class times, instructors, room numbers, and class descriptions",
    industry: "Fitness",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop&auto=format",
    slideCount: 8,
    features: ["Class Times", "Instructors", "Room Numbers", "Class Descriptions"],
    previewImages: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "17",
    name: "Workout Motivation Screen",
    description: "Inspirational quotes, progress tracking, fitness tips, and member achievements",
    industry: "Fitness",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=225&fit=crop&auto=format",
    slideCount: 10,
    features: ["Motivational Quotes", "Progress Tracking", "Fitness Tips", "Member Achievements"],
    previewImages: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format"
    ]
  },
  {
    id: "18",
    name: "Membership Promotions",
    description: "Membership packages, benefits, special offers, and membership tier information",
    industry: "Fitness",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop&auto=format",
    slideCount: 7,
    features: ["Membership Packages", "Benefits", "Special Offers", "Tier Information"],
    previewImages: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop&auto=format"
    ]
  }
];

const industries = ["All Templates", "Retail", "Restaurant", "Healthcare", "Corporate", "Education", "Fitness"];

export default function TemplateSelectionModal({ open, onOpenChange }: TemplateSelectionModalProps) {
  const [currentStep, setCurrentStep] = useState<"browse" | "preview" | "configure" | "confirm">("browse");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState("All Templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [slideCount, setSlideCount] = useState([8]);
  const [contentRequirements, setContentRequirements] = useState("");
  const [hasSpecificAssets, setHasSpecificAssets] = useState(false);
  const [tone, setTone] = useState("Professional");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);

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
    setCurrentStep("preview");
  };

  const handleProceedWithTemplate = () => {
    setCurrentStep("configure");
  };

  const handleStartCreation = () => {
    setCurrentStep("confirm");
  };

  const handleBack = () => {
    if (currentStep === "preview") {
      setCurrentStep("browse");
    } else if (currentStep === "configure") {
      setCurrentStep("preview");
    }
  };

  const handleClose = () => {
    setCurrentStep("browse");
    setSelectedTemplate(null);
    setSearchQuery("");
    setSelectedIndustry("All Templates");
    setSlideCount([8]);
    setContentRequirements("");
    setHasSpecificAssets(false);
    setTone("Professional");
    setCurrentImageIndex(0);
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
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            {industries.map((industry) => (
              <TabsTrigger key={industry} value={industry} className="text-xs">
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
                  className="cursor-pointer transition-all duration-200 hover:shadow-xl border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden group h-full flex flex-col"
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
                    className="w-full h-full object-cover"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                <Timer className="h-4 w-4" />
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
            <Button onClick={handleProceedWithTemplate} className="w-full gap-2" size="lg">
              <Sparkles className="h-5 w-5" />
              Proceed with Template
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );


const [showAdvanced, setShowAdvanced] = useState(false);
const [language, setLanguage] = useState("English");
const [layoutOption, setLayoutOption] = useState("Auto")
const renderConfigureStep = () => {
  
    const formatSlidesLabel = (v: number | number[]) => `${Array.isArray(v) ? v[0] : v} slides`;
  
    return (
      <motion.div
        className="space-y-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header / Back */}
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
  
          <div>
            <h3 className="text-xl font-semibold">Customize Your Template with AI</h3>
            <p className="text-muted-foreground">
              Generate tailored slides from your template — fast. Use presets or fine-tune the settings below.
            </p>
          </div>
        </motion.div>
  
        {/* Main grid: Left = controls, Right = live summary & preview */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Controls (left, spans 2 cols on xl) */}
          <motion.div className="xl:col-span-2 space-y-6" variants={itemVariants}>
            {/* Quick Presets */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3"
            >
              <label className="text-base font-medium mb-1.5 block">Quick Presets</label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSlideCount([5]); setTone("Professional"); setLayoutOption("Auto"); }}
                >
                  Starter (5 slides)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSlideCount([10]); setTone("Casual"); setLayoutOption("Gallery"); }}
                >
                  Showcase (10 slides)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSlideCount([3]); setTone("Professional"); setLayoutOption("Focus"); }}
                >
                  Short (3 slides)
                </Button>
              </div>
            </motion.div>
  
            {/* Slide count with clearer UI */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-base font-medium mb-3 block">Number of Slides</label>
                <p className="text-sm text-muted-foreground">Recommended: 5–12 for best engagement</p>
              </div>
  
              <div className="space-y-1.5">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">1</div>
                    <div className="flex-1 px-4">
                      <Slider
                        value={slideCount}
                        onValueChange={setSlideCount}
                        max={20}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">20</div>
                  </div>
  
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-muted-foreground">Selected</div>
                    <div className="font-semibold text-primary text-base">{formatSlidesLabel(slideCount)}</div>
                  </div>
                </div>
  
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>💡 Keep content focused — avoid slide bloat</span>
                  <span className="italic">Est. read time: {Math.max(1, (Array.isArray(slideCount) ? slideCount[0] : slideCount)) * 6} sec / slide</span>
                </div>
              </div>
            </motion.div>
  
            {/* Content Requirements with suggestions chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <label className="text-base font-medium mb-2 block">Content Requirements</label>
              <div className="space-y-2">
                <Textarea
                  placeholder="Describe what content you want... e.g., 'Product showcase with pricing, mission, 3 team photos, contact' "
                  value={contentRequirements}
                  onChange={(e) => setContentRequirements(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
  
                {/* suggestion chips */}
                <div className="flex flex-wrap gap-2">
                  {["Product features", "Pricing", "Contact info", "Testimonials", "CTA"].map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const addition = contentRequirements ? `${contentRequirements.trim()} • ${s}` : s;
                        setContentRequirements(addition);
                      }}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
  
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    💡 Be specific — the AI performs better with explicit details (audience, goal, must-have text).
                  </p>
                  <span
                    className={`text-xs ${
                      contentRequirements.length > 400
                        ? "text-destructive"
                        : contentRequirements.length > 300
                        ? "text-yellow-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {contentRequirements.length}/500
                  </span>
                </div>
              </div>
            </motion.div>
  
            {/* Tone & Style + Language */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="text-base font-medium mb-2 block">Tone & Style</label>
                <Tabs value={tone} onValueChange={setTone}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="Professional" className="gap-1.5">
                      <Users className="h-4 w-4" />
                      Professional
                    </TabsTrigger>
                    <TabsTrigger value="Casual" className="gap-1.5">
                      <Heart className="h-4 w-4" />
                      Casual
                    </TabsTrigger>
                    <TabsTrigger value="Playful" className="gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      Playful
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
  
              <div>
                <label className="text-base font-medium mb-2 block">Language</label>
                <div className="flex gap-2">
                  <Button variant={language === "English" ? "default" : "ghost"} size="sm" onClick={() => setLanguage("English")}>English</Button>
                  <Button variant={language === "Hindi" ? "default" : "ghost"} size="sm" onClick={() => setLanguage("Hindi")}>हिन्दी</Button>
                  <Button variant={language === "Auto" ? "default" : "ghost"} size="sm" onClick={() => setLanguage("Auto")}>Auto-detect</Button>
                </div>
              </div>
            </motion.div>
  
            {/* Expandable Advanced Options */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.4 }}
              className="border rounded-xl p-3 bg-muted/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-base font-medium mb-0">Advanced Options</label>
                  <p className="text-xs text-muted-foreground">Optional controls for power users</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="ghost" onClick={() => setShowAdvanced((s) => !s)}>
                    {showAdvanced ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
  
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2"
                  >
                    <div className="col-span-1">
                      <label className="text-sm font-medium block mb-2">Layout Preference</label>
                      <div className="flex flex-col gap-2">
                        <Button variant={layoutOption === "Auto" ? "default" : "outline"} size="sm" onClick={() => setLayoutOption("Auto")}>Auto (recommended)</Button>
                        <Button variant={layoutOption === "Focus" ? "default" : "outline"} size="sm" onClick={() => setLayoutOption("Focus")}>Focus (single hero)</Button>
                        <Button variant={layoutOption === "Gallery" ? "default" : "outline"} size="sm" onClick={() => setLayoutOption("Gallery")}>Gallery (image-led)</Button>
                      </div>
                    </div>
  
                    <div>
                      <label className="text-sm font-medium block mb-2">Max words per slide</label>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => {/* decrement handler could be provided externally */}}>—</Button>
                        <Badge variant="outline">~20</Badge>
                        <Button size="sm" variant="ghost" onClick={() => {/* increment handler */}}>+</Button>
                      </div>
                    </div>
  
                    <div>
                      <label className="text-sm font-medium block mb-2">Include CTA button</label>
                      <div className="flex items-center gap-2">
                        <Checkbox id="cta" checked={true} onCheckedChange={() => { /* noop — hook into your form state if needed */ }} />
                        <label htmlFor="cta" className="text-sm">Yes — include CTA on last slide</label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
  
          {/* Right column: Assets uploader + template summary + live thumbnails */}
          <motion.div className="space-y-4" variants={itemVariants}>
            {/* Assets chooser */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.45 }}
            >
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="assets"
                  checked={hasSpecificAssets}
                  onCheckedChange={(checked) => setHasSpecificAssets(checked === true)}
                />
                <label htmlFor="assets" className="text-sm font-medium">
                  I have specific assets to include
                </label>
              </div>
  
              <AnimatePresence>
                {hasSpecificAssets && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-4 text-center bg-gradient-to-br from-muted/50 to-muted/20"
                  >
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload logos, hero images, or brand kits for better matching
                    </p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Choose Files
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
  
            {/* Template Summary card with small thumbnails */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.5 }}
              className="bg-gradient-to-br from-card to-card/50 rounded-xl p-4"
            >
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Template Summary
              </h4>
  
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Template</span>
                  <span className="font-medium">{selectedTemplate?.name}</span>
                </div>
  
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Slides</span>
                  <Badge variant="secondary">{Array.isArray(slideCount) ? slideCount[0] : slideCount}</Badge>
                </div>
  
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Style</span>
                  <Badge variant="outline">{tone}</Badge>
                </div>
  
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assets</span>
                  <Badge variant={hasSpecificAssets ? "default" : "secondary"}>{hasSpecificAssets ? "Yes" : "No"}</Badge>
                </div>
  
                <div className="pt-3">
                  <label className="text-xs text-muted-foreground">Preview thumbnails</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {/* lightweight placeholder thumbnails — in real app replace with generated previews */}
                    {Array.from({ length: Math.min(6, Array.isArray(slideCount) ? slideCount[0] : slideCount) }).map((_, i) => (
                      <div key={i} className="h-16 rounded-md bg-muted/30 flex items-center justify-center text-xs text-muted-foreground">
                        Slide {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
  
            {/* Generate CTA + small status hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.6 }}
            >
              <div className="space-y-2">
                <Button onClick={handleStartCreation} className="w-full gap-2" size="lg">
                  <Sparkles className="h-5 w-5" />
                  Start AI Creation
                </Button>
                <div className="text-xs text-muted-foreground mt-2">
                  The generation will create slides and a preview package. Typical turnaround: ~two minutes (depends on slide count).
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  };
  
  const renderConfirmStep = () => (
    <motion.div 
      className="text-center space-y-6 py-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.3,
          ease: "easeOut",
          delay: 0.2 
        }}
        className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg"
      >
        <CheckCircle className="h-10 w-10 text-green-600" />
      </motion.div>
      
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
          Template Creation Started!
        </h3>
        <p className="text-base text-muted-foreground">
          Your AI-powered template is being generated
        </p>
      </motion.div>

      <motion.div 
        className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-6 space-y-4 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 text-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="h-6 w-6 text-primary" />
          </motion.div>
          <span className="font-semibold">Estimated completion: 1 hour</span>
        </div>
        <p className="text-muted-foreground">
          You will be notified when it's ready. You can continue working on other projects in the meantime.
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>AI is crafting your personalized content...</span>
        </div>
      </motion.div>

      <motion.div 
        className="flex gap-3 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.8 }}
      >
        <Button variant="outline" onClick={handleClose} size="lg" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Media
        </Button>
        <Button onClick={handleClose} size="lg" className="gap-2">
          <Eye className="h-4 w-4" />
          View My Templates
        </Button>
      </motion.div>
    </motion.div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full h-screen max-h-screen overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold">
                {currentStep === "browse" && "Choose a Template"}
                {currentStep === "preview" && "Template Preview"}
                {currentStep === "configure" && "AI Configuration"}
                {currentStep === "confirm" && "Creation Started"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {currentStep === "browse" && "Select a template that fits your needs"}
                {currentStep === "preview" && "Review the template details and features"}
                {currentStep === "configure" && "Customize your template with AI assistance"}
                {currentStep === "confirm" && "Your template is being generated"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
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
            {currentStep === "configure" && (
              <motion.div
                key="configure"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderConfigureStep()}
              </motion.div>
            )}
            {currentStep === "confirm" && (
              <motion.div
                key="confirm"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderConfirmStep()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
