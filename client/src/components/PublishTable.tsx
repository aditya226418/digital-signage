import { useState } from "react";
import { MoreVertical, Play, Pause, Calendar, Edit, Trash2, Send, X, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTableView from "./DataTableView";
import PublishModeSelector from "./PublishModeSelector";
import PublishDirectModal from "./PublishDirectModal";
import PublishDefaultModal from "./PublishDefaultModal";
import CreateScheduleWizard from "./CreateScheduleWizard";
import { usePublishStore } from "@/hooks/usePublishStore";
import { DirectPublish, PlannedSchedule } from "@/lib/mockPublishData";
import { toast } from "sonner";

export default function PublishTable() {
  const [activeTab, setActiveTab] = useState("direct");
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const [showPlannedModal, setShowPlannedModal] = useState(false);
  const [plannedScheduleType, setPlannedScheduleType] = useState<"simple" | "daySequence">("simple");

  const {
    directPublishes,
    plannedSchedules,
    removeDirectPublish,
    pauseDirectPublish,
    resumeDirectPublish,
    removePlannedSchedule,
    pausePlannedSchedule,
    resumePlannedSchedule,
  } = usePublishStore();

  const handleStartPublish = () => {
    setShowModeSelector(true);
  };

  const handleSelectDirect = () => {
    setShowDirectModal(true);
  };

  const handleSelectDefault = () => {
    setShowDefaultModal(true);
  };

  const handleSelectPlanned = (type: "simple" | "daySequence") => {
    setPlannedScheduleType(type);
    setShowPlannedModal(true);
  };

  // Direct Publishing Columns
  const directColumns = [
    {
      key: "content",
      label: "Content",
      render: (publish: DirectPublish) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            {publish.contentName}
          </div>
          <div className="text-xs text-muted-foreground capitalize">{publish.contentType}</div>
        </div>
      ),
    },
    {
      key: "screens",
      label: "Target Screens",
      render: (publish: DirectPublish) => (
        <div>
          <div className="font-medium">{publish.targetScreens.length} screens</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
            {publish.screenNames}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (publish: DirectPublish) => {
        const statusConfig = {
          active: {
            color: "bg-green-500/10 text-green-700 dark:text-green-400",
            dot: "bg-green-500 animate-pulse",
            label: "Active",
          },
          paused: {
            color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
            dot: "bg-orange-500",
            label: "Paused",
          },
          completed: {
            color: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
            dot: "bg-gray-500",
            label: "Completed",
          },
        };

        const config = statusConfig[publish.status];

        return (
          <Badge variant="secondary" className={config.color}>
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "duration",
      label: "Duration",
      render: (publish: DirectPublish) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 font-medium">
            <Clock className="h-3 w-3" />
            <span>{publish.duration === -1 ? "Indefinite" : `${publish.duration} min`}</span>
          </div>
          {publish.remainingTime !== undefined && 
           publish.status === "active" && 
           publish.duration !== -1 && (
            <div className="text-xs text-muted-foreground mt-1">
              {publish.remainingTime} min left
            </div>
          )}
        </div>
      ),
    },
    {
      key: "options",
      label: "Options",
      render: (publish: DirectPublish) => (
        <div className="flex gap-1 flex-wrap">
          {publish.override && (
            <Badge variant="outline" className="text-xs">
              Override
            </Badge>
          )}
          {publish.isDefault && (
            <Badge variant="outline" className="text-xs">
              Default
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "publishedBy",
      label: "Published By",
      render: (publish: DirectPublish) => (
        <div className="text-sm text-muted-foreground">{publish.publishedBy}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (publish: DirectPublish) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-all duration-200 hover:bg-accent"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {publish.status === "paused" ? (
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => {
                  resumeDirectPublish(publish.id);
                  toast.success("Quickplay resumed");
                }}
              >
                <Play className="h-4 w-4" />
                Resume
              </DropdownMenuItem>
            ) : publish.status === "active" ? (
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => {
                  pauseDirectPublish(publish.id);
                  toast.info("Quickplay paused");
                }}
              >
                <Pause className="h-4 w-4" />
                Pause
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              onClick={() => {
                removeDirectPublish(publish.id);
                toast.success("Quickplay cancelled");
              }}
            >
              <X className="h-4 w-4" />
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Planned Publishing Columns
  const plannedColumns = [
    {
      key: "name",
      label: "Schedule Name",
      render: (schedule: PlannedSchedule) => (
        <div>
          <div className="font-medium">{schedule.name}</div>
          <div className="text-xs text-muted-foreground">{schedule.contentName}</div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (schedule: PlannedSchedule) => (
        <Badge variant="outline" className="capitalize">
          {schedule.type === "daySequence" ? "Day Sequence" : schedule.type}
        </Badge>
      ),
    },
    {
      key: "screens",
      label: "Screens",
      render: (schedule: PlannedSchedule) => (
        <div>
          <div className="font-medium">{schedule.targetScreens.length} screens</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
            {schedule.screenNames}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (schedule: PlannedSchedule) => {
        const statusConfig = {
          active: {
            color: "bg-green-500/10 text-green-700 dark:text-green-400",
            dot: "bg-green-500",
            label: "Active",
          },
          scheduled: {
            color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
            dot: "bg-blue-500",
            label: "Scheduled",
          },
          paused: {
            color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
            dot: "bg-orange-500",
            label: "Paused",
          },
          completed: {
            color: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
            dot: "bg-gray-500",
            label: "Completed",
          },
          pending_approval: {
            color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
            dot: "bg-yellow-500",
            label: "Pending Approval",
          },
        };

        const config = statusConfig[schedule.status];

        return (
          <Badge variant="secondary" className={config.color}>
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "schedule",
      label: "Schedule",
      render: (schedule: PlannedSchedule) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span className="text-xs">{schedule.startDate}</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            to {schedule.endDate}
          </div>
        </div>
      ),
    },
    {
      key: "recurrence",
      label: "Recurrence",
      render: (schedule: PlannedSchedule) => (
        <Badge variant="outline" className="capitalize">
          {schedule.recurrence}
        </Badge>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (schedule: PlannedSchedule) => {
        const priorityConfig = {
          high: "text-red-600 dark:text-red-400",
          medium: "text-yellow-600 dark:text-yellow-400",
          low: "text-blue-600 dark:text-blue-400",
        };

        return (
          <span className={`text-sm font-medium capitalize ${priorityConfig[schedule.priority]}`}>
            {schedule.priority}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (schedule: PlannedSchedule) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 transition-all duration-200 hover:bg-accent"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {schedule.status === "paused" ? (
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => {
                  resumePlannedSchedule(schedule.id);
                  toast.success("Schedule resumed");
                }}
              >
                <Play className="h-4 w-4" />
                Resume
              </DropdownMenuItem>
            ) : schedule.status === "active" || schedule.status === "scheduled" ? (
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => {
                  pausePlannedSchedule(schedule.id);
                  toast.info("Schedule paused");
                }}
              >
                <Pause className="h-4 w-4" />
                Pause
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Edit className="h-4 w-4" />
              Edit Schedule
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Calendar className="h-4 w-4" />
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              onClick={() => {
                removePlannedSchedule(schedule.id);
                toast.success("Schedule deleted");
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const directFilterOptions = [
    { key: "status", label: "Active", value: "active" },
    { key: "status", label: "Paused", value: "paused" },
    { key: "status", label: "Completed", value: "completed" },
    { key: "contentType", label: "Media", value: "media" },
    { key: "contentType", label: "Composition", value: "composition" },
    { key: "contentType", label: "Campaign", value: "campaign" },
  ];

  const plannedFilterOptions = [
    { key: "status", label: "Active", value: "active" },
    { key: "status", label: "Scheduled", value: "scheduled" },
    { key: "status", label: "Paused", value: "paused" },
    { key: "status", label: "Completed", value: "completed" },
    { key: "status", label: "Pending Approval", value: "pending_approval" },
    { key: "type", label: "Simple", value: "simple" },
    { key: "type", label: "Day Sequence", value: "daySequence" },
    { key: "priority", label: "High Priority", value: "high" },
    { key: "priority", label: "Medium Priority", value: "medium" },
    { key: "priority", label: "Low Priority", value: "low" },
    { key: "recurrence", label: "Once", value: "once" },
    { key: "recurrence", label: "Daily", value: "daily" },
    { key: "recurrence", label: "Weekly", value: "weekly" },
    { key: "recurrence", label: "Monthly", value: "monthly" },
  ];

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="direct" className="gap-2">
              <Zap className="h-4 w-4" />
              Direct
              {directPublishes.filter((p) => p.status === "active").length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-green-500/10 text-green-700 dark:text-green-400">
                  {directPublishes.filter((p) => p.status === "active").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="planned" className="gap-2">
              <Calendar className="h-4 w-4" />
              Planned
              {plannedSchedules.filter((s) => s.status === "active" || s.status === "scheduled").length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {plannedSchedules.filter((s) => s.status === "active" || s.status === "scheduled").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={handleStartPublish}
            className="gap-2 transition-all duration-200 hover:shadow-md"
          >
          <Send className="h-4 w-4" />
            Start Publish
        </Button>
        </div>

        <TabsContent value="direct" className="mt-0">
          <DataTableView
            data={directPublishes}
            columns={directColumns}
            searchPlaceholder="Search quickplays, content, or screens..."
            filterOptions={directFilterOptions}
            showHeader={false}
          />
        </TabsContent>

        <TabsContent value="planned" className="mt-0">
          <DataTableView
            data={plannedSchedules}
            columns={plannedColumns}
            searchPlaceholder="Search schedules, content, or screens..."
            filterOptions={plannedFilterOptions}
            showHeader={false}
          />
        </TabsContent>
      </Tabs>

      <PublishModeSelector
        open={showModeSelector}
        onOpenChange={setShowModeSelector}
        onSelectDirect={handleSelectDirect}
        onSelectDefault={handleSelectDefault}
        onSelectPlanned={handleSelectPlanned}
      />

      <PublishDirectModal open={showDirectModal} onOpenChange={setShowDirectModal} />

      <PublishDefaultModal open={showDefaultModal} onOpenChange={setShowDefaultModal} />

      <CreateScheduleWizard 
        open={showPlannedModal} 
        onOpenChange={setShowPlannedModal}
        initialType={plannedScheduleType}
      />
    </>
  );
}
