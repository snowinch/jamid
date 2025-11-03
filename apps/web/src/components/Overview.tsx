interface OverviewProps {
    title: string;
    text: string;
    specs: string[];
    button: {
        label: string;
        url: string;
    };
}

export function Overview({ title, text, specs, button }: OverviewProps) {
    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center">
                    {title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6 sm:mb-8 text-center">
                    {text}
                </p>
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8">
                    <ul className="space-y-3">
                        {specs.map((spec, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-primary mr-3 mt-1">✓</span>
                                <span className="text-sm sm:text-base">{spec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text-center">
                    <a
                        href={button.url}
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                    >
                        {button.label}
                    </a>
                </div>
            </div>
        </section>
    );
}

