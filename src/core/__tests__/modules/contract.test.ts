import { ContractModule } from "../../modules/contract";
import { jest } from "@jest/globals";
import { ContractSourceResponse } from "../../../types";

describe("ContractModule", () => {
  let module: ContractModule;
  const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;
  const validAddress = "0x1234567890123456789012345678901234567890";
  const invalidAddress = "0xinvalid";

  beforeEach(() => {
    jest.clearAllMocks();
    module = new ContractModule({});
    global.fetch = mockFetch;
  });

  describe("getContractABI", () => {
    const mockABI = {
      name: "TestContract",
      type: "function",
      inputs: [],
      outputs: [],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: JSON.stringify(mockABI) }),
        } as Response)
      );
    });

    it("should fetch and parse contract ABI for valid address", async () => {
      const result = await module.getContractABI(validAddress);
      expect(result).toEqual(mockABI);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api?module=contract&action=getabi&address=${validAddress}`),
        expect.any(Object)
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getContractABI(invalidAddress)).rejects.toThrow("Invalid address");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should throw error when ABI is not available", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: null }),
        } as Response)
      );

      await expect(module.getContractABI(validAddress)).rejects.toThrow(
        `Contract ${validAddress} not verified or ABI not available`
      );
    });
  });

  describe("getContractSourceCode", () => {
    const mockSourceCode: ContractSourceResponse = {
      SourceCode: "contract Test {}",
      ABI: "[]",
      ContractName: "Test",
      Compiler: "v0.8.0",
      OptimizationUsed: true,
      Runs: 200,
      ConstructorArguments: "",
      EVMVersion: "london",
      Library: "",
      LicenseType: "MIT",
      Proxy: "0x0",
      Implementation: "0x0",
      SwarmSource: "",
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: [mockSourceCode] }),
        } as Response)
      );
    });

    it("should fetch contract source code for valid address", async () => {
      const result = await module.getContractSourceCode(validAddress);
      expect(result).toEqual(mockSourceCode);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=contract&action=getsourcecode&address=${validAddress}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getContractSourceCode(invalidAddress)).rejects.toThrow("Invalid address");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should throw error when source code is not available", async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: [] }),
        } as Response)
      );

      await expect(module.getContractSourceCode(validAddress)).rejects.toThrow(
        `Contract ${validAddress} not verified or source code not available`
      );
    });
  });

  describe("checkVerifyStatus", () => {
    const mockGuid = "test-guid";
    const mockStatus = "Pending";

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockStatus }),
        } as Response)
      );
    });

    it("should fetch verification status for valid GUID", async () => {
      const result = await module.checkVerifyStatus(mockGuid);
      expect(result).toBe(mockStatus);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api?module=contract&action=checkverifystatus&guid=${mockGuid}`),
        expect.any(Object)
      );
    });

    it("should throw error for empty GUID", async () => {
      await expect(module.checkVerifyStatus("")).rejects.toThrow(
        "GUID is required for checking verification status"
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("verifyProxyContract", () => {
    const mockGuid = "proxy-verification-guid";
    const mockImplementation = "0x9876543210987654321098765432109876543210";

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockGuid }),
        } as Response)
      );
    });

    it("should verify proxy contract with valid address", async () => {
      const result = await module.verifyProxyContract(validAddress);
      expect(result).toBe(mockGuid);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=contract&action=verifyproxycontract&address=${validAddress}`
        ),
        expect.any(Object)
      );
    });

    it("should verify proxy contract with implementation address", async () => {
      const result = await module.verifyProxyContract(validAddress, mockImplementation);
      expect(result).toBe(mockGuid);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=contract&action=verifyproxycontract&address=${validAddress}&expectedimplementation=${mockImplementation}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.verifyProxyContract(invalidAddress)).rejects.toThrow("Invalid address");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should throw error for invalid implementation address", async () => {
      await expect(module.verifyProxyContract(validAddress, invalidAddress)).rejects.toThrow(
        "Invalid implementation address"
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("checkProxyVerification", () => {
    const mockGuid = "test-guid";
    const mockStatus = "Pending";

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockStatus }),
        } as Response)
      );
    });

    it("should fetch proxy verification status for valid GUID", async () => {
      const result = await module.checkProxyVerification(mockGuid);
      expect(result).toBe(mockStatus);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=contract&action=checkproxyverification&guid=${mockGuid}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for empty GUID", async () => {
      await expect(module.checkProxyVerification("")).rejects.toThrow(
        "GUID is required for checking proxy verification status"
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
