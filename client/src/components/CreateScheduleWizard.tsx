import { useState, useEffect } from "react";
import { Calendar, ArrowRight, ArrowLeft, Check, Info, Monitor, Search } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContentPicker from "./ContentPicker";
import DaySequenceEditor from "./DaySequenceEditor";
import SchedulePreview from "./SchedulePreview";
import ApprovalModal from "./ApprovalModal";
import { usePublishStore } from "@/hooks/usePublishStore";
import { useRoles } from "@/contexts/RolesContext";
import { PlannedSchedule, TimeSlot, mockCompositions, mockScreens } from "@/lib/mockPublishData";
import { mockMediaLibrary } from "@/lib/mockCompositionData";
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

  // Step 2: Content selection
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<"media" | "composition" | null>(null);

  // Step 2: Day Sequence
  const [daySequenceSlots, setDaySequenceSlots] = useState<TimeSlot[]>([]);

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingSchedule, setPendingSchedule] = useState<PlannedSchedule | null>(null);
  const [screenSearchQuery, setScreenSearchQuery] = useState("");

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
    setSelectedContentId(null);
    setSelectedContentType(null);
    setDaySequenceSlots([]);
    setScreenSearchQuery("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const canProceedStep1 = selectedScreenIds.length > 0;

  const canProceedStep2 = () => {
    if (scheduleType === "simple") return selectedContentId !== null && selectedContentType !== null;
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

  const filteredScreens = mockScreens.filter((screen) =>
    screen.name.toLowerCase().includes(screenSearchQuery.toLowerCase()) ||
    screen.location.toLowerCase().includes(screenSearchQuery.toLowerCase())
  );

  const toggleScreen = (screenId: string) => {
    if (selectedScreenIds.includes(screenId)) {
      setSelectedScreenIds(selectedScreenIds.filter((id) => id !== screenId));
    } else {
      setSelectedScreenIds([...selectedScreenIds, screenId]);
    }
  };

  const getContentName = () => {
    if (!selectedContentId || !selectedContentType) return "";
    
    if (selectedContentType === "media") {
      return mockMediaLibrary.find((m) => m.id === selectedContentId)?.name || "";
    } else if (selectedContentType === "composition") {
      return mockCompositions.find((c) => c.id === selectedContentId)?.name || "";
    }
    return "";
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
        ? (selectedContentId || "") 
        : `${scheduleType}-${Date.now()}`,
      contentName: getContentName(),
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
    };
    
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
    "Select Screens",
    scheduleType === "simple" ? "Select Content" : "Day Sequence",
    "Schedule Details",
  ];

  const canProceedStep3 =
    name.trim() &&
    startDate &&
    endDate &&
    new Date(startDate) < new Date(endDate);

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
                            ? "Choose screens"
                            : stepNum === 2
                            ? "Choose content"
                            : "Set details"}
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

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">
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
                      {scheduleType === "simple" ? (
                        <>
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
                        </>
                      ) : (
                        <DaySequenceEditor slots={daySequenceSlots} onSlotsChange={setDaySequenceSlots} />
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-semibold mb-1">Schedule Details</h3>
                        <p className="text-xs text-muted-foreground">
                          Configure the schedule timing and settings
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Left Column - Basic Info */}
                        <div className="space-y-4">
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

                        {/* Right Column - Date/Time */}
                        <div className="space-y-4">
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
                      </div>

                      <SchedulePreview
                        name={name}
                        targetScreenIds={selectedScreenIds}
                        startDate={startDate}
                        endDate={endDate}
                        recurrence={recurrence}
                        priority={priority}
                        scheduleType={scheduleType}
                        contentId={scheduleType === "simple" ? selectedContentId || undefined : undefined}
                        daySequenceSlots={scheduleType === "daySequence" ? daySequenceSlots : undefined}
                      />
                    </div>
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
              <Button 
                onClick={handlePublish} 
                disabled={!canProceedStep3}
                className="gap-2"
              >
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

