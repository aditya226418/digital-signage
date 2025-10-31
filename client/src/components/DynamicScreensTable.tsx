import { useState, useEffect } from "react";
import { Search, Filter, Wrench, ChevronLeft, ChevronRight, MoreVertical, Eye, Settings as SettingsIcon, Power, Plus, X, ChevronDown, Send } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import FilterDrawer from "./FilterDrawer";
import StoreQuickViewModal from "./StoreQuickViewModal";

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
  activeFilterCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: Record<string, any>;
  onRemoveFilter: (key: string) => void;
  onClearAllFilters: () => void;
  onApplyFilters: (filters: Record<string, any>) => void;
}

export default function DynamicScreensTable({
  data,
  schema,
  onAddScreen,
  onOpenAdminSettings,
  activeFilterCount,
  searchQuery,
  onSearchChange,
  filters,
  onRemoveFilter,
  onClearAllFilters,
  onApplyFilters,
}: DynamicScreensTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>("");
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

  // Reset selected rows when filters, search, or data changes
  useEffect(() => {
    setSelectedRows(new Set());
  }, [filters, searchQuery, data.length]);

  // Get custom fields to display in table (excluding city and state as they're shown with location, and store as it's a separate column)
  const displayCustomFields = schema.fields.filter(field => field.id !== 'city' && field.id !== 'state' && field.id !== 'store');

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

  // Active filters logic
  const getFilterLabel = (key: string, value: any): string => {
    // Check default filters
    if (key === 'status') return `Status: ${Array.isArray(value) ? value.join(', ') : value}`;
    if (key === 'lastSeen') return `Last Seen: ${value}`;
    
    // Check custom fields
    const field = schema.fields.find(f => f.id === key);
    if (!field) return `${key}: ${value}`;

    let displayValue = value;
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    } else if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
    } else if (typeof value === 'object' && value !== null) {
      // Handle range filters (number, date)
      const parts = [];
      if (value.min) parts.push(`min: ${value.min}`);
      if (value.max) parts.push(`max: ${value.max}`);
      if (value.from) parts.push(`from: ${value.from}`);
      if (value.to) parts.push(`to: ${value.to}`);
      displayValue = parts.join(', ');
    }

    return `${field.label}: ${displayValue}`;
  };

  const filterEntries = Object.entries(filters).filter(([_, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== null && v !== undefined && v !== '');
    }
    return value !== null && value !== undefined && value !== '';
  });

  const visibleFilters = filterEntries.slice(0, 6);
  const hiddenFilters = filterEntries.slice(6);

  // Quick filter helpers for City and Store
  const cityField = schema.fields.find(f => f.id === 'city');
  const storeField = schema.fields.find(f => f.id === 'store');
  
  const cityFilterCount = filters.city ? (Array.isArray(filters.city) ? filters.city.length : 1) : 0;
  const storeFilterCount = filters.store ? (Array.isArray(filters.store) ? filters.store.length : 1) : 0;

  const handleQuickFilterToggle = (fieldId: string, value: string) => {
    const currentValue = filters[fieldId];
    let newValue: string | string[];

    if (Array.isArray(currentValue)) {
      // Multi-select
      if (currentValue.includes(value)) {
        newValue = currentValue.filter(v => v !== value);
      } else {
        newValue = [...currentValue, value];
      }
    } else {
      // Single-select
      if (currentValue === value) {
        newValue = '';
      } else {
        newValue = value;
      }
    }

    onApplyFilters({
      ...filters,
      [fieldId]: Array.isArray(newValue) && newValue.length === 0 ? undefined : newValue === '' ? undefined : newValue,
    });
  };

  // Checkbox selection handlers
  const hasFiltersApplied = filterEntries.length > 0 || searchQuery.trim().length > 0;
  const currentPageIds = currentData.map(screen => screen.id);
  const areAllCurrentPageSelected = currentPageIds.length > 0 && currentPageIds.every(id => selectedRows.has(id));
  const areSomeSelected = currentPageIds.some(id => selectedRows.has(id));

  const toggleSelectAll = () => {
    if (areAllCurrentPageSelected) {
      setSelectedRows(prev => {
        const newSet = new Set(prev);
        currentPageIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    } else {
      setSelectedRows(prev => {
        const newSet = new Set(prev);
        currentPageIds.forEach(id => newSet.add(id));
        return newSet;
      });
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle store click to open quick view modal
  const handleStoreClick = (storeName: string) => {
    setSelectedStore(storeName);
    setIsStoreModalOpen(true);
  };

  // Get all screens from the original data that belong to the selected store
  const getStoreScreens = () => {
    return data.filter(screen => screen.customFields?.store === selectedStore);
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
          <div className="flex gap-2 shrink-0 flex-wrap">
              <FilterDrawer
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                filters={filters}
                onApplyFilters={onApplyFilters}
                schema={schema}
              >
                <Button
                  variant="outline"
                  className="gap-2 transition-all duration-200 hover:bg-accent"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </FilterDrawer>

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

      {/* Active Filters - Integrated */}
      {filterEntries.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-6 py-3 bg-muted/30 border-b border-border/40">
          <AnimatePresence mode="popLayout">
            {visibleFilters.map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className="gap-1 pr-1 transition-all duration-200 hover:bg-secondary/80"
                >
                  {getFilterLabel(key, value)}
                  <button
                    onClick={() => onRemoveFilter(key)}
                    className="ml-1 rounded-full hover:bg-background/50 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>

          {hiddenFilters.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-accent transition-colors"
                >
                  +{hiddenFilters.length} more
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  {hiddenFilters.map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">{getFilterLabel(key, value)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFilter(key)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Screens Found Indicator */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground font-medium">
              {data.length} {data.length === 1 ? 'screen' : 'screens'} found
              {searchQuery.trim().length > 0 && (
                <> for <span className="font-semibold text-foreground">"{searchQuery}"</span></>
              )}
            </span>
            <div className="h-4 w-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClearAllFilters();
                if (searchQuery.trim().length > 0) {
                  onSearchChange('');
                }
              }}
              className="gap-2 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Search Results Indicator - shown when searching without filters */}
      {searchQuery.trim().length > 0 && filterEntries.length === 0 && (
        <div className="flex items-center justify-between px-6 py-3 bg-muted/30 border-b border-border/40">
          <span className="text-sm text-muted-foreground font-medium">
            {data.length} {data.length === 1 ? 'screen' : 'screens'} found for <span className="font-semibold text-foreground">"{searchQuery}"</span>
          </span>
        </div>
      )}

      {/* Sticky Action Bar - appears when rows are selected */}
      <AnimatePresence>
        {selectedRows.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-6 py-3 bg-primary/10 border-b border-primary/20 sticky top-0 z-10"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedRows.size} {selectedRows.size === 1 ? 'screen' : 'screens'} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  // Handle manage action
                  console.log('Managing screens:', Array.from(selectedRows));
                }}
              >
                <SettingsIcon className="h-4 w-4" />
                Manage ({selectedRows.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  // Handle publish action
                  console.log('Publishing to screens:', Array.from(selectedRows));
                }}
              >
                <Eye className="h-4 w-4" />
                Publish
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRows(new Set())}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {hasFiltersApplied && (
                  <TableHead className="w-12">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Checkbox
                            checked={areAllCurrentPageSelected}
                            onCheckedChange={toggleSelectAll}
                            aria-label="Select all"
                            className={areSomeSelected && !areAllCurrentPageSelected ? "data-[state=checked]:bg-primary" : ""}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select All Screens</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                )}
                <TableHead className="font-semibold">Store</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Screen Name</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Default Composition</TableHead>
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
                    {hasFiltersApplied && (
                      <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                    )}
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                    {displayCustomFields.map((field) => (
                      <TableCell key={field.id}><Skeleton className="h-5 w-24" /></TableCell>
                    ))}
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  </TableRow>
                ))
              ) : currentData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5 + displayCustomFields.length + (hasFiltersApplied ? 1 : 0)}
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
                    {hasFiltersApplied && (
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <Checkbox
                                checked={selectedRows.has(screen.id)}
                                onCheckedChange={() => toggleSelectRow(screen.id)}
                                aria-label={`Select ${screen.name}`}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Select {screen.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    )}
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="flex flex-col cursor-pointer group"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (screen.customFields?.store) {
                                handleStoreClick(screen.customFields.store);
                              }
                            }}
                          >
                            <span className="font-bold text-md group-hover:text-primary underline decoration-primary/0 group-hover:decoration-primary/100 decoration-2 underline-offset-4 transition-all">
                              {screen.customFields?.store || '-'}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Quick view of {screen.customFields?.store || 'this store'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {(screen.customFields?.city || screen.customFields?.state) && (
                          <span className="">
                            {[screen.customFields?.city, screen.customFields?.state].filter(Boolean).join(', ')}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{screen.name}</span>
                        <span className="text-xs text-muted-foreground">{screen.resolution}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={screen.status === "online" ? "default" : "secondary"}
                          className={
                            screen.status === "online"
                              ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400 w-fit"
                              : "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 dark:text-gray-400 w-fit"
                          }
                        >
                          <span
                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                              screen.status === "online" ? "bg-green-500" : "bg-gray-500"
                            }`}
                          />
                          {screen.status === "online" ? "Online" : "Offline"}
                        </Badge>
                        {screen.status === "offline" && (
                          <span className="text-xs text-muted-foreground">
                            {screen.lastSeen}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{screen.defaultComposition}</TableCell>
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
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Send className="h-4 w-4" />
                            Publish
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

      {/* Store Quick View Modal */}
      <StoreQuickViewModal
        open={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        storeName={selectedStore}
        screens={getStoreScreens()}
      />
    </Card>
  );
}

