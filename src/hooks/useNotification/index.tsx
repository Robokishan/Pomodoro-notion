import { useEffect, useRef } from "react";
import Logo from "@/public/icon-192x192.png";

export default function useNotification(): [
  (text: string) => void,
  () => void
] {
  const notification = useRef<Notification>();

  useEffect(() => {
    notificationRequest();
  }, []);

  async function notificationRequest() {
    const status = await Notification.requestPermission();
    return status;
  }

  async function showNotification(label: string) {
    const options = {
      body: `${label} Completed`,
      icon: Logo.src,
      dir: "ltr",
    } as const;
    if (Notification.permission != "granted") await notificationRequest();
    if (Notification.permission == "granted") {
      notification.current = new Notification("Pomo Complete", options);
    }
  }
  function closeNotification() {
    notification.current?.close();
  }

  return [showNotification, closeNotification];
}
