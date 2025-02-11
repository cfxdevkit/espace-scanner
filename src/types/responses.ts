// Contract types
export interface ContractABIData {
  abi: string;
}

export interface ContractSourceData {
  sourceCode: string;
  abi: string;
  contractName: string;
  compiler: string;
  optimizationUsed: boolean;
  runs: number;
  constructorArguments: string;
  evmVersion: string;
  library: string;
  licenseType: string;
  proxy: string;
  implementation: string;
  swarmSource: string;
}

export type ContractABIResponse = ContractABIData;
export type ContractSourceResponse = ContractSourceData;

// Token types
export interface TokenData {
  address: string;
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
  uniqueSenderCount?: string | number;
  uniqueReceiverCount?: string | number;
  uniqueParticipantCount?: string | number;
}

// Block Stats Items
export interface BlockStatItem {
  statTime: string | number;
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
}

export interface TopStatsResponse {
  gasTotal?: string;
  valueTotal?: string | number;
  maxTime?: string;
  total?: number;
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
