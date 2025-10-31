import { useState, useEffect } from "react";
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
import CompositionBuilderModal from "./CompositionBuilderModal";

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

interface Composition {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  status: "active" | "draft";
  screens: number;
  // Layout information
  layout: {
    name: string;
    zones: number;
    resolution: string;
    type: "single" | "multi-zone" | "grid";
  };
  // Playlist information
  playlist: {
    name: string;
    itemCount: number;
    duration: string;
  };
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

// Compositions data - each composition combines a layout with a playlist
const mockCompositions: Composition[] = [
  {
    id: "c1",
    name: "Welcome Experience",
    createdBy: "John Doe",
    createdDate: "2024-03-15",
    status: "active",
    screens: 5,
    layout: {
      name: "Full Screen Banner",
      zones: 1,
      resolution: "1920x1080",
      type: "single",
    },
    playlist: {
      name: "Welcome Playlist",
      itemCount: 8,
      duration: "15:30",
    },
  },
  {
    id: "c2",
    name: "Product Showcase Display",
    createdBy: "Sarah Smith",
    createdDate: "2024-03-14",
    status: "active",
    screens: 3,
    layout: {
      name: "Split Screen Dual",
      zones: 2,
      resolution: "1920x1080",
      type: "multi-zone",
    },
    playlist: {
      name: "Product Showcase",
      itemCount: 12,
      duration: "22:45",
    },
  },
  {
    id: "c3",
    name: "Company News Grid",
    createdBy: "Mike Johnson",
    createdDate: "2024-03-13",
    status: "active",
    screens: 7,
    layout: {
      name: "Grid 2x2",
      zones: 4,
      resolution: "1920x1080",
      type: "grid",
    },
    playlist: {
      name: "Company News",
      itemCount: 5,
      duration: "8:20",
    },
  },
  {
    id: "c4",
    name: "Promotional Campaign",
    createdBy: "John Doe",
    createdDate: "2024-03-12",
    status: "draft",
    screens: 0,
    layout: {
      name: "Header + Content",
      zones: 2,
      resolution: "1920x1080",
      type: "multi-zone",
    },
    playlist: {
      name: "Promotional Content",
      itemCount: 15,
      duration: "30:00",
    },
  },
  {
    id: "c5",
    name: "Training Program 4K",
    createdBy: "Sarah Smith",
    createdDate: "2024-03-10",
    status: "active",
    screens: 2,
    layout: {
      name: "4K Full Screen",
      zones: 1,
      resolution: "3840x2160",
      type: "single",
    },
    playlist: {
      name: "Training Materials",
      itemCount: 6,
      duration: "18:15",
    },
  },
  {
    id: "c6",
    name: "Lobby Information Display",
    createdBy: "Mike Johnson",
    createdDate: "2024-03-09",
    status: "active",
    screens: 4,
    layout: {
      name: "Split Screen Dual",
      zones: 2,
      resolution: "1920x1080",
      type: "multi-zone",
    },
    playlist: {
      name: "Company News",
      itemCount: 5,
      duration: "8:20",
    },
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

// Unified Compositions Table
export function CompositionsTable() {
  const [compositions, setCompositions] = useState<Composition[]>(mockCompositions);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const loadCompositions = () => {
    const saved = localStorage.getItem("compositions");
    if (saved) {
      try {
        const savedCompositions = JSON.parse(saved);
        const converted = savedCompositions.map((comp: any) => ({
          id: comp.id,
          name: comp.name,
          createdBy: comp.createdBy || "Current User",
          createdDate: comp.createdDate,
          status: comp.status,
          screens: comp.screens || 0,
          layout: {
            name: comp.layout?.name || "Unknown Layout",
            zones: comp.layout?.zones?.length || 1,
            resolution: comp.layout?.resolution || "1920x1080",
            type: comp.layout?.type || "single",
          },
          playlist: {
            name: `${comp.name} Playlist`,
            itemCount: Object.values(comp.zones || {}).reduce(
              (sum: number, zoneMedia: any) => sum + (zoneMedia?.length || 0),
              0
            ),
            duration: calculateTotalDuration(comp.zones || {}),
          },
        }));
        setCompositions([...converted, ...mockCompositions]);
      } catch (error) {
        console.error("Failed to load compositions:", error);
      }
    }
  };

  // Load compositions from localStorage
  useEffect(() => {
    loadCompositions();
  }, []);

  const calculateTotalDuration = (zones: any): string => {
    let totalSeconds = 0;
    Object.values(zones).forEach((zoneMedia: any) => {
      if (Array.isArray(zoneMedia)) {
        totalSeconds += zoneMedia.reduce(
          (sum, item) => sum + (item.duration || 5),
          0
        );
      }
    });
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const columns = [
    {
      key: "name",
      label: "Composition Name",
      render: (composition: Composition) => (
        <div className="font-medium">{composition.name}</div>
      ),
    },
    {
      key: "layout",
      label: "Layout",
      render: (composition: Composition) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{composition.layout.name}</span>
            <Badge variant="outline" className="capitalize text-xs">
              {composition.layout.type}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {composition.layout.zones} {composition.layout.zones !== 1 ? "zones" : "zone"} • {composition.layout.resolution}
          </div>
        </div>
      ),
    },
    {
      key: "playlist",
      label: "Playlist",
      render: (composition: Composition) => (
        <div>
          <div className="text-sm font-medium">{composition.playlist.name}</div>
          <div className="text-xs text-muted-foreground">
            {composition.playlist.itemCount} items • {composition.playlist.duration}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (composition: Composition) => (
        <Badge
          variant={composition.status === "active" ? "default" : "secondary"}
          className={
            composition.status === "active"
              ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
              : "bg-orange-500/10 text-orange-700 hover:bg-orange-500/20 dark:text-orange-400"
          }
        >
          {composition.status === "active" ? "Active" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "screens",
      label: "Screens",
      render: (composition: Composition) => (
        <div className="text-sm text-muted-foreground">
          {composition.screens} screen{composition.screens !== 1 ? "s" : ""}
        </div>
      ),
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (composition: Composition) => (
        <div className="text-sm text-muted-foreground">{composition.createdBy}</div>
      ),
    },
    {
      key: "createdDate",
      label: "Date",
      render: (composition: Composition) => (
        <div className="text-sm text-muted-foreground">{composition.createdDate}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (composition: Composition) => (
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
    { key: "layout.type", label: "Single Zone", value: "single" },
    { key: "layout.type", label: "Multi-Zone", value: "multi-zone" },
    { key: "layout.type", label: "Grid", value: "grid" },
  ];

  return (
    <>
      <DataTableView
        data={compositions}
        columns={columns}
        searchPlaceholder="Search compositions..."
        filterOptions={filterOptions}
        actions={
          <Button
            onClick={() => setIsBuilderOpen(true)}
            className="gap-2 transition-all duration-200 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Create Composition
          </Button>
        }
      />

      {/* Composition Builder Modal */}
      <CompositionBuilderModal
        open={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
        onSuccess={loadCompositions}
      />
    </>
  );
}

