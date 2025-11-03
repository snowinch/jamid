interface WhitepaperSectionProps {
    number: string;
    title: string;
    content?: string;
    list?: string[];
    footer?: string;
    specs?: Array<{ label: string; value: string }>;
    table?: Array<{ phase: string; description: string }>;
    type?: string;
}

export function WhitepaperSection({
    number,
    title,
    content,
    list,
    footer,
    specs,
    table,
    type,
}: WhitepaperSectionProps) {
    const isWarning = type === "warning";

    return (
        <section className="mb-12 sm:mb-16">
            <div className="flex items-baseline gap-3 mb-4">
                <span className="text-primary font-bold text-lg sm:text-xl">
                    {number}.
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
            </div>

            {content && (
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {content.split("\n\n").map((paragraph, idx) => (
                        <p key={idx} className="text-sm sm:text-base">
                            {paragraph}
                        </p>
                    ))}
                </div>
            )}

            {list && (
                <ul className="mt-4 space-y-2">
                    {list.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                            <span className="text-primary mr-3 mt-1 text-sm">•</span>
                            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {footer && (
                <p className="mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {footer}
                </p>
            )}

            {specs && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6 space-y-3">
                    {specs.map((spec, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center">
                            <span className="font-semibold text-sm sm:text-base w-full sm:w-48 mb-1 sm:mb-0">
                                {spec.label}:
                            </span>
                            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                {spec.value}
                            </span>
                        </div>
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
                                <div className="font-semibold text-primary mb-2 text-sm">
                                    {row.phase}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    {row.description}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table */}
                    <table className="hidden sm:table w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="text-left p-4 font-semibold text-sm">Phase</th>
                                <th className="text-left p-4 font-semibold text-sm">
                                    Description
                                </th>
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
                                    <td className="p-4 font-semibold text-primary text-sm">
                                        {row.phase}
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                                        {row.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isWarning && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start">
                        <span className="text-yellow-600 dark:text-yellow-500 mr-2 text-lg">
                            ⚠️
                        </span>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            {content}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}

