import OnboardingDashboard from "../OnboardingDashboard";

export default function OnboardingDashboardExample() {
  return (
    <OnboardingDashboard
      currentStep={1}
      onAddScreen={() => console.log("Add screen clicked")}
    />
  );
}
