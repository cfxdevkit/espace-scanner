import { ESpaceApi } from "./api";
import { AddressValidator } from "../utils";
import { createLogger } from "../utils/logger";
import {
  ContractABIResponse,
  ContractSourceResponse,
  TokenData,
  TokenListResponse,
  ESpaceStatsResponse,
  ESpaceTopStatsResponse,
  ESpaceStatsParams,
  StatsPeriod,
  TokenType,
} from "../types";

export class ESpaceScanner extends ESpaceApi {
  protected logger = createLogger("ESpaceScanner");

  // Contract methods
  async getContractABI(address: string): Promise<ContractABIResponse> {
    this.logger.debug({ address }, "Getting contract ABI");
    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for contract ABI");
      throw new Error(`Invalid address: ${address}`);
    }
    const response = await this.fetchApi<string>("/api", {
      module: "contract",
      action: "getabi",
      address,
    });
    if (!response.result) {
      this.logger.error({ address }, "Contract ABI not available");
      throw new Error(`Contract ${address} not verified or ABI not available`);
    }
    this.logger.debug({ address }, "Successfully retrieved contract ABI");
    return JSON.parse(response.result);
  }

  async getContractSourceCode(address: string): Promise<ContractSourceResponse> {
    this.logger.debug({ address }, "Getting contract source code");
    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for contract source");
      throw new Error(`Invalid address: ${address}`);
    }
    const response = await this.fetchApi<ContractSourceResponse[]>("/api", {
      module: "contract",
      action: "getsourcecode",
      address,
    });
    if (!response.result?.[0]) {
      this.logger.error({ address }, "Contract source code not available");
      throw new Error(`Contract ${address} not verified or source code not available`);
    }
    this.logger.debug({ address }, "Successfully retrieved contract source code");
    return response.result[0];
  }

  // Token methods
  async getAccountTokens(
    address: string,
    tokenType: TokenType = "ERC20",
    skip = 0,
    limit = 10
  ): Promise<TokenData[]> {
    this.logger.debug({ address, tokenType, skip, limit }, "Getting account tokens");
    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for account tokens");
      throw new Error(`Invalid address: ${address}`);
    }
    const response = await this.fetchApi<{ list: TokenData[] }>("/account/tokens", {
      account: address,
      tokenType,
      skip: String(skip),
      limit: String(limit),
    });
    this.logger.debug(
      {
        address,
        tokenCount: response.result.list.length,
      },
      "Successfully retrieved account tokens"
    );
    return response.result.list;
  }

  async getTokenInfos(contracts: string[]): Promise<TokenData[]> {
    if (!AddressValidator.validateAddresses(contracts)) {
      throw new Error("Invalid contract addresses provided");
    }
    const response = await this.fetchApi<TokenListResponse>(
      `/token/tokeninfos?contracts=${contracts.join(",")}`
    );
    return response.result.list;
  }

  // Statistics methods
  protected async getBasicStats<T>(endpoint: string, params: ESpaceStatsParams = {}): Promise<T> {
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

  // Basic statistics methods
  async getActiveAccountStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/account/active", params);
  }

  async getCfxHolderStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/account/cfx/holder", params);
  }

  async getAccountGrowthStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/account/growth", params);
  }

  async getContractStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/contract", params);
  }

  async getTransactionStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/transaction", params);
  }

  async getCfxTransferStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/cfx/transfer", params);
  }

  async getTpsStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/tps", params);
  }

  // Top statistics methods
  async getTopGasUsed(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/gas/used", spanType);
  }

  async getTopTransactionSenders(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/transaction/sender", spanType);
  }

  async getTopTransactionReceivers(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>(
      "/statistics/top/transaction/receiver",
      spanType
    );
  }

  async getTopCfxSenders(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/cfx/sender", spanType);
  }

  async getTopCfxReceivers(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/cfx/receiver", spanType);
  }

  async getTopTokenTransfers(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/token/transfer", spanType);
  }

  async getTopTokenSenders(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/token/sender", spanType);
  }

  async getTopTokenReceivers(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/token/receiver", spanType);
  }

  async getTopTokenParticipants(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/token/participant", spanType);
  }

  // Token statistics methods
  async getTokenHolderStats(
    contract: string,
    params: ESpaceStatsParams = {}
  ): Promise<ESpaceStatsResponse> {
    if (!AddressValidator.validateAddress(contract)) {
      throw new Error(`Invalid contract address: ${contract}`);
    }
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/token/holder", {
      contract,
      ...params,
    });
  }

  async getTokenUniqueSenderStats(
    contract: string,
    params: ESpaceStatsParams = {}
  ): Promise<ESpaceStatsResponse> {
    if (!AddressValidator.validateAddress(contract)) {
      throw new Error(`Invalid contract address: ${contract}`);
    }
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/token/unique/sender", {
      contract,
      ...params,
    });
  }

  async getTokenUniqueReceiverStats(
    contract: string,
    params: ESpaceStatsParams = {}
  ): Promise<ESpaceStatsResponse> {
    if (!AddressValidator.validateAddress(contract)) {
      throw new Error(`Invalid contract address: ${contract}`);
    }
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/token/unique/receiver", {
      contract,
      ...params,
    });
  }

  async getTokenUniqueParticipantStats(
    contract: string,
    params: ESpaceStatsParams = {}
  ): Promise<ESpaceStatsResponse> {
    if (!AddressValidator.validateAddress(contract)) {
      throw new Error(`Invalid contract address: ${contract}`);
    }
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/token/unique/participant", {
      contract,
      ...params,
    });
  }

  // Block statistics methods
  async getBlockBaseFeeStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/block/base-fee", params);
  }

  async getBlockAvgPriorityFeeStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/block/avg-priority-fee", params);
  }

  async getBlockGasUsedStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/block/gas-used", params);
  }

  async getBlockTxsByTypeStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/block/txs-by-type", params);
  }

  protected validateAddress(address: string): void {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error("Invalid address");
    }
  }

  protected validateContractAddresses(addresses: string[]): void {
    if (!addresses.every((address) => /^0x[a-fA-F0-9]{40}$/.test(address))) {
      throw new Error("Invalid contract addresses provided");
    }
  }
}
