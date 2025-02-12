import { ESpaceScanner } from "../core";
import { ResponseFormatter } from "../formatters";
import { ApiConfig } from "../types/api";

/**
 * Base wrapper class that provides common functionality for all wrapper modules.
 * Handles scanner instance creation and common formatting methods.
 */
export class BaseWrapper {
  protected readonly scanner: ESpaceScanner;
  protected readonly formatter: typeof ResponseFormatter;

  constructor(config: ApiConfig = {}) {
    this.scanner = new ESpaceScanner(config);
    this.formatter = ResponseFormatter;
  }

  protected formatTimestamp(value: string | number): string {
    return this.formatter.formatTimestamp(value);
  }

  protected formatCFX(value: string): string {
    return this.formatter.formatCFX(value);
  }

  protected formatGas(value: string): string {
    return this.formatter.formatGas(value);
  }

  protected formatNumber(value: string | number): string {
    return this.formatter.formatNumber(value);
  }

  protected formatUnit(value: string, decimals: number): string {
    return this.formatter.formatUnit(value, decimals);
  }
}
