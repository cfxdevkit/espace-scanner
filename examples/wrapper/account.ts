import { AccountWrapper } from "../../src";
import {
  TEST_ADDRESSES,
  BLOCK_RANGE,
  PAGINATION,
  TEST_DATA,
  inspect,
  demonstrationWrapper,
  MODULE_OPTIONS,
  getCurrentBlockNumber,
} from "../common/utils";

/**
 * Demonstrates all methods available in the Account wrapper module
 */
async function demonstrateAccountWrapper() {
  // Initialize wrapper for mainnet
  const account = new AccountWrapper(MODULE_OPTIONS.MAINNET);

  try {
    console.log("=== Account Wrapper Module Demonstration ===");

    // Get single account balance with formatting
    console.log("\nTesting getBalance with formatting...");
    const balanceFormatted = await account.getBalance({
      address: TEST_ADDRESSES.ACCOUNT.SINGLE,
      tag: "latest_state",
    });
    console.log("Balance (formatted) result:", inspect(balanceFormatted));

    // Get multiple account balances with formatting
    console.log("\nTesting getBalanceMulti with formatting...");
    const multiBalanceFormatted = await account.getBalanceMulti({
      address: TEST_ADDRESSES.ACCOUNT.MULTI,
      tag: "latest_state",
    });
    console.log("Multi-balance (formatted) result:", inspect(multiBalanceFormatted));

    // Get transaction list with formatting
    console.log("\nTesting getTransactionList with formatting...");
    const txListFormatted = await account.getTransactionList({
      address: TEST_ADDRESSES.ACCOUNT.SINGLE,
      ...BLOCK_RANGE.DEFAULT,
      page: PAGINATION.DEFAULT.page,
      offset: PAGINATION.DEFAULT.offset,
    });
    console.log("Transaction list (formatted) result:", inspect(txListFormatted));

    // Get internal transaction list with formatting
    console.log("\nTesting getInternalTransactionList with formatting...");
    const internalTxListFormatted = await account.getInternalTransactionList({
      address: TEST_ADDRESSES.ACCOUNT.SINGLE,
      ...BLOCK_RANGE.DEFAULT,
      page: PAGINATION.DEFAULT.page,
      offset: PAGINATION.DEFAULT.offset,
    });
    console.log("Internal transaction list (formatted) result:", inspect(internalTxListFormatted));

    // Get balance history with formatting
    console.log("\nTesting getBalanceHistory with formatting...");
    const currentBlock = await getCurrentBlockNumber();
    const balanceHistoryFormatted = await account.getBalanceHistory({
      address: TEST_ADDRESSES.ACCOUNT.SINGLE,
      blockno: currentBlock,
    });
    console.log("Balance history (formatted) result:", inspect(balanceHistoryFormatted));
  } catch (error) {
    console.error(
      "Error during Account wrapper module demonstration:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// Run the demonstration if this file is executed directly
if (require.main === module) {
  demonstrationWrapper("Account wrapper module", demonstrateAccountWrapper);
}
