// pomodoro hook for pomodoro related features
// this hook will keep context and timer hook in sync
/*
  1. sessions
  2. break
*/

import {
  actionTypes,
  TimerLabelType,
} from "../../utils/Context/PomoContext/reducer";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import { useClockified } from "./Time/useTime";
import useTimer from "./Time/useTimer";

const intervalmillis = 1000;
const countStep = 1;

export default function usePomoDoro({
  onEnd,
  onPomoPause,
  onTick,
  onStart,
  onReset,
}: {
  onEnd?: (type: TimerLabelType) => void;
  onPomoPause?: (type: TimerLabelType) => void;
  onStart?: () => void;
  onTick?: () => void;
  onReset?: (wasRunning: boolean, type: TimerLabelType) => void;
}) {
  const [{ timerValue }] = usePomoState();
  const [, isRunning, toggleTimer, reset] = useTimer(
    timerValue,
    intervalmillis,
    {
      onStart: onPomoStart,
      onPause: onPause,
      onTick: tick,
      onReset: onTimerReset,
    }
  );
  const [{ busyIndicator, breakValue, sessionValue, timerLabel }, dispatch] =
    usePomoState();
  const clockifiedValue = useClockified();

  function handlePlayPause() {
    toggleTimer(!isRunning);
    dispatch({
      type: actionTypes.TOGGLE_ISBUSY_INDICATOR,
      payload: {
        busyIndicator: !busyIndicator,
      },
    });
    return !busyIndicator;
  }

  function onPomoStart() {
    if (onStart) onStart();
    dispatch({
      type: actionTypes.TOGGLE_ISBUSY_INDICATOR,
      payload: {
        busyIndicator: true,
      },
    });
  }

  function onPause() {
    if (onPomoPause) onPomoPause(timerLabel);
    dispatch({
      type: actionTypes.TOGGLE_ISBUSY_INDICATOR,
      payload: {
        busyIndicator: false,
      },
    });
  }

  function resetTimer(resetState = true) {
    reset();
    if (resetState) {
      dispatch({
        type: actionTypes.RESET_STATE,
      });
    } else {
      dispatch({
        type: actionTypes.RESET_TIMERS,
      });
    }
  }

  function restartPomo() {
    reset();
    dispatch({
      type: actionTypes.RESTART_POMODORO,
    });
  }

  function onTimerReset(wasRunning: boolean) {
    if (onReset) onReset(wasRunning, timerLabel);
    dispatch({
      type: actionTypes.TOGGLE_ISBUSY_INDICATOR,
      payload: {
        busyIndicator: false,
      },
    });
  }

  function tick() {
    if (onTick) onTick();
    dispatch({
      type: actionTypes.START_TIMER,
      payload: {
        timerValue: timerValue - countStep,
      },
    });
    PollSwitchType();
  }

  function PollSwitchType() {
    if (timerValue - 1 < 0) {
      if (timerLabel === "Session") {
        dispatch({
          type: actionTypes.TOGGLE_TIMER_LABEL,
          payload: {
            timerLabel: "Break",
          },
        });
        dispatch({
          type: actionTypes.START_TIMER,
          payload: {
            timerValue: breakValue * 60 - 1,
          },
        });
        if (onEnd) onEnd("Session");
      } else {
        dispatch({
          type: actionTypes.TOGGLE_TIMER_LABEL,
          payload: {
            timerLabel: "Session",
          },
        });
        dispatch({
          type: actionTypes.START_TIMER,
          payload: {
            timerValue: sessionValue * 60 - 1,
          },
        });
        if (onEnd) onEnd("Break");
      }
    }
  }

  return { clockifiedValue, handlePlayPause, resetTimer, restartPomo };
}
