import dynamic from "next/dynamic";
const Noises = dynamic(() => import("../Noises"), {
  loading: () => <div>Loading...</div>,
});
const Analytics = dynamic(() => import("../Analytics"), {
  loading: () => <div>Loading...</div>,
});
const Timer = dynamic(() => import("../Timer"), {
  loading: () => <div>Loading...</div>,
});

const Notes = dynamic(() => import("../Notes"), {
  loading: () => <div>Loading...</div>,
});

import { PieData } from "../PieChart";

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
        className={`${activeTab === "analytics" ? "block" : "hidden"
          } absolute w-[100%]`}
      >
        <Analytics pieData={pieData} />
      </div>

      <div
        className={`${activeTab === "timer" ? "flex" : "hidden"
          } absolute  w-full items-center justify-center `}
      >
        <Timer projectName={projectName} />
      </div>
      <div
        className={`${activeTab === "noise" ? "flex" : "hidden"
          } absolute  w-full items-center justify-center `}
      >
        <div className="w-full">
          <Noises />
        </div>
      </div>
      <div
        className={`${activeTab === "notes" ? "flex" : "hidden"
          } absolute  w-full items-center justify-center `}
      >
        <div className="w-full">
          <Notes />
        </div>
      </div>
    </div>
  );
}
