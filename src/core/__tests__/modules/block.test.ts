import { BlockModule } from "../../modules/block";
import { jest } from "@jest/globals";

describe("BlockModule", () => {
  let module: BlockModule;
  const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    module = new BlockModule({});
    global.fetch = mockFetch;
  });

  describe("getBlockNumberByTime", () => {
    const mockBlockNumber = "1234567";

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockBlockNumber }),
        } as Response)
      );
    });

    it("should fetch block number with default closest parameter", async () => {
      const timestamp = 1707307200;
      const result = await module.getBlockNumberByTime(timestamp);
      expect(result).toBe(mockBlockNumber);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before`
        ),
        expect.any(Object)
      );
    });

    it("should fetch block number with custom closest parameter", async () => {
      const timestamp = 1707307200;
      const result = await module.getBlockNumberByTime(timestamp, "after");
      expect(result).toBe(mockBlockNumber);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=after`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid timestamp", async () => {
      await expect(module.getBlockNumberByTime(-1)).rejects.toThrow("Invalid timestamp: -1");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should throw error when no result is returned", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: null }),
        } as Response)
      );

      const timestamp = 1707307200;
      await expect(module.getBlockNumberByTime(timestamp)).rejects.toThrow();
    });
  });
});
