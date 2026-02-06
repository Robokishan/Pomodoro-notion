"use client";

import { useNoisestate } from "@/utils/Context/NoiseContext/Context";
import { actionTypes } from "@/utils/Context/NoiseContext/reducer";
import { useMediaKeysPreference } from "@/utils/Context/MediaKeysPreferenceContext";
import { pomodoroMediaRef } from "@/utils/mediaSessionRef";
import { noises } from "@/utils/noise";
import { useEffect, useRef } from "react";

/**
 * Media Session handler for Noises.
 *
 * Uses a near-silent HTML <audio> element (not muted, volume 0.01) as the
 * session anchor so the browser routes media keys to our tab — same pattern
 * YouTube / Spotify use with their real <video>/<audio> elements.
 */
export default function MediaSessionHandler() {
  const [noiseState, dispatch] = useNoisestate();
  const [mediaKeysControlPomodoro = false] = useMediaKeysPreference();
  const stateRef = useRef(noiseState);
  const prefRef = useRef(mediaKeysControlPomodoro);
  const anchorRef = useRef<HTMLAudioElement | null>(null);
  stateRef.current = noiseState;
  prefRef.current = mediaKeysControlPomodoro;

  // Anchor: a near-silent looping <audio> element that holds the media session.
  useEffect(() => {
    if (typeof window === "undefined" || !noises[0]) return;
    const audio = new Audio(noises[0].sound);
    audio.loop = true;
    audio.volume = 0.01;
    anchorRef.current = audio;
    return () => {
      audio.pause();
      anchorRef.current = null;
    };
  }, []);

  // Mirror noise state → anchor element so browser sends the right action.
  useEffect(() => {
    const audio = anchorRef.current;
    if (!audio) return;
    if (noiseState.noisesRunning.length > 0) {
      if (audio.paused) audio.play().catch(() => {});
    } else {
      if (!audio.paused) audio.pause();
    }
  }, [noiseState.noisesRunning.length]);

  // Register media session handlers.
  useEffect(() => {
    if (!navigator?.mediaSession) return;
    const n = noises.length;
    if (n === 0) return;

    navigator.mediaSession.setActionHandler("play", () => {
      const state = stateRef.current;
      if (prefRef.current && pomodoroMediaRef.current) pomodoroMediaRef.current();
      if (state.pausedNoisesSnapshot.length > 0) {
        dispatch({ type: actionTypes.RESTORE_PAUSED_NOISES });
      } else if (state.noisesRunning.length === 0) {
        const idx = state.currentTrackIndex;
        dispatch({ type: actionTypes.ADD_NOISE_RUNNING, payload: noises[idx]?.value ?? noises[0]!.value });
        dispatch({ type: actionTypes.SET_CURRENT_TRACK_INDEX, payload: idx });
      }
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      const state = stateRef.current;
      if (state.noisesRunning.length > 0) {
        dispatch({ type: actionTypes.MEDIA_PAUSE_NOISES, payload: [...state.noisesRunning] });
      }
      if (prefRef.current && pomodoroMediaRef.current) pomodoroMediaRef.current();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      const state = stateRef.current;
      const idx = (state.currentTrackIndex + 1) % n;
      dispatch({ type: actionTypes.STOP_ALL_NOISES });
      dispatch({ type: actionTypes.ADD_NOISE_RUNNING, payload: noises[idx]!.value });
      dispatch({ type: actionTypes.SET_CURRENT_TRACK_INDEX, payload: idx });
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      const state = stateRef.current;
      const idx = (state.currentTrackIndex - 1 + n) % n;
      dispatch({ type: actionTypes.STOP_ALL_NOISES });
      dispatch({ type: actionTypes.ADD_NOISE_RUNNING, payload: noises[idx]!.value });
      dispatch({ type: actionTypes.SET_CURRENT_TRACK_INDEX, payload: idx });
    });

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
    };
  }, [dispatch]);

  // Update OS / lock-screen metadata.
  useEffect(() => {
    if (!navigator?.mediaSession) return;
    const hasNoise = noiseState.noisesRunning.length > 0;
    const track = noises[noiseState.currentTrackIndex];

    navigator.mediaSession.metadata = new MediaMetadata({
      title: hasNoise && track ? track.label : "Pomodoro Noises",
      artist: "Pomodoro",
      album: "Focus Noises",
    });
    navigator.mediaSession.playbackState = hasNoise ? "playing" : "paused";
  }, [noiseState.noisesRunning.length, noiseState.currentTrackIndex]);

  return null;
}
