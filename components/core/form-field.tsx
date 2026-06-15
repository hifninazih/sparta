import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/core/label"
import { CheckCircle, AlertCircle } from "lucide-react"

interface FormFieldProps {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
  error?: string;
  success?: string;
}

export function FormField({ 
  label, 
  id, 
  children, 
  className, 
  description,
  error,
  success
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-black text-black">
        {label}
      </Label>
      {children}
      {description && !error && !success && (
        <p className="text-xs text-slate-500 font-medium">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 font-bold flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
      {success && !error && (
        <p className="text-xs text-green-600 font-bold flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          {success}
        </p>
      )}
    </div>
  )
}

