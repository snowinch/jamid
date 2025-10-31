import React from "react";
import { cn } from "../utils/cn";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Social/external links
     */
    links?: Array<{ label: string; href: string }>;
    /**
     * Copyright or attribution text
     */
    attribution?: React.ReactNode;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
    ({ className, links, attribution, children, ...props }, ref) => {
        const defaultAttribution = (
            <>
                <p className="font-black text-base md:text-lg mb-4">
                    Built with ❤️ by SNOWINCH S.L.
                </p>
                <p className="font-bold text-sm opacity-80">
                    Contributor to the Polkadot OpenGov ecosystem
                </p>
            </>
        );

        const defaultLinks = [
            { label: "[Github]", href: "#github" },
            { label: "[Subsquare]", href: "#subsquare" },
            { label: "[Explorer]", href: "#explorer" },
            { label: "[X]", href: "#x" },
        ];

        const displayLinks = links || defaultLinks;

        return (
            <footer
                ref={ref}
                className={cn(
                    "border-t-4 border-current bg-background mt-auto",
                    className
                )}
                {...props}
            >
                <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                    <div className="text-center space-y-6">
                        {attribution !== undefined ? attribution : defaultAttribution}

                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                            {displayLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="font-black text-sm md:text-base hover:text-primary transition-colors uppercase"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {children}
                    </div>
                </div>
            </footer>
        );
    }
);

Footer.displayName = "Footer";
