import { BaseWrapper } from "../base";
import {
  AccountBalanceMulti,
  TransactionList,
  InternalTransactionList,
  TokenTransferList,
  NFTTransferList,
  MinedBlockList,
} from "../../types/responses";
import { TransactionParams, TokenTransferParams, BlockParams } from "../../types/params";

export class AccountWrapper extends BaseWrapper {
  /**
   * Get CFX balance for a single address with optional formatting
   */
  async getBalance(
    address: string,
    tag: string = "latest_state",
    returnRaw: boolean = false
  ): Promise<string> {
    const data = await this.scanner.account.getBalance(address, tag);
    if (returnRaw) return data;
    return this.formatCFX(data);
  }

  /**
   * Get CFX balance for multiple addresses with optional formatting
   */
  async getBalanceMulti(
    addresses: string[],
    tag: string = "latest_state",
    returnRaw: boolean = false
  ): Promise<AccountBalanceMulti> {
    const data = await this.scanner.account.getBalanceMulti(addresses, tag);
    if (returnRaw) return data;
    return data.map(([address, balance]) => [address, this.formatCFX(balance)]);
  }

  /**
   * Get a list of normal transactions by address with optional formatting
   */
  async getTransactionList(
    address: string,
    params: TransactionParams = {},
    returnRaw: boolean = false
  ): Promise<TransactionList> {
    const { startBlock, endBlock, page = 1, offset = 100, sort = "desc" } = params;
    const data = await this.scanner.account.getTransactionList(
      address,
      startBlock,
      endBlock,
      page,
      offset,
      sort
    );
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timeStamp: this.formatTimestamp(tx.timeStamp),
      value: this.formatCFX(tx.value),
      gas: this.formatGas(tx.gas),
      gasPrice: this.formatGas(tx.gasPrice),
      cumulativeGasUsed: this.formatGas(tx.cumulativeGasUsed),
      gasUsed: this.formatGas(tx.gasUsed),
    }));
  }

  /**
   * Get a list of internal transactions with optional formatting
   */
  async getInternalTransactionList(
    params: TokenTransferParams = {},
    returnRaw: boolean = false
  ): Promise<InternalTransactionList> {
    const data = await this.scanner.account.getInternalTransactionList(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timeStamp: this.formatTimestamp(tx.timeStamp),
      value: this.formatCFX(tx.value),
      gas: this.formatGas(tx.gas),
      gasUsed: this.formatGas(tx.gasUsed),
    }));
  }

  /**
   * Get a list of token transfers with optional formatting
   */
  async getTokenTransfers(
    params: TokenTransferParams = {},
    returnRaw: boolean = false
  ): Promise<TokenTransferList> {
    const data = await this.scanner.account.getTokenTransfers(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timeStamp: this.formatTimestamp(tx.timeStamp),
      value: this.formatUnit(tx.value, Number(tx.tokenDecimal)),
      gas: this.formatGas(tx.gas),
      gasPrice: this.formatGas(tx.gasPrice),
      gasUsed: this.formatGas(tx.gasUsed),
      cumulativeGasUsed: this.formatGas(tx.cumulativeGasUsed),
    }));
  }

  /**
   * Get a list of NFT transfers with optional formatting
   */
  async getNFTTransfers(
    params: TokenTransferParams = {},
    returnRaw: boolean = false
  ): Promise<NFTTransferList> {
    const data = await this.scanner.account.getNFTTransfers(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timeStamp: this.formatTimestamp(tx.timeStamp),
      gas: this.formatGas(tx.gas),
      gasPrice: this.formatGas(tx.gasPrice),
      gasUsed: this.formatGas(tx.gasUsed),
      cumulativeGasUsed: this.formatGas(tx.cumulativeGasUsed),
    }));
  }

  /**
   * Get a list of blocks mined by an address with optional formatting
   */
  async getMinedBlocks(
    address: string,
    params: BlockParams = {},
    returnRaw: boolean = false
  ): Promise<MinedBlockList> {
    const { blockType = "blocks", page = 1, offset = 100 } = params;
    const data = await this.scanner.account.getMinedBlocks(address, blockType, page, offset);
    if (returnRaw) return data;
    return data.map((block) => ({
      ...block,
      timeStamp: this.formatTimestamp(block.timeStamp),
      blockReward: this.formatCFX(block.blockReward),
      gasUsed: this.formatGas(block.gasUsed),
      gasLimit: this.formatGas(block.gasLimit),
    }));
  }
}
