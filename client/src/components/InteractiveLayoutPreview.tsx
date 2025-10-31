import { motion } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";
import { LayoutTemplate, MediaItem, LayoutZone } from "@/lib/mockCompositionData";
import { Plus, CheckCircle2 } from "lucide-react";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InteractiveLayoutPreviewProps {
  layout: LayoutTemplate;
  zones: Record<string, MediaItem[]>;
  activeZoneId: string | null;
  onZoneClick: (zoneId: string) => void;
}

function DroppableZone({
  zone,
  media,
  isActive,
  onClick,
}: {
  zone: LayoutZone;
  media: MediaItem[];
  isActive: boolean;
  onClick: () => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: zone.id,
  });

  const isEmpty = media.length === 0;

  return (
    <motion.div
      ref={setNodeRef}
      onClick={onClick}
      initial={false}
      animate={{
        scale: isActive ? 1.02 : 1,
      }}
      whileHover={{
        scale: isEmpty ? 1.01 : 1,
      }}
      transition={{ duration: 0.12 }}
      style={{
        position: "absolute",
        left: `${zone.x}%`,
        top: `${zone.y}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
      }}
      className={`
        rounded-md flex flex-col items-center justify-center cursor-pointer
        transition-all duration-150
        ${
          isEmpty
            ? `border-2 border-dashed ${
                isOver
                  ? "border-primary bg-primary/10"
                  : isActive
                  ? "border-primary bg-primary/5"
                  : "border-neutral-300 bg-neutral-50/50"
              }`
            : `border-2 ${
                isActive
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : "border-neutral-200"
              } bg-white`
        }
      `}
    >
      {isEmpty ? (
        <div className="text-center p-4">
          <Plus
            className={`h-8 w-8 mx-auto mb-2 ${
              isOver ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <div className="text-xs font-medium text-muted-foreground">
            {zone.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Drag media here
          </div>
        </div>
      ) : (
        <div className="w-full h-full p-2 flex flex-col">
          {/* Zone Label */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {zone.name}
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {media.length}
            </Badge>
          </div>

          {/* Media Grid */}
          <div className="flex-1 grid grid-cols-2 gap-2 overflow-hidden">
            {media.slice(0, 4).map((item, index) => {
              const IconComponent = (Icons as any)[item.thumbnail] || Icons.ImageIcon;
              return (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-neutral-50 rounded border border-neutral-200 flex items-center justify-center p-2"
                >
                  <IconComponent className="h-4 w-4 text-neutral-600" />
                </div>
              );
            })}
          </div>

          {media.length > 4 && (
            <div className="text-xs text-center text-muted-foreground mt-2">
              +{media.length - 4} more
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function InteractiveLayoutPreview({
  layout,
  zones,
  activeZoneId,
  onZoneClick,
}: InteractiveLayoutPreviewProps) {
  const allZonesFilled = layout.zones.every(
    (zone) => zones[zone.id] && zones[zone.id].length > 0
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col min-h-[500px]">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">{layout.name}</h3>
            <p className="text-sm text-muted-foreground">
              {layout.zones.length} zone{layout.zones.length !== 1 ? "s" : ""}
            </p>
          </div>
          {allZonesFilled && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              <Badge className="gap-1 bg-green-500">
                <CheckCircle2 className="h-3 w-3" />
                All zones filled
              </Badge>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mock Screen Container */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-6">
        <div className="w-full max-w-[900px] aspect-video bg-neutral-100 rounded-lg border-2 border-neutral-300 relative shadow-inner overflow-hidden">
          {/* Screen Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

          {/* Zones */}
          {layout.zones.map((zone) => (
            <DroppableZone
              key={zone.id}
              zone={zone}
              media={zones[zone.id] || []}
              isActive={activeZoneId === zone.id}
              onClick={() => onZoneClick(zone.id)}
            />
          ))}
        </div>
      </div>

      {/* Hint */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Click a zone to select it, then drag media from the library
      </div>
    </div>
  );
}

