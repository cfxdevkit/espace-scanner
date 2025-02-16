import { TokenWrapper } from "../../../wrapper/modules/token";
import { jest } from "@jest/globals";

describe("TokenWrapper", () => {
  let wrapper: TokenWrapper;
  const mockAddress = "0x1234567890123456789012345678901234567890";
  const mockContractAddress = "0x2234567890123456789012345678901234567890";

  beforeEach(() => {
    wrapper = new TokenWrapper({ target: "mainnet" });
  });

  describe("getTokenBalance", () => {
    it("should get token balance and format it correctly", async () => {
      const mockResponse = "1000000000000000000"; // 1 Token
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenBalance({
        address: mockAddress,
        contractaddress: mockContractAddress,
      });
      expect(result).toBe("1,000,000,000,000,000,000");
    });

    it("should return raw balance when returnRaw is true", async () => {
      const mockResponse = "1000000000000000000";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenBalance(
        {
          address: mockAddress,
          contractaddress: mockContractAddress,
        },
        true
      );
      expect(result).toBe(mockResponse);
    });

    it("should handle zero balance", async () => {
      const mockResponse = "0";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenBalance({
        address: mockAddress,
        contractaddress: mockContractAddress,
      });
      expect(result).toBe("0");
    });

    it("should handle API error", async () => {
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "0", message: "Invalid contract address" }),
        } as Response)
      );

      await expect(
        wrapper.getTokenBalance({
          address: mockAddress,
          contractaddress: "invalid",
        })
      ).rejects.toThrow();
    });
  });

  describe("getTokenSupply", () => {
    it("should get token supply and format it correctly", async () => {
      const mockResponse = "1000000000000000000000000"; // 1M tokens
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenSupply({
        contractaddress: mockContractAddress,
      });
      expect(result).toBe("1,000,000");
    });

    it("should format with custom decimals", async () => {
      const mockResponse = "1000000"; // 1M tokens with 6 decimals
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenSupply(
        {
          contractaddress: mockContractAddress,
        },
        false,
        6
      );
      expect(result).toBe("1");
    });

    it("should handle zero supply", async () => {
      const mockResponse = "0";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenSupply({
        contractaddress: mockContractAddress,
      });
      expect(result).toBe("0");
    });

    it("should handle API error", async () => {
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "0", message: "Contract not found" }),
        } as Response)
      );

      await expect(
        wrapper.getTokenSupply({
          contractaddress: "invalid",
        })
      ).rejects.toThrow();
    });
  });

  describe("getTokenSupplyHistory", () => {
    it("should get historical token supply and format it correctly", async () => {
      const mockResponse = "1000000000000000000000000";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenSupplyHistory({
        address: mockAddress,
        contractaddress: mockContractAddress,
        blockno: 1234567,
      });
      expect(result).toBe("1,000,000");
    });

    it("should handle zero historical supply", async () => {
      const mockResponse = "0";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenSupplyHistory({
        address: mockAddress,
        contractaddress: mockContractAddress,
        blockno: 1234567,
      });
      expect(result).toBe("0");
    });

    it("should handle API error", async () => {
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
        } as Response)
      );

      await expect(
        wrapper.getTokenSupplyHistory({
          address: mockAddress,
          contractaddress: mockContractAddress,
          blockno: 999999999,
        })
      ).rejects.toThrow();
    });
  });

  describe("getTokenBalanceHistory", () => {
    it("should get historical token balance and format it correctly", async () => {
      const mockResponse = "1000000000000000000";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenBalanceHistory({
        address: mockAddress,
        contractaddress: mockContractAddress,
        blockno: 1234567,
      });
      expect(result).toBe("1");
    });

    it("should format with custom decimals", async () => {
      const mockResponse = "1000000"; // 1 token with 6 decimals
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenBalanceHistory(
        {
          address: mockAddress,
          contractaddress: mockContractAddress,
          blockno: 1234567,
        },
        false,
        6
      );
      expect(result).toBe("1");
    });

    it("should handle zero historical balance", async () => {
      const mockResponse = "0";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenBalanceHistory({
        address: mockAddress,
        contractaddress: mockContractAddress,
        blockno: 1234567,
      });
      expect(result).toBe("0");
    });

    it("should handle API error", async () => {
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
        } as Response)
      );

      await expect(
        wrapper.getTokenBalanceHistory({
          address: "invalid",
          contractaddress: mockContractAddress,
          blockno: 1234567,
        })
      ).rejects.toThrow();
    });
  });
});
