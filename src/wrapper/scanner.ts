/**
 * High-level wrapper for the Conflux eSpace Scanner API.
 * Provides formatted responses and additional data processing on top of the core scanner.
 */
import { ESpaceScanner } from "../core";
import { ResponseFormatter } from "../formatters";
import {
  TokenData,
  StatsParams,
  StatsPeriod,
  ContractABIResponse,
  ContractSourceResponse,
  TokenListResponse,
  StatsResponse,
  TopStatsResponse,
  BasicStatItem,
  TokenHolderStatItem,
  TokenUniqueStatItem,
  BlockStatItem,
  TpsStatItem,
} from "../types";
import { ApiConfig } from "../types/api";

export class ESpaceScannerWrapper {
  private scanner: ESpaceScanner;

  /**
   * Create a new ESpaceScannerWrapper instance
   * @param config API configuration (optional)
   */
  constructor(config: ApiConfig = {}) {
    this.scanner = new ESpaceScanner(config);
  }

  /**
   * Get contract ABI with optional formatting
   * @param address Contract address
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw contract ABI response
   */
  async getContractABI(address: string, _returnRaw: boolean = false): Promise<ContractABIResponse> {
    const data = await this.scanner.getContractABI(address);
    return data;
  }

  /**
   * Get contract source code with optional formatting
   * @param address Contract address
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw contract source code response
   */
  async getContractSourceCode(
    address: string,
    _returnRaw: boolean = false
  ): Promise<ContractSourceResponse> {
    const data = await this.scanner.getContractSourceCode(address);
    return data;
  }

  /**
   * Get account tokens with optional formatting
   * @param address Wallet address
   * @param type Token type (ERC20 or ERC721)
   * @param skip Number of items to skip (default: 0)
   * @param limit Number of items to return (default: 10)
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw token list response
   */
  async getAccountTokens(
    address: string,
    type: "ERC20" | "ERC721",
    skip: number = 0,
    limit: number = 10,
    returnRaw: boolean = false
  ): Promise<TokenListResponse> {
    const response = await this.scanner.getAccountTokens(address, type, skip, limit);
    if (returnRaw) return { list: response, total: response.length };
    return {
      list: response.map((token: TokenData) => ({
        ...token,
        amount: ResponseFormatter.formatUnit(token.amount, token.decimals),
        priceInUSDT: token.priceInUSDT ? `$${token.priceInUSDT}` : undefined,
      })),
      total: response.length,
    };
  }

