import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MediaItem,
  mockMediaLibrary,
  recentlyUsedMedia,
} from "@/lib/mockCompositionData";
import * as Icons from "lucide-react";
import { Upload, GripVertical } from "lucide-react";

interface MediaLibraryPanelProps {
  className?: string;
}

function DraggableMediaItem({ media }: { media: MediaItem }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: media.id,
    data: media,
  });

  // Get the icon component dynamically
  const IconComponent = (Icons as any)[media.thumbnail] || Icons.ImageIcon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-3 rounded-lg border border-neutral-200 
        hover:bg-neutral-50 cursor-grab active:cursor-grabbing
        transition-all duration-150
        ${isDragging ? "opacity-50 scale-95" : "opacity-100"}
      `}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center">
        <IconComponent className="h-5 w-5 text-neutral-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{media.name}</div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs capitalize">
            {media.type}
          </Badge>
          {media.duration > 0 && (
            <span className="text-xs text-muted-foreground">
              {media.duration}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MediaLibraryPanel({ className }: MediaLibraryPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("library");
  const [filterType, setFilterType] = useState<string>("all");

  const recentMedia = mockMediaLibrary.filter((m) =>
    recentlyUsedMedia.includes(m.id)
  );

  const filteredMedia = mockMediaLibrary.filter(
    (m) => filterType === "all" || m.type === filterType
  );

  return (
    <div className={`bg-white rounded-2xl shadow-sm flex flex-col h-full ${className}`}>
      <div className="p-4 border-b flex-shrink-0">
        <h3 className="font-semibold text-lg mb-1">Media Library</h3>
        <p className="text-xs text-muted-foreground">
          Drag media items to zones
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-2 flex-shrink-0">
          <TabsTrigger value="library" className="flex-1">
            Library
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">
            Upload
          </TabsTrigger>
          <TabsTrigger value="apps" className="flex-1">
            Apps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="flex-1 mt-0 min-h-0 flex flex-col">
          <div className="p-4 space-y-3 flex-1 min-h-0 flex flex-col">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap flex-shrink-0">
              <Button
                size="sm"
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterType === "image" ? "default" : "outline"}
                onClick={() => setFilterType("image")}
              >
                Images
              </Button>
              <Button
                size="sm"
                variant={filterType === "video" ? "default" : "outline"}
                onClick={() => setFilterType("video")}
              >
                Videos
              </Button>
              <Button
                size="sm"
                variant={filterType === "app" ? "default" : "outline"}
                onClick={() => setFilterType("app")}
              >
                Apps
              </Button>
            </div>

            <ScrollArea className="flex-1 min-h-0 pr-4">
              <div className="space-y-4 pb-4">
                {/* Recently Used Section */}
                {recentMedia.length > 0 && filterType === "all" && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Recently Used
                    </h4>
                    <div className="space-y-2">
                      {recentMedia.map((media) => (
                        <DraggableMediaItem key={media.id} media={media} />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Media */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    {filterType === "all" ? "All Media" : `${filterType}s`}
                  </h4>
                  <div className="space-y-2">
                    {filteredMedia.map((media) => (
                      <DraggableMediaItem key={media.id} media={media} />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="flex-1 mt-0 min-h-0">
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-neutral-600" />
              </div>
              <h4 className="font-semibold mb-1">Upload Media</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload images, videos, or documents
              </p>
              <Button>Choose Files</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="apps" className="flex-1 mt-0 min-h-0">
          <div className="p-4 h-full flex flex-col min-h-0">
            <ScrollArea className="flex-1 min-h-0 pr-4">
              <div className="space-y-2 pb-4">
                {mockMediaLibrary
                  .filter((m) => m.type === "app")
                  .map((media) => (
                    <DraggableMediaItem key={media.id} media={media} />
                  ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

