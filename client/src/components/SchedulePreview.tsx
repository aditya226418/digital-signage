import { Calendar, Monitor, Repeat, Clock, Sparkles, PlaySquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TimeSlot, mockScreens, mockCompositions } from "@/lib/mockPublishData";

interface SchedulePreviewProps {
  name: string;
  targetScreenIds: string[];
  startDate: string;
  endDate: string;
  recurrence: "once" | "daily" | "weekly" | "monthly";
  priority: "high" | "medium" | "low";
  scheduleType: "simple" | "daySequence" | "campaign";
  contentId?: string;
  daySequenceSlots?: TimeSlot[];
  campaignCompositions?: string[];
  rotationType?: "sequential" | "random" | "weighted";
}

export default function SchedulePreview({
  name,
  targetScreenIds,
  startDate,
  endDate,
  recurrence,
  priority,
  scheduleType,
  contentId,
  daySequenceSlots = [],
  campaignCompositions = [],
  rotationType,
}: SchedulePreviewProps) {
  const getScreenNames = () => {
    const screens = mockScreens.filter((s) => targetScreenIds.includes(s.id));
    return screens.map((s) => s.name).join(", ");
  };

  const getContentName = () => {
    if (scheduleType === "simple" && contentId) {
      return mockCompositions.find((c) => c.id === contentId)?.name || "Unknown";
    }
    return "";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not set";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const priorityConfig = {
    high: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
    medium: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    low: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Schedule Preview</h3>
        <p className="text-sm text-muted-foreground">
          Review your schedule before publishing
        </p>
      </div>

      <div className="space-y-4">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Schedule Name:</span>
              <span className="text-sm font-medium text-right">{name || "Untitled Schedule"}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Start Date:</span>
              <span className="text-sm font-medium text-right">{formatDate(startDate)}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">End Date:</span>
              <span className="text-sm font-medium text-right">{formatDate(endDate)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Recurrence:</span>
              <Badge variant="outline" className="capitalize">
                <Repeat className="h-3 w-3 mr-1" />
                {recurrence}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Priority:</span>
              <Badge variant="outline" className={`capitalize ${priorityConfig[priority]}`}>
                {priority}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Target Screens */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Target Screens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Selected Screens:</span>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">
                  {targetScreenIds.length} {targetScreenIds.length === 1 ? "screen" : "screens"}
                </Badge>
                <p className="text-sm font-medium">{getScreenNames()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PlaySquare className="h-4 w-4" />
              Content Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Schedule Type:</span>
              <Badge variant="outline" className="capitalize">
                {scheduleType === "daySequence" ? "Day Sequence" : scheduleType}
              </Badge>
            </div>

            {scheduleType === "simple" && contentId && (
              <>
                <Separator />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">Composition:</span>
                  <span className="text-sm font-medium text-right">{getContentName()}</span>
                </div>
              </>
            )}

            {scheduleType === "daySequence" && daySequenceSlots.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Time Slots ({daySequenceSlots.length})
                  </span>
                  <div className="space-y-1 pl-5">
                    {daySequenceSlots.slice(0, 3).map((slot) => (
                      <div
                        key={slot.id}
                        className="text-xs text-muted-foreground flex justify-between"
                      >
                        <span>
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                        <span className="font-medium">{slot.compositionName}</span>
                      </div>
                    ))}
                    {daySequenceSlots.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{daySequenceSlots.length - 3} more slots
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {scheduleType === "campaign" && campaignCompositions.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      Campaign
                    </span>
                    <Badge variant="outline" className="capitalize text-xs">
                      {rotationType}
                    </Badge>
                  </div>
                  <div className="space-y-1 pl-5">
                    <p className="text-xs text-muted-foreground">
                      {campaignCompositions.length} compositions in rotation
                    </p>
                    {campaignCompositions.slice(0, 3).map((compId) => {
                      const comp = mockCompositions.find((c) => c.id === compId);
                      return (
                        <div key={compId} className="text-xs text-muted-foreground">
                          • {comp?.name || "Unknown"}
                        </div>
                      );
                    })}
                    {campaignCompositions.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{campaignCompositions.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

