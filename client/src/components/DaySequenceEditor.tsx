import { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeSlot, mockCompositions } from "@/lib/mockPublishData";
import { toast } from "sonner";

interface DaySequenceEditorProps {
  slots: TimeSlot[];
  onSlotsChange: (slots: TimeSlot[]) => void;
}

export default function DaySequenceEditor({ slots, onSlotsChange }: DaySequenceEditorProps) {
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  const addSlot = () => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      startTime: "09:00",
      endTime: "10:00",
      compositionId: "",
      compositionName: "",
    };
    setEditingSlot(newSlot);
  };

  const saveSlot = (slot: TimeSlot) => {
    if (!slot.compositionId) {
      toast.error("Please select a composition");
      return;
    }

    // Validate time range
    if (slot.startTime >= slot.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    // Check for overlaps
    const hasOverlap = slots.some((s) => {
      if (s.id === slot.id) return false;
      return (
        (slot.startTime >= s.startTime && slot.startTime < s.endTime) ||
        (slot.endTime > s.startTime && slot.endTime <= s.endTime) ||
        (slot.startTime <= s.startTime && slot.endTime >= s.endTime)
      );
    });

    if (hasOverlap) {
      toast.error("Time slot overlaps with existing slot");
      return;
    }

    const updatedSlots = slots.some((s) => s.id === slot.id)
      ? slots.map((s) => (s.id === slot.id ? slot : s))
      : [...slots, slot];

    onSlotsChange(updatedSlots.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    setEditingSlot(null);
    toast.success("Time slot saved");
  };

  const deleteSlot = (id: string) => {
    onSlotsChange(slots.filter((s) => s.id !== id));
    toast.success("Time slot removed");
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDuration = (start: string, end: string) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const durationMinutes = (eh * 60 + em) - (sh * 60 + sm);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    if (hours === 0) return `${minutes}m`;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Day Sequence Timeline</h3>
          <p className="text-sm text-muted-foreground">
            Create a 24-hour schedule with different content at different times
          </p>
        </div>
        <Button onClick={addSlot} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Time Slot
        </Button>
      </div>

      {editingSlot && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">
                {slots.some((s) => s.id === editingSlot.id) ? "Edit" : "New"} Time Slot
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingSlot(null)}
              >
                Cancel
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={editingSlot.startTime}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={editingSlot.endTime}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="composition">Composition</Label>
              <Select
                value={editingSlot.compositionId}
                onValueChange={(value) => {
                  const comp = mockCompositions.find((c) => c.id === value);
                  setEditingSlot({
                    ...editingSlot,
                    compositionId: value,
                    compositionName: comp?.name || "",
                  });
                }}
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
            </div>

            <Button onClick={() => saveSlot(editingSlot)} className="w-full">
              Save Time Slot
            </Button>
          </CardContent>
        </Card>
      )}

      <ScrollArea className="h-[400px] rounded-md border border-border/40">
        <div className="p-4 space-y-2">
          {slots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                No time slots added yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Add Time Slot" to create your day sequence
              </p>
            </div>
          ) : (
            <>
              {/* Timeline visualization */}
              <div className="relative h-12 rounded-lg bg-muted/30 mb-6">
                {slots.map((slot) => {
                  const [sh, sm] = slot.startTime.split(":").map(Number);
                  const [eh, em] = slot.endTime.split(":").map(Number);
                  const startPercent = ((sh * 60 + sm) / (24 * 60)) * 100;
                  const endPercent = ((eh * 60 + em) / (24 * 60)) * 100;
                  const width = endPercent - startPercent;

                  return (
                    <div
                      key={slot.id}
                      className="absolute top-1 bottom-1 rounded bg-primary/80 hover:bg-primary transition-colors cursor-pointer"
                      style={{ left: `${startPercent}%`, width: `${width}%` }}
                      title={`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}: ${slot.compositionName}`}
                    />
                  );
                })}
              </div>

              {/* Slot cards */}
              {slots.map((slot, index) => (
                <Card
                  key={slot.id}
                  className="cursor-pointer transition-all duration-200 hover:border-primary/50"
                  onClick={() => setEditingSlot(slot)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <span className="font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {slot.compositionName}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {getDuration(slot.startTime, slot.endTime)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSlot(slot.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

