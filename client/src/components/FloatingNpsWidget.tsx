import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNps } from "@/hooks/useNpsStore";
import NpsReviewDialog from "./NpsReviewDialog";
import { toast } from "sonner";

type WidgetState = "initial" | "comment" | "done";

export default function FloatingNpsWidget() {
  const { showWidget, hideNpsWidget } = useNps();
  const [state, setState] = useState<WidgetState>("initial");
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Reset state when widget is shown
  useEffect(() => {
    if (showWidget) {
      setState("initial");
      setScore(null);
      setComment("");
      setShowReviewDialog(false);
    }
  }, [showWidget]);

  // Auto-dismiss after 3 seconds in done state (for scores ≤7)
  useEffect(() => {
    if (state === "done" && score !== null && score <= 7) {
      const timer = setTimeout(() => {
        hideNpsWidget();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, score, hideNpsWidget]);

  const handleScoreSelect = (selectedScore: number) => {
    setScore(selectedScore);
    setState("comment");
  };

  const handleSubmit = () => {
    if (score === null) return;

    // For high scores (8-10), show review dialog
    if (score >= 8) {
      setShowReviewDialog(true);
      setState("done");
    } else {
      // For low scores, just show done state
      setState("done");
    }
  };

  const handleSkip = () => {
    if (score === null) return;

    // For high scores (8-10), show review dialog even if skipped
    if (score >= 8) {
      setShowReviewDialog(true);
      setState("done");
    } else {
      setState("done");
    }
  };

  if (!showWidget) return null;

  return (
    <>
      <AnimatePresence>
        {showWidget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="w-[620px] p-6 shadow-lg rounded-xl bg-background border">
              {/* Initial state - Score selection */}
              {state === "initial" && (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-base  flex-1">
                      How likely are you to recommend Pickcel?
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={hideNpsWidget}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ">
                    0 = Not at all likely, 10 = Extremely likely
                  </p>
                  <div className="grid grid-cols-11 gap-2">
                    {Array.from({ length: 11 }, (_, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0 text-base font-medium"
                        onClick={() => handleScoreSelect(i)}
                      >
                        {i}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment state */}
              {state === "comment" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-base mb-2 flex-1">
                      {score !== null && score <= 7
                        ? "What can we improve?"
                        : "What did you like about Pickcel?"}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={hideNpsWidget}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    className="h-32 text-base"
                    placeholder="Your feedback helps us improve..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={handleSkip}
                      className="flex-1 text-base"
                    >
                      Skip
                    </Button>
                    <Button
                      size="default"
                      onClick={handleSubmit}
                      className="flex-1 text-base"
                    >
                      Submit
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Done state */}
              {state === "done" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <p className="text-base font-medium flex-1 text-center">Thanks for your feedback!</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={hideNpsWidget}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <NpsReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
      />
    </>
  );
}

