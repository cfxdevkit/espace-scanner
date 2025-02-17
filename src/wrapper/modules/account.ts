/**
 * @packageDocumentation
 * Account-related wrapper module for the Conflux eSpace Scanner SDK.
 * Provides high-level methods for account operations with data formatting.
 * @module wrapper/modules/account
 * @category Wrappers
 */

import { BaseWrapper } from "../base";
import { Account, ApiConfig } from "../../types";
import { AccountModule } from "../../core/modules";

/**
 * Wrapper class for account-related operations.
 * Extends BaseWrapper to provide formatted data responses.
 *
 * @example
 * ```typescript
 * // Create a new account wrapper instance
 * const account = new AccountWrapper({ target: 'mainnet' });
 *
 * // Get account balance
 * const balance = await account.getBalance({
 *   address: '0x1234...',
 *   tag: 'latest_state'
 * });
 *
 * // Get multiple account balances
 * const balances = await account.getBalanceMulti({
 *   address: ['0x1234...', '0x5678...']
 * });
 * ```
 *
 * @public
 * @category Wrappers
 */
export class AccountWrapper extends BaseWrapper {
  /** Core account module instance */
  private account: AccountModule;

  /**
   * Creates a new AccountWrapper instance
   * @param config - API configuration options
   * @param config.target - Network target ('mainnet' or 'testnet')
   * @param config.apiKey - Optional API key for authentication
   * @param config.host - Optional custom API host URL
   */
  constructor(config: ApiConfig = { target: "mainnet" }) {
    super();
    this.account = new AccountModule(config);
  }

  /**
   * Get CFX balance for a single address.
   * Retrieves the current CFX balance for a specific address.
   *
   * @example
   * ```typescript
   * const balance = await account.getBalance({
   *   address: '0x1234...',
   *   tag: 'latest_state'
   * });
   * // Returns: '123.45 CFX'
   * ```
   *
   * @param params - Parameters for the balance query
   * @param params.address - Address to check the balance for
   * @param params.tag - Block tag (e.g., 'latest_state', 'latest_confirmed')
   * @param returnRaw - If true, returns the raw balance in Drip without formatting
   * @returns The account balance, formatted with CFX units unless returnRaw is true
   * @throws {Error} If the address is invalid
   */
  async getBalance(
    params: Account.BalanceParams = { address: "", tag: "latest_state" },
    returnRaw: boolean = false
  ): Promise<string> {
    const data = await this.account.getBalance(params);
    if (returnRaw) return data;
    return this.formatCFX(data);
  }

  /**
   * Get CFX balance for multiple addresses in a single call.
   * Retrieves current CFX balances for multiple addresses efficiently.
   *
   * @example
   * ```typescript
   * const balances = await account.getBalanceMulti({
   *   address: ['0x1234...', '0x5678...'],
   *   tag: 'latest_state'
   * });
   * // Returns: [['0x1234...', '123.45 CFX'], ['0x5678...', '67.89 CFX']]
   * ```
   *
   * @param params - Parameters for the multi-balance query
   * @param params.address - Array of addresses to check balances for
   * @param params.tag - Block tag (e.g., 'latest_state', 'latest_confirmed')
   * @param returnRaw - If true, returns the raw balances in Drip without formatting
   * @returns Array of [address, balance] pairs
   * @throws {Error} If any of the addresses are invalid
   */
  async getBalanceMulti(
    params: Account.BalanceMultiParams = { address: [""], tag: "latest_state" },
    returnRaw: boolean = false
  ): Promise<Account.BalanceMulti> {
    const data = await this.account.getBalanceMulti(params);
    if (returnRaw) return data;
    return data.map((item) => [item[0], this.formatCFX(item[1])]);
  }

