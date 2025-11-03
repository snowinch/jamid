interface QuestionCardProps {
    number: string;
    title: string;
    question: string;
    whyItMatters?: string;
    section?: string;
    points?: string[];
}

export function QuestionCard({
    number,
    title,
    question,
    whyItMatters,
    section,
    points,
}: QuestionCardProps) {
    return (
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-primary dark:hover:border-primary transition-colors">
            <div className="flex items-start gap-3 mb-3">
                <span className="text-primary font-bold text-lg shrink-0">
                    {number})
                </span>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>

            <div className="ml-0 sm:ml-8">
                <div className="mb-3">
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-500">
                        Question:{" "}
                    </span>
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {question}
                    </span>
                </div>

                {whyItMatters && (
                    <div className="mb-3">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-500">
                            Why it matters:{" "}
                        </span>
                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            {whyItMatters}
                        </span>
                    </div>
                )}

                {section && points && (
                    <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {section}
                        </p>
                        <ul className="space-y-1">
                            {points.map((point, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="text-primary mr-2 text-xs mt-1">•</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {point}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

