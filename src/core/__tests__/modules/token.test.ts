import { TokenModule } from "../../modules/token";
import { jest } from "@jest/globals";
import { TokenData } from "../../../types";

describe("TokenModule", () => {
  let module: TokenModule;
  const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;
  const validAddress = "0x1234567890123456789012345678901234567890";
  const invalidAddress = "0xinvalid";

  beforeEach(() => {
    jest.clearAllMocks();
    module = new TokenModule({});
    global.fetch = mockFetch;
  });

  describe("getTokenInfos", () => {
    const mockTokenData: TokenData[] = [
      {
        contract: validAddress,
        name: "Test Token",
        symbol: "TEST",
        decimals: 18,
        totalSupply: "1000000000000000000",
        priceInUSDT: "1.0",
      },
    ];

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: { list: mockTokenData } }),
        } as Response)
      );
    });

    it("should fetch token info for valid addresses", async () => {
      const result = await module.getTokenInfos([validAddress]);
      expect(result).toEqual(mockTokenData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/token/tokeninfos?contracts=${validAddress}`),
        expect.any(Object)
      );
    });

    it("should throw error for invalid addresses", async () => {
      await expect(module.getTokenInfos([invalidAddress])).rejects.toThrow(
        "Invalid contract addresses provided"
      );
    });
  });

  describe("getTokenBalance", () => {
    const mockBalance = "1000000000000000000";

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockBalance }),
        } as Response)
      );
    });

    it("should fetch token balance for valid addresses", async () => {
      const result = await module.getTokenBalance(validAddress, validAddress);
      expect(result).toBe(mockBalance);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `module=account&action=tokenbalance&contractaddress=${validAddress}&address=${validAddress}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid contract address", async () => {
      await expect(module.getTokenBalance(invalidAddress, validAddress)).rejects.toThrow(
        "Invalid contract address"
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getTokenBalance(validAddress, invalidAddress)).rejects.toThrow(
        "Invalid address"
      );
    });
  });

  describe("getTokenSupply", () => {
    const mockSupply = "1000000000000000000";

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockSupply }),
        } as Response)
      );
    });

    it("should fetch token supply for valid contract", async () => {
      const result = await module.getTokenSupply(validAddress);
      expect(result).toBe(mockSupply);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`module=stats&action=tokensupply&contractaddress=${validAddress}`),
        expect.any(Object)
      );
    });

    it("should throw error for invalid contract address", async () => {
      await expect(module.getTokenSupply(invalidAddress)).rejects.toThrow(
        "Invalid contract address"
      );
    });
  });

  describe("getTokenSupplyHistory", () => {
    const mockSupply = "1000000000000000000";
    const blockNumber = 1000000;

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockSupply }),
        } as Response)
      );
    });

    it("should fetch historical token supply for valid contract", async () => {
      const result = await module.getTokenSupplyHistory(validAddress, blockNumber);
      expect(result).toBe(mockSupply);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `module=stats&action=tokensupplyhistory&contractaddress=${validAddress}&blockno=${blockNumber}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid contract address", async () => {
      await expect(module.getTokenSupplyHistory(invalidAddress, blockNumber)).rejects.toThrow(
        "Invalid contract address"
      );
    });

    it("should throw error for invalid block number", async () => {
      await expect(module.getTokenSupplyHistory(validAddress, -1)).rejects.toThrow(
        "Invalid block number"
      );
    });
  });

  describe("getTokenBalanceHistory", () => {
    const mockBalance = "1000000000000000000";
    const blockNumber = 1000000;

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockBalance }),
        } as Response)
      );
    });

    it("should fetch historical token balance for valid addresses", async () => {
      const result = await module.getTokenBalanceHistory(validAddress, validAddress, blockNumber);
      expect(result).toBe(mockBalance);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `module=account&action=tokenbalancehistory&contractaddress=${validAddress}&address=${validAddress}&blockno=${blockNumber}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for missing contract address", async () => {
      await expect(module.getTokenBalanceHistory("", validAddress, blockNumber)).rejects.toThrow(
        "Contract address is required"
      );
    });

    it("should throw error for missing address", async () => {
      await expect(module.getTokenBalanceHistory(validAddress, "", blockNumber)).rejects.toThrow(
        "Account address is required"
      );
    });

    it("should throw error for invalid block number", async () => {
      await expect(module.getTokenBalanceHistory(validAddress, validAddress, -1)).rejects.toThrow(
        "Valid block number is required"
      );
    });
  });

  describe("getAccountTokens", () => {
    const mockTokenData: TokenData[] = [
      {
        contract: validAddress,
        name: "Test Token",
        symbol: "TEST",
        decimals: 18,
        totalSupply: "1000000000000000000",
        priceInUSDT: "1.0",
        amount: "1000000000000000000",
      },
    ];

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: { list: mockTokenData } }),
        } as Response)
      );
    });

    it("should fetch account tokens with default parameters", async () => {
      const result = await module.getAccountTokens(validAddress);
      expect(result).toEqual(mockTokenData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/account/tokens?account=${validAddress}&tokenType=ERC20&skip=0&limit=10`
        ),
        expect.any(Object)
      );
    });

    it("should handle custom parameters", async () => {
      const tokenType = "ERC721";
      const skip = 20;
      const limit = 50;

      await module.getAccountTokens(validAddress, tokenType, skip, limit);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/account/tokens?account=${validAddress}&tokenType=${tokenType}&skip=${skip}&limit=${limit}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getAccountTokens(invalidAddress)).rejects.toThrow("Invalid address");
    });
  });
});
