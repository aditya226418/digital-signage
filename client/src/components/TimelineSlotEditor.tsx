import { useState } from "react";
import { Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, PlaySquare, Image as ImageIcon, Video, Grid3x3 } from "lucide-react";
import { TimeSlot } from "@/lib/mockPublishData";
import { mockCompositions } from "@/lib/mockPublishData";
import { mockMediaLibrary } from "@/lib/mockCompositionData";

interface TimelineSlotEditorProps {
  slot: TimeSlot;
  onUpdate: (slot: TimeSlot) => void;
  onDelete: () => void;
  timezone?: string;
}

export default function TimelineSlotEditor({
  slot,
  onUpdate,
  onDelete,
  timezone = "org-default",
}: TimelineSlotEditorProps) {
  const [activeTab, setActiveTab] = useState<"compositions" | "media">(
    slot.contentType === "media" ? "media" : "compositions"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "image" | "video" | "app">("all");

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDuration = (start: string, end: string) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const durationMinutes = (eh * 60 + em) - (sh * 60 + sm);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    if (hours === 0) return `${minutes}m`;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  };

  const filteredCompositions = mockCompositions.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMedia = mockMediaLibrary.filter((media) => {
    const matchesSearch = media.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = mediaTypeFilter === "all" || media.type === mediaTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleContentSelect = (contentId: string, contentType: "media" | "composition") => {
    let contentName = "";
    if (contentType === "media") {
      const media = mockMediaLibrary.find((m) => m.id === contentId);
      contentName = media?.name || "";
    } else {
      const comp = mockCompositions.find((c) => c.id === contentId);
      contentName = comp?.name || "";
    }

    onUpdate({
      ...slot,
      contentType,
      contentId,
      contentName,
      compositionId: contentType === "composition" ? contentId : undefined,
      compositionName: contentType === "composition" ? contentName : undefined,
    });
  };

  return (
    <Card className="border-border/40">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </span>
            <Badge variant="outline" className="text-xs">
              {getDuration(slot.startTime, slot.endTime)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor={`start-${slot.id}`} className="text-xs">Start Time</Label>
            <Input
              id={`start-${slot.id}`}
              type="time"
              value={slot.startTime}
              onChange={(e) => onUpdate({ ...slot, startTime: e.target.value })}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`end-${slot.id}`} className="text-xs">End Time</Label>
            <Input
              id={`end-${slot.id}`}
              type="time"
              value={slot.endTime}
              onChange={(e) => onUpdate({ ...slot, endTime: e.target.value })}
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Select Content</Label>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "compositions" | "media")} className="w-full">
            <div className="flex items-center gap-3 mb-3">
              <TabsList className="w-auto">
                <TabsTrigger 
                  value="compositions" 
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <PlaySquare className="h-4 w-4" />
                  Compositions
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <ImageIcon className="h-4 w-4" />
                  All Media
                </TabsTrigger>
              </TabsList>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <TabsContent value="compositions" className="mt-0">
              <ScrollArea className="h-[200px] rounded-md border border-border/40">
                <div className="p-2 space-y-1">
                  {filteredCompositions.length === 0 ? (
                    <p className="text-center text-xs text-muted-foreground py-4">
                      No compositions found
                    </p>
                  ) : (
                    filteredCompositions.map((comp) => {
                      const isSelected = slot.contentId === comp.id && slot.contentType === "composition";
                      return (
                        <div
                          key={comp.id}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-accent"
                          }`}
                          onClick={() => handleContentSelect(comp.id, "composition")}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleContentSelect(comp.id, "composition")}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-sm flex-1 truncate">{comp.name}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="media" className="mt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant={mediaTypeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMediaTypeFilter("all")}
                    className="h-7 text-xs"
                  >
                    All
                  </Button>
                  <Button
                    variant={mediaTypeFilter === "image" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMediaTypeFilter("image")}
                    className="h-7 text-xs gap-1.5"
                  >
                    <ImageIcon className="h-3 w-3" />
                    Images
                  </Button>
                  <Button
                    variant={mediaTypeFilter === "video" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMediaTypeFilter("video")}
                    className="h-7 text-xs gap-1.5"
                  >
                    <Video className="h-3 w-3" />
                    Videos
                  </Button>
                  <Button
                    variant={mediaTypeFilter === "app" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMediaTypeFilter("app")}
                    className="h-7 text-xs gap-1.5"
                  >
                    <Grid3x3 className="h-3 w-3" />
                    Apps
                  </Button>
                </div>
                <ScrollArea className="h-[200px] rounded-md border border-border/40">
                  <div className="p-2 space-y-1">
                    {filteredMedia.length === 0 ? (
                      <p className="text-center text-xs text-muted-foreground py-4">
                        No media found
                      </p>
                    ) : (
                      filteredMedia.map((media) => {
                        const isSelected = slot.contentId === media.id && slot.contentType === "media";
                        return (
                          <div
                            key={media.id}
                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-accent"
                            }`}
                            onClick={() => handleContentSelect(media.id, "media")}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleContentSelect(media.id, "media")}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-sm flex-1 truncate">{media.name}</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {media.type}
                            </Badge>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>

          {slot.contentName && (
            <div className="mt-2 p-2 rounded-md bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">Selected:</p>
              <p className="text-sm font-medium truncate">{slot.contentName}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

