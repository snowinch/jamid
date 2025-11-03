import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SpecsSection } from "@/components/SpecsSection";
import { getSpecs } from "@/lib/specs";
import { getContent } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
    const specs = await getSpecs();

    return {
        title: "Technical Specifications",
        description: `${specs.title} - Detailed technical specifications covering ${specs.sections.length} topics including data model, storage structure, security layers, and implementation details with code examples.`,
        openGraph: {
            title: specs.title,
            description: "Detailed technical specifications for JAMID smart contract - storage, security, and implementation details",
            url: `${SITE_URL}/specs`,
            type: "article",
        },
    };
}

export default async function SpecsPage() {
    const specs = await getSpecs();
    const content = await getContent();

    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        {specs.title}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Deep dive into the implementation details of the JAMID smart
                        contract
                    </p>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                        Table of Contents
                    </h2>
                    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {specs.sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="text-sm sm:text-base text-primary hover:underline"
                            >
                                {section.number}. {section.title}
                            </a>
                        ))}
                    </nav>
                </div>
            </section>

            {/* Content */}
            <article className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {specs.sections.map((section) => (
                        <div key={section.id} id={section.id}>
                            <SpecsSection
                                number={section.number}
                                title={section.title}
                                content={section.content}
                                code={section.code}
                                code2={section.code2}
                                list={section.list}
                                footer={section.footer}
                                conclusion={section.conclusion}
                                table={section.table}
                            />
                        </div>
                    ))}
                </div>
            </article>

            <Footer
                text={content.footer.text}
                subtext={content.footer.subtext}
                links={content.footer.links}
            />
        </main>
    );
}

