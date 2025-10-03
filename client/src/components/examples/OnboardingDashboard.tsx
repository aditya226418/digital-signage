import OnboardingDashboard from "../OnboardingDashboard";

export default function OnboardingDashboardExample() {
  return (
    <OnboardingDashboard
      onAddScreen={() => console.log("Add screen clicked")}
      onUploadMedia={() => console.log("Upload media clicked")}
      onTryTemplate={() => console.log("Try template clicked")}
    />
  );
}
