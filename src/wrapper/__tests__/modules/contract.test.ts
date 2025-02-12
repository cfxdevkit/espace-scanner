import { ContractWrapper } from "../../modules/contract";
import { ESpaceScanner } from "../../../core";
import { ResponseFormatter } from "../../../formatters";
import { jest } from "@jest/globals";
import { ContractSourceResponse } from "../../../types";

jest.mock("../../../core/scanner");
jest.mock("../../../formatters/responses");

describe("ContractWrapper", () => {
  let wrapper: ContractWrapper;
  let mockScanner: jest.Mocked<ESpaceScanner>;
  const MockedFormatter = ResponseFormatter as jest.Mocked<typeof ResponseFormatter>;
  const validAddress = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock scanner instance
    mockScanner = {
      contract: {
        getContractABI: jest.fn(),
        getContractSourceCode: jest.fn(),
        checkVerifyStatus: jest.fn(),
        verifyProxyContract: jest.fn(),
        checkProxyVerification: jest.fn(),
      },
    } as unknown as jest.Mocked<ESpaceScanner>;

    // Mock the ESpaceScanner constructor
    (ESpaceScanner as jest.MockedClass<typeof ESpaceScanner>).mockImplementation(() => mockScanner);

    wrapper = new ContractWrapper({});

    // Mock formatter methods
    MockedFormatter.formatNumber.mockReturnValue("200");
  });

  describe("getContractABI", () => {
    const mockABI = {
      name: "TestContract",
      type: "function",
      inputs: [],
      outputs: [],
    };

    beforeEach(() => {
      mockScanner.contract.getContractABI.mockResolvedValue(mockABI);
    });

    it("should return formatted contract ABI", async () => {
      const result = await wrapper.getContractABI(validAddress);
      expect(result).toEqual(mockABI);
      expect(mockScanner.contract.getContractABI).toHaveBeenCalledWith(validAddress);
    });

    it("should return raw ABI when returnRaw is true", async () => {
      const result = await wrapper.getContractABI(validAddress, true);
      expect(result).toEqual(mockABI);
      expect(mockScanner.contract.getContractABI).toHaveBeenCalledWith(validAddress);
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
      mockScanner.contract.getContractSourceCode.mockResolvedValue(mockSourceCode);
    });

    it("should return formatted contract source code", async () => {
      const result = await wrapper.getContractSourceCode(validAddress);
      expect(result).toEqual({
        ...mockSourceCode,
        Runs: "200",
      });
      expect(mockScanner.contract.getContractSourceCode).toHaveBeenCalledWith(validAddress);
      expect(MockedFormatter.formatNumber).toHaveBeenCalledWith(200);
    });

    it("should return raw source code when returnRaw is true", async () => {
      const result = await wrapper.getContractSourceCode(validAddress, true);
      expect(result).toEqual(mockSourceCode);
      expect(mockScanner.contract.getContractSourceCode).toHaveBeenCalledWith(validAddress);
      expect(MockedFormatter.formatNumber).not.toHaveBeenCalled();
    });
  });

  describe("checkVerifyStatus", () => {
    const mockGuid = "test-guid";
    const mockStatus = "Pending";

    beforeEach(() => {
      mockScanner.contract.checkVerifyStatus.mockResolvedValue(mockStatus);
    });

    it("should return verification status", async () => {
      const result = await wrapper.checkVerifyStatus(mockGuid);
      expect(result).toBe(mockStatus);
      expect(mockScanner.contract.checkVerifyStatus).toHaveBeenCalledWith(mockGuid);
    });

    it("should return raw status when returnRaw is true", async () => {
      const result = await wrapper.checkVerifyStatus(mockGuid, true);
      expect(result).toBe(mockStatus);
      expect(mockScanner.contract.checkVerifyStatus).toHaveBeenCalledWith(mockGuid);
    });
  });

  describe("verifyProxyContract", () => {
    const mockGuid = "proxy-verification-guid";
    const mockImplementation = "0x9876543210987654321098765432109876543210";

    beforeEach(() => {
      mockScanner.contract.verifyProxyContract.mockResolvedValue(mockGuid);
    });

    it("should verify proxy contract", async () => {
      const result = await wrapper.verifyProxyContract(validAddress);
      expect(result).toBe(mockGuid);
      expect(mockScanner.contract.verifyProxyContract).toHaveBeenCalledWith(
        validAddress,
        undefined
      );
    });

    it("should verify proxy contract with implementation", async () => {
      const result = await wrapper.verifyProxyContract(validAddress, mockImplementation);
      expect(result).toBe(mockGuid);
      expect(mockScanner.contract.verifyProxyContract).toHaveBeenCalledWith(
        validAddress,
        mockImplementation
      );
    });

    it("should return raw verification result when returnRaw is true", async () => {
      const result = await wrapper.verifyProxyContract(validAddress, mockImplementation, true);
      expect(result).toBe(mockGuid);
      expect(mockScanner.contract.verifyProxyContract).toHaveBeenCalledWith(
        validAddress,
        mockImplementation
      );
    });
  });

  describe("checkProxyVerification", () => {
    const mockGuid = "test-guid";
    const mockStatus = "Pending";

    beforeEach(() => {
      mockScanner.contract.checkProxyVerification.mockResolvedValue(mockStatus);
    });

    it("should return proxy verification status", async () => {
      const result = await wrapper.checkProxyVerification(mockGuid);
      expect(result).toBe(mockStatus);
      expect(mockScanner.contract.checkProxyVerification).toHaveBeenCalledWith(mockGuid);
    });

    it("should return raw status when returnRaw is true", async () => {
      const result = await wrapper.checkProxyVerification(mockGuid, true);
      expect(result).toBe(mockStatus);
      expect(mockScanner.contract.checkProxyVerification).toHaveBeenCalledWith(mockGuid);
    });
  });
});
