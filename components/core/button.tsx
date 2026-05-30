import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import compassIcon from "@/assets/compass.svg";

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
  // Hapus hover translate dari bgClass karena efek 3D akan ditangani oleh wrapper utama
  const bgClass =
    variant === "mapControl"
      ? "bg-primary text-black"
      : variant === "gradient"
        ? "bg-gradient-to-tr from-[#DCFFBC] to-[#6FD1D7] text-primary-foreground"
        : "bg-primary text-primary-foreground";

  // Efek active inner (klik area dalam) hanya mengubah warna, tidak menggeser
  const interactiveClass =
    "flex hover:cursor-pointer transition-colors duration-150 items-center justify-center p-2.5 hover:bg-black/10 active:bg-black/20 outline-none disabled:pointer-events-none disabled:opacity-50";

  return (
    <div
      className={cn(
        "flex w-fit flex-col overflow-hidden rounded-md border-2 border-black transition-all duration-150",
        // Fisika Soft Neo-Brutalism
        "shadow-[1px_2px_0px_rgba(0,0,0,1)]",
        "hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[2px_4px_0px_rgba(0,0,0,1)]",
        "active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,1)]",
        bgClass,
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={onZoomIn}
        className={interactiveClass}
        aria-label="Zoom In"
      >
        <Plus className="size-5" strokeWidth={3} />
      </button>

      {/* Pembatas dibikin 2px agar seimbang dengan border luar */}
      <div className="h-0.5 w-full bg-black" />

      <button
        type="button"
        onClick={onZoomOut}
        className={interactiveClass}
        aria-label="Zoom Out"
      >
        <Minus className="size-5" strokeWidth={3} />
      </button>
    </div>
  );
}

/* =========================================
   KOMPONEN MAP STYLE TOGGLE (SATELIT / STREET)
========================================= */

export interface MapStyleToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSatellite: boolean;
  onToggle: () => void;
}

function MapStyleToggle({
  className,
  isSatellite,
  onToggle,
  ...props
}: MapStyleToggleProps) {
  const imgSrc = isSatellite
    ? "/images/street-basemap.png"
    : "/images/satellite-basemap.png";

  const labelText = isSatellite ? "Peta" : "Satelit";

  return (
    <button
      type="button"
      onClick={onToggle}
      title={`Ubah ke ${labelText}`}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-white outline-none",
        "size-18 sm:size-22",
        "border-2 border-black transition-all duration-150 hover:cursor-pointer",
        // Fisika Soft Neo-Brutalism
        "shadow-[1px_2px_0px_rgba(0,0,0,1)]",
        "hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[2px_4px_0px_rgba(0,0,0,1)]",
        "active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,1)]",
        className,
      )}
      {...props}
    >
      <img
        src={imgSrc}
        alt={labelText}
        className="h-full w-full object-cover transition-transform duration-500 select-none hover:scale-110"
        draggable={false}
      />

      <div className="absolute bottom-0 left-0 w-full bg-black/60 py-0.5 text-center text-[10px] font-bold tracking-wider text-white backdrop-blur-sm">
        {labelText}
      </div>
    </button>
  );
}

/* =========================================
   KOMPONEN COMPASS BUTTON 
========================================= */

export interface CompassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  bearing: number;
  pitch: number;
  onReset: () => void;
}

function CompassButtonComponent({
  className,
  bearing,
  pitch,
  onReset,
  ...props
}: CompassButtonProps) {
  return (
    <button
      type="button"
      onClick={onReset}
      className={cn(
        "bg-primary rounded-full p-1.5 outline-none",
        "border-2 border-black transition-all duration-150 hover:cursor-pointer",
        // Fisika Soft Neo-Brutalism
        "shadow-[1px_2px_0px_rgba(0,0,0,1)]",
        "hover:-translate-x-px hover:-translate-y-0.5 hover:shadow-[2px_4px_0px_rgba(0,0,0,1)]",
        "active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,1)]",
        className,
      )}
      {...props}
    >
      <span
        className="flex items-center justify-center"
        style={{ perspective: "150px" }}
      >
        <img
          src={compassIcon.src}
          alt="Compass"
          className="size-6"
          style={{
            transform: `rotateX(${pitch}deg) rotate(${-bearing}deg)`,
          }}
        />
      </span>
    </button>
  );
}

export {
  Button,
  ZoomButton,
  MapStyleToggle,
  buttonVariants,
  CompassButtonComponent,
};
