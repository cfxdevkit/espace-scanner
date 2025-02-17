import { DeprecatedModule } from "../../../core/modules/deprecated";
import { jest } from "@jest/globals";

describe("DeprecatedModule", () => {
  let module: DeprecatedModule;

  beforeEach(() => {
    module = new DeprecatedModule({ target: "mainnet" });
  });

  describe("AccountTransactions", () => {
    it("should throw error for invalid account", async () => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(module.AccountTransactions({ account: 123 as any })).rejects.toThrow(
        "Invalid account: 123"
      );
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
        module.AccountTransactions({ account: "0x1234567890123456789012345678901234567890" })
      ).rejects.toThrow();
    });

    it("should handle optional parameters", async () => {
      const mockResponse = { status: "1", result: { total: 0, list: [] } };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const result = await module.AccountTransactions({
        account: "0x1234567890123456789012345678901234567890",
        skip: 0,
        limit: 10,
        from: "0x1234",
        to: "0x5678",
        startBlock: 1000,
        endBlock: 2000,
        minTimestamp: 1677649200,
        maxTimestamp: 1677735600,
        sort: "desc",
      });

      expect(result).toEqual(mockResponse.result);
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("/account/transactions");
      expect(calls[0][1]).toEqual(
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
    });
  });

  describe("CfxTransfers", () => {
    it("should handle API error", async () => {
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
        } as Response)
      );

      await expect(
        module.CfxTransfers({ account: "0x1234567890123456789012345678901234567890" })
      ).rejects.toThrow();
    });

    it("should handle sort parameter case conversion", async () => {
      const mockResponse = { status: "1", result: { total: 0, list: [] } };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      await module.CfxTransfers({
        account: "0x1234567890123456789012345678901234567890",
        sort: "desc",
      });

      const calls = (global.fetch as jest.Mock).mock.calls;
      const urlString = calls[0][0] as string;
      const url = new URL(urlString);
      expect(url.searchParams.get("sort")).toBe("DESC");
    });
  });

  describe("Erc20Transfers", () => {
    it("should handle missing optional parameters", async () => {
      const mockResponse = { status: "1", result: { total: 0, list: [], addressInfo: {} } };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const result = await module.Erc20Transfers({
        account: "0x1234567890123456789012345678901234567890",
      });

      expect(result).toEqual(mockResponse.result);
    });
  });

  describe("AccountApprovals", () => {
    it("should handle tokenType parameter", async () => {
      const mockResponse = { status: "1", result: { total: 0, list: [] } };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      await module.AccountApprovals({
        account: "0x1234567890123456789012345678901234567890",
        tokenType: "ERC20",
      });

      const calls = (global.fetch as jest.Mock).mock.calls;
      const urlString = calls[0][0] as string;
      const url = new URL(urlString);
      expect(url.searchParams.get("tokenType")).toBe("ERC20");
    });

    it("should handle byTokenId parameter", async () => {
      const mockResponse = { status: "1", result: { total: 0, list: [] } };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      await module.AccountApprovals({
        account: "0x1234567890123456789012345678901234567890",
        byTokenId: true,
      });

      const calls = (global.fetch as jest.Mock).mock.calls;
      const urlString = calls[0][0] as string;
      const url = new URL(urlString);
      expect(url.searchParams.get("byTokenId")).toBe("true");
    });
  });

  describe("Tokeninfos", () => {
    it("should handle multiple contract addresses", async () => {
      const mockResponse = { status: "1", result: { total: 0, list: [] } };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const contracts = [
        "0x1234567890123456789012345678901234567890",
        "0x2234567890123456789012345678901234567890",
      ].join(",");

      await module.Tokeninfos({ contracts });

      const calls = (global.fetch as jest.Mock).mock.calls;
      const urlString = calls[0][0] as string;
      const url = new URL(urlString);
      expect(url.searchParams.get("contracts")).toBe(contracts);
    });
  });
});
