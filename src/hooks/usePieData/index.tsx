import { useEffect, useState } from "react";
import { PieData } from "../../Components/PieChart";
import { Result } from "../../utils/types/database/databaseQuery";

type Props = {
  inputData: Result[];
};

export default function usePieData({ inputData }: Props): [PieData[]] {
  const [filteredData, setFileredData] = useState<PieData[]>([]);

  useEffect(() => {
    setFileredData(
      inputData
        .map((input) => {
          return {
            id: input.id,
            key: input.id,
            value: 100,
            label:
              (input.properties?.Name?.title &&
                input.properties?.Name?.title?.length > 0 &&
                input.properties?.Name?.title[0]?.text?.content) ||
              "No title",
            color: Math.floor(Math.random() * 16777215).toString(16),
          };
        })
        .filter((f) => f)
    );
  }, [inputData]);

  return [filteredData];
}
