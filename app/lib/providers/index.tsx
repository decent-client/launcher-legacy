import { Toaster } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import { LauncherLayoutProvider } from "~/lib/providers/launcher-layout";
import { SettingsProvider } from "~/lib/providers/settings-provider";
import { ThemeProvider } from "~/lib/providers/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <LauncherLayoutProvider>
          <SettingsProvider>
            {children}
            <Toaster
              position="bottom-right"
              theme="dark"
              offset={16}
              gap={8}
              richColors
            />
          </SettingsProvider>
        </LauncherLayoutProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
