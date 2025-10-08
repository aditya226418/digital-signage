import { useState, useEffect, useRef } from "react";
import { Sparkles, Play, Monitor, CheckCircle2, AlertCircle, Loader2, X, Eye, Clock, Store, Utensils, Briefcase, Dumbbell, Hotel, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DashboardQuickPlayProps {
  onComplete?: () => void;
}

interface ContentTemplate {
  id: string;
  title: string;
  industry: string;
  duration: string;
  type: "image" | "video";
  thumbnail: string;
  description: string;
}

interface Screen {
  id: string;
  name: string;
  type: "physical" | "webplayer";
  status: "online" | "offline";
}

// Industry categories with icons
const industryCategories = [
  { id: "Retail", name: "Retail", icon: Store },
  { id: "Restaurant", name: "Restaurant", icon: Utensils },
  { id: "Corporate", name: "Corporate", icon: Briefcase },
  { id: "Health & Fitness", name: "Health & Fitness", icon: Dumbbell },
  { id: "Hospitality", name: "Hospitality", icon: Hotel },
  { id: "Real Estate", name: "Real Estate", icon: Home },
];

// Mock data for content templates - grouped by industry
const templates: ContentTemplate[] = [
  {
    id: "1",
    title: "Retail Promo",
    industry: "Retail",
    duration: "30s",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=225&fit=crop",
    description: "Eye-catching promotional content perfect for retail stores showcasing sales and special offers.",
  },
  {
    id: "7",
    title: "Product Showcase",
    industry: "Retail",
    duration: "45s",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=225&fit=crop",
    description: "Highlight your best products with stunning visuals and pricing.",
  },
  {
    id: "2",
    title: "Restaurant Menu Loop",
    industry: "Restaurant",
    duration: "1m",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=225&fit=crop",
    description: "Delicious food imagery with menu highlights and daily specials.",
  },
  {
    id: "8",
    title: "Daily Specials",
    industry: "Restaurant",
    duration: "30s",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=225&fit=crop",
    description: "Showcase today's special dishes and drinks with mouthwatering photos.",
  },
  {
    id: "3",
    title: "Corporate Announcements",
    industry: "Corporate",
    duration: "45s",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400&h=225&fit=crop",
    description: "Professional templates for company news, updates, and internal communications.",
  },
  {
    id: "9",
    title: "Team Updates",
    industry: "Corporate",
    duration: "1m",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=225&fit=crop",
    description: "Keep your team informed with company achievements and updates.",
  },
  {
    id: "4",
    title: "Fitness Schedule",
    industry: "Health & Fitness",
    duration: "30s",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=225&fit=crop",
    description: "Display class schedules, trainer information, and motivational content.",
  },
  {
    id: "10",
    title: "Workout Tips",
    industry: "Health & Fitness",
    duration: "45s",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop",
    description: "Motivational content with exercise tips and fitness challenges.",
  },
  {
    id: "5",
    title: "Hotel Welcome Board",
    industry: "Hospitality",
    duration: "1m",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=225&fit=crop",
    description: "Welcome guests with event schedules, amenities, and local attractions.",
  },
  {
    id: "11",
    title: "Event Calendar",
    industry: "Hospitality",
    duration: "30s",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=400&h=225&fit=crop",
    description: "Display upcoming events, conferences, and special occasions.",
  },
  {
    id: "6",
    title: "Real Estate Showcase",
    industry: "Real Estate",
    duration: "45s",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop",
    description: "Property listings with stunning visuals and key details.",
  },
  {
    id: "12",
    title: "Property Highlights",
    industry: "Real Estate",
    duration: "1m",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=225&fit=crop",
    description: "Feature your best properties with virtual tours and amenities.",
  },
];

// Simulate AI content generation
const simulateAIGeneration = async (prompt: string): Promise<ContentTemplate[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) {
        resolve([
          {
            id: "ai1",
            title: "AI Variant 1",
            industry: "AI Generated",
            duration: "30s",
            type: "image",
            thumbnail: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=225&fit=crop",
            description: `Generated based on: "${prompt.substring(0, 50)}..."`,
          },
          {
            id: "ai2",
            title: "AI Variant 2",
            industry: "AI Generated",
            duration: "45s",
            type: "video",
            thumbnail: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=225&fit=crop",
            description: `Generated based on: "${prompt.substring(0, 50)}..."`,
          },
          {
            id: "ai3",
            title: "AI Variant 3",
            industry: "AI Generated",
            duration: "1m",
            type: "image",
            thumbnail: "https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?w=400&h=225&fit=crop",
            description: `Generated based on: "${prompt.substring(0, 50)}..."`,
          },
        ]);
      } else {
        reject(new Error("AI generation failed"));
      }
    }, 2000);
  });
};

