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
      // check if howler is loaded
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
    return () => {
      // stop on unmount
      stopSound();
    };
  }, [stopSound]);

  useEffect(() => {
    if (!noisesRunning.includes(value)) {
      //stop noise
      stopSound();
    } else if (noisesRunning.includes(value) && !show) {
      // play noise
      playSound();
    }
  }, [dispatch, noisesRunning, playSound, show, stopSound, value]);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        if (!show && isEnabled) {
          dispatch({
            type: actionTypes.ADD_NOISE_RUNNING,
            payload: value,
          });
          dispatch({
            type: actionTypes.SET_CURRENT_TRACK_INDEX,
            payload: trackIndex,
          });
        } else {
          dispatch({
            type: actionTypes.REMOVE_NOISE_RUNNING,
            payload: value,
          });
        }
      }}
      className={`flex h-28 w-28 cursor-pointer flex-col items-center rounded-xl bg-gradient-to-r from-slate-50 via-slate-100
      to-slate-50
      p-3	
    align-top text-slate-50 shadow-md 
  
    `}
    >
      {Icon ? (
        <div
          title={label}
          className={`h-[56px] w-[56px]    ${
            isEnabled
              ? "fill-slate-400 stroke-slate-400"
              : "fill-slate-200 stroke-slate-200"
          }`}
        >
          <Icon />
        </div>
      ) : (
        <div className="h-[56px] w-[56px]">
          <span>{label}</span>
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
