import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Building2 } from "lucide-react";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const personalFeatures = [
    "Up to 10 screens",
    "Unlimited content uploads",
    "HD media playback",
    "Basic analytics & reports",
    "Email support",
  ];

  const enterpriseFeatures = [
    "Unlimited screens",
    "Unlimited content uploads",
    "4K media playback",
    "Advanced analytics & reports",
    "Priority 24/7 support",
    "Custom branding options",
    "API access",
    "Dedicated account manager",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-gradient-to-br from-background to-primary/5">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select the perfect plan for your digital signage needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="relative overflow-hidden border-2 bg-gradient-to-br from-card to-card/90 hover-elevate">
            <div className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Personal</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfect for small businesses
                </p>
              </div>

              <ul className="mb-6 space-y-3">
                {personalFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-chart-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                size="lg"
                data-testid="button-select-personal"
              >
                Get Started
              </Button>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-2 border-primary bg-gradient-to-br from-primary/5 to-card hover-elevate">
            <div className="absolute right-0 top-0 bg-gradient-to-br from-primary to-primary/80 px-3 py-1 text-xs font-semibold text-primary-foreground">
              POPULAR
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-2">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Enterprise</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  For growing teams and organizations
                </p>
              </div>

              <ul className="mb-6 space-y-3">
                {enterpriseFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-chart-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                size="lg"
                data-testid="button-select-enterprise"
              >
                Get Started
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-4 rounded-lg bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
