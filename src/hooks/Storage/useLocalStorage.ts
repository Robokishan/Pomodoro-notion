import React, { useEffect, useState } from "react";
import { persistentStorage } from "./persistentStorage";

export const useLocalStorage = <S>(
  key?: string,
  initialState?: S | (() => S)
): [S, React.Dispatch<React.SetStateAction<S>>, () => void] => {
  const [state, setState] = useState<S>(() => {
    if (key) {
      const valueFromStorage = persistentStorage.getItem(key);

      if (
        typeof initialState === "object" &&
        !Array.isArray(initialState) &&
        initialState !== null
      ) {
        return {
          ...initialState,
          ...valueFromStorage,
        };
      }

      return valueFromStorage || initialState;
    }

    return undefined

  });

  useEffect(() => {
    fetch();
  }, [key]);

  useEffect(() => {
    //persist data in storage
    if (key) { localStorage.setItem(key, JSON.stringify(state)); }
  }, [state]);

  function fetch() {
    // update data from persisted storage to state
    if (key) {
      const item = localStorage.getItem(key) ?? "[]";
      if (item) setState(parse(item));
    }
  }

  return [state, setState, fetch];
};

const parse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
