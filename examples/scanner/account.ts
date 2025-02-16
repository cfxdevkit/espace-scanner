import { AccountModule } from "../../src";
import {
  TEST_ADDRESSES,
  TEST_DATA,
  BLOCK_RANGE,
  PAGINATION,
  inspect,
  demonstrationWrapper,
  MODULE_OPTIONS,
  getCurrentBlockNumber,
} from "../common/utils";

/**
 * Demonstrates all methods available in the Account module
 */
async function demonstrateAccountModule() {
  // Initialize scanner for mainnet
  const account = new AccountModule(MODULE_OPTIONS.MAINNET);

  try {
    console.log("=== Account Module Demonstration ===");

    // Get single account balance
    console.log("\nTesting getBalance...");
    const balance = await account.getBalance({
      address: TEST_ADDRESSES.ACCOUNT.OWNER,
      tag: "latest_state",
    });
    console.log("Balance result:", inspect(balance));

    // Get multiple account balances
    console.log("\nTesting getBalanceMulti...");
    const multiBalance = await account.getBalanceMulti({
      address: TEST_ADDRESSES.ACCOUNT.MULTI,
      tag: "latest_state",
    });
    console.log("Multi-balance result:", inspect(multiBalance));

    // Get transaction list
    console.log("\nTesting getTransactionList...");
    const txList = await account.getTransactionList({
      address: TEST_ADDRESSES.ACCOUNT.OWNER,
      ...BLOCK_RANGE.DEFAULT,
      page: PAGINATION.DEFAULT.page,
      offset: PAGINATION.DEFAULT.offset,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("Transaction list result:", inspect(txList));

    // Get internal transaction list
    console.log("\nTesting getInternalTransactionList...");
    const internalTxList = await account.getInternalTransactionList({
      address: TEST_ADDRESSES.ACCOUNT.OWNER,
      ...BLOCK_RANGE.DEFAULT,
      page: PAGINATION.DEFAULT.page,
      offset: PAGINATION.DEFAULT.offset,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("Internal transaction list result:", inspect(internalTxList));

    // Get token transfers
    console.log("\nTesting getTokenTransfers...");
    const tokenTransfers = await account.getTokenTransfers({
      address: TEST_ADDRESSES.ACCOUNT.OWNER,
      ...BLOCK_RANGE.DEFAULT,
      page: PAGINATION.DEFAULT.page,
      offset: PAGINATION.DEFAULT.offset,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("Token transfers result:", inspect(tokenTransfers));

    // Get NFT token transfers
    console.log("\nTesting getNFTTransfers...");
    const nftTransfers = await account.getNFTTransfers({
      address: TEST_ADDRESSES.ACCOUNT.OWNER,
      ...BLOCK_RANGE.DEFAULT,
      page: PAGINATION.DEFAULT.page,
      offset: PAGINATION.DEFAULT.offset,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("NFT transfers result:", inspect(nftTransfers));

    // Get mined blocks
    console.log("\nTesting getMinedBlocks...");
    const minedBlocks = await account.getMinedBlocks({
      address: TEST_ADDRESSES.ACCOUNT.OWNER,
      blocktype: "blocks",
      page: PAGINATION.DEFAULT.page,
      offset: PAGINATION.DEFAULT.offset,
    });
    console.log("Mined blocks result:", inspect(minedBlocks));

    // Get balance history
    console.log("\nTesting getBalanceHistory...");
    const currentBlock = await getCurrentBlockNumber();
    const balanceHistory = await account.getBalanceHistory({
      address: TEST_ADDRESSES.ACCOUNT.OWNER,
      blockno: currentBlock,
    });
    console.log("Balance history result:", inspect(balanceHistory));
  } catch (error) {
    console.error(
      "Error during Account module demonstration:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// Run the demonstration if this file is executed directly
if (require.main === module) {
  demonstrationWrapper("Account module", demonstrateAccountModule);
}
