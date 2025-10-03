import { Check } from "lucide-react";

interface Step {
  label: string;
  status: "completed" | "active" | "pending";
}

interface ProgressIndicatorProps {
  steps: Step[];
}

export default function ProgressIndicator({ steps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`
                flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-200
                ${
                  step.status === "completed"
                    ? "bg-chart-2 text-white"
                    : step.status === "active"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }
              `}
              data-testid={`step-indicator-${index + 1}`}
            >
              {step.status === "completed" ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={`
                text-sm transition-colors duration-200
                ${
                  step.status === "completed" || step.status === "active"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }
              `}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`
                mx-4 h-0.5 w-16 transition-colors duration-200
                ${
                  step.status === "completed"
                    ? "bg-chart-2"
                    : "bg-muted"
                }
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}
