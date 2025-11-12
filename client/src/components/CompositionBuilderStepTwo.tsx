import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MediaItem, LayoutTemplate, LayoutZone } from "@/lib/mockCompositionData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Trash2,
  GripVertical,
  Clock,
  CheckCircle2,
  ImageIcon,
  VideoIcon,
  AppWindowIcon,
  Search,
  X,
  Eye,
  ArrowRight,
  ArrowLeft,
  Move,
} from "lucide-react";
import * as Icons from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mockMediaLibrary } from "@/lib/mockCompositionData";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CompositionBuilderStepTwoProps {
  selectedLayout: LayoutTemplate;
  zones: Record<string, MediaItem[]>;
  onZonesChange: (zones: Record<string, MediaItem[]>) => void;
  onChangeLayout: () => void;
  onPreview: () => void;
  onContinue: () => void;
}

// Sortable Filmstrip Item
function SortableFilmstripItem({
  media,
  index,
  onRemove,
  onDurationChange,
}: {
  media: MediaItem;
  index: number;
  onRemove: () => void;
  onDurationChange: (duration: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: `${media.id}-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };

  const IconComponent = (Icons as any)[media.thumbnail] || Icons.ImageIcon;
  
  const getMediaTypeInfo = () => {
    switch (media.type) {
      case "video":
        return { color: "bg-blue-500", label: "Video", icon: VideoIcon };
      case "app":
        return { color: "bg-purple-500", label: "App", icon: AppWindowIcon };
      default:
        return { color: "bg-green-500", label: "Image", icon: ImageIcon };
    }
  };
  
  const typeInfo = getMediaTypeInfo();

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`relative flex-shrink-0 w-full group ${
        isDragging ? "opacity-30 z-50" : ""
      } ${
        isOver ? "shadow-2xl scale-[1.02]" : ""
      }`}
      whileHover={{ x: -2 }}
    >
      {/* Drop Indicator - Shows where item will be placed */}
      {isOver && (
        <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full shadow-lg z-50 animate-pulse">
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-md" />
        </div>
      )}
      
      <div className={`bg-white border rounded-md p-2 transition-all duration-200 ${
        isOver 
          ? "border-primary border-2 shadow-xl bg-primary/5" 
          : isDragging 
            ? "border-neutral-300 shadow-none"
            : "border-neutral-200 hover:border-primary/50 hover:shadow-lg"
      }`}>
        {/* Horizontal Layout: Thumbnail Left, Content Right */}
        <div className="flex gap-2">
          {/* Left: Thumbnail */}
          <div className="relative flex-shrink-0 w-20 h-20">
            {/* Drag Handle - Top Left of Thumbnail */}
            <button
              {...attributes}
              {...listeners}
              className="absolute -top-1 -left-1 z-10 flex items-center justify-center w-5 h-5 bg-white/95 hover:bg-neutral-100 border border-neutral-300 rounded-full shadow-sm cursor-grab active:cursor-grabbing transition-colors"
            >
              <GripVertical className="h-3 w-3 text-neutral-500" />
            </button>

            {/* Order Number - Top Right of Thumbnail */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[9px] font-bold shadow-md border-2 border-white z-10">
              {index + 1}
            </div>

            {/* Thumbnail Image */}
            <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-50 rounded border border-neutral-200 flex items-center justify-center relative overflow-hidden group-hover:border-primary/30 transition-colors">
              {media.thumbnailUrl ? (
                <>
                  <img 
                    src={media.thumbnailUrl} 
                    alt={media.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with play icon for videos */}
                  {media.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <VideoIcon className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              ) : (
                <>
                  <IconComponent className="h-6 w-6 text-neutral-500 group-hover:text-primary transition-colors" />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Type Badge */}
            <Badge className={`${typeInfo.color} text-white text-[8px] px-1.5 py-0 h-3.5 gap-0.5 w-fit mb-1`}>
              <typeInfo.icon className="h-2 w-2" />
              {typeInfo.label}
            </Badge>

            {/* Media Name */}
            <div 
              className="text-[10px] font-semibold truncate mb-1.5 text-neutral-800 group-hover:text-primary transition-colors" 
              title={media.name}
            >
              {media.name}
            </div>

            {/* Duration Control */}
            <div className="flex items-center gap-0.5 mb-1.5 bg-neutral-50 rounded px-1.5 py-0.5 border border-neutral-200 w-fit">
              <Clock className="h-2.5 w-2.5 text-neutral-500 flex-shrink-0" />
              <Input
                type="number"
                value={media.duration || 5}
                onChange={(e) => onDurationChange(parseInt(e.target.value) || 5)}
                className="h-4 text-[10px] px-1 w-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                min={1}
                max={999}
              />
              <span className="text-[9px] text-neutral-500 font-medium">s</span>
            </div>

            {/* Delete Button */}
            <Button
              onClick={onRemove}
              variant="ghost"
              size="sm"
              className="w-fit h-5 text-[9px] text-red-600 hover:text-red-700 hover:bg-red-50 gap-0.5 font-medium px-1.5 mt-auto"
            >
              <Trash2 className="h-2.5 w-2.5" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Zone Selector Component with Resize Handles
function ZoneSelector({
  zone,
  zoneNumber,
  isActive,
  mediaCount,
  onClick,
  onResize,
  allZones,
}: {
  zone: { id: string; name: string; x: number; y: number; width: number; height: number };
  zoneNumber: number;
  isActive: boolean;
  mediaCount: number;
  onClick: () => void;
  onResize?: (zoneId: string, updates: Partial<LayoutZone>) => void;
  allZones: LayoutZone[];
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isHoveringHandle, setIsHoveringHandle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
  }, []);

  useEffect(() => {
    if (!isResizing || !onResize || !containerRef.current) return;

    const container = containerRef.current.parentElement;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

      const MIN_SIZE = 10; // Minimum zone size percentage
      let updates: Partial<LayoutZone> = {};
      const adjacentUpdates: Array<{ zoneId: string; updates: Partial<LayoutZone> }> = [];

      // Handle right edge resize
      if (resizeHandle === 'right') {
        const newWidth = Math.max(MIN_SIZE, Math.min(100 - zone.x, mouseX - zone.x));
        updates.width = newWidth;

        // Find adjacent zone on the right
        const rightZone = allZones.find(z => 
          z.id !== zone.id && 
          Math.abs(z.x - (zone.x + zone.width)) < 1 && 
          z.y === zone.y && 
          z.height === zone.height
        );
        
        if (rightZone) {
          const newRightX = zone.x + newWidth;
          const newRightWidth = (rightZone.x + rightZone.width) - newRightX;
          if (newRightWidth >= MIN_SIZE) {
            adjacentUpdates.push({
              zoneId: rightZone.id,
              updates: { x: newRightX, width: newRightWidth }
            });
          } else {
            return; // Don't resize if adjacent zone would be too small
          }
        }
      }
      
      // Handle bottom edge resize
      else if (resizeHandle === 'bottom') {
        const newHeight = Math.max(MIN_SIZE, Math.min(100 - zone.y, mouseY - zone.y));
        updates.height = newHeight;

        // Find adjacent zone below
        const bottomZone = allZones.find(z => 
          z.id !== zone.id && 
          Math.abs(z.y - (zone.y + zone.height)) < 1 && 
          z.x === zone.x && 
          z.width === zone.width
        );
        
        if (bottomZone) {
          const newBottomY = zone.y + newHeight;
          const newBottomHeight = (bottomZone.y + bottomZone.height) - newBottomY;
          if (newBottomHeight >= MIN_SIZE) {
            adjacentUpdates.push({
              zoneId: bottomZone.id,
              updates: { y: newBottomY, height: newBottomHeight }
            });
          } else {
            return;
          }
        }
      }

      // Handle left edge resize
      else if (resizeHandle === 'left') {
        const newX = Math.max(0, Math.min(zone.x + zone.width - MIN_SIZE, mouseX));
        const newWidth = (zone.x + zone.width) - newX;
        if (newWidth >= MIN_SIZE) {
          updates.x = newX;
          updates.width = newWidth;

          // Find adjacent zone on the left
          const leftZone = allZones.find(z => 
            z.id !== zone.id && 
            Math.abs((z.x + z.width) - zone.x) < 1 && 
            z.y === zone.y && 
            z.height === zone.height
          );
          
          if (leftZone) {
            const newLeftWidth = newX - leftZone.x;
            if (newLeftWidth >= MIN_SIZE) {
              adjacentUpdates.push({
                zoneId: leftZone.id,
                updates: { width: newLeftWidth }
              });
            } else {
              return;
            }
          }
        }
      }

      // Handle top edge resize
      else if (resizeHandle === 'top') {
        const newY = Math.max(0, Math.min(zone.y + zone.height - MIN_SIZE, mouseY));
        const newHeight = (zone.y + zone.height) - newY;
        if (newHeight >= MIN_SIZE) {
          updates.y = newY;
          updates.height = newHeight;

          // Find adjacent zone above
          const topZone = allZones.find(z => 
            z.id !== zone.id && 
            Math.abs((z.y + z.height) - zone.y) < 1 && 
            z.x === zone.x && 
            z.width === zone.width
          );
          
          if (topZone) {
            const newTopHeight = newY - topZone.y;
            if (newTopHeight >= MIN_SIZE) {
              adjacentUpdates.push({
                zoneId: topZone.id,
                updates: { height: newTopHeight }
              });
            } else {
              return;
            }
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        onResize(zone.id, updates);
        adjacentUpdates.forEach(({ zoneId, updates }) => {
          onResize(zoneId, updates);
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      setIsHoveringHandle(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeHandle, zone, onResize, allZones]);

  const hasRightNeighbor = allZones.some(z => 
    z.id !== zone.id && 
    Math.abs(z.x - (zone.x + zone.width)) < 1 && 
    z.y === zone.y && 
    z.height === zone.height
  );

  const hasBottomNeighbor = allZones.some(z => 
    z.id !== zone.id && 
    Math.abs(z.y - (zone.y + zone.height)) < 1 && 
    z.x === zone.x && 
    z.width === zone.width
  );

  const hasLeftNeighbor = allZones.some(z => 
    z.id !== zone.id && 
    Math.abs((z.x + z.width) - zone.x) < 1 && 
    z.y === zone.y && 
    z.height === zone.height
  );

  const hasTopNeighbor = allZones.some(z => 
    z.id !== zone.id && 
    Math.abs((z.y + z.height) - zone.y) < 1 && 
    z.x === zone.x && 
    z.width === zone.width
  );

  return (
    <motion.div
      ref={containerRef}
      onClick={onClick}
      className={`
        absolute rounded-md flex items-center justify-center transition-all duration-200 backdrop-blur-sm
        ${
          isActive
            ? "bg-primary/15 border-2 border-primary shadow-md z-10 ring-1 ring-primary/20"
            : "bg-white/60 border border-dashed border-neutral-400 hover:border-primary/60 hover:bg-primary/5 hover:shadow-md"
        }
        ${isResizing ? 'cursor-grabbing' : 'cursor-pointer'}
      `}
      style={{
        top: `${zone.y}%`,
        left: `${zone.x}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
      }}
    >
      <div className="text-center px-1.5 pointer-events-none">
        <div className={`text-[11px] font-bold ${isActive ? "text-primary" : "text-neutral-700"}`}>
          Zone {zoneNumber}
          {isActive && (
            <span className="ml-1 text-[9px] font-normal bg-primary text-white px-1 py-0.5 rounded">
              Active
            </span>
          )}
        </div>
        {mediaCount > 0 && (
          <Badge className="mt-0.5 h-4 text-[9px] bg-green-500 hover:bg-green-600 px-1.5 shadow-sm">
            ✓ {mediaCount} {mediaCount === 1 ? 'item' : 'items'}
          </Badge>
        )}
        {mediaCount === 0 && !isActive && (
          <div className="text-[8px] text-neutral-500 mt-0.5">Click to add</div>
        )}
      </div>

      {/* Scale Indicator - Shows dimensions when resizing or hovering */}
      <AnimatePresence>
        {(isResizing || isHoveringHandle) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm border-2 border-primary rounded-lg shadow-lg px-2 py-1.5 z-30 pointer-events-none"
          >
            <div className="text-[10px] font-bold text-primary mb-0.5 flex items-center gap-1">
              <Move className="h-3 w-3" />
              Dimensions
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px]">
                <span className="text-neutral-600 font-medium">Width:</span>
                <span className="font-bold text-neutral-900 bg-primary/10 px-1.5 py-0.5 rounded">
                  {zone.width.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px]">
                <span className="text-neutral-600 font-medium">Height:</span>
                <span className="font-bold text-neutral-900 bg-primary/10 px-1.5 py-0.5 rounded">
                  {zone.height.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resize Handles */}
      {onResize && (
        <>
          {/* Right handle */}
          {hasRightNeighbor && (
            <div
              onMouseDown={(e) => handleResizeStart(e, 'right')}
              onMouseEnter={() => setIsHoveringHandle(true)}
              onMouseLeave={() => setIsHoveringHandle(false)}
              className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize group hover:bg-primary/30 transition-colors z-20"
              style={{ transform: 'translateX(50%)' }}
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md flex items-center justify-center">
                <GripVertical className="h-2.5 w-2.5 text-primary" />
              </div>
            </div>
          )}

          {/* Bottom handle */}
          {hasBottomNeighbor && (
            <div
              onMouseDown={(e) => handleResizeStart(e, 'bottom')}
              onMouseEnter={() => setIsHoveringHandle(true)}
              onMouseLeave={() => setIsHoveringHandle(false)}
              className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize group hover:bg-primary/30 transition-colors z-20"
              style={{ transform: 'translateY(50%)' }}
            >
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md flex items-center justify-center">
                <GripVertical className="h-2.5 w-2.5 text-primary rotate-90" />
              </div>
            </div>
          )}

          {/* Left handle */}
          {hasLeftNeighbor && (
            <div
              onMouseDown={(e) => handleResizeStart(e, 'left')}
              onMouseEnter={() => setIsHoveringHandle(true)}
              onMouseLeave={() => setIsHoveringHandle(false)}
              className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize group hover:bg-primary/30 transition-colors z-20"
              style={{ transform: 'translateX(-50%)' }}
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md flex items-center justify-center">
                <GripVertical className="h-2.5 w-2.5 text-primary" />
              </div>
            </div>
          )}

          {/* Top handle */}
          {hasTopNeighbor && (
            <div
              onMouseDown={(e) => handleResizeStart(e, 'top')}
              onMouseEnter={() => setIsHoveringHandle(true)}
              onMouseLeave={() => setIsHoveringHandle(false)}
              className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize group hover:bg-primary/30 transition-colors z-20"
              style={{ transform: 'translateY(-50%)' }}
            >
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md flex items-center justify-center">
                <GripVertical className="h-2.5 w-2.5 text-primary rotate-90" />
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// Media Picker Popover
function MediaPickerPopover({
  onAddMedia,
  selectedMediaIds,
  trigger,
}: {
  onAddMedia: (media: MediaItem) => void;
  selectedMediaIds: string[];
  trigger?: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const filteredMedia = mockMediaLibrary.filter((media) => {
    const matchesSearch = media.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || media.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-1.5 h-8 w-full">
            <Plus className="h-4 w-4" />
            Add Media
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[700px] p-0" 
        align="start" 
        side="bottom"
        sideOffset={10}
      >
        <div className="p-3 border-b bg-neutral-50">
          <div className="flex items-center gap-2 mb-2">
            <Button
              size="sm"
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              className="h-7 text-xs px-2.5"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filterType === "image" ? "default" : "outline"}
              onClick={() => setFilterType("image")}
              className="h-7 text-xs px-2.5"
            >
              <ImageIcon className="h-3 w-3 mr-1" />
              Images
            </Button>
            <Button
              size="sm"
              variant={filterType === "video" ? "default" : "outline"}
              onClick={() => setFilterType("video")}
              className="h-7 text-xs px-2.5"
            >
              <VideoIcon className="h-3 w-3 mr-1" />
              Videos
            </Button>
            <Button
              size="sm"
              variant={filterType === "app" ? "default" : "outline"}
              onClick={() => setFilterType("app")}
              className="h-7 text-xs px-2.5"
            >
              <AppWindowIcon className="h-3 w-3 mr-1" />
              Apps
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 text-xs pl-8"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[380px]">
          <div className="grid grid-cols-5 gap-2.5 p-3">
            {filteredMedia.map((media) => {
              const IconComponent = (Icons as any)[media.thumbnail] || Icons.ImageIcon;
              const isAdded = selectedMediaIds.includes(media.id);

              return (
                <motion.button
                  key={media.id}
                  onClick={() => {
                    onAddMedia(media);
                    if (!isAdded) {
                      setOpen(false);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative p-2.5 rounded-md border transition-all
                    ${
                      isAdded
                        ? "border-green-500 bg-green-50"
                        : "border-neutral-200 hover:border-primary bg-white"
                    }
                  `}
                >
                  {isAdded && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center z-10">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </div>
                  )}

                  <div className="w-full aspect-square bg-neutral-100 rounded flex items-center justify-center mb-1.5 overflow-hidden relative">
                    {media.thumbnailUrl ? (
                      <>
                        <img 
                          src={media.thumbnailUrl} 
                          alt={media.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay with play icon for videos */}
                        {media.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <VideoIcon className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {/* App icon overlay */}
                        {media.type === "app" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-purple-500/90">
                            <AppWindowIcon className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </>
                    ) : (
                      <IconComponent className="h-5 w-5 text-neutral-600" />
                    )}
                  </div>

                  <div className="text-[10px] font-medium truncate mb-1">{media.name}</div>
                  <Badge variant="outline" className="text-[9px] h-3.5 px-1 capitalize">
                    {media.type}
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function CompositionBuilderStepTwo({
  selectedLayout,
  zones,
  onZonesChange,
  onChangeLayout,
  onPreview,
  onContinue,
}: CompositionBuilderStepTwoProps) {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(
    selectedLayout.zones[0]?.id || null
  );
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  
  // Local state for customized zone layouts
  const [customZones, setCustomZones] = useState<LayoutZone[]>(selectedLayout.zones);

  // Reset custom zones when layout changes
  useEffect(() => {
    setCustomZones(selectedLayout.zones);
  }, [selectedLayout.id]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeZone = customZones.find((z) => z.id === activeZoneId);
  const activeZoneMedia = activeZoneId ? zones[activeZoneId] || [] : [];
  const allZonesHaveMedia = customZones.every(
    (zone) => zones[zone.id] && zones[zone.id].length > 0
  );

  const addedMediaIds = activeZoneMedia.map((m) => m.id);

  // Handle zone resize
  const handleZoneResize = useCallback((zoneId: string, updates: Partial<LayoutZone>) => {
    setCustomZones(prevZones => 
      prevZones.map(z => 
        z.id === zoneId ? { ...z, ...updates } : z
      )
    );
  }, []);

  const handleAddMedia = (media: MediaItem) => {
    if (!activeZoneId) return;

    const newZones = { ...zones };
    if (!newZones[activeZoneId]) {
      newZones[activeZoneId] = [];
    }

    const isAlreadyAdded = newZones[activeZoneId].some((m) => m.id === media.id);
    if (isAlreadyAdded) {
      newZones[activeZoneId] = newZones[activeZoneId].filter((m) => m.id !== media.id);
    } else {
      newZones[activeZoneId] = [...newZones[activeZoneId], { ...media }];
    }

    onZonesChange(newZones);
  };

  const handleRemoveMedia = (index: number) => {
    if (!activeZoneId) return;
    const newZones = { ...zones };
    newZones[activeZoneId] = newZones[activeZoneId].filter((_, i) => i !== index);
    onZonesChange(newZones);
  };

  const handleDurationChange = (index: number, duration: number) => {
    if (!activeZoneId) return;
    const newZones = { ...zones };
    newZones[activeZoneId] = [...newZones[activeZoneId]];
    newZones[activeZoneId][index] = {
      ...newZones[activeZoneId][index],
      duration,
    };
    onZonesChange(newZones);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    
    if (!activeZoneId) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeZoneMedia.findIndex((_, i) => `${activeZoneMedia[i].id}-${i}` === active.id);
    const newIndex = activeZoneMedia.findIndex((_, i) => `${activeZoneMedia[i].id}-${i}` === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newZones = { ...zones };
      newZones[activeZoneId] = arrayMove(newZones[activeZoneId], oldIndex, newIndex);
      onZonesChange(newZones);
    }
  };

  const totalDuration = activeZoneMedia.reduce((sum, item) => sum + (item.duration || 5), 0);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-4 py-2">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{selectedLayout.name}</h3>
            <p className="text-xs text-muted-foreground">Click a zone to select, hover on edges to resize</p>
          </div>
          <div className="flex items-center gap-2">
            {allZonesHaveMedia && (
              <Badge className="gap-1 h-5 text-[10px] bg-green-500">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Ready
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onChangeLayout}
              className="h-7 text-xs gap-1.5"
            >
              <ArrowLeft className="h-3 w-3" />
              Change Layout
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              disabled={!allZonesHaveMedia}
              className="h-7 text-xs gap-1.5"
            >
              <Eye className="h-3 w-3" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={onContinue}
              disabled={!allZonesHaveMedia}
              className="h-7 text-xs gap-1.5"
            >
              Continue
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Side-by-side layout: Zone Selector (40%) + Filmstrip (60%) */}
        <div className="flex gap-3">
          {/* Left: Mock Screen with Zones - 40% */}
          <div className="flex-[0_0_40%]">
            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-lg shadow-sm border border-neutral-200 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] font-semibold text-neutral-600">
                  📺 Layout Preview
                </div>
                <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                  {selectedLayout.name}
                </Badge>
              </div>
              <div className="w-full max-w-[700px] mx-auto aspect-video bg-gradient-to-br from-neutral-100 to-neutral-50 rounded border border-neutral-300 relative shadow-inner overflow-hidden">
                {customZones.map((zone, index) => (
                  <ZoneSelector
                    key={zone.id}
                    zone={zone}
                    zoneNumber={index + 1}
                    isActive={activeZoneId === zone.id}
                    mediaCount={zones[zone.id]?.length || 0}
                    onClick={() => setActiveZoneId(zone.id)}
                    onResize={handleZoneResize}
                    allZones={customZones}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Vertical Filmstrip - 60% */}
          <AnimatePresence mode="wait">
            {activeZone && (
              <motion.div
                key={activeZoneId}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex-[0_0_60%] bg-white rounded-lg shadow-sm border border-neutral-200 p-2.5 flex flex-col min-h-[500px]"
              >
                {/* Filmstrip Header */}
                <div className="flex-shrink-0 mb-2 pb-2 border-b border-neutral-200">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-sm" />
                    <h4 className="text-xs font-bold text-neutral-900">
                      Zone {customZones.findIndex((z) => z.id === activeZoneId) + 1}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="gap-1 h-5 text-[10px] px-1.5 bg-blue-50 text-blue-700 border-blue-200">
                      <Clock className="h-2.5 w-2.5" />
                      {formatDuration(totalDuration)}
                    </Badge>
                    <Badge variant="outline" className="h-5 text-[10px] px-1.5">
                      {activeZoneMedia.length} {activeZoneMedia.length === 1 ? 'item' : 'items'}
                    </Badge>
                  </div>
                  {activeZoneMedia.length > 0 && (
                    <div className="text-[9px] text-muted-foreground mt-1.5">
                      💡 Drag items to reorder • Drop indicator shows position
                    </div>
                  )}
                </div>

                {/* Vertical Filmstrip */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={activeZoneMedia.map((m, i) => `${m.id}-${i}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ScrollArea className="flex-1">
                      <div className="flex flex-col gap-2.5 pr-2">
                        {/* Add Media Button - Horizontal layout matching media items */}
                        <div className="flex-shrink-0">
                          <MediaPickerPopover
                            onAddMedia={handleAddMedia}
                            selectedMediaIds={addedMediaIds}
                            trigger={
                              <button className="w-full bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-dashed border-primary/40 rounded-md p-2 hover:from-primary/10 hover:to-primary/15 hover:border-primary/60 hover:shadow-lg transition-all duration-200 cursor-pointer group relative">
                                {/* Sparkle effect */}
                                <div className="absolute top-1.5 right-1.5">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                                </div>
                                
                                {/* Horizontal Layout matching media items */}
                                <div className="flex gap-2 items-center">
                                  {/* Left: Icon Thumbnail */}
                                  <div className="flex-shrink-0 w-20 h-20 bg-white rounded border border-primary/20 group-hover:border-primary/40 transition-colors shadow-sm flex items-center justify-center relative overflow-hidden">
                                    <Plus className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
                                  </div>
                                  
                                  {/* Right: Text */}
                                  <div className="flex-1 text-left">
                                    <div className="text-[11px] font-bold text-primary mb-0.5">
                                      Add Media
                                    </div>
                                    <div className="text-[9px] text-primary/70 leading-tight">
                                      Click to browse library
                                    </div>
                                  </div>
                                </div>
                              </button>
                            }
                          />
                        </div>

                        {/* Media Items */}
                        {activeZoneMedia.length === 0 ? (
                          <div className="flex-1 flex items-center justify-center py-8 px-4">
                            <div className="text-center">
                              <div className="w-12 h-12 mx-auto mb-2 bg-neutral-100 rounded-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-neutral-400" />
                              </div>
                              <p className="text-xs font-medium text-neutral-600 mb-0.5">No media yet</p>
                              <p className="text-[10px] text-muted-foreground">Add media above</p>
                            </div>
                          </div>
                        ) : (
                          activeZoneMedia.map((media, index) => (
                            <SortableFilmstripItem
                              key={`${media.id}-${index}`}
                              media={media}
                              index={index}
                              onRemove={() => handleRemoveMedia(index)}
                              onDurationChange={(dur) => handleDurationChange(index, dur)}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </SortableContext>
                  
                  {/* Drag Overlay - Shows a preview of what's being dragged */}
                  <DragOverlay dropAnimation={null}>
                    {activeDragId ? (() => {
                      const dragIndex = activeZoneMedia.findIndex((_, i) => `${activeZoneMedia[i].id}-${i}` === activeDragId);
                      const dragMedia = activeZoneMedia[dragIndex];
                      
                      if (!dragMedia) return null;
                      
                      const IconComponent = (Icons as any)[dragMedia.thumbnail] || Icons.ImageIcon;
                      
                      return (
                        <div className="w-full bg-white border-2 border-primary rounded-md p-2 shadow-2xl rotate-3 scale-105">
                          <div className="flex gap-2">
                            <div className="relative flex-shrink-0 w-20 h-20">
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 rounded border-2 border-primary/50 flex items-center justify-center relative overflow-hidden">
                                {dragMedia.thumbnailUrl ? (
                                  <img 
                                    src={dragMedia.thumbnailUrl} 
                                    alt={dragMedia.name}
                                    className="w-full h-full object-cover opacity-90"
                                  />
                                ) : (
                                  <IconComponent className="h-6 w-6 text-primary" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <div className="text-[10px] font-bold truncate text-primary">
                                {dragMedia.name}
                              </div>
                              <div className="text-[9px] text-primary/70 mt-1">
                                Moving...
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })() : null}
                  </DragOverlay>
                </DndContext>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

