import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import useInterval from "../../hooks/Pomodoro/Time/useInterval";
import useAlert from "../../hooks/Sound/useClickSound";
import { actionTypes } from "../../utils/Context/PomoContext/reducer";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import SmallButton from "../SmallButton";

export default function Session() {
  const { clickPlay } = useAlert();
  const [{ sessionValue, busyIndicator }] = usePomoState();
  const [, dispatch] = usePomoState();
  const [mouseDown, setMouseDown] = useState({
    increase: false,
    decrease: false,
  });

  const handleDecrement = () => {
    clickPlay();
    dispatch({
      type: actionTypes.DECREASE_SESSION_VALUE,
      payload: {
        sessionValue: sessionValue - 1,
        timerValue: (sessionValue - 1) * 60,
      },
    });
  };
  const handleIncrement = () => {
    clickPlay();
    dispatch({
      type: actionTypes.INCREASE_SESSION_VALUE,
      payload: {
        sessionValue: sessionValue + 1,
        timerValue: (sessionValue + 1) * 60,
      },
    });
  };
  const decreaseDisabled = busyIndicator || sessionValue <= 1;
  const increaseDisabled = busyIndicator || sessionValue > 59;

  useInterval(
    () => {
      if (mouseDown.increase && !increaseDisabled) handleIncrement();
      if (mouseDown.decrease && !decreaseDisabled) handleDecrement();
    },
    (mouseDown.increase && !increaseDisabled) ||
      (mouseDown.decrease && !decreaseDisabled)
      ? 100
      : null
  );

  useEffect(() => {
    if (increaseDisabled) {
      setMouseDown((prev) => ({ ...prev, increase: false }));
    } else if (decreaseDisabled) {
      setMouseDown((prev) => ({ ...prev, decrease: false }));
    }
  }, [increaseDisabled, decreaseDisabled]);
  return (
    <>
      <SmallButton
        onMouseDown={() => {
          setMouseDown((prev) => ({ ...prev, decrease: true }));
        }}
        onMouseUp={() => {
          setMouseDown((prev) => ({ ...prev, decrease: false }));
        }}
        disabled={decreaseDisabled}
        onClick={handleDecrement}
      >
        <MinusIcon
          className={`h-5 w-5 ${decreaseDisabled && "fill-gray-200"}`}
        />
      </SmallButton>
      <p
        id="session-length"
        className="text-md min-w-[27px] px-2 py-4 font-bold"
      >
        {sessionValue}
      </p>
      <SmallButton
        onMouseDown={() =>
          setMouseDown((prev) => ({ ...prev, increase: true }))
        }
        onMouseUp={() => setMouseDown((prev) => ({ ...prev, increase: false }))}
        disabled={increaseDisabled}
        onClick={handleIncrement}
      >
        <PlusIcon
          className={`h-5 w-5 ${increaseDisabled && "fill-gray-200"}`}
        />
      </SmallButton>
    </>
  );
}
