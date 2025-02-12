import { ESpaceApi } from "../api";
import { AddressValidator } from "../../utils";
import { createLogger } from "../../utils/logger";
import {
  AccountBalanceMulti,
  AccountBalanceMultiItem,
  TransactionList,
  TransactionItem,
  InternalTransactionList,
  TokenTransferList,
  NFTTransferList,
  MinedBlockList,
} from "../../types";
import { ApiConfig } from "../../types/api";

export class AccountModule extends ESpaceApi {
  protected logger = createLogger("AccountModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get CFX balance for a single address
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

    return (
      await this.fetchApi<InternalTransactionList>("/api", {
        module: "account",
        action: "txlistinternal",
        ...(address && { address }),
        ...(txhash && { txhash }),
        ...(startBlock !== undefined && { startblock: startBlock }),
        ...(endBlock !== undefined && { endblock: endBlock }),
        page,
        offset,
        sort,
      })
    ).result;
  }

  /**
   * Get a list of token transfers
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
}
