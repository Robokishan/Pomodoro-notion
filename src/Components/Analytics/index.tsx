import { usePomoState } from "@/utils/Context/PomoContext/Context";
import { actionTypes } from "@/utils/Context/PomoContext/reducer";
import React from "react";
import Piechart, { PieData } from "../PieChart";
import TimesheetList from "../TimesheetList";

type Props = {
  pieData: PieData[];
};

export default function Analytics({ pieData }: Props) {
  const [, dispatch] = usePomoState();

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
    <>
      <Piechart onProjectSelect={onProjectSelect} data={pieData} />
      <TimesheetList />
    </>
  );
}
