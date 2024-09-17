"use client";

import { Check, Monitor, Moon, MoonStar, Sun } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

import { titleCase } from "string-ts";
import { type Theme, useTheme } from "~/lib/providers/theme-provider";

const classNameItem = "gap-x-2 cursor-pointer";

export function ThemeToggle({ className }: Readonly<{ className?: string }>) {
	const { theme: activeTheme, resolvedTheme, setTheme } = useTheme();

	let themeIcon: JSX.Element;
	switch (resolvedTheme) {
		case "light":
			themeIcon = <Sun size={14} />;
			break;
		case "dark":
			themeIcon = <Moon size={14} />;
			break;
		case "oled":
			themeIcon = <MoonStar size={14} />;
			break;
		default:
			themeIcon = <Monitor size={14} />;
			break;
	}

	return (
		<DropdownMenu>
			<Tooltip>
				<TooltipTrigger asChild>
					<DropdownMenuTrigger asChild>
						<Button
							className={cn("size-[1.625rem]", className)}
							variant={"ghost"}
							size={"icon"}
							suppressHydrationWarning
						>
							{themeIcon}
						</Button>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<TooltipContent side="left">Select Theme</TooltipContent>
			</Tooltip>
			<DropdownMenuContent align="center" sideOffset={6}>
				{[
					{
						theme: "light" as Theme,
						icon: <Sun size={14} />,
					},
					{
						theme: "dark" as Theme,
						icon: <Moon size={14} />,
					},
					{
						theme: "oled" as Theme,
						icon: <MoonStar size={14} />,
					},
				].map(({ theme, icon }) => (
					<DropdownMenuItem
						key={theme}
						className={classNameItem}
						onClick={() => setTheme(theme)}
					>
						{icon}
						{titleCase(theme)}
						{activeTheme === theme && (
							<Check className="mr-1 ml-auto stroke-green-500" size={14} />
						)}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className={classNameItem}
					onClick={() => setTheme("system")}
				>
					<Monitor size={14} />
					System
					{activeTheme === "system" && (
						<Check className="mr-1 ml-auto stroke-green-500" size={14} />
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
