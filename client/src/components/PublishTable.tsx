import { MoreVertical, Play, Pause, Calendar, Edit, Trash2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTableView from "./DataTableView";

interface PublishSchedule {
  id: string;
  name: string;
  composition: string;
  screens: number;
  screenNames: string;
  status: "active" | "scheduled" | "paused" | "completed";
  startDate: string;
  endDate: string;
  repeatType: "once" | "daily" | "weekly" | "monthly";
  priority: "high" | "medium" | "low";
  createdBy: string;
}

const mockPublishData: PublishSchedule[] = [
  {
    id: "1",
    name: "Morning Welcome Campaign",
    composition: "Welcome Playlist",
    screens: 5,
    screenNames: "Lobby Display, Reception Area, +3 more",
    status: "active",
    startDate: "2024-03-15 08:00",
    endDate: "2024-03-15 12:00",
    repeatType: "daily",
    priority: "high",
    createdBy: "John Doe",
  },
  {
    id: "2",
    name: "Product Showcase - Afternoon",
    composition: "Product Showcase",
    screens: 3,
    screenNames: "Conference Room A, Cafeteria Screen, Training Room",
    status: "active",
    startDate: "2024-03-15 12:00",
    endDate: "2024-03-15 18:00",
    repeatType: "daily",
    priority: "medium",
    createdBy: "Sarah Smith",
  },
  {
    id: "3",
    name: "Weekend Special Promo",
    composition: "Promotional Content",
    screens: 7,
    screenNames: "All Screens",
    status: "scheduled",
    startDate: "2024-03-16 00:00",
    endDate: "2024-03-17 23:59",
    repeatType: "weekly",
    priority: "high",
    createdBy: "Mike Johnson",
  },
  {
    id: "4",
    name: "Training Session Materials",
    composition: "Training Materials",
    screens: 2,
    screenNames: "Training Room, Conference Room A",
    status: "paused",
    startDate: "2024-03-14 14:00",
    endDate: "2024-03-14 17:00",
    repeatType: "once",
    priority: "low",
    createdBy: "John Doe",
  },
  {
    id: "5",
    name: "Company News - March",
    composition: "Company News",
    screens: 8,
    screenNames: "All Screens",
    status: "active",
    startDate: "2024-03-01 00:00",
    endDate: "2024-03-31 23:59",
    repeatType: "monthly",
    priority: "medium",
    createdBy: "Sarah Smith",
  },
  {
    id: "6",
    name: "Lunch Menu Display",
    composition: "Menu Board",
    screens: 1,
    screenNames: "Cafeteria Screen",
    status: "completed",
    startDate: "2024-03-10 11:00",
    endDate: "2024-03-10 14:00",
    repeatType: "daily",
    priority: "low",
    createdBy: "Mike Johnson",
  },
];

export default function PublishTable() {
  const columns = [
    {
      key: "name",
      label: "Campaign Name",
      render: (schedule: PublishSchedule) => (
        <div>
          <div className="font-medium">{schedule.name}</div>
          <div className="text-xs text-muted-foreground">{schedule.composition}</div>
        </div>
      ),
    },
    {
      key: "screens",
      label: "Screens",
      render: (schedule: PublishSchedule) => (
        <div>
          <div className="font-medium">{schedule.screens} screens</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
            {schedule.screenNames}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (schedule: PublishSchedule) => {
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
      render: (schedule: PublishSchedule) => (
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
      key: "repeatType",
      label: "Repeat",
      render: (schedule: PublishSchedule) => (
        <Badge variant="outline" className="capitalize">
          {schedule.repeatType}
        </Badge>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (schedule: PublishSchedule) => {
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
      key: "createdBy",
      label: "Created By",
      render: (schedule: PublishSchedule) => (
        <div className="text-sm text-muted-foreground">{schedule.createdBy}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (schedule: PublishSchedule) => (
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
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Play className="h-4 w-4" />
                Resume
              </DropdownMenuItem>
            ) : schedule.status === "active" ? (
              <DropdownMenuItem className="gap-2 cursor-pointer">
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
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filterOptions = [
    { key: "status", label: "Active", value: "active" },
    { key: "status", label: "Scheduled", value: "scheduled" },
    { key: "status", label: "Paused", value: "paused" },
    { key: "status", label: "Completed", value: "completed" },
    { key: "priority", label: "High Priority", value: "high" },
    { key: "priority", label: "Medium Priority", value: "medium" },
    { key: "priority", label: "Low Priority", value: "low" },
    { key: "repeatType", label: "Once", value: "once" },
    { key: "repeatType", label: "Daily", value: "daily" },
    { key: "repeatType", label: "Weekly", value: "weekly" },
    { key: "repeatType", label: "Monthly", value: "monthly" },
  ];

  return (
    <DataTableView
      data={mockPublishData}
      columns={columns}
      searchPlaceholder="Search campaigns, compositions, or screens..."
      filterOptions={filterOptions}
      actions={
        <Button className="gap-2 transition-all duration-200 hover:shadow-md">
          <Send className="h-4 w-4" />
          New Campaign
        </Button>
      }
    />
  );
}

