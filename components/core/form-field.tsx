import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/core/label"

interface FormFieldProps {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export function FormField({ 
  label, 
  id, 
  children, 
  className, 
  description 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-black text-black">
        {label}
      </Label>
      {children}
      {description && (
        <p className="text-xs text-slate-500 font-medium">{description}</p>
      )}
    </div>
  )
}
