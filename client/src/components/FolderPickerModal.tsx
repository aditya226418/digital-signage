import { useState } from "react";
import { Folder, FolderOpen, Home, ChevronRight, FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
}

interface FolderPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: FolderItem[];
  onMove: (folderId: string | null) => void;
  currentFolderId?: string | null;
  itemsBeingMoved?: string[]; // IDs of folders being moved (to prevent moving into themselves)
  onCreateFolder?: (folderName: string, parentId: string | null) => void;
}

export default function FolderPickerModal({
  open,
  onOpenChange,
  folders,
  onMove,
  currentFolderId,
  itemsBeingMoved = [],
  onCreateFolder,
}: FolderPickerModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId || null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Get folder path for breadcrumb
  const getFolderPath = (folderId: string | null): FolderItem[] => {
    if (folderId === null) return [];
    
    const path: FolderItem[] = [];
    let currentFolder = folders.find(f => f.id === folderId);
    
    while (currentFolder) {
      path.unshift(currentFolder);
      currentFolder = folders.find(f => f.id === currentFolder?.parentId);
    }
    
    return path;
  };

  // Get immediate children of a folder
  const getChildFolders = (parentId: string | null): FolderItem[] => {
    return folders
      .filter(f => f.parentId === parentId && !itemsBeingMoved.includes(f.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Check if a folder is a descendant of any of the items being moved
  const isDescendantOfMovingItems = (folderId: string): boolean => {
    if (itemsBeingMoved.includes(folderId)) return true;
    
    const folder = folders.find(f => f.id === folderId);
    if (!folder || !folder.parentId) return false;
    
    return isDescendantOfMovingItems(folder.parentId);
  };

  const currentPath = getFolderPath(selectedFolderId);
  const availableFolders = getChildFolders(selectedFolderId);

  const handleMove = () => {
    onMove(selectedFolderId);
    onOpenChange(false);
    setSelectedFolderId(currentFolderId || null);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() && onCreateFolder) {
      onCreateFolder(newFolderName.trim(), selectedFolderId);
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedFolderId(currentFolderId || null);
    setIsCreatingFolder(false);
    setNewFolderName("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Move to Folder</DialogTitle>
          <DialogDescription>
            Select a destination folder for the selected items
          </DialogDescription>
        </DialogHeader>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1 py-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFolderId(null)}
            className={`gap-2 ${selectedFolderId === null ? 'bg-accent' : ''}`}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          {currentPath.map((folder) => (
            <div key={folder.id} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFolderId(folder.id)}
                className={selectedFolderId === folder.id ? 'bg-accent' : ''}
              >
                {folder.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Folder List */}
        <ScrollArea className="h-[300px] w-full border rounded-md p-4">
          <div className="space-y-2">
            {availableFolders.length === 0 && !isCreatingFolder && (
              <div className="text-center text-sm text-muted-foreground py-8">
                No folders in this location
              </div>
            )}
            
            {availableFolders.map((folder) => {
              const isDisabled = isDescendantOfMovingItems(folder.id);
              return (
                <Button
                  key={folder.id}
                  variant="ghost"
                  className="w-full justify-start gap-2 h-auto py-3"
                  onClick={() => !isDisabled && setSelectedFolderId(folder.id)}
                  disabled={isDisabled}
                  title={isDisabled ? "Cannot move a folder into itself or its subfolders" : undefined}
                >
                  <FolderOpen className="h-5 w-5 text-blue-500" />
                  <span className="flex-1 text-left">{folder.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              );
            })}

            {/* Create New Folder Inline */}
            {isCreatingFolder && (
              <div className="flex items-center gap-2 p-2 border rounded-md">
                <FolderPlus className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolder();
                    if (e.key === "Escape") setIsCreatingFolder(false);
                  }}
                  className="flex-1 bg-transparent outline-none text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={handleCreateFolder}>
                  Create
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Current Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          <Folder className="h-4 w-4" />
          <span>
            Moving to: <span className="font-medium text-foreground">
              {selectedFolderId === null ? "Home" : currentPath[currentPath.length - 1]?.name || "Home"}
            </span>
          </span>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            {onCreateFolder && !isCreatingFolder && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreatingFolder(true)}
                className="gap-2"
              >
                <FolderPlus className="h-4 w-4" />
                New Folder
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleMove}>
              Move Here
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

