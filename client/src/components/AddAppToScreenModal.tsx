import { useState } from "react";
import { Monitor, Circle, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import type { App } from "./AppsGallery";
import { cn } from "@/lib/utils";

interface Screen {
  id: string;
  name: string;
  status: "online" | "offline";
  lastSeen: string;
  location?: string;
}

interface AddAppToScreenModalProps {
  app: App;
  isOpen: boolean;
  onClose: () => void;
}

// Mock screens data
const MOCK_SCREENS: Screen[] = [
  {
    id: "screen-1",
    name: "Lobby Display",
    status: "online",
    lastSeen: "Just now",
    location: "Main Lobby",
  },
  {
    id: "screen-2",
    name: "Conference Room A",
    status: "online",
    lastSeen: "2 minutes ago",
    location: "3rd Floor",
  },
  {
    id: "screen-3",
    name: "Cafeteria Screen",
    status: "offline",
    lastSeen: "1 hour ago",
    location: "Ground Floor",
  },
  {
    id: "screen-4",
    name: "Reception Desk",
    status: "online",
    lastSeen: "Just now",
    location: "Main Entrance",
  },
  {
    id: "screen-5",
    name: "Training Room",
    status: "online",
    lastSeen: "5 minutes ago",
    location: "2nd Floor",
  },
  {
    id: "screen-6",
    name: "Break Room TV",
    status: "offline",
    lastSeen: "3 hours ago",
    location: "4th Floor",
  },
  {
    id: "screen-7",
    name: "Executive Lounge",
    status: "online",
    lastSeen: "Just now",
    location: "5th Floor",
  },
  {
    id: "screen-8",
    name: "Gym Display",
    status: "online",
    lastSeen: "10 minutes ago",
    location: "Basement",
  },
];

export default function AddAppToScreenModal({
  app,
  isOpen,
  onClose,
}: AddAppToScreenModalProps) {
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleToggleScreen = (screenId: string) => {
    setSelectedScreens((prev) =>
      prev.includes(screenId)
        ? prev.filter((id) => id !== screenId)
        : [...prev, screenId]
    );
  };

  const handleSelectAll = () => {
    const allOnlineScreenIds = MOCK_SCREENS.filter((s) => s.status === "online").map((s) => s.id);
    if (selectedScreens.length === allOnlineScreenIds.length) {
      setSelectedScreens([]);
    } else {
      setSelectedScreens(allOnlineScreenIds);
    }
  };

  const handleSubmit = () => {
    if (selectedScreens.length === 0) {
      toast({
        title: "No screens selected",
        description: "Please select at least one screen to add this app to.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const screenNames = MOCK_SCREENS.filter((s) => selectedScreens.includes(s.id))
        .map((s) => s.name)
        .slice(0, 2)
        .join(", ");
      const additionalCount = selectedScreens.length - 2;

      toast({
        title: "App added successfully ✓",
        description: `${app.name} has been added to ${screenNames}${
          additionalCount > 0 ? ` and ${additionalCount} more` : ""
        }.`,
        duration: 4000,
      });

      setIsSubmitting(false);
      setSelectedScreens([]);
      onClose();
    }, 1000);
  };

  const onlineScreens = MOCK_SCREENS.filter((s) => s.status === "online");
  const offlineScreens = MOCK_SCREENS.filter((s) => s.status === "offline");
  const allOnlineSelected = selectedScreens.length === onlineScreens.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="border-b p-6 pb-4">
          <DialogTitle className="text-xl">Add {app.name} to Screens</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Select which screens you want to deploy this app to
          </p>
        </DialogHeader>

        {/* Info Alert */}
        <div className="px-6 pt-4">
          <Alert className="border-primary/20 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              The app will be configured with default settings. You can customize settings for
              each screen after deployment.
            </AlertDescription>
          </Alert>
        </div>

        {/* Screens List */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">
              {selectedScreens.length} of {onlineScreens.length} online screens selected
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              disabled={onlineScreens.length === 0}
            >
              {allOnlineSelected ? "Deselect All" : "Select All Online"}
            </Button>
          </div>

          <ScrollArea className="h-[calc(100%-3rem)]">
            <div className="space-y-2 pr-4">
              {/* Online Screens */}
              {onlineScreens.length > 0 && (
                <>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
                    Online Screens
                  </p>
                  {onlineScreens.map((screen) => (
                    <div
                      key={screen.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border border-border/40 p-4 transition-all cursor-pointer hover:bg-accent/50",
                        selectedScreens.includes(screen.id) && "bg-primary/5 border-primary/40"
                      )}
                      onClick={() => handleToggleScreen(screen.id)}
                    >
                      <Checkbox
                        checked={selectedScreens.includes(screen.id)}
                        onCheckedChange={() => handleToggleScreen(screen.id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                        <Monitor className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{screen.name}</p>
                          <Badge
                            variant="outline"
                            className="gap-1 text-xs border-green-500/40 text-green-700 dark:text-green-400"
                          >
                            <Circle className="h-2 w-2 fill-green-500" />
                            {screen.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          {screen.location && <span>{screen.location}</span>}
                          {screen.location && <span>•</span>}
                          <span>Last seen: {screen.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Offline Screens */}
              {offlineScreens.length > 0 && (
                <>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 mt-6">
                    Offline Screens
                  </p>
                  {offlineScreens.map((screen) => (
                    <div
                      key={screen.id}
                      className="flex items-center gap-3 rounded-lg border border-border/40 p-4 opacity-50 cursor-not-allowed"
                    >
                      <Checkbox disabled />

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Monitor className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{screen.name}</p>
                          <Badge
                            variant="outline"
                            className="gap-1 text-xs border-red-500/40 text-red-700 dark:text-red-400"
                          >
                            <Circle className="h-2 w-2 fill-red-500" />
                            {screen.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          {screen.location && <span>{screen.location}</span>}
                          {screen.location && <span>•</span>}
                          <span>Last seen: {screen.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {MOCK_SCREENS.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Monitor className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-sm">No screens available</p>
                  <p className="text-xs mt-1">Add screens to your account first</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t p-6 pt-4 bg-gradient-to-t from-primary/5 to-transparent">
          <p className="text-xs text-muted-foreground">
            Offline screens cannot be selected until they come online
          </p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || selectedScreens.length === 0}>
              {isSubmitting ? "Adding..." : `Add to ${selectedScreens.length} Screen${selectedScreens.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

