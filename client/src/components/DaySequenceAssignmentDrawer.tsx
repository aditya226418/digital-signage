import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
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
import TimelineSlotEditor from "./TimelineSlotEditor";
import { TimeSlot, DaySequence } from "@/lib/mockPublishData";
import { toast } from "sonner";

interface DaySequenceAssignmentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDays: Set<string>;
  sequence: DaySequence | null;
  onSave: (sequence: DaySequence) => void;
  timezone?: string;
}

export default function DaySequenceAssignmentDrawer({
  open,
  onOpenChange,
  selectedDays,
  sequence,
  onSave,
  timezone = "org-default",
}: DaySequenceAssignmentDrawerProps) {
  const [sequenceName, setSequenceName] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (sequence) {
      setSequenceName(sequence.name);
      setSlots(sequence.slots);
    } else {
      setSequenceName("");
      setSlots([]);
    }
  }, [sequence, open]);

  const addSlot = () => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      startTime: "09:00",
      endTime: "10:00",
      contentType: "composition",
      contentId: "",
      contentName: "",
    };
    setSlots([...slots, newSlot]);
  };

  const updateSlot = (updatedSlot: TimeSlot) => {
    setSlots(slots.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)));
  };

  const deleteSlot = (slotId: string) => {
    setSlots(slots.filter((s) => s.id !== slotId));
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
    const sortedSlots = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const current = sortedSlots[i];
      const next = sortedSlots[i + 1];
      if (current.endTime > next.startTime) {
        toast.error("Time slots cannot overlap");
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    if (!validateSlots()) return;

    const newSequence: DaySequence = {
      id: sequence?.id || `seq-${Date.now()}`,
      name: sequenceName || `Sequence for ${selectedDays.size} day${selectedDays.size > 1 ? "s" : ""}`,
      slots: slots.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    };

    onSave(newSequence);
    toast.success(`Sequence assigned to ${selectedDays.size} day${selectedDays.size > 1 ? "s" : ""}`);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Assign Day Sequence</SheetTitle>
          <SheetDescription>
            {selectedDays.size > 0
              ? `Assign sequence to ${selectedDays.size} selected day${selectedDays.size > 1 ? "s" : ""}`
              : "Select days on the calendar to assign a sequence"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Sequence Name */}
          <div className="space-y-2">
            <Label htmlFor="sequenceName">Sequence Name</Label>
            <Input
              id="sequenceName"
              value={sequenceName}
              onChange={(e) => setSequenceName(e.target.value)}
              placeholder="e.g., Morning Schedule"
            />
          </div>

          {/* Timeline Visualization */}
          {slots.length > 0 && (
            <div className="space-y-2">
              <Label>Timeline</Label>
              <div className="relative h-16 rounded-lg bg-muted/30 border border-border/40 p-2">
                {slots.map((slot) => {
                  const [sh, sm] = slot.startTime.split(":").map(Number);
                  const [eh, em] = slot.endTime.split(":").map(Number);
                  const startPercent = ((sh * 60 + sm) / (24 * 60)) * 100;
                  const endPercent = ((eh * 60 + em) / (24 * 60)) * 100;
                  const width = endPercent - startPercent;

                  return (
                    <div
                      key={slot.id}
                      className="absolute top-2 bottom-2 rounded bg-primary/80 hover:bg-primary transition-colors"
                      style={{ left: `${startPercent}%`, width: `${width}%` }}
                      title={slot.contentName}
                    />
                  );
                })}
                {/* Time markers */}
                {[0, 6, 12, 18, 24].map((hour) => (
                  <div
                    key={hour}
                    className="absolute top-0 bottom-0 w-px bg-border/50"
                    style={{ left: `${(hour / 24) * 100}%` }}
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                      {hour === 24 ? "24:00" : `${hour}:00`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Slots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Time Slots</Label>
              <Button onClick={addSlot} size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Time Slot
              </Button>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-3 pr-4">
                {slots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      No time slots added yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click "Add Time Slot" to create your sequence
                    </p>
                  </div>
                ) : (
                  slots.map((slot) => (
                    <TimelineSlotEditor
                      key={slot.id}
                      slot={slot}
                      onUpdate={updateSlot}
                      onDelete={() => deleteSlot(slot.id)}
                      timezone={timezone}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={selectedDays.size === 0}>
              Save Sequence
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

