import {
  ArrowPathIcon,
  CheckIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import BigButton from "../BigButton";
import useAlert from "../../hooks/Sound/useClickSound";

interface Props {
  handlePlayPause: () => void;
  handleReset: () => void;
  handleRestart: () => void;
}

export default function Controls({
  handlePlayPause,
  handleReset,
  handleRestart,
}: Props) {
  const { clickPlay } = useAlert();
  const [{ busyIndicator }] = usePomoState();
  const [state] = usePomoState();

  return (
    <div className="z-30 mb-[2em]	flex items-center justify-between">
      <BigButton
        disabled={state.frozePomodoro}
        onClick={() => {
          console.log(
            "start/pause at",
            Math.floor(new Date().getTime() / 1000)
          );
          clickPlay();
          handlePlayPause();
        }}
      >
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
      <BigButton
        onClick={() => {
          console.log("stopped at", Math.floor(new Date().getTime() / 1000));
          clickPlay();
          handleRestart();
        }}
      >
        <CheckIcon className="h-5 w-5 " />
      </BigButton>
      <BigButton
        onClick={() => {
          console.log("reset at", Math.floor(new Date().getTime() / 1000));
          clickPlay();
          handleReset();
        }}
      >
        <ArrowPathIcon className="h-5 w-5 " />
      </BigButton>
    </div>
  );
}
