// TypeScript interfaces for Store Management

export interface StoreOwner {
  id: string;
  name: string;
  email: string;
  role: "Franchise Owner" | "Store Manager" | "Regional Manager" | "Operator";
  region: string;
  phone?: string;
  avatar?: string;
}

export interface StoreScreen {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline";
  resolution: string;
  lastSeen: string;
  storeId: string;
}

export interface PublishHistory {
  id: string;
  contentName: string;
  publishedBy: string;
  publishedAt: string;
  status: "success" | "failed" | "pending";
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  region: string;
  timezone: string;
  owner: string;
  ownerId: string;
  screensOnline: number;
  screensTotal: number;
  status: "active" | "inactive" | "maintenance";
  tags: string[];
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: string;
}

// Mock Owners
export const mockOwners: StoreOwner[] = [
  {
    id: "owner-001",
    name: "Rajesh Singh",
    email: "rajesh.singh@franchise.com",
    role: "Franchise Owner",
    region: "West Zone",
    phone: "+91 98765 43210",
  },
  {
    id: "owner-002",
    name: "Priya Sharma",
    email: "priya.sharma@franchise.com",
    role: "Regional Manager",
    region: "South Zone",
    phone: "+91 98765 43211",
  },
  {
    id: "owner-003",
    name: "Amit Patel",
    email: "amit.patel@franchise.com",
    role: "Franchise Owner",
    region: "West Zone",
    phone: "+91 98765 43212",
  },
  {
    id: "owner-004",
    name: "Sneha Reddy",
    email: "sneha.reddy@franchise.com",
    role: "Store Manager",
    region: "South Zone",
    phone: "+91 98765 43213",
  },
  {
    id: "owner-005",
    name: "Vikram Malhotra",
    email: "vikram.malhotra@franchise.com",
    role: "Franchise Owner",
    region: "North Zone",
    phone: "+91 98765 43214",
  },
  {
    id: "owner-006",
    name: "Anjali Gupta",
    email: "anjali.gupta@franchise.com",
    role: "Regional Manager",
    region: "East Zone",
    phone: "+91 98765 43215",
  },
  {
    id: "owner-007",
    name: "Rahul Verma",
    email: "rahul.verma@franchise.com",
    role: "Store Manager",
    region: "North Zone",
    phone: "+91 98765 43216",
  },
  {
    id: "owner-008",
    name: "Kavita Desai",
    email: "kavita.desai@franchise.com",
    role: "Operator",
    region: "West Zone",
    phone: "+91 98765 43217",
  },
];

