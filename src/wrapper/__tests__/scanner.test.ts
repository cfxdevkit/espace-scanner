import { ESpaceScannerWrapper } from "../scanner";
import { ESpaceScanner } from "../../core";
import { ResponseFormatter } from "../../formatters";
import { jest } from "@jest/globals";
import {
  StatsParams,
  StatsResponse,
  BasicStatItem,
  TokenHolderStatItem,
  TokenUniqueStatItem,
  BlockStatItem,
  TpsStatItem,
} from "../../types";

jest.mock("../../core/scanner");
jest.mock("../../formatters/responses");

describe("ESpaceScannerWrapper", () => {
  let wrapper: ESpaceScannerWrapper;
  const MockedScanner = ESpaceScanner as jest.MockedClass<typeof ESpaceScanner>;
  const MockedFormatter = ResponseFormatter as jest.Mocked<typeof ResponseFormatter>;
  const validAddress = "0x1234567890123456789012345678901234567890";
  const mockTokens = [
    {
      address: validAddress,
      name: "Test Token",
      symbol: "TEST",
      decimals: 18,
      amount: "1000000000000000000",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = new ESpaceScannerWrapper();
    MockedFormatter.formatGas.mockReturnValue("1.0 Gwei");
    MockedFormatter.formatNumber.mockImplementation((value) => {
      if (value === 75) return "75";
      if (value === 60) return "60";
      if (!value || value === "0" || value === 0) return "0";
      return "50";
    });
    MockedFormatter.formatUnit.mockImplementation((value, _decimals) => {
      if (!value || value === "0" || value === 0) return "0";
      return value === "1000000000000000000" ? "1.0" : value.toString();
    });
    MockedScanner.prototype.getAccountTokens.mockResolvedValue(mockTokens);
  });

  describe("Contract Methods", () => {
    describe("getContractABI", () => {
      const mockABI = { abi: '[{"type":"function","name":"test"}]' };

      beforeEach(() => {
        MockedScanner.prototype.getContractABI.mockResolvedValue(mockABI);
      });

      it("should return formatted contract ABI by default", async () => {
        const result = await wrapper.getContractABI(validAddress);
        expect(result).toEqual(mockABI);
        expect(MockedScanner.prototype.getContractABI).toHaveBeenCalledWith(validAddress);
      });

      it("should return raw contract ABI when returnRaw is true", async () => {
        const result = await wrapper.getContractABI(validAddress, true);
        expect(result).toEqual(mockABI);
        expect(MockedScanner.prototype.getContractABI).toHaveBeenCalledWith(validAddress);
      });
    });

    describe("getContractSourceCode", () => {
      const mockSourceCode = {
        sourceCode: "contract Test {}",
        abi: "[]",
        contractName: "Test",
        compiler: "v0.8.0",
        optimizationUsed: true,
        runs: 200,
        constructorArguments: "",
        evmVersion: "london",
        library: "",
        licenseType: "MIT",
        proxy: "0x0",
        implementation: "0x0",
        swarmSource: "",
      };

      beforeEach(() => {
        MockedScanner.prototype.getContractSourceCode.mockResolvedValue(mockSourceCode);
      });

      it("should return formatted contract source code by default", async () => {
        const result = await wrapper.getContractSourceCode(validAddress);
        expect(result).toEqual(mockSourceCode);
        expect(MockedScanner.prototype.getContractSourceCode).toHaveBeenCalledWith(validAddress);
      });

      it("should return raw contract source code when returnRaw is true", async () => {
        const result = await wrapper.getContractSourceCode(validAddress, true);
        expect(result).toEqual(mockSourceCode);
        expect(MockedScanner.prototype.getContractSourceCode).toHaveBeenCalledWith(validAddress);
      });
    });
  });

  describe("Token Methods", () => {
    describe("getAccountTokens", () => {
      it("should format token data", async () => {
        const result = await wrapper.getAccountTokens(validAddress, "ERC20");
        expect(result.list[0]).toEqual({
          ...mockTokens[0],
          amount: "1.0",
          priceInUSDT: undefined,
        });
        expect(result.total).toBe(1);
      });

      it("should return raw data when requested", async () => {
        const result = await wrapper.getAccountTokens(validAddress, "ERC20", 0, 10, true);
        expect(result).toEqual({
          list: mockTokens,
          total: mockTokens.length,
        });
      });

      it("should handle pagination parameters", async () => {
        await wrapper.getAccountTokens(validAddress, "ERC20", 10, 20);
        expect(MockedScanner.prototype.getAccountTokens).toHaveBeenCalledWith(
          validAddress,
          "ERC20",
          10,
          20
        );
      });
    });

    describe("getTokenHolderStats", () => {
      const mockTokenHolderStats: StatsResponse<TokenHolderStatItem> = {
        total: 100,
        list: [
          { statTime: "2024-02-07", holderCount: 50 },
          { statTime: "2024-02-06", holderCount: 40 },
        ],
      };

      it("should return formatted token holder stats by default", async () => {
        MockedScanner.prototype.getTokenHolderStats.mockResolvedValue(mockTokenHolderStats);
        const result = await wrapper.getTokenHolderStats(validAddress);
        expect(result.total).toBe(mockTokenHolderStats.total);
        expect(result.list[0].holderCount).toBe("50");
        expect(MockedScanner.prototype.getTokenHolderStats).toHaveBeenCalledWith(validAddress, {});
      });

      it("should return raw token holder stats when returnRaw is true", async () => {
        MockedScanner.prototype.getTokenHolderStats.mockResolvedValue(mockTokenHolderStats);
        const result = await wrapper.getTokenHolderStats(validAddress, undefined, true);
        expect(result).toEqual(mockTokenHolderStats);
        expect(MockedScanner.prototype.getTokenHolderStats).toHaveBeenCalledWith(validAddress, {});
      });
    });

    describe("getTokenUniqueSenderStats", () => {
      const mockTokenSenderStats: StatsResponse<TokenUniqueStatItem> = {
        total: 100,
        list: [
          { statTime: "2024-02-07", uniqueSenderCount: 75 },
          { statTime: "2024-02-06", uniqueSenderCount: 65 },
        ],
      };

      it("should return formatted token unique sender stats by default", async () => {
        MockedScanner.prototype.getTokenUniqueSenderStats.mockResolvedValue(mockTokenSenderStats);
        const result = await wrapper.getTokenUniqueSenderStats(validAddress);
        expect(result.total).toBe(mockTokenSenderStats.total);
        expect(result.list[0].uniqueSenderCount).toBe("75");
        expect(MockedScanner.prototype.getTokenUniqueSenderStats).toHaveBeenCalledWith(
          validAddress,
          {}
        );
      });

      it("should return raw token unique sender stats when returnRaw is true", async () => {
        MockedScanner.prototype.getTokenUniqueSenderStats.mockResolvedValue(mockTokenSenderStats);
        const result = await wrapper.getTokenUniqueSenderStats(validAddress, undefined, true);
        expect(result).toEqual(mockTokenSenderStats);
        expect(MockedScanner.prototype.getTokenUniqueSenderStats).toHaveBeenCalledWith(
          validAddress,
          {}
        );
      });
    });

    describe("getTokenUniqueReceiverStats", () => {
      const mockTokenReceiverStats: StatsResponse<TokenUniqueStatItem> = {
        total: 100,
        list: [
          { statTime: "2024-02-07", uniqueReceiverCount: 60 },
          { statTime: "2024-02-06", uniqueReceiverCount: 50 },
        ],
      };

      it("should return formatted token unique receiver stats by default", async () => {
        MockedScanner.prototype.getTokenUniqueReceiverStats.mockResolvedValue(
          mockTokenReceiverStats
        );
        const result = await wrapper.getTokenUniqueReceiverStats(validAddress);
        expect(result.total).toBe(mockTokenReceiverStats.total);
        expect(result.list[0].uniqueReceiverCount).toBe("60");
        expect(MockedScanner.prototype.getTokenUniqueReceiverStats).toHaveBeenCalledWith(
          validAddress,
          {}
        );
      });

      it("should return raw token unique receiver stats when returnRaw is true", async () => {
        MockedScanner.prototype.getTokenUniqueReceiverStats.mockResolvedValue(
          mockTokenReceiverStats
        );
        const result = await wrapper.getTokenUniqueReceiverStats(validAddress, undefined, true);
        expect(result).toEqual(mockTokenReceiverStats);
        expect(MockedScanner.prototype.getTokenUniqueReceiverStats).toHaveBeenCalledWith(
          validAddress,
          {}
        );
      });
    });
  });

  describe("Statistics Methods", () => {
    const mockBasicStats: StatsResponse<BasicStatItem> = {
      total: 100,
      list: [
        { statTime: "1707307200", count: 50 },
        { statTime: "1707307100", count: 40 },
      ],
    };

    const mockTpsStats: StatsResponse<TpsStatItem> = {
      total: 100,
      list: [
        { statTime: "1707307200", tps: "0.5" },
        { statTime: "1707307100", tps: "0.4" },
      ],
    };

    const mockTokenHolderStats: StatsResponse<TokenHolderStatItem> = {
      total: 100,
      list: [
        { statTime: "1707307200", holderCount: 80 },
        { statTime: "1707307100", holderCount: 70 },
      ],
    };

    const mockTokenUniqueSenderStats: StatsResponse<TokenUniqueStatItem> = {
      total: 100,
      list: [
        { statTime: "1707307200", uniqueSenderCount: 60 },
        { statTime: "1707307100", uniqueSenderCount: 50 },
      ],
    };

    const mockTokenUniqueReceiverStats: StatsResponse<TokenUniqueStatItem> = {
      total: 100,
      list: [
        { statTime: "1707307200", uniqueReceiverCount: 40 },
        { statTime: "1707307100", uniqueReceiverCount: 30 },
      ],
    };

    const mockTokenParticipantStats: StatsResponse<TokenUniqueStatItem> = {
      total: 100,
      list: [
        { statTime: "1707307200", uniqueParticipantCount: 80 },
        { statTime: "1707307100", uniqueParticipantCount: 70 },
      ],
    };

    const mockBlockBaseFeeStats: StatsResponse<BlockStatItem> = {
      total: "100",
      list: [
        {
          statTime: "1707307200",
          blockNumber: "1000",
          timestamp: "1707307200",
          baseFee: "1000000000",
        },
        {
          statTime: "1707307100",
          blockNumber: "999",
          timestamp: "1707307100",
          baseFee: "900000000",
        },
      ],
    };

    const mockBlockGasUsedStats: StatsResponse<BlockStatItem> = {
      total: "100",
      list: [
        {
          statTime: "1707307200",
          blockNumber: "1000",
          timestamp: "1707307200",
          gasUsed: "2000000000",
        },
        {
          statTime: "1707307100",
          blockNumber: "999",
          timestamp: "1707307100",
          gasUsed: "1800000000",
        },
      ],
    };

    const mockBlockAvgPriorityFeeStats: StatsResponse<BlockStatItem> = {
      total: "100000000",
      list: [
        {
          blockNumber: "1000",
          timestamp: "1707307200",
          avgPriorityFee: "500000000",
          statTime: "1707307200",
        },
        {
          blockNumber: "999",
          timestamp: "1707307100",
          avgPriorityFee: "450000000",
          statTime: "1707307100",
        },
      ],
    };

    const mockBlockTxsByTypeStats: StatsResponse<BlockStatItem> = {
      total: 100,
      list: [
        {
          statTime: "1707307200",
          blockNumber: "123",
          timestamp: "1707307200",
          txsInType: {
            legacy: 100,
            cip2930: 50,
            cip1559: 25,
          },
        },
        {
          statTime: "1707307300",
          blockNumber: "124",
          timestamp: "1707307300",
          txsInType: {
            legacy: 90,
            cip2930: 45,
            cip1559: 20,
          },
        },
      ],
    };

    const mockTopTokenTransfers = {
      maxTime: "2024-02-07",
      list: [
        { address: validAddress, transferCntr: "60" },
        { address: "0x2234567890123456789012345678901234567890", transferCntr: "50" },
      ],
    };

    beforeEach(() => {
      MockedFormatter.formatGas.mockReturnValue("1.0 Gwei");
      MockedFormatter.formatNumber.mockReturnValue("50");
    });

    describe("Basic Stats Methods", () => {
      const mockActiveAccountStats = {
        total: 100,
        list: [
          { statTime: "2024-02-07", count: 50 },
          { statTime: "2024-02-06", count: 40 },
        ],
      };

      const mockCfxHolderStats = {
        total: 100,
        list: [
          { statTime: "2024-02-07", count: 100 },
          { statTime: "2024-02-06", count: 90 },
        ],
      };

      const mockAccountGrowthStats = {
        total: 100,
        list: [
          { statTime: "2024-02-07", count: 50 },
          { statTime: "2024-02-06", count: 40 },
        ],
      };

      const statsParams: StatsParams = {
        minTimestamp: 1000,
        maxTimestamp: 2000,
        sort: "ASC",
        skip: 10,
        limit: 20,
      };

      beforeEach(() => {
        MockedFormatter.formatNumber.mockReturnValue("50");
      });

      it("should return formatted active account stats by default", async () => {
        MockedScanner.prototype.getActiveAccountStats.mockResolvedValue(mockActiveAccountStats);
        const result = (await wrapper.getActiveAccountStats(
          statsParams
        )) as typeof mockActiveAccountStats;
        expect(result.total).toBe(mockActiveAccountStats.total);
        expect(result.list[0].count).toBe("50");
        expect(MockedScanner.prototype.getActiveAccountStats).toHaveBeenCalledWith(statsParams);
      });

      it("should return raw active account stats when returnRaw is true", async () => {
        MockedScanner.prototype.getActiveAccountStats.mockResolvedValue(mockActiveAccountStats);
        const result = await wrapper.getActiveAccountStats(statsParams, true);
        expect(result).toEqual(mockActiveAccountStats);
        expect(MockedScanner.prototype.getActiveAccountStats).toHaveBeenCalledWith(statsParams);
      });

      it("should return formatted CFX holder stats by default", async () => {
        MockedScanner.prototype.getCfxHolderStats.mockResolvedValue(mockCfxHolderStats);
        const result = (await wrapper.getCfxHolderStats(statsParams)) as typeof mockCfxHolderStats;
        expect(result.total).toBe(mockCfxHolderStats.total);
        expect(result.list[0].count).toBe("50");
        expect(MockedScanner.prototype.getCfxHolderStats).toHaveBeenCalledWith(statsParams);
      });

      it("should return raw CFX holder stats when returnRaw is true", async () => {
        MockedScanner.prototype.getCfxHolderStats.mockResolvedValue(mockCfxHolderStats);
        const result = await wrapper.getCfxHolderStats(statsParams, true);
        expect(result).toEqual(mockCfxHolderStats);
        expect(MockedScanner.prototype.getCfxHolderStats).toHaveBeenCalledWith(statsParams);
      });

      it("should return formatted account growth stats by default", async () => {
        MockedScanner.prototype.getAccountGrowthStats.mockResolvedValue(mockAccountGrowthStats);
        const result = (await wrapper.getAccountGrowthStats(
          statsParams
        )) as typeof mockAccountGrowthStats;
        expect(result.total).toBe(mockAccountGrowthStats.total);
        expect(result.list[0].count).toBe("50");
        expect(MockedScanner.prototype.getAccountGrowthStats).toHaveBeenCalledWith(statsParams);
      });

      it("should return raw account growth stats when returnRaw is true", async () => {
        MockedScanner.prototype.getAccountGrowthStats.mockResolvedValue(mockAccountGrowthStats);
        const result = await wrapper.getAccountGrowthStats(statsParams, true);
        expect(result).toEqual(mockAccountGrowthStats);
        expect(MockedScanner.prototype.getAccountGrowthStats).toHaveBeenCalledWith(statsParams);
      });
    });

    describe("Token Stats Methods", () => {
      beforeEach(() => {
        MockedFormatter.formatNumber.mockImplementation((value) => {
          if (value === 75) return "75";
          if (value === 60) return "60";
          if (value === 50) return "50";
          if (!value || value === "0" || value === 0) return "0";
          return String(value);
        });
      });

      it("should return formatted token holder stats by default", async () => {
        MockedScanner.prototype.getTokenHolderStats.mockResolvedValue(mockTokenHolderStats);
        const result = await wrapper.getTokenHolderStats(validAddress);
        expect(result.total).toBe(mockTokenHolderStats.total);
        expect(result.list[0].holderCount).toBe("80");
        expect(MockedScanner.prototype.getTokenHolderStats).toHaveBeenCalledWith(validAddress, {});
      });

      it("should return raw token holder stats when returnRaw is true", async () => {
        MockedScanner.prototype.getTokenHolderStats.mockResolvedValue(mockTokenHolderStats);
        const result = await wrapper.getTokenHolderStats(validAddress, undefined, true);
        expect(result).toEqual(mockTokenHolderStats);
        expect(MockedScanner.prototype.getTokenHolderStats).toHaveBeenCalledWith(validAddress, {});
      });

      it("should return formatted token unique sender stats by default", async () => {
        MockedScanner.prototype.getTokenUniqueSenderStats.mockResolvedValue(
          mockTokenUniqueSenderStats
        );
        const result = await wrapper.getTokenUniqueSenderStats(validAddress);
        expect(result.total).toBe(mockTokenUniqueSenderStats.total);
        expect(result.list[0].uniqueSenderCount).toBe("60");
        expect(MockedScanner.prototype.getTokenUniqueSenderStats).toHaveBeenCalledWith(
          validAddress,
          {}
        );
      });

      it("should return raw token unique sender stats when returnRaw is true", async () => {
        MockedScanner.prototype.getTokenUniqueSenderStats.mockResolvedValue(
          mockTokenUniqueSenderStats
        );
        const result = await wrapper.getTokenUniqueSenderStats(validAddress, undefined, true);
        expect(result).toEqual(mockTokenUniqueSenderStats);
        expect(MockedScanner.prototype.getTokenUniqueSenderStats).toHaveBeenCalledWith(
          validAddress,
          {}
        );
      });

      it("should return formatted token unique receiver stats by default", async () => {
        MockedScanner.prototype.getTokenUniqueReceiverStats.mockResolvedValue(
          mockTokenUniqueReceiverStats
        );
        const result = await wrapper.getTokenUniqueReceiverStats(validAddress);
        expect(result.total).toBe(mockTokenUniqueReceiverStats.total);
        expect(result.list[0].uniqueReceiverCount).toBe("40");
        expect(MockedScanner.prototype.getTokenUniqueReceiverStats).toHaveBeenCalledWith(
          validAddress,
          {}
        );
      });

      it("should return raw token unique receiver stats when returnRaw is true", async () => {
        MockedScanner.prototype.getTokenUniqueReceiverStats.mockResolvedValue(
          mockTokenUniqueReceiverStats
        );
        const result = await wrapper.getTokenUniqueReceiverStats(validAddress, undefined, true);
        expect(result).toEqual(mockTokenUniqueReceiverStats);
        expect(MockedScanner.prototype.getTokenUniqueReceiverStats).toHaveBeenCalledWith(
          validAddress,
          {}
        );
      });

      it("should return formatted token unique participant stats by default", async () => {
        MockedScanner.prototype.getTokenUniqueParticipantStats.mockResolvedValue(
          mockTokenParticipantStats
        );
        const result = await wrapper.getTokenUniqueParticipantStats(validAddress);
        expect(result.total).toBe(mockTokenParticipantStats.total);
        expect(result.list[0].uniqueParticipantCount).toBe("80");
        expect(MockedScanner.prototype.getTokenUniqueParticipantStats).toHaveBeenCalledWith(
          validAddress,
          {}
        );
      });

      it("should return raw token unique participant stats when returnRaw is true", async () => {
        MockedScanner.prototype.getTokenUniqueParticipantStats.mockResolvedValue(
          mockTokenParticipantStats
        );
        const result = await wrapper.getTokenUniqueParticipantStats(validAddress, undefined, true);
        expect(result).toEqual(mockTokenParticipantStats);
        expect(MockedScanner.prototype.getTokenUniqueParticipantStats).toHaveBeenCalledWith(
          validAddress,
          {}
        );
      });
    });

    describe("Block Stats Methods", () => {
      it("should return formatted block base fee stats by default", async () => {
        MockedScanner.prototype.getBlockBaseFeeStats.mockResolvedValue(mockBlockBaseFeeStats);
        const result = await wrapper.getBlockBaseFeeStats();
        expect(result.total).toBe("1.0 Gwei");
        expect(result.list[0].baseFee).toBe("1.0 Gwei");
        expect(MockedScanner.prototype.getBlockBaseFeeStats).toHaveBeenCalled();
      });

      it("should return raw block base fee stats when returnRaw is true", async () => {
        MockedScanner.prototype.getBlockBaseFeeStats.mockResolvedValue(mockBlockBaseFeeStats);
        const result = await wrapper.getBlockBaseFeeStats({}, true);
        expect(result).toEqual(mockBlockBaseFeeStats);
        expect(MockedScanner.prototype.getBlockBaseFeeStats).toHaveBeenCalled();
      });

      it("should return formatted block gas used stats by default", async () => {
        MockedScanner.prototype.getBlockGasUsedStats.mockResolvedValue(mockBlockGasUsedStats);
        const result = await wrapper.getBlockGasUsedStats();
        expect(result.total).toBe("1.0 Gwei");
        expect(result.list[0].gasUsed).toBe("1.0 Gwei");
        expect(MockedScanner.prototype.getBlockGasUsedStats).toHaveBeenCalled();
      });

      it("should return raw block gas used stats when returnRaw is true", async () => {
        MockedScanner.prototype.getBlockGasUsedStats.mockResolvedValue(mockBlockGasUsedStats);
        const result = await wrapper.getBlockGasUsedStats({}, true);
        expect(result).toEqual(mockBlockGasUsedStats);
        expect(MockedScanner.prototype.getBlockGasUsedStats).toHaveBeenCalled();
      });

      it("should return formatted block average priority fee stats by default", async () => {
        MockedScanner.prototype.getBlockAvgPriorityFeeStats.mockResolvedValue(
          mockBlockAvgPriorityFeeStats
        );
        const result = await wrapper.getBlockAvgPriorityFeeStats();
        expect(result.total).toBe("1.0 Gwei");
        expect(result.list[0].avgPriorityFee).toBe("1.0 Gwei");
        expect(MockedScanner.prototype.getBlockAvgPriorityFeeStats).toHaveBeenCalled();
      });

      it("should return raw block average priority fee stats when returnRaw is true", async () => {
        MockedScanner.prototype.getBlockAvgPriorityFeeStats.mockResolvedValue(
          mockBlockAvgPriorityFeeStats
        );
        const result = await wrapper.getBlockAvgPriorityFeeStats({}, true);
        expect(result).toEqual(mockBlockAvgPriorityFeeStats);
        expect(MockedScanner.prototype.getBlockAvgPriorityFeeStats).toHaveBeenCalled();
      });

      it("should return formatted block transactions by type stats by default", async () => {
        MockedScanner.prototype.getBlockTxsByTypeStats.mockResolvedValue(mockBlockTxsByTypeStats);
        const result = await wrapper.getBlockTxsByTypeStats();
        expect(result.total).toBe(mockBlockTxsByTypeStats.total);
        expect(result.list[0].blockNumber).toBe(
          Number(mockBlockTxsByTypeStats.list[0].blockNumber)
        );
        if (result.list[0].txsInType) {
          expect(result.list[0].txsInType.legacy).toBe(100);
          expect(result.list[0].txsInType.cip2930).toBe(50);
          expect(result.list[0].txsInType.cip1559).toBe(25);
        }
      });

      it("should return raw block transactions by type stats when returnRaw is true", async () => {
        MockedScanner.prototype.getBlockTxsByTypeStats.mockResolvedValue(mockBlockTxsByTypeStats);
        const result = await wrapper.getBlockTxsByTypeStats(undefined, true);
        expect(result).toEqual(mockBlockTxsByTypeStats);
      });
    });

    describe("Top Stats Methods", () => {
      const mockTopGasResponse = {
        gasTotal: "1000000000",
        list: [
          { address: validAddress, gas: "500000000" },
          { address: "0x2234567890123456789012345678901234567890", gas: "500000000" },
        ],
      };

      const mockTopSendersResponse = {
        valueTotal: "2000000000",
        maxTime: "2024-02-07",
        list: [
          { address: validAddress, value: "1000000000" },
          { address: "0x2234567890123456789012345678901234567890", value: "1000000000" },
        ],
      };

      beforeEach(() => {
        MockedFormatter.formatGas.mockReturnValue("1.0 Gwei");
        MockedFormatter.formatNumber.mockReturnValue("50");
      });

      it("should return formatted top gas used stats by default", async () => {
        MockedScanner.prototype.getTopGasUsed.mockResolvedValue(mockTopGasResponse);
        const result = (await wrapper.getTopGasUsed("24h")) as typeof mockTopGasResponse;
        expect(result.gasTotal).toBe("1.0 Gwei");
        expect(result.list[0].gas).toBe("1.0 Gwei");
        expect(MockedScanner.prototype.getTopGasUsed).toHaveBeenCalledWith("24h");
      });

      it("should return raw top gas used stats when returnRaw is true", async () => {
        MockedScanner.prototype.getTopGasUsed.mockResolvedValue(mockTopGasResponse);
        const result = await wrapper.getTopGasUsed("24h", true);
        expect(result).toEqual(mockTopGasResponse);
        expect(MockedScanner.prototype.getTopGasUsed).toHaveBeenCalledWith("24h");
      });

      it("should return formatted top transaction senders by default", async () => {
        MockedScanner.prototype.getTopTransactionSenders.mockResolvedValue(mockTopSendersResponse);
        const result = (await wrapper.getTopTransactionSenders(
          "24h"
        )) as typeof mockTopSendersResponse;
        expect(result.valueTotal).toBe("50");
        expect(result.list[0].value).toBe("50");
        expect(MockedScanner.prototype.getTopTransactionSenders).toHaveBeenCalledWith("24h");
      });

      it("should return raw top transaction senders when returnRaw is true", async () => {
        MockedScanner.prototype.getTopTransactionSenders.mockResolvedValue(mockTopSendersResponse);
        const result = await wrapper.getTopTransactionSenders("24h", true);
        expect(result).toEqual(mockTopSendersResponse);
        expect(MockedScanner.prototype.getTopTransactionSenders).toHaveBeenCalledWith("24h");
      });
    });

    describe("Transaction Stats Methods", () => {
      it("should return formatted contract stats", async () => {
        MockedScanner.prototype.getContractStats.mockResolvedValue(mockBasicStats);
        const result = await wrapper.getContractStats();
        expect(result).toEqual({
          total: mockBasicStats.total,
          list: mockBasicStats.list.map((item) => ({
            statTime: MockedFormatter.formatTimestamp(item.statTime),
            count: MockedFormatter.formatNumber(item.count),
          })),
        });
        expect(MockedScanner.prototype.getContractStats).toHaveBeenCalled();
      });

      it("should return formatted transaction stats", async () => {
        MockedScanner.prototype.getTransactionStats.mockResolvedValue(mockBasicStats);
        const result = await wrapper.getTransactionStats();
        expect(result).toEqual({
          total: mockBasicStats.total,
          list: mockBasicStats.list.map((item) => ({
            statTime: MockedFormatter.formatTimestamp(item.statTime),
            count: MockedFormatter.formatNumber(item.count),
          })),
        });
        expect(MockedScanner.prototype.getTransactionStats).toHaveBeenCalled();
      });

      it("should return formatted CFX transfer stats", async () => {
        MockedScanner.prototype.getCfxTransferStats.mockResolvedValue(mockBasicStats);
        const result = await wrapper.getCfxTransferStats();
        expect(result).toEqual({
          total: mockBasicStats.total,
          list: mockBasicStats.list.map((item) => ({
            statTime: MockedFormatter.formatTimestamp(item.statTime),
            count: MockedFormatter.formatNumber(item.count),
          })),
        });
        expect(MockedScanner.prototype.getCfxTransferStats).toHaveBeenCalled();
      });

      it("should return formatted CFX transfer stats by default", async () => {
        MockedScanner.prototype.getCfxTransferStats.mockResolvedValue(mockBasicStats);
        const result = await wrapper.getCfxTransferStats();
        expect(result).toEqual({
          total: mockBasicStats.total,
          list: mockBasicStats.list.map((item) => ({
            statTime: MockedFormatter.formatTimestamp(item.statTime),
            count: MockedFormatter.formatNumber(item.count),
          })),
        });
        expect(MockedScanner.prototype.getCfxTransferStats).toHaveBeenCalled();
      });

      it("should return raw transaction stats when returnRaw is true", async () => {
        MockedScanner.prototype.getTransactionStats.mockResolvedValue(mockBasicStats);
        const result = await wrapper.getTransactionStats({}, true);
        expect(result).toEqual(mockBasicStats);
        expect(MockedScanner.prototype.getTransactionStats).toHaveBeenCalled();
      });

      it("should return formatted CFX transfer stats by default", async () => {
        MockedScanner.prototype.getCfxTransferStats.mockResolvedValue(mockBasicStats);
        const result = await wrapper.getCfxTransferStats();
        expect(result).toEqual({
          total: mockBasicStats.total,
          list: mockBasicStats.list.map((item) => ({
            statTime: MockedFormatter.formatTimestamp(item.statTime),
            count: MockedFormatter.formatNumber(item.count),
          })),
        });
        expect(MockedScanner.prototype.getCfxTransferStats).toHaveBeenCalled();
      });

      it("should return raw CFX transfer stats when returnRaw is true", async () => {
        MockedScanner.prototype.getCfxTransferStats.mockResolvedValue(mockBasicStats);
        const result = await wrapper.getCfxTransferStats({}, true);
        expect(result).toEqual(mockBasicStats);
        expect(MockedScanner.prototype.getCfxTransferStats).toHaveBeenCalled();
      });
    });

    describe("Other Stats Methods", () => {
      it("should return formatted TPS stats by default", async () => {
        MockedScanner.prototype.getTpsStats.mockResolvedValue(mockTpsStats);
        const result = await wrapper.getTpsStats();
        expect(result.total).toBe(mockTpsStats.total);
        expect(result.list[0].tps).toBe("0.5");
        expect(MockedScanner.prototype.getTpsStats).toHaveBeenCalled();
      });

      it("should return raw TPS stats when returnRaw is true", async () => {
        MockedScanner.prototype.getTpsStats.mockResolvedValue(mockTpsStats);
        const result = await wrapper.getTpsStats({}, true);
        expect(result).toEqual(mockTpsStats);
        expect(MockedScanner.prototype.getTpsStats).toHaveBeenCalled();
      });

      it("should return formatted top token transfers by default", async () => {
        MockedScanner.prototype.getTopTokenTransfers.mockResolvedValue(mockTopTokenTransfers);
        const result = await wrapper.getTopTokenTransfers("24h");
        expect(result.list[0].transferCntr).toBe("50");
        expect(MockedScanner.prototype.getTopTokenTransfers).toHaveBeenCalledWith("24h");
      });

      it("should return raw top token transfers when returnRaw is true", async () => {
        MockedScanner.prototype.getTopTokenTransfers.mockResolvedValue(mockTopTokenTransfers);
        const result = await wrapper.getTopTokenTransfers("24h", true);
        expect(result).toEqual(mockTopTokenTransfers);
        expect(MockedScanner.prototype.getTopTokenTransfers).toHaveBeenCalledWith("24h");
      });
    });

    describe("Top Token Stats Methods", () => {
      const mockTopTokenSendersResponse = {
        maxTime: "2024-02-07",
        list: [
          { address: validAddress, transferCntr: "100" },
          { address: "0x2234567890123456789012345678901234567890", transferCntr: "90" },
        ],
      };

      const mockTopTokenReceiversResponse = {
        maxTime: "2024-02-07",
        list: [
          { address: validAddress, transferCntr: "80" },
          { address: "0x2234567890123456789012345678901234567890", transferCntr: "70" },
        ],
      };

      const mockTopTokenParticipantsResponse = {
        maxTime: "2024-02-07",
        list: [
          { address: validAddress, transferCntr: "60" },
          { address: "0x2234567890123456789012345678901234567890", transferCntr: "50" },
        ],
      };

      beforeEach(() => {
        MockedFormatter.formatNumber.mockImplementation((value) => {
          if (value === "100") return "100";
          if (value === "90") return "90";
          if (value === "80") return "80";
          if (value === "70") return "70";
          if (value === "60") return "60";
          if (value === "50") return "50";
          return "0";
        });
      });

      it("should return formatted top token senders by default", async () => {
        MockedScanner.prototype.getTopTokenSenders.mockResolvedValue(mockTopTokenSendersResponse);
        const result = await wrapper.getTopTokenSenders("24h");
        expect(result.list[0].transferCntr).toBe("100");
        expect(result.list[1].transferCntr).toBe("90");
        expect(MockedScanner.prototype.getTopTokenSenders).toHaveBeenCalledWith("24h");
      });

      it("should return raw top token senders when returnRaw is true", async () => {
        MockedScanner.prototype.getTopTokenSenders.mockResolvedValue(mockTopTokenSendersResponse);
        const result = await wrapper.getTopTokenSenders("24h", true);
        expect(result).toEqual(mockTopTokenSendersResponse);
        expect(MockedScanner.prototype.getTopTokenSenders).toHaveBeenCalledWith("24h");
      });

      it("should return formatted top token receivers by default", async () => {
        MockedScanner.prototype.getTopTokenReceivers.mockResolvedValue(
          mockTopTokenReceiversResponse
        );
        const result = await wrapper.getTopTokenReceivers("24h");
        expect(result.list[0].transferCntr).toBe("80");
        expect(result.list[1].transferCntr).toBe("70");
        expect(MockedScanner.prototype.getTopTokenReceivers).toHaveBeenCalledWith("24h");
      });

      it("should return raw top token receivers when returnRaw is true", async () => {
        MockedScanner.prototype.getTopTokenReceivers.mockResolvedValue(
          mockTopTokenReceiversResponse
        );
        const result = await wrapper.getTopTokenReceivers("24h", true);
        expect(result).toEqual(mockTopTokenReceiversResponse);
        expect(MockedScanner.prototype.getTopTokenReceivers).toHaveBeenCalledWith("24h");
      });

      it("should return formatted top token participants by default", async () => {
        MockedScanner.prototype.getTopTokenParticipants.mockResolvedValue(
          mockTopTokenParticipantsResponse
        );
        const result = await wrapper.getTopTokenParticipants("24h");
        expect(result.list[0].transferCntr).toBe("60");
        expect(result.list[1].transferCntr).toBe("50");
        expect(MockedScanner.prototype.getTopTokenParticipants).toHaveBeenCalledWith("24h");
      });

      it("should return raw top token participants when returnRaw is true", async () => {
        MockedScanner.prototype.getTopTokenParticipants.mockResolvedValue(
          mockTopTokenParticipantsResponse
        );
        const result = await wrapper.getTopTokenParticipants("24h", true);
        expect(result).toEqual(mockTopTokenParticipantsResponse);
        expect(MockedScanner.prototype.getTopTokenParticipants).toHaveBeenCalledWith("24h");
      });
    });
  });
});
