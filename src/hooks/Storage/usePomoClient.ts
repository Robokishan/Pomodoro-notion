import { format } from "date-fns";
import { useCallback, useEffect } from "react";
import { useProjectState } from "../../utils/Context/ProjectContext/Context";
import { actionTypes } from "../../utils/Context/ProjectContext/reducer";
import { useUserState } from "../../utils/Context/UserContext/Context";
import {
  getTimesheets,
  pushTimesheet,
} from "../../utils/timesheetapis/timesheet";

type Return = [
  () => void,
  (projectId: string, timerValue: number) => Promise<void>
];

export const usePomoClient = (): Return => {
  const [{ userId, startDate, endDate }] = useUserState();
  const [, dispatch] = useProjectState();

  const mutate = useCallback(() => {
    if (startDate && endDate && userId) {
      getTimesheets({
        startDate: startDate,
        endDate: endDate,
        userId,
      })
        .then((projects) => {
          const timesheets = projects.map((p) => ({
            projectId: p.projectId,
            timerValue: p.timerValue,
            createdAt: format(
              new Date(p.createdAt?.seconds * 1000),
              "yyyy-MM-dd hh:mm:ss aaaaa'm'"
            ),
            timesheetId: p.timesheetId,
          }));
          dispatch({
            type: actionTypes.UPDATE_PROJECT_TIMESHEETS,
            payload: timesheets,
          });

          const projectMap: Record<string, number> = {};
          projects.forEach((proj) => {
            if (projectMap[proj.projectId])
              projectMap[proj.projectId] += proj.timerValue
                ? Number(proj.timerValue)
                : 0;
            else projectMap[proj.projectId] = proj.timerValue;
          });

          dispatch({
            type: actionTypes.UPDATE_PROJECT_ANALYSIS,
            payload: projectMap,
          });
        })
        .catch((e) => console.error("ResponseError", e));
    }
  }, [startDate, endDate, userId, dispatch]);

  useEffect(() => {
    mutate();
  }, [mutate]);

  async function addTimesheet(projectId: string, timerValue: number) {
    pushTimesheet({
      projectId,
      userId,
      timerValue,
    });
  }

  return [mutate, addTimesheet];
};
