import { ESpaceApi } from "../api";
import { createLogger } from "../../utils/logger";
import { ApiConfig } from "../../types";
import { Block } from "../../types";
export class BlockModule extends ESpaceApi {
  protected logger = createLogger("BlockModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get block number by Unix timestamp
   */
  async getBlockNumberByTime(
    params: Block.BlockNumberByTimeParams
  ): Promise<Block.BlockNumberByTime> {
    this.logger.debug({ params }, "Getting block number by timestamp");

    if (typeof params.timestamp !== "number" || params.timestamp < 0) {
      this.logger.error({ params }, "Invalid timestamp provided");
      throw new Error(`Invalid timestamp: ${params.timestamp}`);
    }

    const response = await this.fetchApi<Block.BlockNumberByTime>("/api", {
      module: "block",
      action: "getblocknobytime",
      timestamp: Math.floor(params.timestamp),
      closest: params.closest,
    });

    if (!response.result) {
      this.logger.error({ params }, "No block number found for timestamp");
      throw new Error(`No block number found for timestamp: ${params.timestamp}`);
    }

    return response.result;
  }
}
