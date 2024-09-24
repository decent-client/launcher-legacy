import { createContext, useContext, useMemo, useState } from "react";

type Options = {
	scrollY: number;
};

type LayoutContext = {
	newsFeedSection: Options;
	setNewsFeedSection: (options: Options) => void;
};

const Layout = createContext<LayoutContext | null>(null);

export function LayoutProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [newsFeedSection, setNewsFeedSection] = useState<Options>({
		scrollY: 0,
	});

	return (
		<Layout.Provider
			value={useMemo(
				() => ({ newsFeedSection, setNewsFeedSection }),
				[newsFeedSection],
			)}
		>
			{children}
		</Layout.Provider>
	);
}

export const useLayout = () => {
	const context = useContext(Layout);

	if (!context) {
		throw new Error("useLayout must be used within a LayoutProvider");
	}

	return context;
};
