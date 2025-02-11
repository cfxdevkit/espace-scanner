/**
 * Example usage of the Conflux eSpace Scanner API wrapper.
 * This file demonstrates various features and capabilities of the library.
 */
import { ESpaceScannerWrapper } from "../src";
import util from "util";

/**
 * Helper function to format objects for console output
 * @param obj Object to inspect
 * @returns Formatted string representation
 */
const inspect = <T>(obj: T): string =>
  util.inspect(obj, {
    depth: 4,
    colors: false,
    maxArrayLength: 3,
  });

/**
 * Demonstrates the main features of the ESpaceScannerWrapper
 * Includes examples of contract methods, token methods, and various statistics
 */
async function demonstrateESpaceScannerWrapperUsage(): Promise<void> {
  // Initialize scanners for different networks
  const mainnetScanner = new ESpaceScannerWrapper({ target: "mainnet" });
  const testnetScanner = new ESpaceScannerWrapper({ target: "testnet" });
  const _scannerWithApiKey = new ESpaceScannerWrapper({
    target: "mainnet",
    apiKey: process.env.API_KEY,
  });

  try {
    // Contract Methods Demonstration
    console.log("=== Contract Methods ===");
    // Example contract address for demonstration
    const contractAddress = "0x704a2822d59cf4350fd3bbc4957bba48469770cc";
    const tokenAddress = "0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b";

    // Get contract ABI in both formatted and raw forms
    const contractABI = await mainnetScanner.getContractABI(contractAddress);
    console.log("---\ngetContractABI (formatted)\n", inspect(contractABI));

    const rawContractABI = await mainnetScanner.getContractABI(contractAddress, true);
    console.log("---\ngetContractABI (raw)\n", inspect(rawContractABI));

    // Get contract source code in both formatted and raw forms
    const contractSource = await mainnetScanner.getContractSourceCode(contractAddress);
    console.log("---\ngetContractSourceCode (formatted)\n", inspect(contractSource));

    const rawContractSource = await mainnetScanner.getContractSourceCode(contractAddress, true);
    console.log("---\ngetContractSourceCode (raw)\n", inspect(rawContractSource));

    // Token Methods Demonstration
    console.log("\n=== Token Methods ===");
    // Example wallet address for demonstration
    const walletAddress = "0xe796f076084eEF751968Cf13838AC0b0cB60ADaa";

    // Test different token types with both formatted and raw data
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

    // Basic Statistics Methods Demonstration
    console.log("\n=== Basic Statistics Methods ===");
    const statsParams = {
      minTimestamp: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // 7 days ago
      maxTimestamp: Math.floor(Date.now() / 1000),
      limit: 5,
    };

    // Get active accounts statistics
    const activeAccounts = await mainnetScanner.getActiveAccountStats(statsParams);
    console.log("---\ngetActiveAccountStats (formatted)\n", inspect(activeAccounts));

    const rawActiveAccounts = await mainnetScanner.getActiveAccountStats(statsParams, true);
    console.log("---\ngetActiveAccountStats (raw)\n", inspect(rawActiveAccounts));

    // Get CFX holder statistics
    const cfxHolders = await mainnetScanner.getCfxHolderStats(statsParams);
    console.log("---\ngetCfxHolderStats (formatted)\n", inspect(cfxHolders));

    const rawCfxHolders = await mainnetScanner.getCfxHolderStats(statsParams, true);
    console.log("---\ngetCfxHolderStats (raw)\n", inspect(rawCfxHolders));

    // Get account growth statistics
    const accountGrowth = await mainnetScanner.getAccountGrowthStats(statsParams);
    console.log("---\ngetAccountGrowthStats (formatted)\n", inspect(accountGrowth));

    const rawAccountGrowth = await mainnetScanner.getAccountGrowthStats(statsParams, true);
    console.log("---\ngetAccountGrowthStats (raw)\n", inspect(rawAccountGrowth));

    // Get TPS (Transactions Per Second) statistics
    const tpsStats = await mainnetScanner.getTpsStats({ ...statsParams, intervalType: "hour" });
    console.log("---\ngetTpsStats (formatted)\n", inspect(tpsStats));

    const rawTpsStats = await mainnetScanner.getTpsStats(
      { ...statsParams, intervalType: "hour" },
      true
    );
    console.log("---\ngetTpsStats (raw)\n", inspect(rawTpsStats));

    // Top Statistics Methods Demonstration
    console.log("\n=== Top Statistics Methods ===");
    // Test different time periods with both formatted and raw data
    const periods = ["24h", "7d"] as const;
    for (const period of periods) {
      // Get top gas usage statistics
      const topGasUsed = await mainnetScanner.getTopGasUsed(period);
      console.log(`---\ngetTopGasUsed (${period}) (formatted)\n`, inspect(topGasUsed));

      const rawTopGasUsed = await mainnetScanner.getTopGasUsed(period, true);
      console.log(`---\ngetTopGasUsed (${period}) (raw)\n`, inspect(rawTopGasUsed));

      // Get top transaction senders statistics
      const topTxSenders = await mainnetScanner.getTopTransactionSenders(period);
      console.log(`---\ngetTopTransactionSenders (${period}) (formatted)\n`, inspect(topTxSenders));

      const rawTopTxSenders = await mainnetScanner.getTopTransactionSenders(period, true);
      console.log(`---\ngetTopTransactionSenders (${period}) (raw)\n`, inspect(rawTopTxSenders));

      // Get top token transfers statistics
      const topTokenTransfers = await mainnetScanner.getTopTokenTransfers(period);
      console.log(
        `---\ngetTopTokenTransfers (${period}) (formatted)\n`,
        inspect(topTokenTransfers)
      );

      const rawTopTokenTransfers = await mainnetScanner.getTopTokenTransfers(period, true);
      console.log(`---\ngetTopTokenTransfers (${period}) (raw)\n`, inspect(rawTopTokenTransfers));

      // Get top token senders statistics
      const topTokenSenders = await mainnetScanner.getTopTokenSenders(period);
      console.log(`---\ngetTopTokenSenders (${period}) (formatted)\n`, inspect(topTokenSenders));

      const rawTopTokenSenders = await mainnetScanner.getTopTokenSenders(period, true);
      console.log(`---\ngetTopTokenSenders (${period}) (raw)\n`, inspect(rawTopTokenSenders));

      // Get top token receivers statistics
      const topTokenReceivers = await mainnetScanner.getTopTokenReceivers(period);
      console.log(
        `---\ngetTopTokenReceivers (${period}) (formatted)\n`,
        inspect(topTokenReceivers)
      );

      const rawTopTokenReceivers = await mainnetScanner.getTopTokenReceivers(period, true);
      console.log(`---\ngetTopTokenReceivers (${period}) (raw)\n`, inspect(rawTopTokenReceivers));

      // Get top token participants statistics
      const topTokenParticipants = await mainnetScanner.getTopTokenParticipants(period);
      console.log(
        `---\ngetTopTokenParticipants (${period}) (formatted)\n`,
        inspect(topTokenParticipants)
      );

      const rawTopTokenParticipants = await mainnetScanner.getTopTokenParticipants(period, true);
      console.log(
        `---\ngetTopTokenParticipants (${period}) (raw)\n`,
        inspect(rawTopTokenParticipants)
      );
    }

    // Token Statistics Methods Demonstration
    console.log("\n=== Token Statistics Methods ===");
    // Get token holder statistics
    const tokenHolderStats = await mainnetScanner.getTokenHolderStats(tokenAddress);
    console.log("---\ngetTokenHolderStats (formatted)\n", inspect(tokenHolderStats));

    const rawTokenHolderStats = await mainnetScanner.getTokenHolderStats(tokenAddress, {}, true);
    console.log("---\ngetTokenHolderStats (raw)\n", inspect(rawTokenHolderStats));

    // Get token unique sender statistics
    const tokenUniqueSenderStats = await mainnetScanner.getTokenUniqueSenderStats(tokenAddress);
    console.log("---\ngetTokenUniqueSenderStats (formatted)\n", inspect(tokenUniqueSenderStats));

    const rawTokenUniqueSenderStats = await mainnetScanner.getTokenUniqueSenderStats(
      tokenAddress,
      {},
      true
    );
    console.log("---\ngetTokenUniqueSenderStats (raw)\n", inspect(rawTokenUniqueSenderStats));

    // Get token unique receiver statistics
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

    // Block Statistics Methods Demonstration
    console.log("\n=== Block Statistics Methods ===");
    // Get block base fee statistics
    const blockBaseFeeStats = await mainnetScanner.getBlockBaseFeeStats(statsParams);
    console.log("---\ngetBlockBaseFeeStats (formatted)\n", inspect(blockBaseFeeStats));

    const rawBlockBaseFeeStats = await mainnetScanner.getBlockBaseFeeStats(statsParams, true);
    console.log("---\ngetBlockBaseFeeStats (raw)\n", inspect(rawBlockBaseFeeStats));

    // Get block gas used statistics
    const blockGasUsedStats = await mainnetScanner.getBlockGasUsedStats(statsParams);
    console.log("---\ngetBlockGasUsedStats (formatted)\n", inspect(blockGasUsedStats));

    const rawBlockGasUsedStats = await mainnetScanner.getBlockGasUsedStats(statsParams, true);
    console.log("---\ngetBlockGasUsedStats (raw)\n", inspect(rawBlockGasUsedStats));

    // Get block average priority fee statistics
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

    // Get block transactions by type statistics
    const blockTxsByTypeStats = await mainnetScanner.getBlockTxsByTypeStats(statsParams);
    console.log("---\ngetBlockTxsByTypeStats (formatted)\n", inspect(blockTxsByTypeStats));

    const rawBlockTxsByTypeStats = await mainnetScanner.getBlockTxsByTypeStats(statsParams, true);
    console.log("---\ngetBlockTxsByTypeStats (raw)\n", inspect(rawBlockTxsByTypeStats));

    // Testnet Example Demonstration
    console.log("\n=== Testnet Example ===");
    // Get testnet block statistics
    const testnetBlockStats = await testnetScanner.getBlockBaseFeeStats(statsParams);
    console.log("---\ngetBlockBaseFeeStats (testnet) (formatted)\n", inspect(testnetBlockStats));

    const rawTestnetBlockStats = await testnetScanner.getBlockBaseFeeStats(statsParams, true);
    console.log("---\ngetBlockBaseFeeStats (testnet) (raw)\n", inspect(rawTestnetBlockStats));

    // API Key Example Demonstration
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

/**
 * Demonstrates error handling capabilities of the library
 * Shows how the library handles invalid addresses and non-existent contracts
 */
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

// Run the demonstrations if this file is executed directly
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
