import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { DaySequence } from "@/lib/mockPublishData";

interface DaySequenceCalendarProps {
  currentMonth: Date;
  selectedDays: Set<string>;
  daySequences: Map<string, DaySequence>;
  onMonthChange: (month: Date) => void;
  onDaySelect: (date: Date, event: React.MouseEvent) => void;
}

export default function DaySequenceCalendar({
  currentMonth,
  selectedDays,
  daySequences,
  onMonthChange,
  onDaySelect,
}: DaySequenceCalendarProps) {
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfMonth(currentMonth);
  const calendarEnd = endOfMonth(currentMonth);
  
  // Get first day of week for the month (0 = Sunday)
  const firstDayOfWeek = getDay(monthStart);
  
  // Get all days to display (including padding days from previous/next month)
  const daysToShow: Date[] = [];
  
  // Add days from previous month to fill the first week
  const prevMonthEnd = new Date(monthStart);
  prevMonthEnd.setDate(0); // Last day of previous month
  const daysFromPrevMonth = firstDayOfWeek;
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const date = new Date(prevMonthEnd);
    date.setDate(prevMonthEnd.getDate() - i);
    daysToShow.push(date);
  }
  
  // Add all days from current month
  const currentMonthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  daysToShow.push(...currentMonthDays);
  
  // Add days from next month to fill the last week
  const remainingDays = 42 - daysToShow.length; // 6 weeks * 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(monthEnd);
    date.setDate(monthEnd.getDate() + i);
    daysToShow.push(date);
  }

  const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  const handlePreviousMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  const handleMonthYearSelect = (date: Date | undefined) => {
    if (date) {
      onMonthChange(date);
      setMonthPickerOpen(false);
    }
  };

  const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="space-y-2">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(currentMonth, "MMMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={currentMonth}
                onSelect={handleMonthYearSelect}
                defaultMonth={currentMonth}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden bg-card">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b bg-muted/30">
          {weekdayLabels.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-muted-foreground py-3 border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="divide-y">
          {Array.from({ length: 6 }, (_, weekIndex) => {
            const weekDays = daysToShow.slice(weekIndex * 7, (weekIndex + 1) * 7);
            if (weekDays.length === 0) return null;
            
            return (
              <div key={weekIndex} className="grid grid-cols-7 divide-x last:divide-y-0">
                {weekDays.map((date, dayIndex) => {
                  const dateKey = formatDateKey(date);
                  const isCurrentMonth = isSameMonth(date, currentMonth);
                  const isSelected = selectedDays.has(dateKey);
                  const hasSequence = daySequences.has(dateKey);
                  const isCurrentDay = isToday(date);
                  const sequence = hasSequence ? daySequences.get(dateKey) : null;

                  return (
                    <TooltipProvider key={dayIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => onDaySelect(date, e)}
                            className={cn(
                              "relative h-14 flex flex-col items-center justify-center text-sm transition-all",
                              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset",
                              !isCurrentMonth && "text-muted-foreground/30 bg-muted/20",
                              isCurrentDay && !isSelected && "bg-accent/50 font-semibold hover:bg-accent/70",
                              isSelected && "bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90",
                              !isSelected && isCurrentMonth && "hover:bg-accent/50",
                              hasSequence && !isSelected && "border-l-2 border-l-primary bg-primary/5"
                            )}
                          >
                            <span className={cn(
                              "text-sm",
                              isCurrentDay && !isSelected && "text-primary font-bold"
                            )}>
                              {format(date, "d")}
                            </span>
                            {hasSequence && (
                              <div className="absolute bottom-1 right-1 flex items-center justify-center gap-0.5">
                                <Clock className="h-2.5 w-2.5 text-primary" />
                                {sequence && sequence.slots.length > 0 && (
                                  <span className="text-[10px] font-medium text-primary">
                                    {sequence.slots.length}
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                        </TooltipTrigger>
                        {hasSequence && sequence && (
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">{sequence.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {sequence.slots.length} time slot{sequence.slots.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

