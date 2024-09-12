import { Notifications } from "~/components/layout/window/menus/notifications";
import { ThemeToggle } from "~/components/layout/window/menus/theme-toggle";
import { cn } from "~/lib/utils";

export function MenuButtons({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        " m-0.5 p-px space-x-0.5",

        className,
      )}
    >
      <ThemeToggle />
      <Notifications />
    </nav>
  );
}
