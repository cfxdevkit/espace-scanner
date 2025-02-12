import { ESpaceApi } from "../api";
import { AddressValidator } from "../../utils";
import { createLogger } from "../../utils/logger";
import { ContractSourceResponse } from "../../types";
import { ApiConfig } from "../../types/api";

export class ContractModule extends ESpaceApi {
  protected logger = createLogger("ContractModule");

  constructor(config: ApiConfig) {
    super(config);
  }

  /**
   * Get ABI for a verified contract
   */
  async getContractABI(address: string): Promise<object> {
    this.logger.debug({ address }, "Getting contract ABI");
    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for contract ABI");
      throw new Error(`Invalid address: ${address}`);
    }
    const response = await this.fetchApi<string>("/api", {
      module: "contract",
      action: "getabi",
      address,
    });
    if (!response.result) {
      this.logger.error({ address }, "Contract ABI not available");
      throw new Error(`Contract ${address} not verified or ABI not available`);
    }
    this.logger.debug({ address }, "Successfully retrieved contract ABI");
    return JSON.parse(response.result);
  }

  /**
   * Get source code for a verified contract
   */
  async getContractSourceCode(address: string): Promise<ContractSourceResponse> {
    this.logger.debug({ address }, "Getting contract source code");
    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for contract source");
      throw new Error(`Invalid address: ${address}`);
    }
    const response = await this.fetchApi<ContractSourceResponse[]>("/api", {
      module: "contract",
      action: "getsourcecode",
      address,
    });
    if (!response.result?.[0]) {
      this.logger.error({ address }, "Contract source code not available");
      throw new Error(`Contract ${address} not verified or source code not available`);
    }
    this.logger.debug({ address }, "Successfully retrieved contract source code");
    return response.result[0];
  }

  /**
   * Check source code verification submission status
   */
  async checkVerifyStatus(guid: string): Promise<string> {
    this.logger.debug({ guid }, "Checking source code verification status");

    if (!guid) {
      this.logger.error("GUID is required for checking verification status");
      throw new Error("GUID is required for checking verification status");
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "contract",
        action: "checkverifystatus",
        guid,
      })
    ).result;
  }

  /**
   * Verify a proxy contract
   */
  async verifyProxyContract(address: string, expectedImplementation?: string): Promise<string> {
    this.logger.debug({ address, expectedImplementation }, "Verifying proxy contract");

    if (!AddressValidator.validateAddress(address)) {
      this.logger.error({ address }, "Invalid address provided for proxy contract verification");
      throw new Error(`Invalid address: ${address}`);
    }

    if (expectedImplementation && !AddressValidator.validateAddress(expectedImplementation)) {
      this.logger.error(
        { expectedImplementation },
        "Invalid implementation address provided for proxy contract verification"
      );
      throw new Error(`Invalid implementation address: ${expectedImplementation}`);
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "contract",
        action: "verifyproxycontract",
        address,
        ...(expectedImplementation && { expectedimplementation: expectedImplementation }),
      })
    ).result;
  }

  /**
   * Check proxy contract verification submission status
   */
  async checkProxyVerification(guid: string): Promise<string> {
    this.logger.debug({ guid }, "Checking proxy contract verification status");

    if (!guid) {
      this.logger.error("GUID is required for checking proxy verification status");
      throw new Error("GUID is required for checking proxy verification status");
    }

    return (
      await this.fetchApi<string>("/api", {
        module: "contract",
        action: "checkproxyverification",
        guid,
      })
    ).result;
  }
}
