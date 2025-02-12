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
    maxArrayLength: 2,
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
    // Account Methods Demonstration
    console.log("=== Account Methods ===");
    const walletAddress = "0xe796f076084eEF751968Cf13838AC0b0cB60ADaa";
    const multiAddresses = [
      "0xe796f076084eEF751968Cf13838AC0b0cB60ADaa",
      "0x704a2822d59cf4350fd3bbc4957bba48469770cc",
    ];

    // Get single account balance
    const balance = await mainnetScanner.account.getBalance(walletAddress);
    console.log("---\ngetBalance (formatted)\n", inspect(balance));

    const rawBalance = await mainnetScanner.account.getBalance(walletAddress, "latest_state", true);
    console.log("---\ngetBalance (raw)\n", inspect(rawBalance));

    // Get multiple account balances
    const multiBalance = await mainnetScanner.account.getBalanceMulti(multiAddresses);
    console.log("---\ngetBalanceMulti (formatted)\n", inspect(multiBalance));

    const rawMultiBalance = await mainnetScanner.account.getBalanceMulti(
      multiAddresses,
      "latest_state",
      true
    );
    console.log("---\ngetBalanceMulti (raw)\n", inspect(rawMultiBalance));

    // Get transaction list
    const txList = await mainnetScanner.account.getTransactionList(walletAddress);
    console.log("---\ngetTransactionList (formatted)\n", inspect(txList));

    const rawTxList = await mainnetScanner.account.getTransactionList(
      walletAddress,
      {
        startBlock: undefined,
        endBlock: undefined,
        page: 1,
        offset: 5,
        sort: "desc",
      },
      true
    );
    console.log("---\ngetTransactionList (raw)\n", inspect(rawTxList));

    // Get internal transaction list by address
    const internalTxList = await mainnetScanner.transaction.getInternalTransactionList({
      address: walletAddress,
      page: 1,
      offset: 5,
    });
    console.log(
      "---\ngetInternalTransactionList by address (formatted)\n",
      inspect(internalTxList)
    );

    const rawInternalTxList = await mainnetScanner.transaction.getInternalTransactionList(
      {
        address: walletAddress,
        page: 1,
        offset: 5,
      },
      true
    );
    console.log("---\ngetInternalTransactionList by address (raw)\n", inspect(rawInternalTxList));

    // Contract Methods Demonstration
    console.log("\n=== Contract Methods ===");
    // Example address for demonstration
    const contractAddress = "0x704a2822d59cf4350fd3bbc4957bba48469770cc";
    const tokenAddress = "0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b";

    // Get contract ABI
    const contractABI = await mainnetScanner.contract.getContractABI(contractAddress);
    console.log("---\ngetContractABI (formatted)\n", inspect(contractABI));

    // Get contract source code
    const contractSource = await mainnetScanner.contract.getContractSourceCode(contractAddress);
    contractSource.SourceCode = contractSource.SourceCode.slice(0, 100);
    contractSource.ABI = contractSource.ABI.slice(0, 100);
    console.log("---\ngetContractSourceCode (formatted)\n", inspect(contractSource));

    // Get token transfers by address
    const tokenTxList = await mainnetScanner.token.getTokenTransfers({
      address: walletAddress,
      page: 1,
      offset: 5,
    });
    console.log("---\ngetTokenTransfers by address (formatted)\n", inspect(tokenTxList));

    const rawTokenTxList = await mainnetScanner.token.getTokenTransfers(
      {
        address: walletAddress,
        page: 1,
        offset: 5,
      },
      true
    );
    console.log("---\ngetTokenTransfers by address (raw)\n", inspect(rawTokenTxList));

    // Get token transfers by contract
    const tokenTxByContract = await mainnetScanner.token.getTokenTransfers({
      contractAddress: tokenAddress,
      page: 1,
      offset: 5,
    });
    console.log("---\ngetTokenTransfers by contract (formatted)\n", inspect(tokenTxByContract));

    const rawTokenTxByContract = await mainnetScanner.token.getTokenTransfers(
      {
        contractAddress: tokenAddress,
        page: 1,
        offset: 5,
      },
      true
    );
    console.log("---\ngetTokenTransfers by contract (raw)\n", inspect(rawTokenTxByContract));

    // Get token transfers filtered by both address and contract
    const tokenTxFiltered = await mainnetScanner.token.getTokenTransfers({
      address: walletAddress,
      contractAddress: tokenAddress,
      page: 1,
      offset: 5,
    });
    console.log("---\ngetTokenTransfers filtered (formatted)\n", inspect(tokenTxFiltered));

    const rawTokenTxFiltered = await mainnetScanner.token.getTokenTransfers(
      {
        address: walletAddress,
        contractAddress: tokenAddress,
        page: 1,
        offset: 5,
      },
      true
    );
    console.log("---\ngetTokenTransfers filtered (raw)\n", inspect(rawTokenTxFiltered));

    // Get NFT transfers by address
    const nftTxList = await mainnetScanner.nft.getNFTTransfers({
      address: walletAddress,
      page: 1,
      offset: 5,
    });
    console.log("---\ngetNFTTransfers by address (formatted)\n", inspect(nftTxList));

    const rawNftTxList = await mainnetScanner.nft.getNFTTransfers(
      {
        address: walletAddress,
        page: 1,
        offset: 5,
      },
      true
    );
    console.log("---\ngetNFTTransfers by address (raw)\n", inspect(rawNftTxList));

    // Get NFT transfers by contract
    const nftTxByContract = await mainnetScanner.nft.getNFTTransfers({
      contractAddress: tokenAddress,
      page: 1,
      offset: 5,
    });
    console.log("---\ngetNFTTransfers by contract (formatted)\n", inspect(nftTxByContract));

    const rawNftTxByContract = await mainnetScanner.nft.getNFTTransfers(
      {
        contractAddress: tokenAddress,
        page: 1,
        offset: 5,
      },
      true
    );
    console.log("---\ngetNFTTransfers by contract (raw)\n", inspect(rawNftTxByContract));

    // Get NFT transfers filtered by both address and contract
    const nftTxFiltered = await mainnetScanner.nft.getNFTTransfers({
      address: walletAddress,
      contractAddress: tokenAddress,
      page: 1,
      offset: 5,
    });
    console.log("---\ngetNFTTransfers filtered (formatted)\n", inspect(nftTxFiltered));

    const rawNftTxFiltered = await mainnetScanner.nft.getNFTTransfers(
      {
        address: walletAddress,
        contractAddress: tokenAddress,
        page: 1,
        offset: 5,
      },
      true
    );
    console.log("---\ngetNFTTransfers filtered (raw)\n", inspect(rawNftTxFiltered));

    // Get mined blocks by address
    const minedBlocks = await mainnetScanner.account.getMinedBlocks(walletAddress, {
      blockType: "blocks",
      page: 1,
      offset: 5,
    });
    console.log("---\ngetMinedBlocks (formatted)\n", inspect(minedBlocks));

    const rawMinedBlocks = await mainnetScanner.account.getMinedBlocks(
      walletAddress,
      {
        blockType: "blocks",
        page: 1,
        offset: 5,
      },
      true
    );
    console.log("---\ngetMinedBlocks (raw)\n", inspect(rawMinedBlocks));

    // Get token balance
    const tokenBalance = await mainnetScanner.token.getTokenBalance(tokenAddress, walletAddress);
    console.log("---\ngetTokenBalance (formatted)\n", inspect(tokenBalance));

    const rawTokenBalance = await mainnetScanner.token.getTokenBalance(
      tokenAddress,
      walletAddress,
      18,
      true
    );
    console.log("---\ngetTokenBalance (raw)\n", inspect(rawTokenBalance));

    // Get token total supply
    const tokenSupply = await mainnetScanner.token.getTokenSupply(tokenAddress);
    console.log("---\ngetTokenSupply (formatted)\n", inspect(tokenSupply));

    const rawTokenSupply = await mainnetScanner.token.getTokenSupply(tokenAddress, 18, true);
    console.log("---\ngetTokenSupply (raw)\n", inspect(rawTokenSupply));

    // Get block number by timestamp
    const timestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const blockNumber = await mainnetScanner.block.getBlockNumberByTime(timestamp);
    console.log("---\ngetBlockNumberByTime (formatted)\n", inspect(blockNumber));

    const rawBlockNumber = await mainnetScanner.block.getBlockNumberByTime(
      timestamp,
      "before",
      true
    );
    console.log("---\ngetBlockNumberByTime (raw)\n", inspect(rawBlockNumber));

    // Get block number after timestamp
    const blockNumberAfter = await mainnetScanner.block.getBlockNumberByTime(timestamp, "after");
    console.log("---\ngetBlockNumberByTime after (formatted)\n", inspect(blockNumberAfter));

    const rawBlockNumberAfter = await mainnetScanner.block.getBlockNumberByTime(
      timestamp,
      "after",
      true
    );
    console.log("---\ngetBlockNumberByTime after (raw)\n", inspect(rawBlockNumberAfter));

    // Token Methods Demonstration
    console.log("\n=== Token Methods ===");

    // Test different token types with both formatted and raw data
    for (const tokenType of ["ERC20", "ERC721"] as const) {
      const tokens = await mainnetScanner.token.getAccountTokens(walletAddress, tokenType);
      console.log(`---\ngetAccountTokens ${tokenType} (formatted)\n`, inspect(tokens));

      const rawTokens = await mainnetScanner.token.getAccountTokens(
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
    const activeAccounts = await mainnetScanner.stats.getActiveAccountStats(statsParams);
    console.log("---\ngetActiveAccountStats (formatted)\n", inspect(activeAccounts));

    const rawActiveAccounts = await mainnetScanner.stats.getActiveAccountStats(statsParams, true);
    console.log("---\ngetActiveAccountStats (raw)\n", inspect(rawActiveAccounts));

    // Get CFX holder statistics
    const cfxHolders = await mainnetScanner.stats.getCfxHolderStats(statsParams);
    console.log("---\ngetCfxHolderStats (formatted)\n", inspect(cfxHolders));

    const rawCfxHolders = await mainnetScanner.stats.getCfxHolderStats(statsParams, true);
    console.log("---\ngetCfxHolderStats (raw)\n", inspect(rawCfxHolders));

    // Get account growth statistics
    const accountGrowth = await mainnetScanner.stats.getAccountGrowthStats(statsParams);
    console.log("---\ngetAccountGrowthStats (formatted)\n", inspect(accountGrowth));

    const rawAccountGrowth = await mainnetScanner.stats.getAccountGrowthStats(statsParams, true);
    console.log("---\ngetAccountGrowthStats (raw)\n", inspect(rawAccountGrowth));

    // Get TPS (Transactions Per Second) statistics
    const tpsStats = await mainnetScanner.stats.getTpsStats({
      ...statsParams,
      intervalType: "hour",
    });
    console.log("---\ngetTpsStats (formatted)\n", inspect(tpsStats));

    const rawTpsStats = await mainnetScanner.stats.getTpsStats(
      { ...statsParams, intervalType: "hour" },
      true
    );
    console.log("---\ngetTpsStats (raw)\n", inspect(rawTpsStats));

    // Top Statistics Methods Demonstration
    console.log("\n=== Top Statistics Methods ===");
    // Test different time periods with both formatted and raw data
    const periods = ["24h", "7d"] as const; // Using periods supported by top statistics endpoints
    for (const period of periods) {
      // Get top gas usage statistics
      const topGasUsed = await mainnetScanner.stats.getTopGasUsed(period);
      console.log(`---\ngetTopGasUsed (${period}) (formatted)\n`, inspect(topGasUsed));

      const rawTopGasUsed = await mainnetScanner.stats.getTopGasUsed(period, true);
      console.log(`---\ngetTopGasUsed (${period}) (raw)\n`, inspect(rawTopGasUsed));

      // Get top transaction senders statistics
      const topTxSenders = await mainnetScanner.stats.getTopTransactionSenders(period);
      console.log(`---\ngetTopTransactionSenders (${period}) (formatted)\n`, inspect(topTxSenders));

      const rawTopTxSenders = await mainnetScanner.stats.getTopTransactionSenders(period, true);
      console.log(`---\ngetTopTransactionSenders (${period}) (raw)\n`, inspect(rawTopTxSenders));

      // Get top CFX senders statistics
      const topCfxSenders = await mainnetScanner.stats.getTopCfxSenders(period);
      console.log(`---\ngetTopCfxSenders (${period}) (formatted)\n`, inspect(topCfxSenders));

      const rawTopCfxSenders = await mainnetScanner.stats.getTopCfxSenders(period, true);
      console.log(`---\ngetTopCfxSenders (${period}) (raw)\n`, inspect(rawTopCfxSenders));

      // Get top CFX receivers statistics
      const topCfxReceivers = await mainnetScanner.stats.getTopCfxReceivers(period);
      console.log(`---\ngetTopCfxReceivers (${period}) (formatted)\n`, inspect(topCfxReceivers));

      const rawTopCfxReceivers = await mainnetScanner.stats.getTopCfxReceivers(period, true);
      console.log(`---\ngetTopCfxReceivers (${period}) (raw)\n`, inspect(rawTopCfxReceivers));

      // Get top miners statistics
      const topMiners = await mainnetScanner.stats.getTopMiner(period);
      console.log(`---\ngetTopMiner (${period}) (formatted)\n`, inspect(topMiners));

      const rawTopMiners = await mainnetScanner.stats.getTopMiner(period, true);
      console.log(`---\ngetTopMiner (${period}) (raw)\n`, inspect(rawTopMiners));
    }

    // Token Statistics Methods Demonstration
    console.log("\n=== Token Statistics Methods ===");
    // Get token holder statistics
    const tokenHolderStats = await mainnetScanner.stats.getTokenHolderStats(tokenAddress);
    console.log("---\ngetTokenHolderStats (formatted)\n", inspect(tokenHolderStats));

    const rawTokenHolderStats = await mainnetScanner.stats.getTokenHolderStats(
      tokenAddress,
      {},
      true
    );
    console.log("---\ngetTokenHolderStats (raw)\n", inspect(rawTokenHolderStats));

    // Block Statistics Methods Demonstration
    console.log("\n=== Block Statistics Methods ===");
    // Get block base fee statistics
    const blockBaseFeeStats = await mainnetScanner.stats.getBlockBaseFeeStats(statsParams);
    console.log("---\ngetBlockBaseFeeStats (formatted)\n", inspect(blockBaseFeeStats));

    const rawBlockBaseFeeStats = await mainnetScanner.stats.getBlockBaseFeeStats(statsParams, true);
    console.log("---\ngetBlockBaseFeeStats (raw)\n", inspect(rawBlockBaseFeeStats));

    // Get block gas used statistics
    const blockGasUsedStats = await mainnetScanner.stats.getBlockGasUsedStats(statsParams);
    console.log("---\ngetBlockGasUsedStats (formatted)\n", inspect(blockGasUsedStats));

    const rawBlockGasUsedStats = await mainnetScanner.stats.getBlockGasUsedStats(statsParams, true);
    console.log("---\ngetBlockGasUsedStats (raw)\n", inspect(rawBlockGasUsedStats));

    // Get block average priority fee statistics
    const blockAvgPriorityFeeStats =
      await mainnetScanner.stats.getBlockAvgPriorityFeeStats(statsParams);
    console.log(
      "---\ngetBlockAvgPriorityFeeStats (formatted)\n",
      inspect(blockAvgPriorityFeeStats)
    );

    const rawBlockAvgPriorityFeeStats = await mainnetScanner.stats.getBlockAvgPriorityFeeStats(
      statsParams,
      true
    );
    console.log("---\ngetBlockAvgPriorityFeeStats (raw)\n", inspect(rawBlockAvgPriorityFeeStats));

    // Get block transactions by type statistics
    const blockTxsByTypeStats = await mainnetScanner.stats.getBlockTxsByTypeStats(statsParams);
    console.log("---\ngetBlockTxsByTypeStats (formatted)\n", inspect(blockTxsByTypeStats));

    const rawBlockTxsByTypeStats = await mainnetScanner.stats.getBlockTxsByTypeStats(
      statsParams,
      true
    );
    console.log("---\ngetBlockTxsByTypeStats (raw)\n", inspect(rawBlockTxsByTypeStats));

    // Testnet Example Demonstration
    console.log("\n=== Testnet Example ===");
    // Get testnet block statistics
    const testnetBlockStats = await testnetScanner.stats.getBlockBaseFeeStats(statsParams);
    console.log("---\ngetBlockBaseFeeStats (testnet) (formatted)\n", inspect(testnetBlockStats));

    const rawTestnetBlockStats = await testnetScanner.stats.getBlockBaseFeeStats(statsParams, true);
    console.log("---\ngetBlockBaseFeeStats (testnet) (raw)\n", inspect(rawTestnetBlockStats));

    // API Key Example Demonstration
    if (process.env.API_KEY) {
      console.log("\n=== API Key Example ===");
      const apiKeyBlockStats = await _scannerWithApiKey.stats.getBlockBaseFeeStats(statsParams);
      console.log(
        "---\ngetBlockBaseFeeStats (with API Key) (formatted)\n",
        inspect(apiKeyBlockStats)
      );

      const rawApiKeyBlockStats = await _scannerWithApiKey.stats.getBlockBaseFeeStats(
        statsParams,
        true
      );
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
    await scanner.contract.getContractABI("0xinvalid");
  } catch (error) {
    console.error(
      "Expected error for invalid address:",
      error instanceof Error ? error.message : String(error)
    );
  }

  try {
    console.log("\nTesting non-existent contract handling...");
    await scanner.contract.getContractABI("0x0000000000000000000000000000000000000000");
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
