import { useState } from "react";
import { Monitor, Upload, Rocket, CheckCircle2, AlertCircle, Play, HelpCircle, Clock, LayoutGrid, LayoutList, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import MediaPickerModal from "./MediaPickerModal";
import UpgradeBanner from "./UpgradeBanner";

interface OnboardingQuickStartProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

type Step = 1 | 2 | 3 | 4;

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface Screen {
  id: string;
  name: string;
}

export default function OnboardingQuickStart({ onComplete, onSkip }: OnboardingQuickStartProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  
  // Modal states
  const [showAddScreenModal, setShowAddScreenModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCompositionModal, setShowCompositionModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Form states
  const [registrationCode, setRegistrationCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [addedScreens, setAddedScreens] = useState<Screen[]>([]);
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [publishSchedule, setPublishSchedule] = useState("now");
  const [showUndoPublish, setShowUndoPublish] = useState(false);

  const progress = (completedSteps.length / 4) * 100;

  const isStepComplete = (step: Step) => completedSteps.includes(step);
  const canAccessStep = (step: Step) => {
    if (step === 1) return true;
    if (step === 2) return isStepComplete(1);
    if (step === 3) return isStepComplete(2);
    if (step === 4) return isStepComplete(3);
    return false;
  };

  // Handle Add Screen
  const handleAddScreen = () => {
    if (registrationCode.length !== 6) {
      setCodeError("Please enter a 6-digit code");
      return;
    }
    
    // Mock validation
    if (registrationCode === "000000") {
      setCodeError("Invalid code. Double-check the 6-digit code shown on your display.");
      return;
    }

    // Success
    const newScreen = {
      id: `screen-${Date.now()}`,
      name: `Screen ${registrationCode}`
    };
    setAddedScreens([...addedScreens, newScreen]);
    setCompletedSteps([...completedSteps, 1]);
    setCurrentStep(2);
    setShowAddScreenModal(false);
    setRegistrationCode("");
    setCodeError("");
    
    toast({
      title: "Screen added ✓",
      description: "Ready to upload media.",
      duration: 3000,
    });
  };

  const handleCreateWebplayer = () => {
    const webplayerScreen = {
      id: `webplayer-${Date.now()}`,
      name: "Browser Webplayer"
    };
    setAddedScreens([...addedScreens, webplayerScreen]);
    setCompletedSteps([...completedSteps, 1]);
    setCurrentStep(2);
    setShowAddScreenModal(false);
    
    toast({
      title: "Webplayer created ✓",
      description: "Ready to upload media. Open webplayer in new tab.",
      duration: 3000,
    });
  };

  // Handle Upload Media
  const handleMediaAdded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setCompletedSteps([...completedSteps, 2]);
    setCurrentStep(3);
    setShowUploadModal(false);
  };

  const handleTemplateSelected = () => {
    setCompletedSteps([...completedSteps, 2]);
    setCurrentStep(3);
    setShowUploadModal(false);
  };

  // Handle Composition
  const handleAddComposition = () => {
    setCompletedSteps([...completedSteps, 3]);
    setCurrentStep(4);
    setShowCompositionModal(false);
    toast({
      title: "Composition created ✓",
      description: "Layout + playlist combined. Ready to publish.",
      duration: 3000,
    });
  };

  // Handle Publish
  const handlePublish = () => {
    if (selectedScreens.length === 0) {
      toast({
        title: "No screen selected",
        description: "Please select at least one screen to publish to.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setCompletedSteps([...completedSteps, 4]);
    setShowPublishModal(false);
    setShowSuccessModal(true);
    setShowUndoPublish(true);
    
    // Hide undo after 30 seconds
    setTimeout(() => {
      setShowUndoPublish(false);
    }, 30000);
  };

  const handleUndoPublish = () => {
    setCompletedSteps(completedSteps.filter(s => s !== 4));
    setCurrentStep(4);
    setShowUndoPublish(false);
    setShowSuccessModal(false);
    
    toast({
      title: "Publish undone",
      description: "You can publish again when ready.",
      duration: 3000,
    });
  };

  const handleCompleteOnboarding = () => {
    setShowSuccessModal(false);
    onComplete?.();
  };

  return (
    <TooltipProvider>
      <UpgradeBanner onUpgradeClick={() => {}} />
      <Card className="mx-auto max-w-6xl shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Welcome, <span className="text-primary font-bold">Brian</span>! 👋
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <CardDescription>
                    Deploy your first screen in 4 simple steps
                  </CardDescription>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 ring-1 ring-primary/20">
                    <Clock className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">~ 4 min</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}
                    className="gap-2"
                  >
                    {orientation === "horizontal" ? (
                      <><LayoutList className="h-4 w-4" /> Vertical</>
                    ) : (
                      <><LayoutGrid className="h-4 w-4" /> Horizontal</>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to {orientation === "horizontal" ? "vertical" : "horizontal"} layout</p>
                </TooltipContent>
              </Tooltip>
              <Badge variant="outline">
                Step {currentStep} of 4
              </Badge>
            </div>
          </div>

          {/* Video Tutorial Section */}
          <div className="relative group cursor-pointer rounded-md overflow-hidden border border-border bg-muted/30 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-3 p-3">
              {/* Video Thumbnail */}
              <div className="relative shrink-0">
                <div className="w-20 h-12 rounded bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center border border-primary/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="h-3.5 w-3.5 text-primary-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded text-center leading-none">
                  2:30
                </div>
              </div>
              
              {/* Video Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Video className="h-3.5 w-3.5 text-primary shrink-0" />
                  <h4 className="font-semibold text-xs">Quick Start Guide</h4>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1">New</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Watch how to set up your first screen in under 4 minutes
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className={cn(
            "space-y-2",
            orientation === "vertical" && "max-w-4xl mx-auto"
          )}>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {completedSteps.length === 0 && "Get started by adding your first screen"}
              {completedSteps.length === 1 && "Step 1 complete · 1 of 4"}
              {completedSteps.length === 2 && "Step 2 complete · 2 of 4"}
              {completedSteps.length === 3 && "Step 3 complete · 3 of 4"}
              {completedSteps.length === 4 && "All done! 4 of 4"}
            </p>
          </div>

          {/* Step Cards - Horizontal Layout */}
          {orientation === "horizontal" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Step 1 */}
              <Card className={cn(
                "relative transition-all",
                isStepComplete(1) && "border-green-500/50 bg-green-500/5",
                currentStep === 1 && !isStepComplete(1) && "border-primary shadow-md"
              )}>
                {isStepComplete(1) && (
                  <div className="absolute -right-2 -top-2">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Monitor className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">1. Add a Screen</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Connect a physical screen with a 6-digit code or use a browser webplayer to test instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => setShowAddScreenModal(true)}
                    className="w-full"
                    disabled={isStepComplete(1)}
                  >
                    {isStepComplete(1) ? "Screen Added ✓" : "+ Add Screen"}
                  </Button>
                  {/* <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => setShowHelpModal(true)}
                  >
                    Show me how to find the 6-digit code
                  </Button> */}
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className={cn(
                "relative transition-all",
                isStepComplete(2) && "border-green-500/50 bg-green-500/5",
                currentStep === 2 && !isStepComplete(2) && "border-primary shadow-md",
                !canAccessStep(2) && "opacity-60"
              )}>
                {isStepComplete(2) && (
                  <div className="absolute -right-2 -top-2">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">2. Add Media</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Upload images, videos, or pick a ready-made template to create your first playlist.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => setShowUploadModal(true)}
                    className="w-full"
                    variant={canAccessStep(2) ? "default" : "secondary"}
                    disabled={!canAccessStep(2) || isStepComplete(2)}
                    title={!canAccessStep(2) ? "Add a screen first" : ""}
                  >
                    {isStepComplete(2) ? "Media Uploaded ✓" : "Upload Media"}
                  </Button>
                  {/* <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-auto p-0 text-xs"
                    disabled={!canAccessStep(2)}
                  >
                    Browse template gallery
                  </Button> */}
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className={cn(
                "relative transition-all",
                isStepComplete(3) && "border-green-500/50 bg-green-500/5",
                currentStep === 3 && !isStepComplete(3) && "border-primary shadow-md",
                !canAccessStep(3) && "opacity-60"
              )}>
                {isStepComplete(3) && (
                  <div className="absolute -right-2 -top-2">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">3. Add Composition</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    A composition combines a layout (zones) with your playlist to define what plays where. 
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={() => setShowCompositionModal(true)}
                    className="w-full"
                    variant={canAccessStep(3) ? "default" : "secondary"}
                    disabled={!canAccessStep(3) || isStepComplete(3)}
                    title={!canAccessStep(3) ? "Upload media first" : ""}
                  >
                    {isStepComplete(3) ? "Composition Added ✓" : "Add Composition"}
                  </Button>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className={cn(
                "relative transition-all",
                isStepComplete(4) && "border-green-500/50 bg-green-500/5",
                currentStep === 4 && !isStepComplete(4) && "border-primary shadow-md",
                !canAccessStep(4) && "opacity-60"
              )}>
                {isStepComplete(4) && (
                  <div className="absolute -right-2 -top-2">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Rocket className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">4. Publish</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    Assign the playlist to your screen and publish. You can always change it later.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setShowPublishModal(true)}
                    className="w-full"
                    variant={canAccessStep(4) ? "default" : "secondary"}
                    disabled={!canAccessStep(4) || isStepComplete(4)}
                    title={!canAccessStep(4) ? "Add a composition to publish" : ""}
                  >
                    {isStepComplete(4) ? "Published ✓" : "Publish Now"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step Cards - Vertical Layout */}
          {orientation === "vertical" && (
            <div className="space-y-1.5 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex gap-3">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all z-10",
                      isStepComplete(1) ? "bg-green-500" : currentStep === 1 ? "bg-primary ring-4 ring-primary/20" : "bg-muted"
                    )}>
                      {isStepComplete(1) ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <Monitor className={cn("h-4 w-4", currentStep === 1 ? "text-primary-foreground" : "text-muted-foreground")} />
                      )}
                    </div>
                    <div className="w-0.5 h-full bg-border mt-1 absolute top-9" />
                  </div>
                  
                  {/* Content */}
                  <Card className={cn(
                    "flex-1 transition-all",
                    isStepComplete(1) && "border-green-500/50 bg-green-500/5",
                    currentStep === 1 && !isStepComplete(1) && "border-primary shadow-md"
                  )}>
                    <div className="flex items-center gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <CardTitle className="text-sm font-semibold">1. Add a Screen</CardTitle>
                          {isStepComplete(1) && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30 text-xs px-1.5 py-0">
                              Done
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs leading-relaxed">
                          Connect with a 6-digit code or use a browser webplayer.
                        </CardDescription>
                      </div>
                      <div className="shrink-0">
                        <Button 
                          onClick={() => setShowAddScreenModal(true)}
                          size="sm"
                          disabled={isStepComplete(1)}
                          className="whitespace-nowrap h-8 px-3"
                        >
                          {isStepComplete(1) ? "Added ✓" : "+ Add Screen"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex gap-3">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all z-10",
                      isStepComplete(2) ? "bg-green-500" : currentStep === 2 ? "bg-primary ring-4 ring-primary/20" : "bg-muted",
                      !canAccessStep(2) && "opacity-50"
                    )}>
                      {isStepComplete(2) ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <Upload className={cn("h-4 w-4", currentStep === 2 ? "text-primary-foreground" : "text-muted-foreground")} />
                      )}
                    </div>
                    <div className="w-0.5 h-full bg-border mt-1 absolute top-9" />
                  </div>
                  
                  {/* Content */}
                  <Card className={cn(
                    "flex-1 transition-all",
                    isStepComplete(2) && "border-green-500/50 bg-green-500/5",
                    currentStep === 2 && !isStepComplete(2) && "border-primary shadow-md",
                    !canAccessStep(2) && "opacity-60"
                  )}>
                    <div className="flex items-center gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <CardTitle className="text-sm font-semibold">2. Add Media</CardTitle>
                          {isStepComplete(2) && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30 text-xs px-1.5 py-0">
                              Done
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs leading-relaxed">
                          Upload images, videos, or pick a ready-made template.
                        </CardDescription>
                      </div>
                      <div className="shrink-0">
                        <Button 
                          onClick={() => setShowUploadModal(true)}
                          size="sm"
                          variant={canAccessStep(2) ? "default" : "secondary"}
                          disabled={!canAccessStep(2) || isStepComplete(2)}
                          title={!canAccessStep(2) ? "Add a screen first" : ""}
                          className="whitespace-nowrap h-8 px-3"
                        >
                          {isStepComplete(2) ? "Uploaded ✓" : "Upload Media"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex gap-3">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all z-10",
                      isStepComplete(3) ? "bg-green-500" : currentStep === 3 ? "bg-primary ring-4 ring-primary/20" : "bg-muted",
                      !canAccessStep(3) && "opacity-50"
                    )}>
                      {isStepComplete(3) ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <Play className={cn("h-4 w-4", currentStep === 3 ? "text-primary-foreground" : "text-muted-foreground")} />
                      )}
                    </div>
                    <div className="w-0.5 h-full bg-border mt-1 absolute top-9" />
                  </div>
                  
                  {/* Content */}
                  <Card className={cn(
                    "flex-1 transition-all",
                    isStepComplete(3) && "border-green-500/50 bg-green-500/5",
                    currentStep === 3 && !isStepComplete(3) && "border-primary shadow-md",
                    !canAccessStep(3) && "opacity-60"
                  )}>
                    <div className="flex items-center gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <CardTitle className="text-sm font-semibold">3. Add Composition</CardTitle>
                          {isStepComplete(3) && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30 text-xs px-1.5 py-0">
                              Done
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs leading-relaxed">
                          Combine layout and playlist to define what plays where.
                        </CardDescription>
                      </div>
                      <div className="shrink-0">
                        <Button 
                          onClick={() => setShowCompositionModal(true)}
                          size="sm"
                          variant={canAccessStep(3) ? "default" : "secondary"}
                          disabled={!canAccessStep(3) || isStepComplete(3)}
                          title={!canAccessStep(3) ? "Upload media first" : ""}
                          className="whitespace-nowrap h-8 px-3"
                        >
                          {isStepComplete(3) ? "Added ✓" : "Add Composition"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex gap-3">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all z-10",
                      isStepComplete(4) ? "bg-green-500" : currentStep === 4 ? "bg-primary ring-4 ring-primary/20" : "bg-muted",
                      !canAccessStep(4) && "opacity-50"
                    )}>
                      {isStepComplete(4) ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <Rocket className={cn("h-4 w-4", currentStep === 4 ? "text-primary-foreground" : "text-muted-foreground")} />
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <Card className={cn(
                    "flex-1 transition-all",
                    isStepComplete(4) && "border-green-500/50 bg-green-500/5",
                    currentStep === 4 && !isStepComplete(4) && "border-primary shadow-md",
                    !canAccessStep(4) && "opacity-60"
                  )}>
                    <div className="flex items-center gap-3 p-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <CardTitle className="text-sm font-semibold">4. Publish</CardTitle>
                          {isStepComplete(4) && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30 text-xs px-1.5 py-0">
                              Done
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs leading-relaxed">
                          Assign playlist to your screen and go live instantly.
                        </CardDescription>
                      </div>
                      <div className="shrink-0">
                        <Button 
                          onClick={() => setShowPublishModal(true)}
                          size="sm"
                          variant={canAccessStep(4) ? "default" : "secondary"}
                          disabled={!canAccessStep(4) || isStepComplete(4)}
                          title={!canAccessStep(4) ? "Add a composition to publish" : ""}
                          className="whitespace-nowrap h-8 px-3"
                        >
                          {isStepComplete(4) ? "Published ✓" : "Publish Now"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          <div className={cn(orientation === "vertical" && "max-w-4xl mx-auto")}>
            <Separator />
          </div>

          {/* Primary Action Area */}
          {/* <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="w-full gap-2 sm:w-auto"
              onClick={() => setShowAddScreenModal(true)}
              disabled={isStepComplete(1)}
            >
              <Play className="h-5 w-5" />
              {isStepComplete(1) ? "Continue to Next Step" : "Start Quick Start"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onSkip}
            >
              Skip Quick Start → Explore Dashboard
            </Button>
          </div> */}

          {/* Undo Publish Banner */}
          {showUndoPublish && (
            <Alert className={cn(
              "border-green-500 bg-green-500/10",
              orientation === "vertical" && "max-w-4xl mx-auto"
            )}>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="flex items-center justify-between">
                <span>Content published successfully!</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleUndoPublish}
                >
                  Undo Publish
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Help Links */}
          <div className={cn(
            "flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground",
            orientation === "vertical" && "max-w-4xl mx-auto"
          )}>
            <Button variant="ghost" size="sm" className="h-auto gap-1 p-0">
              <HelpCircle className="h-4 w-4" />
              Need help?
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Screen Modal */}
      <Dialog open={showAddScreenModal} onOpenChange={setShowAddScreenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a Screen</DialogTitle>
            <DialogDescription>
              Choose how you want to add your first screen
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Enter 6-digit registration code</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={registrationCode}
                onChange={(e) => {
                  setRegistrationCode(e.target.value.replace(/\D/g, ''));
                  setCodeError("");
                }}
                className={cn(codeError && "border-red-500")}
                autoFocus
              />
              {codeError && (
                <p className="text-sm text-red-500">{codeError}</p>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => {
                  setShowAddScreenModal(false);
                  setShowHelpModal(true);
                }}
              >
                I don't see a code
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleCreateWebplayer}
            >
              Create webplayer (test in browser)
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddScreenModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddScreen}>
              Add Screen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How to find the 6-digit code</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  1
                </span>
                <span>Turn on your TV and open the Pickcel player app on the device.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  2
                </span>
                <span>You will see a 6-digit code on the screen (example: 123456).</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  3
                </span>
                <span>Enter the code in the Add Screen modal.</span>
              </li>
            </ol>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Screen not reachable?</strong> Check network or try webplayer.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button onClick={() => {
              setShowHelpModal(false);
              setShowAddScreenModal(true);
            }}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onMediaAdded={handleMediaAdded}
        onTemplateSelected={handleTemplateSelected}
        showQuickStartHint={true}
      />

      {/* Composition Modal */}
      <Dialog open={showCompositionModal} onOpenChange={setShowCompositionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a Composition</DialogTitle>
            <DialogDescription>
              A composition is a combination of a layout (screen zones) and the playlist assigned to each zone. Start with a simple single-zone layout.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="layout">Layout</Label>
              <Select defaultValue="single">
                <SelectTrigger id="layout">
                  <SelectValue placeholder="Select a layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Zone</SelectItem>
                  <SelectItem value="split">Split Screen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You can refine layouts and zone content later in the composer.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompositionModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddComposition}>
              Add Composition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publish Content</DialogTitle>
            <DialogDescription>
              Choose screens and schedule for your content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Select Screens */}
            <div className="space-y-2">
              <Label>Select Screens</Label>
              <div className="space-y-2 rounded-lg border p-3">
                {addedScreens.map((screen) => (
                  <div key={screen.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={screen.id}
                      checked={selectedScreens.includes(screen.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedScreens([...selectedScreens, screen.id]);
                        } else {
                          setSelectedScreens(selectedScreens.filter(id => id !== screen.id));
                        }
                      }}
                    />
                    <label
                      htmlFor={screen.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {screen.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Playlist */}
            <div className="space-y-2">
              <Label htmlFor="playlist">Playlist</Label>
              <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
                <SelectTrigger id="playlist">
                  <SelectValue placeholder="Select a playlist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Playlist (Auto-created)</SelectItem>
                  <SelectItem value="default">Default Playlist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Select value={publishSchedule} onValueChange={setPublishSchedule}>
                <SelectTrigger id="schedule">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Publish Now</SelectItem>
                  <SelectItem value="later">Schedule for Later</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePublish}>
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <DialogTitle className="text-center text-2xl">Published!</DialogTitle>
            <DialogDescription className="text-center">
              Your content is live on the screen
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription>
                All done! 4 of 4 steps completed
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleCompleteOnboarding}>
                View on Screen
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowSuccessModal(false)}>
                Continue Editing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

