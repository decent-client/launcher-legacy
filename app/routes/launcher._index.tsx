import { Link } from "@remix-run/react";
import { Settings } from "lucide-react";
import { AddFriendButton, FriendList } from "~/components/friends";
import { LauncherCard } from "~/components/launcher-card";
import { NewsFeed } from "~/components/news-feed";
import { Button } from "~/components/ui/button";
import type { Handle } from "~/lib/types/handle";

export const handle: Handle = {
	Sidebar,
	titleBarOptions: {
		breadcrumb: ["Launcher"],
		hideBackButton: true,
	},
};

export default function Launcher() {
	return (
		<section className="flex flex-grow flex-col overflow-hidden">
			<LauncherCard />
			<NewsFeed className="flex-grow overflow-hidden pt-2" />
		</section>
	);
}

function Sidebar() {
	return (
		<article className="flex flex-grow flex-col overflow-hidden">
			<h1 className="ml-8 font-bold font-mono text-xl">Friend List</h1>
			<AddFriendButton className="absolute top-0 right-2" />
			<FriendList />
			<Button
				className="mt-auto ml-6 h-7 w-full justify-start gap-3 rounded-s-full rounded-e-none transition-[margin] hover:ml-7"
				variant={"ghost"}
				size={"sm"}
				asChild
			>
				<Link to="/launcher/settings">
					<Settings size={16} />
					<span className="font-medium text-base">Settings</span>
				</Link>
			</Button>
		</article>
	);
}
