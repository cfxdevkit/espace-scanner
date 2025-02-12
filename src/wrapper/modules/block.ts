import { BaseWrapper } from "../base";

export class BlockWrapper extends BaseWrapper {
  /**
   * Get block number by Unix timestamp with optional formatting
   */
  async getBlockNumberByTime(
    timestamp: number,
    closest: "before" | "after" = "before",
    returnRaw: boolean = false
  ): Promise<string | number> {
    const data = await this.scanner.block.getBlockNumberByTime(timestamp, closest);
    if (returnRaw) return data;
    return Number(data);
  }
}
