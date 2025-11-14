import { useState, useEffect } from "react";
import { Plus, X, GripVertical, Edit2, Trash2, ChevronUp, ChevronDown, Info, Check, PlaySquare, Image as ImageIcon, Video, Grid3x3, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TimeSlot, DaySequence, mockCompositions } from "@/lib/mockPublishData";
import { mockMediaLibrary } from "@/lib/mockCompositionData";
import { toast } from "sonner";

interface DaySequenceAssignmentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDays: Set<string>;
  sequence: DaySequence | null;
  onSave: (sequence: DaySequence) => void;
  timezone?: string;
}

// Convert time string (HH:MM) to minutes from midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Convert minutes from midnight to time string (HH:MM)
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

// Format time for display
const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const h = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";
  return `${h}:${String(minutes).padStart(2, "0")} ${ampm}`;
};

function SortableTimelineSlot({
  slot,
  index,
  onUpdate,
  onDelete,
  isEditing,
  onEdit,
  onCancelEdit,
  timezone,
  allSlots,
}: {
  slot: TimeSlot;
  index: number;
  onUpdate: (slot: TimeSlot) => void;
  onDelete: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  timezone?: string;
  allSlots: TimeSlot[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [localSlot, setLocalSlot] = useState<TimeSlot>(slot);
  const [contentSearchQuery, setContentSearchQuery] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "image" | "video" | "app">("all");
  const [activeContentTab, setActiveContentTab] = useState<"compositions" | "media">(
    slot.contentType === "media" ? "media" : "compositions"
  );
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    setLocalSlot(slot);
  }, [slot]);

  const startMinutes = timeToMinutes(slot.startTime);
  const endMinutes = timeToMinutes(slot.endTime);
  const duration = endMinutes - startMinutes;
  const startPercent = (startMinutes / (24 * 60)) * 100;
  const heightPercent = (duration / (24 * 60)) * 100;

  const filteredCompositions = mockCompositions.filter((comp) =>
    comp.name.toLowerCase().includes(contentSearchQuery.toLowerCase())
  );

  const filteredMedia = mockMediaLibrary.filter((media) => {
    const matchesSearch = media.name.toLowerCase().includes(contentSearchQuery.toLowerCase());
    const matchesType = mediaTypeFilter === "all" || media.type === mediaTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleContentSelect = (contentId: string, contentType: "media" | "composition") => {
    let contentName = "";
    if (contentType === "media") {
      const media = mockMediaLibrary.find((m) => m.id === contentId);
      contentName = media?.name || "";
    } else {
      const comp = mockCompositions.find((c) => c.id === contentId);
      contentName = comp?.name || "";
    }

    setLocalSlot({
      ...localSlot,
      contentType,
      contentId,
      contentName,
      compositionId: contentType === "composition" ? contentId : undefined,
      compositionName: contentType === "composition" ? contentName : undefined,
    });
    setPopoverOpen(false);
  };

  const handleSave = () => {
    onUpdate(localSlot);
    onCancelEdit();
  };

  const handleCancel = () => {
    setLocalSlot(slot);
    onCancelEdit();
  };

  return (
    <div
      ref={setNodeRef}
      className="absolute left-0 right-0 group"
      style={{
        ...style,
        top: `${startPercent}%`,
        height: isEditing ? "auto" : `${heightPercent}%`,
        minHeight: isEditing ? "200px" : undefined,
        zIndex: isEditing ? 50 : 1,
      }}
    >
      {!isEditing ? (
        <div className="h-full bg-primary/90 hover:bg-primary border-2 border-primary rounded-md p-2 flex items-center justify-between gap-2 transition-all" style={{ minHeight: "40px" }}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/20 rounded"
            >
              <GripVertical className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-primary-foreground truncate">
                {slot.contentName || "No content selected"}
              </div>
              <div className="text-[10px] text-primary-foreground/80">
                {formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-6 w-6 p-0 hover:bg-white/20"
            >
              <Edit2 className="h-3 w-3 text-primary-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-6 w-6 p-0 hover:bg-destructive/20"
            >
              <Trash2 className="h-3 w-3 text-primary-foreground" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-card border-2 border-primary rounded-md shadow-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-xs font-semibold">Edit Time Slot</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="h-7 text-xs gap-1"
              >
                <Check className="h-3 w-3" />
                Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Start Time</Label>
              <Input
                type="time"
                value={localSlot.startTime}
                onChange={(e) => setLocalSlot({ ...localSlot, startTime: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End Time</Label>
              <Input
                type="time"
                value={localSlot.endTime}
                onChange={(e) => setLocalSlot({ ...localSlot, endTime: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Content</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-8 text-xs"
                >
                  <span className="truncate">
                    {localSlot.contentName || "Select content"}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-2 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start" side="bottom">
                <Tabs value={activeContentTab} onValueChange={(v) => setActiveContentTab(v as "compositions" | "media")} className="w-full">
                  <div className="p-3 border-b">
                    <div className="flex items-center gap-2 mb-2">
                      <TabsList className="w-auto">
                        <TabsTrigger 
                          value="compositions" 
                          className="gap-1.5 text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          <PlaySquare className="h-3 w-3" />
                          Compositions
                        </TabsTrigger>
                        <TabsTrigger 
                          value="media" 
                          className="gap-1.5 text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          <ImageIcon className="h-3 w-3" />
                          All Media
                        </TabsTrigger>
                      </TabsList>
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search..."
                          value={contentSearchQuery}
                          onChange={(e) => setContentSearchQuery(e.target.value)}
                          className="pl-7 h-7 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <TabsContent value="compositions" className="mt-0 p-0">
                    <ScrollArea className="h-[300px]">
                      <div className="p-2 space-y-1">
                        {filteredCompositions.length === 0 ? (
                          <p className="text-center text-xs text-muted-foreground py-4">
                            No compositions found
                          </p>
                        ) : (
                          filteredCompositions.map((comp) => {
                            const isSelected = localSlot.contentId === comp.id && localSlot.contentType === "composition";
                            return (
                              <div
                                key={comp.id}
                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-primary/10 border border-primary/20"
                                    : "hover:bg-accent"
                                }`}
                                onClick={() => handleContentSelect(comp.id, "composition")}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => handleContentSelect(comp.id, "composition")}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-3.5 w-3.5"
                                />
                                <span className="text-xs flex-1 truncate">{comp.name}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="media" className="mt-0 p-0">
                    <div className="p-3 border-b space-y-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Button
                          variant={mediaTypeFilter === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMediaTypeFilter("all")}
                          className="h-6 text-[10px] px-2"
                        >
                          All
                        </Button>
                        <Button
                          variant={mediaTypeFilter === "image" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMediaTypeFilter("image")}
                          className="h-6 text-[10px] px-2 gap-1"
                        >
                          <ImageIcon className="h-2.5 w-2.5" />
                          Images
                        </Button>
                        <Button
                          variant={mediaTypeFilter === "video" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMediaTypeFilter("video")}
                          className="h-6 text-[10px] px-2 gap-1"
                        >
                          <Video className="h-2.5 w-2.5" />
                          Videos
                        </Button>
                        <Button
                          variant={mediaTypeFilter === "app" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMediaTypeFilter("app")}
                          className="h-6 text-[10px] px-2 gap-1"
                        >
                          <Grid3x3 className="h-2.5 w-2.5" />
                          Apps
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-[300px]">
                      <div className="p-2 space-y-1">
                        {filteredMedia.length === 0 ? (
                          <p className="text-center text-xs text-muted-foreground py-4">
                            No media found
                          </p>
                        ) : (
                          filteredMedia.map((media) => {
                            const isSelected = localSlot.contentId === media.id && localSlot.contentType === "media";
                            return (
                              <div
                                key={media.id}
                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-primary/10 border border-primary/20"
                                    : "hover:bg-accent"
                                }`}
                                onClick={() => handleContentSelect(media.id, "media")}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => handleContentSelect(media.id, "media")}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-3.5 w-3.5"
                                />
                                <span className="text-xs flex-1 truncate">{media.name}</span>
                                <Badge variant="outline" className="text-[10px] px-1 py-0 capitalize">
                                  {media.type}
                                </Badge>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DaySequenceAssignmentDrawer({
  open,
  onOpenChange,
  selectedDays,
  sequence,
  onSave,
  timezone = "org-default",
}: DaySequenceAssignmentDrawerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [timeInterval, setTimeInterval] = useState<number>(10); // minutes per interval

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (sequence) {
      setSlots(sequence.slots);
    } else {
      setSlots([]);
    }
    setEditingSlotId(null);
  }, [sequence, open]);

  // Smart slot insertion - place after the last slot or at a safe time
  const addSlot = () => {
    const sortedSlots = [...slots].sort((a, b) => 
      timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    let newStartTime = "09:00";
    let newEndTime = "10:00";

    if (sortedSlots.length > 0) {
      // Place after the last slot
      const lastSlot = sortedSlots[sortedSlots.length - 1];
      const lastEndMinutes = timeToMinutes(lastSlot.endTime);
      const slotDuration = 60; // 1 hour default
      
      // If last slot ends before 23:00, place after it
      if (lastEndMinutes + slotDuration <= 23 * 60) {
        newStartTime = minutesToTime(lastEndMinutes);
        newEndTime = minutesToTime(lastEndMinutes + slotDuration);
      } else {
        // Otherwise, find a gap or place at the beginning
        newStartTime = "00:00";
        newEndTime = "01:00";
      }
    }

    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      startTime: newStartTime,
      endTime: newEndTime,
      contentType: "composition",
      contentId: "",
      contentName: "",
    };
    
    const updatedSlots = [...slots, newSlot].sort((a, b) => 
      timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );
    setSlots(updatedSlots);
    setEditingSlotId(newSlot.id);
  };

  const updateSlot = (updatedSlot: TimeSlot) => {
    // Check for overlaps with other slots
    const otherSlots = slots.filter(s => s.id !== updatedSlot.id);
    const updatedStart = timeToMinutes(updatedSlot.startTime);
    const updatedEnd = timeToMinutes(updatedSlot.endTime);

    // Validate time range
    if (updatedStart >= updatedEnd) {
      toast.error("End time must be after start time");
      return;
    }

    // Check for overlaps
    for (const slot of otherSlots) {
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      
      if (
        (updatedStart >= slotStart && updatedStart < slotEnd) ||
        (updatedEnd > slotStart && updatedEnd <= slotEnd) ||
        (updatedStart <= slotStart && updatedEnd >= slotEnd)
      ) {
        toast.error("Time slots cannot overlap");
        return;
      }
    }

    setSlots(slots.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)));
  };

  const deleteSlot = (slotId: string) => {
    setSlots(slots.filter((s) => s.id !== slotId));
    if (editingSlotId === slotId) {
      setEditingSlotId(null);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over || active.id === over.id) return;

    const draggedSlot = slots.find((s) => s.id === active.id);
    const targetSlot = slots.find((s) => s.id === over.id);

    if (!draggedSlot || !targetSlot) return;

    // Reorder slots and adjust times
    const sortedSlots = [...slots].sort((a, b) => 
      timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );
    
    const oldIndex = sortedSlots.findIndex((s) => s.id === active.id);
    const newIndex = sortedSlots.findIndex((s) => s.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedSlots = arrayMove(sortedSlots, oldIndex, newIndex);
      
      // Adjust times to prevent overlaps
      const adjustedSlots = adjustSlotTimesAfterReorder(reorderedSlots);
      setSlots(adjustedSlots);
    }
  };

  // Adjust slot times after drag to prevent overlaps
  const adjustSlotTimesAfterReorder = (reorderedSlots: TimeSlot[]): TimeSlot[] => {
    const adjusted: TimeSlot[] = [];
    let currentTime = 0; // Start from midnight

    for (const slot of reorderedSlots) {
      const duration = timeToMinutes(slot.endTime) - timeToMinutes(slot.startTime);
      
      // Ensure minimum duration
      const minDuration = Math.max(duration, 15); // At least 15 minutes
      
      // Check if we have enough space
      if (currentTime + minDuration > 24 * 60) {
        // If not enough space, try to fit it before the end
        currentTime = Math.max(0, 24 * 60 - minDuration);
      }

      adjusted.push({
        ...slot,
        startTime: minutesToTime(currentTime),
        endTime: minutesToTime(currentTime + minDuration),
      });

      currentTime += minDuration;
    }

    return adjusted;
  };

  const validateSlots = (): boolean => {
    if (slots.length === 0) {
      toast.error("Please add at least one time slot");
      return false;
    }

    // Validate each slot
    for (const slot of slots) {
      if (!slot.contentId || !slot.contentName) {
        toast.error("Please select content for all time slots");
        return false;
      }

      if (slot.startTime >= slot.endTime) {
        toast.error("End time must be after start time for all slots");
        return false;
      }
    }

    // Check for overlaps
    const sortedSlots = [...slots].sort((a, b) => 
      timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const current = sortedSlots[i];
      const next = sortedSlots[i + 1];
      const currentEnd = timeToMinutes(current.endTime);
      const nextStart = timeToMinutes(next.startTime);
      
      if (currentEnd > nextStart) {
        toast.error("Time slots cannot overlap");
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    if (!validateSlots()) return;

    // Generate a random name internally (user doesn't need to see this)
    const generateSequenceName = () => {
      const adjectives = ["Morning", "Afternoon", "Evening", "Daily", "Weekly", "Custom"];
      const nouns = ["Schedule", "Sequence", "Playlist", "Rotation"];
      const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      return `${randomAdj} ${randomNoun} ${Date.now().toString().slice(-4)}`;
    };

    const newSequence: DaySequence = {
      id: sequence?.id || `seq-${Date.now()}`,
      name: sequence?.name || generateSequenceName(),
      slots: slots.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
    };

    onSave(newSequence);
    toast.success(`Sequence assigned to ${selectedDays.size} day${selectedDays.size > 1 ? "s" : ""}`);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Generate time labels for the timeline
  const generateTimeLabels = () => {
    const labels: { time: string; minutes: number }[] = [];
    for (let hour = 0; hour < 24; hour++) {
      labels.push({
        time: formatTimeDisplay(`${String(hour).padStart(2, "0")}:00`),
        minutes: hour * 60,
      });
    }
    return labels;
  };

  const timeLabels = generateTimeLabels();
  const sortedSlots = [...slots].sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[630px] flex flex-col p-0">
        <div className="p-6 pb-4 border-b">
          <SheetHeader>
            <SheetTitle>Assign Day Sequence</SheetTitle>
            <SheetDescription>
              {selectedDays.size > 0
                ? `Assign sequence to ${selectedDays.size} selected day${selectedDays.size > 1 ? "s" : ""}`
                : "Select days on the calendar to assign a sequence"}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 pt-4 space-y-4 flex-shrink-0">
            {/* Info and Time Interval Control */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>During unallocated time, Default composition will be played</span>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs">Interval:</Label>
                <Input
                  type="number"
                  min="5"
                  max="60"
                  step="5"
                  value={timeInterval}
                  onChange={(e) => setTimeInterval(Math.max(5, Math.min(60, parseInt(e.target.value) || 10)))}
                  className="w-16 h-8 text-xs"
                />
                <span className="text-xs text-muted-foreground">min</span>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Timeline</Label>
                <Button onClick={addSlot} size="sm" variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Time Slot
                </Button>
              </div>
            </div>
          </div>

          {/* Scrollable Timeline Area */}
          <div className="flex-1 overflow-y-auto px-6">
            <div className="border rounded-lg bg-muted/20 overflow-hidden">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="relative" style={{ height: "800px" }}>
                  {/* Time Labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-20 border-r bg-muted/30 flex flex-col">
                    {timeLabels.map((label, idx) => (
                      <div
                        key={idx}
                        className="flex-1 border-b border-border/40 flex items-start justify-end pr-2 pt-1.5"
                        style={{ height: `${100 / 24}%` }}
                      >
                        <span className="text-xs font-medium text-muted-foreground">
                          {label.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Timeline Grid Lines */}
                  <div className="absolute left-20 right-0 top-0 bottom-0">
                    {timeLabels.map((label, idx) => (
                      <div
                        key={idx}
                        className="absolute left-0 right-0 border-b border-border/30"
                        style={{ top: `${(label.minutes / (24 * 60)) * 100}%` }}
                      />
                    ))}
                    {/* Interval lines */}
                    {Array.from({ length: 24 * (60 / timeInterval) }, (_, i) => {
                      const minutes = i * timeInterval;
                      if (minutes % 60 === 0) return null; // Skip hour lines
                      return (
                        <div
                          key={i}
                          className="absolute left-0 right-0 border-b border-dashed border-border/15"
                          style={{ top: `${(minutes / (24 * 60)) * 100}%` }}
                        />
                      );
                    })}
                  </div>

                  {/* Time Slots */}
                  <div className="absolute left-20 right-0 top-0 bottom-0 pl-3 pr-3">
                    <SortableContext
                      items={sortedSlots.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {sortedSlots.map((slot, index) => (
                        <SortableTimelineSlot
                          key={slot.id}
                          slot={slot}
                          index={index}
                          onUpdate={updateSlot}
                          onDelete={() => deleteSlot(slot.id)}
                          isEditing={editingSlotId === slot.id}
                          onEdit={() => setEditingSlotId(slot.id)}
                          onCancelEdit={() => setEditingSlotId(null)}
                          timezone={timezone}
                          allSlots={sortedSlots}
                        />
                      ))}
                    </SortableContext>
                  </div>

                  {/* Drag Overlay */}
                  <DragOverlay>
                    {activeDragId ? (() => {
                      const draggedSlot = sortedSlots.find(s => s.id === activeDragId);
                      if (!draggedSlot) return null;
                      return (
                        <div className="bg-primary/90 border-2 border-primary rounded-md p-2 shadow-lg">
                          <div className="text-xs font-semibold text-primary-foreground">
                            {draggedSlot.contentName || "No content"}
                          </div>
                        </div>
                      );
                    })() : null}
                  </DragOverlay>
                </div>
              </DndContext>
            </div>

            {slots.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  No time slots added yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Click "Add Time Slot" to create your sequence
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions - Always Visible */}
          <div className="flex-shrink-0 p-6 pt-4 border-t bg-background">
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={selectedDays.size === 0}>
                Save Sequence
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
