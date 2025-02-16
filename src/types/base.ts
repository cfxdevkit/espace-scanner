/**
 * @fileoverview Base type definitions used across the Conflux eSpace Scanner SDK.
 * Contains core types for API configuration and responses.
 * @module types/base
 */

/**
 * Conflux network target types.
 * Specifies which network environment to interact with.
 *
 * @typedef {string} ConfluxTarget
 *
 * @property {"mainnet"} mainnet - Main network
 * @property {"testnet"} testnet - Test network
 */
export type ConfluxTarget = "mainnet" | "testnet";

/**
 * API configuration options.
 * Contains settings for connecting to the Conflux eSpace Scanner API.
 *
 * @interface ApiConfig
 */
export interface ApiConfig {
  /** Target network environment */
  target: ConfluxTarget;
  /** API key for authentication */
  apiKey?: string;
  /** Custom API host URL */
  host?: string;
}

/**
 * Generic API Response type used across all endpoints.
 * Wraps the response data with status information.
 *
 * @interface ApiResponse
 * @template T - The type of the response result data
 */
export interface ApiResponse<T> {
  /** Response status code */
  status: string;
  /** Response status message or error description */
  message: string;
  /** API response result data */
  result: T;
}
