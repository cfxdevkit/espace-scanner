import { BaseWrapper } from "../base";
import { ESpaceScanner } from "../../core";
import { ResponseFormatter } from "../../formatters";
import { jest } from "@jest/globals";

jest.mock("../../core/scanner");
jest.mock("../../formatters/responses");

describe("BaseWrapper", () => {
  let wrapper: BaseWrapper;
  const MockedScanner = ESpaceScanner as jest.MockedClass<typeof ESpaceScanner>;
  const MockedFormatter = ResponseFormatter as jest.Mocked<typeof ResponseFormatter>;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = new BaseWrapper({});
    MockedFormatter.formatCFX.mockReturnValue("1.0 CFX");
    MockedFormatter.formatGas.mockReturnValue("1.0 Gwei");
    MockedFormatter.formatTimestamp.mockReturnValue("2024-02-07 12:00:00");
    MockedFormatter.formatNumber.mockReturnValue("1,000");
    MockedFormatter.formatUnit.mockReturnValue("1.0");
  });

  describe("formatTimestamp", () => {
    it("should format timestamp using ResponseFormatter", () => {
      const timestamp = "1707307200";
      const result = wrapper["formatTimestamp"](timestamp);
      expect(result).toBe("2024-02-07 12:00:00");
      expect(MockedFormatter.formatTimestamp).toHaveBeenCalledWith(timestamp);
    });
  });

  describe("formatCFX", () => {
    it("should format CFX value using ResponseFormatter", () => {
      const value = "1000000000000000000";
      const result = wrapper["formatCFX"](value);
      expect(result).toBe("1.0 CFX");
      expect(MockedFormatter.formatCFX).toHaveBeenCalledWith(value);
    });
  });

  describe("formatGas", () => {
    it("should format gas value using ResponseFormatter", () => {
      const value = "1000000000";
      const result = wrapper["formatGas"](value);
      expect(result).toBe("1.0 Gwei");
      expect(MockedFormatter.formatGas).toHaveBeenCalledWith(value);
    });
  });

  describe("formatNumber", () => {
    it("should format number using ResponseFormatter", () => {
      const value = "1000";
      const result = wrapper["formatNumber"](value);
      expect(result).toBe("1,000");
      expect(MockedFormatter.formatNumber).toHaveBeenCalledWith(value);
    });
  });

  describe("formatUnit", () => {
    it("should format unit value using ResponseFormatter", () => {
      const value = "1000000000000000000";
      const decimals = 18;
      const result = wrapper["formatUnit"](value, decimals);
      expect(result).toBe("1.0");
      expect(MockedFormatter.formatUnit).toHaveBeenCalledWith(value, decimals);
    });
  });

  describe("constructor", () => {
    it("should create scanner instance with provided config", () => {
      const config = { target: "testnet" as const };
      new BaseWrapper(config);
      expect(MockedScanner).toHaveBeenCalledWith(config);
    });

    it("should create scanner instance with default config", () => {
      new BaseWrapper();
      expect(MockedScanner).toHaveBeenCalledWith({});
    });
  });
});
