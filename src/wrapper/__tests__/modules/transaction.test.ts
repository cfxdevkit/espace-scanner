import { TransactionWrapper } from "../../modules/transaction";
import { ESpaceScanner } from "../../../core";
import { jest } from "@jest/globals";
import { DecodedMethod, DecodedMethodRaw } from "../../../types";

jest.mock("../../../core/scanner");

describe("TransactionWrapper", () => {
  let wrapper: TransactionWrapper;
  let mockScanner: jest.Mocked<ESpaceScanner>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock scanner instance
    mockScanner = {
      transaction: {
        getTransactionStatus: jest.fn(),
        getTransactionReceiptStatus: jest.fn(),
        decodeMethod: jest.fn(),
        decodeMethodRaw: jest.fn(),
      },
    } as unknown as jest.Mocked<ESpaceScanner>;

    // Mock the ESpaceScanner constructor
    (ESpaceScanner as jest.MockedClass<typeof ESpaceScanner>).mockImplementation(() => mockScanner);

    wrapper = new TransactionWrapper({});
  });

  describe("getTransactionStatus", () => {
    const txhash = "0x1234567890123456789012345678901234567890123456789012345678901234";

    beforeEach(() => {
      mockScanner.transaction.getTransactionStatus.mockResolvedValue("1");
    });

    it("should return transaction status", async () => {
      const result = await wrapper.getTransactionStatus(txhash);
      expect(result).toBe("1");
      expect(mockScanner.transaction.getTransactionStatus).toHaveBeenCalledWith(txhash);
    });

    it("should return raw transaction status when returnRaw is true", async () => {
      const result = await wrapper.getTransactionStatus(txhash, true);
      expect(result).toBe("1");
      expect(mockScanner.transaction.getTransactionStatus).toHaveBeenCalledWith(txhash);
    });
  });

  describe("getTransactionReceiptStatus", () => {
    const txhash = "0x1234567890123456789012345678901234567890123456789012345678901234";

    beforeEach(() => {
      mockScanner.transaction.getTransactionReceiptStatus.mockResolvedValue("1");
    });

    it("should return transaction receipt status", async () => {
      const result = await wrapper.getTransactionReceiptStatus(txhash);
      expect(result).toBe("1");
      expect(mockScanner.transaction.getTransactionReceiptStatus).toHaveBeenCalledWith(txhash);
    });

    it("should return raw transaction receipt status when returnRaw is true", async () => {
      const result = await wrapper.getTransactionReceiptStatus(txhash, true);
      expect(result).toBe("1");
      expect(mockScanner.transaction.getTransactionReceiptStatus).toHaveBeenCalledWith(txhash);
    });
  });

  describe("decodeMethod", () => {
    const data = "0x123456";
    const contractAddress = "0x1234567890123456789012345678901234567890";
    const mockDecodedMethod: DecodedMethod = {
      name: "transfer",
      params: [
        { name: "to", type: "address", value: "0x123" },
        { name: "value", type: "uint256", value: "1000" },
      ],
    };

    beforeEach(() => {
      mockScanner.transaction.decodeMethod.mockResolvedValue(mockDecodedMethod);
    });

    it("should decode method data", async () => {
      const result = await wrapper.decodeMethod(data);
      expect(result).toEqual(mockDecodedMethod);
      expect(mockScanner.transaction.decodeMethod).toHaveBeenCalledWith(data, undefined);
    });

    it("should decode method data with contract address", async () => {
      const result = await wrapper.decodeMethod(data, contractAddress);
      expect(result).toEqual(mockDecodedMethod);
      expect(mockScanner.transaction.decodeMethod).toHaveBeenCalledWith(data, contractAddress);
    });

    it("should return raw decoded method when returnRaw is true", async () => {
      const result = await wrapper.decodeMethod(data, contractAddress, true);
      expect(result).toEqual(mockDecodedMethod);
      expect(mockScanner.transaction.decodeMethod).toHaveBeenCalledWith(data, contractAddress);
    });
  });

  describe("decodeMethodRaw", () => {
    const data = "0x123456";
    const mockDecodedMethodRaw: DecodedMethodRaw = {
      methodId: "0x123",
      methodName: "transfer",
      params: ["0x123", "1000"],
    };

    beforeEach(() => {
      mockScanner.transaction.decodeMethodRaw.mockResolvedValue(mockDecodedMethodRaw);
    });

    it("should decode method data in raw format", async () => {
      const result = await wrapper.decodeMethodRaw(data);
      expect(result).toEqual(mockDecodedMethodRaw);
      expect(mockScanner.transaction.decodeMethodRaw).toHaveBeenCalledWith(data);
    });

    it("should return raw decoded method when returnRaw is true", async () => {
      const result = await wrapper.decodeMethodRaw(data, true);
      expect(result).toEqual(mockDecodedMethodRaw);
      expect(mockScanner.transaction.decodeMethodRaw).toHaveBeenCalledWith(data);
    });
  });
});
