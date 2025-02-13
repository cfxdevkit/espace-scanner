/**
 * Conflux eSpace Scanner API SDK
 * @module @cfxdevkit/confluxscan-espace
 */

// Core functionality
export {
  ESpaceApi,
  ESpaceScanner,
  AccountModule,
  BlockModule,
  ContractModule,
  NFTModule,
  StatsModule,
  TokenModule,
  TransactionModule,
} from "./core";

// Wrapper with formatting
export {
  ESpaceScannerWrapper,
  AccountWrapper,
  BlockWrapper,
  ContractWrapper,
  NFTWrapper,
  StatsWrapper,
  TokenWrapper,
  TransactionWrapper,
} from "./wrapper";

// Types
export { ApiConfig, ApiResponse, ConfluxTarget } from "./types/api";

export {
  // Response types
  ContractSourceData,
  ContractSourceResponse,
  TokenData,
  TokenListResponse,
  BasicStatItem,
  TokenHolderStatItem,
  TokenUniqueStatItem,
  BlockStatItem,
  TpsStatItem,
  TopGasItem,
  TopValueItem,
  TopTransferItem,
  StatsResponse,
  TopStatsResponse,
  ListResponse,
  TopStatsItem,
  // Account related types
  AccountBalanceMultiItem,
  InternalTransactionItem,
  InternalTransactionList,
  MinedBlockItem,
  MinedBlockList,
  NFTTransferItem,
  NFTTransferList,
  TokenTransferItem,
  TokenTransferList,
  TransactionItem,
  TransactionList,
  // NFT related types
  NFTBalance,
  NFTBalanceResponse,
  NFTFungibleToken,
  NFTFungibleTokenResponse,
  NFTOwner,
  NFTOwnerResponse,
  NFTPreview,
  NFTPreviewResponse,
  NFTToken,
  NFTTokenResponse,
  // Transaction related types
  DecodedMethod,
  DecodedMethodRaw,
} from "./types/responses";

export {
  StatsParams,
  StatsPeriod,
  TokenType,
  TokenTransferParams,
  BlockParams,
  TransactionParams,
  NFTTransferParams,
} from "./types/params";

// Formatters
export { NumberFormatter, DateFormatter, ResponseFormatter } from "./formatters";

// Utils
export { AddressValidator } from "./utils";
