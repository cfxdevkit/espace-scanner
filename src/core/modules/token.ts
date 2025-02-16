import { ESpaceApi } from "../api";
import { AddressValidator } from "../../utils";
import { createLogger } from "../../utils/logger";
import { Token } from "../../types";
import { ApiConfig } from "../../types";

export class TokenModule extends ESpaceApi {
  protected logger = createLogger("TokenModule");

  constructor(config: ApiConfig = { target: "mainnet" }) {
    super(config);
  }

  /**
   * Get ERC20 token balance for an address
   */
  async getTokenBalance(params: Token.TokenBalanceParams): Promise<Token.TokenBalance> {
    this.logger.debug({ params }, "Getting token balance");

    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for token balance");
      throw new Error(`Invalid address: ${params.address}`);
    }

    if (!AddressValidator.validateAddress(params.contractaddress)) {
      this.logger.error({ params }, "Invalid contract address provided for token balance");
      throw new Error(`Invalid contract address: ${params.contractaddress}`);
    }

    return (
      await this.fetchApi<Token.TokenBalance>("/api", {
        module: "account",
        action: "tokenbalance",
        contractaddress: params.contractaddress,
        address: params.address,
      })
    ).result;
  }

  /**
   * Get ERC20 token total supply
   */
  async getTokenSupply(params: Token.TokenSupplyParams): Promise<Token.TokenSupply> {
    this.logger.debug({ params }, "Getting token total supply");

    if (!AddressValidator.validateAddress(params.contractaddress)) {
      this.logger.error({ params }, "Invalid contract address provided for token supply");
      throw new Error(`Invalid contract address: ${params.contractaddress}`);
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "stats",
        action: "tokensupply",
        contractaddress: params.contractaddress,
      })
    ).result;
  }

  /**
   * Get historical ERC20 token total supply at a specific block
   */
  async getTokenSupplyHistory(
    params: Token.TokenSupplyHistoryParams
  ): Promise<Token.TokenSupplyHistory> {
    this.logger.debug({ params }, "Getting historical token total supply");

    if (!AddressValidator.validateAddress(params.contractaddress)) {
      this.logger.error(
        { params },
        "Invalid contract address provided for historical token supply"
      );
      throw new Error(`Invalid contract address: ${params.contractaddress}`);
    }

    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for historical token supply");
      throw new Error(`Invalid address: ${params.address}`);
    }

    if (typeof params.blockno !== "number" || params.blockno < 0) {
      this.logger.error({ params }, "Invalid block number provided");
      throw new Error(`Invalid block number: ${params.blockno}`);
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "stats",
        action: "tokensupplyhistory",
        contractaddress: params.contractaddress,
        blockno: params.blockno,
      })
    ).result;
  }

  /**
   * Get historical ERC20 token balance for an account at a specific block number
   */
  async getTokenBalanceHistory(
    params: Token.TokenBalanceHistoryParams
  ): Promise<Token.TokenBalanceHistory> {
    this.logger.debug({ params }, "Getting historical token balance");
    if (!params.contractaddress) {
      throw new Error("Contract address is required");
    }
    if (!params.address) {
      throw new Error("Account address is required");
    }
    if (!params.blockno || params.blockno < 0) {
      throw new Error("Valid block number is required");
    }

    const response = await this.fetchApi<Token.TokenBalanceHistory>("/api", {
      module: "account",
      action: "balancehistory",
      contractaddress: params.contractaddress,
      address: params.address,
      blockno: params.blockno,
    });

    return response.result;
  }
}
