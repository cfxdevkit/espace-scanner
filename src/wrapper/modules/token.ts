import { BaseWrapper } from "../base";
import {
  TokenData,
  TokenListResponse,
  TokenTransferList,
  TokenTransferItem,
} from "../../types/responses";
import { TokenTransferParams } from "../../types/params";

export class TokenWrapper extends BaseWrapper {
  /**
   * Get token information for multiple contracts
   */
  async getTokenInfos(contracts: string[], returnRaw: boolean = false): Promise<TokenData[]> {
    const data = await this.scanner.token.getTokenInfos(contracts);
    if (returnRaw) return data;
    return data.map((token) => ({
      ...token,
      totalSupply: token.totalSupply ? this.formatNumber(token.totalSupply) : "0",
      priceInUSDT: token.priceInUSDT ? `$${token.priceInUSDT}` : "$0",
    }));
  }

  /**
   * Get ERC20 token balance for an address
   */
  async getTokenBalance(
    contractAddress: string,
    address: string,
    decimals: number = 18,
    returnRaw: boolean = false
  ): Promise<string> {
    const data = await this.scanner.token.getTokenBalance(contractAddress, address);
    if (returnRaw) return data;
    return this.formatUnit(data, decimals);
  }

  /**
   * Get ERC20 token total supply
   */
  async getTokenSupply(
    contractAddress: string,
    decimals: number = 18,
    returnRaw: boolean = false
  ): Promise<string> {
    const data = await this.scanner.token.getTokenSupply(contractAddress);
    if (returnRaw) return data;
    return this.formatUnit(data, decimals);
  }

  /**
   * Get historical ERC20 token total supply at a specific block
   */
  async getTokenSupplyHistory(
    contractAddress: string,
    blockNumber: number,
    decimals: number = 18,
    returnRaw: boolean = false
  ): Promise<string> {
    const data = await this.scanner.token.getTokenSupplyHistory(contractAddress, blockNumber);
    if (returnRaw) return data;
    return this.formatUnit(data, decimals);
  }

  /**
   * Get historical ERC20 token balance for an account at a specific block number
   */
  async getTokenBalanceHistory(
    contractAddress: string,
    address: string,
    blockNumber: number,
    decimals: number = 18,
    returnRaw: boolean = false
  ): Promise<string> {
    const data = await this.scanner.token.getTokenBalanceHistory(
      contractAddress,
      address,
      blockNumber
    );
    if (returnRaw) return data;
    return this.formatUnit(data, decimals);
  }

  /**
   * Get token transfers with optional formatting
   */
  async getTokenTransfers(
    params: TokenTransferParams = {},
    returnRaw: boolean = false
  ): Promise<TokenTransferList> {
    const data = await this.scanner.account.getTokenTransfers(params);
    if (returnRaw) return data;
    return data.map((transfer: TokenTransferItem) => ({
      ...transfer,
      timeStamp: this.formatTimestamp(transfer.timeStamp),
      value: this.formatUnit(transfer.value, Number(transfer.tokenDecimal)),
      gas: this.formatGas(transfer.gas),
      gasUsed: this.formatGas(transfer.gasUsed),
      gasPrice: this.formatGas(transfer.gasPrice),
    }));
  }

  /**
   * Get account tokens with optional formatting
   */
  async getAccountTokens(
    address: string,
    tokenType: "ERC20" | "ERC721" = "ERC20",
    skip: number = 0,
    limit: number = 10,
    returnRaw: boolean = false
  ): Promise<TokenListResponse> {
    const response = await this.scanner.token.getAccountTokens(address, tokenType, skip, limit);
    if (returnRaw) return { list: response, total: response.length };
    return {
      list: response.map((token) => ({
        ...token,
        amount: token.amount ? this.formatUnit(token.amount, token.decimals) : "0",
        priceInUSDT: token.priceInUSDT ? `$${token.priceInUSDT}` : "$0",
      })),
      total: response.length,
    };
  }
}
