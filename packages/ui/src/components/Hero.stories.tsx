import type { Meta, StoryObj } from "@storybook/react";
import { Hero } from "./Hero";
import { BrutalButton } from "./BrutalButton";

const meta = {
    title: "Brutal/Hero",
    component: Hero,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "primary", "muted"],
        },
    },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "The trustless identity layer for Polkadot JAM",
        subtitle:
            "JAMID is a smart contract that defines a new open identity layer for JAM and Polkadot ecosystems.",
    },
};

export const WithActions: Story = {
    args: {
        title: "The trustless identity layer for Polkadot JAM",
        subtitle:
            "JAMID is a smart contract that defines a new open identity layer for JAM and Polkadot ecosystems.",
        actions: (
            <>
                <BrutalButton variant="primary" size="lg">
                    Whitepaper
                </BrutalButton>
                <BrutalButton variant="outline" size="lg">
                    GitHub
                </BrutalButton>
            </>
        ),
    },
};

export const PrimaryVariant: Story = {
    args: {
        title: "No Custody. On-Chain.",
        subtitle: "Your key, your identity. No intermediaries.",
        variant: "primary",
        actions: (
            <>
                <BrutalButton variant="secondary" size="lg">
                    Try it Now
                </BrutalButton>
                <BrutalButton variant="outline" size="lg">
                    Learn More
                </BrutalButton>
            </>
        ),
    },
};

export const WithContent: Story = {
    args: {
        title: "Vision",
        subtitle:
            "JAMID defines a new standard for identity on Polkadot—one that belongs to everyone, not to a company.",
        children: (
            <div className="max-w-2xl mx-auto text-left space-y-4">
                <p className="font-bold text-base md:text-lg">
                    It provides a permanent, on-chain registry of human-readable JAM
                    identities (JIDs), with full sovereignty and zero custodianship.
                </p>
            </div>
        ),
    },
};

