/**
 * Contract source code data structure
 */
export interface ContractSourceData {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  Compiler: string;
  OptimizationUsed: boolean;
  Runs: number;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
}

/**
 * Contract source code response with formatted runs value
 */
export interface ContractSourceResponse {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  Compiler: string;
  OptimizationUsed: boolean;
  Runs: string | number;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
}

/**
 * Token transfer transaction details
 * @public
 */
export interface TokenTransferItem {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

/**
 * List of token transfer transactions
 * @public
 */
export type TokenTransferList = TokenTransferItem[];

/**
 * NFT transfer transaction details
 * @public
 */
export interface NFTTransferItem {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

/**
 * List of NFT transfer transactions
 * @public
 */
export type NFTTransferList = NFTTransferItem[];

/**
 * Mined block details
 * @public
 */
export interface MinedBlockItem {
  blockNumber: string;
  timeStamp: string;
  blockReward: string;
  blockMiner: string;
  blockHash: string;
  difficulty: string;
  totalDifficulty: string;
  size: string;
  gasUsed: string;
  gasLimit: string;
  extraData: string;
  uncles: string[];
}

/**
 * List of mined blocks
 * @public
 */
export type MinedBlockList = MinedBlockItem[];

/**
 * Account balance tuple [address, balance]
 */
export type AccountBalanceMultiItem = Array<[string, string]>;

/**
 * List of account balances
 */
export type AccountBalanceMulti = AccountBalanceMultiItem;

// Transaction types
/**
 * Transaction details
 * @public
 */
export interface TransactionItem {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

/**
 * List of transactions
 * @public
 */
export type TransactionList = TransactionItem[];

// Token types
/**
 * Token data structure
 */
export interface TokenData {
  address?: string;
  name: string;
  symbol: string;
  decimals: number;
  iconUrl?: string;
  price?: number;
  totalSupply?: string;
  transferCount?: number;
  holderCount?: number;
  type?: string;
  amount?: string;
  contract?: string;
  priceInUSDT?: string;
  quoteUrl?: string;
}

/**
 * Token list response
 */
export interface TokenListResponse {
  list: TokenData[];
  total: number;
}

// Basic Stats Items
/**
 * Basic statistics item
 */
export interface BasicStatItem {
  statTime: string | number;
  count: string | number;
}

// Token Stats Items
/**
 * Token holder statistics item
 */
export interface TokenHolderStatItem {
  statTime: string | number;
  holderCount: string | number;
}

/**
 * Token unique address statistics item
 */
export interface TokenUniqueStatItem {
  statTime: string | number;
  uniqueSender?: string | number;
  uniqueReceiver?: string | number;
  uniqueParticipant?: string | number;
}

// Block Stats Items
/**
 * Block statistics item
 */
export interface BlockStatItem {
  blockNumber: string | number;
  timestamp: string | number;
  baseFee?: string | number;
  gasUsed?: string | number;
  avgPriorityFee?: string | number;
  txsInType?: {
    legacy: number;
    cip2930: number;
    cip1559: number;
  };
}

// TPS Stats Item
/**
 * Transactions per second statistics item
 */
export interface TpsStatItem {
  statTime: string | number;
  tps: string | number;
}

// Top Stats Items
/**
 * Top gas usage statistics item
 */
export interface TopGasItem {
  address: string;
  gas: string | number;
}

/**
 * Top value statistics item
 */
export interface TopValueItem {
  address: string;
  value: string | number;
}

/**
 * Top transfer statistics item
 */
export interface TopTransferItem {
  address: string;
  transferCntr: string | number;
}

/**
 * Top statistics item with combined properties
 */
export interface TopStatsItem {
  address: string;
  gas?: string;
  value?: string | number;
  transferCntr?: string | number;
  count?: string | number;
  blockCntr?: string | number;
  rewardSum?: string | number;
  txFeeSum?: string | number;
  hashRate?: string | number;
}

/**
 * Top statistics response
 */
export interface TopStatsResponse {
  gasTotal?: string;
  valueTotal?: string | number;
  maxTime?: string | number;
  total?: number;
  difficultyTotal?: number;
  list: TopStatsItem[];
}

// Generic Stats Response
/**
 * Generic statistics response
 */
export interface StatsResponse<T = BasicStatItem> {
  total: string | number;
  list: T[];
  intervalType?: string;
}

/**
 * Generic list response
 */
export interface ListResponse<T> {
  list: T[];
  valueTotal?: string | number;
  gasTotal?: string;
}

/**
 * Internal transaction details
 * @public
 */
export interface InternalTransactionItem {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  isError: string;
  errCode: string;
}

/**
 * List of internal transactions
 * @public
 */
export type InternalTransactionList = InternalTransactionItem[];

// NFT Types
/**
 * NFT balance information
 * @public
 */
export interface NFTBalance {
  contract: string;
  tokenId: string;
  amount: string;
  tokenUri?: string;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    [key: string]: unknown;
  };
}

/**
 * NFT token information
 * @public
 */
export interface NFTToken {
  contract: string;
  tokenId: string;
  owner: string;
  tokenUri?: string;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    [key: string]: unknown;
  };
}

/**
 * NFT preview information
 * @public
 */
export interface NFTPreview {
  contract: string;
  tokenId: string;
  tokenUri?: string;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
    [key: string]: unknown;
  };
}

/**
 * NFT fungible token information
 * @public
 */
export interface NFTFungibleToken {
  contract: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: string;
}

/**
 * NFT owner information
 * @public
 */
export interface NFTOwner {
  address: string;
  quantity: string;
}

// Method Decode Types
/**
 * Decoded method information
 */
export interface DecodedMethod {
  name: string;
  params: {
    name: string;
    type: string;
    value: string;
  }[];
}

/**
 * Raw decoded method information
 */
export interface DecodedMethodRaw {
  methodId: string;
  methodName: string;
  params: string[];
}

// Response Types
/**
 * NFT balance response
 */
export interface NFTBalanceResponse {
  total: number;
  list: NFTBalance[];
}

/**
 * NFT token response
 */
export interface NFTTokenResponse {
  total: number;
  list: NFTToken[];
}

/**
 * NFT preview response
 */
export interface NFTPreviewResponse {
  total: number;
  list: NFTPreview[];
}

/**
 * NFT fungible token response
 */
export interface NFTFungibleTokenResponse {
  total: number;
  list: NFTFungibleToken[];
}

/**
 * NFT owner response
 */
export interface NFTOwnerResponse {
  total: number;
  list: NFTOwner[];
}
