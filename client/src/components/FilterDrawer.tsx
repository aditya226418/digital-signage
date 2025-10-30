import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  children: React.ReactNode;
}

export default function FilterDrawer({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  schema,
  children,
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
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0" 
        align="start"
        sideOffset={8}
      >
        <div className="p-4 border-b">
          <h3 className="font-semibold text-base">Filters</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Apply filters to refine your screen list
          </p>
        </div>

        <ScrollArea className="h-[420px]">
          <div className="p-4 space-y-4">
            


            {/* {schema.fields.length > 0 && <Separator className="my-3" />} */}

            {/* Custom Filters Section */}
            {schema.fields.length > 0 && (
              <div className="space-y-3">
                {schema.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
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
                        className="h-9"
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
                          className="h-9"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={localFilters[field.id]?.max || ''}
                          onChange={(e) => updateFilter(field.id, {
                            ...localFilters[field.id],
                            max: e.target.value,
                          })}
                          className="h-9"
                        />
                      </div>
                    )}

                    {/* Single Select */}
                    {field.type === 'single-select' && field.options && (
                      <Select
                        value={localFilters[field.id] || ''}
                        onValueChange={(value) => updateFilter(field.id, value)}
                      >
                        <SelectTrigger id={field.id} className="h-9">
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
                      <div className="flex flex-wrap gap-3">
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-9 justify-start text-left font-normal text-sm",
                              !localFilters[field.id]?.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {localFilters[field.id]?.from ? (
                              localFilters[field.id]?.to ? (
                                <>
                                  {format(new Date(localFilters[field.id].from), "MMM dd")} -{" "}
                                  {format(new Date(localFilters[field.id].to), "MMM dd, y")}
                                </>
                              ) : (
                                format(new Date(localFilters[field.id].from), "MMM dd, y")
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
                            numberOfMonths={1}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex gap-3">
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
          </div>
        </ScrollArea>

        <div className="p-4 border-t flex gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
