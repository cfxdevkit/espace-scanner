import { DeprecatedWrapper } from "../../src";
import {
  TEST_ADDRESSES,
  PAGINATION,
  inspect,
  demonstrationWrapper,
  MODULE_OPTIONS,
} from "../common/utils";

/**
 * Demonstrates all methods available in the Deprecated module
 */
async function demonstrateDeprecatedWrapper() {
  // Initialize scanner for mainnet
  const deprecated = new DeprecatedWrapper(MODULE_OPTIONS.MAINNET);

  try {
    console.log("=== Deprecated Wrapper Demonstration ===");

    // Get account transactions (deprecated)
    console.log("\nTesting AccountTransactions...");
    const transactions = await deprecated.AccountTransactions({
      account: TEST_ADDRESSES.ACCOUNT.SINGLE,
      skip: PAGINATION.DEFAULT.skip,
      limit: PAGINATION.DEFAULT.limit,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("Account transactions result:", inspect(transactions));

    // Get CFX transfers (deprecated)
    console.log("\nTesting CfxTransfers...");
    const cfxTransfers = await deprecated.CfxTransfers({
      account: TEST_ADDRESSES.ACCOUNT.SINGLE,
      skip: PAGINATION.DEFAULT.skip,
      limit: PAGINATION.DEFAULT.limit,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("CFX transfers result:", inspect(cfxTransfers));

    // Get ERC20 transfers (deprecated)
    console.log("\nTesting Erc20Transfers...");
    const erc20Transfers = await deprecated.Erc20Transfers({
      account: TEST_ADDRESSES.ACCOUNT.SINGLE,
      skip: PAGINATION.DEFAULT.skip,
      limit: PAGINATION.DEFAULT.limit,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("ERC20 transfers result:", inspect(erc20Transfers));

    // Get ERC721 transfers (deprecated)
    console.log("\nTesting Erc721Transfers...");
    const erc721Transfers = await deprecated.Erc721Transfers({
      account: TEST_ADDRESSES.ACCOUNT.OWNER,
      skip: PAGINATION.DEFAULT.skip,
      limit: PAGINATION.DEFAULT.limit,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("ERC721 transfers result:", inspect(erc721Transfers));

    // Get ERC1155 transfers (deprecated)
    console.log("\nTesting Erc1155Transfers...");
    const erc1155Transfers = await deprecated.Erc1155Transfers({
      account: TEST_ADDRESSES.ACCOUNT.SINGLE,
      skip: PAGINATION.DEFAULT.skip,
      limit: PAGINATION.DEFAULT.limit,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("ERC1155 transfers result:", inspect(erc1155Transfers));

    // Get ERC3525 transfers (deprecated)
    console.log("\nTesting Erc3525Transfers...");
    const erc3525Transfers = await deprecated.Erc3525Transfers({
      account: TEST_ADDRESSES.ACCOUNT.SINGLE,
      skip: PAGINATION.DEFAULT.skip,
      limit: PAGINATION.DEFAULT.limit,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("ERC3525 transfers result:", inspect(erc3525Transfers));

    // Get account transfers (deprecated)
    console.log("\nTesting AccountTransfers...");
    const accountTransfers = await deprecated.AccountTransfers({
      account: TEST_ADDRESSES.ACCOUNT.SINGLE,
      skip: PAGINATION.DEFAULT.skip,
      limit: PAGINATION.DEFAULT.limit,
      sort: PAGINATION.DEFAULT.sort,
    });
    console.log("Account transfers result:", inspect(accountTransfers));

    // Get account approvals (deprecated)
    console.log("\nTesting AccountApprovals...");
    const accountApprovals = await deprecated.AccountApprovals({
      account: TEST_ADDRESSES.ACCOUNT.SINGLE,
      tokenType: "ERC20",
    });
    console.log("Account approvals result:", inspect(accountApprovals));

    // Get account tokens (deprecated)
    console.log("\nTesting AccountTokens...");
    const accountTokens = await deprecated.AccountTokens({
      account: TEST_ADDRESSES.ACCOUNT.SINGLE,
      tokenType: "ERC20,ERC721,ERC1155",
    });
    console.log("Account tokens result:", inspect(accountTokens));

    // Get token info (deprecated)
    console.log("\nTesting TokenTokeninfos...");
    const tokenInfos = await deprecated.TokenTokeninfos({
      contracts: TEST_ADDRESSES.CONTRACT.TOKEN,
    });
    console.log("Token info result:", inspect(tokenInfos));
  } catch (error) {
    console.error(
      "Error during Deprecated module demonstration:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// Run the demonstration if this file is executed directly
if (require.main === module) {
  demonstrationWrapper("Deprecated module", demonstrateDeprecatedWrapper);
}
