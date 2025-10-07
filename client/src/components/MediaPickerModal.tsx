import { useState, useEffect } from "react";
import {
  Upload,
  X,
  HelpCircle,
  Play,
  Trash2,
  Search,
  Image as ImageIcon,
  Video,
  Pause,
  Monitor,
  Edit2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types
interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  duration?: number;
  uploadProgress?: number;
  status: "uploading" | "processing" | "completed" | "failed";
  title?: string;
  altText?: string;
}

interface Template {
  id: string;
  name: string;
  industry: string;
  duration: string;
  resolution: string;
  thumbnailUrl: string;
  previewUrl: string;
  description: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMediaAdded?: (files: UploadedFile[]) => void;
  onTemplateSelected?: (template: Template) => void;
  showQuickStartHint?: boolean;
}

// Mock template data
const MOCK_TEMPLATES: Template[] = [
  // Retail
  { id: "r1", name: "Promo Loop", industry: "Retail", duration: "30s", resolution: "1920×1080", thumbnailUrl: "/templates/retail-promo.jpg", previewUrl: "/templates/retail-promo.mp4", description: "Perfect for seasonal sales" },
  { id: "r2", name: "Product Showcase", industry: "Retail", duration: "45s", resolution: "1920×1080", thumbnailUrl: "/templates/retail-product.jpg", previewUrl: "/templates/retail-product.mp4", description: "Highlight your best products" },
  { id: "r3", name: "Flash Sale", industry: "Retail", duration: "20s", resolution: "1920×1080", thumbnailUrl: "/templates/retail-flash.jpg", previewUrl: "/templates/retail-flash.mp4", description: "Create urgency with countdown" },
  { id: "r4", name: "New Arrivals", industry: "Retail", duration: "40s", resolution: "1080×1920", thumbnailUrl: "/templates/retail-arrivals.jpg", previewUrl: "/templates/retail-arrivals.mp4", description: "Portrait mode for new items" },
  { id: "r5", name: "Store Directory", industry: "Retail", duration: "60s", resolution: "1920×1080", thumbnailUrl: "/templates/retail-directory.jpg", previewUrl: "/templates/retail-directory.mp4", description: "Help customers navigate" },
  
  // Restaurants
  { id: "res1", name: "Menu Board", industry: "Restaurants", duration: "60s", resolution: "1920×1080", thumbnailUrl: "/templates/restaurant-menu.jpg", previewUrl: "/templates/restaurant-menu.mp4", description: "Digital menu display" },
  { id: "res2", name: "Daily Specials", industry: "Restaurants", duration: "30s", resolution: "1920×1080", thumbnailUrl: "/templates/restaurant-specials.jpg", previewUrl: "/templates/restaurant-specials.mp4", description: "Promote today's deals" },
  { id: "res3", name: "Combo Deals", industry: "Restaurants", duration: "25s", resolution: "1920×1080", thumbnailUrl: "/templates/restaurant-combo.jpg", previewUrl: "/templates/restaurant-combo.mp4", description: "QSR combo promotions" },
  { id: "res4", name: "Queue Display", industry: "Restaurants", duration: "15s", resolution: "1080×1920", thumbnailUrl: "/templates/restaurant-queue.jpg", previewUrl: "/templates/restaurant-queue.mp4", description: "Order status display" },
  { id: "res5", name: "Happy Hour", industry: "Restaurants", duration: "35s", resolution: "1920×1080", thumbnailUrl: "/templates/restaurant-happy.jpg", previewUrl: "/templates/restaurant-happy.mp4", description: "Time-based promotions" },
  
  // Corporate
  { id: "c1", name: "Welcome Lobby", industry: "Corporate", duration: "90s", resolution: "1920×1080", thumbnailUrl: "/templates/corporate-welcome.jpg", previewUrl: "/templates/corporate-welcome.mp4", description: "Professional greeting display" },
  { id: "c2", name: "Meeting Room", industry: "Corporate", duration: "120s", resolution: "1920×1080", thumbnailUrl: "/templates/corporate-meeting.jpg", previewUrl: "/templates/corporate-meeting.mp4", description: "Room booking schedule" },
  { id: "c3", name: "Company News", industry: "Corporate", duration: "60s", resolution: "1920×1080", thumbnailUrl: "/templates/corporate-news.jpg", previewUrl: "/templates/corporate-news.mp4", description: "Internal updates" },
  { id: "c4", name: "KPI Dashboard", industry: "Corporate", duration: "45s", resolution: "1920×1080", thumbnailUrl: "/templates/corporate-kpi.jpg", previewUrl: "/templates/corporate-kpi.mp4", description: "Real-time metrics" },
  { id: "c5", name: "Employee Recognition", industry: "Corporate", duration: "50s", resolution: "1080×1920", thumbnailUrl: "/templates/corporate-recognition.jpg", previewUrl: "/templates/corporate-recognition.mp4", description: "Celebrate team wins" },
  
  // Education
  { id: "e1", name: "Campus Events", industry: "Education", duration: "60s", resolution: "1920×1080", thumbnailUrl: "/templates/education-events.jpg", previewUrl: "/templates/education-events.mp4", description: "Event calendar display" },
  { id: "e2", name: "Cafeteria Menu", industry: "Education", duration: "45s", resolution: "1920×1080", thumbnailUrl: "/templates/education-menu.jpg", previewUrl: "/templates/education-menu.mp4", description: "Daily meal options" },
  { id: "e3", name: "Announcements", industry: "Education", duration: "40s", resolution: "1920×1080", thumbnailUrl: "/templates/education-announce.jpg", previewUrl: "/templates/education-announce.mp4", description: "Important notices" },
  { id: "e4", name: "Class Schedule", industry: "Education", duration: "90s", resolution: "1080×1920", thumbnailUrl: "/templates/education-schedule.jpg", previewUrl: "/templates/education-schedule.mp4", description: "Room schedules" },
  { id: "e5", name: "Emergency Alert", industry: "Education", duration: "20s", resolution: "1920×1080", thumbnailUrl: "/templates/education-alert.jpg", previewUrl: "/templates/education-alert.mp4", description: "Safety notifications" },
  
  // Healthcare
  { id: "h1", name: "Waiting Room", industry: "Healthcare", duration: "120s", resolution: "1920×1080", thumbnailUrl: "/templates/healthcare-waiting.jpg", previewUrl: "/templates/healthcare-waiting.mp4", description: "Calming content loop" },
  { id: "h2", name: "Queue Status", industry: "Healthcare", duration: "15s", resolution: "1920×1080", thumbnailUrl: "/templates/healthcare-queue.jpg", previewUrl: "/templates/healthcare-queue.mp4", description: "Patient queue display" },
  { id: "h3", name: "Health Tips", industry: "Healthcare", duration: "45s", resolution: "1920×1080", thumbnailUrl: "/templates/healthcare-tips.jpg", previewUrl: "/templates/healthcare-tips.mp4", description: "Wellness information" },
  { id: "h4", name: "Services Directory", industry: "Healthcare", duration: "60s", resolution: "1080×1920", thumbnailUrl: "/templates/healthcare-directory.jpg", previewUrl: "/templates/healthcare-directory.mp4", description: "Department wayfinding" },
  { id: "h5", name: "Appointment Reminder", industry: "Healthcare", duration: "30s", resolution: "1920×1080", thumbnailUrl: "/templates/healthcare-reminder.jpg", previewUrl: "/templates/healthcare-reminder.mp4", description: "Check-in prompts" },
  
  // Transit
  { id: "t1", name: "Schedule Board", industry: "Transit", duration: "30s", resolution: "1920×1080", thumbnailUrl: "/templates/transit-schedule.jpg", previewUrl: "/templates/transit-schedule.mp4", description: "Live departure times" },
  { id: "t2", name: "Wayfinding", industry: "Transit", duration: "45s", resolution: "1080×1920", thumbnailUrl: "/templates/transit-wayfinding.jpg", previewUrl: "/templates/transit-wayfinding.mp4", description: "Directional signage" },
  { id: "t3", name: "Service Alerts", industry: "Transit", duration: "25s", resolution: "1920×1080", thumbnailUrl: "/templates/transit-alerts.jpg", previewUrl: "/templates/transit-alerts.mp4", description: "Delay notifications" },
  { id: "t4", name: "Route Map", industry: "Transit", duration: "90s", resolution: "1920×1080", thumbnailUrl: "/templates/transit-map.jpg", previewUrl: "/templates/transit-map.mp4", description: "Interactive route display" },
  { id: "t5", name: "Safety Reminders", industry: "Transit", duration: "35s", resolution: "1920×1080", thumbnailUrl: "/templates/transit-safety.jpg", previewUrl: "/templates/transit-safety.mp4", description: "Passenger safety info" },
  
  // Events
  { id: "ev1", name: "Event Welcome", industry: "Events", duration: "60s", resolution: "1920×1080", thumbnailUrl: "/templates/events-welcome.jpg", previewUrl: "/templates/events-welcome.mp4", description: "Conference greeting" },
  { id: "ev2", name: "Session Schedule", industry: "Events", duration: "90s", resolution: "1920×1080", thumbnailUrl: "/templates/events-schedule.jpg", previewUrl: "/templates/events-schedule.mp4", description: "Agenda display" },
  { id: "ev3", name: "Sponsor Showcase", industry: "Events", duration: "45s", resolution: "1920×1080", thumbnailUrl: "/templates/events-sponsors.jpg", previewUrl: "/templates/events-sponsors.mp4", description: "Sponsor recognition" },
  { id: "ev4", name: "Social Wall", industry: "Events", duration: "30s", resolution: "1080×1920", thumbnailUrl: "/templates/events-social.jpg", previewUrl: "/templates/events-social.mp4", description: "Live social feeds" },
  { id: "ev5", name: "Photo Booth", industry: "Events", duration: "20s", resolution: "1080×1920", thumbnailUrl: "/templates/events-booth.jpg", previewUrl: "/templates/events-booth.mp4", description: "Interactive photo display" },
];

