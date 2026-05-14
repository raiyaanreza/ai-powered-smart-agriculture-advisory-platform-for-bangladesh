import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-glass backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all duration-300",
          hover && "hover:border-emerald/30 hover:shadow-emerald/10 hover:-translate-y-1",
          className
        )}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
