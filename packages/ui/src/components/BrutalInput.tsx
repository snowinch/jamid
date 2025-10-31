import React from "react";
import { cn } from "../utils/cn";

export interface BrutalInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    /**
     * Label for the input
     */
    label?: string;
    /**
     * Error message to display
     */
    error?: string;
    /**
     * Helper text to display below the input
     */
    helperText?: string;
    /**
     * If true, displays full width
     */
    fullWidth?: boolean;
}

export const BrutalInput = React.forwardRef<HTMLInputElement, BrutalInputProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            fullWidth = false,
            disabled,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        const hasError = !!error;

        return (
            <div className={cn("flex flex-col gap-2", fullWidth && "w-full")}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-black uppercase tracking-wide"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    disabled={disabled}
                    className={cn(
                        "input-brutal",
                        hasError && "border-primary",
                        disabled && "opacity-50 cursor-not-allowed",
                        className
                    )}
                    {...props}
                />
                {(error || helperText) && (
                    <p
                        className={cn(
                            "text-xs font-bold",
                            hasError ? "text-primary" : "text-foreground opacity-70"
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

BrutalInput.displayName = "BrutalInput";

