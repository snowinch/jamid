import React from "react";
import { cn } from "../utils/cn";

export interface BrutalBadgeProps
    extends React.HTMLAttributes<HTMLSpanElement> {
    /**
     * Badge visual style variant
     */
    variant?: "default" | "primary" | "success" | "warning" | "danger";
    /**
     * Badge size
     */
    size?: "sm" | "md" | "lg";
}

const variantStyles = {
    default: "bg-foreground text-background border-current",
    primary: "bg-primary text-primary-foreground border-primary",
    success: "bg-green-500 text-white border-green-500",
    warning: "bg-primary text-primary-foreground border-primary",
    danger: "bg-primary text-primary-foreground border-primary",
};

const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
};

export const BrutalBadge = React.forwardRef<HTMLSpanElement, BrutalBadgeProps>(
    ({ className, variant = "default", size = "md", children, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center font-medium uppercase shadow-brutal-sm",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

BrutalBadge.displayName = "BrutalBadge";

