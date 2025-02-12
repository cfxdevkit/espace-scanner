/**
 * Core implementation of the Conflux eSpace Scanner API.
 * Provides direct access to all API endpoints with basic data validation and error handling.
 */
import { ESpaceApi } from "./api";
import { AddressValidator } from "../utils";
import { createLogger } from "../utils/logger";
import {
  ContractSourceResponse,
  TokenData,
  TokenListResponse,
  StatsResponse,
  TopStatsResponse,
  StatsParams,
  StatsPeriod,
  TokenType,
  BasicStatItem,
  TokenHolderStatItem,
  TokenUniqueStatItem,
  BlockStatItem,
  TpsStatItem,
  AccountBalanceMulti,
  AccountBalanceMultiItem,
  TransactionList,
  TransactionItem,
  InternalTransactionList,
  TokenTransferList,
  NFTTransferList,
  MinedBlockList,
  NFTBalanceResponse,
  NFTTokenResponse,
  NFTPreviewResponse,
  NFTFungibleTokenResponse,
  NFTOwnerResponse,
  DecodedMethod,
  DecodedMethodRaw,
} from "../types";

export class ESpaceScanner extends ESpaceApi {
  protected logger = createLogger("ESpaceScanner");

  // Account methods
  /**
   * Get CFX balance for a single address
   * @param address Account address to check balance
   * @param tag Block parameter (latest_state, latest_confirmed, etc.)
   * @returns Account balance response
   * @throws Error if address is invalid
   */
  async getBalance(address: string, tag: string = "latest_state"): Promise<string> {
    this.logger.debug({ address, tag }, "Getting account balance");
    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for balance check");
      throw new Error(`Invalid address: ${address}`);
    }
    const response = await this.fetchApi<string>("/api", {
      module: "account",
      action: "balance",
      address,
      tag,
    });
    return response.result;
  }

  /**
   * Get CFX balance for multiple addresses in a single call
   * @param addresses Array of account addresses to check balance
   * @param tag Block parameter (latest_state, latest_confirmed, etc.)
   * @returns Multiple account balances response
   * @throws Error if any address is invalid
   */
  async getBalanceMulti(
    addresses: string[],
    tag: string = "latest_state"
  ): Promise<AccountBalanceMulti> {
    this.logger.debug({ addresses, tag }, "Getting multiple account balances");
    if (!AddressValidator.validateAddresses(addresses)) {
      this.logger.error({ addresses }, "Invalid addresses provided for balance check");
      throw new Error(`Invalid addresses provided`);
    }
    const response = await this.fetchApi<AccountBalanceMultiItem>("/api", {
      module: "account",
      action: "balancemulti",
      address: addresses.join(","),
      tag,
    });
    return response.result;
  }

  /**
   * Get a list of normal transactions by address
   * @param address Account address
   * @param startBlock Starting block number (optional)
   * @param endBlock Ending block number (optional)
   * @param page Page number (optional, default: 1)
   * @param offset Number of records per page (optional, default: 100)
   * @param sort Sorting order (optional, default: 'desc')
   * @returns List of normal transactions
   * @throws Error if address is invalid
   */
  async getTransactionList(
    address: string,
    startBlock?: number,
    endBlock?: number,
    page: number = 1,
    offset: number = 100,
    sort: "asc" | "desc" = "desc"
  ): Promise<TransactionList> {
    this.logger.debug(
      { address, startBlock, endBlock, page, offset, sort },
      "Getting transaction list"
    );
    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for transaction list");
      throw new Error(`Invalid address: ${address}`);
    }
    return (
      await this.fetchApi<TransactionItem[]>("/api", {
        module: "account",
        action: "txlist",
        address,
        startblock: startBlock,
        endblock: endBlock,
        page,
        offset,
        sort,
      })
    ).result;
  }

  /**
   * Get a list of internal transactions
   * @param options Options for filtering internal transactions
   * @param options.address Account address (optional)
   * @param options.txhash Transaction hash (optional)
   * @param options.startBlock Starting block number (optional)
   * @param options.endBlock Ending block number (optional)
   * @param options.page Page number (optional, default: 1)
   * @param options.offset Number of records per page (optional, default: 100)
   * @param options.sort Sorting order (optional, default: 'desc')
   * @returns List of internal transactions
   * @throws Error if both address and txhash are provided or if address is invalid
   */
  async getInternalTransactionList(options: {
    address?: string;
    txhash?: string;
    startBlock?: number;
    endBlock?: number;
    page?: number;
    offset?: number;
    sort?: "asc" | "desc";
  }): Promise<InternalTransactionList> {
    const {
      address,
      txhash,
      startBlock,
      endBlock,
      page = 1,
      offset = 100,
      sort = "desc",
    } = options;

    this.logger.debug(
      { address, txhash, startBlock, endBlock, page, offset, sort },
      "Getting internal transaction list"
    );

    if (address && txhash) {
      this.logger.error(
        { address, txhash },
        "Cannot specify both address and txhash for internal transactions"
      );
      throw new Error("Cannot specify both address and txhash for internal transactions");
    }

    if (address && !AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for internal transaction list");
      throw new Error(`Invalid address: ${address}`);
    }
    const data = await this.fetchApi<InternalTransactionList>("/api", {
      module: "account",
      action: "txlistinternal",
      ...(address && { address }),
      ...(txhash && { txhash }),
      ...(startBlock !== undefined && { startblock: startBlock }),
      ...(endBlock !== undefined && { endblock: endBlock }),
      page,
      offset,
      sort,
    });
    console.log(data);
    return data.result;
  }

  // Contract methods
  /**
   * Get ABI for a verified contract
   * @param address Contract address
   * @returns Contract ABI response
   * @throws Error if address is invalid or contract is not verified
   */
  async getContractABI(address: string): Promise<object> {
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

  /**
   * Check source code verification submission status
   * @param guid GUID returned from source code verification submission
   * @returns Verification status response
   */
  async checkVerifyStatus(guid: string): Promise<string> {
    this.logger.debug({ guid }, "Checking source code verification status");

    if (!guid) {
      this.logger.error("GUID is required for checking verification status");
      throw new Error("GUID is required for checking verification status");
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "contract",
        action: "checkverifystatus",
        guid,
      })
    ).result;
  }

  /**
   * Verify a proxy contract
   * @param address Contract address to verify
   * @param expectedImplementation Expected implementation contract address (optional)
   * @returns Verification response
   * @throws Error if address is invalid
   */
  async verifyProxyContract(address: string, expectedImplementation?: string): Promise<string> {
    this.logger.debug({ address, expectedImplementation }, "Verifying proxy contract");

    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for proxy contract verification");
      throw new Error(`Invalid address: ${address}`);
    }

    if (expectedImplementation && !AddressValidator.validateAddress(expectedImplementation)) {
      this.logger.error(
        { expectedImplementation },
        "Invalid implementation address provided for proxy contract verification"
      );
      throw new Error(`Invalid implementation address: ${expectedImplementation}`);
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "contract",
        action: "verifyproxycontract",
        address,
        ...(expectedImplementation && { expectedimplementation: expectedImplementation }),
      })
    ).result;
  }

  /**
   * Check proxy contract verification submission status
   * @param guid GUID returned from proxy contract verification submission
   * @returns Verification status response
   */
  async checkProxyVerification(guid: string): Promise<string> {
    this.logger.debug({ guid }, "Checking proxy contract verification status");

    if (!guid) {
      this.logger.error("GUID is required for checking proxy verification status");
      throw new Error("GUID is required for checking proxy verification status");
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "contract",
        action: "checkproxyverification",
        guid,
      })
    ).result;
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

  /**
   * Get ERC20 token balance for an address
   * @param contractAddress Token contract address
   * @param address Account address
   * @returns Token balance
   * @throws Error if address or contract address is invalid
   */
  async getTokenBalance(contractAddress: string, address: string): Promise<string> {
    this.logger.debug({ contractAddress, address }, "Getting token balance");

    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for token balance");
      throw new Error(`Invalid address: ${address}`);
    }

    if (!AddressValidator.validateAddress(contractAddress)) {
      this.logger.error({ contractAddress }, "Invalid contract address provided for token balance");
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "account",
        action: "tokenbalance",
        contractaddress: contractAddress,
        address,
      })
    ).result;
  }

  /**
   * Get ERC20 token total supply
   * @param contractAddress Token contract address
   * @returns Token total supply
   * @throws Error if contract address is invalid
   */
  async getTokenSupply(contractAddress: string): Promise<string> {
    this.logger.debug({ contractAddress }, "Getting token total supply");

    if (!AddressValidator.validateAddress(contractAddress)) {
      this.logger.error({ contractAddress }, "Invalid contract address provided for token supply");
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "stats",
        action: "tokensupply",
        contractaddress: contractAddress,
      })
    ).result;
  }

  /**
   * Get historical ERC20 token total supply at a specific block
   * @param contractAddress Token contract address
   * @param blockNumber Block number to check supply at
   * @returns Historical token supply
   * @throws Error if contract address is invalid
   */
  async getTokenSupplyHistory(contractAddress: string, blockNumber: number): Promise<string> {
    this.logger.debug({ contractAddress, blockNumber }, "Getting historical token total supply");

    if (!AddressValidator.validateAddress(contractAddress)) {
      this.logger.error(
        { contractAddress },
        "Invalid contract address provided for historical token supply"
      );
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }

    if (typeof blockNumber !== "number" || blockNumber < 0) {
      this.logger.error({ blockNumber }, "Invalid block number provided");
      throw new Error(`Invalid block number: ${blockNumber}`);
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "stats",
        action: "tokensupplyhistory",
        contractaddress: contractAddress,
        blockno: Math.floor(blockNumber),
      })
    ).result;
  }

  /**
   * Get historical ERC20 token balance for an account at a specific block number
   * @param contractAddress The token contract address
   * @param address The account address to check balance for
   * @param blockNumber The block number to check balance at
   * @returns Promise<string> The historical token balance
   * @throws Error if parameters are invalid
   */
  async getTokenBalanceHistory(
    contractAddress: string,
    address: string,
    blockNumber: number
  ): Promise<string> {
    this.logger.debug(
      { contractAddress, address, blockNumber },
      "Getting historical token balance"
    );

    if (!contractAddress) {
      throw new Error("Contract address is required");
    }
    if (!address) {
      throw new Error("Account address is required");
    }
    if (!blockNumber || blockNumber < 0) {
      throw new Error("Valid block number is required");
    }

    const response = await this.fetchApi<string>("/api", {
      module: "account",
      action: "tokenbalancehistory",
      contractaddress: contractAddress,
      address: address,
      blockno: blockNumber,
    });

    return response.result;
  }

  // Statistics methods
  /**
   * Base method for fetching statistics data
   * @param endpoint API endpoint
   * @param params Statistics parameters
   * @returns Generic statistics response
   * @throws Error if no result is returned
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
  async getActiveAccountStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/account/active", params);
  }

  /**
   * Get CFX holder statistics
   * @param params Statistics parameters
   * @returns CFX holder statistics
   */
  async getCfxHolderStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>(
      "/statistics/account/cfx/holder",
      params
    );
  }

  /**
   * Get account growth statistics
   * @param params Statistics parameters
   * @returns Account growth statistics
   */
  async getAccountGrowthStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/account/growth", params);
  }

  /**
   * Get contract statistics
   * @param params Statistics parameters
   * @returns Contract statistics
   */
  async getContractStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/contract", params);
  }

  /**
   * Get transaction statistics
   * @param params Statistics parameters
   * @returns Transaction statistics
   */
  async getTransactionStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/transaction", params);
  }

  /**
   * Get CFX transfer statistics
   * @param params Statistics parameters
   * @returns CFX transfer statistics
   */
  async getCfxTransferStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/cfx/transfer", params);
  }

  /**
   * Get TPS (Transactions Per Second) statistics
   * @param params Statistics parameters
   * @returns TPS statistics
   */
  async getTpsStats(params: StatsParams = {}): Promise<StatsResponse<TpsStatItem>> {
    return this.getBasicStats<StatsResponse<TpsStatItem>>("/statistics/tps", params);
  }

  // Top statistics methods
  /**
   * Get top gas usage statistics
   * @param spanType Time period for statistics
   * @returns Top gas usage statistics
   */
  async getTopGasUsed(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/gas/used", spanType);
  }

  /**
   * Get top transaction senders statistics
   * @param spanType Time period for statistics
   * @returns Top transaction senders statistics
   */
  async getTopTransactionSenders(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/transaction/sender", spanType);
  }

  /**
   * Get top transaction receivers statistics
   * @param spanType Time period for statistics
   * @returns Top transaction receivers statistics
   */
  async getTopTransactionReceivers(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/transaction/receiver", spanType);
  }

  /**
   * Get top CFX senders statistics
   * @param spanType Time period for statistics
   * @returns Top CFX senders statistics
   */
  async getTopCfxSenders(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/cfx/sender", spanType);
  }

  /**
   * Get top CFX receivers statistics
   * @param spanType Time period for statistics
   * @returns Top CFX receivers statistics
   */
  async getTopCfxReceivers(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/cfx/receiver", spanType);
  }

  /**
   * Get top token transfers statistics
   * @param spanType Time period for statistics
   * @returns Top token transfers statistics
   */
  async getTopTokenTransfers(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/token/transfer", spanType);
  }

  /**
   * Get top token senders statistics
   * @param spanType Time period for statistics
   * @returns Top token senders statistics
   */
  async getTopTokenSenders(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/token/sender", spanType);
  }

  /**
   * Get top token receivers statistics
   * @param spanType Time period for statistics
   * @returns Top token receivers statistics
   */
  async getTopTokenReceivers(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/token/receiver", spanType);
  }

  /**
   * Get top token participants statistics
   * @param spanType Time period for statistics
   * @returns Top token participants statistics
   */
  async getTopTokenParticipants(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/token/participant", spanType);
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

  /**
   * Get token unique sender statistics
   * @param contract Token contract address
   * @param params Statistics parameters
   * @returns Token unique sender statistics
   * @throws Error if contract address is invalid
   */
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

  /**
   * Get token unique receiver statistics
   * @param contract Token contract address
   * @param params Statistics parameters
   * @returns Token unique receiver statistics
   * @throws Error if contract address is invalid
   */
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

  /**
   * Get token unique participant statistics
   * @param contract Token contract address
   * @param params Statistics parameters
   * @returns Token unique participant statistics
   * @throws Error if contract address is invalid
   */
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
  /**
   * Get block base fee statistics
   * @param params Statistics parameters
   * @returns Block base fee statistics
   */
  async getBlockBaseFeeStats(params: StatsParams = {}): Promise<StatsResponse<BlockStatItem>> {
    return this.getBasicStats<StatsResponse<BlockStatItem>>("/statistics/block/base-fee", params);
  }

  /**
   * Get block gas used statistics
   * @param params Statistics parameters
   * @returns Block gas used statistics
   */
  async getBlockGasUsedStats(params: StatsParams = {}): Promise<StatsResponse<BlockStatItem>> {
    return this.getBasicStats<StatsResponse<BlockStatItem>>("/statistics/block/gas-used", params);
  }

  /**
   * Get block average priority fee statistics
   * @param params Statistics parameters
   * @returns Block average priority fee statistics
   */
  async getBlockAvgPriorityFeeStats(
    params: StatsParams = {}
  ): Promise<StatsResponse<BlockStatItem>> {
    return this.getBasicStats<StatsResponse<BlockStatItem>>(
      "/statistics/block/avg-priority-fee",
      params
    );
  }

  /**
   * Get block transactions by type statistics
   * @param params Statistics parameters
   * @returns Block transactions by type statistics
   */
  async getBlockTxsByTypeStats(params: StatsParams = {}): Promise<StatsResponse<BlockStatItem>> {
    return this.getBasicStats<StatsResponse<BlockStatItem>>(
      "/statistics/block/txs-by-type",
      params
    );
  }

  /**
   * Get a list of token transfers
   * @param options Options for filtering token transfers
   * @param options.address Account address (optional)
   * @param options.contractAddress Token contract address (optional)
   * @param options.startBlock Starting block number (optional)
   * @param options.endBlock Ending block number (optional)
   * @param options.page Page number (optional, default: 1)
   * @param options.offset Number of records per page (optional, default: 100)
   * @param options.sort Sorting order (optional, default: 'desc')
   * @returns List of token transfers
   * @throws Error if address is invalid when provided
   */
  async getTokenTransfers(options: {
    address?: string;
    contractAddress?: string;
    startBlock?: number;
    endBlock?: number;
    page?: number;
    offset?: number;
    sort?: "asc" | "desc";
  }): Promise<TokenTransferList> {
    const {
      address,
      contractAddress,
      startBlock,
      endBlock,
      page = 1,
      offset = 100,
      sort = "desc",
    } = options;

    this.logger.debug(
      { address, contractAddress, startBlock, endBlock, page, offset, sort },
      "Getting token transfer list"
    );

    if (address && !AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for token transfer list");
      throw new Error(`Invalid address: ${address}`);
    }

    if (contractAddress && !AddressValidator.validateAddress(contractAddress)) {
      this.logger.error(
        { contractAddress },
        "Invalid contract address provided for token transfer list"
      );
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }

    return (
      await this.fetchApi<TokenTransferList>("/api", {
        module: "account",
        action: "tokentx",
        ...(address && { address }),
        ...(contractAddress && { contractaddress: contractAddress }),
        ...(startBlock !== undefined && { startblock: startBlock }),
        ...(endBlock !== undefined && { endblock: endBlock }),
        page,
        offset,
        sort,
      })
    ).result;
  }

  /**
   * Get a list of NFT token transfers
   * @param options Options for filtering NFT token transfers
   * @param options.address Account address (optional)
   * @param options.contractAddress Token contract address (optional)
   * @param options.startBlock Starting block number (optional)
   * @param options.endBlock Ending block number (optional)
   * @param options.page Page number (optional, default: 1)
   * @param options.offset Number of records per page (optional, default: 100)
   * @param options.sort Sorting order (optional, default: 'desc')
   * @returns List of NFT token transfers
   * @throws Error if address is invalid when provided
   */
  async getNFTTransfers(options: {
    address?: string;
    contractAddress?: string;
    startBlock?: number;
    endBlock?: number;
    page?: number;
    offset?: number;
    sort?: "asc" | "desc";
  }): Promise<NFTTransferList> {
    const {
      address,
      contractAddress,
      startBlock,
      endBlock,
      page = 1,
      offset = 100,
      sort = "desc",
    } = options;

    this.logger.debug(
      { address, contractAddress, startBlock, endBlock, page, offset, sort },
      "Getting NFT transfer list"
    );

    if (address && !AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for NFT transfer list");
      throw new Error(`Invalid address: ${address}`);
    }

    if (contractAddress && !AddressValidator.validateAddress(contractAddress)) {
      this.logger.error(
        { contractAddress },
        "Invalid contract address provided for NFT transfer list"
      );
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }

    return (
      await this.fetchApi<NFTTransferList>("/api", {
        module: "account",
        action: "tokennfttx",
        ...(address && { address }),
        ...(contractAddress && { contractaddress: contractAddress }),
        ...(startBlock !== undefined && { startblock: startBlock }),
        ...(endBlock !== undefined && { endblock: endBlock }),
        page,
        offset,
        sort,
      })
    ).result;
  }

  /**
   * Get a list of blocks mined by an address
   * @param address Miner address
   * @param blockType Block type (optional, default: 'blocks')
   * @param page Page number (optional, default: 1)
   * @param offset Number of records per page (optional, default: 100)
   * @returns List of mined blocks
   * @throws Error if address is invalid
   */
  async getMinedBlocks(
    address: string,
    blockType: string = "blocks",
    page: number = 1,
    offset: number = 100
  ): Promise<MinedBlockList> {
    this.logger.debug({ address, blockType, page, offset }, "Getting mined blocks");

    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for mined blocks");
      throw new Error(`Invalid address: ${address}`);
    }

    return (
      await this.fetchApi<MinedBlockList>("/api", {
        module: "account",
        action: "getminedblocks",
        address,
        blocktype: blockType,
        page,
        offset,
      })
    ).result;
  }

  /**
   * Get block number by Unix timestamp
   * @param timestamp Unix timestamp in seconds
   * @param closest The closest available block to the provided timestamp ('before' or 'after')
   * @returns Block number
   */
  async getBlockNumberByTime(
    timestamp: number,
    closest: "before" | "after" = "before"
  ): Promise<string> {
    this.logger.debug({ timestamp, closest }, "Getting block number by timestamp");

    if (typeof timestamp !== "number" || timestamp < 0) {
      this.logger.error({ timestamp }, "Invalid timestamp provided");
      throw new Error(`Invalid timestamp: ${timestamp}`);
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "block",
        action: "getblocknobytime",
        timestamp: Math.floor(timestamp),
        closest,
      })
    ).result;
  }

  // Transaction methods
  /**
   * Check contract execution status for a transaction
   * @param txhash Transaction hash
   * @returns Transaction status response
   */
  async getTransactionStatus(txhash: string): Promise<string> {
    this.logger.debug({ txhash }, "Getting transaction status");

    if (!txhash) {
      this.logger.error("Transaction hash is required for checking status");
      throw new Error("Transaction hash is required for checking status");
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "transaction",
        action: "getstatus",
        txhash,
      })
    ).result;
  }

  /**
   * Check transaction receipt status
   * @param txhash Transaction hash
   * @returns Transaction receipt status response
   */
  async getTransactionReceiptStatus(txhash: string): Promise<string> {
    this.logger.debug({ txhash }, "Getting transaction receipt status");

    if (!txhash) {
      this.logger.error("Transaction hash is required for checking receipt status");
      throw new Error("Transaction hash is required for checking receipt status");
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "transaction",
        action: "gettxreceiptstatus",
        txhash,
      })
    ).result;
  }

  // NFT methods
  /**
   * Get NFT balances for an address
   * @param address Account address
   * @param skip Number of records to skip (optional)
   * @param limit Number of records to return (optional)
   * @returns NFT balances response
   */
  async getNFTBalances(
    address: string,
    skip: number = 0,
    limit: number = 10
  ): Promise<NFTBalanceResponse> {
    this.logger.debug({ address, skip, limit }, "Getting NFT balances");
    if (!AddressValidator.validateAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }
    const response = await this.fetchApi<NFTBalanceResponse>("/nft/balances", {
      account: address,
      skip,
      limit,
    });
    return response.result;
  }

  /**
   * Get NFT tokens for a contract
   * @param contractAddress Contract address
   * @param skip Number of records to skip (optional)
   * @param limit Number of records to return (optional)
   * @returns NFT tokens response
   */
  async getNFTTokens(
    contractAddress: string,
    skip: number = 0,
    limit: number = 10
  ): Promise<NFTTokenResponse> {
    this.logger.debug({ contractAddress, skip, limit }, "Getting NFT tokens");
    if (!AddressValidator.validateAddress(contractAddress)) {
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }
    const response = await this.fetchApi<NFTTokenResponse>("/nft/tokens", {
      contract: contractAddress,
      skip,
      limit,
    });
    return response.result;
  }

  /**
   * Get NFT preview data
   * @param contractAddress Contract address
   * @param tokenId Token ID
   * @returns NFT preview response
   */
  async getNFTPreview(contractAddress: string, tokenId: string): Promise<NFTPreviewResponse> {
    this.logger.debug({ contractAddress, tokenId }, "Getting NFT preview");
    if (!AddressValidator.validateAddress(contractAddress)) {
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }
    const response = await this.fetchApi<NFTPreviewResponse>("/nft/preview", {
      contract: contractAddress,
      tokenId,
    });
    return response.result;
  }

  /**
   * Get NFT fungible tokens for a contract
   * @param contractAddress Contract address
   * @param skip Number of records to skip (optional)
   * @param limit Number of records to return (optional)
   * @returns NFT fungible tokens response
   */
  async getNFTFungibleTokens(
    contractAddress: string,
    skip: number = 0,
    limit: number = 10
  ): Promise<NFTFungibleTokenResponse> {
    this.logger.debug({ contractAddress, skip, limit }, "Getting NFT fungible tokens");
    if (!AddressValidator.validateAddress(contractAddress)) {
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }
    const response = await this.fetchApi<NFTFungibleTokenResponse>("/nft/fungible-tokens", {
      contract: contractAddress,
      skip,
      limit,
    });
    return response.result;
  }

  /**
   * Get NFT owners for a specific token
   * @param contractAddress Contract address
   * @param tokenId Token ID
   * @param skip Number of records to skip (optional)
   * @param limit Number of records to return (optional)
   * @returns NFT owners response
   */
  async getNFTOwners(
    contractAddress: string,
    tokenId: string,
    skip: number = 0,
    limit: number = 10
  ): Promise<NFTOwnerResponse> {
    this.logger.debug({ contractAddress, tokenId, skip, limit }, "Getting NFT owners");
    if (!AddressValidator.validateAddress(contractAddress)) {
      throw new Error(`Invalid contract address: ${contractAddress}`);
    }
    const response = await this.fetchApi<NFTOwnerResponse>("/nft/owners", {
      contract: contractAddress,
      tokenId,
      skip,
      limit,
    });
    return response.result;
  }

  // Utility methods
  /**
   * Decode transaction method data
   * @param data Method data to decode
   * @param contractAddress Optional contract address for context
   * @returns Decoded method data
   */
  async decodeMethod(data: string, contractAddress?: string): Promise<DecodedMethod> {
    this.logger.debug({ data, contractAddress }, "Decoding method data");
    if (!data) {
      throw new Error("Method data is required");
    }
    const response = await this.fetchApi<DecodedMethod>("/util/decode/method", {
      data,
      ...(contractAddress && { contract: contractAddress }),
    });
    return response.result;
  }

  /**
   * Decode transaction method data in raw format
   * @param data Method data to decode
   * @returns Raw decoded method data
   */
  async decodeMethodRaw(data: string): Promise<DecodedMethodRaw> {
    this.logger.debug({ data }, "Decoding method data in raw format");
    if (!data) {
      throw new Error("Method data is required");
    }
    const response = await this.fetchApi<DecodedMethodRaw>("/util/decode/method/raw", {
      data,
    });
    return response.result;
  }

  /**
   * Get supply statistics
   * @param params Statistics parameters
   * @returns Supply statistics
   */
  async getSupplyStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/supply", params);
  }

  /**
   * Get mining statistics
   * @param params Statistics parameters
   * @returns Mining statistics
   */
  async getMiningStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/mining", params);
  }

  /**
   * Get overall active account statistics
   * @param params Statistics parameters
   * @returns Overall active account statistics
   */
  async getActiveAccountOverallStats(
    params: StatsParams = {}
  ): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>(
      "/statistics/account/active/overall",
      params
    );
  }

  /**
   * Get token transfer statistics
   * @param params Statistics parameters
   * @returns Token transfer statistics
   */
  async getTokenTransferStats(params: StatsParams = {}): Promise<StatsResponse<BasicStatItem>> {
    return this.getBasicStats<StatsResponse<BasicStatItem>>("/statistics/token/transfer", params);
  }

  /**
   * Get top miner statistics
   * @param spanType Time period for statistics
   * @returns Top miner statistics
   */
  async getTopMiner(spanType: StatsPeriod): Promise<TopStatsResponse> {
    return this.getTopStats<TopStatsResponse>("/statistics/top/miner", spanType);
  }
}
