import { invoke } from "@tauri-apps/api/core";
import { Cpu, Proportions } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import type { Settings } from "~/lib/constants/settings";
import { cn } from "~/lib/utils";

export function Preferences({
  className,
  formData,
}: { className?: string; formData: UseFormReturn<Settings> }) {
  const [systemMemory, setSystemMemory] = useState<number>(0);

  useEffect(() => {
    invoke("plugin:system-info|total_memory").then((memory) => {
      setSystemMemory(
        Math.floor(((memory as number) / 1024 / 1024 / 1024) * 1024) ?? 4096,
      );
    });
  }, []);

  return (
    <form
      className={cn(
        "flex flex-col mt-4 ml-4 pr-4 space-y-8 overflow-hidden",
        className,
      )}
    >
      <FormField
        control={formData.control}
        name="preferences.ram"
        render={({ field: { value, onChange } }) => (
          <FormItem className="space-y-0">
            <FormLabel className="flex items-end justify-between gap-2 text-base font-bold">
              <span>
                Allocated Ram
                <span className="ml-2 text-sm text-zinc-400">
                  {Intl.NumberFormat("en-US").format(value)} MB
                </span>
              </span>
              <Button
                className="h-6 translate-x-2 gap-2 px-2 text-sm text-yellow-500"
                variant={"ghost"}
                size={"sm"}
                onClick={(event) => {
                  event.preventDefault();
                  if (value === 4096) {
                    toast.warning("4096 MB of ram is already allocated");
                    return;
                  }

                  onChange(4096);
                  toast.success("4096 MB of ram has been allocated");
                }}
              >
                <Cpu size={14} />
                Detect Recommended
              </Button>
            </FormLabel>
            <div className="flex items-center gap-4">
              <FormControl>
                <Slider
                  min={1024}
                  max={systemMemory}
                  step={256}
                  defaultValue={[value]}
                  onValueChange={(values) => {
                    onChange(values[0]);
                  }}
                  value={[formData.getValues("preferences.ram")]}
                />
              </FormControl>
              <p className="whitespace-nowrap text-sm font-medium">
                <span className="mr-2 text-zinc-500">/</span>
                {Intl.NumberFormat("en-US").format(systemMemory)} MB
              </p>
            </div>
            <FormDescription className="flex justify-between">
              <span>The amount of memory the game instance can use.</span>
              <span className="italic">
                {systemMemory - value > 0
                  ? `${systemMemory - value} MB `
                  : "Nothing "}
                left to allocate
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formData.control}
        name="preferences.afterLaunch"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <div className="flex justify-between gap-4">
              <div>
                <FormLabel className="text-base font-bold">
                  After Game Launch
                </FormLabel>
                <FormDescription>
                  What the launcher should do after the game is launched.
                </FormDescription>
              </div>
              <FormControl>
                <Select
                  onValueChange={onChange}
                  defaultValue={value}
                  value={value}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={value} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Keep open</SelectItem>
                    <SelectItem value="hide">Hide</SelectItem>
                    <SelectItem value="close">Close</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex w-full">
        <FormField
          control={formData.control}
          name="preferences.resolution.width"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <div className="flex justify-between gap-4">
                <div>
                  <FormLabel className="flex items-center gap-2 text-base font-bold">
                    <span>Game Resolution</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="h-6 gap-2 px-2 text-sm text-blue-500"
                          variant={"ghost"}
                          size={"sm"}
                        >
                          <Proportions size={14} />
                          View Presets
                        </Button>
                      </DialogTrigger>
                      <DialogContent>hi</DialogContent>
                    </Dialog>
                  </FormLabel>
                  <FormDescription>
                    The resolution the game instance should start in
                  </FormDescription>
                  <FormMessage />
                </div>
                <FormItem className="space-y-0">
                  <FormControl>
                    <Input
                      className="w-32 placeholder:text-muted-foreground"
                      {...field}
                      placeholder="auto"
                    />
                  </FormControl>
                  <FormDescription className="italic">Width</FormDescription>
                </FormItem>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={formData.control}
          name="preferences.resolution.height"
          render={({ field }) => (
            <FormItem className="ml-2 space-y-0">
              <FormControl>
                <Input
                  className="w-32 placeholder:text-muted-foreground"
                  {...field}
                  placeholder="auto"
                />
              </FormControl>
              <FormDescription className="italic">Height</FormDescription>
            </FormItem>
          )}
        />
      </div>
    </form>
  );
}
