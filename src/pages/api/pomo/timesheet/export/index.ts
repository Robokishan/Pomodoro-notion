import { showError } from "@/utils/apis";
import { sendEmail } from "@/utils/email";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import xlsx from "json-as-xlsx";
import { getDatabaseTimesheetsById } from "@/utils/apis/firebase/timesheet";
import { queryDatabase } from "@/utils/apis/notion/database";
import { fetchNotionUser } from "@/utils/apis/firebase/userNotion";
import { getProjectTitle } from "@/utils/notionutils";
import { format } from "date-fns-tz";
import { convertToMMSS } from "../../../../../hooks/Pomodoro/Time/useTime";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    const session = await getSession({ req });
    if (!session?.user?.email) throw new Error("Session not found");
    if (method == "GET") {
      const userEmail = session.user.email;
      const { startDate: std, endDate: etd, databaseId } = req.query;

      if (!std || !etd || !databaseId) throw new Error("Params not sufficient");

      const startDate = Math.floor(Number(std as string));
      const endDate = Math.floor(Number(etd as string));
      const user = await fetchNotionUser(userEmail);
      if (!user) throw new Error("User not found");

      const timesheets = await getDatabaseTimesheetsById(
        user.id,
        databaseId as string,
        {
          startDate,
          endDate,
        }
      );

      if (timesheets.length == 0) {
        res.status(200).json({
          message: "no timesheets found",
        });
      } else {
        const databaseDetails = await queryDatabase(
          databaseId as string,
          true,
          user.accessToken
        );
        const cache: Record<string, string> = {};
        const response = timesheets.map((timesheet: any) => {
          const t = timesheet;
          t.timerValue = convertToMMSS(t.timerValue, true);
          t.createdAt = format(
            new Date(t.createdAt.seconds * 1000),
            "yyyy-MM-dd hh:mm:ss aaaaa'm'"
          );
          if (!cache[timesheet.projectId])
            cache[timesheet.projectId] = getProjectTitle(
              databaseDetails.results.find(
                (proj) => timesheet.projectId == proj.id
              ),
              ""
            );
          return {
            Project: cache[timesheet.projectId],
            ...timesheet,
          };
        });

        const excelColumn = Object.keys(response[0]);

        const ColumnMap: Record<string, string> = {
          userId: "User Id",
          databaseId: "Database Id",
          projectId: "Project Id",
          timerValue: "Time",
          createdAt: "Created At",
          timesheetId: "Timesheet",
          Project: "Project",
        };

        const excelData = xlsx(
          [
            {
              sheet: "Timesheets",
              columns: excelColumn.map((col) => ({
                value: col,
                label: ColumnMap[col] || col,
              })),
              content: response,
            },
          ],
          {
            writeOptions: {
              type: "buffer",
            },
          }
        );

        sendEmail({
          to: userEmail,
          subject: "Pomodoro Reports by Kishan Joshi",
          text: `from ${format(
            new Date(startDate * 1000),
            "yyyy-MM-dd"
          )} to ${format(new Date(endDate * 1000), "yyyy-MM-dd")}`,
          attachments: [
            {
              filename: "pomodoro_reports.xlsx",
              content: excelData,
            },
          ],
        });
        res.status(200).json({ message: `email will be sent on ${userEmail}` });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.log(error);
    showError(res);
  }
}
