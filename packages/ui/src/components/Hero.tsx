import React from "react";
import { cn } from "../utils/cn";

export interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Hero title
     */
    title: string;
    /**
     * Hero subtitle
     */
    subtitle?: string;
    /**
     * Optional action buttons
     */
    actions?: React.ReactNode;
    /**
     * Background variant
     */
    variant?: "default" | "primary" | "muted";
}

const variantStyles = {
    default: "bg-background text-foreground",
    primary: "bg-primary text-primary-foreground",
    muted: "bg-muted text-foreground",
};

export const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
    (
        {
            className,
            title,
            subtitle,
            actions,
            variant = "default",
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "border-y-4 border-current py-12 md:py-20 lg:py-32",
                    variantStyles[variant],
                    className
                )}
                {...props}
            >
                <div className="px-4 md:px-6">
                    <div className="space-y-6 md:space-y-8">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-lg md:text-xl lg:text-2xl font-bold max-w-3xl">
                                {subtitle}
                            </p>
                        )}
                        {actions && (
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                {actions}
                            </div>
                        )}
                        {children && <div className="pt-8">{children}</div>}
                    </div>
                </div>
            </div>
        );
    }
);

Hero.displayName = "Hero";

