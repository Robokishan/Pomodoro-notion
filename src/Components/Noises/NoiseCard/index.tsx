import React, { useState } from "react";
import useSound from "use-sound";
import SoundLevel from "./SoundLevel";

interface NoiseCardProps {
  label: string;
  value: string;
  audio: string;
  icon?: any;
  defaultVolume?: number;
}

export default function NoiseCard({
  audio,
  label,
  value,
  icon: Icon,
  defaultVolume = 0.2,
}: NoiseCardProps) {
  const [volume, setVolume] = useState(defaultVolume);
  const [show, setshow] = useState(false);
  const [play, { stop }] = useSound(audio, {
    volume,
    loop: true,
  });

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        if (!show) {
          play();
          setshow(true);
        } else {
          stop();
          setshow(false);
        }
      }}
      className="flex h-28 w-28 cursor-pointer flex-col items-center rounded-xl bg-gradient-to-r from-slate-50 via-slate-100
      to-slate-50
      p-3	
    align-top text-slate-50 shadow-md 
    "
    >
      {Icon ? (
        <div
          title={label}
          className="h-[56px] w-[56px] fill-slate-400 stroke-slate-400 "
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
