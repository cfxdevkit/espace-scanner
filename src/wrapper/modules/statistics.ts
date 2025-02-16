import { BaseWrapper } from "../base";
import { ApiConfig, Statistics } from "../../types";
import { StatisticsModule } from "../../core/modules";

export class StatisticsWrapper extends BaseWrapper {
  /**
   * Get supply
   */
  private stats: StatisticsModule;
  constructor(config: ApiConfig = { target: "mainnet" }) {
    super();
    this.stats = new StatisticsModule(config);
  }
  async getSupply(returnRaw: boolean = false): Promise<Statistics.Supply> {
    const data = await this.stats.getSupply();
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get mining statistics
   */
  async getMining(
    params: Statistics.MiningParams,
    returnRaw: boolean = false
  ): Promise<Statistics.Mining> {
    const data = await this.stats.getMining(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get TPS statistics
   */
  async getTps(params: Statistics.TpsParams, returnRaw: boolean = false): Promise<Statistics.Tps> {
    const data = await this.stats.getTps(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get contract statistics
   */
  async getContract(
    params: Statistics.ContractParams,
    returnRaw: boolean = false
  ): Promise<Statistics.Contract> {
    const data = await this.stats.getContract(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get CFX holder statistics
   */
  async getCfxHolder(
    params: Statistics.CfxHolderParams,
    returnRaw: boolean = false
  ): Promise<Statistics.CfxHolder> {
    const data = await this.stats.getCfxHolder(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get account growth statistics
   */
  async getAccountGrowth(
    params: Statistics.AccountGrowthParams,
    returnRaw: boolean = false
  ): Promise<Statistics.AccountGrowth> {
    const data = await this.stats.getAccountGrowth(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get active account statistics
   */
  async getAccountActive(
    params: Statistics.AccountActiveParams,
    returnRaw: boolean = false
  ): Promise<Statistics.AccountActive> {
    const data = await this.stats.getAccountActive(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get active account overall statistics
   */
  async getAccountActiveOverall(
    params: Statistics.ActiveOverallParams,
    returnRaw: boolean = false
  ): Promise<Statistics.ActiveOverall> {
    const data = await this.stats.getAccountActiveOverall(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get transaction statistics
   */
  async getTransaction(
    params: Statistics.TransactionParams,
    returnRaw: boolean = false
  ): Promise<Statistics.Transaction> {
    const data = await this.stats.getTransaction(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get CFX transfer statistics
   */
  async getCfxTransfer(
    params: Statistics.CfxTransferParams,
    returnRaw: boolean = false
  ): Promise<Statistics.CfxTransfer> {
    const data = await this.stats.getCfxTransfer(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get token transfer statistics
   */
  async getTokenTransfer(
    params: Statistics.TokenTransferParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TokenTransfer> {
    const data = await this.stats.getTokenTransfer(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get top gas used statistics
   */
  async getTopGasUsed(
    params: Statistics.TopGasUsedParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TopGasUsed> {
    const data = await this.stats.getTopGasUsed(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get top miner statistics
   */
  async getTopMiner(
    params: Statistics.TopMinerParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TopMiner> {
    const data = await this.stats.getTopMiner(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get top transaction sender statistics
   */
  async getTopTransactionSender(
    params: Statistics.TopTransactionSenderParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TopTransactionSender> {
    const data = await this.stats.getTopTransactionSender(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get top transaction receiver statistics
   */
  async getTopTransactionReceiver(
    params: Statistics.TopTransactionReceiverParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TopTransactionReceiver> {
    const data = await this.stats.getTopTransactionReceiver(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get top CFX sender statistics
   */
  async getTopCfxSender(
    params: Statistics.TopCfxSenderParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TopCfxSender> {
    const data = await this.stats.getTopCfxSender(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get top CFX receiver statistics
   */
  async getTopCfxReceiver(
    params: Statistics.TopCfxReceiverParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TopCfxReceiver> {
    const data = await this.stats.getTopCfxReceiver(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get top token transfer statistics
   */
  async getTopTokenTransfer(
    params: Statistics.TopTokenTransferParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TopTokenTransfer> {
    const data = await this.stats.getTopTokenTransfer(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get top token receiver statistics
   */
  async getTopTokenReceiver(
    params: Statistics.TopTokenReceiverParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TopTokenReceiver> {
    const data = await this.stats.getTopTokenReceiver(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get top token participant statistics
   */
  async getTopTokenParticipant(
    params: Statistics.TopTokenParticipantParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TopTokenParticipant> {
    const data = await this.stats.getTopTokenParticipant(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get token holder statistics
   */
  async getTokenHolder(
    params: Statistics.TokenHolderParams,
    returnRaw: boolean = false
  ): Promise<Statistics.TokenHolder> {
    const data = await this.stats.getTokenHolder(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get unique sender statistics
   */
  async getUniqueSender(
    params: Statistics.UniqueSenderParams,
    returnRaw: boolean = false
  ): Promise<Statistics.UniqueSender> {
    const data = await this.stats.getUniqueSender(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get unique receiver statistics
   */
  async getUniqueReceiver(
    params: Statistics.UniqueReceiverParams,
    returnRaw: boolean = false
  ): Promise<Statistics.UniqueReceiver> {
    const data = await this.stats.getUniqueReceiver(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get unique participant statistics
   */
  async getUniqueParticipant(
    params: Statistics.UniqueParticipantParams,
    returnRaw: boolean = false
  ): Promise<Statistics.UniqueParticipant> {
    const data = await this.stats.getUniqueParticipant(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get block base fee statistics
   */
  async getBlockBasefee(
    params: Statistics.BlockBasefeeParams,
    returnRaw: boolean = false
  ): Promise<Statistics.BlockBasefee> {
    const data = await this.stats.getBlockBasefee(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get block average priority fee statistics
   */
  async getBlockAvgpriorityfee(
    params: Statistics.BlockAvgpriorityfeeParams,
    returnRaw: boolean = false
  ): Promise<Statistics.BlockAvgpriorityfee> {
    const data = await this.stats.getBlockAvgpriorityfee(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get block gas used statistics
   */
  async getBlockGasused(
    params: Statistics.BlockGasusedParams,
    returnRaw: boolean = false
  ): Promise<Statistics.BlockGasused> {
    const data = await this.stats.getBlockGasused(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get block transactions by type statistics
   */
  async getBlockTxsbytype(
    params: Statistics.BlockTxsbytypeParams,
    returnRaw: boolean = false
  ): Promise<Statistics.BlockTxsbytype> {
    const data = await this.stats.getBlockTxsbytype(params);
    if (returnRaw) return data;
    return data;
  }
}
