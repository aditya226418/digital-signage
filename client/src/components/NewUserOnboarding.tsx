import { Check, Monitor, Upload, Send, RotateCcw, Clock, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewUserOnboardingProps {
  currentStep?: number;
  onAddScreen?: () => void;
  onUploadContent?: () => void;
  onPublish?: () => void;
  onReset?: () => void;
}

const steps = [
  {
    id: 1,
    title: "Connect Your Display",
    description: "Turn any TV or display into a smart communication screen. Get your activation code and connect in seconds.",
    icon: Monitor,
    action: "Connect Display",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconBg: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Add Your Content",
    description: "Upload eye-catching images, videos, or use our templates to create engaging content for your screen.",
    icon: Upload,
    action: "Add Content",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconBg: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Go Live!",
    description: "Your screen is ready! Push your content live and start captivating your audience instantly.",
    icon: Send,
    action: "Go Live",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconBg: "from-green-500 to-emerald-500",
  },
];

export default function NewUserOnboarding({
  currentStep = 0,
  onAddScreen,
  onUploadContent,
  onPublish,
  onReset,
}: NewUserOnboardingProps) {
  const handleAction = (stepId: number) => {
    switch (stepId) {
      case 1:
        onAddScreen?.();
        break;
      case 2:
        onUploadContent?.();
        break;
      case 3:
        onPublish?.();
        break;
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent-foreground bg-clip-text text-transparent">
                Deploy Your First Screen in 3 Steps
              </h2>
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Clock className="h-3.5 w-3.5" />
                <span>~3 min</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <p className="text-sm text-muted-foreground">
                Transform any display into a smart communication screen in minutes
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2.5 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 transition-all duration-200 group -ml-1"
                onClick={() => {
                  // TODO: Add video modal or link
                  console.log('Watch tutorial video');
                }}
              >
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Play className="size-2 text-primary fill-primary" />
                </div>
                <span>Watch Tutorial</span>
              </Button>
            </div>
          </div>
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2 shrink-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset Flow</span>
            </Button>
          )}
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary via-purple-500 to-green-500 transition-all duration-500"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <Card
              key={step.id}
              className={cn(
                "group relative overflow-hidden border-border/40 transition-all duration-300",
                isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                isCompleted && "border-green-500/50",
                "hover:shadow-lg hover:scale-[1.02]"
              )}
            >
              {/* Background Gradient */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-300",
                  step.gradient,
                  "group-hover:opacity-70"
                )}
              />

              {/* Completion Badge */}
              {isCompleted && (
                <div className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-lg">
                  <Check className="h-5 w-5 text-white" />
                </div>
              )}

              {/* Content */}
              <div className="relative p-6">
                {/* Step Number & Icon */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-300",
                        step.iconBg,
                        "group-hover:scale-110"
                      )}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Step {step.id}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleAction(step.id)}
                  disabled={isCompleted}
                  variant={isCurrent ? "default" : "outline"}
                  className={cn(
                    "w-full transition-all duration-300",
                    isCompleted && "bg-green-500 hover:bg-green-600",
                    "group-hover:shadow-md"
                  )}
                >
                  {isCompleted ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    step.action
                  )}
                </Button>
              </div>

              {/* Connecting Line (except for last step) */}
              {index < steps.length - 1 && (
                <div className="absolute -right-6 top-1/2 hidden h-0.5 w-12 -translate-y-1/2 md:block">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      isCompleted ? "bg-green-500" : "bg-border"
                    )}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Completion Message */}
      {currentStep === 3 && (
        <div className="mt-6 rounded-lg border border-green-500/40 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2 text-green-700 dark:text-green-400">
              🎉 You're Live!
            </p>
            <p className="text-sm text-green-700/80 dark:text-green-400/80">
              Congratulations! Your screen is now active and captivating your audience. Explore the dashboard to manage your content, add more screens, and unlock the full power of digital signage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
