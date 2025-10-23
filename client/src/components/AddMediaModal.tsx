import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  Store,
  FolderOpen,
  Layout,
  Camera,
  Image,
  Palette,
  ArrowLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AddMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsTemplateModalOpen: (open: boolean) => void;
}

type CategoryType = "upload" | "templates" | "import" | "explore";
type StepType = "category" | "options";

interface Category {
  id: CategoryType;
  title: string;
  description: string;
  icon: typeof Upload;
  iconBgColor: string;
  iconColor: string;
}

interface SubOption {
  id: string;
  title: string;
  description: string;
  icon: typeof FolderOpen;
  iconBgColor: string;
  iconColor: string;
  action: () => void;
}

export default function AddMediaModal({
  open,
  onOpenChange,
  setIsTemplateModalOpen,
}: AddMediaModalProps) {
  const [currentStep, setCurrentStep] = useState<StepType>("category");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  // Animation variants
  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  // Category definitions
  const categories: Category[] = [
    {
      id: "templates",
      title: "Choose Templates",
      description: "Browse and select from pre-designed industry leading templates",
      icon: Layout,
      iconBgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "upload",
      title: "Upload Your Own",
      description: "Upload images, videos, audio, or PDFs from your device",
      icon: Upload,
      iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "import",
      title: "Import from Other Sources",
      description: "Import from Pexels, Unsplash, or Canva",
      icon: Download,
      iconBgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      id: "explore",
      title: "Browse Apps",
      description: "Discover and install apps from our extensive app library",
      icon: Store,
      iconBgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  // Sub-options based on selected category
  const getSubOptions = (category: CategoryType): SubOption[] => {
    switch (category) {
      case "templates":
        // Templates category directly opens the template modal - no sub-options needed
        return [];
      case "upload":
        return [
          {
            id: "local-files",
            title: "Upload Local Files",
            description: "Upload images, videos, audio, or PDFs from your device",
            icon: FolderOpen,
            iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400",
            action: () => {
              console.log("Upload Local Files clicked");
              onOpenChange(false);
            },
          },
        ];
      case "import":
        return [
          {
            id: "pexels",
            title: "Upload from Pexels",
            description: "Import high-quality stock photos and videos",
            icon: Camera,
            iconBgColor: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400",
            action: () => {
              console.log("Upload from Pexels clicked");
              onOpenChange(false);
            },
          },
          {
            id: "unsplash",
            title: "Upload from Unsplash",
            description: "Access free professional photography collection",
            icon: Image,
            iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
            iconColor: "text-orange-600 dark:text-orange-400",
            action: () => {
              console.log("Upload from Unsplash clicked");
              onOpenChange(false);
            },
          },
          {
            id: "canva",
            title: "Import from Canva",
            description: "Connect and import your Canva designs",
            icon: Palette,
            iconBgColor: "bg-pink-100 dark:bg-pink-900/30",
            iconColor: "text-pink-600 dark:text-pink-400",
            action: () => {
              console.log("Import from Canva clicked");
              onOpenChange(false);
            },
          },
        ];
      case "explore":
        // Browse Apps directly - no sub-options needed
        return [];
      default:
        return [];
    }
  };

  const handleCategorySelect = (categoryId: CategoryType) => {
    // Handle categories that directly perform an action (no sub-options)
    if (categoryId === "templates") {
      setIsTemplateModalOpen(true);
      onOpenChange(false);
      return;
    }
    
    if (categoryId === "explore") {
      console.log("Browse Apps clicked");
      onOpenChange(false);
      return;
    }

    // For categories with sub-options, navigate to Step 2
    setSelectedCategory(categoryId);
    setCurrentStep("options");
  };

  const handleBack = () => {
    setCurrentStep("category");
    setSelectedCategory(null);
  };

  const handleClose = () => {
    setCurrentStep("category");
    setSelectedCategory(null);
    onOpenChange(false);
  };

  const renderCategoryStep = () => (
    <motion.div
      key="category"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="py-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-fr">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="h-full"
            >
              <Card
                className="cursor-pointer rounded-2xl transition-all duration-200 hover:shadow-md border-2 border-border hover:border-primary/50 group overflow-hidden h-full"
                onClick={() => handleCategorySelect(category.id)}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4 h-full">
                    <div
                      className={`w-20 h-20 rounded-2xl ${category.iconBgColor} ${category.iconColor} flex items-center justify-center transition-transform duration-200 group-hover:scale-110 flex-shrink-0`}
                    >
                      <Icon className="h-10 w-10" />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <h3 className="font-semibold text-base leading-tight">{category.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {category.description}
                      </p>
                    </div>
                  </CardContent>
                </motion.div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const renderOptionsStep = () => {
    if (!selectedCategory) return null;

    const subOptions = getSubOptions(selectedCategory);
    const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

    return (
      <motion.div
        key="options"
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="py-6 space-y-6"
      >
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h3 className="font-semibold text-lg">{selectedCategoryData?.title}</h3>
            <p className="text-sm text-muted-foreground">
              Choose an option to continue
            </p>
          </div>
        </div>

        {/* Sub-option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.id}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer rounded-2xl transition-all duration-200 hover:shadow-md border-2 border-border hover:border-primary/50 group overflow-hidden"
                  onClick={option.action}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="p-6 flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl ${option.iconBgColor} ${option.iconColor} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <h4 className="font-semibold text-base">{option.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </CardContent>
                  </motion.div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Media</DialogTitle>
          <DialogDescription>
            {currentStep === "category"
              ? "Choose how you'd like to add media to your library"
              : "Select an option to continue"}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {currentStep === "category" && renderCategoryStep()}
          {currentStep === "options" && renderOptionsStep()}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

