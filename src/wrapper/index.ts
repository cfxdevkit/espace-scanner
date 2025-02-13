/**
 * High-level wrapper for the Conflux eSpace Scanner API.
 * Provides formatted responses and additional data processing.
 * @module wrapper
 */

export { ESpaceScannerWrapper } from "./scanner";

// Wrapper modules
export {
  AccountWrapper,
  BlockWrapper,
  ContractWrapper,
  NFTWrapper,
  StatsWrapper,
  TokenWrapper,
  TransactionWrapper,
} from "./modules";
