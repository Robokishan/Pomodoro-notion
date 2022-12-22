import Piechart, { PieData } from "../PieChart";
import Timer from "../Timer";

export default function Views({
  activeTab,
  pieData,
  projectName = "Please select project",
}: {
  activeTab: string;
  pieData: PieData[];
  projectName?: string;
}) {
  return (
    <div className="relative w-full ">
      <div
        className={`${
          activeTab === "analytics" ? "visible" : "invisible"
        } absolute w-[100%]`}
      >
        <Piechart data={pieData} />
      </div>
      <div
        className={`${
          activeTab === "timer" ? "visible" : "invisible"
        } absolute flex w-full items-center justify-center `}
      >
        <Timer timerLabel="Session" projectName={projectName} />
      </div>
      <div
        className={`${
          activeTab === "noise" ? "visible" : "invisible"
        } absolute flex w-full items-center justify-center `}
      >
        <h1>Right now no noise added</h1>
      </div>
    </div>
  );
}
