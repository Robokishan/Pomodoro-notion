export interface ProjectLists {
  createdAt: CreatedAt;
  projectId: string;
  timerValue: number;
  timesheetId: string;
  userId: string;
}

export interface CreatedAt {
  seconds: number;
  nanoseconds: number;
}

export type ProjectTimeSheetsType = {
  projectId: string;
  timerValue: number;
  createdAt: string;
  timesheetId: string;
  href?: string;
}[];

export type ProjectAnalytics = Record<string, number>;
