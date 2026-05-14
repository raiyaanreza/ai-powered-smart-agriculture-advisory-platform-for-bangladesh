import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-earth-700 to-earth-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-earth-600",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
        outline:
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400",
        secondary:
          "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400",
        ghost:
          "text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400",
        link:
          "text-earth-700 underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-earth-600",
        gold:
          "bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-gold-500",
      },
      size: {
        default: "h-10 px-5",
        sm:      "h-8 px-4 text-xs rounded-lg",
        lg:      "h-12 px-8 text-[15px]",
        xl:      "h-14 px-10 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
