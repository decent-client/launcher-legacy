import { ChevronRightIcon } from "@radix-ui/react-icons";
import {
	type UIMatch,
	useLocation,
	useMatches,
	useNavigate,
} from "@remix-run/react";
import {
	type Window as CurrentWindow,
	getCurrentWindow,
} from "@tauri-apps/api/window";
import { useEffect, useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import tauriConfig from "~/../src-tauri/tauri.conf.json";
import { MenuButtons } from "~/components/layout/menus";
import { showSnapOverlay } from "~/lib/tauri";
import { cn } from "~/lib/utils";

type ButtonType = "back" | "minimize" | "maximize" | "close";
type CaptionButton = {
	type: ButtonType;
	getIcon: (condition?: boolean) => React.ReactNode;
	props: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

type BreadcrumbMatch = UIMatch<
	Record<string, unknown>,
	{ breadcrumb: (data?: unknown) => string[] }
>;

export function WindowTitleBar({
	className,
	homeLocation = "/launcher",
}: {
	className?: string;
	homeLocation?: string;
}) {
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const [isMaximized, setIsMaximized] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const matches = (useMatches() as unknown as BreadcrumbMatch[]).filter(
		({ handle }) => handle?.breadcrumb,
	);

	const window = getCurrentWindow();

	if (location.pathname === "/") {
		return null;
	}

	useEffect(() => {
		const updateMaximizedState = async () => {
			const maximized = await window.isMaximized();
			setIsMaximized(maximized);
		};

		updateMaximizedState();

		const unlistenResize = window.onResized(updateMaximizedState);

		return () => {
			unlistenResize.then((unlisten) => unlisten());
		};
	}, [window]);

	const captionButtons: CaptionButton[] = [
		{
			type: "minimize",
			getIcon: () => <>&#xE921;</>,
			props: {
				onClick: () => {
					window.minimize();
				},
			},
		},
		{
			type: "maximize",
			getIcon: (isMaximized) => (isMaximized ? <>&#xE923;</> : <>&#xE922;</>),
			props: {
				onClick: () => {
					window.toggleMaximize();
					if (timerRef.current) {
						clearTimeout(timerRef.current);
						timerRef.current = null;
					}
				},
				onMouseEnter: () => {
					timerRef.current = setTimeout(() => {
						showSnapOverlay(window);
					}, 620);
				},
				onMouseLeave: () => {
					if (timerRef.current) {
						clearTimeout(timerRef.current);
						timerRef.current = null;
					}
				},
			},
		},
		{
			type: "close",
			getIcon: () => <>&#xE8BB;</>,
			props: {
				onClick: () => {
					window.close();
				},
			},
		},
	];

	return (
		<header
			className={cn(
				"group/title-bar fixed inset-x-0 top-0 z-50 flex h-[32px] select-none",
				className,
			)}
			data-tauri-drag-region
		>
			{" "}
			{!location.pathname.startsWith("/messages") && (
				<Fragment>
					{location.pathname !== homeLocation && (
						<CaptionButton
							buttonType="back"
							onClick={() => navigate(homeLocation)}
						>
							&#xE72B;
						</CaptionButton>
					)}
					<img
						className="pointer-events-none my-[8px] ml-[16px] size-4"
						src="/favicon.ico"
						alt="Icon"
					/>
					<ol className="pointer-events-none ml-[16px] flex h-[32px] items-center gap-x-2 whitespace-nowrap font-segoe-ui text-base">
						<li>Decent Client</li>
						{matches
							.filter((match) => match.handle?.breadcrumb)
							.flatMap((match) =>
								match.handle.breadcrumb(match).map((crumb, index) => (
									<Fragment key={crumb}>
										{index > 0 && (
											<li className="[&>svg]:size-3.5">
												<ChevronRightIcon className="stroke-muted-foreground" />
											</li>
										)}
										<li className="text-muted-foreground">{crumb}</li>
									</Fragment>
								)),
							)}
					</ol>
				</Fragment>
			)}
			<MenuButtons className="ml-auto" />
			<CaptionControlGroup>
				{captionButtons.map((button) => (
					<CaptionButton
						key={button.type}
						buttonType={button.type}
						{...button.props}
					>
						{button.getIcon(isMaximized)}
					</CaptionButton>
				))}
			</CaptionControlGroup>
		</header>
	);
}

function CaptionButton({
	buttonType,
	children,
	className,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	buttonType: ButtonType;
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<button
			key={buttonType}
			type="button"
			className={cn(
				"flex h-[32px] w-[46px] cursor-default items-center justify-center font-segoe-fluent-icons text-foreground transition-colors duration-100",
				"hover:bg-[rgba(255,255,255,0.0605)] active:bg-[rgba(255,255,255,0.0419)] disabled:text-[rgba(255,255,255,0.3628)] disabled:hover:bg-transparent",
				{
					"hover:bg-[rgb(196_43_28)] active:bg-[rgb(196_42_28/0.9)]":
						buttonType === "close",
				},
				className,
			)}
			style={{
				fontSize: "10px",
				fontWeight: 300,
			}}
			{...props}
		>
			{children}
		</button>
	);
}

function CaptionControlGroup({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <nav className={cn("flex", className)}>{children}</nav>;
}
