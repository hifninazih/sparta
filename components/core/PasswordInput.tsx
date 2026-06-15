import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input, InputProps } from "@/components/core/input"

export interface PasswordInputProps extends InputProps {
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

export function PasswordInput({ className, visible, onVisibleChange, ...props }: PasswordInputProps) {
  const [internalShow, setInternalShow] = React.useState(false)
  
  const showPassword = visible !== undefined ? visible : internalShow;
  
  const handleToggle = () => {
    if (onVisibleChange) {
      onVisibleChange(!showPassword);
    } else {
      setInternalShow(!showPassword);
    }
  }

  return (
    <Input
      type={showPassword ? "text" : "password"}
      className={className}
      endIcon={
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center justify-center h-full text-slate-500 hover:text-black transition-colors"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
          <span className="sr-only">
            {showPassword ? "Sembunyikan password" : "Tampilkan password"}
          </span>
        </button>
      }
      {...props}
    />
  )
}
