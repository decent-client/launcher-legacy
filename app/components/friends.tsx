import { Circle, Plus, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

const friends = [
  {
    skin: "https://skins.mcstats.com/face/f25075b4-3c7a-43c2-8a40-f58adedbe46a",
    username: "liqws_wife",
    favorite: true,
    online: true,
  },
  {
    skin: "https://skins.mcstats.com/face/a4e6e3d14d6149e59b190f5e8a7454c9",
    username: "Alosted",
  },
  {
    skin: "https://skins.mcstats.com/face/1c682784-a9cc-43bd-8007-3aa2e3878712",
    username: "liqwtf",
    online: true,
  },
  {
    skin: "https://skins.mcstats.com/face/c4e8cb39-3e02-4f71-bf9f-65ecfeb087f9",
    username: "MMMMMMMMMMMMMMMM",
  },
  {
    skin: "https://skins.mcstats.com/face/64bc1be8-e903-4f18-8884-0bcda6153432",
    username: "nicalae",
    favorite: true,
  },
];

export function AddFriendButton({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <Button className={cn("size-7", className)} size={"icon"} variant={"ghost"}>
      <Plus size={20} strokeWidth={3} />
    </Button>
  );
}

export function FriendList({ className }: Readonly<{ className?: string }>) {
  const sortedFriends = friends.sort((a, b) => {
    if (a.favorite && !b.favorite) {
      return -1;
    }

    if (!a.favorite && b.favorite) {
      return 1;
    }

    return 0;
  });

  return (
    <Command
      className={cn(
        "mt-1 h-auto w-64 overflow-hidden bg-transparent",
        className,
      )}
    >
      <CommandInput
        className="mb-1 ml-8 mr-2 h-7 rounded-lg border-none bg-background/25 backdrop-blur-sm"
        placeholder={"Search for friends..."}
      />
      <ScrollArea className="rounded-none ">
        <CommandList className="overflow-hidden w-64">
          {sortedFriends.map((friend) => (
            <CommandItem
              key={friend.username}
              className={cn(
                "group/friend max-w-64 w-full relative rounded-none p-0 aria-selected:bg-transparent",
              )}
            >
              <Button
                className="relative ml-9 flex h-7 w-full max-w-64 items-center justify-start gap-2 rounded-e-none p-1 pr-0 transition-[margin] group-hover/friend:ml-10 group-hover/friend:bg-accent"
                variant={"ghost"}
              >
                {friend.favorite && (
                  <Star
                    className="absolute -left-5 fill-yellow-500 stroke-yellow-500 transition-[left] group-hover/friend:-left-6"
                    size={14}
                  />
                )}
                <img
                  src={friend.skin}
                  className="rounded-sm"
                  alt="Face"
                  width={20}
                  height={20}
                />
                <span className="font-minecraft truncate text-base leading-5">
                  {friend.username}
                </span>
                <Circle
                  className={cn(
                    "mr-2 min-w-fit",
                    friend.online
                      ? "fill-green-500 text-green-500"
                      : "fill-red-500 text-red-500",
                  )}
                  size={6}
                />
              </Button>
            </CommandItem>
          ))}
          <CommandEmpty>{"No friends found"}</CommandEmpty>
        </CommandList>
      </ScrollArea>
    </Command>
  );
}
