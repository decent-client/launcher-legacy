import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { CommandPalette } from "~/components/command-palette";
import { WindowTitleBar } from "~/components/layout/title-bar";
import { Toaster } from "~/components/ui/sonner";
import { Providers } from "~/lib/providers";
import { cn } from "~/lib/utils";

import sonner from "~/styles/sonner.css?url";
import tailwind from "~/styles/tailwind.css?url";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: tailwind },
	{ rel: "stylesheet", href: sonner },
];

export default function App() {
	return (
		<Providers>
			<Document>
				<WindowTitleBar />
				<Outlet />
			</Document>
		</Providers>
	);
}

function Document({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body
				className={cn(
					"relative flex h-screen min-h-screen select-none flex-col overflow-hidden font-sans antialiased",
					className,
				)}
			>
				{children}
				<CommandPalette />
				<Toaster
					position="bottom-right"
					theme="dark"
					offset={16}
					gap={8}
					richColors
				/>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
