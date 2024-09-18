import { Outlet } from "@remix-run/react";
import { LayoutCard } from "~/components/ui/card";
import { useHandle } from "~/hooks/handle";
import type { Handle } from "~/lib/types/handle";
import { cn } from "~/lib/utils";

export default function LauncherLayout() {
	const { Sidebar } = useHandle<Handle>();

	return (
		<main
			className={cn("mt-8 grid h-screen overflow-hidden", {
				"grid-cols-layout": Sidebar,
			})}
			vaul-drawer-wrapper=""
		>
			{Sidebar && (
				<aside className="relative mt-2 mb-8 flex flex-col overflow-hidden">
					{Sidebar()}
				</aside>
			)}
			<LayoutCard
				className={cn("flex flex-col overflow-hidden pb-0", {
					"rounded-ss-none border-l-0": !Sidebar,
				})}
			>
				<Outlet />
			</LayoutCard>
		</main>
	);
}
