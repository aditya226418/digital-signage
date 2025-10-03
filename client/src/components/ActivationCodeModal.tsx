import { useState } from "react";
import { Monitor, Smartphone, Tv, Laptop } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ActivationCodeModalProps {
  open: boolean;
  onClose: () => void;
  screenType: string;
  onComplete: () => void;
}

const screenTypeInfo = {
  tv: {
    icon: Tv,
    name: "TV Display",
    hasApp: true,
  },
  tablet: {
    icon: Smartphone,
    name: "Tablet Display",
    hasApp: true,
  },
  monitor: {
    icon: Monitor,
    name: "Desktop Monitor",
    hasApp: false,
  },
  laptop: {
    icon: Laptop,
    name: "Laptop Screen",
    hasApp: true,
  },
};

export default function ActivationCodeModal({
  open,
  onClose,
  screenType,
  onComplete,
}: ActivationCodeModalProps) {
  const [code, setCode] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  const screenInfo = screenTypeInfo[screenType as keyof typeof screenTypeInfo];
  const Icon = screenInfo?.icon || Monitor;

  const handleActivate = () => {
    if (code.length < 6) return;
    
    setIsActivating(true);
    console.log("Activating screen with code:", code);
    
    setTimeout(() => {
      setIsActivating(false);
      onComplete();
    }, 1500);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setCode(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Activate Your {screenInfo?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="rounded-lg bg-muted p-4 text-center">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm font-medium">{screenInfo?.name}</p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-3 font-medium">Setup Instructions</h3>
            {screenInfo?.hasApp ? (
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">1.</span>
                  <span>Download and install the Pickcel Player app on your {screenType}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">2.</span>
                  <span>Open the Pickcel Player app on your device</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">3.</span>
                  <span>The app will display a unique activation code</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">4.</span>
                  <span>Enter that code below to connect your screen</span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">1.</span>
                  <span>On your desktop screen, open a web browser</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">2.</span>
                  <span>Go to <span className="font-mono font-semibold text-foreground">player.pickcel.com</span></span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">3.</span>
                  <span>The website will display a unique activation code</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-foreground">4.</span>
                  <span>Enter that code below to connect your screen</span>
                </li>
              </ol>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Enter Activation Code</h3>
            <Input
              placeholder="e.g., ABCD1234"
              value={code}
              onChange={handleCodeChange}
              className="font-mono text-lg"
              maxLength={12}
              data-testid="input-activation-code"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Enter the code displayed on your device
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleActivate} 
              className="flex-1" 
              disabled={code.length < 6 || isActivating}
              data-testid="button-activate-screen"
            >
              {isActivating ? "Activating..." : "Activate Screen"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
