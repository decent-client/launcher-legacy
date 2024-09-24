import { zodResolver } from "@hookform/resolvers/zod";
import { BaseDirectory, readTextFile } from "@tauri-apps/plugin-fs";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
	Advanced,
	Launcher,
	Notifications,
	Preferences,
	Resources,
} from "~/components/settings";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useDebouncedCallback } from "~/hooks/debounce";
import type { Settings as SettingsType } from "~/lib/constants/settings";
import { settingsSchema, settingsTabs } from "~/lib/constants/settings";
import { useSettings } from "~/lib/providers/settings";
import type { Handle } from "~/lib/types/handle";
import { cn } from "~/lib/utils";

export const handle: Handle = {
	Sidebar,
	titleBarOptions: {
		breadcrumb: ["Settings"],
	},
};

export default function Settings() {
	const { settings, settingsTab, setSettings } = useSettings();
	const isResettingForm = useRef(false);

	const form = useForm<SettingsType>({
		resolver: zodResolver(settingsSchema),
		defaultValues: settings,
		mode: "onChange",
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		resetForm();

		const { unsubscribe } = form.watch((values) => {
			if (!isResettingForm.current) {
				debouncedSettings(values as SettingsType);
			}
		});

		return () => unsubscribe();
	}, []);

	async function resetForm() {
		const content = await readTextFile("launcher-settings.json", {
			baseDir: BaseDirectory.AppData,
		});

		isResettingForm.current = true;
		form.reset(JSON.parse(content) as SettingsType);
		isResettingForm.current = false;
	}

	const debouncedSettings = useDebouncedCallback((value: SettingsType) => {
		setSettings(value);
	}, 1000);

	let settingsTabComponent: JSX.Element;
	switch (settingsTab) {
		case "launcher":
			settingsTabComponent = <Launcher formData={form} />;
			break;
		case "notifications":
			settingsTabComponent = <Notifications formData={form} />;
			break;
		case "advanced":
			settingsTabComponent = <Advanced formData={form} />;
			break;
		case "resources":
			settingsTabComponent = <Resources formData={form} />;
			break;
		default:
			settingsTabComponent = <Preferences formData={form} />;
			break;
	}

	return (
		<Form {...form}>
			<ScrollArea className="flex-grow pr-1">{settingsTabComponent}</ScrollArea>
		</Form>
	);
}

function Sidebar() {
	const { settingsTab, setSettingsTab } = useSettings();

	return (
		<article className="overflow-hidden">
			<h1 className="ml-8 font-bold font-mono text-xl">Settings</h1>
			<nav className="mt-1 flex flex-grow flex-col gap-y-0.5">
				{settingsTabs.map((tab) => {
					return (
						<Button
							key={tab.title}
							className={cn(
								"ml-6 h-7 w-full justify-start gap-3 rounded-s-full rounded-e-none transition-[margin] hover:ml-7",
								{
									"ml-7 bg-accent/50 text-blue-500 hover:ml-8 hover:text-blue-500":
										settingsTab === tab.value,
									"mt-auto": tab.value === "resources",
								},
							)}
							variant={"ghost"}
							size={"sm"}
							onClick={() => setSettingsTab(tab.value)}
						>
							{tab.icon}
							<span className="font-medium text-base">{tab.title}</span>
						</Button>
					);
				})}
			</nav>
		</article>
	);
}
