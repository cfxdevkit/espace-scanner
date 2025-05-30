/**
 * @packageDocumentation
 * Block-related wrapper module for the Conflux eSpace Scanner SDK.
 * Provides high-level methods for block operations with data formatting.
 * @module wrapper/modules/block
 * @category Wrappers
 */

import { BaseWrapper } from "../base";
import { ApiConfig, Block } from "../../types";
import { BlockModule } from "../../core/modules";
export class BlockWrapper extends BaseWrapper {
  /**
   * Get block number by Unix timestamp
   */
  private block: BlockModule;
  constructor(config: ApiConfig = { target: "mainnet" }) {
    super();
    this.block = new BlockModule(config);
  }
  async getBlockNumberByTime(
    params: Block.BlockNumberByTimeParams,
    returnRaw: boolean = false
  ): Promise<string> {
    const data = await this.block.getBlockNumberByTime(params);
    if (returnRaw) return data;
    return data;
  }
}
