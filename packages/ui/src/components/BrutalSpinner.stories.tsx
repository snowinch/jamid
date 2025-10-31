import type { Meta, StoryObj } from "@storybook/react";
import { BrutalSpinner } from "./BrutalSpinner";

const meta = {
    title: "Brutal/Spinner",
    component: BrutalSpinner,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md", "lg", "xl"],
        },
        color: {
            control: "select",
            options: ["primary", "foreground", "accent"],
        },
    },
} satisfies Meta<typeof BrutalSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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

export const ExtraLarge: Story = {
    args: {
        size: "xl",
    },
};

export const Primary: Story = {
    args: {
        color: "primary",
    },
};

export const Foreground: Story = {
    args: {
        color: "foreground",
    },
};

export const Accent: Story = {
    args: {
        color: "accent",
    },
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <BrutalSpinner size="sm" />
            <BrutalSpinner size="md" />
            <BrutalSpinner size="lg" />
            <BrutalSpinner size="xl" />
        </div>
    ),
};

export const AllColors: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <BrutalSpinner color="primary" />
            <BrutalSpinner color="foreground" />
            <BrutalSpinner color="accent" />
        </div>
    ),
};

