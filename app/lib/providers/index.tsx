import { TooltipProvider } from "~/components/ui/tooltip";
import { SelectedAccountProvider } from "~/lib/providers/account";
import { LayoutProvider } from "~/lib/providers/layout";
import { SettingsProvider } from "~/lib/providers/settings";
import { ThemeProvider } from "~/lib/providers/theme";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<TooltipProvider>
				<SelectedAccountProvider>
					<LayoutProvider>
						<SettingsProvider>
							{/*    */}
							{children}
							{/*    */}
						</SettingsProvider>
					</LayoutProvider>
				</SelectedAccountProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
}
