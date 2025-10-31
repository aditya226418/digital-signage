import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutTemplate, MediaItem } from "@/lib/mockCompositionData";
import { Play, Pause, ArrowLeft } from "lucide-react";
import * as Icons from "lucide-react";

interface PreviewSimulatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layout: LayoutTemplate;
  zones: Record<string, MediaItem[]>;
  onContinue: () => void;
}

export default function PreviewSimulatorModal({
  open,
  onOpenChange,
  layout,
  zones,
  onContinue,
}: PreviewSimulatorModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentItems, setCurrentItems] = useState<Record<string, number>>({});

  // Initialize current items for each zone
  useEffect(() => {
    const initial: Record<string, number> = {};
    layout.zones.forEach((zone) => {
      initial[zone.id] = 0;
    });
    setCurrentItems(initial);
  }, [layout.zones]);

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentItems((prev) => {
        const next = { ...prev };
        layout.zones.forEach((zone) => {
          const zoneMedia = zones[zone.id] || [];
          if (zoneMedia.length > 0) {
            next[zone.id] = (prev[zone.id] + 1) % zoneMedia.length;
          }
        });
        return next;
      });
    }, 2000); // Change every 2 seconds for demo

    return () => clearInterval(interval);
  }, [isPlaying, layout.zones, zones]);

  const getTotalDuration = (zoneId: string) => {
    const zoneMedia = zones[zoneId] || [];
    return zoneMedia.reduce((sum, item) => sum + (item.duration || 5), 0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Preview Your Composition</DialogTitle>
          <DialogDescription>
            See how your composition will look on the screen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Screen */}
          <div className="bg-neutral-900 rounded-xl p-6">
            <div className="w-full max-w-[900px] mx-auto aspect-video bg-neutral-800 rounded-lg border-2 border-neutral-700 relative overflow-hidden shadow-2xl">
              {/* Screen Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              {/* Zones with Content */}
              {layout.zones.map((zone) => {
                const zoneMedia = zones[zone.id] || [];
                const currentMediaIndex = currentItems[zone.id] || 0;
                const currentMedia = zoneMedia[currentMediaIndex];

                return (
                  <div
                    key={zone.id}
                    style={{
                      position: "absolute",
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.width}%`,
                      height: `${zone.height}%`,
                    }}
                    className="p-2"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded border border-primary/30 flex items-center justify-center relative overflow-hidden">
                      <AnimatePresence mode="wait">
                        {currentMedia && (
                          <motion.div
                            key={`${zone.id}-${currentMediaIndex}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center justify-center"
                          >
                            {(() => {
                              const IconComponent =
                                (Icons as any)[currentMedia.thumbnail] ||
                                Icons.ImageIcon;
                              return (
                                <IconComponent className="h-12 w-12 text-primary mb-2" />
                              );
                            })()}
                            <div className="text-xs font-medium text-center text-primary-foreground px-2">
                              {currentMedia.name}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Zone Label */}
                      <div className="absolute top-1 left-1">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-black/50 text-white"
                        >
                          {zone.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play
                </>
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              Simulating playback (2s per item)
            </span>
          </div>

          {/* Zone Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {layout.zones.map((zone) => {
              const zoneMedia = zones[zone.id] || [];
              const totalDuration = getTotalDuration(zone.id);

              return (
                <div
                  key={zone.id}
                  className="p-4 rounded-lg border border-neutral-200 bg-neutral-50"
                >
                  <div className="font-medium text-sm mb-1">{zone.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{zoneMedia.length} items</span>
                    <span>•</span>
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Edit
            </Button>
            <Button onClick={onContinue} className="gap-2">
              Continue to Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

