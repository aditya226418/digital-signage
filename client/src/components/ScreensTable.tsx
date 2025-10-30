import { useState } from "react";
import DynamicScreensTable from "./DynamicScreensTable";
import FilterDrawer from "./FilterDrawer";
import DynamicAddScreenModal from "./DynamicAddScreenModal";
import AdminSchemaModal from "./AdminSchemaModal";

// Schema types
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

// Default schema
const DEFAULT_SCHEMA: Schema = {
  version: 1,
  fields: [
    { 
      id: "store", 
      label: "Store", 
      type: "single-select", 
      options: ["Axis Mall", "Phoenix Marketcity"], 
      required: true,
      helpText: "Select the store location for this screen"
    },
    { 
      id: "screen_type", 
      label: "Screen Type", 
      type: "multi-select", 
      options: ["Menu", "Promo", "Info"],
      helpText: "You can select multiple screen types"
    }
  ]
};

// Mock screens with custom fields
const createMockScreens = (): Screen[] => [
  {
    id: "1",
    name: "Lobby Display",
    location: "Main Entrance",
    status: "online",
    defaultComposition: "Welcome Playlist",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "Axis Mall",
      screen_type: ["Menu", "Info"]
    }
  },
  {
    id: "2",
    name: "Conference Room A",
    location: "Floor 2, Room 201",
    status: "online",
    defaultComposition: "Meeting Schedule",
    lastSeen: "Active now",
    resolution: "3840x2160",
    customFields: {
      store: "Axis Mall",
      screen_type: ["Info"]
    }
  },
  {
    id: "3",
    name: "Cafeteria Screen",
    location: "Ground Floor Cafeteria",
    status: "offline",
    defaultComposition: "Menu Board",
    lastSeen: "2 hours ago",
    resolution: "1920x1080",
    customFields: {
      store: "Phoenix Marketcity",
      screen_type: ["Menu"]
    }
  },
  {
    id: "4",
    name: "Reception Area",
    location: "Main Lobby",
    status: "online",
    defaultComposition: "Company Highlights",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "Axis Mall",
      screen_type: ["Promo", "Info"]
    }
  },
  {
    id: "5",
    name: "Training Room",
    location: "Floor 3, Room 305",
    status: "offline",
    defaultComposition: "Training Materials",
    lastSeen: "1 day ago",
    resolution: "2560x1440",
    customFields: {
      store: "Phoenix Marketcity",
      screen_type: ["Info"]
    }
  },
  {
    id: "6",
    name: "Executive Floor Display",
    location: "Floor 5, Executive Area",
    status: "online",
    defaultComposition: "Executive Dashboard",
    lastSeen: "Active now",
    resolution: "3840x2160",
    customFields: {
      store: "Axis Mall",
      screen_type: ["Info", "Promo"]
    }
  },
  {
    id: "7",
    name: "Parking Lot Screen",
    location: "Basement Parking",
    status: "online",
    defaultComposition: "Parking Info",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "Axis Mall",
      screen_type: ["Info"]
    }
  },
  {
    id: "8",
    name: "Gym Display",
    location: "Ground Floor Gym",
    status: "offline",
    defaultComposition: "Fitness Tips",
    lastSeen: "3 hours ago",
    resolution: "1920x1080",
    customFields: {
      store: "Phoenix Marketcity",
      screen_type: ["Promo"]
    }
  },
];

