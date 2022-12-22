import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { actionTypes } from "../../utils/reducer";
import { useStateValue } from "../../utils/reducer/Context";
import SmallButton from "../SmallButton";

export default function Session() {
  const [{ sessionValue, busyIndicator }] = useStateValue();
  const [, dispatch] = useStateValue();

  const handleDecrement = () => {
    dispatch({
      type: actionTypes.DECREASE_SESSION_VALUE,
      payload: {
        sessionValue: sessionValue - 1,
        timerValue: (sessionValue - 1) * 60,
      },
    });
  };
  const handleIncrement = () => {
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
  return (
    <>
      <SmallButton disabled={decreaseDisabled} onClick={handleDecrement}>
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
      <SmallButton disabled={increaseDisabled} onClick={handleIncrement}>
        <PlusIcon
          className={`h-5 w-5 ${increaseDisabled && "fill-gray-200"}`}
        />
      </SmallButton>
    </>
  );
}
