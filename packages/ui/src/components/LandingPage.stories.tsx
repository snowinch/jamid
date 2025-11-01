import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./Container";
import { Section } from "./Section";
import { BrutalButton } from "./BrutalButton";
import { H1, H2, H3, Paragraph, Blockquote } from "./Typography";
import { CodeBlock } from "./CodeBlock";
import { ThemeToggle } from "./ThemeToggle";

// Simple Header component for the story
const SimpleHeader = () => (
    <header className="sticky top-4 z-50 bg-background border-y border-border">
        <div className="relative bg-background flex items-center justify-between px-6 py-4 md:px-12 lg:px-16">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-magenta" />
                <span className="font-display text-xl font-semibold">JAMID</span>
            </div>

            <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
                <a href="#vision" className="hover:text-magenta transition-colors">
                    Vision
                </a>
                <a href="#why" className="hover:text-magenta transition-colors">
                    Why
                </a>
                <a href="#governance" className="hover:text-magenta transition-colors">
                    Governance
                </a>
                <a href="#overview" className="hover:text-magenta transition-colors">
                    Overview
                </a>
                <a href="#roadmap" className="hover:text-magenta transition-colors">
                    Roadmap
                </a>
            </nav>

            <div className="flex items-center gap-4">
                <ThemeToggle size="sm" />
                <button className="px-4 py-2 border border-border hover:bg-magenta hover:text-white hover:border-magenta transition-colors text-sm font-medium">
                    Try it Now
                </button>
            </div>
        </div>
    </header>
);

