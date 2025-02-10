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
import { ApiConfig } from "../types/api";

export class ESpaceScannerWrapper {
  private scanner: ESpaceScanner;

  constructor(config: ApiConfig = {}) {
    this.scanner = new ESpaceScanner(config);
  }

  // Contract methods
  async getContractABI(address: string, _returnRaw: boolean = false): Promise<ContractABIResponse> {
    const data = await this.scanner.getContractABI(address);
    return data;
  }

  async getContractSourceCode(
    address: string,
    _returnRaw: boolean = false
  ): Promise<ContractSourceResponse> {
    const data = await this.scanner.getContractSourceCode(address);
    return data;
  }

  // Token methods
  async getAccountTokens(
    address: string,
    tokenType: "ERC20" | "ERC721" | "ERC1155" = "ERC20",
    skip = 0,
    limit = 10,
    returnRaw: boolean = false
  ): Promise<TokenListResponse | TokenData[]> {
    const tokens = await this.scanner.getAccountTokens(address, tokenType, skip, limit);
    if (returnRaw) {
      return { list: tokens, total: tokens.length };
    }
    return tokens.map((token) => ({
      ...token,
      amount: token.amount ? ResponseFormatter.formatUnit(token.amount, token.decimals) : "0",
      priceInUSDT: token.priceInUSDT ? `$${Number(token.priceInUSDT).toFixed(4)}` : undefined,
    }));
  }

  // Statistics methods
  async getActiveAccountStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | { total: string | number; list: { statTime: string | number; count: string }[] }
  > {
    const data = await this.scanner.getActiveAccountStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
  }

  async getCfxHolderStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    ESpaceStatsResponse | { total: number; list: { statTime: string | number; count: string }[] }
  > {
    const data = await this.scanner.getCfxHolderStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
  }

  async getAccountGrowthStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | { total: string | number; list: { statTime: string | number; count: string }[] }
  > {
    const data = await this.scanner.getAccountGrowthStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
  }

  async getContractStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<ESpaceStatsResponse | string> {
    const data = await this.scanner.getContractStats(params);
    if (returnRaw) return data;
    return (
      data.list?.map((item) => ResponseFormatter.formatStatItem(item)).join("\n\n") ||
      "No data available"
    );
  }

  async getTransactionStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<ESpaceStatsResponse | string> {
    const data = await this.scanner.getTransactionStats(params);
    if (returnRaw) return data;
    return (
      data.list?.map((item) => ResponseFormatter.formatStatItem(item)).join("\n\n") ||
      "No data available"
    );
  }

  async getCfxTransferStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<ESpaceStatsResponse | string> {
    const data = await this.scanner.getCfxTransferStats(params);
    if (returnRaw) return data;
    return (
      data.list?.map((item) => ResponseFormatter.formatStatItem(item)).join("\n\n") ||
      "No data available"
    );
  }

