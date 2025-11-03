import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Vision } from "@/components/Vision";
import { WhyItMatters } from "@/components/WhyItMatters";
import { Governance } from "@/components/Governance";
import { Overview } from "@/components/Overview";
import { Roadmap } from "@/components/Roadmap";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/db";

export default async function Home() {
    const content = await getContent();

    return (
        <main className="min-h-screen">
            <Header />
            <Hero
                title={content.hero.title}
                subtitle={content.hero.subtitle}
                buttons={content.hero.buttons}
            />
            <Vision title={content.vision.title} text={content.vision.text} />
            <WhyItMatters
                title={content.whyItMatters.title}
                items={content.whyItMatters.items}
            />
            <Governance
                title={content.governance.title}
                text={content.governance.text}
                button={content.governance.button}
            />
            <Overview
                title={content.overview.title}
                text={content.overview.text}
                specs={content.overview.specs}
                button={content.overview.button}
            />
            <Roadmap
                title={content.roadmap.title}
                phases={content.roadmap.phases}
            />
            <Footer
                text={content.footer.text}
                subtext={content.footer.subtext}
                links={content.footer.links}
            />
        </main>
    );
}
