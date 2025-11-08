import { useState } from "react";
import { Zap, ArrowRight, ArrowLeft, Check } from "lucide-react";
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
import TargetPicker from "./TargetPicker";
import ContentPicker from "./ContentPicker";
import { usePublishStore } from "@/hooks/usePublishStore";
import { useRoles } from "@/contexts/RolesContext";
import { mockScreens, mockCompositions, mockCampaigns, DirectPublish } from "@/lib/mockPublishData";
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
  const [selectedContentType, setSelectedContentType] = useState<"media" | "composition" | "campaign" | null>(null);
  const [duration, setDuration] = useState("30");
  const [playIndefinitely, setPlayIndefinitely] = useState(false);
  const [override, setOverride] = useState(false);
  const [makeDefault, setMakeDefault] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

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
    } else if (selectedContentType === "campaign") {
      return mockCampaigns.find((c) => c.id === selectedContentId)?.name || "";
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

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Direct Publishing
            </DialogTitle>
            <DialogDescription>
              Push content to screens immediately with quick configuration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Step {step} of 3
              </span>
              <span className="font-medium">
                {step === 1 ? "Select Targets" : step === 2 ? "Select Content" : "Configure Options"}
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="py-4"
            >
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Select Target Screens</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose which screens or groups should display your content
                    </p>
                  </div>
                  <TargetPicker
                    selectedScreenIds={selectedScreenIds}
                    onSelectionChange={setSelectedScreenIds}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Select Content</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose what you want to display on the selected screens
                    </p>
                  </div>
                  <ContentPicker
                    selectedContentId={selectedContentId}
                    selectedContentType={selectedContentType}
                    onSelectionChange={(id, type) => {
                      setSelectedContentId(id);
                      setSelectedContentType(type);
                    }}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Configure Options</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set playback duration and behavior
                    </p>
                  </div>

                  <div className="space-y-4 rounded-lg border border-border/40 bg-muted/20 p-4">
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

                    <div className="space-y-2">
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

                    <div className="flex items-start space-x-3 pt-2">
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

                    <div className="flex items-start space-x-3">
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

                  <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <h4 className="text-sm font-semibold">Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Content:</span>
                        <span className="font-medium">{getContentName()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Screens:</span>
                        <span className="font-medium">{selectedScreenIds.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">
                          {playIndefinitely ? "Indefinite" : `${duration} minutes`}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2 flex-wrap">
                        {override && <Badge variant="secondary">Override</Badge>}
                        {makeDefault && <Badge variant="secondary">Make Default</Badge>}
                        {playIndefinitely && <Badge variant="secondary">Indefinite</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <DialogFooter className="flex gap-2">
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

