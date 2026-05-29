import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base classes
  "group/button inline-flex w-fit shrink-0 select-none items-center justify-center whitespace-nowrap rounded-md border-2 border-black bg-clip-padding text-sm font-bold outline-none transition-all duration-150 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 " +
    // --- EFEK 3D NEO-BRUTALISM (SOFT VERSION) ---
    "shadow-[1px_2px_0px_rgba(0,0,0,1)] " + // Default: Shadow stabil 3px
    "hover:-translate-y-[2px] hover:-translate-x-[1px] hover:shadow-[2px_4px_0px_rgba(0,0,0,1)] " + // Hover: Hanya naik ke atas 2px
    "active:translate-y-[1px] active:translate-x-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)]", // Active: Ditekan sedikit (sisa shadow 2px)
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        // Hapus efek shadow spesifik di dalam variant, karena sudah kita satukan di base class atas
        gradient: "bg-gradient-to-tr from-[#DCFFBC] to-[#6FD1D7] text-black",
        outline: "bg-white text-black",
        destructive: "bg-red-500 text-white",
        ghost: "border-transparent bg-transparent text-slate-600 shadow-none hover:bg-slate-100 hover:text-black hover:shadow-none hover:translate-y-0 hover:translate-x-0 active:translate-y-0 active:translate-x-0",
      },
      size: {
        lg: "h-10 gap-2 px-5 py-6",
        rect: "h-10 gap-2 p-2.5",
        "icon-sm": "h-8 w-8 p-0",
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

export {
  Button,
  buttonVariants,
};
