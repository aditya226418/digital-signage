import { useState } from "react";
import { Search, PlaySquare, Layers, Sparkles, Image as ImageIcon, Video, Grid3x3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockCompositions,
  mockCampaigns,
  Composition,
  Campaign,
} from "@/lib/mockPublishData";
import { mockMediaLibrary, MediaItem } from "@/lib/mockCompositionData";

interface ContentPickerProps {
  selectedContentId: string | null;
  selectedContentType: "media" | "composition" | "campaign" | null;
  onSelectionChange: (contentId: string, contentType: "media" | "composition" | "campaign") => void;
  hideCampaigns?: boolean;
}

const iconMap: Record<string, any> = {
  PlaySquare,
  Layout: Layers,
  Sparkles,
  BookOpen: PlaySquare,
  Newspaper: PlaySquare,
  UtensilsCrossed: PlaySquare,
  Calendar: PlaySquare,
  ShieldCheck: PlaySquare,
  ImageIcon,
};

export default function ContentPicker({
  selectedContentId,
  selectedContentType,
  onSelectionChange,
  hideCampaigns = false,
}: ContentPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "image" | "video" | "app">("all");

  const filteredCompositions = mockCompositions.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCampaigns = mockCampaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMedia = mockMediaLibrary.filter((media) => {
    const matchesSearch = media.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = mediaTypeFilter === "all" || media.type === mediaTypeFilter;
    return matchesSearch && matchesType;
  });

  const isSelected = (id: string, type: "media" | "composition" | "campaign") => {
    return selectedContentId === id && selectedContentType === type;
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "Continuous";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes === 0) return `${secs}s`;
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  };

  return (
    <div className="space-y-3">
      <Tabs defaultValue="compositions" className="w-full">
        <div className="flex items-center gap-3 mb-3">
          <TabsList className={hideCampaigns ? "w-auto" : "grid w-full grid-cols-3"}>
            <TabsTrigger 
              value="compositions" 
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <PlaySquare className="h-4 w-4" />
              Compositions
            </TabsTrigger>
            {!hideCampaigns && (
              <TabsTrigger 
                value="campaigns" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Sparkles className="h-4 w-4" />
                Campaigns
              </TabsTrigger>
            )}
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
              className="pl-9"
            />
          </div>
        </div>

        <TabsContent value="compositions" className="mt-0">
          <ScrollArea className="h-[450px] rounded-md border border-border/40">
            <div className="p-4 space-y-2">
              {filteredCompositions.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No compositions found
                </p>
              ) : (
                filteredCompositions.map((comp) => {
                  const Icon = iconMap[comp.thumbnail] || PlaySquare;
                  return (
                    <Card
                      key={comp.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected(comp.id, "composition")
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => onSelectionChange(comp.id, "composition")}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{comp.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {comp.type} • {formatDuration(comp.duration)}
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize shrink-0">
                          {comp.type}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {!hideCampaigns && (
          <TabsContent value="campaigns" className="mt-0">
            <ScrollArea className="h-[450px] rounded-md border border-border/40">
              <div className="p-4 space-y-2">
                {filteredCampaigns.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No campaigns found
                  </p>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <Card
                      key={campaign.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected(campaign.id, "campaign")
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => onSelectionChange(campaign.id, "campaign")}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{campaign.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {campaign.compositions.length} compositions • {campaign.rotationType}
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize shrink-0">
                          Campaign
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        )}

        <TabsContent value="media" className="mt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium">Filter:</span>
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
            <ScrollArea className="h-[400px] rounded-md border border-border/40">
              <div className="p-4 space-y-2">
                {filteredMedia.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No media found
                  </p>
                ) : (
                filteredMedia.map((media) => (
                  <Card
                    key={media.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected(media.id, "media")
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => onSelectionChange(media.id, "media")}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      {media.thumbnailUrl ? (
                        <img
                          src={media.thumbnailUrl}
                          alt={media.name}
                          className="h-12 w-12 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{media.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {media.type} • {media.category}
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize shrink-0">
                        {media.type}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

