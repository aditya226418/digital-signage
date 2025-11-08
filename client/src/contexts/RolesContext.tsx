import { createContext, useContext, useState, ReactNode } from "react";
import { UserRole, mockUsers } from "@/lib/mockPublishData";

interface RolesContextState {
  currentUser: UserRole;
  orgLevelControls: boolean;
  setOrgLevelControls: (enabled: boolean) => void;
  setCurrentUser: (user: UserRole) => void;
  canPublish: () => boolean;
  canApprove: () => boolean;
  canViewAllScreens: () => boolean;
  requiresApproval: () => boolean;
}

const RolesContext = createContext<RolesContextState | undefined>(undefined);

export function RolesProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserRole>(mockUsers[0]); // Default to admin
  const [orgLevelControls, setOrgLevelControls] = useState(false);

  const canPublish = () => {
    return currentUser.role === "admin" || currentUser.role === "publisher";
  };

  const canApprove = () => {
    return currentUser.role === "admin" || currentUser.role === "reviewer";
  };

  const canViewAllScreens = () => {
    return currentUser.role === "admin" || !currentUser.region;
  };

  const requiresApproval = () => {
    return orgLevelControls && currentUser.role === "publisher";
  };

  const value: RolesContextState = {
    currentUser,
    orgLevelControls,
    setOrgLevelControls,
    setCurrentUser,
    canPublish,
    canApprove,
    canViewAllScreens,
    requiresApproval,
  };

  return <RolesContext.Provider value={value}>{children}</RolesContext.Provider>;
}

export function useRoles() {
  const context = useContext(RolesContext);
  if (context === undefined) {
    throw new Error("useRoles must be used within a RolesProvider");
  }
  return context;
}

