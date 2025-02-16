/**
 * @packageDocumentation
 * Account-related type definitions for the Conflux eSpace Scanner SDK.
 * Contains types for account balances, transactions, and token transfers.
 * @module types/domains/account
 */

import { BlockTag, PaginationParams, TimestampRangeParams, BlockRangeParams } from "../common";

/**
 * Parameters for fetching account balance
 *
 * @interface BalanceParams
 */
export interface BalanceParams {
  /** Account address to check balance for */
  address: string;
  /** Block tag to query balance at */
  tag?: BlockTag;
}

/** Account balance in Drip */
export type Balance = string;

/**
 * Parameters for fetching multiple account balances
 *
 * @interface BalanceMultiParams
 */
export interface BalanceMultiParams {
  /** Array of account addresses to check balances for */
  address: string[];
  /** Block tag to query balances at */
  tag?: BlockTag;
}

/** Single balance item in multi-balance response [address, balance] */
export type BalanceMultiItem = [string, string];

/** Response for multiple account balances */
export type BalanceMulti = BalanceMultiItem[];

/**
 * Parameters for getting transaction list
 *
 * @interface TxlistParams
 * @extends {PaginationParams}
 * @extends {TimestampRangeParams}
 * @extends {BlockRangeParams}
 */
export interface TxlistParams extends PaginationParams, TimestampRangeParams, BlockRangeParams {
  /** Account address to get transactions for */
  address: string;
  /** Start block number */
  startblock?: number;
  /** End block number */
  endblock?: number;
  /** Transaction hash */
  txhash?: string;
}

/**
 * Transaction list response item
 *
 * @interface Txlist
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
 */
export interface TxlistinternalParams
  extends PaginationParams,
    TimestampRangeParams,
    BlockRangeParams {
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

// Re-export NFT transaction types from TokentxParams
export type TokenNFTtxParams = TokentxParams;
export type TokenNFTtx = Tokentx;

/**
 * Parameters for getting mined blocks
 *
 * @interface GetminedblocksParams
 * @extends {PaginationParams}
 */
export interface GetminedblocksParams extends PaginationParams {
  /** Miner address to get blocks for */
  address: string;
  blocktype: "blocks";
}

/**
 * Mined block details
 *
 * @interface Getminedblocks
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
 * Parameters for fetching historical balance
 *
 * @interface BalancehistoryParams
 */
export interface BalancehistoryParams {
  /** Account address */
  address: string;
  /** Block number to check balance at */
  blockno: number;
}

/** Historical balance in Drip */
export type Balancehistory = string;