// Simple Footer component for the story
const SimpleFooter = () => {
    const links = [
        { label: "Github", href: "https://github.com/snowinch" },
        { label: "Subsquare", href: "https://www.subsquare.io/" },
        { label: "Explorer", href: "https://polkadot.subscan.io/" },
        { label: "X", href: "https://x.com/snowinch_io" },
    ];

    return (
        <footer className="border-t border-border px-6 py-8 md:px-12 lg:px-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-sm font-medium">
                    Built with ❤️ by{" "}
                    <span className="font-semibold">SNOWINCH S.L.</span>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-magenta transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center md:text-left">
                Contributor to the Polkadot OpenGov ecosystem
            </div>
        </footer>
    );
};

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background p-4">
            <Container maxWidth="xl">
                <SimpleHeader />

                {/* Hero Section */}
                <Section noBorderTop>
                    <div className="space-y-6">
                        <H1>The trustless identity layer for Polkadot JAM</H1>
                        <Paragraph size="lg">
                            JAMID is a smart contract that defines a new open identity layer for
                            JAM and Polkadot ecosystems. No custodians. No
                            intermediaries—identities are stored on-chain, secured by
                            cryptography, and interoperable across chains.
                        </Paragraph>
                        <div className="flex gap-4 pt-4">
                            <BrutalButton variant="primary" size="lg">
                                Whitepaper
                            </BrutalButton>
                            <BrutalButton variant="outline" size="lg">
                                GitHub
                            </BrutalButton>
                        </div>
                    </div>
                </Section>

                {/* Vision Section */}
                <Section id="vision" noBorderTop>
                    <div className="space-y-6">
                        <H2>Vision</H2>
                        <Paragraph size="lg">
                            JAMID defines a new standard for identity on Polkadot—one that
                            belongs to everyone, not to a company. It provides a permanent,
                            on-chain registry of human-readable JAM identities (JIDs), with full
                            sovereignty and zero custodianship.
                        </Paragraph>
                    </div>
                </Section>

                {/* Why It Matters Section */}
                <Section id="why" noBorderTop>
                    <div className="space-y-12">
                        <H2>Why It Matters</H2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: "🔐",
                                    title: "Trustless",
                                    description:
                                        "No central authority. Pure cryptographic security.",
                                },
                                {
                                    icon: "🌐",
                                    title: "Interoperable",
                                    description: "Works seamlessly across all Polkadot chains.",
                                },
                                {
                                    icon: "👤",
                                    title: "Self-Sovereign",
                                    description: "You own your identity. Forever.",
                                },
                                {
                                    icon: "🔓",
                                    title: "Open Standard",
                                    description: "Anyone can integrate. No gatekeepers.",
                                },
                            ].map((item, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="text-4xl">{item.icon}</div>
                                    <H3 className="text-xl">{item.title}</H3>
                                    <Paragraph size="sm">{item.description}</Paragraph>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Governance Section */}
                <Section id="governance" className="bg-magenta text-white" noBorderTop>
                    <div className="space-y-6">
                        <H2>Governance</H2>
                        <Paragraph size="lg">
                            JAMID redirects all fees directly to the Polkadot Treasury. No
                            profit. No shareholders. Just pure public infrastructure.
                        </Paragraph>
                        <div className="flex gap-4 pt-4">
                            <BrutalButton
                                variant="outline"
                                size="lg"
                                className="bg-white text-magenta border-white hover:bg-white/90"
                            >
                                Learn More
                            </BrutalButton>
                        </div>
                    </div>
                </Section>

                {/* Overview Section */}
                <Section id="overview" noBorderTop>
                    <div className="space-y-8">
                        <H2>Overview</H2>
                        <Paragraph>
                            JAMID is built with ink! and designed to be verifiable, auditable,
                            and immutable.
                        </Paragraph>

                        <div className="space-y-6 pt-4">
                            <div className="border-l-2 border-magenta pl-6 space-y-2">
                                <H3 className="text-xl">Register</H3>
                                <Paragraph size="sm">
                                    Choose a unique JAM identity (JID) and register it on-chain.
                                    First-come, first-served.
                                </Paragraph>
                            </div>

                            <div className="border-l-2 border-magenta pl-6 space-y-2">
                                <H3 className="text-xl">Resolve</H3>
                                <Paragraph size="sm">
                                    Any service can resolve a JID to its associated account. Fully
                                    permissionless.
                                </Paragraph>
                            </div>

                            <div className="border-l-2 border-magenta pl-6 space-y-2">
                                <H3 className="text-xl">Transfer</H3>
                                <Paragraph size="sm">
                                    You can transfer your JID to another address. Full ownership
                                    control.
                                </Paragraph>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* JAMID Format Section */}
                <Section className="bg-muted" noBorderTop>
                    <div className="space-y-6">
                        <H3>JAMID Format</H3>
                        <Paragraph>
                            Each JAMID follows a standardized format for universal
                            compatibility:
                        </Paragraph>
                        <CodeBlock
                            code="JAMID:{genesis_hash}:register:{jid}:{nonce}:{contract_address}"
                            language="text"
                            showCopy
                        />
                    </div>
                </Section>

                {/* Roadmap Section */}
                <Section id="roadmap" noBorderTop>
                    <div className="space-y-8">
                        <H2>Roadmap</H2>

                        <div className="space-y-6">
                            {[
                                {
                                    phase: "Q1 2025",
                                    milestone: "Smart Contract",
                                    status: "✓ Complete",
                                },
                                {
                                    phase: "Q2 2025",
                                    milestone: "CLI Tool & SDK",
                                    status: "In Progress",
                                },
                                {
                                    phase: "Q3 2025",
                                    milestone: "Web Interface",
                                    status: "Planned",
                                },
                                {
                                    phase: "Q4 2025",
                                    milestone: "Ecosystem Integration",
                                    status: "Planned",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-3 gap-8 py-4 border-b border-border last:border-b-0"
                                >
                                    <div className="font-medium text-sm">{item.phase}</div>
                                    <div className="font-display font-semibold">
                                        {item.milestone}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Quote Section */}
                <Section className="bg-foreground text-background" noBorderTop>
                    <Blockquote className="border-0">
                        "Built with ❤️ by SNOWINCH S.L. — Contributor to the Polkadot
                        OpenGov ecosystem"
                    </Blockquote>
                </Section>

                <SimpleFooter />
            </Container>
        </div>
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
