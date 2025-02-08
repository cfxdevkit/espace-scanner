import { ESpaceScannerWrapper } from "../src";
import { createLogger } from "../src/utils/logger";

const logger = createLogger("Usage");

const _inspect = <T>(obj: T): string =>
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
    logger.info("=== Contract Methods ===");
    // Example contract address
    const contractAddress = "0x704a2822d59cf4350fd3bbc4957bba48469770cc";
    const tokenAddress = "0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b";

    const contractABI = await mainnetScanner.getContractABI(contractAddress);
    logger.info("Contract ABI:");
    logger.info({ formatted: contractABI.formatted }, "Formatted ABI");
    logger.debug({ raw: contractABI.raw }, "Raw ABI");

    const contractSource = await mainnetScanner.getContractSourceCode(contractAddress);
    logger.info("\nContract Source:");
    logger.info({ formatted: contractSource.formatted }, "Formatted Source");
    logger.debug({ raw: contractSource.raw }, "Raw Source");

    logger.info("\n=== Token Methods ===");
    // Example wallet address
    const walletAddress = "0xe796f076084eEF751968Cf13838AC0b0cB60ADaa";

    const erc20Tokens = await mainnetScanner.getAccountTokens(walletAddress, "ERC20");
    logger.info("\nERC20 Tokens:");
    logger.info({ formatted: erc20Tokens.formatted }, "Formatted ERC20 Tokens");
    logger.debug({ raw: erc20Tokens.raw }, "Raw ERC20 Tokens");

    const erc721Tokens = await mainnetScanner.getAccountTokens(walletAddress, "ERC721");
    logger.info("\nERC721 Tokens:");
    logger.info({ formatted: erc721Tokens.formatted }, "Formatted ERC721 Tokens");
    logger.debug({ raw: erc721Tokens.raw }, "Raw ERC721 Tokens");

    logger.info("\n=== Basic Statistics Methods ===");
    const statsParams = {
      minTimestamp: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // 7 days ago
      maxTimestamp: Math.floor(Date.now() / 1000),
      limit: 5,
    };

    const activeAccounts = await mainnetScanner.getActiveAccountStats(statsParams);
    logger.info("\nActive Accounts:");
    logger.info({ formatted: activeAccounts.formatted }, "Formatted Active Accounts");
    logger.debug({ raw: activeAccounts.raw }, "Raw Active Accounts");

    const cfxHolders = await mainnetScanner.getCfxHolderStats(statsParams);
    logger.info("\nCFX Holders:");
    logger.info({ formatted: cfxHolders.formatted }, "Formatted CFX Holders");
    logger.debug({ raw: cfxHolders.raw }, "Raw CFX Holders");

    const accountGrowth = await mainnetScanner.getAccountGrowthStats(statsParams);
    logger.info("\nAccount Growth:");
    logger.info({ formatted: accountGrowth.formatted }, "Formatted Account Growth");
    logger.debug({ raw: accountGrowth.raw }, "Raw Account Growth");

    const tpsStats = await mainnetScanner.getTpsStats({ ...statsParams, intervalType: "hour" });
    logger.info("\nTPS Stats:");
    logger.info({ formatted: tpsStats.formatted }, "Formatted TPS Stats");
    logger.debug({ raw: tpsStats.raw }, "Raw TPS Stats");

    logger.info("\n=== Top Statistics Methods ===");
    const topGasUsed = await mainnetScanner.getTopGasUsed("24h");
    logger.info("\nTop Gas Used:");
    logger.info({ formatted: topGasUsed.formatted }, "Formatted Top Gas Used");
    logger.debug({ raw: topGasUsed.raw }, "Raw Top Gas Used");

    const topTxSenders = await mainnetScanner.getTopTransactionSenders("24h");
    logger.info("\nTop Transaction Senders:");
    logger.info({ formatted: topTxSenders.formatted }, "Formatted Top Transaction Senders");
    logger.debug({ raw: topTxSenders.raw }, "Raw Top Transaction Senders");

    logger.info("\n=== Token Statistics Methods ===");
    const tokenHolderStats = await mainnetScanner.getTokenHolderStats(tokenAddress);
    logger.info("\nToken Holder Stats:");
    logger.info({ formatted: tokenHolderStats.formatted }, "Formatted Token Holder Stats");
    logger.debug({ raw: tokenHolderStats.raw }, "Raw Token Holder Stats");

    const tokenUniqueSenderStats = await mainnetScanner.getTokenUniqueSenderStats(tokenAddress);
    logger.info("\nToken Unique Sender Stats:");
    logger.info(
      { formatted: tokenUniqueSenderStats.formatted },
      "Formatted Token Unique Sender Stats"
    );
    logger.debug({ raw: tokenUniqueSenderStats.raw }, "Raw Token Unique Sender Stats");

    logger.info("\n=== Block Statistics Methods ===");
    const blockBaseFeeStats = await mainnetScanner.getBlockBaseFeeStats(statsParams);
    logger.info("\nBlock Base Fee Stats:");
    logger.info({ formatted: blockBaseFeeStats.formatted }, "Formatted Block Base Fee Stats");
    logger.debug({ raw: blockBaseFeeStats.raw }, "Raw Block Base Fee Stats");

    const blockGasUsedStats = await mainnetScanner.getBlockGasUsedStats(statsParams);
    logger.info("\nBlock Gas Used Stats:");
    logger.info({ formatted: blockGasUsedStats.formatted }, "Formatted Block Gas Used Stats");
    logger.debug({ raw: blockGasUsedStats.raw }, "Raw Block Gas Used Stats");

    // Example with testnet
    logger.info("\n=== Testnet Example ===");
    const testnetBlockStats = await testnetScanner.getBlockBaseFeeStats(statsParams);
    logger.info("\nTestnet Block Base Fee Stats:");
    logger.info(
      { formatted: testnetBlockStats.formatted },
      "Formatted Testnet Block Base Fee Stats"
    );
    logger.debug({ raw: testnetBlockStats.raw }, "Raw Testnet Block Base Fee Stats");

    // Example with API key
    if (process.env.API_KEY) {
      logger.info("\n=== API Key Example ===");
      const apiKeyBlockStats = await scannerWithApiKey.getBlockBaseFeeStats(statsParams);
      logger.info("\nBlock Base Fee Stats with API Key:");
      logger.info(
        { formatted: apiKeyBlockStats.formatted },
        "Formatted Block Base Fee Stats with API Key"
      );
      logger.debug({ raw: apiKeyBlockStats.raw }, "Raw Block Base Fee Stats with API Key");
    }
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Error during demonstration"
    );
  }
}

// Example of error handling and address validation
async function demonstrateErrorHandling(): Promise<void> {
  const scanner = new ESpaceScannerWrapper({ target: "mainnet" });

  try {
    // Invalid address example
    logger.info("Testing invalid address handling...");
    await scanner.getContractABI("0xinvalid");
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Expected error for invalid address"
    );
  }

  try {
    // Non-existent contract
    logger.info("Testing non-existent contract handling...");
    await scanner.getContractABI("0x0000000000000000000000000000000000000000");
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Expected error for non-existent contract"
    );
  }
}

// Run the demonstrations
if (require.main === module) {
  logger.info("Starting demonstrations...");
  Promise.all([demonstrateESpaceScannerWrapperUsage(), demonstrateErrorHandling()]).catch((error) =>
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Error running demonstrations"
    )
  );
}
