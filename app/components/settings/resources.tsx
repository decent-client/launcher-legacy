import type { UseFormReturn } from "react-hook-form";
import type { Settings } from "~/lib/constants/settings";
import { cn } from "~/lib/utils";

export function Resources({
  className,
  formData,
}: { className?: string; formData: UseFormReturn<Settings> }) {
  return (
    <form
      className={cn(
        "flex flex-col mt-4 ml-4 pr-4 space-y-8 overflow-hidden",
        className,
      )}
    ></form>
  );
}
