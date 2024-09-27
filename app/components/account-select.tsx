import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ExternalLink, Plus } from "lucide-react";
import { MicrosoftIcon } from "~/components/icons/microsoft";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { usePlayerTexture } from "~/hooks/player-texture";
import { useSelectedAccount } from "~/lib/providers/account";
import { setupAuth } from "~/lib/tauri";
import { cn } from "~/lib/utils";

const MotionButton = motion.create(Button);

export function AccountSelect({ className }: { className?: string }) {
	const { accounts, selectedAccount, setSelectedAccount } =
		useSelectedAccount();
	const { headTexture: activeHeadTexture } = usePlayerTexture(
		selectedAccount?.username,
	);

	return (
		<Dialog>
			<Tooltip>
				<DialogTrigger asChild>
					<TooltipTrigger asChild>
						<MotionButton
							className={cn(
								"group h-[1.625rem] w-full justify-between gap-2 py-0 pr-3 pl-[0.1875rem]",
								className,
							)}
							variant={"ghost"}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{
								type: "spring",
								stiffness: 100,
								damping: 16,
								duration: 0.2,
								delay: 0.5,
							}}
						>
							<div className="inline-flex items-center gap-2">
								<img
									className="rounded-sm"
									src={activeHeadTexture}
									alt="Skin Head"
									width={20}
									height={20}
								/>
								<span className="mt-0.5 font-minecraft text-minecraft-foreground">
									{selectedAccount?.username ?? "Guest"}
								</span>
							</div>
							<ArrowRight
								className="stroke-muted-foreground transition-transform group-hover:translate-x-1"
								size={14}
								strokeWidth={2.5}
							/>
						</MotionButton>
					</TooltipTrigger>
				</DialogTrigger>
				<TooltipContent side="right">Select Account</TooltipContent>
			</Tooltip>
			<DialogContent>
				<DialogHeader className="space-y-0">
					<DialogTitle className="inline-flex items-center gap-2 font-bold font-mono text-lg">
						<MicrosoftIcon className="rounded-sm" size={18} />
						Select Minecraft Account
					</DialogTitle>
					<DialogDescription className="flex items-center gap-2 leading-4">
						Select an existing account, or add a new one.
					</DialogDescription>
				</DialogHeader>
				<motion.div
					className="space-y-1"
					// @ts-ignore - framer-motion
					initial={{ "--x": "100%", scale: 1 }}
					// @ts-ignore - framer-motion
					animate={{ "--x": "-100%" }}
					transition={{
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "loop",
						repeatDelay: 1,
						type: "spring",
						stiffness: 20,
						damping: 15,
						mass: 2,
						scale: {
							type: "spring",
							stiffness: 10,
							damping: 5,
							mass: 0.1,
						},
					}}
				>
					{accounts.length > 0 ? (
						accounts.map((account) => {
							const { headTexture: accountHeadTexture } = usePlayerTexture(
								account.username,
							);

							return (
								<Button
									key={account.username}
									className={cn(
										"group/account relative w-full justify-start gap-2.5 pl-1.5",
										account.active && "bg-blue-500/25 hover:bg-blue-500/50",
									)}
									variant={"ghost"}
									size={"sm"}
									onClick={() => {
										setSelectedAccount(account);
									}}
								>
									<img
										// src={accountHeadTexture}
										className="rounded-sm"
										alt="Face"
										width={20}
										height={20}
									/>
									<span className="font-minecraft text-base transition-[margin] group-hover/account:ml-1">
										{account.username}
									</span>
									{account.active && (
										<Check
											className="absolute right-4"
											strokeWidth={2.5}
											size={16}
										/>
									)}
								</Button>
							);
						})
					) : (
						<div className="px-8 py-6 text-center font-normal text-base">
							You do not have any accounts added.
						</div>
					)}
				</motion.div>
				{/* <Separator /> */}
				<DialogFooter>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="w-full gap-2"
								variant={"secondary"}
								onClick={() => setupAuth()}
							>
								<Plus size={16} strokeWidth={2.5} />
								<span className="text-base">Add another Account</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent spanClassName="flex items-center gap-x-2">
							Microsoft Authentication
							<ExternalLink className="text-zinc-500" size={14} />
						</TooltipContent>
					</Tooltip>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
