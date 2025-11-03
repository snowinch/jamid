interface WhyItMattersItem {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface WhyItMattersProps {
    title: string;
    items: WhyItMattersItem[];
}

export function WhyItMatters({ title, items }: WhyItMattersProps) {
    return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center">
                    {title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary dark:hover:border-primary transition-colors"
                        >
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

