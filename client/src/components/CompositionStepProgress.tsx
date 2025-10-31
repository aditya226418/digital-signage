import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

interface CompositionStepProgressProps {
  currentStep: number;
}

const steps: Step[] = [
  { number: 1, title: "Choose Layout" },
  { number: 2, title: "Add Media" },
  { number: 3, title: "Preview & Save" },
];

export default function CompositionStepProgress({
  currentStep,
}: CompositionStepProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-2">
          {/* Step Circle */}
          <motion.div
            initial={false}
            animate={{
              scale: currentStep === step.number ? 1.05 : 1,
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`
              relative flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
              ${
                currentStep > step.number
                  ? "bg-primary text-primary-foreground"
                  : currentStep === step.number
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-200 text-neutral-500"
              }
            `}
          >
            {currentStep > step.number ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <span>{step.number}</span>
            )}
          </motion.div>

          {/* Step Title - hidden on mobile */}
          <span
            className={`text-sm font-medium hidden sm:inline ${
              currentStep >= step.number
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {step.title}
          </span>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="w-8 sm:w-12 h-[2px] bg-neutral-200 relative overflow-hidden mx-1">
              <motion.div
                initial={false}
                animate={{
                  width: currentStep > step.number ? "100%" : "0%",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 bg-primary"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

