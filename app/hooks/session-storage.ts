import { useCallback, useState } from "react";

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.sessionStorage.getItem(key);
        return item !== null ? JSON.parse(item) : initialValue;
      }
    } catch (error) {
      console.log(error);
    }
    return initialValue;
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(key, JSON.stringify(value));
          setStoredValue(value);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [key],
  );

  const removeStoredValue = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(key);
      setStoredValue(undefined);
    }
  };

  return [storedValue as T, setValue, removeStoredValue] as const;
}
