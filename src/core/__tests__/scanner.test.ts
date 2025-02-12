import { ESpaceScanner } from "../scanner";
import { jest } from "@jest/globals";
import { StatsPeriod } from "../../types/params";

describe("ESpaceScanner", () => {
  let scanner: ESpaceScanner;
  const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;
  const validAddress = "0x1234567890123456789012345678901234567890";
  const invalidAddress = "0xinvalid";

  beforeEach(() => {
    jest.clearAllMocks();
    scanner = new ESpaceScanner();
    global.fetch = mockFetch;
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: "1", result: {} }),
      } as Response)
    );
  });

  describe("Contract Methods", () => {
    describe("getContractABI", () => {
      const mockABI = '[{"type":"function","name":"test"}]';

      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1", result: mockABI }),
          } as Response)
        );
      });

      it("should fetch and parse contract ABI", async () => {
        const result = await scanner.getContractABI(validAddress);
        expect(result).toEqual(JSON.parse(mockABI));
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/api?module=contract&action=getabi&address=${validAddress}`,
          { headers: {} }
        );
      });

      it("should throw error for invalid address", async () => {
        await expect(scanner.getContractABI(invalidAddress)).rejects.toThrow("Invalid address");
      });

      it("should handle missing ABI", async () => {
        mockFetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1", result: "" }),
          } as Response)
        );

        await expect(scanner.getContractABI(validAddress)).rejects.toThrow(
          `Contract ${validAddress} not verified or ABI not available`
        );
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
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1", result: [mockSourceCode] }),
          } as Response)
        );
      });

      it("should fetch contract source code", async () => {
        const result = await scanner.getContractSourceCode(validAddress);
        expect(result).toEqual(mockSourceCode);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/api?module=contract&action=getsourcecode&address=${validAddress}`,
          { headers: {} }
        );
      });

      it("should throw error for invalid address", async () => {
        await expect(scanner.getContractSourceCode(invalidAddress)).rejects.toThrow(
          "Invalid address"
        );
      });
    });
  });

  describe("Token Methods", () => {
    const mockTokens = [
      { address: validAddress, name: "Token1", symbol: "TK1", decimals: 18 },
      {
        address: "0x2234567890123456789012345678901234567890",
        name: "Token2",
        symbol: "TK2",
        decimals: 18,
      },
    ];

    describe("getAccountTokens", () => {
      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1", result: { list: mockTokens } }),
          } as Response)
        );
      });

      it("should fetch account tokens", async () => {
        const result = await scanner.getAccountTokens(validAddress);
        expect(result).toEqual(mockTokens);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/account/tokens?account=${validAddress}&tokenType=ERC20&skip=0&limit=10`,
          { headers: {} }
        );
      });

      it("should handle token type parameter", async () => {
        await scanner.getAccountTokens(validAddress, "ERC721");
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/account/tokens?account=${validAddress}&tokenType=ERC721&skip=0&limit=10`,
          { headers: {} }
        );
      });

      it("should handle pagination parameters", async () => {
        await scanner.getAccountTokens(validAddress, "ERC20", 10, 20);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/account/tokens?account=${validAddress}&tokenType=ERC20&skip=10&limit=20`,
          { headers: {} }
        );
      });
    });

    describe("getTokenInfos", () => {
      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1", result: { list: mockTokens } }),
          } as Response)
        );
      });

      it("should fetch token infos", async () => {
        const addresses = [validAddress, "0x2234567890123456789012345678901234567890"];
        const result = await scanner.getTokenInfos(addresses);
        expect(result).toEqual(mockTokens);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/token/tokeninfos?contracts=${addresses.join(",")}`,
          { headers: {} }
        );
      });

      it("should throw error for invalid addresses", async () => {
        await expect(scanner.getTokenInfos([invalidAddress])).rejects.toThrow(
          "Invalid contract addresses provided"
        );
      });
    });
  });

  describe("Statistics Methods", () => {
    const mockStatsResponse = {
      total: 100,
      list: [
        { statTime: "2024-02-07", count: 50 },
        { statTime: "2024-02-06", count: 40 },
      ],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockStatsResponse }),
        } as Response)
      );
    });

    describe("Basic Stats Methods", () => {
      it("should fetch active account stats", async () => {
        const result = await scanner.getActiveAccountStats();
        expect(result).toEqual(mockStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/account\/active\?/
          ),
          { headers: {} }
        );
      });

      it("should fetch CFX holder stats", async () => {
        const result = await scanner.getCfxHolderStats();
        expect(result).toEqual(mockStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/account\/cfx\/holder\?/
          ),
          { headers: {} }
        );
      });

      it("should handle stats parameters", async () => {
        const params = {
          minTimestamp: 1000,
          maxTimestamp: 2000,
          sort: "ASC" as const,
          skip: 10,
          limit: 20,
        };
        await scanner.getActiveAccountStats(params);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/statistics/account/active?minTimestamp=1000&maxTimestamp=2000&sort=ASC&skip=10&limit=20`,
          { headers: {} }
        );
      });
    });

    describe("Top Stats Methods", () => {
      const mockTopStatsResponse = {
        maxTime: "2024-02-07",
        list: [{ address: validAddress, value: "1000" }],
      };

      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1", result: mockTopStatsResponse }),
          } as Response)
        );
      });

      it("should fetch top gas used stats", async () => {
        const result = await scanner.getTopGasUsed("24h");
        expect(result).toEqual(mockTopStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/statistics/top/gas/used?spanType=24h`,
          { headers: {} }
        );
      });

      it("should handle different span types", async () => {
        const spanType: StatsPeriod = "24h";
        await scanner.getTopGasUsed(spanType);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/statistics/top/gas/used?spanType=24h`,
          { headers: {} }
        );
      });

      it("should fetch top transaction receivers", async () => {
        const result = await scanner.getTopTransactionReceivers("24h");
        expect(result).toEqual(mockTopStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/statistics/top/transaction/receiver?spanType=24h`,
          { headers: {} }
        );
      });

      it("should fetch top CFX receivers", async () => {
        const result = await scanner.getTopCfxReceivers("24h");
        expect(result).toEqual(mockTopStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/statistics/top/cfx/receiver?spanType=24h`,
          { headers: {} }
        );
      });

      it("should fetch top token senders", async () => {
        const result = await scanner.getTopTokenSenders("24h");
        expect(result).toEqual(mockTopStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/statistics/top/token/sender?spanType=24h`,
          { headers: {} }
        );
      });

      it("should fetch top token receivers", async () => {
        const result = await scanner.getTopTokenReceivers("24h");
        expect(result).toEqual(mockTopStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/statistics/top/token/receiver?spanType=24h`,
          { headers: {} }
        );
      });

      it("should fetch top token participants", async () => {
        const result = await scanner.getTopTokenParticipants("24h");
        expect(result).toEqual(mockTopStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/statistics/top/token/participant?spanType=24h`,
          { headers: {} }
        );
      });
    });

    describe("Token Stats Methods", () => {
      it("should fetch token holder stats", async () => {
        const result = await scanner.getTokenHolderStats(validAddress);
        expect(result).toEqual(mockStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(/^https:\/\/evmapi\.confluxscan\.io\/statistics\/token\/holder\?/),
          { headers: {} }
        );
      });

      it("should throw error for invalid contract address", async () => {
        await expect(scanner.getTokenHolderStats(invalidAddress)).rejects.toThrow(
          "Invalid contract address"
        );
      });

      it("should fetch token unique receiver stats", async () => {
        const result = await scanner.getTokenUniqueReceiverStats(validAddress);
        expect(result).toEqual(mockStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/token\/unique\/receiver\?/
          ),
          { headers: {} }
        );
      });

      it("should fetch token unique participant stats", async () => {
        const result = await scanner.getTokenUniqueParticipantStats(validAddress);
        expect(result).toEqual(mockStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/token\/unique\/participant\?/
          ),
          { headers: {} }
        );
      });
    });

    describe("Block Stats Methods", () => {
      const mockBlockStats = {
        total: 100,
        list: [
          { blockNumber: "1234567", timestamp: "1612345678", baseFee: "1000000000" },
          { blockNumber: "1234566", timestamp: "1612345677", baseFee: "1000000000" },
        ],
      };

      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1", result: mockBlockStats }),
          } as Response)
        );
      });

      describe("getBlockBaseFeeStats", () => {
        it("should fetch block base fee statistics", async () => {
          const result = await scanner.getBlockBaseFeeStats();
          expect(result).toEqual(mockBlockStats);
          expect(mockFetch.mock.calls[0][0]).toMatch(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/block\/base-fee\?/
          );
        });

        it("should handle custom parameters", async () => {
          const params = {
            minTimestamp: 1000,
            maxTimestamp: 2000,
            sort: "ASC" as const,
            skip: 10,
            limit: 20,
          };
          await scanner.getBlockBaseFeeStats(params);
          expect(mockFetch).toHaveBeenCalledWith(
            "https://evmapi.confluxscan.io/statistics/block/base-fee?minTimestamp=1000&maxTimestamp=2000&sort=ASC&skip=10&limit=20",
            { headers: {} }
          );
        });
      });

      describe("getBlockGasUsedStats", () => {
        it("should fetch block gas used statistics", async () => {
          const result = await scanner.getBlockGasUsedStats();
          expect(result).toEqual(mockBlockStats);
          expect(mockFetch.mock.calls[0][0]).toMatch(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/block\/gas-used\?/
          );
        });
      });

      describe("getBlockAvgPriorityFeeStats", () => {
        it("should fetch block average priority fee statistics", async () => {
          const result = await scanner.getBlockAvgPriorityFeeStats();
          expect(result).toEqual(mockBlockStats);
          expect(mockFetch.mock.calls[0][0]).toMatch(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/block\/avg-priority-fee\?/
          );
        });
      });

      describe("getBlockTxsByTypeStats", () => {
        it("should fetch block transactions by type statistics", async () => {
          const result = await scanner.getBlockTxsByTypeStats();
          expect(result).toEqual(mockBlockStats);
          expect(mockFetch.mock.calls[0][0]).toMatch(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/block\/txs-by-type\?/
          );
        });
      });

      describe("Error Handling", () => {
        it("should handle missing data in API response for block base fee stats", async () => {
          mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ status: "1" }),
            } as Response)
          );
          await expect(scanner.getBlockBaseFeeStats()).rejects.toThrow("No result returned");
        });

        it("should handle missing data in API response for block gas used stats", async () => {
          mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ status: "1" }),
            } as Response)
          );
          await expect(scanner.getBlockGasUsedStats()).rejects.toThrow("No result returned");
        });

        it("should handle missing data in API response for block avg priority fee stats", async () => {
          mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ status: "1" }),
            } as Response)
          );
          await expect(scanner.getBlockAvgPriorityFeeStats()).rejects.toThrow("No result returned");
        });

        it("should handle missing data in API response for block txs by type stats", async () => {
          mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ status: "1" }),
            } as Response)
          );
          await expect(scanner.getBlockTxsByTypeStats()).rejects.toThrow("No result returned");
        });
      });
    });

    describe("Transaction Stats Methods", () => {
      const mockTxStats = {
        total: 100,
        list: [
          { statTime: "2024-02-07", count: 50 },
          { statTime: "2024-02-06", count: 40 },
        ],
      };

      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1", result: mockTxStats }),
          } as Response)
        );
      });

      describe("getContractStats", () => {
        it("should fetch contract statistics", async () => {
          const result = await scanner.getContractStats();
          expect(result).toEqual(mockTxStats);
          expect(mockFetch.mock.calls[0][0]).toMatch(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/contract\?/
          );
        });

        it("should handle custom parameters", async () => {
          const params = {
            minTimestamp: 1000,
            maxTimestamp: 2000,
            sort: "ASC" as const,
            skip: 10,
            limit: 20,
          };
          await scanner.getContractStats(params);
          expect(mockFetch).toHaveBeenCalledWith(
            "https://evmapi.confluxscan.io/statistics/contract?minTimestamp=1000&maxTimestamp=2000&sort=ASC&skip=10&limit=20",
            { headers: {} }
          );
        });
      });

      describe("getTransactionStats", () => {
        it("should fetch transaction statistics", async () => {
          const result = await scanner.getTransactionStats();
          expect(result).toEqual(mockTxStats);
          expect(mockFetch.mock.calls[0][0]).toMatch(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/transaction\?/
          );
        });
      });

      describe("getCfxTransferStats", () => {
        it("should fetch CFX transfer statistics", async () => {
          const result = await scanner.getCfxTransferStats();
          expect(result).toEqual(mockTxStats);
          expect(mockFetch.mock.calls[0][0]).toMatch(
            /^https:\/\/evmapi\.confluxscan\.io\/statistics\/cfx\/transfer\?/
          );
        });
      });

      describe("Error Handling", () => {
        it("should handle missing data in API response for contract stats", async () => {
          mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ status: "1" }),
            } as Response)
          );
          await expect(scanner.getContractStats()).rejects.toThrow("No result returned");
        });

        it("should handle missing data in API response for transaction stats", async () => {
          mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ status: "1" }),
            } as Response)
          );
          await expect(scanner.getTransactionStats()).rejects.toThrow("No result returned");
        });

        it("should handle missing data in API response for CFX transfer stats", async () => {
          mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ status: "1" }),
            } as Response)
          );
          await expect(scanner.getCfxTransferStats()).rejects.toThrow("No result returned");
        });
      });
    });

    describe("Error Handling", () => {
      it("should handle API error response", async () => {
        mockFetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: 0, message: "API Error" }),
          } as Response)
        );

        await expect(scanner.getActiveAccountStats()).rejects.toThrow(
          "No result returned for /statistics/account/active"
        );
      });

      it("should handle missing result", async () => {
        mockFetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1" }),
          } as Response)
        );

        await expect(scanner.getActiveAccountStats()).rejects.toThrow(
          "No result returned for /statistics/account/active"
        );
      });
    });
  });

  describe("Additional Statistics Methods", () => {
    const mockBasicStatsResponse = {
      total: 100,
      list: [
        { statTime: "2024-02-07", count: 50 },
        { statTime: "2024-02-06", count: 40 },
      ],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockBasicStatsResponse }),
        } as Response)
      );
    });

    describe("getSupplyStats", () => {
      it("should fetch supply statistics with default parameters", async () => {
        const result = await scanner.getSupplyStats();
        expect(result).toEqual(mockBasicStatsResponse);
        expect(mockFetch.mock.calls[0][0]).toMatch(
          /^https:\/\/evmapi\.confluxscan\.io\/statistics\/supply\?/
        );
      });

      it("should handle custom statistics parameters", async () => {
        const params = {
          minTimestamp: 1000,
          maxTimestamp: 2000,
          sort: "ASC" as const,
          skip: 10,
          limit: 20,
        };
        await scanner.getSupplyStats(params);
        expect(mockFetch).toHaveBeenCalledWith(
          "https://evmapi.confluxscan.io/statistics/supply?minTimestamp=1000&maxTimestamp=2000&sort=ASC&skip=10&limit=20",
          { headers: {} }
        );
      });
    });

    describe("getMiningStats", () => {
      it("should fetch mining statistics with default parameters", async () => {
        const result = await scanner.getMiningStats();
        expect(result).toEqual(mockBasicStatsResponse);
        expect(mockFetch.mock.calls[0][0]).toMatch(
          /^https:\/\/evmapi\.confluxscan\.io\/statistics\/mining\?/
        );
      });
    });

    describe("getActiveAccountOverallStats", () => {
      it("should fetch overall active account statistics with default parameters", async () => {
        const result = await scanner.getActiveAccountOverallStats();
        expect(result).toEqual(mockBasicStatsResponse);
        expect(mockFetch.mock.calls[0][0]).toMatch(
          /^https:\/\/evmapi\.confluxscan\.io\/statistics\/account\/active\/overall\?/
        );
      });
    });

    describe("getTokenTransferStats", () => {
      it("should fetch token transfer statistics with default parameters", async () => {
        const result = await scanner.getTokenTransferStats();
        expect(result).toEqual(mockBasicStatsResponse);
        expect(mockFetch.mock.calls[0][0]).toMatch(
          /^https:\/\/evmapi\.confluxscan\.io\/statistics\/token\/transfer\?/
        );
      });
    });

    describe("getTopMiner", () => {
      const mockTopStatsResponse = {
        maxTime: "2024-02-07",
        list: [{ address: validAddress, value: "1000" }],
      };

      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1", result: mockTopStatsResponse }),
          } as Response)
        );
      });

      it("should fetch top miner statistics", async () => {
        const result = await scanner.getTopMiner("24h");
        expect(result).toEqual(mockTopStatsResponse);
        expect(mockFetch).toHaveBeenCalledWith(
          "https://evmapi.confluxscan.io/statistics/top/miner?spanType=24h",
          { headers: {} }
        );
      });

      it("should handle different span types", async () => {
        await scanner.getTopMiner("7d");
        expect(mockFetch).toHaveBeenCalledWith(
          "https://evmapi.confluxscan.io/statistics/top/miner?spanType=7d",
          { headers: {} }
        );
      });
    });

    describe("Error Handling", () => {
      it("should handle missing data in API response for supply stats", async () => {
        mockFetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1" }),
          } as Response)
        );
        await expect(scanner.getSupplyStats()).rejects.toThrow("No result returned");
      });

      it("should handle missing data in API response for mining stats", async () => {
        mockFetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1" }),
          } as Response)
        );
        await expect(scanner.getMiningStats()).rejects.toThrow("No result returned");
      });

      it("should handle missing data in API response for active account overall stats", async () => {
        mockFetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1" }),
          } as Response)
        );
        await expect(scanner.getActiveAccountOverallStats()).rejects.toThrow("No result returned");
      });

      it("should handle missing data in API response for token transfer stats", async () => {
        mockFetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1" }),
          } as Response)
        );
        await expect(scanner.getTokenTransferStats()).rejects.toThrow("No result returned");
      });

      it("should handle missing data in API response for top miner stats", async () => {
        mockFetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ status: "1" }),
          } as Response)
        );
        await expect(scanner.getTopMiner("24h")).rejects.toThrow("No result returned");
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid address for contract ABI", async () => {
      await expect(scanner.getContractABI(invalidAddress)).rejects.toThrow("Invalid address");
    });

    it("should handle invalid address for contract source code", async () => {
      await expect(scanner.getContractSourceCode(invalidAddress)).rejects.toThrow(
        "Invalid address"
      );
    });

    it("should handle invalid address for account tokens", async () => {
      await expect(scanner.getAccountTokens(invalidAddress)).rejects.toThrow("Invalid address");
    });

    it("should handle API errors for active account stats", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: 0, message: "API Error" }),
        } as Response)
      );
      await expect(scanner.getActiveAccountStats()).rejects.toThrow(
        "No result returned for /statistics/account/active"
      );
    });

    it("should handle missing data in API response for contract stats", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );

      await expect(scanner.getContractStats()).rejects.toThrow("No result returned");
    });

    it("should handle missing data in API response for transaction stats", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );

      await expect(scanner.getTransactionStats()).rejects.toThrow("No result returned");
    });

    it("should handle missing data in API response for CFX transfer stats", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );

      await expect(scanner.getCfxTransferStats()).rejects.toThrow("No result returned");
    });

    it("should handle missing data in API response for token holder stats", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );

      await expect(scanner.getTokenHolderStats(validAddress)).rejects.toThrow("No result returned");
    });

    it("should handle missing data in API response for token unique sender stats", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );

      await expect(scanner.getTokenUniqueSenderStats(validAddress)).rejects.toThrow(
        "No result returned"
      );
    });

    it("should handle missing data in API response for token unique receiver stats", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );

      await expect(scanner.getTokenUniqueReceiverStats(validAddress)).rejects.toThrow(
        "No result returned"
      );
    });

    it("should handle missing data in API response for token unique participant stats", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );

      await expect(scanner.getTokenUniqueParticipantStats(validAddress)).rejects.toThrow(
        "No result returned"
      );
    });

    it("should handle missing data in API response for top token transfers", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );
      await expect(scanner.getTopTokenTransfers("24h")).rejects.toThrow("No result returned");
    });

    it("should handle missing data in API response for top token senders", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );
      await expect(scanner.getTopTokenSenders("24h")).rejects.toThrow("No result returned");
    });

    it("should handle missing data in API response for top token receivers", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );
      await expect(scanner.getTopTokenReceivers("24h")).rejects.toThrow("No result returned");
    });

    it("should handle missing data in API response for top token participants", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1" }),
        } as Response)
      );
      await expect(scanner.getTopTokenParticipants("24h")).rejects.toThrow("No result returned");
    });
  });

  describe("NFT Methods", () => {
    const mockNFTBalance = {
      contract: validAddress,
      tokenId: "1",
      amount: "1",
      tokenUri: "https://example.com/token/1",
      metadata: {
        name: "Test NFT",
        description: "Test NFT Description",
        image: "https://example.com/image/1",
      },
    };

    const mockNFTToken = {
      contract: validAddress,
      tokenId: "1",
      owner: validAddress,
      tokenUri: "https://example.com/token/1",
      metadata: {
        name: "Test NFT",
        description: "Test NFT Description",
        image: "https://example.com/image/1",
      },
    };

    const mockNFTPreview = {
      contract: validAddress,
      tokenId: "1",
      tokenUri: "https://example.com/token/1",
      metadata: {
        name: "Test NFT",
        description: "Test NFT Description",
        image: "https://example.com/image/1",
      },
    };

    const mockNFTFungibleToken = {
      contract: validAddress,
      name: "Test Token",
      symbol: "TEST",
      decimals: 18,
      totalSupply: "1000000000000000000",
    };

    const mockNFTOwner = {
      address: validAddress,
      quantity: "1",
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              status: "1",
              result: {
                total: 1,
                list: [mockNFTBalance],
              },
            }),
        } as Response)
      );
    });

    describe("getNFTBalances", () => {
      it("should fetch NFT balances for an address", async () => {
        const result = await scanner.getNFTBalances(validAddress);
        expect(result).toEqual({ total: 1, list: [mockNFTBalance] });
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/nft/balances?account=${validAddress}&skip=0&limit=10`,
          { headers: {} }
        );
      });

      it("should handle pagination parameters", async () => {
        await scanner.getNFTBalances(validAddress, 10, 20);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/nft/balances?account=${validAddress}&skip=10&limit=20`,
          { headers: {} }
        );
      });

      it("should throw error for invalid address", async () => {
        await expect(scanner.getNFTBalances(invalidAddress)).rejects.toThrow("Invalid address");
      });
    });

    describe("getNFTTokens", () => {
      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                status: "1",
                result: {
                  total: 1,
                  list: [mockNFTToken],
                },
              }),
          } as Response)
        );
      });

      it("should fetch NFT tokens for a contract", async () => {
        const result = await scanner.getNFTTokens(validAddress);
        expect(result).toEqual({ total: 1, list: [mockNFTToken] });
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/nft/tokens?contract=${validAddress}&skip=0&limit=10`,
          { headers: {} }
        );
      });

      it("should throw error for invalid contract address", async () => {
        await expect(scanner.getNFTTokens(invalidAddress)).rejects.toThrow(
          "Invalid contract address"
        );
      });
    });

    describe("getNFTPreview", () => {
      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                status: "1",
                result: {
                  total: 1,
                  list: [mockNFTPreview],
                },
              }),
          } as Response)
        );
      });

      it("should fetch NFT preview data", async () => {
        const result = await scanner.getNFTPreview(validAddress, "1");
        expect(result).toEqual({ total: 1, list: [mockNFTPreview] });
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/nft/preview?contract=${validAddress}&tokenId=1`,
          { headers: {} }
        );
      });

      it("should throw error for invalid contract address", async () => {
        await expect(scanner.getNFTPreview(invalidAddress, "1")).rejects.toThrow(
          "Invalid contract address"
        );
      });
    });

    describe("getNFTFungibleTokens", () => {
      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                status: "1",
                result: {
                  total: 1,
                  list: [mockNFTFungibleToken],
                },
              }),
          } as Response)
        );
      });

      it("should fetch NFT fungible tokens for a contract", async () => {
        const result = await scanner.getNFTFungibleTokens(validAddress);
        expect(result).toEqual({ total: 1, list: [mockNFTFungibleToken] });
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/nft/fungible-tokens?contract=${validAddress}&skip=0&limit=10`,
          { headers: {} }
        );
      });

      it("should throw error for invalid contract address", async () => {
        await expect(scanner.getNFTFungibleTokens(invalidAddress)).rejects.toThrow(
          "Invalid contract address"
        );
      });
    });

    describe("getNFTOwners", () => {
      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                status: "1",
                result: {
                  total: 1,
                  list: [mockNFTOwner],
                },
              }),
          } as Response)
        );
      });

      it("should fetch NFT owners for a token", async () => {
        const result = await scanner.getNFTOwners(validAddress, "1");
        expect(result).toEqual({ total: 1, list: [mockNFTOwner] });
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/nft/owners?contract=${validAddress}&tokenId=1&skip=0&limit=10`,
          { headers: {} }
        );
      });

      it("should throw error for invalid contract address", async () => {
        await expect(scanner.getNFTOwners(invalidAddress, "1")).rejects.toThrow(
          "Invalid contract address"
        );
      });
    });
  });

  describe("Decode Methods", () => {
    const mockDecodedMethod = {
      name: "transfer",
      params: [
        { name: "to", type: "address", value: validAddress },
        { name: "value", type: "uint256", value: "1000000000000000000" },
      ],
    };

    const mockDecodedMethodRaw = {
      methodId: "0xa9059cbb",
      methodName: "transfer",
      params: [validAddress, "1000000000000000000"],
    };

    describe("decodeMethod", () => {
      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                status: "1",
                result: mockDecodedMethod,
              }),
          } as Response)
        );
      });

      it("should decode method data", async () => {
        const data = "0xa9059cbb000000000000000000000000...";
        const result = await scanner.decodeMethod(data);
        expect(result).toEqual(mockDecodedMethod);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/util/decode/method?data=${data}`,
          { headers: {} }
        );
      });

      it("should handle contract address parameter", async () => {
        const data = "0xa9059cbb000000000000000000000000...";
        await scanner.decodeMethod(data, validAddress);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/util/decode/method?data=${data}&contract=${validAddress}`,
          { headers: {} }
        );
      });

      it("should throw error for missing data", async () => {
        await expect(scanner.decodeMethod("")).rejects.toThrow("Method data is required");
      });
    });

    describe("decodeMethodRaw", () => {
      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                status: "1",
                result: mockDecodedMethodRaw,
              }),
          } as Response)
        );
      });

      it("should decode method data in raw format", async () => {
        const data = "0xa9059cbb000000000000000000000000...";
        const result = await scanner.decodeMethodRaw(data);
        expect(result).toEqual(mockDecodedMethodRaw);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/util/decode/method/raw?data=${data}`,
          { headers: {} }
        );
      });

      it("should throw error for missing data", async () => {
        await expect(scanner.decodeMethodRaw("")).rejects.toThrow("Method data is required");
      });
    });
  });

  describe("Token Transfer Methods", () => {
    const mockTokenTransfer = {
      blockNumber: "1234567",
      timeStamp: "1612345678",
      hash: "0xabcdef1234567890",
      nonce: "1",
      blockHash: "0x1234567890abcdef",
      from: validAddress,
      contractAddress: validAddress,
      to: "0x3456789012345678901234567890123456789012",
      value: "1000000000000000000",
      tokenName: "Test Token",
      tokenSymbol: "TEST",
      tokenDecimal: "18",
      transactionIndex: "1",
      gas: "21000",
      gasPrice: "1000000000",
      gasUsed: "21000",
      cumulativeGasUsed: "21000",
      input: "0x",
      confirmations: "100",
    };

    const mockNFTTransfer = {
      ...mockTokenTransfer,
      tokenID: "1",
    };

    describe("getTokenTransfers", () => {
      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                status: "1",
                result: [mockTokenTransfer],
              }),
          } as Response)
        );
      });

      it("should fetch token transfers for an address", async () => {
        const result = await scanner.getTokenTransfers({ address: validAddress });
        expect(result).toEqual([mockTokenTransfer]);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/api?module=account&action=tokentx&address=${validAddress}&page=1&offset=100&sort=desc`,
          { headers: {} }
        );
      });

      it("should handle pagination and sorting parameters", async () => {
        await scanner.getTokenTransfers({
          address: validAddress,
          page: 2,
          offset: 50,
          sort: "asc",
        });
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/api?module=account&action=tokentx&address=${validAddress}&page=2&offset=50&sort=asc`,
          { headers: {} }
        );
      });

      it("should handle block range parameters", async () => {
        await scanner.getTokenTransfers({
          address: validAddress,
          startBlock: 1000000,
          endBlock: 2000000,
        });
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/api?module=account&action=tokentx&address=${validAddress}&startblock=1000000&endblock=2000000&page=1&offset=100&sort=desc`,
          { headers: {} }
        );
      });

      it("should throw error for invalid address", async () => {
        await expect(scanner.getTokenTransfers({ address: invalidAddress })).rejects.toThrow(
          "Invalid address"
        );
      });
    });

    describe("getNFTTransfers", () => {
      beforeEach(() => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                status: "1",
                result: [mockNFTTransfer],
              }),
          } as Response)
        );
      });

      it("should fetch NFT transfers for an address", async () => {
        const result = await scanner.getNFTTransfers({ address: validAddress });
        expect(result).toEqual([mockNFTTransfer]);
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/api?module=account&action=tokennfttx&address=${validAddress}&page=1&offset=100&sort=desc`,
          { headers: {} }
        );
      });

      it("should handle pagination and sorting parameters", async () => {
        await scanner.getNFTTransfers({
          address: validAddress,
          page: 2,
          offset: 50,
          sort: "asc",
        });
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/api?module=account&action=tokennfttx&address=${validAddress}&page=2&offset=50&sort=asc`,
          { headers: {} }
        );
      });

      it("should handle block range parameters", async () => {
        await scanner.getNFTTransfers({
          address: validAddress,
          startBlock: 1000000,
          endBlock: 2000000,
        });
        expect(mockFetch).toHaveBeenCalledWith(
          `https://evmapi.confluxscan.io/api?module=account&action=tokennfttx&address=${validAddress}&startblock=1000000&endblock=2000000&page=1&offset=100&sort=desc`,
          { headers: {} }
        );
      });

      it("should throw error for invalid address", async () => {
        await expect(scanner.getNFTTransfers({ address: invalidAddress })).rejects.toThrow(
          "Invalid address"
        );
      });
    });
  });
});
