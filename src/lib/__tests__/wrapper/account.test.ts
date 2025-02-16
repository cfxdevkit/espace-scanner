import { AccountWrapper } from "../../../wrapper/modules/account";
import { jest } from "@jest/globals";

describe("AccountWrapper", () => {
  let wrapper: AccountWrapper;
  const mockAddress = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    wrapper = new AccountWrapper({ target: "mainnet" });
  });

  describe("getBalance", () => {
    it("should get balance and format CFX correctly", async () => {
      const mockResponse = "1000000000000000000"; // 1 CFX
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBalance({ address: mockAddress });
      expect(result).toBe("1");
    });

    it("should return raw balance when returnRaw is true", async () => {
      const mockResponse = "1000000000000000000";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBalance({ address: mockAddress }, true);
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

      const result = await wrapper.getBalance({ address: mockAddress });
      expect(result).toBe("0");
    });

    it("should handle API error response", async () => {
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "0", message: "Invalid address format" }),
        } as Response)
      );

      await expect(wrapper.getBalance({ address: "invalid" })).rejects.toThrow();
    });

    it("should handle invalid address", async () => {
      await expect(wrapper.getBalance({ address: "invalid" })).rejects.toThrow("Invalid address");
    });
  });

  describe("getBalanceMulti", () => {
    it("should get multiple balances and format CFX correctly", async () => {
      const mockResponse: [string, string][] = [
        [mockAddress, "1000000000000000000"],
        ["0x2234567890123456789012345678901234567890", "2000000000000000000"],
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBalanceMulti({ address: [mockAddress] });
      expect(result).toEqual([
        [mockAddress, "1"],
        ["0x2234567890123456789012345678901234567890", "2"],
      ]);
    });

    it("should handle empty address list", async () => {
      const mockResponse: [string, string][] = [];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBalanceMulti({ address: [] });
      expect(result).toEqual([]);
    });

    it("should handle invalid addresses", async () => {
      await expect(wrapper.getBalanceMulti({ address: ["invalid"] })).rejects.toThrow(
        "Invalid addresses provided"
      );
    });

    it("should return raw balances when returnRaw is true", async () => {
      const mockResponse: [string, string][] = [
        [mockAddress, "1000000000000000000"],
        ["0x2234567890123456789012345678901234567890", "2000000000000000000"],
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBalanceMulti({ address: [mockAddress] }, true);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getTransactionList", () => {
    it("should format transaction list correctly", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
          value: "1000000000000000000",
          timestamp: "1677649200",
          gas: "21000000000000",
          gasPrice: "1000000000",
          gasUsed: "21000000000000",
          cumulativeGasUsed: "50000000000000",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTransactionList({ address: mockAddress });
      expect(result[0].value).toBe("1");
      expect(result[0].timestamp).toBe("2023-03-01 05:40:00");
      expect(result[0].gas).toBe("21,000 Gdrip");
      expect(result[0].gasPrice).toBe("1 Gdrip");
      expect(result[0].gasUsed).toBe("21,000 Gdrip");
      expect(result[0].cumulativeGasUsed).toBe("50,000 Gdrip");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTransactionList({ address: mockAddress });
      expect(result[0].value).toBeUndefined();
      expect(result[0].timestamp).toBeUndefined();
      expect(result[0].gas).toBeUndefined();
      expect(result[0].gasPrice).toBeUndefined();
      expect(result[0].gasUsed).toBeUndefined();
      expect(result[0].cumulativeGasUsed).toBeUndefined();
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
          value: "1000000000000000000",
          timestamp: "1677649200",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTransactionList({ address: mockAddress }, true);
      expect(result).toEqual(mockResponse);
    });

    it("should handle invalid address", async () => {
      await expect(wrapper.getTransactionList({ address: "invalid" })).rejects.toThrow(
        "Invalid address"
      );
    });
  });

  describe("getInternalTransactionList", () => {
    it("should format internal transaction list correctly", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
          value: "1000000000000000000",
          timestamp: "1677649200",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getInternalTransactionList({ address: mockAddress });
      expect(result[0].value).toBe("1");
      expect(result[0].timestamp).toBe("2023-03-01 05:40:00");
    });

    it("should handle empty transaction list", async () => {
      const mockResponse: Record<string, string>[] = [];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getInternalTransactionList({ address: mockAddress });
      expect(result).toEqual([]);
    });

    it("should handle transaction with missing values", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
          value: null,
          timestamp: null,
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getInternalTransactionList({ address: mockAddress });
      expect(result[0].value).toBe(null);
      expect(result[0].timestamp).toBe(null);
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
          value: "1000000000000000000",
          timestamp: "1677649200",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getInternalTransactionList({ address: mockAddress }, true);
      expect(result).toEqual(mockResponse);
    });

    it("should handle invalid address", async () => {
      await expect(wrapper.getInternalTransactionList({ address: "invalid" })).rejects.toThrow(
        "Invalid address"
      );
    });
  });

  describe("getTokenTransfers", () => {
    it("should format token transfers correctly", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
          value: "1000000000000000000",
          timeStamp: 1677649200,
          tokenDecimal: "18",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenTransfers({ address: mockAddress });
      expect(result[0].value).toBe("1");
      expect(result[0].timeStamp).toBe("2023-03-01 05:40:00");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenTransfers({ address: mockAddress });
      expect(result[0].value).toBeUndefined();
      expect(result[0].timeStamp).toBeUndefined();
    });

    it("should handle invalid address", async () => {
      await expect(wrapper.getTokenTransfers({ address: "invalid" })).rejects.toThrow(
        "Invalid address"
      );
    });

    it("should handle invalid contract address", async () => {
      await expect(
        wrapper.getTokenTransfers({ address: mockAddress, contractaddress: "invalid" })
      ).rejects.toThrow("Invalid contract address");
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
          value: "1000000000000000000",
          timeStamp: "1677649200",
          tokenDecimal: "18",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenTransfers({ address: mockAddress }, true);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getNFTTransfers", () => {
    it("should format NFT transfers correctly", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
          tokenId: "123",
          timestamp: "1677649200",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getNFTTransfers({ address: mockAddress });
      expect(result[0].timestamp).toBe("2023-03-01 05:40:00");
    });

    it("should handle missing timestamp", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
          tokenId: "123",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getNFTTransfers({ address: mockAddress });
      expect(result[0].timestamp).toBeUndefined();
    });

    it("should handle invalid address", async () => {
      await expect(wrapper.getNFTTransfers({ address: "invalid" })).rejects.toThrow(
        "Invalid address"
      );
    });

    it("should handle invalid contract address", async () => {
      await expect(
        wrapper.getNFTTransfers({ address: mockAddress, contractaddress: "invalid" })
      ).rejects.toThrow("Invalid contract address");
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = [
        {
          hash: "0x123",
          from: mockAddress,
          to: "0x456",
          tokenId: "123",
          timestamp: "1677649200",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getNFTTransfers({ address: mockAddress }, true);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getMinedBlocks", () => {
    it("should format mined blocks correctly", async () => {
      const mockResponse = [
        {
          blockNumber: "123",
          blockReward: "1000000000000000000",
          timeStamp: 1677649200,
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getMinedBlocks({ address: mockAddress });
      expect(result[0].blockReward).toBe("1");
      expect(result[0].timeStamp).toBe("2023-03-01 05:40:00");
    });

    it("should handle empty block list", async () => {
      const mockResponse: Record<string, string>[] = [];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getMinedBlocks({ address: mockAddress });
      expect(result).toEqual([]);
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = [
        {
          blockNumber: "1234567",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getMinedBlocks({ address: mockAddress });
      expect(result[0].blockReward).toBeUndefined();
      expect(result[0].timeStamp).toBeUndefined();
    });

    it("should handle invalid address", async () => {
      await expect(wrapper.getMinedBlocks({ address: "invalid" })).rejects.toThrow(
        "Invalid address"
      );
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = [
        {
          blockNumber: "1234567",
          timeStamp: "1677649200",
          blockReward: "1000000000000000000",
        },
      ];
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getMinedBlocks({ address: mockAddress }, true);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getBalanceHistory", () => {
    it("should format balance history correctly", async () => {
      const mockResponse = "1000000000000000000";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBalanceHistory({ address: mockAddress, blockno: 1234567 });
      expect(result).toBe("1");
    });

    it("should handle zero balance history", async () => {
      const mockResponse = "0";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBalanceHistory({ address: mockAddress, blockno: 1234567 });
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
        wrapper.getBalanceHistory({ address: mockAddress, blockno: 999999999 })
      ).rejects.toThrow();
    });

    it("should handle invalid address", async () => {
      await expect(
        wrapper.getBalanceHistory({ address: "invalid", blockno: 1234567 })
      ).rejects.toThrow("Invalid address");
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = "1000000000000000000";
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBalanceHistory(
        { address: mockAddress, blockno: 1234567 },
        true
      );
      expect(result).toBe(mockResponse);
    });
  });
});
