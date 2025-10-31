import type { Meta, StoryObj } from "@storybook/react";
import { BrutalInput } from "./BrutalInput";

const meta = {
    title: "Brutal/Input",
    component: BrutalInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof BrutalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: "Enter text...",
    },
};

export const WithLabel: Story = {
    args: {
        label: "Username",
        placeholder: "Enter your username",
    },
};

export const WithHelperText: Story = {
    args: {
        label: "Email",
        placeholder: "Enter your email",
        helperText: "We will never share your email with anyone else.",
    },
};

export const WithError: Story = {
    args: {
        label: "Email",
        placeholder: "Enter your email",
        error: "This field is required",
    },
};

export const Disabled: Story = {
    args: {
        label: "Username",
        placeholder: "Enter your username",
        disabled: true,
    },
};

export const Password: Story = {
    args: {
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
    },
};

export const FullWidth: Story = {
    args: {
        label: "Full Width Input",
        placeholder: "This input takes full width",
        fullWidth: true,
    },
    parameters: {
        layout: "padded",
    },
};

export const AllStates: Story = {
    render: () => (
        <div className="space-y-6 w-80">
            <BrutalInput label="Default" placeholder="Default input" />
            <BrutalInput
                label="With Helper"
                placeholder="Input with helper"
                helperText="This is a helper text"
            />
            <BrutalInput
                label="With Error"
                placeholder="Input with error"
                error="This field is required"
            />
            <BrutalInput label="Disabled" placeholder="Disabled input" disabled />
        </div>
    ),
};

