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
} from "lucide-react";
import { LayoutTemplate, LayoutZone } from "@/lib/mockCompositionData";

interface LayoutMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (layout: LayoutTemplate) => void;
}

export default function LayoutMakerModal({ isOpen, onClose, onSave }: LayoutMakerModalProps) {
  const [layoutName, setLayoutName] = useState("Custom Layout");
  const [layoutDescription, setLayoutDescription] = useState("My custom layout");
  const [zones, setZones] = useState<LayoutZone[]>([]);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isHoveringHandle, setIsHoveringHandle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const addZone = () => {
    const newZoneNumber = zones.length + 1;
    const newZone: LayoutZone = {
      id: `custom-zone-${Date.now()}`,
      name: `Zone ${newZoneNumber}`,
      x: 10 + (newZoneNumber * 5) % 40,
      y: 10 + (newZoneNumber * 5) % 40,
      width: 40,
      height: 40,
    };
    setZones([...zones, newZone]);
  };

  const deleteZone = (zoneId: string) => {
    setZones(zones.filter(z => z.id !== zoneId));
    if (activeZoneId === zoneId) {
      setActiveZoneId(null);
    }
  };

  const handleZoneResize = useCallback((zoneId: string, updates: Partial<LayoutZone>) => {
    setZones(prevZones =>
      prevZones.map(z =>
        z.id === zoneId ? { ...z, ...updates } : z
      )
    );
  }, []);

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
  }, [isResizing, resizeHandle, activeZoneId, zones, handleZoneResize]);

  const addQuickLayout = (type: 'vertical' | 'horizontal' | 'grid2x2' | 'grid3x3') => {
    let newZones: LayoutZone[] = [];

    switch (type) {
      case 'vertical':
        newZones = [
          { id: 'zone-1', name: 'Left Panel', x: 0, y: 0, width: 50, height: 100 },
          { id: 'zone-2', name: 'Right Panel', x: 50, y: 0, width: 50, height: 100 },
        ];
        break;
      case 'horizontal':
        newZones = [
          { id: 'zone-1', name: 'Top Panel', x: 0, y: 0, width: 100, height: 50 },
          { id: 'zone-2', name: 'Bottom Panel', x: 0, y: 50, width: 100, height: 50 },
        ];
        break;
      case 'grid2x2':
        newZones = [
          { id: 'zone-1', name: 'Top Left', x: 0, y: 0, width: 50, height: 50 },
          { id: 'zone-2', name: 'Top Right', x: 50, y: 0, width: 50, height: 50 },
          { id: 'zone-3', name: 'Bottom Left', x: 0, y: 50, width: 50, height: 50 },
          { id: 'zone-4', name: 'Bottom Right', x: 50, y: 50, width: 50, height: 50 },
        ];
        break;
      case 'grid3x3':
        newZones = [];
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            newZones.push({
              id: `zone-${row * 3 + col + 1}`,
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

    setZones(newZones);
    setActiveZoneId(null);
  };

  const handleSave = () => {
    const customLayout: LayoutTemplate = {
      id: `custom-${Date.now()}`,
      name: layoutName,
      description: layoutDescription,
      zones: zones.map((zone, index) => ({
        ...zone,
        name: zone.name || `Zone ${index + 1}`,
      })),
      resolution: "1920x1080",
      type: "multi-zone",
    };
    onSave(customLayout);
    onClose();
  };

  const isOverlapping = () => {
    for (let i = 0; i < zones.length; i++) {
      for (let j = i + 1; j < zones.length; j++) {
        const z1 = zones[i];
        const z2 = zones[j];
        if (!(z1.x + z1.width <= z2.x || z2.x + z2.width <= z1.x ||
              z1.y + z1.height <= z2.y || z2.y + z2.height <= z1.y)) {
          return true;
        }
      }
    }
    return false;
  };

  const hasOverlap = isOverlapping();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-screen h-screen p-0 rounded-none">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <LayoutGrid className="h-6 w-6 text-primary" />
            Custom Layout Builder
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[calc(100vh-100px)]">
          {/* Left Panel - Controls */}
          <div className="w-80 border-r bg-neutral-50/50 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {/* Layout Info */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Layout Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="layout-name" className="text-xs">Name</Label>
                    <Input
                      id="layout-name"
                      value={layoutName}
                      onChange={(e) => setLayoutName(e.target.value)}
                      placeholder="My Custom Layout"
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="layout-desc" className="text-xs">Description</Label>
                    <Input
                      id="layout-desc"
                      value={layoutDescription}
                      onChange={(e) => setLayoutDescription(e.target.value)}
                      placeholder="Description..."
                      className="h-8 text-xs mt-1"
                    />
                  </div>
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
                              setZones(zones.map(z =>
                                z.id === zone.id ? { ...z, name: e.target.value } : z
                              ));
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

            {/* Footer Actions */}
            <div className="p-4 border-t bg-white">
              {zones.length === 0 && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-[10px] text-blue-800">
                  ℹ️ Add at least one zone to save your layout
                </div>
              )}
              {hasOverlap && zones.length > 0 && (
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-[10px] text-yellow-800">
                  ⚠️ Warning: Zones are overlapping
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 h-9"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 h-9 gap-2"
                  disabled={zones.length === 0}
                >
                  <Save className="h-4 w-4" />
                  Save Layout
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Canvas */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-[900px] mx-auto">
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Layout Preview</h3>
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
  );
}