export default function ScreensTable() {
  // State management
  const [schema, setSchema] = useState<Schema>(DEFAULT_SCHEMA);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isAddScreenModalOpen, setIsAddScreenModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [screens, setScreens] = useState<Screen[]>(createMockScreens());

  // Filter logic
  const getFilteredScreens = () => {
    return screens.filter(screen => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          screen.name.toLowerCase().includes(searchLower) ||
          screen.location.toLowerCase().includes(searchLower) ||
          screen.defaultComposition.toLowerCase().includes(searchLower) ||
          Object.values(screen.customFields || {}).some(value => 
            String(value).toLowerCase().includes(searchLower)
          );
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
        if (!filters.status.includes(screen.status)) return false;
      }

      // Last Seen filter
      if (filters.lastSeen) {
        const now = Date.now();
        const activeNow = screen.lastSeen === "Active now";
        
        switch (filters.lastSeen) {
          case 'active':
            if (!activeNow) return false;
            break;
          case '1hour':
            // Mock: accept "Active now" and recent times
            if (!activeNow && !screen.lastSeen.includes('min')) return false;
            break;
          case '1day':
            // Mock: exclude "1 day ago" or older
            if (screen.lastSeen.includes('day') && !screen.lastSeen.includes('day ago')) return false;
            break;
          // Add more cases as needed
        }
      }

      // Custom field filters
      for (const field of schema.fields) {
        const filterValue = filters[field.id];
        if (filterValue === undefined || filterValue === null || filterValue === '') continue;

        const screenValue = screen.customFields?.[field.id];

        // Text filter
        if (field.type === 'text' && filterValue) {
          if (!screenValue || !String(screenValue).toLowerCase().includes(String(filterValue).toLowerCase())) {
            return false;
          }
        }

        // Number filter (range)
        if (field.type === 'number' && typeof filterValue === 'object') {
          const numValue = Number(screenValue);
          if (filterValue.min && numValue < Number(filterValue.min)) return false;
          if (filterValue.max && numValue > Number(filterValue.max)) return false;
        }

        // Single select filter
        if (field.type === 'single-select' && filterValue) {
          if (screenValue !== filterValue) return false;
        }

        // Multi select filter
        if (field.type === 'multi-select' && Array.isArray(filterValue) && filterValue.length > 0) {
          const screenValues = Array.isArray(screenValue) ? screenValue : [screenValue];
          const hasMatch = filterValue.some(fv => screenValues.includes(fv));
          if (!hasMatch) return false;
        }

        // Boolean filter
        if (field.type === 'boolean' && typeof filterValue === 'boolean') {
          if (screenValue !== filterValue) return false;
        }

        // Date filter (range)
        if (field.type === 'date' && typeof filterValue === 'object') {
          if (!screenValue) return false;
          const screenDate = new Date(screenValue).getTime();
          if (filterValue.from) {
            const fromDate = new Date(filterValue.from).getTime();
            if (screenDate < fromDate) return false;
          }
          if (filterValue.to) {
            const toDate = new Date(filterValue.to).getTime();
            if (screenDate > toDate) return false;
          }
        }
      }

      return true;
    });
  };

  const filteredScreens = getFilteredScreens();

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([_, value]) => {
      if (Array.isArray(value) && value.length > 0) count++;
      else if (typeof value === 'object' && value !== null) {
        if (Object.values(value).some(v => v !== null && v !== undefined && v !== '')) count++;
      }
      else if (value !== null && value !== undefined && value !== '') count++;
    });
    return count;
  };

  // Handlers
  const handleRemoveFilter = (key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const handleCreateScreen = (screenData: any) => {
    const newScreen: Screen = {
      id: String(screens.length + 1),
      name: screenData.name,
      location: screenData.location,
      status: "offline",
      defaultComposition: screenData.defaultComposition || "None",
      lastSeen: "Never",
      resolution: screenData.resolution || "1920x1080",
      customFields: screenData.customFields || {},
    };
    
    setScreens(prev => [newScreen, ...prev]);
  };

  const handleUpdateSchema = (newSchema: Schema) => {
    setSchema(newSchema);
    // Clear filters that reference removed fields
    const validFieldIds = new Set(newSchema.fields.map(f => f.id));
    setFilters(prev => {
      const newFilters: Record<string, any> = {};
      Object.entries(prev).forEach(([key, value]) => {
        if (key === 'status' || key === 'lastSeen' || validFieldIds.has(key)) {
          newFilters[key] = value;
        }
      });
      return newFilters;
    });
  };

  return (
    <div className="space-y-0">
      {/* Main Table with Integrated Filters */}
      <DynamicScreensTable
        data={filteredScreens}
        schema={schema}
        onAddScreen={() => setIsAddScreenModalOpen(true)}
        onOpenAdminSettings={() => setIsAdminModalOpen(true)}
        onOpenFilters={() => setIsFilterDrawerOpen(true)}
        activeFilterCount={getActiveFilterCount()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        open={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
        filters={filters}
        onApplyFilters={setFilters}
        schema={schema}
      />

      {/* Add Screen Modal */}
      <DynamicAddScreenModal
        open={isAddScreenModalOpen}
        onClose={() => setIsAddScreenModalOpen(false)}
        schema={schema}
        onCreateScreen={handleCreateScreen}
        onOpenAdminSettings={() => {
          setIsAddScreenModalOpen(false);
          setIsAdminModalOpen(true);
        }}
      />

      {/* Admin Schema Modal */}
      <AdminSchemaModal
        open={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        schema={schema}
        onUpdateSchema={handleUpdateSchema}
        defaultSchema={DEFAULT_SCHEMA}
      />
    </div>
  );
}
