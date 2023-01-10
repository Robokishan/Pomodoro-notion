import { showError } from "@/utils/apis";
import { sendEmail } from "@/utils/email";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import xlsx from "json-as-xlsx";
import { getDatabaseTimesheetsById } from "@/utils/apis/firebase/timesheet";
import { listDatabases, queryDatabase } from "@/utils/apis/notion/database";
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
      const {
        startDate: std,
        endDate: etd,
        "databaseId[]": rawdatabaseIds,
        type: exportAs,
      } = req.query;
      if (!std || !etd || !rawdatabaseIds || rawdatabaseIds.length == 0)
        throw new Error("Params not sufficient");
      const type = exportAs ?? "excel";
      const startDate = Math.floor(Number(std as string));
      const endDate = Math.floor(Number(etd as string));
      const user = await fetchNotionUser(userEmail);
      if (!user) throw new Error("User not found");
      const notionDatabases = await listDatabases(true, user.accessToken);
      let databaseIds: Array<any> = rawdatabaseIds as string[];
      if (!Array.isArray(databaseIds)) {
        databaseIds = [rawdatabaseIds];
      }
      const databases = (databaseIds as []).map((databaseid) => {
        const notionDb = notionDatabases.results?.find(
          (notiondb) => notiondb.id == databaseid
        );
        if (notionDb) {
          return {
            id: notionDb.id,
            name:
              notionDb.title &&
              notionDb?.title
                .map(function (t) {
                  return t.text?.content;
                })
                .join(""),
          };
        } else {
          return null;
        }
      });
      if (databases.length == 0) throw new Error("No database Found");

      const timesheetFetch = databases.map(
        (db) =>
          db?.id &&
          getDatabaseTimesheetsById(user.id, db.id, {
            startDate,
            endDate,
          })
      );

      const Databasetimesheets = await Promise.all(timesheetFetch);

      if (type == "excel") {
        const emailRawResponse = await Promise.all(
          databases.map(async (database, index) => {
            const databaseDetails = await queryDatabase(
              database?.id as string,
              true,
              user.accessToken
            );
            const cache: Record<string, string> = {};
            const response = Databasetimesheets[index].map((timesheet: any) => {
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

            if (response.length == 0)
              return {
                databaseId: database?.id,
                name: database?.name,
                file: null,
              };
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
            return {
              databaseId: database?.id,
              name: database?.name,
              file: excelData,
            };
          })
        );

        const { attachments, html } = FormateEmailResponse(emailRawResponse);

        sendEmail({
          to: userEmail,
          subject: "Pomodoro Reports by Kishan Joshi",
          text: `from ${format(
            new Date(startDate * 1000),
            "yyyy-MM-dd"
          )} to ${format(new Date(endDate * 1000), "yyyy-MM-dd")}`,
          html,
          attachments,
        });

        res.status(200).json({ message: `email will be sent on ${userEmail}` });
      } else {
        res.status(403).end({
          message: `Only Excel allowed`,
        });
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

function FormateEmailResponse(emailRawResponse: Array<any>) {
  let html = "";
  const attachments: Array<any> = [];
  emailRawResponse.forEach((raw) => {
    if (raw.file) {
      html += `<div>Data compiled for database: ${raw.name}</div>`;
      attachments.push({ filename: `${raw.name}.xlsx`, content: raw.file });
    } else html += `<div>Data not found for database: <b>${raw.name}</b>`;
  });
  return {
    html,
    attachments,
  };
}
