import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutTemplate, mockLayouts } from "@/lib/mockCompositionData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Monitor, Sparkles, Wand2, Smartphone, MonitorCheck, LayoutGrid } from "lucide-react";
import LayoutMakerModal from "./LayoutMakerModal";

interface LayoutPickerProps {
  onSelectLayout: (layout: LayoutTemplate) => void;
}

function LayoutZoneSVG({ layout }: { layout: LayoutTemplate }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      {layout.zones.map((zone, index) => (
        <motion.rect
          key={zone.id}
          x={zone.x}
          y={zone.y}
          width={zone.width}
          height={zone.height}
          className="fill-rose-50 stroke-rose-300"
          strokeWidth="1.5"
          rx="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{
            fill: "rgb(255 228 230)",
            stroke: "rgb(244 114 182)",
            transition: { duration: 0.2 },
          }}
        />
      ))}
    </svg>
  );
}

function isPortraitLayout(resolution: string): boolean {
  const [width, height] = resolution.split("x").map(Number);
  return height > width;
}

export default function LayoutPicker({ onSelectLayout }: LayoutPickerProps) {
  const [isLayoutMakerOpen, setIsLayoutMakerOpen] = useState(false);
  const [orientationFilter, setOrientationFilter] = useState<'all' | 'landscape' | 'portrait'>('all');

  const handleCustomLayoutSave = (layout: LayoutTemplate) => {
    onSelectLayout(layout);
  };

  // Filter layouts based on orientation
  const filteredLayouts = mockLayouts.filter(layout => {
    if (orientationFilter === 'all') return true;
    const isPortrait = isPortraitLayout(layout.resolution);
    return orientationFilter === 'portrait' ? isPortrait : !isPortrait;
  });

  return (
    <>
      <LayoutMakerModal
        isOpen={isLayoutMakerOpen}
        onClose={() => setIsLayoutMakerOpen(false)}
        onSave={handleCustomLayoutSave}
      />
      
      <div className="w-full max-w-[1600px] mx-auto px-6 py-10">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
          <Monitor className="h-4 w-4" />
          Step 1 of 3
        </div>
        <h2 className="text-4xl font-bold mb-4 text-neutral-900">Choose Your Layout</h2>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed mb-6">
          Select a layout template that matches your screen structure. Choose between landscape and portrait orientations.
        </p>
        
        {/* Orientation Filters */}
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => setOrientationFilter('all')}
            variant={orientationFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="gap-2 h-9"
          >
            <LayoutGrid className="h-4 w-4" />
            All Layouts
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-white">
              {mockLayouts.length}
            </Badge>
          </Button>
         
          <Button
            onClick={() => setOrientationFilter('portrait')}
            variant={orientationFilter === 'portrait' ? 'default' : 'outline'}
            size="sm"
            className="gap-2 h-9"
          >
            <Smartphone className="h-4 w-4" />
            Portrait
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-white">
              {mockLayouts.filter(l => isPortraitLayout(l.resolution)).length}
            </Badge>
          </Button>
          <Button
            onClick={() => setOrientationFilter('landscape')}
            variant={orientationFilter === 'landscape' ? 'default' : 'outline'}
            size="sm"
            className="gap-2 h-9"
          >
            <MonitorCheck className="h-4 w-4" />
            Landscape
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-white">
              {mockLayouts.filter(l => !isPortraitLayout(l.resolution)).length}
            </Badge>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Existing Layouts */}
        <AnimatePresence mode="popLayout">
        {filteredLayouts.map((layout) => {
          const isPortrait = isPortraitLayout(layout.resolution);
          
          return (
            <motion.div
              key={layout.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              layout
              className="group"
            >
              <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 h-full flex flex-col group-hover:translate-y-[-2px]">
                {/* Preview Container - Adaptive aspect ratio */}
                <div className="relative mb-4 flex items-center justify-center bg-gradient-to-br from-neutral-100 via-neutral-50 to-white rounded-lg border border-neutral-200 p-6 min-h-[180px]">
                  <div 
                    className={`${
                      isPortrait 
                        ? 'w-auto h-full max-h-[160px] aspect-[9/16]' 
                        : 'w-full aspect-video'
                    } bg-gradient-to-br from-white to-neutral-50 rounded-md border-2 border-neutral-300 shadow-md overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg`}
                  >
                    <LayoutZoneSVG layout={layout} />
                  </div>
                  
                  {/* Orientation Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] px-2.5 py-1 bg-white/95 backdrop-blur-sm shadow-sm border border-neutral-200/50 font-medium"
                    >
                      {isPortrait ? '📱 Portrait' : '🖥️ Landscape'}
                    </Badge>
                  </div>
                </div>

                {/* Layout Info */}
                <div className="flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg leading-tight mb-2 text-neutral-900">
                      {layout.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {layout.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <Badge variant="outline" className="text-[10px] px-2.5 py-0.5 capitalize bg-primary/10 border-primary/30 text-primary font-medium">
                      {layout.type}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-2.5 py-0.5 gap-1 bg-neutral-50">
                      <Layers className="h-2.5 w-2.5" />
                      {layout.zones.length} {layout.zones.length === 1 ? 'zone' : 'zones'}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-2.5 py-0.5 font-mono bg-neutral-50">
                      {layout.resolution}
                    </Badge>
                  </div>

                  <div className="mt-auto">
                    <Button
                      onClick={() => onSelectLayout(layout)}
                      variant="outline"
                      className="w-full gap-2 h-10 font-semibold transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-md"
                      size="sm"
                    >
                      <Monitor className="h-4 w-4" />
                      Use this layout
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>

        {/* Custom Layout Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          layout
          className="group"
        >
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-white rounded-xl p-5 shadow-sm border-2 border-primary/30 hover:border-primary hover:shadow-2xl transition-all duration-300 h-full flex flex-col group-hover:translate-y-[-2px] relative overflow-hidden">
            {/* Sparkle Effect */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
            
            {/* Preview Container */}
            <div className="relative mb-4 flex items-center justify-center bg-gradient-to-br from-white via-primary/5 to-primary/10 rounded-lg border-2 border-primary/30 p-6 min-h-[180px]">
              <div className="relative">
                <Wand2 className="h-16 w-16 text-primary animate-pulse" />
                <Sparkles className="h-6 w-6 text-primary absolute -top-2 -right-2 animate-bounce" />
              </div>
              
              {/* Badge */}
              <div className="absolute top-2.5 right-2.5">
                <Badge 
                  className="text-[10px] px-2.5 py-1 bg-primary text-primary-foreground shadow-md border-0 font-semibold"
                >
                  ✨ New
                </Badge>
              </div>
            </div>

            {/* Layout Info */}
            <div className="flex-1 flex flex-col relative">
              <div className="mb-3">
                <h3 className="font-bold text-lg leading-tight mb-2 text-primary">
                  Custom Layout
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Build your own layout from scratch with complete control over zones
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-4">
                <Badge variant="outline" className="text-[10px] px-2.5 py-0.5 capitalize bg-primary/20 border-primary/50 text-primary font-semibold">
                  Custom
                </Badge>
                <Badge variant="outline" className="text-[10px] px-2.5 py-0.5 gap-1 bg-primary/10 border-primary/30">
                  <Wand2 className="h-2.5 w-2.5" />
                  Your Design
                </Badge>
              </div>

              <div className="mt-auto">
                <Button
                  onClick={() => setIsLayoutMakerOpen(true)}
                  className="w-full gap-2 h-10 font-semibold bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
                  size="sm"
                >
                  <Wand2 className="h-4 w-4" />
                  Create Custom Layout
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}