// Mock Stores
export const mockStores: Store[] = [
  {
    id: "store-001",
    name: "McDonald's Kurla",
    region: "West Zone",
    city: "Mumbai",
    timezone: "Asia/Kolkata",
    owner: "Rajesh Singh",
    ownerId: "owner-001",
    screensOnline: 8,
    screensTotal: 10,
    status: "active",
    tags: ["High Footfall", "Mall", "Drive-Thru"],
    address: "Phoenix Market City, Kurla West, Mumbai",
    phone: "+91 22 1234 5678",
    email: "kurla@mcdonalds.in",
    openingHours: "7:00 AM - 11:00 PM",
  },
  {
    id: "store-002",
    name: "McDonald's Indiranagar",
    region: "South Zone",
    city: "Bangalore",
    timezone: "Asia/Kolkata",
    owner: "Priya Sharma",
    ownerId: "owner-002",
    screensOnline: 5,
    screensTotal: 6,
    status: "active",
    tags: ["High Footfall", "24/7", "McCafe"],
    address: "100 Feet Road, Indiranagar, Bangalore",
    phone: "+91 80 2345 6789",
    email: "indiranagar@mcdonalds.in",
    openingHours: "Open 24 Hours",
  },
  {
    id: "store-003",
    name: "McDonald's Connaught Place",
    region: "North Zone",
    city: "Delhi",
    timezone: "Asia/Kolkata",
    owner: "Vikram Malhotra",
    ownerId: "owner-005",
    screensOnline: 12,
    screensTotal: 15,
    status: "active",
    tags: ["Flagship", "High Footfall", "McCafe", "Drive-Thru"],
    address: "Connaught Place, New Delhi",
    phone: "+91 11 3456 7890",
    email: "cp@mcdonalds.in",
    openingHours: "7:00 AM - 12:00 AM",
  },
  {
    id: "store-004",
    name: "McDonald's Viman Nagar",
    region: "West Zone",
    city: "Pune",
    timezone: "Asia/Kolkata",
    owner: "Amit Patel",
    ownerId: "owner-003",
    screensOnline: 4,
    screensTotal: 5,
    status: "active",
    tags: ["Mall", "Family Friendly"],
    address: "Phoenix Market City, Viman Nagar, Pune",
    phone: "+91 20 4567 8901",
    email: "vimannagar@mcdonalds.in",
    openingHours: "8:00 AM - 11:00 PM",
  },
  {
    id: "store-005",
    name: "McDonald's Banjara Hills",
    region: "South Zone",
    city: "Hyderabad",
    timezone: "Asia/Kolkata",
    owner: "Sneha Reddy",
    ownerId: "owner-004",
    screensOnline: 6,
    screensTotal: 8,
    status: "active",
    tags: ["High Footfall", "McCafe", "Drive-Thru"],
    address: "Road No. 12, Banjara Hills, Hyderabad",
    phone: "+91 40 5678 9012",
    email: "banjarahills@mcdonalds.in",
    openingHours: "7:00 AM - 11:30 PM",
  },
  {
    id: "store-006",
    name: "McDonald's Bandra",
    region: "West Zone",
    city: "Mumbai",
    timezone: "Asia/Kolkata",
    owner: "Rajesh Singh",
    ownerId: "owner-001",
    screensOnline: 3,
    screensTotal: 4,
    status: "maintenance",
    tags: ["Street Store", "24/7"],
    address: "Linking Road, Bandra West, Mumbai",
    phone: "+91 22 6789 0123",
    email: "bandra@mcdonalds.in",
    openingHours: "Open 24 Hours",
  },
  {
    id: "store-007",
    name: "McDonald's Andheri",
    region: "West Zone",
    city: "Mumbai",
    timezone: "Asia/Kolkata",
    owner: "Anjali Gupta",
    ownerId: "owner-006",
    screensOnline: 7,
    screensTotal: 7,
    status: "active",
    tags: ["High Footfall", "Mall", "McCafe"],
    address: "Infiniti Mall, Andheri West, Mumbai",
    phone: "+91 22 7890 1234",
    email: "andheri@mcdonalds.in",
    openingHours: "8:00 AM - 11:00 PM",
  },
  {
    id: "store-008",
    name: "McDonald's Whitefield",
    region: "South Zone",
    city: "Bangalore",
    timezone: "Asia/Kolkata",
    owner: "Priya Sharma",
    ownerId: "owner-002",
    screensOnline: 5,
    screensTotal: 6,
    status: "active",
    tags: ["High Footfall", "Mall", "Drive-Thru"],
    address: "Phoenix Marketcity, Whitefield, Bangalore",
    phone: "+91 80 8901 2345",
    email: "whitefield@mcdonalds.in",
    openingHours: "8:00 AM - 11:00 PM",
  },
  {
    id: "store-009",
    name: "McDonald's Koregaon Park",
    region: "West Zone",
    city: "Pune",
    timezone: "Asia/Kolkata",
    owner: "Kavita Desai",
    ownerId: "owner-008",
    screensOnline: 2,
    screensTotal: 3,
    status: "active",
    tags: ["Street Store", "McCafe"],
    address: "North Main Road, Koregaon Park, Pune",
    phone: "+91 20 9012 3456",
    email: "koregaonpark@mcdonalds.in",
    openingHours: "7:00 AM - 11:00 PM",
  },
  {
    id: "store-010",
    name: "McDonald's Koramangala",
    region: "South Zone",
    city: "Bangalore",
    timezone: "Asia/Kolkata",
    owner: "Priya Sharma",
    ownerId: "owner-002",
    screensOnline: 0,
    screensTotal: 5,
    status: "inactive",
    tags: ["Under Renovation"],
    address: "80 Feet Road, Koramangala, Bangalore",
    phone: "+91 80 0123 4567",
    email: "koramangala@mcdonalds.in",
    openingHours: "Temporarily Closed",
  },
  {
    id: "store-011",
    name: "McDonald's Saket",
    region: "North Zone",
    city: "Delhi",
    timezone: "Asia/Kolkata",
    owner: "Rahul Verma",
    ownerId: "owner-007",
    screensOnline: 9,
    screensTotal: 10,
    status: "active",
    tags: ["Mall", "High Footfall", "Family Friendly"],
    address: "Select Citywalk, Saket, New Delhi",
    phone: "+91 11 1234 5678",
    email: "saket@mcdonalds.in",
    openingHours: "8:00 AM - 11:00 PM",
  },
  {
    id: "store-012",
    name: "McDonald's Hitech City",
    region: "South Zone",
    city: "Hyderabad",
    timezone: "Asia/Kolkata",
    owner: "Rajesh Singh",
    ownerId: "owner-001",
    screensOnline: 4,
    screensTotal: 5,
    status: "active",
    tags: ["Mall", "24/7", "Drive-Thru"],
    address: "Inorbit Mall, Hitech City, Hyderabad",
    phone: "+91 40 2345 6789",
    email: "hitechcity@mcdonalds.in",
    openingHours: "Open 24 Hours",
  },
  {
    id: "store-013",
    name: "McDonald's MG Road",
    region: "South Zone",
    city: "Bangalore",
    timezone: "Asia/Kolkata",
    owner: "Priya Sharma",
    ownerId: "owner-002",
    screensOnline: 6,
    screensTotal: 6,
    status: "active",
    tags: ["Mall", "McCafe", "High Footfall"],
    address: "Garuda Mall, MG Road, Bangalore",
    phone: "+91 80 3456 7890",
    email: "mgroad@mcdonalds.in",
    openingHours: "8:00 AM - 11:00 PM",
  },
  {
    id: "store-014",
    name: "McDonald's Rajouri Garden",
    region: "North Zone",
    city: "Delhi",
    timezone: "Asia/Kolkata",
    owner: "Vikram Malhotra",
    ownerId: "owner-005",
    screensOnline: 3,
    screensTotal: 4,
    status: "active",
    tags: ["Street Store", "High Footfall", "24/7"],
    address: "Pacific Mall, Rajouri Garden, Delhi",
    phone: "+91 11 4567 8901",
    email: "rajouri@mcdonalds.in",
    openingHours: "Open 24 Hours",
  },
  {
    id: "store-015",
    name: "McDonald's Lower Parel",
    region: "West Zone",
    city: "Mumbai",
    timezone: "Asia/Kolkata",
    owner: "Vikram Malhotra",
    ownerId: "owner-005",
    screensOnline: 8,
    screensTotal: 8,
    status: "active",
    tags: ["Premium", "Mall", "McCafe"],
    address: "Palladium Mall, Lower Parel, Mumbai",
    phone: "+91 22 5678 9012",
    email: "lowerparel@mcdonalds.in",
    openingHours: "8:00 AM - 12:00 AM",
  },
];

