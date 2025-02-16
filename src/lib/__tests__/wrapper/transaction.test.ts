import { TransactionWrapper } from "../../../wrapper/modules/transaction";
import { jest } from "@jest/globals";

describe("TransactionWrapper", () => {
  let wrapper: TransactionWrapper;
  const mockTxHash = "0x1234567890123456789012345678901234567890123456789012345678901234";

  beforeEach(() => {
    wrapper = new TransactionWrapper({ target: "mainnet" });
  });

  describe("getStatus", () => {
    it("should get transaction status correctly", async () => {
      const mockResponse = {
        isError: "0",
        errDescription: "",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getStatus({ txhash: mockTxHash });
      expect(result).toEqual(mockResponse);
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        isError: "1",
        errDescription: "Reverted",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getStatus({ txhash: mockTxHash }, true);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getReceiptStatus", () => {
    it("should get transaction receipt status correctly", async () => {
      const mockResponse = {
        status: "1",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getReceiptStatus({ txhash: mockTxHash });
      expect(result).toEqual(mockResponse);
    });

    it("should return raw response when returnRaw is true", async () => {
      const mockResponse = {
        status: "0",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );

      const result = await wrapper.getReceiptStatus({ txhash: mockTxHash }, true);
      expect(result).toEqual(mockResponse);
    });
  });
});
