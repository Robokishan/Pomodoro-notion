import { usePomoState } from "../../../utils/Context/PomoContext/Context";

function pad2(num: number) {
  return num > 9 ? num : `0${num}`;
}

export function useClockified(): string {
  // custom hook for seconds to mm:ss convert
  const [{ timerValue }] = usePomoState();
  return convertToMMSS(timerValue);
}

export function convertToMMSS(
  timerValue: number,
  showHour = false,
  optionalHour = false
): string {
  if (showHour) {
    const hh = Math.floor(timerValue / 3600);
    const min = Math.floor((timerValue % 3600) / 60);
    const sec = Math.floor((timerValue % 3600) % 60);
    const minutes = pad2(min);
    const seconds = pad2(sec);
    const hour = pad2(hh);

    return optionalHour || !!hh
      ? `${hour}:${minutes}:${seconds}`
      : `${minutes}:${seconds}`;
  } else {
    const min = Math.floor(timerValue / 60);
    const sec = timerValue - min * 60; // Math.floor(timerValue % 60);
    const minutes = pad2(min);
    const seconds = pad2(sec);
    return `${minutes}:${seconds}`;
  }
}
