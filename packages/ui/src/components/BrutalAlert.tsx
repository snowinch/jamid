import React from "react";
import { cn } from "../utils/cn";

export interface BrutalAlertProps
    extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Alert variant
     */
    variant?: "info" | "success" | "warning" | "danger";
    /**
     * Alert title
     */
    title?: string;
    /**
     * Icon to display
     */
    icon?: React.ReactNode;
}

const variantStyles = {
    info: "bg-background text-foreground border-foreground",
    success: "bg-green-500 text-white border-green-500",
    warning: "bg-primary text-primary-foreground border-primary",
    danger: "bg-primary text-primary-foreground border-primary",
};

export const BrutalAlert = React.forwardRef<HTMLDivElement, BrutalAlertProps>(
    ({ className, variant = "info", title, icon, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="alert"
                className={cn(
                    "border-2 brutal-shadow-sm p-4",
                    variantStyles[variant],
                    className
                )}
                {...props}
            >
                <div className="flex gap-3">
                    {icon && <div className="flex-shrink-0 font-black">{icon}</div>}
                    <div className="flex-1">
                        {title && <h5 className="mb-1 font-black uppercase">{title}</h5>}
                        <div className="text-sm font-bold">{children}</div>
                    </div>
                </div>
            </div>
        );
    }
);

BrutalAlert.displayName = "BrutalAlert";

