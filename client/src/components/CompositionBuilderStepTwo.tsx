import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MediaItem, LayoutTemplate } from "@/lib/mockCompositionData";
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
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mockMediaLibrary } from "@/lib/mockCompositionData";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CompositionBuilderStepTwoProps {
  selectedLayout: LayoutTemplate;
  zones: Record<string, MediaItem[]>;
  onZonesChange: (zones: Record<string, MediaItem[]>) => void;
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
  } = useSortable({ id: `${media.id}-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = (Icons as any)[media.thumbnail] || Icons.ImageIcon;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`relative flex-shrink-0 w-24 ${isDragging ? "opacity-50 z-50" : ""}`}
    >
      <div className="bg-white border border-neutral-300 rounded-md p-2 hover:border-primary transition-colors">
        {/* Media Thumbnail */}
        <div className="w-full aspect-square bg-neutral-100 rounded flex items-center justify-center mb-1.5">
          <IconComponent className="h-6 w-6 text-neutral-600" />
        </div>

        {/* Media Name */}
        <div className="text-[10px] font-medium truncate mb-1.5">{media.name}</div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <button
            {...attributes}
            {...listeners}
            className="flex items-center justify-center w-5 h-5 bg-neutral-100 hover:bg-neutral-200 rounded cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-3 w-3 text-neutral-600" />
          </button>
          <button
            onClick={onRemove}
            className="flex items-center justify-center w-5 h-5 bg-red-50 hover:bg-red-100 text-red-600 rounded"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        {/* Duration Input */}
        <div className="flex items-center gap-0.5">
          <Clock className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
          <Input
            type="number"
            value={media.duration || 5}
            onChange={(e) => onDurationChange(parseInt(e.target.value) || 5)}
            className="h-5 text-[10px] px-1 w-full"
            min={1}
          />
          <span className="text-[10px] text-muted-foreground">s</span>
        </div>
      </div>
    </motion.div>
  );
}

// Zone Selector Component
function ZoneSelector({
  zone,
  zoneNumber,
  isActive,
  mediaCount,
  onClick,
}: {
  zone: { id: string; name: string; x: number; y: number; width: number; height: number };
  zoneNumber: number;
  isActive: boolean;
  mediaCount: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        absolute rounded flex items-center justify-center transition-all duration-150 cursor-pointer
        ${
          isActive
            ? "bg-primary/10 border-2 border-primary shadow-md z-10"
            : "bg-white/50 border border-dashed border-neutral-400 hover:border-primary hover:bg-primary/5"
        }
      `}
      style={{
        top: `${zone.y}%`,
        left: `${zone.x}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
      }}
    >
      <div className="text-center px-2">
        <div className={`text-xs font-semibold ${isActive ? "text-primary" : "text-neutral-600"}`}>
          Zone {zoneNumber}
          {isActive && <span className="ml-1 text-[10px] font-normal">(Selected)</span>}
        </div>
        {mediaCount > 0 && (
          <Badge className="mt-0.5 h-4 text-[10px] bg-green-500 px-1.5">
            {mediaCount} media
          </Badge>
        )}
      </div>
    </motion.button>
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
        align="center" 
        side="top"
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
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </div>
                  )}

                  <div className="w-full aspect-square bg-neutral-100 rounded flex items-center justify-center mb-1.5">
                    <IconComponent className="h-5 w-5 text-neutral-600" />
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
}: CompositionBuilderStepTwoProps) {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(
    selectedLayout.zones[0]?.id || null
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeZone = selectedLayout.zones.find((z) => z.id === activeZoneId);
  const activeZoneMedia = activeZoneId ? zones[activeZoneId] || [] : [];
  const allZonesHaveMedia = selectedLayout.zones.every(
    (zone) => zones[zone.id] && zones[zone.id].length > 0
  );

  const addedMediaIds = activeZoneMedia.map((m) => m.id);

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

  const handleDragEnd = (event: DragEndEvent) => {
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
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{selectedLayout.name}</h3>
            <p className="text-xs text-muted-foreground">Click a zone to select, then add media</p>
          </div>
          {allZonesHaveMedia && (
            <Badge className="gap-1 h-6 text-xs bg-green-500">
              <CheckCircle2 className="h-3 w-3" />
              Ready
            </Badge>
          )}
        </div>

          {/* Mock Screen with Zones - Compact */}
          <div className="bg-white rounded-lg shadow-sm border p-3 mb-4">
            <div className="w-full max-w-[700px] mx-auto aspect-video bg-neutral-50 rounded border-2 border-neutral-300 relative">
              {selectedLayout.zones.map((zone, index) => (
                <ZoneSelector
                  key={zone.id}
                  zone={zone}
                  zoneNumber={index + 1}
                  isActive={activeZoneId === zone.id}
                  mediaCount={zones[zone.id]?.length || 0}
                  onClick={() => setActiveZoneId(zone.id)}
                />
              ))}
            </div>
          </div>

          {/* Filmstrip Timeline Section */}
          <AnimatePresence mode="wait">
            {activeZone && (
              <motion.div
                key={activeZoneId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white rounded-lg shadow-sm border p-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <h4 className="text-xs font-semibold">Zone {selectedLayout.zones.findIndex((z) => z.id === activeZoneId) + 1}</h4>
                    <Badge variant="secondary" className="gap-1 h-5 text-[10px] px-1.5">
                      <Clock className="h-2.5 w-2.5" />
                      {formatDuration(totalDuration)}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {activeZoneMedia.length} media
                    </span>
                  </div>
                </div>

                {/* Filmstrip */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={activeZoneMedia.map((m, i) => `${m.id}-${i}`)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <ScrollArea className="w-full">
                      <div className="flex gap-2.5 pb-2 min-w-min">
                        {/* Add Media Button in Filmstrip - Styled like a media item */}
                        <div className="flex-shrink-0 w-24">
                          <MediaPickerPopover
                            onAddMedia={handleAddMedia}
                            selectedMediaIds={addedMediaIds}
                            trigger={
                              <button className="w-full bg-white border border-dashed border-neutral-300 rounded-md p-2 border-primary hover:bg-neutral-50 transition-all cursor-pointer group">
                                {/* Icon placeholder */}
                                <div className="w-full aspect-square bg-neutral-50 group-hover:bg-neutral-100 rounded flex items-center justify-center mb-1.5 transition-colors">
                                  <Plus className="h-7 w-7 text-neutral-400 text-primary transition-colors" />
                                </div>

                                {/* Text label */}
                                <div className="text-[10px] font-medium text-center text-neutral-500 text-primary transition-colors">
                                  Add Media
                                </div>
                              </button>
                            }
                          />
                        </div>

                        {/* Media Items */}
                        {activeZoneMedia.map((media, index) => (
                          <SortableFilmstripItem
                            key={`${media.id}-${index}`}
                            media={media}
                            index={index}
                            onRemove={() => handleRemoveMedia(index)}
                            onDurationChange={(dur) => handleDurationChange(index, dur)}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </SortableContext>
                </DndContext>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}

