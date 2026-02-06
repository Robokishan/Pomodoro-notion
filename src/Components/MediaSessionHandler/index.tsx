"use client";

import { useNoisestate } from "@/utils/Context/NoiseContext/Context";
import { actionTypes } from "@/utils/Context/NoiseContext/reducer";
import { useMediaKeysPreference } from "@/utils/Context/MediaKeysPreferenceContext";
import { pomodoroMediaRef } from "@/utils/mediaSessionRef";
import { noises } from "@/utils/noise";
import { useEffect, useRef } from "react";

/**
 * Build a proper silent WAV Blob URL programmatically.
 * Using a real WAV (not muted!) is required so Chrome treats our tab as
 * the active media session and doesn't hand media keys to YouTube/Spotify.
 */
function createSilentWavUrl(): string {
  const sampleRate = 8000;
  const numSamples = sampleRate; // 1 second of silence
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * blockAlign;
  const headerSize = 44;

  const buffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  // samples are already 0 (silence) from ArrayBuffer initialization

  const blob = new Blob([buffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

/**
 * Handles OS/browser media keys (play, pause, next, previous track) for:
 * - Noises: play/pause and next/previous track
 * - Optional: Pomodoro timer play/pause when user preference is enabled
 *
 * Uses the standard Media Session API so it works with macOS media keys,
 * Windows, Linux, and lock screen / notification controls.
 *
 * IMPORTANT: We keep an **unmuted**, looping, near-silent <audio> element
 * playing whenever noises are active OR paused-with-snapshot. This is the
 * only reliable way to hold media-session ownership in Chrome so that
 * Play/Pause keys come to our tab instead of YouTube/Spotify.
 */
export default function MediaSessionHandler() {
  const [noiseState, dispatch] = useNoisestate();
  const [mediaKeysControlPomodoro = false] = useMediaKeysPreference();

  const stateRef = useRef(noiseState);
  const prefRef = useRef(mediaKeysControlPomodoro);
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);
  const silentUrlRef = useRef<string | null>(null);
  stateRef.current = noiseState;
  prefRef.current = mediaKeysControlPomodoro;

  // Create the silent audio element once (unmuted, near-zero volume).
  useEffect(() => {
    if (typeof document === "undefined") return;

    const url = createSilentWavUrl();
    silentUrlRef.current = url;

    const audio = document.createElement("audio");
    audio.loop = true;
    audio.volume = 0.01; // NOT muted — near-silent so Chrome treats it as real media
    audio.preload = "auto";
    audio.src = url;
    audio.setAttribute("aria-hidden", "true");
    audio.style.setProperty("display", "none");
    document.body.appendChild(audio);
    silentAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.remove();
      silentAudioRef.current = null;
      URL.revokeObjectURL(url);
      silentUrlRef.current = null;
    };
  }, []);

  // Sync silent audio element state with noise state.
  // The element must mirror the actual play/pause state so the browser sends the
  // correct action ("play" or "pause") when the user presses the media key.
  //
  // - Noises playing → audio.play()  → browser will send "pause" on next press
  // - Noises paused  → audio.pause() → browser will send "play"  on next press
  //
  // This works like YouTube/Spotify: their <video>/<audio> is paused when the user
  // pauses, and the browser still routes the next Play back to them because the
  // element previously played audible audio (our volume = 0.01, not muted).
  useEffect(() => {
    const audio = silentAudioRef.current;
    if (!audio) return;

    const isPlaying = noiseState.noisesRunning.length > 0;

    if (isPlaying) {
      // Noises are playing — ensure the silent element is also playing
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    } else {
      // Noises are paused or stopped — pause the element so the browser
      // sends "play" (not "pause") on the next media key press.
      // The session is retained because the element previously played
      // audible audio and is paused (not removed).
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [noiseState.noisesRunning.length]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaSession) return;

    const n = noises.length;
    if (n === 0) return;

    const handlePlay = () => {
      const state = stateRef.current;
      const controlPomo = prefRef.current;
      if (controlPomo && pomodoroMediaRef.current) {
        pomodoroMediaRef.current();
      }
      // If we have a saved combination from a previous Pause, restore it (one-click resume)
      if (state.pausedNoisesSnapshot.length > 0) {
        dispatch({ type: actionTypes.RESTORE_PAUSED_NOISES });
        return;
      }
      if (state.noisesRunning.length === 0) {
        const idx = state.currentTrackIndex;
        const value = noises[idx]?.value ?? noises[0]!.value;
        dispatch({ type: actionTypes.ADD_NOISE_RUNNING, payload: value });
        dispatch({
          type: actionTypes.SET_CURRENT_TRACK_INDEX,
          payload: idx,
        });
      }
    };

    const handlePause = () => {
      const state = stateRef.current;
      // Remember current combination so Play can restore it with one click
      if (state.noisesRunning.length > 0) {
        dispatch({
          type: actionTypes.MEDIA_PAUSE_NOISES,
          payload: [...state.noisesRunning],
        });
      } else {
        dispatch({ type: actionTypes.STOP_ALL_NOISES });
      }
      if (prefRef.current && pomodoroMediaRef.current) {
        pomodoroMediaRef.current();
      }
    };

    const handleNextTrack = () => {
      const state = stateRef.current;
      const nextIndex = (state.currentTrackIndex + 1) % n;
      const value = noises[nextIndex]!.value;
      dispatch({ type: actionTypes.STOP_ALL_NOISES });
      dispatch({ type: actionTypes.ADD_NOISE_RUNNING, payload: value });
      dispatch({ type: actionTypes.SET_CURRENT_TRACK_INDEX, payload: nextIndex });
    };

    const handlePreviousTrack = () => {
      const state = stateRef.current;
      const prevIndex = (state.currentTrackIndex - 1 + n) % n;
      const value = noises[prevIndex]!.value;
      dispatch({ type: actionTypes.STOP_ALL_NOISES });
      dispatch({ type: actionTypes.ADD_NOISE_RUNNING, payload: value });
      dispatch({ type: actionTypes.SET_CURRENT_TRACK_INDEX, payload: prevIndex });
    };

    navigator.mediaSession.setActionHandler("play", handlePlay);
    navigator.mediaSession.setActionHandler("pause", handlePause);
    navigator.mediaSession.setActionHandler("nexttrack", handleNextTrack);
    navigator.mediaSession.setActionHandler("previoustrack", handlePreviousTrack);

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
    };
  }, [dispatch]);

  // Update metadata for lock screen / OS media UI
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaSession) return;

    const hasNoise = noiseState.noisesRunning.length > 0;
    const hasPausedSnapshot = noiseState.pausedNoisesSnapshot.length > 0;
    const track = hasNoise
      ? noises[noiseState.currentTrackIndex]
      : noises[noiseState.currentTrackIndex];
    const title =
      hasNoise && track
        ? track.label
        : hasPausedSnapshot
          ? "Pomodoro Noises (paused)"
          : "Pomodoro Noises";
    const playbackState = hasNoise ? "playing" : "paused";

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: "Pomodoro",
      album: "Focus Noises",
    });
    navigator.mediaSession.playbackState = playbackState;
  }, [
    noiseState.noisesRunning.length,
    noiseState.currentTrackIndex,
    noiseState.noisesRunning,
    noiseState.pausedNoisesSnapshot.length,
  ]);

  return null;
}
