import { useLocation } from "@remix-run/react";
import { Notifications } from "~/components/layout/menus/notifications";
import { ThemeToggle } from "~/components/layout/menus/theme-toggle";
import { useOsType } from "~/hooks/os-type";
import { cn } from "~/lib/utils";

export function MenuButtons({ className }: { className?: string }) {
	const location = useLocation();
	const osType = useOsType();

	return (
		<nav
			className={cn(
				" m-0.5 flex gap-x-0.5 p-px",
				{
					"mr-1": osType === "macos",
				},
				className,
			)}
		>
			<ThemeToggle />
			<Notifications />
		</nav>
	);
}
