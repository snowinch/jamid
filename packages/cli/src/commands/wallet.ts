import { Keyring } from "@polkadot/keyring";
import { mnemonicGenerate, mnemonicToMiniSecret } from "@polkadot/util-crypto";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { u8aToHex } from "@polkadot/util";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";

interface GenerateOptions {
  type?: string;
  save?: string | boolean;
}

interface FaucetOptions {
  address: string;
  endpoint?: string;
}

export async function generateWallet(options: GenerateOptions) {
  console.log(
    chalk.cyan(`
╔═══════════════════════════════════════╗
║       Generate New Wallet             ║
╚═══════════════════════════════════════╝
`)
  );

  const keyType = (options.type || "sr25519") as "sr25519" | "ed25519";

  // Generate mnemonic
  const mnemonic = mnemonicGenerate(12);

  // Derive seed from mnemonic
  const seed = mnemonicToMiniSecret(mnemonic);
  const secretKeyHex = u8aToHex(seed);

  // Create keyring
  const keyring = new Keyring({ type: keyType });
  const pair = keyring.addFromMnemonic(mnemonic);

  console.log(chalk.white("✅ Wallet Generated Successfully!\n"));

  console.log(chalk.white("Account Details:"));
  console.log(`  Address: ${chalk.cyan(pair.address)}`);
  console.log(`  Type: ${chalk.cyan(keyType)}`);

  console.log(chalk.white("\nKeys:"));
  console.log(
    `  Public Key: ${chalk.gray(`0x${Buffer.from(pair.publicKey).toString("hex")}`)}`
  );
  console.log(`  Secret Seed: ${chalk.gray(secretKeyHex)}`);

  console.log(
    chalk.yellow("\n⚠️  IMPORTANT - Save this seed phrase securely:")
  );
  console.log(chalk.red(`\n  ${mnemonic}\n`));

  console.log(
    chalk.white("This is the ONLY time you'll see this seed phrase.")
  );
  console.log(chalk.white("Anyone with this phrase can control your funds.\n"));

  // Option to save to file
  if (options.save !== false) {
    const { writeFileSync, existsSync } = await import("fs");

    // Determine save path
    const savePath =
      typeof options.save === "string" ? options.save : "./wallet.json";

    // Check if file already exists
    if (existsSync(savePath)) {
      console.log(
        chalk.yellow(`\n⚠️  File ${chalk.cyan(savePath)} already exists!`)
      );

      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: chalk.red(
            "This will DELETE the existing wallet. Are you sure?"
          ),
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(
          chalk.yellow("\n❌ Wallet NOT saved. Existing file preserved.\n")
        );
        console.log(
          chalk.white("💡 Tip: Use a different filename with -s <path>\n")
        );
        return;
      }

      console.log(chalk.yellow("\n⚠️  Overwriting existing wallet...\n"));
    }

    const walletData = {
      address: pair.address,
      type: keyType,
      publicKey: `0x${Buffer.from(pair.publicKey).toString("hex")}`,
      secretSeed: secretKeyHex,
      mnemonic: mnemonic,
      createdAt: new Date().toISOString(),
      warning: "KEEP THIS FILE SECURE - Contains private keys",
    };

    try {
      writeFileSync(savePath, JSON.stringify(walletData, null, 2));
      console.log(chalk.green(`✅ Wallet saved to: ${chalk.cyan(savePath)}`));
      if (savePath === "./wallet.json") {
        console.log(chalk.gray(`   (already in .gitignore)\n`));
      } else {
        console.log(
          chalk.yellow(`⚠️  Remember to add ${savePath} to .gitignore!\n`)
        );
      }
    } catch (err) {
      console.error(chalk.red(`❌ Failed to save wallet: ${err}`));
    }
  } else {
    console.log(
      chalk.yellow("\n⚠️  Wallet NOT saved to file (--no-save flag used)")
    );
    console.log(
      chalk.white("💡 Make sure to save the seed phrase manually!\n")
    );
  }

  // Next steps
  console.log(chalk.white("Next Steps:"));
  console.log(`  1. Save your seed phrase in a secure location`);
  console.log(
    `  2. Request testnet tokens: ${chalk.cyan(`jamid wallet faucet -a ${pair.address}`)}`
  );
  console.log(chalk.white(`  3. Deploy using one of these methods:`));
  console.log(
    chalk.gray(
      `     • Mnemonic: ${chalk.cyan(`jamid deploy -s "${mnemonic}"`)}`
    )
  );
  console.log(
    chalk.gray(
      `     • Secret Seed: ${chalk.cyan(`jamid deploy -s "${secretKeyHex}"`)}`
    )
  );
}

