import { isServer } from "../../utils/serverSide/isServer";

interface PersistentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: any): void;
}

class LocalStorage implements PersistentStorage {
  getItem(key: string) {
    const item = localStorage.getItem(key);

    if (item === null) return undefined;

    if (item === "null") return null;
    if (item === "undefined") return undefined;

    try {
      return JSON.parse(item);
    } catch {}

    return item;
  }
  setItem(key: string, value: any) {
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

class MockStorage implements PersistentStorage {
  getItem() {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setItem() {}
}

export const persistentStorage =
  !isServer() && window.localStorage ? new LocalStorage() : new MockStorage();
