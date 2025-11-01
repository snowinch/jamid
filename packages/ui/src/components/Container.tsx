import React from "react";
import { cn } from "../utils/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const maxWidthVariants = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-[1400px]",
    full: "max-w-full",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ children, className, maxWidth = "xl", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "mx-auto border-x border-border min-h-screen bg-background",
                    maxWidthVariants[maxWidth],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Container.displayName = "Container";

