import { ResponseFormatter } from "../responses";
import { NumberFormatter } from "../numbers";
import { DateFormatter } from "../dates";
import { jest } from "@jest/globals";
import { formatUnits } from "viem";
import { ESpaceStatItem } from "../../types";

jest.mock("../numbers");
jest.mock("../dates");
jest.mock("viem");

describe("ResponseFormatter", () => {
  const MockedNumberFormatter = NumberFormatter as jest.Mocked<typeof NumberFormatter>;
  const MockedDateFormatter = DateFormatter as jest.Mocked<typeof DateFormatter>;
  const MockedFormatUnits = formatUnits as jest.MockedFunction<typeof formatUnits>;

  beforeEach(() => {
    jest.clearAllMocks();
    MockedNumberFormatter.formatNumber.mockImplementation((value) => {
      if (!value || value === "0" || value === 0) return "0";
      if (value === "invalid" || value === undefined) return "0";
      return "1,000";
    });
    MockedNumberFormatter.formatGas.mockImplementation((value) => {
      if (!value || value === "0" || value === 0) return "0 Gwei";
      if (value === "invalid" || value === undefined) return "0 Gwei";
      return "1.0 Gwei";
    });
    MockedNumberFormatter.formatCFX.mockImplementation((value) => {
      if (!value || value === "0" || value === 0) return "0 CFX";
      if (value === "invalid" || value === undefined) return "0 CFX";
      return "1.0 CFX";
    });
    MockedDateFormatter.formatTimestamp.mockReturnValue("2024-02-07 12:00:00");
    MockedFormatUnits.mockImplementation((value) => {
      try {
        if (!value || value === BigInt(0)) return "0";
        return "1.0";
      } catch {
        return "0";
      }
    });
  });

  describe("formatUnit", () => {
    it("should format token amounts", () => {
      expect(ResponseFormatter.formatUnit("1000000000000000000", 18)).toBe("1.0");
    });

    it("should handle zero", () => {
      expect(ResponseFormatter.formatUnit("0", 18)).toBe("0");
      expect(ResponseFormatter.formatUnit(0, 18)).toBe("0");
    });

    it("should handle invalid values", () => {
      expect(ResponseFormatter.formatUnit("invalid", 18)).toBe("0");
      expect(ResponseFormatter.formatUnit(undefined, 18)).toBe("0");
    });
  });

  describe("formatNumber", () => {
    beforeEach(() => {
      MockedNumberFormatter.formatNumber.mockImplementation((value) => {
        if (!value || value === "0" || value === 0) return "0";
        if (value === "invalid" || value === undefined) return "0";
        return "1,000";
      });
    });

    it("should format number values", () => {
      expect(ResponseFormatter.formatNumber("1000")).toBe("1,000");
      expect(ResponseFormatter.formatNumber(1000)).toBe("1,000");
    });

    it("should handle zero", () => {
      expect(ResponseFormatter.formatNumber("0")).toBe("0");
      expect(ResponseFormatter.formatNumber(0)).toBe("0");
    });

    it("should handle invalid values", () => {
      expect(ResponseFormatter.formatNumber("invalid")).toBe("0");
      expect(ResponseFormatter.formatNumber(undefined)).toBe("0");
    });
  });

  describe("formatGas", () => {
    it("should format gas values", () => {
      expect(ResponseFormatter.formatGas("1000000000")).toBe("1.0 Gwei");
      expect(ResponseFormatter.formatGas(1000000000)).toBe("1.0 Gwei");
    });

    it("should handle zero", () => {
      expect(ResponseFormatter.formatGas("0")).toBe("0 Gwei");
      expect(ResponseFormatter.formatGas(0)).toBe("0 Gwei");
    });

    it("should handle invalid values", () => {
      expect(ResponseFormatter.formatGas("invalid")).toBe("0 Gwei");
      expect(ResponseFormatter.formatGas(undefined)).toBe("0 Gwei");
    });
  });

  describe("formatCFX", () => {
    it("should format CFX values", () => {
      expect(ResponseFormatter.formatCFX("1000000000000000000")).toBe("1.0 CFX");
    });

    it("should handle zero", () => {
      expect(ResponseFormatter.formatCFX("0")).toBe("0 CFX");
      expect(ResponseFormatter.formatCFX(0)).toBe("0 CFX");
    });

    it("should handle invalid values", () => {
      expect(ResponseFormatter.formatCFX("invalid")).toBe("0 CFX");
      expect(ResponseFormatter.formatCFX(undefined)).toBe("0 CFX");
    });
  });

  describe("formatTokenData", () => {
    const mockToken = {
      address: "0x1234567890123456789012345678901234567890",
      name: "Test Token",
      symbol: "TEST",
      decimals: 18,
      type: "ERC20",
      amount: "1000000000000000000",
      contract: "0x1234567890123456789012345678901234567890",
      priceInUSDT: "1.5",
    };

    beforeEach(() => {
      MockedNumberFormatter.formatTokenAmount.mockImplementation((amount, _decimals) => {
        if (!amount) return "0";
        return amount === "1000000000000000000" ? "1.0" : "0";
      });
    });

    it("should format token data with all fields", () => {
      const result = ResponseFormatter.formatTokenData(mockToken);
      expect(result).toContain("Token: Test Token (TEST)");
      expect(result).toContain("Type: ERC20");
      expect(result).toContain("Amount: 1.0 TEST");
      expect(result).toContain("Contract: 0x1234567890123456789012345678901234567890");
      expect(result).toContain("Price: $1.5000");
    });

    it("should handle missing optional fields", () => {
      const minimalToken = {
        address: "0x1234567890123456789012345678901234567890",
        name: "Test Token",
        symbol: "TEST",
        decimals: 18,
      };
      const result = ResponseFormatter.formatTokenData(minimalToken);
      expect(result).toContain("Token: Test Token (TEST)");
      expect(result).toContain("Type: Unknown");
      expect(result).toContain("Amount: 0 TEST");
      expect(result).toContain("Contract: Unknown");
      expect(result).not.toContain("Price:");
    });
  });

  describe("formatStatItem", () => {
    beforeEach(() => {
      MockedNumberFormatter.formatNumber.mockImplementation((value) => {
        if (value === 100) return "100";
        return "1,000";
      });
    });

    it("should format stat items", () => {
      const item: ESpaceStatItem = {
        statTime: 1707307200,
        count: 100,
        value: 1000,
      };
      const formatted = ResponseFormatter.formatStatItem(item);
      expect(formatted).toContain("Time:");
      expect(formatted).toContain("count: 100");
      expect(formatted).toContain("value: 1,000");
    });

    it("should handle items with only required fields", () => {
      const item: ESpaceStatItem = {
        statTime: 1707307200,
      };
      const formatted = ResponseFormatter.formatStatItem(item);
      expect(formatted).toContain("Time:");
    });
  });

  describe("formatTopStats", () => {
    const mockTopStats = {
      gasTotal: "1000000000",
      valueTotal: "1000000",
      list: [
        {
          address: "0x1234567890123456789012345678901234567890",
          gas: "500000000",
          value: "500000",
          transferCntr: "10",
        },
      ],
    };

    beforeEach(() => {
      MockedNumberFormatter.formatGas.mockReturnValue("1.0 Gwei");
    });

    it("should format top stats with all fields", () => {
      const result = ResponseFormatter.formatTopStats(mockTopStats);
      expect(result).toContain("Total Gas Used: 1.0 Gwei");
      expect(result).toContain("Total Value: 1,000");
      expect(result).toContain("#1 0x1234567890123456789012345678901234567890");
      expect(result).toContain("Gas Used: 1.0 Gwei");
      expect(result).toContain("Value: 1,000");
      expect(result).toContain("Transfers: 1,000");
    });

    it("should handle empty data", () => {
      expect(ResponseFormatter.formatTopStats({ list: [] })).toBe("No data available");
    });
  });
});
