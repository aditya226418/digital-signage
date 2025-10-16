import { MoreVertical, Download, Trash2, Edit, Upload, Layout, Image, FileType, ChevronDown, FolderOpen, Palette, Camera, Link, Store, Play, FileText, Music, Video, Folder, ChevronRight, Home, FolderPlus, ArrowRight } from "lucide-react";
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
import { useState } from "react";
import TemplateSelectionModal from "./TemplateSelectionModal";
import CreateFolderDialog from "./CreateFolderDialog";
import FolderPickerModal from "./FolderPickerModal";
import { Checkbox } from "@/components/ui/checkbox";
import ViewToggle from "./ViewToggle";
import MediaGridView from "./MediaGridView";
import SearchAndFilters from "./SearchAndFilters";

interface MediaItem {
  id: string;
  name: string;
  size: string;
  format: string;
  uploadedBy: string;
  uploadedDate: string;
  duration?: string;
  dimensions?: string;
  tags: string[];
  type: "image" | "audio" | "video" | "pdf";
  folderId: string | null; // null = root folder
}

interface Folder {
  id: string;
  name: string;
  parentId: string | null; // null = root folder
  createdDate: string;
  createdBy: string;
}

type FileSystemItem = 
  | ({ itemType: "folder" } & Folder)
  | ({ itemType: "file" } & MediaItem);

// Mock data for all media items
const mockMediaItemsData: MediaItem[] = [
  // Images
  {
    id: "img-1",
    name: "product-banner.jpg",
    size: "2.4 MB",
    format: "JPEG",
    uploadedBy: "John Doe",
    uploadedDate: "2024-03-15",
    dimensions: "1920x1080",
    tags: ["banner", "product"],
    type: "image",
    folderId: null,
  },
  {
    id: "img-2",
    name: "company-logo.png",
    size: "156 KB",
    format: "PNG",
    uploadedBy: "Sarah Smith",
    uploadedDate: "2024-03-14",
    dimensions: "512x512",
    tags: ["logo", "branding"],
    type: "image",
    folderId: "folder-1",
  },
  {
    id: "img-3",
    name: "team-photo.jpg",
    size: "3.8 MB",
    format: "JPEG",
    uploadedBy: "Mike Johnson",
    uploadedDate: "2024-03-13",
    dimensions: "2560x1440",
    tags: ["team", "photo"],
    type: "image",
    folderId: "folder-1",
  },
  // Audio
  {
    id: "aud-1",
    name: "background-music.mp3",
    size: "4.2 MB",
    format: "MP3",
    uploadedBy: "John Doe",
    uploadedDate: "2024-03-15",
    duration: "3:24",
    tags: ["background", "music"],
    type: "audio",
    folderId: null,
  },
  {
    id: "aud-2",
    name: "announcement-jingle.wav",
    size: "1.8 MB",
    format: "WAV",
    uploadedBy: "Sarah Smith",
    uploadedDate: "2024-03-14",
    duration: "0:45",
    tags: ["jingle", "announcement"],
    type: "audio",
    folderId: "folder-2",
  },
  // Videos
  {
    id: "vid-1",
    name: "product-demo.mp4",
    size: "45.6 MB",
    format: "MP4",
    uploadedBy: "John Doe",
    uploadedDate: "2024-03-15",
    duration: "2:30",
    dimensions: "1920x1080",
    tags: ["demo", "product"],
    type: "video",
    folderId: null,
  },
  {
    id: "vid-2",
    name: "company-intro.mp4",
    size: "89.2 MB",
    format: "MP4",
    uploadedBy: "Mike Johnson",
    uploadedDate: "2024-03-14",
    duration: "5:15",
    dimensions: "3840x2160",
    tags: ["intro", "company"],
    type: "video",
    folderId: "folder-2",
  },
  {
    id: "vid-3",
    name: "testimonial-reel.mov",
    size: "67.3 MB",
    format: "MOV",
    uploadedBy: "Sarah Smith",
    uploadedDate: "2024-03-13",
    duration: "4:20",
    dimensions: "1920x1080",
    tags: ["testimonial", "marketing"],
    type: "video",
    folderId: null,
  },
  // PDFs
  {
    id: "pdf-1",
    name: "menu-board.pdf",
    size: "1.2 MB",
    format: "PDF",
    uploadedBy: "John Doe",
    uploadedDate: "2024-03-15",
    tags: ["menu", "restaurant"],
    type: "pdf",
    folderId: null,
  },
  {
    id: "pdf-2",
    name: "safety-guidelines.pdf",
    size: "856 KB",
    format: "PDF",
    uploadedBy: "Sarah Smith",
    uploadedDate: "2024-03-14",
    tags: ["safety", "guidelines"],
    type: "pdf",
    folderId: "folder-3",
  },
  {
    id: "pdf-3",
    name: "product-catalog.pdf",
    size: "5.4 MB",
    format: "PDF",
    uploadedBy: "Mike Johnson",
    uploadedDate: "2024-03-12",
    tags: ["catalog", "products"],
    type: "pdf",
    folderId: null,
  },
];

