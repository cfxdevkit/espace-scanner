/**
 * High-level wrapper for the Conflux eSpace Scanner API.
 * Provides formatted responses and additional data processing on top of the core modules.
 * All functionality is delegated to specialized modules for better organization and maintainability.
 *
 * @example
 * ```typescript
 * // Create a new scanner instance for mainnet
 * const scanner = new ESpaceScannerWrapper({ target: 'mainnet' });
 *
 * // Get account balance
 * const balance = await scanner.account.getBalance({
 *   address: '0x1234...'
 * });
 *
 * // Get token transfers
 * const transfers = await scanner.token.getTransfers({
 *   address: '0x1234...'
 * });
 * ```
 *
 * @public
 */
import { ApiConfig } from "../types";
import { BaseWrapper } from "./base";
import {
  AccountWrapper,
  BlockWrapper,
  ContractWrapper,
  NFTWrapper,
  StatisticsWrapper,
  TokenWrapper,
  TransactionWrapper,
  UtilsWrapper,
  DeprecatedWrapper,
} from "./modules";

export class ESpaceScannerWrapper extends BaseWrapper {
  /** Account module for balance and transaction queries */
  public readonly account: AccountWrapper;
  /** Block module for block data and timestamps */
  public readonly block: BlockWrapper;
  /** Contract module for contract verification and source code */
  public readonly contract: ContractWrapper;
  /** NFT module for NFT balances and transfers */
  public readonly nft: NFTWrapper;
  /** Statistics module for network metrics */
  public readonly stats: StatisticsWrapper;
  /** Token module for token balances and transfers */
  public readonly token: TokenWrapper;
  /** Transaction module for transaction data and receipts */
  public readonly transaction: TransactionWrapper;
  /** Utilities module for method decoding and other tools */
  public readonly utils: UtilsWrapper;
  /** Deprecated module for legacy endpoints */
  public readonly deprecated: DeprecatedWrapper;

  /**
   * Create a new ESpaceScannerWrapper instance
   * @param config - API configuration options
   * @param config.target - Network target ('mainnet' or 'testnet')
   * @param config.apiKey - Optional API key for authentication
   * @param config.host - Optional custom API host URL
   */
  constructor(config: ApiConfig = { target: "mainnet" }) {
    super();
    this.account = new AccountWrapper(config);
    this.block = new BlockWrapper(config);
    this.contract = new ContractWrapper(config);
    this.nft = new NFTWrapper(config);
    this.stats = new StatisticsWrapper(config);
    this.token = new TokenWrapper(config);
    this.transaction = new TransactionWrapper(config);
    this.utils = new UtilsWrapper(config);
    this.deprecated = new DeprecatedWrapper(config);
  }
}
