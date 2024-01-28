import { useState, useEffect } from "react";

type ClockType = {
  hours: string;
  minutes: string;
  seconds: string;
  ampm: string;
  date: string;
  month: string;
  year: string;
  suffix: string;
};

const getTime = () => {
  const currentDate = new Date();
  const hours = String(currentDate.getHours() % 12 || 12);
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  const ampm = currentDate.getHours() >= 12 ? "PM" : "AM";
  const date = currentDate.getDate().toString();
  const suffix = ordinalSuffixOf(date);
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    currentDate
  );
  const year = currentDate.getFullYear().toString();
  return { hours, minutes, seconds, ampm, date, month, year, suffix };
};

export default function useClock(): ClockType {
  const [timeParts, setTimeParts] = useState<ClockType>(getTime());

  useEffect(() => {
    const id = setInterval(() => {
      setTimeParts(getTime());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return timeParts;
}

function ordinalSuffixOf(n: string): string {
  const num = parseInt(n, 10);
  if (num % 100 >= 11 && num % 100 <= 13) {
    return "th";
  }
  switch (num % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
