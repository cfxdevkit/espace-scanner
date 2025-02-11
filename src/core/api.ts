import { ApiConfig, ApiResponse } from "../types/api";
import { createLogger } from "../utils/logger";

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

  protected async fetchApi<T>(
    endpoint: string,
    params: Record<string, string | number | boolean> = {}
  ): Promise<ApiResponse<T>> {
    try {
      let url: URL;
      if (endpoint === "/api") {
        // Module/action pattern
        url = new URL(endpoint, this.baseUrl);
      } else {
        // Direct path pattern
        url = new URL(endpoint, this.baseUrl);
      }

      const fetchParams = { ...params };
      if (this.apiKey) {
        fetchParams.apiKey = this.apiKey;
      }
      Object.entries(fetchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });

      this.logger.debug({ url: url.toString(), params: fetchParams }, "Making API request");
      const response = await fetch(url.toString(), { headers: {} });

      if (!response.ok) {
        this.logger.error(
          {
            status: response.status,
            statusText: response.statusText,
            endpoint,
            params: fetchParams,
          },
          "API request failed"
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "0") {
        this.logger.error(
          {
            endpoint,
            params: fetchParams,
            error: data.message,
          },
          "API returned error status"
        );
        throw new Error(`API error: ${data.message || "Unknown error"}`);
      }

      this.logger.debug({ endpoint, responseStatus: data.status }, "API request successful");
      return data;
    } catch (error) {
      this.logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          endpoint,
          params,
        },
        "Error in API request"
      );
      throw error;
    }
  }

  protected getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  protected get24HoursAgo(): number {
    return this.getCurrentTimestamp() - 24 * 60 * 60;
  }
}
