import { TooltipProvider } from "~/components/ui/tooltip";
import { LauncherLayoutProvider } from "~/lib/providers/launcher-layout";
import { SettingsProvider } from "~/lib/providers/settings";
import { ThemeProvider } from "~/lib/providers/theme";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<TooltipProvider>
				<LauncherLayoutProvider>
					<SettingsProvider>{children}</SettingsProvider>
				</LauncherLayoutProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
}
