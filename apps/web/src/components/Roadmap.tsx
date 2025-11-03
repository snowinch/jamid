interface RoadmapPhase {
    version: string;
    description: string;
}

interface RoadmapProps {
    title: string;
    phases: RoadmapPhase[];
}

export function Roadmap({ title, phases }: RoadmapProps) {
    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center">
                    {title}
                </h3>
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    {/* Mobile: Cards */}
                    <div className="block sm:hidden">
                        {phases.map((phase, index) => (
                            <div
                                key={index}
                                className={`p-4 ${index !== phases.length - 1
                                        ? "border-b border-gray-200 dark:border-gray-800"
                                        : ""
                                    }`}
                            >
                                <div className="font-semibold text-primary mb-2">
                                    {phase.version}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {phase.description}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table */}
                    <table className="hidden sm:table w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800">
                                <th className="text-left p-4 font-semibold">Phase</th>
                                <th className="text-left p-4 font-semibold">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {phases.map((phase, index) => (
                                <tr
                                    key={index}
                                    className={
                                        index !== phases.length - 1
                                            ? "border-b border-gray-200 dark:border-gray-800"
                                            : ""
                                    }
                                >
                                    <td className="p-4 font-semibold text-primary">
                                        {phase.version}
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">
                                        {phase.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

