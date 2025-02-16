import { ApiConfig, ApiResponse } from "../types";
import { createLogger } from "../utils/logger";

/**
 * Base API class for making HTTP requests to the Conflux eSpace API.
 * Provides common functionality for API endpoints.
 */
export class ESpaceApi {
  protected baseUrl: string;
  protected apiKey?: string;
  protected logger = createLogger("ESpaceApi");

  constructor({ target = "mainnet", apiKey, host }: ApiConfig = { target: "mainnet" }) {
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
  ): Promise<ApiResponse<T>> {
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
    if (Number(data.status) !== 1) {
      this.logger.error(
        {
          endpoint,
          params: validParams,
          error: data.message,
        },
        "API returned error"
      );
    }
    this.logger.debug({ endpoint, responseStatus: data.status }, "API request successful");
    return data;
  }
}
