import { useState } from "react";
import { Monitor, Folder, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockScreens, mockScreenGroups, Screen, ScreenGroup } from "@/lib/mockPublishData";

interface TargetPickerProps {
  selectedScreenIds: string[];
  onSelectionChange: (screenIds: string[]) => void;
}

export default function TargetPicker({ selectedScreenIds, onSelectionChange }: TargetPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScreens = mockScreens.filter((screen) =>
    screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    screen.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = mockScreenGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleScreen = (screenId: string) => {
    if (selectedScreenIds.includes(screenId)) {
      onSelectionChange(selectedScreenIds.filter((id) => id !== screenId));
    } else {
      onSelectionChange([...selectedScreenIds, screenId]);
    }
  };

  const toggleGroup = (group: ScreenGroup) => {
    const allSelected = group.screenIds.every((id) => selectedScreenIds.includes(id));
    if (allSelected) {
      onSelectionChange(selectedScreenIds.filter((id) => !group.screenIds.includes(id)));
    } else {
      const newSelection = [...new Set([...selectedScreenIds, ...group.screenIds])];
      onSelectionChange(newSelection);
    }
  };

  const isGroupSelected = (group: ScreenGroup) => {
    return group.screenIds.every((id) => selectedScreenIds.includes(id));
  };

  const isGroupPartiallySelected = (group: ScreenGroup) => {
    return (
      group.screenIds.some((id) => selectedScreenIds.includes(id)) &&
      !group.screenIds.every((id) => selectedScreenIds.includes(id))
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search screens or groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">
          {selectedScreenIds.length} {selectedScreenIds.length === 1 ? "screen" : "screens"} selected
        </Badge>
      </div>

      <Tabs defaultValue="screens" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="screens" className="gap-2">
            <Monitor className="h-4 w-4" />
            Individual Screens
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2">
            <Folder className="h-4 w-4" />
            Screen Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="screens" className="mt-4">
          <ScrollArea className="h-[300px] rounded-md border border-border/40">
            <div className="p-4 space-y-2">
              {filteredScreens.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No screens found
                </p>
              ) : (
                filteredScreens.map((screen) => (
                  <Card
                    key={screen.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedScreenIds.includes(screen.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleScreen(screen.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Checkbox
                        checked={selectedScreenIds.includes(screen.id)}
                        onCheckedChange={() => toggleScreen(screen.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Monitor className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{screen.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {screen.location}
                        </div>
                      </div>
                      <Badge
                        variant={screen.status === "online" ? "default" : "secondary"}
                        className={
                          screen.status === "online"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                            : ""
                        }
                      >
                        {screen.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="groups" className="mt-4">
          <ScrollArea className="h-[300px] rounded-md border border-border/40">
            <div className="p-4 space-y-2">
              {filteredGroups.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No groups found
                </p>
              ) : (
                filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      isGroupSelected(group)
                        ? "border-primary bg-primary/5"
                        : isGroupPartiallySelected(group)
                        ? "border-primary/50 bg-primary/2"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleGroup(group)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Checkbox
                        checked={isGroupSelected(group)}
                        ref={(el) => {
                          if (el && isGroupPartiallySelected(group)) {
                            el.indeterminate = true;
                          }
                        }}
                        onCheckedChange={() => toggleGroup(group)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Folder className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{group.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {group.screenCount} {group.screenCount === 1 ? "screen" : "screens"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

