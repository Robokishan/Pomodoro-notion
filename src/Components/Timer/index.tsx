import Head from "next/head";
import React, { useEffect } from "react";
import { actionTypes } from "@/utils/Context/PomoContext/reducer";
import useSyncPomo from "../../hooks/useSyncPomo";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import Break from "../Break";
import Controls from "../Controls";
import Session from "../Session";

type Props = {
  projectName: string;
};

export default function Timer({ projectName }: Props) {
  const [{ timerLabel, project, shouldTickSound }, dispatch] = usePomoState();

  const { clockifiedValue, togglePlayPause, resetTimer, restartPomo } =
    useSyncPomo();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetTimer(false), [project?.value]);

  function handleTickChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: actionTypes.CHANGE_TICKING_SOUND,
      payload: e.target.checked,
    });
  }

  return (
    <div
      className="
      flex
      min-w-[350px] flex-col items-center justify-items-center 
      rounded-[50px]
      bg-white
      p-9 text-gray-700 shadow-lg"
    >
      {clockifiedValue && (
        <Head>
          <title>{`${clockifiedValue} - ${timerLabel}`}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      )}
      <h2 className="mt-[0.5em] mb-[1.5em] text-2xl">{projectName}</h2>
      <h3
        id="timer-label"
        className="relative z-30 mb-[15px] mt-5 text-xl font-medium text-gray-300"
      >
        {timerLabel}
      </h3>
      <h1
        id="time-left"
        className="relative z-10 m-0
        mb-3
        font-quicksand 
        text-5xl
        font-extralight
        text-gray-500
        after:absolute
        after:top-1/2
        after:left-1/2
        after:-z-10
        after:block 
        after:h-[180px]
        after:w-[180px]
        after:-translate-x-1/2
        after:-translate-y-1/2
        after:rounded-full 
        after:bg-bgColor-10
        after:shadow-md
        after:shadow-gray-400
        "
      >
        {clockifiedValue}
      </h1>
      <Controls
        handleReset={resetTimer}
        handlePlayPause={togglePlayPause}
        handleRestart={restartPomo}
      />
      <div className="flex w-full items-center justify-between">
        <Container title="Break Length">
          <Break />
        </Container>
        <Container title=" Session Length">
          <Session />
        </Container>
      </div>

      <div className="mt-2 flex items-center">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            checked={shouldTickSound}
            onChange={handleTickChange}
            type="checkbox"
            value=""
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white "></div>
          <span className="ml-3 text-sm font-medium text-gray-900 ">
            Ticking
          </span>
        </label>
      </div>
    </div>
  );
}

function Container({
  children,
  title,
}: {
  title: string;
  children: JSX.Element | React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <span id="break-label" className="text-md">
        {title}
      </span>
      <div className="flex items-center justify-between text-center	">
        {children}
      </div>
    </div>
  );
}
