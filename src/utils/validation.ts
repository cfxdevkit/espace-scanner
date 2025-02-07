import { isAddress } from "viem";

export class AddressValidator {
  static validateAddress(address: string): boolean {
    const isValid = isAddress(address);
    if (!isValid) {
      console.error(`Invalid eSpace address: ${address}`);
    }
    return isValid;
  }

  static validateAddresses(addresses: string[]): boolean {
    return addresses.every((address) => this.validateAddress(address));
  }
}