// Mock Screens for Stores
export const mockStoreScreens: StoreScreen[] = [
  // Store 001 - Nike Mumbai Central (10 screens)
  { id: "screen-001-01", name: "Main Entrance Display", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-02", name: "Men's Section Wall", location: "Men's Section", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-03", name: "Women's Section Display", location: "Women's Section", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-04", name: "Kids Zone Screen", location: "Kids Section", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-05", name: "Checkout Counter 1", location: "Checkout", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-06", name: "Checkout Counter 2", location: "Checkout", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-07", name: "Shoe Display Wall", location: "Footwear", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-08", name: "Accessories Corner", location: "Accessories", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-09", name: "Fitting Room Area", location: "Fitting Rooms", status: "offline", resolution: "1920x1080", lastSeen: "2 hours ago", storeId: "store-001" },
  { id: "screen-001-10", name: "Back Exit Display", location: "Exit", status: "offline", resolution: "1920x1080", lastSeen: "5 hours ago", storeId: "store-001" },
  
  // Store 002 - Nike Bangalore Indiranagar (6 screens)
  { id: "screen-002-01", name: "Storefront Window", location: "Window Display", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-002" },
  { id: "screen-002-02", name: "Central Display", location: "Center", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-002" },
  { id: "screen-002-03", name: "Running Section", location: "Running Gear", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-002" },
  { id: "screen-002-04", name: "Checkout Display", location: "Checkout", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-002" },
  { id: "screen-002-05", name: "Back Wall Promo", location: "Back Wall", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-002" },
  { id: "screen-002-06", name: "Entrance Tablet", location: "Entrance", status: "offline", resolution: "1280x800", lastSeen: "1 day ago", storeId: "store-002" },

  // Store 003 - Adidas Delhi Connaught Place (15 screens)
  { id: "screen-003-01", name: "Flagship Entrance", location: "Main Entrance", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-02", name: "Men's Floor 1", location: "Men's Section", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-03", name: "Men's Floor 2", location: "Men's Section", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-04", name: "Women's Floor 1", location: "Women's Section", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-05", name: "Women's Floor 2", location: "Women's Section", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-06", name: "Sports Performance Zone", location: "Performance", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-07", name: "Originals Collection", location: "Originals", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-08", name: "Kids Zone Interactive", location: "Kids", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-09", name: "Footwear Wall Main", location: "Footwear", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-10", name: "Footwear Wall Side", location: "Footwear", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-11", name: "Checkout 1", location: "Checkout", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-12", name: "Checkout 2", location: "Checkout", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-13", name: "Escalator Display", location: "Escalator", status: "offline", resolution: "1920x1080", lastSeen: "3 hours ago", storeId: "store-003" },
  { id: "screen-003-14", name: "VIP Lounge", location: "VIP Area", status: "offline", resolution: "1920x1080", lastSeen: "1 hour ago", storeId: "store-003" },
  { id: "screen-003-15", name: "Exit Promo", location: "Exit", status: "offline", resolution: "1920x1080", lastSeen: "30 minutes ago", storeId: "store-003" },
];

// Mock Publish History
export const mockPublishHistory: PublishHistory[] = [
  { id: "pub-001", contentName: "Summer Sale Campaign", publishedBy: "Rajesh Singh", publishedAt: "2025-10-28 10:30 AM", status: "success", storeId: "store-001" },
  { id: "pub-002", contentName: "New Arrivals Showcase", publishedBy: "Priya Sharma", publishedAt: "2025-10-27 02:15 PM", status: "success", storeId: "store-001" },
  { id: "pub-003", contentName: "Weekend Promo Video", publishedBy: "System", publishedAt: "2025-10-26 09:00 AM", status: "success", storeId: "store-001" },
  { id: "pub-004", contentName: "Brand Story Playlist", publishedBy: "Rajesh Singh", publishedAt: "2025-10-25 11:45 AM", status: "failed", storeId: "store-001" },
  { id: "pub-005", contentName: "Diwali Special Offers", publishedBy: "Priya Sharma", publishedAt: "2025-10-29 08:00 AM", status: "success", storeId: "store-002" },
  { id: "pub-006", contentName: "Running Shoes Collection", publishedBy: "System", publishedAt: "2025-10-28 03:30 PM", status: "success", storeId: "store-002" },
  { id: "pub-007", contentName: "Flagship Launch Event", publishedBy: "Vikram Malhotra", publishedAt: "2025-10-30 10:00 AM", status: "success", storeId: "store-003" },
  { id: "pub-008", contentName: "Premium Collection Video", publishedBy: "System", publishedAt: "2025-10-29 01:00 PM", status: "pending", storeId: "store-003" },
];

// Helper functions
export const getStoreById = (id: string): Store | undefined => {
  return mockStores.find(store => store.id === id);
};

export const getOwnerById = (id: string): StoreOwner | undefined => {
  return mockOwners.find(owner => owner.id === id);
};

export const getScreensByStoreId = (storeId: string): StoreScreen[] => {
  return mockStoreScreens.filter(screen => screen.storeId === storeId);
};

export const getPublishHistoryByStoreId = (storeId: string): PublishHistory[] => {
  return mockPublishHistory.filter(history => history.storeId === storeId);
};

export const filterStores = (
  stores: Store[],
  searchQuery: string,
  region?: string,
  owner?: string,
  status?: string,
  city?: string
): Store[] => {
  return stores.filter(store => {
    const matchesSearch = !searchQuery || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = !region || region === "all" || store.region === region;
    const matchesOwner = !owner || owner === "all" || store.ownerId === owner;
    const matchesStatus = !status || status === "all" || store.status === status;
    const matchesCity = !city || city === "all" || store.city === city;

    return matchesSearch && matchesRegion && matchesOwner && matchesStatus && matchesCity;
  });
};

export const getUniqueRegions = (stores: Store[]): string[] => {
  return Array.from(new Set(stores.map(store => store.region))).sort();
};

export const getUniqueCities = (stores: Store[]): string[] => {
  return Array.from(new Set(stores.map(store => store.city))).sort();
};

export const getUniqueStatuses = (): string[] => {
  return ["active", "inactive", "maintenance"];
};

