import Analytics from "../Analytics";
import Noises from "../Noises";
import { PieData } from "../PieChart";
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
        <Analytics pieData={pieData} />
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
