import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeBannerProps {
  onUpgradeClick: () => void;
}

export default function UpgradeBanner({ onUpgradeClick }: UpgradeBannerProps) {
  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold">You're using the Free Trial</h3>
            <p className="text-sm text-muted-foreground">
              Upgrade to deploy more screens and unlock premium features
            </p>
          </div>
        </div>
        <Button
          onClick={onUpgradeClick}
          className="group whitespace-nowrap"
          data-testid="button-upgrade"
        >
          Upgrade Now
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </Card>
  );
}
