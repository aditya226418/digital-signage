import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { LayoutTemplate, MediaItem } from "@/lib/mockCompositionData";
import CompositionStepProgress from "@/components/CompositionStepProgress";
import LayoutPicker from "@/components/LayoutPicker";
import MediaLibraryPanel from "@/components/MediaLibraryPanel";
import InteractiveLayoutPreview from "@/components/InteractiveLayoutPreview";
import ZonePlaylistPanel from "@/components/ZonePlaylistPanel";
import PreviewSimulatorModal from "@/components/PreviewSimulatorModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Eye, X, CheckCircle2, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompositionBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CompositionBuilderModal({
  open,
  onOpenChange,
  onSuccess,
}: CompositionBuilderModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState<LayoutTemplate | null>(null);
  const [zones, setZones] = useState<Record<string, MediaItem[]>>({});
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [compositionName, setCompositionName] = useState("");
  const [compositionStatus, setCompositionStatus] = useState<"active" | "draft">("draft");
  const [showPreview, setShowPreview] = useState(false);
  const [activeDragItem, setActiveDragItem] = useState<MediaItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleLayoutSelect = (layout: LayoutTemplate) => {
    setSelectedLayout(layout);
    const initialZones: Record<string, MediaItem[]> = {};
    layout.zones.forEach((zone) => {
      initialZones[zone.id] = [];
    });
    setZones(initialZones);
    setActiveZoneId(layout.zones[0]?.id || null);
    setStep(2);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const mediaItem = event.active.data.current as MediaItem;
    setActiveDragItem(mediaItem);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragItem(null);
    const { active, over } = event;

    if (!over) return;

    const mediaItem = active.data.current as MediaItem;
    const zoneId = over.id as string;

    if (mediaItem && zoneId) {
      setZones((prev) => ({
        ...prev,
        [zoneId]: [...(prev[zoneId] || []), { ...mediaItem }],
      }));
      setActiveZoneId(zoneId);
    }
  };

  const handleZoneReorder = (zoneId: string, oldIndex: number, newIndex: number) => {
    setZones((prev) => {
      const zoneMedia = [...(prev[zoneId] || [])];
      const [removed] = zoneMedia.splice(oldIndex, 1);
      zoneMedia.splice(newIndex, 0, removed);
      return {
        ...prev,
        [zoneId]: zoneMedia,
      };
    });
  };

  const handleZoneRemove = (zoneId: string, index: number) => {
    setZones((prev) => {
      const zoneMedia = [...(prev[zoneId] || [])];
      zoneMedia.splice(index, 1);
      return {
        ...prev,
        [zoneId]: zoneMedia,
      };
    });
  };

  const handleZoneDurationChange = (
    zoneId: string,
    index: number,
    duration: number
  ) => {
    setZones((prev) => {
      const zoneMedia = [...(prev[zoneId] || [])];
      zoneMedia[index] = { ...zoneMedia[index], duration };
      return {
        ...prev,
        [zoneId]: zoneMedia,
      };
    });
  };

  const handleSaveComposition = () => {
    const composition = {
      id: `comp-${Date.now()}`,
      name: compositionName || "Untitled Composition",
      layout: selectedLayout,
      zones,
      status: compositionStatus,
      createdBy: "Current User",
      createdDate: new Date().toISOString().split("T")[0],
      screens: 0,
    };

    const saved = localStorage.getItem("compositions");
    const compositions = saved ? JSON.parse(saved) : [];
    compositions.push(composition);
    localStorage.setItem("compositions", JSON.stringify(compositions));

    // Show success state
    setShowSuccess(true);
    setTimeout(() => {
      handleClose();
      toast({
        title: "Composition created successfully!",
        description: `${compositionName || "Untitled Composition"} has been saved.`,
      });
      onSuccess?.();
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedLayout(null);
    setZones({});
    setActiveZoneId(null);
    setCompositionName("");
    setCompositionStatus("draft");
    setShowPreview(false);
    setActiveDragItem(null);
    setShowSuccess(false);
    onOpenChange(false);
  };

  const activeZone = selectedLayout?.zones.find((z) => z.id === activeZoneId);
  const canPreview =
    selectedLayout &&
    Object.values(zones).some((zoneMedia) => zoneMedia.length > 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[100vw] w-screen h-screen p-0 gap-0 border-0">
        {showSuccess ? (
          // Success State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-50 via-white to-blue-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <CheckCircle2 className="h-20 w-20 text-green-500 mb-4" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-2"
            >
              Composition Created!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {compositionName || "Your composition"} is ready to use
            </motion.p>
          </motion.div>
        ) : (
          // Builder Content
          <div className="flex flex-col h-full bg-neutral-50 overflow-hidden">
            {/* Header with Step Progress and Close Button */}
            <div className="sticky top-0 z-50 bg-white border-b border-border/40 px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold">Create Composition</h2>
                  <div className="hidden md:block h-6 w-px bg-border" />
                  <CompositionStepProgress currentStep={step} />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <AnimatePresence mode="wait">
                {/* Step 1: Layout Selection */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <LayoutPicker onSelectLayout={handleLayoutSelect} />
                  </motion.div>
                )}

                {/* Step 2: Add Media to Zones */}
                {step === 2 && selectedLayout && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="w-full max-w-[1400px] mx-auto px-6 py-8"
                  >
                    <DndContext
                      sensors={sensors}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_360px] gap-6 min-h-[600px]">
                        <MediaLibraryPanel className="hidden lg:flex max-h-[calc(100vh-240px)]" />
                        <InteractiveLayoutPreview
                          layout={selectedLayout}
                          zones={zones}
                          activeZoneId={activeZoneId}
                          onZoneClick={setActiveZoneId}
                        />
                        {activeZone && (
                          <ZonePlaylistPanel
                            zoneName={activeZone.name}
                            media={zones[activeZone.id] || []}
                            onReorder={(oldIdx, newIdx) =>
                              handleZoneReorder(activeZone.id, oldIdx, newIdx)
                            }
                            onRemove={(idx) => handleZoneRemove(activeZone.id, idx)}
                            onDurationChange={(idx, dur) =>
                              handleZoneDurationChange(activeZone.id, idx, dur)
                            }
                            className="hidden lg:flex max-h-[calc(100vh-240px)]"
                          />
                        )}
                      </div>

                      <DragOverlay>
                        {activeDragItem && (
                          <div className="bg-white rounded-lg p-3 shadow-lg border-2 border-primary">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const IconComponent =
                                  (Icons as any)[activeDragItem.thumbnail] ||
                                  Icons.ImageIcon;
                                return (
                                  <IconComponent className="h-5 w-5 text-neutral-600" />
                                );
                              })()}
                              <span className="font-medium text-sm">
                                {activeDragItem.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </DragOverlay>
                    </DndContext>

                    <div className="mt-6 flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Change Layout
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowPreview(true)}
                          disabled={!canPreview}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </Button>
                        <Button onClick={() => setStep(3)} disabled={!canPreview}>
                          Continue to Save
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Save Composition */}
                {step === 3 && selectedLayout && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="w-full max-w-[800px] mx-auto px-6 py-8"
                  >
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                      <h2 className="text-2xl font-bold mb-2">Save Your Composition</h2>
                      <p className="text-muted-foreground mb-8">
                        Give your composition a name and set its status
                      </p>

                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="composition-name">Composition Name</Label>
                          <Input
                            id="composition-name"
                            value={compositionName}
                            onChange={(e) => setCompositionName(e.target.value)}
                            placeholder="e.g., Cafe Menu Display"
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="composition-status">Status</Label>
                          <Select
                            value={compositionStatus}
                            onValueChange={(value: "active" | "draft") =>
                              setCompositionStatus(value)
                            }
                          >
                            <SelectTrigger id="composition-status" className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                          <h3 className="font-semibold mb-3">Composition Summary</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Layout:</span>
                              <span className="font-medium">{selectedLayout.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Zones:</span>
                              <span className="font-medium">
                                {selectedLayout.zones.length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Total Media Items:
                              </span>
                              <span className="font-medium">
                                {Object.values(zones).reduce(
                                  (sum, z) => sum + z.length,
                                  0
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8 pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Edit
                        </Button>
                        <Button
                          onClick={handleSaveComposition}
                          disabled={!compositionName.trim()}
                        >
                          Save Composition
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {selectedLayout && (
          <PreviewSimulatorModal
            open={showPreview}
            onOpenChange={setShowPreview}
            layout={selectedLayout}
            zones={zones}
            onContinue={() => {
              setShowPreview(false);
              setStep(3);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

