/**
 * Transaction status response
 */
export interface Status {
  /** Whether the transaction failed (0 for success, 1 for failure) */
  isError: string;
  /** Error description if failed */
  errDescription: string;
}

/**
 * Transaction receipt status response
 */
export interface ReceiptStatus {
  /** Transaction status (0 for failed, 1 for success) */
  status: string;
}

/**
 * Parameters for transaction status request
 */
export interface StatusParams {
  /** Transaction hash */
  txhash: string;
}

/**
 * Parameters for transaction receipt status request
 */
export interface ReceiptStatusParams {
  /** Transaction hash */
  txhash: string;
}

/**
 * Decoded method information
 */
export interface DecodedMethod {
  /** Transaction hash */
  hash: string;
  /** Decoded function call data */
  decodedData: string;
  /** Error message if decoding failed */
  error?: string;
}

/**
 * Raw decoded method information
 */
export interface DecodedMethodRaw {
  /** Contract address */
  contract?: string;
  /** Raw input data */
  input: string;
  /** Decoded function call data */
  decodedData: string;
  /** Error message if decoding failed */
  error?: string;
}

/**
 * Parameters for method decoding
 */
export interface DecodeMethodParams {
  /** Transaction hashes (comma-separated) */
  hashes: string;
}

/**
 * Parameters for raw method decoding
 */
export interface DecodeMethodRawParams {
  /** Contract addresses (comma-separated) */
  contracts: string;
  /** Input data (comma-separated) */
  inputs: string;
}
