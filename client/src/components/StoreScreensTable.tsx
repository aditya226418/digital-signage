import { Monitor, Wifi, WifiOff, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type StoreScreen } from "@/lib/mockStoreData";
import { cn } from "@/lib/utils";

interface StoreScreensTableProps {
  screens: StoreScreen[];
  onView?: (screenId: string) => void;
  onEdit?: (screenId: string) => void;
  onRemove?: (screenId: string) => void;
}

export default function StoreScreensTable({
  screens,
  onView,
  onEdit,
  onRemove,
}: StoreScreensTableProps) {
  const onlineCount = screens.filter((s) => s.status === "online").length;
  const offlineCount = screens.filter((s) => s.status === "offline").length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Screens</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screens.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Wifi className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {onlineCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {screens.length > 0
                ? `${Math.round((onlineCount / screens.length) * 100)}% uptime`
                : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <WifiOff className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {offlineCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {offlineCount > 0 ? "Needs attention" : "All systems operational"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Screens Table */}
      <Card>
        <CardHeader>
          <CardTitle>Screen Details</CardTitle>
        </CardHeader>
        <CardContent>
          {screens.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Monitor className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No screens assigned</h3>
              <p className="text-sm text-muted-foreground">
                This store doesn't have any screens assigned yet.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Screen Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resolution</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screens.map((screen) => (
                    <TableRow key={screen.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          {screen.name}
                        </div>
                      </TableCell>
                      <TableCell>{screen.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            screen.status === "online"
                              ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                          )}
                        >
                          <div className="flex items-center gap-1">
                            {screen.status === "online" ? (
                              <Wifi className="h-3 w-3" />
                            ) : (
                              <WifiOff className="h-3 w-3" />
                            )}
                            {screen.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {screen.resolution}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {screen.lastSeen}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {onView && (
                              <DropdownMenuItem onClick={() => onView(screen.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            )}
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(screen.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Screen
                              </DropdownMenuItem>
                            )}
                            {onRemove && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onRemove(screen.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove from Store
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

