import type { Meta, StoryObj } from "@storybook/react";
import { BrutalButton } from "./BrutalButton";

const meta = {
    title: "Brutal/Button",
    component: BrutalButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "outline", "ghost"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
    },
} satisfies Meta<typeof BrutalButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        variant: "primary",
        children: "Primary Button",
    },
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
        children: "Secondary Button",
    },
};

export const Outline: Story = {
    args: {
        variant: "outline",
        children: "Outline Button",
    },
};

export const Ghost: Story = {
    args: {
        variant: "ghost",
        children: "Ghost Button",
    },
};

export const Small: Story = {
    args: {
        size: "sm",
        children: "Small Button",
    },
};

export const Large: Story = {
    args: {
        size: "lg",
        children: "Large Button",
    },
};

export const FullWidth: Story = {
    args: {
        fullWidth: true,
        children: "Full Width Button",
    },
    parameters: {
        layout: "padded",
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        children: "Disabled Button",
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <BrutalButton variant="primary">Primary</BrutalButton>
            <BrutalButton variant="secondary">Secondary</BrutalButton>
            <BrutalButton variant="outline">Outline</BrutalButton>
            <BrutalButton variant="ghost">Ghost</BrutalButton>
        </div>
    ),
};

