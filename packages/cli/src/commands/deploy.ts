import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { Keyring } from "@polkadot/keyring";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import chalk from "chalk";
import ora from "ora";
import { VERSION } from "../version.js";

interface DeployOptions {
  endpoint: string;
  suri?: string;
  chainId: string;
  file: string;
  dryRun: boolean;
  output?: string;
  walletFile?: string;
}

interface WalletData {
  address: string;
  type: string;
  publicKey: string;
  secretSeed?: string;
  mnemonic?: string;
  createdAt: string;
  warning: string;
}

export async function deployCommand(options: DeployOptions) {
  const spinner = ora("Initializing deployment...").start();

  try {
    // 1. Load wallet if file provided
    let suri = options.suri;

    if (options.walletFile && options.suri && options.suri !== "//Alice") {
      spinner.fail("Cannot use both --wallet-file and --suri options together");
      process.exit(1);
    }

    if (options.walletFile) {
      spinner.text = "Loading wallet from file...";
      try {
        const walletData: WalletData = JSON.parse(
          readFileSync(resolve(process.cwd(), options.walletFile), "utf8")
        );

        // Prefer mnemonic over secretSeed for compatibility
        suri = walletData.mnemonic || walletData.secretSeed;

        if (!suri) {
          spinner.fail("Wallet file does not contain mnemonic or secretSeed");
          process.exit(1);
        }

        spinner.succeed(
          `Wallet loaded: ${chalk.cyan(walletData.address.slice(0, 10) + "...")}`
        );
      } catch (err) {
        spinner.fail(`Failed to load wallet file: ${err}`);
        process.exit(1);
      }
    }

    if (!suri) {
      spinner.fail("No wallet specified. Use --suri or --wallet-file");
      process.exit(1);
    }

    // 2. Connect to chain
    spinner.text = `Connecting to ${options.endpoint}...`;
    const provider = new WsProvider(options.endpoint);
    const api = await ApiPromise.create({ provider });

    await api.isReady;
    spinner.succeed(
      `Connected to ${chalk.cyan((await api.rpc.system.chain()).toString())}`
    );

    // 3. Load contract file
    spinner.start("Loading contract file...");
    const contractPath = resolve(process.cwd(), options.file);
    const contractData = JSON.parse(readFileSync(contractPath, "utf8"));
    spinner.succeed(`Contract loaded: ${chalk.cyan(`jamid v${VERSION}`)}`);

    // 4. Get genesis hash
    spinner.start("Getting chain genesis hash...");
    const genesisHash = api.genesisHash.toHex();
    const genesisHashClean = genesisHash.slice(2); // Remove 0x prefix
    spinner.succeed(
      `Genesis hash: ${chalk.cyan(genesisHashClean.slice(0, 16) + "...")}`
    );

    // 5. Setup account
    spinner.start("Setting up deployment account...");
    const keyring = new Keyring({ type: "sr25519" });
    const deployer = keyring.addFromUri(suri);

    const accountInfo: any = await api.query.system.account(deployer.address);
    spinner.succeed(
      `Deployer: ${chalk.cyan(deployer.address)}\n` +
        `  Balance: ${chalk.green(accountInfo.data.free.toHuman())}`
    );

    if (options.dryRun) {
      console.log(chalk.yellow("\n🧪 DRY RUN MODE - No actual deployment\n"));
      console.log(chalk.white("Deployment parameters:"));
      console.log(`  Chain ID: ${chalk.cyan(options.chainId)}`);
      console.log(`  Genesis Hash: ${chalk.cyan(genesisHashClean)}`);
      console.log(`  Deployer: ${chalk.cyan(deployer.address)}`);
      console.log(`  Contract: ${chalk.cyan(contractPath)}`);

      await api.disconnect();
      return;
    }

    // 6. Upload code
    spinner.start("Uploading contract code...");

    // Create the code upload transaction
    const codeUpload = api.tx.contracts.uploadCode(
      contractData.source.wasm,
      null
    );

    // Sign and send
    await new Promise((resolve, reject) => {
      codeUpload.signAndSend(deployer, (result) => {
        if (result.status.isInBlock) {
          spinner.text = `Code uploaded in block ${result.status.asInBlock.toHex()}`;
        } else if (result.status.isFinalized) {
          spinner.succeed(`Code uploaded successfully`);
          resolve(true);
        }

        if (result.isError) {
          reject(new Error("Upload failed"));
        }
      });
    });

    // 7. Instantiate contract
    spinner.start("Instantiating contract...");

    const contract = new ContractPromise(api, contractData, null as any);

    // Instantiate with constructor arguments
    const tx = contract.tx.new(
      {
        gasLimit: api.registry.createType("WeightV2", {
          refTime: 10000000000n,
          proofSize: 125952n,
        }) as any,
        storageDepositLimit: null,
      },
      options.chainId,
      genesisHash
    );

    let contractAddress: string | null = null;

    await new Promise((resolve, reject) => {
      tx.signAndSend(deployer, (result) => {
        if (result.status.isInBlock) {
          spinner.text = `Contract instantiated in block ${result.status.asInBlock.toHex()}`;
        } else if (result.status.isFinalized) {
          // Find the contract address from events
          result.events.forEach(({ event }) => {
            if (api.events.contracts.Instantiated.is(event)) {
              contractAddress = event.data[1].toString();
            }
          });

          spinner.succeed(`Contract instantiated successfully`);
          resolve(true);
        }

        if (result.isError) {
          reject(new Error("Instantiation failed"));
        }
      });
    });

    // 8. Generate config file
    const configData = {
      contract: {
        address: contractAddress,
        version: VERSION,
        deployedAt: new Date().toISOString(),
      },
      chain: {
        id: options.chainId,
        genesisHash: genesisHash,
        endpoint: options.endpoint,
      },
      admin: {
        address: deployer.address,
        publicKey: `0x${Buffer.from(deployer.publicKey).toString("hex")}`,
      },
    };

    const outputPath =
      options.output || resolve(process.cwd(), "jamid.config.json");
    try {
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, JSON.stringify(configData, null, 2));
      spinner.succeed(`Config saved to: ${chalk.cyan(outputPath)}`);
    } catch (err) {
      console.warn(chalk.yellow(`⚠️  Could not save config file: ${err}`));
    }

    // 9. Success summary
    console.log(chalk.green("\n✅ Deployment Complete!\n"));
    console.log(chalk.white("Contract Details:"));
    console.log(`  Address: ${chalk.cyan(contractAddress || "N/A")}`);
    console.log(`  Chain: ${chalk.cyan(options.chainId)}`);
    console.log(`  Genesis Hash: ${chalk.cyan(genesisHashClean)}`);
    console.log(`  Version: ${chalk.cyan(VERSION)}`);

    console.log(chalk.white("\nAdmin:"));
    console.log(`  Address: ${chalk.cyan(deployer.address)}`);
    console.log(`  Public Key: ${chalk.gray(configData.admin.publicKey)}`);

    console.log(chalk.white("\nConfig File:"));
    console.log(`  ${chalk.cyan(outputPath)}`);

    console.log(chalk.white("\nNext Steps:"));
    console.log(`  1. Share config file with your team/SDK`);
    console.log(
      `  2. Test contract: ${chalk.cyan("jamid info -a " + contractAddress)}`
    );
    console.log(`  3. Integrate with SDK using the config file`);

    await api.disconnect();
  } catch (error) {
    spinner.fail("Deployment failed");
    console.error(
      chalk.red("\n❌ Error:"),
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}
