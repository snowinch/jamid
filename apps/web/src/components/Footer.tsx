interface Link {
    label: string;
    url: string;
}

interface FooterProps {
    text: string;
    subtext: string;
    links: Link[];
}

export function Footer({ text, subtext, links }: FooterProps) {
    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6">
                    <p className="text-base sm:text-lg mb-2">{text}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{subtext}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}

