import React, { ReactElement, useMemo } from "react";

export type SwitcherChildType = {
  label: string;
  value: string;
  labelIcon?: React.ReactNode;
  labelIconMargin?: string;
  labelIconPadding?: string;
};

type TabWrapperStyleType = {
  padding?: string;
  margin?: string;
  border?: string;
  backgroundColor?: string;
  boxShadow?: string;
  columnGap?: string;
  borderRadius?: string;
};

type SwitcherProps = {
  onClick: (selected: string) => void;
  filters: SwitcherChildType[];
  title?: string;
  margin?: string;
  value: string;
  width?: number;
  checkedBackgroundColor?: string;
  tabWrapperStyle?: Partial<TabWrapperStyleType>;
  name?: string;
  gliderBorderRadius?: string;
  height?: string | number;
  gliderMargin?: string;
};

export default function Switcher({
  onClick,
  filters,
  title,
  margin,
  value,
  width,
  height = 40,
  checkedBackgroundColor,
  tabWrapperStyle,
  name = "tabs",
  gliderBorderRadius = "24px",
  gliderMargin = "0",
}: SwitcherProps): ReactElement {
  const switcherId = useMemo(() => `radio-${Date.now()}`, []);
  const selectedIndex = useMemo(() => {
    return filters.findIndex((option) => option.value === value);
  }, [value, filters]);

  const tabCount = filters.length;
  const gliderWidthPercent = 100 / tabCount;

  return (
    <div className={`flex ${margin || "mt-0"} w-full items-center justify-center px-4 sm:px-0`}>
      {title && (
        <p className="m-0 text-lg font-semibold text-heading">{title}</p>
      )}
      <div
        className="relative flex w-full max-w-md rounded-3xl bg-surface-card p-1 shadow-md sm:ml-4"
        style={tabWrapperStyle}
      >
        <div
          className="duration-250 absolute top-1 bottom-1 rounded-3xl bg-surface-active/40 transition-transform ease-out"
          style={{
            width: `${gliderWidthPercent}%`,
            transform: `translateX(${selectedIndex * 100}%)`,
            margin: gliderMargin,
          }}
        />
        {filters.map((filter, index) => (
          <React.Fragment key={`radio-group-${index}`}>
            <input
              onChange={() => onClick(filter.value)}
              type="radio"
              id={`${switcherId}-${index + 1}`}
              name={name}
              checked={value ? filter.value === value : undefined}
              className="hidden"
            />
            <label
              htmlFor={`${switcherId}-${index + 1}`}
              className="relative z-10 flex flex-1 cursor-pointer select-none items-center justify-center rounded-3xl py-2 font-semibold text-heading transition-colors duration-150 ease-in"
              style={{
                height: height,
                margin: gliderMargin,
              }}
            >
              {filter.labelIcon && (
                <span
                  className="mr-1"
                  style={{
                    margin: filter.labelIconMargin,
                    padding: filter.labelIconPadding,
                  }}
                >
                  {filter.labelIcon}
                </span>
              )}
              {filter.label}
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
