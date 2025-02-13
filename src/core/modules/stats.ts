import { ESpaceApi } from "../api";
import { AddressValidator } from "../../utils";
import { createLogger } from "../../utils/logger";
import {
  StatsResponse,
  TopStatsResponse,
  StatsParams,
  StatsPeriod,
  BasicStatItem,
  TokenHolderStatItem,
  TokenUniqueStatItem,
  BlockStatItem,
  TpsStatItem,
} from "../../types";
import { ApiConfig } from "../../types/api";

/**
 * Module for interacting with statistics-related endpoints of the Conflux eSpace Scanner API.
 * Provides methods for fetching various statistics about accounts, transactions, tokens, and blocks.
 */
export class StatsModule extends ESpaceApi {
  protected logger = createLogger("StatsModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Base method for fetching statistics data
   * @param endpoint - API endpoint to fetch data from
   * @param params - Optional parameters for the request
   * @returns Promise resolving to the statistics data
   * @internal
   */
  protected async getBasicStats<T>(endpoint: string, params: StatsParams = {}): Promise<T> {
    this.logger.debug({ endpoint, params }, "Getting basic stats");
    const fetchParams = {
      minTimestamp: params.minTimestamp || this.get24HoursAgo(),
      maxTimestamp: params.maxTimestamp || this.getCurrentTimestamp(),
      sort: params.sort || "DESC",
      skip: params.skip || 0,
      limit: params.limit || 10,
      ...params,
    };

    const response = await this.fetchApi<T>(endpoint, fetchParams);
    if (!response.result) {
      this.logger.error({ endpoint }, "No result returned for stats");
      throw new Error(`No result returned for ${endpoint}`);
    }
    this.logger.debug({ endpoint }, "Successfully retrieved basic stats");
    return response.result;
  }

  /**
   * Base method for fetching top statistics data
   * @param endpoint - API endpoint to fetch data from
   * @param spanType - Time period for the statistics
   * @returns Promise resolving to the top statistics data
   * @internal
   */
  protected async getTopStats<T>(endpoint: string, spanType: StatsPeriod = "24h"): Promise<T> {
    this.logger.debug({ endpoint, spanType }, "Getting top stats");
    const response = await this.fetchApi<T>(endpoint, { spanType });
    if (!response.result) {
      this.logger.error({ endpoint }, "No result returned for top stats");
      throw new Error(`No result returned for ${endpoint}`);
    }
    this.logger.debug({ endpoint }, "Successfully retrieved top stats");
    return response.result;
  }

  /**
   * Get active account statistics
   * @param params - Optional parameters for filtering and pagination
   * @returns Promise resolving to active account statistics
   */
  async getActiveAccountStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/account/active", params);
  }

  /**
   * Get CFX holder statistics
   * @param params - Optional parameters for filtering and pagination
   * @returns Promise resolving to CFX holder statistics
   */
  async getCfxHolderStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>(
      "/statistics/account/cfx/holder",
      params
    );
  }

  async getAccountGrowthStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/account/growth", params);
  }

  async getContractStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/contract", params);
  }

  async getTransactionStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/transaction", params);
  }

  async getCfxTransferStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/cfx/transfer", params);
  }

  async getTpsStats(params: StatsParams = {}): Promise<StatsResponse<TpsStatItem>> {
    return this.getBasicStats<StatsResponse<TpsStatItem>>("/statistics/tps", params);
  }

  // Top statistics methods
  async getTopGasUsed(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/gas/used", spanType);
  }

  async getTopTransactionSenders(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/transaction/sender", spanType);
  }

  async getTopTransactionReceivers(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/transaction/receiver", spanType);
  }

  async getTopCfxSenders(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/cfx/sender", spanType);
  }

  async getTopCfxReceivers(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/cfx/receiver", spanType);
  }

  async getTopTokenTransfers(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/token/transfer", spanType);
  }

  async getTopTokenSenders(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/token/sender", spanType);
  }

  async getTopTokenReceivers(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/token/receiver", spanType);
  }

  async getTopTokenParticipants(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/token/participant", spanType);
  }

  async getTopMiner(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/miner", spanType);
  }

  // Token statistics methods
  async getTokenHolderStats(
    contract: string,
    params: StatsParams = {}
  ): Promise<StatsResponse<TokenHolderStatItem>> {
    if (!AddressValidator.validateAddress(contract)) {
      throw new Error(`Invalid contract address: ${contract}`);
    }
    return this.getBasicStats<StatsResponse<TokenHolderStatItem>>("/statistics/token/holder", {
      contract,
      ...params,
    });
  }

  async getTokenUniqueSenderStats(
    contract: string,
    params: StatsParams = {}
  ): Promise<StatsResponse<TokenUniqueStatItem>> {
    if (!AddressValidator.validateAddress(contract)) {
      throw new Error(`Invalid contract address: ${contract}`);
    }
    return this.getBasicStats<StatsResponse<TokenUniqueStatItem>>(
      "/statistics/token/unique/sender",
      {
        contract,
        ...params,
      }
    );
  }

  async getTokenUniqueReceiverStats(
    contract: string,
    params: StatsParams = {}
  ): Promise<StatsResponse<TokenUniqueStatItem>> {
    if (!AddressValidator.validateAddress(contract)) {
      throw new Error(`Invalid contract address: ${contract}`);
    }
    return this.getBasicStats<StatsResponse<TokenUniqueStatItem>>(
      "/statistics/token/unique/receiver",
      {
        contract,
        ...params,
      }
    );
  }

  async getTokenUniqueParticipantStats(
    contract: string,
    params: StatsParams = {}
  ): Promise<StatsResponse<TokenUniqueStatItem>> {
    if (!AddressValidator.validateAddress(contract)) {
      throw new Error(`Invalid contract address: ${contract}`);
    }
    return this.getBasicStats<StatsResponse<TokenUniqueStatItem>>(
      "/statistics/token/unique/participant",
      {
        contract,
        ...params,
      }
    );
  }

  // Block statistics methods
  async getBlockBaseFeeStats(params: StatsParams = {}): Promise<StatsResponse<BlockStatItem>> {
    return this.getBasicStats<StatsResponse<BlockStatItem>>("/statistics/block/base-fee", params);
  }

  async getBlockGasUsedStats(params: StatsParams = {}): Promise<StatsResponse<BlockStatItem>> {
    return this.getBasicStats<StatsResponse<BlockStatItem>>("/statistics/block/gas-used", params);
  }

  async getBlockAvgPriorityFeeStats(
    params: StatsParams = {}
  ): Promise<StatsResponse<BlockStatItem>> {
    return this.getBasicStats<StatsResponse<BlockStatItem>>(
      "/statistics/block/avg-priority-fee",
      params
    );
  }

  async getBlockTxsByTypeStats(params: StatsParams = {}): Promise<StatsResponse<BlockStatItem>> {
    return this.getBasicStats<StatsResponse<BlockStatItem>>(
      "/statistics/block/txs-by-type",
      params
    );
  }

  async getSupplyStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/supply", params);
  }

  async getMiningStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/mining", params);
  }

  async getActiveAccountOverallStats(
    params: StatsParams = {}
  ): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>(
      "/statistics/account/active/overall",
      params
    );
  }

  async getTokenTransferStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/token/transfer", params);
  }
}
