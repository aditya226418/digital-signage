import { CheckCircle2, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface PlanConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  deviceCount: number;
  billingFrequency: "monthly" | "yearly";
  totalPrice: number;
}

export default function PlanConfirmationModal({
  isOpen,
  onClose,
  planName,
  deviceCount,
  billingFrequency,
  totalPrice,
}: PlanConfirmationModalProps) {
  const { toast } = useToast();

  const handleConfirm = () => {
    // Analytics: Track confirmation event
    // event('confirmation_confirmed', {
    //   plan: planName,
    //   screens: deviceCount,
    //   billingCycle: billingFrequency,
    //   price: totalPrice,
    //   currency: 'USD'
    // });

    // Placeholder for Stripe checkout integration
    toast({
      title: "Redirecting to checkout...",
      description: "You will be redirected to Stripe to complete your purchase.",
      duration: 3000,
    });

    // In production, this would redirect to Stripe checkout
    // Example: window.location.href = `/api/checkout?plan=${planName}&screens=${deviceCount}&billing=${billingFrequency}`
    // Or: stripeCheckout.redirectToCheckout({ sessionId: checkoutSessionId })
    console.log("Redirecting to Stripe with:", {
      planName,
      deviceCount,
      billingFrequency,
      totalPrice,
    });

    // Close modal after short delay
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="h-5 w-5 text-primary" />
            Confirm Your Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Summary Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="font-semibold">{planName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Number of Screens</span>
              <span className="font-semibold">{deviceCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Billing Frequency</span>
              <span className="font-semibold capitalize">{billingFrequency}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  US${totalPrice.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  per {billingFrequency === "monthly" ? "month" : "year"}
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <p className="text-sm font-medium">What happens next?</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                You'll be redirected to Stripe for secure payment
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                Your plan will be activated immediately after payment
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                You can change or cancel your plan anytime
              </li>
            </ul>
          </div>

          {/* Billing Info */}
          <div className="rounded-lg bg-muted/30 p-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing starts</span>
              <span className="font-medium">After 14-day trial</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trial credit</span>
              <span className="font-medium text-primary">Applied</span>
            </div>
          </div>

          {/* Reassurance Text */}
          <p className="text-xs text-center text-muted-foreground">
            By confirming you will be redirected to our secure payment provider. You can change or
            cancel anytime.
          </p>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Go Back
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            Confirm and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

