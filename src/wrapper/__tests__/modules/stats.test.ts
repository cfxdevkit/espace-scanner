import { StatsWrapper } from "../../modules/stats";
import { ESpaceScanner } from "../../../core";
import { ResponseFormatter } from "../../../formatters";
import { jest } from "@jest/globals";
import {
  StatsResponse,
  BasicStatItem,
  TokenHolderStatItem,
  TokenUniqueStatItem,
  TpsStatItem,
} from "../../../types";

jest.mock("../../../core/scanner");
jest.mock("../../../formatters/responses");

describe("StatsWrapper", () => {
  let wrapper: StatsWrapper;
  let mockScanner: jest.Mocked<ESpaceScanner>;
  const MockedFormatter = ResponseFormatter as jest.Mocked<typeof ResponseFormatter>;
  const validAddress = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock scanner instance
    mockScanner = {
      stats: {
        getActiveAccountStats: jest.fn(),
        getCfxHolderStats: jest.fn(),
        getAccountGrowthStats: jest.fn(),
        getContractStats: jest.fn(),
        getTransactionStats: jest.fn(),
        getCfxTransferStats: jest.fn(),
        getTpsStats: jest.fn(),
        getTopGasUsed: jest.fn(),
        getTopTransactionSenders: jest.fn(),
        getTopTransactionReceivers: jest.fn(),
        getTopCfxSenders: jest.fn(),
        getTopCfxReceivers: jest.fn(),
        getTopTokenTransfers: jest.fn(),
        getTopTokenSenders: jest.fn(),
        getTopTokenReceivers: jest.fn(),
        getTopTokenParticipants: jest.fn(),
        getTopMiner: jest.fn(),
        getTokenHolderStats: jest.fn(),
        getTokenUniqueSenderStats: jest.fn(),
        getTokenUniqueReceiverStats: jest.fn(),
        getTokenUniqueParticipantStats: jest.fn(),
        getBlockBaseFeeStats: jest.fn(),
        getBlockGasUsedStats: jest.fn(),
        getBlockAvgPriorityFeeStats: jest.fn(),
        getBlockTxsByTypeStats: jest.fn(),
      },
    } as unknown as jest.Mocked<ESpaceScanner>;

    // Mock the ESpaceScanner constructor
    (ESpaceScanner as jest.MockedClass<typeof ESpaceScanner>).mockImplementation(() => mockScanner);

    wrapper = new StatsWrapper({});

    // Mock formatter methods with conditional behavior
    MockedFormatter.formatNumber.mockImplementation((value) => {
      if (value === "0") return "0";
      if (value === "10") return "10";
      if (value === "100") return "100";
      return "1,000";
    });
    MockedFormatter.formatTimestamp.mockImplementation((value) => {
      if (value === "0") return "1970-01-01 00:00:00";
      return "2024-02-07 12:00:00";
    });
    MockedFormatter.formatGas.mockReturnValue("1.0 Gwei");
    MockedFormatter.formatCFX.mockReturnValue("1.0 CFX");
  });

  describe("Basic Statistics Methods", () => {
    const mockBasicResponse: StatsResponse<BasicStatItem> = {
      total: "100",
      list: [
        {
          statTime: "1707307200",
          count: "50",
        },
      ],
    };

    beforeEach(() => {
      mockScanner.stats.getActiveAccountStats.mockResolvedValue(mockBasicResponse);
      mockScanner.stats.getCfxHolderStats.mockResolvedValue(mockBasicResponse);
      mockScanner.stats.getAccountGrowthStats.mockResolvedValue(mockBasicResponse);
      mockScanner.stats.getContractStats.mockResolvedValue(mockBasicResponse);
      mockScanner.stats.getTransactionStats.mockResolvedValue(mockBasicResponse);
      mockScanner.stats.getCfxTransferStats.mockResolvedValue(mockBasicResponse);
    });

    it("should format active account stats", async () => {
      const result = await wrapper.getActiveAccountStats();
      expect(result).toEqual({
        total: "100",
        list: [
          {
            statTime: "2024-02-07 12:00:00",
            count: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getActiveAccountStats).toHaveBeenCalled();
      expect(MockedFormatter.formatTimestamp).toHaveBeenCalledWith("1707307200");
      expect(MockedFormatter.formatNumber).toHaveBeenCalledWith("50");
    });

    it("should format contract stats", async () => {
      const result = await wrapper.getContractStats();
      expect(result).toEqual({
        total: "100",
        list: [
          {
            statTime: "2024-02-07 12:00:00",
            count: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getContractStats).toHaveBeenCalled();
    });

    it("should format transaction stats", async () => {
      const result = await wrapper.getTransactionStats();
      expect(result).toEqual({
        total: "100",
        list: [
          {
            statTime: "2024-02-07 12:00:00",
            count: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTransactionStats).toHaveBeenCalled();
    });

    it("should handle missing values in basic stats", async () => {
      const mockResponseWithMissing: StatsResponse<BasicStatItem> = {
        total: "0",
        list: [
          {
            statTime: "0",
            count: "0",
          },
        ],
      };
      mockScanner.stats.getActiveAccountStats.mockResolvedValue(mockResponseWithMissing);

      const result = await wrapper.getActiveAccountStats();
      expect(result).toEqual({
        total: "0",
        list: [
          {
            statTime: "1970-01-01 00:00:00",
            count: "0",
          },
        ],
      });
    });

    it("should return raw data when returnRaw is true", async () => {
      const result = await wrapper.getActiveAccountStats({}, true);
      expect(result).toEqual(mockBasicResponse);
      expect(MockedFormatter.formatTimestamp).not.toHaveBeenCalled();
      expect(MockedFormatter.formatNumber).not.toHaveBeenCalled();
    });

    it("should handle custom parameters", async () => {
      const params = {
        minTimestamp: 1707307200,
        maxTimestamp: 1707393600,
        sort: "ASC" as const,
        skip: 10,
        limit: 20,
      };
      await wrapper.getActiveAccountStats(params);
      expect(mockScanner.stats.getActiveAccountStats).toHaveBeenCalledWith(params);
    });
  });

  describe("TPS Statistics", () => {
    const mockTpsResponse: StatsResponse<TpsStatItem> = {
      total: "100",
      list: [
        {
          statTime: "1707307200",
          tps: "50",
        },
      ],
    };

    beforeEach(() => {
      mockScanner.stats.getTpsStats.mockResolvedValue(mockTpsResponse);
    });

    it("should format TPS stats", async () => {
      const result = await wrapper.getTpsStats();
      expect(result).toEqual({
        total: "100",
        list: [
          {
            statTime: "2024-02-07 12:00:00",
            tps: "50",
          },
        ],
      });
      expect(mockScanner.stats.getTpsStats).toHaveBeenCalled();
    });
  });

  describe("Token Statistics", () => {
    const mockTokenHolderResponse: StatsResponse<TokenHolderStatItem> = {
      total: "100",
      list: [
        {
          statTime: "1707307200",
          holderCount: "50",
        },
      ],
    };

    const mockTokenUniqueResponse: StatsResponse<TokenUniqueStatItem> = {
      total: "100",
      list: [
        {
          statTime: "1707307200",
          uniqueSender: "30",
          uniqueReceiver: "20",
          uniqueParticipant: "50",
        },
      ],
    };

    beforeEach(() => {
      mockScanner.stats.getTokenHolderStats.mockResolvedValue(mockTokenHolderResponse);
      mockScanner.stats.getTokenUniqueSenderStats.mockResolvedValue({
        total: "100",
        list: [
          {
            statTime: "1707307200",
            uniqueSender: "1000",
          },
        ],
      });
      mockScanner.stats.getTokenUniqueReceiverStats.mockResolvedValue(mockTokenUniqueResponse);
      mockScanner.stats.getTokenUniqueParticipantStats.mockResolvedValue(mockTokenUniqueResponse);
      mockScanner.stats.getTopTokenTransfers.mockResolvedValue({
        maxTime: "1707307200",
        valueTotal: "1000",
        list: [
          {
            address: validAddress,
            value: "1000",
          },
        ],
      });
      mockScanner.stats.getTopTokenSenders.mockResolvedValue({
        maxTime: "1707307200",
        valueTotal: "1000",
        list: [
          {
            address: validAddress,
            value: "1000",
          },
        ],
      });
      mockScanner.stats.getTopTokenReceivers.mockResolvedValue({
        maxTime: "1707307200",
        valueTotal: "1000",
        list: [
          {
            address: validAddress,
            value: "1000",
          },
        ],
      });
      mockScanner.stats.getTopTokenParticipants.mockResolvedValue({
        maxTime: "1707307200",
        valueTotal: "1000",
        list: [
          {
            address: validAddress,
            value: "1000",
          },
        ],
      });
    });

    it("should format token holder stats", async () => {
      const result = await wrapper.getTokenHolderStats(validAddress);
      expect(result).toEqual({
        total: "100",
        list: [
          {
            statTime: "2024-02-07 12:00:00",
            holderCount: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTokenHolderStats).toHaveBeenCalledWith(validAddress, {});
    });

    it("should format token unique sender stats", async () => {
      const result = await wrapper.getTokenUniqueSenderStats(validAddress);
      expect(result).toEqual({
        total: "100",
        list: [
          {
            statTime: "2024-02-07 12:00:00",
            uniqueSender: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTokenUniqueSenderStats).toHaveBeenCalledWith(validAddress, {});
    });

    it("should format token unique receiver stats", async () => {
      const result = await wrapper.getTokenUniqueReceiverStats(validAddress);
      expect(result).toEqual({
        total: "100",
        list: [
          {
            statTime: "2024-02-07 12:00:00",
            uniqueReceiver: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTokenUniqueReceiverStats).toHaveBeenCalledWith(validAddress, {});
    });

    it("should format token unique participant stats", async () => {
      const result = await wrapper.getTokenUniqueParticipantStats(validAddress);
      expect(result).toEqual({
        total: "100",
        list: [
          {
            statTime: "2024-02-07 12:00:00",
            uniqueParticipant: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTokenUniqueParticipantStats).toHaveBeenCalledWith(
        validAddress,
        {}
      );
    });

    it("should format top token transfers", async () => {
      const result = await wrapper.getTopTokenTransfers("24h");
      expect(result).toEqual({
        maxTime: "2024-02-07",
        valueTotal: "1,000",
        list: [
          {
            address: validAddress,
            value: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTopTokenTransfers).toHaveBeenCalledWith("24h");
    });

    it("should format top token senders", async () => {
      const result = await wrapper.getTopTokenSenders("24h");
      expect(result).toEqual({
        maxTime: "2024-02-07",
        valueTotal: "1,000",
        list: [
          {
            address: validAddress,
            value: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTopTokenSenders).toHaveBeenCalledWith("24h");
    });

    it("should format top token receivers", async () => {
      const result = await wrapper.getTopTokenReceivers("24h");
      expect(result).toEqual({
        maxTime: "2024-02-07",
        valueTotal: "1,000",
        list: [
          {
            address: validAddress,
            value: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTopTokenReceivers).toHaveBeenCalledWith("24h");
    });

    it("should format top token participants", async () => {
      const result = await wrapper.getTopTokenParticipants("24h");
      expect(result).toEqual({
        maxTime: "2024-02-07",
        valueTotal: "1,000",
        list: [
          {
            address: validAddress,
            value: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTopTokenParticipants).toHaveBeenCalledWith("24h");
    });

    it("should handle missing values in token holder stats", async () => {
      const mockResponseWithMissing: StatsResponse<TokenHolderStatItem> = {
        total: "0",
        list: [
          {
            statTime: "0",
            holderCount: "0",
          },
        ],
      };
      mockScanner.stats.getTokenHolderStats.mockResolvedValue(mockResponseWithMissing);

      const result = await wrapper.getTokenHolderStats(validAddress);
      expect(result).toEqual({
        total: "0",
        list: [
          {
            statTime: "1970-01-01 00:00:00",
            holderCount: "0",
          },
        ],
      });
    });

    it("should handle missing values in unique stats", async () => {
      const mockResponseWithMissing: StatsResponse<TokenUniqueStatItem> = {
        total: "0",
        list: [
          {
            statTime: "0",
            uniqueSender: "0",
            uniqueReceiver: "0",
            uniqueParticipant: "0",
          },
        ],
      };
      mockScanner.stats.getTokenUniqueSenderStats.mockResolvedValue(mockResponseWithMissing);

      const result = await wrapper.getTokenUniqueSenderStats(validAddress);
      expect(result).toEqual({
        total: "0",
        list: [
          {
            statTime: "1970-01-01 00:00:00",
            uniqueSender: "0",
          },
        ],
      });
    });
  });

  describe("Block Statistics", () => {
    const mockBlockStats = {
      total: "100",
      list: [
        {
          blockNumber: "1",
          timestamp: "1707307200",
          baseFee: "1000",
          gasUsed: "1000",
          avgPriorityFee: "1000",
          txsInType: {
            legacy: 10,
            cip2930: 5,
            cip1559: 15,
          },
        },
      ],
    };

    beforeEach(() => {
      mockScanner.stats.getBlockBaseFeeStats.mockResolvedValue(mockBlockStats);
      mockScanner.stats.getBlockGasUsedStats.mockResolvedValue(mockBlockStats);
      mockScanner.stats.getBlockAvgPriorityFeeStats.mockResolvedValue(mockBlockStats);
      mockScanner.stats.getBlockTxsByTypeStats.mockResolvedValue(mockBlockStats);
    });

    it("should format block base fee stats", async () => {
      const result = await wrapper.getBlockBaseFeeStats();
      expect(result).toEqual({
        total: "100",
        list: [
          {
            blockNumber: "1",
            timestamp: "1707307200",
            baseFee: "1,000",
            gasUsed: "1,000",
            avgPriorityFee: "1,000",
            txsInType: {
              legacy: 10,
              cip2930: 5,
              cip1559: 15,
            },
          },
        ],
      });
      expect(mockScanner.stats.getBlockBaseFeeStats).toHaveBeenCalled();
    });

    it("should format block gas used stats", async () => {
      const result = await wrapper.getBlockGasUsedStats();
      expect(result).toEqual({
        total: "100",
        list: [
          {
            blockNumber: "1",
            timestamp: "1707307200",
            baseFee: "1,000",
            gasUsed: "1,000",
            avgPriorityFee: "1,000",
            txsInType: {
              cip1559: 15,
              cip2930: 5,
              legacy: 10,
            },
          },
        ],
      });
      expect(mockScanner.stats.getBlockGasUsedStats).toHaveBeenCalledWith({});
    });

    it("should format block avg priority fee stats", async () => {
      const result = await wrapper.getBlockAvgPriorityFeeStats();
      expect(result).toEqual({
        total: "100",
        list: [
          {
            blockNumber: "1",
            timestamp: "1707307200",
            baseFee: "1,000",
            gasUsed: "1,000",
            avgPriorityFee: "1,000",
            txsInType: {
              cip1559: 15,
              cip2930: 5,
              legacy: 10,
            },
          },
        ],
      });
      expect(mockScanner.stats.getBlockAvgPriorityFeeStats).toHaveBeenCalledWith({});
    });

    it("should format block txs by type stats", async () => {
      const result = await wrapper.getBlockTxsByTypeStats();
      expect(result).toEqual({
        total: "100",
        list: [
          {
            blockNumber: "1",
            timestamp: "1707307200",
            baseFee: "1,000",
            gasUsed: "1,000",
            avgPriorityFee: "1,000",
            txsInType: {
              cip1559: 15,
              cip2930: 5,
              legacy: 10,
            },
          },
        ],
      });
      expect(mockScanner.stats.getBlockTxsByTypeStats).toHaveBeenCalledWith({});
    });

    it("should handle missing values in block stats", async () => {
      const mockBlockStatsWithMissing = {
        total: "0",
        list: [
          {
            blockNumber: "1",
            timestamp: "0",
          },
        ],
      };
      mockScanner.stats.getBlockBaseFeeStats.mockResolvedValue(mockBlockStatsWithMissing);

      const result = await wrapper.getBlockBaseFeeStats();
      expect(result).toEqual({
        total: "0",
        list: [
          {
            blockNumber: "1",
            timestamp: "0",
          },
        ],
      });
    });

    it("should handle partial values in block stats", async () => {
      const mockBlockStatsPartial = {
        total: "100",
        list: [
          {
            blockNumber: "1",
            timestamp: "1707307200",
            baseFee: "1000",
            // Missing gasUsed and avgPriorityFee
            txsInType: {
              legacy: 10,
              cip2930: 0,
              cip1559: 0,
            },
          },
        ],
      };
      mockScanner.stats.getBlockBaseFeeStats.mockResolvedValue(mockBlockStatsPartial);

      const result = await wrapper.getBlockBaseFeeStats();
      expect(result).toEqual({
        total: "100",
        list: [
          {
            blockNumber: "1",
            timestamp: "1707307200",
            baseFee: "1,000",
            txsInType: {
              legacy: 10,
              cip2930: 0,
              cip1559: 0,
            },
          },
        ],
      });
    });

    it("should handle custom parameters in block stats", async () => {
      const params = {
        minTimestamp: 1707307200,
        maxTimestamp: 1707393600,
        sort: "ASC" as const,
        skip: 10,
        limit: 20,
      };
      await wrapper.getBlockBaseFeeStats(params);
      expect(mockScanner.stats.getBlockBaseFeeStats).toHaveBeenCalledWith(params);
    });

    it("should return raw block stats when returnRaw is true", async () => {
      const result = await wrapper.getBlockBaseFeeStats({}, true);
      expect(result).toEqual(mockBlockStats);
      expect(MockedFormatter.formatNumber).not.toHaveBeenCalled();
    });

    it("should handle empty list in block stats", async () => {
      const mockEmptyBlockStats = {
        total: "0",
        list: [],
      };
      mockScanner.stats.getBlockBaseFeeStats.mockResolvedValue(mockEmptyBlockStats);

      const result = await wrapper.getBlockBaseFeeStats();
      expect(result).toEqual({
        total: "0",
        list: [],
      });
    });
  });

  describe("Top Statistics Methods", () => {
    const mockTopStats = {
      gasTotal: "1000",
      list: [
        {
          address: validAddress,
          gas: "1000",
        },
      ],
    };

    const mockTopTokenStats = {
      maxTime: "1707307200",
      valueTotal: "1000",
      list: [
        {
          address: validAddress,
          value: "1000",
        },
      ],
    };

    beforeEach(() => {
      mockScanner.stats.getTopGasUsed.mockResolvedValue(mockTopStats);
      mockScanner.stats.getTopTokenTransfers.mockResolvedValue(mockTopTokenStats);
    });

    it("should format top gas used stats", async () => {
      const result = await wrapper.getTopGasUsed("24h");
      expect(result).toEqual({
        gasTotal: "1,000",
        list: [
          {
            address: validAddress,
            gas: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTopGasUsed).toHaveBeenCalledWith("24h");
    });

    it("should format top token transfers stats", async () => {
      const result = await wrapper.getTopTokenTransfers("24h");
      expect(result).toEqual({
        maxTime: "2024-02-07",
        valueTotal: "1,000",
        list: [
          {
            address: validAddress,
            value: "1,000",
          },
        ],
      });
      expect(mockScanner.stats.getTopTokenTransfers).toHaveBeenCalledWith("24h");
    });

    it("should handle missing values in top stats", async () => {
      const mockTopStatsWithMissing = {
        list: [
          {
            address: validAddress,
            gas: "0",
            value: "0",
            blockCntr: "0",
            rewardSum: "0",
            txFeeSum: "0",
            hashRate: "0",
            transferCntr: "0",
            count: "0",
          },
        ],
      };
      mockScanner.stats.getTopGasUsed.mockResolvedValue(mockTopStatsWithMissing);

      const result = await wrapper.getTopGasUsed("24h");
      expect(result).toEqual({
        list: [
          {
            address: validAddress,
            gas: "0",
            value: "0",
            blockCntr: "0",
            rewardSum: "0",
            txFeeSum: "0",
            hashRate: "0",
            transferCntr: "0",
            count: "0",
          },
        ],
      });
    });

    it("should return raw top stats when returnRaw is true", async () => {
      const result = await wrapper.getTopGasUsed("24h", true);
      expect(result).toEqual(mockTopStats);
      expect(MockedFormatter.formatNumber).not.toHaveBeenCalled();
    });

    it("should handle all possible fields in top stats", async () => {
      const mockCompleteTopStats = {
        maxTime: "1707307200",
        valueTotal: "1000",
        gasTotal: "1000",
        difficultyTotal: 1000,
        total: 100,
        list: [
          {
            address: validAddress,
            gas: "1000",
            value: "1000",
            blockCntr: "10",
            rewardSum: "1000",
            txFeeSum: "1000",
            hashRate: "1000",
            transferCntr: "10",
            count: "100",
          },
        ],
      };
      mockScanner.stats.getTopGasUsed.mockResolvedValue(mockCompleteTopStats);

      const result = await wrapper.getTopGasUsed("24h");
      expect(result).toEqual({
        maxTime: "1707307200",
        valueTotal: "1,000",
        gasTotal: "1,000",
        difficultyTotal: 1000,
        total: 100,
        list: [
          {
            address: validAddress,
            gas: "1,000",
            value: "1,000",
            blockCntr: "10",
            rewardSum: "1,000",
            txFeeSum: "1,000",
            hashRate: "1,000",
            transferCntr: "10",
            count: "100",
          },
        ],
      });
    });

    it("should handle invalid maxTime in top stats", async () => {
      const mockInvalidMaxTime = {
        maxTime: "invalid",
        valueTotal: "1000",
        list: [
          {
            address: validAddress,
            value: "1000",
          },
        ],
      };
      mockScanner.stats.getTopTokenTransfers.mockResolvedValue(mockInvalidMaxTime);

      const result = await wrapper.getTopTokenTransfers("24h");
      expect(result).toEqual({
        maxTime: "N/A",
        valueTotal: "1,000",
        list: [
          {
            address: validAddress,
            value: "1,000",
          },
        ],
      });
    });

    it("should handle empty list in top stats", async () => {
      const mockEmptyTopStats = {
        maxTime: "1707307200",
        valueTotal: "0",
        list: [],
      };
      mockScanner.stats.getTopTokenTransfers.mockResolvedValue(mockEmptyTopStats);

      const result = await wrapper.getTopTokenTransfers("24h");
      expect(result).toEqual({
        maxTime: "2024-02-07",
        valueTotal: "0",
        list: [],
      });
    });
  });
});
