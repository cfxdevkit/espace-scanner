/**
 * Generic API Response type used across all endpoints
 */
export interface ApiResponse<T> {
  /** Response status */
  status?: string;

  /** Response message */
  message?: string;

  /** API response result */
  result: T;
}

/**
 * Conflux target types
 */
export type ConfluxTarget = "mainnet" | "testnet";

/**
 * API configuration options
 */
export interface ApiConfig {
  /** Conflux target */
  target: ConfluxTarget;
  /** API key */
  apiKey?: string;
  /** API host */
  host?: string;
}
