import { useCallback, useRef } from "react";

export const useDebouncedCallback = <T extends unknown[]>(
  func: (...args: T) => unknown,
  wait: number
) => {
  const timeout = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: T) => {
      const later = () => {
        clearTimeout(timeout.current);
        func(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, wait);
    },
    [func, wait]
  );
};
