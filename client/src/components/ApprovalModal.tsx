import { useState } from "react";
import { CheckCircle, XCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePublishStore } from "@/hooks/usePublishStore";
import { toast } from "sonner";
import { PlannedSchedule } from "@/lib/mockPublishData";

interface ApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: PlannedSchedule;
  mode: "submit" | "review";
  onSuccess?: () => void;
}

export default function ApprovalModal({
  open,
  onOpenChange,
  schedule,
  mode,
  onSuccess,
}: ApprovalModalProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitForApproval, approveRequest, rejectRequest, approvalRequests } = usePublishStore();

  const handleSubmitForApproval = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      submitForApproval(schedule);
      toast.success("Schedule submitted for approval", {
        description: "A reviewer will be notified to approve your schedule.",
      });
      setIsSubmitting(false);
      setComment("");
      onOpenChange(false);
      onSuccess?.();
    }, 500);
  };

  const handleApprove = () => {
    setIsSubmitting(true);
    const request = approvalRequests.find((req) => req.scheduleId === schedule.id);
    
    if (request) {
      setTimeout(() => {
        approveRequest(request.id, comment);
        toast.success("Schedule approved", {
          description: `${schedule.name} has been approved and will publish as scheduled.`,
        });
        setIsSubmitting(false);
        setComment("");
        onOpenChange(false);
        onSuccess?.();
      }, 500);
    }
  };

  const handleReject = () => {
    setIsSubmitting(true);
    const request = approvalRequests.find((req) => req.scheduleId === schedule.id);
    
    if (request) {
      setTimeout(() => {
        rejectRequest(request.id, comment);
        toast.error("Schedule rejected", {
          description: `${schedule.name} has been rejected. The requester will be notified.`,
        });
        setIsSubmitting(false);
        setComment("");
        onOpenChange(false);
        onSuccess?.();
      }, 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "submit" ? "Submit for Approval" : "Review Schedule"}
          </DialogTitle>
          <DialogDescription>
            {mode === "submit"
              ? "This schedule requires approval before it can be published. Add a comment for the reviewer."
              : "Review this schedule and approve or reject the publishing request."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Schedule Details</h4>
            <div className="rounded-lg border border-border/40 bg-muted/20 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{schedule.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Content:</span>
                <span className="font-medium">{schedule.contentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Screens:</span>
                <span className="font-medium">{schedule.targetScreens.length} screens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Schedule:</span>
                <span className="font-medium">{schedule.recurrence}</span>
              </div>
              {mode === "review" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested by:</span>
                  <span className="font-medium">{schedule.createdBy}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">
              {mode === "submit" ? "Comment (Optional)" : "Review Comment"}
            </Label>
            <Textarea
              id="comment"
              placeholder={
                mode === "submit"
                  ? "Add any notes for the reviewer..."
                  : "Provide feedback on this schedule..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          {mode === "submit" ? (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitForApproval}
                disabled={isSubmitting}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Submit for Approval
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isSubmitting}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

