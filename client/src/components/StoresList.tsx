import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  User2,
  Monitor,
  Plus,
  Search,
  Filter,
  Wifi,
  WifiOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import {
  mockStores,
  mockOwners,
  filterStores,
  getUniqueRegions,
  getUniqueCities,
  getUniqueStatuses,
  type Store,
} from "@/lib/mockStoreData";
import StoreFormModal from "@/components/StoreFormModal";
import StoreDetail from "@/components/StoreDetail";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 9;

export default function StoresList() {
  const [location, setLocation] = useLocation();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedOwner, setSelectedOwner] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Check if we're viewing a specific store
  const pathParts = location.split("/");
  const isDetailView = pathParts[1] === "stores" && pathParts[2];
  const storeIdFromPath = isDetailView ? pathParts[2] : null;

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setStores(mockStores);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter stores
  const filteredStores = filterStores(
    stores,
    searchQuery,
    selectedRegion,
    selectedOwner,
    selectedStatus,
    selectedCity
  );

  // Pagination
  const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStores = filteredStores.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRegion, selectedCity, selectedOwner, selectedStatus]);

  const handleStoreClick = (storeId: string) => {
    setLocation(`/stores/${storeId}`);
  };

  const handleAddStore = (newStore: Omit<Store, "id">) => {
    const store: Store = {
      ...newStore,
      id: `store-${Date.now()}`,
    };
    setStores([store, ...stores]);
  };

  const handleUpdateStore = (updatedStore: Store) => {
    setStores(stores.map(s => s.id === updatedStore.id ? updatedStore : s));
  };

  const handleDeleteStore = (storeId: string) => {
    setStores(stores.filter(s => s.id !== storeId));
    setLocation("/stores");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "inactive":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  // If viewing a specific store, show detail view
  if (storeIdFromPath) {
    return (
      <StoreDetail
        storeId={storeIdFromPath}
        onBack={() => setLocation("/stores")}
        onUpdate={handleUpdateStore}
        onDelete={handleDeleteStore}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stores by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Store
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {getUniqueRegions(mockStores).map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-[180px]">
            <MapPin className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {getUniqueCities(mockStores).map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedOwner} onValueChange={setSelectedOwner}>
          <SelectTrigger className="w-[200px]">
            <User2 className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Owners" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Owners</SelectItem>
            {mockOwners.map((owner) => (
              <SelectItem key={owner.id} value={owner.id}>
                {owner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <Building2 className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {getUniqueStatuses().map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(searchQuery || selectedRegion !== "all" || selectedCity !== "all" || selectedOwner !== "all" || selectedStatus !== "all") && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("");
              setSelectedRegion("all");
              setSelectedCity("all");
              setSelectedOwner("all");
              setSelectedStatus("all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedStores.length} of {filteredStores.length} stores
      </div>

      {/* Store Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : paginatedStores.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No stores found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </Card>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {paginatedStores.map((store, index) => (
              <motion.div
                key={store.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/50"
                  onClick={() => handleStoreClick(store.id)}
                >
                  <CardHeader className="space-y-3 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                            {store.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {store.city}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("capitalize", getStatusColor(store.status))}
                      >
                        {store.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User2 className="h-4 w-4" />
                        <span>{store.owner}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {store.region}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {store.screensTotal} Screens
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Wifi className="h-3.5 w-3.5 text-green-600" />
                          <span className="font-medium text-green-700 dark:text-green-400">
                            {store.screensOnline}
                          </span>
                        </div>
                        {store.screensTotal - store.screensOnline > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <WifiOff className="h-3.5 w-3.5 text-red-600" />
                            <span className="font-medium text-red-700 dark:text-red-400">
                              {store.screensTotal - store.screensOnline}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {store.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {store.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-background"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-[2.5rem]"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Add Store Modal */}
      <StoreFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddStore}
      />
    </div>
  );
}

