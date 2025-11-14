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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
      <CardContent className="p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {getDuration(slot.startTime, slot.endTime)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor={`start-${slot.id}`} className="text-xs">Start Time</Label>
            <Input
              id={`start-${slot.id}`}
              type="time"
              value={slot.startTime}
              onChange={(e) => onUpdate({ ...slot, startTime: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`end-${slot.id}`} className="text-xs">End Time</Label>
            <Input
              id={`end-${slot.id}`}
              type="time"
              value={slot.endTime}
              onChange={(e) => onUpdate({ ...slot, endTime: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Select Content</Label>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="content" className="border rounded-md">
              <AccordionTrigger className="px-2.5 py-1.5 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2">
                  <span className="text-xs font-medium">
                    {slot.contentName ? "Content Selected" : "Select Content"}
                  </span>
                  {slot.contentName && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">
                      {slot.contentName}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2.5 pb-2.5">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "compositions" | "media")} className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <TabsList className="w-auto h-8">
                      <TabsTrigger 
                        value="compositions" 
                        className="gap-1.5 text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <PlaySquare className="h-3 w-3" />
                        Compositions
                      </TabsTrigger>
                      <TabsTrigger 
                        value="media" 
                        className="gap-1.5 text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <ImageIcon className="h-3 w-3" />
                        All Media
                      </TabsTrigger>
                    </TabsList>
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 h-8 text-xs"
                      />
                    </div>
                  </div>

                  <TabsContent value="compositions" className="mt-0">
                    <ScrollArea className="h-[160px] rounded-md border border-border/40">
                      <div className="p-1.5 space-y-0.5">
                        {filteredCompositions.length === 0 ? (
                          <p className="text-center text-xs text-muted-foreground py-3">
                            No compositions found
                          </p>
                        ) : (
                          filteredCompositions.map((comp) => {
                            const isSelected = slot.contentId === comp.id && slot.contentType === "composition";
                            return (
                              <div
                                key={comp.id}
                                className={`flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer transition-colors ${
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
                                  className="h-3.5 w-3.5"
                                />
                                <span className="text-xs flex-1 truncate">{comp.name}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="media" className="mt-0">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Button
                          variant={mediaTypeFilter === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMediaTypeFilter("all")}
                          className="h-6 text-[10px] px-2"
                        >
                          All
                        </Button>
                        <Button
                          variant={mediaTypeFilter === "image" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMediaTypeFilter("image")}
                          className="h-6 text-[10px] px-2 gap-1"
                        >
                          <ImageIcon className="h-2.5 w-2.5" />
                          Images
                        </Button>
                        <Button
                          variant={mediaTypeFilter === "video" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMediaTypeFilter("video")}
                          className="h-6 text-[10px] px-2 gap-1"
                        >
                          <Video className="h-2.5 w-2.5" />
                          Videos
                        </Button>
                        <Button
                          variant={mediaTypeFilter === "app" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMediaTypeFilter("app")}
                          className="h-6 text-[10px] px-2 gap-1"
                        >
                          <Grid3x3 className="h-2.5 w-2.5" />
                          Apps
                        </Button>
                      </div>
                      <ScrollArea className="h-[160px] rounded-md border border-border/40">
                        <div className="p-1.5 space-y-0.5">
                          {filteredMedia.length === 0 ? (
                            <p className="text-center text-xs text-muted-foreground py-3">
                              No media found
                            </p>
                          ) : (
                            filteredMedia.map((media) => {
                              const isSelected = slot.contentId === media.id && slot.contentType === "media";
                              return (
                                <div
                                  key={media.id}
                                  className={`flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer transition-colors ${
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
                                    className="h-3.5 w-3.5"
                                  />
                                  <span className="text-xs flex-1 truncate">{media.name}</span>
                                  <Badge variant="outline" className="text-[10px] px-1 py-0 capitalize">
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}

