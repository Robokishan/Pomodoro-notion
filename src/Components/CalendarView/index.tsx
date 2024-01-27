import React, { useMemo } from "react";
import useFormattedData from "../../hooks/useFormattedData";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useUserState } from "@/utils/Context/UserContext/Context";
import { actionTypes } from "@/utils/Context/UserContext/reducer";
import { endOfDay, getUnixTime, startOfDay } from "date-fns";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView() {
  const [{ startDate }, userDispatch] = useUserState();
  const [, projectTimesheets] = useFormattedData();

  const eventList: Event[] = useMemo(() => {
    return projectTimesheets.map((sheet) => ({
      title: sheet.projectName,
      start: new Date(sheet.startTime.value),
      end: new Date(sheet.createdAt),
    }));
  }, [projectTimesheets]);

  return (
    <Calendar
      defaultView="month"
      defaultDate={new Date(startDate * 1000)}
      onRangeChange={(_range: Date[] | { start: Date; end: Date }) => {
        const startDate = Array.isArray(_range) ? _range[0] : _range.start;
        const endDate = Array.isArray(_range)
          ? _range[_range.length - 1]
          : _range.end;

        if (startDate && endDate)
          userDispatch({
            type: actionTypes.SET_DATES,
            payload: {
              startDate: getUnixTime(startOfDay(startDate)),
              endDate: getUnixTime(endOfDay(endDate)),
            },
          });
      }}
      localizer={localizer}
      events={eventList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 700 }}
    />
  );
}
