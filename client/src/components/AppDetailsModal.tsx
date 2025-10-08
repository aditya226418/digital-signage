import { useState } from "react";
import { X, HelpCircle, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AddAppToScreenModal from "@/components/AddAppToScreenModal";
import type { App } from "./AppsGallery";

interface AppDetailsModalProps {
  app: App;
  isOpen: boolean;
  onClose: () => void;
}

export default function AppDetailsModal({ app, isOpen, onClose }: AppDetailsModalProps) {
  const [isAddToScreenModalOpen, setIsAddToScreenModalOpen] = useState(false);
  const IconComponent = app.icon;

  const handleAddToScreen = () => {
    setIsAddToScreenModalOpen(true);
  };

  const handleCloseAddToScreen = () => {
    setIsAddToScreenModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b p-6 pb-4">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                <IconComponent className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{app.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{app.pricing}</Badge>
                  <Badge variant="outline">{app.category}</Badge>
                  <span className="text-xs text-muted-foreground">Setup: {app.setupTime}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
          
            </div>
          </div>

          {/* Body */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Preview Carousel */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <Carousel className="w-full">
                  <CarouselContent>
                    {app.previewImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          {/* Placeholder for preview image */}
                          <div className="text-center p-8">
                            <IconComponent className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                              Preview Screenshot {index + 1}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{app.name}</p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {app.previewImages.length} preview{app.previewImages.length !== 1 ? "s" : ""} available
                </p>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">About this app</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {app.fullDescription}
                </p>
              </div>

              <Separator />

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {app.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border/40 bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">Pricing</p>
                  <p className="font-semibold">{app.pricing}</p>
                  {app.pricing === "Premium" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Requires premium plan
                    </p>
                  )}
                </div>
                <div className="rounded-lg border border-border/40 bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">Setup Time</p>
                  <p className="font-semibold">{app.setupTime}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average configuration time
                  </p>
                </div>
              </div>

              {/* Integration Info */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="font-semibold text-sm mb-2">Ready to get started?</h4>
                <p className="text-xs text-muted-foreground">
                  Click "Add to Screen" below to configure this app for your displays. You'll be
                  able to customize settings and select which screens to deploy to.
                </p>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="flex items-center justify-between border-t p-6 pt-4 bg-gradient-to-t from-primary/5 to-transparent">
            <p className="text-xs text-muted-foreground max-w-md">
              Need help setting up this app?{" "}
              <button className="underline hover:text-foreground">View documentation</button>
            </p>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleAddToScreen}>
                Add to Screen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add to Screen Modal */}
      <AddAppToScreenModal
        app={app}
        isOpen={isAddToScreenModalOpen}
        onClose={handleCloseAddToScreen}
      />
    </>
  );
}

