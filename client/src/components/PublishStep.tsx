import { useState } from "react";
import { Play, Radio, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PublishStepProps {
  onComplete: () => void;
}

export default function PublishStep({ onComplete }: PublishStepProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const publishOptions = [
    {
      id: "quick-10",
      icon: <Clock className="h-6 w-6" />,
      title: "Quick Play - 10 Minutes",
      description: "Test your content for the next 10 minutes",
    },
    {
      id: "quick-30",
      icon: <Clock className="h-6 w-6" />,
      title: "Quick Play - 30 Minutes",
      description: "Run your content for half an hour",
    },
    {
      id: "go-live",
      icon: <Radio className="h-6 w-6" />,
      title: "Go Live",
      description: "Start broadcasting continuously",
    },
  ];

  const handlePublish = () => {
    if (!selectedOption) return;
    
    setIsPublishing(true);
    console.log("Publishing with option:", selectedOption);
    
    setTimeout(() => {
      setIsPublishing(false);
      setIsComplete(true);
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-chart-2/10 p-6">
              <CheckCircle className="h-16 w-16 text-chart-2" />
            </div>
          </div>
          <h1 className="mb-3 text-2xl font-semibold" data-testid="text-congratulations">
            Congratulations! 🎉
          </h1>
          <p className="mb-6 text-base text-muted-foreground">
            Your digital signage is now live and broadcasting content!
          </p>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">What's next?</p>
            <ul className="mt-2 space-y-1 text-left text-sm text-muted-foreground">
              <li>• Monitor your screen performance</li>
              <li>• Add more screens to your network</li>
              <li>• Schedule content for different times</li>
              <li>• Create custom playlists</li>
            </ul>
          </div>
          <Button
            className="mt-6 w-full"
            onClick={onComplete}
            data-testid="button-go-to-dashboard"
          >
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-6">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Play className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="mb-3 text-center text-2xl font-semibold">Ready to Publish</h1>
          <p className="text-center text-base text-muted-foreground">
            Choose how you want to start broadcasting your content
          </p>
        </div>

        <div className="mb-6 space-y-3">
          {publishOptions.map((option) => (
            <Card
              key={option.id}
              className={`cursor-pointer p-6 transition-all duration-200 hover-elevate active-elevate-2 ${
                selectedOption === option.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedOption(option.id)}
              data-testid={`publish-option-${option.id}`}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                {selectedOption === option.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            </Card>
          ))}
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handlePublish}
          disabled={!selectedOption || isPublishing}
          data-testid="button-publish-now"
        >
          {isPublishing ? (
            <>
              <Radio className="mr-2 h-5 w-5 animate-pulse" />
              Publishing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Publish Now
            </>
          )}
        </Button>
      </Card>
    </div>
  );
}
