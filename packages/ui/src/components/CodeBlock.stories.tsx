import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./CodeBlock";

const meta = {
    title: "Brutal/CodeBlock",
    component: CodeBlock,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        code: `const greeting = "Hello, JAMID!";\nconsole.log(greeting);`,
    },
};

export const JavaScript: Story = {
    args: {
        language: "javascript",
        code: `import { registerIdentity } from "@jamid/sdk";

const jid = await registerIdentity({
  name: "alice",
  address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
});

console.log(\`Registered: \${jid}\`);`,
    },
};

export const WithFilename: Story = {
    args: {
        filename: "register.ts",
        language: "typescript",
        code: `import { JamID } from "@jamid/sdk";

const jamid = new JamID();
const identity = await jamid.register("alice.jid");`,
    },
};

export const Rust: Story = {
    args: {
        filename: "lib.rs",
        language: "rust",
        code: `#[ink::contract]
mod jamid {
    #[ink(storage)]
    pub struct JamID {
        identities: Mapping<AccountId, String>,
    }
    
    impl JamID {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                identities: Mapping::default(),
            }
        }
    }
}`,
    },
};

export const JamIDFormat: Story = {
    args: {
        filename: "jamid-format.txt",
        showCopy: true,
        code: `JAMID:{genesis_hash}:register:{jid}:{nonce}:{contract_address}

Example:
JAMID:0x1234...abcd:register:alice:1:5GHW...xyz`,
    },
};

export const JSON: Story = {
    args: {
        language: "json",
        code: `{
  "name": "alice.jid",
  "owner": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  "registered_at": 1234567890,
  "metadata": {
    "version": "1.0",
    "chain": "polkadot"
  }
}`,
    },
};

export const Bash: Story = {
    args: {
        language: "bash",
        code: `# Install JAMID CLI
bun add -g @jamid/cli

# Register a new identity
jamid register alice

# Check identity info
jamid info alice.jid`,
    },
};

