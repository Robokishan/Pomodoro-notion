import { useProjectState } from "@/utils/Context/ProjectContext/Context";
import { getProjectTitle } from "@/utils/notionutils";
import { useEffect, useState } from "react";

import { PieData } from "../../Components/PieChart";

import { notEmpty } from "../../types/notEmpty";
import { ProjectTimeSheetsType } from "../../types/projects";
import { convertToMMSS } from "../Pomodoro/Time/useTime";

interface FilteredTimesheetTypes extends ProjectTimeSheetsType {
  projectName: string;
  projectId: string;
  timerValue: number;
  timesheetId: string;
  href?: string;
}

export default function useFormattedData(): [
  PieData[],
  FilteredTimesheetTypes[]
] {
  const [filteredData, setFileredData] = useState<PieData[]>([]);
  const [filteredTimesheets, setFileredTimesheets] = useState<
    FilteredTimesheetTypes[]
  >([]);

  const [{ projectAnalysis, projectTimesheets, notionProjects }] =
    useProjectState();

  useEffect(() => {
    if (projectAnalysis) {
      const data: PieData[] = notionProjects
        .map((input) => {
          const t = projectAnalysis[input.id];
          if (t) {
            return {
              id: input.id,
              key: input.id,
              value: t,
              sessionTime: convertToMMSS(t, true, true),
              label: getProjectTitle(input, "No title"),
              hexcolor: Math.floor(Math.random() * 16777215).toString(16),
            };
          } else {
            return null;
          }
        })
        .filter(notEmpty);
      setFileredData(data);
      setFileredTimesheets(
        projectTimesheets
          .map((ts) => {
            const pr = notionProjects.find((pr) => pr.id == ts.projectId);
            if (pr)
              return {
                ...ts,
                projectName: getProjectTitle(pr),
                href: pr.url,
              };
            else return null;
          })
          .filter(notEmpty)
      );
    }
  }, [notionProjects, projectAnalysis, projectTimesheets]);

  return [filteredData, filteredTimesheets];
}
