import { BaseWrapper } from "../base";
import {
  StatsResponse,
  TopStatsResponse,
  BasicStatItem,
  TokenHolderStatItem,
  TokenUniqueStatItem,
  BlockStatItem,
  TpsStatItem,
  TopStatsItem,
} from "../../types/responses";
import { StatsParams, StatsPeriod } from "../../types/params";
import { DateFormatter } from "../../formatters/dates";

export class StatsWrapper extends BaseWrapper {
  // Basic statistics methods
  async getActiveAccountStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.stats.getActiveAccountStats(params);
    if (returnRaw) return data;
    return this.formatBasicStats(data);
  }

  async getCfxHolderStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.stats.getCfxHolderStats(params);
    if (returnRaw) return data;
    return this.formatBasicStats(data);
  }

  async getAccountGrowthStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.stats.getAccountGrowthStats(params);
    if (returnRaw) return data;
    return this.formatBasicStats(data);
  }

  async getContractStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.stats.getContractStats(params);
    if (returnRaw) return data;
    return this.formatBasicStats(data);
  }

  async getTransactionStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.stats.getTransactionStats(params);
    if (returnRaw) return data;
    return this.formatBasicStats(data);
  }

  async getCfxTransferStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.stats.getCfxTransferStats(params);
    if (returnRaw) return data;
    return this.formatBasicStats(data);
  }

  async getTpsStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<TpsStatItem>> {
    const data = await this.scanner.stats.getTpsStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: this.formatTimestamp(item.statTime),
        tps: item.tps,
      })),
    };
  }

  // Top statistics methods
  async getTopGasUsed(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
    const data = await this.scanner.stats.getTopGasUsed(spanType);
    if (returnRaw) return data;
    return this.formatTopStats(data, returnRaw);
  }

  async getTopTransactionSenders(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
    const data = await this.scanner.stats.getTopTransactionSenders(spanType);
    if (returnRaw) return data;
    return this.formatTopStats(data, returnRaw);
  }

  async getTopTransactionReceivers(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
    const data = await this.scanner.stats.getTopTransactionReceivers(spanType);
    if (returnRaw) return data;
    return this.formatTopStats(data, returnRaw);
  }

  async getTopCfxSenders(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
    const data = await this.scanner.stats.getTopCfxSenders(spanType);
    if (returnRaw) return data;
    return this.formatTopStats(data, returnRaw);
  }

  async getTopCfxReceivers(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
    const data = await this.scanner.stats.getTopCfxReceivers(spanType);
    if (returnRaw) return data;
    return this.formatTopStats(data, returnRaw);
  }

  async getTopMiner(spanType: StatsPeriod, returnRaw: boolean = false): Promise<TopStatsResponse> {
    const data = await this.scanner.stats.getTopMiner(spanType);
    if (returnRaw) return data;
    return this.formatTopStats(data, returnRaw);
  }

  // Token statistics methods
  async getTokenHolderStats(
    contract: string,
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<TokenHolderStatItem>> {
    const data = await this.scanner.stats.getTokenHolderStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: this.formatTimestamp(item.statTime),
        holderCount: this.formatNumber(item.holderCount),
      })),
    };
  }

  async getTokenUniqueSenderStats(
    contract: string,
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<TokenUniqueStatItem>> {
    const data = await this.scanner.stats.getTokenUniqueSenderStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: this.formatTimestamp(item.statTime),
        uniqueSender: item.uniqueSender ? this.formatNumber(item.uniqueSender) : "0",
      })),
    };
  }

  async getTokenUniqueReceiverStats(
    contract: string,
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<TokenUniqueStatItem>> {
    const data = await this.scanner.stats.getTokenUniqueReceiverStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: this.formatTimestamp(item.statTime),
        uniqueReceiver: item.uniqueReceiver ? this.formatNumber(item.uniqueReceiver) : "0",
      })),
    };
  }

  async getTokenUniqueParticipantStats(
    contract: string,
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<TokenUniqueStatItem>> {
    const data = await this.scanner.stats.getTokenUniqueParticipantStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: this.formatTimestamp(item.statTime),
        uniqueParticipant: item.uniqueParticipant ? this.formatNumber(item.uniqueParticipant) : "0",
      })),
    };
  }

  async getTopTokenTransfers(
    period: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
    const data = await this.scanner.stats.getTopTokenTransfers(period);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime ? DateFormatter.formatDate(Number(data.maxTime), "date") : "N/A",
      valueTotal: this.formatNumber(data.valueTotal || "0"),
      list: data.list.map((item) => ({
        address: item.address,
        value: this.formatNumber(item.value || "0"),
      })),
    };
  }

  async getTopTokenSenders(
    period: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
    const data = await this.scanner.stats.getTopTokenSenders(period);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime ? DateFormatter.formatDate(Number(data.maxTime), "date") : "N/A",
      valueTotal: this.formatNumber(data.valueTotal || "0"),
      list: data.list.map((item) => ({
        address: item.address,
        value: this.formatNumber(item.value || "0"),
      })),
    };
  }

  async getTopTokenReceivers(
    period: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
    const data = await this.scanner.stats.getTopTokenReceivers(period);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime ? DateFormatter.formatDate(Number(data.maxTime), "date") : "N/A",
      valueTotal: this.formatNumber(data.valueTotal || "0"),
      list: data.list.map((item) => ({
        address: item.address,
        value: this.formatNumber(item.value || "0"),
      })),
    };
  }

  async getTopTokenParticipants(
    period: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
    const data = await this.scanner.stats.getTopTokenParticipants(period);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime ? DateFormatter.formatDate(Number(data.maxTime), "date") : "N/A",
      valueTotal: this.formatNumber(data.valueTotal || "0"),
      list: data.list.map((item) => ({
        address: item.address,
        value: this.formatNumber(item.value || "0"),
      })),
    };
  }

  // Block statistics methods
  async getBlockBaseFeeStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BlockStatItem>> {
    const data = await this.scanner.stats.getBlockBaseFeeStats(params);
    if (returnRaw) return data;
    return this.formatBlockStats(data);
  }

  async getBlockGasUsedStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BlockStatItem>> {
    const data = await this.scanner.stats.getBlockGasUsedStats(params);
    if (returnRaw) return data;
    return this.formatBlockStats(data);
  }

  async getBlockAvgPriorityFeeStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BlockStatItem>> {
    const data = await this.scanner.stats.getBlockAvgPriorityFeeStats(params);
    if (returnRaw) return data;
    return this.formatBlockStats(data);
  }

  async getBlockTxsByTypeStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BlockStatItem>> {
    const data = await this.scanner.stats.getBlockTxsByTypeStats(params);
    if (returnRaw) return data;
    return this.formatBlockStats(data);
  }

  // Helper methods
  private formatBasicStats(data: StatsResponse<BasicStatItem>): StatsResponse<BasicStatItem> {
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: this.formatTimestamp(item.statTime),
        count: this.formatNumber(item.count),
      })),
    };
  }

  private formatBlockStats(data: StatsResponse<BlockStatItem>): StatsResponse<BlockStatItem> {
    return {
      total: data.total,
      list: data.list.map((item) => {
        const formatted: BlockStatItem = {
          blockNumber: item.blockNumber,
          timestamp: item.timestamp,
        };
        if (item.baseFee) formatted.baseFee = this.formatNumber(item.baseFee);
        if (item.gasUsed) formatted.gasUsed = this.formatNumber(item.gasUsed);
        if (item.avgPriorityFee) formatted.avgPriorityFee = this.formatNumber(item.avgPriorityFee);
        if (item.txsInType) formatted.txsInType = item.txsInType;
        return formatted;
      }),
    };
  }

  private formatTopStats(data: TopStatsResponse, _returnRaw: boolean = false): TopStatsResponse {
    const formatted: TopStatsResponse = {
      list: data.list.map((item) => {
        const formattedItem: TopStatsItem = {
          address: item.address,
        };
        if (item.gas) formattedItem.gas = this.formatNumber(item.gas);
        if (item.value) formattedItem.value = this.formatNumber(item.value);
        if (item.blockCntr) formattedItem.blockCntr = this.formatNumber(item.blockCntr);
        if (item.rewardSum) formattedItem.rewardSum = this.formatNumber(item.rewardSum);
        if (item.txFeeSum) formattedItem.txFeeSum = this.formatNumber(item.txFeeSum);
        if (item.hashRate) formattedItem.hashRate = this.formatNumber(item.hashRate);
        if (item.transferCntr) formattedItem.transferCntr = this.formatNumber(item.transferCntr);
        if (item.count) formattedItem.count = this.formatNumber(item.count);
        return formattedItem;
      }),
    };

    if (data.maxTime) formatted.maxTime = data.maxTime;
    if (data.difficultyTotal) formatted.difficultyTotal = data.difficultyTotal;
    if (data.gasTotal) formatted.gasTotal = this.formatNumber(data.gasTotal);
    if (data.valueTotal) formatted.valueTotal = this.formatNumber(data.valueTotal);
    if (data.total) formatted.total = data.total;

    return formatted;
  }
}
