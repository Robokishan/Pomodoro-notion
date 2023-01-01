import { NextApiRequest, NextApiResponse } from "next";
import { showError } from "../../../../utils/apis";
import {
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
    if (!userId) throw new Error("UserId not found");
    if (method == "GET") {
      res.status(200).json(await getTimesheets(userId));
    } else if (method == "POST") {
      const { projectId, timerValue } = req.body;
      if (projectId && timerValue) {
        res.status(200).json({
          message: "Timesheet created",
          id: await insertTimesheet({
            projectId,
            userId,
            timerValue,
          }),
        });
      } else {
        showError(res);
      }
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    showError(res);
  }
}
