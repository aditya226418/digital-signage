import { MoreVertical, Play, Edit, Copy, Trash2, Plus } from "lucide-react";
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

interface Playlist {
  id: string;
  name: string;
  itemCount: number;
  duration: string;
  createdBy: string;
  createdDate: string;
  status: "active" | "draft";
  screens: number;
}

interface Layout {
  id: string;
  name: string;
  zones: number;
  resolution: string;
  createdBy: string;
  createdDate: string;
  type: "single" | "multi-zone" | "grid";
  usedBy: number;
}

const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Welcome Playlist",
    itemCount: 8,
    duration: "15:30",
    createdBy: "John Doe",
    createdDate: "2024-03-15",
    status: "active",
    screens: 5,
  },
  {
    id: "2",
    name: "Product Showcase",
    itemCount: 12,
    duration: "22:45",
    createdBy: "Sarah Smith",
    createdDate: "2024-03-14",
    status: "active",
    screens: 3,
  },
  {
    id: "3",
    name: "Company News",
    itemCount: 5,
    duration: "8:20",
    createdBy: "Mike Johnson",
    createdDate: "2024-03-13",
    status: "active",
    screens: 7,
  },
  {
    id: "4",
    name: "Promotional Content",
    itemCount: 15,
    duration: "30:00",
    createdBy: "John Doe",
    createdDate: "2024-03-12",
    status: "draft",
    screens: 0,
  },
  {
    id: "5",
    name: "Training Materials",
    itemCount: 6,
    duration: "18:15",
    createdBy: "Sarah Smith",
    createdDate: "2024-03-10",
    status: "active",
    screens: 2,
  },
];

const mockLayouts: Layout[] = [
  {
    id: "1",
    name: "Full Screen Banner",
    zones: 1,
    resolution: "1920x1080",
    createdBy: "John Doe",
    createdDate: "2024-03-15",
    type: "single",
    usedBy: 8,
  },
  {
    id: "2",
    name: "Split Screen Dual",
    zones: 2,
    resolution: "1920x1080",
    createdBy: "Sarah Smith",
    createdDate: "2024-03-14",
    type: "multi-zone",
    usedBy: 5,
  },
  {
    id: "3",
    name: "Grid 2x2",
    zones: 4,
    resolution: "1920x1080",
    createdBy: "Mike Johnson",
    createdDate: "2024-03-13",
    type: "grid",
    usedBy: 3,
  },
  {
    id: "4",
    name: "Header + Content",
    zones: 2,
    resolution: "1920x1080",
    createdBy: "John Doe",
    createdDate: "2024-03-12",
    type: "multi-zone",
    usedBy: 6,
  },
  {
    id: "5",
    name: "4K Full Screen",
    zones: 1,
    resolution: "3840x2160",
    createdBy: "Sarah Smith",
    createdDate: "2024-03-10",
    type: "single",
    usedBy: 4,
  },
];

export function PlaylistsTable() {
  const columns = [
    {
      key: "name",
      label: "Playlist Name",
      render: (playlist: Playlist) => (
        <div className="font-medium">{playlist.name}</div>
      ),
    },
    {
      key: "itemCount",
      label: "Items",
      render: (playlist: Playlist) => (
        <Badge variant="outline" className="font-mono">
          {playlist.itemCount}
        </Badge>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (playlist: Playlist) => (
        <div className="text-sm text-muted-foreground">{playlist.duration}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (playlist: Playlist) => (
        <Badge
          variant={playlist.status === "active" ? "default" : "secondary"}
          className={
            playlist.status === "active"
              ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
              : "bg-orange-500/10 text-orange-700 hover:bg-orange-500/20 dark:text-orange-400"
          }
        >
          {playlist.status === "active" ? "Active" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "screens",
      label: "Screens",
      render: (playlist: Playlist) => (
        <div className="text-sm text-muted-foreground">
          {playlist.screens} screen{playlist.screens !== 1 ? "s" : ""}
        </div>
      ),
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (playlist: Playlist) => (
        <div className="text-sm text-muted-foreground">{playlist.createdBy}</div>
      ),
    },
    {
      key: "createdDate",
      label: "Date",
      render: (playlist: Playlist) => (
        <div className="text-sm text-muted-foreground">{playlist.createdDate}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (playlist: Playlist) => (
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
              <Play className="h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Copy className="h-4 w-4" />
              Duplicate
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
    { key: "status", label: "Draft", value: "draft" },
  ];

  return (
    <DataTableView
      data={mockPlaylists}
      columns={columns}
      searchPlaceholder="Search playlists..."
      filterOptions={filterOptions}
      actions={
        <Button className="gap-2 transition-all duration-200 hover:shadow-md">
          <Plus className="h-4 w-4" />
          Create Playlist
        </Button>
      }
    />
  );
}

export function LayoutsTable() {
  const columns = [
    {
      key: "name",
      label: "Layout Name",
      render: (layout: Layout) => (
        <div className="font-medium">{layout.name}</div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (layout: Layout) => (
        <Badge variant="outline" className="capitalize">
          {layout.type}
        </Badge>
      ),
    },
    {
      key: "zones",
      label: "Zones",
      render: (layout: Layout) => (
        <div className="text-sm text-muted-foreground">
          {layout.zones} zone{layout.zones !== 1 ? "s" : ""}
        </div>
      ),
    },
    {
      key: "resolution",
      label: "Resolution",
      render: (layout: Layout) => (
        <Badge variant="outline" className="font-mono">
          {layout.resolution}
        </Badge>
      ),
    },
    {
      key: "usedBy",
      label: "Used By",
      render: (layout: Layout) => (
        <div className="text-sm text-muted-foreground">
          {layout.usedBy} playlist{layout.usedBy !== 1 ? "s" : ""}
        </div>
      ),
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (layout: Layout) => (
        <div className="text-sm text-muted-foreground">{layout.createdBy}</div>
      ),
    },
    {
      key: "createdDate",
      label: "Date",
      render: (layout: Layout) => (
        <div className="text-sm text-muted-foreground">{layout.createdDate}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (layout: Layout) => (
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
              <Play className="h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Copy className="h-4 w-4" />
              Duplicate
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
    { key: "type", label: "Single Zone", value: "single" },
    { key: "type", label: "Multi-Zone", value: "multi-zone" },
    { key: "type", label: "Grid", value: "grid" },
  ];

  return (
    <DataTableView
      data={mockLayouts}
      columns={columns}
      searchPlaceholder="Search layouts..."
      filterOptions={filterOptions}
      actions={
        <Button className="gap-2 transition-all duration-200 hover:shadow-md">
          <Plus className="h-4 w-4" />
          Create Layout
        </Button>
      }
    />
  );
}

