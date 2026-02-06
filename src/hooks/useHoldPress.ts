import { useEffect, useRef, useState } from "react";
import useInterval from "./Pomodoro/Time/useInterval";

export default function useHoldPress(
  callback: () => void,
  disabled: boolean,
  { delay, startDelay } = {
    delay: 100,
    startDelay: 400,
  }
) {
  const [sticky, setSticky] = useState(false);
  const holdTriggerred = useRef<boolean>(false);
  const timeOut = useRef<ReturnType<typeof setTimeout> | null>(null);

  const HoldTrigger = () => {
    holdTriggerred.current = true;
    callback();
  };

  useInterval(HoldTrigger, !disabled && sticky ? delay : null);

  useEffect(() => {
    if (!disabled) setSticky(false);
  }, [disabled]);

  function start() {
    timeOut.current = setTimeout(() => {
      setSticky(true);
    }, startDelay);
  }

  function clear(shouldTrigger = true) {
    if (timeOut.current) clearTimeout(timeOut.current);
    if (!holdTriggerred.current && !disabled && shouldTrigger) callback();
    else if (holdTriggerred.current) setSticky(false);
    holdTriggerred.current = false;
  }

  return {
    onMouseDown: start,
    onMouseUp: () => clear(),
    onMouseLeave: () => clear(false),
    disabled,
    // onTouchStart: (e) => start(e), touch is not working test required
    // onTouchEnd: (e) => clear(e),
  };
}
