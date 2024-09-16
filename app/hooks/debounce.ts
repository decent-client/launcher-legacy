import { useCallback, useRef } from "react";

export function useDebouncedCallback<T extends unknown[]>(
  func: (...args: T) => unknown,
  wait: number,
) {
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  return useCallback(
    (...args: T) => {
      const later = () => {
        clearTimeout(timeout.current);
        func(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, wait);
    },
    [func, wait],
  );
}
