/**
 * @fileoverview Core Scanner implementation for the Conflux eSpace Scanner API.
 * This file contains the main scanner class that provides access to all API modules.
 * @module core/scanner
 */

/**
 * Core implementation of the Conflux eSpace Scanner API.
 * Provides direct access to all API endpoints with basic data validation and error handling.
 */
import { ESpaceApi } from "./api";
import { createLogger } from "../utils/logger";
import {
  AccountModule,
  BlockModule,
  ContractModule,
  NFTModule,
  StatisticsModule,
  TokenModule,
  TransactionModule,
  UtilsModule,
  DeprecatedModule,
} from "./modules";
import { ApiConfig } from "../types";

/**
 * Main scanner class that provides access to all Conflux eSpace API modules.
 * Extends the base API class with specific module implementations.
 *
 * @class ESpaceScanner
 * @extends {ESpaceApi}
 */
export class ESpaceScanner extends ESpaceApi {
  /** Logger instance for the scanner */
  protected logger = createLogger("ESpaceScanner");

  /** Module for account-related operations */
  public readonly account: AccountModule;
  /** Module for block-related operations */
  public readonly block: BlockModule;
  /** Module for smart contract operations */
  public readonly contract: ContractModule;
  /** Module for NFT-related operations */
  public readonly nft: NFTModule;
  /** Module for statistics and metrics */
  public readonly statistics: StatisticsModule;
  /** Module for token-related operations */
  public readonly token: TokenModule;
  /** Module for transaction operations */
  public readonly transaction: TransactionModule;
  /** Module for utility functions */
  public readonly utils: UtilsModule;
  /** Module containing deprecated functionality */
  public readonly deprecated: DeprecatedModule;

  /**
   * Creates an instance of ESpaceScanner with all available modules.
   * @param {ApiConfig} config - Configuration object for the scanner
   * @param {string} [config.target="mainnet"] - Target network ("mainnet" or "testnet")
   * @param {string} [config.apiKey] - Optional API key for authenticated requests
   * @param {string} [config.host] - Optional custom host URL
   */
  constructor(config: ApiConfig = { target: "mainnet" }) {
    super(config);
    this.account = new AccountModule(config);
    this.block = new BlockModule(config);
    this.contract = new ContractModule(config);
    this.nft = new NFTModule(config);
    this.statistics = new StatisticsModule(config);
    this.token = new TokenModule(config);
    this.transaction = new TransactionModule(config);
    this.utils = new UtilsModule(config);
    this.deprecated = new DeprecatedModule(config);
  }
}
