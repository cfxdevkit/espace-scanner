import { ESpaceScannerWrapper } from "../src";
import util from "util";

const inspect = <T>(obj: T): string =>
  util.inspect(obj, {
    depth: null,
    colors: true,
    maxArrayLength: null,
  });

async function demonstrateESpaceScannerWrapperUsage(): Promise<void> {
  // Initialize scanners for different networks
  const mainnetScanner = new ESpaceScannerWrapper({ target: "mainnet" });
  const testnetScanner = new ESpaceScannerWrapper({ target: "testnet" });
  const _scannerWithApiKey = new ESpaceScannerWrapper({
    target: "mainnet",
    apiKey: process.env.API_KEY,
  });

  try {
    console.log("=== Contract Methods ===");
    // Example contract address
    const contractAddress = "0x704a2822d59cf4350fd3bbc4957bba48469770cc";
    const tokenAddress = "0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b";

    const contractABI = await mainnetScanner.getContractABI(contractAddress);
    console.log("---\ngetContractABI\n", inspect(contractABI));

    const contractSource = await mainnetScanner.getContractSourceCode(contractAddress);
    console.log("---\ngetContractSourceCode\n", inspect(contractSource));

    console.log("\n=== Token Methods ===");
    // Example wallet address
    const walletAddress = "0xe796f076084eEF751968Cf13838AC0b0cB60ADaa";

    // Test token types
    for (const tokenType of ["ERC20", "ERC721"] as const) {
      const tokens = await mainnetScanner.getAccountTokens(walletAddress, tokenType);
      console.log(`---\ngetAccountTokens ${tokenType}\n`, inspect(tokens));
    }

    console.log("\n=== Basic Statistics Methods ===");
    const statsParams = {
      minTimestamp: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // 7 days ago
      maxTimestamp: Math.floor(Date.now() / 1000),
      limit: 5,
    };

    const activeAccounts = await mainnetScanner.getActiveAccountStats(statsParams);
    console.log("---\ngetActiveAccountStats\n", inspect(activeAccounts));

    const cfxHolders = await mainnetScanner.getCfxHolderStats(statsParams);
    console.log("---\ngetCfxHolderStats\n", inspect(cfxHolders));

    const accountGrowth = await mainnetScanner.getAccountGrowthStats(statsParams);
    console.log("---\ngetAccountGrowthStats\n", inspect(accountGrowth));

    // Test TPS stats
    const tpsStats = await mainnetScanner.getTpsStats({ ...statsParams, intervalType: "hour" });
    console.log("---\ngetTpsStats\n", inspect(tpsStats));

    console.log("\n=== Top Statistics Methods ===");
    // Test different periods
    const periods = ["24h", "7d"] as const;
    for (const period of periods) {
      const topGasUsed = await mainnetScanner.getTopGasUsed(period);
      console.log(`---\ngetTopGasUsed (${period})\n`, inspect(topGasUsed));

      const topTxSenders = await mainnetScanner.getTopTransactionSenders(period);
      console.log(`---\ngetTopTransactionSenders (${period})\n`, inspect(topTxSenders));
    }

    console.log("\n=== Token Statistics Methods ===");
    const tokenHolderStats = await mainnetScanner.getTokenHolderStats(tokenAddress);
    console.log("---\ngetTokenHolderStats\n", inspect(tokenHolderStats));

    const tokenUniqueSenderStats = await mainnetScanner.getTokenUniqueSenderStats(tokenAddress);
    console.log("---\ngetTokenUniqueSenderStats\n", inspect(tokenUniqueSenderStats));

    console.log("\n=== Block Statistics Methods ===");
    const blockBaseFeeStats = await mainnetScanner.getBlockBaseFeeStats(statsParams);
    console.log("---\ngetBlockBaseFeeStats\n", inspect(blockBaseFeeStats));

    const blockGasUsedStats = await mainnetScanner.getBlockGasUsedStats(statsParams);
    console.log("---\ngetBlockGasUsedStats\n", inspect(blockGasUsedStats));

    console.log("\n=== Testnet Example ===");
    const testnetBlockStats = await testnetScanner.getBlockBaseFeeStats(statsParams);
    console.log("---\ngetBlockBaseFeeStats (testnet)\n", inspect(testnetBlockStats));

    // Example with API key
    if (process.env.API_KEY) {
      console.log("\n=== API Key Example ===");
      const apiKeyBlockStats = await _scannerWithApiKey.getBlockBaseFeeStats(statsParams);
      console.log("---\ngetBlockBaseFeeStats (with API Key)\n", inspect(apiKeyBlockStats));
    }
  } catch (error) {
    console.error(
      "Error during demonstration:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// Example of error handling and address validation
async function demonstrateErrorHandling(): Promise<void> {
  console.log("\n=== Error Handling Demonstration ===");
  const scanner = new ESpaceScannerWrapper({ target: "mainnet" });

  try {
    console.log("\nTesting invalid address handling...");
    await scanner.getContractABI("0xinvalid");
  } catch (error) {
    console.error(
      "Expected error for invalid address:",
      error instanceof Error ? error.message : String(error)
    );
  }

  try {
    console.log("\nTesting non-existent contract handling...");
    await scanner.getContractABI("0x0000000000000000000000000000000000000000");
  } catch (error) {
    console.error(
      "Expected error for non-existent contract:",
      error instanceof Error ? error.message : String(error)
    );
  }

  console.log("\n=== End of Error Handling Demonstration ===\n");
  console.log("=".repeat(80), "\n");
}

// Run the demonstrations
if (require.main === module) {
  console.log("Starting demonstrations...");
  // Run error handling first, then the main demonstration
  demonstrateErrorHandling()
    .then(() => demonstrateESpaceScannerWrapperUsage())
    .catch((error) =>
      console.error(
        "Error running demonstrations:",
        error instanceof Error ? error.message : String(error)
      )
    );
}
