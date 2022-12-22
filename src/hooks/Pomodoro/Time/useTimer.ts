import { useCallback, useState } from "react";
import useInterval from "./useInterval";

type ReturnType = [number, boolean, (startTime: boolean) => void, () => void];

// timer hook which counts down
// do not use context in this hook
export default function useTimer(
  timerValue: number,
  interval = 1000,
  {
    onPause,
    onStart,
    onReset,
    onTick,
  }: {
    onPause?: () => void;
    onStart?: () => void;
    onReset?: () => void;
    onTick?: () => void;
  } = {
    onPause: undefined,
    onStart: undefined,
    onReset: undefined,
    onTick: undefined,
  }
): ReturnType {
  const [timer, setTimer] = useState(timerValue);
  const [isRunning, setRunning] = useState(false); //do not use setter function anywhere

  useInterval(
    () => {
      if (onTick) onTick();
      setTimer((prev) => prev - 1);
    },
    isRunning ? interval : null
  );

  const toggleTimer = useCallback(
    (startTime: boolean) => {
      if (startTime && onStart) onStart();
      else if (!startTime && isRunning && onPause) onPause();
      setRunning(startTime);
    },
    [isRunning, onPause, onStart]
  );

  const resetTimer = () => {
    toggleTimer(false);
    setTimer(timerValue);
    if (onReset) onReset();
  };

  return [timer, isRunning, toggleTimer, resetTimer];
}
