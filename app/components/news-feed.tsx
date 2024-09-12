"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Card } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useLocalStorage } from "~/hooks/local-storage";
import { useLauncherLayout } from "~/lib/providers/launcher-layout";
import { cn } from "~/lib/utils";

export function NewsFeed({ className }: Readonly<{ className?: string }>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { launcherLayout, setLauncherLayout } = useLauncherLayout();
  const [selectedOption, setSelectedOption] = useLocalStorage(
    "news-sort-option",
    "latest",
  );

  const {
    newsFeed: { scrollY },
  } = launcherLayout;

  useEffect(() => {
    function handleScroll() {
      setLauncherLayout({
        newsFeed: { scrollY: currentScrollRef?.scrollTop ?? 0 },
      });
    }

    const currentScrollRef = scrollRef.current;

    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [setLauncherLayout]);

  return (
    <motion.article
      className={cn("relative flex flex-col overflow-hidden", className)}
      animate={{
        marginLeft: scrollY > 0 ? "0.25rem" : "1rem",
        marginRight: scrollY > 0 ? "0.25rem" : "1rem",
      }}
    >
      <motion.nav
        className="flex items-center"
        animate={{
          marginLeft: scrollY > 0 ? "0.75rem" : "0rem",
        }}
      >
        <h1 className="font-mono text-lg font-bold">{"News Feed"}</h1>
        <span className="font-bold ml-4">&#8212;</span>
        <Select defaultValue={selectedOption} onValueChange={setSelectedOption}>
          <SelectTrigger className="gap-x-2 font-bold font-mono text-lg size-auto ml-2 px-2 py-0.5 border-none bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">{"Latest"}</SelectItem>
            <SelectItem value="oldest">{"Oldest"}</SelectItem>
          </SelectContent>
        </Select>
      </motion.nav>
      <ScrollArea
        ref={scrollRef}
        className="mt-1.5 h-12 flex-grow rounded-lg"
        hideScrollBar
      >
        <div className="grid  grid-cols-3 gap-2 rounded-[inherit]">
          {Array.from({ length: 100 }).map((_, i) => (
            <Card
              key={`card${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                i
              }`}
              className="grid border-b border-none bg-card/50"
            >
              <Card className="aspect-[24/10]" />
              <h1 className="m-2 text-sm font-medium leading-4">
                Title {i + 1}
              </h1>
              {/* <p className="mb-1 ml-2 text-sm leading-3 text-muted-foreground">
                Description
              </p> */}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </motion.article>
  );
}
