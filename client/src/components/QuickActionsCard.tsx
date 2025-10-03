import { Monitor, Upload, ListVideo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsCardProps {
  onAddScreen?: () => void;
  onUploadMedia?: () => void;
  onCreatePlaylist?: () => void;
}

export default function QuickActionsCard({
  onAddScreen,
  onUploadMedia,
  onCreatePlaylist,
}: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full"
          onClick={onAddScreen}
          data-testid="button-add-screen"
        >
          <Monitor className="mr-2 h-4 w-4" />
          Add Screen
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onUploadMedia}
          data-testid="button-upload-media-action"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onCreatePlaylist}
          data-testid="button-create-playlist"
        >
          <ListVideo className="mr-2 h-4 w-4" />
          Create Playlist
        </Button>
      </CardContent>
    </Card>
  );
}
