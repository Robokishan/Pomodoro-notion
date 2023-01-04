import React from "react";

interface SoundLevelProps {
  handleChange: (level: number) => void;
  value: string;
  defaultValue: number;
  disabled?: boolean;
}

export default function SoundLevel({
  defaultValue,
  handleChange,
  value,
  disabled,
}: SoundLevelProps) {
  return (
    <>
      <input
        id={value}
        type="range"
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          e.stopPropagation();
          handleChange(e.target.valueAsNumber / 100);
        }}
        // value="50"
        defaultValue={defaultValue}
        className={`h-1 w-full cursor-pointer rounded-lg ${"bg-gray-200 accent-slate-400 dark:bg-gray-700"}`}
      ></input>
    </>
  );
}
