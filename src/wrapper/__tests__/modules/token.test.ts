import { TokenWrapper } from "../../modules/token";
import { ESpaceScanner } from "../../../core";
import { ResponseFormatter } from "../../../formatters";
import { jest } from "@jest/globals";
import { TokenData } from "../../../types";

jest.mock("../../../core/scanner");
jest.mock("../../../formatters/responses", () => ({
  ResponseFormatter: {
    formatNumber: jest.fn().mockReturnValue("1"),
    formatUnit: jest.fn().mockReturnValue("1.0"),
  },
}));

describe("TokenWrapper", () => {
  let wrapper: TokenWrapper;
  let mockScanner: jest.Mocked<ESpaceScanner>;
  const validAddress = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock scanner instance
    mockScanner = {
      token: {
        getTokenInfos: jest.fn(),
        getTokenBalance: jest.fn(),
        getTokenSupply: jest.fn(),
        getTokenSupplyHistory: jest.fn(),
        getAccountTokens: jest.fn(),
      },
      account: {
        getTokenTransfers: jest.fn(),
      },
    } as unknown as jest.Mocked<ESpaceScanner>;

    // Mock the ESpaceScanner constructor
    (ESpaceScanner as jest.MockedClass<typeof ESpaceScanner>).mockImplementation(() => mockScanner);

    wrapper = new TokenWrapper({});
  });

  describe("getTokenInfos", () => {
    const mockTokenData: TokenData[] = [
      {
        contract: validAddress,
        name: "Test Token",
        symbol: "TEST",
        decimals: 18,
        totalSupply: "1000000000000000000",
        priceInUSDT: "1.0",
      },
      {
        contract: validAddress,
        name: "Test Token 2",
        symbol: "TEST2",
        decimals: 18,
      },
    ];

    beforeEach(() => {
      mockScanner.token.getTokenInfos.mockResolvedValue(mockTokenData);
    });

    it("should return formatted token info", async () => {
      const result = await wrapper.getTokenInfos([validAddress]);
      expect(result).toEqual([
        {
          ...mockTokenData[0],
          totalSupply: "1",
          priceInUSDT: "$1.0",
        },
        {
          ...mockTokenData[1],
          totalSupply: "0",
          priceInUSDT: "$0",
        },
      ]);
      expect(mockScanner.token.getTokenInfos).toHaveBeenCalledWith([validAddress]);
      expect(ResponseFormatter.formatNumber).toHaveBeenCalledWith("1000000000000000000");
    });

    it("should return raw response when returnRaw is true", async () => {
      const result = await wrapper.getTokenInfos([validAddress], true);
      expect(result).toEqual(mockTokenData);
      expect(mockScanner.token.getTokenInfos).toHaveBeenCalledWith([validAddress]);
      expect(ResponseFormatter.formatNumber).not.toHaveBeenCalled();
    });
  });

  describe("getTokenBalance", () => {
    const mockBalance = "1000000000000000000";

    beforeEach(() => {
      mockScanner.token.getTokenBalance.mockResolvedValue(mockBalance);
    });

    it("should return formatted token balance", async () => {
      const result = await wrapper.getTokenBalance(validAddress, validAddress);
      expect(result).toBe("1.0");
      expect(mockScanner.token.getTokenBalance).toHaveBeenCalledWith(validAddress, validAddress);
      expect(ResponseFormatter.formatUnit).toHaveBeenCalledWith(mockBalance, 18);
    });

    it("should handle custom decimals", async () => {
      const decimals = 6;
      const result = await wrapper.getTokenBalance(validAddress, validAddress, decimals);
      expect(result).toBe("1.0");
      expect(mockScanner.token.getTokenBalance).toHaveBeenCalledWith(validAddress, validAddress);
      expect(ResponseFormatter.formatUnit).toHaveBeenCalledWith(mockBalance, decimals);
    });

    it("should return raw response when returnRaw is true", async () => {
      const result = await wrapper.getTokenBalance(validAddress, validAddress, 18, true);
      expect(result).toBe(mockBalance);
      expect(mockScanner.token.getTokenBalance).toHaveBeenCalledWith(validAddress, validAddress);
      expect(ResponseFormatter.formatUnit).not.toHaveBeenCalled();
    });
  });

  describe("getTokenSupply", () => {
    const mockSupply = "1000000000000000000";

    beforeEach(() => {
      mockScanner.token.getTokenSupply.mockResolvedValue(mockSupply);
    });

    it("should return formatted token supply", async () => {
      const result = await wrapper.getTokenSupply(validAddress);
      expect(result).toBe("1.0");
      expect(mockScanner.token.getTokenSupply).toHaveBeenCalledWith(validAddress);
      expect(ResponseFormatter.formatUnit).toHaveBeenCalledWith(mockSupply, 18);
    });

    it("should handle custom decimals", async () => {
      const decimals = 6;
      const result = await wrapper.getTokenSupply(validAddress, decimals);
      expect(result).toBe("1.0");
      expect(mockScanner.token.getTokenSupply).toHaveBeenCalledWith(validAddress);
      expect(ResponseFormatter.formatUnit).toHaveBeenCalledWith(mockSupply, decimals);
    });

    it("should return raw response when returnRaw is true", async () => {
      const result = await wrapper.getTokenSupply(validAddress, 18, true);
      expect(result).toBe(mockSupply);
      expect(mockScanner.token.getTokenSupply).toHaveBeenCalledWith(validAddress);
      expect(ResponseFormatter.formatUnit).not.toHaveBeenCalled();
    });
  });

  describe("getTokenSupplyHistory", () => {
    const mockSupply = "1000000000000000000";
    const blockNumber = 1000000;

    beforeEach(() => {
      mockScanner.token.getTokenSupplyHistory.mockResolvedValue(mockSupply);
    });

    it("should return formatted historical token supply", async () => {
      const result = await wrapper.getTokenSupplyHistory(validAddress, blockNumber);
      expect(result).toBe("1.0");
      expect(mockScanner.token.getTokenSupplyHistory).toHaveBeenCalledWith(
        validAddress,
        blockNumber
      );
      expect(ResponseFormatter.formatUnit).toHaveBeenCalledWith(mockSupply, 18);
    });

    it("should handle custom decimals", async () => {
      const decimals = 6;
      const result = await wrapper.getTokenSupplyHistory(validAddress, blockNumber, decimals);
      expect(result).toBe("1.0");
      expect(mockScanner.token.getTokenSupplyHistory).toHaveBeenCalledWith(
        validAddress,
        blockNumber
      );
      expect(ResponseFormatter.formatUnit).toHaveBeenCalledWith(mockSupply, decimals);
    });

    it("should return raw response when returnRaw is true", async () => {
      const result = await wrapper.getTokenSupplyHistory(validAddress, blockNumber, 18, true);
      expect(result).toBe(mockSupply);
      expect(mockScanner.token.getTokenSupplyHistory).toHaveBeenCalledWith(
        validAddress,
        blockNumber
      );
      expect(ResponseFormatter.formatUnit).not.toHaveBeenCalled();
    });
  });

  describe("getAccountTokens", () => {
    const mockTokenData: TokenData[] = [
      {
        contract: validAddress,
        name: "Test Token",
        symbol: "TEST",
        decimals: 18,
        amount: "1000000000000000000",
        priceInUSDT: "1.0",
      },
      {
        contract: validAddress,
        name: "Test Token 2",
        symbol: "TEST2",
        decimals: 18,
      },
    ];

    beforeEach(() => {
      mockScanner.token.getAccountTokens.mockResolvedValue(mockTokenData);
    });

    it("should return formatted account tokens", async () => {
      const result = await wrapper.getAccountTokens(validAddress);
      expect(result).toEqual({
        list: [
          {
            ...mockTokenData[0],
            amount: "1.0",
            priceInUSDT: "$1.0",
          },
          {
            ...mockTokenData[1],
            amount: "0",
            priceInUSDT: "$0",
          },
        ],
        total: 2,
      });
      expect(mockScanner.token.getAccountTokens).toHaveBeenCalledWith(validAddress, "ERC20", 0, 10);
      expect(ResponseFormatter.formatUnit).toHaveBeenCalledWith("1000000000000000000", 18);
    });

    it("should handle custom parameters", async () => {
      const tokenType = "ERC721";
      const skip = 20;
      const limit = 50;

      await wrapper.getAccountTokens(validAddress, tokenType, skip, limit);
      expect(mockScanner.token.getAccountTokens).toHaveBeenCalledWith(
        validAddress,
        tokenType,
        skip,
        limit
      );
    });

    it("should return raw response when returnRaw is true", async () => {
      const result = await wrapper.getAccountTokens(validAddress, "ERC20", 0, 10, true);
      expect(result).toEqual({ list: mockTokenData, total: 2 });
      expect(mockScanner.token.getAccountTokens).toHaveBeenCalledWith(validAddress, "ERC20", 0, 10);
      expect(ResponseFormatter.formatUnit).not.toHaveBeenCalled();
    });
  });
});
