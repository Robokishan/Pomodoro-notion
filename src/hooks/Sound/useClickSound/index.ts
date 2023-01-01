import useSound from "use-sound";
import click from "@/public/sounds/check.mp3";
import tickingFast from "@/public/sounds/ticking-fast.mp3";
import tickingSlow from "@/public/sounds/ticking-slow.mp3";
import { useStateValue } from "src/utils/reducer/Context";

export default function useClickSound() {
  const [{ shouldTickSound }] = useStateValue();
  const [clickPlay] = useSound(click, {
    volume: 0.4,
  });
  const [tickingFastPlay, { stop: tickingFastStop }] = useSound(tickingFast);

  const [tickingSlowPlay, { stop: tickingSlowStop }] = useSound(tickingSlow, {
    volume: shouldTickSound ? 0.3 : 0,
    loop: true,
  });

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
