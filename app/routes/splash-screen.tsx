import { invoke } from "@tauri-apps/api/core";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Handle } from "~/lib/types/handle";
import { sleep } from "~/lib/utils";

export const handle: Handle = {
	titleBarOptions: {
		hideTitleBar: true,
	},
};

const loadingSubtitles = [
	"Tailoring your experience",
	"Loading your blocks",
	"Building your world",
	"Generating the landscapes",
	"Crafting your adventure",
	"Preparing your inventory",
	"Spawning the mobs",
	"Mining resources",
	"Generating villages",
	"Brewing potions",
	"Growing your crops",
	"Smelting your ores",
	"Expanding your map",
	"Loading your realms",
	"Constructing structures",
	"Enchanting your gear",
	"Terraforming your land",
	"Growing your forests",
];

export default function SplashScreen() {
	const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
	const [isSlowConnection, setIsSlowConnection] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsSlowConnection(true);
		}, 10000);

		intervalRef.current = setInterval(() => {
			setCurrentSubtitleIndex((prevIndex) => {
				let newIndex = Math.floor(Math.random() * loadingSubtitles.length);

				while (newIndex === prevIndex) {
					newIndex = Math.floor(Math.random() * loadingSubtitles.length);
				}

				return newIndex;
			});
		}, 5000);

		setupWindows();

		return (): void => {
			clearTimeout(timer);
			clearInterval(intervalRef.current);
		};
	}, []);

	return (
		<div
			className="pointer-events-none relative grid h-screen place-items-center text-center font-sans"
			data-tauri-drag-region
		>
			<span className="flex flex-col items-center justify-center">
				<h1 className="font-black text-3xl">
					{/* <ShinySpan className="tracking-wide"> */}
					Decent Client
					{/* </ShinySpan> */}
				</h1>
				<p className="flex items-center gap-2 font-medium text-muted-foreground text-sm italic">
					{/* <ShinySpan className="linear-mask flex items-center gap-2 text-sm font-medium italic text-zinc-500"> */}
					{loadingSubtitles[currentSubtitleIndex]}
					<Loader2 className="animate-spin stroke-muted-foreground" size={14} />
					{/* </ShinySpan> */}
				</p>
			</span>
			{isSlowConnection && (
				<p className="pointer-events-none absolute right-2 bottom-1 font-medium text-red-300 text-sm">
					Slow connection?
				</p>
			)}
			<img
				className="-scale-x-100 pointer-events-none absolute bottom-4 left-3"
				src={"/gifs/minecraft-bee.gif"}
				alt="Minecraft Bee"
				width={64}
				height={64}
			/>
		</div>
	);
}

function setupWindows() {
	if (typeof document !== "undefined") {
		sleep(5000).then(() => invoke("setup_windows"));
	}
}
