import { useNoisestate } from "@/utils/Context/NoiseContext/Context";
import { actionTypes } from "@/utils/Context/NoiseContext/reducer";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

export function StopNoiseCard() {
  const [{ noisesRunning }, dispatch] = useNoisestate();
  return (
    <div
      onClick={() => {
        dispatch({ type: actionTypes.STOP_ALL_NOISES });
      }}
      className="flex h-28 w-28 cursor-pointer flex-col items-center rounded-xl bg-surface-muted
    p-3 align-top shadow-md"
    >
      <div
        title="Stop"
        className={`h-[56px] w-[56px] ${
          noisesRunning.length > 0 ? "text-muted" : "text-faint"
        }`}
      >
        <NoSymbolIcon />
      </div>
      <div className="w-full opacity-30"></div>
    </div>
  );
}
