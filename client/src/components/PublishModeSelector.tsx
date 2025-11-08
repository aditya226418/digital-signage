import { useState } from "react";
import { Zap, Calendar, Clock, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRoles } from "@/contexts/RolesContext";
import { motion } from "framer-motion";

interface PublishModeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectDirect: () => void;
  onSelectPlanned: (type: "simple" | "daySequence") => void;
}

export default function PublishModeSelector({
  open,
  onOpenChange,
  onSelectDirect,
  onSelectPlanned,
}: PublishModeSelectorProps) {
  const { orgLevelControls } = useRoles();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleSelectDirect = () => {
    onSelectDirect();
    onOpenChange(false);
  };

  const handleSelectSimple = () => {
    onSelectPlanned("simple");
    onOpenChange(false);
  };

  const handleSelectDaySequence = () => {
    onSelectPlanned("daySequence");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Start Publishing</DialogTitle>
          <DialogDescription>
            Choose how you want to publish your content to screens
          </DialogDescription>
        </DialogHeader>

        {orgLevelControls && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-3 text-sm"
          >
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="text-blue-900 dark:text-blue-100">
              <strong>Organizational controls active</strong> — Approvals and permissions apply
            </p>
          </motion.div>
        )}

        <div className="grid gap-4 py-4 sm:grid-cols-3">
          {/* Direct Publishing Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard("direct")}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                hoveredCard === "direct"
                  ? "border-primary shadow-lg"
                  : "border-border/40 hover:border-primary/50"
              }`}
              onClick={handleSelectDirect}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${
                      hoveredCard === "direct"
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Zap className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Instant
                  </Badge>
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-xl">Now (Direct- Play)</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Show something immediately. Push content to screens right now with quick
                    configuration options.
                  </CardDescription>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Best for:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Emergency announcements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Quick updates & messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Testing content on screens</span>
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full gap-2 transition-all duration-200"
                  variant={hoveredCard === "direct" ? "default" : "outline"}
                >
                  <Zap className="h-4 w-4" />
                  Continue with Direct
                </Button>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Simple Schedule Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard("simple")}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                hoveredCard === "simple"
                  ? "border-primary shadow-lg"
                  : "border-border/40 hover:border-primary/50"
              }`}
              onClick={handleSelectSimple}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${
                      hoveredCard === "simple"
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Calendar className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Scheduled
                  </Badge>
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-xl">Schedule</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Schedule single or multiple compositions with start/end times and recurrence. 
                  </CardDescription>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Best for:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>One-time future events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Daily/weekly/monthly campaigns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Single or playlist content</span>
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full gap-2 transition-all duration-200"
                  variant={hoveredCard === "simple" ? "default" : "outline"}
                >
                  <Calendar className="h-4 w-4" />
                  Continue with Schedule
                </Button>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Day Sequence Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredCard("daySequence")}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                hoveredCard === "daySequence"
                  ? "border-primary shadow-lg"
                  : "border-border/40 hover:border-primary/50"
              }`}
              onClick={handleSelectDaySequence}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${
                      hoveredCard === "daySequence"
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Clock className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Advanced
                  </Badge>
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-xl">Day Sequence</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Create a 24-hour timeline with different content at specific times throughout the day.
                  </CardDescription>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Best for:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Time-based schedules</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Daily content rotation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Multiple content slots</span>
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full gap-2 transition-all duration-200"
                  variant={hoveredCard === "daySequence" ? "default" : "outline"}
                >
                  <Clock className="h-4 w-4" />
                  Continue with Day Sequence
                </Button>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

