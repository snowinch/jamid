import { CodeBlock } from './CodeBlock';

interface CodeBlockData {
    language: string;
    content: string;
}

interface TableRow {
    [key: string]: string;
}

interface SpecsSectionProps {
    number: string;
    title: string;
    content?: string;
    code?: CodeBlockData;
    code2?: CodeBlockData;
    list?: string[];
    footer?: string;
    conclusion?: string;
    table?: TableRow[];
}

export function SpecsSection({
    number,
    title,
    content,
    code,
    code2,
    list,
    footer,
    conclusion,
    table,
}: SpecsSectionProps) {
    // Get table headers from first row keys
    const tableHeaders = table && table.length > 0 ? Object.keys(table[0]) : [];

    return (
        <section className="mb-12 sm:mb-16">
            <div className="flex items-baseline gap-3 mb-4">
                <span className="text-primary font-bold text-lg sm:text-xl">
                    {number}.
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
            </div>

            {content && (
                <div className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {content.split("\n\n").map((paragraph, idx) => (
                        <p key={idx} className="text-sm sm:text-base mb-3">
                            {paragraph}
                        </p>
                    ))}
                </div>
            )}

            {code && (
                <div className="mb-4">
                    <CodeBlock language={code.language} content={code.content} />
                </div>
            )}

            {footer && !list && (
                <p className="mb-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {footer}
                </p>
            )}

            {list && (
                <>
                    {footer && (
                        <p className="mb-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            {footer}
                        </p>
                    )}
                    <ul className="mb-4 space-y-2">
                        {list.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="text-primary mr-3 mt-1 text-sm">•</span>
                                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {code2 && (
                <div className="mb-4">
                    <CodeBlock language={code2.language} content={code2.content} />
                </div>
            )}

            {conclusion && (
                <div className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {conclusion.split("\n\n").map((paragraph, idx) => (
                        <p key={idx} className="text-sm sm:text-base mb-3">
                            {paragraph}
                        </p>
                    ))}
                </div>
            )}

            {table && (
                <div className="mt-4 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    {/* Mobile: Cards */}
                    <div className="block sm:hidden">
                        {table.map((row, idx) => (
                            <div
                                key={idx}
                                className={`p-4 ${idx !== table.length - 1
                                        ? "border-b border-gray-200 dark:border-gray-800"
                                        : ""
                                    }`}
                            >
                                {tableHeaders.map((header, hIdx) => (
                                    <div key={hIdx} className="mb-2 last:mb-0">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase mb-1">
                                            {header}
                                        </div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            {row[header]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table */}
                    <table className="hidden sm:table w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                {tableHeaders.map((header, idx) => (
                                    <th
                                        key={idx}
                                        className="text-left p-4 font-semibold text-sm capitalize"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-black">
                            {table.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className={
                                        idx !== table.length - 1
                                            ? "border-b border-gray-200 dark:border-gray-800"
                                            : ""
                                    }
                                >
                                    {tableHeaders.map((header, hIdx) => (
                                        <td
                                            key={hIdx}
                                            className="p-4 text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            {row[header]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