// Mock folders
const mockFoldersData: Folder[] = [
  {
    id: "folder-1",
    name: "Brand Assets",
    parentId: null,
    createdDate: "2024-03-01",
    createdBy: "John Doe",
  },
  {
    id: "folder-2",
    name: "Marketing",
    parentId: null,
    createdDate: "2024-03-05",
    createdBy: "Sarah Smith",
  },
  {
    id: "folder-3",
    name: "Documents",
    parentId: null,
    createdDate: "2024-03-10",
    createdBy: "Mike Johnson",
  },
  {
    id: "folder-4",
    name: "Campaigns",
    parentId: "folder-2",
    createdDate: "2024-03-12",
    createdBy: "Sarah Smith",
  },
];

// Keep old mock data arrays for backward compatibility
const mockImages: MediaItem[] = mockMediaItemsData.filter(item => item.type === "image");
const mockAudio: MediaItem[] = mockMediaItemsData.filter(item => item.type === "audio");
const mockVideos: MediaItem[] = mockMediaItemsData.filter(item => item.type === "video");
const mockPDFs: MediaItem[] = mockMediaItemsData.filter(item => item.type === "pdf");

const ActionMenu = ({ item }: { item: MediaItem }) => (
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
        <Download className="h-4 w-4" />
        Download
      </DropdownMenuItem>
      <DropdownMenuItem className="gap-2 cursor-pointer">
        <Edit className="h-4 w-4" />
        Edit Details
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
        <Trash2 className="h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Media Preview Component
const MediaPreview = ({ item }: { item: MediaItem }) => {
  const getThumbnailBg = () => {
    switch (item.type) {
      case "image":
        return "from-blue-500/20 to-blue-600/20";
      case "video":
        return "from-purple-500/20 to-purple-600/20";
      case "audio":
        return "from-orange-500/20 to-orange-600/20";
      case "pdf":
        return "from-red-500/20 to-red-600/20";
      default:
        return "from-gray-500/20 to-gray-600/20";
    }
  };

  const getIcon = () => {
    switch (item.type) {
      case "image":
        return <Image className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Music className="h-5 w-5" />;
      case "pdf":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileType className="h-5 w-5" />;
    }
  };

  const getIconColor = () => {
    switch (item.type) {
      case "image":
        return "text-blue-600 dark:text-blue-400";
      case "video":
        return "text-purple-600 dark:text-purple-400";
      case "audio":
        return "text-orange-600 dark:text-orange-400";
      case "pdf":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Thumbnail */}
      <div className={`relative flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br ${getThumbnailBg()} flex items-center justify-center overflow-hidden border border-border/50`}>
        <div className={getIconColor()}>
          {getIcon()}
        </div>

        {/* Play/Preview button - only for non-PDF items */}
        {item.type !== "pdf" && (
          <button className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-all duration-200">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-black">
              <Play className="h-3.5 w-3.5 fill-black" />
            </div>
          </button>
        )}
      </div>

      {/* Filename and metadata */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate text-foreground">{item.name}</div>
        <div className="text-xs text-muted-foreground">{item.format} • {item.size}</div>
      </div>
    </div>
  );
};

const baseColumns = [
  {
    key: "filename",
    label: "File Name",
    render: (item: MediaItem) => <MediaPreview item={item} />,
  },
];

export function ImagesTable() {
  const columns = [
    ...baseColumns,
    {
      key: "dimensions",
      label: "Dimensions",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.dimensions}</div>
      ),
    },
    {
      key: "uploadedBy",
      label: "Uploaded By",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.uploadedBy}</div>
      ),
    },
    {
      key: "uploadedDate",
      label: "Date",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.uploadedDate}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: MediaItem) => <ActionMenu item={item} />,
    },
  ];

  return (
    <DataTableView
      data={mockImages}
      columns={columns}
      searchPlaceholder="Search images..."
      actions={
        <Button className="gap-2 transition-all duration-200 hover:shadow-md">
          <Upload className="h-4 w-4" />
          Upload Image
        </Button>
      }
    />
  );
}

