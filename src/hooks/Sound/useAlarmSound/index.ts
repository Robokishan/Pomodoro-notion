import useSound from "use-sound";
import alarmBell from "@/public/sounds/alarm-bell.mp3";
import alarmDigital from "@/public/sounds/alarm-digital.mp3";
import alarmKitchen from "@/public/sounds/alarm-kitchen.mp3";
import kitchenTimer from "@/public/sounds/kichen-timer.mp3";

export default function useAlarmSound() {
  const [alarmBellPlay] = useSound(alarmBell);
  const [alarmDigitalPlay] = useSound(alarmDigital);
  const [alarmKitchenPlay] = useSound(alarmKitchen);
  const [kitchenTimerPlay] = useSound(kitchenTimer);

  return {
    alarmBellPlay,
    alarmDigitalPlay,
    alarmKitchenPlay,
    kitchenTimerPlay,
  };
}
