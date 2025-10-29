import { useState } from "react";
import { Wrench, Copy, Check, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

interface DynamicAddScreenModalProps {
  open: boolean;
  onClose: () => void;
  schema: Schema;
  onCreateScreen: (data: any) => void;
  onOpenAdminSettings: () => void;
}

export default function DynamicAddScreenModal({
  open,
  onClose,
  schema,
  onCreateScreen,
  onOpenAdminSettings,
}: DynamicAddScreenModalProps) {
  const { toast } = useToast();
  const [activationCode, setActivationCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    location: '',
    resolution: '',
    currentComposition: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateActivationCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setActivationCode(code);
  };

  const copyToClipboard = () => {
    if (activationCode) {
      navigator.clipboard.writeText(activationCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Activation code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const toggleMultiSelect = (key: string, option: string) => {
    const current = formData[key] || [];
    const updated = current.includes(option)
      ? current.filter((v: string) => v !== option)
      : [...current, option];
    updateField(key, updated);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate basic required fields
    if (!formData.name?.trim()) {
      newErrors.name = 'Screen name is required';
    }

    // Validate schema required fields
    schema.fields.forEach(field => {
      if (field.required) {
        const value = formData[field.id];
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Prepare custom fields
    const customFields: Record<string, any> = {};
    schema.fields.forEach(field => {
      if (formData[field.id] !== undefined) {
        customFields[field.id] = formData[field.id];
      }
    });

    const screenData = {
      name: formData.name,
      location: formData.location || '',
      resolution: formData.resolution || '1920x1080',
      currentComposition: formData.currentComposition || '',
      status: 'offline', // New screens start offline
      lastSeen: 'Never',
      activationCode: activationCode,
      customFields,
    };

    console.log('Creating screen:', screenData);
    onCreateScreen(screenData);
    
    toast({
      title: "Screen Created!",
      description: `${formData.name} has been added successfully`,
    });
    
    // Reset form
    setFormData({
      name: '',
      location: '',
      resolution: '',
      currentComposition: '',
    });
    setActivationCode(null);
    setErrors({});
    onClose();
  };

  const renderDynamicField = (field: SchemaField) => {
    const value = formData[field.id];
    const hasError = !!errors[field.id];

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>

        {/* Text Field */}
        {field.type === 'text' && (
          <Input
            id={field.id}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={hasError ? "border-destructive" : ""}
          />
        )}

        {/* Number Field */}
        {field.type === 'number' && (
          <Input
            id={field.id}
            type="number"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={hasError ? "border-destructive" : ""}
          />
        )}

        {/* Single Select */}
        {field.type === 'single-select' && field.options && (
          <Select
            value={value || ''}
            onValueChange={(val) => updateField(field.id, val)}
          >
            <SelectTrigger id={field.id} className={hasError ? "border-destructive" : ""}>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Multi Select */}
        {field.type === 'multi-select' && field.options && (
          <div className={cn("space-y-2 p-3 border rounded-md", hasError && "border-destructive")}>
            {field.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={() => toggleMultiSelect(field.id, option)}
                />
                <label
                  htmlFor={`${field.id}-${option}`}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Boolean */}
        {field.type === 'boolean' && (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.id}
              checked={value || false}
              onCheckedChange={(checked) => updateField(field.id, checked)}
            />
            <Label htmlFor={field.id} className="text-sm font-normal cursor-pointer">
              {value ? 'Yes' : 'No'}
            </Label>
          </div>
        )}

        {/* Date */}
        {field.type === 'date' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  hasError && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => updateField(field.id, date?.toISOString())}
              />
            </PopoverContent>
          </Popover>
        )}

        {hasError && (
          <p className="text-xs text-destructive">{errors[field.id]}</p>
        )}
        {field.helpText && !hasError && (
          <p className="text-xs text-muted-foreground">{field.helpText}</p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add Screen</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenAdminSettings}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Wrench className="h-4 w-4" />
              Settings (Admins)
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section A: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Screen Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Lobby Display"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Main Entrance"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolution" className="text-sm font-medium">Resolution</Label>
                <Select
                  value={formData.resolution}
                  onValueChange={(value) => updateField('resolution', value)}
                >
                  <SelectTrigger id="resolution">
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                    <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                    <SelectItem value="2560x1440">2560x1440 (QHD)</SelectItem>
                    <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentComposition" className="text-sm font-medium">
                  Current Composition
                </Label>
                <Select
                  value={formData.currentComposition}
                  onValueChange={(value) => updateField('currentComposition', value)}
                >
                  <SelectTrigger id="currentComposition">
                    <SelectValue placeholder="Select composition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Welcome Playlist">Welcome Playlist</SelectItem>
                    <SelectItem value="Meeting Schedule">Meeting Schedule</SelectItem>
                    <SelectItem value="Menu Board">Menu Board</SelectItem>
                    <SelectItem value="Company Highlights">Company Highlights</SelectItem>
                    <SelectItem value="Training Materials">Training Materials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section B: Custom Attributes */}
          {schema.fields.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Custom Attributes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schema.fields.map(field => renderDynamicField(field))}
                </div>
              </div>
            </>
          )}

          {/* Section C: Activation */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Activation</h3>
            
            {!activationCode ? (
              <Button
                variant="outline"
                onClick={generateActivationCode}
                className="w-full md:w-auto"
              >
                Get Activation Code
              </Button>
            ) : (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label className="text-sm font-medium mb-2 block">Activation Code</Label>
                    <div className="flex items-center gap-2">
                      <code className="text-2xl font-mono font-bold tracking-wider bg-background px-4 py-2 rounded border">
                        {activationCode}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyToClipboard}
                        className="shrink-0"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter this code in your screen's activation app to connect it to your account.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Screen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

