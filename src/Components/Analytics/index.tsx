import { usePomoState } from "@/utils/Context/PomoContext/Context";
import { actionTypes } from "@/utils/Context/PomoContext/reducer";
import React, { useState } from "react";
import Piechart, { PieData } from "../PieChart";
import TimesheetList from "../TimesheetList";
import Switcher, { SwitcherChildType } from "../Switcher";
import WeekViewCalendar from "../Calendar";

type Props = {
  pieData: PieData[];
};

const filters: SwitcherChildType[] = [
  {
    label: "Chart",
    value: "chartview",
  },
  {
    label: "Calendar",
    value: "calendarview",
  },
];

export default function Analytics({ pieData }: Props) {
  const [, dispatch] = usePomoState();

  const [viewType, setViewType] = useState<string>(filters[0]?.value as string);

  const onProjectSelect = (proj: { label: string; value: string } | null) => {
    if (!proj)
      dispatch({
        type: actionTypes.RESET_TIMERS,
      });

    dispatch({
      type: actionTypes.SET_PROJECTID,
      payload: proj,
    });
    dispatch({
      type: actionTypes.FROZE_POMODORO,
      payload: !proj,
    });
  };

  return (
    <div className="relative overflow-y-scroll ">
      <Switcher
        margin="my-6"
        width={200}
        height="40px"
        filters={filters}
        value={viewType}
        onClick={(selectedView) => setViewType(selectedView)}
      />

      <div
        className={`${viewType === "chartview" ? "block" : "hidden"} w-[100%]`}
      >
        <Piechart onProjectSelect={onProjectSelect} data={pieData} />
        <TimesheetList />
      </div>

      <div
        className={`${
          viewType === "calendarview" ? "block" : "hidden"
        }   w-full items-center justify-center `}
      >
        <h1>This is chart</h1>
      </div>
    </div>
  );
}
