import { useState } from "react";
import { Zap, ArrowRight, ArrowLeft, Check, Monitor, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ContentPicker from "./ContentPicker";
import { usePublishStore } from "@/hooks/usePublishStore";
import { useRoles } from "@/contexts/RolesContext";
import { mockScreens, mockCompositions, DirectPublish } from "@/lib/mockPublishData";
import { mockMediaLibrary } from "@/lib/mockCompositionData";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ApprovalModal from "./ApprovalModal";

interface PublishDirectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PublishDirectModal({ open, onOpenChange }: PublishDirectModalProps) {
  const [step, setStep] = useState(1);
  const [selectedScreenIds, setSelectedScreenIds] = useState<string[]>([]);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<"media" | "composition" | null>(null);
  const [duration, setDuration] = useState("30");
  const [playIndefinitely, setPlayIndefinitely] = useState(false);
  const [override, setOverride] = useState(false);
  const [makeDefault, setMakeDefault] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [screenSearchQuery, setScreenSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<string>("all");

  const { addDirectPublish } = usePublishStore();
  const { requiresApproval } = useRoles();

  const resetForm = () => {
    setStep(1);
    setSelectedScreenIds([]);
    setSelectedContentId(null);
    setSelectedContentType(null);
    setDuration("30");
    setPlayIndefinitely(false);
    setOverride(false);
    setMakeDefault(false);
    setScreenSearchQuery("");
    setSelectedStore("all");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const canProceedStep1 = selectedScreenIds.length > 0;
  const canProceedStep2 = selectedContentId !== null && selectedContentType !== null;
  const canPublish = playIndefinitely || (duration && parseInt(duration) > 0);

  const getContentName = () => {
    if (!selectedContentId || !selectedContentType) return "";
    
    if (selectedContentType === "media") {
      return mockMediaLibrary.find((m) => m.id === selectedContentId)?.name || "";
    } else if (selectedContentType === "composition") {
      return mockCompositions.find((c) => c.id === selectedContentId)?.name || "";
    }
    return "";
  };

  const getScreenNames = () => {
    const screens = mockScreens.filter((s) => selectedScreenIds.includes(s.id));
    if (screens.length <= 2) {
      return screens.map((s) => s.name).join(", ");
    }
    return `${screens[0].name}, ${screens[1].name}, +${screens.length - 2} more`;
  };

  const getContentDetails = () => {
    if (!selectedContentId || !selectedContentType) return null;
    
    if (selectedContentType === "media") {
      const media = mockMediaLibrary.find((m) => m.id === selectedContentId);
      if (!media) return null;
      return {
        type: media.type,
        category: media.category,
        duration: media.duration,
      };
    } else if (selectedContentType === "composition") {
      const comp = mockCompositions.find((c) => c.id === selectedContentId);
      if (!comp) return null;
      return {
        type: comp.type,
        duration: comp.duration,
      };
    }
    return null;
  };

  const getScreenLocations = () => {
    const screens = mockScreens.filter((s) => selectedScreenIds.includes(s.id));
    const locations = Array.from(new Set(screens.map((s) => s.location)));
    return locations;
  };

  const getOnlineScreensCount = () => {
    const screens = mockScreens.filter((s) => selectedScreenIds.includes(s.id));
    return screens.filter((s) => s.status === "online").length;
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "Continuous";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes === 0) return `${secs}s`;
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  };

  // Get unique store names
  const storeNames = Array.from(new Set(mockScreens.map((s) => s.store).filter((s): s is string => !!s))).sort();

  const filteredScreens = mockScreens.filter((screen) => {
    const matchesSearch = 
      screen.name.toLowerCase().includes(screenSearchQuery.toLowerCase()) ||
      screen.location.toLowerCase().includes(screenSearchQuery.toLowerCase());
    
    const matchesStore = selectedStore === "all" || screen.store === selectedStore;
    
    return matchesSearch && matchesStore;
  });

  const toggleScreen = (screenId: string) => {
    if (selectedScreenIds.includes(screenId)) {
      setSelectedScreenIds(selectedScreenIds.filter((id) => id !== screenId));
    } else {
      setSelectedScreenIds([...selectedScreenIds, screenId]);
    }
  };

  const handlePublish = () => {
    if (!selectedContentId || !selectedContentType) return;

    const actualDuration = playIndefinitely ? -1 : parseInt(duration);
    
    const newPublish: DirectPublish = {
      id: `quick-${Date.now()}`,
      name: `Direct: ${getContentName()}`,
      contentId: selectedContentId,
      contentName: getContentName(),
      contentType: selectedContentType,
      targetScreens: selectedScreenIds,
      screenNames: getScreenNames(),
      status: "active",
      startTime: new Date().toISOString(),
      duration: actualDuration,
      remainingTime: actualDuration,
      override,
      isDefault: makeDefault,
      publishedBy: "Current User",
    };

    if (requiresApproval()) {
      // For direct publishing with approval, we could convert it to a schedule
      // For now, just show a message
      toast.info("Approval required", {
        description: "Direct publishing requires approval in your organization.",
      });
      return;
    }

    addDirectPublish(newPublish);
    
    toast.success("Content published!", {
      description: `Now playing on ${selectedScreenIds.length} ${
        selectedScreenIds.length === 1 ? "screen" : "screens"
      }.`,
    });

    handleClose();
  };

  const progressValue = (step / 3) * 100;

  const stepTitles = {
    1: "Select Targets",
    2: "Select Content",
    3: "Configure Options"
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-full h-screen max-h-screen flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-6 w-6 text-primary" />
              Direct Publishing
            </DialogTitle>
            <DialogDescription>
              Push content to screens immediately with quick configuration
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-1 gap-6 overflow-hidden">
            {/* Left Sidebar - Progress & Navigation */}
            <div className="w-64 border-r flex flex-col gap-6 py-6 px-6 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Progress</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((stepNum) => (
                    <div
                      key={stepNum}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                        stepNum === step
                          ? "bg-primary/10 border border-primary/20"
                          : stepNum < step
                          ? "opacity-60"
                          : "opacity-40"
                      }`}
                      onClick={() => stepNum < step && setStep(stepNum)}
                    >
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold shrink-0 ${
                          stepNum < step
                            ? "bg-green-500 text-white"
                            : stepNum === step
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {stepNum < step ? "✓" : stepNum}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {stepNum === 1 ? "Select Targets" : stepNum === 2 ? "Select Content" : "Configure"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stepNum === 1
                            ? "Choose screens"
                            : stepNum === 2
                            ? "Pick content"
                            : "Set options"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 py-6 px-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {step === 1 && (
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base font-semibold mb-1">Select Target Screens</h3>
                        <p className="text-xs text-muted-foreground">
                          Choose which screens should display your content
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search screens..."
                            value={screenSearchQuery}
                            onChange={(e) => setScreenSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Select value={selectedStore} onValueChange={setSelectedStore}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Filter by store" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Stores</SelectItem>
                              {storeNames.map((store) => (
                                <SelectItem key={store} value={store}>
                                  {store}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Badge variant="secondary" className="text-sm text-muted-foreground">
                            {selectedScreenIds.length} {selectedScreenIds.length === 1 ? "screen" : "screens"} selected
                          </Badge>
                        </div>

                        <ScrollArea className="h-[400px] rounded-md border border-border/40">
                          <div className="p-4 space-y-2">
                            {filteredScreens.length === 0 ? (
                              <p className="text-center text-sm text-muted-foreground py-8">
                                No screens found
                              </p>
                            ) : (
                              filteredScreens.map((screen) => (
                                <Card
                                  key={screen.id}
                                  className={`cursor-pointer transition-all duration-200 ${
                                    selectedScreenIds.includes(screen.id)
                                      ? "border-primary bg-primary/5"
                                      : "hover:border-primary/50"
                                  }`}
                                  onClick={() => toggleScreen(screen.id)}
                                >
                                  <CardContent className="p-4 flex items-center gap-3">
                                    <Checkbox
                                      checked={selectedScreenIds.includes(screen.id)}
                                      onCheckedChange={() => toggleScreen(screen.id)}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <Monitor className="h-5 w-5 text-muted-foreground shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium truncate">{screen.name}</div>
                                      <div className="text-xs text-muted-foreground truncate">
                                        {screen.location}
                                      </div>
                                    </div>
                                    <Badge
                                      variant={screen.status === "online" ? "default" : "secondary"}
                                      className={
                                        screen.status === "online"
                                          ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                                          : ""
                                      }
                                    >
                                      {screen.status}
                                    </Badge>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base font-semibold mb-1">Select Content</h3>
                        <p className="text-xs text-muted-foreground">
                          Choose what you want to display on the selected screens
                        </p>
                      </div>
                      <ContentPicker
                        selectedContentId={selectedContentId}
                        selectedContentType={selectedContentType}
                        onSelectionChange={(id, type) => {
                          setSelectedContentId(id);
                          setSelectedContentType(type as "media" | "composition");
                        }}
                        hideCampaigns={true}
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-semibold mb-1">Configure Options</h3>
                        <p className="text-xs text-muted-foreground">
                          Set playback duration and behavior
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Left Column - Settings */}
                        <div className="space-y-3 rounded-lg border border-border/40 bg-muted/20 p-4">
                          <h4 className="font-semibold text-sm mb-3">Playback Settings</h4>
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="playIndefinitely"
                              checked={playIndefinitely}
                              onCheckedChange={(checked) => setPlayIndefinitely(checked as boolean)}
                            />
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="playIndefinitely" className="cursor-pointer font-medium">
                                Play indefinitely
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Content will continue playing until manually stopped
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2">
                            <Label htmlFor="duration" className={playIndefinitely ? "text-muted-foreground" : ""}>
                              Duration (minutes)
                            </Label>
                            <Input
                              id="duration"
                              type="number"
                              min="1"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              placeholder="Enter duration in minutes"
                              disabled={playIndefinitely}
                            />
                            <p className="text-xs text-muted-foreground">
                              How long should this content play before reverting
                            </p>
                          </div>
                        </div>

                        {/* Right Column - Behavior */}
                        <div className="space-y-3 rounded-lg border border-border/40 bg-muted/20 p-4">
                          <h4 className="font-semibold text-sm mb-3">Behavior Options</h4>
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="override"
                              checked={override}
                              onCheckedChange={(checked) => setOverride(checked as boolean)}
                            />
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="override" className="cursor-pointer font-medium">
                                Override current content
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Interrupt any currently playing content immediately
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3 pt-2">
                            <Checkbox
                              id="makeDefault"
                              checked={makeDefault}
                              onCheckedChange={(checked) => setMakeDefault(checked as boolean)}
                            />
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="makeDefault" className="cursor-pointer font-medium">
                                Make default
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Set as the default content after this playback ends
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <h4 className="text-sm font-semibold mb-3">Publish Summary</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground text-xs block mb-1">Content:</span>
                            <p className="font-medium text-sm truncate">{getContentName() || "—"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs block mb-1">Screens:</span>
                            <p className="font-medium text-sm">
                              {selectedScreenIds.length} {selectedScreenIds.length === 1 ? "screen" : "screens"}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs block mb-1">Duration:</span>
                            <p className="font-medium text-sm">
                              {playIndefinitely ? "Indefinite" : `${duration} minutes`}
                            </p>
                          </div>
                        </div>
                        {(override || makeDefault || playIndefinitely) && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-primary/10 flex-wrap">
                            {override && <Badge variant="secondary" className="text-xs">Override</Badge>}
                            {makeDefault && <Badge variant="secondary" className="text-xs">Make Default</Badge>}
                            {playIndefinitely && <Badge variant="secondary" className="text-xs">Indefinite</Badge>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={!canPublish}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Play Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showApprovalModal && selectedContentId && selectedContentType && (
        <ApprovalModal
          open={showApprovalModal}
          onOpenChange={setShowApprovalModal}
          schedule={{
            id: "temp",
            name: `Direct: ${getContentName()}`,
            type: "simple",
            targetScreens: selectedScreenIds,
            screenNames: getScreenNames(),
            status: "pending_approval",
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            recurrence: "once",
            priority: "high",
            contentId: selectedContentId,
            contentName: getContentName(),
            createdBy: "Current User",
            createdAt: new Date().toISOString(),
          }}
          mode="submit"
          onSuccess={handleClose}
        />
      )}
    </>
  );
}

