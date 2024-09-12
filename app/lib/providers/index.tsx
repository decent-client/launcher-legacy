import { TooltipProvider } from "~/components/ui/tooltip";
import { LauncherLayoutProvider } from "~/lib/providers/launcher-layout";
import { SettingsProvider } from "~/lib/providers/settings-provider";
import { ThemeProvider } from "~/lib/providers/theme-provider";

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
