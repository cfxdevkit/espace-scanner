import { ESpaceApi } from "../api";
import { AddressValidator } from "../../utils";
import { createLogger } from "../../utils/logger";
import {
  NFTBalanceResponse,
  NFTTokenResponse,
  NFTPreviewResponse,
  NFTFungibleTokenResponse,
  NFTOwnerResponse,
} from "../../types";
import { ApiConfig } from "../../types/api";

export class NFTModule extends ESpaceApi {
  protected logger = createLogger("NFTModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get NFT balances for an address
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
}
