import { StatsModule } from "../../modules/stats";
import { jest } from "@jest/globals";
import {
  StatsResponse,
  TopStatsResponse,
  BasicStatItem,
  StatsPeriod,
  TokenHolderStatItem,
  TokenUniqueStatItem,
} from "../../../types";

describe("StatsModule", () => {
  let module: StatsModule;
  const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;
  const validAddress = "0x1234567890123456789012345678901234567890";
  const invalidAddress = "0xinvalid";

  beforeEach(() => {
    jest.clearAllMocks();
    module = new StatsModule({});
    global.fetch = mockFetch;
  });

  const mockBasicResponse: StatsResponse<BasicStatItem> = {
    total: "100",
    list: [
      {
        statTime: "2024-02-07",
        count: "10",
      },
    ],
  };

  const mockTopResponse: TopStatsResponse = {
    maxTime: "2024-02-07",
    valueTotal: "1000",
    gasTotal: "500",
    difficultyTotal: 100,
    total: 10,
    list: [
      {
        address: validAddress,
        gas: "100",
        value: "200",
        blockCntr: "5",
        rewardSum: "300",
        txFeeSum: "50",
        hashRate: "1000",
        transferCntr: "20",
        count: "15",
      },
    ],
  };

  beforeEach(() => {
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: "1", result: mockBasicResponse }),
      } as Response)
    );
  });

  describe("Error Cases", () => {
    it("should throw error when basic stats result is null", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: null }),
        } as Response)
      );

      await expect(module.getContractStats()).rejects.toThrow(
        "No result returned for /statistics/contract"
      );
    });

    it("should throw error when top stats result is null", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: null }),
        } as Response)
      );

      await expect(module.getTopGasUsed("24h")).rejects.toThrow(
        "No result returned for /statistics/top/gas/used"
      );
    });
  });

  describe("Basic Stats Methods", () => {
    it("should get contract stats", async () => {
      const result = await module.getContractStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/contract"),
        expect.any(Object)
      );
    });

    it("should get transaction stats", async () => {
      const result = await module.getTransactionStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/transaction"),
        expect.any(Object)
      );
    });

    it("should get CFX transfer stats", async () => {
      const result = await module.getCfxTransferStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/cfx/transfer"),
        expect.any(Object)
      );
    });

    it("should get TPS stats", async () => {
      const result = await module.getTpsStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/tps"),
        expect.any(Object)
      );
    });
  });

  describe("Top Stats Methods", () => {
    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockTopResponse }),
        } as Response)
      );
    });

    const period: StatsPeriod = "24h";
    const weekPeriod: StatsPeriod = "1w";
    const monthPeriod: StatsPeriod = "1m";

    it("should get top gas used", async () => {
      const result = await module.getTopGasUsed(period);
      expect(result).toEqual(mockTopResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/statistics/top/gas/used?spanType=${period}`),
        expect.any(Object)
      );
    });

    it("should get top transaction senders", async () => {
      const result = await module.getTopTransactionSenders(weekPeriod);
      expect(result).toEqual(mockTopResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/statistics/top/transaction/sender?spanType=${weekPeriod}`),
        expect.any(Object)
      );
    });

    it("should get top transaction receivers", async () => {
      const result = await module.getTopTransactionReceivers(monthPeriod);
      expect(result).toEqual(mockTopResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/statistics/top/transaction/receiver?spanType=${monthPeriod}`),
        expect.any(Object)
      );
    });

    it("should get top CFX senders", async () => {
      const result = await module.getTopCfxSenders(period);
      expect(result).toEqual(mockTopResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/statistics/top/cfx/sender?spanType=${period}`),
        expect.any(Object)
      );
    });

    it("should get top CFX receivers", async () => {
      const result = await module.getTopCfxReceivers(weekPeriod);
      expect(result).toEqual(mockTopResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/statistics/top/cfx/receiver?spanType=${weekPeriod}`),
        expect.any(Object)
      );
    });

    it("should get top token transfers", async () => {
      const result = await module.getTopTokenTransfers(monthPeriod);
      expect(result).toEqual(mockTopResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/statistics/top/token/transfer?spanType=${monthPeriod}`),
        expect.any(Object)
      );
    });

    it("should get top token senders", async () => {
      const result = await module.getTopTokenSenders(period);
      expect(result).toEqual(mockTopResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/statistics/top/token/sender?spanType=${period}`),
        expect.any(Object)
      );
    });

    it("should get top token receivers", async () => {
      const result = await module.getTopTokenReceivers(weekPeriod);
      expect(result).toEqual(mockTopResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/statistics/top/token/receiver?spanType=${weekPeriod}`),
        expect.any(Object)
      );
    });

    it("should get top token participants", async () => {
      const result = await module.getTopTokenParticipants(monthPeriod);
      expect(result).toEqual(mockTopResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/statistics/top/token/participant?spanType=${monthPeriod}`),
        expect.any(Object)
      );
    });

    it("should get top miners", async () => {
      const result = await module.getTopMiner(period);
      expect(result).toEqual(mockTopResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/statistics/top/miner?spanType=${period}`),
        expect.any(Object)
      );
    });
  });

  describe("Token Stats Methods", () => {
    const mockTokenHolderResponse: StatsResponse<TokenHolderStatItem> = {
      total: "100",
      list: [
        {
          statTime: "2024-02-07",
          holderCount: "50",
        },
      ],
    };

    const mockTokenUniqueResponse: StatsResponse<TokenUniqueStatItem> = {
      total: "100",
      list: [
        {
          statTime: "2024-02-07",
          uniqueSender: "20",
          uniqueReceiver: "30",
          uniqueParticipant: "40",
        },
      ],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockTokenHolderResponse }),
        } as Response)
      );
    });

    it("should throw error for invalid contract address in token holder stats", async () => {
      await expect(module.getTokenHolderStats(invalidAddress)).rejects.toThrow(
        "Invalid contract address"
      );
    });

    it("should get token holder stats for valid contract", async () => {
      const result = await module.getTokenHolderStats(validAddress);
      expect(result).toEqual(mockTokenHolderResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`/statistics/token/holder.*contract=${validAddress}`)),
        expect.any(Object)
      );
    });

    it("should throw error for invalid contract address in unique sender stats", async () => {
      await expect(module.getTokenUniqueSenderStats(invalidAddress)).rejects.toThrow(
        "Invalid contract address"
      );
    });

    it("should get token unique sender stats for valid contract", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockTokenUniqueResponse }),
        } as Response)
      );

      const result = await module.getTokenUniqueSenderStats(validAddress);
      expect(result).toEqual(mockTokenUniqueResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`/statistics/token/unique/sender.*contract=${validAddress}`)
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid contract address in unique receiver stats", async () => {
      await expect(module.getTokenUniqueReceiverStats(invalidAddress)).rejects.toThrow(
        "Invalid contract address"
      );
    });

    it("should get token unique receiver stats for valid contract", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockTokenUniqueResponse }),
        } as Response)
      );

      const result = await module.getTokenUniqueReceiverStats(validAddress);
      expect(result).toEqual(mockTokenUniqueResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`/statistics/token/unique/receiver.*contract=${validAddress}`)
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid contract address in unique participant stats", async () => {
      await expect(module.getTokenUniqueParticipantStats(invalidAddress)).rejects.toThrow(
        "Invalid contract address"
      );
    });

    it("should get token unique participant stats for valid contract", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockTokenUniqueResponse }),
        } as Response)
      );

      const result = await module.getTokenUniqueParticipantStats(validAddress);
      expect(result).toEqual(mockTokenUniqueResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(
          new RegExp(`/statistics/token/unique/participant.*contract=${validAddress}`)
        ),
        expect.any(Object)
      );
    });
  });

  describe("Block Stats Methods", () => {
    it("should get block base fee stats", async () => {
      const result = await module.getBlockBaseFeeStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/block/base-fee"),
        expect.any(Object)
      );
    });

    it("should get block gas used stats", async () => {
      const result = await module.getBlockGasUsedStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/block/gas-used"),
        expect.any(Object)
      );
    });

    it("should get block average priority fee stats", async () => {
      const result = await module.getBlockAvgPriorityFeeStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/block/avg-priority-fee"),
        expect.any(Object)
      );
    });

    it("should get block transactions by type stats", async () => {
      const result = await module.getBlockTxsByTypeStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/block/txs-by-type"),
        expect.any(Object)
      );
    });
  });

  describe("Other Stats Methods", () => {
    it("should get supply stats", async () => {
      const result = await module.getSupplyStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/supply"),
        expect.any(Object)
      );
    });

    it("should get mining stats", async () => {
      const result = await module.getMiningStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/mining"),
        expect.any(Object)
      );
    });

    it("should get active account overall stats", async () => {
      const result = await module.getActiveAccountOverallStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/account/active/overall"),
        expect.any(Object)
      );
    });

    it("should get token transfer stats", async () => {
      const result = await module.getTokenTransferStats();
      expect(result).toEqual(mockBasicResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/statistics/token/transfer"),
        expect.any(Object)
      );
    });
  });
});
