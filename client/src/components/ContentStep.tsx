import { useState } from "react";
import { Upload, Image, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ContentStepProps {
  onComplete: () => void;
}

export default function ContentStep({ onComplete }: ContentStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    { id: "1", name: "Product Showcase", color: "bg-gradient-to-br from-blue-500 to-purple-600" },
    { id: "2", name: "Company News", color: "bg-gradient-to-br from-green-500 to-teal-600" },
    { id: "3", name: "Welcome Screen", color: "bg-gradient-to-br from-orange-500 to-red-600" },
    { id: "4", name: "Menu Board", color: "bg-gradient-to-br from-indigo-500 to-blue-600" },
  ];

  const handleUpload = () => {
    const newFile = `image-${Date.now()}.jpg`;
    setUploadedFiles([...uploadedFiles, newFile]);
    console.log("File uploaded:", newFile);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    console.log("Template selected:", templateId);
  };

  const canProceed = uploadedFiles.length > 0 || selectedTemplate !== null;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-6">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Image className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="mb-3 text-center text-2xl font-semibold">Add Your Content</h1>
          <p className="text-center text-base text-muted-foreground">
            Upload media files or choose from our template library
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-medium">Upload Media</h3>
            <div className="rounded-lg border-2 border-dashed border-border p-8 text-center transition-all hover-elevate">
              <Upload className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="mb-4 text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
              <Button onClick={handleUpload} data-testid="button-upload-file">
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border border-border p-2 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                    <span className="flex-1">{file}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium">Choose a Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover-elevate active-elevate-2 ${
                    selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                  data-testid={`template-${template.id}`}
                >
                  <CardContent className="p-4">
                    <div className={`mb-3 h-24 rounded-lg ${template.color}`} />
                    <p className="text-center text-sm font-medium">{template.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={onComplete}
            disabled={!canProceed}
            data-testid="button-continue-to-publish"
          >
            Continue to Publish
          </Button>
        </div>
      </Card>
    </div>
  );
}
