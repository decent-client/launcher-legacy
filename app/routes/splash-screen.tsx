import { invoke } from "@tauri-apps/api/core";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelectedAccount } from "~/lib/providers/account";
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
	const { selectedAccount } = useSelectedAccount();
	const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
	const [isSlowConnection, setIsSlowConnection] = useState(false);
	const [showGreet, setShowGreet] = useState(false);
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

	async function setupWindows() {
		await sleep(5000);

		if (selectedAccount) {
			setShowGreet(true);
			await sleep(2000);
		}

		await invoke("setup_windows");
	}

	return (
		<div
			className="relative grid h-screen place-items-center text-center font-sans"
			data-tauri-drag-region
		>
			<AnimatePresence>
				{showGreet && selectedAccount ? (
					<motion.h2
						className="pointer-events-none font-black text-2xl drop-shadow-md"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						Welcome back, {selectedAccount.username}
					</motion.h2>
				) : (
					<motion.span
						className="ointer-events-none flex flex-col items-center justify-center drop-shadow-md"
						initial={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<h1 className="font-black text-3xl">Decent Client</h1>
						<p className="flex items-center gap-2 font-medium text-muted-foreground text-sm italic">
							{loadingSubtitles[currentSubtitleIndex]}
							<Loader2
								className="animate-spin stroke-muted-foreground"
								size={14}
							/>
						</p>
					</motion.span>
				)}
			</AnimatePresence>
			{isSlowConnection && (
				<p className="pointer-events-none absolute right-2 bottom-1 font-medium text-red-300 text-sm drop-shadow-md">
					Slow connection?
				</p>
			)}
			<motion.img
				className="-scale-x-100 pointer-events-none absolute bottom-4 drop-shadow-md"
				src={"/gifs/minecraft-bee.gif"}
				alt="Minecraft Bee"
				animate={{
					left: !showGreet ? "0.75rem" : "100vw",
					transition: { duration: 0.75, ease: "easeInOut" },
				}}
				width={64}
				height={64}
			/>
		</div>
	);
}
