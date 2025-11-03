import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuestionCard } from "@/components/QuestionCard";
import { getOpenQuestions } from "@/lib/open-questions";
import { getContent } from "@/lib/db";

export const metadata = {
    title: "Open Questions - JAMID",
    description:
        "Community discussion on open questions and future directions for JAMID - Join the conversation",
};

export default async function OpenQuestionsPage() {
    const data = await getOpenQuestions();
    const content = await getContent();

    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        {data.title}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4">
                        {data.subtitle}
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        {data.intro}
                    </p>
                </div>
            </section>

            {/* Questions Grid */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {data.questions.map((question) => (
                            <QuestionCard
                                key={question.id}
                                number={question.number}
                                title={question.title}
                                question={question.question}
                                whyItMatters={question.whyItMatters}
                                section={question.section}
                                points={question.points}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Contribute */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                        {data.contribute.title}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">
                        {data.contribute.intro}
                    </p>
                    <ul className="space-y-3 mb-8 text-left max-w-2xl mx-auto">
                        {data.contribute.ways.map((way, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="text-primary mr-3 mt-1">•</span>
                                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    {way}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl">
                        <p className="text-base sm:text-lg mb-6 text-gray-700 dark:text-gray-300">
                            {data.contribute.cta.text}
                        </p>
                        <a
                            href={data.contribute.cta.button.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-base sm:text-lg"
                        >
                            {data.contribute.cta.button.label} →
                        </a>
                    </div>
                </div>
            </section>

            <Footer
                text={content.footer.text}
                subtext={content.footer.subtext}
                links={content.footer.links}
            />
        </main>
    );
}

