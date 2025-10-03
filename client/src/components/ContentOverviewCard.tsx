import { Image, ListVideo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Playlist {
  id: string;
  name: string;
  itemCount: number;
}

interface ContentOverviewCardProps {
  mediaCount: number;
  playlists: Playlist[];
}

export default function ContentOverviewCard({
  mediaCount,
  playlists,
}: ContentOverviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
        <CardTitle>Content Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-3">
              <Image className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-semibold" data-testid="text-media-count">
                {mediaCount}
              </div>
              <div className="text-sm text-muted-foreground">Media Files</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Recent Playlists</div>
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-200 hover-elevate"
              data-testid={`playlist-item-${playlist.id}`}
            >
              <div className="flex items-center gap-3">
                <ListVideo className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="cursor-pointer text-sm font-medium hover:underline">{playlist.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {playlist.itemCount} items
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
