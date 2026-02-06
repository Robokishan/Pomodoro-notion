import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import { format, getUnixTime, isWeekend, startOfDay, endOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { DateRangePicker, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import OutsideClickHandler from "react-outside-click-handler";

const extraDot = (
  <div
    style={{
      height: "5px", width: "5px", borderRadius: "100%",
      background: "orange", position: "absolute", top: 2, right: 2,
    }}
  />
);

function customDayContent(day: Date) {
  return (
    <div>
      {isWeekend(day) && extraDot}
      <span>{format(day, "d")}</span>
    </div>
  );
}

const getTodayRange = () => ({
  startDate: startOfDay(new Date()),
  endDate: endOfDay(new Date()),
  key: "selection",
});

export default function DateRange({
  dateRanges,
  onDateRangeChange,
}: {
  dateRanges: Range;
  onDateRangeChange: ({ startDate, endDate }: { startDate: number; endDate: number }) => void;
}) {
  const [showCalendar, setVisibility] = useState(false);
  const [calendarDates, setCalendarDates] = useState<[Range]>([getTodayRange()]);

  const handleDateRangeChange = (range: RangeKeyDict) => {
    if (range?.selection && range.selection?.startDate && range.selection?.endDate) {
      const startDate = startOfDay(range.selection.startDate);
      const endDate = endOfDay(
        range.selection.endDate > endOfDay(new Date()) ? new Date() : range.selection.endDate
      );
      const selection: ReturnType<typeof getTodayRange> = {
        key: range.selection.key as string,
        startDate,
        endDate,
      };
      setCalendarDates([selection]);
      onDateRangeChange({
        startDate: getUnixTime(selection.startDate),
        endDate: getUnixTime(selection.endDate),
      });
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => handleDateRangeChange({ selection: getTodayRange() }), []);

  return (
    <div className="relative m-auto w-fit ">
      <OutsideClickHandler onOutsideClick={() => setVisibility(false)}>
        <div
          onClick={() => setVisibility((prev) => !prev)}
          className="mt-5 flex cursor-pointer select-none items-center gap-3 rounded-md bg-surface-muted p-3 text-muted shadow-xl"
        >
          <span>{dateRanges?.endDate ? format(dateRanges?.endDate, "yyyy-MM-dd") : ""}</span>
          <ArrowLongLeftIcon className="h-5 w-5" />
          <span>{dateRanges?.startDate ? format(dateRanges?.startDate, "yyyy-MM-dd") : ""}</span>
        </div>
        <div className="absolute -left-[110%] top-14 z-50 shadow-xl">
          {showCalendar && (
            <DateRangePicker
              preventSnapRefocus={true}
              onChange={(item: RangeKeyDict) => handleDateRangeChange(item)}
              moveRangeOnFirstSelection={false}
              maxDate={new Date()}
              dayContentRenderer={customDayContent}
              months={2}
              ranges={calendarDates}
              direction="horizontal"
              calendarFocus="backwards"
            />
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
}
