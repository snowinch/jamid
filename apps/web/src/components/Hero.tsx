interface Button {
    label: string;
    url: string;
    variant?: string;
}

interface HeroProps {
    title: string;
    subtitle: string;
    buttons: Button[];
}

export function Hero({ title, subtitle, buttons }: HeroProps) {
    return (
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                    {title}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                    {subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    {buttons.map((button, index) => (
                        <a
                            key={index}
                            href={button.url}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors text-center ${button.variant === "primary"
                                    ? "bg-primary text-white hover:bg-primary-600"
                                    : "border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                                }`}
                        >
                            {button.label}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
