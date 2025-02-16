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

export class ESpaceScanner extends ESpaceApi {
  protected logger = createLogger("ESpaceScanner");

  public readonly account: AccountModule;
  public readonly block: BlockModule;
  public readonly contract: ContractModule;
  public readonly nft: NFTModule;
  public readonly statistics: StatisticsModule;
  public readonly token: TokenModule;
  public readonly transaction: TransactionModule;
  public readonly utils: UtilsModule;
  public readonly deprecated: DeprecatedModule;
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
