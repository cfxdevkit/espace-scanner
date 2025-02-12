import { ESpaceApi } from "../api";
import { createLogger } from "../../utils/logger";
import { ApiConfig } from "../../types/api";

export class BlockModule extends ESpaceApi {
  protected logger = createLogger("BlockModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get block number by Unix timestamp
   */
  async getBlockNumberByTime(
    timestamp: number,
    closest: "before" | "after" = "before"
  ): Promise<string> {
    this.logger.debug({ timestamp, closest }, "Getting block number by timestamp");

    if (typeof timestamp !== "number" || timestamp < 0) {
      this.logger.error({ timestamp }, "Invalid timestamp provided");
      throw new Error(`Invalid timestamp: ${timestamp}`);
    }

    const response = await this.fetchApi<string>("/api", {
      module: "block",
      action: "getblocknobytime",
      timestamp: Math.floor(timestamp),
      closest,
    });

    if (!response.result) {
      this.logger.error({ timestamp, closest }, "No block number found for timestamp");
      throw new Error(`No block number found for timestamp: ${timestamp}`);
    }

    return response.result;
  }
}
