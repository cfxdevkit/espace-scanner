import { BaseWrapper } from "../base";
import { DecodedMethod, DecodedMethodRaw, InternalTransactionList } from "../../types/responses";
import { TokenTransferParams } from "../../types/params";

export class TransactionWrapper extends BaseWrapper {
  /**
   * Check contract execution status for a transaction
   */
  async getTransactionStatus(txhash: string, _returnRaw: boolean = false): Promise<string> {
    const data = await this.scanner.transaction.getTransactionStatus(txhash);
    return data;
  }

  /**
   * Check transaction receipt status
   */
  async getTransactionReceiptStatus(txhash: string, _returnRaw: boolean = false): Promise<string> {
    const data = await this.scanner.transaction.getTransactionReceiptStatus(txhash);
    return data;
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
   * Decode transaction method data
   */
  async decodeMethod(
    data: string,
    contractAddress?: string,
    _returnRaw: boolean = false
  ): Promise<DecodedMethod> {
    const result = await this.scanner.transaction.decodeMethod(data, contractAddress);
    return result;
  }

  /**
   * Decode transaction method data in raw format
   */
  async decodeMethodRaw(data: string, _returnRaw: boolean = false): Promise<DecodedMethodRaw> {
    const result = await this.scanner.transaction.decodeMethodRaw(data);
    return result;
  }
}
