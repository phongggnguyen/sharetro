"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-blue-600/90 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 border border-white/10 backdrop-blur-md hover:shadow-blue-500/40 hover:-translate-y-0.5",
                destructive:
                    "bg-red-500/90 text-white shadow-lg shadow-red-500/25 hover:bg-red-600 border border-white/10 backdrop-blur-md hover:shadow-red-500/40 hover:-translate-y-0.5",
                outline:
                    "border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:text-white text-foreground shadow-sm hover:-translate-y-0.5",
                secondary:
                    "bg-white/10 text-foreground hover:bg-white/20 border border-white/5 backdrop-blur-md hover:-translate-y-0.5",
                ghost: "hover:bg-white/10 hover:text-white backdrop-blur-sm",
                link: "text-blue-400 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2 rounded-xl",
                sm: "h-9 rounded-lg px-4",
                lg: "h-12 rounded-xl px-8 text-md font-bold",
                icon: "h-11 w-11 rounded-xl",
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
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
