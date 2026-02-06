import React, { useCallback, useEffect, useMemo, useRef } from "react";
import useFormattedData from "../../hooks/useFormattedData";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, endOfDay, getUnixTime, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useUserState } from "@/utils/Context/UserContext/Context";
import { actionTypes } from "@/utils/Context/UserContext/reducer";
import { convertToMMSS } from "../../hooks/Pomodoro/Time/useTime";

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

  const clickRef = useRef<any>(null);

  const eventList: Event[] = useMemo(() => {
    return projectTimesheets.map((sheet) => ({
      title: sheet.projectName,
      start: new Date(sheet.startTime.value),
      end: new Date(sheet.createdAt),
      resource: sheet.timerValue,
    }));
  }, [projectTimesheets]);

  useEffect(() => {
    return () => window.clearTimeout(clickRef?.current);
  }, []);

  const onSelectEvent = useCallback((calEvent: Event) => {
    window.clearTimeout(clickRef?.current);
    clickRef.current = window.setTimeout(() => {
      if (calEvent.start && calEvent.end)
        window.alert(
          JSON.stringify(
            {
              startDate: format(calEvent.start, "dd/MM/yyyy hh:mm a"),
              endDate: format(calEvent.end, "dd/MM/yyyy hh:mm a"),
              title: calEvent.title,
              duration: convertToMMSS(calEvent.resource, true, true),
            },
            null,
            2
          )
        );
    }, 100);
  }, []);

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
      popup={true}
      selectable={true}
      localizer={localizer}
      events={eventList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 700 }}
      onSelectEvent={onSelectEvent}
    />
  );
}
