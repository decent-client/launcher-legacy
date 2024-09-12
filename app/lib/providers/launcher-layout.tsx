import { createContext, useContext, useMemo, useState } from "react";

type Options = {
  newsFeed: {
    scrollY: number;
  };
};

type LauncherLayoutContext = {
  launcherLayout: Options;
  setLauncherLayout: (options: Options) => void;
};

const LauncherLayout = createContext<LauncherLayoutContext | null>(null);

export function LauncherLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [launcherLayout, setLauncherLayout] = useState<Options>({
    newsFeed: { scrollY: 0 },
  });

  return (
    <LauncherLayout.Provider
      value={useMemo(
        () => ({ launcherLayout, setLauncherLayout }),
        [launcherLayout],
      )}
    >
      {children}
    </LauncherLayout.Provider>
  );
}

export const useLauncherLayout = () => {
  const context = useContext(LauncherLayout);

  if (!context) {
    throw new Error(
      "useLauncherLayout must be used within a LauncherLayoutProvider",
    );
  }

  return context;
};
