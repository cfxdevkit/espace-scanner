/**
 * Utility class for handling date and timestamp formatting and calculations.
 * All timestamps are handled in UTC to ensure consistency across different timezones.
 */
export class DateFormatter {
  /**
   * Formats a timestamp into a human-readable date string.
   * @param timestamp - Unix timestamp (seconds) or ISO date string
   * @returns Formatted date string in "YYYY-MM-DD HH:mm:ss" format (UTC)
   * @example
   * formatTimestamp(1707307200) // returns "2024-02-07 12:00:00"
   * formatTimestamp("2024-02-07T12:00:00Z") // returns "2024-02-07 12:00:00"
   */
  static formatTimestamp(timestamp: number | string): string {
    try {
      const date = typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp * 1000);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      const seconds = String(date.getUTCSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch {
      return "N/A";
    }
  }

  /**
   * Gets the current Unix timestamp in seconds.
   * @returns Current Unix timestamp
   */
  static getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Gets the Unix timestamp from 24 hours ago.
   * @returns Unix timestamp from 24 hours ago
   */
  static get24HoursAgo(): number {
    return this.getCurrentTimestamp() - 24 * 60 * 60;
  }

  /**
   * Gets the Unix timestamp from a specified number of days ago.
   * @param days - Number of days to go back (can be fractional)
   * @returns Unix timestamp from specified days ago
   * @example
   * getTimeAgo(7) // returns timestamp from 7 days ago
   * getTimeAgo(0.5) // returns timestamp from 12 hours ago
   */
  static getTimeAgo(days: number): number {
    return this.getCurrentTimestamp() - days * 24 * 60 * 60;
  }
}
