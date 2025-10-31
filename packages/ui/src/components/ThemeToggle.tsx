import React from "react";
import { useTheme } from "../utils/theme";
import { cn } from "../utils/cn";

export interface ThemeToggleProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Icon size
     */
    size?: "sm" | "md" | "lg";
}

const sizeStyles = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
};

export const ThemeToggle = React.forwardRef<
    HTMLButtonElement,
    ThemeToggleProps
>(({ className, size = "md", ...props }, ref) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            ref={ref}
            onClick={toggleTheme}
            className={cn(
                "border-2 border-current brutal-shadow-sm bg-background",
                "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
                "transition-all flex items-center justify-center",
                sizeStyles[size],
                className
            )}
            aria-label="Toggle theme"
            {...props}
        >
            {theme === "light" ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                </svg>
            )}
        </button>
    );
});

ThemeToggle.displayName = "ThemeToggle";

