import { useState } from "react";
import { X, Power, Settings, Eye, Send, MonitorPlay, ChevronRight, Wifi, WifiOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface Screen {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  defaultComposition: string;
  lastSeen: string;
  resolution: string;
  customFields?: Record<string, any>;
}

interface StoreQuickViewModalProps {
  open: boolean;
  onClose: () => void;
  storeName: string;
  screens: Screen[];
}

// Generate consistent Unsplash thumbnail for each screen
const getScreenThumbnail = (screenId: string, screenName: string) => {
  const seed = parseInt(screenId) || 1;
  const topics = ['business', 'technology', 'restaurant', 'food', 'cafe', 'digital'];
  const topic = topics[seed % topics.length];
  return `https://source.unsplash.com/800x600/?${topic},screen,${seed}`;
};

export default function StoreQuickViewModal({
  open,
  onClose,
  storeName,
  screens,
}: StoreQuickViewModalProps) {
  const [selectedScreens, setSelectedScreens] = useState<Set<string>>(new Set());

  const onlineScreens = screens.filter(s => s.status === "online").length;
  const offlineScreens = screens.filter(s => s.status === "offline").length;

  const toggleScreenSelection = (screenId: string) => {
    setSelectedScreens(prev => {
      const newSet = new Set(prev);
      if (newSet.has(screenId)) {
        newSet.delete(screenId);
      } else {
        newSet.add(screenId);
      }
      return newSet;
    });
  };

  const selectAllScreens = () => {
    setSelectedScreens(new Set(screens.map(s => s.id)));
  };

  const deselectAllScreens = () => {
    setSelectedScreens(new Set());
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for screens:`, Array.from(selectedScreens));
    // Handle bulk actions here
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold">{storeName}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span>{onlineScreens} Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <WifiOff className="h-4 w-4 text-gray-500" />
                  <span>{offlineScreens} Offline</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="font-medium">{screens.length} Total Screens</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Store-level Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllScreens}
                className="gap-2"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deselectAllScreens}
                className="gap-2"
              >
                Deselect All
              </Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('publish')}
                disabled={selectedScreens.size === 0}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Publish to {selectedScreens.size > 0 ? selectedScreens.size : 'Selected'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('deactivate-all')}
                className="gap-2 text-orange-600 hover:text-orange-700"
              >
                <Power className="h-4 w-4" />
                Deactivate All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('settings')}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Store Settings
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 max-h-[calc(95vh-200px)]">
          {screens.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No screens found in this store
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {screens.map((screen, index) => (
                <motion.div
                  key={screen.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className={`relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedScreens.has(screen.id)
                        ? 'ring-2 ring-primary'
                        : 'hover:ring-1 hover:ring-border'
                    }`}
                    onClick={() => toggleScreenSelection(screen.id)}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={getScreenThumbnail(screen.id, screen.name)}
                        alt={screen.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Status Overlay */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                        <Badge
                          variant={screen.status === "online" ? "default" : "secondary"}
                          className={
                            screen.status === "online"
                              ? "bg-green-500/90 text-white backdrop-blur-sm"
                              : "bg-gray-500/90 text-white backdrop-blur-sm"
                          }
                        >
                          <span
                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                              screen.status === "online" ? "bg-white" : "bg-gray-300"
                            }`}
                          />
                          {screen.status === "online" ? "Online" : "Offline"}
                        </Badge>
                        {selectedScreens.has(screen.id) && (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-3 w-3 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      {/* Composition Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-xs text-white/90 truncate">
                          <MonitorPlay className="h-3 w-3 inline mr-1" />
                          {screen.defaultComposition}
                        </p>
                      </div>
                    </div>

                    {/* Screen Details */}
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-sm truncate">{screen.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{screen.location}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{screen.resolution}</span>
                        {screen.status === "offline" && (
                          <span className="text-muted-foreground italic">{screen.lastSeen}</span>
                        )}
                      </div>

                      {/* Screen Type Tags */}
                      {screen.customFields?.screen_type && (
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(screen.customFields.screen_type)
                            ? screen.customFields.screen_type
                            : [screen.customFields.screen_type]
                          ).map((type: string) => (
                            <Badge
                              key={type}
                              variant="outline"
                              className="text-xs px-2 py-0"
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Separator />

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1 gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Navigate to screen:', screen.id);
                            // Navigate to individual screen details
                          }}
                        >
                          Open Screen
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Preview screen:', screen.id);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

