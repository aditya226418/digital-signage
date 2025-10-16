import { MoreVertical, Download, Trash2, Edit, Folder, FolderOpen, Image, Music, Video, FileText, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
  folderId: string | null;
}

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdDate: string;
  createdBy: string;
}

type FileSystemItem = 
  | ({ itemType: "folder" } & FolderItem)
  | ({ itemType: "file" } & MediaItem);

interface MediaGridViewProps {
  data: FileSystemItem[];
  isOrganizeMode: boolean;
  selectedItems: string[];
  onToggleSelection: (id: string) => void;
  onNavigateToFolder: (folderId: string | null) => void;
  onOpenMoveDialog: (itemId: string) => void;
}

export default function MediaGridView({
  data,
  isOrganizeMode,
  selectedItems,
  onToggleSelection,
  onNavigateToFolder,
  onOpenMoveDialog,
}: MediaGridViewProps) {
  
  const getFileIcon = (item: FileSystemItem) => {
    if (item.itemType === "folder") {
      return <Folder className="h-10 w-10 text-blue-600 dark:text-blue-400" />;
    }
    
    const mediaItem = item as MediaItem;
    switch (mediaItem.type) {
      case "image":
        return <Image className="h-10 w-10 text-green-600 dark:text-green-400" />;
      case "audio":
        return <Music className="h-10 w-10 text-purple-600 dark:text-purple-400" />;
      case "video":
        return <Video className="h-10 w-10 text-red-600 dark:text-red-400" />;
      case "pdf":
        return <FileText className="h-10 w-10 text-orange-600 dark:text-orange-400" />;
      default:
        return <FileText className="h-10 w-10 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getCardBackground = (item: FileSystemItem) => {
    if (item.itemType === "folder") {
      return "from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border-blue-200 dark:border-blue-800";
    }
    
    const mediaItem = item as MediaItem;
    switch (mediaItem.type) {
      case "image":
        return "from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 border-green-200 dark:border-green-800";
      case "audio":
        return "from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border-purple-200 dark:border-purple-800";
      case "video":
        return "from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border-red-200 dark:border-red-800";
      case "pdf":
        return "from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 border-orange-200 dark:border-orange-800";
      default:
        return "from-gray-500/10 to-gray-600/10 hover:from-gray-500/20 hover:to-gray-600/20 border-gray-200 dark:border-gray-800";
    }
  };

  const handleCardClick = (item: FileSystemItem) => {
    if (isOrganizeMode) {
      onToggleSelection(item.id);
    } else if (item.itemType === "folder") {
      onNavigateToFolder(item.id);
    }
  };

  const handleCardDoubleClick = (item: FileSystemItem) => {
    if (item.itemType === "folder") {
      onNavigateToFolder(item.id);
    }
    // For files, you could open a preview modal here
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {data.map((item) => {
        const isSelected = selectedItems.includes(item.id);
        const isFolder = item.itemType === "folder";
        const mediaItem = !isFolder ? (item as MediaItem) : null;
        const folderItem = isFolder ? (item as FolderItem) : null;

        return (
          <div
            key={item.id}
            className={`group relative rounded-lg border bg-gradient-to-br transition-all duration-200 cursor-pointer ${getCardBackground(item)} ${
              isSelected ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
            onClick={() => handleCardClick(item)}
            onDoubleClick={() => handleCardDoubleClick(item)}
          >
            {/* Checkbox - appears on hover or when selected */}
            {isOrganizeMode && (
              <div
                className={`absolute top-2 left-2 z-10 transition-opacity ${
                  isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelection(item.id);
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleSelection(item.id)}
                  className="h-5 w-5 bg-white dark:bg-gray-800"
                />
              </div>
            )}

            {/* Action Menu - appears on hover */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isFolder && (
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onClick={() => onNavigateToFolder(item.id)}
                    >
                      <FolderOpen className="h-4 w-4" />
                      Open Folder
                    </DropdownMenuItem>
                  )}
                  {!isFolder && (
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Download className="h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() => onOpenMoveDialog(item.id)}
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
            </div>

            {/* Card Content */}
            <div className="flex flex-col items-center p-3">
              {/* Icon Area */}
              <div className="h-16 w-16 flex items-center justify-center mb-2">
                {getFileIcon(item)}
              </div>

              {/* File/Folder Name */}
              <div className="w-full text-center mb-1.5">
                <p className="text-sm font-medium truncate px-1" title={item.name}>
                  {item.name}
                </p>
              </div>

              {/* Type Badge */}
              <Badge variant="secondary" className="text-xs capitalize">
                {isFolder ? "Folder" : mediaItem?.type}
              </Badge>

              {/* Metadata - Only show size/date */}
              <div className="text-xs text-muted-foreground text-center mt-1">
                {isFolder ? (
                  <p>{folderItem?.createdDate}</p>
                ) : (
                  <p>{mediaItem?.size}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {data.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Folder className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">No items found</p>
          <p className="text-sm">This folder is empty</p>
        </div>
      )}
    </div>
  );
}