  /**
   * Get a list of normal transactions by address.
   * Retrieves all normal (non-internal) transactions for a specific address.
   *
   * @example
   * ```typescript
   * const txs = await account.getTransactionList({
   *   address: '0x1234...',
   *   page: 1,
   *   offset: 10,
   *   sort: 'desc'
   * });
   * ```
   *
   * @param params - Parameters for the transaction list query
   * @param params.address - Address to get transactions for
   * @param params.startblock - Starting block number
   * @param params.endblock - Ending block number
   * @param params.page - Page number for pagination
   * @param params.offset - Number of records per page
   * @param params.sort - Sort direction ('asc' or 'desc')
   * @param returnRaw - If true, returns the raw transaction data without formatting
   * @returns List of transactions with formatted values
   * @throws {Error} If the address is invalid
   */
  async getTransactionList(
    params: Account.TxlistParams = { address: "" },
    returnRaw: boolean = false
  ): Promise<Account.Txlist[]> {
    const data = await this.account.getTransactionList(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
      value: tx.value ? this.formatCFX(tx.value) : tx.value,
      gas: tx.gas ? this.formatGas(tx.gas) : tx.gas,
      gasPrice: tx.gasPrice ? this.formatGas(tx.gasPrice) : tx.gasPrice,
      gasUsed: tx.gasUsed ? this.formatGas(tx.gasUsed) : tx.gasUsed,
      cumulativeGasUsed: tx.cumulativeGasUsed
        ? this.formatGas(tx.cumulativeGasUsed)
        : tx.cumulativeGasUsed,
    }));
  }

  /**
   * Get a list of internal transactions.
   * Retrieves all internal transactions (contract-to-contract transfers) for a specific address.
   *
   * @example
   * ```typescript
   * const txs = await account.getInternalTransactionList({
   *   address: '0x1234...',
   *   page: 1,
   *   offset: 10,
   *   sort: 'desc'
   * });
   * ```
   *
   * @param params - Parameters for the internal transaction list query
   * @param params.address - Address to get internal transactions for
   * @param params.startblock - Starting block number
   * @param params.endblock - Ending block number
   * @param params.page - Page number for pagination
   * @param params.offset - Number of records per page
   * @param params.sort - Sort direction ('asc' or 'desc')
   * @param returnRaw - If true, returns the raw transaction data without formatting
   * @returns List of internal transactions with formatted values
   * @throws {Error} If the address is invalid
   */
  async getInternalTransactionList(
    params: Account.TxlistinternalParams,
    returnRaw: boolean = false
  ): Promise<Account.Txlistinternal[]> {
    const data = await this.account.getInternalTransactionList(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
      value: tx.value ? this.formatCFX(tx.value) : tx.value,
    }));
  }

  /**
   * Get a list of token transfers.
   * Retrieves all token transfer events for a specific address or contract.
   *
   * @example
   * ```typescript
   * const transfers = await account.getTokenTransfers({
   *   address: '0x1234...',
   *   contractaddress: '0x5678...',
   *   page: 1,
   *   offset: 10,
   *   sort: 'desc'
   * });
   * ```
   *
   * @param params - Parameters for the token transfer list query
   * @param params.address - Address to get token transfers for
   * @param params.contractaddress - Filter transfers by token contract address
   * @param params.startblock - Starting block number
   * @param params.endblock - Ending block number
   * @param params.page - Page number for pagination
   * @param params.offset - Number of records per page
   * @param params.sort - Sort direction ('asc' or 'desc')
   * @param returnRaw - If true, returns the raw transfer data without formatting
   * @returns List of token transfers with formatted values
   * @throws {Error} If the address or contract address is invalid
   */
  async getTokenTransfers(
    params: Account.TokentxParams,
    returnRaw: boolean = false
  ): Promise<Account.Tokentx[]> {
    const data = await this.account.getTokenTransfers(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
      value:
        tx.value && tx.tokenDecimal ? this.formatUnit(tx.value, Number(tx.tokenDecimal)) : tx.value,
      gas: tx.gas ? this.formatGas(tx.gas) : tx.gas,
      gasPrice: tx.gasPrice ? this.formatGas(tx.gasPrice) : tx.gasPrice,
    }));
  }

  /**
   * Get a list of NFT token transfers.
   * Retrieves all NFT transfer events for a specific address or contract.
   *
   * @example
   * ```typescript
   * const transfers = await account.getNFTTransfers({
   *   address: '0x1234...',
   *   contractaddress: '0x5678...',
   *   page: 1,
   *   offset: 10,
   *   sort: 'desc'
   * });
   * ```
   *
   * @param params - Parameters for the NFT transfer list query
   * @param params.address - Address to get NFT transfers for
   * @param params.contractaddress - Filter transfers by NFT contract address
   * @param params.startblock - Starting block number
   * @param params.endblock - Ending block number
   * @param params.page - Page number for pagination
   * @param params.offset - Number of records per page
   * @param params.sort - Sort direction ('asc' or 'desc')
   * @param returnRaw - If true, returns the raw transfer data without formatting
   * @returns List of NFT transfers with formatted values
   * @throws {Error} If the address or contract address is invalid
   */
  async getNFTTransfers(
    params: Account.TokenNFTtxParams,
    returnRaw: boolean = false
  ): Promise<Account.TokenNFTtx[]> {
    const data = await this.account.getNFTTransfers(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
    }));
  }

  /**
   * Get a list of blocks mined by an address.
   * Retrieves all blocks that were mined by a specific address.
   *
   * @example
   * ```typescript
   * const blocks = await account.getMinedBlocks({
   *   address: '0x1234...',
   *   blocktype: 'blocks',
   *   page: 1,
   *   offset: 10
   * });
   * ```
   *
   * @param params - Parameters for the mined blocks query
   * @param params.address - Address to get mined blocks for
   * @param params.blocktype - Type of blocks to retrieve
   * @param params.page - Page number for pagination
   * @param params.offset - Number of records per page
   * @param returnRaw - If true, returns the raw block data without formatting
   * @returns List of mined blocks with formatted values
   * @throws {Error} If the address is invalid
   */
  async getMinedBlocks(
    params: Account.GetminedblocksParams,
    returnRaw: boolean = false
  ): Promise<Account.Getminedblocks[]> {
    const data = await this.account.getMinedBlocks(params);
    if (returnRaw) return data;
    return data.map((block) => ({
      ...block,
      timeStamp: block.timeStamp ? this.formatTimestamp(block.timeStamp) : block.timeStamp,
      blockReward: block.blockReward ? this.formatCFX(block.blockReward) : block.blockReward,
    }));
  }

  /**
   * Get balance history for an address.
   * Retrieves the historical balance of an address at a specific block number.
   *
   * @example
   * ```typescript
   * const balance = await account.getBalanceHistory({
   *   address: '0x1234...',
   *   blockno: 12345678
   * });
   * // Returns: '123.45 CFX'
   * ```
   *
   * @param params - Parameters for the balance history query
   * @param params.address - Address to get balance history for
   * @param params.blockno - Block number to get balance at
   * @param returnRaw - If true, returns the raw balance in Drip without formatting
   * @returns Historical balance with formatted values
   * @throws {Error} If the address is invalid
   */
  async getBalanceHistory(
    params: Account.BalancehistoryParams = { address: "", blockno: 0 },
    returnRaw: boolean = false
  ): Promise<Account.Balancehistory> {
    const data = await this.account.getBalanceHistory(params);
    if (returnRaw) return data;
    return this.formatCFX(data);
  }
}
