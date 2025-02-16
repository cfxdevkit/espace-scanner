import { UtilsModule } from "../../../core/modules/utils";
import { jest } from "@jest/globals";

describe("UtilsModule", () => {
  let module: UtilsModule;

  beforeEach(() => {
    module = new UtilsModule({ target: "mainnet" });
  });

  describe("decodeMethod", () => {
    it("should decode method correctly", async () => {
      const mockResponse = {
        hash: "0x123",
        decodedData: "transfer(address,uint256)",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await module.decodeMethod({
        hashes: "0x123,0x456",
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error for invalid hashes", async () => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(module.decodeMethod({ hashes: undefined as any })).rejects.toThrow(
        "Invalid hashes: undefined"
      );
    });

    it("should handle error response", async () => {
      const mockResponse = {
        hash: "0x123",
        error: "Unable to decode method",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await module.decodeMethod({
        hashes: "0x123",
      });
      expect(result.error).toBe("Unable to decode method");
    });
  });

  describe("decodeMethodRaw", () => {
    it("should decode method raw correctly", async () => {
      const mockResponse = {
        contract: "0x123",
        input: "0x456",
        decodedData: "transfer(address,uint256)",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await module.decodeMethodRaw({
        contracts: "0x123",
        inputs: "0x456",
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error for invalid contracts", async () => {
      await expect(
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        module.decodeMethodRaw({ contracts: undefined as any, inputs: "0x456" })
      ).rejects.toThrow("Invalid contracts: undefined");
    });

    it("should throw error for invalid inputs", async () => {
      await expect(
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        module.decodeMethodRaw({ contracts: "0x123", inputs: undefined as any })
      ).rejects.toThrow("Invalid inputs: undefined");
    });

    it("should handle error response", async () => {
      const mockResponse = {
        contract: "0x123",
        input: "0x456",
        error: "Unable to decode method",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await module.decodeMethodRaw({
        contracts: "0x123",
        inputs: "0x456",
      });
      expect(result.error).toBe("Unable to decode method");
    });
  });
});