export function AudioTable() {
  const columns = [
    ...baseColumns,
    {
      key: "duration",
      label: "Duration",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.duration}</div>
      ),
    },
    {
      key: "uploadedBy",
      label: "Uploaded By",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.uploadedBy}</div>
      ),
    },
    {
      key: "uploadedDate",
      label: "Date",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.uploadedDate}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: MediaItem) => <ActionMenu item={item} />,
    },
  ];

  return (
    <DataTableView
      data={mockAudio}
      columns={columns}
      searchPlaceholder="Search audio files..."
      actions={
        <Button className="gap-2 transition-all duration-200 hover:shadow-md">
          <Upload className="h-4 w-4" />
          Upload Audio
        </Button>
      }
    />
  );
}

export function VideoTable() {
  const columns = [
    ...baseColumns,
    {
      key: "duration",
      label: "Duration",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.duration}</div>
      ),
    },
    {
      key: "dimensions",
      label: "Resolution",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.dimensions}</div>
      ),
    },
    {
      key: "uploadedBy",
      label: "Uploaded By",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.uploadedBy}</div>
      ),
    },
    {
      key: "uploadedDate",
      label: "Date",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.uploadedDate}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: MediaItem) => <ActionMenu item={item} />,
    },
  ];

  return (
    <DataTableView
      data={mockVideos}
      columns={columns}
      searchPlaceholder="Search videos..."
      actions={
        <Button className="gap-2 transition-all duration-200 hover:shadow-md">
          <Upload className="h-4 w-4" />
          Upload Video
        </Button>
      }
    />
  );
}

export function PDFTable() {
  const columns = [
    ...baseColumns,
    {
      key: "uploadedBy",
      label: "Uploaded By",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.uploadedBy}</div>
      ),
    },
    {
      key: "uploadedDate",
      label: "Date",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">{item.uploadedDate}</div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: MediaItem) => <ActionMenu item={item} />,
    },
  ];

  return (
    <DataTableView
      data={mockPDFs}
      columns={columns}
      searchPlaceholder="Search PDFs..."
      actions={
        <Button className="gap-2 transition-all duration-200 hover:shadow-md">
          <Upload className="h-4 w-4" />
          Upload PDF
        </Button>
      }
    />
  );
}

