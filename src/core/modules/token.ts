/**
 * @packageDocumentation
 * Token module for interacting with ERC20 tokens on Conflux eSpace.
 * Provides functionality for querying token balances, supplies, and historical data.
 * @module core/modules/token
 */

import { ESpaceApi } from "../api";
import { AddressValidator } from "../../utils";
import { createLogger } from "../../utils/logger";
import { Token } from "../../types";
import { ApiConfig } from "../../types";

/**
 * Module for handling ERC20 token-related operations on Conflux eSpace.
 * Provides methods for querying token balances, supplies, and historical data.
 *
 * @class TokenModule
 * @extends {ESpaceApi}
 */
export class TokenModule extends ESpaceApi {
  /** Logger instance for token operations */
  protected logger = createLogger("TokenModule");

  /**
   * Creates an instance of TokenModule.
   * @param {ApiConfig} config - Configuration object for the token module
   * @param {string} [config.target="mainnet"] - Target network ("mainnet" or "testnet")
   */
  constructor(config: ApiConfig = { target: "mainnet" }) {
    super(config);
  }

  /**
   * Get ERC20 token balance for an address.
   * Retrieves the current balance of a specific ERC20 token for a given address.
   *
   * @param {Token.TokenBalanceParams} params - Parameters for the token balance query
   * @param {string} params.address - Address to check the balance for
   * @param {string} params.contractaddress - Contract address of the ERC20 token
   * @returns {Promise<Token.TokenBalance>} The token balance
   * @throws {Error} If the address or contract address is invalid
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
   * Get ERC20 token total supply.
   * Retrieves the current total supply of a specific ERC20 token.
   *
   * @param {Token.TokenSupplyParams} params - Parameters for the token supply query
   * @param {string} params.contractaddress - Contract address of the ERC20 token
   * @returns {Promise<Token.TokenSupply>} The token total supply
   * @throws {Error} If the contract address is invalid
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
   * Get historical ERC20 token total supply at a specific block.
   * Retrieves the total supply of a specific ERC20 token at a given block number.
   *
   * @param {Token.TokenSupplyHistoryParams} params - Parameters for the historical token supply query
   * @param {string} params.contractaddress - Contract address of the ERC20 token
   * @param {string} params.address - Address to check the supply for
   * @param {number} params.blockno - Block number to check the supply at
   * @returns {Promise<Token.TokenSupplyHistory>} The historical token supply
   * @throws {Error} If any of the parameters are invalid
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
   * Get historical ERC20 token balance for an account at a specific block number.
   * Retrieves the balance of a specific ERC20 token for a given address at a specific block.
   *
   * @param {Token.TokenBalanceHistoryParams} params - Parameters for the historical balance query
   * @param {string} params.contractaddress - Contract address of the ERC20 token
   * @param {string} params.address - Address to check the balance for
   * @param {number} params.blockno - Block number to check the balance at
   * @returns {Promise<Token.TokenBalanceHistory>} The historical token balance
   * @throws {Error} If any of the parameters are invalid or missing
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
