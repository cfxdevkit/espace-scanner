import { ApiConfig } from "../types/api";
import { createLogger } from "../utils/logger";

/**
 * Base API class for making HTTP requests to the Conflux eSpace API.
 * Provides common functionality for API endpoints.
 */
export class ESpaceApi {
  protected baseUrl: string;
  protected apiKey?: string;
  protected logger = createLogger("ESpaceApi");

  constructor({ target = "mainnet", apiKey, host }: ApiConfig = {}) {
    const defaultMainnetHost = "https://evmapi.confluxscan.io";
    const defaultTestnetHost = "https://evmapi-testnet.confluxscan.io";
    const defaultHost = target === "mainnet" ? defaultMainnetHost : defaultTestnetHost;
    this.baseUrl = host || defaultHost;
    this.apiKey = apiKey;
    this.logger.debug({ target, host: this.baseUrl }, "API instance initialized");
  }

  /**
   * Make an API request with the given parameters
   * @param endpoint API endpoint
   * @param params Query parameters
   * @returns API response
   */
  protected async fetchApi<T>(
    endpoint: string,
    params: Record<string, string | number | boolean | null | undefined> = {}
  ): Promise<{ result: T }> {
    // Filter out undefined and null values
    const validParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value != null)
    ) as Record<string, string | number | boolean>;

    const queryParams = new URLSearchParams();
    Object.entries(validParams).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    if (this.apiKey) {
      queryParams.append("apiKey", this.apiKey);
    }

    const url = `${this.baseUrl}${endpoint}${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    this.logger.debug({ url: url }, "Making API request");
    const response = await fetch(url, { headers: {} });

    if (!response.ok) {
      this.logger.error(
        {
          status: response.status,
          statusText: response.statusText,
          endpoint,
          params: validParams,
        },
        "API request failed"
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      this.logger.error(
        {
          endpoint,
          params: validParams,
          error: data.error.message,
        },
        "API returned error"
      );
      throw new Error(`API error: ${data.error.message}`);
    }

    this.logger.debug({ endpoint, responseStatus: data.status }, "API request successful");
    return data;
  }

  /**
   * Get current timestamp in seconds
   * @returns Current timestamp
   */
  protected getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Get timestamp from 24 hours ago
   * @returns Timestamp from 24 hours ago
   */
  protected get24HoursAgo(): number {
    return this.getCurrentTimestamp() - 24 * 60 * 60;
  }
}
