import { ProjectLists } from "../../types/projects";
import { POMO_TSH_APIS } from "../apis/firebase/constants";
import PomodoroClient from "../apis/PomoCSR";

export const pushTimesheet = async ({
  projectId,
  databaseId,
  userId,
  timerValue,
}: {
  projectId: string;
  databaseId: string;
  userId: string;
  timerValue: number;
}) => {
  await PomodoroClient.post(
    POMO_TSH_APIS.TIMESHEET,
    {
      projectId,
      databaseId,
      timerValue,
    },
    {
      params: {
        userId,
      },
    }
  );
};

// get all timesheets for current user
export const getTimesheets = async ({
  startDate,
  endDate,
  userId,
}: {
  startDate: number;
  endDate: number;
  userId: string;
}): Promise<ProjectLists[]> => {
  const { data } = await PomodoroClient.get(POMO_TSH_APIS.TIMESHEET, {
    params: {
      userId,
      startDate,
      endDate,
    },
  });
  return data;
};

// get all timesheets for current user
export const getTimesheet = async ({
  startDate,
  endDate,
  userId,
  projectId,
}: {
  startDate: string;
  endDate: string;
  userId: string;
  projectId: string;
}) => {
  const { data } = await PomodoroClient.get(POMO_TSH_APIS.TIMESHEET, {
    params: {
      userId,
      projectId,
      startDate,
      endDate,
    },
  });
  return data;
};

export const deleteTimesheet = async ({
  projectId,
  userId,
  timesheetId,
}: {
  projectId: string;
  userId: string;
  timesheetId: string;
}) => {
  await PomodoroClient.delete(POMO_TSH_APIS.TIMESHEET, {
    params: {
      projectId,
      userId,
      timesheetId,
    },
  });
};
