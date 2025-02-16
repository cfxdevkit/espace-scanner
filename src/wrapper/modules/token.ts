/**
 * @packageDocumentation
 * Token-related wrapper module for the Conflux eSpace Scanner SDK.
 * Provides high-level methods for token operations with data formatting.
 * @module wrapper/modules/token
 * @category Wrappers
 */

import { BaseWrapper } from "../base";
import { ApiConfig, Token } from "../../types";
import { TokenModule } from "../../core/modules";

export class TokenWrapper extends BaseWrapper {
  /**
   * Get ERC20 token balance for an address
   */
  private token: TokenModule;
  constructor(config: ApiConfig = { target: "mainnet" }) {
    super();
    this.token = new TokenModule(config);
  }
  async getTokenBalance(
    params: Token.TokenBalanceParams,
    returnRaw: boolean = false
  ): Promise<string> {
    const data = await this.token.getTokenBalance(params);
    if (returnRaw) return data;
    return this.formatNumber(data);
  }

  /**
   * Get ERC20 token total supply
   */
  async getTokenSupply(
    params: Token.TokenSupplyParams,
    returnRaw: boolean = false,
    decimals?: number
  ): Promise<string> {
    const data = await this.token.getTokenSupply(params);
    if (returnRaw) return data;
    return this.formatNumber(this.formatUnit(data, decimals ?? 18));
  }

  /**
   * Get historical ERC20 token total supply at a specific block
   */
  async getTokenSupplyHistory(
    params: Token.TokenSupplyHistoryParams,
    returnRaw: boolean = false,
    decimals?: number
  ): Promise<string> {
    const data = await this.token.getTokenSupplyHistory(params);
    if (returnRaw) return data;
    return this.formatNumber(this.formatUnit(data, decimals ?? 18));
  }

  /**
   * Get historical ERC20 token balance for an account at a specific block number
   */
  async getTokenBalanceHistory(
    params: Token.TokenBalanceHistoryParams,
    returnRaw: boolean = false,
    decimals?: number
  ): Promise<string> {
    const data = await this.token.getTokenBalanceHistory(params);
    if (returnRaw) return data;
    return this.formatUnit(data, decimals ?? 18);
  }
}
