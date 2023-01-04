import { actionTypes } from "../../utils/Context/PomoContext/reducer";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import Piechart, { PieData } from "../PieChart";
import Timer from "../Timer";
import TimesheetList from "../TimesheetList";
import Noises from "../Noises";

export default function Views({
  activeTab,
  pieData,
  projectName = "Please select project",
}: {
  activeTab: string;
  pieData: PieData[];
  projectName?: string;
}) {
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
    <div className="relative w-full ">
      <div
        className={`${
          activeTab === "analytics" ? "visible" : "invisible"
        } absolute w-[100%]`}
      >
        <Piechart onProjectSelect={onProjectSelect} data={pieData} />
        <TimesheetList />
      </div>

      <div
        className={`${
          activeTab === "timer" ? "visible" : "invisible"
        } absolute flex w-full items-center justify-center `}
      >
        <Timer projectName={projectName} />
      </div>
      <div
        className={`${
          activeTab === "noise" ? "visible" : "invisible"
        } absolute flex w-full items-center justify-center `}
      >
        <div className="w-full">
          <Noises />
        </div>
      </div>
    </div>
  );
}
