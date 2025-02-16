import util from "util";
import { DateFormatter } from "../../src";
import { BlockModule } from "../../src";

const blockModule = new BlockModule({ target: "mainnet" });

/**
 * Get the current block number
 */
export const getCurrentBlockNumber = async (): Promise<number> => {
  return Number(
    await blockModule.getBlockNumberByTime({
      timestamp: DateFormatter.getCurrentTimestamp(),
    })
  );
};

/**
 * Common test addresses used across examples
 */
export const TEST_ADDRESSES = {
  // Account addresses
  ACCOUNT: {
    SINGLE: "0xe796f076084eEF751968Cf13838AC0b0cB60ADaa",
    OWNER: "0xd6ea4592570e943792db603d6a51911fed9df0c2",
    MULTI: [
      "0xe796f076084eEF751968Cf13838AC0b0cB60ADaa",
      "0x704a2822d59cf4350fd3bbc4957bba48469770cc",
    ],
  },
  // Contract addresses
  CONTRACT: {
    TOKEN: "0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b",
    NFT: "0x1988d0927157a6288bc4cbdf4945677265532ae3",
    VERIFIED: "0x704a2822d59cf4350fd3bbc4957bba48469770cc",
  },
  // Example transaction hash
  TRANSACTION: {
    HASH: "0x417eb15ee14c11e0085135d4f676e8f7a6bc8ff58ec4a13831ab09ef52c07f3c",
  },
};

/**
 * Common test data used across examples
 */
export const TEST_DATA = {
  // NFT related test data
  NFT: {
    TOKEN_ID: "2",
    NAME: "CDW",
  },
  // Method related test data
  METHOD: {
    HASH: "0xa9059cbb", // transfer method hash
    INPUT_DATA:
      "0xa9059cbb000000000000000000000000e796f076084eef751968cf13838ac0b0cb60adaa0000000000000000000000000000000000000000000000000de0b6b3a7640000",
  },
  // Block related test data
  BLOCK: {
    START: 74180740,
    END: 74180760,
    HISTORY: 116288160,
  },
};

/**
 * Common time-based parameters used in statistics
 */
export const getTimeParams = (days = 7, limit = 5) => ({
  minTimestamp: DateFormatter.getTimeAgo(days),
  maxTimestamp: DateFormatter.getCurrentTimestamp(),
  limit,
});

/**
 * Common pagination parameters
 */
export const PAGINATION = {
  DEFAULT: {
    skip: 0,
    limit: 5,
    page: 1,
    offset: 5,
    sort: "desc",
  },
};

/**
 * Common block range parameters for queries
 */
export const BLOCK_RANGE = {
  DEFAULT: {
    startblock: 0,
    endblock: 99999999,
  },
};

/**
 * Helper function to format objects for console output
 */
export const inspect = <T>(obj: T): string =>
  util.inspect(obj, {
    depth: 4,
    colors: false,
    maxArrayLength: 2,
  });

/**
 * Common error handler for demonstration functions
 */
export const handleError = (context: string, error: unknown): void => {
  console.error(`Error during ${context}:`, error instanceof Error ? error.message : String(error));
};

/**
 * Wrapper for demonstration functions to provide consistent error handling and logging
 */
export const demonstrationWrapper = async (
  name: string,
  demoFn: () => Promise<void>
): Promise<void> => {
  console.log(`Starting ${name} demonstration...`);
  try {
    await demoFn();
    console.log(`\n${name} demonstration completed.`);
  } catch (error) {
    console.error(
      `Fatal error during ${name} demonstration:`,
      error instanceof Error ? error.message : String(error)
    );
  }
};

/**
 * Common module initialization options
 */
export const MODULE_OPTIONS = {
  MAINNET: { target: "mainnet" as const },
};
