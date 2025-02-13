/**
 * Base parameters for paginated requests
 */
export interface BaseParams {
  /** Page number, starting from 1 */
  page?: number;
  /** Number of items per page */
  limit?: number;
}

/**
 * Parameters for token transfer requests
 */
export interface TokenTransferParams extends BaseParams {
  /** Contract address */
  contractAddress?: string;
  /** Account address */
  address?: string;
  /** Block number */
  blockNumber?: number;
}

/**
 * Parameters for NFT transfer requests
 */
export interface NFTTransferParams extends TokenTransferParams {
  /** Token ID */
  tokenId?: string;
}

/**
 * Parameters for block requests
 */
export interface BlockParams extends BaseParams {
  /** Block number */
  blockNumber?: number;
  /** Block hash */
  blockHash?: string;
  /** Block type */
  blockType?: string;
  /** Number of items to skip */
  offset?: number;
  /** Miner address */
  miner?: string;
}

/**
 * Parameters for transaction requests
 */
export interface TransactionParams extends BaseParams {
  /** Transaction hash */
  hash?: string;
  /** Block number */
  blockNumber?: number;
  /** Block hash */
  blockHash?: string;
  /** Account address */
  address?: string;
  /** Start block number */
  startBlock?: number;
  /** End block number */
  endBlock?: number;
  /** Number of items to skip */
  offset?: number;
  /** Sort order (asc/desc) */
  sort?: "asc" | "desc";
}

/**
 * Parameters for NFT requests
 */
export interface NFTParams extends BaseParams {
  /** Contract address */
  contract?: string;
  /** Token ID */
  tokenId?: string;
  /** Account address */
  owner?: string;
  /** Sort order (asc/desc) */
  sort?: "asc" | "desc";
}

/**
 * Parameters for token requests
 */
export interface TokenParams extends BaseParams {
  /** Token type */
  type?: string;
  /** Token holder address */
  holder?: string;
  /** Sort field */
  sortBy?: string;
  /** Sort order (asc/desc) */
  sort?: "asc" | "desc";
}

/**
 * Parameters for contract requests
 */
export interface ContractParams extends BaseParams {
  /** Contract address */
  address?: string;
  /** Contract name */
  name?: string;
  /** Contract type */
  type?: string;
  /** Contract status */
  status?: string;
  /** Sort field */
  sortBy?: string;
  /** Sort order (asc/desc) */
  sort?: "asc" | "desc";
}

/**
 * Parameters for account requests
 */
export interface AccountParams extends BaseParams {
  /** Account address */
  address?: string;
  /** Account type */
  type?: string;
  /** Sort field */
  sortBy?: string;
  /** Sort order (asc/desc) */
  sort?: "asc" | "desc";
}

/**
 * Parameters for statistics requests
 */
export interface StatsParams extends BaseParams {
  /** Minimum timestamp */
  minTimestamp?: number;
  /** Maximum timestamp */
  maxTimestamp?: number;
  /** Skip count */
  skip?: number;
  /** Contract address */
  contract?: string;
  /** Interval type */
  intervalType?: "min" | "hour" | "day";
  /** Sort order (asc/desc) */
  sort?: "DESC" | "ASC";
}

/**
 * Parameters for top statistics requests
 */
export interface TopStatsParams extends BaseParams {
  /** Start time (timestamp) */
  startTime?: number;
  /** End time (timestamp) */
  endTime?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort order (asc/desc) */
  sort?: "asc" | "desc";
}

/**
 * Parameters for decoded method requests
 */
export interface DecodedMethodParams extends BaseParams {
  /** Method ID */
  methodId?: string;
  /** Method name */
  methodName?: string;
  /** Contract address */
  contract?: string;
  /** Sort field */
  sortBy?: string;
  /** Sort order (asc/desc) */
  sort?: "asc" | "desc";
}

export type StatsPeriod = "24h" | "3d" | "7d" | "1w" | "1m" | "3m" | "6m" | "1y";

export type TokenType = "ERC20" | "ERC721" | "ERC1155";
