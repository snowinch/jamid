import type { Meta, StoryObj } from "@storybook/react";
import { Header, NavLink } from "./Header";
import { BrutalButton } from "./BrutalButton";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "../utils/theme";

const meta = {
    title: "Brutal/Header",
    component: Header,
    decorators: [
        (Story) => (
            <ThemeProvider>
                <Story />
            </ThemeProvider>
        ),
    ],
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        logo: (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary border-2 border-current" />
                <span className="font-black text-xl uppercase">JAMID</span>
            </div>
        ),
        navigation: (
            <>
                <NavLink href="#vision">Vision</NavLink>
                <NavLink href="#why" active>
                    Why it Matters
                </NavLink>
                <NavLink href="#governance">Governance</NavLink>
                <NavLink href="#roadmap">Roadmap</NavLink>
            </>
        ),
        actions: (
            <>
                <ThemeToggle size="sm" />
                <BrutalButton variant="primary" size="sm">
                    Try it Now
                </BrutalButton>
            </>
        ),
    },
};

export const Sticky: Story = {
    args: {
        sticky: true,
        logo: (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary border-2 border-current" />
                <span className="font-black text-xl uppercase">JAMID</span>
            </div>
        ),
        navigation: (
            <>
                <NavLink href="#vision">Vision</NavLink>
                <NavLink href="#why">Why it Matters</NavLink>
                <NavLink href="#governance">Governance</NavLink>
                <NavLink href="#roadmap">Roadmap</NavLink>
            </>
        ),
        actions: <ThemeToggle size="sm" />,
    },
    render: (args) => (
        <div>
            <Header {...args} />
            <div className="p-8">
                <div className="space-y-4">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <p key={i} className="text-lg">
                            Scroll down to see the sticky header in action. Lorem ipsum dolor
                            sit amet, consectetur adipiscing elit.
                        </p>
                    ))}
                </div>
            </div>
        </div>
    ),
};

export const Simple: Story = {
    args: {
        logo: <span className="font-black text-2xl uppercase">JAMID</span>,
        actions: <BrutalButton size="sm">Connect</BrutalButton>,
    },
};

