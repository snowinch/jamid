import React from "react";
import { cn } from "../utils/cn";

export interface H1Props extends React.HTMLAttributes<HTMLHeadingElement> { }

export const H1 = React.forwardRef<HTMLHeadingElement, H1Props>(
    ({ className, children, ...props }, ref) => {
        return (
            <h1
                ref={ref}
                className={cn(
                    "text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight leading-tight",
                    className
                )}
                {...props}
            >
                {children}
            </h1>
        );
    }
);

H1.displayName = "H1";

export interface H2Props extends React.HTMLAttributes<HTMLHeadingElement> { }

export const H2 = React.forwardRef<HTMLHeadingElement, H2Props>(
    ({ className, children, ...props }, ref) => {
        return (
            <h2
                ref={ref}
                className={cn(
                    "text-3xl md:text-4xl font-display font-semibold tracking-tight",
                    className
                )}
                {...props}
            >
                {children}
            </h2>
        );
    }
);

H2.displayName = "H2";

export interface H3Props extends React.HTMLAttributes<HTMLHeadingElement> { }

export const H3 = React.forwardRef<HTMLHeadingElement, H3Props>(
    ({ className, children, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn(
                    "text-2xl md:text-3xl font-display font-semibold tracking-tight",
                    className
                )}
                {...props}
            >
                {children}
            </h3>
        );
    }
);

H3.displayName = "H3";

export interface ParagraphProps
    extends React.HTMLAttributes<HTMLParagraphElement> {
    /**
     * Paragraph size
     */
    size?: "sm" | "md" | "lg";
}

const sizeStyles = {
    sm: "text-sm md:text-base",
    md: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
};

export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
    ({ className, size = "md", children, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={cn("leading-relaxed", sizeStyles[size], className)}
                {...props}
            >
                {children}
            </p>
        );
    }
);

Paragraph.displayName = "Paragraph";

export interface BlockquoteProps
    extends React.HTMLAttributes<HTMLQuoteElement> { }

export const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <blockquote
                ref={ref}
                className={cn(
                    "border-l-2 border-primary pl-4 md:pl-6 font-display font-medium text-lg md:text-xl leading-relaxed",
                    className
                )}
                {...props}
            >
                {children}
            </blockquote>
        );
    }
);

Blockquote.displayName = "Blockquote";

