import { useWorkerInterval } from "@/utils/worker-interval";
import { useEffect, useRef } from "react";

export default function useInterval(
  callback: () => void,
  delay?: number | null
) {
  const callbacRef = useRef<() => void>();

  // web worker based setInterval to avoid sleeping of setInterval when tab is in background
  const { clearInterval, setInterval } = useWorkerInterval();

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbacRef.current = callback;
  });

  useEffect(() => {
    if (delay) {
      const interval = setInterval(() => {
        callbacRef.current?.();
      }, delay);
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [delay, clearInterval, setInterval]);
}
