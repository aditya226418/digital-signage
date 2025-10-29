import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";

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

interface ActiveFiltersBarProps {
  filters: Record<string, any>;
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
  schema: Schema;
}

export default function ActiveFiltersBar({
  filters,
  onRemoveFilter,
  onClearAll,
  schema,
}: ActiveFiltersBarProps) {
  const filterEntries = Object.entries(filters).filter(([_, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== null && v !== undefined && v !== '');
    }
    return value !== null && value !== undefined && value !== '';
  });

  if (filterEntries.length === 0) return null;

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

  const visibleFilters = filterEntries.slice(0, 6);
  const hiddenFilters = filterEntries.slice(6);

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 border-b border-border/40 bg-muted/20 px-4">
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

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="gap-2 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive ml-auto"
      >
        <X className="h-4 w-4" />
        Clear All
      </Button>
    </div>
  );
}

