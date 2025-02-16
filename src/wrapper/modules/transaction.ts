import { BaseWrapper } from "../base";
import { ApiConfig, Transaction } from "../../types";
import { TransactionModule } from "../../core/modules";

export class TransactionWrapper extends BaseWrapper {
  /**
   * Check contract execution status for a transaction
   */
  private transaction: TransactionModule;
  constructor(config: ApiConfig = { target: "mainnet" }) {
    super();
    this.transaction = new TransactionModule(config);
  }
  async getStatus(
    params: Transaction.StatusParams,
    returnRaw: boolean = false
  ): Promise<Transaction.Status> {
    const data = await this.transaction.getStatus(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Check transaction receipt status
   */
  async getReceiptStatus(
    params: Transaction.ReceiptStatusParams,
    returnRaw: boolean = false
  ): Promise<Transaction.ReceiptStatus> {
    const data = await this.transaction.getReceiptStatus(params);
    if (returnRaw) return data;
    return data;
  }
}
