import { ResponseFormatter } from "../formatters";
/**
 * Base wrapper class that provides common functionality for all wrapper modules.
 * Handles module instance creation and common formatting methods.
 */
export class BaseWrapper {
  constructor() {}

  protected formatTimestamp(value: string | number): string {
    return ResponseFormatter.formatTimestamp(value);
  }

  protected formatCFX(value: string): string {
    return ResponseFormatter.formatCFX(value);
  }

  protected formatGas(value: string): string {
    return ResponseFormatter.formatGas(value);
  }

  protected formatNumber(value: string | number): string {
    return ResponseFormatter.formatNumber(value);
  }

  protected formatUnit(value: string, decimals: number): string {
    return ResponseFormatter.formatUnit(value, decimals);
  }
}
