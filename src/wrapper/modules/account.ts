import { BaseWrapper } from "../base";
import { Account, ApiConfig } from "../../types";
import { AccountModule } from "../../core/modules";
export class AccountWrapper extends BaseWrapper {
  /**
   * Get CFX balance for a single address
   */
  private account: AccountModule;
  constructor(config: ApiConfig = { target: "mainnet" }) {
    super();
    this.account = new AccountModule(config);
  }
  async getBalance(params: Account.BalanceParams, returnRaw: boolean = false): Promise<string> {
    const data = await this.account.getBalance(params);
    if (returnRaw) return data;
    return this.formatCFX(data);
  }

  /**
   * Get CFX balance for multiple addresses in a single call
   */
  async getBalanceMulti(
    params: Account.BalanceMultiParams,
    returnRaw: boolean = false
  ): Promise<Account.BalanceMulti> {
    const data = await this.account.getBalanceMulti(params);
    if (returnRaw) return data;
    return data.map((item) => [item[0], this.formatCFX(item[1])]);
  }

  /**
   * Get a list of normal transactions by address
   */
  async getTransactionList(
    params: Account.TxlistParams,
    returnRaw: boolean = false
  ): Promise<Account.Txlist[]> {
    const data = await this.account.getTransactionList(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timeStamp: tx.timeStamp ? this.formatTimestamp(tx.timeStamp) : tx.timeStamp,
      value: tx.value ? this.formatCFX(tx.value) : tx.value,
      gas: tx.gas ? this.formatGas(tx.gas) : tx.gas,
      gasUsed: tx.gasUsed ? this.formatGas(tx.gasUsed) : tx.gasUsed,
    }));
  }

  /**
   * Get a list of internal transactions
   */
  async getInternalTransactionList(
    params: Account.TxlistinternalParams,
    returnRaw: boolean = false
  ): Promise<Account.Txlistinternal[]> {
    const data = await this.account.getInternalTransactionList(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timeStamp: tx.timeStamp ? this.formatTimestamp(tx.timeStamp) : tx.timeStamp,
      value: tx.value ? this.formatCFX(tx.value) : tx.value,
    }));
  }

  /**
   * Get a list of token transfers
   */
  async getTokenTransfers(
    params: Account.TokentxParams,
    returnRaw: boolean = false
  ): Promise<Account.Tokentx[]> {
    const data = await this.account.getTokenTransfers(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timeStamp: tx.timeStamp ? this.formatTimestamp(tx.timeStamp) : tx.timeStamp,
      value:
        tx.value && tx.tokenDecimal ? this.formatUnit(tx.value, Number(tx.tokenDecimal)) : tx.value,
    }));
  }

  /**
   * Get a list of NFT token transfers
   */
  async getNFTTransfers(
    params: Account.TokenNFTtxParams,
    returnRaw: boolean = false
  ): Promise<Account.TokenNFTtx[]> {
    const data = await this.account.getNFTTransfers(params);
    if (returnRaw) return data;
    return data.map((tx) => ({
      ...tx,
      timeStamp: tx.timeStamp ? this.formatTimestamp(tx.timeStamp) : tx.timeStamp,
    }));
  }

  /**
   * Get a list of blocks mined by an address
   */
  async getMinedBlocks(
    params: Account.GetminedblocksParams,
    returnRaw: boolean = false
  ): Promise<Account.Getminedblocks[]> {
    const data = await this.account.getMinedBlocks(params);
    if (returnRaw) return data;
    return data.map((block) => ({
      ...block,
      timeStamp: block.timeStamp ? this.formatTimestamp(block.timeStamp) : block.timeStamp,
      blockReward: block.blockReward ? this.formatCFX(block.blockReward) : block.blockReward,
    }));
  }

  /**
   * Get balance history for an address
   */
  async getBalanceHistory(
    params: Account.BalancehistoryParams,
    returnRaw: boolean = false
  ): Promise<Account.Balancehistory> {
    const data = await this.account.getBalanceHistory(params);
    if (returnRaw) return data;
    return this.formatCFX(data);
  }
}
