import { useState } from "react";
import { Sparkles, BarChart3 } from "lucide-react";
import QuickActionsCard from "./QuickActionsCard";
import ScreensOverviewCard from "./ScreensOverviewCard";
import ContentOverviewCard from "./ContentOverviewCard";
import ReportsCard from "./ReportsCard";
import TipsCard from "./TipsCard";
import UpgradeBanner from "./UpgradeBanner";
import PricingModal from "./PricingModal";
import NewUserOnboarding from "./NewUserOnboarding";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface DashboardContentProps {
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

export default function DashboardContent({
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
}: DashboardContentProps) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [showNewUserView, setShowNewUserView] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const handleOnboardingAction = (step: number) => {
    setOnboardingStep(step);
    // Trigger the appropriate action
    if (step === 1) onAddScreen?.();
    if (step === 2) onUploadMedia?.();
    if (step === 3) onCreatePlaylist?.();
  };

  return (
    <>
      {/* View Toggle */}
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-card p-1 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewUserView(false)}
            className={cn(
              "gap-2 transition-all duration-200",
              !showNewUserView && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewUserView(true)}
            className={cn(
              "gap-2 transition-all duration-200",
              showNewUserView && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Getting Started</span>
          </Button>
        </div>
      </div>

      {/* Conditional Content */}
      <div className="mt-6">
        {showNewUserView ? (
          <NewUserOnboarding
            currentStep={onboardingStep}
            onAddScreen={() => handleOnboardingAction(1)}
            onUploadContent={() => handleOnboardingAction(2)}
            onPublish={() => handleOnboardingAction(3)}
            onReset={() => setOnboardingStep(0)}
          />
        ) : (
          <>
            <UpgradeBanner onUpgradeClick={() => setIsPricingModalOpen(true)} />
            
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
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
          </>
        )}
      </div>

      <PricingModal
        open={isPricingModalOpen}
        onOpenChange={setIsPricingModalOpen}
      />
    </>
  );
}

