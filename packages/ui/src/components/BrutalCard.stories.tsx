import type { Meta, StoryObj } from "@storybook/react";
import {
    BrutalCard,
    CardIcon,
    CardHeading,
    CardDescription,
} from "./BrutalCard";

const meta = {
    title: "Brutal/Card",
    component: BrutalCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "primary", "accent"],
        },
        padding: {
            control: "select",
            options: ["none", "sm", "md", "lg"],
        },
    },
} satisfies Meta<typeof BrutalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "This is a brutal card with default styling.",
    },
};

export const WithIcon: Story = {
    render: (args) => (
        <BrutalCard {...args}>
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
                Your key, your identity. No intermediaries between you and your digital
                presence.
            </CardDescription>
        </BrutalCard>
    ),
};

export const PrimaryVariant: Story = {
    render: (args) => (
        <BrutalCard variant="primary" {...args}>
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
                All identities stored on-chain, secured by cryptography, and
                interoperable across chains.
            </CardDescription>
        </BrutalCard>
    ),
};

export const Hoverable: Story = {
    render: (args) => (
        <BrutalCard hoverable {...args}>
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
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                }
            />
            <CardHeading>Connected</CardHeading>
            <CardDescription>
                Works across JAM and parachains. Hover to see the effect.
            </CardDescription>
        </BrutalCard>
    ),
};

export const Grid: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BrutalCard>
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
                        </svg>
                    }
                />
                <CardHeading>No Custody</CardHeading>
                <CardDescription>Your key, your identity</CardDescription>
            </BrutalCard>
            <BrutalCard>
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
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                    }
                />
                <CardHeading>On-Chain</CardHeading>
                <CardDescription>No intermediaries</CardDescription>
            </BrutalCard>
            <BrutalCard>
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
                        </svg>
                    }
                />
                <CardHeading>Connected</CardHeading>
                <CardDescription>Works across JAM and parachains</CardDescription>
            </BrutalCard>
            <BrutalCard>
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
                <CardDescription>Fees fund the ecosystem, not companies</CardDescription>
            </BrutalCard>
        </div>
    ),
    parameters: {
        layout: "padded",
    },
};

