import ContentOverviewCard from "../ContentOverviewCard";

export default function ContentOverviewCardExample() {
  const mockPlaylists = [
    { id: "1", name: "Product Showcase", itemCount: 8 },
    { id: "2", name: "Company News", itemCount: 5 },
    { id: "3", name: "Promotional Content", itemCount: 12 },
  ];

  return (
    <div className="p-6">
      <ContentOverviewCard mediaCount={24} playlists={mockPlaylists} />
    </div>
  );
}
