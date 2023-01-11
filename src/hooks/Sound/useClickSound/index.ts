import useSound from "use-sound";
import click from "@/public/sounds/check.mp3";
import tickingFast from "@/public/sounds/ticking-fast.mp3";
import tickingSlow from "@/public/sounds/ticking-slow.mp3";
import { usePomoState } from "@/utils/Context/PomoContext/Context";
import { useEffect } from "react";

export default function useClickSound() {
  const [{ shouldTickSound, tickVolume }] = usePomoState();
  const [clickPlay] = useSound(click, {
    volume: 0.4,
  });
  const [tickingFastPlay, { stop: tickingFastStop }] = useSound(tickingFast);

  const [tickingSlowPlay, { stop: tickingSlowStop }] = useSound(tickingSlow, {
    volume: shouldTickSound ? tickVolume : 0,
    loop: true,
  });

  useEffect(() => {
    return () => {
      tickingFastStop();
      tickingSlowStop();
    };
  }, [tickingFastStop, tickingSlowStop]);

  return {
    clickPlay,
    tickingFastPlay,
    tickingSlow: {
      play: tickingSlowPlay,
      stop: tickingSlowStop,
    },
    tickingFast: {
      play: tickingFastPlay,
      stop: tickingFastStop,
    },
  };
}
