import { ChevronRightIcon } from "@radix-ui/react-icons";
import {
  UIMatch,
  useLocation,
  useMatches,
  useNavigate,
} from "@remix-run/react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Fragment } from "react/jsx-runtime";
import tauriConfig from "~/../src-tauri/tauri.conf.json";
import { MenuButtons } from "~/components/layout/window/menus";
import { cn } from "~/lib/utils";

type ButtonType = "back" | "minimize" | "maximize" | "close";
type CaptionButton = {
  buttonType: ButtonType;
  icon: (isMaximized?: boolean) => React.ReactNode;
};

type BreadcrumbMatch = UIMatch<
  Record<string, unknown>,
  { breadcrumb: (data?: unknown) => string[] }
>;

const captionButtons: CaptionButton[] = [
  {
    buttonType: "minimize",
    icon: () => <>&#xE921;</>,
  },
  {
    buttonType: "maximize",
    icon: (isMaximized) => (isMaximized ? <>&#xE923;</> : <>&#xE922;</>),
  },
  {
    buttonType: "close",
    icon: () => <>&#xE8BB;</>,
  },
];

const homeLocation = "/launcher";

export function WindowTitleBar({
  className,
  includeMenuButtons = true,
}: {
  className?: string;
  includeMenuButtons?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const matches = (useMatches() as unknown as BreadcrumbMatch[]).filter(
    ({ handle }) => handle?.breadcrumb,
  );

  if (location.pathname === "/") {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 group/title-bar top-0 z-50 flex h-[32px] select-none",
        className,
      )}
      data-tauri-drag-region
    >
      <CaptionButton buttonType="back" onClick={() => navigate(homeLocation)}>
        &#xE72B;
      </CaptionButton>
      <img
        className="pointer-events-none my-[8px] ml-[16px] size-4"
        src="/favicon.ico"
        alt="Icon"
      />
      <ol className="pointer-events-none ml-[16px] flex gap-x-2 h-[32px] items-center whitespace-nowrap font-segoe-ui text-base">
        <li>Decent Client</li>
        {matches
          .filter((match) => match.handle && match.handle.breadcrumb)
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
      {includeMenuButtons && <MenuButtons className="ml-auto" />}
      <CaptionControlGroup
        className={cn({
          "ml-auto": !includeMenuButtons,
        })}
      >
        {captionButtons.map(({ buttonType, icon }) => (
          <CaptionButton
            key={buttonType}
            buttonType={buttonType}
            onClick={() => {
              switch (buttonType) {
                case "minimize":
                  return getCurrentWindow().minimize();
                case "maximize":
                  // getCurrentWindow().isMaximized().then(setIsMaximized);
                  return getCurrentWindow().maximize();
                case "close":
                  return getCurrentWindow().close();
              }
            }}
          >
            {icon(/*isMaximized*/)}
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
}: {
  buttonType?: ButtonType;
  children?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const location = useLocation();

  if (buttonType === "back" && location.pathname === homeLocation) {
    return null;
  }

  const currentWindow =
    typeof document !== "undefined" &&
    tauriConfig.app.windows.find(
      (window) => window.label === getCurrentWindow().label,
    );

  let buttonKey: string = "minimizable";
  switch (buttonType) {
    case "minimize":
      buttonKey = "minimizable";
      break;
    case "maximize":
      buttonKey = "maximizable";
      break;
    case "close":
      buttonKey = "closable";
      break;
  }

  return (
    <button
      key={buttonType}
      type="button"
      className={cn(
        "flex h-[32px] w-[46px] cursor-default items-center justify-center font-segoe-fluent-icons text-foreground transition-colors duration-100",
        "hover:bg-[rgba(255,255,255,0.0605)] active:bg-[rgba(255,255,255,0.0419)] disabled:text-[rgba(255,255,255,0.3628)] disabled:hover:bg-transparent",
        {
          "hover:bg-[rgb(196,43,28)] active:bg-[rgba(196,42,28,0.9)]":
            buttonType === "close",
        },
        className,
      )}
      style={{
        fontSize: "10px",
        fontWeight: 300,
      }}
      disabled={
        (currentWindow as { [key: string]: unknown })?.[buttonKey] !== undefined
          ? !(currentWindow as { [key: string]: unknown })?.[buttonKey]
          : false
      }
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
