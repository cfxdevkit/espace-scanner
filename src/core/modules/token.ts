import { ESpaceApi } from "../api";
import { AddressValidator } from "../../utils";
import { createLogger } from "../../utils/logger";
import { TokenData, TokenListResponse } from "../../types";
import { ApiConfig } from "../../types/api";

export class TokenModule extends ESpaceApi {
  protected logger = createLogger("TokenModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get token information for multiple contracts
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

  /**
   * Get account tokens
   */
  async getAccountTokens(
    address: string,
    tokenType: string = "ERC20",
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
}
