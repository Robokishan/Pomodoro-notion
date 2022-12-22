import React from "react";
import Select from "react-select";

type Props = {
  disabled: boolean;
  value: Record<string, unknown> | undefined | null;
  projects: Array<Record<string, unknown>>;
  handleSelect: ({ label, value }: { label: string; value: string }) => void;
};

const colourStyles = ({
  backgroundColor = "white",
  margin = "unset",
  padding = "12px 16px 12px, 16px",
  border = `1px solid #DAE6EF`,
  borderRadius = "6px",
  minWidth = "310px",
  controlFontWeight = 400,
  whiteBackground = true,
  minHeight = "48px",
}) => {
  return {
    menuPortal: (base) => {
      const { ...rest } = base;
      return { ...rest, zIndex: 9999 };
    },
    control: (styles) => {
      return {
        ...styles,
        fontWeight: controlFontWeight,
        minWidth,
        boxShadow: "unset",
        cursor: "pointer",
        margin,
        padding,
        backgroundColor,
        border: border,
        "&:hover": {
          fontWeight: 0,
          backgroundColor: whiteBackground,
        },
        borderRadius,
        minHeight,
      };
    },
    menu: (styles) => ({
      ...styles,
      minWidth,
      boxShadow: `0px 2px 24px #DAE6EF`,
      zIndex: 99999, //fix so that it can overlap over other components
    }),
    dropdownIndicator: (style) => ({
      ...style,
    }),
    menuList: (styles) => ({
      ...styles,
      padding: "0px",
      borderRadius,
    }),
    indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
  };
};

export default function ProjectSelection({
  value,
  projects,
  disabled,
  handleSelect,
}: Props) {
  return (
    <Select
      isDisabled={disabled}
      value={value}
      id="projectlist-select"
      instanceId="projectlist-select"
      styles={colourStyles({})}
      options={projects}
      isClearable={true}
      placeholder="Select Project"
      onChange={(e: any) => {
        handleSelect(e);
      }}
    />
  );
}
