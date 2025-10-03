import { Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Screen {
  id: string;
  name: string;
  status: "online" | "offline";
  lastSeen: string;
}

interface ScreensOverviewCardProps {
  screens: Screen[];
  totalScreens: number;
  onlineCount: number;
  offlineCount: number;
}

export default function ScreensOverviewCard({
  screens,
  totalScreens,
  onlineCount,
  offlineCount,
}: ScreensOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Screens Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold" data-testid="text-total-screens">
              {totalScreens}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-chart-2" data-testid="text-online-screens">
              {onlineCount}
            </div>
            <div className="text-sm text-muted-foreground">Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-destructive" data-testid="text-offline-screens">
              {offlineCount}
            </div>
            <div className="text-sm text-muted-foreground">Offline</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Recent Screens</div>
          {screens.slice(0, 3).map((screen) => (
            <div
              key={screen.id}
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-200 hover-elevate"
              data-testid={`screen-item-${screen.id}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    screen.status === "online" ? "bg-chart-2" : "bg-destructive"
                  }`}
                  data-testid={`status-${screen.id}`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <span className="cursor-pointer text-sm font-medium hover:underline">{screen.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {screen.status === "offline" ? `Last Active: ${screen.lastSeen}` : screen.lastSeen}
                  </div>
                </div>
              </div>
              <span
                className={`text-xs font-medium ${
                  screen.status === "online" ? "text-chart-2" : "text-destructive"
                }`}
              >
                {screen.status === "online" ? "Online" : "Offline"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
