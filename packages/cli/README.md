# @jamid/cli

CLI tool for deploying and managing JAMID smart contracts on Polkadot networks.

## Features

- 🚀 **Easy Deployment**: One command to deploy contracts to any Substrate chain
- 🔍 **Contract Info**: Query deployed contract state and configuration
- 🔐 **Automatic Genesis Hash**: Automatically retrieves and uses the correct genesis hash
- 🧪 **Dry Run Mode**: Test deployment parameters without executing
- 🎨 **Beautiful CLI**: Clean, colorful output with progress indicators

## Installation

```bash
# From root of jamid monorepo
npm install
cd packages/cli
npm run build

# Optional: Link globally
npm link

# Then use from anywhere:
jamid --version
```

## Usage

### Deploy Contract

Deploy JAMID contract to a network:

```bash
# Deploy to Paseo testnet (if not linked globally)
npm run start deploy -- \
  --endpoint wss://paseo.io \
  --suri "//Alice" \
  --chain-id paseo

# Or if linked globally:
jamid deploy \
  --endpoint wss://paseo.io \
  --suri "//Alice" \
  --chain-id paseo

# Deploy with wallet file
jamid deploy --wallet-file ./wallet.json

# Dry run (test without deploying)
jamid deploy --dry-run
```

**Options:**
- `-e, --endpoint <url>` - WebSocket endpoint (default: `wss://paseo.io`)
- `-s, --suri <suri>` - Account seed/URI (mnemonic or hex seed)
- `-w, --wallet-file <path>` - Path to wallet JSON file (alternative to --suri)
- `-c, --chain-id <id>` - Chain identifier (default: `paseo`)
- `-f, --file <path>` - Path to .contract file
- `-o, --output <path>` - Output path for config file (default: `./jamid.config.json`)
- `--dry-run` - Simulate deployment without executing

### Get Contract Info

Query information about a deployed contract:

```bash
# If not linked globally
npm run start info -- \
  --address 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty \
  --endpoint wss://paseo.io

# Or if linked globally:
jamid info \
  --address 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty \
  --endpoint wss://paseo.io
```

**Options:**
- `-a, --address <address>` - Contract address (required)
- `-e, --endpoint <url>` - WebSocket endpoint (default: `wss://paseo.io`)

## Examples

### Complete Workflow

```bash
# 1. Build the contract
cd contracts/jamid
cargo contract build --release

# 2. Generate a wallet
jamid wallet generate

# 3. Request testnet tokens
jamid wallet faucet -a <YOUR_ADDRESS>

# 4. Check balance
jamid wallet balance -a <YOUR_ADDRESS>

# 5. Deploy with wallet file
jamid deploy --wallet-file ./wallet.json

# 6. Verify deployment
jamid info -a <CONTRACT_ADDRESS>
```

### Deploy to Paseo Testnet

```bash
# Using development account
jamid deploy \
  --endpoint wss://paseo.io \
  --suri "//Alice" \
  --chain-id paseo

# Using custom mnemonic
jamid deploy \
  --suri "your twelve word mnemonic phrase here..." \
  --chain-id paseo
```

### Deploy to Local Node

```bash
# Assuming you have a local substrate node running
jamid deploy \
  --endpoint ws://localhost:9944 \
  --suri "//Alice" \
  --chain-id local
```

### Check Deployed Contract

```bash
jamid info --address 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
```

## Output Example

### Deployment
```
╔═══════════════════════════════════════╗
║                                       ║
║        JAMID CLI v0.3.2               ║
║   JAM Identity Layer Contract Tool    ║
║                                       ║
╚═══════════════════════════════════════╝

✔ Connected to Paseo Testnet
✔ Contract loaded: jamid v0.3.2
✔ Genesis hash: 91b171bb158e2d38...
✔ Deployer: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
  Balance: 100.0000 PAS
✔ Contract code uploaded. Code Hash: 0x1234...
✔ Contract instantiated successfully
✔ Config saved to: ./jamid.config.json

✅ Deployment Complete!

Contract Details:
  Address: 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
  Chain: paseo
  Genesis Hash: 91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3
  Version: 0.3.2

Admin:
  Address: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
  Public Key: 0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d

Config File:
  ./jamid.config.json

Next Steps:
  1. Share config file with your team/SDK
  2. Test contract: jamid info -a 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
  3. Integrate with SDK using the config file
```

### Contract Info
```
╔════════════════════════════════════════╗
║     JAMID Contract Information         ║
╚════════════════════════════════════════╝

Contract Details:
  Address: 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
  Chain: Paseo Testnet
  Version: 0.3.2

Configuration:
  Chain ID: paseo
  Genesis Hash: 91b171bb158e2d38...
  Status: Active

Statistics:
  Total JIDs: 42
  Registration Fee: 1.0000 PAS

Endpoint:
  wss://paseo.io
```

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Type check
npm run check-types

# Lint
npm run lint
```

### Version Management

The CLI version is **centralized** in `package.json`. All references to the version throughout the codebase (banner, deploy output, info command, etc.) automatically read from `package.json` via `src/version.ts`.

**To update the CLI version:**
1. Change `version` in `package.json`
2. Run `npm run build`
3. Done! ✅

**How it works:**
```typescript
// src/version.ts - reads from package.json
export const VERSION = packageJson.version;

// src/index.ts - uses centralized version
import { VERSION } from "./version.js";
console.log(`JAMID CLI v${VERSION}`);
```

This ensures version consistency across:
- CLI banner (`jamid --version`)
- Deployment output
- Contract info display
- Generated config files

## Requirements

- Node.js >= 18
- npm package manager
- Access to a Substrate node (local or remote)
- Account with sufficient balance for deployment

## Security Notes

⚠️ **IMPORTANT**: Never commit accounts with real funds!

- Use test accounts for development
- Keep your seed phrases secure
- Use environment variables for production deployments
- Test on testnet before mainnet

## Supported Networks

- ✅ Paseo Testnet
- ✅ Local Substrate Node
- ✅ Any Substrate-based chain with contracts pallet

## Troubleshooting

### "Insufficient balance"
Ensure your account has enough tokens for deployment (gas + storage deposit)

### "Connection timeout"
Check that the WebSocket endpoint is accessible and the chain is running

### "Contract upload failed"
Verify the .contract file path is correct and the file is valid

## License

MIT or Apache-2.0

