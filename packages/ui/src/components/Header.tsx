import React from "react";
import { cn } from "../utils/cn";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Logo or brand component
     */
    logo?: React.ReactNode;
    /**
     * Navigation items
     */
    navigation?: React.ReactNode;
    /**
     * Actions (like theme toggle, buttons)
     */
    actions?: React.ReactNode;
    /**
     * If true, makes header sticky
     */
    sticky?: boolean;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
    (
        { className, logo, navigation, actions, sticky = false, children, ...props },
        ref
    ) => {
        return (
            <header
                ref={ref}
                className={cn(
                    "border-b-4 border-current bg-background",
                    sticky && "sticky top-0 z-50",
                    className
                )}
                {...props}
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        {logo && <div className="flex-shrink-0">{logo}</div>}

                        {/* Navigation - hidden on mobile if actions exist */}
                        {navigation && (
                            <nav className="hidden md:flex flex-1 justify-center">
                                {navigation}
                            </nav>
                        )}

                        {/* Actions */}
                        {actions && <div className="flex items-center gap-2 md:gap-4">{actions}</div>}

                        {children}
                    </div>
                </div>
            </header>
        );
    }
);

Header.displayName = "Header";

export interface NavLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * If true, applies active styles
     */
    active?: boolean;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
    ({ className, active = false, children, ...props }, ref) => {
        return (
            <a
                ref={ref}
                className={cn(
                    "px-4 py-2 font-black uppercase text-sm md:text-base",
                    "hover:text-primary transition-colors",
                    active && "text-primary underline decoration-2 underline-offset-4",
                    className
                )}
                {...props}
            >
                {children}
            </a>
        );
    }
);

NavLink.displayName = "NavLink";

