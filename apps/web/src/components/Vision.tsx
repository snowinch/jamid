interface VisionProps {
    title: string;
    text: string;
}

export function Vision({ title, text }: VisionProps) {
    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                    {title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {text}
                </p>
            </div>
        </section>
    );
}

