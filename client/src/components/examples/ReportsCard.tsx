import ReportsCard from "../ReportsCard";

export default function ReportsCardExample() {
  return (
    <div className="p-6">
      <ReportsCard activeCampaigns={8} uptime={98.5} />
    </div>
  );
}
