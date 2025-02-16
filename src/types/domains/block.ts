// Types for /api?module=block&action=getblocknobytime
export interface BlockNumberByTimeParams {
  /** the integer representing the Unix timestamp in seconds */
  timestamp: number;

  /** the closest available block to the provided timestamp, either before or after
   * @default before */
  closest?: "before" | "after";
}

export type BlockNumberByTime = string;
