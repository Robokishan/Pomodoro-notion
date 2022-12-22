import { ResponsivePie } from "@nivo/pie";
import React from "react";

export type PieData = {
  id: string;
  key: string;
  label: string;
  value: number;
  color: string;
};

type Props = {
  data: PieData[];
};

export default function Piechart({ data }: Props) {
  return (
    <div className="h-[600px] w-full border-2 border-dotted border-red-600">
      <ResponsivePie
        onClick={({ data }) => {
          console.log(
            `all the people that ${data["id"]} for ${data["key"]} = ${data["value"]}`
          );
        }}
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={2}
        arcLinkLabel="label"
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={20}
        arcLinkLabelsTextColor="#374151"
        // arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        // arcLabelsSkipAngle={10}
        arcLabelsSkipAngle={20}
        arcLabelsRadiusOffset={0.55}
        arcLinkLabelsThickness={3}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
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
    </div>
  );
}
