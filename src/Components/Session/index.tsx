import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import useAlert from "../../hooks/Sound/useClickSound";
import useHoldPress from "../../hooks/useHoldPress";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import { actionTypes } from "../../utils/Context/PomoContext/reducer";
import SmallButton from "../SmallButton";

export default function Session() {
  const { clickPlay } = useAlert();
  const [{ sessionValue, busyIndicator }] = usePomoState();
  const [, dispatch] = usePomoState();

  function handleDecrement() {
    clickPlay();
    dispatch({
      type: actionTypes.DECREASE_SESSION_VALUE,
      payload: {
        sessionValue: sessionValue - 1,
        timerValue: (sessionValue - 1) * 60,
      },
    });
  }

  function handleIncrement() {
    clickPlay();
    dispatch({
      type: actionTypes.INCREASE_SESSION_VALUE,
      payload: {
        sessionValue: sessionValue + 1,
        timerValue: (sessionValue + 1) * 60,
      },
    });
  }

  const decreaseDisabled = busyIndicator || sessionValue <= 1;
  const increaseDisabled = busyIndicator || sessionValue > 59;

  const increamentCallbacks = useHoldPress(handleIncrement, increaseDisabled);
  const decreamentCallbacks = useHoldPress(handleDecrement, decreaseDisabled);

  return (
    <>
      <SmallButton {...decreamentCallbacks}>
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
      <SmallButton {...increamentCallbacks}>
        <PlusIcon
          className={`h-5 w-5 ${increaseDisabled && "fill-gray-200"}`}
        />
      </SmallButton>
    </>
  );
}
