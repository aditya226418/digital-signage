import { useState, useEffect, useRef } from "react";
import { format, startOfMonth, eachDayOfInterval, endOfMonth, getDay } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import DaySequenceCalendar from "./DaySequenceCalendar";
import DaySequenceTimezoneSelect from "./DaySequenceTimezoneSelect";
import DaySelectionShortcuts from "./DaySelectionShortcuts";
import DaySequenceAssignmentDrawer from "./DaySequenceAssignmentDrawer";
import { TimeSlot, DaySequence } from "@/lib/mockPublishData";
import { toast } from "sonner";

interface DaySequenceEditorProps {
  slots: TimeSlot[];
  onSlotsChange: (slots: TimeSlot[]) => void;
}

export default function DaySequenceEditor({ slots, onSlotsChange }: DaySequenceEditorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [timezone, setTimezone] = useState<string>("org-default");
  const [daySequences, setDaySequences] = useState<Map<string, DaySequence>>(new Map());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSequence, setEditingSequence] = useState<DaySequence | null>(null);
  const lastSelectedDayRef = useRef<string | null>(null);

  // Convert legacy slots to day sequences format on mount
  useEffect(() => {
    if (slots.length > 0 && daySequences.size === 0) {
      // If we have legacy slots, create a default sequence for today
      const today = format(new Date(), "yyyy-MM-dd");
      const legacySequence: DaySequence = {
        id: `seq-${Date.now()}`,
        name: "Default Sequence",
        slots: slots.map((slot) => ({
          ...slot,
          contentType: slot.contentType || (slot.compositionId ? "composition" : "media"),
          contentId: slot.contentId || slot.compositionId || "",
          contentName: slot.contentName || slot.compositionName || "",
        })),
      };
      setDaySequences(new Map([[today, legacySequence]]));
    }
  }, [slots, daySequences.size]);

  const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  const handleDaySelect = (date: Date, event: React.MouseEvent) => {
    const dateKey = formatDateKey(date);
    const newSelected = new Set(selectedDays);

    if (event.shiftKey && lastSelectedDayRef.current) {
      // Range selection
      let start = new Date(lastSelectedDayRef.current);
      let end = new Date(dateKey);
      if (start > end) {
        const temp = start;
        start = end;
        end = temp;
      }

      const range = eachDayOfInterval({ start, end });
      range.forEach((day) => {
        newSelected.add(formatDateKey(day));
      });
    } else if (event.metaKey || event.ctrlKey) {
      // Multi-select: toggle individual day
      if (newSelected.has(dateKey)) {
        newSelected.delete(dateKey);
      } else {
        newSelected.add(dateKey);
      }
    } else {
      // Single select: toggle selection
      if (newSelected.has(dateKey)) {
        newSelected.delete(dateKey);
      } else {
        newSelected.add(dateKey);
      }
    }

    setSelectedDays(newSelected);
    lastSelectedDayRef.current = dateKey;
  };

  const handleAddDaySequence = () => {
    if (selectedDays.size === 0) {
      toast.error("Please select at least one day");
      return;
    }

    // Check if any selected day has an existing sequence
    const existingSequenceKey = Array.from(selectedDays).find((key) => daySequences.has(key));
    if (existingSequenceKey) {
      setEditingSequence(daySequences.get(existingSequenceKey) || null);
    } else {
      setEditingSequence(null);
    }
    setIsDrawerOpen(true);
  };

  const handleSelectWeekdays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const weekdays = days.filter((day) => {
      const dayOfWeek = getDay(day);
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
    });

    const newSelected = new Set(selectedDays);
    weekdays.forEach((day) => {
      newSelected.add(formatDateKey(day));
    });
    setSelectedDays(newSelected);
  };

  const handleSelectWeekends = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const weekends = days.filter((day) => {
      const dayOfWeek = getDay(day);
      return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    });

    const newSelected = new Set(selectedDays);
    weekends.forEach((day) => {
      newSelected.add(formatDateKey(day));
    });
    setSelectedDays(newSelected);
  };

  const handleSelectEntireMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const newSelected = new Set<string>();
    days.forEach((day) => {
      newSelected.add(formatDateKey(day));
    });
    setSelectedDays(newSelected);
  };

  const handleClearSelection = () => {
    setSelectedDays(new Set());
    setIsDrawerOpen(false);
    setEditingSequence(null);
  };

  const handleSaveSequence = (sequence: DaySequence) => {
    const newSequences = new Map(daySequences);
    
    // Assign sequence to all selected days
    selectedDays.forEach((dateKey) => {
      // Check if day already has a sequence
      if (newSequences.has(dateKey) && !editingSequence) {
        // Show confirmation would go here, but for now just replace
      }
      newSequences.set(dateKey, {
        ...sequence,
        id: `${sequence.id}-${dateKey}`, // Unique ID per day
      });
    });

    setDaySequences(newSequences);
    
    // Update parent component with slots from the sequence
    // For backward compatibility, use the first selected day's sequence
    if (selectedDays.size > 0) {
      const firstDay = Array.from(selectedDays)[0];
      const savedSequence = newSequences.get(firstDay);
      if (savedSequence) {
        onSlotsChange(savedSequence.slots);
      }
    }

    setIsDrawerOpen(false);
    setSelectedDays(new Set());
    setEditingSequence(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold mb-0.5">Day Sequence Schedule</h3>
          <p className="text-xs text-muted-foreground">
            Select days on the calendar and assign time-based sequences with content
          </p>
        </div>
        <DaySequenceTimezoneSelect
          timezone={timezone}
          onTimezoneChange={setTimezone}
        />
      </div>

      {/* Selection Shortcuts and CTA */}
      <div className="flex items-center justify-between gap-4 flex-wrap min-h-[40px]">
        <DaySelectionShortcuts
          currentMonth={currentMonth}
          selectedDays={selectedDays}
          onSelectWeekdays={handleSelectWeekdays}
          onSelectWeekends={handleSelectWeekends}
          onSelectEntireMonth={handleSelectEntireMonth}
          onClearSelection={handleClearSelection}
        />
        <div className="min-w-[200px] h-[40px] flex items-center justify-end">
          {selectedDays.size > 0 && (
            <Button onClick={handleAddDaySequence} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Day Sequence {selectedDays.size > 1 ? `(${selectedDays.size} days)` : ""}
            </Button>
          )}
        </div>
      </div>

      {/* Calendar */}
      <DaySequenceCalendar
        currentMonth={currentMonth}
        selectedDays={selectedDays}
        daySequences={daySequences}
        onMonthChange={setCurrentMonth}
        onDaySelect={handleDaySelect}
      />

      {/* Assignment Drawer */}
      <DaySequenceAssignmentDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedDays={selectedDays}
        sequence={editingSequence}
        onSave={handleSaveSequence}
        timezone={timezone}
      />
    </div>
  );
}
