import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import compassIcon from "@/assets/compass.svg";

const buttonVariants = cva(
  "group/button hover:translate-y-[-1px] active:scale-[0.99] active:not-aria-[haspopup]:translate-y-[1px] hover:cursor-pointer inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none w-fit select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 shadow-md",
  {
    variants: {
      variant: {
        primary:
          "bg-primary border-black border-1 border-b-3 border-r-2 active:border-b-1 active:border-r-1 text-primary-foreground",
        gradient:
          "bg-gradient-to-tr from-[#DCFFBC] to-[#6FD1D7] border-black border-1 border-b-3 border-r-2 active:border-b-1 active:border-r-1 text-primary-foreground",
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
    "flex hover:cursor-pointer transition-all items-center justify-center p-2.5  active:bg-black/20 active:not-aria-[haspopup]:translate-y-px outline-none  disabled:pointer-events-none disabled:opacity-50";

  return (
    <div
      className={cn(
        "flex flex-col border border-black border-b-4 border-r-3 rounded-md shadow-md overflow-hidden",
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
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-r-2 border-b-3 border-black bg-white shadow-md outline-none transition-all",
        "size-18 sm:size-22",
        "hover:-translate-y-px hover:cursor-pointer active:translate-y-0.5 active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      {/* Gambar Thumbnail */}
      <img
        src={imgSrc}
        alt={labelText}
        className="h-full select-none w-full object-cover transition-transform duration-500"
        draggable={false}
      />

      <div className="absolute bottom-0 left-0 w-full bg-black/60 py-0.5 text-center text-[10px] font-bold tracking-wider text-white backdrop-blur-sm">
        {labelText}
      </div>

      <div className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-black/10" />
    </button>
  );
}

/* =========================================
   KOMPONEN COMPASS BUTTON 
========================================= */

export interface CompassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  bearing: number;
  onReset: () => void;
}

function CompassButton({
  className,
  bearing,
  onReset,
  ...props
}: CompassButtonProps) {
  return (
    <button
      type="button"
      onClick={onReset}
      className={cn(
        "p-1 rounded-full border-2 border-black bg-primary shadow-md outline-none transition-all",
      )}
      {...props}
    >
      <span className="flex items-center justify-center">
        <img
          src={compassIcon.src}
          alt="Compass"
          className="size-6 hover:cursor-pointer"
          style={{ transform: `rotate(${-bearing}deg)` }}
        />
      </span>
    </button>
  );
}
export { Button, ZoomButton, MapStyleToggle, buttonVariants, CompassButton };
