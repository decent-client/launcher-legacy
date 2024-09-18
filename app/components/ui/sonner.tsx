import {
	AlertTriangle,
	CheckCircle,
	Info,
	Loader,
	XCircle,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "~/lib/providers/theme-provider";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"h-auto w-full p-4 py-3 rounded-md border group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:rounded-lg group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			{...props}
		/>
	);
}