const INDUSTRIES = ["All", "Retail", "Restaurants", "Corporate", "Education", "Healthcare", "Transit", "Events"];

export default function MediaPickerModal({
  isOpen,
  onClose,
  onMediaAdded,
  onTemplateSelected,
  showQuickStartHint = false,
}: MediaPickerModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"upload" | "template">("upload");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewingTemplate, setPreviewingTemplate] = useState<Template | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [existingPlaylists] = useState(["Default Playlist", "Promo Content", "Daily Specials"]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  // Analytics helper
  const emitAnalytics = (event: string, payload: Record<string, any>) => {
    console.log(`[Analytics] ${event}`, { userId: "demo-user", timestamp: new Date().toISOString(), ...payload });
  };

  useEffect(() => {
    if (isOpen) {
      emitAnalytics("media_modal_opened", { source: showQuickStartHint ? "dashboard_quickstart" : "dashboard" });
    }
  }, [isOpen, showQuickStartHint]);

  // File upload handlers
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    setUploadError("");
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "video/mp4"];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Unsupported file type.");
        return;
      }

      // Validate file size (200MB)
      if (file.size > 200 * 1024 * 1024) {
        setUploadError("File too large — max 200MB.");
        return;
      }

      const fileId = `file-${Date.now()}-${Math.random()}`;
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        status: "uploading",
        uploadProgress: 0,
        title: file.name.replace(/\.[^/.]+$/, ""),
      };

      newFiles.push(newFile);

      // Emit analytics
      emitAnalytics("media_upload_started", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadId: fileId,
      });

      // Simulate upload progress
      simulateUpload(fileId, file);
    });

    if (newFiles.length > 0) {
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const simulateUpload = (fileId: string, file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, uploadProgress: progress } : f
        )
      );

      emitAnalytics("media_upload_progress", { uploadId: fileId, percent: progress });

      if (progress >= 100) {
        clearInterval(interval);
        
        // Detect duration for videos
        if (file.type.startsWith("video/")) {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.onloadedmetadata = () => {
            const duration = Math.round(video.duration);
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? { ...f, status: "completed", duration, uploadProgress: 100 }
                  : f
              )
            );
            emitAnalytics("media_upload_completed", {
              uploadId: fileId,
              fileUrl: URL.createObjectURL(file),
              duration,
            });
          };
          video.src = URL.createObjectURL(file);
        } else {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, status: "completed", uploadProgress: 100 } : f
            )
          );
          emitAnalytics("media_upload_completed", { uploadId: fileId, fileUrl: URL.createObjectURL(file) });
        }

        toast({
          title: "Upload succeeded ✓",
          description: `${file.name} added.`,
          duration: 2000,
        });
      }
    }, 300);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== fileId));
    toast({
      title: "File removed",
      duration: 2000,
    });
  };

  const handleUpdateFileMetadata = (fileId: string, field: "title" | "altText", value: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, [field]: value } : f))
    );
  };

  // Template handlers
  const filteredTemplates = MOCK_TEMPLATES.filter((template) => {
    const matchesIndustry = selectedIndustry === "All" || template.industry === selectedIndustry;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  const handleTemplateClick = (template: Template) => {
    setPreviewingTemplate(template);
    setIsPreviewPlaying(true);
    emitAnalytics("template_viewed", { templateId: template.id, industry: template.industry });
  };

  const handleUseTemplate = (template: Template) => {
    emitAnalytics("template_selected", { templateId: template.id, usedWithCustomization: false });
    onTemplateSelected?.(template);
    toast({
      title: "Template applied ✓",
      description: "Open playlist editor to customize.",
      duration: 3000,
    });
    handleClose();
  };

  // Action handlers
  const handleCreatePlaylist = () => {
    const completedFiles = uploadedFiles.filter((f) => f.status === "completed");
    if (completedFiles.length === 0) {
      toast({
        title: "No files ready",
        description: "Wait for uploads to complete.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    emitAnalytics("assets_added_to_playlist", {
      playlistId: "new",
      assetIds: completedFiles.map((f) => f.id),
    });

    onMediaAdded?.(completedFiles);
    toast({
      title: "Playlist created ✓",
      description: `${completedFiles.length} files added.`,
      duration: 3000,
    });
    handleClose();
  };

  const handleAddToPlaylist = () => {
    const completedFiles = uploadedFiles.filter((f) => f.status === "completed");
    if (!selectedPlaylist || completedFiles.length === 0) return;

    emitAnalytics("assets_added_to_playlist", {
      playlistId: selectedPlaylist,
      assetIds: completedFiles.map((f) => f.id),
    });

    toast({
      title: "Added to playlist ✓",
      description: `${completedFiles.length} files added to ${selectedPlaylist}.`,
      duration: 3000,
    });
    handleClose();
  };

  const handleClose = () => {
    const hasUploading = uploadedFiles.some((f) => f.status === "uploading");
    if (hasUploading) {
      const confirmed = window.confirm("You have uploads in progress. Are you sure you want to cancel?");
      if (!confirmed) return;
    }

    emitAnalytics("modal_closed", {
      action: uploadedFiles.length > 0 ? "uploaded" : "cancel",
      itemsCount: uploadedFiles.length,
    });

    onClose();
  };

  const completedFilesCount = uploadedFiles.filter((f) => f.status === "completed").length;
  const totalSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0);
  const totalSizeGB = totalSize / (1024 * 1024 * 1024);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[1200px] h-[90vh] p-0 gap-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b p-6 pb-4">
          <div>
            <h2 className="text-2xl font-semibold">Add Media or Pick a Template</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your images & videos or choose a ready-made template to launch faster.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Start Hint */}
        {showQuickStartHint && (
          <Alert className="m-6 mb-0 border-primary bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription>
              <strong>Tip:</strong> Upload one asset to complete Step 2{" "}
              <button className="underline" onClick={handleCreatePlaylist}>
                proceed to publish
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "template")} className="flex flex-col flex-1 overflow-hidden">
          <TabsList className="mx-6 w-fit">
            <TabsTrigger value="upload">Upload Media</TabsTrigger>
            <TabsTrigger value="template">Choose Template</TabsTrigger>
          </TabsList>

          {/* Body */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="upload" className="h-full m-0 p-6 pt-4 data-[state=active]:flex">
              <div className="flex gap-6 w-full h-full">
                {/* Left: Upload Area (65%) */}
                <div className="flex-[65] flex flex-col gap-4">
                  <div
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer min-h-[300px]",
                      isDragging ? "border-primary bg-primary/5" : "border-border",
                      uploadError && "border-red-500"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("media-file-upload")?.click()}
                  >
                    <Upload className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Drag & drop files here</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse — supported: .jpg .png .gif .mp4 (max 200MB per file)
                    </p>
                    <Button variant="outline">Browse Files</Button>
                    <input
                      id="media-file-upload"
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.gif,.mp4"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <strong>Tip:</strong> For crisp display, use 1920×1080 for landscape or 1080×1920 for portrait.
                  </p>

                  {uploadError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{uploadError}</AlertDescription>
                    </Alert>
                  )}

                  {totalSizeGB > 1 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Large batch uploads may take longer; consider uploading overnight.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Right: Selected Assets (35%) */}
                <div className="flex-[35] flex flex-col border-l pl-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Selected assets</h3>
                    <Badge variant="secondary">{completedFilesCount} ready</Badge>
                  </div>

                  <ScrollArea className="flex-1 -mr-4 pr-4">
                    {uploadedFiles.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-12">
                        <ImageIcon className="h-12 w-12 mb-3 opacity-50" />
                        <p className="text-sm">No files yet</p>
                        <p className="text-xs">Drag files here or click Upload</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="rounded-lg border p-3 space-y-2">
                            {/* Thumbnail */}
                            <div className="flex gap-3">
                              <div className="relative h-16 w-16 shrink-0 rounded overflow-hidden bg-muted">
                                {file.type.startsWith("image/") ? (
                                  <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Video className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                                {file.status === "uploading" && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="text-white text-xs">{file.uploadProgress}%</div>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / (1024 * 1024)).toFixed(1)} MB · {file.type.split("/")[0]}
                                  {file.duration && ` · ${file.duration}s`}
                                </p>
                                {file.status === "uploading" && (
                                  <Progress value={file.uploadProgress} className="h-1 mt-1" />
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() => handleRemoveFile(file.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Metadata editing */}
                            {file.status === "completed" && (
                              <div className="space-y-2 pt-2 border-t">
                                <div className="space-y-1">
                                  <Label htmlFor={`title-${file.id}`} className="text-xs">
                                    Title
                                  </Label>
                                  {editingFileId === file.id ? (
                                    <div className="flex gap-1">
                                      <Input
                                        id={`title-${file.id}`}
                                        value={file.title || ""}
                                        onChange={(e) =>
                                          handleUpdateFileMetadata(file.id, "title", e.target.value)
                                        }
                                        className="h-7 text-xs"
                                        autoFocus
                                      />
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        onClick={() => setEditingFileId(null)}
                                      >
                                        <Check className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      <p className="text-xs flex-1 truncate">{file.title || file.name}</p>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => setEditingFileId(file.id)}
                                      >
                                        <Edit2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Quick Actions */}
                  {completedFilesCount > 0 && (
                    <div className="space-y-2 pt-4 border-t mt-4">
                      <Button className="w-full" onClick={handleCreatePlaylist}>
                        Create Playlist from Selected
                      </Button>
                      <div className="flex gap-2">
                        <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Add to existing..." />
                          </SelectTrigger>
                          <SelectContent>
                            {existingPlaylists.map((playlist) => (
                              <SelectItem key={playlist} value={playlist}>
                                {playlist}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          disabled={!selectedPlaylist}
                          onClick={handleAddToPlaylist}
                        >
                          Add
                        </Button>
                      </div>
                      <Button variant="outline" className="w-full gap-2">
                        <Monitor className="h-4 w-4" />
                        Preview Selected on Screen
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="template" className="h-full m-0 p-6 pt-4 data-[state=active]:flex">
              <div className="flex gap-6 w-full h-full">
                {/* Left: Template Grid (65%) */}
                <div className="flex-[65] flex flex-col gap-4">
                  {/* Industry Filter & Search */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {INDUSTRIES.map((industry) => (
                        <Badge
                          key={industry}
                          variant={selectedIndustry === industry ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedIndustry(industry)}
                        >
                          {industry}
                        </Badge>
                      ))}
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Template Grid */}
                  <ScrollArea className="flex-1 -mr-4 pr-4">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={cn(
                            "group relative rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md",
                            selectedTemplate?.id === template.id && "ring-2 ring-primary"
                          )}
                          onClick={() => handleTemplateClick(template)}
                        >
                          {/* Placeholder thumbnail */}
                          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Play className="h-12 w-12 text-primary/50" />
                          </div>

                          <div className="p-3 space-y-1">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {template.duration} · {template.resolution}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {template.description}
                            </p>
                          </div>

                          {/* Hover actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTemplateClick(template);
                              }}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUseTemplate(template);
                              }}
                            >
                              Use Template
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                        <Search className="h-12 w-12 mb-3 opacity-50" />
                        <p>No templates found</p>
                        <p className="text-xs">Try adjusting your filters</p>
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Right: Template Preview (35%) */}
                <div className="flex-[35] flex flex-col border-l pl-6">
                  <h3 className="font-semibold mb-4">Template preview</h3>

                  {previewingTemplate ? (
                    <div className="space-y-4">
                      {/* Preview player */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isPreviewPlaying ? (
                            <Pause className="h-16 w-16 text-primary/50" />
                          ) : (
                            <Play className="h-16 w-16 text-primary/50" />
                          )}
                        </div>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute bottom-3 right-3"
                          onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
                        >
                          {isPreviewPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Template info */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">{previewingTemplate.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {previewingTemplate.industry} · {previewingTemplate.duration} ·{" "}
                            {previewingTemplate.resolution}
                          </p>
                        </div>

                        <p className="text-sm">{previewingTemplate.description}</p>

                        <Separator />

                        <div className="space-y-2">
                          <Label className="text-xs">Try variant</Label>
                          <Select defaultValue="default">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="dark">Dark Theme</SelectItem>
                              <SelectItem value="light">Light Theme</SelectItem>
                              <SelectItem value="colorful">Colorful</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button className="w-full" onClick={() => handleUseTemplate(previewingTemplate)}>
                          Use This Template
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <Play className="h-12 w-12 mb-3 opacity-50" />
                      <p className="text-sm">Select a template to preview</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between border-t p-6 pt-4">
          <p className="text-xs text-muted-foreground max-w-md">
            Allowed formats: .jpg .png .gif .mp4. Max 200MB per file. Videos will be compressed
            automatically for web playback.
          </p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {activeTab === "upload" ? (
              <Button onClick={handleCreatePlaylist} disabled={completedFilesCount === 0}>
                Upload & Create Playlist
              </Button>
            ) : (
              <Button onClick={() => previewingTemplate && handleUseTemplate(previewingTemplate)} disabled={!previewingTemplate}>
                Use Template
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

