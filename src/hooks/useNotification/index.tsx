import { useEffect, useRef } from "react";
import Logo from "@/public/icon-192x192.png";

export default function useNotification(): [
  (text: string, title: string) => Promise<boolean>,
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

  async function showNotification(text: string, title: string) {
    const options = {
      body: text,
      icon: Logo.src,
      dir: "ltr",
    } as const;
    if (Notification.permission != "granted") await notificationRequest();
    if (Notification.permission == "granted") {
      notification.current = new Notification(title, options);
    }
    return Notification.permission == "granted";
  }
  function closeNotification() {
    notification.current?.close();
  }

  return [showNotification, closeNotification];
}
