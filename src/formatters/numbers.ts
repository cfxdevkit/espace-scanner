import { formatEther, formatUnits } from "viem";
import { createLogger } from "../utils/logger";

const logger = createLogger("NumberFormatter");

/**
 * Utility class for formatting numbers in various formats used throughout the application.
 * Handles formatting of regular numbers, percentages, gas values, CFX amounts, and token amounts.
 */
export class NumberFormatter {
  /**
   * Formats a number with comma separators and up to 4 decimal places.
   * @param value - The number to format (can be string or number)
   * @returns Formatted string with comma separators and optional decimals
   * @example
   * formatNumber(1234.5678) // returns "1,234.5678"
   * formatNumber(1000000) // returns "1,000,000"
   */
  static formatNumber(value: string | number | undefined): string {
    if (value === undefined || value === null || value === "") return "0";
    try {
      const num = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(num)) {
        logger.warn({ value }, "Invalid number value, returning 0");
        return "0";
      }

      // Handle decimal truncation manually to ensure exact 4 decimal places
      const parts = num.toString().split(".");
      if (parts.length === 1) return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      let decimals = parts[1];
      if (decimals.length > 4) {
        decimals = decimals.substring(0, 4);
      }

      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decimals;
    } catch (error) {
      logger.error(
        { value, error: error instanceof Error ? error.message : String(error) },
        "Error formatting number"
      );
      return "0";
    }
  }

  /**
   * Formats a number as a percentage with 2 decimal places.
   * @param value - The value to format as percentage
   * @returns Formatted percentage string with % symbol
   * @example
   * formatPercentage(50.5678) // returns "50.57%"
   * formatPercentage(0) // returns "0.00%"
   */
  static formatPercentage(value: string | number): string {
    if (value === undefined || value === null || value === "") return "0%";
    try {
      const num = Number(value);
      if (isNaN(num)) return "0%";
      return num.toFixed(2) + "%";
    } catch {
      return "0%";
    }
  }

  /**
   * Formats a gas value in Gwei (divides by 1e9).
   * @param value - The gas value to format
   * @returns Formatted gas value string
   * @example
   * formatGas(1000000000) // returns "1.0 Gwei"
   */
  static formatGas(value: string | number | undefined): string {
    if (!value) return "0 Gwei";
    try {
      const formatted = formatUnits(BigInt(value), 9);
      return `${this.formatNumber(formatted)} Gwei`;
    } catch (error) {
      logger.error("Error formatting gas value", { module: "NumberFormatter", value, error });
      return "0 Gwei";
    }
  }

  /**
   * Formats a CFX value with proper decimals and unit.
   * Handles scientific notation and converts to human-readable format.
   * @param value - The CFX value to format
   * @returns Formatted CFX value string with unit
   * @example
   * formatCFX("1000000000000000000") // returns "1 CFX"
   * formatCFX(1.5e18) // returns "1.5 CFX"
   */
  static formatCFX(value: string | number | undefined): string {
    if (!value) return "0 CFX";
    try {
      const formatted = formatEther(BigInt(value));
      return `${formatted} CFX`;
    } catch (error) {
      logger.error("Error formatting CFX value", { module: "NumberFormatter", value, error });
      return "0 CFX";
    }
  }
}
