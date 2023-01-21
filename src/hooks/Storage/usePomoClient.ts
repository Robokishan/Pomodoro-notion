import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { ProjectTimeSheetsType } from "../../types/projects";
import { useProjectState } from "../../utils/Context/ProjectContext/Context";
import { actionTypes } from "../../utils/Context/ProjectContext/reducer";
import { useUserState } from "../../utils/Context/UserContext/Context";
import {
  getTimesheets,
  pushTimesheet,
} from "../../utils/timesheetapis/timesheet";

type Return = [
  () => Promise<void>,
  (
    projectId: string,
    databaseId: string,
    timerValue: number,
    startTime: number,
    endTime: number
  ) => Promise<void>,
  boolean
];

const allowedOffset = 2; //allow to have 2 seconds of offset if something goes wrong other than that everything is problem

export const usePomoClient = (): Return => {
  const [{ userId, startDate, endDate }] = useUserState();
  const [, dispatch] = useProjectState();
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async () => {
    if (startDate && endDate && userId) {
      try {
        setLoading(true);
        const projects = await getTimesheets({
          startDate: startDate,
          endDate: endDate,
          userId,
        });

        const timesheets: ProjectTimeSheetsType[] = projects.map((p) => ({
          projectId: p.projectId,
          timerValue: p.timerValue,
          susp: p.startTime //this is to check wether this is suspicious value or not it is caused by when phone goes to sleep or something went wrong with the timer
            ? Math.abs(p.createdAt.seconds - p.startTime - p.timerValue) >
              allowedOffset
            : false,
          startTime: {
            value: p.startTime
              ? format(
                  new Date(p.startTime * 1000),
                  "yyyy-MM-dd hh:mm:ss aaaaa'm'"
                )
              : format(
                  new Date((p.createdAt.seconds - p.timerValue) * 1000), //if start time not available then calculate approx start time value
                  "yyyy-MM-dd hh:mm:ss aaaaa'm'"
                ),
            approx: !p.startTime, //flag to show wether this is approx value or not
          },
          createdAt: format(
            new Date(p.createdAt.seconds * 1000),
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
      } catch (e) {
        console.error("ResponseError", e);
      } finally {
        setLoading(false);
      }
    }
  }, [startDate, endDate, userId, dispatch]);

  useEffect(() => {
    mutate();
  }, [mutate]);

  async function addTimesheet(
    projectId: string,
    databaseId: string,
    timerValue: number,
    startTime: number,
    endTime: number
  ) {
    await pushTimesheet({
      projectId,
      databaseId,
      userId,
      timerValue,
      startTime,
      endTime,
    });
  }

  return [mutate, addTimesheet, loading];
};
