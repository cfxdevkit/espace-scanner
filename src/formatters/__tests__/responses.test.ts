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
    MockedDateFormatter.formatDate.mockReturnValue("2024-02-07 12:00:00");
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
    it("should format valid unit values", () => {
      expect(ResponseFormatter.formatUnit("1000000000000000000", 18)).toBe("1.0");
      expect(ResponseFormatter.formatUnit("1000000", 6)).toBe("1.0");
    });

    it("should handle undefined values", () => {
      expect(ResponseFormatter.formatUnit(undefined, 18)).toBe("0");
    });

    it("should handle invalid values", () => {
      expect(ResponseFormatter.formatUnit("invalid", 18)).toBe("0");
      expect(ResponseFormatter.formatUnit("abc", 18)).toBe("0");
    });
  });

  describe("formatNumber", () => {
    it("should call NumberFormatter.formatNumber", () => {
      ResponseFormatter.formatNumber("1000");
      expect(NumberFormatter.formatNumber).toHaveBeenCalledWith("1000");
    });

    it("should handle undefined values", () => {
      ResponseFormatter.formatNumber(undefined);
      expect(NumberFormatter.formatNumber).toHaveBeenCalledWith(undefined);
    });
  });

  describe("formatGas", () => {
    it("should call NumberFormatter.formatGas", () => {
      ResponseFormatter.formatGas("1000");
      expect(NumberFormatter.formatGas).toHaveBeenCalledWith("1000");
    });

    it("should handle undefined values", () => {
      ResponseFormatter.formatGas(undefined);
      expect(NumberFormatter.formatGas).toHaveBeenCalledWith(undefined);
    });
  });

  describe("formatCFX", () => {
    it("should call NumberFormatter.formatCFX", () => {
      ResponseFormatter.formatCFX("1000");
      expect(NumberFormatter.formatCFX).toHaveBeenCalledWith("1000");
    });

    it("should handle undefined values", () => {
      ResponseFormatter.formatCFX(undefined);
      expect(NumberFormatter.formatCFX).toHaveBeenCalledWith(undefined);
    });
  });

  describe("formatTimestamp", () => {
    it("should call DateFormatter.formatTimestamp for valid values", () => {
      ResponseFormatter.formatTimestamp("1707307200");
      expect(DateFormatter.formatTimestamp).toHaveBeenCalledWith("1707307200");
    });

    it("should handle undefined values", () => {
      expect(ResponseFormatter.formatTimestamp(undefined)).toBe("N/A");
      expect(DateFormatter.formatTimestamp).not.toHaveBeenCalled();
    });
  });

  describe("formatDate", () => {
    it("should call DateFormatter.formatDate with default style", () => {
      ResponseFormatter.formatDate("1707307200");
      expect(DateFormatter.formatDate).toHaveBeenCalledWith("1707307200", "full");
    });

    it("should call DateFormatter.formatDate with custom style", () => {
      ResponseFormatter.formatDate("1707307200", "date");
      expect(DateFormatter.formatDate).toHaveBeenCalledWith("1707307200", "date");
    });

    it("should handle undefined values", () => {
      expect(ResponseFormatter.formatDate(undefined)).toBe("N/A");
      expect(DateFormatter.formatDate).not.toHaveBeenCalled();
    });

    it("should handle all style options", () => {
      ResponseFormatter.formatDate("1707307200", "full");
      expect(DateFormatter.formatDate).toHaveBeenCalledWith("1707307200", "full");

      ResponseFormatter.formatDate("1707307200", "date");
      expect(DateFormatter.formatDate).toHaveBeenCalledWith("1707307200", "date");

      ResponseFormatter.formatDate("1707307200", "unix");
      expect(DateFormatter.formatDate).toHaveBeenCalledWith("1707307200", "unix");
    });
  });
});
