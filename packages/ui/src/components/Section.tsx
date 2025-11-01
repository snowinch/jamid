import React from "react";
import { cn } from "../utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    noBorderTop?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ children, className, noBorderTop = true, ...props }, ref) => {
        return (
            <section
                ref={ref}
                className={cn(
                    "border-border",
                    noBorderTop ? "border-b" : "border-y",
                    "px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16",
                    className
                )}
                {...props}
            >
                {children}
            </section>
        );
    }
);

Section.displayName = "Section";

