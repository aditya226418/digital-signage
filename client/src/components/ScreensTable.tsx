import { MoreVertical, Eye, Settings as SettingsIcon, Power } from "lucide-react";
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

interface Screen {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  currentComposition: string;
  lastSeen: string;
  resolution: string;
}

const mockScreens: Screen[] = [
  {
    id: "1",
    name: "Lobby Display",
    location: "Main Entrance",
    status: "online",
    currentComposition: "Welcome Playlist",
    lastSeen: "Active now",
    resolution: "1920x1080",
  },
  {
    id: "2",
    name: "Conference Room A",
    location: "Floor 2, Room 201",
    status: "online",
    currentComposition: "Meeting Schedule",
    lastSeen: "Active now",
    resolution: "3840x2160",
  },
  {
    id: "3",
    name: "Cafeteria Screen",
    location: "Ground Floor Cafeteria",
    status: "offline",
    currentComposition: "Menu Board",
    lastSeen: "2 hours ago",
    resolution: "1920x1080",
  },
  {
    id: "4",
    name: "Reception Area",
    location: "Main Lobby",
    status: "online",
    currentComposition: "Company Highlights",
    lastSeen: "Active now",
    resolution: "1920x1080",
  },
  {
    id: "5",
    name: "Training Room",
    location: "Floor 3, Room 305",
    status: "offline",
    currentComposition: "Training Materials",
    lastSeen: "1 day ago",
    resolution: "2560x1440",
  },
  {
    id: "6",
    name: "Executive Floor Display",
    location: "Floor 5, Executive Area",
    status: "online",
    currentComposition: "Executive Dashboard",
    lastSeen: "Active now",
    resolution: "3840x2160",
  },
  {
    id: "7",
    name: "Parking Lot Screen",
    location: "Basement Parking",
    status: "online",
    currentComposition: "Parking Info",
    lastSeen: "Active now",
    resolution: "1920x1080",
  },
  {
    id: "8",
    name: "Gym Display",
    location: "Ground Floor Gym",
    status: "offline",
    currentComposition: "Fitness Tips",
    lastSeen: "3 hours ago",
    resolution: "1920x1080",
  },
];

export default function ScreensTable() {
  const columns = [
    {
      key: "name",
      label: "Screen Name",
      render: (screen: Screen) => (
        <div className="font-medium">{screen.name}</div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (screen: Screen) => (
        <div className="text-muted-foreground">{screen.location}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (screen: Screen) => (
        <Badge
          variant={screen.status === "online" ? "default" : "secondary"}
          className={
            screen.status === "online"
              ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
              : "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 dark:text-gray-400"
          }
        >
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
              screen.status === "online" ? "bg-green-500" : "bg-gray-500"
            }`}
          />
          {screen.status === "online" ? "Online" : "Offline"}
        </Badge>
      ),
    },
    {
      key: "currentComposition",
      label: "Current Composition",
      render: (screen: Screen) => (
        <div className="max-w-xs truncate">{screen.currentComposition}</div>
      ),
    },
    {
      key: "resolution",
      label: "Resolution",
      render: (screen: Screen) => (
        <div className="text-sm text-muted-foreground">{screen.resolution}</div>
      ),
    },
    {
      key: "lastSeen",
      label: "Last Seen",
      render: (screen: Screen) => (
        <div className="text-sm text-muted-foreground">{screen.lastSeen}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (screen: Screen) => (
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
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Eye className="h-4 w-4" />
              Live Preview
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
              <Power className="h-4 w-4" />
              Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filterOptions = [
    { key: "status", label: "Online", value: "online" },
    { key: "status", label: "Offline", value: "offline" },
  ];

  return (
    <DataTableView
      data={mockScreens}
      columns={columns}
      searchPlaceholder="Search screens by name, location, or composition..."
      filterOptions={filterOptions}
      actions={
        <Button className="gap-2 transition-all duration-200 hover:shadow-md">
          <Power className="h-4 w-4" />
          Add Screen
        </Button>
      }
    />
  );
}

