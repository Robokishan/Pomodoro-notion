// this will do jobs regarding synchronization and working with pomodoro timer
// save project timeline on pause

import { TimerLabelType } from "../../utils/reducer";
import { useStateValue } from "../../utils/reducer/Context";
import usePomoDoro from "../Pomodoro/usePomoDoro";
import { useProjectTimer } from "../Storage/useProjectTimer";

export default function useSyncPomo() {
  const [{ projectId, timerValue, timerLabel, sessionValue }] = useStateValue();
  const { clockifiedValue, handlePlayPause, resetTimer } = usePomoDoro({
    onEnd,
    onPomoPause,
  });
  const [projectTime, setProjectTime] = useProjectTimer(projectId);

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
    if (projectId) {
      setProjectTime({
        projectId,
        value: projectTime + getSessionInSecond() - timerValue,
      });
    }

    console.log(
      { value: projectTime + getSessionInSecond() - timerValue },
      projectTime,
      getSessionInSecond(),
      timerValue,
      timerLabel,
      projectId
    );
  }

  function resetPomoDoro() {
    resetTimer();
  }

  return { clockifiedValue, togglePlayPause, resetPomoDoro };
}
