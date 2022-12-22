import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { actionTypes } from "../../utils/reducer";
import { useStateValue } from "../../utils/reducer/Context";
import SmallButton from "../SmallButton";

export default function Break() {
  const [{ breakValue, busyIndicator }] = useStateValue();
  const [, dispatch] = useStateValue();

  const handleDecrement = () => {
    dispatch({
      type: actionTypes.DECREASE_BREAK_VALUE,
      payload: {
        breakValue: breakValue - 1,
      },
    });
  };
  const handleIncrement = () => {
    dispatch({
      type: actionTypes.INCREASE_BREAK_VALUE,
      payload: {
        breakValue: breakValue + 1,
      },
    });
  };
  const decreaseDisabled = busyIndicator || breakValue <= 1;
  const increaseDisabled = busyIndicator || breakValue > 59;
  return (
    <>
      <SmallButton disabled={decreaseDisabled} onClick={handleDecrement}>
        <MinusIcon
          className={`h-5 w-5 ${decreaseDisabled && "fill-gray-200"}`}
        />
      </SmallButton>
      <p id="break-length" className="text-md min-w-[27px] px-2 py-4 font-bold">
        {breakValue}
      </p>
      <SmallButton disabled={increaseDisabled} onClick={handleIncrement}>
        <PlusIcon
          className={`h-5 w-5 ${increaseDisabled && "fill-gray-200"}`}
        />
      </SmallButton>
    </>
  );
}
