import { ESpaceScannerWrapper } from "../src";
import util from "util";

const inspect = <T>(obj: T): string =>
  util.inspect(obj, {
    depth: 4,
    colors: true,
    maxArrayLength: 3,
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

    // Get both formatted and raw contract ABI
    const contractABI = await mainnetScanner.getContractABI(contractAddress);
    console.log("---\ngetContractABI (formatted)\n", inspect(contractABI));

    const rawContractABI = await mainnetScanner.getContractABI(contractAddress, true);
    console.log("---\ngetContractABI (raw)\n", inspect(rawContractABI));

    // Get both formatted and raw contract source code
    const contractSource = await mainnetScanner.getContractSourceCode(contractAddress);
    console.log("---\ngetContractSourceCode (formatted)\n", inspect(contractSource));

    const rawContractSource = await mainnetScanner.getContractSourceCode(contractAddress, true);
    console.log("---\ngetContractSourceCode (raw)\n", inspect(rawContractSource));

    console.log("\n=== Token Methods ===");
    // Example wallet address
    const walletAddress = "0xe796f076084eEF751968Cf13838AC0b0cB60ADaa";

    // Test token types with both formatted and raw data
    for (const tokenType of ["ERC20", "ERC721"] as const) {
      const tokens = await mainnetScanner.getAccountTokens(walletAddress, tokenType);
      console.log(`---\ngetAccountTokens ${tokenType} (formatted)\n`, inspect(tokens));

      const rawTokens = await mainnetScanner.getAccountTokens(
        walletAddress,
        tokenType,
        0,
        10,
        true
      );
      console.log(`---\ngetAccountTokens ${tokenType} (raw)\n`, inspect(rawTokens));
    }

    console.log("\n=== Basic Statistics Methods ===");
    const statsParams = {
      minTimestamp: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // 7 days ago
      maxTimestamp: Math.floor(Date.now() / 1000),
      limit: 5,
    };

    // Get both formatted and raw active accounts stats
    const activeAccounts = await mainnetScanner.getActiveAccountStats(statsParams);
    console.log("---\ngetActiveAccountStats (formatted)\n", inspect(activeAccounts));

    const rawActiveAccounts = await mainnetScanner.getActiveAccountStats(statsParams, true);
    console.log("---\ngetActiveAccountStats (raw)\n", inspect(rawActiveAccounts));

    // Get both formatted and raw CFX holder stats
    const cfxHolders = await mainnetScanner.getCfxHolderStats(statsParams);
    console.log("---\ngetCfxHolderStats (formatted)\n", inspect(cfxHolders));

    const rawCfxHolders = await mainnetScanner.getCfxHolderStats(statsParams, true);
    console.log("---\ngetCfxHolderStats (raw)\n", inspect(rawCfxHolders));

    // Get both formatted and raw account growth stats
    const accountGrowth = await mainnetScanner.getAccountGrowthStats(statsParams);
    console.log("---\ngetAccountGrowthStats (formatted)\n", inspect(accountGrowth));

    const rawAccountGrowth = await mainnetScanner.getAccountGrowthStats(statsParams, true);
    console.log("---\ngetAccountGrowthStats (raw)\n", inspect(rawAccountGrowth));

    // Test TPS stats with both formatted and raw data
    const tpsStats = await mainnetScanner.getTpsStats({ ...statsParams, intervalType: "hour" });
    console.log("---\ngetTpsStats (formatted)\n", inspect(tpsStats));

    const rawTpsStats = await mainnetScanner.getTpsStats(
      { ...statsParams, intervalType: "hour" },
      true
    );
    console.log("---\ngetTpsStats (raw)\n", inspect(rawTpsStats));

    console.log("\n=== Top Statistics Methods ===");
    // Test different periods with both formatted and raw data
    const periods = ["24h", "7d"] as const;
    for (const period of periods) {
      const topGasUsed = await mainnetScanner.getTopGasUsed(period);
      console.log(`---\ngetTopGasUsed (${period}) (formatted)\n`, inspect(topGasUsed));

      const rawTopGasUsed = await mainnetScanner.getTopGasUsed(period, true);
      console.log(`---\ngetTopGasUsed (${period}) (raw)\n`, inspect(rawTopGasUsed));

      const topTxSenders = await mainnetScanner.getTopTransactionSenders(period);
      console.log(`---\ngetTopTransactionSenders (${period}) (formatted)\n`, inspect(topTxSenders));

      const rawTopTxSenders = await mainnetScanner.getTopTransactionSenders(period, true);
      console.log(`---\ngetTopTransactionSenders (${period}) (raw)\n`, inspect(rawTopTxSenders));
    }

    console.log("\n=== Token Statistics Methods ===");
    // Get both formatted and raw token holder stats
    const tokenHolderStats = await mainnetScanner.getTokenHolderStats(tokenAddress);
    console.log("---\ngetTokenHolderStats (formatted)\n", inspect(tokenHolderStats));

    const rawTokenHolderStats = await mainnetScanner.getTokenHolderStats(tokenAddress, {}, true);
    console.log("---\ngetTokenHolderStats (raw)\n", inspect(rawTokenHolderStats));

    // Get both formatted and raw token unique sender stats
    const tokenUniqueSenderStats = await mainnetScanner.getTokenUniqueSenderStats(tokenAddress);
    console.log("---\ngetTokenUniqueSenderStats (formatted)\n", inspect(tokenUniqueSenderStats));

    const rawTokenUniqueSenderStats = await mainnetScanner.getTokenUniqueSenderStats(
      tokenAddress,
      {},
      true
    );
    console.log("---\ngetTokenUniqueSenderStats (raw)\n", inspect(rawTokenUniqueSenderStats));

    // Get both formatted and raw token unique receiver stats
    const tokenUniqueReceiverStats = await mainnetScanner.getTokenUniqueReceiverStats(tokenAddress);
    console.log(
      "---\ngetTokenUniqueReceiverStats (formatted)\n",
      inspect(tokenUniqueReceiverStats)
    );

    const rawTokenUniqueReceiverStats = await mainnetScanner.getTokenUniqueReceiverStats(
      tokenAddress,
      {},
      true
    );
    console.log("---\ngetTokenUniqueReceiverStats (raw)\n", inspect(rawTokenUniqueReceiverStats));

    console.log("\n=== Block Statistics Methods ===");
    // Get both formatted and raw block base fee stats
    const blockBaseFeeStats = await mainnetScanner.getBlockBaseFeeStats(statsParams);
    console.log("---\ngetBlockBaseFeeStats (formatted)\n", inspect(blockBaseFeeStats));

    const rawBlockBaseFeeStats = await mainnetScanner.getBlockBaseFeeStats(statsParams, true);
    console.log("---\ngetBlockBaseFeeStats (raw)\n", inspect(rawBlockBaseFeeStats));

    // Get both formatted and raw block gas used stats
    const blockGasUsedStats = await mainnetScanner.getBlockGasUsedStats(statsParams);
    console.log("---\ngetBlockGasUsedStats (formatted)\n", inspect(blockGasUsedStats));

    const rawBlockGasUsedStats = await mainnetScanner.getBlockGasUsedStats(statsParams, true);
    console.log("---\ngetBlockGasUsedStats (raw)\n", inspect(rawBlockGasUsedStats));

    // Get both formatted and raw block average priority fee stats
    const blockAvgPriorityFeeStats = await mainnetScanner.getBlockAvgPriorityFeeStats(statsParams);
    console.log(
      "---\ngetBlockAvgPriorityFeeStats (formatted)\n",
      inspect(blockAvgPriorityFeeStats)
    );

    const rawBlockAvgPriorityFeeStats = await mainnetScanner.getBlockAvgPriorityFeeStats(
      statsParams,
      true
    );
    console.log("---\ngetBlockAvgPriorityFeeStats (raw)\n", inspect(rawBlockAvgPriorityFeeStats));

    console.log("\n=== Testnet Example ===");
    // Get both formatted and raw testnet block stats
    const testnetBlockStats = await testnetScanner.getBlockBaseFeeStats(statsParams);
    console.log("---\ngetBlockBaseFeeStats (testnet) (formatted)\n", inspect(testnetBlockStats));

    const rawTestnetBlockStats = await testnetScanner.getBlockBaseFeeStats(statsParams, true);
    console.log("---\ngetBlockBaseFeeStats (testnet) (raw)\n", inspect(rawTestnetBlockStats));

    // Example with API key
    if (process.env.API_KEY) {
      console.log("\n=== API Key Example ===");
      const apiKeyBlockStats = await _scannerWithApiKey.getBlockBaseFeeStats(statsParams);
      console.log(
        "---\ngetBlockBaseFeeStats (with API Key) (formatted)\n",
        inspect(apiKeyBlockStats)
      );

      const rawApiKeyBlockStats = await _scannerWithApiKey.getBlockBaseFeeStats(statsParams, true);
      console.log("---\ngetBlockBaseFeeStats (with API Key) (raw)\n", inspect(rawApiKeyBlockStats));
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
