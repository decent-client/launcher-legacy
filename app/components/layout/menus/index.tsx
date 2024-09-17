import { useLocation } from "@remix-run/react";
import { Notifications } from "~/components/layout/menus/notifications";
import { ThemeToggle } from "~/components/layout/menus/theme-toggle";
import { cn } from "~/lib/utils";

export function MenuButtons({ className }: { className?: string }) {
	const location = useLocation();

	return (
		<nav
			className={cn(
				" m-0.5 flex gap-x-0.5 p-px",

				className,
			)}
		>
			<ThemeToggle />
			{!location.pathname.startsWith("/messages") && <Notifications />}
		</nav>
	);
}
