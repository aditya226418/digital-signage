import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

const themes: Theme[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean blue theme",
    colors: { primary: "#6366f1", secondary: "#8b5cf6" },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Deep sea blues",
    colors: { primary: "#0ea5e9", secondary: "#06b6d4" },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural greens",
    colors: { primary: "#10b981", secondary: "#059669" },
  },
  {
    id: "crimson",
    name: "Crimson",
    description: "Bold reds",
    colors: { primary: "#dc2626", secondary: "#b91c1c" },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm oranges",
    colors: { primary: "#f97316", secondary: "#ea580c" },
  },
  {
    id: "lavender",
    name: "Lavender",
    description: "Soft purples",
    colors: { primary: "#a855f7", secondary: "#9333ea" },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep navy",
    colors: { primary: "#3b82f6", secondary: "#1e40af" },
  },
  {
    id: "rose",
    name: "Rose",
    description: "Elegant pinks",
    colors: { primary: "#ec4899", secondary: "#db2777" },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon future",
    colors: { primary: "#ff0080", secondary: "#7928ca" },
  },
  {
    id: "noir",
    name: "Noir",
    description: "Classic black & white",
    colors: { primary: "#0a0a0a", secondary: "#525252" },
  },
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("default");

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("theme", themeId);
  };

  // Load saved theme on mount
  useState(() => {
    const savedTheme = localStorage.getItem("theme") || "default";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 transition-all duration-200 hover:shadow-md"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className="flex items-start gap-3 cursor-pointer py-3"
            >
              <div className="flex items-center gap-2 flex-1">
                <div className="flex gap-1">
                  <div
                    className="h-6 w-6 rounded-md border-2 border-border shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="h-6 w-6 rounded-md border-2 border-border shadow-sm"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {theme.description}
                  </div>
                </div>
              </div>
              {currentTheme === theme.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

