import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { cn } from "../utils/cn";
import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/outline";

export interface CodeBlockProps {
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
    /**
     * Additional CSS classes
     */
    className?: string;
}

// Custom style for syntax highlighting
const customStyle = {
    margin: 0,
    padding: "1rem",
    background: "transparent",
    fontSize: "0.875rem",
    lineHeight: "1.625",
};

const lightTheme = {
    'code[class*="language-"]': {
        color: "#24292e",
    },
    'pre[class*="language-"]': {
        color: "#24292e",
    },
    comment: { color: "#6a737d", fontStyle: "italic" },
    prolog: { color: "#6a737d" },
    doctype: { color: "#6a737d" },
    cdata: { color: "#6a737d" },
    punctuation: { color: "#24292e" },
    property: { color: "#005cc5" },
    tag: { color: "#22863a" },
    boolean: { color: "#005cc5" },
    number: { color: "#005cc5" },
    constant: { color: "#005cc5" },
    symbol: { color: "#005cc5" },
    deleted: { color: "#d73a49" },
    selector: { color: "#6f42c1" },
    "attr-name": { color: "#005cc5" },
    string: { color: "#032f62" },
    char: { color: "#032f62" },
    builtin: { color: "#e36209" },
    inserted: { color: "#22863a" },
    operator: { color: "#d73a49" },
    entity: { color: "#22863a" },
    url: { color: "#032f62" },
    variable: { color: "#e36209" },
    atrule: { color: "#005cc5" },
    "attr-value": { color: "#032f62" },
    function: { color: "#6f42c1" },
    "class-name": { color: "#6f42c1" },
    keyword: { color: "#d73a49" },
    regex: { color: "#032f62" },
    important: { color: "#d73a49", fontWeight: "bold" },
};

const darkTheme = {
    'code[class*="language-"]': {
        color: "#e1e4e8",
    },
    'pre[class*="language-"]': {
        color: "#e1e4e8",
    },
    comment: { color: "#8b949e", fontStyle: "italic" },
    prolog: { color: "#8b949e" },
    doctype: { color: "#8b949e" },
    cdata: { color: "#8b949e" },
    punctuation: { color: "#e1e4e8" },
    property: { color: "#79c0ff" },
    tag: { color: "#7ee787" },
    boolean: { color: "#79c0ff" },
    number: { color: "#79c0ff" },
    constant: { color: "#79c0ff" },
    symbol: { color: "#79c0ff" },
    deleted: { color: "#ffa198" },
    selector: { color: "#d2a8ff" },
    "attr-name": { color: "#79c0ff" },
    string: { color: "#a5d6ff" },
    char: { color: "#a5d6ff" },
    builtin: { color: "#ffa657" },
    inserted: { color: "#7ee787" },
    operator: { color: "#ff7b72" },
    entity: { color: "#7ee787" },
    url: { color: "#a5d6ff" },
    variable: { color: "#ffa657" },
    atrule: { color: "#79c0ff" },
    "attr-value": { color: "#a5d6ff" },
    function: { color: "#d2a8ff" },
    "class-name": { color: "#d2a8ff" },
    keyword: { color: "#ff7b72" },
    regex: { color: "#a5d6ff" },
    important: { color: "#ff7b72", fontWeight: "bold" },
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
    code,
    language = "text",
    showCopy = true,
    filename,
    className,
}) => {
    const [copied, setCopied] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Detect theme
    React.useEffect(() => {
        if (typeof window === "undefined") return;

        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    const handleCopy = async () => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div
            className={cn(
                "rounded-lg border border-border overflow-hidden bg-muted dark:bg-gray-900",
                className
            )}
        >
            {/* Header */}
            {(filename || language || showCopy) && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-background dark:border-white bg-muted dark:bg-gray-900">
                    <div className="flex items-center gap-2">
                        {filename && (
                            <span className="font-mono text-xs text-foreground">
                                {filename}
                            </span>
                        )}
                        {language && (
                            <span className="text-xs text-muted-foreground">
                                {language}
                            </span>
                        )}
                    </div>
                    {showCopy && (
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Copy code"
                        >
                            {copied ? (
                                <>
                                    <CheckIcon className="w-4 h-4" />
                                    <span>Copiato</span>
                                </>
                            ) : (
                                <>
                                    <DocumentDuplicateIcon className="w-4 h-4" />
                                    <span>Copia</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Code Content with Syntax Highlighting */}
            <SyntaxHighlighter
                language={language}
                style={isDark ? darkTheme : lightTheme}
                customStyle={customStyle}
                wrapLongLines
                className="!bg-muted dark:!bg-gray-900"
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

CodeBlock.displayName = "CodeBlock";

