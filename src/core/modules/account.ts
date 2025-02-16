/**
 * @packageDocumentation
 * Account module for interacting with account-related functionality on Conflux eSpace.
 * Provides functionality for querying account balances, transactions, and other account-related data.
 * @module core/modules/account
 */

import { ESpaceApi } from "../api";
import { AddressValidator } from "../../utils";
import { createLogger } from "../../utils/logger";
import { ApiConfig, Account } from "../../types";

/**
 * Module for handling account-related operations on Conflux eSpace.
 * Provides methods for querying account balances, transactions, token transfers, and other account data.
 *
 * @class AccountModule
 * @extends {ESpaceApi}
 */
export class AccountModule extends ESpaceApi {
  /** Logger instance for account operations */
  protected logger = createLogger("AccountModule");

  /**
   * Creates an instance of AccountModule.
   * @param {ApiConfig} config - Configuration object for the account module
   */
  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get CFX balance for a single address.
   * Retrieves the current CFX balance for a specific address.
   *
   * @param {Account.BalanceParams} params - Parameters for the balance query
   * @param {string} params.address - Address to check the balance for
   * @param {string} [params.tag] - Block tag (e.g., 'latest')
   * @returns {Promise<Account.Balance>} The account balance
   * @throws {Error} If the address is invalid
   */
  async getBalance(params: Account.BalanceParams): Promise<Account.Balance> {
    this.logger.debug({ params }, "Getting account balance");
    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for balance check");
      throw new Error(`Invalid address: ${params.address}`);
    }
    const response = await this.fetchApi<Account.Balance>("/api", {
      module: "account",
      action: "balance",
      address: params.address,
      tag: params.tag,
    });
    return response.result;
  }

  /**
   * Get CFX balance for multiple addresses in a single call.
   * Retrieves current CFX balances for multiple addresses efficiently.
   *
   * @param {Account.BalanceMultiParams} params - Parameters for the multi-balance query
   * @param {string[]} params.address - Array of addresses to check balances for
   * @param {string} [params.tag] - Block tag (e.g., 'latest')
   * @returns {Promise<Account.BalanceMulti>} The account balances
   * @throws {Error} If any of the addresses are invalid
   */
  async getBalanceMulti(params: Account.BalanceMultiParams): Promise<Account.BalanceMulti> {
    this.logger.debug({ params }, "Getting multiple account balances");
    if (!AddressValidator.validateAddresses(params.address)) {
      this.logger.error({ params }, "Invalid addresses provided for balance check");
      throw new Error(`Invalid addresses provided`);
    }
    const response = await this.fetchApi<Account.BalanceMulti>("/api", {
      module: "account",
      action: "balancemulti",
      address: params.address.join(","),
      tag: params.tag,
    });
    return response.result;
  }

  /**
   * Get a list of normal transactions by address.
   * Retrieves all normal (non-internal) transactions for a specific address.
   *
   * @param {Account.TxlistParams} params - Parameters for the transaction list query
   * @param {string} params.address - Address to get transactions for
   * @param {number} [params.startblock] - Starting block number
   * @param {number} [params.endblock] - Ending block number
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.offset] - Number of records per page
   * @param {string} [params.sort] - Sort direction ('asc' or 'desc')
   * @returns {Promise<Account.Txlist[]>} List of transactions
   * @throws {Error} If the address is invalid
   */
  async getTransactionList(params: Account.TxlistParams): Promise<Account.Txlist[]> {
    this.logger.debug({ params }, "Getting transaction list");
    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for transaction list");
      throw new Error(`Invalid address: ${params.address}`);
    }
    return (
      await this.fetchApi<Account.Txlist[]>("/api", {
        module: "account",
        action: "txlist",
        address: params.address,
        startblock: params.startblock,
        endblock: params.endblock,
        page: params.page,
        offset: params.offset,
        sort: params.sort,
      })
    ).result;
  }

  /**
   * Get a list of internal transactions.
   * Retrieves all internal transactions (contract-to-contract transfers) for a specific address.
   *
   * @param {Account.TxlistinternalParams} params - Parameters for the internal transaction list query
   * @param {string} params.address - Address to get internal transactions for
   * @param {number} [params.startblock] - Starting block number
   * @param {number} [params.endblock] - Ending block number
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.offset] - Number of records per page
   * @param {string} [params.sort] - Sort direction ('asc' or 'desc')
   * @returns {Promise<Account.Txlistinternal[]>} List of internal transactions
   * @throws {Error} If the address is invalid
   */
  async getInternalTransactionList(
    params: Account.TxlistinternalParams
  ): Promise<Account.Txlistinternal[]> {
    this.logger.debug({ params }, "Getting internal transaction list");
    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for internal transaction list");
      throw new Error(`Invalid address: ${params.address}`);
    }
    return (
      await this.fetchApi<Account.Txlistinternal[]>("/api", {
        module: "account",
        action: "txlistinternal",
        address: params.address,
        startblock: params.startblock,
        endblock: params.endblock,
        page: params.page,
        offset: params.offset,
        sort: params.sort,
      })
    ).result;
  }

  /**
   * Get a list of token transfers.
   * Retrieves all token transfer events for a specific address or contract.
   *
   * @param {Account.TokentxParams} params - Parameters for the token transfer list query
   * @param {string} params.address - Address to get token transfers for
   * @param {string} [params.contractaddress] - Filter transfers by token contract address
   * @param {number} [params.startblock] - Starting block number
   * @param {number} [params.endblock] - Ending block number
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.offset] - Number of records per page
   * @param {string} [params.sort] - Sort direction ('asc' or 'desc')
   * @returns {Promise<Account.Tokentx[]>} List of token transfers
   * @throws {Error} If the address or contract address is invalid
   */
  async getTokenTransfers(params: Account.TokentxParams): Promise<Account.Tokentx[]> {
    this.logger.debug({ params }, "Getting token transfer list");

    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for token transfer list");
      throw new Error(`Invalid address: ${params.address}`);
    }

    if (params.contractaddress && !AddressValidator.validateAddress(params.contractaddress)) {
      this.logger.error({ params }, "Invalid contract address provided for token transfer list");
      throw new Error(`Invalid contract address: ${params.contractaddress}`);
    }

    return (
      await this.fetchApi<Account.Tokentx[]>("/api", {
        module: "account",
        action: "tokentx",
        ...(params.address && { address: params.address }),
        ...(params.contractaddress && { contractaddress: params.contractaddress }),
        ...(params.startblock !== undefined && { startblock: params.startblock }),
        ...(params.endblock !== undefined && { endblock: params.endblock }),
        page: params.page,
        offset: params.offset,
        sort: params.sort,
      })
    ).result;
  }

  /**
   * Get a list of NFT token transfers.
   * Retrieves all NFT transfer events for a specific address or contract.
   *
   * @param {Account.TokenNFTtxParams} params - Parameters for the NFT transfer list query
   * @param {string} params.address - Address to get NFT transfers for
   * @param {string} [params.contractaddress] - Filter transfers by NFT contract address
   * @param {number} [params.startblock] - Starting block number
   * @param {number} [params.endblock] - Ending block number
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.offset] - Number of records per page
   * @param {string} [params.sort] - Sort direction ('asc' or 'desc')
   * @returns {Promise<Account.TokenNFTtx[]>} List of NFT transfers
   * @throws {Error} If the address or contract address is invalid
   */
  async getNFTTransfers(params: Account.TokenNFTtxParams): Promise<Account.TokenNFTtx[]> {
    this.logger.debug({ params }, "Getting NFT transfer list");

    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for NFT transfer list");
      throw new Error(`Invalid address: ${params.address}`);
    }

    if (params.contractaddress && !AddressValidator.validateAddress(params.contractaddress)) {
      this.logger.error({ params }, "Invalid contract address provided for NFT transfer list");
      throw new Error(`Invalid contract address: ${params.contractaddress}`);
    }

    return (
      await this.fetchApi<Account.TokenNFTtx[]>("/api", {
        module: "account",
        action: "tokennfttx",
        ...(params.address && { address: params.address }),
        ...(params.contractaddress && { contractaddress: params.contractaddress }),
        ...(params.startblock !== undefined && { startblock: params.startblock }),
        ...(params.endblock !== undefined && { endblock: params.endblock }),
        page: params.page,
        offset: params.offset,
        sort: params.sort,
      })
    ).result;
  }

  /**
   * Get a list of blocks mined by an address.
   * Retrieves all blocks that were mined by a specific address.
   *
   * @param {Account.GetminedblocksParams} params - Parameters for the mined blocks query
   * @param {string} params.address - Address to get mined blocks for
   * @param {string} [params.blocktype] - Type of blocks to retrieve
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.offset] - Number of records per page
   * @returns {Promise<Account.Getminedblocks[]>} List of mined blocks
   * @throws {Error} If the address is invalid
   */
  async getMinedBlocks(params: Account.GetminedblocksParams): Promise<Account.Getminedblocks[]> {
    this.logger.debug({ params }, "Getting mined blocks");

    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for mined blocks");
      throw new Error(`Invalid address: ${params.address}`);
    }

    return (
      await this.fetchApi<Account.Getminedblocks[]>("/api", {
        module: "account",
        action: "getminedblocks",
        ...(params.address && { address: params.address }),
        ...(params.blocktype !== undefined && { blocktype: params.blocktype }),
        page: params.page,
        offset: params.offset,
      })
    ).result;
  }

  /**
   * Get balance history for an address.
   * Retrieves the historical balance of an address at a specific block number.
   *
   * @param {Account.BalancehistoryParams} params - Parameters for the balance history query
   * @param {string} params.address - Address to get balance history for
   * @param {number} params.blockno - Block number to get balance at
   * @returns {Promise<Account.Balancehistory>} Historical balance information
   * @throws {Error} If the address is invalid
   */
  async getBalanceHistory(params: Account.BalancehistoryParams): Promise<Account.Balancehistory> {
    this.logger.debug({ params }, "Getting balance history");

    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for balance history");
      throw new Error(`Invalid address: ${params.address}`);
    }
    const data = await this.fetchApi<Account.Balancehistory>("/api", {
      module: "account",
      action: "balancehistory",
      ...(params.address && { address: params.address }),
      ...(params.blockno !== undefined && { blockno: params.blockno }),
    });
    return data.result;
  }
}
