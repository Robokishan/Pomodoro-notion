import { noises } from "@/utils/noise";
import NoiseCard from "./NoiseCard";

export default function Noises() {
  return (
    <div className="mx-auto mt-10 grid w-fit grid-cols-[repeat(2,auto)] place-content-center place-items-center gap-10 sm:grid-cols-[repeat(3,auto)] md:grid-cols-[repeat(4,auto)] ">
      {noises.map((noise) => (
        <NoiseCard
          key={noise.value}
          icon={noise.svg}
          audio={noise.sound}
          label={noise.label}
          value={noise.value}
        />
      ))}
    </div>
  );
}
