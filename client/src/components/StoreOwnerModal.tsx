import { useState, useEffect } from "react";
import { User2, Mail, Phone, MapPin } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { type StoreOwner } from "@/lib/mockStoreData";
import { cn } from "@/lib/utils";

interface StoreOwnerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (owner: Omit<StoreOwner, "id"> | StoreOwner) => void;
  owner?: StoreOwner;
}

const roles = [
  "Franchise Owner",
  "Store Manager",
  "Regional Manager",
  "Operator",
] as const;

const regions = ["North Zone", "South Zone", "East Zone", "West Zone"];

export default function StoreOwnerModal({
  open,
  onClose,
  onSave,
  owner,
}: StoreOwnerModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Store Manager" as StoreOwner["role"],
    region: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (owner) {
      setFormData({
        name: owner.name,
        email: owner.email,
        role: owner.role,
        region: owner.region,
        phone: owner.phone || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "Store Manager",
        region: "",
        phone: "",
      });
    }
    setErrors({});
  }, [owner, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.region) {
      newErrors.region = "Region is required";
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

    const ownerData = {
      ...formData,
      ...(owner && { id: owner.id }),
    };

    onSave(ownerData as StoreOwner);

    toast({
      title: owner ? "Owner Updated" : "Owner Added",
      description: owner
        ? `${formData.name} has been updated successfully`
        : `${formData.name} has been added successfully`,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User2 className="h-5 w-5" />
            {owner ? "Edit Store Owner" : "Add Store Owner"}
          </DialogTitle>
          <DialogDescription>
            {owner
              ? "Update owner or manager information"
              : "Add a new owner or manager to your franchise"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john.doe@example.com"
                className={cn("pl-9", errors.email ? "border-red-500" : "")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+91 98765 43210"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value: StoreOwner["role"]) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {owner ? "Update Owner" : "Add Owner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

