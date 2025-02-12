import { BaseWrapper } from "../base";
import {
  NFTBalanceResponse,
  NFTTokenResponse,
  NFTPreviewResponse,
  NFTFungibleTokenResponse,
  NFTOwnerResponse,
  NFTTransferList,
} from "../../types/responses";
import { NFTTransferParams } from "../../types/params";

export class NFTWrapper extends BaseWrapper {
  /**
   * Get NFT balances for an address
   */
  async getNFTBalances(
    address: string,
    skip: number = 0,
    limit: number = 10,
    returnRaw: boolean = false
  ): Promise<NFTBalanceResponse> {
    const data = await this.scanner.nft.getNFTBalances(address, skip, limit);
    if (returnRaw) return data;
    return {
      ...data,
      list: data.list.map((item) => ({
        ...item,
        amount: this.formatNumber(item.amount),
      })),
    };
  }

  /**
   * Get NFT tokens for a contract
   */
  async getNFTTokens(
    contractAddress: string,
    skip: number = 0,
    limit: number = 10,
    _returnRaw: boolean = false
  ): Promise<NFTTokenResponse> {
    const data = await this.scanner.nft.getNFTTokens(contractAddress, skip, limit);
    return data;
  }

  /**
   * Get NFT preview data
   */
  async getNFTPreview(
    contractAddress: string,
    tokenId: string,
    _returnRaw: boolean = false
  ): Promise<NFTPreviewResponse> {
    const data = await this.scanner.nft.getNFTPreview(contractAddress, tokenId);
    return data;
  }

  /**
   * Get NFT fungible tokens for a contract
   */
  async getNFTFungibleTokens(
    contractAddress: string,
    skip: number = 0,
    limit: number = 10,
    _returnRaw: boolean = false
  ): Promise<NFTFungibleTokenResponse> {
    const data = await this.scanner.nft.getNFTFungibleTokens(contractAddress, skip, limit);
    return data;
  }

  /**
   * Get NFT owners for a specific token
   */
  async getNFTOwners(
    contractAddress: string,
    tokenId: string,
    skip: number = 0,
    limit: number = 10,
    returnRaw: boolean = false
  ): Promise<NFTOwnerResponse> {
    const data = await this.scanner.nft.getNFTOwners(contractAddress, tokenId, skip, limit);
    if (returnRaw) return data;
    return {
      ...data,
      list: data.list.map((item) => ({
        ...item,
        quantity: this.formatNumber(item.quantity),
      })),
    };
  }

  /**
   * Get a list of NFT token transfers with optional formatting
   */
  async getNFTTransfers(
    params: NFTTransferParams = {},
    returnRaw: boolean = false
  ): Promise<NFTTransferList> {
    const data = await this.scanner.account.getNFTTransfers(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timeStamp: this.formatTimestamp(tx.timeStamp),
      gas: this.formatGas(tx.gas),
      gasPrice: this.formatGas(tx.gasPrice),
      cumulativeGasUsed: this.formatGas(tx.cumulativeGasUsed),
      gasUsed: this.formatGas(tx.gasUsed),
    }));
  }
}
