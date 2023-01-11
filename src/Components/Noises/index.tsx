import NoiseContext from "@/utils/Context/NoiseContext/Wrapper";
import { noises } from "@/utils/noise";
import NoiseCard from "./NoiseCard";
import { StopNoiseCard } from "./StopNoiseCard";

export default function Noises() {
  return (
    <NoiseContext>
      <div className="mx-auto mt-10 grid w-fit grid-cols-[repeat(2,auto)] place-content-center place-items-center gap-10 sm:grid-cols-[repeat(3,auto)] md:grid-cols-[repeat(4,auto)] ">
        <StopNoiseCard />
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
    </NoiseContext>
  );
}
