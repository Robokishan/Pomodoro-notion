import React from "react";
import chroma, { Color } from "chroma-js";

export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

import Select, { StylesConfig } from "react-select";

const colourStyles: StylesConfig<ColourOption, true> = {
  control: (styles) => {
    return {
      ...styles,
      fontWeight: 400,
      width: "310px",
      boxShadow: "unset",
      cursor: "pointer",
      margin: "unset",
      backgroundColor: "white",
      border: `1px solid #DAE6EF`,
      "&:hover": {
        fontWeight: 0,
        backgroundColor: "white",
      },
      borderRadius: "6px",
      minHeight: "48px",
    };
  },
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    let color: Color;
    try {
      color = chroma(data.color);
    } catch (e) {
      //handle notion undentified colors
      console.error({ e, color: data.color });
      color = chroma("#D1D5E6");
    }
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.6).darken(0.6).css()
        : color.darken(0.8).alpha(0.7).css(),
      color: chroma.contrast(color, "white") > 2 ? "white" : "black",
      margin: "2px 0px",
      borderRadius: "2px",
      padding: "10px 25px",

      cursor: isDisabled ? "not-allowed" : "pointer",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.8).css()
          : undefined,
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.darken(0.6).alpha(0.7).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: chroma.contrast(data.color, "white") > 2 ? "white" : "black",
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: chroma.contrast(data.color, "white") > 2 ? "white" : "black",
    ":hover": {
      backgroundColor: data.color,
      color: "white",
    },
  }),
  menu: (styles) => ({
    ...styles,
    minWidth: "310px",
    boxShadow: `0px 2px 24px #DAE6EF`,
    zIndex: 99999, //fix so that it can overlap over other components
  }),
  menuList: (styles) => ({
    ...styles,
    borderRadius: "6px",
  }),
  menuPortal: (base) => {
    const { ...rest } = base;
    return { ...rest, zIndex: 9999 };
  },
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
};

interface Props {
  options: ColourOption[];
  disabled?: boolean;
  handleSelect: (e: any) => void;
}

export default function MultiSelect({
  options,
  disabled = false,
  handleSelect,
}: Props) {
  return (
    <Select
      closeMenuOnSelect={false}
      isMulti
      options={options}
      styles={colourStyles}
      isDisabled={disabled}
      id="notion-tags-select"
      instanceId="notion-tags-select"
      isClearable={true}
      placeholder="Select tags"
      onChange={(e: any) => {
        handleSelect(e);
      }}
    />
  );
}
