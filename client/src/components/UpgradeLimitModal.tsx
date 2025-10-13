import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
  Star,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface UpgradeLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const professionalBenefits = [
  { icon: Users, text: "Manage unlimited screens" },
  { icon: Sparkles, text: "100+ premium templates" },
  { icon: Zap, text: "Advanced scheduling & automation" },
  { icon: BarChart3, text: "Detailed analytics & reports" },
  { icon: CheckCircle2, text: "Priority email support" },
  { icon: Star, text: "60+ content app integrations" },
];

export default function UpgradeLimitModal({ isOpen, onClose }: UpgradeLimitModalProps) {
  const handleUpgrade = () => {
    onClose();
    // In production, this would navigate to My Plan page
    // For now, we'll use window.location to navigate
    window.location.hash = "#myplan";
    console.log("Navigate to My Plan page");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 shrink-0">
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl mb-1">Screen Limit Reached</DialogTitle>
              <DialogDescription className="text-sm">
                You've reached the maximum of <strong>1 screen</strong> on your trial plan
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Professional Plan Benefits */}
        <div className="space-y-3">
          <h3 className="font-semibold text-base text-center">Unlock Professional Features</h3>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5"
          >
            {professionalBenefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed">{benefit.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <Separator className="my-4" />

        {/* Growth Stats Section */}
        <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-lg p-4 border border-primary/20">
          <div className="text-center mb-3">
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-base">Scale Your Presence</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Pro users see real growth
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-3 rounded-lg bg-background/60"
            >
              <div className="text-3xl font-bold text-primary mb-0.5">47%</div>
              <div className="text-xs text-muted-foreground">Revenue Growth</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-3 rounded-lg bg-background/60"
            >
              <div className="text-3xl font-bold text-primary mb-0.5">3.2x</div>
              <div className="text-xs text-muted-foreground">Customer Engagement</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-3 rounded-lg bg-background/60"
            >
              <div className="text-3xl font-bold text-primary mb-0.5">92%</div>
              <div className="text-xs text-muted-foreground">Satisfaction Rate</div>
            </motion.div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
        <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Maybe Later
          </Button>
          <Button
            size="lg"
            className="flex-1 gap-2"
            onClick={handleUpgrade}
          >
            <Sparkles className="h-4 w-4" />
            Upgrade Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Footer */}
        <div className="space-y-2 pt-2">
          <p className="text-xs text-center text-muted-foreground">
            Start with Professional from just <strong>$15/screen/month</strong> • Cancel anytime
          </p>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-muted-foreground/60 text-muted-foreground/60" />
              <span>4.8/5 G2</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-muted-foreground/60 text-muted-foreground/60" />
              <span>4.7/5 Capterra</span>
            </div>
            <span>•</span>
            <span>1,200+ businesses</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

