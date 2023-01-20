import { startOfDay } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { showError } from "../../../../utils/apis";
import {
  deleteTimesheet,
  getTimesheets,
  insertTimesheet,
} from "../../../../utils/apis/firebase/timesheet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    const userId = req.query.userId as string;
    const startDate = Math.floor(
      Number(
        (req.query.startDate as string) ??
          startOfDay(new Date()).getTime() / 1000
      )
    );
    const endDate = Math.floor(
      Number((req.query.endDate as string) ?? new Date().getTime() / 1000)
    );
    if (!userId) throw new Error("UserId not found");
    if (method == "GET") {
      res.status(200).json(
        await getTimesheets(userId, {
          startDate,
          endDate,
        })
      );
    } else if (method == "POST") {
      const { projectId, databaseId, timerValue, timestamp, startTime } =
        req.body;
      if (
        projectId &&
        databaseId &&
        (timerValue != null || timerValue != undefined) &&
        startTime
      ) {
        res.status(200).json({
          message: "Timesheet created",
          id: await insertTimesheet({
            projectId,
            databaseId,
            userId,
            timerValue,
            timestamp,
            startTime,
          }),
        });
      } else {
        showError(res);
      }
    } else if (method == "DELETE") {
      const { timesheetId, projectId, userId } = req.query;
      if (timesheetId && userId && projectId) {
        res.status(200).json({
          message: "Timesheet deleted",
          id: await deleteTimesheet({
            userId: userId as string,
            projectId: projectId as string,
            timesheetId: timesheetId as string,
          }),
        });
      } else {
        showError(res);
      }
    } else {
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.log(error);
    showError(res);
  }
}
