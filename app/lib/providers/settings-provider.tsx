import { appDataDir } from "@tauri-apps/api/path";
import {
	BaseDirectory,
	exists,
	mkdir,
	readTextFile,
	writeTextFile,
} from "@tauri-apps/plugin-fs";
import { createContext, useContext, useEffect, useState } from "react";
import { useSessionStorage } from "~/hooks/session-storage";
import {
	type Settings,
	initialSettings as defaultSettings,
} from "~/lib/constants/settings";
import { deepMerge } from "~/lib/utils";

export type SettingsTab =
	| "preferences"
	| "launcher"
	| "notifications"
	| "advanced"
	| "resources";

type SettingsProviderState = {
	settingsTab: SettingsTab;
	setSettingsTab: (tab: SettingsTab) => void;
	settings: Settings;
	setSettings: (settings: Settings) => void;
};

type FileNameJSON = `${string}.json`;

const SettingsProviderContext = createContext<SettingsProviderState>({
	settingsTab: "preferences",
	setSettingsTab: () => null,
	settings: defaultSettings,
	setSettings: () => null,
});

export function SettingsProvider({
	children,
	tabStorageKey = "settings-tab",
	initialSettings = defaultSettings,
	settingsFile = "launcher-settings.json",
}: {
	children: React.ReactNode;
	tabStorageKey?: string;
	initialSettings?: Settings;
	settingsFile?: FileNameJSON;
}) {
	const [settings, setSettingsState] = useState<Settings>(initialSettings);
	const [settingsTab, setSettingsTab] = useSessionStorage<SettingsTab>(
		tabStorageKey,
		"preferences",
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		initialize(initialSettings);
	}, []);

	async function initialize(values: Settings) {
		if (await exists(settingsFile, { baseDir: BaseDirectory.AppData })) {
			return readTextFile(settingsFile, {
				baseDir: BaseDirectory.AppData,
			}).then((content) => setSettingsState(JSON.parse(content)));
		}

		await createSettingsFile(settingsFile, values);
	}

	async function setSettings(values: Settings) {
		try {
			setSettingsState((prev) => deepMerge(prev, values));
			createSettingsFile(settingsFile, deepMerge(settings, values));
			console.log("Settings file written successfully");
		} catch (error) {
			console.error("Error writing settings file: ", error);
		}
	}

	return (
		<SettingsProviderContext.Provider
			value={{ settingsTab, setSettingsTab, settings, setSettings }}
		>
			{children}
		</SettingsProviderContext.Provider>
	);
}

export const useSettings = () => {
	const context = useContext(SettingsProviderContext);

	if (context === undefined)
		throw new Error("useSettings must be used within a SettingsProvider");

	return context;
};

async function createSettingsFile(fileName: FileNameJSON, content: Settings) {
	try {
		if (!(await exists(fileName, { baseDir: BaseDirectory.AppData }))) {
			await mkdir(await appDataDir());
		}

		await writeTextFile(fileName, JSON.stringify(content, null, 2), {
			baseDir: BaseDirectory.AppData,
		});
	} catch (error) {
		console.error("Error creating settings file: ", error);
	}
}
