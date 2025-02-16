import { ESpaceApi } from "../api";
import { AddressValidator } from "../../utils";
import { createLogger } from "../../utils/logger";
import { ApiConfig, Contract } from "../../types";

export class ContractModule extends ESpaceApi {
  protected logger = createLogger("ContractModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get ABI for a verified contract
   */
  async getABI(params: Contract.ABIParams): Promise<Contract.ABI> {
    this.logger.debug({ params }, "Getting contract ABI");
    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for contract ABI");
      throw new Error(`Invalid address: ${params.address}`);
    }
    const response = await this.fetchApi<string>("/api", {
      module: "contract",
      action: "getabi",
      address: params.address,
    });
    if (!response.result) {
      this.logger.error({ params }, "Contract ABI not available");
      throw new Error(`Contract ${params.address} not verified or ABI not available`);
    }
    this.logger.debug({ params }, "Successfully retrieved contract ABI");
    return JSON.parse(response.result);
  }

  /**
   * Get source code for a verified contract
   */
  async getSourceCode(params: Contract.SourceParams): Promise<Contract.Source> {
    this.logger.debug({ params }, "Getting contract source code");
    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for contract source");
      throw new Error(`Invalid address: ${params.address}`);
    }
    const response = await this.fetchApi<Contract.Source[]>("/api", {
      module: "contract",
      action: "getsourcecode",
      address: params.address,
    });
    if (!response.result?.[0]) {
      this.logger.error({ params }, "Contract source code not available");
      throw new Error(`Contract ${params.address} not verified or source code not available`);
    }
    this.logger.debug({ params }, "Successfully retrieved contract source code");
    return response.result[0];
  }

  /**
   * Check source code verification submission status
   */
  async checkVerifyStatus(
    params: Contract.checkVerifyStatusParams
  ): Promise<Contract.checkVerifyStatus> {
    this.logger.debug({ params }, "Checking source code verification status");

    if (!params.guid) {
      this.logger.error({ params }, "GUID is required for checking verification status");
      throw new Error("GUID is required for checking verification status");
    }

    return (
      await this.fetchApi<Contract.checkVerifyStatus>("/api", {
        module: "contract",
        action: "checkverifystatus",
        guid: params.guid,
      })
    ).result;
  }

  /**
   * Verify a proxy contract
   */
  async verifyProxyContract(
    params: Contract.verifyProxyContractParams
  ): Promise<Contract.verifyProxyContract> {
    this.logger.debug({ params }, "Verifying proxy contract");

    if (!AddressValidator.validateAddress(params.address)) {
      this.logger.error({ params }, "Invalid address provided for proxy contract verification");
      throw new Error(`Invalid address: ${params.address}`);
    }

    if (
      params.expectedimplementation &&
      !AddressValidator.validateAddress(params.expectedimplementation)
    ) {
      this.logger.error(
        { params },
        "Invalid implementation address provided for proxy contract verification"
      );
      throw new Error(`Invalid implementation address: ${params.expectedimplementation}`);
    }

    return (
      await this.fetchApi<Contract.verifyProxyContract>("/api", {
        module: "contract",
        action: "verifyproxycontract",
        address: params.address,
        ...(params.expectedimplementation && {
          expectedimplementation: params.expectedimplementation,
        }),
      })
    ).result;
  }

  /**
   * Check proxy contract verification submission status
   */
  async checkProxyVerification(
    params: Contract.checkProxyVerificationParams
  ): Promise<Contract.checkProxyVerification> {
    this.logger.debug({ params }, "Checking proxy contract verification status");

    if (!params.guid) {
      this.logger.error({ params }, "GUID is required for checking proxy verification status");
      throw new Error("GUID is required for checking proxy verification status");
    }

    return (
      await this.fetchApi<Contract.checkProxyVerification>("/api", {
        module: "contract",
        action: "checkproxyverification",
        guid: params.guid,
      })
    ).result;
  }
}
