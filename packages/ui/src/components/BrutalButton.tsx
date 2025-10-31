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
        "bg-primary text-primary-foreground border-primary brutal-shadow hover:shadow-none",
    secondary:
        "bg-foreground text-background border-current brutal-shadow hover:shadow-none",
    outline:
        "bg-background text-foreground border-current brutal-shadow hover:shadow-none",
    ghost: "bg-transparent text-foreground border-transparent hover:bg-muted",
};

const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
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
                    "btn-brutal",
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

