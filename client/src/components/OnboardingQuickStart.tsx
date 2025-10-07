import { useState } from "react";
import { Monitor, Upload, Rocket, CheckCircle2, AlertCircle, Play, HelpCircle } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import MediaPickerModal from "./MediaPickerModal";

interface OnboardingQuickStartProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

type Step = 1 | 2 | 3;

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
  
  // Modal states
  const [showAddScreenModal, setShowAddScreenModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
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

  const progress = (completedSteps.length / 3) * 100;

  const isStepComplete = (step: Step) => completedSteps.includes(step);
  const canAccessStep = (step: Step) => {
    if (step === 1) return true;
    if (step === 2) return isStepComplete(1);
    if (step === 3) return isStepComplete(2);
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

    setCompletedSteps([...completedSteps, 3]);
    setShowPublishModal(false);
    setShowSuccessModal(true);
    setShowUndoPublish(true);
    
    // Hide undo after 30 seconds
    setTimeout(() => {
      setShowUndoPublish(false);
    }, 30000);
  };

  const handleUndoPublish = () => {
    setCompletedSteps(completedSteps.filter(s => s !== 3));
    setCurrentStep(3);
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
    <>
      <Card className="mx-auto max-w-6xl shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Quick Start — Get your first screen live</CardTitle>
                <CardDescription className="mt-1">
                  Complete these 3 simple steps to see your content on a screen. Should take less than 5 minutes.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0">
              Step {currentStep} of 3
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {completedSteps.length === 0 && "Get started by adding your first screen"}
              {completedSteps.length === 1 && "Step 1 complete · 1 of 3"}
              {completedSteps.length === 2 && "Step 2 complete · 2 of 3"}
              {completedSteps.length === 3 && "All done! 3 of 3"}
            </p>
          </div>

          {/* Step Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => setShowHelpModal(true)}
                >
                  Show me how to find the 6-digit code
                </Button>
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-auto p-0 text-xs"
                  disabled={!canAccessStep(2)}
                >
                  Browse template gallery
                </Button>
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
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">3. Publish</CardTitle>
                </div>
                <CardDescription className="mt-2">
                  Assign the playlist to your screen and publish. You can always change it later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowPublishModal(true)}
                  className="w-full"
                  variant={canAccessStep(3) ? "default" : "secondary"}
                  disabled={!canAccessStep(3) || isStepComplete(3)}
                  title={!canAccessStep(3) ? "Add media to publish" : ""}
                >
                  {isStepComplete(3) ? "Published ✓" : "Publish Now"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Separator />

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
            <Alert className="border-green-500 bg-green-500/10">
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
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" className="h-auto gap-1 p-0">
              <HelpCircle className="h-4 w-4" />
              Need help?
            </Button>
            <Button variant="ghost" size="sm" className="h-auto gap-1 p-0">
              <Play className="h-4 w-4" />
              View quick video (60s)
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
                All done! 3 of 3 steps completed
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
    </>
  );
}

