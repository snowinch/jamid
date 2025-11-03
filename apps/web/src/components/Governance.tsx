interface GovernanceProps {
    title: string;
    text: string;
    button: {
        label: string;
        url: string;
    };
}

export function Governance({ title, text, button }: GovernanceProps) {
    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                    {title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6 sm:mb-8">
                    {text}
                </p>
                <a
                    href={button.url}
                    className="inline-block px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors font-medium"
                >
                    {button.label}
                </a>
            </div>
        </section>
    );
}

