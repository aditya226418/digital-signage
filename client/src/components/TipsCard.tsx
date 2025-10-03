import { X, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TipsCardProps {
  onDismiss?: () => void;
}

export default function TipsCard({ onDismiss }: TipsCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="shrink-0 self-start rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-2">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-sm font-medium">Tips & Resources</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Learn best practices for managing your digital signage content effectively.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="link-video-tutorials"
                  onClick={() => console.log("Video tutorials clicked")}
                >
                  Video Tutorials
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="link-template-library"
                  onClick={() => console.log("Template library clicked")}
                >
                  Template Library
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            data-testid="button-dismiss-tips"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
