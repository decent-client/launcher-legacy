import { createContext, useContext, useMemo, useState } from "react";

type Options = {
	scrollY: number;
};

type LauncherLayoutContext = {
	newsFeedSection: Options;
	setNewsFeedSection: (options: Options) => void;
};

const LauncherLayout = createContext<LauncherLayoutContext | null>(null);

export function LauncherLayoutProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [newsFeedSection, setNewsFeedSection] = useState<Options>({
		scrollY: 0,
	});

	return (
		<LauncherLayout.Provider
			value={useMemo(
				() => ({ newsFeedSection, setNewsFeedSection }),
				[newsFeedSection],
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
