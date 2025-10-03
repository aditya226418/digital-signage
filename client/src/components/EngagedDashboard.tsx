import { useState } from "react";
import QuickActionsCard from "./QuickActionsCard";
import ScreensOverviewCard from "./ScreensOverviewCard";
import ContentOverviewCard from "./ContentOverviewCard";
import ReportsCard from "./ReportsCard";
import TipsCard from "./TipsCard";
import UpgradeBanner from "./UpgradeBanner";
import PricingModal from "./PricingModal";

interface Screen {
  id: string;
  name: string;
  status: "online" | "offline";
  lastSeen: string;
}

interface Playlist {
  id: string;
  name: string;
  itemCount: number;
}

interface EngagedDashboardProps {
  screens: Screen[];
  totalScreens: number;
  onlineCount: number;
  offlineCount: number;
  mediaCount: number;
  playlists: Playlist[];
  activeCampaigns: number;
  uptime: number;
  onAddScreen?: () => void;
  onUploadMedia?: () => void;
  onCreatePlaylist?: () => void;
}

export default function EngagedDashboard({
  screens,
  totalScreens,
  onlineCount,
  offlineCount,
  mediaCount,
  playlists,
  activeCampaigns,
  uptime,
  onAddScreen,
  onUploadMedia,
  onCreatePlaylist,
}: EngagedDashboardProps) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold" data-testid="text-dashboard-title">
            Welcome Brian
          </h1>
          <p className="text-base text-muted-foreground">
            Manage your digital signage screens and content
          </p>
        </div>

        <UpgradeBanner onUpgradeClick={() => setIsPricingModalOpen(true)} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <QuickActionsCard
              onAddScreen={onAddScreen}
              onUploadMedia={onUploadMedia}
              onCreatePlaylist={onCreatePlaylist}
            />
            <ReportsCard activeCampaigns={activeCampaigns} uptime={uptime} />
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ScreensOverviewCard
                screens={screens}
                totalScreens={totalScreens}
                onlineCount={onlineCount}
                offlineCount={offlineCount}
              />
              <ContentOverviewCard mediaCount={mediaCount} playlists={playlists} />
            </div>
            <div className="mt-6">
              <TipsCard />
            </div>
          </div>
        </div>
      </div>

      <PricingModal
        open={isPricingModalOpen}
        onOpenChange={setIsPricingModalOpen}
      />
    </div>
  );
}
