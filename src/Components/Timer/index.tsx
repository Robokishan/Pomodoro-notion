import { actionTypes } from "@/utils/Context/PomoContext/reducer";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import OutsideClickHandler from "react-outside-click-handler";
import useSyncPomo from "../../hooks/useSyncPomo";
import useWindowActive from "../../hooks/useWindowActive";
import { usePomoState } from "../../utils/Context/PomoContext/Context";
import Break from "../Break";
import Controls from "../Controls";
import SoundLevel from "../Noises/NoiseCard/SoundLevel";
import Session from "../Session";
import WakeLockNote from "./WakeLockNote";

type Props = {
  projectName: string;
};

export default function Timer({ projectName }: Props) {
  const timerScreen = useFullScreenHandle();

  const [{ timerLabel, project, shouldTickSound }, dispatch] = usePomoState();

  const { clockifiedValue, togglePlayPause, resetTimer, restartPomo } =
    useSyncPomo();

  const isWindowActive = useWindowActive();

  const [disableControls, setDisableControls] = useState(false);

  const [showPopover, setPopover] = useState(false);
  const [showNote, setNote] = useState<
    null | "success" | "error" | "warning"
  >();

  // prevent screen lock when timer is in focus
  const wakeLock = useRef<WakeLockSentinel>();

  const lockScreen = async () => {
    if ("wakeLock" in navigator) {
      try {
        wakeLock.current = await navigator.wakeLock.request("screen");
        wakeLock.current.onrelease = () => {
          setNote("warning");
        };
        setNote("success");
        setTimeout(() => {
          setNote(null);
        }, 5000);
      } catch (error) {
        setNote("error");
        // Wake lock was not allowed.
        // log for development only
        if (process.env.NODE_ENV == "development") console.error(error);
      }
    }
  };

  useEffect(() => {
    // requestWakeLock
    if (isWindowActive) {
      // timer #1 for lockscreen
      setTimeout(() => {
        // if wantLock current is undefined or wakelock is released then lockscreen
        if (!wakeLock.current || wakeLock.current.released) lockScreen();
      }, 1000); //make delay to make interface ready

      // timer #2 for controls
      setTimeout(() => {
        setDisableControls(false);
      }, 2000); //make delay to make interface ready
    } else {
      setDisableControls(true);
    }
  }, [isWindowActive]);

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
        className="font-quicksand relative z-10
        m-0
        mb-3 
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
        disableControls={disableControls}
        handleReset={resetTimer}
        handlePlayPause={togglePlayPause}
        handleRestart={restartPomo}
      />
      <div className="flex w-full items-center justify-between gap-5">
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
        <OutsideClickHandler onOutsideClick={() => setPopover(false)}>
          <div className="relative mx-3 flex items-center ">
            <button
              onClick={() => setPopover((prev) => !prev)}
              data-popover-target="popover-default"
              type="button"
              className="cursor-pointer text-center text-sm font-medium focus:outline-none"
            >
              <SpeakerWaveIcon className=" h-6 w-6 text-slate-700 hover:text-slate-400 active:text-slate-900" />
            </button>
            <PopOver visible={showPopover} />
          </div>
        </OutsideClickHandler>
        <button onClick={timerScreen.enter} className="mx-2">
          <ArrowsPointingOutIcon className="h-5 w-5" />
        </button>
      </div>
      {showNote && (
        <WakeLockNote onCloseClick={() => setNote(null)} type={showNote} />
      )}
      <FullScreen handle={timerScreen}>
        <div className={`${timerScreen.active ? "block" : "hidden"} `}>
          <div className="flex h-screen w-screen flex-col items-center justify-center">
            <h3 className="text-xl">{projectName}</h3>
            <h4 className="my-5 text-4xl">
              <div className="flex items-baseline gap-3">
                {timerLabel}
                <button className="h-6 w-6" onClick={timerScreen.exit}>
                  <ArrowsPointingInIcon className="h-6 w-6" />
                </button>
              </div>
            </h4>
            <h1
              id="time-left"
              className="font-quicksand relative z-10
              m-0
            mb-3 
            text-9xl
            font-extralight
            text-gray-500
        "
            >
              {clockifiedValue}
            </h1>
          </div>
        </div>
      </FullScreen>
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
      <div className="flex items-center justify-between gap-2	text-center">
        {children}
      </div>
    </div>
  );
}

function PopOver({ visible } = { visible: false }) {
  const [{ tickVolume }, dispatch] = usePomoState();

  const [volume, setVolume] = useState(tickVolume);

  useEffect(() => {
    // reason for this is context is slow i guess slow update to dom
    dispatch({
      type: actionTypes.CHANGE_TICK_VOLUME,
      payload: volume,
    });
  }, [dispatch, volume]);

  return (
    <div
      id="volumebar-popover"
      className={`${
        visible
          ? "scale-100 transform opacity-100"
          : "pointer-events-none scale-95 transform opacity-0"
      } absolute -left-20 top-8 w-52 rounded-lg border border-slate-300 bg-white p-1 text-sm font-light text-slate-500 shadow-2xl transition duration-75 ease-in`}
    >
      <div className="relative">
        <div
          className="absolute -top-[9px] left-[41%] z-0 h-2 w-2 rotate-45 rounded-tl-sm border-t border-l
         border-slate-300  bg-white"
        ></div>
      </div>
      <div className="flex items-center gap-3   bg-white px-2 py-1">
        <div className="w-6">{Math.floor(volume * 100)}</div>
        <SoundLevel
          defaultValue={volume * 100}
          value="Tickvolume"
          handleChange={setVolume}
        />
      </div>
    </div>
  );
}
