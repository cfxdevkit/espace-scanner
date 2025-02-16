import { ESpaceApi } from "../api";
import { createLogger } from "../../utils/logger";
import { ApiConfig } from "../../types";
import { Statistics } from "../../types";
export class StatisticsModule extends ESpaceApi {
  protected logger = createLogger("StatisticsModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get supply
   */
  async getSupply(): Promise<Statistics.Supply> {
    this.logger.debug("Getting supply");

    const response = await this.fetchApi<Statistics.Supply>("/statistics/supply");
    return response.result;
  }

  async getMining(params: Statistics.MiningParams): Promise<Statistics.Mining> {
    this.logger.debug("Getting mining");

    const response = await this.fetchApi<Statistics.Mining>("/statistics/mining", {
      intervalType: params.intervalType,
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getTps(params: Statistics.TpsParams): Promise<Statistics.Tps> {
    this.logger.debug("Getting tps");

    const response = await this.fetchApi<Statistics.Tps>("/statistics/tps", {
      intervalType: params.intervalType,
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getContract(params: Statistics.ContractParams): Promise<Statistics.Contract> {
    this.logger.debug("Getting contract");

    const response = await this.fetchApi<Statistics.Contract>("/statistics/contract", {
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getCfxHolder(params: Statistics.CfxHolderParams): Promise<Statistics.CfxHolder> {
    this.logger.debug("Getting cfx holder");

    const response = await this.fetchApi<Statistics.CfxHolder>("/statistics/account/cfx/holder", {
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getAccountGrowth(
    params: Statistics.AccountGrowthParams
  ): Promise<Statistics.AccountGrowth> {
    this.logger.debug("Getting account growth");

    const response = await this.fetchApi<Statistics.AccountGrowth>("/statistics/account/growth", {
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getAccountActive(
    params: Statistics.AccountActiveParams
  ): Promise<Statistics.AccountActive> {
    this.logger.debug("Getting active account");

    const response = await this.fetchApi<Statistics.AccountActive>("/statistics/account/active", {
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getAccountActiveOverall(
    params: Statistics.ActiveOverallParams
  ): Promise<Statistics.ActiveOverall> {
    this.logger.debug("Getting active account overall");

    const response = await this.fetchApi<Statistics.ActiveOverall>(
      "/statistics/account/active/overall",
      {
        minTimestamp: params.minTimestamp,
        maxTimestamp: params.maxTimestamp,
        sort: params.sort,
        skip: params.skip,
        limit: params.limit,
      }
    );
    return response.result;
  }

  async getTransaction(params: Statistics.TransactionParams): Promise<Statistics.Transaction> {
    this.logger.debug("Getting transaction");

    const response = await this.fetchApi<Statistics.Transaction>("/statistics/transaction", {
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getCfxTransfer(params: Statistics.CfxTransferParams): Promise<Statistics.CfxTransfer> {
    this.logger.debug("Getting cfx transfer");

    const response = await this.fetchApi<Statistics.CfxTransfer>("/statistics/cfx/transfer", {
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getTokenTransfer(
    params: Statistics.TokenTransferParams
  ): Promise<Statistics.TokenTransfer> {
    this.logger.debug("Getting token transfer");

    const response = await this.fetchApi<Statistics.TokenTransfer>("/statistics/token/transfer", {
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getTopGasUsed(params: Statistics.TopGasUsedParams): Promise<Statistics.TopGasUsed> {
    this.logger.debug("Getting top gas used");

    const response = await this.fetchApi<Statistics.TopGasUsed>("/statistics/top/gas/used", {
      spanType: params.spanType,
    });
    return response.result;
  }

  async getTopMiner(params: Statistics.TopMinerParams): Promise<Statistics.TopMiner> {
    this.logger.debug("Getting top miner");

    const response = await this.fetchApi<Statistics.TopMiner>("/statistics/top/miner", {
      spanType: params.spanType,
    });
    return response.result;
  }

  async getTopTransactionSender(
    params: Statistics.TopTransactionSenderParams
  ): Promise<Statistics.TopTransactionSender> {
    this.logger.debug("Getting top transaction sender");

    const response = await this.fetchApi<Statistics.TopTransactionSender>(
      "/statistics/top/transaction/sender",
      {
        spanType: params.spanType,
      }
    );
    return response.result;
  }

  async getTopTransactionReceiver(
    params: Statistics.TopTransactionReceiverParams
  ): Promise<Statistics.TopTransactionReceiver> {
    this.logger.debug("Getting top transaction receiver");

    const response = await this.fetchApi<Statistics.TopTransactionReceiver>(
      "/statistics/top/transaction/receiver",
      {
        spanType: params.spanType,
      }
    );
    return response.result;
  }

  async getTopCfxSender(params: Statistics.TopCfxSenderParams): Promise<Statistics.TopCfxSender> {
    this.logger.debug("Getting top cfx sender");

    const response = await this.fetchApi<Statistics.TopCfxSender>("/statistics/top/cfx/sender", {
      spanType: params.spanType,
    });
    return response.result;
  }

  async getTopCfxReceiver(
    params: Statistics.TopCfxReceiverParams
  ): Promise<Statistics.TopCfxReceiver> {
    this.logger.debug("Getting top cfx receiver");

    const response = await this.fetchApi<Statistics.TopCfxReceiver>(
      "/statistics/top/cfx/receiver",
      {
        spanType: params.spanType,
      }
    );
    return response.result;
  }

  async getTopTokenTransfer(
    params: Statistics.TopTokenTransferParams
  ): Promise<Statistics.TopTokenTransfer> {
    this.logger.debug("Getting top token transfer");

    const response = await this.fetchApi<Statistics.TopTokenTransfer>(
      "/statistics/top/token/transfer",
      {
        spanType: params.spanType,
      }
    );
    return response.result;
  }

  async getTopTokenReceiver(
    params: Statistics.TopTokenReceiverParams
  ): Promise<Statistics.TopTokenReceiver> {
    this.logger.debug("Getting top token receiver");

    const response = await this.fetchApi<Statistics.TopTokenReceiver>(
      "/statistics/top/token/receiver",
      {
        spanType: params.spanType,
      }
    );
    return response.result;
  }

  async getTopTokenParticipant(
    params: Statistics.TopTokenParticipantParams
  ): Promise<Statistics.TopTokenParticipant> {
    this.logger.debug("Getting top token participant");

    const response = await this.fetchApi<Statistics.TopTokenParticipant>(
      "/statistics/top/token/participant",
      {
        spanType: params.spanType,
      }
    );
    return response.result;
  }

  async getTokenHolder(params: Statistics.TokenHolderParams): Promise<Statistics.TokenHolder> {
    this.logger.debug("Getting token holder");

    const response = await this.fetchApi<Statistics.TokenHolder>("/statistics/token/holder", {
      contract: params.contract,
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getUniqueSender(params: Statistics.UniqueSenderParams): Promise<Statistics.UniqueSender> {
    this.logger.debug("Getting unique sender");

    const response = await this.fetchApi<Statistics.UniqueSender>(
      "/statistics/token/unique/sender",
      {
        contract: params.contract,
        minTimestamp: params.minTimestamp,
        maxTimestamp: params.maxTimestamp,
        sort: params.sort,
        skip: params.skip,
        limit: params.limit,
      }
    );
    return response.result;
  }

  async getUniqueReceiver(
    params: Statistics.UniqueReceiverParams
  ): Promise<Statistics.UniqueReceiver> {
    this.logger.debug("Getting unique receiver");

    const response = await this.fetchApi<Statistics.UniqueReceiver>(
      "/statistics/token/unique/receiver",
      {
        contract: params.contract,
        minTimestamp: params.minTimestamp,
        maxTimestamp: params.maxTimestamp,
        sort: params.sort,
        skip: params.skip,
        limit: params.limit,
      }
    );
    return response.result;
  }

  async getUniqueParticipant(
    params: Statistics.UniqueParticipantParams
  ): Promise<Statistics.UniqueParticipant> {
    this.logger.debug("Getting unique participant");

    const response = await this.fetchApi<Statistics.UniqueParticipant>(
      "/statistics/token/unique/participant",
      {
        contract: params.contract,
        minTimestamp: params.minTimestamp,
        maxTimestamp: params.maxTimestamp,
        sort: params.sort,
        skip: params.skip,
        limit: params.limit,
      }
    );
    return response.result;
  }

  async getBlockBasefee(params: Statistics.BlockBasefeeParams): Promise<Statistics.BlockBasefee> {
    this.logger.debug("Getting block basefee");

    const response = await this.fetchApi<Statistics.BlockBasefee>("/statistics/block/base-fee", {
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getBlockAvgpriorityfee(
    params: Statistics.BlockAvgpriorityfeeParams
  ): Promise<Statistics.BlockAvgpriorityfee> {
    this.logger.debug("Getting block avgpriorityfee");

    const response = await this.fetchApi<Statistics.BlockAvgpriorityfee>(
      "/statistics/block/avg-priority-fee",
      {
        minTimestamp: params.minTimestamp,
        maxTimestamp: params.maxTimestamp,
        sort: params.sort,
        skip: params.skip,
        limit: params.limit,
      }
    );
    return response.result;
  }

  async getBlockGasused(params: Statistics.BlockGasusedParams): Promise<Statistics.BlockGasused> {
    this.logger.debug("Getting block gasused");

    const response = await this.fetchApi<Statistics.BlockGasused>("/statistics/block/gas-used", {
      minTimestamp: params.minTimestamp,
      maxTimestamp: params.maxTimestamp,
      sort: params.sort,
      skip: params.skip,
      limit: params.limit,
    });
    return response.result;
  }

  async getBlockTxsbytype(
    params: Statistics.BlockTxsbytypeParams
  ): Promise<Statistics.BlockTxsbytype> {
    this.logger.debug("Getting block txsbytype");

    const response = await this.fetchApi<Statistics.BlockTxsbytype>(
      "/statistics/block/txs-by-type",
      {
        minTimestamp: params.minTimestamp,
        maxTimestamp: params.maxTimestamp,
        sort: params.sort,
        skip: params.skip,
        limit: params.limit,
      }
    );
    return response.result;
  }
}
