/**
 * High-level wrapper for the Conflux eSpace Scanner API.
 * Provides formatted responses and additional data processing on top of the core scanner.
 * All functionality is delegated to specialized modules for better organization and maintainability.
 */
import { ApiConfig } from "../types/api";
import { BaseWrapper } from "./base";
import {
  AccountWrapper,
  BlockWrapper,
  ContractWrapper,
  NFTWrapper,
  StatsWrapper,
  TokenWrapper,
  TransactionWrapper,
} from "./modules";

export class ESpaceScannerWrapper extends BaseWrapper {
  public readonly account: AccountWrapper;
  public readonly block: BlockWrapper;
  public readonly contract: ContractWrapper;
  public readonly nft: NFTWrapper;
  public readonly stats: StatsWrapper;
  public readonly token: TokenWrapper;
  public readonly transaction: TransactionWrapper;

  /**
   * Create a new ESpaceScannerWrapper instance
   * @param config API configuration (optional)
   */
  constructor(config: ApiConfig = {}) {
    super(config);
    this.account = new AccountWrapper(config);
    this.block = new BlockWrapper(config);
    this.contract = new ContractWrapper(config);
    this.nft = new NFTWrapper(config);
    this.stats = new StatsWrapper(config);
    this.token = new TokenWrapper(config);
    this.transaction = new TransactionWrapper(config);
  }
}
