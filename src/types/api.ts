export type ConfluxTarget = "mainnet" | "testnet";

export interface ApiConfig {
  target?: ConfluxTarget;
  apiKey?: string;
  host?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  result: T;
}
