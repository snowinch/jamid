import React from "react";
import { cn } from "../utils/cn";

export interface BrutalTableProps
    extends React.TableHTMLAttributes<HTMLTableElement> { }

export const BrutalTable = React.forwardRef<
    HTMLTableElement,
    BrutalTableProps
>(({ className, children, ...props }, ref) => {
    return (
        <div className="w-full overflow-x-auto">
            <table
                ref={ref}
                className={cn("table-brutal", className)}
                {...props}
            >
                {children}
            </table>
        </div>
    );
});

BrutalTable.displayName = "BrutalTable";

export interface BrutalTableHeaderProps
    extends React.HTMLAttributes<HTMLTableSectionElement> { }

export const BrutalTableHeader = React.forwardRef<
    HTMLTableSectionElement,
    BrutalTableHeaderProps
>(({ className, children, ...props }, ref) => {
    return (
        <thead ref={ref} className={cn("", className)} {...props}>
            {children}
        </thead>
    );
});

BrutalTableHeader.displayName = "BrutalTableHeader";

export interface BrutalTableBodyProps
    extends React.HTMLAttributes<HTMLTableSectionElement> { }

export const BrutalTableBody = React.forwardRef<
    HTMLTableSectionElement,
    BrutalTableBodyProps
>(({ className, children, ...props }, ref) => {
    return (
        <tbody ref={ref} className={cn("", className)} {...props}>
            {children}
        </tbody>
    );
});

BrutalTableBody.displayName = "BrutalTableBody";

export interface BrutalTableRowProps
    extends React.HTMLAttributes<HTMLTableRowElement> {
    /**
     * If true, adds hover effect
     */
    hoverable?: boolean;
}

export const BrutalTableRow = React.forwardRef<
    HTMLTableRowElement,
    BrutalTableRowProps
>(({ className, hoverable = false, children, ...props }, ref) => {
    return (
        <tr
            ref={ref}
            className={cn(
                hoverable && "hover:bg-muted transition-colors",
                className
            )}
            {...props}
        >
            {children}
        </tr>
    );
});

BrutalTableRow.displayName = "BrutalTableRow";

export interface BrutalTableHeadProps
    extends React.ThHTMLAttributes<HTMLTableCellElement> { }

export const BrutalTableHead = React.forwardRef<
    HTMLTableCellElement,
    BrutalTableHeadProps
>(({ className, children, ...props }, ref) => {
    return (
        <th ref={ref} className={cn("", className)} {...props}>
            {children}
        </th>
    );
});

BrutalTableHead.displayName = "BrutalTableHead";

export interface BrutalTableCellProps
    extends React.TdHTMLAttributes<HTMLTableCellElement> { }

export const BrutalTableCell = React.forwardRef<
    HTMLTableCellElement,
    BrutalTableCellProps
>(({ className, children, ...props }, ref) => {
    return (
        <td ref={ref} className={cn("", className)} {...props}>
            {children}
        </td>
    );
});

BrutalTableCell.displayName = "BrutalTableCell";

