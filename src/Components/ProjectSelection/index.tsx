import dynamic from "next/dynamic";
import React from "react";
import PlaceHolderLoader from "../PlaceHolderLoader";
import { useTheme } from "../../utils/Context/ThemeContext";
const Select = dynamic(() => import("react-select"), {
  loading: () => <PlaceHolderLoader />,
});

type Props = {
  disabled: boolean;
  value: Record<string, unknown> | undefined | null;
  projects: Array<Record<string, unknown>>;
  handleSelect: ({ label, value }: { label: string; value: string }) => void;
};

const colourStyles = ({
  isDark = false,
  backgroundColor = "white",
  margin = "unset",
  padding = "12px 16px 12px, 16px",
  border = `1px solid #DAE6EF`,
  borderRadius = "6px",
  minWidth = "310px",
  controlFontWeight = 400,
  whiteBackground = "white",
  minHeight = "48px",
}) => {
  const darkBg = "#1f2937";
  const darkBorder = "#374151";
  const darkText = "#d1d5db";

  return {
    menuPortal: (base: any) => {
      const { ...rest } = base;
      return { ...rest, zIndex: 9999 };
    },
    control: (styles: any) => {
      return {
        ...styles,
        fontWeight: controlFontWeight,
        minWidth,
        boxShadow: "unset",
        cursor: "pointer",
        margin,
        padding,
        backgroundColor: isDark ? darkBg : backgroundColor,
        border: isDark ? `1px solid ${darkBorder}` : border,
        color: isDark ? darkText : undefined,
        "&:hover": {
          fontWeight: 0,
          backgroundColor: isDark ? "#374151" : whiteBackground,
        },
        borderRadius,
        minHeight,
      };
    },
    menu: (styles: any) => ({
      ...styles,
      minWidth,
      boxShadow: isDark ? `0px 2px 24px #00000050` : `0px 2px 24px #DAE6EF`,
      backgroundColor: isDark ? darkBg : "white",
      zIndex: 99999, //fix so that it can overlap over other components
    }),
    option: (styles: any, { isFocused, isSelected }: any) => ({
      ...styles,
      backgroundColor: isSelected
        ? isDark ? "#4b5563" : "#e5e7eb"
        : isFocused
        ? isDark ? "#374151" : "#f3f4f6"
        : isDark ? darkBg : "white",
      color: isDark ? darkText : "#374151",
      cursor: "pointer",
    }),
    singleValue: (styles: any) => ({
      ...styles,
      color: isDark ? darkText : "#374151",
    }),
    input: (styles: any) => ({
      ...styles,
      color: isDark ? darkText : "#374151",
    }),
    placeholder: (styles: any) => ({
      ...styles,
      color: isDark ? "#6b7280" : "#9ca3af",
    }),
    dropdownIndicator: (style: any) => ({
      ...style,
      color: isDark ? "#6b7280" : undefined,
    }),
    clearIndicator: (style: any) => ({
      ...style,
      color: isDark ? "#6b7280" : undefined,
      "&:hover": {
        color: isDark ? "#9ca3af" : undefined,
      },
    }),
    menuList: (styles: any) => ({
      ...styles,
      padding: "0px",
      borderRadius,
    }),
    indicatorSeparator: (styles: any) => ({ ...styles, display: "none" }),
  };
};

export default function ProjectSelection({
  value,
  projects,
  disabled,
  handleSelect,
}: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Select
      isDisabled={disabled}
      value={value}
      id="projectlist-select"
      instanceId="projectlist-select"
      styles={colourStyles({ isDark })}
      options={projects}
      isClearable={true}
      placeholder="Select Project"
      onChange={(e: any) => {
        handleSelect(e);
      }}
    />
  );
}
