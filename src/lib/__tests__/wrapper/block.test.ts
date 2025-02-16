import { BlockWrapper } from "../../../wrapper/modules/block";
import { jest } from "@jest/globals";

describe("BlockWrapper", () => {
  let wrapper: BlockWrapper;

  beforeEach(() => {
    wrapper = new BlockWrapper({ target: "mainnet" });
  });

  describe("getBlockNumberByTime", () => {
    it("should get block number correctly", async () => {
      const mockResponse = "1234567";
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBlockNumberByTime({ timestamp: 1234567890 });
      expect(result).toBe("1234567");
    });

    it("should handle zero block number", async () => {
      const mockResponse = "0";
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBlockNumberByTime({ timestamp: 0 });
      expect(result).toBe("0");
    });

    it("should handle invalid timestamp", async () => {
      await expect(wrapper.getBlockNumberByTime({ timestamp: -1 })).rejects.toThrow(
        "Invalid timestamp: -1"
      );
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = "1234567";
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getBlockNumberByTime({ timestamp: 1677649200 }, true);
      expect(result).toBe(mockResponse);
    });

    it("should handle validation error", async () => {
      await expect(wrapper.getBlockNumberByTime({ timestamp: -1 })).rejects.toThrow(
        "Invalid timestamp: -1"
      );
    });
  });
});
