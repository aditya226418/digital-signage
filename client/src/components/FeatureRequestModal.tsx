import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Lightbulb } from "lucide-react";

interface FeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "News & Information",
  "Productivity",
  "Social Media",
  "Finance",
  "Entertainment",
  "Utilities",
  "Analytics",
  "Other",
];

export default function FeatureRequestModal({
  isOpen,
  onClose,
}: FeatureRequestModalProps) {
  const [formData, setFormData] = useState({
    appName: "",
    description: "",
    category: "",
    reason: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.appName.trim()) {
      newErrors.appName = "App name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Please tell us why you need this app";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Log the request (in a real app, this would be sent to a backend)
    console.log("Feature request submitted:", formData);

    // Show success state
    setIsSubmitted(true);

    // Reset form after 2 seconds and close
    setTimeout(() => {
      setFormData({
        appName: "",
        description: "",
        category: "",
        reason: "",
      });
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitted) {
      setFormData({
        appName: "",
        description: "",
        category: "",
        reason: "",
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Thank you!</h2>
            <p className="text-center text-sm text-muted-foreground">
              Your feature request has been submitted successfully. We'll review
              it and get back to you soon.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <DialogTitle>Request a Feature</DialogTitle>
              </div>
              <DialogDescription>
                Can't find an app you need? Let us know! Tell us about the app
                you'd like to see in our marketplace.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* App Name */}
              <div className="space-y-2">
                <Label htmlFor="appName" className="text-sm font-medium">
                  App Name *
                </Label>
                <Input
                  id="appName"
                  placeholder="e.g., Slack, Jira, Figma..."
                  value={formData.appName}
                  onChange={(e) =>
                    setFormData({ ...formData, appName: e.target.value })
                  }
                  className={errors.appName ? "border-red-500" : ""}
                />
                {errors.appName && (
                  <p className="text-xs text-red-500">{errors.appName}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  What does it do? *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the app..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`min-h-20 resize-none ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger
                    id="category"
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-red-500">{errors.category}</p>
                )}
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium">
                  Why do you need this? *
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Tell us how you'd use this app and why it matters to your team..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className={`min-h-20 resize-none ${
                    errors.reason ? "border-red-500" : ""
                  }`}
                />
                {errors.reason && (
                  <p className="text-xs text-red-500">{errors.reason}</p>
                )}
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-xs text-blue-900">
                  Your request is valuable! We use all feedback to improve our
                  app marketplace and prioritize integrations.
                </AlertDescription>
              </Alert>

              <DialogFooter className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitted}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitted}>
                  Submit Request
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
