import { TransactionModule } from "../../modules/transaction";
import { jest } from "@jest/globals";
import { DecodedMethod, DecodedMethodRaw } from "../../../types";

describe("TransactionModule", () => {
  let module: TransactionModule;
  const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;
  const validHash = "0x1234567890123456789012345678901234567890123456789012345678901234";

  beforeEach(() => {
    jest.clearAllMocks();
    module = new TransactionModule({});
    global.fetch = mockFetch;
  });

  describe("getTransactionStatus", () => {
    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: "1" }),
        } as Response)
      );
    });

    it("should fetch transaction status by hash", async () => {
      const result = await module.getTransactionStatus(validHash);
      expect(result).toEqual("1");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api?module=transaction&action=getstatus&txhash=${validHash}`),
        expect.any(Object)
      );
    });

    it("should throw error for empty hash", async () => {
      await expect(module.getTransactionStatus("")).rejects.toThrow(
        "Transaction hash is required for checking status"
      );
    });
  });

  describe("getTransactionReceiptStatus", () => {
    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: "1" }),
        } as Response)
      );
    });

    it("should fetch transaction receipt status by hash", async () => {
      const result = await module.getTransactionReceiptStatus(validHash);
      expect(result).toEqual("1");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=transaction&action=gettxreceiptstatus&txhash=${validHash}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for empty hash", async () => {
      await expect(module.getTransactionReceiptStatus("")).rejects.toThrow(
        "Transaction hash is required for checking receipt status"
      );
    });
  });

  describe("decodeMethod", () => {
    const mockDecodedMethod: DecodedMethod = {
      name: "transfer",
      params: [
        { name: "to", type: "address", value: "0x123" },
        { name: "value", type: "uint256", value: "1000" },
      ],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockDecodedMethod }),
        } as Response)
      );
    });

    it("should decode method data", async () => {
      const data = "0x123456";
      const result = await module.decodeMethod(data);
      expect(result).toEqual(mockDecodedMethod);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/util/decode/method?data=${data}`),
        expect.any(Object)
      );
    });

    it("should decode method data with contract address", async () => {
      const data = "0x123456";
      const contractAddress = "0x1234567890123456789012345678901234567890";
      const result = await module.decodeMethod(data, contractAddress);
      expect(result).toEqual(mockDecodedMethod);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/util/decode/method?data=${data}&contract=${contractAddress}`),
        expect.any(Object)
      );
    });

    it("should throw error for empty data", async () => {
      await expect(module.decodeMethod("")).rejects.toThrow("Method data is required");
    });
  });

  describe("decodeMethodRaw", () => {
    const mockDecodedMethodRaw: DecodedMethodRaw = {
      methodId: "0x123",
      methodName: "transfer",
      params: ["0x123", "1000"],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockDecodedMethodRaw }),
        } as Response)
      );
    });

    it("should decode method data in raw format", async () => {
      const data = "0x123456";
      const result = await module.decodeMethodRaw(data);
      expect(result).toEqual(mockDecodedMethodRaw);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/util/decode/method/raw?data=${data}`),
        expect.any(Object)
      );
    });

    it("should throw error for empty data", async () => {
      await expect(module.decodeMethodRaw("")).rejects.toThrow("Method data is required");
    });
  });
});
