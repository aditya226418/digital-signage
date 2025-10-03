import { useState } from "react";
import { Copy, Check, Monitor } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ActivationCodeModalProps {
  open: boolean;
  onClose: () => void;
  screenType: string;
  onComplete: () => void;
}

export default function ActivationCodeModal({
  open,
  onClose,
  screenType,
  onComplete,
}: ActivationCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const activationCode = `PKCL-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Activate Your Screen</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="rounded-lg bg-muted p-4 text-center">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {screenType.charAt(0).toUpperCase() + screenType.slice(1)} Display
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Activation Code</h3>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg border border-border bg-card p-4 font-mono text-lg font-semibold">
                {activationCode}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                data-testid="button-copy-code"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-3 font-medium">Setup Instructions</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">1.</span>
                <span>Download the Pickcel Player app on your device</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">2.</span>
                <span>Open the app and click "Add New Screen"</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">3.</span>
                <span>Enter the activation code shown above</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">4.</span>
                <span>Your screen will connect automatically</span>
              </li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onComplete} className="flex-1" data-testid="button-screen-connected">
              Screen Connected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
