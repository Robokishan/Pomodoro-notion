export interface ProjectLists {
  createdAt: CreatedAt | number;
  projectId: string;
  timerValue: number;
  timesheetId: string;
  userId: string;
  startTime?: number;
}

export interface CreatedAt {
  seconds: number;
  nanoseconds: number;
}

export interface ProjectTimeSheetsType
  extends Omit<ProjectLists, "startTime" | "userId" | "createdAt"> {
  createdAt: string;
  startTime: {
    value: string;
    approx: boolean;
  };
  susp: boolean;
}

export type ProjectAnalytics = Record<string, number>;
