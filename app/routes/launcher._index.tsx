import { Link } from "@remix-run/react";
import { Settings } from "lucide-react";
import { AddFriendButton, FriendList } from "~/components/friends";
import { LauncherCard } from "~/components/launcher-card";
import { NewsFeed } from "~/components/news-feed";
import { Button } from "~/components/ui/button";

export const handle = {
  breadcrumb: () => ["Launcher"],
  sidebar: Sidebar,
};

export default function Launcher() {
  return (
    <section className="flex-grow flex flex-col overflow-hidden">
      <LauncherCard />
      <NewsFeed className="pt-2 flex-grow overflow-hidden" />
    </section>
  );
}

function Sidebar() {
  return (
    <article className="overflow-hidden flex flex-col flex-grow">
      <h1 className="ml-8 font-mono text-xl font-bold">Friend List</h1>
      <AddFriendButton className="absolute right-2 top-0" />
      <FriendList />
      <Button
        className="ml-6 mt-auto h-7 w-full justify-start gap-3 rounded-e-none rounded-s-full transition-[margin] hover:ml-7"
        variant={"ghost"}
        size={"sm"}
        // onClick={openSettingsWindow}
        asChild
      >
        <Link to="/launcher/settings">
          <Settings size={16} />
          <span className="text-base font-medium">Settings</span>
        </Link>
      </Button>
    </article>
  );
}
