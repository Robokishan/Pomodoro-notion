import { useCallback, useEffect, useRef } from "react";
import WorkerInterval from "./workerInterval";

export const useWorkerInterval = () => {
  const workerInterval = useRef<WorkerInterval | null>(null);

  useEffect(() => {
    workerInterval.current = new WorkerInterval();
  }, []);

  // using useCallback to cache this func is neccessary otherwise react will rerender all the time and timer won't run
  // theoratically
  // think usecallback and useref as not following react rules that is the way it is caching these things

  const clearInterval = useCallback((id: string): void => {
    if (workerInterval.current) workerInterval.current.clearInterval(id);
  }, []);
  const setInterval = useCallback(
    (callback: () => void, delay: number): string | null => {
      if (workerInterval.current)
        return workerInterval.current.setInterval(callback, delay);
      else return null;
    },
    []
  );

  return { clearInterval, setInterval };
};
