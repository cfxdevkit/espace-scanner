import { ESpaceApi } from "../api";
import { createLogger } from "../../utils/logger";
import { Transaction } from "../../types";
import { ApiConfig } from "../../types";

export class TransactionModule extends ESpaceApi {
  protected logger = createLogger("TransactionModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Check contract execution status for a transaction
   */
  async getStatus(params: Transaction.StatusParams): Promise<Transaction.Status> {
    this.logger.debug({ params }, "Getting transaction status");

    if (!params.txhash) {
      this.logger.error({ params }, "Transaction hash is required for checking status");
      throw new Error("Transaction hash is required for checking status");
    }

    return (
      await this.fetchApi<Transaction.Status>("/api", {
        module: "transaction",
        action: "getstatus",
        txhash: params.txhash,
      })
    ).result;
  }

  /**
   * Check transaction receipt status
   */
  async getReceiptStatus(
    params: Transaction.ReceiptStatusParams
  ): Promise<Transaction.ReceiptStatus> {
    this.logger.debug({ params }, "Getting transaction receipt status");

    if (!params.txhash) {
      this.logger.error({ params }, "Transaction hash is required for checking receipt status");
      throw new Error("Transaction hash is required for checking receipt status");
    }

    return (
      await this.fetchApi<Transaction.ReceiptStatus>("/api", {
        module: "transaction",
        action: "gettxreceiptstatus",
        txhash: params.txhash,
      })
    ).result;
  }
}
