import { ESpaceApi } from "../api";
import { AddressValidator } from "../../utils";
import { createLogger } from "../../utils/logger";
import { NFT } from "../../types";
import { ApiConfig } from "../../types";

export class NFTModule extends ESpaceApi {
  protected logger = createLogger("NFTModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get NFT balances for an address
   */
  async getBalances(params: NFT.BalancesParams): Promise<NFT.Balances> {
    this.logger.debug({ params }, "Getting NFT balances");
    if (!AddressValidator.validateAddress(params.owner)) {
      throw new Error(`Invalid address: ${params.owner}`);
    }
    const response = await this.fetchApi<NFT.Balances>("/nft/balances", {
      owner: params.owner,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  /**
   * Get NFT tokens for a contract
   */
  async getTokens(params: NFT.TokensParams): Promise<NFT.Tokens> {
    this.logger.debug({ params }, "Getting NFT tokens");
    if (!AddressValidator.validateAddress(params.contract)) {
      throw new Error(`Invalid contract address: ${params.contract}`);
    }
    const response = await this.fetchApi<NFT.Tokens>("/nft/tokens", {
      contract: params.contract,
      owner: params.owner,
      sort: params.sort,
      sortField: params.sortField,
      cursor: params.cursor,
      skip: params.skip,
      limit: params.limit,
      withBrief: params.withBrief,
      withMetadata: params.withMetadata,
      suppressMetadataError: params.suppressMetadataError,
    });
    return response.result;
  }

  /**
   * Get NFT preview data
   */
  async getPreview(params: NFT.PreviewParams): Promise<NFT.Preview> {
    this.logger.debug({ params }, "Getting NFT preview");
    if (!AddressValidator.validateAddress(params.contract)) {
      throw new Error(`Invalid contract address: ${params.contract}`);
    }
    const response = await this.fetchApi<NFT.Preview>("/nft/preview", {
      contract: params.contract,
      tokenId: params.tokenId,
      withMetadata: params.withMetadata,
    });
    return response.result;
  }

  /**
   * Get NFT fungible tokens for a contract
   */
  async getFts(params: NFT.FtsParams): Promise<NFT.Fts> {
    this.logger.debug({ params }, "Search the NFT by NFT name and/or contract address.");
    const response = await this.fetchApi<NFT.Fts>("/nft/fts", {
      contract: params.contract,
      name: params.name,
    });
    return response.result;
  }

  /**
   * Get NFT owners for a specific token
   */
  async getOwners(params: NFT.OwnersParams): Promise<NFT.Owners> {
    this.logger.debug({ params }, "Getting NFT owners");
    if (!AddressValidator.validateAddress(params.contract)) {
      throw new Error(`Invalid contract address: ${params.contract}`);
    }
    const response = await this.fetchApi<NFT.Owners>("/nft/owners", {
      contract: params.contract,
      tokenId: params.tokenId,
      cursor: params.cursor,
      limit: params.limit,
    });
    return response.result;
  }

  /**
   * Get NFT transfers for a specific token
   */
  async getTransfers(params: NFT.TransfersParams): Promise<NFT.Transfers> {
    this.logger.debug({ params }, "Getting NFT transfers");
    if (!AddressValidator.validateAddress(params.contract)) {
      throw new Error(`Invalid contract address: ${params.contract}`);
    }
    const response = await this.fetchApi<NFT.Transfers>("/nft/transfers", {
      contract: params.contract,
      tokenId: params.tokenId,
      cursor: params.cursor,
      limit: params.limit,
      from: params.from,
      to: params.to,
      startBlock: params.startBlock,
      endBlock: params.endBlock,
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
    });
    return response.result;
  }
}
