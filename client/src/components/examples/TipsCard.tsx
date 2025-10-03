import TipsCard from "../TipsCard";

export default function TipsCardExample() {
  return (
    <div className="p-6">
      <TipsCard onDismiss={() => console.log("Tips card dismissed")} />
    </div>
  );
}
