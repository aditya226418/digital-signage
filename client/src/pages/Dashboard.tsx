import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnboardingDashboard from "@/components/OnboardingDashboard";
import EngagedDashboard from "@/components/EngagedDashboard";

export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  
  // Toggle between onboarding and engaged state for demo
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
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

  const handleAddScreen = () => {
    console.log("Add screen action triggered");
    // Simulate adding a screen and transitioning to engaged state
    setIsFirstTimeUser(false);
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed right-6 top-6 z-50 flex gap-2">
        {/* Demo toggle button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFirstTimeUser(!isFirstTimeUser)}
          data-testid="button-toggle-state"
        >
          {isFirstTimeUser ? "Show Engaged View" : "Show Onboarding"}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {isFirstTimeUser ? (
        <OnboardingDashboard
          onAddScreen={handleAddScreen}
          onUploadMedia={() => console.log("Upload media")}
          onTryTemplate={() => console.log("Try template")}
        />
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
