import { motion } from "framer-motion";
import { LayoutTemplate, mockLayouts } from "@/lib/mockCompositionData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

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
          className="fill-primary/10 stroke-primary/40"
          strokeWidth="1"
          rx="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{
            fill: "rgba(var(--primary), 0.2)",
            transition: { duration: 0.12 },
          }}
        />
      ))}
    </svg>
  );
}

export default function LayoutPicker({ onSelectLayout }: LayoutPickerProps) {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Layout</h2>
        <p className="text-muted-foreground">
          Select a layout template that matches your screen structure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLayouts.map((layout) => (
          <motion.div
            key={layout.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-200">
              {/* Preview Container */}
              <div className="aspect-video bg-neutral-50 rounded-xl mb-4 overflow-hidden border border-neutral-200">
                <LayoutZoneSVG layout={layout} />
              </div>

              {/* Layout Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{layout.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {layout.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="capitalize">
                    {layout.type}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Layers className="h-3 w-3" />
                    {layout.zones.length} zone{layout.zones.length !== 1 ? "s" : ""}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    {layout.resolution}
                  </Badge>
                </div>

                <Button
                  onClick={() => onSelectLayout(layout)}
                  className="w-full gap-2 group-hover:shadow-md transition-shadow"
                >
                  Use this layout
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

