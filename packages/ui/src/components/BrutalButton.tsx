import React from "react";
import { cn } from "../utils/cn";

export interface BrutalButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Button visual style variant
     */
    variant?: "primary" | "secondary" | "outline" | "ghost";
    /**
     * Button size
     */
    size?: "sm" | "md" | "lg";
    /**
     * If true, button will take full width
     */
    fullWidth?: boolean;
}

const variantStyles = {
    primary:
        "bg-magenta text-white border-magenta hover:bg-opacity-90",
    secondary:
        "bg-foreground text-background border-foreground hover:bg-opacity-90",
    outline:
        "bg-transparent text-foreground border-foreground hover:bg-foreground hover:text-background",
    ghost: "bg-transparent text-foreground border-transparent hover:bg-muted",
};

const sizeStyles = {
    sm: "px-4 py-2 text-sm font-medium",
    md: "px-6 py-3 text-sm font-medium",
    lg: "px-8 py-3 text-sm font-medium",
};

export const BrutalButton = React.forwardRef<
    HTMLButtonElement,
    BrutalButtonProps
>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            fullWidth = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled}
                className={cn(
                    "btn-brutal shadow-brutal-sm",
                    variantStyles[variant],
                    sizeStyles[size],
                    fullWidth && "w-full",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

BrutalButton.displayName = "BrutalButton";

