import { Outlet, UIMatch, useMatches } from "@remix-run/react";
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

  return (
    <main
      className={cn("grid mt-8  overflow-hidden", {
        "grid-cols-layout": matches.length > 0,
      })}
      // eslint-disable-next-line react/no-unknown-property
      vaul-drawer-wrapper=""
    >
      {matches.length > 0 && (
        <aside className="mt-2 relative mb-8 flex flex-col overflow-hidden">
          {matches.find(({ handle }) => handle?.sidebar)?.handle.sidebar()}
        </aside>
      )}
      <LayoutCard
        className={cn("flex flex-col pb-0 overflow-hidden", {
          "rounded-ss-none border-l-0": matches.length < 1,
        })}
      >
        <Outlet />
      </LayoutCard>
    </main>
  );
}
