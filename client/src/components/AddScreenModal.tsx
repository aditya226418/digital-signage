import { Monitor, Tv, Smartphone, Laptop } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface ScreenOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface AddScreenModalProps {
  open: boolean;
  onClose: () => void;
  onSelectOption: (optionId: string) => void;
}

const screenOptions: ScreenOption[] = [
  {
    id: "tv",
    name: "TV Display",
    icon: <Tv className="h-8 w-8" />,
    description: "Perfect for large screens in lobbies, reception areas, and public spaces",
  },
  {
    id: "tablet",
    name: "Tablet Display",
    icon: <Smartphone className="h-8 w-8" />,
    description: "Ideal for interactive kiosks, wayfinding, and visitor check-ins",
  },
  {
    id: "monitor",
    name: "Desktop Monitor",
    icon: <Monitor className="h-8 w-8" />,
    description: "Great for office displays, meeting rooms, and workstations",
  },
  {
    id: "laptop",
    name: "Laptop Screen",
    icon: <Laptop className="h-8 w-8" />,
    description: "Use any laptop as a digital signage display",
  },
];

export default function AddScreenModal({ open, onClose, onSelectOption }: AddScreenModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose Your Screen Type</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {screenOptions.map((option) => (
            <Card
              key={option.id}
              className="cursor-pointer p-6 transition-all duration-200 hover-elevate active-elevate-2"
              onClick={() => onSelectOption(option.id)}
              data-testid={`screen-option-${option.id}`}
            >
              <div className="mb-4 flex justify-center text-primary">
                {option.icon}
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold">{option.name}</h3>
              <p className="text-center text-sm text-muted-foreground">
                {option.description}
              </p>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
