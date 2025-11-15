import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutTemplate, MediaItem } from "@/lib/mockCompositionData";
import CompositionStepProgress from "@/components/CompositionStepProgress";
import LayoutPicker from "@/components/LayoutPicker";
import CompositionBuilderStepTwo from "@/components/CompositionBuilderStepTwo";
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
import { X, CheckCircle2, Sparkles, ArrowLeft, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LayoutMakerModal from "@/components/LayoutMakerModal";

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
  const [compositionName, setCompositionName] = useState("");
  const [compositionStatus, setCompositionStatus] = useState<"active" | "draft">("draft");
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLayoutMakerOpen, setIsLayoutMakerOpen] = useState(false);

  const handleLayoutSelect = (layout: LayoutTemplate) => {
    setSelectedLayout(layout);
    // Handle both single-slide and multi-slide layouts
    const zonesToUse = layout.slides && layout.slides.length > 0 
      ? layout.slides[0].zones 
      : layout.zones;
    const initialZones: Record<string, MediaItem[]> = {};
    zonesToUse.forEach((zone) => {
      initialZones[zone.id] = [];
    });
    setZones(initialZones);
    setStep(2);
  };

  const handleCustomLayoutSave = (layout: LayoutTemplate) => {
    handleLayoutSelect(layout);
    setIsLayoutMakerOpen(false);
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
    setCompositionName("");
    setCompositionStatus("draft");
    setShowPreview(false);
    setShowSuccess(false);
    onOpenChange(false);
  };

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
            <div className="sticky top-0 z-50 bg-white border-b border-border/40 px-6 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold">Create Composition</h2>
                  <div className="hidden md:block h-6 w-px bg-border" />
                  <CompositionStepProgress currentStep={step} />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsLayoutMakerOpen(true)}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    Create Custom Layout
                  </Button>
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
                    className="h-full"
                  >
                    <CompositionBuilderStepTwo
                      selectedLayout={selectedLayout}
                      zones={zones}
                      onZonesChange={setZones}
                      onChangeLayout={() => setStep(1)}
                      onPreview={() => setShowPreview(true)}
                      onContinue={() => setStep(3)}
                    />
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

        {/* Layout Maker Modal */}
        <LayoutMakerModal
          isOpen={isLayoutMakerOpen}
          onClose={() => setIsLayoutMakerOpen(false)}
          onSave={handleCustomLayoutSave}
        />
      </DialogContent>
    </Dialog>
  );
}

