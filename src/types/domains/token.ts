/**
 * Parameters for token balance request
 */
export interface TokenBalanceParams {
  /** Contract address */
  contractaddress: string;
  /** Account address */
  address: string;
}

/**
 * Response for token balance request
 */
export type TokenBalance = string;

/**
 * Parameters for token supply request
 */
export interface TokenSupplyParams {
  /** Contract address */
  contractaddress: string;
}

/**
 * Response for token supply request
 */
export type TokenSupply = string;

/**
 * Parameters for historical token data
 */
export interface TokenSupplyHistoryParams extends TokenBalanceParams {
  /** Block number to query */
  blockno: number;
}

/**
 * Response for historical token data
 */
export type TokenSupplyHistory = string;

/**
 * Parameters for token balance history
 */
export interface TokenBalanceHistoryParams {
  /** the string representing the token contract address to check for balance */
  contractaddress: string;
  /** the string representing the address to check for balance */
  address: string;

  /** the integer block number to check balance for eg. 12697906 */
  blockno: number;
}

/**
 * Response for token balance history
 */
export type TokenBalanceHistory = string;
