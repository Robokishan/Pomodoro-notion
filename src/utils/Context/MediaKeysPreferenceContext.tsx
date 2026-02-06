"use client";

import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../../hooks/Storage/useLocalStorage";
import { MEDIA_KEYS_CONTROL_POMODORO_KEY } from "../../hooks/Storage/storage.constant";

type MediaKeysPreferenceContextValue = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
];

const Context = createContext<MediaKeysPreferenceContextValue | null>(null);

export function MediaKeysPreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checked, setChecked] = useLocalStorage<boolean>(
    MEDIA_KEYS_CONTROL_POMODORO_KEY,
    false
  );
  return (
    <Context.Provider value={[checked, setChecked]}>
      {children}
    </Context.Provider>
  );
}

export function useMediaKeysPreference(): MediaKeysPreferenceContextValue {
  const ctx = useContext(Context);
  if (!ctx) {
    return [false, () => {}];
  }
  return ctx;
}
