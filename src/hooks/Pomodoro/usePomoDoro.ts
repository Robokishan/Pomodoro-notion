// pomodoro hook for pomodoro related features
// this hook will keep context and timer hook in sync
/*
  1. sessions
  2. break
*/

import { actionTypes, TimerLabelType } from "../../utils/reducer";
import { useStateValue } from "../../utils/reducer/Context";
import { useClockified } from "./Time/useTime";
import useTimer from "./Time/useTimer";

const intervalmillis = 1000;
const countStep = 1;

export default function usePomoDoro({
  onEnd,
  onPomoPause,
}: {
  onEnd?: (type: TimerLabelType) => void;
  onPomoPause?: (type: TimerLabelType) => void;
}) {
  const [{ timerValue }] = useStateValue();
  const [, isRunning, toggleTimer, reset] = useTimer(
    timerValue,
    intervalmillis,
    {
      onStart: onStart,
      onPause: onPause,
      onTick: tick,
    }
  );
  const [{ busyIndicator, breakValue, sessionValue, timerLabel }, dispatch] =
    useStateValue();
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

  function onStart() {
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

  function resetTimer() {
    reset();
    dispatch({
      type: actionTypes.RESET_TIMERS,
    });
  }

  function tick() {
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

  return { clockifiedValue, handlePlayPause, resetTimer };
}
