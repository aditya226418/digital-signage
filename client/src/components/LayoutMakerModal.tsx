import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  LayoutGrid,
  Split,
  Maximize2,
  X,
  Save,
  Grid3x3,
  Layers,
  Move,
  Sparkles,
  Copy,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { LayoutTemplate, LayoutZone, LayoutSlide } from "@/lib/mockCompositionData";

interface LayoutMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (layout: LayoutTemplate) => void;
}

export default function LayoutMakerModal({ isOpen, onClose, onSave }: LayoutMakerModalProps) {
  const [layoutName, setLayoutName] = useState("Custom Layout");
  const [layoutDescription, setLayoutDescription] = useState("My custom layout");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tempLayoutName, setTempLayoutName] = useState("Custom Layout");
  const [tempLayoutDescription, setTempLayoutDescription] = useState("My custom layout");
  const [slides, setSlides] = useState<LayoutSlide[]>([
    {
      id: `slide-${Date.now()}`,
      name: "Slide 1",
      zones: [],
    },
  ]);
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isHoveringHandle, setIsHoveringHandle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize activeSlideId on mount
  useEffect(() => {
    if (slides.length > 0 && !activeSlideId) {
      setActiveSlideId(slides[0].id);
    }
  }, [slides, activeSlideId]);

  // Get active slide
  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];
  
  // Zones are derived from active slide
  const zones = activeSlide?.zones || [];
  
  // Update zones - sync back to active slide
  const updateZones = useCallback((newZones: LayoutZone[]) => {
    if (!activeSlideId) return;
    setSlides(prevSlides =>
      prevSlides.map(slide =>
        slide.id === activeSlideId ? { ...slide, zones: newZones } : slide
      )
    );
  }, [activeSlideId]);

  // Slide management functions
  const addSlide = () => {
    const newSlideNumber = slides.length + 1;
    const newSlide: LayoutSlide = {
      id: `slide-${Date.now()}`,
      name: `Slide ${newSlideNumber}`,
      zones: [],
    };
    setSlides([...slides, newSlide]);
    setActiveSlideId(newSlide.id);
    setActiveZoneId(null);
  };

  const deleteSlide = (slideId: string) => {
    if (slides.length <= 1) return; // Must have at least one slide
    const newSlides = slides.filter(s => s.id !== slideId);
    setSlides(newSlides);
    if (activeSlideId === slideId) {
      // Switch to first slide if deleting active one
      setActiveSlideId(newSlides[0]?.id || null);
      setActiveZoneId(null);
    }
  };

  const duplicateSlide = (slideId: string) => {
    const slideToDuplicate = slides.find(s => s.id === slideId);
    if (!slideToDuplicate) return;
    
    const newSlide: LayoutSlide = {
      id: `slide-${Date.now()}`,
      name: `${slideToDuplicate.name} (Copy)`,
      zones: slideToDuplicate.zones.map(zone => ({
        ...zone,
        id: `zone-${Date.now()}-${Math.random()}`,
      })),
    };
    
    const slideIndex = slides.findIndex(s => s.id === slideId);
    const newSlides = [...slides];
    newSlides.splice(slideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setActiveSlideId(newSlide.id);
    setActiveZoneId(null);
  };

  const setActiveSlide = (slideId: string) => {
    setActiveSlideId(slideId);
    setActiveZoneId(null); // Reset active zone when switching slides
  };

  const updateSlideName = (slideId: string, name: string) => {
    setSlides(prevSlides =>
      prevSlides.map(slide =>
        slide.id === slideId ? { ...slide, name } : slide
      )
    );
  };

  const addZone = () => {
    const newZoneNumber = zones.length + 1;
    const newZone: LayoutZone = {
      id: `slide-${activeSlideId}-zone-${Date.now()}`,
      name: `Zone ${newZoneNumber}`,
      x: 10 + (newZoneNumber * 5) % 40,
      y: 10 + (newZoneNumber * 5) % 40,
      width: 40,
      height: 40,
    };
    updateZones([...zones, newZone]);
  };

  const deleteZone = (zoneId: string) => {
    updateZones(zones.filter(z => z.id !== zoneId));
    if (activeZoneId === zoneId) {
      setActiveZoneId(null);
    }
  };

  const handleZoneResize = useCallback((zoneId: string, updates: Partial<LayoutZone>) => {
    const newZones = zones.map(z =>
      z.id === zoneId ? { ...z, ...updates } : z
    );
    updateZones(newZones);
  }, [zones, updateZones]);

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string, zoneId: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setActiveZoneId(zoneId);
  }, []);

  useEffect(() => {
    if (!isResizing || !activeZoneId || !containerRef.current) return;

    const activeZone = zones.find(z => z.id === activeZoneId);
    if (!activeZone) return;

    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

      const MIN_SIZE = 10;
      let updates: Partial<LayoutZone> = {};

      if (resizeHandle === 'right') {
        const newWidth = Math.max(MIN_SIZE, Math.min(100 - activeZone.x, mouseX - activeZone.x));
        updates.width = newWidth;
      } else if (resizeHandle === 'bottom') {
        const newHeight = Math.max(MIN_SIZE, Math.min(100 - activeZone.y, mouseY - activeZone.y));
        updates.height = newHeight;
      } else if (resizeHandle === 'left') {
        const newX = Math.max(0, Math.min(activeZone.x + activeZone.width - MIN_SIZE, mouseX));
        const newWidth = (activeZone.x + activeZone.width) - newX;
        if (newWidth >= MIN_SIZE) {
          updates.x = newX;
          updates.width = newWidth;
        }
      } else if (resizeHandle === 'top') {
        const newY = Math.max(0, Math.min(activeZone.y + activeZone.height - MIN_SIZE, mouseY));
        const newHeight = (activeZone.y + activeZone.height) - newY;
        if (newHeight >= MIN_SIZE) {
          updates.y = newY;
          updates.height = newHeight;
        }
      } else if (resizeHandle === 'move') {
        const centerOffsetX = activeZone.width / 2;
        const centerOffsetY = activeZone.height / 2;
        const newX = Math.max(0, Math.min(100 - activeZone.width, mouseX - centerOffsetX));
        const newY = Math.max(0, Math.min(100 - activeZone.height, mouseY - centerOffsetY));
        updates.x = newX;
        updates.y = newY;
      }

      if (Object.keys(updates).length > 0) {
        handleZoneResize(activeZoneId, updates);
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
  }, [isResizing, resizeHandle, activeZoneId, zones, handleZoneResize, activeSlideId]);

  const addQuickLayout = (type: 'vertical' | 'horizontal' | 'grid2x2' | 'grid3x3') => {
    let newZones: LayoutZone[] = [];

    switch (type) {
      case 'vertical':
        newZones = [
          { id: `slide-${activeSlideId}-zone-${Date.now()}-1`, name: 'Left Panel', x: 0, y: 0, width: 50, height: 100 },
          { id: `slide-${activeSlideId}-zone-${Date.now()}-2`, name: 'Right Panel', x: 50, y: 0, width: 50, height: 100 },
        ];
        break;
      case 'horizontal':
        newZones = [
          { id: `slide-${activeSlideId}-zone-${Date.now()}-1`, name: 'Top Panel', x: 0, y: 0, width: 100, height: 50 },
          { id: `slide-${activeSlideId}-zone-${Date.now()}-2`, name: 'Bottom Panel', x: 0, y: 50, width: 100, height: 50 },
        ];
        break;
      case 'grid2x2':
        newZones = [
          { id: `slide-${activeSlideId}-zone-${Date.now()}-1`, name: 'Top Left', x: 0, y: 0, width: 50, height: 50 },
          { id: `slide-${activeSlideId}-zone-${Date.now()}-2`, name: 'Top Right', x: 50, y: 0, width: 50, height: 50 },
          { id: `slide-${activeSlideId}-zone-${Date.now()}-3`, name: 'Bottom Left', x: 0, y: 50, width: 50, height: 50 },
          { id: `slide-${activeSlideId}-zone-${Date.now()}-4`, name: 'Bottom Right', x: 50, y: 50, width: 50, height: 50 },
        ];
        break;
      case 'grid3x3':
        newZones = [];
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            newZones.push({
              id: `slide-${activeSlideId}-zone-${Date.now()}-${row * 3 + col + 1}`,
              name: `Zone ${row * 3 + col + 1}`,
              x: col * 33.33,
              y: row * 33.33,
              width: 33.33,
              height: 33.33,
            });
          }
        }
        break;
    }

    updateZones(newZones);
    setActiveZoneId(null);
  };

  const handleSaveClick = () => {
    // Validate that all slides have at least one zone
    const hasEmptySlides = slides.some(slide => slide.zones.length === 0);
    if (hasEmptySlides) {
      return;
    }
    // Initialize temp values with current values
    setTempLayoutName(layoutName);
    setTempLayoutDescription(layoutDescription);
    setShowSaveModal(true);
  };

  const handleSaveConfirm = () => {
    // Update the actual values
    setLayoutName(tempLayoutName);
    setLayoutDescription(tempLayoutDescription);

    const customLayout: LayoutTemplate = {
      id: `custom-${Date.now()}`,
      name: tempLayoutName || "Custom Layout",
      description: tempLayoutDescription || "My custom layout",
      resolution: "1920x1080",
      type: "multi-zone",
      // If only one slide, save as backward-compatible format (zones directly)
      // If multiple slides, save with slides array
      ...(slides.length === 1
        ? {
            zones: slides[0].zones.map((zone, index) => ({
              ...zone,
              name: zone.name || `Zone ${index + 1}`,
            })),
          }
        : {
            zones: [], // Empty for backward compatibility
            slides: slides.map(slide => ({
              ...slide,
              zones: slide.zones.map((zone, index) => ({
                ...zone,
                name: zone.name || `Zone ${index + 1}`,
              })),
            })),
          }),
    };
    setShowSaveModal(false);
    onSave(customLayout);
    onClose();
  };

  const isOverlapping = (zonesToCheck: LayoutZone[]) => {
    for (let i = 0; i < zonesToCheck.length; i++) {
      for (let j = i + 1; j < zonesToCheck.length; j++) {
        const z1 = zonesToCheck[i];
        const z2 = zonesToCheck[j];
        if (!(z1.x + z1.width <= z2.x || z2.x + z2.width <= z1.x ||
              z1.y + z1.height <= z2.y || z2.y + z2.height <= z1.y)) {
          return true;
        }
      }
    }
    return false;
  };

  const hasOverlap = isOverlapping(zones);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-full w-screen h-screen p-0 rounded-none">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <LayoutGrid className="h-6 w-6 text-primary" />
              Custom Layout Builder
            </DialogTitle>
            <div className="flex items-center gap-2 mr-7">
              {slides.some(s => s.zones.length === 0) && (
                <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                  ℹ️ Add zones to save
                </div>
              )}
              {hasOverlap && zones.length > 0 && (
                <div className="px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  ⚠️ Zones overlapping
                </div>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                className="h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveClick}
                className="h-9 gap-2"
                disabled={slides.some(s => s.zones.length === 0)}
              >
                <Save className="h-4 w-4" />
                Save Layout
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-[calc(100vh-100px)]">
          {/* Left Panel - Controls */}
          <div className="w-80 border-r bg-neutral-50/50 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {/* Slides Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Slides ({slides.length})
                  </h3>
                  <Button
                    onClick={addSlide}
                    size="sm"
                    className="h-6 px-2 text-[10px] gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`p-2.5 rounded-lg border-2 transition-all ${
                        activeSlideId === slide.id
                          ? 'border-primary bg-primary/5'
                          : 'border-neutral-200 bg-white hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                            activeSlideId === slide.id
                              ? 'bg-primary text-white'
                              : 'bg-neutral-200 text-neutral-600'
                          }`}>
                            {index + 1}
                          </div>
                          <Input
                            value={slide.name}
                            onChange={(e) => updateSlideName(slide.id, e.target.value)}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSlide(slide.id);
                            }}
                            className="h-6 text-[11px] font-semibold px-2 flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateSlide(slide.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-neutral-600 hover:text-primary hover:bg-primary/10"
                            title="Duplicate slide"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {slides.length > 1 && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSlide(slide.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete slide"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-neutral-600">
                        {slide.zones.length} {slide.zones.length === 1 ? 'zone' : 'zones'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Templates */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  Quick Templates
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => addQuickLayout('vertical')}
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 flex flex-col gap-1.5"
                  >
                    <Split className="h-4 w-4 rotate-90" />
                    <span className="text-[10px]">Vertical</span>
                  </Button>
                  <Button
                    onClick={() => addQuickLayout('horizontal')}
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 flex flex-col gap-1.5"
                  >
                    <Split className="h-4 w-4" />
                    <span className="text-[10px]">Horizontal</span>
                  </Button>
                  <Button
                    onClick={() => addQuickLayout('grid2x2')}
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 flex flex-col gap-1.5"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="text-[10px]">2×2 Grid</span>
                  </Button>
                  <Button
                    onClick={() => addQuickLayout('grid3x3')}
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 flex flex-col gap-1.5"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    <span className="text-[10px]">3×3 Grid</span>
                  </Button>
                </div>
              </div>

              {/* Zones List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Maximize2 className="h-4 w-4" />
                    Zones ({zones.length})
                  </h3>
                  <Button
                    onClick={addZone}
                    size="sm"
                    className="h-6 px-2 text-[10px] gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {zones.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-white rounded-lg border-2 border-dashed border-neutral-300">
                      <Maximize2 className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs text-neutral-600 font-medium mb-1">No zones yet</p>
                      <p className="text-[10px] text-neutral-500">
                        Add zones or use a quick template
                      </p>
                    </div>
                  ) : (
                    zones.map((zone, index) => (
                    <div
                      key={zone.id}
                      className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer ${
                        activeZoneId === zone.id
                          ? 'border-primary bg-primary/5'
                          : 'border-neutral-200 bg-white hover:border-primary/50'
                      }`}
                      onClick={() => setActiveZoneId(zone.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </div>
                          <Input
                            value={zone.name}
                            onChange={(e) => {
                              const newZones = zones.map(z =>
                                z.id === zone.id ? { ...z, name: e.target.value } : z
                              );
                              updateZones(newZones);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-6 text-[11px] font-semibold px-2 flex-1"
                          />
                        </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteZone(zone.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-neutral-600">X:</span>
                          <span className="ml-1 font-mono font-semibold">{zone.x.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-neutral-600">Y:</span>
                          <span className="ml-1 font-mono font-semibold">{zone.y.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-neutral-600">W:</span>
                          <span className="ml-1 font-mono font-semibold">{zone.width.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-neutral-600">H:</span>
                          <span className="ml-1 font-mono font-semibold">{zone.height.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Canvas */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-[900px] mx-auto">
              {/* Slide Selector */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Layout Preview</h3>
                    <p className="text-xs text-muted-foreground">
                      Slide {activeSlideId ? slides.findIndex(s => s.id === activeSlideId) + 1 : 1} of {slides.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        const currentIndex = slides.findIndex(s => s.id === activeSlideId);
                        if (currentIndex > 0) {
                          setActiveSlide(slides[currentIndex - 1].id);
                        }
                      }}
                      variant="outline"
                      size="sm"
                      disabled={slides.findIndex(s => s.id === activeSlideId) === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        const currentIndex = slides.findIndex(s => s.id === activeSlideId);
                        if (currentIndex < slides.length - 1) {
                          setActiveSlide(slides[currentIndex + 1].id);
                        }
                      }}
                      variant="outline"
                      size="sm"
                      disabled={slides.findIndex(s => s.id === activeSlideId) === slides.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Slide Tabs */}
                {slides.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.id}
                        onClick={() => setActiveSlide(slide.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                          activeSlideId === slide.id
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-white border border-neutral-200 text-neutral-700 hover:border-primary/50'
                        }`}
                      >
                        <span className="w-5 h-5 rounded bg-white/20 text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="max-w-[100px] truncate">{slide.name}</span>
                        <span className="text-[10px] opacity-75">({slide.zones.length})</span>
                      </button>
                    ))}
                    <Button
                      onClick={addSlide}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 flex-shrink-0"
                      title="Add new slide"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Click and drag zones to move them. Drag edges to resize. Click a zone to select it.
                </p>
              </div>

              <div
                ref={containerRef}
                className="w-full aspect-video bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-lg border-2 border-neutral-300 relative shadow-inner overflow-hidden"
              >
                {zones.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-8">
                      <div className="relative inline-block mb-4">
                        <LayoutGrid className="h-24 w-24 text-neutral-300" />
                        <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-700 mb-2">Start Building Your Layout</h3>
                      <p className="text-sm text-neutral-500 mb-6 max-w-md">
                        Use the quick templates on the left or click "Add" to create zones manually
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <Button onClick={() => addQuickLayout('vertical')} variant="outline" size="sm" className="gap-2">
                          <Split className="h-4 w-4 rotate-90" />
                          Vertical Split
                        </Button>
                        <Button onClick={() => addQuickLayout('horizontal')} variant="outline" size="sm" className="gap-2">
                          <Split className="h-4 w-4" />
                          Horizontal Split
                        </Button>
                        <Button onClick={addZone} className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Zone
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  zones.map((zone, index) => {
                  const isActive = activeZoneId === zone.id;
                  
                  return (
                    <motion.div
                      key={zone.id}
                      className={`absolute rounded-md flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                        isActive
                          ? 'bg-primary/15 border-2 border-primary shadow-md z-10 ring-2 ring-primary/30'
                          : 'bg-white/70 border-2 border-dashed border-neutral-400 hover:border-primary/60 hover:bg-primary/10 hover:shadow-md cursor-pointer'
                      }`}
                      style={{
                        top: `${zone.y}%`,
                        left: `${zone.x}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                      }}
                      onClick={() => setActiveZoneId(zone.id)}
                    >
                      {/* Zone Label */}
                      <div className="text-center px-2 pointer-events-none">
                        <div className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-neutral-700'}`}>
                          {zone.name}
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1">
                          {zone.width.toFixed(0)}% × {zone.height.toFixed(0)}%
                        </div>
                      </div>

                      {/* Scale Indicator */}
                      <AnimatePresence>
                        {(isResizing && activeZoneId === zone.id) || isHoveringHandle && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm border-2 border-primary rounded-lg shadow-lg px-2 py-1 z-30 pointer-events-none"
                          >
                            <div className="text-[9px] font-bold text-primary mb-0.5 flex items-center gap-1">
                              <Move className="h-2.5 w-2.5" />
                              Dimensions
                            </div>
                            <div className="space-y-0.5 text-[8px]">
                              <div>
                                <span className="text-neutral-600">W:</span>
                                <span className="ml-1 font-bold text-neutral-900">{zone.width.toFixed(1)}%</span>
                              </div>
                              <div>
                                <span className="text-neutral-600">H:</span>
                                <span className="ml-1 font-bold text-neutral-900">{zone.height.toFixed(1)}%</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Move Handle - Center */}
                      {isActive && (
                        <div
                          onMouseDown={(e) => handleResizeStart(e, 'move', zone.id)}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/90 rounded-full cursor-move z-20 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <Move className="h-4 w-4 text-white" />
                        </div>
                      )}

                      {/* Resize Handles */}
                      {isActive && (
                        <>
                          {/* Right */}
                          <div
                            onMouseDown={(e) => handleResizeStart(e, 'right', zone.id)}
                            onMouseEnter={() => setIsHoveringHandle(true)}
                            onMouseLeave={() => setIsHoveringHandle(false)}
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize group hover:bg-primary/30 transition-colors z-20"
                            style={{ transform: 'translateX(50%)' }}
                          >
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-primary opacity-0 group-hover:opacity-100" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 shadow-md flex items-center justify-center">
                              <GripVertical className="h-2.5 w-2.5 text-primary" />
                            </div>
                          </div>

                          {/* Bottom */}
                          <div
                            onMouseDown={(e) => handleResizeStart(e, 'bottom', zone.id)}
                            onMouseEnter={() => setIsHoveringHandle(true)}
                            onMouseLeave={() => setIsHoveringHandle(false)}
                            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize group hover:bg-primary/30 transition-colors z-20"
                            style={{ transform: 'translateY(50%)' }}
                          >
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-primary opacity-0 group-hover:opacity-100" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 shadow-md flex items-center justify-center">
                              <GripVertical className="h-2.5 w-2.5 text-primary rotate-90" />
                            </div>
                          </div>

                          {/* Left */}
                          <div
                            onMouseDown={(e) => handleResizeStart(e, 'left', zone.id)}
                            onMouseEnter={() => setIsHoveringHandle(true)}
                            onMouseLeave={() => setIsHoveringHandle(false)}
                            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize group hover:bg-primary/30 transition-colors z-20"
                            style={{ transform: 'translateX(-50%)' }}
                          >
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-primary opacity-0 group-hover:opacity-100" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 shadow-md flex items-center justify-center">
                              <GripVertical className="h-2.5 w-2.5 text-primary" />
                            </div>
                          </div>

                          {/* Top */}
                          <div
                            onMouseDown={(e) => handleResizeStart(e, 'top', zone.id)}
                            onMouseEnter={() => setIsHoveringHandle(true)}
                            onMouseLeave={() => setIsHoveringHandle(false)}
                            className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize group hover:bg-primary/30 transition-colors z-20"
                            style={{ transform: 'translateY(-50%)' }}
                          >
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-primary opacity-0 group-hover:opacity-100" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 bg-white border-2 border-primary rounded-full opacity-0 group-hover:opacity-100 shadow-md flex items-center justify-center">
                              <GripVertical className="h-2.5 w-2.5 text-primary rotate-90" />
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })
                )}
              </div>

              {/* Tips */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-xs font-semibold text-blue-900 mb-2">💡 Tips:</h4>
                <ul className="text-[10px] text-blue-800 space-y-1">
                  <li>• Use quick templates to start with common layouts</li>
                  <li>• Drag the center handle to move zones</li>
                  <li>• Drag edges to resize zones</li>
                  <li>• Click "Add" to create additional zones</li>
                  <li>• Zones can overlap, but it's recommended to avoid it</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      {/* Save Layout Info Modal */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="h-5 w-5 text-primary" />
              Save Layout
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="save-layout-name" className="text-sm font-medium">
                Layout Name
              </Label>
              <Input
                id="save-layout-name"
                value={tempLayoutName}
                onChange={(e) => setTempLayoutName(e.target.value)}
                placeholder="My Custom Layout"
                className="mt-2"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="save-layout-desc" className="text-sm font-medium">
                Description
              </Label>
              <Input
                id="save-layout-desc"
                value={tempLayoutDescription}
                onChange={(e) => setTempLayoutDescription(e.target.value)}
                placeholder="Description..."
                className="mt-2"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowSaveModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveConfirm}
              disabled={!tempLayoutName.trim()}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Layout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

