import packageJSON from "../../package.json";
import { zonedTimeToUtc } from "date-fns-tz";

export function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime(); //Timestamp
  let d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const sleep = (delay = 3000) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const getAppVersion = () => packageJSON.version;

export const getZonedUtcTime = (time = new Date()) => {
  return zonedTimeToUtc(
    time,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ).toISOString();
};

export const getUtcTimeRange = (time: string) => {
  return new Date(
    new Date(time).getTime() - 60000 * new Date().getTimezoneOffset()
  ).toISOString();
};
