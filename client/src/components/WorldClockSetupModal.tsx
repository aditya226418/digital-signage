import { useState, useEffect } from "react";
import { X, Plus, Minus, Clock, Palette, Layout, Globe } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface WorldClock {
  id: string;
  city: string;
  timezone: string;
  label: string;
  format: "12h" | "24h";
}

interface WorldClockSettings {
  clocks: WorldClock[];
  backgroundColor: string;
  clockFaceColor: string;
  textColor: string;
  layout: "grid-2x3" | "grid-3x2" | "grid-1x6" | "center";
}

interface WorldClockSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: WorldClockSettings) => void;
  initialSettings?: WorldClockSettings;
}

// Popular timezones with cities
const TIMEZONE_OPTIONS = [
  { city: "New York", timezone: "America/New_York" },
  { city: "London", timezone: "Europe/London" },
  { city: "Tokyo", timezone: "Asia/Tokyo" },
  { city: "Sydney", timezone: "Australia/Sydney" },
  { city: "Los Angeles", timezone: "America/Los_Angeles" },
  { city: "Paris", timezone: "Europe/Paris" },
  { city: "Berlin", timezone: "Europe/Berlin" },
  { city: "Mumbai", timezone: "Asia/Kolkata" },
  { city: "Singapore", timezone: "Asia/Singapore" },
  { city: "Dubai", timezone: "Asia/Dubai" },
  { city: "Hong Kong", timezone: "Asia/Hong_Kong" },
  { city: "Shanghai", timezone: "Asia/Shanghai" },
  { city: "Moscow", timezone: "Europe/Moscow" },
  { city: "São Paulo", timezone: "America/Sao_Paulo" },
  { city: "Mexico City", timezone: "America/Mexico_City" },
  { city: "Toronto", timezone: "America/Toronto" },
  { city: "Vancouver", timezone: "America/Vancouver" },
];

const COLOR_OPTIONS = [
  { name: "White", value: "#ffffff" },
  { name: "Light Gray", value: "#f8f9fa" },
  { name: "Dark Gray", value: "#343a40" },
  { name: "Black", value: "#000000" },
  { name: "Blue", value: "#007bff" },
  { name: "Indigo", value: "#6610f2" },
  { name: "Purple", value: "#6f42c1" },
  { name: "Pink", value: "#e83e8c" },
  { name: "Red", value: "#dc3545" },
  { name: "Orange", value: "#fd7e14" },
  { name: "Yellow", value: "#ffc107" },
  { name: "Green", value: "#28a745" },
  { name: "Teal", value: "#20c997" },
  { name: "Cyan", value: "#17a2b8" },
];

const DEFAULT_SETTINGS: WorldClockSettings = {
  clocks: [
    { id: "1", city: "New York", timezone: "America/New_York", label: "New York", format: "12h" },
    { id: "2", city: "London", timezone: "Europe/London", label: "London", format: "24h" },
    { id: "3", city: "Tokyo", timezone: "Asia/Tokyo", label: "Tokyo", format: "24h" },
  ],
  backgroundColor: "#f8f9fa",
  clockFaceColor: "#ffffff",
  textColor: "#343a40",
  layout: "grid-2x3",
};

// Helper function to get appropriate default layout based on clock count
const getDefaultLayout = (clockCount: number): WorldClockSettings["layout"] => {
  if (clockCount === 1) return "center";
  if (clockCount <= 2) return "grid-2x3";
  if (clockCount <= 6) return "grid-3x2";
  return "grid-1x6";
};

