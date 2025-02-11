/**
 * Core implementation of the Conflux eSpace Scanner API.
 * Provides direct access to all API endpoints with basic data validation and error handling.
 */
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
  /**
   * Get ABI for a verified contract
   * @param address Contract address
   * @returns Contract ABI response
   * @throws Error if address is invalid or contract is not verified
   */
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

  /**
   * Get source code for a verified contract
   * @param address Contract address
   * @returns Contract source code response
   * @throws Error if address is invalid or contract is not verified
   */
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

  /**
   * Get token information for multiple contracts
   * @param contracts Array of contract addresses
   * @returns Array of token data
   * @throws Error if any address is invalid
   */
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
  /**
   * Base method for fetching statistics data
   * @param endpoint API endpoint
   * @param params Statistics parameters
   * @returns Generic statistics response
   * @throws Error if no result is returned
   */
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
  /**
   * Get active account statistics
   * @param params Statistics parameters
   * @returns Active account statistics
   */
  async getActiveAccountStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/account/active", params);
  }

  /**
   * Get CFX holder statistics
   * @param params Statistics parameters
   * @returns CFX holder statistics
   */
  async getCfxHolderStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/account/cfx/holder", params);
  }

  /**
   * Get account growth statistics
   * @param params Statistics parameters
   * @returns Account growth statistics
   */
  async getAccountGrowthStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/account/growth", params);
  }

  /**
   * Get contract statistics
   * @param params Statistics parameters
   * @returns Contract statistics
   */
  async getContractStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/contract", params);
  }

  /**
   * Get transaction statistics
   * @param params Statistics parameters
   * @returns Transaction statistics
   */
  async getTransactionStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/transaction", params);
  }

  /**
   * Get CFX transfer statistics
   * @param params Statistics parameters
   * @returns CFX transfer statistics
   */
  async getCfxTransferStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/cfx/transfer", params);
  }

  /**
   * Get TPS (Transactions Per Second) statistics
   * @param params Statistics parameters
   * @returns TPS statistics
   */
  async getTpsStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/tps", params);
  }

  // Top statistics methods
  /**
   * Get top gas usage statistics
   * @param spanType Time period for statistics
   * @returns Top gas usage statistics
   */
  async getTopGasUsed(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/gas/used", spanType);
  }

  /**
   * Get top transaction senders statistics
   * @param spanType Time period for statistics
   * @returns Top transaction senders statistics
   */
  async getTopTransactionSenders(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/transaction/sender", spanType);
  }

  /**
   * Get top transaction receivers statistics
   * @param spanType Time period for statistics
   * @returns Top transaction receivers statistics
   */
  async getTopTransactionReceivers(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>(
      "/statistics/top/transaction/receiver",
      spanType
    );
  }

  /**
   * Get top CFX senders statistics
   * @param spanType Time period for statistics
   * @returns Top CFX senders statistics
   */
  async getTopCfxSenders(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/cfx/sender", spanType);
  }

  /**
   * Get top CFX receivers statistics
   * @param spanType Time period for statistics
   * @returns Top CFX receivers statistics
   */
  async getTopCfxReceivers(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/cfx/receiver", spanType);
  }

  /**
   * Get top token transfers statistics
   * @param spanType Time period for statistics
   * @returns Top token transfers statistics
   */
  async getTopTokenTransfers(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/token/transfer", spanType);
  }

  /**
   * Get top token senders statistics
   * @param spanType Time period for statistics
   * @returns Top token senders statistics
   */
  async getTopTokenSenders(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/token/sender", spanType);
  }

  /**
   * Get top token receivers statistics
   * @param spanType Time period for statistics
   * @returns Top token receivers statistics
   */
  async getTopTokenReceivers(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/token/receiver", spanType);
  }

  /**
   * Get top token participants statistics
   * @param spanType Time period for statistics
   * @returns Top token participants statistics
   */
  async getTopTokenParticipants(spanType: StatsPeriod): Promise<ESpaceTopStatsResponse> {
    return this.getTopStats<ESpaceTopStatsResponse>("/statistics/top/token/participant", spanType);
  }

  // Token statistics methods
  /**
   * Get token holder statistics
   * @param contract Token contract address
   * @param params Statistics parameters
   * @returns Token holder statistics
   * @throws Error if contract address is invalid
   */
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

  /**
   * Get token unique sender statistics
   * @param contract Token contract address
   * @param params Statistics parameters
   * @returns Token unique sender statistics
   * @throws Error if contract address is invalid
   */
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

  /**
   * Get token unique receiver statistics
   * @param contract Token contract address
   * @param params Statistics parameters
   * @returns Token unique receiver statistics
   * @throws Error if contract address is invalid
   */
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

  /**
   * Get token unique participant statistics
   * @param contract Token contract address
   * @param params Statistics parameters
   * @returns Token unique participant statistics
   * @throws Error if contract address is invalid
   */
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
  /**
   * Get block base fee statistics
   * @param params Statistics parameters
   * @returns Block base fee statistics
   */
  async getBlockBaseFeeStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/block/base-fee", params);
  }

  /**
   * Get block gas used statistics
   * @param params Statistics parameters
   * @returns Block gas used statistics
   */
  async getBlockGasUsedStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/block/gas-used", params);
  }

  /**
   * Get block average priority fee statistics
   * @param params Statistics parameters
   * @returns Block average priority fee statistics
   */
  async getBlockAvgPriorityFeeStats(params: ESpaceStatsParams = {}): Promise<ESpaceStatsResponse> {
    return this.getBasicStats<ESpaceStatsResponse>("/statistics/block/avg-priority-fee", params);
  }

  /**
   * Get block transactions by type statistics
   * @param params Statistics parameters
   * @returns Block transactions by type statistics
   */
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
