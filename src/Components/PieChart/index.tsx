import { useUserState } from "@/utils/Context/UserContext/Context";
import { actionTypes } from "@/utils/Context/UserContext/reducer";
import { ResponsivePie } from "@nivo/pie";
import React from "react";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import DateRange from "../DateRange";

export type PieData = {
  id: string;
  key: string;
  label: string;
  value: number;
  hexcolor: string;
  sessionTime: string;
};

type Props = {
  data: PieData[];
  onProjectSelect: ({ label, value }: { label: string; value: string }) => void;
};

function Piechart({ data, onProjectSelect }: Props) {
  const [{ busyIndicator }] = usePomoState();

  const [{ startDate, endDate }, userDispatch] = useUserState();

  return (
    <div className="h-[600px] w-full">
      <DateRange
        dateRanges={{
          startDate: new Date(startDate * 1000),
          endDate: new Date(endDate * 1000),
        }}
        onDateRangeChange={(dates) =>
          userDispatch({
            type: actionTypes.SET_DATES,
            payload: dates,
          })
        }
      />
      {data.length > 0 ? (
        <ResponsivePie
          isInteractive={!busyIndicator}
          onClick={({ data }) => {
            onProjectSelect({
              label: data.label,
              value: data.id,
            });
          }}
          data={data}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.6}
          padAngle={2} //for gap between charts
          cornerRadius={5}
          activeOuterRadiusOffset={8}
          borderWidth={2}
          arcLinkLabel={(d) => d.data.label}
          arcLabel={(d) => d.data.sessionTime}
          tooltip={(d) => {
            //for unkown "#AEAEAE" gray color
            return (
              <div className="h-full w-full rounded-md bg-white py-1 px-2">
                <div className="flex flex-row items-center justify-center gap-2  ">
                  <div
                    className={`h-2 w-2`}
                    style={{
                      background: d.datum.color,
                    }}
                  />
                  <span>{d.datum.data.label}</span>
                </div>
                <span className="pl-4">{d.datum.data.sessionTime}</span>
              </div>
            );
          }}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsTextColor="#374151"
          arcLinkLabelsStraightLength={15}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          arcLabelsRadiusOffset={0.55}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          theme={{
            fontSize: 16,
          }}
        />
      ) : (
        <h2 className="w-ful font-quicksand mt-10 text-center text-3xl font-extrabold leading-normal text-gray-700">
          No Tasks for analysis
        </h2>
      )}
    </div>
  );
}

export default Piechart;
