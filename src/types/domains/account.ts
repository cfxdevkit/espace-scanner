/**
 * @packageDocumentation
 * Account-related type definitions for the Conflux eSpace Scanner SDK.
 * Contains types for account balances, transactions, and token transfers.
 * @module types/domains/account
 * @category Types
 */

import { BlockTag, PaginationParams, TimestampRangeParams, BlockRangeParams } from "../common";

/**
 * Parameters for fetching account balance.
 * Used to query the CFX balance of a specific address at a given block.
 *
 * @example
 * ```typescript
 * const params: BalanceParams = {
 *   address: '0x1234...',
 *   tag: 'latest_state'
 * };
 * ```
 *
 * @interface BalanceParams
 * @category Types
 */
export interface BalanceParams {
  /** Account address to check balance for (in hex format) */
  address: string;
  /** Block tag to query balance at (e.g. 'latest_state', 'latest_confirmed') */
  tag?: BlockTag;
}

/**
 * Account balance in Drip (smallest unit of CFX).
 * The value is returned as a string to handle large numbers accurately.
 *
 * @example
 * "1000000000000000000" // 1 CFX
 *
 * @category Types
 */
export type Balance = string;

/**
 * Parameters for fetching multiple account balances.
 * Allows querying CFX balances for multiple addresses in a single call.
 *
 * @example
 * ```typescript
 * const params: BalanceMultiParams = {
 *   address: ['0x1234...', '0x5678...'],
 *   tag: 'latest_state'
 * };
 * ```
 *
 * @interface BalanceMultiParams
 * @category Types
 */
export interface BalanceMultiParams {
  /** Array of account addresses to check balances for (in hex format) */
  address: string[];
  /** Block tag to query balances at (e.g. 'latest_state', 'latest_confirmed') */
  tag?: BlockTag;
}

/**
 * Single balance item in multi-balance response.
 * A tuple containing the address and its balance.
 *
 * @example
 * ['0x1234...', '1000000000000000000']
 *
 * @category Types
 */
export type BalanceMultiItem = [string, string];

/**
 * Response for multiple account balances.
 * An array of address-balance pairs.
 *
 * @example
 * [
 *   ['0x1234...', '1000000000000000000'],
 *   ['0x5678...', '2000000000000000000']
 * ]
 *
 * @category Types
 */
export type BalanceMulti = BalanceMultiItem[];

/**
 * Parameters for getting transaction list.
 * Used to query normal (non-internal) transactions for an address.
 *
 * @example
 * ```typescript
 * const params: TxlistParams = {
 *   address: '0x1234...',
 *   startblock: 1000000,
 *   endblock: 2000000,
 *   page: 1,
 *   offset: 10,
 *   sort: 'desc'
 * };
 * ```
 *
 * @interface TxlistParams
 * @extends {PaginationParams}
 * @extends {TimestampRangeParams}
 * @extends {BlockRangeParams}
 * @category Types
 */
export interface TxlistParams extends PaginationParams, TimestampRangeParams, BlockRangeParams {
  /** Account address to get transactions for (in hex format) */
  address: string;
  /** Start block number */
  startblock?: number;
  /** End block number */
  endblock?: number;
  /** Transaction hash to filter by */
  txhash?: string;
}

/**
 * Transaction list response item
 *
 * @interface Txlist
 * @category Types
 */
export interface Txlist {
  /** Block hash */
  blockHash?: string;
  /** Block number */
  blockNumber?: string;
  /** Timestamp of the transaction */
  timestamp?: string;
  /** Transaction hash */
  hash?: string;
  /** Transaction nonce */
  nonce?: string;
  /** Transaction index in block */
  transactionIndex?: string;
  /** Sender address */
  from?: string;
  /** Recipient address */
  to?: string;
  /** Transaction value in Drip */
  value?: string;
  /** Gas limit */
  gas?: string;
  /** Gas price in Drip */
  gasPrice?: string;
  /** Contract address if created */
  contractAddress?: string;
  /** Input data */
  input?: string;
  /** Transaction type */
  type?: string;
  /** Max fee per gas */
  maxFeePerGas?: string;
  /** Max priority fee per gas */
  maxPriorityFeePerGas?: string;
  /** Transaction status (0 for failure, 1 for success) */
  isError?: string;
  /** Error message if failed */
  errDescription?: string;
  /** Gas used by the transaction */
  gasUsed?: string;
  /** Cumulative gas used in the block */
  cumulativeGasUsed?: string;
  /** Transaction receipt status */
  txreceipt_status?: string;
  /** Number of confirmations */
  confirmations?: string;
}

