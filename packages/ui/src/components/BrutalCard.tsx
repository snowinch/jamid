import React from "react";
import { cn } from "../utils/cn";

export interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Card variant
     */
    variant?: "default" | "primary" | "accent";
    /**
     * Padding size
     */
    padding?: "none" | "sm" | "md" | "lg";
    /**
     * If true, adds hover effect
     */
    hoverable?: boolean;
}

const variantStyles = {
    default: "bg-background text-foreground",
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-foreground",
};

const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

export const BrutalCard = React.forwardRef<HTMLDivElement, BrutalCardProps>(
    (
        {
            className,
            variant = "default",
            padding = "md",
            hoverable = false,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "card-brutal",
                    variantStyles[variant],
                    paddingStyles[padding],
                    hoverable &&
                    "transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none cursor-pointer",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

BrutalCard.displayName = "BrutalCard";

export interface CardIconProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Icon element
     */
    icon: React.ReactNode;
    /**
     * Icon variant
     */
    variant?: "default" | "primary" | "accent";
}

const iconVariantStyles = {
    default: "bg-foreground text-background",
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-foreground",
};

export const CardIcon = React.forwardRef<HTMLDivElement, CardIconProps>(
    ({ className, icon, variant = "default", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "w-12 h-12 border-2 border-current flex items-center justify-center mb-4",
                    iconVariantStyles[variant],
                    className
                )}
                {...props}
            >
                {icon}
            </div>
        );
    }
);

CardIcon.displayName = "CardIcon";

export interface CardHeadingProps
    extends React.HTMLAttributes<HTMLHeadingElement> {
    /**
     * Heading level
     */
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardHeading = React.forwardRef<
    HTMLHeadingElement,
    CardHeadingProps
>(({ className, as: Component = "h3", children, ...props }, ref) => {
    return (
        <Component
            ref={ref}
            className={cn("font-black uppercase text-lg md:text-xl mb-2", className)}
            {...props}
        >
            {children}
        </Component>
    );
});

CardHeading.displayName = "CardHeading";

export interface CardDescriptionProps
    extends React.HTMLAttributes<HTMLParagraphElement> { }

export const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    CardDescriptionProps
>(({ className, children, ...props }, ref) => {
    return (
        <p
            ref={ref}
            className={cn("font-medium text-sm md:text-base", className)}
            {...props}
        >
            {children}
        </p>
    );
});

CardDescription.displayName = "CardDescription";

