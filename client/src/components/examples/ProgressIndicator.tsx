import ProgressIndicator from "../ProgressIndicator";

export default function ProgressIndicatorExample() {
  const steps = [
    { label: "Add Screen", status: "active" as const },
    { label: "Add Content", status: "pending" as const },
    { label: "Publish", status: "pending" as const },
  ];

  return <ProgressIndicator steps={steps} />;
}
