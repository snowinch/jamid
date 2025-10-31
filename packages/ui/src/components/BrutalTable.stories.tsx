import type { Meta, StoryObj } from "@storybook/react";
import {
    BrutalTable,
    BrutalTableHeader,
    BrutalTableBody,
    BrutalTableRow,
    BrutalTableHead,
    BrutalTableCell,
} from "./BrutalTable";

const meta = {
    title: "Brutal/Table",
    component: BrutalTable,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof BrutalTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <BrutalTable>
            <BrutalTableHeader>
                <BrutalTableRow>
                    <BrutalTableHead>Phase</BrutalTableHead>
                    <BrutalTableHead>Description</BrutalTableHead>
                </BrutalTableRow>
            </BrutalTableHeader>
            <BrutalTableBody>
                <BrutalTableRow>
                    <BrutalTableCell>V0.9</BrutalTableCell>
                    <BrutalTableCell>Internal testing (Snowinch)</BrutalTableCell>
                </BrutalTableRow>
                <BrutalTableRow>
                    <BrutalTableCell>V1.0</BrutalTableCell>
                    <BrutalTableCell>
                        Public deployment (JAM / Treasury redirect)
                    </BrutalTableCell>
                </BrutalTableRow>
                <BrutalTableRow>
                    <BrutalTableCell>V1.1</BrutalTableCell>
                    <BrutalTableCell>
                        DAO recognition & community maintenance
                    </BrutalTableCell>
                </BrutalTableRow>
                <BrutalTableRow>
                    <BrutalTableCell>V2.0</BrutalTableCell>
                    <BrutalTableCell>Burned ownership → full autonomy</BrutalTableCell>
                </BrutalTableRow>
            </BrutalTableBody>
        </BrutalTable>
    ),
};

export const Hoverable: Story = {
    render: () => (
        <BrutalTable>
            <BrutalTableHeader>
                <BrutalTableRow>
                    <BrutalTableHead>Feature</BrutalTableHead>
                    <BrutalTableHead>Status</BrutalTableHead>
                    <BrutalTableHead>Version</BrutalTableHead>
                </BrutalTableRow>
            </BrutalTableHeader>
            <BrutalTableBody>
                <BrutalTableRow hoverable>
                    <BrutalTableCell>Identity Registration</BrutalTableCell>
                    <BrutalTableCell>✓ Active</BrutalTableCell>
                    <BrutalTableCell>v1.0</BrutalTableCell>
                </BrutalTableRow>
                <BrutalTableRow hoverable>
                    <BrutalTableCell>Cross-chain Support</BrutalTableCell>
                    <BrutalTableCell>✓ Active</BrutalTableCell>
                    <BrutalTableCell>v1.0</BrutalTableCell>
                </BrutalTableRow>
                <BrutalTableRow hoverable>
                    <BrutalTableCell>DAO Governance</BrutalTableCell>
                    <BrutalTableCell>⏳ Planned</BrutalTableCell>
                    <BrutalTableCell>v1.1</BrutalTableCell>
                </BrutalTableRow>
                <BrutalTableRow hoverable>
                    <BrutalTableCell>Full Autonomy</BrutalTableCell>
                    <BrutalTableCell>⏳ Planned</BrutalTableCell>
                    <BrutalTableCell>v2.0</BrutalTableCell>
                </BrutalTableRow>
            </BrutalTableBody>
        </BrutalTable>
    ),
};

export const ThreeColumns: Story = {
    render: () => (
        <BrutalTable>
            <BrutalTableHeader>
                <BrutalTableRow>
                    <BrutalTableHead>Name</BrutalTableHead>
                    <BrutalTableHead>Role</BrutalTableHead>
                    <BrutalTableHead>Status</BrutalTableHead>
                </BrutalTableRow>
            </BrutalTableHeader>
            <BrutalTableBody>
                <BrutalTableRow hoverable>
                    <BrutalTableCell>alice.jid</BrutalTableCell>
                    <BrutalTableCell>Developer</BrutalTableCell>
                    <BrutalTableCell>Active</BrutalTableCell>
                </BrutalTableRow>
                <BrutalTableRow hoverable>
                    <BrutalTableCell>bob.jid</BrutalTableCell>
                    <BrutalTableCell>Designer</BrutalTableCell>
                    <BrutalTableCell>Active</BrutalTableCell>
                </BrutalTableRow>
                <BrutalTableRow hoverable>
                    <BrutalTableCell>charlie.jid</BrutalTableCell>
                    <BrutalTableCell>Validator</BrutalTableCell>
                    <BrutalTableCell>Inactive</BrutalTableCell>
                </BrutalTableRow>
            </BrutalTableBody>
        </BrutalTable>
    ),
};

