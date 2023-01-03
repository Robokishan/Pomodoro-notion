import { useUserState } from "@/utils/Context/UserContext/Context";
import { deleteTimesheet } from "@/utils/timesheetapis/timesheet";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { convertToMMSS } from "../../hooks/Pomodoro/Time/useTime";
import { usePomoClient } from "../../hooks/Storage/usePomoClient";
import useFormattedData from "../../hooks/useFormattedData";

export default function TimesheetList() {
  const [, projectTimesheets] = useFormattedData();
  const [, , mutate] = usePomoClient();
  const [totalTime, setTotalTime] = useState(0);
  const [{ userId }] = useUserState();

  useEffect(() => {
    if (projectTimesheets.length > 0)
      projectTimesheets.forEach((prj) =>
        setTotalTime((prev) => prev + prj.timerValue)
      );
    else setTotalTime(0);
  }, [projectTimesheets]);

  return (
    <div className="mb-10 rounded-md bg-white p-5 shadow-2xl">
      <h1 className="text-xl text-gray-400">Timesheets</h1>

      <div className="max-h-96 overflow-auto">
        <ul>
          {projectTimesheets.map((proj) => (
            <li className="my-2" key={proj.timesheetId}>
              <div className="flex gap-5">
                <span>{proj.projectName}</span>
                <span>{proj.createdAt}</span>
                <span>{convertToMMSS(proj.timerValue, true)}</span>
                <button
                  className="rounded-md bg-red-400 px-4 py-2 hover:bg-red-500 active:bg-red-600"
                  onClick={() => {
                    deleteTimesheet({
                      projectId: proj.projectId,
                      timesheetId: proj.timesheetId,
                      userId,
                    })
                      .then(() => {
                        toast.success("Delete done");
                        mutate();
                      })
                      .catch(() => toast.error("Delete error"));
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5">
        <span>Total:{` `}</span>
        <span> {convertToMMSS(totalTime, true)}</span>
      </div>
    </div>
  );
}
