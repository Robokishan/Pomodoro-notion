import { ArrowPathIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useStateValue } from "../../utils/reducer/Context";
import BigButton from "../BigButton";

interface Props {
  handlePlayPause: () => void;
  handleReset: () => void;
}

export default function Controls({ handlePlayPause, handleReset }: Props) {
  const [{ busyIndicator }] = useStateValue();
  const [state] = useStateValue();

  return (
    <div className="z-30 mb-[2em]	flex items-center justify-between">
      <BigButton disabled={state.frozePomodoro} onClick={handlePlayPause}>
        {!busyIndicator ? (
          <PlayIcon
            className={`h-5 w-5 ${state.frozePomodoro && "fill-gray-200"}`}
          />
        ) : (
          <PauseIcon
            className={`h-5 w-5 ${state.frozePomodoro && "fill-gray-200"}`}
          />
        )}
      </BigButton>

      <BigButton onClick={handleReset}>
        <ArrowPathIcon className="h-5 w-5 " />
      </BigButton>
    </div>
  );
}
