import { Monitor, Upload, ListVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProgressIndicator from "./ProgressIndicator";

interface OnboardingDashboardProps {
  onAddScreen?: () => void;
  onUploadMedia?: () => void;
  onTryTemplate?: () => void;
}

export default function OnboardingDashboard({
  onAddScreen,
  onUploadMedia,
  onTryTemplate,
}: OnboardingDashboardProps) {
  const steps = [
    { label: "Add Screen", status: "active" as const },
    { label: "Add Content", status: "pending" as const },
    { label: "Publish", status: "pending" as const },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-2xl p-12">
        <div className="mb-8">
          <ProgressIndicator steps={steps} />
        </div>

        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Monitor className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="mb-3 text-2xl font-semibold" data-testid="text-welcome-title">
            Welcome to Pickcel!
          </h1>
          <p className="text-base text-muted-foreground">
            Let's set up your first screen and start displaying content in minutes.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full text-base"
            onClick={onAddScreen}
            data-testid="button-add-first-screen"
          >
            <Monitor className="mr-2 h-5 w-5" />
            Add Your First Screen
          </Button>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              onClick={onUploadMedia}
              data-testid="button-upload-media"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
            <Button
              variant="outline"
              onClick={onTryTemplate}
              data-testid="button-try-template"
            >
              <ListVideo className="mr-2 h-4 w-4" />
              Try a Template Playlist
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <a href="#" className="text-primary hover-elevate">
              View Quick Start Guide
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
