import ScreensOverviewCard from "../ScreensOverviewCard";

export default function ScreensOverviewCardExample() {
  const mockScreens = [
    { id: "1", name: "Lobby Display", status: "online" as const, lastSeen: "Active now" },
    { id: "2", name: "Conference Room A", status: "online" as const, lastSeen: "Active now" },
    { id: "3", name: "Cafeteria Screen", status: "offline" as const, lastSeen: "2 hours ago" },
  ];

  return (
    <div className="p-6">
      <ScreensOverviewCard
        screens={mockScreens}
        totalScreens={5}
        onlineCount={3}
        offlineCount={2}
      />
    </div>
  );
}
