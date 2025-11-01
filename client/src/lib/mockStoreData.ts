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
  // Store 001 - McDonald's Kurla (10 screens)
  { id: "screen-001-01", name: "Main Entrance Menu Board", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-02", name: "Counter Menu Board 1", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-03", name: "Counter Menu Board 2", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-04", name: "Drive-Thru Pre-Order", location: "Drive-Thru", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-05", name: "Drive-Thru Menu Board", location: "Drive-Thru", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-06", name: "Dining Area Promo", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-07", name: "McCafe Menu", location: "McCafe Counter", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-08", name: "Kids Play Area", location: "Play Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-001" },
  { id: "screen-001-09", name: "Order Pickup Display", location: "Pickup Counter", status: "offline", resolution: "1920x1080", lastSeen: "2 hours ago", storeId: "store-001" },
  { id: "screen-001-10", name: "Exit Promo Screen", location: "Exit", status: "offline", resolution: "1920x1080", lastSeen: "5 hours ago", storeId: "store-001" },
  
  // Store 002 - McDonald's Indiranagar (6 screens)
  { id: "screen-002-01", name: "Entrance Digital Board", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-002" },
  { id: "screen-002-02", name: "Main Menu Board", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-002" },
  { id: "screen-002-03", name: "Value Meals Display", location: "Counter", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-002" },
  { id: "screen-002-04", name: "McCafe Menu Board", location: "McCafe", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-002" },
  { id: "screen-002-05", name: "Dining Promo Screen", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-002" },
  { id: "screen-002-06", name: "Order Status Display", location: "Pickup Area", status: "offline", resolution: "1280x800", lastSeen: "1 day ago", storeId: "store-002" },

  // Store 003 - McDonald's Connaught Place (15 screens)
  { id: "screen-003-01", name: "Flagship Entrance", location: "Main Entrance", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-02", name: "Counter Menu 1", location: "Counter 1", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-03", name: "Counter Menu 2", location: "Counter 2", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-04", name: "Counter Menu 3", location: "Counter 3", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-05", name: "Drive-Thru Pre-Board", location: "Drive-Thru", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-06", name: "Drive-Thru Menu", location: "Drive-Thru", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-07", name: "Drive-Thru Confirmation", location: "Drive-Thru", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-08", name: "McCafe Menu Board", location: "McCafe", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-09", name: "Ground Floor Promo", location: "Dining Area 1", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-10", name: "First Floor Promo", location: "Dining Area 2", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-11", name: "Order Pickup 1", location: "Pickup Counter", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-12", name: "Order Pickup 2", location: "Pickup Counter", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-003" },
  { id: "screen-003-13", name: "Kids Play Area", location: "Play Zone", status: "offline", resolution: "1920x1080", lastSeen: "3 hours ago", storeId: "store-003" },
  { id: "screen-003-14", name: "Dessert Station", location: "Dessert Counter", status: "offline", resolution: "1920x1080", lastSeen: "1 hour ago", storeId: "store-003" },
  { id: "screen-003-15", name: "Exit Screen", location: "Exit", status: "offline", resolution: "1920x1080", lastSeen: "30 minutes ago", storeId: "store-003" },

  // Store 004 - McDonald's Viman Nagar (5 screens)
  { id: "screen-004-01", name: "Entrance Menu", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-004" },
  { id: "screen-004-02", name: "Counter Menu Board", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-004" },
  { id: "screen-004-03", name: "Dining Area Display", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-004" },
  { id: "screen-004-04", name: "Order Pickup Screen", location: "Pickup", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-004" },
  { id: "screen-004-05", name: "Promo Wall", location: "Wall", status: "offline", resolution: "1920x1080", lastSeen: "4 hours ago", storeId: "store-004" },

  // Store 005 - McDonald's Banjara Hills (8 screens)
  { id: "screen-005-01", name: "Main Entrance", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-005" },
  { id: "screen-005-02", name: "Counter Menu 1", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-005" },
  { id: "screen-005-03", name: "Counter Menu 2", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-005" },
  { id: "screen-005-04", name: "Drive-Thru Menu", location: "Drive-Thru", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-005" },
  { id: "screen-005-05", name: "McCafe Display", location: "McCafe", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-005" },
  { id: "screen-005-06", name: "Dining Promo", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-005" },
  { id: "screen-005-07", name: "Order Status", location: "Pickup", status: "offline", resolution: "1920x1080", lastSeen: "1 hour ago", storeId: "store-005" },
  { id: "screen-005-08", name: "Kids Zone", location: "Play Area", status: "offline", resolution: "1920x1080", lastSeen: "3 hours ago", storeId: "store-005" },

  // Store 006 - McDonald's Bandra (4 screens)
  { id: "screen-006-01", name: "Entrance Board", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-006" },
  { id: "screen-006-02", name: "Main Menu", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-006" },
  { id: "screen-006-03", name: "Dining Display", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-006" },
  { id: "screen-006-04", name: "Order Pickup", location: "Pickup", status: "offline", resolution: "1920x1080", lastSeen: "Under Maintenance", storeId: "store-006" },

  // Store 007 - McDonald's Andheri (7 screens)
  { id: "screen-007-01", name: "Mall Entrance", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-007" },
  { id: "screen-007-02", name: "Counter Menu 1", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-007" },
  { id: "screen-007-03", name: "Counter Menu 2", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-007" },
  { id: "screen-007-04", name: "McCafe Board", location: "McCafe", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-007" },
  { id: "screen-007-05", name: "Food Court Display", location: "Food Court", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-007" },
  { id: "screen-007-06", name: "Dining Promo", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-007" },
  { id: "screen-007-07", name: "Order Status", location: "Pickup", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-007" },

  // Store 008 - McDonald's Whitefield (6 screens)
  { id: "screen-008-01", name: "Entrance Menu", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-008" },
  { id: "screen-008-02", name: "Counter Menu", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-008" },
  { id: "screen-008-03", name: "Drive-Thru Pre-Board", location: "Drive-Thru", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-008" },
  { id: "screen-008-04", name: "Drive-Thru Menu", location: "Drive-Thru", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-008" },
  { id: "screen-008-05", name: "Dining Display", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-008" },
  { id: "screen-008-06", name: "Order Pickup", location: "Pickup", status: "offline", resolution: "1920x1080", lastSeen: "2 hours ago", storeId: "store-008" },

  // Store 009 - McDonald's Koregaon Park (3 screens)
  { id: "screen-009-01", name: "Entrance Board", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-009" },
  { id: "screen-009-02", name: "Counter Menu", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-009" },
  { id: "screen-009-03", name: "McCafe Display", location: "McCafe", status: "offline", resolution: "1920x1080", lastSeen: "6 hours ago", storeId: "store-009" },

  // Store 010 - McDonald's Koramangala (5 screens - all offline due to renovation)
  { id: "screen-010-01", name: "Main Menu Board", location: "Counter", status: "offline", resolution: "3840x2160", lastSeen: "Under Renovation", storeId: "store-010" },
  { id: "screen-010-02", name: "Secondary Menu", location: "Counter", status: "offline", resolution: "1920x1080", lastSeen: "Under Renovation", storeId: "store-010" },
  { id: "screen-010-03", name: "Dining Display", location: "Dining Area", status: "offline", resolution: "1920x1080", lastSeen: "Under Renovation", storeId: "store-010" },
  { id: "screen-010-04", name: "Order Pickup", location: "Pickup", status: "offline", resolution: "1920x1080", lastSeen: "Under Renovation", storeId: "store-010" },
  { id: "screen-010-05", name: "Promo Screen", location: "Wall", status: "offline", resolution: "1920x1080", lastSeen: "Under Renovation", storeId: "store-010" },

  // Store 011 - McDonald's Saket (10 screens)
  { id: "screen-011-01", name: "Mall Entrance", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-011" },
  { id: "screen-011-02", name: "Counter Menu 1", location: "Counter 1", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-011" },
  { id: "screen-011-03", name: "Counter Menu 2", location: "Counter 2", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-011" },
  { id: "screen-011-04", name: "Value Meals Display", location: "Counter", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-011" },
  { id: "screen-011-05", name: "McCafe Menu", location: "McCafe", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-011" },
  { id: "screen-011-06", name: "Dining Area 1", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-011" },
  { id: "screen-011-07", name: "Dining Area 2", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-011" },
  { id: "screen-011-08", name: "Kids Play Zone", location: "Play Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-011" },
  { id: "screen-011-09", name: "Order Pickup", location: "Pickup", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-011" },
  { id: "screen-011-10", name: "Exit Promo", location: "Exit", status: "offline", resolution: "1920x1080", lastSeen: "1 hour ago", storeId: "store-011" },

  // Store 012 - McDonald's Hitech City (5 screens)
  { id: "screen-012-01", name: "Entrance Display", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-012" },
  { id: "screen-012-02", name: "Counter Menu", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-012" },
  { id: "screen-012-03", name: "Drive-Thru Menu", location: "Drive-Thru", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-012" },
  { id: "screen-012-04", name: "Dining Display", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-012" },
  { id: "screen-012-05", name: "Order Status", location: "Pickup", status: "offline", resolution: "1920x1080", lastSeen: "30 minutes ago", storeId: "store-012" },

  // Store 013 - McDonald's MG Road (6 screens)
  { id: "screen-013-01", name: "Mall Entrance", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-013" },
  { id: "screen-013-02", name: "Counter Menu", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-013" },
  { id: "screen-013-03", name: "McCafe Board", location: "McCafe", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-013" },
  { id: "screen-013-04", name: "Food Court Display", location: "Food Court", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-013" },
  { id: "screen-013-05", name: "Dining Promo", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-013" },
  { id: "screen-013-06", name: "Order Pickup", location: "Pickup", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-013" },

  // Store 014 - McDonald's Rajouri Garden (4 screens)
  { id: "screen-014-01", name: "Entrance Menu", location: "Entrance", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-014" },
  { id: "screen-014-02", name: "Counter Menu", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-014" },
  { id: "screen-014-03", name: "Dining Display", location: "Dining Area", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-014" },
  { id: "screen-014-04", name: "Order Status", location: "Pickup", status: "offline", resolution: "1920x1080", lastSeen: "2 hours ago", storeId: "store-014" },

  // Store 015 - McDonald's Lower Parel (8 screens)
  { id: "screen-015-01", name: "Premium Entrance", location: "Entrance", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-015" },
  { id: "screen-015-02", name: "Counter Menu 1", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-015" },
  { id: "screen-015-03", name: "Counter Menu 2", location: "Counter", status: "online", resolution: "3840x2160", lastSeen: "Active now", storeId: "store-015" },
  { id: "screen-015-04", name: "McCafe Premium", location: "McCafe", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-015" },
  { id: "screen-015-05", name: "Lounge Display 1", location: "Lounge", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-015" },
  { id: "screen-015-06", name: "Lounge Display 2", location: "Lounge", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-015" },
  { id: "screen-015-07", name: "Order Pickup", location: "Pickup", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-015" },
  { id: "screen-015-08", name: "Exit Promo", location: "Exit", status: "online", resolution: "1920x1080", lastSeen: "Active now", storeId: "store-015" },
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

