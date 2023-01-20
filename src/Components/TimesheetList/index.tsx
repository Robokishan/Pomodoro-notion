import { useUserState } from "@/utils/Context/UserContext/Context";
import { deleteTimesheet } from "@/utils/timesheetapis/timesheet";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { convertToMMSS } from "../../hooks/Pomodoro/Time/useTime";
import { usePomoClient } from "../../hooks/Storage/usePomoClient";
import useFormattedData from "../../hooks/useFormattedData";

export default function TimesheetList() {
  const [, projectTimesheets] = useFormattedData();
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);
  const [mutate, , isLoading] = usePomoClient();
  const [totalTime, setTotalTime] = useState(0);
  const [{ userId, startDate, endDate }] = useUserState();
  const prefTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (projectTimesheets.length > 0) {
      let totalTime = 0;
      projectTimesheets.forEach((prj) => (totalTime += prj.timerValue));
      setTotalTime(totalTime);
    } else setTotalTime(0);
  }, [projectTimesheets]);

  function diff_hours(dt2: number, dt1: number) {
    let diff = dt2 - dt1;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  return (
    <div className="mb-10 mt-10 rounded-md bg-white p-5 shadow-2xl">
      <span className="relative flex h-3 w-3">
        {isLoading && (
          <>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
          </>
        )}
      </span>

      <h1 className="mr-5 text-center text-xl text-gray-400">Timesheets</h1>
      <hr className="my-3 h-px border-0 bg-gray-200 " />
      <div className="max-h-96 overflow-auto ">
        <table className="w-full table-auto">
          {/* sticky table header */}
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-slate-100 text-center text-slate-600">
              <th className="p-2">Name</th>
              <th className="p-2">Start Time</th>
              <th className="p-2">End Time</th>
              <th className="py-2 px-10">Time</th>
              <th className="py-2 px-10">Action</th>
            </tr>
          </thead>
          <tbody>
            {projectTimesheets.map((proj) => {
              const isDisabledBtn =
                disabledButtons.findIndex((id) => id == proj.timesheetId) != -1;
              return (
                <tr
                  className="border-b border-slate-100 text-center"
                  key={proj.timesheetId}
                >
                  <td className="whitespace-nowrap p-4 pl-8	underline">
                    <Link href={proj.href ?? ""}>
                      <a>{proj.projectName}</a>
                    </Link>
                  </td>
                  <td>
                    <span
                      title={`${
                        proj.startTime.approx == true ? "Approx value" : null
                      }`}
                      className={`mx-2 whitespace-nowrap ${
                        proj.startTime.approx == true
                          ? "cursor-pointer text-orange-500" //if approximate value then show orange
                          : null
                      }`}
                    >
                      {proj.startTime.value}
                    </span>
                  </td>
                  <td>
                    <span
                      title={`${proj.susp == true ? "Suspicious value" : null}`}
                      className={`mx-2 whitespace-nowrap ${
                        proj.susp == true
                          ? "cursor-pointer text-blue-400" //if susp value then show blue
                          : null
                      }`}
                    >
                      {proj.createdAt}
                    </span>
                  </td>
                  <td>
                    <span
                      title={`${proj.susp == true ? "Suspicious value" : null}`}
                      className={`mx-2 ${
                        proj.susp == true
                          ? "cursor-pointer text-blue-400" //if susp value then show blue
                          : null
                      }`}
                    >
                      {convertToMMSS(proj.timerValue, true, true)}
                    </span>
                  </td>
                  <td>
                    <button
                      disabled={isDisabledBtn}
                      className={`rounded-md ${
                        isDisabledBtn
                          ? "bg-red-300 text-slate-200 "
                          : "bg-red-400 text-gray-50 hover:bg-red-500 active:bg-red-600"
                      } px-4 py-2`}
                      onClick={async () => {
                        setDisabledButtons((prev) => [
                          ...prev,
                          proj.timesheetId,
                        ]);
                        deleteTimesheet({
                          projectId: proj.projectId,
                          timesheetId: proj.timesheetId,
                          userId,
                        })
                          .then(() => {
                            toast.success("Delete done", {
                              autoClose: 1000,
                            });
                            if (prefTimeout.current)
                              clearTimeout(prefTimeout.current);
                            prefTimeout.current = setTimeout(() => {
                              mutate().finally(() =>
                                setDisabledButtons((prev) => [
                                  ...prev.filter(
                                    (id) => id != proj.timesheetId
                                  ),
                                ])
                              );
                            }, 3000);
                          })
                          .catch(() => toast.error("Delete error"));
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-5">
        <span>{`Total: ${diff_hours(startDate, endDate)} Hours`}</span>
        <div>
          <span>{`Spent: ${convertToMMSS(totalTime, true, true)} Hours`}</span>
        </div>
        <div className="mt-1">
          <div className="inline-block h-3 w-3 bg-orange-400"></div>
          <span className="ml-2">Approx Value</span>
        </div>
        <div className="mt-1">
          <div className="inline-block h-3 w-3 bg-blue-400"></div>
          <span className="ml-2">Suspicious Value</span>
        </div>
      </div>
    </div>
  );
}
