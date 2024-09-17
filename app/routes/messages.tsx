import { Outlet } from "@remix-run/react";

export default function MessagesLayout() {
	return (
		<main className="mt-[32px] flex flex-grow flex-col overflow-hidden">
			<Outlet />
		</main>
	);
}
