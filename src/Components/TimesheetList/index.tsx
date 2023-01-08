import { useUserState } from "@/utils/Context/UserContext/Context";
import { deleteTimesheet } from "@/utils/timesheetapis/timesheet";
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
  const [{ userId }] = useUserState();
  const prefTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (projectTimesheets.length > 0) {
      let totalTime = 0;
      projectTimesheets.forEach((prj) => (totalTime += prj.timerValue));
      setTotalTime(totalTime);
    } else setTotalTime(0);
  }, [projectTimesheets]);

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
        <table className="w-full table-auto  ">
          <thead>
            <tr className="border-b border-slate-100 text-center text-slate-600">
              <th className="p-2">Name</th>
              <th className="p-2">Created</th>
              <th className="p-2">Time</th>
              <th className="p-2">Action</th>
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
                  <td className="whitespace-nowrap p-4 pl-8	">
                    <span>{proj.projectName}</span>
                  </td>
                  <td>
                    <span className="mx-2 whitespace-nowrap">
                      {proj.createdAt}
                    </span>
                  </td>
                  <td>
                    <span className="mx-2">
                      {convertToMMSS(proj.timerValue, true)}
                    </span>
                  </td>
                  <td>
                    <button
                      disabled={isDisabledBtn}
                      className={`rounded-md ${
                        isDisabledBtn
                          ? "bg-red-300 text-slate-200 "
                          : "bg-red-400 text-gray-50 hover:bg-red-500 active:bg-red-600"
                      } px-4 py-2 `}
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
        <span>Total:{` `}</span>
        <span> {convertToMMSS(totalTime, true)}</span>
      </div>
    </div>
  );
}
