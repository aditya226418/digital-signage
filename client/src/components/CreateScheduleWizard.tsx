import { useState, useEffect } from "react";
import { Calendar, ArrowRight, ArrowLeft, Check, Info } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TargetPicker from "./TargetPicker";
import DaySequenceEditor from "./DaySequenceEditor";
import SchedulePreview from "./SchedulePreview";
import ApprovalModal from "./ApprovalModal";
import { usePublishStore } from "@/hooks/usePublishStore";
import { useRoles } from "@/contexts/RolesContext";
import { PlannedSchedule, TimeSlot, mockCompositions, mockScreens } from "@/lib/mockPublishData";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CreateScheduleWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: "simple" | "daySequence";
}

export default function CreateScheduleWizard({ open, onOpenChange, initialType = "simple" }: CreateScheduleWizardProps) {
  const [step, setStep] = useState(1);
  const [scheduleType, setScheduleType] = useState<"simple" | "daySequence">(initialType);

  // Sync scheduleType with initialType when dialog opens
  useEffect(() => {
    if (open) {
      setScheduleType(initialType);
    }
  }, [open, initialType]);
  
  // Step 1: Basic Info
  const [name, setName] = useState("");
  const [selectedScreenIds, setSelectedScreenIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recurrence, setRecurrence] = useState<"once" | "daily" | "weekly" | "monthly">("daily");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  // Step 2: Simple composition
  const [selectedCompositionId, setSelectedCompositionId] = useState("");

  // Step 2: Day Sequence
  const [daySequenceSlots, setDaySequenceSlots] = useState<TimeSlot[]>([]);

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingSchedule, setPendingSchedule] = useState<PlannedSchedule | null>(null);

  const { addPlannedSchedule } = usePublishStore();
  const { requiresApproval } = useRoles();

  const resetForm = () => {
    setStep(1);
    setScheduleType(initialType);
    setName("");
    setSelectedScreenIds([]);
    setStartDate("");
    setEndDate("");
    setRecurrence("daily");
    setPriority("medium");
    setSelectedCompositionId("");
    setDaySequenceSlots([]);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const canProceedStep1 =
    name.trim() &&
    selectedScreenIds.length > 0 &&
    startDate &&
    endDate &&
    new Date(startDate) < new Date(endDate);

  const canProceedStep2 = () => {
    if (scheduleType === "simple") return selectedCompositionId !== "";
    if (scheduleType === "daySequence") return daySequenceSlots.length > 0;
    return false;
  };

  const getScreenNames = () => {
    const screens = mockScreens.filter((s) => selectedScreenIds.includes(s.id));
    if (screens.length <= 2) {
      return screens.map((s) => s.name).join(", ");
    }
    return `${screens[0].name}, ${screens[1].name}, +${screens.length - 2} more`;
  };

  const getContentName = () => {
    if (scheduleType === "simple") {
      return mockCompositions.find((c) => c.id === selectedCompositionId)?.name || "";
    } else if (scheduleType === "daySequence") {
      return `${name} (Day Sequence)`;
    }
    return name;
  };

  const handlePublish = () => {
    const newSchedule: PlannedSchedule = {
      id: `sched-${Date.now()}`,
      name,
      type: scheduleType,
      targetScreens: selectedScreenIds,
      screenNames: getScreenNames(),
      status: requiresApproval() ? "pending_approval" : "scheduled",
      startDate,
      endDate,
      recurrence,
      priority,
      contentId: scheduleType === "simple" ? selectedCompositionId : `${scheduleType}-${Date.now()}`,
      contentName: getContentName(),
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
    };

    // Add type-specific data
    if (scheduleType === "daySequence") {
      newSchedule.daySequence = {
        id: `dayseq-${Date.now()}`,
        name: `${name} - Day Sequence`,
        slots: daySequenceSlots,
      };
    }

    if (requiresApproval()) {
      setPendingSchedule(newSchedule);
      setShowApprovalModal(true);
    } else {
      addPlannedSchedule(newSchedule);
      toast.success("Schedule created!", {
        description: `${name} has been scheduled successfully.`,
      });
      handleClose();
    }
  };

  const handleApprovalSuccess = () => {
    if (pendingSchedule) {
      addPlannedSchedule(pendingSchedule);
    }
    handleClose();
  };

  const progressValue = (step / 3) * 100;

  const stepTitles = [
    "Basic Information",
    scheduleType === "simple" ? "Select Content" : "Day Sequence",
    "Review & Publish",
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Create Planned Schedule
            </DialogTitle>
            <DialogDescription>
              Plan and automate content playback with schedules and campaigns
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Step {step} of 3</span>
              <span className="font-medium">{stepTitles[step - 1]}</span>
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
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Basic Information</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set up the basic details for your schedule
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Schedule Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Morning Welcome Campaign"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Target Screens *</Label>
                      <TargetPicker
                        selectedScreenIds={selectedScreenIds}
                        onSelectionChange={setSelectedScreenIds}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date & Time *</Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date & Time *</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="recurrence">Recurrence</Label>
                        <Select value={recurrence} onValueChange={(value: any) => setRecurrence(value)}>
                          <SelectTrigger id="recurrence">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once">Once</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                          <SelectTrigger id="priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {scheduleType === "simple" ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Select Composition</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Choose a single composition to play during the schedule
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="composition">Composition *</Label>
                        <Select value={selectedCompositionId} onValueChange={setSelectedCompositionId}>
                          <SelectTrigger id="composition">
                            <SelectValue placeholder="Select a composition" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCompositions.map((comp) => (
                              <SelectItem key={comp.id} value={comp.id}>
                                {comp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <DaySequenceEditor slots={daySequenceSlots} onSlotsChange={setDaySequenceSlots} />
                  )}
                </div>
              )}

              {step === 3 && (
                <SchedulePreview
                  name={name}
                  targetScreenIds={selectedScreenIds}
                  startDate={startDate}
                  endDate={endDate}
                  recurrence={recurrence}
                  priority={priority}
                  scheduleType={scheduleType}
                  contentId={scheduleType === "simple" ? selectedCompositionId : undefined}
                  daySequenceSlots={scheduleType === "daySequence" ? daySequenceSlots : undefined}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <DialogFooter className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2()}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handlePublish} className="gap-2">
                <Check className="h-4 w-4" />
                {requiresApproval() ? "Submit for Approval" : "Publish Schedule"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showApprovalModal && pendingSchedule && (
        <ApprovalModal
          open={showApprovalModal}
          onOpenChange={setShowApprovalModal}
          schedule={pendingSchedule}
          mode="submit"
          onSuccess={handleApprovalSuccess}
        />
      )}
    </>
  );
}

