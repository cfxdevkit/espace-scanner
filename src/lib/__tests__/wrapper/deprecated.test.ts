import { DeprecatedWrapper } from "../../../wrapper/modules/deprecated";
import { jest } from "@jest/globals";

describe("DeprecatedWrapper", () => {
  let wrapper: DeprecatedWrapper;
  const mockAccount = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    wrapper = new DeprecatedWrapper({ target: "mainnet" });
  });

  describe("AccountTransactions", () => {
    it("should get account transactions correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            value: "1000000000000000000",
            timestamp: 1677649200,
            gasPrice: "1000000000",
            gasFee: "21000000000000",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.AccountTransactions({ account: mockAccount });
      expect(result.list?.[0].value).toBe("1");
      expect(result.list?.[0].timestamp).toBe("2023-03-01 05:40:00");
      expect(result.list?.[0].gasPrice).toBe("1 Gdrip");
      expect(result.list?.[0].gasFee).toBe("21,000 Gdrip");
    });

    it("should handle empty transaction list", async () => {
      const mockResponse = { total: 0, list: [] };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.AccountTransactions({ account: mockAccount });
      expect(result.total).toBe(0);
      expect(result.list).toEqual([]);
    });

    it("should handle API error", async () => {
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
        } as Response)
      );

      await expect(wrapper.AccountTransactions({ account: "invalid" })).rejects.toThrow();
    });
  });

  describe("CfxTransfers", () => {
    it("should get CFX transfers correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            amount: "1000000000000000000",
            timestamp: 1677649200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.CfxTransfers({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
      expect(result.list?.[0].timestamp).toBe("2023-03-01 05:40:00");
    });

    it("should handle empty transfer list", async () => {
      const mockResponse = { total: 0, list: [] };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.CfxTransfers({ account: mockAccount });
      expect(result.total).toBe(0);
      expect(result.list).toEqual([]);
    });
  });

  describe("Erc20Transfers", () => {
    it("should get ERC20 transfers correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            amount: "1000000000000000000",
            timestamp: 1677649200,
            contract: "0x789",
          },
        ],
        addressInfo: {
          "0x789": {
            token: {
              decimals: 18,
            },
          },
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.Erc20Transfers({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
      expect(result.list?.[0].timestamp).toBe("2023-03-01 05:40:00");
    });

    it("should handle empty transfer list", async () => {
      const mockResponse = { total: 0, list: [], addressInfo: {} };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.Erc20Transfers({ account: mockAccount });
      expect(result.total).toBe(0);
      expect(result.list).toEqual([]);
    });

    it("should handle missing decimals in addressInfo", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            amount: "1000000000000000000",
            timestamp: 1677649200,
            contract: "0x789",
          },
        ],
        addressInfo: {
          "0x789": {
            token: {},
          },
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.Erc20Transfers({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
    });

    it("should handle missing token info in addressInfo", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            amount: "1000000000000000000",
            timestamp: 1677649200,
            contract: "0x789",
          },
        ],
        addressInfo: {
          "0x789": {},
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.Erc20Transfers({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
    });

    it("should handle missing contract in addressInfo", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            amount: "1000000000000000000",
            timestamp: 1677649200,
            contract: "0x789",
          },
        ],
        addressInfo: {},
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.Erc20Transfers({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
    });
  });

  describe("Erc721Transfers", () => {
    it("should get ERC721 transfers correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            tokenId: "123",
            timestamp: 1677649200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.Erc721Transfers({ account: mockAccount });
      expect(result.list?.[0].timestamp).toBe("2023-03-01 05:40:00");
    });
  });

  describe("Erc1155Transfers", () => {
    it("should get ERC1155 transfers correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            tokenId: "123",
            timestamp: 1677649200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.Erc1155Transfers({ account: mockAccount });
      expect(result.list?.[0].timestamp).toBe("2023-03-01 05:40:00");
    });
  });

  describe("Erc3525Transfers", () => {
    it("should get ERC3525 transfers correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            tokenId: "123",
            timestamp: 1677649200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.Erc3525Transfers({ account: mockAccount });
      expect(result.list?.[0].timestamp).toBe("2023-03-01 05:40:00");
    });
  });

  describe("AccountTransfers", () => {
    it("should get account transfers correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            amount: "1000000000000000000",
            timestamp: 1677649200,
            contract: "0x789",
          },
        ],
        addressInfo: {
          "0x789": {
            token: {
              decimals: 18,
            },
          },
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.AccountTransfers({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
      expect(result.list?.[0].timestamp).toBe("2023-03-01 05:40:00");
    });

    it("should handle missing decimals in addressInfo", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            amount: "1000000000000000000",
            timestamp: 1677649200,
            contract: "0x789",
          },
        ],
        addressInfo: {
          "0x789": {
            token: {},
          },
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.AccountTransfers({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
    });

    it("should handle missing token info in addressInfo", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            amount: "1000000000000000000",
            timestamp: 1677649200,
            contract: "0x789",
          },
        ],
        addressInfo: {
          "0x789": {},
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.AccountTransfers({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
    });

    it("should handle missing contract in addressInfo", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            hash: "0x123",
            from: mockAccount,
            to: "0x456",
            amount: "1000000000000000000",
            timestamp: 1677649200,
            contract: "0x789",
          },
        ],
        addressInfo: {},
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.AccountTransfers({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
    });
  });

  describe("AccountApprovals", () => {
    it("should get account approvals correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            contract: "0x123",
            spender: "0x456",
            tokenId: "123",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.AccountApprovals({ account: mockAccount });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("AccountTokens", () => {
    it("should get account tokens correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            contract: "0x123",
            amount: "1000000000000000000",
            decimals: 18,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.AccountTokens({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
    });

    it("should handle missing decimals", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            contract: "0x123",
            amount: "1000000000000000000",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.AccountTokens({ account: mockAccount });
      expect(result.list?.[0].amount).toBe("1");
    });

    it("should handle missing amount", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            contract: "0x123",
            decimals: 18,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.AccountTokens({ account: mockAccount });
      expect(result.list?.[0].amount).toBeUndefined();
    });
  });

  describe("Tokeninfos", () => {
    it("should get token tokeninfos correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            contract: "0x123",
            name: "Test Token",
            symbol: "TEST",
            decimals: 18,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.Tokeninfos({ contracts: "0x123" });
      expect(result).toEqual(mockResponse);
    });
  });
});
