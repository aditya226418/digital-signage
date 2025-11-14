import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DaySelectionShortcutsProps {
  currentMonth: Date;
  selectedDays: Set<string>;
  onSelectWeekdays: () => void;
  onSelectWeekends: () => void;
  onSelectEntireMonth: () => void;
  onClearSelection: () => void;
}

export default function DaySelectionShortcuts({
  currentMonth,
  selectedDays,
  onSelectWeekdays,
  onSelectWeekends,
  onSelectEntireMonth,
  onClearSelection,
}: DaySelectionShortcutsProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { firstDay, lastDay, daysInMonth: lastDay.getDate() };
  };

  const getWeekdaysInMonth = () => {
    const { firstDay, lastDay } = getDaysInMonth(currentMonth);
    const weekdays: Date[] = [];
    const current = new Date(firstDay);
    
    while (current <= lastDay) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
        weekdays.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return weekdays;
  };

  const getWeekendsInMonth = () => {
    const { firstDay, lastDay } = getDaysInMonth(currentMonth);
    const weekends: Date[] = [];
    const current = new Date(firstDay);
    
    while (current <= lastDay) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
        weekends.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return weekends;
  };

  const getAllDaysInMonth = () => {
    const { firstDay, lastDay } = getDaysInMonth(currentMonth);
    const days: Date[] = [];
    const current = new Date(firstDay);
    
    while (current <= lastDay) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const handleSelectWeekdays = () => {
    const weekdays = getWeekdaysInMonth();
    onSelectWeekdays();
  };

  const handleSelectWeekends = () => {
    const weekends = getWeekendsInMonth();
    onSelectWeekends();
  };

  const handleSelectEntireMonth = () => {
    const allDays = getAllDaysInMonth();
    onSelectEntireMonth();
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground font-medium mr-1">Quick Select:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSelectWeekdays}
        className="h-8 text-xs"
      >
        Select All Weekdays
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSelectWeekends}
        className="h-8 text-xs"
      >
        Select All Weekends
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSelectEntireMonth}
        className="h-8 text-xs"
      >
        Select Entire Month
      </Button>
      {selectedDays.size > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          className="h-8 text-xs gap-1.5"
        >
          <X className="h-3 w-3" />
          Clear ({selectedDays.size})
        </Button>
      )}
    </div>
  );
}

