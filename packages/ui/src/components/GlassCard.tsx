import * as React from "react"
import { cn } from "../lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  variant?: "light" | "dark"
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, variant = "light", ...props }, ref) => {
    const base =
      variant === "dark"
        ? "bg-white/8 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300"
        : "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300"

    const hoverStyle =
      variant === "dark"
        ? "hover:border-white/20 hover:bg-white/12 hover:-translate-y-1"
        : "hover:border-slate-300 hover:shadow-md hover:-translate-y-1"

    return (
      <div
        ref={ref}
        className={cn(base, hover && hoverStyle, className)}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
