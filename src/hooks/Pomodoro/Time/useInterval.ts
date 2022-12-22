import { useEffect, useRef } from "react";

export default function useInterval(
  callback: () => void,
  delay?: number | null
) {
  const callbacRef = useRef<() => void>();

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbacRef.current = callback;
  });

  useEffect(() => {
    if (delay) {
      const interval = setInterval(() => {
        callbacRef.current?.();
      }, delay);
      return () => clearInterval(interval);
    }
  }, [delay]);
}
