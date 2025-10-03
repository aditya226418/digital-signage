import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnboardingDashboard from "@/components/OnboardingDashboard";
import AddScreenModal from "@/components/AddScreenModal";
import ActivationCodeModal from "@/components/ActivationCodeModal";
import ContentStep from "@/components/ContentStep";
import PublishStep from "@/components/PublishStep";
import EngagedDashboard from "@/components/EngagedDashboard";

export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAddScreenModal, setShowAddScreenModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [selectedScreenType, setSelectedScreenType] = useState("");
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleAddScreenClick = () => {
    setShowAddScreenModal(true);
  };

  const handleScreenTypeSelect = (screenType: string) => {
    setSelectedScreenType(screenType);
    setShowAddScreenModal(false);
    setShowActivationModal(true);
  };

  const handleScreenConnected = () => {
    setShowActivationModal(false);
    setCurrentStep(2);
  };

  const handleContentComplete = () => {
    setCurrentStep(3);
  };

  const handlePublishComplete = () => {
    setOnboardingComplete(true);
  };

  // Mock data for engaged dashboard
  const mockScreens = [
    { id: "1", name: "Lobby Display", status: "online" as const, lastSeen: "Active now" },
    { id: "2", name: "Conference Room A", status: "online" as const, lastSeen: "Active now" },
    { id: "3", name: "Cafeteria Screen", status: "offline" as const, lastSeen: "2 hours ago" },
    { id: "4", name: "Reception Area", status: "online" as const, lastSeen: "Active now" },
    { id: "5", name: "Training Room", status: "offline" as const, lastSeen: "1 day ago" },
  ];

  const mockPlaylists = [
    { id: "1", name: "Product Showcase", itemCount: 8 },
    { id: "2", name: "Company News", itemCount: 5 },
    { id: "3", name: "Promotional Content", itemCount: 12 },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="fixed right-6 top-6 z-50 flex gap-2">
        {onboardingComplete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOnboardingComplete(false);
              setCurrentStep(1);
            }}
            data-testid="button-reset-onboarding"
          >
            Reset Onboarding
          </Button>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {!onboardingComplete ? (
        <>
          {currentStep === 1 && (
            <OnboardingDashboard
              currentStep={currentStep}
              onAddScreen={handleAddScreenClick}
            />
          )}
          
          {currentStep === 2 && <ContentStep onComplete={handleContentComplete} />}
          
          {currentStep === 3 && <PublishStep onComplete={handlePublishComplete} />}

          <AddScreenModal
            open={showAddScreenModal}
            onClose={() => setShowAddScreenModal(false)}
            onSelectOption={handleScreenTypeSelect}
          />

          <ActivationCodeModal
            open={showActivationModal}
            onClose={() => setShowActivationModal(false)}
            screenType={selectedScreenType}
            onComplete={handleScreenConnected}
          />
        </>
      ) : (
        <EngagedDashboard
          screens={mockScreens}
          totalScreens={5}
          onlineCount={3}
          offlineCount={2}
          mediaCount={24}
          playlists={mockPlaylists}
          activeCampaigns={8}
          uptime={98.5}
          onAddScreen={() => console.log("Add another screen")}
          onUploadMedia={() => console.log("Upload media")}
          onCreatePlaylist={() => console.log("Create playlist")}
        />
      )}
    </div>
  );
}
