import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { readFileSync } from "fs";
import { resolve } from "path";
import chalk from "chalk";
import ora from "ora";
import { VERSION } from "../version.js";

interface InfoOptions {
  address: string;
  endpoint: string;
}

export async function infoCommand(options: InfoOptions) {
  const spinner = ora("Fetching contract information...").start();

  try {
    // 1. Connect to chain
    const provider = new WsProvider(options.endpoint);
    const api = await ApiPromise.create({ provider });
    await api.isReady;

    // 2. Load contract metadata
    spinner.text = "Loading contract metadata...";
    const metadataPath = resolve(
      process.cwd(),
      "../../contracts/jamid/target/ink/jamid.json"
    );
    const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));

    // 3. Create contract instance
    const contract = new ContractPromise(api, metadata, options.address);
    spinner.text = "Querying contract state...";

    // 4. Query contract information
    const gasLimit = api.registry.createType("WeightV2", {
      refTime: 1000000000n,
      proofSize: 125952n,
    }) as any;

    // Get basic info
    const chainIdResult = await contract.query.getChainId(options.address, {
      gasLimit,
    });

    const genesisHashResult = await contract.query.getGenesisHash(
      options.address,
      { gasLimit }
    );

    const totalJidsResult = await contract.query.totalJids(options.address, {
      gasLimit,
    });

    const registrationFeeResult = await contract.query.getRegistrationFee(
      options.address,
      { gasLimit }
    );

    const isPausedResult = await contract.query.isPaused(options.address, {
      gasLimit,
    });

    spinner.succeed("Contract information retrieved");

    // 5. Display information
    console.log(chalk.cyan("\n╔════════════════════════════════════════╗"));
    console.log(chalk.cyan("║     JAMID Contract Information         ║"));
    console.log(chalk.cyan("╚════════════════════════════════════════╝\n"));

    console.log(chalk.white("Contract Details:"));
    console.log(`  Address: ${chalk.cyan(options.address)}`);
    console.log(
      `  Chain: ${chalk.cyan((await api.rpc.system.chain()).toString())}`
    );
    console.log(`  Version: ${chalk.cyan(VERSION)}`);

    console.log(chalk.white("\nConfiguration:"));
    console.log(
      `  Chain ID: ${chalk.cyan(chainIdResult.output?.toString() || "N/A")}`
    );
    console.log(
      `  Genesis Hash: ${chalk.cyan(genesisHashResult.output?.toHex().slice(2, 18) + "..." || "N/A")}`
    );
    console.log(
      `  Status: ${isPausedResult.output ? chalk.red("Paused") : chalk.green("Active")}`
    );

    console.log(chalk.white("\nStatistics:"));
    console.log(
      `  Total JIDs: ${chalk.green(totalJidsResult.output?.toString() || "0")}`
    );
    console.log(
      `  Registration Fee: ${chalk.green(registrationFeeResult.output?.toHuman() || "N/A")}`
    );

    console.log(chalk.white("\nEndpoint:"));
    console.log(`  ${chalk.gray(options.endpoint)}`);

    console.log("");

    await api.disconnect();
  } catch (error) {
    spinner.fail("Failed to fetch contract information");
    console.error(
      chalk.red("\n❌ Error:"),
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}
