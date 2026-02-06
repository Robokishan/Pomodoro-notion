import { useNoisestate } from "@/utils/Context/NoiseContext/Context";
import { actionTypes } from "@/utils/Context/NoiseContext/reducer";
import React, { useCallback, useEffect, useState } from "react";
import useSound from "use-sound";
import SoundLevel from "./SoundLevel";

interface NoiseCardProps {
  label: string;
  value: string;
  audio: string;
  icon?: any;
  defaultVolume?: number;
  trackIndex?: number;
}

export default function NoiseCard({
  audio,
  label,
  value,
  icon: Icon,
  defaultVolume = 0.2,
  trackIndex = 0,
}: NoiseCardProps) {
  const [volume, setVolume] = useState(defaultVolume);
  const [show, setshow] = useState(false);
  const [isEnabled, setEnable] = useState(false);

  const [{ noisesRunning }, dispatch] = useNoisestate();

  const [play, { stop }] = useSound(audio, {
    volume,
    loop: true,
    onload() {
      setEnable(true);
    },
  });

  const playSound = useCallback(() => {
    play();
    setshow(true);
  }, [play]);

  const stopSound = useCallback(() => {
    stop();
    setshow(false);
  }, [stop]);

  useEffect(() => {
    return () => { stopSound(); };
  }, [stopSound]);

  useEffect(() => {
    if (!noisesRunning.includes(value)) {
      stopSound();
    } else if (noisesRunning.includes(value) && !show) {
      playSound();
    }
  }, [dispatch, noisesRunning, playSound, show, stopSound, value]);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        if (!show && isEnabled) {
          dispatch({ type: actionTypes.ADD_NOISE_RUNNING, payload: value });
          dispatch({ type: actionTypes.SET_CURRENT_TRACK_INDEX, payload: trackIndex });
        } else {
          dispatch({ type: actionTypes.REMOVE_NOISE_RUNNING, payload: value });
        }
      }}
      className="flex h-28 w-28 cursor-pointer flex-col items-center rounded-xl bg-surface-muted
      p-3 align-top shadow-md"
    >
      {Icon ? (
        <div
          title={label}
          className={`h-[56px] w-[56px] ${
            isEnabled
              ? "fill-icon-default stroke-icon"
              : "fill-icon-disabled stroke-faint"
          }`}
        >
          <Icon />
        </div>
      ) : (
        <div className="h-[56px] w-[56px]">
          <span className="text-heading">{label}</span>
        </div>
      )}
      <div className={`w-full ${!show && "opacity-30"}`}>
        <SoundLevel
          disabled={!show}
          defaultValue={volume * 100}
          value={value}
          handleChange={setVolume}
        />
      </div>
    </div>
  );
}