  /**
   * Get active account statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getActiveAccountStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.getActiveAccountStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
  }

  /**
   * Get CFX holder statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getCfxHolderStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.getCfxHolderStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
  }

  /**
   * Get account growth statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getAccountGrowthStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.getAccountGrowthStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
  }

  /**
   * Get contract statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getContractStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.getContractStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
  }

  /**
   * Get transaction statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getTransactionStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.getTransactionStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
  }

  /**
   * Get CFX transfer statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getCfxTransferStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BasicStatItem>> {
    const data = await this.scanner.getCfxTransferStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        count: ResponseFormatter.formatNumber(item.count),
      })),
    };
  }

  /**
   * Get TPS (Transactions Per Second) statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getTpsStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<TpsStatItem>> {
    const data = await this.scanner.getTpsStats(params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        tps: item.tps,
      })),
    };
  }

  /**
   * Get top gas usage statistics with optional formatting
   * @param spanType Time period for statistics
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw top statistics response
   */
  async getTopGasUsed(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
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

  /**
   * Get top transaction senders statistics with optional formatting
   * @param spanType Time period for statistics
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw top statistics response
   */
  async getTopTransactionSenders(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
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

  /**
   * Get top transaction receivers statistics with optional formatting
   * @param spanType Time period for statistics
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw top statistics response
   */
  async getTopTransactionReceivers(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
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

  /**
   * Get top CFX senders statistics with optional formatting
   * @param spanType Time period for statistics
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw top statistics response
   */
  async getTopCfxSenders(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
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

  /**
   * Get top CFX receivers statistics with optional formatting
   * @param spanType Time period for statistics
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw top statistics response
   */
  async getTopCfxReceivers(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
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

  /**
   * Get token holder statistics with optional formatting
   * @param contract Token contract address
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getTokenHolderStats(
    contract: string,
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<TokenHolderStatItem>> {
    const data = await this.scanner.getTokenHolderStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        holderCount: ResponseFormatter.formatNumber(item.holderCount),
      })),
    };
  }

  /**
   * Get token unique sender statistics with optional formatting
   * @param contract Token contract address
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getTokenUniqueSenderStats(
    contract: string,
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<TokenUniqueStatItem>> {
    const data = await this.scanner.getTokenUniqueSenderStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        uniqueSenderCount: ResponseFormatter.formatNumber(item.uniqueSenderCount),
      })),
    };
  }

  /**
   * Get token unique receiver statistics with optional formatting
   * @param contract Token contract address
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getTokenUniqueReceiverStats(
    contract: string,
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<TokenUniqueStatItem>> {
    const data = await this.scanner.getTokenUniqueReceiverStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        uniqueReceiverCount: ResponseFormatter.formatNumber(item.uniqueReceiverCount),
      })),
    };
  }

  /**
   * Get token unique participant statistics with optional formatting
   * @param contract Token contract address
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getTokenUniqueParticipantStats(
    contract: string,
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<TokenUniqueStatItem>> {
    const data = await this.scanner.getTokenUniqueParticipantStats(contract, params);
    if (returnRaw) return data;
    return {
      total: data.total,
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        uniqueParticipantCount: ResponseFormatter.formatNumber(item.uniqueParticipantCount),
      })),
    };
  }

  /**
   * Get block base fee statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getBlockBaseFeeStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BlockStatItem>> {
    const data = await this.scanner.getBlockBaseFeeStats(params);
    if (returnRaw) return data;
    return {
      total: ResponseFormatter.formatGas(data.total),
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        blockNumber: Number(item.blockNumber),
        timestamp: ResponseFormatter.formatTimestamp(item.timestamp),
        baseFee: ResponseFormatter.formatGas(item.baseFee),
      })),
    };
  }

  /**
   * Get block gas used statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getBlockGasUsedStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BlockStatItem>> {
    const data = await this.scanner.getBlockGasUsedStats(params);
    if (returnRaw) return data;
    return {
      total: ResponseFormatter.formatGas(data.total),
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        blockNumber: Number(item.blockNumber),
        timestamp: ResponseFormatter.formatTimestamp(item.timestamp),
        gasUsed: ResponseFormatter.formatGas(item.gasUsed),
      })),
    };
  }

  /**
   * Get block average priority fee statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getBlockAvgPriorityFeeStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BlockStatItem>> {
    const data = await this.scanner.getBlockAvgPriorityFeeStats(params);
    if (returnRaw) return data;
    return {
      total: ResponseFormatter.formatGas(data.total),
      list: data.list.map((item) => ({
        statTime: ResponseFormatter.formatTimestamp(item.statTime),
        blockNumber: Number(item.blockNumber),
        timestamp: ResponseFormatter.formatTimestamp(item.timestamp),
        avgPriorityFee: ResponseFormatter.formatGas(item.avgPriorityFee),
      })),
    };
  }

  /**
   * Get block transactions by type statistics with optional formatting
   * @param params Statistics parameters
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw statistics response
   */
  async getBlockTxsByTypeStats(
    params: StatsParams = {},
    returnRaw: boolean = false
  ): Promise<StatsResponse<BlockStatItem>> {
    const data = await this.scanner.getBlockTxsByTypeStats(params);
    if (returnRaw) return data;
    return {
      total: Number(data.total),
      list: data.list.map((item) => {
        const txsInType = item.txsInType || { legacy: 0, cip2930: 0, cip1559: 0 };
        return {
          statTime: ResponseFormatter.formatTimestamp(item.statTime),
          blockNumber: Number(item.blockNumber),
          timestamp: ResponseFormatter.formatTimestamp(item.timestamp),
          txsInType: {
            legacy: Number(txsInType.legacy),
            cip2930: Number(txsInType.cip2930),
            cip1559: Number(txsInType.cip1559),
          },
        };
      }),
    };
  }

  /**
   * Get top token transfers statistics with optional formatting
   * @param spanType Time period for statistics
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw top statistics response
   */
  async getTopTokenTransfers(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
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

  /**
   * Get top token senders statistics with optional formatting
   * @param spanType Time period for statistics
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw top statistics response
   */
  async getTopTokenSenders(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
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

  /**
   * Get top token receivers statistics with optional formatting
   * @param spanType Time period for statistics
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw top statistics response
   */
  async getTopTokenReceivers(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
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

  /**
   * Get top token participants statistics with optional formatting
   * @param spanType Time period for statistics
   * @param returnRaw Whether to return raw data (default: false)
   * @returns Formatted or raw top statistics response
   */
  async getTopTokenParticipants(
    spanType: StatsPeriod,
    returnRaw: boolean = false
  ): Promise<TopStatsResponse> {
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
}
