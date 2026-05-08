import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

const buttonVariants = cva(
  "group/button hover:translate-y-[-1px] active:scale-[0.98] active:not-aria-[haspopup]:translate-y-[2px] hover:cursor-pointer inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none w-fit select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 shadow-md",
  {
    variants: {
      variant: {
        primary: "bg-primary border-black border-2  text-primary-foreground",
        gradient:
          "bg-gradient-to-tr from-[#DCFFBC] to-[#6FD1D7] border-black border-2  text-primary-foreground",
      },
      size: {
        lg: "h-10 gap-2 px-5 py-6",
        rect: "gap-2 h-10 p-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

function Button({
  className,
  variant = "primary",
  size = "lg",
  asChild = false,
  startIcon,
  endIcon,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </Comp>
  );
}

/* =========================================
   KOMPONEN ZOOM BUTTON 
========================================= */

export interface ZoomButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  variant?: "primary" | "gradient" | "mapControl";
}

function ZoomButton({
  className,
  variant = "mapControl",
  onZoomIn,
  onZoomOut,
  ...props
}: ZoomButtonProps) {
  const bgClass =
    variant === "mapControl"
      ? "bg-primary w-fit transition-all hover:translate-y-[-1px] text-black"
      : variant === "gradient"
        ? "bg-gradient-to-tr from-[#DCFFBC] to-[#6FD1D7] text-primary-foreground"
        : "bg-primary text-primary-foreground";

  const interactiveClass =
    "flex hover:cursor-pointer transition-all items-center justify-center p-2.5  hover:bg-black/20 active:not-aria-[haspopup]:translate-y-px outline-none  disabled:pointer-events-none disabled:opacity-50";

  return (
    <div
      className={cn(
        "flex flex-col border-black border-2 rounded-md shadow-md overflow-hidden",
        bgClass,
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={onZoomIn}
        // Terapkan kelas interaktif di sini
        className={interactiveClass}
        aria-label="Zoom In"
      >
        <Plus className="size-5" strokeWidth={2.5} />
      </button>

      <div className="h-px w-full bg-black" />

      <button
        type="button"
        onClick={onZoomOut}
        // Terapkan kelas interaktif di sini
        className={interactiveClass}
        aria-label="Zoom Out"
      >
        <Minus className="size-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export { Button, ZoomButton, buttonVariants };
