import type { Meta, StoryObj } from "@storybook/react";
import { BrutalBadge } from "./BrutalBadge";

const meta = {
    title: "Brutal/Badge",
    component: BrutalBadge,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "primary", "success", "warning", "danger"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
    },
} satisfies Meta<typeof BrutalBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "Badge",
    },
};

export const Primary: Story = {
    args: {
        variant: "primary",
        children: "Primary",
    },
};

export const Success: Story = {
    args: {
        variant: "success",
        children: "Success",
    },
};

export const Warning: Story = {
    args: {
        variant: "warning",
        children: "Warning",
    },
};

export const Danger: Story = {
    args: {
        variant: "danger",
        children: "Danger",
    },
};

export const Small: Story = {
    args: {
        size: "sm",
        children: "Small",
    },
};

export const Large: Story = {
    args: {
        size: "lg",
        children: "Large",
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <BrutalBadge variant="default">Default</BrutalBadge>
            <BrutalBadge variant="primary">Primary</BrutalBadge>
            <BrutalBadge variant="success">Success</BrutalBadge>
            <BrutalBadge variant="warning">Warning</BrutalBadge>
            <BrutalBadge variant="danger">Danger</BrutalBadge>
        </div>
    ),
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <BrutalBadge size="sm">Small</BrutalBadge>
            <BrutalBadge size="md">Medium</BrutalBadge>
            <BrutalBadge size="lg">Large</BrutalBadge>
        </div>
    ),
};

