// this will do jobs regarding synchronization and working with pomodoro timer
// save project timeline on pause

import { useRef } from "react";
import { TimerLabelType } from "../../utils/reducer";
import { useStateValue } from "../../utils/reducer/Context";
import usePomoDoro from "../Pomodoro/usePomoDoro";
import { useProjectTimer } from "../Storage/useProjectTimer";

export default function useSyncPomo() {
  const [{ projectId, timerValue, sessionValue }] = useStateValue();
  const { clockifiedValue, handlePlayPause, resetTimer } = usePomoDoro({
    onEnd,
    onPomoPause,
  });
  const [projectTime, setProjectTime] = useProjectTimer(projectId);

  const elapsedTime = useRef(0);

  function togglePlayPause() {
    handlePlayPause();
  }

  function onPomoPause(type: TimerLabelType) {
    if (type == "Session") {
      //when session ends save session time
      saveProjectTime();
    }
  }

  function onEnd(type: TimerLabelType) {
    if (type == "Session") {
      //when session ends save session time
      saveProjectTime();
    }
  }

  const getSessionInSecond = () => sessionValue * 60;

  function saveProjectTime() {
    // persist project timer
    if (projectId) {
      setProjectTime({
        projectId,
        value:
          projectTime + getSessionInSecond() - timerValue - elapsedTime.current,
      });
      elapsedTime.current = getSessionInSecond() - timerValue;
    }
  }

  return { clockifiedValue, togglePlayPause, resetTimer };
}
