import { ApiConfig, ESpaceApiResponse } from "../types/api";

export class ESpaceApi {
  protected baseUrl: string;
  protected apiKey?: string;

  constructor({ target = "mainnet", apiKey, host }: ApiConfig = {}) {
    const defaultMainnetHost = "https://evmapi.confluxscan.io";
    const defaultTestnetHost = "https://evmapi-testnet.confluxscan.io";
    const defaultHost = target === "mainnet" ? defaultMainnetHost : defaultTestnetHost;
    this.baseUrl = host || defaultHost;
    this.apiKey = apiKey;
  }

  protected async fetchApi<T>(
    endpoint: string,
    params: Record<string, string | number | boolean> = {}
  ): Promise<ESpaceApiResponse<T>> {
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

      console.info(`Fetching ${url.toString()}`);
      const response = await fetch(url.toString(), { headers: {} });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "0") {
        throw new Error(`API error: ${data.message || "Unknown error"}`);
      }
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
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
