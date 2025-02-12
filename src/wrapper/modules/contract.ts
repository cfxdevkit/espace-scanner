import { BaseWrapper } from "../base";
import { ContractSourceResponse } from "../../types/responses";

export class ContractWrapper extends BaseWrapper {
  /**
   * Get contract ABI with optional formatting
   */
  async getContractABI(address: string, _returnRaw: boolean = false): Promise<object> {
    const data = await this.scanner.contract.getContractABI(address);
    return data;
  }

  /**
   * Get contract source code with optional formatting
   */
  async getContractSourceCode(
    address: string,
    returnRaw: boolean = false
  ): Promise<ContractSourceResponse> {
    const data = await this.scanner.contract.getContractSourceCode(address);
    if (returnRaw) return data;
    return {
      ...data,
      Runs: this.formatNumber(data.Runs),
    };
  }

  /**
   * Check source code verification submission status
   */
  async checkVerifyStatus(guid: string, _returnRaw: boolean = false): Promise<string> {
    const data = await this.scanner.contract.checkVerifyStatus(guid);
    return data;
  }

  /**
   * Verify a proxy contract
   */
  async verifyProxyContract(
    address: string,
    expectedImplementation?: string,
    _returnRaw: boolean = false
  ): Promise<string> {
    const data = await this.scanner.contract.verifyProxyContract(address, expectedImplementation);
    return data;
  }

  /**
   * Check proxy contract verification submission status
   */
  async checkProxyVerification(guid: string, _returnRaw: boolean = false): Promise<string> {
    const data = await this.scanner.contract.checkProxyVerification(guid);
    return data;
  }
}
