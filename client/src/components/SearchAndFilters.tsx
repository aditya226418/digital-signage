import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterOption {
  key: string;
  label: string;
  value: string;
}

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  activeFilters: string[];
  onToggleFilter: (value: string) => void;
}

export default function SearchAndFilters({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterOptions = [],
  activeFilters,
  onToggleFilter,
}: SearchAndFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-muted-foreground h-4 w-4 pointer-events-none" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              className="absolute right-2 flex items-center justify-center hover:bg-accent rounded p-1"
              onClick={() => onSearchChange("")}
              type="button"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Dropdown */}
      {filterOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 min-w-[120px]">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={activeFilters.includes(option.value)}
                onCheckedChange={() => onToggleFilter(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
            {activeFilters.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    activeFilters.forEach(filter => onToggleFilter(filter));
                  }}
                >
                  Clear all filters
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

