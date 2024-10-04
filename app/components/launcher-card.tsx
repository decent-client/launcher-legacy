"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { useState } from "react";
import { AccountSelect } from "~/components/account-select";
import SkinView3D from "~/components/skin-viewer";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { usePlayerTexture } from "~/hooks/player-texture";
import { useSelectedAccount } from "~/lib/providers/account";
import { useLayout } from "~/lib/providers/layout";
import { cn } from "~/lib/utils";

const MotionCard = motion.create(Card);
const MotionButton = motion.create(Button);

export function LauncherCard({ className }: Readonly<{ className?: string }>) {
	const { selectedAccount } = useSelectedAccount();
	const { fullTexture, loading } = usePlayerTexture(
		selectedAccount?.profile.name,
	);
	const {
		newsFeedSection: { scrollY },
	} = useLayout();
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<MotionCard
			className={cn("relative grid rounded-lg bg-center", className)}
			style={{
				backgroundImage: "url(/images/launcher-background.png)",
			}}
			initial={{ height: "16rem" }}
			animate={{
				height: scrollY > 0 ? "5rem" : "16rem",
				// minHeight: collapseLauncherCard ? "5rem" : "16rem",
				backgroundSize: scrollY > 0 ? "150%" : "100%",
			}}
			whileHover={{
				backgroundSize: scrollY > 0 ? "155%" : "105%",
			}}
			transition={{
				bounce: 0,
				duration: 0.3,
			}}
		>
			<Backdrop />
			<article className="relative z-10 grid place-items-center overflow-hidden">
				{loading && <Skeleton className="absolute inset-0" />}
				<AccountSelect
					className="absolute top-1 left-1 w-auto min-w-32"
					open={openDialog}
					onOpen={setOpenDialog}
				/>
				<motion.div
					className="absolute bg-transparent"
					animate={{
						bottom: scrollY > 0 ? "-12rem" : "-4rem",
						scale: scrollY > 0 ? 0.75 : 1,
						opacity: scrollY > 0 ? 0 : 1,
					}}
					transition={{
						bounce: 0,
					}}
					onDoubleClick={() => setOpenDialog(true)}
				>
					{!loading && (
						<SkinView3D
							skinUrl={fullTexture}
							height={256 * 1.25}
							width={256}
							onReady={({ viewer }) => {
								viewer.fov = 35;
								viewer.camera.position.x = 22 * Math.sin(0.01) - 20;
								viewer.camera.position.y = 22 * Math.sin(0.01) + 15;
								viewer.controls.enableZoom = false;
								viewer.controls.enablePan = false;
							}}
						/>
					)}
				</motion.div>

				<LaunchButton center={scrollY > 0} />
			</article>
		</MotionCard>
	);
}

function LaunchButton({
	center,
}: Readonly<{
	center: boolean;
}>) {
	return (
		<MotionButton
			className="absolute flex h-auto items-center gap-x-4 rounded-xl py-2.5 pr-7 pl-5 transition-transform hover:scale-[1.0175] active:scale-[0.975]"
			animate={{
				marginTop: center ? "0" : "9rem",
			}}
			variant={"outline"}
		>
			<Rocket className="stroke-blue-500" size={36} strokeWidth={1.75} />
			<div className="flex flex-col whitespace-nowrap text-left text-foreground">
				<h1 className="font-bold font-mono text-lg leading-5 tracking-tight">
					Launch Minecraft
				</h1>
				<p className="font-sans text-muted-foreground text-xs italic leading-4 tracking-wide">
					on game version 1.8.9
				</p>
			</div>
		</MotionButton>
	);
}

function Backdrop() {
	return (
		<div className="absolute inset-0 overflow-hidden rounded-[inherit]">
			<span className="pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-sm" />
		</div>
	);
}
