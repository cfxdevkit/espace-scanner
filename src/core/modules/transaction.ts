import { ESpaceApi } from "../api";
import { createLogger } from "../../utils/logger";
import { DecodedMethod, DecodedMethodRaw } from "../../types";
import { ApiConfig } from "../../types/api";

export class TransactionModule extends ESpaceApi {
  protected logger = createLogger("TransactionModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Check contract execution status for a transaction
   */
  async getTransactionStatus(txhash: string): Promise<string> {
    this.logger.debug({ txhash }, "Getting transaction status");

    if (!txhash) {
      this.logger.error("Transaction hash is required for checking status");
      throw new Error("Transaction hash is required for checking status");
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "transaction",
        action: "getstatus",
        txhash,
      })
    ).result;
  }

  /**
   * Check transaction receipt status
   */
  async getTransactionReceiptStatus(txhash: string): Promise<string> {
    this.logger.debug({ txhash }, "Getting transaction receipt status");

    if (!txhash) {
      this.logger.error("Transaction hash is required for checking receipt status");
      throw new Error("Transaction hash is required for checking receipt status");
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "transaction",
        action: "gettxreceiptstatus",
        txhash,
      })
    ).result;
  }

  /**
   * Decode transaction method data
   */
  async decodeMethod(data: string, contractAddress?: string): Promise<DecodedMethod> {
    this.logger.debug({ data, contractAddress }, "Decoding method data");
    if (!data) {
      throw new Error("Method data is required");
    }
    const response = await this.fetchApi<DecodedMethod>("/util/decode/method", {
      data,
      ...(contractAddress && { contract: contractAddress }),
    });
    return response.result;
  }

  /**
   * Decode transaction method data in raw format
   */
  async decodeMethodRaw(data: string): Promise<DecodedMethodRaw> {
    this.logger.debug({ data }, "Decoding method data in raw format");
    if (!data) {
      throw new Error("Method data is required");
    }
    const response = await this.fetchApi<DecodedMethodRaw>("/util/decode/method/raw", {
      data,
    });
    return response.result;
  }
}
