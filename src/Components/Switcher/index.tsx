import React, { ReactElement, useMemo } from "react";

export type SwitcherChildType = {
  label: string;
  value: string;
  labelIcon?: JSX.Element;
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
  width = 130,
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

  return (
    <div className={`flex ${margin || "mt-0"} items-center justify-center`}>
      {title && (
        <p className="m-0 text-lg font-semibold text-gray-600">{title}</p>
      )}
      <div
        className="relative ml-4 flex rounded-3xl bg-white p-1 shadow-md"
        style={tabWrapperStyle}
      >
        <div
          className="duration-250 absolute flex h-full rounded-3xl bg-slate-400/30 transition-transform ease-out"
          style={{
            width: `${width}px`,
            transform: `translateX(${selectedIndex * 100}%)`,
            // borderRadius: gliderBorderRadius,
            height: height,
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
              className=" relative flex h-full w-full cursor-pointer select-none items-center justify-center rounded-3xl font-semibold text-gray-600 transition-colors duration-150 ease-in"
              style={{
                width: `${width}px`,
                // borderRadius: gliderBorderRadius,
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
