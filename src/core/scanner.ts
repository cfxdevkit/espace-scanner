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
  StatsModule,
  TokenModule,
  TransactionModule,
} from "./modules";
import { ApiConfig } from "../types/api";

export class ESpaceScanner extends ESpaceApi {
  protected logger = createLogger("ESpaceScanner");

  public readonly account: AccountModule;
  public readonly block: BlockModule;
  public readonly contract: ContractModule;
  public readonly nft: NFTModule;
  public readonly stats: StatsModule;
  public readonly token: TokenModule;
  public readonly transaction: TransactionModule;

  constructor(config: ApiConfig = {}) {
    super(config);
    this.account = new AccountModule(config);
    this.block = new BlockModule(config);
    this.contract = new ContractModule(config);
    this.nft = new NFTModule(config);
    this.stats = new StatsModule(config);
    this.token = new TokenModule(config);
    this.transaction = new TransactionModule(config);
  }
}
