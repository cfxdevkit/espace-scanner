import { BlockWrapper } from "../../modules/block";
import { ESpaceScanner } from "../../../core";
import { jest } from "@jest/globals";

jest.mock("../../../core/scanner");

describe("BlockWrapper", () => {
  let wrapper: BlockWrapper;
  let mockScanner: jest.Mocked<ESpaceScanner>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock scanner instance
    mockScanner = {
      block: {
        getBlockNumberByTime: jest.fn(),
      },
    } as unknown as jest.Mocked<ESpaceScanner>;

    // Mock the ESpaceScanner constructor
    (ESpaceScanner as jest.MockedClass<typeof ESpaceScanner>).mockImplementation(() => mockScanner);

    wrapper = new BlockWrapper({});
  });

  describe("getBlockNumberByTime", () => {
    const mockBlockNumber = "1234567";

    beforeEach(() => {
      mockScanner.block.getBlockNumberByTime.mockResolvedValue(mockBlockNumber);
    });

    it("should return formatted block number by default", async () => {
      const timestamp = 1707307200;
      const result = await wrapper.getBlockNumberByTime(timestamp);
      expect(result).toBe(1234567);
      expect(mockScanner.block.getBlockNumberByTime).toHaveBeenCalledWith(timestamp, "before");
    });

    it("should handle custom closest parameter", async () => {
      const timestamp = 1707307200;
      const result = await wrapper.getBlockNumberByTime(timestamp, "after");
      expect(result).toBe(1234567);
      expect(mockScanner.block.getBlockNumberByTime).toHaveBeenCalledWith(timestamp, "after");
    });

    it("should return raw block number when returnRaw is true", async () => {
      const timestamp = 1707307200;
      const result = await wrapper.getBlockNumberByTime(timestamp, "before", true);
      expect(result).toBe(mockBlockNumber);
      expect(mockScanner.block.getBlockNumberByTime).toHaveBeenCalledWith(timestamp, "before");
    });
  });
});
