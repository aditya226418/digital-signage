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
import { Badge } from "@/components/ui/badge";
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

  // Step 2: Simple composition (single or playlist)
  const [selectedCompositionIds, setSelectedCompositionIds] = useState<string[]>([]);
  const [isPlaylistMode, setIsPlaylistMode] = useState(false);

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
    setSelectedCompositionIds([]);
    setIsPlaylistMode(false);
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
    if (scheduleType === "simple") return selectedCompositionIds.length > 0;
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
      if (selectedCompositionIds.length === 1) {
        return mockCompositions.find((c) => c.id === selectedCompositionIds[0])?.name || "";
      } else if (selectedCompositionIds.length > 1) {
        return `${name} (Playlist - ${selectedCompositionIds.length} items)`;
      }
      return "";
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
      contentId: scheduleType === "simple" 
        ? (selectedCompositionIds.length > 0 ? selectedCompositionIds[0] : "") 
        : `${scheduleType}-${Date.now()}`,
      contentName: getContentName(),
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
    };

    // Add type-specific data
    if (scheduleType === "simple" && selectedCompositionIds.length > 1) {
      // Store all composition IDs for playlist mode
      (newSchedule as any).contentIds = selectedCompositionIds;
    }
    
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
        <DialogContent className="max-w-full h-screen max-h-screen flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-6 w-6 text-primary" />
              Create Planned Schedule
            </DialogTitle>
            <DialogDescription>
              Plan and automate content playback with schedules and campaigns
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
                        <p className="text-sm font-medium">{stepTitles[stepNum - 1]}</p>
                        <p className="text-xs text-muted-foreground">
                          {stepNum === 1
                            ? "Set details"
                            : stepNum === 2
                            ? "Choose content"
                            : "Review"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              {name && selectedScreenIds.length > 0 && (
                <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Details</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Name:</p>
                      <p className="font-medium text-sm truncate">{name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Screens:</p>
                      <p className="font-medium text-sm">{selectedScreenIds.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Recurrence:</p>
                      <p className="font-medium text-sm capitalize">{recurrence}</p>
                    </div>
                  </div>
                </div>
              )}
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
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Set up the basic details for your schedule
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        {/* Left Column - Basic Info */}
                        <div className="col-span-1 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Schedule Name *</Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g., Morning Campaign"
                            />
                          </div>

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

                        {/* Middle Column - Date/Time */}
                        <div className="col-span-1 space-y-4">
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

                        {/* Right Column - Screens */}
                        <div className="col-span-1 space-y-2">
                          <Label>Target Screens *</Label>
                          <div className="border rounded-lg p-4 overflow-hidden">
                            <TargetPicker
                              selectedScreenIds={selectedScreenIds}
                              onSelectionChange={setSelectedScreenIds}
                            />
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
                            <h3 className="text-lg font-semibold mb-2">Select Content</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                              Choose one or more compositions to play during the schedule
                            </p>
                          </div>

                          <Tabs value={isPlaylistMode ? "playlist" : "single"} onValueChange={(v) => {
                            setIsPlaylistMode(v === "playlist");
                            setSelectedCompositionIds([]);
                          }}>
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="single">Single Composition</TabsTrigger>
                              <TabsTrigger value="playlist">Playlist</TabsTrigger>
                            </TabsList>

                            <TabsContent value="single" className="space-y-4 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor="composition">Composition *</Label>
                                <Select 
                                  value={selectedCompositionIds[0] || ""} 
                                  onValueChange={(value) => setSelectedCompositionIds([value])}
                                >
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
                                <p className="text-xs text-muted-foreground">
                                  The selected composition will loop during the scheduled time window.
                                </p>
                              </div>
                            </TabsContent>

                            <TabsContent value="playlist" className="space-y-4 mt-4">
                              <div className="space-y-2">
                                <Label>Select Compositions *</Label>
                                <div className="border rounded-lg p-4 space-y-2 max-h-[400px] overflow-y-auto">
                                  {mockCompositions.map((comp) => {
                                    const isSelected = selectedCompositionIds.includes(comp.id);
                                    const position = selectedCompositionIds.indexOf(comp.id);
                                    
                                    return (
                                      <div
                                        key={comp.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:bg-accent ${
                                          isSelected ? "border-primary bg-primary/5" : "border-border"
                                        }`}
                                        onClick={() => {
                                          if (isSelected) {
                                            setSelectedCompositionIds(selectedCompositionIds.filter((id) => id !== comp.id));
                                          } else {
                                            setSelectedCompositionIds([...selectedCompositionIds, comp.id]);
                                          }
                                        }}
                                      >
                                        <div className="flex items-center gap-3">
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}}
                                            className="h-4 w-4"
                                          />
                                          <div>
                                            <p className="font-medium text-sm">{comp.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                              {comp.type} • Duration: {comp.duration}s
                                            </p>
                                          </div>
                                        </div>
                                        {isSelected && (
                                          <Badge variant="secondary">
                                            #{position + 1}
                                          </Badge>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Selected compositions will play in order as a playlist, then loop.
                                  {selectedCompositionIds.length > 0 && ` (${selectedCompositionIds.length} selected)`}
                                </p>
                              </div>

                              {selectedCompositionIds.length > 0 && (
                                <div className="space-y-2">
                                  <Label>Playlist Order</Label>
                                  <div className="border rounded-lg p-3 space-y-2">
                                    {selectedCompositionIds.map((id, index) => {
                                      const comp = mockCompositions.find((c) => c.id === id);
                                      if (!comp) return null;
                                      
                                      return (
                                        <div
                                          key={id}
                                          className="flex items-center gap-3 p-2 bg-accent rounded-lg"
                                        >
                                          <span className="text-sm font-semibold text-muted-foreground w-6">
                                            {index + 1}.
                                          </span>
                                          <span className="text-sm flex-1">{comp.name}</span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedCompositionIds(selectedCompositionIds.filter((cid) => cid !== id));
                                            }}
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>

                          <div className="flex items-start gap-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-3">
                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-900 dark:text-blue-100">
                              <p className="font-semibold mb-1">How scheduling works:</p>
                              <ul className="space-y-1 list-disc list-inside">
                                <li><strong>Recurrence "Once":</strong> Content plays from start time until end time (or completion)</li>
                                <li><strong>Recurrence "Daily":</strong> Content plays every day at the start time within the date range</li>
                                <li><strong>Recurrence "Weekly/Monthly":</strong> Content plays at the same time on the specified interval</li>
                              </ul>
                            </div>
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
                      contentId={scheduleType === "simple" && selectedCompositionIds.length === 1 ? selectedCompositionIds[0] : undefined}
                      contentIds={scheduleType === "simple" && selectedCompositionIds.length > 1 ? selectedCompositionIds : undefined}
                      daySequenceSlots={scheduleType === "daySequence" ? daySequenceSlots : undefined}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <DialogFooter className="border-t pt-4 flex gap-2 justify-end">
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

