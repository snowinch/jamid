import type { Meta, StoryObj } from "@storybook/react";
import { H1, H2, H3, Paragraph, Blockquote } from "./Typography";

const meta = {
    title: "Brutal/Typography",
    component: H1,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof H1>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
    render: () => <H1>The Trustless Identity Layer</H1>,
};

export const Heading2: Story = {
    render: () => <H2>Vision</H2>,
};

export const Heading3: Story = {
    render: () => <H3>Why It Matters</H3>,
};

export const ParagraphSmall: Story = {
    render: () => (
        <Paragraph size="sm">
            JAMID is a smart contract that defines a new open identity layer for JAM
            and Polkadot ecosystems. No custodians. No intermediaries.
        </Paragraph>
    ),
};

export const ParagraphMedium: Story = {
    render: () => (
        <Paragraph>
            JAMID defines a new standard for identity on Polkadot—one that belongs to
            everyone, not to a company. It provides a permanent, on-chain registry of
            human-readable JAM identities (JIDs).
        </Paragraph>
    ),
};

export const ParagraphLarge: Story = {
    render: () => (
        <Paragraph size="lg">
            Your key, your identity. No intermediaries. Works across JAM and
            parachains. Fees fund the ecosystem, not companies.
        </Paragraph>
    ),
};

export const Quote: Story = {
    render: () => (
        <Blockquote>
            JAMID redirects all fees directly to the Polkadot Treasury. Its evolution
            is managed collectively by the OpenGov system.
        </Blockquote>
    ),
};

export const AllTogether: Story = {
    render: () => (
        <div className="max-w-3xl space-y-6">
            <H1>The Trustless Identity Layer</H1>
            <Paragraph size="lg">
                For Polkadot JAM — built by the community, owned by everyone.
            </Paragraph>

            <div className="my-8 border-t-4 border-current" />

            <H2>Vision</H2>
            <Paragraph>
                JAMID defines a new standard for identity on Polkadot—one that belongs
                to everyone, not to a company. It provides a permanent, on-chain
                registry of human-readable JAM identities (JIDs), with full sovereignty
                and zero custodianship.
            </Paragraph>

            <H3>Why It Matters</H3>
            <Paragraph>
                Traditional identity systems are controlled by centralized entities. JAMID
                changes this by putting identity ownership directly in the hands of
                users, secured by blockchain technology.
            </Paragraph>

            <Blockquote>
                No custody. On-chain. Connected. Governable.
            </Blockquote>

            <Paragraph size="sm">
                Built with ❤️ by SNOWINCH S.L. — Contributor to the Polkadot OpenGov
                ecosystem.
            </Paragraph>
        </div>
    ),
};

