import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "../utils/theme";

const meta = {
    title: "Brutal/ThemeToggle",
    component: ThemeToggle,
    decorators: [
        (Story) => (
            <ThemeProvider>
                <Story />
            </ThemeProvider>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        size: "md",
    },
};

export const Small: Story = {
    args: {
        size: "sm",
    },
};

export const Large: Story = {
    args: {
        size: "lg",
    },
};

