export type Supply = {
  /** Total issued balance in Drip */
  totalIssued: string;

  /** Total circulating balance in Drip */
  totalCirculating: string;

  /** Total staking balance in Drip */
  totalStaking: string;

  /** Total collateral balance in Drip */
  totalCollateral: string;

  /** Zero address's balance in Drip */
  nullAddressBalance: string;

  /** Two year unlock address's balance in Drip */
  twoYearUnlockBalance: string;

  /** Four year unlock address's balance in `Drip` */
  fourYearUnlockBalance: string;
};

// Types for /statistics/mining
export interface MiningParams {
  /** Indicator calculation period, should be one of min(minute), hour or day. Default is hour.
   * @default hour
   * @enum min, hour, day */
  intervalType?: "min" | "hour" | "day";

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type Mining = {
  total?: number;

  list?: Array<{
    blockTime?: string;

    hashRate?: string;

    difficulty?: string;

    /** Statistics time, UTC. */
    statTime?: string;
  }>;
};

// Types for /statistics/tps
export interface TpsParams {
  /** Indicate calculation period, should be one of min(minute), hour or day. Default is hour.
   * @default hour
   * @enum min, hour, day */
  intervalType?: "min" | "hour" | "day";

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type Tps = {
  total?: number | string;

  list?: Array<{
    tps?: string;

    /** Statistics time, UTC. */
    statTime?: string;
  }>;
};

// Types for /statistics/contract
export interface ContractParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type Contract = {
  total?: number | string;

  list?: Array<{
    /** daily deployed contracts. */
    count?: string;

    /** total deployed contracts. */
    total?: string;

    /** Statistics time, UTC. */
    statTime?: string;
  }>;
};

// Types for /statistics/account/cfx/holder
export interface CfxHolderParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type CfxHolder = {
  total?: number | string;

  list?: Array<{
    /** total cfx holders count by daily */
    count?: string;

    /** Statistics time, UTC. */
    statTime?: string;
  }>;
};

// Types for /statistics/account/growth
export interface AccountGrowthParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type AccountGrowth = {
  total?: number | string;

  list?: Array<{
    /** daily account growth count. */
    count?: string;

    /** Statistics time, UTC. */
    statTime?: string;
  }>;
};

// Types for /statistics/account/active
export interface AccountActiveParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type AccountActive = {
  total?: number | string;

  list?: Array<{
    /** daily active account count. */
    count?: string;

    /** Statistics time, UTC. */
    statTime?: string;
  }>;
};

// Types for /statistics/account/active/overall
export interface ActiveOverallParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type ActiveOverall = {
  total?: number | string;

  list?: Array<{
    /** daily active account count. */
    count?: string;

    /** Statistics time, UTC. */
    statTime?: string;
  }>;
};

// Types for /statistics/transaction
export interface TransactionParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type Transaction = {
  total?: number | string;

  list?: Array<{
    /** daily transaction count. */
    count?: string;

    /** Statistics time, UTC. */
    statTime?: string;
  }>;
};

// Types for /statistics/cfx/transfer
export interface CfxTransferParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type CfxTransfer = {
  total?: number | string;

  list?: Array<{
    /** daily cfx transfer count. */
    transferCount?: string;

    /** daily user count. */
    userCount?: string;

    /** daily amount of cfx transfer. */
    amount?: string;

    /** Statistics time, UTC. */
    statTime?: string;
  }>;
};

// Types for /statistics/token/transfer
export interface TokenTransferParams {
  /** Contract address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  contract?: string;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type TokenTransfer = {
  total?: number | string;

  list?: Array<{
    /** daily token transfer count. */
    transferCount?: string;

    /** daily user count. */
    userCount?: string;

