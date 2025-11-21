import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NpsReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NpsReviewDialog({
  open,
  onOpenChange,
}: NpsReviewDialogProps) {
  const handleG2Click = () => {
    window.open("https://www.g2.com/products/pickcel/reviews", "_blank");
    toast.success("Thank you! Your $75 gift card will be emailed soon.");
    onOpenChange(false);
  };

  const handleCapterraClick = () => {
    window.open("https://www.capterra.com/p/123456/Pickcel/", "_blank");
    toast.success("Thank you! Your $75 gift card will be emailed soon.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Enjoying Pickcel? Share a review and get a $75 gift card!
          </DialogTitle>
          <DialogDescription className="pt-2">
            <p className="mb-4">
              If you leave us a review on G2 or Capterra, we'll send you a $75
              gift card via email once it's verified.
            </p>
            <p className="text-xs text-muted-foreground">
              Gift cards delivered within 24 hours after verification.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Button onClick={handleG2Click} className="w-full">
            Review on G2
          </Button>
          <Button onClick={handleCapterraClick} variant="outline" className="w-full">
            Review on Capterra
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

