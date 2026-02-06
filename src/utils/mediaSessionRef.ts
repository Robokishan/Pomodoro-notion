/**
 * Ref used by Media Session handler to trigger Pomodoro play/pause
 * when user enables "Media keys also control timer" and presses system media play/pause.
 * Set by Timer (useSyncPomo), read by MediaSessionHandler.
 */
export const pomodoroMediaRef = {
  current: null as (() => void) | null,
};
