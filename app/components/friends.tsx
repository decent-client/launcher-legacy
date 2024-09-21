import {
	WebviewWindow,
	getAllWebviewWindows,
} from "@tauri-apps/api/webviewWindow";
import { AnimatePresence, motion } from "framer-motion";
import { Circle, Plus, Star } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

const friends = [
	{
		skin: "https://skins.mcstats.com/face/f25075b4-3c7a-43c2-8a40-f58adedbe46a",
		username: "liqws_wife",
		favorite: true,
		online: true,
		playing: "Hypixel",
	},
	{
		skin: "https://skins.mcstats.com/face/a4e6e3d14d6149e59b190f5e8a7454c9",
		username: "Alosted",
	},
	{
		skin: "https://skins.mcstats.com/face/1c682784-a9cc-43bd-8007-3aa2e3878712",
		username: "liqwtf",
		online: true,
		playing: "Hypixel",
	},
	{
		skin: "https://skins.mcstats.com/face/c4e8cb39-3e02-4f71-bf9f-65ecfeb087f9",
		username: "MMMMMMMMMMMMMMMMMM",
	},
	{
		skin: "https://skins.mcstats.com/face/64bc1be8-e903-4f18-8884-0bcda6153432",
		username: "nicalae",
		favorite: true,
	},
];

const MotionCircle = motion.create(Circle, { forwardMotionProps: true });

export function AddFriendButton({ className }: { className?: string }) {
	return (
		<Button className={cn("size-7", className)} size={"icon"} variant={"ghost"}>
			<Plus size={20} strokeWidth={3} />
		</Button>
	);
}

export function FriendList({ className }: { className?: string }) {
	const [openWindowUser, setOpenWindowUser] = useState<string | undefined>(
		undefined,
	);
	const cooldownRef = useRef<NodeJS.Timeout | null>(null);

	const openMessageWindow = useCallback(
		async (user?: string) => {
			if (cooldownRef.current) {
				toast.warning("Please wait a moment.");
				return;
			}

			cooldownRef.current = setTimeout(() => {
				cooldownRef.current = null;
			}, 2000);

			const openWindow = (await getAllWebviewWindows()).find(
				(window) => window.label === "messages",
			);

			if (openWindow && openWindowUser !== user) {
				await openWindow.close();
			}

			if (openWindow && openWindowUser === user) {
				await openWindow.setFocus();
			}

			setOpenWindowUser(user);

			new WebviewWindow("messages", {
				url: `/messages/${user}`,
				title: `Messages with ${user}`,
				width: 382,
				height: 564,
				hiddenTitle: true,
				center: true,
				decorations: false,
				transparent: true,
				maximizable: false,
			});
		},
		[openWindowUser],
	);

	return (
		<Command
			className={cn(
				"mt-1 h-auto w-64 max-w-64 overflow-hidden rounded-none bg-transparent",
				className,
			)}
		>
			<CommandInput
				className="mr-2 mb-1 ml-8 h-7 rounded-lg border-none bg-background/25 backdrop-blur-sm"
				placeholder={"Search for friends..."}
			/>
			<ScrollArea className="rounded-none ">
				<CommandList className="ml-8 max-h-96 w-56">
					{friends.map((friend) => {
						const [isHovering, setIsHovering] = useState(false);

						const keywords = [
							friend.username,
							friend.online ? "online" : "offline",
							friend.playing,
							friend.favorite && "favorite best",
						].filter(Boolean);

						return (
							<CommandItem
								key={friend.username}
								className={cn(
									"grid h-7 max-w-56 cursor-pointer gap-x-2 overflow-hidden rounded-md rounded-e-none p-1 transition-all hover:ml-1 hover:h-11",
									{
										"rounded-es-lg": isHovering,
									},
								)}
								style={{
									gridTemplateColumns: "20px 1fr 12px",
								}}
								onSelect={() => openMessageWindow(friend.username)}
								onMouseEnter={() => setIsHovering(true)}
								onMouseLeave={() => setIsHovering(false)}
								value={keywords.join(" ")}
							>
								{/* {friend.favorite && (
									<Star
										className=" fill-yellow-500 stroke-yellow-500"
										style={{
											top: 7,
										}}
										size={14}
									/>
								)} */}
								<img
									src={friend.skin}
									className="z-50 rounded-sm"
									alt="Face"
									width={20}
									height={20}
								/>
								<h1 className="truncate font-minecraft text-base text-minecraft-foreground leading-4">
									{friend.username}
								</h1>
								<AnimatePresence mode="popLayout">
									{isHovering && (
										<MotionCircle
											key={`${friend.username}-online`}
											className={cn(
												"col-start-1 row-start-2 justify-self-end",
												friend.online
													? "fill-green-500 text-green-500"
													: "fill-red-500 text-red-500",
											)}
											initial={{ y: -24, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											exit={{ y: -24, opacity: 0 }}
											transition={{
												y: { type: "spring", bounce: 0 },
												opacity: { duration: 0.2 },
											}}
											size={6}
										/>
									)}
									{isHovering && (
										<motion.p
											key={`${friend.username}-playing`}
											className="col-start-2 row-start-2 text-muted-foreground text-xs italic leading-4"
											initial={{ x: 256, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											exit={{ x: 256, opacity: 0 }}
											transition={{
												x: { type: "spring", bounce: 0 },
												opacity: { duration: 0.2 },
											}}
										>
											{friend.playing ? (
												<span>Playing on {friend.playing}</span>
											) : (
												<span>Last online 12 hours ago</span>
											)}
										</motion.p>
									)}
								</AnimatePresence>
								<MotionCircle
									className={cn(
										"col-start-3 row-start-1",
										friend.online
											? "fill-green-500 text-green-500"
											: "fill-red-500 text-red-500",
									)}
									animate={{
										opacity: isHovering ? 0 : 1,
									}}
									size={6}
								/>
							</CommandItem>
						);
					})}
					<CommandEmpty className="mr-8">No friends found</CommandEmpty>
				</CommandList>
			</ScrollArea>
		</Command>
	);
}
