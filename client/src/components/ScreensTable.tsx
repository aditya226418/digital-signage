import { useState } from "react";
import DynamicScreensTable from "./DynamicScreensTable";
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
      id: "state", 
      label: "State", 
      type: "single-select", 
      options: ["Maharashtra", "Karnataka", "Delhi", "Telangana", "Gujarat"], 
      required: false,
      helpText: "Select the state where this screen is located"
    },
    { 
      id: "city", 
      label: "City", 
      type: "single-select", 
      options: ["Mumbai", "Navi Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad", "Ahmedabad"], 
      required: false,
      helpText: "Select the city where this screen is located"
    },
    { 
      id: "store", 
      label: "Store", 
      type: "single-select", 
      options: ["McDonald's Bandra West", "McDonald's Navi Mumbai", "McDonald's Koramangala", "McDonald's Indiranagar", "McDonald's Marathahalli", "McDonald's Connaught Place", "McDonald's Hitech City", "McDonald's Pune Central", "McDonald's Ahmedabad", "McDonald's CG Road"], 
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
// Store location mappings - all screens in the same store have same city/state
const createMockScreens = (): Screen[] => [
  {
    id: "1",
    name: "Front Counter Display",
    location: "Main Counter",
    status: "online",
    defaultComposition: "Menu Board Day",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Bandra West",
      screen_type: ["Menu", "Info"],
      city: "Mumbai",
      state: "Maharashtra"
    }
  },
  {
    id: "2",
    name: "Drive-Thru Menu",
    location: "Drive-Thru Lane",
    status: "online",
    defaultComposition: "Drive-Thru Combo Meals",
    lastSeen: "Active now",
    resolution: "3840x2160",
    customFields: {
      store: "McDonald's Bandra West",
      screen_type: ["Menu"],
      city: "Mumbai",
      state: "Maharashtra"
    }
  },
  {
    id: "3",
    name: "Dining Area Screen",
    location: "Seating Area 1",
    status: "offline",
    defaultComposition: "Happy Meal Promos",
    lastSeen: "2 hours ago",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Koramangala",
      screen_type: ["Promo"],
      city: "Bangalore",
      state: "Karnataka"
    }
  },
  {
    id: "4",
    name: "Order Kiosk 1",
    location: "Entrance Area",
    status: "online",
    defaultComposition: "Self-Service Menu",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Connaught Place",
      screen_type: ["Menu", "Info"],
      city: "Delhi",
      state: "Delhi"
    }
  },
  {
    id: "5",
    name: "Kitchen Display",
    location: "Kitchen Area",
    status: "offline",
    defaultComposition: "Order Queue",
    lastSeen: "1 day ago",
    resolution: "2560x1440",
    customFields: {
      store: "McDonald's Hitech City",
      screen_type: ["Info"],
      city: "Hyderabad",
      state: "Telangana"
    }
  },
  {
    id: "6",
    name: "McCafe Menu Board",
    location: "McCafe Counter",
    status: "online",
    defaultComposition: "Coffee & Desserts",
    lastSeen: "Active now",
    resolution: "3840x2160",
    customFields: {
      store: "McDonald's Bandra West",
      screen_type: ["Menu", "Promo"],
      city: "Mumbai",
      state: "Maharashtra"
    }
  },
  {
    id: "7",
    name: "Digital Menu Board 2",
    location: "Counter Position 2",
    status: "online",
    defaultComposition: "Breakfast Menu",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Koramangala",
      screen_type: ["Menu"],
      city: "Bangalore",
      state: "Karnataka"
    }
  },
  {
    id: "8",
    name: "Promotional Display",
    location: "Window Display",
    status: "offline",
    defaultComposition: "Limited Time Offers",
    lastSeen: "3 hours ago",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Connaught Place",
      screen_type: ["Promo"],
      city: "Delhi",
      state: "Delhi"
    }
  },
  {
    id: "9",
    name: "Front Counter Menu",
    location: "Main Counter",
    status: "online",
    defaultComposition: "Menu Board",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Navi Mumbai",
      screen_type: ["Menu", "Info"],
      city: "Navi Mumbai",
      state: "Maharashtra"
    }
  },
  {
    id: "10",
    name: "Drive-Thru Display",
    location: "Drive-Thru Lane",
    status: "online",
    defaultComposition: "Combo Meals",
    lastSeen: "Active now",
    resolution: "3840x2160",
    customFields: {
      store: "McDonald's Navi Mumbai",
      screen_type: ["Menu"],
      city: "Navi Mumbai",
      state: "Maharashtra"
    }
  },
  {
    id: "11",
    name: "McCafe Menu",
    location: "McCafe Counter",
    status: "online",
    defaultComposition: "Beverages & Desserts",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Navi Mumbai",
      screen_type: ["Menu", "Promo"],
      city: "Navi Mumbai",
      state: "Maharashtra"
    }
  },
  {
    id: "12",
    name: "Seating Area Display",
    location: "Dining Hall",
    status: "online",
    defaultComposition: "Promotional Offers",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Navi Mumbai",
      screen_type: ["Promo", "Info"],
      city: "Navi Mumbai",
      state: "Maharashtra"
    }
  },
  {
    id: "13",
    name: "Menu Board Main",
    location: "Counter 1",
    status: "online",
    defaultComposition: "Daily Menu",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Indiranagar",
      screen_type: ["Menu"],
      city: "Bangalore",
      state: "Karnataka"
    }
  },
  {
    id: "14",
    name: "Menu Board Secondary",
    location: "Counter 2",
    status: "online",
    defaultComposition: "Meal Combos",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Indiranagar",
      screen_type: ["Menu"],
      city: "Bangalore",
      state: "Karnataka"
    }
  },
  {
    id: "15",
    name: "Promo Display",
    location: "Window",
    status: "offline",
    defaultComposition: "Limited Offers",
    lastSeen: "4 hours ago",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Indiranagar",
      screen_type: ["Promo"],
      city: "Bangalore",
      state: "Karnataka"
    }
  },
  {
    id: "16",
    name: "Interactive Kiosk",
    location: "Entrance",
    status: "online",
    defaultComposition: "Self Order",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Marathahalli",
      screen_type: ["Menu", "Info"],
      city: "Bangalore",
      state: "Karnataka"
    }
  },
  {
    id: "17",
    name: "Kitchen Display Board",
    location: "Kitchen Area",
    status: "online",
    defaultComposition: "Order Queue",
    lastSeen: "Active now",
    resolution: "2560x1440",
    customFields: {
      store: "McDonald's Marathahalli",
      screen_type: ["Info"],
      city: "Bangalore",
      state: "Karnataka"
    }
  },
  {
    id: "18",
    name: "Drive-Thru Menu",
    location: "Drive-Thru",
    status: "online",
    defaultComposition: "Fast Orders",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Marathahalli",
      screen_type: ["Menu"],
      city: "Bangalore",
      state: "Karnataka"
    }
  },
  {
    id: "19",
    name: "Front Counter Display",
    location: "Main Area",
    status: "online",
    defaultComposition: "Today's Special",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Pune Central",
      screen_type: ["Menu", "Promo"],
      city: "Pune",
      state: "Maharashtra"
    }
  },
  {
    id: "20",
    name: "Menu Board",
    location: "Counter",
    status: "offline",
    defaultComposition: "Standard Menu",
    lastSeen: "5 hours ago",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Pune Central",
      screen_type: ["Menu"],
      city: "Pune",
      state: "Maharashtra"
    }
  },
  {
    id: "21",
    name: "Promotional Screen",
    location: "Wall Display",
    status: "online",
    defaultComposition: "New Launches",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Pune Central",
      screen_type: ["Promo"],
      city: "Pune",
      state: "Maharashtra"
    }
  },
  {
    id: "22",
    name: "Information Display",
    location: "Lobby",
    status: "online",
    defaultComposition: "Store Info",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Ahmedabad",
      screen_type: ["Info"],
      city: "Ahmedabad",
      state: "Gujarat"
    }
  },
  {
    id: "23",
    name: "Menu Board Premium",
    location: "Premium Counter",
    status: "online",
    defaultComposition: "Premium Range",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Ahmedabad",
      screen_type: ["Menu", "Promo"],
      city: "Ahmedabad",
      state: "Gujarat"
    }
  },
  {
    id: "24",
    name: "Order Status Display",
    location: "Waiting Area",
    status: "online",
    defaultComposition: "Order Numbers",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's Ahmedabad",
      screen_type: ["Info"],
      city: "Ahmedabad",
      state: "Gujarat"
    }
  },
  {
    id: "25",
    name: "Front Counter Menu",
    location: "Main Counter",
    status: "online",
    defaultComposition: "Daily Menu",
    lastSeen: "Active now",
    resolution: "1920x1080",
    customFields: {
      store: "McDonald's CG Road",
      screen_type: ["Menu"],
      city: "Ahmedabad",
      state: "Gujarat"
    }
  },
  {
    id: "26",
    name: "Promotional Board",
    location: "Display Wall",
    status: "online",
    defaultComposition: "Current Offers",
    lastSeen: "Active now",
    resolution: "3840x2160",
    customFields: {
      store: "McDonald's CG Road",
      screen_type: ["Promo"],
      city: "Ahmedabad",
      state: "Gujarat"
    }
  },
];

export default function ScreensTable() {
  // State management
  const [schema, setSchema] = useState<Schema>(DEFAULT_SCHEMA);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
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
        activeFilterCount={getActiveFilterCount()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
        onApplyFilters={setFilters}
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
