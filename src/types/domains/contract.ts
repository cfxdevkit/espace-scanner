/**
 * Parameters for getting contract source code
 */
export interface SourceParams {
  /** Contract address */
  address: string;
}

/**
 * Contract source code information
 */
export interface Source {
  /** Contract source code */
  SourceCode: string;
  /** Contract ABI */
  ABI: string;
  /** Contract name */
  ContractName: string;
  /** Compiler version used */
  CompilerVersion: string;
  /** Whether optimization was used (1 for yes, 0 for no) */
  OptimizationUsed: string;
  /** Number of optimization runs */
  Runs: string;
  /** Constructor arguments */
  ConstructorArguments: string;
  /** EVM version */
  EVMVersion: string;
  /** Library addresses */
  Library: string;
  /** License type */
  LicenseType: string;
  /** Whether contract is a proxy */
  Proxy: string;
  /** Implementation contract address if proxy */
  Implementation: string;
  /** Swarm source */
  SwarmSource: string;
}

/**
 * Parameters for getting contract ABI
 */
export interface ABIParams {
  /** Contract address */
  address: string;
}

/**
 * Contract ABI
 */
export type ABI = object;

/**
 * Parameters for checking verification status
 */
export interface checkVerifyStatusParams {
  /** Verification GUID */
  guid: string;
}

/**
 * Contract verification status response
 */
export type checkVerifyStatus = Source;

/**
 * Parameters for verifying proxy contract
 */
export interface verifyProxyContractParams {
  /** Contract address */
  address: string;
  /** Expected implementation address */
  expectedimplementation?: string;
}

/**
 * Proxy verification status response
 */
export type verifyProxyContract = string;

/**
 * Parameters for checking proxy verification status
 */
export type checkProxyVerificationParams = checkVerifyStatusParams;

/**
 * Proxy verification status response
 */
export type checkProxyVerification = string;