// Unified Media Table Component
export function MediaTable() {
  // State management
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItemsData);
  const [folders, setFolders] = useState<Folder[]>(mockFoldersData);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isFolderPickerOpen, setIsFolderPickerOpen] = useState(false);
  const [isOrganizeMode, setIsOrganizeMode] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterOptions = [
    { key: "type", label: "Images", value: "image" },
    { key: "type", label: "Audio", value: "audio" },
    { key: "type", label: "Videos", value: "video" },
    { key: "type", label: "PDFs", value: "pdf" },
  ];

  // Helper functions
  const getFolderPath = (folderId: string | null): Folder[] => {
    if (folderId === null) return [];
    const path: Folder[] = [];
    let currentFolder = folders.find(f => f.id === folderId);
    while (currentFolder) {
      path.unshift(currentFolder);
      currentFolder = folders.find(f => f.id === currentFolder?.parentId);
    }
    return path;
  };

  const getCurrentPath = (): string => {
    if (currentFolderId === null) return "Home";
    const path = getFolderPath(currentFolderId);
    return `Home${path.length > 0 ? " / " + path.map(f => f.name).join(" / ") : ""}`;
  };

  const getExistingFolderNames = (): string[] => {
    return folders
      .filter(f => f.parentId === currentFolderId)
      .map(f => f.name);
  };

  // Folder operations
  const handleCreateFolder = (folderName: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: folderName,
      parentId: currentFolderId,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: "Current User",
    };
    setFolders([...folders, newFolder]);
  };

  const handleMoveItems = (targetFolderId: string | null) => {
    const itemsToMove = selectedItems;
    
    // Update media items
    setMediaItems(prevItems =>
      prevItems.map(item =>
        itemsToMove.includes(item.id)
          ? { ...item, folderId: targetFolderId }
          : item
      )
    );

    // Update folders
    setFolders(prevFolders =>
      prevFolders.map(folder =>
        itemsToMove.includes(folder.id)
          ? { ...folder, parentId: targetFolderId }
          : folder
      )
    );

    setSelectedItems([]);
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSelectedItems([]);
  };

  // Get current view data
  const getCurrentFolders = (): Folder[] => {
    return folders
      .filter(f => f.parentId === currentFolderId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const getCurrentMediaItems = (): MediaItem[] => {
    return mediaItems
      .filter(item => item.folderId === currentFolderId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Build the display data (no more inline expansion)
  const buildDisplayData = (): FileSystemItem[] => {
    let result: FileSystemItem[] = [];
    const currentFolders = getCurrentFolders();
    const currentFiles = getCurrentMediaItems();

    // Add all current level items
    result = [
      ...currentFolders.map(f => ({ itemType: "folder" as const, ...f })),
      ...currentFiles.map(m => ({ itemType: "file" as const, ...m }))
    ];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filters (only for files)
    if (activeFilters.length > 0) {
      result = result.filter(item => {
        if (item.itemType === "folder") return true; // Always show folders
        return activeFilters.includes((item as MediaItem).type);
      });
    }

    return result;
  };

  const displayData = buildDisplayData();

  const toggleFilter = (value: string) => {
    setActiveFilters(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  // Selection helpers
  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === displayData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(displayData.map(item => item.id));
    }
  };

  const isAllSelected = displayData.length > 0 && selectedItems.length === displayData.length;
  const isSomeSelected = selectedItems.length > 0 && selectedItems.length < displayData.length;

  // Folder/File Action Menu
  const FileSystemActionMenu = ({ item }: { item: FileSystemItem }) => (
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
        {item.itemType === "folder" && (
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => navigateToFolder(item.id)}
          >
            <FolderOpen className="h-4 w-4" />
            Open Folder
          </DropdownMenuItem>
        )}
        {item.itemType === "file" && (
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <Download className="h-4 w-4" />
            Download
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onClick={() => {
            setSelectedItems([item.id]);
            setIsFolderPickerOpen(true);
          }}
        >
          <ArrowRight className="h-4 w-4" />
          Move to...
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Edit className="h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Folder/File Preview Component (for table view)
  const FileSystemPreview = ({ item }: { item: FileSystemItem }) => {
    const isFolder = item.itemType === "folder";

    if (isFolder) {
      return (
        <div className="flex items-center gap-3">
          {/* Folder Icon */}
          <div
            className="relative flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden border border-border/50 bg-gradient-to-br from-blue-500/20 to-blue-600/20 cursor-pointer hover:from-blue-500/30 hover:to-blue-600/30 transition-colors"
            onClick={() => navigateToFolder(item.id)}
          >
            <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Folder name and metadata */}
          <div className="flex-1 min-w-0">
            <div
              className="font-medium text-sm truncate text-foreground cursor-pointer hover:text-primary"
              onClick={() => navigateToFolder(item.id)}
            >
              {item.name}
            </div>
            <div className="text-xs text-muted-foreground">Folder</div>
          </div>
        </div>
      );
    }

    // For files, use the existing MediaPreview component
    return <MediaPreview item={item as MediaItem} />;
  };

  const columns = [
    // Conditionally include checkbox column only in organize mode
    ...(isOrganizeMode ? [{
      key: "select",
      label: (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={toggleSelectAll}
          aria-label="Select all"
          className={isSomeSelected ? "data-[state=checked]:bg-primary" : ""}
        />
      ) as any,
      render: (item: FileSystemItem) => (
        <Checkbox
          checked={selectedItems.includes(item.id)}
          onCheckedChange={() => toggleSelection(item.id)}
          aria-label={`Select ${item.name}`}
        />
      ),
    }] : []),
    {
      key: "filename",
      label: "Name",
      render: (item: FileSystemItem) => <FileSystemPreview item={item} />,
    },
    {
      key: "type",
      label: "Type",
      render: (item: FileSystemItem) => (
        <Badge variant="secondary" className="capitalize">
          {item.itemType === "folder" ? "Folder" : (item as MediaItem).type}
        </Badge>
      ),
    },
    {
      key: "uploadedBy",
      label: "Created By",
      render: (item: FileSystemItem) => (
        <div className="text-sm text-muted-foreground">
          {item.itemType === "folder" ? item.createdBy : (item as MediaItem).uploadedBy}
        </div>
      ),
    },
    {
      key: "uploadedDate",
      label: "Date",
      render: (item: FileSystemItem) => (
        <div className="text-sm text-muted-foreground">
          {item.itemType === "folder" ? item.createdDate : (item as MediaItem).uploadedDate}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: FileSystemItem) => <FileSystemActionMenu item={item} />,
    },
  ];

  const AddMediaDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2 transition-all duration-200 hover:shadow-md">
          <Upload className="h-4 w-4" />
          Add Media
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Add Media Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-3 cursor-pointer py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-600">
            <FolderOpen className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Upload Local Files</span>
            <span className="text-xs text-muted-foreground">Upload images, videos, audio, or PDFs from your device</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="gap-3 cursor-pointer py-3"
          onClick={() => setIsTemplateModalOpen(true)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 text-purple-600">
            <Layout className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Choose Templates</span>
            <span className="text-xs text-muted-foreground">Browse and select from pre-designed templates</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 cursor-pointer py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-green-600">
            <Camera className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Upload from Pexels</span>
            <span className="text-xs text-muted-foreground">Import high-quality stock photos and videos</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 cursor-pointer py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-100 text-orange-600">
            <Image className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Upload from Unsplash</span>
            <span className="text-xs text-muted-foreground">Access free professional photography collection</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 cursor-pointer py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-pink-100 text-pink-600">
            <Palette className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Import from Canva</span>
            <span className="text-xs text-muted-foreground">Connect and import your Canva designs</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 cursor-pointer py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
            <Store className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Browse App Store</span>
            <span className="text-xs text-muted-foreground">Discover and install apps from our marketplace</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Breadcrumb Navigation Component - Compact version
  const BreadcrumbNav = () => {
    const path = getFolderPath(currentFolderId);
    
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateToFolder(null)}
          className={`gap-2 h-8 ${currentFolderId === null ? 'bg-accent font-medium' : ''}`}
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
        {path.map((folder) => (
          <div key={folder.id} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateToFolder(folder.id)}
              className={`h-8 ${currentFolderId === folder.id ? 'bg-accent font-medium' : ''}`}
            >
              {folder.name}
            </Button>
          </div>
        ))}
      </div>
    );
  };

  // Bulk Action Bar
  const BulkActionBar = () => {
    if (!isOrganizeMode || selectedItems.length === 0) return null;

    return (
      <div className="flex items-center justify-between p-3 bg-primary/10 border-b border-primary/20 rounded-lg">
        <div className="flex items-center gap-3">
          <Badge variant="default" className="text-sm">
            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFolderPickerOpen(true)}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            Move to...
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedItems([]);
              setIsOrganizeMode(false);
            }}
            className="gap-2"
          >
            Done
          </Button>
        </div>
      </div>
    );
  };

  // Organize Dropdown Component
  const OrganizeDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={isOrganizeMode ? "default" : "outline"}
          className="gap-2 transition-all duration-200"
        >
          <FolderPlus className="h-4 w-4" />
          Organize
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Folder Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="gap-2 cursor-pointer"
          onClick={() => setIsCreateFolderOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
          <div className="flex flex-col">
            <span>Create Folder</span>
            <span className="text-xs text-muted-foreground">Add a new folder here</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="gap-2 cursor-pointer"
          onClick={() => {
            setIsOrganizeMode(!isOrganizeMode);
            if (isOrganizeMode) {
              setSelectedItems([]);
            }
          }}
        >
          <ArrowRight className="h-4 w-4" />
          <div className="flex flex-col">
            <span>{isOrganizeMode ? "Exit Organize Mode" : "Move Files & Folders"}</span>
            <span className="text-xs text-muted-foreground">
              {isOrganizeMode ? "Return to normal view" : "Select and move items"}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <div className="space-y-4">
        {/* Top Bar: Search + Actions (CTAs) */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search all media..."
              filterOptions={filterOptions}
              activeFilters={activeFilters}
              onToggleFilter={toggleFilter}
            />
          </div>
          <OrganizeDropdown />
          <AddMediaDropdown />
        </div>

        {/* Bulk Action Bar */}
        <BulkActionBar />

        {/* Navigation Bar: Filter + View Toggle + Breadcrumb (closer to table) */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <BreadcrumbNav />
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {/* Content Area - Grid or Table View */}
        {viewMode === "grid" ? (
          <MediaGridView
            data={displayData}
            isOrganizeMode={isOrganizeMode}
            selectedItems={selectedItems}
            onToggleSelection={toggleSelection}
            onNavigateToFolder={navigateToFolder}
            onOpenMoveDialog={(itemId) => {
              setSelectedItems([itemId]);
              setIsFolderPickerOpen(true);
            }}
          />
        ) : (
          <DataTableView
            showHeader={false}
            data={displayData}
            columns={columns}
            searchPlaceholder=""
            filterOptions={[]}
            itemsPerPage={20}
          />
        )}
      </div>

      {/* Modals */}
      <TemplateSelectionModal
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
      />
      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        onCreateFolder={handleCreateFolder}
        currentPath={getCurrentPath()}
        existingFolderNames={getExistingFolderNames()}
      />
      <FolderPickerModal
        open={isFolderPickerOpen}
        onOpenChange={setIsFolderPickerOpen}
        folders={folders}
        onMove={handleMoveItems}
        currentFolderId={currentFolderId}
        itemsBeingMoved={selectedItems}
        onCreateFolder={handleCreateFolder}
      />
    </>
  );
}

