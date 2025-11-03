'use client'

import { useState } from 'react'

interface CodeBlockProps {
    language: string;
    content: string;
}

export function CodeBlock({ language, content }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 px-4 py-2 rounded-t-lg border border-gray-700">
                <span className="text-xs text-gray-400 font-mono">{language}</span>
                <button
                    onClick={handleCopy}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>
            <pre className="bg-gray-900 dark:bg-black p-4 rounded-b-lg overflow-x-auto border border-t-0 border-gray-700">
                <code className="text-sm text-gray-100 font-mono leading-relaxed">
                    {content}
                </code>
            </pre>
        </div>
    );
}