  async getTpsStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | { total: number; list: { statTime: string | number; tps: string }[]; intervalType?: string }
  > {
    const data = await this.scanner.getTpsStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        tps: Number(item.tps).toFixed(4),
      })),
      intervalType: data.intervalType,
    };
  }

  // Top statistics methods
  async getTopGasUsed(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<
    ESpaceTopStatsResponse | { gasTotal: string; list: { address: string; gas: string }[] }
  > {
    const data = await this.scanner.getTopGasUsed(spanType);
    if (returnRaw) return data;
    return {
      gasTotal: ResponseFormatter.formatGas(data.gasTotal),
      list: data.list.map((item) => ({
        address: item.address,
        gas: ResponseFormatter.formatGas(item.gas),
      })),
    };
  }

  async getTopTransactionSenders(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<
    | ESpaceTopStatsResponse
    | { maxTime?: string; valueTotal: string; list: { address: string; value: string }[] }
  > {
    const data = await this.scanner.getTopTransactionSenders(spanType);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime,
      valueTotal: ResponseFormatter.formatNumber(data.valueTotal),
      list: data.list.map((item) => ({
        address: item.address,
        value: ResponseFormatter.formatNumber(item.value),
      })),
    };
  }

  async getTopTransactionReceivers(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<
    | ESpaceTopStatsResponse
    | { maxTime?: string; valueTotal: string; list: { address: string; value: string }[] }
  > {
    const data = await this.scanner.getTopTransactionReceivers(spanType);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime,
      valueTotal: ResponseFormatter.formatNumber(data.valueTotal),
      list: data.list.map((item) => ({
        address: item.address,
        value: ResponseFormatter.formatNumber(item.value),
      })),
    };
  }

  async getTopCfxSenders(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<
    | ESpaceTopStatsResponse
    | { maxTime?: string; valueTotal: string; list: { address: string; value: string }[] }
  > {
    const data = await this.scanner.getTopCfxSenders(spanType);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime,
      valueTotal: ResponseFormatter.formatCFX(data.valueTotal),
      list: data.list.map((item) => ({
        address: item.address,
        value: ResponseFormatter.formatCFX(item.value),
      })),
    };
  }

  async getTopCfxReceivers(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<
    | ESpaceTopStatsResponse
    | { maxTime?: string; valueTotal: string; list: { address: string; value: string }[] }
  > {
    const data = await this.scanner.getTopCfxReceivers(spanType);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime,
      valueTotal: ResponseFormatter.formatCFX(data.valueTotal),
      list: data.list.map((item) => ({
        address: item.address,
        value: ResponseFormatter.formatCFX(item.value),
      })),
    };
  }

  async getTopTokenTransfers(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<
    ESpaceTopStatsResponse | { maxTime?: string; list: { address: string; transferCntr: string }[] }
  > {
    const data = await this.scanner.getTopTokenTransfers(spanType);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime,
      list: data.list.map((item) => ({
        address: item.address,
        transferCntr: ResponseFormatter.formatNumber(item.transferCntr),
      })),
    };
  }

  async getTopTokenSenders(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<
    ESpaceTopStatsResponse | { maxTime?: string; list: { address: string; transferCntr: string }[] }
  > {
    const data = await this.scanner.getTopTokenSenders(spanType);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime,
      list: data.list.map((item) => ({
        address: item.address,
        transferCntr: ResponseFormatter.formatNumber(item.transferCntr),
      })),
    };
  }

  async getTopTokenReceivers(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<
    ESpaceTopStatsResponse | { maxTime?: string; list: { address: string; transferCntr: string }[] }
  > {
    const data = await this.scanner.getTopTokenReceivers(spanType);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime,
      list: data.list.map((item) => ({
        address: item.address,
        transferCntr: ResponseFormatter.formatNumber(item.transferCntr),
      })),
    };
  }

  async getTopTokenParticipants(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<
    ESpaceTopStatsResponse | { maxTime?: string; list: { address: string; transferCntr: string }[] }
  > {
    const data = await this.scanner.getTopTokenParticipants(spanType);
    if (returnRaw) return data;
    return {
      maxTime: data.maxTime,
      list: data.list.map((item) => ({
        address: item.address,
        transferCntr: ResponseFormatter.formatNumber(item.transferCntr),
      })),
    };
  }

  // Token statistics methods
  async getTokenHolderStats(
    contract: string,
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | { total: number; list: { statTime: string | number; holderCount: string }[] }
  > {
    const data = await this.scanner.getTokenHolderStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        holderCount: ResponseFormatter.formatNumber(item.holderCount),
      })),
    };
  }

  async getTokenUniqueSenderStats(
    contract: string,
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | { total: number; list: { statTime: string | number; uniqueSenderCount: string }[] }
  > {
    const data = await this.scanner.getTokenUniqueSenderStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        uniqueSenderCount: ResponseFormatter.formatNumber(item.uniqueSenderCount),
      })),
    };
  }

  async getTokenUniqueReceiverStats(
    contract: string,
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | { total: number; list: { statTime: string | number; uniqueReceiverCount: string }[] }
  > {
    const data = await this.scanner.getTokenUniqueReceiverStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        uniqueReceiverCount: ResponseFormatter.formatNumber(item.uniqueReceiverCount),
      })),
    };
  }

  async getTokenUniqueParticipantStats(
    contract: string,
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | { total: number; list: { statTime: string | number; uniqueParticipantCount: string }[] }
  > {
    const data = await this.scanner.getTokenUniqueParticipantStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        uniqueParticipantCount: ResponseFormatter.formatNumber(item.uniqueParticipantCount),
      })),
    };
  }

  // Block statistics methods
  async getBlockBaseFeeStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | {
        total: string | number;
        list: { blockNumber: string | number; timestamp: string | number; baseFee: string }[];
      }
  > {
    const data = await this.scanner.getBlockBaseFeeStats(params);
    if (returnRaw) return data;
    return {
      total: ResponseFormatter.formatGas(data.total),
      list: data.list.map((item) => ({
        blockNumber: item.blockNumber,
        timestamp: ResponseFormatter.formatTimestamp(item.timestamp),
        baseFee: ResponseFormatter.formatGas(item.baseFee),
      })),
    };
  }

  async getBlockAvgPriorityFeeStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | {
        total: string | number;
        list: {
          blockNumber: string | number;
          timestamp: string | number;
          avgPriorityFee: string;
        }[];
      }
  > {
    const data = await this.scanner.getBlockAvgPriorityFeeStats(params);
    if (returnRaw) return data;
    return {
      total: ResponseFormatter.formatGas(data.total),
      list: data.list.map((item) => ({
        blockNumber: item.blockNumber,
        timestamp: ResponseFormatter.formatTimestamp(item.timestamp),
        avgPriorityFee: ResponseFormatter.formatGas(item.avgPriorityFee),
      })),
    };
  }

  async getBlockGasUsedStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | {
        total: string | number;
        list: { blockNumber: string | number; timestamp: string | number; gasUsed: string }[];
      }
  > {
    const data = await this.scanner.getBlockGasUsedStats(params);
    if (returnRaw) return data;
    return {
      total: ResponseFormatter.formatGas(data.total),
      list: data.list.map((item) => ({
        blockNumber: item.blockNumber,
        timestamp: ResponseFormatter.formatTimestamp(item.timestamp),
        gasUsed: ResponseFormatter.formatGas(item.gasUsed),
      })),
    };
  }

  async getBlockTxsByTypeStats(
    params: ESpaceStatsParams = {},
    returnRaw: boolean = false
  ): Promise<
    | ESpaceStatsResponse
    | {
        total: string | number;
        list: { statTime: string | number; txsInType: Record<string, string> }[];
      }
  > {
    const data = await this.scanner.getBlockTxsByTypeStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: item.statTime,
        txsInType: Object.entries(item.txsInType || {}).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: ResponseFormatter.formatNumber(value),
          }),
          {}
        ),
      })),
    };
  }
}
