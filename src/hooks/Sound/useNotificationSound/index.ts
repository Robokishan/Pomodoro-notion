import useSound from "use-sound";
import alarmWood from "@/public/sounds/alarm-wood.mp3";
import bellRing from "@/public/sounds/bell-ringing-05.mp3";
import notification from "@/public/sounds/notification.mp3";

export default function useNotificationSound() {
  const [alarmWoodPlay] = useSound(alarmWood);
  const [bellRingPlay] = useSound(bellRing);
  const [notificationPlay] = useSound(notification);

  return {
    alarmWoodPlay,
    bellRingPlay,
    notificationPlay,
  };
}
