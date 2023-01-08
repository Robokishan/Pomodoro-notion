// this will do jobs regarding synchronization and working with pomodoro timer
// save project timeline on pause

import { useRef } from "react";
import { toast } from "react-toastify";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import { TimerLabelType } from "../../utils/Context/PomoContext/reducer";
import usePomoDoro from "../Pomodoro/usePomoDoro";
import useClickSound from "../Sound/useClickSound";
import useNotificationSound from "../Sound/useNotificationSound";
import { usePomoClient } from "../Storage/usePomoClient";

export default function useSyncPomo() {
  const [{ project, databaseId, timerValue, sessionValue }] = usePomoState();
  const { clockifiedValue, handlePlayPause, resetTimer, restartPomo } =
    usePomoDoro({
      onEnd,
      onPomoPause,
      onStart,
      onReset,
    });

  const [refetch, addTimesheet] = usePomoClient();
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
      saveProjectTime();
      //when session ends save session time
      bellRingPlay();
    } else {
      alarmWoodPlay();
    }
  }

  function onStart() {
    setTimeout(tickingSlowPlay, 1000);
  }

  const getSessionInSecond = () => sessionValue * 60;

  function onReset(wasRunning: boolean) {
    tickingSlowStop();
    if (wasRunning) saveProjectTime(); //only save project time if it was running
    elapsedTime.current = 0; //reset whatever time spent on session when reset pomodoro
  }

  function saveProjectTime() {
    // persist project timer
    if (project?.value) {
      addTimesheet(
        project.value,
        databaseId as string,
        getSessionInSecond() - timerValue - elapsedTime.current
      )
        .then(() => {
          toast.success(`Timesheet added ${project.label}`, {
            autoClose: false,
          });
          setTimeout(refetch, 3000); //refetch after 3 sec
        })
        .catch(() =>
          toast.error(`Timesheet upload error ${project.label}`, {
            autoClose: false,
          })
        );
      // even if api fails reset elapsed timer
      elapsedTime.current =
        timerValue == 0 ? 0 : getSessionInSecond() - timerValue; //if timer value is having some value then delete session time from there
    }
  }

  return { clockifiedValue, togglePlayPause, resetTimer, restartPomo };
}
