import { useEffect, useState } from "react";

const useWindowActive = () => {
  const [windowIsActive, setWindowIsActive] = useState(true);

  function handleActivity(forcedFlag: unknown) {
    if (typeof forcedFlag === "boolean") {
      return forcedFlag ? setWindowIsActive(true) : setWindowIsActive(false);
    }

    return document.hidden ? setWindowIsActive(false) : setWindowIsActive(true);
  }

  useEffect(() => {
    const handleActivityFalse = () => handleActivity(false);
    const handleActivityTrue = () => handleActivity(true);

    // window events
    window.addEventListener("blur", handleActivityFalse);
    window.addEventListener("focus", handleActivityTrue);

    // document visibility events
    document.addEventListener("visibilitychange", handleActivity);

    // document events
    document.addEventListener("blur", handleActivityFalse);
    document.addEventListener("focus", handleActivityTrue);

    return () => {
      // widow events
      window.removeEventListener("blur", handleActivity);
      window.removeEventListener("focus", handleActivityFalse);

      // document visibility events
      document.removeEventListener("visibilitychange", handleActivityTrue);

      // document events
      document.removeEventListener("blur", handleActivityFalse);
      document.removeEventListener("focus", handleActivityTrue);
    };
  }, []);

  return windowIsActive;
};

export default useWindowActive;