    /** Statistics time, UTC. */
    statTime?: string;
  }>;
};

// Types for /statistics/top/gas/used
export interface TopGasUsedParams {
  /** Calculates the ranking in the specified time span 24h, 3d or 7d. If not provided, default value is 24h
   * @default 24h */
  spanType?: string;
}

export type TopGasUsed = {
  gasTotal?: string;

  list?: Array<{
    /** account address. */
    address?: string;

    /** gas used. */
    gas?: string;
  }>;
};

// Types for /statistics/top/miner
export interface TopMinerParams {
  /** Calculates the ranking in the specified time span 24h, 3d or 7d. If not provided, default value is 24h
   * @default 24h */
  spanType?: string;
}

export type TopMiner = {
  minTime?: string;

  maxTime?: string;

  difficultyTotal?: string;

  list?: Array<{
    /** account address. */
    address?: string;

    /** block count */
    blockCntr?: string;

    /** reward sum */
    rewardSum?: string;

    /** tx fee sum */
    txFeeSum?: string;

    /** hash rate */
    hashRate?: string;
  }>;
};

// Types for /statistics/top/transaction/sender
export interface TopTransactionSenderParams {
  /** Calculates the ranking in the specified time span 24h, 3d or 7d. If not provided, default value is 24h
   * @default 24h */
  spanType?: string;
}

export type TopTransactionSender = {
  minTime?: string;

  maxTime?: string;

  valueTotal?: string;

  list?: Array<{
    /** account address. */
    address?: string;

    /** address transaction count. */
    value?: string;
  }>;
};

// Types for /statistics/top/transaction/receiver
export interface TopTransactionReceiverParams {
  /** Calculates the ranking in the specified time span 24h, 3d or 7d. If not provided, default value is 24h
   * @default 24h */
  spanType?: string;
}

export type TopTransactionReceiver = {
  minTime?: string;

  maxTime?: string;

  valueTotal?: string;

  list?: Array<{
    /** account address. */
    address?: string;

    /** address transaction count. */
    value?: string;
  }>;
};

// Types for /statistics/top/cfx/sender
export interface TopCfxSenderParams {
  /** Calculates the ranking in the specified time span 24h, 3d or 7d. If not provided, default value is 24h
   * @default 24h */
  spanType?: string;
}

export type TopCfxSender = {
  minTime?: string;

  maxTime?: string;

  valueTotal?: string;

  list?: Array<{
    /** account address. */
    address?: string;

    /** address transfer value. */
    value?: string;
  }>;
};

// Types for /statistics/top/cfx/receiver
export interface TopCfxReceiverParams {
  /** Calculates the ranking in the specified time span 24h, 3d or 7d. If not provided, default value is 24h
   * @default 24h */
  spanType?: string;
}

export type TopCfxReceiver = {
  minTime?: string;

  maxTime?: string;

  valueTotal?: string;

  list?: Array<{
    /** account address. */
    address?: string;

    /** address transfer value. */
    value?: string;
  }>;
};

// Types for /statistics/top/token/transfer
export interface TopTokenTransferParams {
  /** Calculates the ranking in the specified time span 24h, 3d or 7d. If not provided, default value is 24h
   * @default 24h */
  spanType?: string;
}

export type TopTokenTransfer = {
  list?: Array<{
    /** token address. */
    address?: string;

    /** token transfer count. */
    transferCntr?: string;
  }>;
};

// Types for /statistics/top/token/sender
export interface TopTokenSenderParams {
  /** Calculates the ranking in the specified time span 24h, 3d or 7d. If not provided, default value is 24h
   * @default 24h */
  spanType?: string;
}

export type TopTokenSender = {
  list?: Array<{
    /** token address. */
    address?: string;

    /** token sender count. */
    value?: string;
  }>;
};

// Types for /statistics/top/token/receiver
export interface TopTokenReceiverParams {
  /** Calculates the ranking in the specified time span 24h, 3d or 7d. If not provided, default value is 24h
   * @default 24h */
  spanType?: string;
}

export type TopTokenReceiver = {
  maxTime?: string;
  list?: Array<{
    /** token address. */
    address?: string;

    /** token receiver count. */
    transferCntr?: string;
  }>;
};

// Types for /statistics/top/token/participant
export interface TopTokenParticipantParams {
  /** Calculates the ranking in the specified time span 24h, 3d or 7d. If not provided, default value is 24h
   * @default 24h */
  spanType?: string;
}

export type TopTokenParticipant = {
  maxTime?: string;
  list?: Array<{
    /** token address. */
    address?: string;

    /** token participant count. */
    transferCntr?: string;
  }>;
};

// Types for /statistics/token/holder
export interface TokenHolderParams {
  /** Contract address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  contract: string;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type TokenHolder = {
  total?: number | string;

  list?: Array<{
    /** Statistics time, UTC. */
    statTime?: string;

    /** daily holder count of token. */
    holderCount?: string;
  }>;
};

// Types for /statistics/token/unique/sender
export interface UniqueSenderParams {
  /** Contract address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  contract: string;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type UniqueSender = {
  total?: number | string;

  list?: Array<{
    /** Statistics time, UTC. */
    statTime?: string;

    /** daily unique sender count of token transfer. */
    uniqueSenderCount?: string;
  }>;
};

// Types for /statistics/token/unique/receiver
export interface UniqueReceiverParams {
  /** Contract address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  contract: string;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type UniqueReceiver = {
  total?: number | string;

  list?: Array<{
    /** Statistics time, UTC. */
    statTime?: string;

    /** daily unique receiver count of token transfer. */
    uniqueReceiverCount?: string;
  }>;
};

// Types for /statistics/token/unique/participant
export interface UniqueParticipantParams {
  /** Contract address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  contract: string;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type UniqueParticipant = {
  total?: number | string;

  list?: Array<{
    /** Statistics time, UTC. */
    statTime?: string;

    /** daily unique participant count of token transfer. */
    uniqueParticipantCount?: string;
  }>;
};

// Types for /statistics/block/base-fee
export interface BlockBasefeeParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type BlockBasefee = {
  total?: number | string;

  list?: Array<{
    /** Base fee per gas. */
    baseFee?: string;

    /** Block Number. */
    blockNumber?: number;

    /** Block timestamp, UTC. */
    timestamp?: number | string;
  }>;
};

// Types for /statistics/block/avg-priority-fee
export interface BlockAvgpriorityfeeParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type BlockAvgpriorityfee = {
  total?: number | string;

  list?: Array<{
    /** Average priority fee per gas. */
    avgPriorityFee?: string;

    /** Block Number. */
    blockNumber?: number;

    /** Block timestamp, UTC. */
    timestamp?: number | string;
  }>;
};

// Types for /statistics/block/gas-used
export interface BlockGasusedParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type BlockGasused = {
  total?: number | string;

  list?: Array<{
    /** Gas used. */
    gasUsed?: string;

    /** Block Number. */
    blockNumber?: number;

    /** Block timestamp, UTC. */
    timestamp?: number | string;
  }>;
};

// Types for /statistics/block/txs-by-type
export interface BlockTxsbytypeParams {
  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1).
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 2000.
   * @default 10 */
  limit?: number;
}

export type BlockTxsbytype = {
  total?: number | string;

  list?: Array<{
    /** Transactions by type. */
    txsByType?: {
      /** Number of transactions of type legacy. */
      legacy?: number;

      /** Number of transactions of type CIP2930. */
      cip2930?: number;

      /** Number of transactions of type CIP1559. */
      cip1559?: number;
    };

    /** Block Number. */
    blockNumber?: number;

    /** Block timestamp, UTC. */
    timestamp?: number | string;
  }>;
};
