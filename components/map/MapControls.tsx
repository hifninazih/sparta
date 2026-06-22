"use client";

import * as React from "react";
import { Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import compassIcon from "@/assets/compass.svg";

/* =========================================
   KOMPONEN ZOOM BUTTON 
========================================= */

export interface ZoomButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  variant?: "primary" | "gradient" | "mapControl";
}

export function ZoomButton({
  className,
  variant = "mapControl",
  onZoomIn,
  onZoomOut,
  ...props
}: ZoomButtonProps) {
  const bgClass =
    variant === "mapControl"
      ? "bg-primary text-black"
      : variant === "gradient"
        ? "bg-gradient-to-tr from-[#DCFFBC] to-[#6FD1D7] text-primary-foreground"
        : "bg-primary text-primary-foreground";

  const interactiveClass =
    "flex hover:cursor-pointer transition-colors duration-150 items-center justify-center p-2.5 hover:bg-black/10 active:bg-black/20 outline-none disabled:pointer-events-none disabled:opacity-50";

  return (
    <div
      className={cn(
        "flex w-fit flex-col overflow-hidden rounded-md border-2 border-black transition-all duration-150",
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

export function MapStyleToggle({
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

export function CompassButton({
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
