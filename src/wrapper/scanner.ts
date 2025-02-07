import { ESpaceScanner } from "../core";
import { ResponseFormatter } from "../formatters";
import {
  TokenData,
  ESpaceStatsParams,
  StatsPeriod,
  ContractABIResponse,
  ContractSourceResponse,
  TokenListResponse,
  ESpaceStatsResponse,
  ESpaceTopStatsResponse,
} from "../types";
import { ApiConfig, FormattedResponse } from "../types/api";

export class ESpaceScannerWrapper {
  private scanner: ESpaceScanner;

  constructor(config: ApiConfig = {}) {
    this.scanner = new ESpaceScanner(config);
  }

  // Contract methods
  async getContractABI(
    address: string
  ): Promise<FormattedResponse<ContractABIResponse, ContractABIResponse>> {
    const data = await this.scanner.getContractABI(address);
    return ResponseFormatter.wrapResponse(data, data);
  }

  async getContractSourceCode(
    address: string
  ): Promise<FormattedResponse<ContractSourceResponse, ContractSourceResponse>> {
    const data = await this.scanner.getContractSourceCode(address);
    return ResponseFormatter.wrapResponse(data, data);
  }

  // Token methods
  async getAccountTokens(
    address: string,
    tokenType: "ERC20" | "ERC721" | "ERC1155" = "ERC20",
    skip = 0,
    limit = 10
  ): Promise<FormattedResponse<TokenListResponse, TokenData[]>> {
    const tokens = await this.scanner.getAccountTokens(address, tokenType, skip, limit);
    const formattedTokens = tokens.map((token) => ({
      ...token,
      amount: token.amount ? ResponseFormatter.formatUnit(token.amount, token.decimals) : "0",
      priceInUSDT: token.priceInUSDT ? `$${Number(token.priceInUSDT).toFixed(4)}` : undefined,
    }));
    return ResponseFormatter.wrapResponse({ list: tokens, total: tokens.length }, formattedTokens);
  }

