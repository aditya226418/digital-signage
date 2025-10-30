import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Record<string, any>;
  onApplyFilters: (filters: Record<string, any>) => void;
  schema: Schema;
}

export default function FilterDrawer({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  schema,
}: FilterDrawerProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters({});
  };

  const updateFilter = (key: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleMultiSelect = (key: string, option: string) => {
    const current = localFilters[key] || [];
    const updated = current.includes(option)
      ? current.filter((v: string) => v !== option)
      : [...current, option];
    updateFilter(key, updated);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-[420px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Apply filters to refine your screen list
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Default Filters Section */}
          <div className="space-y-4">
            {/* <h3 className="text-sm font-semibold text-foreground">Default Filters</h3> */}
            
            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Status</Label>
              <div className="space-y-2">
                {['online', 'offline'].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={(localFilters.status || []).includes(status)}
                      onCheckedChange={() => toggleMultiSelect('status', status)}
                    />
                    <label
                      htmlFor={`status-${status}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                    >
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Last Seen Filter */}
            <div className="space-y-3">
              <Label htmlFor="lastSeen" className="text-sm font-medium">Last Seen</Label>
              <Select
                value={localFilters.lastSeen || ''}
                onValueChange={(value) => updateFilter('lastSeen', value)}
              >
                <SelectTrigger id="lastSeen">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Now</SelectItem>
                  <SelectItem value="1hour">Within 1 hour</SelectItem>
                  <SelectItem value="1day">Within 1 day</SelectItem>
                  <SelectItem value="7days">Within 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Custom Filters Section */}
          {schema.fields.length > 0 && (
            <div className="space-y-4">
              {/* <h3 className="text-sm font-semibold text-foreground">Custom Filters</h3> */}
              
              {schema.fields.map((field) => (
                <div key={field.id} className="space-y-3">
                  <Label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}
                  </Label>

                  {/* Text Field */}
                  {field.type === 'text' && (
                    <Input
                      id={field.id}
                      placeholder={`Filter by ${field.label.toLowerCase()}`}
                      value={localFilters[field.id] || ''}
                      onChange={(e) => updateFilter(field.id, e.target.value)}
                    />
                  )}

                  {/* Number Field (Range) */}
                  {field.type === 'number' && (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={localFilters[field.id]?.min || ''}
                        onChange={(e) => updateFilter(field.id, {
                          ...localFilters[field.id],
                          min: e.target.value,
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={localFilters[field.id]?.max || ''}
                        onChange={(e) => updateFilter(field.id, {
                          ...localFilters[field.id],
                          max: e.target.value,
                        })}
                      />
                    </div>
                  )}

                  {/* Single Select */}
                  {field.type === 'single-select' && field.options && (
                    <Select
                      value={localFilters[field.id] || ''}
                      onValueChange={(value) => updateFilter(field.id, value)}
                    >
                      <SelectTrigger id={field.id}>
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Multi Select */}
                  {field.type === 'multi-select' && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${field.id}-${option}`}
                            checked={(localFilters[field.id] || []).includes(option)}
                            onCheckedChange={() => toggleMultiSelect(field.id, option)}
                          />
                          <label
                            htmlFor={`${field.id}-${option}`}
                            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Boolean */}
                  {field.type === 'boolean' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={field.id}
                        checked={localFilters[field.id] || false}
                        onCheckedChange={(checked) => updateFilter(field.id, checked)}
                      />
                      <Label htmlFor={field.id} className="text-sm font-normal cursor-pointer">
                        {localFilters[field.id] ? 'Yes' : 'No'}
                      </Label>
                    </div>
                  )}

                  {/* Date Range */}
                  {field.type === 'date' && (
                    <div className="space-y-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !localFilters[field.id]?.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {localFilters[field.id]?.from ? (
                              localFilters[field.id]?.to ? (
                                <>
                                  {format(new Date(localFilters[field.id].from), "LLL dd, y")} -{" "}
                                  {format(new Date(localFilters[field.id].to), "LLL dd, y")}
                                </>
                              ) : (
                                format(new Date(localFilters[field.id].from), "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={{
                              from: localFilters[field.id]?.from ? new Date(localFilters[field.id].from) : undefined,
                              to: localFilters[field.id]?.to ? new Date(localFilters[field.id].to) : undefined,
                            }}
                            onSelect={(range) => {
                              updateFilter(field.id, {
                                from: range?.from?.toISOString(),
                                to: range?.to?.toISOString(),
                              });
                            }}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  {field.helpText && (
                    <p className="text-xs text-muted-foreground">{field.helpText}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

