import { Outlet } from "@remix-run/react";
import type { Handle } from "~/lib/types/handle";

export const handle: Handle = {
	titleBarOptions: {
		hideBackButton: true,
		hideTitle: true,
		hideMenuButtons: true,
		captionButtons: {
			hideMaximizeButton: true,
		},
	},
};

export default function MessagesLayout() {
	return (
		<main className="mt-[32px] flex flex-grow flex-col overflow-hidden">
			<Outlet />
		</main>
	);
}
