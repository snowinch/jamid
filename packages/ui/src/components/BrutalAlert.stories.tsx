import type { Meta, StoryObj } from "@storybook/react";
import { BrutalAlert } from "./BrutalAlert";

const meta = {
    title: "Brutal/Alert",
    component: BrutalAlert,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["info", "success", "warning", "danger"],
        },
    },
} satisfies Meta<typeof BrutalAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

const InfoIcon = "ℹ️";
const SuccessIcon = "✓";
const WarningIcon = "⚠";
const DangerIcon = "✕";

export const Info: Story = {
    args: {
        variant: "info",
        icon: InfoIcon,
        title: "Information",
        children: "This is an informational message.",
    },
};

export const Success: Story = {
    args: {
        variant: "success",
        icon: SuccessIcon,
        title: "Success",
        children: "Your action was completed successfully!",
    },
};

export const Warning: Story = {
    args: {
        variant: "warning",
        icon: WarningIcon,
        title: "Warning",
        children: "Please review the following information carefully.",
    },
};

export const Danger: Story = {
    args: {
        variant: "danger",
        icon: DangerIcon,
        title: "Error",
        children: "An error occurred while processing your request.",
    },
};

export const WithoutIcon: Story = {
    args: {
        variant: "info",
        title: "No Icon",
        children: "This alert does not have an icon.",
    },
};

export const WithoutTitle: Story = {
    args: {
        variant: "info",
        icon: InfoIcon,
        children: "This alert does not have a title.",
    },
};

export const LongContent: Story = {
    args: {
        variant: "info",
        icon: InfoIcon,
        title: "Detailed Information",
        children:
            "This is a longer alert message that contains more detailed information. It can span multiple lines and provide comprehensive details about the situation or action that the user needs to be aware of.",
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="space-y-4 max-w-2xl">
            <BrutalAlert variant="info" icon={InfoIcon} title="Information">
                This is an informational message.
            </BrutalAlert>
            <BrutalAlert variant="success" icon={SuccessIcon} title="Success">
                Your action was completed successfully!
            </BrutalAlert>
            <BrutalAlert variant="warning" icon={WarningIcon} title="Warning">
                Please review the following information carefully.
            </BrutalAlert>
            <BrutalAlert variant="danger" icon={DangerIcon} title="Error">
                An error occurred while processing your request.
            </BrutalAlert>
        </div>
    ),
};

