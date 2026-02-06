import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import useAlert from "../../hooks/Sound/useClickSound";
import useHoldPress from "../../hooks/useHoldPress";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import { actionTypes } from "../../utils/Context/PomoContext/reducer";
import SmallButton from "../SmallButton";

export default function Break() {
  const { clickPlay } = useAlert();
  const [{ breakValue, busyIndicator }] = usePomoState();
  const [, dispatch] = usePomoState();

  const handleDecrement = () => {
    clickPlay();
    dispatch({
      type: actionTypes.DECREASE_BREAK_VALUE,
      payload: { breakValue: breakValue - 1 },
    });
  };
  const handleIncrement = () => {
    clickPlay();
    dispatch({
      type: actionTypes.INCREASE_BREAK_VALUE,
      payload: { breakValue: breakValue + 1 },
    });
  };

  const decreaseDisabled = busyIndicator || breakValue <= 1;
  const increaseDisabled = busyIndicator || breakValue > 59;

  const increamentCallbacks = useHoldPress(handleIncrement, increaseDisabled);
  const decreamentCallbacks = useHoldPress(handleDecrement, decreaseDisabled);

  return (
    <>
      <SmallButton {...decreamentCallbacks}>
        <MinusIcon className={`h-5 w-5 ${decreaseDisabled ? "fill-icon-disabled" : "fill-icon-default"}`} />
      </SmallButton>
      <p id="break-length" className="text-md min-w-[27px] px-2 py-4 font-bold">
        {breakValue}
      </p>
      <SmallButton {...increamentCallbacks}>
        <PlusIcon className={`h-5 w-5 ${increaseDisabled ? "fill-icon-disabled" : "fill-icon-default"}`} />
      </SmallButton>
    </>
  );
}
