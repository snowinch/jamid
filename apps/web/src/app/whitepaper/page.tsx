import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhitepaperSection } from "@/components/WhitepaperSection";
import { getWhitepaper } from "@/lib/whitepaper";
import { getContent } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
    const whitepaper = await getWhitepaper();

    return {
        title: "Whitepaper",
        description: `${whitepaper.title} - Technical documentation covering ${whitepaper.sections.length} key topics including motivation, design, architecture, security, and governance.`,
        openGraph: {
            title: whitepaper.title,
            description: "Technical whitepaper for JAMID - The trustless identity layer for Polkadot JAM",
            url: `${SITE_URL}/whitepaper`,
            type: "article",
        },
    };
}

export default async function WhitepaperPage() {
    const whitepaper = await getWhitepaper();
    const content = await getContent();

    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        {whitepaper.title}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Technical documentation for the trustless identity layer
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
                        {whitepaper.sections.map((section) => (
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
                    {whitepaper.sections.map((section) => (
                        <div key={section.id} id={section.id}>
                            <WhitepaperSection
                                number={section.number}
                                title={section.title}
                                content={section.content}
                                list={section.list}
                                footer={section.footer}
                                specs={section.specs}
                                table={section.table}
                                type={section.type}
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

