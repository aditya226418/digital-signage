import { Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportsCardProps {
  activeCampaigns: number;
  uptime: number;
}

export default function ReportsCard({ activeCampaigns, uptime }: ReportsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-chart-2/5 to-transparent">
        <CardTitle>Reports Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gradient-to-br from-chart-4/20 to-chart-4/5 p-3">
              <Activity className="h-6 w-6 text-chart-4" />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-semibold" data-testid="text-active-campaigns">
                {activeCampaigns}
              </div>
              <div className="text-sm text-muted-foreground">Active Campaigns</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gradient-to-br from-chart-2/20 to-chart-2/5 p-3">
              <TrendingUp className="h-6 w-6 text-chart-2" />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-semibold" data-testid="text-uptime">
                {uptime}%
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Performance</span>
              <span className="text-xs text-muted-foreground">Last 7 days</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-chart-2 transition-all duration-500"
                style={{ width: `${uptime}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
