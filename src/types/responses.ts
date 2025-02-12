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

export type TokenTransferList = TokenTransferItem[];

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

export type NFTTransferList = NFTTransferItem[];

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

export type MinedBlockList = MinedBlockItem[];

export type AccountBalanceMultiItem = Array<[string, string]>;

export type AccountBalanceMulti = AccountBalanceMultiItem;

// Transaction types
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

export type TransactionList = TransactionItem[];

// Token types
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

export interface TokenListResponse {
  list: TokenData[];
  total: number;
}

// Basic Stats Items
export interface BasicStatItem {
  statTime: string | number;
  count: string | number;
}

// Token Stats Items
export interface TokenHolderStatItem {
  statTime: string | number;
  holderCount: string | number;
}

export interface TokenUniqueStatItem {
  statTime: string | number;
  uniqueSender?: string | number;
  uniqueReceiver?: string | number;
  uniqueParticipant?: string | number;
}

// Block Stats Items
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
export interface TpsStatItem {
  statTime: string | number;
  tps: string | number;
}

// Top Stats Items
export interface TopGasItem {
  address: string;
  gas: string | number;
}

export interface TopValueItem {
  address: string;
  value: string | number;
}

export interface TopTransferItem {
  address: string;
  transferCntr: string | number;
}

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

export interface TopStatsResponse {
  gasTotal?: string;
  valueTotal?: string | number;
  maxTime?: string | number;
  total?: number;
  difficultyTotal?: number;
  list: TopStatsItem[];
}

// Generic Stats Response
export interface StatsResponse<T = BasicStatItem> {
  total: string | number;
  list: T[];
  intervalType?: string;
}

export interface ListResponse<T> {
  list: T[];
  valueTotal?: string | number;
  gasTotal?: string;
}

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

export type InternalTransactionList = InternalTransactionItem[];

// NFT Types
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

export interface NFTFungibleToken {
  contract: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: string;
}

export interface NFTOwner {
  address: string;
  quantity: string;
}

// Method Decode Types
export interface DecodedMethod {
  name: string;
  params: {
    name: string;
    type: string;
    value: string;
  }[];
}

export interface DecodedMethodRaw {
  methodId: string;
  methodName: string;
  params: string[];
}

// Response Types
export interface NFTBalanceResponse {
  total: number;
  list: NFTBalance[];
}

export interface NFTTokenResponse {
  total: number;
  list: NFTToken[];
}

export interface NFTPreviewResponse {
  total: number;
  list: NFTPreview[];
}

export interface NFTFungibleTokenResponse {
  total: number;
  list: NFTFungibleToken[];
}

export interface NFTOwnerResponse {
  total: number;
  list: NFTOwner[];
}
