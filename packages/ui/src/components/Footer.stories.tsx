import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./Footer";

const meta = {
    title: "Brutal/Footer",
    component: Footer,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const CustomLinks: Story = {
    args: {
        links: [
            { label: "[GitHub]", href: "https://github.com/snowinch" },
            { label: "[Twitter]", href: "https://twitter.com/snowinch" },
            { label: "[Discord]", href: "https://discord.gg/snowinch" },
        ],
    },
};

export const CustomAttribution: Story = {
    args: {
        attribution: (
            <>
                <p className="font-black text-lg">Built with ❤️ by Your Company</p>
                <p className="font-bold text-sm opacity-80">Making the web better</p>
            </>
        ),
    },
};

export const WithChildren: Story = {
    args: {
        children: (
            <div className="mt-6 pt-6 border-t-2 border-current">
                <p className="text-xs font-bold opacity-60">
                    © 2024 All rights reserved
                </p>
            </div>
        ),
    },
};
