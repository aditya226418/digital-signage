import { useState } from "react";
import { Settings, ArrowRight, ArrowLeft, Monitor, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "./ui/input";

interface PublishDefaultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PublishDefaultModal({ open, onOpenChange }: PublishDefaultModalProps) {
  const [step, setStep] = useState(1);
  const [selectedScreenIds, setSelectedScreenIds] = useState<string[]>([]);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<"media" | "composition" | null>(null);
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
    setScreenSearchQuery("");
    setSelectedStore("all");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const canProceedStep1 = selectedScreenIds.length > 0;
  const canProceedStep2 = selectedContentId !== null && selectedContentType !== null;
  const canPublish = true; // Always true for default publishing

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
    
    const newPublish: DirectPublish = {
      id: `default-${Date.now()}`,
      name: `Default: ${getContentName()}`,
      contentId: selectedContentId,
      contentName: getContentName(),
      contentType: selectedContentType,
      targetScreens: selectedScreenIds,
      screenNames: getScreenNames(),
      status: "active",
      startTime: new Date().toISOString(),
      duration: -1, // Always indefinite for default
      remainingTime: -1,
      override: false,
      isDefault: true, // Always true for default publishing
      publishedBy: "Current User",
    };

    if (requiresApproval()) {
      toast.info("Approval required", {
        description: "Default publishing requires approval in your organization.",
      });
      return;
    }

    addDirectPublish(newPublish);
    
    toast.success("Default content set!", {
      description: `Default content is now set for ${selectedScreenIds.length} ${
        selectedScreenIds.length === 1 ? "screen" : "screens"
      }.`,
    });

    handleClose();
  };

  const progressValue = (step / 3) * 100;

  const stepTitles = {
    1: "Select Targets",
    2: "Select Content",
    3: "Review & Confirm"
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-full h-screen max-h-screen flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-6 w-6 text-primary" />
              Default Publishing
            </DialogTitle>
            <DialogDescription>
              Set content as the default that plays on screens indefinitely
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
                          {stepNum === 1 ? "Select Targets" : stepNum === 2 ? "Select Content" : "Review & Confirm"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stepNum === 1
                            ? "Choose screens"
                            : stepNum === 2
                            ? "Pick content"
                            : "Confirm default"}
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
                          Choose which screens should display the default content
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
                          Choose what you want to set as the default content
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
                        <h3 className="text-base font-semibold mb-1">Review & Confirm</h3>
                        <p className="text-xs text-muted-foreground">
                          Review your default publishing settings
                        </p>
                      </div>

                      <div className="w-full rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <h4 className="text-sm font-semibold mb-3">Default Publishing Summary</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
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
                          </div>

                          <div className="pt-3 border-t border-primary/10">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                <div>
                                  <p className="text-sm font-medium">Plays Indefinitely</p>
                                  <p className="text-xs text-muted-foreground">
                                    This content will play continuously on the selected screens until changed or replaced.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                <div>
                                  <p className="text-sm font-medium">Default/Fallback Content</p>
                                  <p className="text-xs text-muted-foreground">
                                    This content serves as the default that displays when no other scheduled content is active. It will automatically show when scheduled content ends or when screens are idle.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                <div>
                                  <p className="text-sm font-medium">Always Active</p>
                                  <p className="text-xs text-muted-foreground">
                                    The default content remains active and will be displayed whenever there's no higher priority content scheduled.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                            <Badge variant="secondary" className="text-xs">Indefinite</Badge>
                            <Badge variant="secondary" className="text-xs">Always-On</Badge>
                          </div>
                        </div>
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
                <Settings className="h-4 w-4" />
                Set as Default
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
            name: `Default: ${getContentName()}`,
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

