import { MoreVertical, Download, Trash2, Edit, Upload, Layout, Image, FileType, ChevronDown, FolderOpen, Palette, Camera, Link, Store, Play, FileText, Music, Video } from "lucide-react";
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
import TemplateSelectionModal from "./TemplateSelectionModal"; // Template selection modal

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
}

// Mock data for all media items
const mockMediaItems: MediaItem[] = [
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
  },
];

// Keep old mock data arrays for backward compatibility
const mockImages: MediaItem[] = mockMediaItems.filter(item => item.type === "image");
const mockAudio: MediaItem[] = mockMediaItems.filter(item => item.type === "audio");
const mockVideos: MediaItem[] = mockMediaItems.filter(item => item.type === "video");
const mockPDFs: MediaItem[] = mockMediaItems.filter(item => item.type === "pdf");

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
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const filterOptions = [
    { key: "type", label: "Images", value: "image" },
    { key: "type", label: "Audio", value: "audio" },
    { key: "type", label: "Videos", value: "video" },
    { key: "type", label: "PDFs", value: "pdf" },
  ];

  const columns = [
    ...baseColumns,
    {
      key: "type",
      label: "Type",
      render: (item: MediaItem) => (
        <Badge variant="secondary" className="capitalize">
          {item.type}
        </Badge>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">
          {item.duration || "-"}
        </div>
      ),
    },
    {
      key: "dimensions",
      label: "Dimensions",
      render: (item: MediaItem) => (
        <div className="text-sm text-muted-foreground">
          {item.dimensions || "-"}
        </div>
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

  return (
    <>
      <DataTableView
        data={mockMediaItems}
        columns={columns}
        searchPlaceholder="Search all media..."
        filterOptions={filterOptions}
        actions={<AddMediaDropdown />}
      />
      <TemplateSelectionModal
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
      />
    </>
  );
}

