import QuickActionsCard from "../QuickActionsCard";

export default function QuickActionsCardExample() {
  return (
    <div className="p-6">
      <QuickActionsCard
        onAddScreen={() => console.log("Add screen")}
        onUploadMedia={() => console.log("Upload media")}
        onCreatePlaylist={() => console.log("Create playlist")}
      />
    </div>
  );
}
