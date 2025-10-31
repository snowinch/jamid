import React, { useState } from "react";
import { cn } from "../utils/cn";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
    /**
     * Code content
     */
    code: string;
    /**
     * Programming language
     */
    language?: string;
    /**
     * If true, shows copy button
     */
    showCopy?: boolean;
    /**
     * File name or title
     */
    filename?: string;
}

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
    (
        {
            className,
            code,
            language,
            showCopy = true,
            filename,
            children,
            ...props
        },
        ref
    ) => {
        const [copied, setCopied] = useState(false);

        const handleCopy = async () => {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        };

        return (
            <div className="relative">
                {(filename || language) && (
                    <div className="flex items-center justify-between border-2 border-b-0 border-current bg-foreground text-background px-4 py-2">
                        <div className="flex items-center gap-2">
                            {filename && (
                                <span className="font-mono text-sm font-bold">{filename}</span>
                            )}
                            {language && (
                                <span className="text-xs font-bold uppercase opacity-70">
                                    {language}
                                </span>
                            )}
                        </div>
                        {showCopy && (
                            <button
                                onClick={handleCopy}
                                className="text-xs font-black uppercase hover:text-primary transition-colors"
                                aria-label="Copy code"
                            >
                                {copied ? "✓ Copied!" : "Copy"}
                            </button>
                        )}
                    </div>
                )}
                <pre
                    ref={ref}
                    className={cn(
                        "border-2 border-current bg-muted p-4 overflow-x-auto",
                        "font-mono text-sm",
                        className
                    )}
                    {...props}
                >
                    <code>{children || code}</code>
                </pre>
                {!filename && !language && showCopy && (
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 px-2 py-1 border-2 border-current bg-background text-foreground text-xs font-black uppercase hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        aria-label="Copy code"
                    >
                        {copied ? "✓" : "Copy"}
                    </button>
                )}
            </div>
        );
    }
);

CodeBlock.displayName = "CodeBlock";