export async function requestFaucet(options: FaucetOptions) {
  const spinner = ora("Requesting tokens from faucet...").start();

  try {
    // Connect to the chain to verify address and get balance
    const provider = new WsProvider(
      options.endpoint || "wss://rpc.ibp.network/paseo"
    );
    const api = await ApiPromise.create({ provider });
    await api.isReady;

    spinner.text = "Checking current balance...";

    const accountInfo: any = await api.query.system.account(options.address);
    const balanceBefore = accountInfo.data.free.toBigInt();

    spinner.succeed(
      `Current balance: ${chalk.cyan(accountInfo.data.free.toHuman())}`
    );

    console.log(chalk.yellow("\n📡 Faucet Request Methods:\n"));

    console.log(chalk.white("1. Matrix Bot (Recommended):"));
    console.log(
      `   • Join: ${chalk.cyan("https://matrix.to/#/#paseo-faucet:matrix.org")}`
    );
    console.log(`   • Send: ${chalk.cyan(`!drip ${options.address}`)}\n`);

    console.log(chalk.white("2. Telegram Bot:"));
    console.log(`   • Join: ${chalk.cyan("https://t.me/paseo_faucet_bot")}`);
    console.log(`   • Send: ${chalk.cyan(`/drip ${options.address}`)}\n`);

    console.log(chalk.white("3. Web Faucet:"));
    console.log(
      `   • Visit: ${chalk.cyan("https://faucet.polkadot.io/paseo")}`
    );
    console.log(`   • Enter your address: ${chalk.cyan(options.address)}\n`);

    // Ask if user wants to wait and check balance
    const { shouldWait } = await inquirer.prompt([
      {
        type: "confirm",
        name: "shouldWait",
        message: "Wait and check for balance update?",
        default: true,
      },
    ]);

    if (shouldWait) {
      spinner.start("Waiting for tokens... (checking every 10s)");

      const maxAttempts = 30; // 5 minutes max
      let attempts = 0;

      const checkInterval = setInterval(async () => {
        attempts++;

        try {
          const currentInfo: any = await api.query.system.account(
            options.address
          );
          const currentBalance = currentInfo.data.free.toBigInt();

          if (currentBalance > balanceBefore) {
            clearInterval(checkInterval);
            const received = currentBalance - balanceBefore;
            spinner.succeed(
              chalk.green(
                `✅ Tokens received! New balance: ${chalk.cyan(currentInfo.data.free.toHuman())}`
              )
            );
            console.log(
              chalk.white(
                `   Amount received: ${chalk.green(`+${(Number(received) / 1e12).toFixed(4)} PAS`)}`
              )
            );
            await api.disconnect();
            return;
          }

          if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            spinner.warn(
              chalk.yellow("⏱️  Timeout reached. Check balance manually later.")
            );
            await api.disconnect();
            return;
          }

          spinner.text = `Waiting for tokens... (${attempts}/${maxAttempts})`;
        } catch (err) {
          clearInterval(checkInterval);
          spinner.fail(chalk.red(`Error checking balance: ${err}`));
          await api.disconnect();
        }
      }, 10000);
    } else {
      await api.disconnect();
      console.log(chalk.white("\n💡 Check your balance later with:"));
      console.log(
        chalk.cyan(`   jamid wallet balance -a ${options.address}\n`)
      );
    }
  } catch (error) {
    spinner.fail("Faucet request failed");
    console.error(
      chalk.red("\n❌ Error:"),
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

export async function checkBalance(options: {
  address: string;
  endpoint?: string;
}) {
  const spinner = ora("Fetching balance...").start();

  try {
    const provider = new WsProvider(
      options.endpoint || "wss://rpc.ibp.network/paseo"
    );
    const api = await ApiPromise.create({ provider });
    await api.isReady;

    const accountInfo: any = await api.query.system.account(options.address);
    const chain = await api.rpc.system.chain();

    spinner.succeed("Balance retrieved");

    console.log(chalk.cyan("\n╔════════════════════════════════════════╗"));
    console.log(chalk.cyan("║         Account Balance               ║"));
    console.log(chalk.cyan("╚════════════════════════════════════════╝\n"));

    console.log(chalk.white("Account:"));
    console.log(`  Address: ${chalk.cyan(options.address)}`);
    console.log(`  Chain: ${chalk.cyan(chain.toString())}\n`);

    console.log(chalk.white("Balances:"));
    console.log(`  Free: ${chalk.green(accountInfo.data.free.toHuman())}`);
    console.log(
      `  Reserved: ${chalk.yellow(accountInfo.data.reserved.toHuman())}`
    );
    console.log(`  Frozen: ${chalk.gray(accountInfo.data.frozen.toHuman())}`);

    const total =
      accountInfo.data.free.toBigInt() + accountInfo.data.reserved.toBigInt();
    console.log(
      `  Total: ${chalk.cyan((Number(total) / 1e12).toFixed(4))} PAS\n`
    );

    console.log(chalk.white("Nonce:"));
    console.log(`  ${accountInfo.nonce.toString()}\n`);

    await api.disconnect();
  } catch (error) {
    spinner.fail("Failed to fetch balance");
    console.error(
      chalk.red("\n❌ Error:"),
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}