/**
 * Parameters for getting internal transaction list
 *
 * @interface TxlistinternalParams
 * @extends {PaginationParams}
 * @extends {TimestampRangeParams}
 * @extends {BlockRangeParams}
 * @category Types
 */
export interface TxlistinternalParams
  extends PaginationParams, TimestampRangeParams, BlockRangeParams {
  /** Account address to get internal transactions for */
  address: string;
  /** Start block number */
  startblock?: number;
  /** End block number */
  endblock?: number;
  /** Transaction hash */
  txhash?: string;
}

/**
 * Internal transaction list response item
 *
 * @interface Txlistinternal
 * @category Types
 */
export interface Txlistinternal {
  /** Block number */
  blockNumber?: string;
  /** Timestamp of the transaction */
  timestamp?: string;
  /** Parent transaction hash */
  hash?: string;
  /** Sender address */
  from?: string;
  /** Recipient address */
  to?: string;
  /** Transaction value in Drip */
  value?: string;
  /** Contract address if created */
  contractAddress?: string;
  /** Input data */
  input?: string;
  /** Transaction type */
  type?: string;
  /** Gas limit */
  gas?: string;
  /** Error message if failed */
  errCode?: string;
}

/**
 * Parameters for getting token transaction list
 *
 * @interface TokentxParams
 * @extends {PaginationParams}
 * @extends {TimestampRangeParams}
 * @extends {BlockRangeParams}
 * @category Types
 */
export interface TokentxParams extends PaginationParams, TimestampRangeParams, BlockRangeParams {
  /** Account address to get token transactions for */
  address: string;
  /** Contract address to filter transactions by */
  contractaddress?: string;
  /** Start block number */
  startblock?: number;
  /** End block number */
  endblock?: number;
}

/**
 * Token transaction list response item
 *
 * @interface Tokentx
 * @category Types
 */
export interface Tokentx {
  /** Block number */
  blockNumber?: string;
  /** Timestamp of the transaction */
  timestamp?: string;
  /** Transaction hash */
  hash?: string;
  /** Transaction nonce */
  nonce?: string;
  /** Block hash */
  blockHash?: string;
  /** Sender address */
  from?: string;
  /** Recipient address */
  to?: string;
  /** Contract address */
  contractAddress?: string;
  /** Token ID (for NFTs) */
  tokenID?: string;
  /** Token name */
  tokenName?: string;
  /** Token symbol */
  tokenSymbol?: string;
  /** Token decimals */
  tokenDecimal?: string;
  /** Transaction value in token's smallest unit */
  value?: string;
  /** Token type */
  tokenType?: string;
  /** Gas used */
  gas?: string;
  /** Gas price in Drip */
  gasPrice?: string;
  /** Base fee per gas */
  baseFeePerGas?: string;
  /** Max fee per gas */
  maxFeePerGas?: string;
  /** Max priority fee per gas */
  maxPriorityFeePerGas?: string;
  /** Transaction status (0 for failure, 1 for success) */
  status?: string;
}

/**
 * Parameters for getting NFT token transactions
 * @category Types
 */
export type TokenNFTtxParams = TokentxParams;

/**
 * NFT token transaction response item
 * @category Types
 */
export type TokenNFTtx = Tokentx;

/**
 * Parameters for getting mined blocks
 *
 * @interface GetminedblocksParams
 * @extends {PaginationParams}
 * @category Types
 */
export interface GetminedblocksParams extends PaginationParams {
  /** Miner address to get blocks for */
  address: string;
  blocktype: "blocks";
}

/**
 * Mined blocks response item
 *
 * @interface Getminedblocks
 * @category Types
 */
export interface Getminedblocks {
  /** Block number */
  blockNumber?: string;
  /** Block timestamp */
  timeStamp?: string;
  /** Block reward in Drip */
  blockReward?: string;
}

/**
 * Parameters for getting balance history
 *
 * @interface BalancehistoryParams
 * @category Types
 */
export interface BalancehistoryParams {
  /** Account address */
  address: string;
  /** Block number to check balance at */
  blockno: number;
}

/**
 * Balance history response
 * @category Types
 */
export type Balancehistory = string;
