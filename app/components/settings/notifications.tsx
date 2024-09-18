import type { UseFormReturn } from "react-hook-form";
import type { Settings } from "~/lib/constants/settings";
import { cn } from "~/lib/utils";

export function Notifications({
	className,
	formData,
}: { className?: string; formData: UseFormReturn<Settings> }) {
	return (
		<form
			className={cn(
				"mt-4 ml-4 flex flex-col space-y-8 overflow-hidden pr-4",
				className,
			)}
		></form>
	);
}
