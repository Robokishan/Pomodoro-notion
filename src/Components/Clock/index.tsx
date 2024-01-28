import React from "react";
import useClock from "../../hooks/useClock";

export default function Clock() {
  const { hours, minutes, ampm, date, month, year, suffix } = useClock();
  return (
    <>
      <h4 className="relative mt-6 flex text-2xl">
        <span>{hours}</span>
        <span className="blink relative w-[0.57rem]">
          <span className="absolute -mt-[1px] ">:</span>
        </span>
        <span>{minutes}</span>
        <span className="ml-1 ">{ampm}</span>
      </h4>
      <h4 className="relative mt-2 flex gap-1  text-xl">
        <div>
          <span>{date}</span>
          <sup className=" text-xs">{suffix}</sup>
        </div>
        <span>{month}</span>
        <span>{year.slice(-2)}</span>
      </h4>
    </>
  );
}
