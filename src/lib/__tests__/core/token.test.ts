import { TokenModule } from "../../../core/modules/token";
import { jest } from "@jest/globals";

describe("TokenModule", () => {
  let module: TokenModule;

  beforeEach(() => {
    module = new TokenModule({ target: "mainnet" });
  });

  describe("getTokenBalance", () => {
    it("should get token balance correctly", async () => {
      const mockResponse = "1000000000000000000";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await module.getTokenBalance({
        address: "0x1234567890123456789012345678901234567890",
        contractaddress: "0x2234567890123456789012345678901234567890",
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error for invalid address", async () => {
      await expect(
        module.getTokenBalance({
          address: "invalid",
          contractaddress: "0x2234567890123456789012345678901234567890",
        })
      ).rejects.toThrow("Invalid address: invalid");
    });

    it("should throw error for invalid contract address", async () => {
      await expect(
        module.getTokenBalance({
          address: "0x1234567890123456789012345678901234567890",
          contractaddress: "invalid",
        })
      ).rejects.toThrow("Invalid contract address: invalid");
    });
  });

  describe("getTokenSupply", () => {
    it("should get token supply correctly", async () => {
      const mockResponse = "1000000000000000000";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await module.getTokenSupply({
        contractaddress: "0x1234567890123456789012345678901234567890",
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error for invalid contract address", async () => {
      await expect(
        module.getTokenSupply({
          contractaddress: "invalid",
        })
      ).rejects.toThrow("Invalid contract address: invalid");
    });
  });

  describe("getTokenSupplyHistory", () => {
    it("should get token supply history correctly", async () => {
      const mockResponse = "1000000000000000000";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await module.getTokenSupplyHistory({
        contractaddress: "0x1234567890123456789012345678901234567890",
        address: "0x3234567890123456789012345678901234567890",
        blockno: 1000,
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error for invalid contract address", async () => {
      await expect(
        module.getTokenSupplyHistory({
          contractaddress: "invalid",
          address: "0x3234567890123456789012345678901234567890",
          blockno: 1000,
        })
      ).rejects.toThrow("Invalid contract address: invalid");
    });

    it("should throw error for invalid block number", async () => {
      await expect(
        module.getTokenSupplyHistory({
          contractaddress: "0x1234567890123456789012345678901234567890",
          address: "0x3234567890123456789012345678901234567890",
          blockno: -1,
        })
      ).rejects.toThrow("Invalid block number: -1");
    });

    it("should throw error for invalid address", async () => {
      await expect(
        module.getTokenSupplyHistory({
          contractaddress: "0x1234567890123456789012345678901234567890",
          address: "invalid",
          blockno: 1000,
        })
      ).rejects.toThrow("Invalid address: invalid");
    });

    it("should throw error for non-numeric block number", async () => {
      await expect(
        module.getTokenSupplyHistory({
          contractaddress: "0x1234567890123456789012345678901234567890",
          address: "0x3234567890123456789012345678901234567890",
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          blockno: "invalid" as any,
        })
      ).rejects.toThrow("Invalid block number: invalid");
    });
  });

  describe("getTokenBalanceHistory", () => {
    it("should get token balance history correctly", async () => {
      const mockResponse = "1000000000000000000";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await module.getTokenBalanceHistory({
        contractaddress: "0x1234567890123456789012345678901234567890",
        address: "0x2234567890123456789012345678901234567890",
        blockno: 1000,
      });
      expect(result).toBe(mockResponse);
    });

    it("should throw error when contract address is missing", async () => {
      await expect(
        module.getTokenBalanceHistory({
          address: "0x2234567890123456789012345678901234567890",
          blockno: 1000,
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      ).rejects.toThrow("Contract address is required");
    });

    it("should throw error when address is missing", async () => {
      await expect(
        module.getTokenBalanceHistory({
          contractaddress: "0x1234567890123456789012345678901234567890",
          blockno: 1000,
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      ).rejects.toThrow("Account address is required");
    });

    it("should throw error when block number is missing", async () => {
      await expect(
        module.getTokenBalanceHistory({
          contractaddress: "0x1234567890123456789012345678901234567890",
          address: "0x2234567890123456789012345678901234567890",
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      ).rejects.toThrow("Valid block number is required");
    });

    it("should throw error when block number is negative", async () => {
      await expect(
        module.getTokenBalanceHistory({
          contractaddress: "0x1234567890123456789012345678901234567890",
          address: "0x2234567890123456789012345678901234567890",
          blockno: -1,
        })
      ).rejects.toThrow("Valid block number is required");
    });
  });
});
