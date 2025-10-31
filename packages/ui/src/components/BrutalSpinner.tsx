import React from "react";
import { cn } from "../utils/cn";

export interface BrutalSpinnerProps
    extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Spinner size
     */
    size?: "sm" | "md" | "lg" | "xl";
    /**
     * Spinner color
     */
    color?: "primary" | "foreground" | "accent";
}

const sizeStyles = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-[3px]",
    xl: "h-12 w-12 border-4",
};

const colorStyles = {
    primary: "border-primary border-t-transparent",
    foreground: "border-foreground border-t-transparent",
    accent: "border-primary border-t-transparent",
};

export const BrutalSpinner = React.forwardRef<
    HTMLDivElement,
    BrutalSpinnerProps
>(({ className, size = "md", color = "primary", ...props }, ref) => {
    return (
        <div
            ref={ref}
            role="status"
            className={cn("inline-block", className)}
            {...props}
        >
            <div
                className={cn(
                    "animate-spin rounded-full",
                    sizeStyles[size],
                    colorStyles[color]
                )}
            />
            <span className="sr-only">Loading...</span>
        </div>
    );
});

BrutalSpinner.displayName = "BrutalSpinner";

