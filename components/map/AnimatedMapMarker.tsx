"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedMapMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export function AnimatedMapMarker({
  children,
  className,
  ref,
  ...props
}: AnimatedMapMarkerProps) {
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    // Biarkan class animasi tetap ada selama durasi animasi (300ms + buffer)
    const timeout = setTimeout(() => {
      setIsMounting(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        className,
        isMounting && "animate-in fade-in zoom-in duration-300"
      )}
      {...props}
    >
      {children}
    </div>
  );
}
