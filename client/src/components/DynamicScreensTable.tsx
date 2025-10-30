import { useState, useEffect } from "react";
import { Search, Filter, Wrench, ChevronLeft, ChevronRight, MoreVertical, Eye, Settings as SettingsIcon, Power, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SchemaField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'single-select' | 'multi-select' | 'boolean' | 'date';
  options?: string[];
  required?: boolean;
  helpText?: string;
}

interface Schema {
  version: number;
  fields: SchemaField[];
}

interface Screen {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  defaultComposition: string;
  lastSeen: string;
  resolution: string;
  customFields?: Record<string, any>;
}

interface DynamicScreensTableProps {
  data: Screen[];
  schema: Schema;
  onAddScreen: () => void;
  onOpenAdminSettings: () => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function DynamicScreensTable({
  data,
  schema,
  onAddScreen,
  onOpenAdminSettings,
  onOpenFilters,
  activeFilterCount,
  searchQuery,
  onSearchChange,
}: DynamicScreensTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Get first 2-3 custom fields to display in table
  const displayCustomFields = schema.fields.slice(0, 2);

  const formatCustomFieldValue = (field: SchemaField, value: any) => {
    if (value === undefined || value === null) return '-';
    
    if (field.type === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ');
    if (field.type === 'date' && value) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    return String(value);
  };

  return (
    <Card className="border-border/40 shadow-sm transition-all duration-300">
      <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent">
        {/* Search, Filters, and Actions Row */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-1">
          <div className="flex gap-2 shrink-0">
            <Button
              className="gap-2 transition-all duration-200 hover:shadow-md"
              onClick={onAddScreen}
            >
              <Plus className="h-4 w-4" />
              Add Screen
            </Button>
          </div>
          <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                className="gap-2 transition-all duration-200 hover:bg-accent"
                onClick={onOpenFilters}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onOpenAdminSettings}
                    className="transition-all duration-200 hover:bg-accent"
                  >
                    <Wrench className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Admin Settings</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative flex-1 w-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search screens by name, location, or composition..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-primary/20 "
              />
            </div>

            
          </div>

          {/* Actions */}
         
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Screen Name</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Default Composition</TableHead>
                <TableHead className="font-semibold">Last Seen</TableHead>
                {displayCustomFields.map((field) => (
                  <TableHead key={field.id} className="font-semibold">
                    {field.label}
                  </TableHead>
                ))}
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: Math.min(5, itemsPerPage) }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    {displayCustomFields.map((field) => (
                      <TableCell key={field.id}><Skeleton className="h-5 w-24" /></TableCell>
                    ))}
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  </TableRow>
                ))
              ) : currentData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6 + displayCustomFields.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No screens found
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((screen) => (
                  <TableRow
                    key={screen.id}
                    className="transition-colors duration-150 hover:bg-muted/30"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{screen.name}</span>
                        <span className="text-xs text-muted-foreground">{screen.resolution}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{screen.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant={screen.status === "online" ? "default" : "secondary"}
                        className={
                          screen.status === "online"
                            ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
                            : "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 dark:text-gray-400"
                        }
                      >
                        <span
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                            screen.status === "online" ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                        {screen.status === "online" ? "Online" : "Offline"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{screen.defaultComposition}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{screen.lastSeen}</TableCell>
                    {displayCustomFields.map((field) => (
                      <TableCell key={field.id} className="text-sm">
                        {formatCustomFieldValue(field, screen.customFields?.[field.id])}
                      </TableCell>
                    ))}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 transition-all duration-200 hover:bg-accent"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" />
                            Live Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <SettingsIcon className="h-4 w-4" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                            <Power className="h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{" "}
              {data.length} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-1 transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="h-8 w-8 p-0 transition-all duration-200"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="gap-1 transition-all duration-200"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

