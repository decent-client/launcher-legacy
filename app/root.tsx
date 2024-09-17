import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { WindowTitleBar } from "~/components/layout/title-bar";
import { Providers } from "~/lib/providers";
import { cn } from "~/lib/utils";

import tailwind from "~/tailwind.css?url";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: tailwind },
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
					"relative grid h-screen min-h-screen select-none overflow-hidden font-sans antialiased",
					className,
				)}
			>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
