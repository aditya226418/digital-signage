import { useState } from "react";
import { Plus, Trash2, GripVertical, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mockCompositions } from "@/lib/mockPublishData";
import { toast } from "sonner";

interface CampaignBuilderProps {
  compositionIds: string[];
  rotationType: "sequential" | "random" | "weighted";
  weights?: Record<string, number>;
  onCompositionsChange: (ids: string[]) => void;
  onRotationTypeChange: (type: "sequential" | "random" | "weighted") => void;
  onWeightsChange: (weights: Record<string, number>) => void;
}

export default function CampaignBuilder({
  compositionIds,
  rotationType,
  weights = {},
  onCompositionsChange,
  onRotationTypeChange,
  onWeightsChange,
}: CampaignBuilderProps) {
  const [selectedCompositionId, setSelectedCompositionId] = useState("");

  const addComposition = () => {
    if (!selectedCompositionId) {
      toast.error("Please select a composition");
      return;
    }

    if (compositionIds.includes(selectedCompositionId)) {
      toast.error("This composition is already added");
      return;
    }

    onCompositionsChange([...compositionIds, selectedCompositionId]);
    
    // Initialize weight for weighted rotation
    if (rotationType === "weighted") {
      onWeightsChange({
        ...weights,
        [selectedCompositionId]: 25,
      });
    }
    
    setSelectedCompositionId("");
    toast.success("Composition added to campaign");
  };

  const removeComposition = (id: string) => {
    onCompositionsChange(compositionIds.filter((cid) => cid !== id));
    
    if (rotationType === "weighted") {
      const newWeights = { ...weights };
      delete newWeights[id];
      onWeightsChange(newWeights);
    }
    
    toast.success("Composition removed from campaign");
  };

  const updateWeight = (id: string, weight: number) => {
    onWeightsChange({
      ...weights,
      [id]: weight,
    });
  };

  const getCompositionName = (id: string) => {
    return mockCompositions.find((c) => c.id === id)?.name || "Unknown";
  };

  const getCompositionType = (id: string) => {
    return mockCompositions.find((c) => c.id === id)?.type || "unknown";
  };

  const availableCompositions = mockCompositions.filter(
    (c) => !compositionIds.includes(c.id)
  );

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Campaign Builder</h3>
        <p className="text-sm text-muted-foreground">
          Add multiple compositions and choose how they should rotate
        </p>
      </div>

      {/* Rotation Type */}
      <div className="space-y-2">
        <Label htmlFor="rotationType">Rotation Type</Label>
        <Select value={rotationType} onValueChange={(value: any) => onRotationTypeChange(value)}>
          <SelectTrigger id="rotationType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sequential">
              Sequential - Play in order
            </SelectItem>
            <SelectItem value="random">
              Random - Play in random order
            </SelectItem>
            <SelectItem value="weighted">
              Weighted - Play based on assigned weights
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {rotationType === "sequential" && "Compositions will play in the order they appear"}
          {rotationType === "random" && "Compositions will play in random order"}
          {rotationType === "weighted" && "Compositions will play based on their assigned weight percentages"}
        </p>
      </div>

      {/* Add Composition */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Select
              value={selectedCompositionId}
              onValueChange={setSelectedCompositionId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a composition to add" />
              </SelectTrigger>
              <SelectContent>
                {availableCompositions.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    All compositions added
                  </div>
                ) : (
                  availableCompositions.map((comp) => (
                    <SelectItem key={comp.id} value={comp.id}>
                      {comp.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button
              onClick={addComposition}
              disabled={!selectedCompositionId}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Compositions List */}
      <ScrollArea className="h-[350px] rounded-md border border-border/40">
        <div className="p-4 space-y-2">
          {compositionIds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                No compositions added yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add compositions to build your campaign
              </p>
            </div>
          ) : (
            <>
              {compositionIds.map((id, index) => (
                <Card
                  key={id}
                  className="transition-all duration-200 hover:border-primary/50"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground shrink-0 cursor-grab" />
                      
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <span className="font-semibold text-sm">{index + 1}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {getCompositionName(id)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {getCompositionType(id)}
                          </Badge>
                          {rotationType === "weighted" && weights[id] && (
                            <Badge variant="secondary" className="text-xs">
                              {weights[id]}% weight
                            </Badge>
                          )}
                        </div>
                      </div>

                      {rotationType === "weighted" && (
                        <div className="flex items-center gap-2 shrink-0">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={weights[id] || 0}
                            onChange={(e) =>
                              updateWeight(id, parseInt(e.target.value) || 0)
                            }
                            className="w-20 h-9"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      )}

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive shrink-0"
                        onClick={() => removeComposition(id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {rotationType === "weighted" && compositionIds.length > 0 && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Weight</span>
                      <Badge
                        variant={totalWeight === 100 ? "default" : "secondary"}
                        className={
                          totalWeight === 100
                            ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                            : totalWeight > 100
                            ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                            : ""
                        }
                      >
                        {totalWeight}%
                      </Badge>
                    </div>
                    {totalWeight !== 100 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {totalWeight < 100
                          ? "Total weight should equal 100%"
                          : "Total weight exceeds 100%"}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

