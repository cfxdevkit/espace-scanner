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
