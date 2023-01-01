// this will do jobs regarding synchronization and working with pomodoro timer
// save project timeline on pause

import { useRef } from "react";
import { TimerLabelType } from "../../utils/reducer";
import { useStateValue } from "../../utils/reducer/Context";
import usePomoDoro from "../Pomodoro/usePomoDoro";
import useClickSound from "../Sound/useClickSound";
import useNotificationSound from "../Sound/useNotificationSound";
import { useProjectTimer } from "../Storage/useProjectTimer";

export default function useSyncPomo() {
  const [{ projectId, timerValue, sessionValue }] = useStateValue();
  const { clockifiedValue, handlePlayPause, resetTimer, restartPomo } =
    usePomoDoro({
      onEnd,
      onPomoPause,
      onStart,
    });
  const [projectTime, setProjectTime] = useProjectTimer(projectId);
  const {
    tickingSlow: { play: tickingSlowPlay, stop: tickingSlowStop },
  } = useClickSound();

  const { bellRingPlay, alarmWoodPlay } = useNotificationSound();

  const elapsedTime = useRef(0);

  function togglePlayPause() {
    handlePlayPause();
  }

  function onPomoPause(type: TimerLabelType) {
    tickingSlowStop();
    if (type == "Session") {
      //when session ends save session time
      saveProjectTime();
    }
  }

  // this will be excecuted when sessions switch happens during running pomo
  function onEnd(type: TimerLabelType) {
    if (type == "Session") {
      bellRingPlay();
      //when session ends save session time
      saveProjectTime();
    } else {
      alarmWoodPlay();
    }
  }

  function onStart() {
    setTimeout(tickingSlowPlay, 1000);
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
      elapsedTime.current =
        timerValue == 0 ? 0 : getSessionInSecond() - timerValue; //if timer value is having some value then delete session time from there
    }
  }

  return { clockifiedValue, togglePlayPause, resetTimer, restartPomo };
}
