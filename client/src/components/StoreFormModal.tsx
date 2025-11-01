import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, MapPin, Clock, Tag, User2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockOwners, type Store } from "@/lib/mockStoreData";

interface StoreFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (store: Omit<Store, "id"> | Store) => void;
  store?: Store;
}

const regions = ["North Zone", "South Zone", "East Zone", "West Zone"];
const timezones = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "America/New_York",
  "Europe/London",
  "Asia/Singapore",
];

const statuses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "Maintenance" },
];

export default function StoreFormModal({
  open,
  onClose,
  onSave,
  store,
}: StoreFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    region: "",
    timezone: "Asia/Kolkata",
    ownerId: "",
    owner: "",
    status: "active" as "active" | "inactive" | "maintenance",
    screensOnline: 0,
    screensTotal: 0,
    tags: [] as string[],
    address: "",
    phone: "",
    email: "",
    openingHours: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        city: store.city,
        region: store.region,
        timezone: store.timezone,
        ownerId: store.ownerId,
        owner: store.owner,
        status: store.status,
        screensOnline: store.screensOnline,
        screensTotal: store.screensTotal,
        tags: store.tags,
        address: store.address || "",
        phone: store.phone || "",
        email: store.email || "",
        openingHours: store.openingHours || "",
      });
    } else {
      // Reset form for new store
      setFormData({
        name: "",
        city: "",
        region: "",
        timezone: "Asia/Kolkata",
        ownerId: "",
        owner: "",
        status: "active",
        screensOnline: 0,
        screensTotal: 0,
        tags: [],
        address: "",
        phone: "",
        email: "",
        openingHours: "",
      });
    }
    setErrors({});
  }, [store, open]);

  const handleOwnerChange = (ownerId: string) => {
    const selectedOwner = mockOwners.find((o) => o.id === ownerId);
    if (selectedOwner) {
      setFormData({
        ...formData,
        ownerId,
        owner: selectedOwner.name,
        region: selectedOwner.region, // Auto-fill region from owner
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Store name is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.region) {
      newErrors.region = "Region is required";
    }
    if (!formData.ownerId) {
      newErrors.ownerId = "Owner is required";
    }
    if (formData.screensTotal < 0) {
      newErrors.screensTotal = "Total screens cannot be negative";
    }
    if (formData.screensOnline < 0) {
      newErrors.screensOnline = "Online screens cannot be negative";
    }
    if (formData.screensOnline > formData.screensTotal) {
      newErrors.screensOnline = "Online screens cannot exceed total screens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    const storeData = {
      ...formData,
      ...(store && { id: store.id }),
    };

    onSave(storeData as Store);

    toast({
      title: store ? "Store Updated" : "Store Added",
      description: store
        ? `${formData.name} has been updated successfully`
        : `${formData.name} has been added successfully`,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {store ? "Edit Store" : "Add New Store"}
          </DialogTitle>
          <DialogDescription>
            {store
              ? "Update store information and settings"
              : "Add a new store location to your franchise network"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Store Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nike Mumbai Central"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Mumbai"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">
                  Store Owner <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.ownerId} onValueChange={handleOwnerChange}>
                  <SelectTrigger className={errors.ownerId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockOwners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        <div className="flex items-center gap-2">
                          <span>{owner.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({owner.role})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ownerId && (
                  <p className="text-xs text-red-500">{errors.ownerId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">
                  Region <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) =>
                    setFormData({ ...formData, region: value })
                  }
                >
                  <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && (
                  <p className="text-xs text-red-500">{errors.region}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) =>
                    setFormData({ ...formData, timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Screen Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Screen Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="screensTotal">Total Screens</Label>
                <Input
                  id="screensTotal"
                  type="number"
                  min="0"
                  value={formData.screensTotal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      screensTotal: parseInt(e.target.value) || 0,
                    })
                  }
                  className={errors.screensTotal ? "border-red-500" : ""}
                />
                {errors.screensTotal && (
                  <p className="text-xs text-red-500">{errors.screensTotal}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="screensOnline">Screens Online</Label>
                <Input
                  id="screensOnline"
                  type="number"
                  min="0"
                  max={formData.screensTotal}
                  value={formData.screensOnline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      screensOnline: parseInt(e.target.value) || 0,
                    })
                  }
                  className={errors.screensOnline ? "border-red-500" : ""}
                />
                {errors.screensOnline && (
                  <p className="text-xs text-red-500">{errors.screensOnline}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Phoenix Market City, Kurla West"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+91 22 1234 5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="store@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingHours">Opening Hours</Label>
              <Input
                id="openingHours"
                value={formData.openingHours}
                onChange={(e) =>
                  setFormData({ ...formData, openingHours: e.target.value })
                }
                placeholder="10:00 AM - 10:00 PM"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Tags</h3>
            
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag (e.g., High Footfall, Mall)"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                <Tag className="h-4 w-4" />
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {formData.tags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge
                        variant="secondary"
                        className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3" />
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {store ? "Update Store" : "Add Store"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

