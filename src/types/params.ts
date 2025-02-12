export interface StatsParams {
  minTimestamp?: number;
  maxTimestamp?: number;
  sort?: "DESC" | "ASC";
  skip?: number;
  limit?: number;
  intervalType?: "min" | "hour" | "day";
  contract?: string;
  [key: string]: string | number | boolean | undefined;
}

export type StatsPeriod = "24h" | "3d" | "7d" | "1w" | "1m" | "3m" | "6m" | "1y";

export type TokenType = "ERC20" | "ERC721" | "ERC1155";

export interface TransactionParams {
  address?: string;
  startBlock?: number;
  endBlock?: number;
  page?: number;
  offset?: number;
  sort?: "asc" | "desc";
}

export interface TokenTransferParams extends TransactionParams {
  contractAddress?: string;
}

export interface NFTTransferParams extends TokenTransferParams {
  tokenId?: string;
}

export interface BlockParams {
  blockType?: string;
  page?: number;
  offset?: number;
}

export interface TokenParams {
  type?: TokenType;
  skip?: number;
  limit?: number;
}
