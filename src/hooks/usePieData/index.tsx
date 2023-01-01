import { useEffect, useState } from "react";
import { PieData } from "../../Components/PieChart";
import { Result } from "../../types/database/databaseQuery";
import { notEmpty } from "../../types/notEmpty";
import useInterval from "../Pomodoro/Time/useInterval";
import { convertToMMSS } from "../Pomodoro/Time/useTime";
import { PROJECT_KEY } from "../Storage/storage.constant";
import { useLocalStorage } from "../Storage/useLocalStorage";

type ID = string;
type TIMER_VALUE = number;
type ProjectTimer = Record<ID, TIMER_VALUE>;

interface Projects {
  projects: ProjectTimer;
}

type Props = {
  inputData: Result[];
};

export default function usePieData({ inputData }: Props): [PieData[]] {
  const [filteredData, setFileredData] = useState<PieData[]>([]);

  // TODO: save it inside context
  const [preservedData, , fetch] = useLocalStorage<Projects>(PROJECT_KEY, {
    projects: {},
  });

  // Poll localstorage for update since
  // TODO: fetch after push happens in persist database
  useInterval(() => {
    fetch();
  }, 1000);

  useEffect(() => {
    const data: PieData[] = inputData
      .map((input) => {
        const t = preservedData.projects[input.id];

        if (t) {
          return {
            id: input.id,
            key: input.id,
            value: t,
            sessionTime: convertToMMSS(t, true, true),
            label:
              (input.properties?.Name?.title &&
                input.properties?.Name?.title?.length > 0 &&
                input.properties?.Name?.title[0]?.text?.content) ||
              "No title",
            hexcolor: Math.floor(Math.random() * 16777215).toString(16),
          };
        } else {
          return null;
        }
      })
      .filter(notEmpty);
    setFileredData(data);
  }, [inputData, preservedData.projects]);

  return [filteredData];
}
