import { StatsPeriod } from "../../../types/common";
import { StatisticsWrapper } from "../../../wrapper/modules/statistics";
import { jest } from "@jest/globals";

describe("StatisticsWrapper", () => {
  let wrapper: StatisticsWrapper;

  beforeEach(() => {
    wrapper = new StatisticsWrapper({ target: "mainnet" });
  });

  describe("getMining", () => {
    it("should get mining statistics correctly", async () => {
      const mockResponse = {
        hashrate: "100000000",
        difficulty: "2000000",
        blockTime: "0.5",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getMining({
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        hashrate: "100000000",
        difficulty: "2000000",
        blockTime: "0.5",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getMining(
        { minTimestamp: 1704067200, maxTimestamp: 1704153600 },
        true
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle empty statistics", async () => {
      const mockResponse = {
        hashrate: "0",
        difficulty: "0",
        blockTime: "0",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getMining({
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result).toEqual(mockResponse);
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
        wrapper.getMining({ minTimestamp: 1704153600, maxTimestamp: 1704067200 })
      ).rejects.toThrow();
    });

    it("should handle optional parameters", async () => {
      const mockResponse = {
        hashrate: "100000000",
        difficulty: "2000000",
        blockTime: "0.5",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getMining({
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
        intervalType: "hour",
        sort: "asc",
        skip: 0,
        limit: 10,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getTopMiner", () => {
    it("should get top miner statistics correctly", async () => {
      const mockResponse = {
        miner: "0x1234567890123456789012345678901234567890",
        blocks: "100",
        percentage: "10",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTopMiner({ spanType: "24h" });
      expect(result).toEqual(mockResponse);
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        miner: "0x1234567890123456789012345678901234567890",
        blocks: "100",
        percentage: "10",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTopMiner({ spanType: "24h" }, true);
      expect(result).toEqual(mockResponse);
    });

    it("should handle empty statistics", async () => {
      const mockResponse = {
        miner: "",
        blocks: "0",
        percentage: "0",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTopMiner({ spanType: "24h" });
      expect(result).toEqual(mockResponse);
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
        wrapper.getTopMiner({ spanType: "invalid" as unknown as StatsPeriod })
      ).rejects.toThrow();
    });

    it("should handle different span types", async () => {
      const mockResponse = {
        miner: "0x1234567890123456789012345678901234567890",
        blocks: "100",
        percentage: "10",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const spans = ["24h", "3d", "7d", "14d"] as const;
      for (const span of spans) {
        const result = await wrapper.getTopMiner({ spanType: span });
        expect(result).toEqual(mockResponse);
      }
    });
  });

  describe("getAccountGrowth", () => {
    it("should format account growth statistics correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            count: "50",
            statTime: 1704067200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getAccountGrowth({
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.total).toBe("100");
      expect(result.list?.[0].count).toBe("50");
      expect(result.list?.[0].statTime).toBe("2024-01-01 00:00:00");
    });

    it("should handle empty response", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ result: [] }),
        } as Response)
      ) as unknown as typeof global.fetch;
      const result = await wrapper.getAccountGrowth({
        minTimestamp: 1677600000,
        maxTimestamp: 1677686400,
        sort: "desc",
        skip: 0,
        limit: 10,
      });
      expect(result).toEqual([]);
    });

    it("should handle API error", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
        } as Response)
      ) as unknown as typeof global.fetch;
      await expect(
        wrapper.getAccountGrowth({
          minTimestamp: 1677600000,
          maxTimestamp: 1677686400,
        })
      ).rejects.toThrow("HTTP error! status: 400");
    });
  });

  describe("getAccountActive", () => {
    it("should handle empty response", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ result: [] }),
        } as Response)
      ) as unknown as typeof global.fetch;
      const result = await wrapper.getAccountActive({
        minTimestamp: 1677600000,
        maxTimestamp: 1677686400,
        sort: "desc",
        skip: 0,
        limit: 10,
      });
      expect(result).toEqual([]);
    });

    it("should handle API error", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
        } as Response)
      ) as unknown as typeof global.fetch;
      await expect(
        wrapper.getAccountActive({
          minTimestamp: 1677600000,
          maxTimestamp: 1677686400,
        })
      ).rejects.toThrow("HTTP error! status: 400");
    });
  });

  describe("getAccountActiveOverall", () => {
    it("should handle empty response", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ result: [] }),
        } as Response)
      ) as unknown as typeof global.fetch;
      const result = await wrapper.getAccountActiveOverall({
        minTimestamp: 1677600000,
        maxTimestamp: 1677686400,
        sort: "desc",
        skip: 0,
        limit: 10,
      });
      expect(result).toEqual([]);
    });

    it("should handle API error", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
        } as Response)
      ) as unknown as typeof global.fetch;
      await expect(
        wrapper.getAccountActiveOverall({
          minTimestamp: 1677600000,
          maxTimestamp: 1677686400,
        })
      ).rejects.toThrow("HTTP error! status: 400");
    });
  });

  describe("getSupply", () => {
    it("should format supply data correctly", async () => {
      const mockResponse = {
        status: "1",
        result: {
          totalIssued: "1000000000000000000",
          totalCirculating: "800000000000000000",
          totalStaking: "100000000000000000",
          totalCollateral: "50000000000000000",
          nullAddressBalance: "25000000000000000",
          twoYearUnlockBalance: "15000000000000000",
          fourYearUnlockBalance: "10000000000000000",
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const result = await wrapper.getSupply();
      expect(result.totalIssued).toBe("1");
      expect(result.totalCirculating).toBe("0.8");
      expect(result.totalStaking).toBe("0.1");
      expect(result.totalCollateral).toBe("0.05");
      expect(result.nullAddressBalance).toBe("0.025");
      expect(result.twoYearUnlockBalance).toBe("0.015");
      expect(result.fourYearUnlockBalance).toBe("0.01");
    });

    it("should handle custom decimals", async () => {
      const mockResponse = {
        status: "1",
        result: {
          totalIssued: "1000000",
          totalCirculating: "800000",
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const result = await wrapper.getSupply(false, 6);
      expect(result.totalIssued).toBe("1");
      expect(result.totalCirculating).toBe("0.8");
    });

    it("should return raw data when requested", async () => {
      const mockResponse = {
        status: "1",
        result: {
          totalIssued: "1000000",
          totalCirculating: "800000",
        },
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const result = await wrapper.getSupply(true);
      expect(result).toEqual(mockResponse.result);
    });
  });

  describe("getTransaction", () => {
    it("should handle empty response", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ result: [] }),
        } as Response)
      ) as unknown as typeof global.fetch;
      const result = await wrapper.getTransaction({
        minTimestamp: 1677600000,
        maxTimestamp: 1677686400,
        sort: "desc",
        skip: 0,
        limit: 10,
      });
      expect(result).toEqual([]);
    });

    it("should handle API error", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
        } as Response)
      ) as unknown as typeof global.fetch;
      await expect(
        wrapper.getTransaction({
          minTimestamp: 1677600000,
          maxTimestamp: 1677686400,
        })
      ).rejects.toThrow("HTTP error! status: 400");
    });
  });

  describe("getTps", () => {
    it("should format TPS statistics correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            tps: "50.5",
            statTime: 1704067200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTps({ minTimestamp: 1704067200, maxTimestamp: 1704153600 });
      expect(result.total).toBe("100");
      expect(result.list?.[0].tps).toBe("50.5");
      expect(result.list?.[0].statTime).toBe("2024-01-01 00:00:00");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = {
        total: 100,
        list: [{}],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTps({ minTimestamp: 1704067200, maxTimestamp: 1704153600 });
      expect(result.list?.[0].tps).toBeUndefined();
      expect(result.list?.[0].statTime).toBeUndefined();
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            tps: "50.5",
            statTime: 1704067200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTps(
        { minTimestamp: 1704067200, maxTimestamp: 1704153600 },
        true
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getContract", () => {
    it("should format contract statistics correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            count: "50",
            total: "1000",
            statTime: 1704067200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getContract({
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.total).toBe("100");
      expect(result.list?.[0].count).toBe("50");
      expect(result.list?.[0].total).toBe("1,000");
      expect(result.list?.[0].statTime).toBe("2024-01-01 00:00:00");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = {
        total: 100,
        list: [{}],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getContract({
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.list?.[0].count).toBeUndefined();
      expect(result.list?.[0].total).toBeUndefined();
      expect(result.list?.[0].statTime).toBeUndefined();
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            count: "50",
            total: "1000",
            statTime: 1704067200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getContract(
        { minTimestamp: 1704067200, maxTimestamp: 1704153600 },
        true
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getCfxTransfer", () => {
    it("should format CFX transfer data correctly", async () => {
      const mockResponse = {
        status: "1",
        result: {
          total: "100",
          list: [
            {
              transferCount: "50",
              userCount: "30",
              amount: "1000000000000000000",
              statTime: 1677649200,
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

      const result = await wrapper.getCfxTransfer({
        minTimestamp: 1677649200,
        maxTimestamp: 1677735600,
      });
      expect(result.total).toBe("100");
      expect(result.list?.[0].transferCount).toBe("50");
      expect(result.list?.[0].userCount).toBe("30");
      expect(result.list?.[0].amount).toBe("1");
      expect(result.list?.[0].statTime).toBe("2023-03-01 05:40:00");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = {
        status: "1",
        result: {
          total: "100",
          list: [
            {
              statTime: 1677649200,
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

      const result = await wrapper.getCfxTransfer({
        minTimestamp: 1677649200,
      });
      expect(result.list?.[0].transferCount).toBeUndefined();
      expect(result.list?.[0].userCount).toBeUndefined();
      expect(result.list?.[0].amount).toBeUndefined();
      expect(result.list?.[0].statTime).toBe("2023-03-01 05:40:00");
    });
  });

  describe("getTokenTransfer", () => {
    it("should format token transfer data correctly", async () => {
      const mockResponse = {
        status: "1",
        result: {
          total: "100",
          list: [
            {
              transferCount: "50",
              userCount: "30",
              statTime: 1677649200,
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

      const result = await wrapper.getTokenTransfer({
        minTimestamp: 1677649200,
        maxTimestamp: 1677735600,
      });
      expect(result.total).toBe("100");
      expect(result.list?.[0].transferCount).toBe("50");
      expect(result.list?.[0].userCount).toBe("30");
      expect(result.list?.[0].statTime).toBe("2023-03-01 05:40:00");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = {
        status: "1",
        result: {
          total: "100",
          list: [
            {
              statTime: 1677649200,
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

      const result = await wrapper.getTokenTransfer({
        minTimestamp: 1677649200,
      });
      expect(result.list?.[0].transferCount).toBeUndefined();
      expect(result.list?.[0].userCount).toBeUndefined();
      expect(result.list?.[0].statTime).toBe("2023-03-01 05:40:00");
    });
  });

  describe("getTopGasUsed", () => {
    it("should format gas used data correctly", async () => {
      const mockResponse = {
        status: "1",
        result: {
          gasTotal: "1000000000000000",
          list: [
            {
              address: "0x123",
              gas: "500000000000000",
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

      const result = await wrapper.getTopGasUsed({ spanType: "day" });
      expect(result.gasTotal).toBe("1,000,000 Gdrip");
      expect(result.list?.[0].gas).toBe("500,000 Gdrip");
    });

    it("should handle missing gas values", async () => {
      const mockResponse = {
        status: "1",
        result: {
          list: [
            {
              address: "0x123",
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

      const result = await wrapper.getTopGasUsed({ spanType: "day" });
      expect(result.gasTotal).toBeUndefined();
      expect(result.list?.[0].gas).toBeUndefined();
    });
  });

  describe("getTopCfxSender", () => {
    it("should format top CFX sender statistics correctly", async () => {
      const mockResponse = {
        maxTime: 1704067200,
        valueTotal: "1000000000000000000",
        list: [
          {
            value: "500000000000000000",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTopCfxSender({ spanType: "24h" });
      expect(result.maxTime).toBe("2024-01-01 00:00:00");
      expect(result.valueTotal).toBe("1");
      expect(result.list?.[0].value).toBe("0.5");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = {
        maxTime: null,
        valueTotal: null,
        list: [{}],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTopCfxSender({ spanType: "24h" });
      expect(result.maxTime).toBeNull();
      expect(result.valueTotal).toBeNull();
      expect(result.list?.[0].value).toBeUndefined();
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        maxTime: 1704067200,
        valueTotal: "1000000000000000000",
        list: [
          {
            value: "500000000000000000",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTopCfxSender({ spanType: "24h" }, true);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getCfxHolder", () => {
    it("should format CFX holder statistics correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            count: "50",
            statTime: 1704067200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getCfxHolder({
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.total).toBe("100");
      expect(result.list?.[0].count).toBe("50");
      expect(result.list?.[0].statTime).toBe("2024-01-01 00:00:00");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = {
        total: 100,
        list: [{}],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getCfxHolder({
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.list?.[0].count).toBeUndefined();
      expect(result.list?.[0].statTime).toBeUndefined();
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            count: "50",
            statTime: 1704067200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getCfxHolder(
        { minTimestamp: 1704067200, maxTimestamp: 1704153600 },
        true
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getTopTransactionSender", () => {
    it("should format top transaction sender statistics correctly", async () => {
      const mockResponse = {
        maxTime: 1704067200,
        valueTotal: "1000",
        list: [
          {
            value: "500",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTopTransactionSender({ spanType: "24h" });
      expect(result.maxTime).toBe("2024-01-01 00:00:00");
      expect(result.valueTotal).toBe("1,000");
      expect(result.list?.[0].value).toBe("500");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = {
        maxTime: null,
        valueTotal: null,
        list: [{}],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTopTransactionSender({ spanType: "24h" });
      expect(result.maxTime).toBeNull();
      expect(result.valueTotal).toBeNull();
      expect(result.list?.[0].value).toBeUndefined();
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        maxTime: 1704067200,
        valueTotal: "1000",
        list: [
          {
            value: "500",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTopTransactionSender({ spanType: "24h" }, true);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getBlockBasefee", () => {
    it("should format block base fee statistics correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            timestamp: 1704067200,
            baseFee: "1000000000",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBlockBasefee({
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.total).toBe("100");
      expect(result.list?.[0].timestamp).toBe("2024-01-01 00:00:00");
      expect(result.list?.[0].baseFee).toBe("1 Gdrip");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = {
        total: 100,
        list: [{}],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBlockBasefee({
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.list?.[0].timestamp).toBeUndefined();
      expect(result.list?.[0].baseFee).toBeUndefined();
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            timestamp: 1704067200,
            baseFee: "1000000000",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBlockBasefee(
        { minTimestamp: 1704067200, maxTimestamp: 1704153600 },
        true
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getTokenHolder", () => {
    const mockContractAddress = "0x1234567890123456789012345678901234567890";

    it("should format token holder statistics correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            holderCount: "50",
            statTime: 1704067200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenHolder({
        contract: mockContractAddress,
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.total).toBe("100");
      expect(result.list?.[0].holderCount).toBe("50");
      expect(result.list?.[0].statTime).toBe("2024-01-01 00:00:00");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = {
        total: 100,
        list: [{}],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenHolder({
        contract: mockContractAddress,
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.list?.[0].holderCount).toBeUndefined();
      expect(result.list?.[0].statTime).toBeUndefined();
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            holderCount: "50",
            statTime: 1704067200,
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getTokenHolder(
        {
          contract: mockContractAddress,
          minTimestamp: 1704067200,
          maxTimestamp: 1704153600,
        },
        true
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getUniqueSender", () => {
    const mockContractAddress = "0x1234567890123456789012345678901234567890";

    it("should format unique sender statistics correctly", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            uniqueSenderCount: "50",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getUniqueSender({
        contract: mockContractAddress,
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.total).toBe("100");
      expect(result.list?.[0].uniqueSenderCount).toBe("50");
    });

    it("should handle missing optional fields", async () => {
      const mockResponse = {
        total: 100,
        list: [{}],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getUniqueSender({
        contract: mockContractAddress,
        minTimestamp: 1704067200,
        maxTimestamp: 1704153600,
      });
      expect(result.list?.[0].uniqueSenderCount).toBeUndefined();
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        total: 100,
        list: [
          {
            uniqueSenderCount: "50",
          },
        ],
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getUniqueSender(
        {
          contract: mockContractAddress,
          minTimestamp: 1704067200,
          maxTimestamp: 1704153600,
        },
        true
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
