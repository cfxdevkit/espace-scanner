import { BlockTag } from "../common";

/**
 * Parameters for fetching account balance
 */
export interface BalanceParams {
  /** Account address */
  address: string;
  /** Block tag */
  tag?: BlockTag;
}

export type Balance = string;

/**
 * Parameters for fetching multiple account balances
 */
export interface BalanceMultiParams {
  /** Comma-separated account addresses */
  address: string[];
  /** Block tag */
  tag?: BlockTag;
}

/**
 * Single balance item in multi-balance response
 */
export type BalanceMultiItem = [string, string];

/**
 * Response for multiple account balances
 */
export type BalanceMulti = BalanceMultiItem[];

export interface TxlistParams {
  /** the string representing the address to check for balance */
  address: string;

  /** the integer block number to start searching for transactions */
  startblock?: number;

  /** the integer block number to stop searching for transactions */
  endblock?: number;

  /** the integer page number, if pagination is enabled
   * @default 1 */
  page?: number;

  /** the number of transactions displayed per page
   * @default 100 */
  offset?: number;

  /** the sorting preference, use asc to sort by ascending and desc to sort by descending
   * @default desc */
  sort?: string;
}

export interface Txlist {
  blockNumber?: string;

  timestamp?: string;

  hash?: string;

  nonce?: string;

  blockHash?: string;

  transactionIndex?: string;

  from?: string;

  to?: string;

  value?: string;

  gas?: string;

  gasPrice?: string;

  isError?: string;

  txreceipt_status?: string;

  input?: string;

  contractAddress?: string;

  cumulativeGasUsed?: string;

  gasUsed?: string;

  confirmations?: string;
}

export interface TxlistinternalParams {
  /** the string representing the transaction hash to check for internal transactions */
  txhash?: string;

  /** the string representing the address to check for balance */
  address: string;

  /** the integer block number to start searching for transactions */
  startblock?: number;

  /** the integer block number to stop searching for transactions */
  endblock?: number;

  /** the integer page number, if pagination is enabled
   * @default 1 */
  page?: number;

  /** the number of transactions displayed per page
   * @default 100 */
  offset?: number;

  /** the sorting preference, use asc to sort by ascending and desc to sort by descending
   * @default desc */
  sort?: string;
}

export interface Txlistinternal {
  blockNumber?: string;

  timestamp?: string;

  hash?: string;

  from?: string;

  to?: string;

  value?: string;

  contractAddress?: string;

  input?: string;

  type?: string;

  traceId?: string;

  isError?: string;

  errCode?: string;
}

export interface TokentxParams {
  /** the string representing the token contract address to check for balance */
  contractaddress?: string;

  /** the string representing the address to check for balance */
  address: string;

  /** the integer page number, if pagination is enabled
   * @default 1 */
  page?: number;

  /** the number of transactions displayed per page
   * @default 100 */
  offset?: number;

  /** the integer block number to start searching for transactions */
  startblock?: number;

  /** the integer block number to stop searching for transactions */
  endblock?: number;

  /** the sorting preference, use asc to sort by ascending and desc to sort by descending
   * @default desc */
  sort?: string;
}

export interface Tokentx {
  blockNumber?: string;

  timeStamp?: string;

  hash?: string;

  nonce?: string;

  blockHash?: string;

  from?: string;

  contractAddress?: string;

  to?: string;

  value?: string;

  tokenName?: string;

  tokenSymbol?: string;

  tokenDecimal?: string;

  transactionIndex?: string;

  gas?: string;

  gasPrice?: string;

  gasUsed?: string;

  cumulativeGasUsed?: string;

  /** deprecated */
  input?: string;

  confirmations?: string;
}

export interface TokenNFTtxParams {
  /** the string representing the token contract address to check for balance */
  contractaddress?: string;

  /** the string representing the address to check for balance */
  address: string;

  /** the integer page number, if pagination is enabled
   * @default 1 */
  page?: number;

  /** the number of transactions displayed per page
   * @default 100 */
  offset?: number;

  /** the integer block number to start searching for transactions */
  startblock?: number;

  /** the integer block number to stop searching for transactions */
  endblock?: number;

  /** the sorting preference, use asc to sort by ascending and desc to sort by descending
   * @default desc */
  sort?: string;
}

export interface TokenNFTtx {
  blockNumber?: string;
  timestamp?: string;
  hash?: string;
  nonce?: string;
  blockHash?: string;
  from?: string;
  contractAddress?: string;
  to?: string;
  value?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimal?: string;
  transactionIndex?: string;
  gas?: string;
  gasPrice?: string;
  gasUsed?: string;
  cumulativeGasUsed?: string;
  /** deprecated */
  input?: string;
  confirmations?: string;
}

export interface GetminedblocksParams {
  /** the string representing the address to check for balance */
  address: string;

  /** the string pre-defined block type, only support 'blocks' type
   * @default blocks */
  blocktype?: string;

  /** the integer page number, if pagination is enabled
   * @default 1 */
  page?: number;

  /** the number of transactions displayed per page
   * @default 100 */
  offset?: number;
}

export type Getminedblocks = {
  /** Block Number */
  blockNumber?: string;

  /** The timeStamp is represented in Unix timestamp */
  timeStamp?: string;

  /** Block Reward */
  blockReward?: string;
};

// Types for /api?module=account&action=balancehistory
export interface BalancehistoryParams {
  /** the string representing the address to check for balance */
  address: string;

  /** the integer block number to check balance for eg. 12697906 */
  blockno: number;
}

export type Balancehistory = string;
