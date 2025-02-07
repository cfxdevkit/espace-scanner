import { ESpaceScannerWrapper } from "../src";
import util from "util";
import {
  ContractABIResponse,
  ContractSourceResponse,
  TokenListResponse,
  ESpaceStatsResponse,
  ESpaceTopStatsResponse,
} from "../src/types";

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
  const scannerWithApiKey = new ESpaceScannerWrapper({
    target: "mainnet",
    apiKey: process.env.API_KEY,
  });

  try {
    console.log("=== Contract Methods ===");
    // Example contract address
    const contractAddress = "0x704a2822d59cf4350fd3bbc4957bba48469770cc";
    const tokenAddress = "0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b";

    const contractABI = await mainnetScanner.getContractABI(contractAddress);
    console.log("Contract ABI:");
    console.log("Formatted:", contractABI.formatted);
    console.log("Raw:", inspect<ContractABIResponse>(contractABI.raw));

    const contractSource = await mainnetScanner.getContractSourceCode(contractAddress);
    console.log("\nContract Source:");
    console.log("Formatted:", contractSource.formatted);
    console.log("Raw:", inspect<ContractSourceResponse>(contractSource.raw));

    console.log("\n=== Token Methods ===");
    // Example wallet address
    const walletAddress = "0xe796f076084eEF751968Cf13838AC0b0cB60ADaa";

    const erc20Tokens = await mainnetScanner.getAccountTokens(walletAddress, "ERC20");
    console.log("\nERC20 Tokens:");
    console.log("Formatted:", erc20Tokens.formatted);
    console.log("Raw:", inspect<TokenListResponse>(erc20Tokens.raw));

    const erc721Tokens = await mainnetScanner.getAccountTokens(walletAddress, "ERC721");
    console.log("\nERC721 Tokens:");
    console.log("Formatted:", erc721Tokens.formatted);
    console.log("Raw:", inspect<TokenListResponse>(erc721Tokens.raw));

    console.log("\n=== Basic Statistics Methods ===");
    const statsParams = {
      minTimestamp: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // 7 days ago
      maxTimestamp: Math.floor(Date.now() / 1000),
      limit: 5,
    };

    const activeAccounts = await mainnetScanner.getActiveAccountStats(statsParams);
    console.log("\nActive Accounts:");
    console.log("Formatted:", activeAccounts.formatted);
    console.log("Raw:", inspect<ESpaceStatsResponse>(activeAccounts.raw));

    const cfxHolders = await mainnetScanner.getCfxHolderStats(statsParams);
    console.log("\nCFX Holders:");
    console.log("Formatted:", cfxHolders.formatted);
    console.log("Raw:", inspect<ESpaceStatsResponse>(cfxHolders.raw));

    const accountGrowth = await mainnetScanner.getAccountGrowthStats(statsParams);
    console.log("\nAccount Growth:");
    console.log("Formatted:", accountGrowth.formatted);
    console.log("Raw:", inspect<ESpaceStatsResponse>(accountGrowth.raw));

    const tpsStats = await mainnetScanner.getTpsStats({ ...statsParams, intervalType: "hour" });
    console.log("\nTPS Stats:");
    console.log("Formatted:", tpsStats.formatted);
    console.log("Raw:", inspect<ESpaceStatsResponse>(tpsStats.raw));

    console.log("\n=== Top Statistics Methods ===");
    const topGasUsed = await mainnetScanner.getTopGasUsed("24h");
    console.log("\nTop Gas Used:");
    console.log("Formatted:", topGasUsed.formatted);
    console.log("Raw:", inspect<ESpaceTopStatsResponse>(topGasUsed.raw));

    const topTxSenders = await mainnetScanner.getTopTransactionSenders("24h");
    console.log("\nTop Transaction Senders:");
    console.log("Formatted:", topTxSenders.formatted);
    console.log("Raw:", inspect<ESpaceTopStatsResponse>(topTxSenders.raw));

    console.log("\n=== Token Statistics Methods ===");
    const tokenHolderStats = await mainnetScanner.getTokenHolderStats(tokenAddress);
    console.log("\nToken Holder Stats:");
    console.log("Formatted:", tokenHolderStats.formatted);
    console.log("Raw:", inspect<ESpaceStatsResponse>(tokenHolderStats.raw));

    const tokenUniqueSenderStats = await mainnetScanner.getTokenUniqueSenderStats(tokenAddress);
    console.log("\nToken Unique Sender Stats:");
    console.log("Formatted:", tokenUniqueSenderStats.formatted);
    console.log("Raw:", inspect<ESpaceStatsResponse>(tokenUniqueSenderStats.raw));

    console.log("\n=== Block Statistics Methods ===");
    const blockBaseFeeStats = await mainnetScanner.getBlockBaseFeeStats(statsParams);
    console.log("\nBlock Base Fee Stats:");
    console.log("Formatted:", blockBaseFeeStats.formatted);
    console.log("Raw:", inspect<ESpaceStatsResponse>(blockBaseFeeStats.raw));

    const blockGasUsedStats = await mainnetScanner.getBlockGasUsedStats(statsParams);
    console.log("\nBlock Gas Used Stats:");
    console.log("Formatted:", blockGasUsedStats.formatted);
    console.log("Raw:", inspect<ESpaceStatsResponse>(blockGasUsedStats.raw));

    // Example with testnet
    console.log("\n=== Testnet Example ===");
    const testnetBlockStats = await testnetScanner.getBlockBaseFeeStats(statsParams);
    console.log("\nTestnet Block Base Fee Stats:");
    console.log("Formatted:", testnetBlockStats.formatted);
    console.log("Raw:", inspect<ESpaceStatsResponse>(testnetBlockStats.raw));

    // Example with API key
    if (process.env.API_KEY) {
      console.log("\n=== API Key Example ===");
      const apiKeyBlockStats = await scannerWithApiKey.getBlockBaseFeeStats(statsParams);
      console.log("\nBlock Base Fee Stats with API Key:");
      console.log("Formatted:", apiKeyBlockStats.formatted);
      console.log("Raw:", inspect<ESpaceStatsResponse>(apiKeyBlockStats.raw));
    }
  } catch (error) {
    console.error("Error during demonstration:", error);
  }
}

// Example of error handling and address validation
async function demonstrateErrorHandling(): Promise<void> {
  const scanner = new ESpaceScannerWrapper({ target: "mainnet" });

  try {
    // Invalid address example
    await scanner.getContractABI("0xinvalid");
  } catch (error) {
    console.error("Expected error for invalid address:", error);
  }

  try {
    // Non-existent contract
    await scanner.getContractABI("0x0000000000000000000000000000000000000000");
  } catch (error) {
    console.error("Expected error for non-existent contract:", error);
  }
}

// Run the demonstrations
if (require.main === module) {
  Promise.all([demonstrateESpaceScannerWrapperUsage(), demonstrateErrorHandling()]).catch(
    console.error
  );
}
