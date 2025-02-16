import { TransactionModule } from "../../../core/modules/transaction";
import { jest } from "@jest/globals";

describe("TransactionModule", () => {
  let module: TransactionModule;

  beforeEach(() => {
    module = new TransactionModule({ target: "mainnet" });
  });

  describe("getStatus", () => {
    it("should get transaction status correctly", async () => {
      const mockStatus = {
        isError: "0",
        errDescription: "",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockStatus }),
        } as Response)
      );

      const result = await module.getStatus({
        txhash: "0x1234567890123456789012345678901234567890123456789012345678901234",
      });
      expect(result).toEqual(mockStatus);
    });

    it("should throw error when transaction hash is missing", async () => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(module.getStatus({} as any)).rejects.toThrow(
        "Transaction hash is required for checking status"
      );
    });

    it("should handle error status", async () => {
      const mockStatus = {
        isError: "1",
        errDescription: "Out of gas",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockStatus }),
        } as Response)
      );

      const result = await module.getStatus({
        txhash: "0x1234567890123456789012345678901234567890123456789012345678901234",
      });
      expect(result.isError).toBe("1");
      expect(result.errDescription).toBe("Out of gas");
    });
  });

  describe("getReceiptStatus", () => {
    it("should get transaction receipt status correctly", async () => {
      const mockStatus = {
        status: "1",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockStatus }),
        } as Response)
      );

      const result = await module.getReceiptStatus({
        txhash: "0x1234567890123456789012345678901234567890123456789012345678901234",
      });
      expect(result).toEqual(mockStatus);
    });

    it("should throw error when transaction hash is missing", async () => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(module.getReceiptStatus({} as any)).rejects.toThrow(
        "Transaction hash is required for checking receipt status"
      );
    });

    it("should handle failed transaction", async () => {
      const mockStatus = {
        status: "0",
      };
      (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockStatus }),
        } as Response)
      );

      const result = await module.getReceiptStatus({
        txhash: "0x1234567890123456789012345678901234567890123456789012345678901234",
      });
      expect(result.status).toBe("0");
    });
  });
});
