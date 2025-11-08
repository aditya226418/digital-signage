import { createContext, useContext, useState, ReactNode } from "react";
import {
  DirectPublish,
  PlannedSchedule,
  ApprovalRequest,
  mockDirectPublishes,
  mockPlannedSchedules,
  mockApprovalRequests,
  orgLevelControls,
  currentUser,
} from "@/lib/mockPublishData";

interface PublishStoreState {
  // Direct Publishing
  directPublishes: DirectPublish[];
  addDirectPublish: (publish: DirectPublish) => void;
  updateDirectPublish: (id: string, updates: Partial<DirectPublish>) => void;
  removeDirectPublish: (id: string) => void;
  pauseDirectPublish: (id: string) => void;
  resumeDirectPublish: (id: string) => void;

  // Planned Publishing
  plannedSchedules: PlannedSchedule[];
  addPlannedSchedule: (schedule: PlannedSchedule) => void;
  updatePlannedSchedule: (id: string, updates: Partial<PlannedSchedule>) => void;
  removePlannedSchedule: (id: string) => void;
  pausePlannedSchedule: (id: string) => void;
  resumePlannedSchedule: (id: string) => void;

  // Approval Workflow
  approvalRequests: ApprovalRequest[];
  submitForApproval: (schedule: PlannedSchedule) => void;
  approveRequest: (requestId: string, comment: string) => void;
  rejectRequest: (requestId: string, comment: string) => void;

  // Settings
  orgLevelControls: boolean;
  currentUser: typeof currentUser;
}

const PublishStoreContext = createContext<PublishStoreState | undefined>(undefined);

export function PublishStoreProvider({ children }: { children: ReactNode }) {
  const [directPublishes, setDirectPublishes] = useState<DirectPublish[]>(mockDirectPublishes);
  const [plannedSchedules, setPlannedSchedules] = useState<PlannedSchedule[]>(mockPlannedSchedules);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(mockApprovalRequests);

  // Direct Publishing Functions
  const addDirectPublish = (publish: DirectPublish) => {
    setDirectPublishes((prev) => [...prev, publish]);
  };

  const updateDirectPublish = (id: string, updates: Partial<DirectPublish>) => {
    setDirectPublishes((prev) =>
      prev.map((pub) => (pub.id === id ? { ...pub, ...updates } : pub))
    );
  };

  const removeDirectPublish = (id: string) => {
    setDirectPublishes((prev) => prev.filter((pub) => pub.id !== id));
  };

  const pauseDirectPublish = (id: string) => {
    updateDirectPublish(id, { status: "paused" });
  };

  const resumeDirectPublish = (id: string) => {
    updateDirectPublish(id, { status: "active" });
  };

  // Planned Publishing Functions
  const addPlannedSchedule = (schedule: PlannedSchedule) => {
    setPlannedSchedules((prev) => [...prev, schedule]);
  };

  const updatePlannedSchedule = (id: string, updates: Partial<PlannedSchedule>) => {
    setPlannedSchedules((prev) =>
      prev.map((sched) => (sched.id === id ? { ...sched, ...updates } : sched))
    );
  };

  const removePlannedSchedule = (id: string) => {
    setPlannedSchedules((prev) => prev.filter((sched) => sched.id !== id));
  };

  const pausePlannedSchedule = (id: string) => {
    updatePlannedSchedule(id, { status: "paused" });
  };

  const resumePlannedSchedule = (id: string) => {
    updatePlannedSchedule(id, { status: "active" });
  };

  // Approval Functions
  const submitForApproval = (schedule: PlannedSchedule) => {
    const request: ApprovalRequest = {
      id: `approval-${Date.now()}`,
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      requestedBy: currentUser.name,
      requestedAt: new Date().toISOString(),
      status: "pending",
    };
    setApprovalRequests((prev) => [...prev, request]);
    updatePlannedSchedule(schedule.id, { status: "pending_approval", approvalStatus: "pending" });
  };

  const approveRequest = (requestId: string, comment: string) => {
    const request = approvalRequests.find((req) => req.id === requestId);
    if (request) {
      setApprovalRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "approved",
                reviewedBy: currentUser.name,
                reviewedAt: new Date().toISOString(),
                comment,
              }
            : req
        )
      );
      updatePlannedSchedule(request.scheduleId, {
        status: "scheduled",
        approvalStatus: "approved",
        reviewedBy: currentUser.name,
        reviewComment: comment,
      });
    }
  };

  const rejectRequest = (requestId: string, comment: string) => {
    const request = approvalRequests.find((req) => req.id === requestId);
    if (request) {
      setApprovalRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "rejected",
                reviewedBy: currentUser.name,
                reviewedAt: new Date().toISOString(),
                comment,
              }
            : req
        )
      );
      updatePlannedSchedule(request.scheduleId, {
        status: "paused",
        approvalStatus: "rejected",
        reviewedBy: currentUser.name,
        reviewComment: comment,
      });
    }
  };

  const value: PublishStoreState = {
    directPublishes,
    addDirectPublish,
    updateDirectPublish,
    removeDirectPublish,
    pauseDirectPublish,
    resumeDirectPublish,
    plannedSchedules,
    addPlannedSchedule,
    updatePlannedSchedule,
    removePlannedSchedule,
    pausePlannedSchedule,
    resumePlannedSchedule,
    approvalRequests,
    submitForApproval,
    approveRequest,
    rejectRequest,
    orgLevelControls,
    currentUser,
  };

  return (
    <PublishStoreContext.Provider value={value}>
      {children}
    </PublishStoreContext.Provider>
  );
}

export function usePublishStore() {
  const context = useContext(PublishStoreContext);
  if (context === undefined) {
    throw new Error("usePublishStore must be used within a PublishStoreProvider");
  }
  return context;
}

