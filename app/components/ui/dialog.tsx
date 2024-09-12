import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "~/lib/utils";

interface Style {
  [key: string]: string;
}

const cache = new WeakMap();

function set(
  el: Element | HTMLElement | null | undefined,
  styles: Style,
  ignoreCache = false,
): void {
  if (!el || !(el instanceof HTMLElement)) return;
  const originalStyles: Style = {};

  Object.entries(styles).forEach(([key, value]: [string, string]) => {
    if (key.startsWith("--")) {
      el.style.setProperty(key, value);
      return;
    }

    // @ts-ignore
    originalStyles[key] = (el.style as CSSStyleDeclaration)[key]; // @ts-ignore
    (el.style as CSSStyleDeclaration)[key] = value;
  });

  if (ignoreCache) return;

  cache.set(el, originalStyles);
}

function reset(el: Element | HTMLElement | null, prop?: string): void {
  if (!el || !(el instanceof HTMLElement)) return;
  const originalStyles = cache.get(el);

  if (!originalStyles) {
    return;
  }

  if (prop) {
    // @ts-ignore
    (el.style as CSSStyleDeclaration)[prop] = originalStyles[prop];
  } else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      // @ts-ignore
      (el.style as CSSStyleDeclaration)[key] = value;
    });
  }
}

const BORDER_RADIUS = 8;

const WINDOW_TOP_OFFSET = 26;

const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1],
};

const Dialog = ({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);

  function getScale(): number {
    return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
  }

  function scaleBackground(open: boolean): void {
    const wrapper = document.querySelector("[vaul-drawer-wrapper]");

    if (!wrapper) return;

    if (open) {
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        transform: `scale(${getScale()}) translate3d(0, 0, calc(env(safe-area-inset-top) + 14px))`,
        transformOrigin: "center",
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      });
    } else {
      reset(wrapper, "overflow");
      reset(wrapper, "transform");
      reset(wrapper, "borderRadius");
      set(wrapper, {
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      });
    }
  }

  return (
    <DialogPrimitive.Root
      onOpenChange={(open: boolean) => {
        setIsOpen(open);
        scaleBackground(open);
      }}
      open={isOpen}
      {...props}
    />
  );
};
Dialog.displayName = "Dialog";

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      `fixed inset-0 z-50 bg-black/75 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`,
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    removeCloseIcon?: boolean;

    className?: string;
  }
>(({ removeCloseIcon = false, className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl",
        className,
      )}
      {...props}
    >
      {children}
      {!removeCloseIcon && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>): JSX.Element => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>): JSX.Element => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  { className?: string } & React.ComponentPropsWithoutRef<
    typeof DialogPrimitive.Title
  >
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  { className?: string } & React.ComponentPropsWithoutRef<
    typeof DialogPrimitive.Description
  >
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
