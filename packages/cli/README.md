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
bun install
cd packages/cli
bun run build
```

## Usage

### Deploy Contract

Deploy JAMID contract to a network:

```bash
# Deploy to Paseo testnet
bun run start deploy \
  --endpoint wss://paseo.io \
  --suri "//Alice" \
  --chain-id paseo

# Deploy with custom options
bun run start deploy \
  --endpoint wss://your-chain.io \
  --suri "your mnemonic phrase here" \
  --chain-id custom-chain \
  --file path/to/jamid.contract

# Dry run (test without deploying)
bun run start deploy --dry-run
```

**Options:**
- `-e, --endpoint <url>` - WebSocket endpoint (default: `wss://paseo.io`)
- `-s, --suri <suri>` - Account seed/URI (default: `//Alice`)
- `-c, --chain-id <id>` - Chain identifier (default: `paseo`)
- `-f, --file <path>` - Path to .contract file
- `--dry-run` - Simulate deployment without executing

### Get Contract Info

Query information about a deployed contract:

```bash
bun run start info \
  --address 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty \
  --endpoint wss://paseo.io
```

**Options:**
- `-a, --address <address>` - Contract address (required)
- `-e, --endpoint <url>` - WebSocket endpoint (default: `wss://paseo.io`)

## Examples

### Deploy to Paseo Testnet

```bash
# 1. Build the contract first
cd ../../contracts/jamid
cargo contract build --release

# 2. Deploy
cd ../../packages/cli
bun run start deploy
```

### Deploy to Local Node

```bash
# Assuming you have a local substrate node running
bun run start deploy \
  --endpoint ws://localhost:9944 \
  --suri "//Alice" \
  --chain-id local
```

### Check Deployed Contract

```bash
bun run start info \
  --address 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
```

## Output Example

### Deployment
```
╔═══════════════════════════════════════╗
║                                       ║
║        JAMID CLI v0.3.1               ║
║   JAM Identity Layer Contract Tool   ║
║                                       ║
╚═══════════════════════════════════════╝

✔ Connected to Paseo Testnet
✔ Contract loaded: jamid v0.3.1
✔ Genesis hash: 91b171bb158e2d38...
✔ Deployer: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
  Balance: 100.0000 UNIT
✔ Code uploaded successfully
✔ Contract instantiated successfully

✅ Deployment Complete!

Contract Details:
  Address: 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
  Chain: paseo
  Genesis Hash: 91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3
  Version: 0.3.1

Next Steps:
  1. Save the contract address: 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
  2. Update your SDK configuration
  3. Test registration: jamid info -a 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
```

### Contract Info
```
╔════════════════════════════════════════╗
║     JAMID Contract Information        ║
╚════════════════════════════════════════╝

Contract Details:
  Address: 5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty
  Chain: Paseo Testnet
  Version: 0.3.1

Configuration:
  Chain ID: paseo
  Genesis Hash: 91b171bb158e2d38...
  Status: Active

Statistics:
  Total JIDs: 42
  Registration Fee: 1.0000 UNIT

Endpoint:
  wss://paseo.io
```

## Development

```bash
# Build
bun run build

# Watch mode
bun run dev

# Type check
bun run check-types

# Lint
bun run lint
```

## Requirements

- Node.js >= 18
- Bun package manager
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

