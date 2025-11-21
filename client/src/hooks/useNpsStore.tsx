import { createContext, useContext, useState, ReactNode } from "react";

interface NpsContextType {
  showWidget: boolean;
  showNpsWidget: () => void;
  hideNpsWidget: () => void;
}

const NpsContext = createContext<NpsContextType | undefined>(undefined);

export function NpsProvider({ children }: { children: ReactNode }) {
  const [showWidget, setShowWidget] = useState(false);

  const showNpsWidget = () => {
    setShowWidget(true);
  };

  const hideNpsWidget = () => {
    setShowWidget(false);
  };

  return (
    <NpsContext.Provider value={{ showWidget, showNpsWidget, hideNpsWidget }}>
      {children}
    </NpsContext.Provider>
  );
}

export function useNps() {
  const context = useContext(NpsContext);
  if (context === undefined) {
    throw new Error("useNps must be used within an NpsProvider");
  }
  return context;
}

