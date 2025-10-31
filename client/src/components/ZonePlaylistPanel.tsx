import { MediaItem } from "@/lib/mockCompositionData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical, Trash2, Clock } from "lucide-react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ZonePlaylistPanelProps {
  zoneName: string;
  media: MediaItem[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onRemove: (index: number) => void;
  onDurationChange: (index: number, duration: number) => void;
  className?: string;
}

interface SortableMediaItemProps {
  media: MediaItem;
  index: number;
  onRemove: () => void;
  onDurationChange: (duration: number) => void;
}

function SortableMediaItem({
  media,
  index,
  onRemove,
  onDurationChange,
}: SortableMediaItemProps) {
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
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-white
        ${isDragging ? "opacity-50 shadow-lg" : ""}
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing flex-shrink-0"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Media Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center">
        <IconComponent className="h-5 w-5 text-neutral-600" />
      </div>

      {/* Media Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{media.name}</div>
        <Badge variant="outline" className="text-xs mt-1 capitalize">
          {media.type}
        </Badge>
      </div>

      {/* Duration Input */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Input
          type="number"
          min="1"
          value={media.duration || 5}
          onChange={(e) => onDurationChange(parseInt(e.target.value) || 5)}
          className="w-16 h-8 text-center text-xs"
        />
        <span className="text-xs text-muted-foreground">s</span>
      </div>

      {/* Remove Button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className="flex-shrink-0 h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function ZonePlaylistPanel({
  zoneName,
  media,
  onReorder,
  onRemove,
  onDurationChange,
  className,
}: ZonePlaylistPanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = media.findIndex(
        (_, i) => `${media[i].id}-${i}` === active.id
      );
      const newIndex = media.findIndex(
        (_, i) => `${media[i].id}-${i}` === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  };

  const totalDuration = media.reduce((sum, item) => sum + (item.duration || 5), 0);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm h-full flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{zoneName}</h3>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(totalDuration)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {media.length} item{media.length !== 1 ? "s" : ""} in playlist
        </p>
      </div>

      {/* Playlist Items */}
      <ScrollArea className="flex-1 min-h-0 p-4">
        {media.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-8">
            <div>
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                <Icons.ListPlus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No media assigned
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag media from the library to this zone
              </p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={media.map((m, i) => `${m.id}-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {media.map((item, index) => (
                  <SortableMediaItem
                    key={`${item.id}-${index}`}
                    media={item}
                    index={index}
                    onRemove={() => onRemove(index)}
                    onDurationChange={(duration) =>
                      onDurationChange(index, duration)
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </ScrollArea>

      {/* Footer Hint */}
      {media.length > 0 && (
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Drag to reorder • Edit duration • Remove items
          </p>
        </div>
      )}
    </div>
  );
}

