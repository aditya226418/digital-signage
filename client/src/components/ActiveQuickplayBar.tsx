import { X, Pause, Play, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePublishStore } from "@/hooks/usePublishStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ActiveQuickplayBar() {
  const {
    directPublishes,
    removeDirectPublish,
    pauseDirectPublish,
    resumeDirectPublish,
  } = usePublishStore();

  const activePublishes = directPublishes.filter((pub) => pub.status === "active");

  if (activePublishes.length === 0) return null;

  const handleCancel = (id: string, name: string) => {
    removeDirectPublish(id);
    toast.success("Quickplay cancelled", {
      description: `${name} has been stopped.`,
    });
  };

  const handlePause = (id: string, name: string) => {
    pauseDirectPublish(id);
    toast.info("Quickplay paused", {
      description: `${name} has been paused.`,
    });
  };

  const handleResume = (id: string, name: string) => {
    resumeDirectPublish(id);
    toast.success("Quickplay resumed", {
      description: `${name} is now playing again.`,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-2">
      <AnimatePresence>
        {activePublishes.map((publish) => {
          const progress = publish.remainingTime
            ? ((publish.duration - publish.remainingTime) / publish.duration) * 100
            : 0;

          return (
            <motion.div
              key={publish.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          Live
                        </Badge>
                        {publish.override && (
                          <Badge variant="secondary" className="text-xs">
                            Override
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm truncate">
                        {publish.contentName}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {publish.screenNames}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {publish.status === "active" ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handlePause(publish.id, publish.contentName)}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleResume(publish.id, publish.contentName)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleCancel(publish.id, publish.contentName)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={progress} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {publish.remainingTime} min remaining
                        </span>
                      </div>
                      <span>{publish.targetScreens.length} screens</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

