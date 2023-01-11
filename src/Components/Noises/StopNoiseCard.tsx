import { useNoisestate } from "@/utils/Context/NoiseContext/Context";
import { actionTypes } from "@/utils/Context/NoiseContext/reducer";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

export function StopNoiseCard() {
  const [{ noisesRunning }, dispatch] = useNoisestate();
  return (
    <div
      onClick={() => {
        dispatch({
          type: actionTypes.STOP_ALL_NOISES,
        });
      }}
      className={`flex h-28 w-28 cursor-pointer flex-col items-center rounded-xl bg-gradient-to-r from-slate-50 via-slate-100
    to-slate-50
    p-3	
  align-top text-slate-50 shadow-md 

  `}
    >
      <div
        title="Stop"
        className={`h-[56px] w-[56px]    ${
          noisesRunning.length > 0 ? "text-slate-400 " : " text-slate-200"
        }`}
      >
        <NoSymbolIcon />
      </div>

      <div className={`opacity-30} w-full`}></div>
    </div>
  );
}