export default function DashboardQuickPlay({ onComplete }: DashboardQuickPlayProps) {
  const { toast } = useToast();

  // State management
  const [selectedContent, setSelectedContent] = useState<ContentTemplate | null>(null);
  const [addedScreen, setAddedScreen] = useState<Screen | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");

  // AI Generation state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiVariants, setAiVariants] = useState<ContentTemplate[]>([]);

  // Modal states
  const [showAddScreenModal, setShowAddScreenModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState<ContentTemplate | null>(null);
  const [showPlaybackModal, setShowPlaybackModal] = useState(false);

  // Add screen form
  const [registrationCode, setRegistrationCode] = useState("");
  const [codeError, setCodeError] = useState("");

  // QuickPlay state
  const [quickPlayDuration, setQuickPlayDuration] = useState("10");
  const [customDuration, setCustomDuration] = useState("10");
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Refs for auto-scrolling
  const addScreenRef = useRef<HTMLDivElement>(null);
  const quickPlayRef = useRef<HTMLDivElement>(null);

  // Helper functions
  const isStepComplete = (step: number) => completedSteps.includes(step);

  // Auto-scroll to next section when step completes
  useEffect(() => {
    if (isStepComplete(1) && !isStepComplete(2) && addScreenRef.current) {
      setTimeout(() => {
        addScreenRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [completedSteps]);

  useEffect(() => {
    if (isStepComplete(2) && !isStepComplete(3) && quickPlayRef.current) {
      setTimeout(() => {
        quickPlayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [completedSteps]);

  // Get filtered templates
  const filteredTemplates = selectedIndustry === "all" 
    ? templates 
    : templates.filter(t => t.industry === selectedIndustry);

  // Group templates by industry
  const templatesByIndustry = templates.reduce((acc, template) => {
    if (!acc[template.industry]) {
      acc[template.industry] = [];
    }
    acc[template.industry].push(template);
    return acc;
  }, {} as Record<string, ContentTemplate[]>);

  // Handle content selection
  const handleSelectContent = (content: ContentTemplate) => {
    setSelectedContent(content);
    if (!isStepComplete(1)) {
      setCompletedSteps([...completedSteps, 1]);
      toast({
        title: "✓ Content selected",
        description: "Next, add a screen to preview it live.",
        duration: 3000,
      });
    }
  };

  // Handle preview
  const handlePreview = (content: ContentTemplate) => {
    setPreviewContent(content);
    setShowPreviewModal(true);
  };

  // Handle AI generation
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setAiError("Please enter a prompt");
      return;
    }

    setAiGenerating(true);
    setAiError("");
    setAiVariants([]);

    try {
      const variants = await simulateAIGeneration(aiPrompt);
      setAiVariants(variants);
      toast({
        title: "✨ Content generated",
        description: "3 AI variants created. Select one to continue.",
        duration: 3000,
      });
    } catch (error) {
      setAiError("AI generation failed. Try again.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Handle add screen
  const handleAddScreen = () => {
    if (registrationCode.length !== 6) {
      setCodeError("Please enter a 6-digit code");
      return;
    }

    if (registrationCode !== "123456") {
      setCodeError("Invalid code. Double-check the number shown on your display.");
      return;
    }

    const newScreen: Screen = {
      id: `screen-${Date.now()}`,
      name: `Screen ${registrationCode}`,
      type: "physical",
      status: "online",
    };

    setAddedScreen(newScreen);
    if (!isStepComplete(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    setShowAddScreenModal(false);
    setRegistrationCode("");
    setCodeError("");

    toast({
      title: "Screen added — ready to QuickPlay.",
      description: `${newScreen.name} is now connected.`,
      duration: 3000,
    });
  };

  // Handle webplayer
  const handleUseWebplayer = () => {
    const webplayerScreen: Screen = {
      id: "webplayer-temp-1",
      name: "Webplayer (Test)",
      type: "webplayer",
      status: "online",
    };

    setAddedScreen(webplayerScreen);
    if (!isStepComplete(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    setShowAddScreenModal(false);

    toast({
      title: "Screen added — ready to QuickPlay.",
      description: "Webplayer test screen created.",
      duration: 3000,
    });
  };

  // Handle QuickPlay
  const handleQuickPlay = () => {
    const duration = quickPlayDuration === "custom" 
      ? parseInt(customDuration) 
      : parseInt(quickPlayDuration);

    if (isNaN(duration) || duration < 1 || duration > 240) {
      toast({
        title: "Invalid duration",
        description: "Duration must be between 1 and 240 minutes.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setRemainingTime(duration * 60); // Convert to seconds
    setIsPlaying(true);
    setShowPlaybackModal(true);

    // Simulate countdown
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleStopPlayback();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle stop playback
  const handleStopPlayback = () => {
    setIsPlaying(false);
    setShowPlaybackModal(false);
    if (!isStepComplete(3)) {
      setCompletedSteps([...completedSteps, 3]);
    }
    toast({
      title: "QuickPlay ended.",
      description: "Your content playback has finished.",
      duration: 3000,
    });
  };

  // Handle extend playback
  const handleExtendPlayback = () => {
    setRemainingTime((prev) => prev + 600); // Add 10 minutes
    toast({
      title: "Extended +10 minutes",
      description: "Playback time extended.",
      duration: 2000,
    });
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Compact Header with Welcome and Progress */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Welcome to Pickcel 👋</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {!isStepComplete(1) && "Start by picking content you'd like to see on your screen."}
            {isStepComplete(1) && !isStepComplete(2) && "Great! Now add a screen to preview your content."}
            {isStepComplete(2) && !isStepComplete(3) && "Almost there! Start QuickPlay to see your content live."}
            {isStepComplete(3) && "🎉 All done! Your content is playing."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all",
                isStepComplete(step)
                  ? "bg-green-500 text-white"
                  : step === completedSteps.length + 1
                  ? "border-2 border-primary bg-primary/10 text-primary"
                  : "border-2 border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {isStepComplete(step) ? <CheckCircle2 className="h-4 w-4" /> : step}
            </div>
          ))}
        </div>
      </div>

      {/* Content Selection Area */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Step 1: Select Your Content</CardTitle>
              <CardDescription>Choose from ready-made templates or generate with AI</CardDescription>
            </div>
            {selectedContent && (
              <Badge variant="default" className="w-fit gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Selected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Industry Categories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedIndustry === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedIndustry("all")}
            >
              All Industries
            </Button>
            {industryCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedIndustry === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedIndustry(category.id)}
                  className="gap-1.5"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Template Gallery - Categorized */}
          {selectedIndustry === "all" ? (
            // Show by categories
            <div className="space-y-4">
              {industryCategories.map((category) => {
                const categoryTemplates = templatesByIndustry[category.id] || [];
                if (categoryTemplates.length === 0) return null;
                const Icon = category.icon;
                return (
                  <div key={category.id} className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      {category.name}
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {categoryTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className={cn(
                            "transition-all hover:shadow-md cursor-pointer",
                            selectedContent?.id === template.id && "border-primary ring-2 ring-primary"
                          )}
                          onClick={() => handleSelectContent(template)}
                        >
                          <CardContent className="p-0">
                            <div className="flex gap-3 p-3">
                              <div className="h-20 w-32 shrink-0 overflow-hidden rounded bg-muted">
                                <img
                                  src={template.thumbnail}
                                  alt={template.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex min-w-0 flex-1 flex-col justify-between">
                                <div>
                                  <h5 className="font-medium leading-tight">{template.title}</h5>
                                  <p className="mt-1 text-xs text-muted-foreground">{template.duration}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePreview(template);
                                    }}
                                  >
                                    <Eye className="mr-1 h-3 w-3" />
                                    Preview
                                  </Button>
                                  {selectedContent?.id === template.id && (
                                    <Badge variant="secondary" className="h-7 gap-1 text-xs">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Selected
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Show filtered templates
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "transition-all hover:shadow-md cursor-pointer",
                    selectedContent?.id === template.id && "border-primary ring-2 ring-primary"
                  )}
                  onClick={() => handleSelectContent(template)}
                >
                  <CardContent className="p-0">
                    <div className="flex gap-3 p-3">
                      <div className="h-20 w-32 shrink-0 overflow-hidden rounded bg-muted">
                        <img
                          src={template.thumbnail}
                          alt={template.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <h5 className="font-medium leading-tight">{template.title}</h5>
                          <p className="mt-1 text-xs text-muted-foreground">{template.duration}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(template);
                            }}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Preview
                          </Button>
                          {selectedContent?.id === template.id && (
                            <Badge variant="secondary" className="h-7 gap-1 text-xs">
                              <CheckCircle2 className="h-3 w-3" />
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* AI Generation Panel */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              Or generate content with AI
            </h4>
            <div className="flex gap-2">
              <Textarea
                id="ai-prompt"
                placeholder="e.g., Weekend 20% off on pizzas — show vibrant food images and menu highlights"
                value={aiPrompt}
                onChange={(e) => {
                  setAiPrompt(e.target.value);
                  setAiError("");
                }}
                rows={2}
                className="resize-none text-sm"
              />
              <Button
                onClick={handleAIGenerate}
                disabled={aiGenerating || !aiPrompt.trim()}
                size="sm"
                className="shrink-0"
              >
                {aiGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
            </div>
            {aiError && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {aiError}
              </p>
            )}

            {/* AI Variants - compact */}
            {aiVariants.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium">AI Generated Variants</p>
                <div className="grid grid-cols-1 gap-2">
                  {aiVariants.map((variant) => (
                    <Card
                      key={variant.id}
                      className={cn(
                        "transition-all hover:shadow-md cursor-pointer",
                        selectedContent?.id === variant.id && "border-primary ring-2 ring-primary"
                      )}
                      onClick={() => handleSelectContent(variant)}
                    >
                      <CardContent className="p-0">
                        <div className="flex gap-2 p-2">
                          <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-muted">
                            <img
                              src={variant.thumbnail}
                              alt={variant.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 items-center justify-between">
                            <div>
                              <h5 className="text-sm font-medium">{variant.title}</h5>
                              <p className="text-xs text-muted-foreground">{variant.duration}</p>
                            </div>
                            {selectedContent?.id === variant.id && (
                              <Badge variant="secondary" className="h-6 gap-1 text-xs">
                                <CheckCircle2 className="h-3 w-3" />
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Screen Step - Auto revealed after content selection */}
      {isStepComplete(1) && (
        <Card ref={addScreenRef} className="scroll-mt-20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Monitor className="h-5 w-5" />
                  Step 2: Add a Screen
                </CardTitle>
                <CardDescription>Add your display or use our Webplayer to preview instantly</CardDescription>
              </div>
              {isStepComplete(2) && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Added
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isStepComplete(2) ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAddScreenModal(true)}
                  size="default"
                  className="flex-1 sm:flex-none"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  Add Screen
                </Button>
                <Button
                  onClick={() => setShowAddScreenModal(true)}
                  variant="outline"
                  size="default"
                >
                  View Instructions
                </Button>
              </div>
            ) : (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-sm">
                    {addedScreen?.name} ({addedScreen?.type}) — {addedScreen?.status}
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* QuickPlay Section - Auto revealed after screen added */}
      {isStepComplete(2) && (
        <Card ref={quickPlayRef} className="scroll-mt-20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Play className="h-5 w-5" />
                  Step 3: QuickPlay Your Content
                </CardTitle>
                <CardDescription>Try your selected content live for a short duration</CardDescription>
              </div>
              {isStepComplete(3) && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Playing
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="duration" className="text-sm">Duration</Label>
                <div className="flex gap-2">
                  <Button
                    variant={quickPlayDuration === "10" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickPlayDuration("10")}
                  >
                    10 min
                  </Button>
                  <Button
                    variant={quickPlayDuration === "30" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickPlayDuration("30")}
                  >
                    30 min
                  </Button>
                  <Button
                    variant={quickPlayDuration === "60" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQuickPlayDuration("60")}
                  >
                    1 hour
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max="240"
                    value={customDuration}
                    onChange={(e) => {
                      setCustomDuration(e.target.value);
                      setQuickPlayDuration("custom");
                    }}
                    className="w-20 text-sm"
                    placeholder="Custom"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleQuickPlay}
                disabled={!selectedContent || !addedScreen || isPlaying}
              >
                <Play className="mr-2 h-4 w-4" />
                Start QuickPlay
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPlaybackModal(true)}
                disabled={!selectedContent || !addedScreen}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview First
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {completedSteps.length === 3 && (
        <Alert className="border-green-500 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription>
            <p className="font-medium">🎉 All steps completed!</p>
            <p className="mt-1 text-sm">
              You've successfully set up your first QuickPlay session.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Add Screen Modal */}
      <Dialog open={showAddScreenModal} onOpenChange={setShowAddScreenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Your First Screen</DialogTitle>
            <DialogDescription>
              Connect a display or use the webplayer for instant testing
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">Registration Code</TabsTrigger>
              <TabsTrigger value="webplayer">Webplayer</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-code">Enter 6-digit code</Label>
                <Input
                  id="reg-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={registrationCode}
                  onChange={(e) => {
                    setRegistrationCode(e.target.value.replace(/\D/g, ""));
                    setCodeError("");
                  }}
                  className={cn(codeError && "border-destructive")}
                  autoFocus
                />
                {codeError && (
                  <p className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {codeError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  The 6-digit code is displayed on your screen device. Use "123456" for testing.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddScreenModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddScreen}>Add Screen</Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="webplayer" className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Instantly create a test screen that runs in your browser. Perfect for trying out
                  content before deploying to physical displays.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddScreenModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUseWebplayer}>
                  <Monitor className="mr-2 h-4 w-4" />
                  Use Webplayer (Quick Test)
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewContent?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Badge variant="secondary">{previewContent?.industry}</Badge>
              <span>•</span>
              <span>{previewContent?.duration}</span>
              <span>•</span>
              <span className="capitalize">{previewContent?.type}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src={previewContent?.thumbnail}
                alt={previewContent?.title}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground">{previewContent?.description}</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (previewContent) {
                  handleSelectContent(previewContent);
                  setShowPreviewModal(false);
                }
              }}
            >
              Select This Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Playback Simulator Modal */}
      <Dialog open={showPlaybackModal} onOpenChange={setShowPlaybackModal}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>QuickPlay Preview</span>
              {isPlaying && (
                <Badge variant="destructive" className="gap-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  LIVE
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {isPlaying ? `Time remaining: ${formatTime(remainingTime)}` : "Preview simulation"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 16:9 Preview Box */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
              {selectedContent && (
                <img
                  src={selectedContent.thumbnail}
                  alt={selectedContent.title}
                  className="h-full w-full object-cover"
                />
              )}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="rounded-full bg-black/50 p-8 backdrop-blur">
                    <Clock className="h-12 w-12 text-white" />
                  </div>
                </div>
              )}
              {isPlaying && (
                <div className="absolute bottom-4 right-4 rounded-lg bg-black/70 px-4 py-2 font-mono text-2xl text-white">
                  {formatTime(remainingTime)}
                </div>
              )}
            </div>

            {selectedContent && (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <img
                  src={selectedContent.thumbnail}
                  alt={selectedContent.title}
                  className="h-16 w-24 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{selectedContent.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Playing on {addedScreen?.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {isPlaying ? (
              <>
                <Button variant="outline" onClick={handleExtendPlayback}>
                  <Clock className="mr-2 h-4 w-4" />
                  Extend +10m
                </Button>
                <Button variant="destructive" onClick={handleStopPlayback}>
                  <X className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowPlaybackModal(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Aria-live region for announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isStepComplete(1) && "Content selected"}
        {isStepComplete(2) && "Screen added"}
        {isStepComplete(3) && "QuickPlay ended"}
      </div>
    </div>
  );
}

