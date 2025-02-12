import { ResponseFormatter } from "../responses";
import { NumberFormatter } from "../numbers";
import { DateFormatter } from "../dates";
import { jest } from "@jest/globals";
import { formatUnits } from "viem";

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
});
