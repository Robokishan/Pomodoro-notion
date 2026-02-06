import { useUserState } from "@/utils/Context/UserContext/Context";
import { actionTypes } from "@/utils/Context/UserContext/reducer";
import { ResponsivePie } from "@nivo/pie";
import React from "react";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import { useTheme } from "../../utils/Context/ThemeContext";
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

const darkNivoTheme = {
  background: "transparent",
  text: {
    fontSize: 16,
    fill: "#d1d5db",
  },
  tooltip: {
    container: {
      background: "#1f2937",
      color: "#d1d5db",
      fontSize: 14,
      borderRadius: "6px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    },
  },
  labels: {
    text: {
      fill: "#d1d5db",
    },
  },
};

const lightNivoTheme = {
  background: "transparent",
  text: {
    fontSize: 16,
    fill: "#333333",
  },
  tooltip: {
    container: {
      background: "#ffffff",
      color: "#333333",
      fontSize: 14,
      borderRadius: "6px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },
  labels: {
    text: {
      fill: "#333333",
    },
  },
};

function Piechart({ data, onProjectSelect }: Props) {
  const [{ busyIndicator }] = usePomoState();
  const { resolvedTheme } = useTheme();

  const [{ startDate, endDate }, userDispatch] = useUserState();

  const isDark = resolvedTheme === "dark";

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
          padAngle={2}
          cornerRadius={5}
          activeOuterRadiusOffset={8}
          borderWidth={2}
          arcLinkLabel={(d) => d.data.label}
          arcLabel={(d) => d.data.sessionTime}
          tooltip={(d) => {
            return (
              <div
                style={{
                  background: isDark ? "#1f2937" : "#ffffff",
                  color: isDark ? "#d1d5db" : "#333333",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  boxShadow: isDark
                    ? "0 4px 12px rgba(0,0,0,0.4)"
                    : "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex flex-row items-center justify-center gap-2">
                  <div
                    className="h-2 w-2"
                    style={{ background: d.datum.color }}
                  />
                  <span>{d.datum.data.label}</span>
                </div>
                <span className="pl-4">{d.datum.data.sessionTime}</span>
              </div>
            );
          }}
          borderColor={{
            from: "color",
            modifiers: [["darker", isDark ? 0.4 : 0.2]],
          }}
          arcLinkLabelsTextColor={isDark ? "#d1d5db" : "#374151"}
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
          theme={isDark ? darkNivoTheme : lightNivoTheme}
        />
      ) : (
        <h2 className="w-ful font-quicksand mt-10 text-center text-3xl font-extrabold leading-normal text-heading">
          No Tasks for analysis
        </h2>
      )}
    </div>
  );
}

export default Piechart;
