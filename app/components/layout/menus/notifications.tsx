import { Bell } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export function Notifications({ className }: Readonly<{ className?: string }>) {
  return (
    <Drawer direction="right">
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button
              className={cn("group size-[1.625rem]", className)}
              variant={"ghost"}
              size={"icon"}
            >
              <Bell size={14} />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent className="font-sans" side="left">
          Notification Center
        </TooltipContent>
      </Tooltip>
      <NotificationCenter />
    </Drawer>
  );
}

function NotificationCenter({ className }: Readonly<{ className?: string }>) {
  return (
    <DrawerContent
      className={cn(
        "left-auto right-0 h-screen w-96 rounded-xl rounded-e-none",
        className,
      )}
      showHandle={false}
    >
      <DrawerHeader>
        <DrawerTitle className="font-mono">Notification Center</DrawerTitle>
      </DrawerHeader>
    </DrawerContent>
  );
}
