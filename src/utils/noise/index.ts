import brownNoise from "@/public/sounds/noises/brown.mp3";
import fireSound from "@/public/sounds/noises/fire.mp3";
import gardenSound from "@/public/sounds/noises/garden.mp3";
import rainSound from "@/public/sounds/noises/rain.mp3";
import seaSideSound from "@/public/sounds/noises/seaside.mp3";
import stormWithTrainSound from "@/public/sounds/noises/storm-with-rain.mp3";
import stormSound from "@/public/sounds/noises/storm.mp3";
import summerNightSound from "@/public/sounds/noises/summer-night.mp3";
import waterStreamSound from "@/public/sounds/noises/water-stream.mp3";
import windSound from "@/public/sounds/noises/wind.mp3";

// import BrownIcon from "@/public/icons/brown.svg";
import fireIcon from "@/public/icons/fire.svg";
import gardenIcon from "@/public/icons/garden.svg";
import rainIcon from "@/public/icons/rain.svg";
import seaSideIcon from "@/public/icons/seaside.svg";
import stormWithTrainIcon from "@/public/icons/rainstorm.svg";
import stormIcon from "@/public/icons/storm.svg";
import summerNightIcon from "@/public/icons/night.svg";
import waterStreamIcon from "@/public/icons/waterstream.svg";
import windIcon from "@/public/icons/wind.svg";

export {
  brownNoise,
  fireSound,
  gardenSound,
  rainSound,
  seaSideSound,
  stormWithTrainSound,
  stormSound,
  summerNightSound,
  waterStreamSound,
  windSound,
};

type NoiseType = {
  label: string;
  value: string;
  sound: string;
  svg?: any;
};

export const noises: NoiseType[] = [
  // {
  //   label: "Brown Noise",
  //   value: "brownNoise",
  //   sound: brownNoise,
  //   svg: BrownIcon,
  // },
  {
    label: "Fire",
    value: "freSound",
    sound: fireSound,
    svg: fireIcon,
  },
  {
    label: "Garden",
    value: "gardenSound",
    sound: gardenSound,
    svg: gardenIcon,
  },
  {
    label: "Rain",
    value: "rainSound",
    sound: rainSound,
    svg: rainIcon,
  },
  {
    label: "Sea Side",
    value: "seaSideSound",
    sound: seaSideSound,
    svg: seaSideIcon,
  },
  {
    label: "Storm with Train",
    value: "stormWithTrainSound",
    sound: stormWithTrainSound,
    svg: stormWithTrainIcon,
  },
  {
    label: "Storm",
    value: "stormSound",
    sound: stormSound,
    svg: stormIcon,
  },
  {
    label: "Summer Night",
    value: "summerNightSound",
    sound: summerNightSound,
    svg: summerNightIcon,
  },
  {
    label: "Water Stream",
    value: "waterStreamSound",
    sound: waterStreamSound,
    svg: waterStreamIcon,
  },
  {
    label: "Wind",
    value: "windSound",
    sound: windSound,
    svg: windIcon,
  },
];
