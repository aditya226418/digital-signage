import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeBannerProps {
  onUpgradeClick: () => void;
}

export default function UpgradeBanner({ onUpgradeClick }: UpgradeBannerProps) {
  return (
    <Card className="flex w-fit items-center gap-3 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 px-4 py-2">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0 text-primary" />
        <span className="whitespace-nowrap text-sm">
          <span className="font-medium">Free Trial</span>
        </span>
      </div>
      <Button
        onClick={onUpgradeClick}
        size="sm"
        className="group shrink-0"
        data-testid="button-upgrade"
      >
        Upgrade
        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
      </Button>
    </Card>
  );
}
