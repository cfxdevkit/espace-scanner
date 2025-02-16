import { StatisticsModule } from "../../../core/modules/statistics";
import { jest } from "@jest/globals";

describe("StatisticsModule", () => {
  let module: StatisticsModule;

  beforeEach(() => {
    module = new StatisticsModule({ target: "mainnet" });
  });

  describe("getSupply", () => {
    it("should get supply correctly", async () => {
      const mockResponse = { status: "1", result: { total: "1000000" } };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const result = await module.getSupply();
      expect(result).toEqual(mockResponse.result);
    });

    it("should handle API error", async () => {
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        } as Response)
      );

      await expect(module.getSupply()).rejects.toThrow();
    });
  });

  describe("getTopGasUsed", () => {
    it("should get top gas used correctly", async () => {
      const mockResponse = {
        status: "1",
        result: {
          list: [
            {
              address: "0x123",
              gasUsed: "1000000",
            },
          ],
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const result = await module.getTopGasUsed({ spanType: "day" });
      expect(result).toEqual(mockResponse.result);
    });

    it("should handle different span types", async () => {
      const mockResponse = { status: "1", result: { list: [] } };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      await module.getTopGasUsed({ spanType: "week" });
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("spanType=week");
    });
  });

  describe("getTokenHolder", () => {
    it("should get token holder correctly", async () => {
      const mockResponse = {
        status: "1",
        result: {
          list: [
            {
              address: "0x123",
              balance: "1000000",
            },
          ],
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const result = await module.getTokenHolder({
        contract: "0x123",
        minTimestamp: 1677649200,
        maxTimestamp: 1677735600,
        sort: "desc",
        skip: 0,
        limit: 10,
      });
      expect(result).toEqual(mockResponse.result);
    });

    it("should handle optional parameters", async () => {
      const mockResponse = { status: "1", result: { list: [] } };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      await module.getTokenHolder({
        contract: "0x123",
        minTimestamp: 1677649200,
      });
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(calls[0][0]).toContain("minTimestamp=1677649200");
      expect(calls[0][0]).not.toContain("maxTimestamp");
    });
  });

  describe("getBlockBasefee", () => {
    it("should get block base fee correctly", async () => {
      const mockResponse = {
        status: "1",
        result: {
          list: [
            {
              baseFee: "1000000",
              timestamp: 1677649200,
            },
          ],
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const result = await module.getBlockBasefee({
        minTimestamp: 1677649200,
        maxTimestamp: 1677735600,
      });
      expect(result).toEqual(mockResponse.result);
    });
  });

  describe("getBlockTxsbytype", () => {
    it("should get block transactions by type correctly", async () => {
      const mockResponse = {
        status: "1",
        result: {
          list: [
            {
              type: "0",
              count: "100",
              timestamp: 1677649200,
            },
          ],
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const result = await module.getBlockTxsbytype({
        minTimestamp: 1677649200,
        maxTimestamp: 1677735600,
      });
      expect(result).toEqual(mockResponse.result);
    });
  });
});
