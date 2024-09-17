import { Outlet, type UIMatch, useMatches } from "@remix-run/react";
import { LayoutCard } from "~/components/ui/card";
import { cn } from "~/lib/utils";

type SidebarMatch = UIMatch<
	Record<string, unknown>,
	{ sidebar: (data?: unknown) => React.ReactNode | null }
>;

export default function LauncherLayout() {
	const matches = (useMatches() as unknown as SidebarMatch[]).filter(
		({ handle }) => handle?.sidebar,
	);

	console.log(matches);

	return (
		<main
			className={cn("mt-8 grid h-screen overflow-hidden", {
				"grid-cols-layout": matches.length > 0,
			})}
			vaul-drawer-wrapper=""
		>
			{matches.length > 0 && (
				<aside className="relative mt-2 mb-8 flex flex-col overflow-hidden">
					{matches.find(({ handle }) => handle?.sidebar)?.handle.sidebar()}
				</aside>
			)}
			<LayoutCard
				className={cn("flex flex-col overflow-hidden pb-0", {
					"rounded-ss-none border-l-0": matches.length < 1,
				})}
			>
				<Outlet />
			</LayoutCard>
		</main>
	);
}