  // Statistics methods
  async getActiveAccountStats(
    params: ESpaceStatsParams = {}
  ): Promise<
    FormattedResponse<
      ESpaceStatsResponse,
      { total: number; list: { statTime: string | number; count: string }[] }
    >
  > {
    const data = await this.scanner.getActiveAccountStats(params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getCfxHolderStats(
    params: ESpaceStatsParams = {}
  ): Promise<
    FormattedResponse<
      ESpaceStatsResponse,
      { total: number; list: { statTime: string | number; count: string }[] }
    >
  > {
    const data = await this.scanner.getCfxHolderStats(params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getAccountGrowthStats(
    params: ESpaceStatsParams = {}
  ): Promise<
    FormattedResponse<
      ESpaceStatsResponse,
      { total: number; list: { statTime: string | number; count: string }[] }
    >
  > {
    const data = await this.scanner.getAccountGrowthStats(params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getContractStats(params: ESpaceStatsParams = {}): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getContractStats(params);
    return ResponseFormatter.wrapResponse(
      data,
      data.list?.map((item) => ResponseFormatter.formatStatItem(item)).join("\n\n") ||
        "No data available"
    );
  }

  async getTransactionStats(params: ESpaceStatsParams = {}): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getTransactionStats(params);
    return ResponseFormatter.wrapResponse(
      data,
      data.list?.map((item) => ResponseFormatter.formatStatItem(item)).join("\n\n") ||
        "No data available"
    );
  }

  async getCfxTransferStats(params: ESpaceStatsParams = {}): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getCfxTransferStats(params);
    return ResponseFormatter.wrapResponse(
      data,
      data.list?.map((item) => ResponseFormatter.formatStatItem(item)).join("\n\n") ||
        "No data available"
    );
  }

  async getTpsStats(
    params: ESpaceStatsParams = {}
  ): Promise<
    FormattedResponse<
      ESpaceStatsResponse,
      { total: number; list: { statTime: string | number; tps: string }[]; intervalType?: string }
    >
  > {
    const data = await this.scanner.getTpsStats(params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        tps: Number(item.tps).toFixed(4),
      })),
      intervalType: data.intervalType,
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  // Top statistics methods
  async getTopGasUsed(
    spanType: StatsPeriod
  ): Promise<
    FormattedResponse<
      ESpaceTopStatsResponse,
      { gasTotal: string; list: { address: string; gas: string }[] }
    >
  > {
    const data = await this.scanner.getTopGasUsed(spanType);
    const formattedData = {
      gasTotal: ResponseFormatter.formatGas(data.gasTotal),
      list: data.list.map((item) => ({
        address: item.address,
        gas: ResponseFormatter.formatGas(item.gas),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTopTransactionSenders(
    spanType: StatsPeriod
  ): Promise<
    FormattedResponse<
      ESpaceTopStatsResponse,
      { maxTime?: string; valueTotal: string; list: { address: string; value: string }[] }
    >
  > {
    const data = await this.scanner.getTopTransactionSenders(spanType);
    const formattedData = {
      maxTime: data.maxTime,
      valueTotal: ResponseFormatter.formatNumber(data.valueTotal),
      list: data.list.map((item) => ({
        address: item.address,
        value: ResponseFormatter.formatNumber(item.value),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTopTransactionReceivers(spanType: StatsPeriod): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getTopTransactionReceivers(spanType);
    const formattedData = {
      maxTime: data.maxTime,
      valueTotal: ResponseFormatter.formatNumber(data.valueTotal),
      list: data.list.map((item) => ({
        address: item.address,
        value: ResponseFormatter.formatNumber(item.value),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTopCfxSenders(spanType: StatsPeriod): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getTopCfxSenders(spanType);
    const formattedData = {
      maxTime: data.maxTime,
      valueTotal: ResponseFormatter.formatCFX(data.valueTotal),
      list: data.list.map((item) => ({
        address: item.address,
        value: ResponseFormatter.formatCFX(item.value),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTopCfxReceivers(spanType: StatsPeriod): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getTopCfxReceivers(spanType);
    const formattedData = {
      maxTime: data.maxTime,
      valueTotal: ResponseFormatter.formatCFX(data.valueTotal),
      list: data.list.map((item) => ({
        address: item.address,
        value: ResponseFormatter.formatCFX(item.value),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTopTokenTransfers(spanType: StatsPeriod): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getTopTokenTransfers(spanType);
    const formattedData = {
      maxTime: data.maxTime,
      list: data.list.map((item) => ({
        address: item.address,
        transferCntr: ResponseFormatter.formatNumber(item.transferCntr),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTopTokenSenders(spanType: StatsPeriod): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getTopTokenSenders(spanType);
    const formattedData = {
      maxTime: data.maxTime,
      list: data.list.map((item) => ({
        address: item.address,
        transferCntr: ResponseFormatter.formatNumber(item.transferCntr),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTopTokenReceivers(spanType: StatsPeriod): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getTopTokenReceivers(spanType);
    const formattedData = {
      maxTime: data.maxTime,
      list: data.list.map((item) => ({
        address: item.address,
        transferCntr: ResponseFormatter.formatNumber(item.transferCntr),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTopTokenParticipants(spanType: StatsPeriod): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getTopTokenParticipants(spanType);
    const formattedData = {
      maxTime: data.maxTime,
      list: data.list.map((item) => ({
        address: item.address,
        transferCntr: ResponseFormatter.formatNumber(item.transferCntr),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  // Token statistics methods
  async getTokenHolderStats(
    contract: string,
    params: ESpaceStatsParams = {}
  ): Promise<
    FormattedResponse<
      ESpaceStatsResponse,
      { total: number; list: { statTime: string | number; holderCount: string }[] }
    >
  > {
    const data = await this.scanner.getTokenHolderStats(contract, params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        holderCount: ResponseFormatter.formatNumber(item.holderCount),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTokenUniqueSenderStats(
    contract: string,
    params: ESpaceStatsParams = {}
  ): Promise<
    FormattedResponse<
      ESpaceStatsResponse,
      { total: number; list: { statTime: string | number; uniqueSenderCount: string }[] }
    >
  > {
    const data = await this.scanner.getTokenUniqueSenderStats(contract, params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        uniqueSenderCount: ResponseFormatter.formatNumber(item.uniqueSenderCount),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTokenUniqueReceiverStats(
    contract: string,
    params: ESpaceStatsParams = {}
  ): Promise<
    FormattedResponse<
      ESpaceStatsResponse,
      { total: number; list: { statTime: string | number; uniqueReceiverCount: string }[] }
    >
  > {
    const data = await this.scanner.getTokenUniqueReceiverStats(contract, params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        uniqueReceiverCount: ResponseFormatter.formatNumber(item.uniqueReceiverCount),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getTokenUniqueParticipantStats(
    contract: string,
    params: ESpaceStatsParams = {}
  ): Promise<
    FormattedResponse<
      ESpaceStatsResponse,
      { total: number; list: { statTime: string | number; uniqueParticipantCount: string }[] }
    >
  > {
    const data = await this.scanner.getTokenUniqueParticipantStats(contract, params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        uniqueParticipantCount: ResponseFormatter.formatNumber(item.uniqueParticipantCount),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  // Block statistics methods
  async getBlockBaseFeeStats(params: ESpaceStatsParams = {}): Promise<
    FormattedResponse<
      ESpaceStatsResponse,
      {
        total: number;
        list: { blockNumber: string | number; timestamp: string; baseFee: string }[];
      }
    >
  > {
    const data = await this.scanner.getBlockBaseFeeStats(params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        blockNumber: item.blockNumber,
        timestamp: new Date(Number(item.timestamp) * 1000).toISOString(),
        baseFee: ResponseFormatter.formatGas(item.baseFee),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getBlockAvgPriorityFeeStats(
    params: ESpaceStatsParams = {}
  ): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getBlockAvgPriorityFeeStats(params);
    return ResponseFormatter.wrapResponse(
      data,
      data.list?.map((item) => ResponseFormatter.formatStatItem(item)).join("\n\n") ||
        "No data available"
    );
  }

  async getBlockGasUsedStats(params: ESpaceStatsParams = {}): Promise<
    FormattedResponse<
      ESpaceStatsResponse,
      {
        total: number;
        list: { blockNumber: string | number; timestamp: string; gasUsed: string }[];
      }
    >
  > {
    const data = await this.scanner.getBlockGasUsedStats(params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        blockNumber: item.blockNumber,
        timestamp: new Date(Number(item.timestamp) * 1000).toISOString(),
        gasUsed: ResponseFormatter.formatGas(item.gasUsed),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }

  async getBlockTxsByTypeStats(
    params: ESpaceStatsParams = {}
  ): Promise<FormattedResponse<unknown>> {
    const data = await this.scanner.getBlockTxsByTypeStats(params);
    const formattedData = {
      total: data.total,
      list: data.list.map((item) => ({
        ...item,
        txsInType: Object.entries(item.txsInType || {}).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: ResponseFormatter.formatNumber(value),
          }),
          {}
        ),
      })),
    };
    return ResponseFormatter.wrapResponse(data, formattedData);
  }
}
