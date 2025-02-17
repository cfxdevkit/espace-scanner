/**
 * @packageDocumentation
 * Deprecated wrapper module for the Conflux eSpace Scanner SDK.
 * Provides high-level methods for deprecated operations with data formatting.
 * @module wrapper/modules/deprecated
 * @category Wrappers
 */

import { BaseWrapper } from "../base";
import { ApiConfig, Deprecated } from "../../types";
import { DeprecatedModule } from "../../core/modules";
export class DeprecatedWrapper extends BaseWrapper {
  /**
   * Get account transactions
   */
  private deprecated: DeprecatedModule;
  constructor(config: ApiConfig = { target: "mainnet" }) {
    super();
    this.deprecated = new DeprecatedModule(config);
  }
  async AccountTransactions(
    params: Deprecated.AccountTransactionsParams,
    returnRaw: boolean = false
  ): Promise<Deprecated.AccountTransactions> {
    const data = await this.deprecated.AccountTransactions(params);
    if (returnRaw) return data;
    data.list = data.list?.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
      gasPrice: tx.gasPrice ? this.formatGas(tx.gasPrice) : tx.gasPrice,
      gasFee: tx.gasFee ? this.formatGas(tx.gasFee) : tx.gasFee,
      value: tx.value ? this.formatCFX(tx.value) : tx.value,
    }));
    return data;
  }

  /**
   * Get CFX transfers
   */
  async CfxTransfers(
    params: Deprecated.CfxTransfersParams,
    returnRaw: boolean = false
  ): Promise<Deprecated.CfxTransfers> {
    const data = await this.deprecated.CfxTransfers(params);
    if (returnRaw) return data;
    data.list = data.list?.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
      amount: tx.amount ? this.formatCFX(tx.amount) : tx.amount,
    }));
    return data;
  }

  /**
   * Get ERC20 transfers
   */
  async Erc20Transfers(
    params: Deprecated.Erc20TransfersParams,
    returnRaw: boolean = false
  ): Promise<Deprecated.Erc20Transfers> {
    const data = await this.deprecated.Erc20Transfers(params);
    if (returnRaw) return data;
    data.list = data.list?.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
      amount: tx.amount
        ? this.formatUnit(
            tx.amount,
            tx.contract ? (data.addressInfo?.[tx.contract]?.token?.decimals ?? 18) : 18
          )
        : tx.amount,
    }));
    return data;
  }

  /**
   * Get ERC721 transfers
   */
  async Erc721Transfers(
    params: Deprecated.Erc721TransfersParams,
    returnRaw: boolean = false
  ): Promise<Deprecated.Erc721Transfers> {
    const data = await this.deprecated.Erc721Transfers(params);
    if (returnRaw) return data;
    data.list = data.list?.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
    }));
    return data;
  }

  /**
   * Get ERC1155 transfers
   */
  async Erc1155Transfers(
    params: Deprecated.Erc1155TransfersParams,
    returnRaw: boolean = false
  ): Promise<Deprecated.Erc1155Transfers> {
    const data = await this.deprecated.Erc1155Transfers(params);
    if (returnRaw) return data;
    data.list = data.list?.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
    }));
    return data;
  }

  /**
   * Get ERC3525 transfers
   */
  async Erc3525Transfers(
    params: Deprecated.Erc3525TransfersParams,
    returnRaw: boolean = false
  ): Promise<Deprecated.Erc3525Transfers> {
    const data = await this.deprecated.Erc3525Transfers(params);
    if (returnRaw) return data;
    data.list = data.list?.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
    }));
    return data;
  }

  /**
   * Get account transfers
   */
  async AccountTransfers(
    params: Deprecated.AccountTransfersParams,
    returnRaw: boolean = false
  ): Promise<Deprecated.AccountTransfers> {
    const data = await this.deprecated.AccountTransfers(params);
    if (returnRaw) return data;
    data.list = data.list?.map((tx) => ({
      ...tx,
      timestamp: tx.timestamp ? this.formatTimestamp(Number(tx.timestamp)) : tx.timestamp,
      amount: tx.amount
        ? this.formatUnit(
            tx.amount,
            tx.contract ? (data.addressInfo?.[tx.contract]?.token?.decimals ?? 18) : 18
          )
        : tx.amount,
    }));
    return data;
  }

  /**
   * Get account approvals
   */
  async AccountApprovals(
    params: Deprecated.AccountApprovalsParams,
    returnRaw: boolean = false
  ): Promise<Deprecated.AccountApprovals> {
    const data = await this.deprecated.AccountApprovals(params);
    if (returnRaw) return data;
    return data;
  }

  /**
   * Get account tokens
   */
  async AccountTokens(
    params: Deprecated.AccountTokensParams,
    returnRaw: boolean = false
  ): Promise<Deprecated.AccountTokens> {
    const data = await this.deprecated.AccountTokens(params);
    if (returnRaw) return data;
    data.list = data.list?.map((tx) => ({
      ...tx,
      amount: tx.amount ? this.formatUnit(tx.amount, tx.decimals ?? 18) : tx.amount,
    }));
    return data;
  }

  /**
   * Get token tokeninfos
   */
  async Tokeninfos(
    params: Deprecated.TokeninfosParams,
    returnRaw: boolean = false
  ): Promise<Deprecated.Tokeninfos> {
    const data = await this.deprecated.Tokeninfos(params);
    if (returnRaw) return data;
    return data;
  }
}
