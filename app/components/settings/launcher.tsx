import type { UseFormReturn } from "react-hook-form";
import { Settings } from "~/lib/constants/settings";
import { cn } from "~/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";

export function Launcher({
  className,
  formData,
}: { className?: string; formData: UseFormReturn<Settings> }) {
  return (
    <form
      className={cn(
        "flex flex-col mt-4 ml-4 pr-4 space-y-8 overflow-hidden",
        className,
      )}
    >
      {/* <FormField
      control={form.control}
      name="launcher.language"
      render={({ field: { value, onChange } }) => (
        <FormItem className="pb-4">
          <div className="flex justify-between gap-4">
            <div>
              <FormLabel className="text-base font-bold">
                Language
              </FormLabel>
              <FormDescription>
                What language the launcher should be displayed in.
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
                  <SelectItem value="en-US">English</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    /> */}
      <FormField
        control={formData.control}
        name="launcher.autoBoot"
        render={({ field: { value, onChange } }) => (
          <FormItem className="space-y-0">
            <div className="flex items-center gap-x-4">
              <FormControl>
                <Switch
                  className="data-[state=checked]:bg-green-500"
                  checked={value}
                  onCheckedChange={onChange}
                />
              </FormControl>
              <FormLabel className="text-base font-bold">
                Automatically start on boot
              </FormLabel>
            </div>
            <FormDescription className="ml-[calc(36px+1rem)]">
              Whether the launcher should start when the system boots.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formData.control}
        name="launcher.exitToDock"
        render={({ field: { value, onChange } }) => (
          <FormItem className="space-y-0">
            <div className="flex items-center gap-x-4">
              <FormControl>
                <Switch
                  className="data-[state=checked]:bg-green-500"
                  checked={value}
                  onCheckedChange={onChange}
                />
              </FormControl>
              <FormLabel className="text-base font-bold">
                Exit to dock
              </FormLabel>
            </div>
            <FormDescription className="ml-[calc(36px+1rem)]">
              Whether the launcher should stay in the background after you close
              it.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  );
}
