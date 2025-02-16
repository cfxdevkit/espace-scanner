import { ESpaceApi } from "../api";
import { createLogger } from "../../utils/logger";
import { ApiConfig } from "../../types";
import { Deprecated } from "../../types";
export class DeprecatedModule extends ESpaceApi {
  protected logger = createLogger("DeprecatedModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get block number by Unix timestamp
   */
  async AccountTransactions(
    params: Deprecated.AccountTransactionsParams
  ): Promise<Deprecated.AccountTransactions> {
    this.logger.debug({ params }, "Getting account transactions");

    if (typeof params.account !== "string") {
      this.logger.error({ params }, "Invalid account provided");
      throw new Error(`Invalid account: ${params.account}`);
    }

    const response = await this.fetchApi<Deprecated.AccountTransactions>("/account/transactions", {
      account: params.account,
      skip: params.skip,
      limit: params.limit,
      from: params.from,
      to: params.to,
      startBlock: params.startBlock,
      endBlock: params.endBlock,
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort?.toUpperCase(),
    });
    return response.result;
  }

  async CfxTransfers(params: Deprecated.CfxTransfersParams): Promise<Deprecated.CfxTransfers> {
    this.logger.debug({ params }, "Getting cfx transfers");

    const response = await this.fetchApi<Deprecated.CfxTransfers>("/account/cfx/transfers", {
      account: params.account,
      skip: params.skip,
      limit: params.limit,
      from: params.from,
      to: params.to,
      startBlock: params.startBlock,
      endBlock: params.endBlock,
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort?.toUpperCase(),
    });
    return response.result;
  }

  async Erc20Transfers(
    params: Deprecated.Erc20TransfersParams
  ): Promise<Deprecated.Erc20Transfers> {
    this.logger.debug({ params }, "Getting erc20 transfers");

    const response = await this.fetchApi<Deprecated.Erc20Transfers>("/account/erc20/transfers", {
      account: params.account,
      skip: params.skip,
      limit: params.limit,
      from: params.from,
      to: params.to,
      startBlock: params.startBlock,
      endBlock: params.endBlock,
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort?.toUpperCase(),
    });
    return response.result;
  }

  async Erc721Transfers(
    params: Deprecated.Erc721TransfersParams
  ): Promise<Deprecated.Erc721Transfers> {
    this.logger.debug({ params }, "Getting erc721 transfers");

    const response = await this.fetchApi<Deprecated.Erc721Transfers>("/account/erc721/transfers", {
      account: params.account,
      skip: params.skip,
      limit: params.limit,
      from: params.from,
      to: params.to,
      startBlock: params.startBlock,
      endBlock: params.endBlock,
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort?.toUpperCase(),
    });
    return response.result;
  }

  async Erc1155Transfers(
    params: Deprecated.Erc1155TransfersParams
  ): Promise<Deprecated.Erc1155Transfers> {
    this.logger.debug({ params }, "Getting erc1155 transfers");

    const response = await this.fetchApi<Deprecated.Erc1155Transfers>(
      "/account/erc1155/transfers",
      {
        account: params.account,
        skip: params.skip,
        limit: params.limit,
        from: params.from,
        to: params.to,
        startBlock: params.startBlock,
        endBlock: params.endBlock,
        minTimestamp: params.minTimestamp,
        maxTimestamp: params.maxTimestamp,
        sort: params.sort?.toUpperCase(),
      }
    );
    return response.result;
  }

  async Erc3525Transfers(
    params: Deprecated.Erc3525TransfersParams
  ): Promise<Deprecated.Erc3525Transfers> {
    this.logger.debug({ params }, "Getting erc3525 transfers");

    const response = await this.fetchApi<Deprecated.Erc3525Transfers>(
      "/account/erc3525/transfers",
      {
        account: params.account,
        skip: params.skip,
        limit: params.limit,
        from: params.from,
        to: params.to,
        startBlock: params.startBlock,
        endBlock: params.endBlock,
        minTimestamp: params.minTimestamp,
        maxTimestamp: params.maxTimestamp,
        sort: params.sort?.toUpperCase(),
      }
    );
    return response.result;
  }

  async AccountTransfers(
    params: Deprecated.AccountTransfersParams
  ): Promise<Deprecated.AccountTransfers> {
    this.logger.debug({ params }, "Getting account transfers");

    const response = await this.fetchApi<Deprecated.AccountTransfers>("/account/transfers", {
      account: params.account,
      skip: params.skip,
      limit: params.limit,
      from: params.from,
      to: params.to,
      startBlock: params.startBlock,
      endBlock: params.endBlock,
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort?.toUpperCase(),
      transferType: params.transferType,
    });
    return response.result;
  }

  async AccountApprovals(
    params: Deprecated.AccountApprovalsParams
  ): Promise<Deprecated.AccountApprovals> {
    this.logger.debug({ params }, "Getting account approvals");

    const response = await this.fetchApi<Deprecated.AccountApprovals>("/account/approvals", {
      account: params.account,
      tokenType: params.tokenType,
      byTokenId: params.byTokenId,
    });
    return response.result;
  }

  async AccountTokens(params: Deprecated.AccountTokensParams): Promise<Deprecated.AccountTokens> {
    this.logger.debug({ params }, "Getting account tokens");

    const response = await this.fetchApi<Deprecated.AccountTokens>("/account/tokens", {
      account: params.account,
      tokenType: params.tokenType,
    });
    return response.result;
  }

  async TokenTokeninfos(
    params: Deprecated.TokenTokeninfosParams
  ): Promise<Deprecated.TokenTokeninfos> {
    this.logger.debug({ params }, "Getting token tokeninfos");

    const response = await this.fetchApi<Deprecated.TokenTokeninfos>("/token/tokeninfos", {
      contracts: params.contracts,
    });
    return response.result;
  }
}
