import { NFTModule } from "../../modules/nft";
import { jest } from "@jest/globals";
import {
  NFTBalanceResponse,
  NFTTokenResponse,
  NFTPreviewResponse,
  NFTFungibleTokenResponse,
  NFTOwnerResponse,
} from "../../../types";

describe("NFTModule", () => {
  let module: NFTModule;
  const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;
  const validAddress = "0x1234567890123456789012345678901234567890";
  const invalidAddress = "0xinvalid";

  beforeEach(() => {
    jest.clearAllMocks();
    module = new NFTModule({});
    global.fetch = mockFetch;
  });

  describe("getNFTBalances", () => {
    const mockResponse: NFTBalanceResponse = {
      total: 1,
      list: [
        {
          contract: validAddress,
          tokenId: "1",
          amount: "1",
          tokenUri: "https://example.com/token/1",
          metadata: {
            name: "Test NFT",
            description: "Test Description",
            image: "https://example.com/image/1",
          },
        },
      ],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );
    });

    it("should fetch NFT balances with default parameters", async () => {
      const result = await module.getNFTBalances(validAddress);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/nft/balances?account=${validAddress}&skip=0&limit=10`),
        expect.any(Object)
      );
    });

    it("should handle custom pagination parameters", async () => {
      const skip = 20;
      const limit = 50;
      await module.getNFTBalances(validAddress, skip, limit);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/nft/balances?account=${validAddress}&skip=${skip}&limit=${limit}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getNFTBalances(invalidAddress)).rejects.toThrow("Invalid address");
    });
  });

  describe("getNFTTokens", () => {
    const mockResponse: NFTTokenResponse = {
      total: 1,
      list: [
        {
          contract: validAddress,
          tokenId: "1",
          owner: validAddress,
          tokenUri: "https://example.com/token/1",
          metadata: {
            name: "Test NFT",
            description: "Test Description",
            image: "https://example.com/image/1",
          },
        },
      ],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );
    });

    it("should fetch NFT tokens with default parameters", async () => {
      const result = await module.getNFTTokens(validAddress);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/nft/tokens?contract=${validAddress}&skip=0&limit=10`),
        expect.any(Object)
      );
    });

    it("should handle custom pagination parameters", async () => {
      const skip = 20;
      const limit = 50;
      await module.getNFTTokens(validAddress, skip, limit);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/nft/tokens?contract=${validAddress}&skip=${skip}&limit=${limit}`),
        expect.any(Object)
      );
    });

    it("should throw error for invalid contract address", async () => {
      await expect(module.getNFTTokens(invalidAddress)).rejects.toThrow("Invalid contract address");
    });
  });

  describe("getNFTPreview", () => {
    const mockResponse: NFTPreviewResponse = {
      total: 1,
      list: [
        {
          contract: validAddress,
          tokenId: "1",
          tokenUri: "https://example.com/token/1",
          metadata: {
            name: "Test NFT",
            description: "Test Description",
            image: "https://example.com/image/1",
          },
        },
      ],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );
    });

    it("should fetch NFT preview data", async () => {
      const tokenId = "1";
      const result = await module.getNFTPreview(validAddress, tokenId);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/nft/preview?contract=${validAddress}&tokenId=${tokenId}`),
        expect.any(Object)
      );
    });

    it("should throw error for invalid contract address", async () => {
      await expect(module.getNFTPreview(invalidAddress, "1")).rejects.toThrow(
        "Invalid contract address"
      );
    });
  });

  describe("getNFTFungibleTokens", () => {
    const mockResponse: NFTFungibleTokenResponse = {
      total: 1,
      list: [
        {
          contract: validAddress,
          name: "Test Token",
          symbol: "TEST",
          decimals: 18,
          totalSupply: "1000000000000000000",
        },
      ],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );
    });

    it("should fetch NFT fungible tokens with default parameters", async () => {
      const result = await module.getNFTFungibleTokens(validAddress);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/nft/fungible-tokens?contract=${validAddress}&skip=0&limit=10`),
        expect.any(Object)
      );
    });

    it("should handle custom pagination parameters", async () => {
      const skip = 20;
      const limit = 50;
      await module.getNFTFungibleTokens(validAddress, skip, limit);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/nft/fungible-tokens?contract=${validAddress}&skip=${skip}&limit=${limit}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid contract address", async () => {
      await expect(module.getNFTFungibleTokens(invalidAddress)).rejects.toThrow(
        "Invalid contract address"
      );
    });
  });

  describe("getNFTOwners", () => {
    const mockResponse: NFTOwnerResponse = {
      total: 1,
      list: [
        {
          address: validAddress,
          quantity: "1",
        },
      ],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockResponse }),
        } as Response)
      );
    });

    it("should fetch NFT owners with default parameters", async () => {
      const tokenId = "1";
      const result = await module.getNFTOwners(validAddress, tokenId);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/nft/owners?contract=${validAddress}&tokenId=${tokenId}&skip=0&limit=10`
        ),
        expect.any(Object)
      );
    });

    it("should handle custom pagination parameters", async () => {
      const tokenId = "1";
      const skip = 20;
      const limit = 50;
      await module.getNFTOwners(validAddress, tokenId, skip, limit);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/nft/owners?contract=${validAddress}&tokenId=${tokenId}&skip=${skip}&limit=${limit}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid contract address", async () => {
      await expect(module.getNFTOwners(invalidAddress, "1")).rejects.toThrow(
        "Invalid contract address"
      );
    });
  });
});
