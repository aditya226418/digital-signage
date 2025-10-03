import EngagedDashboard from "../EngagedDashboard";

export default function EngagedDashboardExample() {
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
    <EngagedDashboard
      screens={mockScreens}
      totalScreens={5}
      onlineCount={3}
      offlineCount={2}
      mediaCount={24}
      playlists={mockPlaylists}
      activeCampaigns={8}
      uptime={98.5}
      onAddScreen={() => console.log("Add screen")}
      onUploadMedia={() => console.log("Upload media")}
      onCreatePlaylist={() => console.log("Create playlist")}
    />
  );
}
