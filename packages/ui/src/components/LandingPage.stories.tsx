import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "../utils/theme";
import { Header, NavLink } from "./Header";
import { Hero } from "./Hero";
import { Footer } from "./Footer";
import { BrutalButton } from "./BrutalButton";
import { ThemeToggle } from "./ThemeToggle";
import {
    BrutalCard,
    CardIcon,
    CardHeading,
    CardDescription,
} from "./BrutalCard";
import {
    BrutalTable,
    BrutalTableHeader,
    BrutalTableBody,
    BrutalTableRow,
    BrutalTableHead,
    BrutalTableCell,
} from "./BrutalTable";
import { CodeBlock } from "./CodeBlock";
import { H2, H3, Paragraph, Blockquote } from "./Typography";

const LandingPage = () => {
    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                {/* Header */}
                <Header
                    sticky
                    logo={
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary border-2 border-current" />
                            <span className="font-black text-xl uppercase">JAMID</span>
                        </div>
                    }
                    navigation={
                        <>
                            <NavLink href="#vision">Vision</NavLink>
                            <NavLink href="#why">Why</NavLink>
                            <NavLink href="#governance">Governance</NavLink>
                            <NavLink href="#overview">Overview</NavLink>
                            <NavLink href="#roadmap">Roadmap</NavLink>
                        </>
                    }
                    actions={
                        <>
                            <ThemeToggle size="sm" />
                            <BrutalButton variant="primary" size="sm">
                                Try it Now
                            </BrutalButton>
                        </>
                    }
                />

                {/* Hero */}
                <Hero
                    title="The trustless identity layer for Polkadot JAM"
                    subtitle="JAMID is a smart contract that defines a new open identity layer for JAM and Polkadot ecosystems. No custodians. No intermediaries—identities are stored on-chain, secured by cryptography, and interoperable across chains."
                    actions={
                        <>
                            <BrutalButton variant="primary" size="lg">
                                Whitepaper
                            </BrutalButton>
                            <BrutalButton variant="outline" size="lg">
                                GitHub
                            </BrutalButton>
                        </>
                    }
                />

                {/* Vision Section */}
                <section id="vision" className="py-16 md:py-24 border-b-4 border-current">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <H2>Vision</H2>
                            <Paragraph size="lg">
                                JAMID defines a new standard for identity on Polkadot—one that
                                belongs to everyone, not to a company.
                            </Paragraph>
                            <Paragraph>
                                It provides a permanent, on-chain registry of human-readable JAM
                                identities (JIDs), with full sovereignty and zero custodianship.
                            </Paragraph>
                        </div>
                    </div>
                </section>

                {/* Why It Matters Section */}
                <section id="why" className="py-16 md:py-24 border-b-4 border-current">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-6xl mx-auto space-y-12">
                            <H2 className="text-center">Why It Matters</H2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <BrutalCard hoverable>
                                    <CardIcon
                                        icon={
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                                <path d="M2 17l10 5 10-5" />
                                                <path d="M2 12l10 5 10-5" />
                                            </svg>
                                        }
                                    />
                                    <CardHeading>No Custody</CardHeading>
                                    <CardDescription>
                                        Your key, your identity. No intermediaries.
                                    </CardDescription>
                                </BrutalCard>

                                <BrutalCard hoverable>
                                    <CardIcon
                                        variant="primary"
                                        icon={
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M12 6v6l4 2" />
                                            </svg>
                                        }
                                    />
                                    <CardHeading>On-Chain</CardHeading>
                                    <CardDescription>
                                        No intermediaries. Secured by cryptography.
                                    </CardDescription>
                                </BrutalCard>

                                <BrutalCard hoverable>
                                    <CardIcon
                                        icon={
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                            </svg>
                                        }
                                    />
                                    <CardHeading>Connected</CardHeading>
                                    <CardDescription>
                                        Works across JAM and parachains.
                                    </CardDescription>
                                </BrutalCard>

                                <BrutalCard hoverable>
                                    <CardIcon
                                        variant="primary"
                                        icon={
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                            </svg>
                                        }
                                    />
                                    <CardHeading>Governable</CardHeading>
                                    <CardDescription>
                                        Fees fund the ecosystem, not companies.
                                    </CardDescription>
                                </BrutalCard>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Governance Section */}
                <section id="governance" className="py-16 md:py-24 bg-primary text-primary-foreground border-y-4 border-current">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto space-y-8 text-center">
                            <H2>Governance</H2>
                            <Paragraph size="lg">
                                JAMID redirects all fees directly to the Polkadot Treasury.
                            </Paragraph>
                            <Paragraph>
                                Its evolution is managed collectively by the OpenGov system.
                                Snowinch contributed JAMID to the network and maintains it as an
                                open public good.
                            </Paragraph>
                            <div className="pt-4">
                                <BrutalButton variant="secondary" size="lg">
                                    Treasury Proposal
                                </BrutalButton>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Overview Section */}
                <section id="overview" className="py-16 md:py-24 border-b-4 border-current">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <H2>Overview</H2>
                            <Paragraph>
                                JAMID is built with ink! and designed to be verifiable,
                                auditable, and immutable.
                            </Paragraph>
                            <ul className="space-y-3 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="font-black text-primary">•</span>
                                    <Paragraph>Written in Rust</Paragraph>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="font-black text-primary">•</span>
                                    <Paragraph>Deployed on JAM</Paragraph>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="font-black text-primary">•</span>
                                    <Paragraph>Source code 100% public</Paragraph>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="font-black text-primary">•</span>
                                    <Paragraph>Signatures verified with sr25519 / ed25519</Paragraph>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="font-black text-primary">•</span>
                                    <Paragraph>Immutability baked in (no admin key)</Paragraph>
                                </li>
                            </ul>

                            <div className="pt-8">
                                <BrutalButton variant="outline">Read the Specs</BrutalButton>
                            </div>
                        </div>
                    </div>
                </section>

                {/* JAMID Format Section */}
                <section className="py-16 md:py-24 bg-muted border-y-4 border-current">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <H3>JAMID Format</H3>
                            <Paragraph>
                                Each JAMID follows a standardized format for universal
                                compatibility:
                            </Paragraph>
                            <CodeBlock
                                code="JAMID:{genesis_hash}:register:{jid}:{nonce}:{contract_address}"
                                showCopy
                            />
                        </div>
                    </div>
                </section>

                {/* Roadmap Section */}
                <section id="roadmap" className="py-16 md:py-24 border-b-4 border-current">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <H2>Roadmap</H2>
                            <BrutalTable>
                                <BrutalTableHeader>
                                    <BrutalTableRow>
                                        <BrutalTableHead>Phase</BrutalTableHead>
                                        <BrutalTableHead>Description</BrutalTableHead>
                                    </BrutalTableRow>
                                </BrutalTableHeader>
                                <BrutalTableBody>
                                    <BrutalTableRow hoverable>
                                        <BrutalTableCell>V0.9</BrutalTableCell>
                                        <BrutalTableCell>Internal testing (Snowinch)</BrutalTableCell>
                                    </BrutalTableRow>
                                    <BrutalTableRow hoverable>
                                        <BrutalTableCell>V1.0</BrutalTableCell>
                                        <BrutalTableCell>
                                            Public deployment (JAM / Treasury redirect)
                                        </BrutalTableCell>
                                    </BrutalTableRow>
                                    <BrutalTableRow hoverable>
                                        <BrutalTableCell>V1.1</BrutalTableCell>
                                        <BrutalTableCell>
                                            DAO recognition & community maintenance
                                        </BrutalTableCell>
                                    </BrutalTableRow>
                                    <BrutalTableRow hoverable>
                                        <BrutalTableCell>V2.0</BrutalTableCell>
                                        <BrutalTableCell>
                                            Burned ownership → full autonomy
                                        </BrutalTableCell>
                                    </BrutalTableRow>
                                </BrutalTableBody>
                            </BrutalTable>
                        </div>
                    </div>
                </section>

                {/* Quote Section */}
                <section className="py-16 md:py-24 bg-primary text-primary-foreground border-y-4 border-current">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto">
                            <Blockquote className="text-center text-2xl md:text-3xl border-0">
                                "Built with ❤️ by SNOWINCH S.L. — Contributor to the Polkadot
                                OpenGov ecosystem"
                            </Blockquote>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </ThemeProvider>
    );
};

const meta = {
    title: "Examples/Landing Page",
    component: LandingPage,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {};

export const LightTheme: Story = {
    parameters: {
        backgrounds: { default: "light" },
    },
};

export const DarkTheme: Story = {
    parameters: {
        backgrounds: { default: "dark" },
    },
    decorators: [
        (Story) => (
            <div className="dark">
                <Story />
            </div>
        ),
    ],
};