export default function WorldClockSetupModal({
  isOpen,
  onClose,
  onSave,
  initialSettings,
}: WorldClockSetupModalProps) {
  const baseSettings = initialSettings || DEFAULT_SETTINGS;
  const [settings, setSettings] = useState<WorldClockSettings>({
    ...baseSettings,
    layout: baseSettings.layout || getDefaultLayout(baseSettings.clocks.length),
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addClock = () => {
    if (settings.clocks.length >= 6) return;

    const availableCities = TIMEZONE_OPTIONS.filter(
      (tz) => !settings.clocks.some((clock) => clock.timezone === tz.timezone)
    );

    if (availableCities.length === 0) return;

    const newClock: WorldClock = {
      id: Date.now().toString(),
      ...availableCities[0],
      label: availableCities[0].city,
      format: "12h",
    };

    const newClockCount = settings.clocks.length + 1;

    setSettings((prev) => ({
      ...prev,
      clocks: [...prev.clocks, newClock],
      // Auto-switch to appropriate layout based on new clock count
      layout: newClockCount === 1 ? "center" : getDefaultLayout(newClockCount),
    }));
  };

  const removeClock = (id: string) => {
    if (settings.clocks.length <= 1) return;

    const newClocks = settings.clocks.filter((clock) => clock.id !== id);
    const newClockCount = newClocks.length;

    setSettings((prev) => ({
      ...prev,
      clocks: newClocks,
      // Auto-switch layout if current layout is not suitable for new clock count
      layout: prev.layout === "center" && newClockCount > 1 ? getDefaultLayout(newClockCount) : prev.layout,
    }));
  };

  const updateClock = (id: string, updates: Partial<WorldClock>) => {
    setSettings((prev) => ({
      ...prev,
      clocks: prev.clocks.map((clock) =>
        clock.id === id ? { ...clock, ...updates } : clock
      ),
    }));
  };

  const updateSetting = (key: keyof WorldClockSettings, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };

      // Validate layout selection based on clock count
      if (key === "layout") {
        if (prev.clocks.length === 1 && value !== "center") {
          // If user tries to select non-center layout with 1 clock, force center
          return { ...prev, layout: "center" };
        }
        if (prev.clocks.length > 1 && value === "center") {
          // If user tries to select center layout with multiple clocks, use appropriate grid layout
          return { ...prev, layout: getDefaultLayout(prev.clocks.length) };
        }
      }

      return newSettings;
    });
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const formatTime = (timezone: string, format: "12h" | "24h") => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: format === "12h",
      }).format(currentTime);
    } catch {
      return "00:00";
    }
  };

  const getGridClass = (layout: string) => {
    switch (layout) {
      case "grid-2x3":
        return "grid-cols-2 grid-rows-3";
      case "grid-3x2":
        return "grid-cols-3 grid-rows-2";
      case "grid-1x6":
        return "grid-cols-1 grid-rows-6";
      case "center":
        return "grid-cols-1 grid-rows-1 place-items-center";
      default:
        return "grid-cols-2 grid-rows-3";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full max-h-[95vh]">
          {/* Settings Panel */}
          <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-border/40 flex flex-col min-h-0">
            <div className="p-6 border-b border-border/40 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">World Clock Setup</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure your world clock display
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6 space-y-6">
                {/* Clocks Management */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Clocks ({settings.clocks.length}/6)
                    </h3>
                    <Button
                      size="sm"
                      onClick={addClock}
                      disabled={settings.clocks.length >= 6}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {settings.clocks.map((clock, index) => (
                      <Card key={clock.id} className="p-3">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              Clock {index + 1}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeClock(clock.id)}
                              disabled={settings.clocks.length <= 1}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-2 lg:col-span-1">
                              <Label className="text-xs">City</Label>
                              <Select
                                value={clock.timezone}
                                onValueChange={(value) => {
                                  const selected = TIMEZONE_OPTIONS.find((tz) => tz.timezone === value);
                                  if (selected) {
                                    updateClock(clock.id, {
                                      city: selected.city,
                                      timezone: selected.timezone,
                                      label: selected.city,
                                    });
                                  }
                                }}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIMEZONE_OPTIONS.map((tz) => (
                                    <SelectItem key={tz.timezone} value={tz.timezone}>
                                      {tz.city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="col-span-2 lg:col-span-1">
                              <Label className="text-xs">Format</Label>
                              <Select
                                value={clock.format}
                                onValueChange={(value: "12h" | "24h") =>
                                  updateClock(clock.id, { format: value })
                                }
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="12h">12 Hour</SelectItem>
                                  <SelectItem value="24h">24 Hour</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs">Custom Label</Label>
                            <Input
                              value={clock.label}
                              onChange={(e) => updateClock(clock.id, { label: e.target.value })}
                              className="h-8 text-xs"
                              placeholder="Enter custom label"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Appearance Settings */}
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Palette className="h-5 w-5" />
                    Appearance
                  </h3>

                  <Tabs defaultValue="colors" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
                      <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
                    </TabsList>

                    <TabsContent value="colors" className="space-y-4 mt-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Background Color</Label>
                        <div className="grid grid-cols-5 lg:grid-cols-7 gap-2">
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.value}
                              className={cn(
                                "h-8 w-8 rounded-md border-2 transition-all",
                                settings.backgroundColor === color.value
                                  ? "border-primary scale-110"
                                  : "border-border hover:border-primary/50"
                              )}
                              style={{ backgroundColor: color.value }}
                              onClick={() => updateSetting("backgroundColor", color.value)}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Clock Face Color</Label>
                        <div className="grid grid-cols-5 lg:grid-cols-7 gap-2">
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.value}
                              className={cn(
                                "h-8 w-8 rounded-md border-2 transition-all",
                                settings.clockFaceColor === color.value
                                  ? "border-primary scale-110"
                                  : "border-border hover:border-primary/50"
                              )}
                              style={{ backgroundColor: color.value }}
                              onClick={() => updateSetting("clockFaceColor", color.value)}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Text Color</Label>
                        <div className="grid grid-cols-5 lg:grid-cols-7 gap-2">
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color.value}
                              className={cn(
                                "h-8 w-8 rounded-md border-2 transition-all",
                                settings.textColor === color.value
                                  ? "border-primary scale-110"
                                  : "border-border hover:border-primary/50"
                              )}
                              style={{ backgroundColor: color.value }}
                              onClick={() => updateSetting("textColor", color.value)}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="layout" className="space-y-4 mt-4">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Grid Layout</Label>
                        <div className={cn(
                          "grid gap-3",
                           "grid-cols-1 lg:grid-cols-3"
                        )}>
                          <button
                            className={cn(
                              "p-3 rounded-lg border-2 transition-all text-center",
                              settings.layout === "grid-2x3"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                            onClick={() => updateSetting("layout", "grid-2x3")}
                          >
                            <div className="text-xs font-medium mb-1">2×3 Grid</div>
                            <div className="grid grid-cols-2 grid-rows-3 gap-1">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-2 rounded-sm",
                                    i < settings.clocks.length
                                      ? "bg-primary/40"
                                      : "bg-muted"
                                  )}
                                />
                              ))}
                            </div>
                          </button>

                          <button
                            className={cn(
                              "p-3 rounded-lg border-2 transition-all text-center",
                              settings.layout === "grid-3x2"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                            onClick={() => updateSetting("layout", "grid-3x2")}
                          >
                            <div className="text-xs font-medium mb-1">3×2 Grid</div>
                            <div className="grid grid-cols-3 grid-rows-2 gap-1">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-2 rounded-sm",
                                    i < settings.clocks.length
                                      ? "bg-primary/40"
                                      : "bg-muted"
                                  )}
                                />
                              ))}
                            </div>
                          </button>

                          <button
                            className={cn(
                              "p-3 rounded-lg border-2 transition-all text-center",
                              settings.layout === "grid-1x6"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                            onClick={() => updateSetting("layout", "grid-1x6")}
                          >
                            <div className="text-xs font-medium mb-1">1×6 Column</div>
                            <div className="grid grid-cols-1 grid-rows-6 gap-1">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-2 rounded-sm",
                                    i < settings.clocks.length
                                      ? "bg-primary/40"
                                      : "bg-muted"
                                  )}
                                />
                              ))}
                            </div>
                          </button>

                          {/* Center layout - only show when there's exactly one clock */}
                          {settings.clocks.length === 1 && (
                            <button
                              className={cn(
                                "p-3 rounded-lg border-2 transition-all text-center",
                                settings.layout === "center"
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                              onClick={() => updateSetting("layout", "center")}
                            >
                              <div className="text-xs font-medium mb-1">Center</div>
                              <div className="flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-primary/40"></div>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">Single Clock</div>
                            </button>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-border/40 bg-gradient-to-t from-primary/5 to-transparent flex-shrink-0">
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-6 border-b border-border/40 flex-shrink-0">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Live Preview
              </h3>
              <p className="text-sm text-muted-foreground">
                See how your world clock will look on screen
              </p>
            </div>

            <div className="flex-1 p-6 overflow-auto">
              <div className="flex items-center justify-center min-h-full">
                <Card
                  className="w-full max-w-4xl h-[400px] lg:h-[500px] overflow-hidden"
                  style={{ backgroundColor: settings.backgroundColor }}
                >
                  <CardContent className="p-6 h-full">
                    <div
                      className={cn(
                        "grid h-full gap-3 p-3 rounded-lg",
                        getGridClass(settings.layout)
                      )}
                      style={{ backgroundColor: settings.clockFaceColor }}
                    >
                    {settings.clocks.map((clock) => (
                      <div
                        key={clock.id}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg border border-border/20 min-h-0",
                          settings.layout === "center"
                            ? "p-8 w-full max-w-md mx-auto"
                            : "p-3"
                        )}
                        style={{
                          backgroundColor: settings.clockFaceColor,
                          color: settings.textColor,
                        }}
                      >
                        <div className="text-center">
                          <div className={cn(
                            "font-bold mb-1",
                            settings.layout === "center" ? "text-4xl lg:text-5xl" : "text-xl lg:text-2xl"
                          )}>
                            {formatTime(clock.timezone, clock.format)}
                          </div>
                          <div className={cn(
                            "font-medium mb-1 truncate w-full",
                            settings.layout === "center" ? "text-lg lg:text-xl" : "text-xs lg:text-sm"
                          )}>
                            {clock.label}
                          </div>
                          <div className={cn(
                            "opacity-75",
                            settings.layout === "center" ? "text-sm lg:text-base" : "text-xs"
                          )}>
                            {new Intl.DateTimeFormat("en-US", {
                              timeZone: clock.timezone,
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }).format(currentTime)}
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
