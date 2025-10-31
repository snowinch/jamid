#!/usr/bin/env node

import { Command } from "commander";
import { deployCommand } from "./commands/deploy.js";
import { infoCommand } from "./commands/info.js";
import {
  generateWallet,
  requestFaucet,
  checkBalance,
} from "./commands/wallet.js";
import chalk from "chalk";

const program = new Command();

program
  .name("jamid")
  .description("CLI tool for deploying and managing JAMID smart contracts")
  .version("0.3.1");

// ASCII Art Banner
console.log(
  chalk.cyan(`
╔═══════════════════════════════════════╗
║                                       ║
║        JAMID CLI v0.3.1               ║
║   JAM Identity Layer Contract Tool    ║
║                                       ║
╚═══════════════════════════════════════╝
`)
);

// Deploy command
program
  .command("deploy")
  .description("Deploy JAMID contract to a chain")
  .option("-e, --endpoint <url>", "WebSocket endpoint URL", "wss://paseo.io")
  .option(
    "-s, --suri <suri>",
    "Account seed/URI (mnemonic or hex seed)",
    "//Alice"
  )
  .option(
    "-w, --wallet-file <path>",
    "Path to wallet JSON file (alternative to --suri)"
  )
  .option("-c, --chain-id <id>", "Chain identifier", "paseo")
  .option(
    "-f, --file <path>",
    "Path to .contract file",
    "../../contracts/jamid/target/ink/jamid.contract"
  )
  .option(
    "-o, --output <path>",
    "Output path for config file",
    "./jamid.config.json"
  )
  .option("--dry-run", "Simulate deployment without executing", false)
  .action(deployCommand);

// Info command
program
  .command("info")
  .description("Get information about a deployed contract")
  .requiredOption("-a, --address <address>", "Contract address")
  .option("-e, --endpoint <url>", "WebSocket endpoint URL", "wss://paseo.io")
  .action(infoCommand);

// Wallet commands
const wallet = program
  .command("wallet")
  .description("Wallet management utilities");

wallet
  .command("generate")
  .description("Generate a new wallet")
  .option("-t, --type <type>", "Key type (sr25519/ed25519)", "sr25519")
  .option(
    "-s, --save [path]",
    "Save wallet to file (default: ./wallet.json)",
    true
  )
  .option("--no-save", "Don't save wallet to file (only show in terminal)")
  .action(generateWallet);

wallet
  .command("faucet")
  .description("Request testnet tokens from faucet")
  .requiredOption("-a, --address <address>", "Wallet address")
  .option(
    "-e, --endpoint <url>",
    "WebSocket endpoint URL",
    "wss://rpc.ibp.network/paseo"
  )
  .action(requestFaucet);

wallet
  .command("balance")
  .description("Check wallet balance")
  .requiredOption("-a, --address <address>", "Wallet address")
  .option(
    "-e, --endpoint <url>",
    "WebSocket endpoint URL",
    "wss://rpc.ibp.network/paseo"
  )
  .action(checkBalance);

program.parse();
