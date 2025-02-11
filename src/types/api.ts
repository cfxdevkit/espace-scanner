export type ConfluxTarget = "mainnet" | "testnet";

export interface ApiResponse<T> {
  status: string;
  message: string;
  result: T;
}

export interface ApiConfig {
  target?: ConfluxTarget;
  apiKey?: string;
  host?: string;
}
