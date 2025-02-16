/**
 * Common pagination parameters used across multiple endpoints
 */
export interface PaginationParams {
  /** Number of records to skip (pageSize * (pageNumber - 1)). Maximum 10000. */
  skip?: number;
  /** Number of records per page. Maximum 100. */
  limit?: number;
  /** Sort order by timestamp */
  sort?: "ASC" | "DESC";
}

/**
 * Block tag types used for queries
 */
export type BlockTag =
  | "latest_mined"
  | "latest_state"
  | "latest_finalized"
  | "latest_confirmed"
  | "latest_checkpoint"
  | "earliest";

/**
 * Token types supported by the API
 */
export type TokenType = "ERC20" | "ERC721" | "ERC1155" | "native";

/**
 * Transfer types supported by the API
 */
export type TransferType =
  | "transaction"
  | "call"
  | "create"
  | "transfer_20"
  | "transfer_721"
  | "transfer_1155";

/**
 * Time periods for statistics
 */
export type StatsPeriod = "24h" | "3d" | "7d";

/**
 * Interval types for statistics
 */
export type StatsIntervalType = "min" | "hour" | "day";
