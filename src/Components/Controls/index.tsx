import {
  ArrowPathIcon,
  CheckIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import useAlert from "../../hooks/Sound/useClickSound";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import BigButton from "../BigButton";

interface Props {
  disableControls: boolean;
  handlePlayPause: () => void;
  handleReset: () => void;
  handleRestart: () => void;
}

export default function Controls({
  handlePlayPause,
  handleReset,
  handleRestart,
  disableControls,
}: Props) {
  const { clickPlay } = useAlert();
  const [{ busyIndicator, frozePomodoro }] = usePomoState();

  // major condition if timer is running then and then disableControls otherwise ignore it
  // otherwise chekc confition for frozePomodoro
  const checkMarkDisabled = frozePomodoro || (busyIndicator && disableControls);
  const playPauseButtonDisabled =
    frozePomodoro || (busyIndicator && disableControls);
  const resetButtonDisabled = busyIndicator && disableControls;

  return (
    <div className="z-30 mb-[2em]	flex items-center justify-between">
      <BigButton
        disabled={playPauseButtonDisabled}
        onClick={() => {
          clickPlay();
          handlePlayPause();
        }}
      >
        {!busyIndicator ? (
          <PlayIcon
            className={`h-5 w-5 ${playPauseButtonDisabled && "fill-gray-200"}`}
          />
        ) : (
          <PauseIcon
            className={`h-5 w-5 ${playPauseButtonDisabled && "fill-gray-200"}`}
          />
        )}
      </BigButton>
      <BigButton
        disabled={checkMarkDisabled}
        onClick={() => {
          clickPlay();
          handleRestart();
        }}
      >
        <CheckIcon
          className={`h-5 w-5 ${checkMarkDisabled && "fill-gray-200"}`}
        />
      </BigButton>
      <BigButton
        disabled={resetButtonDisabled}
        onClick={() => {
          clickPlay();
          handleReset();
        }}
      >
        <ArrowPathIcon
          className={`h-5 w-5 ${resetButtonDisabled && "fill-gray-200"}`}
        />
      </BigButton>
    </div>
  );
}
